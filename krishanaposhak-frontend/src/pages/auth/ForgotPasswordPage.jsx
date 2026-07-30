import { useState, useCallback } from 'react';
import SEO from '@/components/common/SEO';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiMail, FiArrowLeft, FiSend, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { forgotPasswordSchema } from '@/validators/authSchemas';
import { ROUTE_PATHS } from '@/routes/routePaths';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = useCallback(
    async (data) => {
      if (isSubmitting) return;
      setIsSubmitting(true);

      try {
        await forgotPassword(data.email);
        setSubmittedEmail(data.email);
        setIsSuccess(true);
        toast.success('If an account with that email exists, a password reset link has been sent.');
      } catch (err) {
        const status = err?.response?.status;
        if (status === 429) {
          const message =
            err?.response?.data?.message ||
            'Too many requests. Please wait a moment before trying again.';
          setError('root', { message });
          toast.error(message);
        } else {
          // Backend always returns 200 to prevent email enumeration
          setSubmittedEmail(data.email);
          setIsSuccess(true);
          toast.success('If an account with that email exists, a password reset link has been sent.');
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting, forgotPassword, setError]
  );

  const inputBase =
    'w-full rounded-xl border bg-white/[0.04] pl-11 pr-4 py-3 text-sm text-white placeholder:text-slate-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-[#060E1A]';

  return (
    <>
      <SEO
        title="Forgot Password - Reset Account Access"
        description="Reset your Krishana Poshak account password securely with your email address."
        noindex
      />

      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8">
        <AnimatePresence mode="wait">
          {isSuccess ? (
            /* ─── Success State ─── */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              {/* Animated checkmark */}
              <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center">
                <motion.div
                  className="absolute inset-0 rounded-full bg-emerald-500/10"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10">
                  <FiCheckCircle className="h-8 w-8 text-emerald-400" />
                </div>
              </div>

              <h2 className="font-serif text-xl font-bold text-white">Check Your Email</h2>
              <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-slate-400">
                We&apos;ve sent a password reset link to{' '}
                <span className="font-semibold text-amber-400">{submittedEmail}</span>. Please check
                your inbox and follow the instructions.
              </p>

              <div className="mt-7 space-y-3">
                <button
                  type="button"
                  onClick={() => setIsSuccess(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white transition-all hover:border-amber-400/30 hover:bg-white/[0.06]"
                >
                  <FiSend className="h-3.5 w-3.5 text-amber-400/60" />
                  Resend Email
                </button>
                <Link
                  to={ROUTE_PATHS.LOGIN}
                  className="flex items-center justify-center gap-1.5 text-sm font-medium text-amber-400/80 transition-colors hover:text-amber-300"
                >
                  <FiArrowLeft className="h-3.5 w-3.5" />
                  Back to Sign In
                </Link>
              </div>
            </motion.div>
          ) : (
            /* ─── Form State ─── */
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              {/* Header */}
              <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="mb-7 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/5">
                  <FiMail className="h-6 w-6 text-amber-400" />
                </div>
                <h1 className="font-serif text-2xl font-bold tracking-wide text-white">
                  Forgot Password?
                </h1>
                <p className="mt-1.5 text-sm text-slate-400">
                  Enter your email and we&apos;ll send you a reset link
                </p>
              </motion.div>

              {/* Root error */}
              {errors.root && (
                <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-300" role="alert">
                  {errors.root.message}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
                  <label htmlFor="forgot-email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Email Address
                  </label>
                  <div className="relative">
                    <FiMail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-400/60" />
                    <input
                      id="forgot-email"
                      type="email"
                      autoComplete="email"
                      aria-invalid={errors.email ? 'true' : 'false'}
                      aria-describedby={errors.email ? 'forgot-email-error' : undefined}
                      {...register('email')}
                      className={`${inputBase} ${
                        errors.email
                          ? 'border-rose-500/60 focus:ring-rose-500'
                          : 'border-white/10 focus:border-amber-400/50 focus:ring-amber-400/30'
                      }`}
                      placeholder="your@email.com"
                    />
                  </div>
                  {errors.email && (
                    <p id="forgot-email-error" className="mt-1.5 text-xs text-rose-400" role="alert">
                      {errors.email.message}
                    </p>
                  )}
                </motion.div>

                <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible">
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
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <FiSend className="h-4 w-4" />
                        <span>Send Reset Link</span>
                      </>
                    )}
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  </button>
                </motion.div>
              </form>

              <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible" className="mt-6 text-center">
                <Link
                  to={ROUTE_PATHS.LOGIN}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-400/80 transition-colors hover:text-amber-300"
                >
                  <FiArrowLeft className="h-3.5 w-3.5" />
                  Back to Sign In
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
