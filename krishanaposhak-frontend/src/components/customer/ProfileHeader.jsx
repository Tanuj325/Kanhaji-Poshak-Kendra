import { memo } from 'react';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';

const ProfileHeader = memo(function ProfileHeader({ user }) {
  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6 p-6 bg-white rounded-lg border border-muted-sand/20 shadow-soft">
      <Avatar
        src={user?.profileImageUrl}
        name={`${user?.firstName || ''} ${user?.lastName || ''}`}
        size="2xl"
        className="flex-shrink-0"
      />
      <div className="text-center sm:text-left min-w-0 flex-1">
        <h2 className="text-xl font-display font-semibold text-dark-charcoal">
          {user?.firstName} {user?.lastName}
        </h2>
        <p className="text-sm text-natural-wood mt-0.5">{user?.email}</p>
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
          {user?.emailVerified && (
            <Badge variant="success" size="sm">Email Verified</Badge>
          )}
          {user?.phoneNumber && (
            <span className="text-xs text-natural-wood">{user.phoneNumber}</span>
          )}
          {user?.gender && (
            <span className="text-xs text-natural-wood capitalize">{user.gender.toLowerCase()}</span>
          )}
        </div>
    </div>
    </div>
  );
});

export default ProfileHeader;
