import { memo } from 'react';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import { FiCheckCircle, FiStar, FiShield } from 'react-icons/fi';

const ProfileHeader = memo(function ProfileHeader({ user }) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-6 sm:p-8 bg-white rounded-3xl border border-amber-900/10 shadow-[0_4px_20px_rgba(44,40,36,0.03)] font-display">
      <div className="relative shrink-0">
        <Avatar
          src={user?.profileImageUrl}
          name={`${user?.firstName || ''} ${user?.lastName || ''}`}
          size="2xl"
          className="border-2 border-amber-500 shadow-md"
        />
        <div className="absolute -bottom-1 -right-1 bg-amber-900 text-amber-200 p-1 rounded-full shadow-xs">
          <FiStar className="h-3.5 w-3.5 fill-amber-300" />
        </div>
      </div>

      <div className="text-center sm:text-left min-w-0 flex-1 space-y-1">
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100/70 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-amber-900 font-heading">
            <FiShield className="h-3 w-3 text-amber-800" /> Verified Member
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-amber-950">
          {user?.firstName || 'Valued'} {user?.lastName || 'Customer'}
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 font-body font-mono">{user?.email}</p>

        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2 font-body">
          {user?.emailVerified ? (
            <Badge variant="success" size="sm" className="font-bold flex items-center gap-1">
              <FiCheckCircle className="h-3 w-3" /> Email Verified
            </Badge>
          ) : (
            <Badge variant="warning" size="sm" className="font-bold">Unverified Email</Badge>
          )}

          {user?.phoneNumber && (
            <span className="text-xs font-bold text-stone-600 font-mono bg-stone-100 px-2.5 py-1 rounded-lg">
              {user.phoneNumber}
            </span>
          )}

          {user?.gender && (
            <span className="text-xs font-bold text-stone-600 capitalize bg-amber-50 px-2.5 py-1 rounded-lg">
              {user.gender.toLowerCase()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

export default ProfileHeader;
