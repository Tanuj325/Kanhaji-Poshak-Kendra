import { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import Badge from '@/components/ui/Badge';
import { FiEdit2, FiTrash2, FiCheckCircle, FiMapPin, FiPhone, FiCopy, FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AddressCard = memo(function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  isSelected,
  onSelect,
}) {
  const copyPhoneNumber = (e) => {
    e.stopPropagation();
    if (address.phoneNumber) {
      navigator.clipboard.writeText(address.phoneNumber);
      toast.success('Phone number copied to clipboard!');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'relative rounded-2xl border p-5 transition-all duration-300 flex flex-col justify-between overflow-hidden',
        address.defaultAddress
          ? 'border-temple-gold/60 bg-gradient-to-br from-white via-warm-cream/30 to-temple-gold/5 shadow-md ring-1 ring-temple-gold/30'
          : isSelected
          ? 'border-royal-blue bg-royal-blue/5 shadow-md ring-1 ring-royal-blue/30'
          : 'border-muted-sand/25 bg-white shadow-xs hover:shadow-md hover:border-temple-gold/40',
        onSelect && 'cursor-pointer',
      )}
      onClick={onSelect}
      role={onSelect ? 'radio' : undefined}
      aria-checked={onSelect ? isSelected : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onKeyDown={onSelect ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(); } } : undefined}
    >
      {/* Top Accent line for Default address */}
      {address.defaultAddress && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-temple-gold via-amber-400 to-temple-gold" />
      )}

      <div>
        <div className="flex items-start justify-between gap-2 pb-3 border-b border-muted-sand/15">
          <div className="min-w-0 flex-1 flex items-center gap-2">
            <div className="p-2 rounded-xl bg-temple-gold/10 text-temple-gold flex-shrink-0">
              <FiMapPin className="h-4 w-4" />
            </div>
            <h3 className="font-display text-base font-bold text-dark-charcoal truncate">
              {address.fullName}
            </h3>
          </div>

          {address.defaultAddress && (
            <Badge variant="warning" size="sm" className="font-bold flex-shrink-0 flex items-center gap-1 border border-temple-gold/40">
              <FiStar className="h-3 w-3 fill-temple-gold text-temple-gold" /> Default
            </Badge>
          )}
        </div>

        {address.phoneNumber && (
          <div className="mt-3 flex items-center gap-2 text-xs text-natural-wood font-medium bg-warm-cream/40 px-3 py-1.5 rounded-xl border border-muted-sand/20 w-fit">
            <FiPhone className="h-3.5 w-3.5 text-royal-blue" />
            <span className="font-semibold text-dark-charcoal">{address.phoneNumber}</span>
            <button
              type="button"
              onClick={copyPhoneNumber}
              className="ml-1 p-0.5 text-natural-wood/70 hover:text-royal-blue transition-colors"
              title="Copy Phone Number"
            >
              <FiCopy className="h-3 w-3" />
            </button>
          </div>
        )}

        <div className="text-xs text-dark-charcoal/85 mt-3 leading-relaxed font-normal space-y-0.5">
          <p className="font-medium text-dark-charcoal text-sm">{address.addressLine1}</p>
          {address.addressLine2 && <p className="text-natural-wood">{address.addressLine2}</p>}
          <p className="font-semibold text-dark-charcoal pt-1">
            {address.city}, {address.state} — {address.postalCode}
          </p>
          <p className="text-natural-wood/80 text-[11px] uppercase tracking-wider font-bold pt-0.5">
            {address.country || 'India'}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 mt-5 pt-3 border-t border-muted-sand/15">
        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onEdit(address); }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-royal-blue hover:text-deep-navy transition-colors px-2.5 py-1.5 rounded-xl hover:bg-royal-blue/10"
            >
              <FiEdit2 className="h-3.5 w-3.5" /> Edit
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onDelete(address); }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-error hover:bg-error/10 transition-colors px-2.5 py-1.5 rounded-xl"
            >
              <FiTrash2 className="h-3.5 w-3.5" /> Delete
            </button>
          )}
        </div>

        {onSetDefault && !address.defaultAddress && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onSetDefault(address.id); }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-temple-gold hover:text-amber-600 transition-colors px-3 py-1.5 rounded-xl bg-temple-gold/10 hover:bg-temple-gold/20 border border-temple-gold/30"
          >
            <FiCheckCircle className="h-3.5 w-3.5" /> Set as Default
          </button>
        )}
      </div>
    </motion.div>
  );
});

export default AddressCard;