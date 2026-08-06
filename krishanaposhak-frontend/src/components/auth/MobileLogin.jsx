import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { ROUTE_PATHS } from '@/routes/routePaths';
import KrishnaIllustration from './KrishnaIllustration';

export default function MobileLogin({
  register,
  handleSubmit,
  onSubmit,
  errors,
  isLoading,
  rememberMe,
  setRememberMe,
  showPassword,
  setShowPassword,
}) {
  return (
    <div className="min-h-[100dvh] w-full bg-gradient-to-b from-[#FAF8F5] via-[#F6F2EA] to-[#EEE8DC] px-4 py-5 flex flex-col justify-between items-center font-sans antialiased text-slate-800 pt-safe pb-safe selection:bg-[#C99A3B]/20">
      
      {/* ─── TOP NAVIGATION HEADER ─── */}
      <div className="w-full max-w-[390px] mx-auto flex items-center justify-between py-1">
        <Link
          to={ROUTE_PATHS.HOME}
          className="inline-flex items-center gap-1.5 min-h-[40px] px-3 py-1 rounded-full border border-amber-900/10 bg-white/80 text-xs font-semibold text-slate-700 backdrop-blur-md transition-all hover:bg-white active:scale-95 shadow-sm"
        >
          <FiArrowLeft className="h-3.5 w-3.5 text-[#C99A3B]" />
          <span>Back to Store</span>
        </Link>
        <div className="flex items-center gap-1.5 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-600 animate-pulse" />
          <span className="text-[10px] font-bold tracking-wider text-amber-900 uppercase">
            Official Store
          </span>
        </div>
      </div>

      <div className="w-full max-w-[390px] mx-auto flex flex-col items-center my-auto py-3">
        
        {/* ─── BRAND HEADER & ARTWORK ─── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center mb-4"
        >
          {/* Logo Badge */}
          <div className="flex items-center gap-2 mb-1">
            <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-[#F5E4B5] via-[#D4AF37] to-[#8B6508] p-[1.5px] shadow-sm">
              <div className="h-full w-full bg-[#0A1628] rounded-[10px] flex items-center justify-center font-serif text-xs font-bold text-[#F5E4B5]">
                K
              </div>
            </div>
            <h1 className="font-serif text-2xl font-bold tracking-tight text-slate-900">
              Kanhaji Poshak
            </h1>
          </div>

          <p className="text-[10px] font-bold tracking-[0.2em] text-amber-800/80 uppercase">
            Handcrafted Divine Collections
          </p>

          {/* Krishna Accessories Illustration */}
          <div className="my-1">
            <KrishnaIllustration className="w-[140px] h-[140px]" />
          </div>
        </motion.div>

        {/* ─── LOGIN CARD ─── */}
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="w-full rounded-2xl bg-white p-5 sm:p-6 shadow-[0_12px_40px_rgba(0,0,0,0.06)] border border-slate-100"
        >
          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Welcome Back</h2>
            <p className="text-xs text-slate-500 mt-0.5">Sign in to access your orders and wishlist</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            
            {/* EMAIL FIELD */}
            <div className="space-y-1">
              <div className="relative h-[56px] w-full rounded-xl border border-slate-200 bg-slate-50/50 transition-all duration-200 focus-within:border-[#C99A3B] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#C99A3B]/20">
                <input
                  id="mobile-login-email"
                  type="email"
                  autoFocus
                  autoComplete="email"
                  enterKeyHint="next"
                  aria-invalid={errors.email ? 'true' : 'false'}
                  {...register('email')}
                  className="peer h-full w-full bg-transparent pl-10 pr-4 pt-4 pb-1 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none"
                />

                <FiMail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 peer-focus:text-[#C99A3B]" />

                <label
                  htmlFor="mobile-login-email"
                  className="pointer-events-none absolute left-10 top-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 peer-focus:text-[#C99A3B]"
                >
                  Email Address
                </label>
              </div>

              {errors.email && (
                <AnimatePresence>
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-[11px] font-medium text-rose-500 pl-1 pt-0.5"
                  >
                    • {errors.email.message}
                  </motion.p>
                </AnimatePresence>
              )}
            </div>

            {/* PASSWORD FIELD */}
            <div className="space-y-1">
              <div className="relative h-[56px] w-full rounded-xl border border-slate-200 bg-slate-50/50 transition-all duration-200 focus-within:border-[#C99A3B] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#C99A3B]/20">
                <input
                  id="mobile-login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  enterKeyHint="go"
                  aria-invalid={errors.password ? 'true' : 'false'}
                  {...register('password')}
                  className="peer h-full w-full bg-transparent pl-10 pr-10 pt-4 pb-1 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none"
                />

                <FiLock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 peer-focus:text-[#C99A3B]" />

                <label
                  htmlFor="mobile-login-password"
                  className="pointer-events-none absolute left-10 top-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 peer-focus:text-[#C99A3B]"
                >
                  Password
                </label>

                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center text-slate-400 hover:text-slate-700 active:scale-95"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                </button>
              </div>

              {errors.password && (
                <AnimatePresence>
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-[11px] font-medium text-rose-500 pl-1 pt-0.5"
                  >
                    • {errors.password.message}
                  </motion.p>
                </AnimatePresence>
              )}
            </div>

            {/* REMEMBER ME + FORGOT PASSWORD */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer py-1">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-[#C99A3B] focus:ring-[#C99A3B]/30"
                />
                <span className="text-xs font-medium text-slate-600">
                  Remember me
                </span>
              </label>

              <Link
                to={ROUTE_PATHS.FORGOT_PASSWORD}
                className="text-xs font-bold text-[#C99A3B] hover:text-[#B3832B] py-1"
              >
                Forgot password?
              </Link>
            </div>

            {/* SIGN IN BUTTON */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.985 }}
              className="h-[52px] w-full rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#C99A3B] to-[#B3832B] text-white font-bold text-sm shadow-md shadow-[#C99A3B]/25 flex items-center justify-center gap-2 transition-all disabled:opacity-75 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Signing In...</span>
                </div>
              ) : (
                <>
                  <span>Sign In</span>
                  <FiArrowRight className="h-4 w-4" />
                </>
              )}
            </motion.button>
          </form>

        </motion.div>

        {/* ─── REGISTER LINK ─── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-5 text-center"
        >
          <p className="text-xs text-slate-600">
            Don&apos;t have an account?{' '}
            <Link
              to={ROUTE_PATHS.REGISTER}
              className="font-bold text-[#C99A3B] hover:text-[#B3832B] underline-offset-4 hover:underline py-1"
            >
              Create Account
            </Link>
          </p>
        </motion.div>

      </div>

      {/* Footer copyright */}
      <div className="w-full text-center py-1">
        <p className="text-[10px] font-medium text-slate-400">
          &copy; {new Date().getFullYear()} Kanhaji Poshak. All rights reserved.
        </p>
      </div>
    </div>
  );
}
