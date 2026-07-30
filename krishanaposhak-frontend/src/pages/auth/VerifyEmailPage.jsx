import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import SEO from '@/components/common/SEO';
import { FiCheckCircle, FiAlertTriangle, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services';
import { getErrorMessage } from '@/utils/apiErrorParser';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { siteConfig } from '@/config/siteConfig';

export default function VerifyEmailPage() {
  const { verifyEmail, user } = useAuth();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
  const [message, setMessage] = useState('');
  const [isResending, setIsResending] = useState(false);

  const token = searchParams.get('token');

  const performVerification = useCallback(async () => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token found. Please check your email link.');
      return;
    }

    setStatus('verifying');

    try {
      await verifyEmail(token);
      setStatus('success');
      setMessage('Your email has been verified successfully!');
      toast.success('Email verified successfully!');
    } catch (err) {
      setStatus('error');
      const errMsg = getErrorMessage(err, 'Verification failed.');

      if (errMsg?.toLowerCase().includes('expired')) {
        setMessage('This verification link has expired. Request a new one below.');
      } else if (errMsg?.toLowerCase().includes('already verified')) {
        setMessage('Your email is already verified. You can close this page.');
        setStatus('success');
      } else if (errMsg?.toLowerCase().includes('invalid')) {
        setMessage('This verification link is invalid. Please check your email or request a new one.');
      } else {
        setMessage(errMsg || 'Failed to verify email. Please try again.');
      }

      if (status !== 'success') {
        toast.error(errMsg || 'Email verification failed.');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, verifyEmail]);

  useEffect(() => {
    performVerification();
  }, [performVerification]);

  const handleResend = async () => {
    if (isResending) return;
    const email = user?.email;
    if (!email) {
      toast.error('Please sign in to resend the verification email.');
      return;
    }
    setIsResending(true);
    try {
      await authService.resendVerification(email);
      toast.success('If your email is registered, a new verification link has been sent.');
    } catch {
      toast.error('Failed to resend verification email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <>
      <SEO
        title="Verify Email"
        description="Verify your email address for your Krishana Poshak account to start shopping handcrafted divine poshak and devotional attire."
        noindex
      />

      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8">
        <div className="text-center">
          {/* ─── Verifying State ─── */}
          {status === 'verifying' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-4"
            >
              <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-amber-400/30 border-t-amber-400"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div
                  className="absolute inset-2 rounded-full border-2 border-blue-400/20 border-b-blue-400"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
                />
                <div className="relative h-10 w-10 rounded-full bg-amber-400/10" />
              </div>
              <h1 className="font-serif text-xl font-bold text-white">
                Verifying Your Email
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                Please wait while we verify your email address...
              </p>
            </motion.div>
          )}

          {/* ─── Success State ─── */}
          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="py-4"
            >
              <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center">
                <motion.div
                  className="absolute inset-0 rounded-full bg-emerald-500/10"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.3, 1] }}
                  transition={{ duration: 0.6 }}
                />
                <motion.div
                  className="relative flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 15 }}
                >
                  <FiCheckCircle className="h-8 w-8 text-emerald-400" />
                </motion.div>
              </div>

              <h1 className="font-serif text-xl font-bold text-white">Email Verified!</h1>
              <p className="mx-auto mt-2 max-w-xs text-sm text-slate-400">{message}</p>

              {user?.email && (
                <p className="mt-3 text-xs text-slate-500">
                  Verified: <span className="font-medium text-amber-400/70">{user.email}</span>
                </p>
              )}

              <div className="mt-7 space-y-3">
                <Link
                  to={ROUTE_PATHS.SHOP}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 px-6 py-3 text-sm font-bold text-[#0B1728] shadow-lg shadow-amber-500/25 transition-all hover:shadow-xl active:scale-[0.98]"
                >
                  <FiShoppingBag className="h-4 w-4" />
                  Start Shopping
                </Link>
                <div>
                  <Link
                    to={ROUTE_PATHS.HOME}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-400/80 transition-colors hover:text-amber-300"
                  >
                    <FiArrowLeft className="h-3.5 w-3.5" />
                    Go to Home
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── Error State ─── */}
          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="py-4"
            >
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

              <h1 className="font-serif text-xl font-bold text-white">Verification Failed</h1>
              <p className="mx-auto mt-2 max-w-xs text-sm text-slate-400">{message}</p>

              <div className="mt-7 space-y-3">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isResending}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 px-6 py-3 text-sm font-bold text-[#0B1728] shadow-lg shadow-amber-500/25 transition-all hover:shadow-xl active:scale-[0.98] disabled:opacity-50"
                >
                  {isResending ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span>Sending...</span>
                    </>
                  ) : (
                    'Resend Verification Email'
                  )}
                </button>
                <Link
                  to={ROUTE_PATHS.HOME}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-400/80 transition-colors hover:text-amber-300"
                >
                  <FiArrowLeft className="h-3.5 w-3.5" />
                  Go back to home
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
