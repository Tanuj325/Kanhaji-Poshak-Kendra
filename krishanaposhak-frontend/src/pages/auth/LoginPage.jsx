import { useState, useCallback } from 'react';
import SEO from '@/components/common/SEO';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { loginSchema } from '@/validators/authSchemas';
import { getErrorMessage } from '@/utils/apiErrorParser';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { siteConfig } from '@/config/siteConfig';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = useCallback(
    async (data) => {
      if (isLoading) return;
      setIsLoading(true);
      try {
        const response = await login(data.email, data.password, rememberMe);
        toast.success(
          response?.firstName ? `Welcome back, ${response.firstName}!` : 'Login successful!'
        );
        const redirectParam = new URLSearchParams(location.search).get('redirect');
        const from = location.state?.from?.pathname;
        const role = response?.role;
        if (redirectParam) {
          navigate(redirectParam, { replace: true });
        } else if (from && from !== ROUTE_PATHS.LOGIN) {
          navigate(from, { replace: true });
        } else if (role === 'ADMIN') {
          navigate(ROUTE_PATHS.ADMIN, { replace: true });
        } else {
          navigate(ROUTE_PATHS.HOME, { replace: true });
        }
      } catch (err) {
        toast.error(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, login, rememberMe, location, navigate]
  );

  const inputBase =
    'w-full rounded-xl border bg-white/[0.04] pl-11 pr-4 py-3 text-sm text-white placeholder:text-slate-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-[#060E1A]';

  const canonicalUrl = `${siteConfig.url}/auth/login`;

  return (
    <>
      <SEO
        title="Sign In - Access Your Account"
        description="Sign in to your Krishana Poshak account to access your orders, wishlist, saved addresses, and profile."
        canonicalUrl={canonicalUrl}
        noindex
      />

      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8">
        {/* Header */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-7 text-center"
        >
          <h1 className="font-serif text-2xl font-bold tracking-wide text-white sm:text-3xl">
            Welcome Back
          </h1>
          <p className="mt-1.5 text-sm text-slate-400">
            Sign in to your account
          </p>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          {/* Email */}
          <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
            <label htmlFor="login-email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Email Address
            </label>
            <div className="relative">
              <FiMail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-400/60" />
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'login-email-error' : undefined}
                {...register('email')}
                className={`${inputBase} ${
                  errors.email
                    ? 'border-rose-500/60 focus:ring-rose-500'
                    : 'border-white/10 focus:border-amber-400/50 focus:ring-amber-400/30'
                }`}
                placeholder="you@example.com"
              />
            </div>
            {errors.email && (
              <p id="login-email-error" className="mt-1.5 text-xs text-rose-400" role="alert">
                {errors.email.message}
              </p>
            )}
          </motion.div>

          {/* Password */}
          <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible">
            <label htmlFor="login-password" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Password
            </label>
            <div className="relative">
              <FiLock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-400/60" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                aria-invalid={errors.password ? 'true' : 'false'}
                aria-describedby={errors.password ? 'login-password-error' : undefined}
                {...register('password')}
                className={`${inputBase} pr-11 ${
                  errors.password
                    ? 'border-rose-500/60 focus:ring-rose-500'
                    : 'border-white/10 focus:border-amber-400/50 focus:ring-amber-400/30'
                }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-white focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p id="login-password-error" className="mt-1.5 text-xs text-rose-400" role="alert">
                {errors.password.message}
              </p>
            )}
          </motion.div>

          {/* Remember + Forgot */}
          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex items-center justify-between"
          >
            <label className="group flex cursor-pointer items-center gap-2.5">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="h-[18px] w-[18px] rounded-md border border-white/20 bg-white/5 transition-all peer-checked:border-amber-400 peer-checked:bg-amber-400 peer-focus-visible:ring-2 peer-focus-visible:ring-amber-400/50 peer-focus-visible:ring-offset-1 peer-focus-visible:ring-offset-[#060E1A]" />
                <svg
                  className="pointer-events-none absolute left-[3px] top-[3px] h-3 w-3 text-[#060E1A] opacity-0 transition-opacity peer-checked:opacity-100"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 6l3 3 5-5" />
                </svg>
              </div>
              <span className="text-xs text-slate-400 transition-colors group-hover:text-white">
                Remember me
              </span>
            </label>
            <Link
              to={ROUTE_PATHS.FORGOT_PASSWORD}
              className="text-xs font-medium text-amber-400/80 transition-colors hover:text-amber-300"
            >
              Forgot password?
            </Link>
          </motion.div>

          {/* Submit */}
          <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible">
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 px-6 py-3.5 text-sm font-bold tracking-wide text-[#0B1728] shadow-lg shadow-amber-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/30 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </button>
          </motion.div>
        </form>

        {/* Divider */}
        <motion.div
          custom={5}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="relative my-7"
        >
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/[0.06]" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-[#0D1829] px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
              New here?
            </span>
          </div>
        </motion.div>

        {/* Register CTA */}
        <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible">
          <Link
            to={ROUTE_PATHS.REGISTER}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:border-amber-400/30 hover:bg-white/[0.06]"
          >
            Create an Account
            <FiArrowRight className="h-3.5 w-3.5 text-amber-400/60" />
          </Link>
        </motion.div>
      </div>
    </>
  );
}
