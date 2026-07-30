import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import Input from '@/components/forms/Input';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services';
import { siteConfig } from '@/config/siteConfig';
import { getErrorMessage } from '@/utils/apiErrorParser';
import toast from 'react-hot-toast';
import {
  FiCamera,
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiLogOut,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiCalendar,
  FiAlertCircle,
  FiStar,
  FiShield,
} from 'react-icons/fi';

const breadcrumbItems = [
  { label: 'Home', href: '/' },
  { label: 'My Account', href: '/account/profile' },
  { label: 'Profile Settings' },
];

export default function ProfilePage() {
  const { user, refetchUser, logout } = useAuth();
  const { data: profile, isLoading, error, refetch } = useProfile();
  const updateProfile = useUpdateProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef(null);

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      gender: '',
      dateOfBirth: '',
    },
  });

  const [passwordState, setPasswordState] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isResendingVerification, setIsResendingVerification] = useState(false);

  const currentUserData = profile || user;

  const handleResendVerificationLink = async () => {
    if (!currentUserData?.email) return;
    setIsResendingVerification(true);
    try {
      await authService.resendVerification(currentUserData.email);
      toast.success('Verification email sent! Please check your inbox.');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsResendingVerification(false);
    }
  };

  useEffect(() => {
    const data = profile || user;
    if (data) {
      reset({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        phoneNumber: data.phoneNumber || '',
        gender: data.gender || '',
        dateOfBirth: data.dateOfBirth || '',
      });
      if (data.profileImageUrl) {
        setPreviewUrl(data.profileImageUrl);
      }
    }
  }, [profile, user, reset]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const onSubmitProfile = async (data) => {
    const targetUserId = profile?.id || user?.id;
    if (!targetUserId) return;

    const formData = new FormData();
    if (data.firstName) formData.append('firstName', data.firstName);
    if (data.lastName) formData.append('lastName', data.lastName);
    if (data.phoneNumber) formData.append('phoneNumber', data.phoneNumber);
    if (data.gender) formData.append('gender', data.gender);
    if (data.dateOfBirth) formData.append('dateOfBirth', data.dateOfBirth);
    if (selectedFile) formData.append('file', selectedFile);

    try {
      await updateProfile.mutateAsync({ userId: targetUserId, formData });
      setIsEditing(false);
      setSelectedFile(null);
      await refetchUser();
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordState.newPassword) {
      toast.error('Please enter a new password');
      return;
    }
    if (passwordState.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (passwordState.newPassword !== passwordState.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setIsChangingPassword(true);
    try {
      if (user?.email) {
        await authService.forgotPassword(user.email);
        toast.success('Password reset link sent to your registered email address');
      } else {
        toast.success('Password update request submitted');
      }
      setPasswordState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogoutDevice = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch {
      // Handled by context
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 w-full max-w-5xl">
        <Breadcrumb items={breadcrumbItems} />
        <Skeleton variant="text" className="h-8 w-48 bg-temple-gold/20" />
        <div className="bg-white p-6 rounded-3xl border border-temple-gold/20 flex gap-6">
          <Skeleton variant="circle" className="h-24 w-24 flex-shrink-0 bg-temple-gold/20" />
          <div className="space-y-3 flex-1">
            <Skeleton variant="text" className="h-7 w-1/3 bg-temple-gold/20" />
            <Skeleton variant="text" className="h-4 w-1/2 bg-temple-gold/20" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 w-full max-w-5xl">
        <ErrorState title="Failed to load profile" message={getErrorMessage(error)} onRetry={refetch} />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`My Profile | ${siteConfig.name}`}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-8 w-full max-w-5xl font-display"
      >
        <Breadcrumb items={breadcrumbItems} />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-muted-sand/20 pb-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-dark-charcoal">Personal Profile</h1>
            <p className="text-xs sm:text-sm text-natural-wood mt-0.5">Manage your personal information, contact details, and account security</p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={currentUserData?.role === 'ADMIN' ? 'warning' : 'primary'} className="font-bold border border-temple-gold/30">
              <FiShield className="h-3 w-3 mr-1 inline" /> {currentUserData?.role || 'CUSTOMER'}
            </Badge>
            <Badge variant={currentUserData?.enabled !== false ? 'success' : 'danger'} className="font-bold">
              {currentUserData?.enabled !== false ? 'Active Devotee' : 'Inactive'}
            </Badge>
          </div>
        </div>

        {/* Profile Avatar & Header Luxury Card */}
        <div className="rounded-3xl bg-gradient-to-r from-white via-warm-cream/40 to-temple-gold/10 p-6 sm:p-8 shadow-md border border-temple-gold/30 flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-36 h-36 bg-temple-gold/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative group flex-shrink-0">
            <Avatar
              name={`${currentUserData?.firstName || ''} ${currentUserData?.lastName || ''}`}
              src={previewUrl}
              size="xl"
              className="border-4 border-temple-gold shadow-lg"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-dark-charcoal/70 rounded-full flex flex-col items-center justify-center text-lotus-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs cursor-pointer"
              aria-label="Upload profile image"
            >
              <FiCamera className="h-6 w-6 mb-1 text-temple-gold" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Upload</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          <div className="flex-1 space-y-2 text-center sm:text-left relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-temple-gold flex items-center justify-center sm:justify-start gap-1">
                  <FiStar className="h-3 w-3 text-temple-gold fill-temple-gold" /> Krishana Poshak Member
                </span>
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-dark-charcoal mt-0.5">
                  {currentUserData?.firstName} {currentUserData?.lastName}
                </h2>
              </div>
              {currentUserData?.createdAt && (
                <span className="text-xs text-natural-wood flex items-center justify-center sm:justify-start gap-1 font-medium bg-white/70 px-3 py-1 rounded-full border border-muted-sand/20 w-fit">
                  <FiCalendar className="h-3.5 w-3.5 text-royal-blue" /> Member Since {new Date(currentUserData.createdAt).getFullYear()}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-dark-charcoal/80 pt-2">
              <span className="flex items-center gap-1.5 font-semibold bg-white/80 px-3 py-1.5 rounded-xl border border-muted-sand/20">
                <FiMail className="h-3.5 w-3.5 text-royal-blue" /> {currentUserData?.email}
              </span>
              {currentUserData?.phoneNumber && (
                <span className="flex items-center gap-1.5 font-semibold bg-white/80 px-3 py-1.5 rounded-xl border border-muted-sand/20">
                  <FiPhone className="h-3.5 w-3.5 text-royal-blue" /> {currentUserData.phoneNumber}
                </span>
              )}
              {currentUserData?.emailVerified ? (
                <span className="flex items-center gap-1.5 font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                  <FiCheckCircle className="h-3.5 w-3.5 text-emerald-600" /> Email Verified
                </span>
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="flex items-center gap-1.5 font-bold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                    <FiAlertCircle className="h-3.5 w-3.5 text-amber-600" /> Email Unverified
                  </span>
                  <button
                    type="button"
                    onClick={handleResendVerificationLink}
                    disabled={isResendingVerification}
                    className="font-bold text-xs text-royal-blue border border-royal-blue/30 px-3 py-1 rounded-xl hover:bg-royal-blue/10 transition-colors"
                  >
                    Verify Email
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Personal Information Form */}
        <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-6">
          <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-md border border-temple-gold/20 space-y-6">
            <div className="flex items-center justify-between border-b border-muted-sand/15 pb-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-dark-charcoal flex items-center gap-2">
                  <FiUser className="h-5 w-5 text-royal-blue" /> Personal Details
                </h3>
                {isDirty && isEditing && (
                  <span className="text-xs font-bold text-amber-600 flex items-center gap-1 mt-1">
                    <FiAlertCircle className="h-3.5 w-3.5" /> You have unsaved profile changes
                  </span>
                )}
              </div>

              {!isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="font-bold"
                >
                  Edit Information
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Input
                label="First Name *"
                {...register('firstName', { required: 'First name is required' })}
                error={errors.firstName?.message}
                disabled={!isEditing}
              />
              <Input
                label="Last Name *"
                {...register('lastName', { required: 'Last name is required' })}
                error={errors.lastName?.message}
                disabled={!isEditing}
              />
              <Input
                label="Email Address"
                type="email"
                {...register('email')}
                disabled
                readOnly
                helperText="Email address is tied to your login account"
              />
              <Input
                label="Phone Number"
                {...register('phoneNumber')}
                error={errors.phoneNumber?.message}
                disabled={!isEditing}
                placeholder="10-digit mobile number"
              />

              <div className="space-y-1">
                <label className="block text-xs font-bold text-dark-charcoal">Gender</label>
                <select
                  {...register('gender')}
                  disabled={!isEditing}
                  className="w-full rounded-xl border border-muted-sand/30 bg-white px-3.5 py-2.5 text-xs focus:border-royal-blue focus:outline-none focus:ring-1 focus:ring-royal-blue/30 disabled:bg-warm-cream/30 disabled:text-natural-wood font-medium"
                >
                  <option value="">Select Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <Input
                label="Date of Birth"
                type="date"
                {...register('dateOfBirth')}
                disabled={!isEditing}
              />
            </div>

            {isEditing && (
              <div className="flex items-center gap-3 justify-end pt-4 border-t border-muted-sand/15">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsEditing(false);
                    setSelectedFile(null);
                    setPreviewUrl(currentUserData?.profileImageUrl || null);
                    reset();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={!isDirty && !selectedFile}
                  className="font-bold shadow-md"
                >
                  {updateProfile.isPending ? 'Saving Details...' : 'Save Profile Changes'}
                </Button>
              </div>
            )}
          </div>
        </form>

        {/* Change Password & Security Card */}
        <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-md border border-temple-gold/20 space-y-6">
          <div className="flex items-center justify-between border-b border-muted-sand/15 pb-4">
            <div className="flex items-center gap-2">
              <FiLock className="h-5 w-5 text-royal-blue" />
              <h3 className="font-serif text-lg font-bold text-dark-charcoal">Password & Account Security</h3>
            </div>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={handleLogoutDevice}
              isLoading={isLoggingOut}
              leftIcon={<FiLogOut className="h-4 w-4" />}
            >
              Sign Out Session
            </Button>
          </div>

          <form onSubmit={handleChangePasswordSubmit} className="space-y-4 max-w-md">
            <Input
              label="Current Password"
              type="password"
              value={passwordState.oldPassword}
              onChange={(e) => setPasswordState((prev) => ({ ...prev, oldPassword: e.target.value }))}
              placeholder="Enter current password"
            />
            <div className="relative">
              <Input
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                value={passwordState.newPassword}
                onChange={(e) => setPasswordState((prev) => ({ ...prev, newPassword: e.target.value }))}
                placeholder="Enter new password (min 6 characters)"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-natural-wood hover:text-dark-charcoal"
              >
                {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
              </button>
            </div>
            <Input
              label="Confirm New Password"
              type={showPassword ? 'text' : 'password'}
              value={passwordState.confirmPassword}
              onChange={(e) => setPasswordState((prev) => ({ ...prev, confirmPassword: e.target.value }))}
              placeholder="Confirm new password"
            />
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isChangingPassword}
              className="font-bold shadow-md"
            >
              {isChangingPassword ? 'Sending Request...' : 'Reset Password'}
            </Button>
          </form>
        </div>
      </motion.div>
    </>
  );
}
