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
        toast.error(getErrorMessage(err, 'Failed to delete user'));
      },
    });
  }, [userId, deleteUser, navigate]);

  if (isLoading) {
    return (
      <div className="space-y-6 font-display">
        <Breadcrumb />
        <Skeleton variant="text" className="h-8 w-64" />
        <Skeleton variant="rect" className="h-60 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="space-y-6 font-display">
        <Breadcrumb />
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-8 text-center">
          <p className="text-sm font-semibold text-rose-600 mb-4">{getErrorMessage(error, 'User not found')}</p>
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

      <div className="space-y-6 font-display">
        <Breadcrumb />

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/admin/users')}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <FiArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <h1 className="font-serif text-2xl font-bold text-slate-900 tracking-tight">
                {fullName}
              </h1>
              <p className="mt-0.5 text-xs text-slate-500 font-mono">ID #{user.id} · Registered {formatDate(user.createdAt, { format: 'date' })}</p>
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

        {/* Profile Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                        `Namaste ${user.firstName}, regarding your Krishana Poshak account:`
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
