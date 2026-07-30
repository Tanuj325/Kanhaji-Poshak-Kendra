import { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Switch from '@/components/forms/Switch';
import Skeleton from '@/components/ui/Skeleton';
import Avatar from '@/components/ui/Avatar';
import { useAuth } from '@/context/AuthContext';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import { authService } from '@/services';
import { siteConfig } from '@/config/siteConfig';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { getErrorMessage } from '@/utils/apiErrorParser';
import toast from 'react-hot-toast';
import { FiUser, FiLock, FiShield, FiLogOut, FiCheckCircle, FiBell, FiCamera, FiStar } from 'react-icons/fi';

const breadcrumbItems = [
  { label: 'Home', href: ROUTE_PATHS.HOME },
  { label: 'My Account', href: ROUTE_PATHS.PROFILE },
  { label: 'Account Settings' },
];

export default function SettingsPage() {
  const { user: authUser, logout } = useAuth();
  const navigate = useNavigate();

  const { data: profile, isLoading, refetch } = useProfile();
  const updateProfileMutation = useUpdateProfile();

  const [emailNotifs, setEmailNotifs] = useState(true);
  const [promoNotifs, setPromoNotifs] = useState(true);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const userData = profile || authUser;

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      toast.success('Signed out successfully');
      navigate(ROUTE_PATHS.LOGIN, { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }, [logout, navigate]);

  const handlePasswordReset = async () => {
    if (!userData?.email) return;
    setIsResettingPassword(true);
    try {
      await authService.forgotPassword(userData.email);
      toast.success('Password reset link sent to your registered email address');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !userData?.id) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      await updateProfileMutation.mutateAsync({ userId: userData.id, data: formData });
      toast.success('Profile picture updated successfully!');
      refetch();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 w-full max-w-5xl">
        <Breadcrumb items={breadcrumbItems} />
        <Skeleton variant="text" className="h-8 w-48 bg-temple-gold/20" />
        <Skeleton variant="card" className="h-44 w-full rounded-3xl bg-temple-gold/15" />
        <Skeleton variant="card" className="h-44 w-full rounded-3xl bg-temple-gold/15" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`Account Settings | ${siteConfig.name}`}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-8 w-full max-w-5xl font-display"
      >
        <Breadcrumb items={breadcrumbItems} />

        <div className="pb-4 border-b border-muted-sand/20">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-dark-charcoal">Account Preferences & Security</h1>
          <p className="text-xs sm:text-sm text-natural-wood mt-0.5 font-normal">Manage your account security, notification alerts, and active login sessions</p>
        </div>

        {/* Account Overview & Status Card */}
        <div className="rounded-3xl bg-white p-6 sm:p-7 shadow-md border border-temple-gold/20 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-muted-sand/15 pb-4">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <Avatar
                  src={userData?.profileImageUrl}
                  name={`${userData?.firstName || ''} ${userData?.lastName || ''}`}
                  size="xl"
                  className="border-2 border-temple-gold shadow-md"
                />
                <label className="absolute inset-0 flex flex-col items-center justify-center bg-dark-charcoal/70 text-lotus-white text-[10px] font-bold opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity backdrop-blur-xs">
                  <FiCamera className="h-4 w-4 mb-0.5 text-temple-gold" /> Upload
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </label>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-temple-gold flex items-center gap-1">
                  <FiStar className="h-3 w-3 text-temple-gold fill-temple-gold" /> Krishana Poshak Member
                </span>
                <h2 className="font-serif text-xl font-bold text-dark-charcoal mt-0.5">
                  {userData?.firstName} {userData?.lastName}
                </h2>
                <p className="text-xs font-medium text-natural-wood">{userData?.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="success" size="sm" className="font-bold flex items-center gap-1">
                    <FiCheckCircle className="h-3 w-3" /> Account Active
                  </Badge>
                  <Badge variant="warning" size="sm" className="font-bold border border-temple-gold/30">
                    <FiShield className="h-3 w-3 mr-1 inline" /> {userData?.role || 'CUSTOMER'}
                  </Badge>
                </div>
              </div>
            </div>
            <Link to={ROUTE_PATHS.PROFILE}>
              <Button variant="outline" size="sm" className="font-bold">
                <FiUser className="h-4 w-4 mr-1" /> Profile Details
              </Button>
            </Link>
          </div>
        </div>

        {/* Security & Password Reset Card */}
        <div className="rounded-3xl bg-white p-6 sm:p-7 shadow-md border border-temple-gold/20 space-y-4">
          <div className="flex items-center gap-2.5 border-b border-muted-sand/15 pb-3">
            <FiLock className="h-5 w-5 text-royal-blue" />
            <h2 className="font-serif text-lg font-bold text-dark-charcoal">Security & Credentials</h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
            <div>
              <p className="text-sm font-bold text-dark-charcoal">Send Password Reset Link</p>
              <p className="text-xs text-natural-wood mt-0.5">Send a secure verification link to reset your account password ({userData?.email})</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePasswordReset}
              isLoading={isResettingPassword}
              className="font-bold"
            >
              Send Reset Email
            </Button>
          </div>
        </div>

        {/* Preferences & Notifications Card */}
        <div className="rounded-3xl bg-white p-6 sm:p-7 shadow-md border border-temple-gold/20 space-y-5">
          <div className="flex items-center gap-2.5 border-b border-muted-sand/15 pb-3">
            <FiBell className="h-5 w-5 text-royal-blue" />
            <h2 className="font-serif text-lg font-bold text-dark-charcoal">Notification Preferences</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-dark-charcoal">Order & Delivery Alerts</p>
                <p className="text-xs text-natural-wood mt-0.5">Receive instant order confirmations and dispatch tracking updates</p>
              </div>
              <Switch checked={emailNotifs} onChange={setEmailNotifs} />
            </div>

            <div className="flex items-center justify-between border-t border-muted-sand/15 pt-4">
              <div>
                <p className="text-sm font-bold text-dark-charcoal">Festive Offers & Exclusive Launches</p>
                <p className="text-xs text-natural-wood mt-0.5">Get early access coupons for Janmashtami and festival attire collections</p>
              </div>
              <Switch checked={promoNotifs} onChange={setPromoNotifs} />
            </div>
          </div>
        </div>

        {/* Danger Zone / Active Session Control */}
        <div className="rounded-3xl bg-error/5 p-6 sm:p-7 border border-error/30 space-y-4 shadow-xs">
          <h2 className="font-serif text-lg font-bold text-error flex items-center gap-2">
            <FiShield className="h-5 w-5" /> Active Session Control
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-dark-charcoal">Sign Out Account</p>
              <p className="text-xs text-natural-wood mt-0.5">Safely terminate your active customer login session on this browser</p>
            </div>
            <Button variant="danger" size="sm" onClick={handleLogout} className="flex items-center gap-1.5 font-bold shadow-md">
              <FiLogOut className="h-4 w-4" /> Sign Out Session
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
