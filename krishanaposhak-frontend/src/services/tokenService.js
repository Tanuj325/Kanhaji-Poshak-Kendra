const REFRESH_TOKEN_KEY = 'kp_refresh_token';
const REMEMBER_ME_KEY = 'kp_remember_me';

let accessToken = null;

export const tokenService = {
  getAccessToken() {
    return accessToken;
  },

  setAccessToken(token) {
    accessToken = token;
  },

  getRefreshToken() {
    try {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  setRefreshToken(token, rememberMe = false) {
    try {
      if (rememberMe) {
        localStorage.setItem(REFRESH_TOKEN_KEY, token);
        localStorage.setItem(REMEMBER_ME_KEY, 'true');
      } else {
        localStorage.setItem(REFRESH_TOKEN_KEY, token);
        localStorage.removeItem(REMEMBER_ME_KEY);
      }
    } catch {
      // localStorage unavailable (private browsing, etc.)
    }
  },

  isRememberMe() {
    try {
      return localStorage.getItem(REMEMBER_ME_KEY) === 'true';
    } catch {
      return false;
    }
  },

  clearTokens() {
    accessToken = null;
    try {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(REMEMBER_ME_KEY);
    } catch {
      // localStorage unavailable
    }
  },
};

