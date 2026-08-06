import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiPhone,
  FiCalendar,
  FiArrowRight,
  FiArrowLeft,
} from 'react-icons/fi';
import { ROUTE_PATHS } from '@/routes/routePaths';
import KrishnaIllustration from './KrishnaIllustration';

export default function MobileRegister({
  register,
  handleSubmit,
  onSubmit,
  errors,
  isSubmitting,
  showPassword,
  setShowPassword,
  acceptTerms,
  setAcceptTerms,
  formValues = {},
  strength,
}) {
  const renderFloatingField = (name, label, IconComponent, type = 'text', options = null, extraProps = {}) => {
    const isPassword = name === 'password';
    const isSelect = type === 'select';
    const errorMsg = errors[name]?.message;

    return (
      <div key={name} className="space-y-1 w-full">
        <div className="relative h-[56px] w-full rounded-xl border border-slate-200 bg-slate-50/50 transition-all duration-200 focus-within:border-[#C99A3B] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#C99A3B]/20">
          
          {/* Left Icon */}
          <IconComponent className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 peer-focus:text-[#C99A3B]" />

          {/* Fixed Inset Top Label */}
          <label
            htmlFor={`mobile-reg-${name}`}
            className="pointer-events-none absolute left-10 top-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 peer-focus:text-[#C99A3B]"
          >
            {label}
          </label>

          {/* Input / Select */}
          {isSelect ? (
            <select
              id={`mobile-reg-${name}`}
              {...register(name)}
              {...extraProps}
              className="peer h-full w-full appearance-none bg-transparent pl-10 pr-8 pt-4 pb-1 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none"
            >
              {options?.map((o) => (
                <option key={o.value} value={o.value} className="bg-white text-slate-900 font-medium">
                  {o.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              id={`mobile-reg-${name}`}
              type={isPassword ? (showPassword ? 'text' : 'password') : type}
              aria-invalid={errorMsg ? 'true' : 'false'}
              {...register(name)}
              {...extraProps}
              className={`peer h-full w-full bg-transparent pl-10 ${
                isPassword ? 'pr-10' : 'pr-4'
              } pt-4 pb-1 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none`}
            />
          )}

          {/* Password Eye Toggle */}
          {isPassword && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center text-slate-400 hover:text-slate-700 active:scale-95"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
            </button>
          )}

          {/* Select Chevron Arrow */}
          {isSelect && (
            <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          )}
        </div>

        {/* Inline Error Helper */}
        {errorMsg && (
          <AnimatePresence>
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-[11px] font-medium text-rose-500 pl-1 pt-0.5"
            >
              • {errorMsg}
            </motion.p>
          </AnimatePresence>
        )}
      </div>
    );
  };

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
            <KrishnaIllustration className="w-[130px] h-[130px]" />
          </div>
        </motion.div>

        {/* ─── REGISTER CARD ─── */}
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="w-full rounded-2xl bg-white p-5 sm:p-6 shadow-[0_12px_40px_rgba(0,0,0,0.06)] border border-slate-100"
        >
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Create Account</h2>
            <p className="text-xs text-slate-500 mt-0.5">Join Krishana Poshak for exclusive access</p>
          </div>

          {/* Root Form Error */}
          {errors.root && (
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-600 font-medium">
              {errors.root.message}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3.5">
            
            {/* 1. FIRST NAME */}
            {renderFloatingField('firstName', 'First Name', FiUser, 'text', null, {
              autoFocus: true,
              autoComplete: 'given-name',
              enterKeyHint: 'next',
            })}

            {/* 2. LAST NAME */}
            {renderFloatingField('lastName', 'Last Name', FiUser, 'text', null, {
              autoComplete: 'family-name',
              enterKeyHint: 'next',
            })}

            {/* 3. EMAIL ADDRESS */}
            {renderFloatingField('email', 'Email Address', FiMail, 'email', null, {
              autoComplete: 'email',
              enterKeyHint: 'next',
            })}

            {/* 4. PHONE NUMBER */}
            {renderFloatingField('phoneNumber', 'Phone Number', FiPhone, 'tel', null, {
              autoComplete: 'tel',
              enterKeyHint: 'next',
            })}

            {/* 5. GENDER */}
            {renderFloatingField(
              'gender',
              'Gender',
              FiUser,
              'select',
              [
                { value: '', label: 'Select Gender' },
                { value: 'MALE', label: 'Male' },
                { value: 'FEMALE', label: 'Female' },
                { value: 'KIDS', label: 'Kids' },
                { value: 'UNISEX', label: 'Unisex' },
              ],
              {
                autoComplete: 'sex',
                enterKeyHint: 'next',
              }
            )}

            {/* 6. DATE OF BIRTH */}
            {renderFloatingField('dateOfBirth', 'Date of Birth', FiCalendar, 'date', null, {
              autoComplete: 'bday',
              enterKeyHint: 'next',
            })}

            {/* 7. PASSWORD */}
            {renderFloatingField('password', 'Password', FiLock, 'password', null, {
              autoComplete: 'new-password',
              enterKeyHint: 'go',
            })}

            {/* Password Strength Meter */}
            {formValues.password && strength && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="pt-0.5"
              >
                <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 mb-1">
                  <span>Password strength</span>
                  <span className="font-bold text-slate-700">{strength.label}</span>
                </div>
                <div className="flex gap-1.5 h-1.5 w-full">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-full flex-1 rounded-full transition-all duration-300 ${
                        strength.score >= level ? strength.color : 'bg-slate-100'
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* 8. ACCEPT TERMS CHECKBOX */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer group py-1">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-[#C99A3B] focus:ring-[#C99A3B]/30"
                />
                <span className="text-xs text-slate-600 leading-relaxed group-hover:text-slate-900 transition-colors">
                  I agree to the{' '}
                  <Link
                    to={ROUTE_PATHS.TERMS}
                    target="_blank"
                    className="font-bold text-[#C99A3B] underline underline-offset-2 hover:text-[#B3832B]"
                  >
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link
                    to={ROUTE_PATHS.PRIVACY}
                    target="_blank"
                    className="font-bold text-[#C99A3B] underline underline-offset-2 hover:text-[#B3832B]"
                  >
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>

            {/* 9. CREATE ACCOUNT BUTTON */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.985 }}
              className="h-[52px] w-full rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#C99A3B] to-[#B3832B] text-white font-bold text-sm shadow-md shadow-[#C99A3B]/25 flex items-center justify-center gap-2 transition-all disabled:opacity-75 disabled:cursor-not-allowed mt-2"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Creating Account...</span>
                </div>
              ) : (
                <>
                  <span>Create Account</span>
                  <FiArrowRight className="h-4 w-4" />
                </>
              )}
            </motion.button>
          </form>

        </motion.div>

        {/* ─── SIGN IN LINK ─── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-5 text-center"
        >
          <p className="text-xs text-slate-600">
            Already have an account?{' '}
            <Link
              to={ROUTE_PATHS.LOGIN}
              className="font-bold text-[#C99A3B] hover:text-[#B3832B] underline-offset-4 hover:underline py-1"
            >
              Sign In
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
