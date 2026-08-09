import { Helmet } from 'react-helmet-async';
import { useCallback, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser, useToggleUserStatus, useDeleteUser } from '@/hooks';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import Skeleton from '@/components/ui/Skeleton';
import Breadcrumb from '@/components/layout/Breadcrumb';
import ConfirmDialog from '@/components/overlay/ConfirmDialog';
import { getErrorMessage } from '@/utils/apiErrorParser';
import { formatDate } from '@/utils/formatDate';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiTrash2, FiUser, FiMail, FiPhone, FiCheckCircle, FiXCircle, FiShield, FiShoppingBag, FiMapPin } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { cn } from '@/utils/cn';

export default function UserDetailPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { data: user, isLoading, isError, error } = useUser(userId);
  const toggleStatus = useToggleUserStatus();
  const deleteUser = useDeleteUser();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);

  const handleToggleStatus = useCallback(() => {
    toggleStatus.mutate(parseInt(userId), {
      onSuccess: () => {
        toast.success('User status updated');
        setShowStatusConfirm(false);
      },
      onError: (err) => {
        toast.error(getErrorMessage(err, 'Failed to update status'));
      },
    });
  }, [userId, toggleStatus]);

  const handleDelete = useCallback(() => {
    deleteUser.mutate(parseInt(userId), {
      onSuccess: () => {
        toast.success('User deleted');
        setShowDeleteConfirm(false);
        navigate('/admin/users');
      },
      onError: (err) => {
        setShowDeleteConfirm(false);
      },
    });
  }, [userId, deleteUser, navigate]);

  if (isLoading) {
    return (
      <div className="space-y-6 font-display">
        <Breadcrumb />

        {/* Mobile & Tablet Skeletons (< 1024px) */}
        <div className="lg:hidden space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Skeleton variant="circle" className="h-9 w-9 shrink-0" />
              <div className="space-y-1">
                <Skeleton variant="text" className="h-5 w-40" />
                <Skeleton variant="text" className="h-3 w-28" />
              </div>
            </div>
            <Skeleton variant="text" className="h-8 w-24 rounded-xl" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton variant="rect" className="h-52 w-full rounded-xl" />
            <Skeleton variant="rect" className="h-52 w-full rounded-xl" />
          </div>
        </div>

        {/* Desktop Loading Skeleton (>= 1024px) - EXACT UNCHANGED */}
        <div className="hidden lg:block space-y-6">
          <Skeleton variant="text" className="h-8 w-64" />
          <Skeleton variant="rect" className="h-60 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="space-y-6 font-display">
        <Breadcrumb />
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 sm:p-8 text-center max-w-lg mx-auto">
          <p className="text-xs sm:text-sm font-semibold text-rose-600 mb-4">{getErrorMessage(error, 'User not found')}</p>
          <Button variant="outline" size="sm" onClick={() => navigate('/admin/users')}>
            Back to Users Directory
          </Button>
        </div>
      </div>
    );
  }

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Devotee Customer';

  return (
    <>
      <Helmet>
        <title>{fullName} - Admin - Krishana Poshak</title>
      </Helmet>

      <div className="space-y-5 sm:space-y-6 font-display">
        <Breadcrumb />

        {/* ========================================== */}
        {/* MOBILE & TABLET PAGE HEADER (< 1024px)     */}
        {/* ========================================== */}
        <div className="lg:hidden border-b border-slate-200/60 pb-4 space-y-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/admin/users')}
              className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors shadow-2xs"
              aria-label="Back to users directory"
            >
              <FiArrowLeft className="h-4 w-4" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="font-heading text-lg sm:text-2xl font-extrabold text-amber-950 tracking-tight truncate">
                {fullName}
              </h1>
              <p className="text-[11px] text-stone-600 font-mono truncate">
                ID #{user.id} · Registered {formatDate(user.createdAt, { format: 'date' })}
              </p>
            </div>
          </div>

          {/* Mobile & Tablet Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Button
              type="button"
              variant={user.enabled ? 'outline' : 'primary'}
              size="sm"
              onClick={() => setShowStatusConfirm(true)}
              isLoading={toggleStatus.isPending}
              leftIcon={user.enabled ? <FiXCircle className="h-3.5 w-3.5" /> : <FiCheckCircle className="h-3.5 w-3.5" />}
              className="text-xs py-1.5 px-3"
            >
              {user.enabled ? 'Disable Account' : 'Enable Account'}
            </Button>

            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              isLoading={deleteUser.isPending}
              leftIcon={<FiTrash2 className="h-3.5 w-3.5" />}
              className="text-xs py-1.5 px-3"
            >
              Delete User
            </Button>
          </div>
        </div>

        {/* ========================================== */}
        {/* DESKTOP PAGE HEADER (>= 1024px) — EXACT    */}
        {/* ========================================== */}
        <div className="hidden lg:flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/admin/users')}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <FiArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-amber-950 tracking-tight">
                {fullName}
              </h1>
              <p className="mt-0.5 text-xs text-stone-600 font-mono">ID #{user.id} · Registered {formatDate(user.createdAt, { format: 'date' })}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant={user.enabled ? 'outline' : 'primary'}
              size="sm"
              onClick={() => setShowStatusConfirm(true)}
              isLoading={toggleStatus.isPending}
              leftIcon={user.enabled ? <FiXCircle className="h-4 w-4" /> : <FiCheckCircle className="h-4 w-4" />}
            >
              {user.enabled ? 'Disable Account' : 'Enable Account'}
            </Button>

            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              isLoading={deleteUser.isPending}
              leftIcon={<FiTrash2 className="h-4 w-4" />}
            >
              Delete User
            </Button>
          </div>
        </div>

        {/* ========================================== */}
        {/* MOBILE & TABLET MAIN CONTENT (< 1024px)    */}
        {/* ========================================== */}
        <div className="lg:hidden space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* User Meta Card */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs space-y-3">
              <div className="flex items-center gap-3">
                <Avatar name={fullName} src={user.profileImageUrl || user.avatarUrl} size="md" className="shrink-0" />
                <div className="min-w-0 flex-1">
                  <h3 className="font-serif text-base font-bold text-slate-900 truncate">{fullName}</h3>
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider mt-1',
                      user.role === 'ADMIN'
                        ? 'bg-purple-500/10 text-purple-700 border border-purple-500/20'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    )}
                  >
                    {user.role === 'ADMIN' && <FiShield className="h-2.5 w-2.5 text-purple-600" />}
                    {user.role || 'CUSTOMER'}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-2.5 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-400 font-semibold uppercase tracking-wider text-[9px]">Email</span>
                  <span className="font-mono text-slate-800 font-semibold truncate text-[11px] min-w-0">{user.email}</span>
                </div>
                {user.phoneNumber && (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-400 font-semibold uppercase tracking-wider text-[9px]">Phone</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="font-mono text-slate-800 font-semibold text-[11px]">{user.phoneNumber}</span>
                      <a
                        href={`https://wa.me/${user.phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Radhey Radhey ${user.firstName}, regarding your Krishana Poshak account:`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded bg-emerald-50 text-emerald-600 border border-emerald-200"
                        title="Chat on WhatsApp"
                      >
                        <FaWhatsapp className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-400 font-semibold uppercase tracking-wider text-[9px]">Verified</span>
                  <span className={cn('font-bold text-xs', user.emailVerified ? 'text-emerald-600' : 'text-amber-600')}>
                    {user.emailVerified ? 'Verified' : 'Unverified Email'}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-400 font-semibold uppercase tracking-wider text-[9px]">Account Status</span>
                  <span className={cn('font-bold text-xs', user.enabled ? 'text-emerald-600' : 'text-rose-600')}>
                    {user.enabled ? 'Active' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>

            {/* Account Summary Card */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs space-y-3 flex flex-col justify-between">
              <h3 className="font-serif text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <FiShoppingBag className="h-4 w-4 text-amber-600 shrink-0" /> Account Summary
              </h3>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200/70">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block truncate">Orders</span>
                  <p className="font-serif text-lg sm:text-xl font-bold text-slate-900 mt-0.5">{user.orderCount ?? user.totalOrders ?? 0}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200/70">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block truncate">Addresses</span>
                  <p className="font-serif text-lg sm:text-xl font-bold text-slate-900 mt-0.5">{user.addresses?.length || 0}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200/70">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block truncate">Gender</span>
                  <p className="font-serif text-xs font-bold text-slate-900 mt-1 truncate">{user.gender || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Devotee Address Book (Full width on Mobile & Tablet) */}
          {user.addresses && user.addresses.length > 0 && (
            <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs space-y-3">
              <h3 className="font-serif text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <FiMapPin className="h-4 w-4 text-amber-600 shrink-0" /> Devotee Address Book
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                {user.addresses.map((addr) => (
                  <div key={addr.id} className="rounded-lg border border-slate-200 p-2.5 bg-slate-50 space-y-0.5 min-w-0">
                    <p className="font-bold text-slate-900 truncate">{addr.fullName}</p>
                    <p className="text-slate-600 truncate">{addr.streetAddress || addr.street}</p>
                    <p className="text-slate-600 truncate">{addr.city}, {addr.state} - {addr.pinCode || addr.zipCode}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ========================================== */}
        {/* DESKTOP MAIN CONTENT (>= 1024px) — EXACT   */}
        {/* ========================================== */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6">
          {/* User Meta Card */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-4">
              <Avatar name={fullName} src={user.profileImageUrl || user.avatarUrl} size="lg" />
              <div>
                <h3 className="font-serif text-lg font-bold text-slate-900">{fullName}</h3>
                <span
                  className={cn(
                    'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider mt-1',
                    user.role === 'ADMIN'
                      ? 'bg-purple-500/10 text-purple-700 border border-purple-500/20'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  )}
                >
                  {user.role === 'ADMIN' && <FiShield className="h-3 w-3 text-purple-600" />}
                  {user.role || 'CUSTOMER'}
                </span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Email</span>
                <span className="font-mono text-slate-800 font-semibold">{user.email}</span>
              </div>
              {user.phoneNumber && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Phone</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-slate-800 font-semibold">{user.phoneNumber}</span>
                    <a
                      href={`https://wa.me/${user.phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Radhey Radhey ${user.firstName}, regarding your Krishana Poshak account:`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200"
                    >
                      <FaWhatsapp className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Verified</span>
                <span className={cn('font-bold', user.emailVerified ? 'text-emerald-600' : 'text-amber-600')}>
                  {user.emailVerified ? 'Verified' : 'Unverified Email'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Account Status</span>
                <span className={cn('font-bold', user.enabled ? 'text-emerald-600' : 'text-rose-600')}>
                  {user.enabled ? 'Active' : 'Disabled'}
                </span>
              </div>
            </div>
          </div>

          {/* Activity / Summary Cards */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
              <h3 className="font-serif text-base font-bold text-slate-900 flex items-center gap-2">
                <FiShoppingBag className="h-4 w-4 text-amber-600" /> Account Summary
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Orders</span>
                  <p className="font-serif text-2xl font-bold text-slate-900 mt-1">{user.orderCount ?? user.totalOrders ?? 0}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Saved Addresses</span>
                  <p className="font-serif text-2xl font-bold text-slate-900 mt-1">{user.addresses?.length || 0}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/80 col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Gender</span>
                  <p className="font-serif text-base font-bold text-slate-900 mt-1">{user.gender || 'Not specified'}</p>
                </div>
              </div>
            </div>

            {/* Address List */}
            {user.addresses && user.addresses.length > 0 && (
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
                <h3 className="font-serif text-base font-bold text-slate-900 flex items-center gap-2">
                  <FiMapPin className="h-4 w-4 text-amber-600" /> Devotee Address Book
                </h3>
                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                  {user.addresses.map((addr) => (
                    <div key={addr.id} className="rounded-xl border border-slate-200 p-3 bg-slate-50 space-y-1">
                      <p className="font-bold text-slate-900">{addr.fullName}</p>
                      <p className="text-slate-600">{addr.streetAddress || addr.street}</p>
                      <p className="text-slate-600">{addr.city}, {addr.state} - {addr.pinCode || addr.zipCode}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirm Status Change */}
      <ConfirmDialog
        isOpen={showStatusConfirm}
        onClose={() => setShowStatusConfirm(false)}
        onConfirm={handleToggleStatus}
        title="Update Devotee Status"
        message={`Are you sure you want to toggle status for ${user?.firstName} ${user?.lastName}?`}
        confirmText="Confirm Status Update"
        type="warning"
        isLoading={toggleStatus.isPending}
      />

      {/* Confirm Delete User */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Devotee Account"
        message={`Are you sure you want to delete "${user?.firstName} ${user?.lastName}"? This action cannot be undone.`}
        confirmText="Delete Account"
        type="danger"
        isLoading={deleteUser.isPending}
      />
    </>
  );
}
