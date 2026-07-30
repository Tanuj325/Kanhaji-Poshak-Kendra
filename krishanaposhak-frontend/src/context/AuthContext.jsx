import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { authService, userService } from '@/services';
import { tokenService } from '@/services/tokenService';
import { decodeJwt, isTokenExpired } from '@/utils/jwtDecoder';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const bootstrapDone = useRef(false);
  const refreshPromise = useRef(null);
  const logoutInProgress = useRef(false);
  const loginInProgress = useRef(false);
  const abortControllerRef = useRef(null);

  // ─── Set auth state from login/register/refresh response ───
  const setAuthState = useCallback(
    (authData, rememberMe = false) => {
      if (!authData) {
        tokenService.clearTokens();
        setUser(null);
        setIsAuthenticated(false);
        return;
      }

      const { accessToken, refreshToken, userId, firstName, lastName, email, role } =
        authData;

      tokenService.setAccessToken(accessToken);
      if (refreshToken) {
        tokenService.setRefreshToken(refreshToken, rememberMe);
      }

      setUser((prev) => ({
        ...prev,
        id: userId ?? prev?.id ?? null,
        firstName: firstName ?? prev?.firstName ?? '',
        lastName: lastName ?? prev?.lastName ?? '',
        email: email ?? prev?.email ?? '',
        role: role ?? prev?.role ?? '',
        emailVerified: prev?.emailVerified ?? false,
        profileImageUrl: prev?.profileImageUrl ?? null,
      }));

      setIsAuthenticated(true);
    },
    [],
  );

  // ─── Fetch full user profile from /api/users/me ───
  const fetchProfile = useCallback(async () => {
    try {
      const profile = await userService.getProfile();
      if (profile) {
        setUser((prev) => ({
          ...prev,
          id: profile.id ?? prev?.id,
          firstName: profile.firstName ?? prev?.firstName,
          lastName: profile.lastName ?? prev?.lastName,
          email: profile.email ?? prev?.email,
          phoneNumber: profile.phoneNumber ?? '',
          role: profile.role ?? prev?.role,
          emailVerified: profile.emailVerified ?? false,
          profileImageUrl: profile.profileImageUrl ?? null,
          gender: profile.gender ?? '',
          dateOfBirth: profile.dateOfBirth ?? '',
        }));
        setIsAuthenticated(true);
      }
      return profile;
    } catch {
      // Profile fetch failed — tokens might be invalid
      tokenService.clearTokens();
      setUser(null);
      setIsAuthenticated(false);
      return null;
    }
  }, []);

  // ─── Refresh access token ───
  const refreshToken = useCallback(async () => {
    const currentRefreshToken = tokenService.getRefreshToken();
    if (!currentRefreshToken) {
      tokenService.clearTokens();
      setUser(null);
      setIsAuthenticated(false);
      return null;
    }

    // Check if refresh token itself is expired
    if (isTokenExpired(currentRefreshToken)) {
      tokenService.clearTokens();
      setUser(null);
      setIsAuthenticated(false);
      return null;
    }

    // Deduplicate concurrent refresh calls
    if (refreshPromise.current) {
      return refreshPromise.current;
    }

    refreshPromise.current = authService
      .refreshToken(currentRefreshToken)
      .then((res) => {
        const data = res?.data ?? res;
        tokenService.setAccessToken(data.accessToken);
        if (data.refreshToken) {
          tokenService.setRefreshToken(data.refreshToken, tokenService.isRememberMe());
        }
        return data;
      })
      .catch(() => {
        tokenService.clearTokens();
        setUser(null);
        setIsAuthenticated(false);
        return null;
      })
      .finally(() => {
        refreshPromise.current = null;
      });

    return refreshPromise.current;
  }, []);

  // ─── Bootstrap on app mount ───
  const bootstrap = useCallback(async () => {
    if (bootstrapDone.current) return;
    setIsLoading(true);

    try {
      const accessToken = tokenService.getAccessToken();
      const storedRefreshToken = tokenService.getRefreshToken();

      if (!accessToken && !storedRefreshToken) {
        // No tokens at all — not authenticated
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
        bootstrapDone.current = true;
        return;
      }

      if (accessToken && !isTokenExpired(accessToken)) {
        // Access token is still valid — try to fetch profile
        const profile = await fetchProfile();
        if (profile) {
          setIsLoading(false);
          bootstrapDone.current = true;
          return;
        }
        // Profile fetch failed — fall through to refresh
      }

      // Try to refresh tokens
      const refreshResult = await refreshToken();
      if (!refreshResult) {
        // Refresh failed — not authenticated
        setIsLoading(false);
        bootstrapDone.current = true;
        return;
      }

      // Tokens refreshed — fetch profile
      await fetchProfile();
    } catch {
      tokenService.clearTokens();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
      bootstrapDone.current = true;
    }
  }, [refreshToken, fetchProfile]);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  // ─── Listen for auth:expired events from axios ───
  useEffect(() => {
    const handleAuthExpired = () => {
      if (!logoutInProgress.current) {
        logoutInProgress.current = true;
        tokenService.clearTokens();
        setUser(null);
        setIsAuthenticated(false);
        bootstrapDone.current = false;
        queryClient.clear();
        logoutInProgress.current = false;
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('auth:expired', handleAuthExpired);
      return () => window.removeEventListener('auth:expired', handleAuthExpired);
    }
  }, [queryClient]);

  // ─── Login ───
  const login = useCallback(
    async (email, password, rememberMe = false) => {
      if (loginInProgress.current) {
        throw new Error('Login already in progress');
      }
      loginInProgress.current = true;

      try {
        const res = await authService.login(email, password);
        const data = res?.data ?? res;

        setAuthState(data, rememberMe);
        bootstrapDone.current = false;

        // Fetch full profile after login
        await fetchProfile();
        return data;
      } finally {
        loginInProgress.current = false;
      }
    },
    [setAuthState, fetchProfile],
  );

  // ─── Register ───
  const register = useCallback(
    async (formData) => {
      const res = await authService.register(formData);
      const data = res?.data ?? res;

      setAuthState(data, false);
      bootstrapDone.current = false;

      // Fetch full profile after register
      await fetchProfile();
      return data;
    },
    [setAuthState, fetchProfile],
  );

  // ─── Logout ───
  const logout = useCallback(async () => {
    if (logoutInProgress.current) return;
    logoutInProgress.current = true;

    // Cancel any pending requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const userId = user?.id;

    // Fire-and-forget logout API call (best effort)
    if (userId) {
      try {
        await authService.logout(userId);
      } catch {
        // Silently ignore — token clearing is the priority
      }
    }

    // Clear React Query cache
    queryClient.clear();

    // Clear auth state
    tokenService.clearTokens();
    setUser(null);
    setIsAuthenticated(false);
    bootstrapDone.current = false;
    logoutInProgress.current = false;
  }, [user?.id, queryClient]);

  // ─── Verify Email ───
  const verifyEmail = useCallback(async (token) => {
    const res = await authService.verifyEmail(token);
    // Update user emailVerified status
    setUser((prev) => {
      if (!prev) return prev;
      return { ...prev, emailVerified: true };
    });
    return res;
  }, []);

  // ─── Forgot Password ───
  const forgotPassword = useCallback(async (email) => {
    await authService.forgotPassword(email);
  }, []);

  // ─── Reset Password ───
  const resetPassword = useCallback(async (token, password) => {
    const res = await authService.resetPassword(token, password);
    return res;
  }, []);

  // ─── Memoized context value ───
  const role = user?.role ?? null;

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      role,
      login,
      register,
      logout,
      verifyEmail,
      forgotPassword,
      resetPassword,
      refreshToken,
      bootstrap,
      setAuthState,
      fetchProfile,
    }),
    [
      user,
      isAuthenticated,
      isLoading,
      role,
      login,
      register,
      logout,
      verifyEmail,
      forgotPassword,
      resetPassword,
      refreshToken,
      bootstrap,
      setAuthState,
      fetchProfile,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}

export default AuthContext;
