import { useState, useEffect, useMemo, useCallback } from 'react';
import SEO from '@/components/common/SEO';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiLock, FiEye, FiEyeOff, FiArrowLeft, FiShield, FiAlertTriangle } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { getErrorMessage } from '@/utils/apiErrorParser';
import { ROUTE_PATHS } from '@/routes/routePaths';

const resetPasswordFormSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

function getPasswordStrength(password) {
  if (!password) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
  if (score === 2) return { score: 2, label: 'Fair', color: 'bg-orange-500' };
  if (score === 3) return { score: 3, label: 'Good', color: 'bg-amber-400' };
  if (score >= 4) return { score: 4, label: 'Strong', color: 'bg-emerald-500' };
  return { score: 0, label: '', color: '' };
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tokenError, setTokenError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setTokenError(true);
      toast.error('Invalid reset link. No token found.');
    }
  }, [token]);

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const passwordValue = watch('password');
  const strength = useMemo(() => getPasswordStrength(passwordValue), [passwordValue]);

  const onSubmit = useCallback(
    async (data) => {
      if (isSubmitting || !token) return;
      setIsSubmitting(true);

      try {
        await resetPassword(token, data.password);
        toast.success('Password reset successfully! Please sign in with your new password.');
        navigate(ROUTE_PATHS.LOGIN, { replace: true });
      } catch (err) {
        const message = getErrorMessage(err, 'Failed to reset password.');
        setError('root', { message });

        if (err?.response?.status === 400) {
          const errMsg = err?.response?.data?.message || message;
          if (errMsg?.toLowerCase().includes('expired')) {
            setError('root', { message: 'This reset link has expired. Please request a new one.' });
          } else if (errMsg?.toLowerCase().includes('invalid')) {
            setError('root', { message: 'This reset link is invalid. Please request a new one.' });
          }
        }
        toast.error(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting, token, resetPassword, navigate, setError]
  );

  const inputBase =
    'w-full rounded-xl border bg-white/[0.04] pl-11 pr-11 py-3 text-sm text-white placeholder:text-slate-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-[#060E1A]';

  // Invalid / missing token
  if (tokenError) {
    return (
      <>
        <SEO
          title="Reset Password - Krishana Poshak"
          description="Set a new secure password for your Krishana Poshak account."
          noindex
        />
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8">
          <div className="text-center">
            <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center">
              <motion.div
                className="absolute inset-0 rounded-full bg-rose-500/10"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-rose-500/30 bg-rose-500/10">
                <FiAlertTriangle className="h-7 w-7 text-rose-400" />
              </div>
            </div>
            <h1 className="font-serif text-xl font-bold text-white">Invalid Reset Link</h1>
            <p className="mx-auto mt-2 max-w-xs text-sm text-slate-400">
              This password reset link is invalid or missing. Please request a new one.
            </p>
            <div className="mt-6">
              <Link
                to={ROUTE_PATHS.FORGOT_PASSWORD}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 px-6 py-3 text-sm font-bold text-[#0B1728] shadow-lg shadow-amber-500/25 transition-all hover:shadow-xl active:scale-[0.98]"
              >
                Request New Reset Link
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title="Reset Password"
        description="Set a new secure password for your Krishana Poshak account and regain access to your orders, wishlist, and profile."
        noindex
      />

      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8">
        {/* Header */}
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/5">
            <FiShield className="h-6 w-6 text-amber-400" />
          </div>
          <h1 className="font-serif text-2xl font-bold tracking-wide text-white">
            Reset Password
          </h1>
          <p className="mt-1.5 text-sm text-slate-400">Enter your new password below</p>
        </motion.div>

        {/* Root error */}
        {errors.root && (
          <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-300" role="alert">
            {errors.root.message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          {/* New Password */}
          <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
            <label htmlFor="reset-password" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              New Password
            </label>
            <div className="relative">
              <FiLock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-400/60" />
              <input
                id="reset-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                aria-invalid={errors.password ? 'true' : 'false'}
                aria-describedby={errors.password ? 'reset-password-error' : undefined}
                {...register('password')}
                className={`${inputBase} ${
                  errors.password
                    ? 'border-rose-500/60 focus:ring-rose-500'
                    : 'border-white/10 focus:border-amber-400/50 focus:ring-amber-400/30'
                }`}
                placeholder="Min. 8 characters"
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
              <p id="reset-password-error" className="mt-1.5 text-xs text-rose-400" role="alert">
                {errors.password.message}
              </p>
            )}
          </motion.div>

          {/* Strength Indicator */}
          {passwordValue && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden">
              <div className="flex items-center gap-2">
                <div className="flex flex-1 gap-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        strength.score >= level ? strength.color : 'bg-white/10'
                      }`}
                    />
                  ))}
                </div>
                <span
                  className={`text-[10px] font-bold ${
                    strength.score <= 1 ? 'text-rose-400' : strength.score === 2 ? 'text-orange-400' : strength.score === 3 ? 'text-amber-400' : 'text-emerald-400'
                  }`}
                >
                  {strength.label}
                </span>
              </div>
            </motion.div>
          )}

          {/* Confirm Password */}
          <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible">
            <label htmlFor="reset-confirmPassword" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Confirm Password
            </label>
            <div className="relative">
              <FiLock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-400/60" />
              <input
                id="reset-confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                autoComplete="new-password"
                aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                aria-describedby={errors.confirmPassword ? 'reset-confirm-error' : undefined}
                {...register('confirmPassword')}
                className={`${inputBase} ${
                  errors.confirmPassword
                    ? 'border-rose-500/60 focus:ring-rose-500'
                    : 'border-white/10 focus:border-amber-400/50 focus:ring-amber-400/30'
                }`}
                placeholder="Re-enter your new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-white focus:outline-none"
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showConfirm ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p id="reset-confirm-error" className="mt-1.5 text-xs text-rose-400" role="alert">
                {errors.confirmPassword.message}
              </p>
            )}
          </motion.div>

          {/* Submit */}
          <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 px-6 py-3.5 text-sm font-bold tracking-wide text-[#0B1728] shadow-lg shadow-amber-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/30 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Resetting...</span>
                </>
              ) : (
                <span>Reset Password</span>
              )}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </button>
          </motion.div>
        </form>

        <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible" className="mt-6 text-center">
          <Link
            to={ROUTE_PATHS.LOGIN}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-400/80 transition-colors hover:text-amber-300"
          >
            <FiArrowLeft className="h-3.5 w-3.5" />
            Back to Sign In
          </Link>
        </motion.div>
      </div>
    </>
  );
}
