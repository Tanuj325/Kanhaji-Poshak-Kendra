import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Switch from '@/components/forms/Switch';
import toast from 'react-hot-toast';
import { authService } from '@/services';
import { getErrorMessage } from '@/utils/apiErrorParser';
import {
  FiChevronLeft,
  FiChevronDown,
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiLogOut,
  FiCheckCircle,
  FiBell,
  FiCamera,
  FiShield,
  FiAlertCircle,
  FiSave,
  FiKey,
} from 'react-icons/fi';

const GENDER_OPTIONS = [
  { value: '', label: 'Select Gender' },
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' },
];

// A single, consistent card elevation used everywhere — no mixed shadow sizes.
const CARD = 'rounded-[20px] bg-white border border-amber-900/10 shadow-[0_1px_2px_rgba(41,30,10,0.04),0_6px_20px_rgba(41,30,10,0.05)]';

// ----------------------------------------------------
// Floating Label Input — quieter weight, one accent color
// ----------------------------------------------------
function FloatingInput({
  id,
  name,
  label,
  value,
  onChange,
  type = 'text',
  inputMode,
  autoComplete,
  required = false,
  readOnly = false,
  disabled = false,
  error,
  helperText,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value !== undefined && value !== null && String(value).trim().length > 0;
  const isFloated = isFocused || hasValue || type === 'date';

  return (
    <div className="relative w-full font-display min-w-0">
      <div
        className={cn(
          'relative w-full h-[50px] rounded-[14px] border transition-colors duration-150 flex items-center',
          disabled || readOnly
            ? 'bg-stone-50 border-stone-200 cursor-not-allowed'
            : error
              ? 'border-rose-300 bg-white'
              : isFocused
                ? 'border-amber-700 bg-white'
                : 'border-stone-200 hover:border-amber-700/40 bg-white',
        )}
      >
        <label
          htmlFor={id}
          className={cn(
            'absolute left-3.5 transition-all duration-150 pointer-events-none origin-left font-body select-none truncate max-w-[85%]',
            isFloated
              ? 'top-1.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800'
              : 'top-1/2 -translate-y-1/2 text-[13px] font-medium text-stone-400',
          )}
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        <input
          id={id}
          name={name}
          type={type}
          inputMode={inputMode}
          autoComplete={autoComplete}
          value={value || ''}
          onChange={onChange}
          onFocus={() => !readOnly && !disabled && setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          readOnly={readOnly}
          disabled={disabled}
          required={required}
          className={cn(
            'w-full h-full bg-transparent px-3.5 font-display text-[13px] font-semibold outline-none transition-all',
            disabled || readOnly ? 'text-stone-500 cursor-not-allowed' : 'text-stone-900',
            isFloated ? 'pt-4 pb-1' : 'py-2.5',
          )}
        />
      </div>
      {helperText && !error && (
        <p className="text-[11px] font-medium text-stone-400 mt-1 px-1">{helperText}</p>
      )}
      {error && <p className="text-[11px] font-semibold text-rose-600 mt-1 px-1 break-words">{error}</p>}
    </div>
  );
}

// ----------------------------------------------------
// Section header — small tinted icon, no gradient box
// ----------------------------------------------------
function SectionHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-3 pb-4 mb-4 border-b border-stone-100">
      <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <h3 className="font-heading font-semibold text-[15px] text-stone-900 truncate tracking-tight">
          {title}
        </h3>
        {subtitle && (
          <p className="text-[12px] text-stone-400 truncate mt-0.5">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// Settings row — hairline-divided list item, no boxed backgrounds.
// Keeps things compact and quiet; the control on the right does the talking.
// ----------------------------------------------------
function SettingsRow({ icon: Icon, iconTone = 'amber', title, subtitle, children, last = false }) {
  const tones = {
    amber: 'text-amber-700',
    emerald: 'text-emerald-700',
  };
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 py-3',
        !last && 'border-b border-stone-100',
      )}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {Icon && <Icon className={cn('w-[15px] h-[15px] shrink-0', tones[iconTone])} />}
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold text-stone-900 leading-tight truncate">
            {title}
          </p>
          {subtitle && (
            <p className="text-[11px] text-stone-400 leading-normal mt-0.5 truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

// ----------------------------------------------------
// Skeleton
// ----------------------------------------------------
function MobileAccountSettingsSkeleton() {
  return (
    <div className="space-y-4 animate-pulse font-display">
      <div className={cn(CARD, 'p-5 space-y-4')}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-stone-100" />
          <div className="space-y-2 flex-1">
            <div className="h-4 w-36 bg-stone-100 rounded-md" />
            <div className="h-3 w-48 bg-stone-100 rounded-md" />
          </div>
        </div>
      </div>
      <div className={cn(CARD, 'p-5 space-y-3')}>
        <div className="h-4 w-40 bg-stone-100 rounded-md" />
        <div className="space-y-2.5">
          <div className="h-12 w-full bg-stone-100 rounded-[14px]" />
          <div className="h-12 w-full bg-stone-100 rounded-[14px]" />
          <div className="h-12 w-full bg-stone-100 rounded-[14px]" />
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// Main
// ----------------------------------------------------
export default function MobileAccountSettings({
  user,
  profile,
  isLoading = false,
  refetch,
  updateProfile,
  logout,
  onBack,
}) {
  const userData = profile || user;
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    gender: '',
    dateOfBirth: '',
  });

  const [errors, setErrors] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isResendingVerification, setIsResendingVerification] = useState(false);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [promoNotifs, setPromoNotifs] = useState(true);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    if (userData) {
      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phoneNumber: userData.phoneNumber || '',
        gender: userData.gender || '',
        dateOfBirth: userData.dateOfBirth ? String(userData.dateOfBirth).split('T')[0] : '',
      });
      if (userData.profileImageUrl) {
        setPreviewUrl(userData.profileImageUrl);
      }
    }
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleAvatarFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !userData?.id) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));

    const payload = new FormData();
    payload.append('file', file);
    try {
      await updateProfile.mutateAsync({ userId: userData.id, formData: payload });
      toast.success('Profile picture updated!');
      refetch?.();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const targetUserId = userData?.id;
    if (!targetUserId) {
      toast.error('User account ID not found');
      return;
    }

    const payload = new FormData();
    if (formData.firstName) payload.append('firstName', formData.firstName.trim());
    if (formData.lastName) payload.append('lastName', formData.lastName.trim());
    if (formData.phoneNumber) payload.append('phoneNumber', formData.phoneNumber.trim());
    if (formData.gender) payload.append('gender', formData.gender);
    if (formData.dateOfBirth) payload.append('dateOfBirth', formData.dateOfBirth);
    if (selectedFile) payload.append('file', selectedFile);

    setIsSubmitting(true);
    try {
      await updateProfile.mutateAsync({ userId: targetUserId, formData: payload });
      toast.success('Profile updated successfully!');
      setSelectedFile(null);
      refetch?.();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!userData?.email) return;
    setIsResettingPassword(true);
    try {
      await authService.forgotPassword(userData.email);
      toast.success('Password reset link sent to your registered email!');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleResendVerification = async () => {
    if (!userData?.email) return;
    setIsResendingVerification(true);
    try {
      await authService.resendVerification(userData.email);
      toast.success('Verification email sent to your inbox!');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsResendingVerification(false);
    }
  };

  const handleLogoutConfirm = async () => {
    try {
      await logout?.();
      toast.success('Signed out successfully');
      setIsLogoutModalOpen(false);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-[#FAF8F4] font-display flex flex-col justify-between overflow-y-auto lg:hidden">
      {/* STICKY HEADER */}
      <header className="sticky top-0 z-30 w-full h-[56px] min-h-[56px] bg-white/95 backdrop-blur-md border-b border-stone-100 px-4 md:px-6 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack || (() => window.history.back())}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-stone-50 text-stone-700 hover:bg-stone-100 transition-colors border border-stone-100 active:scale-95"
          aria-label="Go back"
        >
          <FiChevronLeft className="w-[18px] h-[18px]" />
        </button>

        <div className="text-center min-w-0 px-2">
          <h1 className="font-heading text-[15px] font-semibold text-stone-900 truncate leading-tight">
            Account Settings
          </h1>
          <p className="text-[11px] font-medium text-stone-400 tracking-tight">
            Profile & security preferences
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsLogoutModalOpen(true)}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors border border-rose-100 active:scale-95"
          title="Sign Out"
        >
          <FiLogOut className="w-4 h-4" />
        </button>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 md:px-6 py-5 md:py-6 space-y-4 pb-24">
        {isLoading ? (
          <MobileAccountSettingsSkeleton />
        ) : (
          <>
            {/* PROFILE HERO — the one card allowed a touch of gold */}
            <div className={cn(CARD, 'p-5 sm:p-6 relative overflow-hidden')}>
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-600 via-[#D4AF37] to-amber-600" />

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pt-1">
                <div className="relative group shrink-0">
                  <Avatar
                    src={previewUrl}
                    name={`${userData?.firstName || ''} ${userData?.lastName || ''}`}
                    size="xl"
                    className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full border-2 border-amber-100"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-amber-900 text-white flex items-center justify-center border-2 border-white shadow-sm"
                    aria-label="Upload profile image"
                  >
                    <FiCamera className="h-3 w-3" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarFileChange}
                  />
                </div>

                <div className="flex-1 text-center sm:text-left space-y-1.5 min-w-0 w-full overflow-hidden">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-700">
                    Kanhaji Poshak
                  </p>

                  <h2 className="font-heading font-semibold text-lg text-stone-900 truncate tracking-tight">
                    {userData?.firstName} {userData?.lastName}
                  </h2>

                  {userData?.email && (
                    <div className="inline-flex items-center gap-1.5 text-[12px] font-medium text-stone-500 max-w-full truncate">
                      <FiMail className="h-3 w-3 text-stone-400 shrink-0" />
                      <span className="truncate">{userData.email}</span>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-100">
                      <FiCheckCircle className="h-3 w-3" /> Active
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-[10px] font-semibold border border-amber-100">
                      <FiShield className="h-3 w-3" /> {userData?.role || 'CUSTOMER'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* PERSONAL DETAILS */}
            <section className={cn(CARD, 'p-5 sm:p-6')}>
              <SectionHeader
                icon={FiUser}
                title="Personal Details"
                subtitle="Your information and contact details"
              />

              <form onSubmit={handleFormSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <FloatingInput
                    id="sett-firstName"
                    name="firstName"
                    label="First Name"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                  <FloatingInput
                    id="sett-lastName"
                    name="lastName"
                    label="Last Name"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <FloatingInput
                    id="sett-email"
                    name="email"
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    readOnly
                    disabled
                    helperText="Email is linked to your login account"
                  />
                  <FloatingInput
                    id="sett-phoneNumber"
                    name="phoneNumber"
                    label="Mobile Phone Number"
                    type="tel"
                    inputMode="numeric"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div className="relative w-full h-[50px] rounded-[14px] border border-stone-200 bg-white flex items-center hover:border-amber-700/40 transition-colors">
                    <label
                      htmlFor="sett-gender"
                      className="absolute left-3.5 top-1.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800 pointer-events-none z-10"
                    >
                      Gender
                    </label>
                    <select
                      id="sett-gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className={cn(
                        'w-full h-full bg-transparent pl-3.5 pr-9 pt-4 pb-1 text-[13px] font-semibold outline-none cursor-pointer appearance-none',
                        formData.gender ? 'text-stone-900' : 'text-stone-400 font-medium',
                      )}
                    >
                      {GENDER_OPTIONS.map((g) => (
                        <option key={g.value} value={g.value} disabled={g.value === ''} className="text-stone-900 font-medium">
                          {g.label}
                        </option>
                      ))}
                    </select>
                    <FiChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                  </div>

                  <FloatingInput
                    id="sett-dateOfBirth"
                    name="dateOfBirth"
                    label="Date of Birth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto h-[46px] px-7 rounded-full bg-stone-900 hover:bg-amber-950 text-white font-heading font-semibold text-[13px] tracking-wide shadow-sm active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <FiSave className="w-4 h-4" />
                    <span>{isSubmitting ? 'Saving…' : 'Save Changes'}</span>
                  </button>
                </div>
              </form>
            </section>

            {/* SECURITY */}
            <section className={cn(CARD, 'p-5 sm:p-6')}>
              <SectionHeader
                icon={FiLock}
                title="Security"
                subtitle="Protect your account and credentials"
              />

              <div>
                <SettingsRow
                  icon={userData?.emailVerified ? FiCheckCircle : FiAlertCircle}
                  iconTone={userData?.emailVerified ? 'emerald' : 'amber'}
                  title={userData?.emailVerified ? 'Email Verified' : 'Email Unverified'}
                  subtitle={userData?.email}
                >
                  {userData?.emailVerified ? (
                    <span className="text-[11px] font-semibold text-emerald-700">Verified</span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendVerification}
                      disabled={isResendingVerification}
                      className="text-[12px] font-semibold text-amber-800 hover:text-amber-950 transition-colors disabled:opacity-50"
                    >
                      {isResendingVerification ? 'Sending…' : 'Verify email'}
                    </button>
                  )}
                </SettingsRow>

                <SettingsRow
                  icon={FiKey}
                  title="Password"
                  subtitle="Send a reset link to your email"
                  last
                >
                  <button
                    type="button"
                    onClick={handlePasswordReset}
                    disabled={isResettingPassword}
                    className="text-[12px] font-semibold text-amber-800 hover:text-amber-950 transition-colors disabled:opacity-50"
                  >
                    {isResettingPassword ? 'Sending…' : 'Reset password'}
                  </button>
                </SettingsRow>
              </div>
            </section>

            {/* NOTIFICATIONS */}
            <section className={cn(CARD, 'p-5 sm:p-6')}>
              <SectionHeader
                icon={FiBell}
                title="Notifications"
                subtitle="Choose how you want to receive updates"
              />

              <div>
                <SettingsRow
                  icon={FiBell}
                  title="Order & Delivery Alerts"
                  subtitle="Dispatch tracking and order confirmations"
                >
                  <Switch
                    size="sm"
                    checked={Boolean(emailNotifs)}
                    onChange={(e) => setEmailNotifs(e.target.checked)}
                  />
                </SettingsRow>

                <SettingsRow
                  icon={FiBell}
                  title="Promotional & Festive Offers"
                  subtitle="Early access to coupons and new collections"
                  last
                >
                  <Switch
                    size="sm"
                    checked={Boolean(promoNotifs)}
                    onChange={(e) => setPromoNotifs(e.target.checked)}
                  />
                </SettingsRow>
              </div>
            </section>

            {/* SESSION CONTROL */}
            <section className={cn(CARD, 'p-5 sm:p-6')}>
              <SectionHeader
                icon={FiShield}
                title="Session Control"
                subtitle="Manage where your account is signed in"
              />

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="relative shrink-0">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
                      <FiCheckCircle className="w-4 h-4" />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold text-stone-900 leading-tight">
                      This Device
                    </p>
                    <p className="text-[11px] text-stone-400 leading-normal mt-0.5">
                      Active now · this browser
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="text-[12px] font-semibold text-rose-600 hover:text-rose-700 transition-colors shrink-0"
                >
                  Sign out
                </button>
              </div>
            </section>
          </>
        )}
      </main>

      {/* SIGN OUT MODAL */}
      <AnimatePresence>
        {isLogoutModalOpen && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center bg-stone-950/50 backdrop-blur-xs p-4 font-display">
            <motion.div
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.97, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="w-full max-w-sm bg-white rounded-[20px] shadow-xl p-6 space-y-4 border border-stone-100"
            >
              <div className="w-11 h-11 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <FiLogOut className="w-5 h-5" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="font-heading font-semibold text-[15px] text-stone-900">
                  Sign Out
                </h3>
                <p className="text-[13px] text-stone-500 font-body leading-relaxed">
                  Are you sure you want to sign out of your account on this device?
                </p>
              </div>
              <div className="flex items-center justify-end gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setIsLogoutModalOpen(false)}
                  className="flex-1 h-[42px] rounded-full border border-stone-200 text-[13px] font-semibold text-stone-600 hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleLogoutConfirm}
                  className="flex-1 h-[42px] rounded-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-[13px] transition-all active:scale-95"
                >
                  Sign Out
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}