import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Switch from '@/components/forms/Switch';
import ConfirmDialog from '@/components/overlay/ConfirmDialog';
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
  FiCalendar,
  FiAlertCircle,
  FiCheck,
  FiSave,
} from 'react-icons/fi';

const GENDER_OPTIONS = [
  { value: '', label: 'Select Gender' },
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' },
];

// ----------------------------------------------------
// Floating Label Input Component (50px height)
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
          'relative w-full h-[50px] rounded-[14px] border transition-all duration-200 font-display overflow-hidden flex items-center',
          disabled || readOnly
            ? 'bg-stone-100/80 border-amber-900/10 cursor-not-allowed'
            : error
            ? 'border-rose-400 ring-2 ring-rose-500/10 bg-white'
            : isFocused
            ? 'border-amber-700 ring-2 ring-amber-700/20 bg-amber-50/10'
            : 'border-amber-900/20 hover:border-amber-700/40 bg-white',
        )}
      >
        <label
          htmlFor={id}
          className={cn(
            'absolute left-3.5 transition-all duration-200 pointer-events-none origin-left font-body select-none truncate max-w-[85%]',
            isFloated
              ? 'top-1.5 text-[10px] font-extrabold uppercase tracking-wider text-amber-900'
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
            disabled || readOnly ? 'text-stone-500 cursor-not-allowed' : 'text-amber-950',
            isFloated ? 'pt-4 pb-1' : 'py-2.5',
          )}
        />
      </div>
      {helperText && !error && (
        <p className="text-[11px] font-medium text-stone-500 mt-1 px-1">{helperText}</p>
      )}
      {error && <p className="text-[11px] font-bold text-rose-600 mt-1 px-1 break-words">{error}</p>}
    </div>
  );
}

// ----------------------------------------------------
// Realistic Skeleton Loading State
// ----------------------------------------------------
function MobileAccountSettingsSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="rounded-[22px] p-5 bg-white border border-amber-900/10 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-amber-900/10" />
          <div className="space-y-2 flex-1">
            <div className="h-5 w-36 bg-amber-900/10 rounded-md" />
            <div className="h-3.5 w-48 bg-amber-900/10 rounded-md" />
          </div>
        </div>
      </div>
      <div className="rounded-[22px] p-5 bg-white border border-amber-900/10 space-y-4">
        <div className="h-5 w-40 bg-amber-900/10 rounded-md" />
        <div className="space-y-3">
          <div className="h-12 w-full bg-amber-900/10 rounded-xl" />
          <div className="h-12 w-full bg-amber-900/10 rounded-xl" />
          <div className="h-12 w-full bg-amber-900/10 rounded-xl" />
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

    // Upload avatar immediately if user wishes
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
      <main className="flex-1 w-full max-w-4xl mx-auto px-3.5 sm:px-6 py-4 md:py-6 space-y-4 pb-16">
        {isLoading ? (
          <MobileAccountSettingsSkeleton />
        ) : (
          <>
            {/* 1. Profile Summary Card */}
            <div className="w-full rounded-[22px] p-5 sm:p-6 bg-gradient-to-b from-white via-[#FCFBF8] to-[#FAF6F0] border border-amber-900/12 shadow-[0_4px_24px_rgba(44,40,36,0.05)] relative overflow-hidden font-display">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="relative group shrink-0">
                  <Avatar
                    src={previewUrl}
                    name={`${userData?.firstName || ''} ${userData?.lastName || ''}`}
                    size="xl"
                    className="border-3 border-amber-700 shadow-md w-16 h-16 sm:w-20 sm:h-20"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-amber-950/70 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs cursor-pointer"
                    aria-label="Upload profile image"
                  >
                    <FiCamera className="h-4 w-4 mb-0.5 text-amber-200" />
                    <span className="text-[9px] font-extrabold uppercase tracking-wider">Change</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarFileChange}
                  />
                </div>

                <div className="flex-1 text-center sm:text-left space-y-1 min-w-0">
                  <div className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-100/80 px-2.5 py-0.5 rounded-full border border-amber-300/60 shadow-2xs">
                    <FiStar className="h-2.5 w-2.5 fill-amber-700 text-amber-700" /> Krishana Poshak Devotee
                  </div>
                  <h2 className="font-heading font-black text-lg sm:text-xl text-amber-950 truncate tracking-tight">
                    {userData?.firstName} {userData?.lastName}
                  </h2>
                  <p className="text-xs font-semibold text-stone-600 truncate">{userData?.email}</p>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1.5">
                    <Badge variant="success" size="sm" className="font-extrabold flex items-center gap-1 text-[10px]">
                      <FiCheckCircle className="h-3 w-3" /> Account Active
                    </Badge>
                    <Badge variant="warning" size="sm" className="font-extrabold text-[10px] border border-amber-400/40">
                      <FiShield className="h-3 w-3 mr-1 inline" /> {userData?.role || 'CUSTOMER'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Personal Information Form Card */}
            <form onSubmit={handleFormSubmit} className="w-full">
              <div className="rounded-[22px] p-5 sm:p-6 bg-white border border-amber-900/12 shadow-[0_4px_24px_rgba(44,40,36,0.05)] space-y-4 font-display">
                <div className="flex items-center gap-2 pb-3 border-b border-amber-900/10">
                  <div className="w-8 h-8 rounded-xl bg-amber-100/80 text-amber-900 flex items-center justify-center shrink-0">
                    <FiUser className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-base text-amber-950">
                      Personal Details
                    </h3>
                    <p className="text-[11px] font-semibold text-stone-500">Update your name and contact details</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-[14px]">
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

                <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-[14px]">
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

                <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-[14px]">
                  <div className="relative w-full h-[50px] rounded-[14px] border border-amber-900/20 bg-white overflow-hidden flex items-center font-display">
                    <label
                      htmlFor="sett-gender"
                      className="absolute left-3.5 top-1.5 text-[10px] font-extrabold uppercase tracking-wider text-amber-900 pointer-events-none"
                    >
                      Gender
                    </label>
                    <select
                      id="sett-gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full h-full bg-transparent px-3.5 pt-4 pb-1 text-xs sm:text-sm font-bold text-amber-950 outline-none cursor-pointer"
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
                    className="w-full sm:w-auto px-6 h-[46px] rounded-xl bg-gradient-to-r from-amber-800 to-amber-950 hover:from-amber-900 hover:to-stone-950 text-white font-extrabold text-xs shadow-md disabled:opacity-50 flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <FiSave className="w-4 h-4 text-amber-200" />
                    <span>{isSubmitting ? 'Saving...' : 'Save Profile Changes'}</span>
                  </button>
                </div>
              </div>
            </form>

            {/* 3. Security & Credentials Card */}
            <div className="rounded-[22px] p-5 sm:p-6 bg-white border border-amber-900/12 shadow-[0_4px_24px_rgba(44,40,36,0.05)] space-y-4 font-display">
              <div className="flex items-center gap-2 pb-3 border-b border-amber-900/10">
                <div className="w-8 h-8 rounded-xl bg-amber-100/80 text-amber-900 flex items-center justify-center shrink-0">
                  <FiLock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-base text-amber-950">
                    Security & Credentials
                  </h3>
                  <p className="text-[11px] font-semibold text-stone-500">Manage account verification and password reset</p>
                </div>
              </div>

              {/* Email Verification Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-amber-50/50 border border-amber-900/10">
                <div className="flex items-center gap-2.5">
                  {userData?.emailVerified ? (
                    <FiCheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <FiAlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                  )}
                  <div>
                    <p className="text-xs font-bold text-amber-950">
                      {userData?.emailVerified ? 'Email Address Verified' : 'Email Address Unverified'}
                    </p>
                    <p className="text-[11px] text-stone-600">{userData?.email}</p>
                  </div>
                </div>

                {!userData?.emailVerified && (
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={isResendingVerification}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-900 hover:bg-amber-950 text-white font-extrabold text-xs shadow-2xs transition-all min-h-[36px] self-start sm:self-auto"
                  >
                    {isResendingVerification ? 'Sending...' : 'Verify Email'}
                  </button>
                )}
              </div>

              {/* Password Reset Section */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <div>
                  <p className="text-xs font-bold text-amber-950">Send Password Reset Link</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Receive a secure verification link via email to change your password
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handlePasswordReset}
                  disabled={isResettingPassword}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-amber-50 text-amber-950 font-extrabold text-xs border border-amber-900/20 shadow-2xs transition-all active:scale-95 shrink-0 min-h-[38px]"
                >
                  {isResettingPassword ? 'Sending Link...' : 'Send Reset Link'}
                </button>
              </div>
            </div>

            {/* 4. Notification Preferences Card */}
            <div className="rounded-[22px] p-5 sm:p-6 bg-white border border-amber-900/12 shadow-[0_4px_24px_rgba(44,40,36,0.05)] space-y-4 font-display">
              <div className="flex items-center gap-2 pb-3 border-b border-amber-900/10">
                <div className="w-8 h-8 rounded-xl bg-amber-100/80 text-amber-900 flex items-center justify-center shrink-0">
                  <FiBell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-base text-amber-950">
                    Notification Preferences
                  </h3>
                  <p className="text-[11px] font-semibold text-stone-500">Configure order alerts and promotional offers</p>
                </div>
              </div>

              <div className="space-y-3.5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-amber-950">Order & Delivery Alerts</p>
                    <p className="text-[11px] text-stone-500 mt-0.5">Receive dispatch tracking updates and order confirmations</p>
                  </div>
                  <Switch checked={emailNotifs} onChange={setEmailNotifs} />
                </div>

                <div className="flex items-center justify-between gap-3 pt-3 border-t border-amber-900/10">
                  <div>
                    <p className="text-xs font-bold text-amber-950">Festive Offers & Exclusive Launches</p>
                    <p className="text-[11px] text-stone-500 mt-0.5">Early access to coupons and festival attire collections</p>
                  </div>
                  <Switch checked={promoNotifs} onChange={setPromoNotifs} />
                </div>
              </div>
            </div>

            {/* 5. Active Session Control / Sign Out */}
            <div className="rounded-[22px] p-5 sm:p-6 bg-rose-50/60 border border-rose-200/80 shadow-2xs space-y-3 font-display">
              <div className="flex items-center gap-2 text-rose-800">
                <FiShield className="w-4.5 h-4.5 text-rose-700" />
                <h3 className="font-heading font-extrabold text-base text-rose-950">
                  Active Session Control
                </h3>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-stone-800">Sign Out Account</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Safely terminate your active customer login session on this browser
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="px-5 h-[42px] rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all active:scale-95 shrink-0"
                >
                  <FiLogOut className="w-4 h-4" />
                  <span>Sign Out Session</span>
                </button>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Sign Out Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
        title="Sign Out Confirmation"
        message="Are you sure you want to sign out of your account?"
        confirmText="Sign Out"
        variant="danger"
      />
    </div>
  );
}
