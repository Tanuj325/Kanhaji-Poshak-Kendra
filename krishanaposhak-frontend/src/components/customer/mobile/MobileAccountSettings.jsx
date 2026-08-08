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
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiLogOut,
  FiCheckCircle,
  FiBell,
  FiCamera,
  FiStar,
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

// ----------------------------------------------------
// Compact Floating Label Input Component (46px height)
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
          'relative w-full h-[46px] sm:h-[48px] rounded-xl border transition-all duration-200 font-display overflow-hidden flex items-center shadow-2xs',
          disabled || readOnly
            ? 'bg-stone-50/90 border-amber-900/10 cursor-not-allowed text-stone-600'
            : error
            ? 'border-rose-400 ring-2 ring-rose-500/10 bg-white'
            : isFocused
            ? 'border-amber-700 ring-2 ring-amber-700/20 bg-amber-50/10 bg-white'
            : 'border-amber-900/20 hover:border-amber-700/40 bg-white',
        )}
      >
        <label
          htmlFor={id}
          className={cn(
            'absolute left-3.5 transition-all duration-200 pointer-events-none origin-left font-body select-none truncate max-w-[85%]',
            isFloated
              ? 'top-1 text-[9px] font-extrabold uppercase tracking-wider text-amber-900'
              : 'top-1/2 -translate-y-1/2 text-xs font-semibold text-stone-400',
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
            'w-full h-full bg-transparent px-3.5 font-display text-xs sm:text-sm font-bold outline-none transition-all',
            disabled || readOnly ? 'text-stone-600 cursor-not-allowed' : 'text-amber-950',
            isFloated ? 'pt-3.5 pb-0.5' : 'py-2',
          )}
        />
      </div>
      {helperText && !error && (
        <p className="text-[10px] font-medium text-stone-500 mt-1 px-1">{helperText}</p>
      )}
      {error && <p className="text-[10px] font-bold text-rose-600 mt-1 px-1 break-words">{error}</p>}
    </div>
  );
}

// ----------------------------------------------------
// Realistic Skeleton Loading State
// ----------------------------------------------------
function MobileAccountSettingsSkeleton() {
  return (
    <div className="space-y-4 animate-pulse font-display">
      <div className="rounded-[20px] p-5 bg-white border border-amber-900/10 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-amber-900/10" />
          <div className="space-y-2 flex-1">
            <div className="h-4 w-36 bg-amber-900/10 rounded-md" />
            <div className="h-3 w-48 bg-amber-900/10 rounded-md" />
          </div>
        </div>
      </div>
      <div className="rounded-[20px] p-5 bg-white border border-amber-900/10 space-y-3">
        <div className="h-4 w-40 bg-amber-900/10 rounded-md" />
        <div className="space-y-2.5">
          <div className="h-11 w-full bg-amber-900/10 rounded-xl" />
          <div className="h-11 w-full bg-amber-900/10 rounded-xl" />
          <div className="h-11 w-full bg-amber-900/10 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// Main Mobile & Tablet Account Settings Screen
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
    <div className="fixed inset-0 z-[60] bg-[#FAF7F2] font-display flex flex-col justify-between overflow-y-auto lg:hidden">
      {/* ---------------------------------------------------- */}
      {/* STICKY TOP HEADER (58px height) */}
      {/* ---------------------------------------------------- */}
      <header className="sticky top-0 z-30 w-full h-[58px] min-h-[58px] bg-white/95 backdrop-blur-md border-b border-amber-900/10 px-4 md:px-6 flex items-center justify-between shadow-2xs">
        <button
          type="button"
          onClick={onBack || (() => window.history.back())}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-amber-50/80 text-amber-950 hover:bg-amber-100 transition-colors border border-amber-900/10 active:scale-95 min-h-[36px] min-w-[36px]"
          aria-label="Go back"
        >
          <FiChevronLeft className="w-5 h-5 text-amber-900" />
        </button>

        <div className="text-center min-w-0 px-2">
          <h1 className="font-heading text-base sm:text-lg font-extrabold text-amber-950 truncate leading-tight">
            Account Settings
          </h1>
          <p className="text-[11px] font-bold text-amber-800 tracking-tight">
            Profile & Security Preferences
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsLogoutModalOpen(true)}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors border border-rose-200/60 active:scale-95 min-h-[36px] min-w-[36px]"
          title="Sign Out"
        >
          <FiLogOut className="w-4 h-4 text-rose-600" />
        </button>
      </header>

      {/* ---------------------------------------------------- */}
      {/* MAIN CONTENT CONTAINER */}
      {/* ---------------------------------------------------- */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 md:px-6 py-4 md:py-6 space-y-5 md:space-y-6 pb-20">
        {isLoading ? (
          <MobileAccountSettingsSkeleton />
        ) : (
          <>
            {/* PROFILE HERO SUMMARY CARD */}
            <div className="w-full rounded-[20px] p-4.5 sm:p-5 bg-gradient-to-b from-white via-[#FCFBF8] to-[#FAF6F0] border border-amber-900/12 shadow-2xs relative overflow-hidden font-display">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-700 via-[#D4AF37] to-amber-800" />

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pt-1">
                <div className="relative group shrink-0">
                  <div className="p-0.5 bg-gradient-to-br from-amber-200 via-[#D4AF37] to-amber-800 rounded-full shadow-md flex items-center justify-center">
                    <Avatar
                      src={previewUrl}
                      name={`${userData?.firstName || ''} ${userData?.lastName || ''}`}
                      size="xl"
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-white"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-amber-950/75 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs cursor-pointer"
                    aria-label="Upload profile image"
                  >
                    <FiCamera className="h-4 w-4 mb-0.5 text-amber-200" />
                    <span className="text-[8px] font-extrabold uppercase tracking-wider">Change</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarFileChange}
                  />
                </div>

                <div className="flex-1 text-center sm:text-left space-y-1 min-w-0 w-full overflow-hidden">
                  <div className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-amber-100 bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 px-2.5 py-0.5 rounded-full border border-amber-400/30 shadow-2xs">
                    <FiStar className="h-2.5 w-2.5 fill-amber-300 text-amber-300 shrink-0" /> Kanhaji Poshak Devotee
                  </div>

                  <h2 className="font-heading font-black text-base sm:text-lg text-amber-950 truncate tracking-tight">
                    {userData?.firstName} {userData?.lastName}
                  </h2>

                  {userData?.email && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-xl bg-amber-50/80 border border-amber-900/10 text-[11px] font-bold font-mono text-amber-950 shadow-2xs max-w-full truncate">
                      <FiMail className="h-3 w-3 text-amber-800 shrink-0" />
                      <span className="truncate">{userData.email}</span>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-0.5">
                    <Badge variant="success" size="sm" className="font-extrabold flex items-center gap-1 text-[9px] py-0.5 px-2">
                      <FiCheckCircle className="h-2.5 w-2.5" /> Account Active
                    </Badge>
                    <Badge variant="warning" size="sm" className="font-extrabold text-[9px] py-0.5 px-2 border border-amber-400/40">
                      <FiShield className="h-2.5 w-2.5 mr-1 inline" /> {userData?.role || 'CUSTOMER'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* ==================================================== */}
            {/* MODULE 1: PERSONAL DETAILS */}
            {/* ==================================================== */}
            <section className="rounded-[20px] p-4.5 sm:p-5 bg-gradient-to-b from-white via-[#FCFBF8] to-[#FAF6F0] border border-amber-900/12 shadow-2xs font-display space-y-4">
              {/* Section Header */}
              <div className="flex items-center gap-3 pb-3 border-b border-amber-900/10">
                <div className="w-8 h-8 rounded-xl bg-amber-100/90 border border-amber-300/50 text-amber-900 flex items-center justify-center shrink-0 shadow-2xs">
                  <FiUser className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-heading font-black text-base text-amber-950 truncate leading-tight">
                    Personal Details
                  </h3>
                  <p className="text-[11px] font-semibold text-stone-500 truncate leading-tight mt-0.5">
                    Manage your personal information and contact details
                  </p>
                </div>
              </div>

              {/* Form Layout: 1-Column on Mobile (<768px), 2-Column on Tablet (768-1023px) */}
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
                  <div className="relative w-full h-[46px] sm:h-[48px] rounded-xl border border-amber-900/20 bg-white overflow-hidden flex items-center shadow-2xs font-display">
                    <label
                      htmlFor="sett-gender"
                      className="absolute left-3.5 top-1 text-[9px] font-extrabold uppercase tracking-wider text-amber-900 pointer-events-none"
                    >
                      Gender
                    </label>
                    <select
                      id="sett-gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full h-full bg-transparent px-3.5 pt-3.5 pb-0.5 text-xs sm:text-sm font-bold text-amber-950 outline-none cursor-pointer"
                    >
                      {GENDER_OPTIONS.map((g) => (
                        <option key={g.value} value={g.value}>
                          {g.label}
                        </option>
                      ))}
                    </select>
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
                    className="w-full sm:w-auto h-[46px] px-6 rounded-xl bg-gradient-to-r from-amber-800 via-amber-900 to-amber-950 hover:from-amber-900 hover:to-stone-950 text-white font-extrabold text-xs shadow-md border border-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50 transition-all active:scale-95 min-h-[44px]"
                  >
                    <FiSave className="w-4 h-4 text-amber-200" />
                    <span>{isSubmitting ? 'Saving Changes...' : 'Save Changes'}</span>
                  </button>
                </div>
              </form>
            </section>

            {/* ==================================================== */}
            {/* MODULE 2: SECURITY */}
            {/* ==================================================== */}
            <section className="rounded-[20px] p-4.5 sm:p-5 bg-gradient-to-b from-white via-[#FCFBF8] to-[#FAF6F0] border border-amber-900/12 shadow-2xs font-display space-y-4">
              {/* Section Header */}
              <div className="flex items-center gap-3 pb-3 border-b border-amber-900/10">
                <div className="w-8 h-8 rounded-xl bg-amber-100/90 border border-amber-300/50 text-amber-900 flex items-center justify-center shrink-0 shadow-2xs">
                  <FiLock className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-heading font-black text-base text-amber-950 truncate leading-tight">
                    Security
                  </h3>
                  <p className="text-[11px] font-semibold text-stone-500 truncate leading-tight mt-0.5">
                    Protect your account and credentials
                  </p>
                </div>
              </div>

              {/* Grouped Security Controls */}
              <div className="rounded-xl bg-white border border-amber-900/12 divide-y divide-amber-900/10 overflow-hidden shadow-2xs">
                {/* 1. Email Verification Row */}
                <div className="p-3.5 sm:p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className={cn(
                      'w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-2xs',
                      userData?.emailVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    )}>
                      {userData?.emailVerified ? (
                        <FiCheckCircle className="w-4.5 h-4.5 text-emerald-600" />
                      ) : (
                        <FiAlertCircle className="w-4.5 h-4.5 text-amber-600" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-extrabold text-amber-950 leading-tight">
                        {userData?.emailVerified ? 'Email Address Verified' : 'Email Address Unverified'}
                      </p>
                      <p className="text-[11px] font-mono text-stone-500 truncate max-w-full leading-tight mt-0.5">
                        {userData?.email}
                      </p>
                    </div>
                  </div>

                  {userData?.emailVerified ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-extrabold uppercase border border-emerald-200 shrink-0">
                      Verified
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendVerification}
                      disabled={isResendingVerification}
                      className="h-[36px] px-3.5 rounded-xl bg-amber-900 hover:bg-amber-950 text-white font-extrabold text-xs shadow-2xs border border-amber-500/20 transition-all shrink-0 min-h-[36px]"
                    >
                      {isResendingVerification ? 'Sending...' : 'Verify Email'}
                    </button>
                  )}
                </div>

                {/* 2. Password Reset Row */}
                <div className="p-3.5 sm:p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-xl bg-amber-100/80 text-amber-900 flex items-center justify-center shrink-0 shadow-2xs">
                      <FiKey className="w-4.5 h-4.5 text-amber-800" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-extrabold text-amber-950 leading-tight">Password Security</p>
                      <p className="text-[11px] text-stone-500 leading-tight mt-0.5">
                        Send a password reset link to your registered email address
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handlePasswordReset}
                    disabled={isResettingPassword}
                    className="h-[38px] px-3.5 rounded-xl bg-white hover:bg-amber-50 text-amber-950 font-extrabold text-xs border border-amber-900/20 shadow-2xs transition-all active:scale-95 shrink-0 min-h-[36px]"
                  >
                    {isResettingPassword ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </div>
              </div>
            </section>

            {/* ==================================================== */}
            {/* MODULE 3: NOTIFICATIONS */}
            {/* ==================================================== */}
            <section className="rounded-[20px] p-4.5 sm:p-5 bg-gradient-to-b from-white via-[#FCFBF8] to-[#FAF6F0] border border-amber-900/12 shadow-2xs font-display space-y-4">
              {/* Section Header */}
              <div className="flex items-center gap-3 pb-3 border-b border-amber-900/10">
                <div className="w-8 h-8 rounded-xl bg-amber-100/90 border border-amber-300/50 text-amber-900 flex items-center justify-center shrink-0 shadow-2xs">
                  <FiBell className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-heading font-black text-base text-amber-950 truncate leading-tight">
                    Notifications
                  </h3>
                  <p className="text-[11px] font-semibold text-stone-500 truncate leading-tight mt-0.5">
                    Choose how you want to receive updates
                  </p>
                </div>
              </div>

              {/* Grouped Notification Setting Rows (Toggle anchored RIGHT) */}
              <div className="rounded-xl bg-white border border-amber-900/12 divide-y divide-amber-900/10 overflow-hidden shadow-2xs">
                <div className="p-3.5 sm:p-4 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-extrabold text-amber-950 leading-tight">
                      Order & Delivery Alerts
                    </p>
                    <p className="text-[11px] text-stone-500 leading-tight mt-0.5">
                      Receive dispatch tracking updates and order confirmations
                    </p>
                  </div>
                  <Switch
                    size="sm"
                    checked={Boolean(emailNotifs)}
                    onChange={(e) => setEmailNotifs(e.target.checked)}
                  />
                </div>

                <div className="p-3.5 sm:p-4 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-extrabold text-amber-950 leading-tight">
                      Promotional & Festive Offers
                    </p>
                    <p className="text-[11px] text-stone-500 leading-tight mt-0.5">
                      Early access to coupons and festival attire collections
                    </p>
                  </div>
                  <Switch
                    size="sm"
                    checked={Boolean(promoNotifs)}
                    onChange={(e) => setPromoNotifs(e.target.checked)}
                  />
                </div>
              </div>
            </section>

            {/* ==================================================== */}
            {/* MODULE 4: SESSION CONTROL */}
            {/* ==================================================== */}
            <section className="rounded-[20px] p-4.5 sm:p-5 bg-gradient-to-b from-white via-[#FFF9F9] to-[#FFF2F2] border border-rose-200/80 shadow-2xs font-display space-y-4">
              {/* Section Header */}
              <div className="flex items-center gap-3 pb-3 border-b border-rose-200/60">
                <div className="w-8 h-8 rounded-xl bg-rose-100/90 text-rose-700 border border-rose-200/60 flex items-center justify-center shrink-0 shadow-2xs">
                  <FiShield className="w-4.5 h-4.5 text-rose-700" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-heading font-black text-base text-rose-950 truncate leading-tight">
                    Session Control
                  </h3>
                  <p className="text-[11px] font-semibold text-stone-500 truncate leading-tight mt-0.5">
                    Manage where your account is currently signed in
                  </p>
                </div>
              </div>

              {/* Current Session Display & Action */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-rose-200/60 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0 shadow-2xs">
                    <FiCheckCircle className="w-4.5 h-4.5 text-emerald-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs sm:text-sm font-extrabold text-stone-900 leading-tight">
                        This Device (Web Browser)
                      </p>
                      <span className="inline-flex items-center gap-1 text-[9px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active Now
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 leading-tight mt-0.5">
                      Current active customer session on this browser
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="h-[42px] px-5 rounded-xl bg-gradient-to-r from-rose-600 via-rose-700 to-rose-800 hover:from-rose-700 hover:to-rose-900 text-white font-extrabold text-xs shadow-md border border-rose-400/20 flex items-center justify-center gap-1.5 transition-all active:scale-95 shrink-0 self-start sm:self-auto min-h-[40px]"
                >
                  <FiLogOut className="w-4 h-4" />
                  <span>Sign Out Session</span>
                </button>
              </div>
            </section>
          </>
        )}
      </main>

      {/* ---------------------------------------------------- */}
      {/* SIGN OUT CONFIRMATION MODAL (z-[80] ABOVE OVERLAY) */}
      {/* ---------------------------------------------------- */}
      <AnimatePresence>
        {isLogoutModalOpen && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center bg-stone-950/60 backdrop-blur-xs p-4 font-display">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm bg-white rounded-[24px] shadow-2xl p-6 space-y-4 border border-amber-900/10"
            >
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
                <FiLogOut className="w-6 h-6" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="font-heading font-extrabold text-base text-amber-950">
                  Sign Out Confirmation
                </h3>
                <p className="text-xs text-stone-600 font-body leading-relaxed">
                  Are you sure you want to sign out of your account on this device?
                </p>
              </div>
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsLogoutModalOpen(false)}
                  className="flex-1 h-[42px] rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleLogoutConfirm}
                  className="flex-1 h-[42px] rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md transition-all active:scale-95"
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
