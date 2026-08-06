import { useState, useMemo, useCallback } from 'react';
import SEO from '@/components/common/SEO';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiPhone,
  FiArrowRight,
  FiCheck,
} from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { registerSchema } from '@/validators/authSchemas';
import { getErrorMessage } from '@/utils/apiErrorParser';
import { ROUTE_PATHS } from '@/routes/routePaths';
import MobileRegister from '@/components/auth/MobileRegister';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  }),
};

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

export default function RegisterPage() {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      gender: '',
      dateOfBirth: '',
    },
  });

  const formValues = watch();
  const passwordValue = formValues.password;
  const strength = useMemo(() => getPasswordStrength(passwordValue), [passwordValue]);

  const onSubmit = useCallback(
    async (data) => {
      if (isSubmitting) return;
      if (!acceptTerms) {
        toast.error('Please accept the Terms & Conditions');
        return;
      }
      setIsSubmitting(true);

      try {
        await registerUser(data);
        toast.success('Account created! Please check your email to verify your account.');
        navigate(ROUTE_PATHS.HOME, { replace: true });
      } catch (err) {
        const message = getErrorMessage(err, 'Registration failed. Please try again.');
        setError('root', { message });

        if (err?.response?.status === 409) {
          setError('email', {
            message: 'This email is already registered. Please sign in instead.',
          });
          toast.error('This email is already registered.');
        }

        const validationErrors =
          err?.validationErrors || err?.response?.data?.validationErrors;
        if (validationErrors) {
          Object.entries(validationErrors).forEach(([field, msg]) => {
            if (
              ['firstName', 'lastName', 'email', 'phoneNumber', 'password', 'gender', 'dateOfBirth'].includes(field)
            ) {
              setError(field, { message: msg });
            }
          });
        }

        if (!(err?.response?.status === 409)) {
          toast.error(message);
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting, acceptTerms, registerUser, navigate, setError]
  );

  const inputBase =
    'w-full rounded-xl border bg-white/[0.04] pl-11 pr-4 py-3 text-sm text-white placeholder:text-slate-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-[#060E1A]';
  const inputOk = 'border-white/10 focus:border-amber-400/50 focus:ring-amber-400/30';
  const inputErr = 'border-rose-500/60 focus:ring-rose-500';

  const renderField = (name, label, icon, type, placeholder, idx, opts = {}) => {
    const Icon = icon;
    const hasError = errors[name];
    return (
      <motion.div custom={idx} variants={fadeUp} initial="hidden" animate="visible" className={opts.className}>
        <label htmlFor={`reg-${name}`} className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </label>
        <div className="relative">
          <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-400/60" />
          {type === 'select' ? (
            <select
              id={`reg-${name}`}
              {...register(name)}
              className={`${inputBase} appearance-none ${hasError ? inputErr : inputOk}`}
            >
              {opts.options?.map((o) => (
                <option key={o.value} value={o.value} className="bg-[#0B1728] text-white">
                  {o.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              id={`reg-${name}`}
              type={name === 'password' ? (showPassword ? 'text' : 'password') : type}
              autoComplete={opts.autoComplete}
              aria-invalid={hasError ? 'true' : 'false'}
              aria-describedby={hasError ? `reg-${name}-error` : undefined}
              {...register(name)}
              className={`${inputBase} ${name === 'password' ? 'pr-11' : ''} ${hasError ? inputErr : inputOk}`}
              placeholder={placeholder}
            />
          )}
          {name === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-white focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
            </button>
          )}
        </div>
        {hasError && (
          <p id={`reg-${name}-error`} className="mt-1.5 text-xs text-rose-400" role="alert">
            {hasError.message}
          </p>
        )}
      </motion.div>
    );
  };

  return (
    <>
      <SEO
        title="Create Account - Register for Krishana Poshak"
        description="Join Krishana Poshak and discover premium handcrafted traditional Krishna attire, exclusive offers, and fast order checkout."
        noindex
      />

      {isDesktop ? (
        /* ─── DESKTOP VIEW (>=1024px - 100% UNCHANGED) ─── */
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8">
          {/* Header */}
          <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="mb-6 text-center">
            <h1 className="font-serif text-2xl font-bold tracking-wide text-white sm:text-3xl">
              Create Account
            </h1>
            <p className="mt-1.5 text-sm text-slate-400">Join the Krishana Poshak family</p>
          </motion.div>

          {/* Root error */}
          {errors.root && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-4 overflow-hidden rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-300"
              role="alert"
            >
              {errors.root.message}
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            {/* Name row */}
            <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
              {renderField('firstName', 'First Name', FiUser, 'text', 'Rahul', 1, {
                autoComplete: 'given-name',
              })}
              {renderField('lastName', 'Last Name', FiUser, 'text', 'Sharma', 2, {
                autoComplete: 'family-name',
              })}
            </div>

            {renderField('email', 'Email Address', FiMail, 'email', 'rahul@example.com', 3, {
              autoComplete: 'email',
            })}

            {renderField('phoneNumber', 'Phone Number', FiPhone, 'tel', '9876543210', 4, {
              autoComplete: 'tel',
            })}

            {/* Password + Strength */}
            {renderField('password', 'Password', FiLock, 'password', 'Min. 8 characters', 5, {
              autoComplete: 'new-password',
            })}

            {/* Strength Indicator */}
            {passwordValue && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="overflow-hidden"
              >
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
                      strength.score <= 1
                        ? 'text-rose-400'
                        : strength.score === 2
                        ? 'text-orange-400'
                        : strength.score === 3
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {strength.label}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Gender & DOB row */}
            <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
              {renderField('gender', 'Gender', FiUser, 'select', '', 6, {
                options: [
                  { value: '', label: 'Select' },
                  { value: 'MALE', label: 'Male' },
                  { value: 'FEMALE', label: 'Female' },
                  { value: 'KIDS', label: 'Kids' },
                  { value: 'UNISEX', label: 'Unisex' },
                ],
              })}
              <motion.div custom={7} variants={fadeUp} initial="hidden" animate="visible">
                <label htmlFor="reg-dateOfBirth" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Date of Birth
                </label>
                <div className="relative">
                  <FiUser className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-400/60" />
                  <input
                    id="reg-dateOfBirth"
                    type="date"
                    {...register('dateOfBirth')}
                    className={`${inputBase} ${errors.dateOfBirth ? inputErr : inputOk}`}
                  />
                </div>
                {errors.dateOfBirth && (
                  <p className="mt-1.5 text-xs text-rose-400" role="alert">
                    {errors.dateOfBirth.message}
                  </p>
                )}
              </motion.div>
            </div>

            {/* Terms */}
            <motion.div custom={8} variants={fadeUp} initial="hidden" animate="visible">
              <label className="group flex cursor-pointer items-start gap-2.5">
                <div className="relative mt-0.5 shrink-0">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="h-[18px] w-[18px] rounded-md border border-white/20 bg-white/5 transition-all peer-checked:border-amber-400 peer-checked:bg-amber-400 peer-focus-visible:ring-2 peer-focus-visible:ring-amber-400/50" />
                  <FiCheck className="pointer-events-none absolute left-[3px] top-[3px] h-3 w-3 text-[#060E1A] opacity-0 transition-opacity peer-checked:opacity-100" />
                </div>
                <span className="text-xs leading-relaxed text-slate-400">
                  I agree to the{' '}
                  <Link to={ROUTE_PATHS.TERMS} className="text-amber-400/80 underline underline-offset-2 hover:text-amber-300">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to={ROUTE_PATHS.PRIVACY} className="text-amber-400/80 underline underline-offset-2 hover:text-amber-300">
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </motion.div>

            {/* Submit */}
            <motion.div custom={9} variants={fadeUp} initial="hidden" animate="visible">
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
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </button>
            </motion.div>
          </form>

          {/* Login Link */}
          <motion.p custom={10} variants={fadeUp} initial="hidden" animate="visible" className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to={ROUTE_PATHS.LOGIN} className="font-semibold text-amber-400/80 transition-colors hover:text-amber-300">
              Sign in
            </Link>
          </motion.p>
        </div>
      ) : (
        /* ─── MOBILE & TABLET VIEW (<1024px) ─── */
        <MobileRegister
          register={register}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          errors={errors}
          isSubmitting={isSubmitting}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          acceptTerms={acceptTerms}
          setAcceptTerms={setAcceptTerms}
          formValues={formValues}
          strength={strength}
        />
      )}
    </>
  );
}
