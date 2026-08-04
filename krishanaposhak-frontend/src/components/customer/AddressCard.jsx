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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className={cn(
        'relative rounded-2xl border p-5 transition-all duration-300 flex flex-col justify-between overflow-hidden font-display',
        address.defaultAddress
          ? 'border-amber-700/60 bg-gradient-to-br from-white via-amber-50/20 to-amber-100/10 shadow-md ring-1 ring-amber-700/30'
          : isSelected
          ? 'border-amber-800 bg-amber-900/5 shadow-md ring-1 ring-amber-800/20'
          : 'border-amber-900/10 bg-white shadow-xs hover:shadow-md hover:border-amber-700/40',
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
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-700 via-temple-gold to-amber-700" />
      )}

      <div>
        <div className="flex items-start justify-between gap-2 pb-3 border-b border-amber-900/10">
          <div className="min-w-0 flex-1 flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-100/70 text-amber-900 flex-shrink-0">
              <FiMapPin className="h-4 w-4" />
            </div>
            <h3 className="font-heading font-extrabold text-base text-amber-950 truncate">
              {address.fullName}
            </h3>
          </div>

          {address.defaultAddress && (
            <Badge variant="warning" size="sm" className="font-bold flex-shrink-0 flex items-center gap-1 border border-amber-400/40 bg-amber-100 text-amber-950">
              <FiStar className="h-3 w-3 fill-amber-700 text-amber-700" /> Default
            </Badge>
          )}
        </div>

        {address.phoneNumber && (
          <div className="mt-3 flex items-center gap-2 text-xs text-stone-600 font-medium bg-amber-50/50 px-3 py-1.5 rounded-xl border border-amber-900/10 w-fit font-mono">
            <FiPhone className="h-3.5 w-3.5 text-amber-800" />
            <span className="font-semibold text-amber-950">{address.phoneNumber}</span>
            <button
              type="button"
              onClick={copyPhoneNumber}
              className="ml-1 p-0.5 text-stone-400 hover:text-amber-900 transition-colors"
              title="Copy Phone Number"
            >
              <FiCopy className="h-3 w-3" />
            </button>
          </div>
        )}

        <div className="text-xs text-stone-700 mt-3 leading-relaxed font-body space-y-0.5">
          <p className="font-medium text-amber-950 text-sm">{address.addressLine1}</p>
          {address.addressLine2 && <p className="text-stone-600">{address.addressLine2}</p>}
          <p className="font-bold text-amber-950 pt-1 font-display">
            {address.city}, {address.state} — {address.postalCode}
          </p>
          <p className="text-stone-400 text-[11px] uppercase tracking-wider font-bold pt-0.5">
            {address.country || 'India'}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 mt-5 pt-3 border-t border-amber-900/10 font-display">
        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onEdit(address); }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 hover:text-amber-950 transition-colors px-2.5 py-1.5 rounded-xl hover:bg-amber-100/50"
            >
              <FiEdit2 className="h-3.5 w-3.5" /> Edit
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onDelete(address); }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 hover:bg-rose-50 transition-colors px-2.5 py-1.5 rounded-xl"
            >
              <FiTrash2 className="h-3.5 w-3.5" /> Delete
            </button>
          )}
        </div>

        {onSetDefault && !address.defaultAddress && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onSetDefault(address.id); }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 hover:text-amber-950 transition-colors px-3 py-1.5 rounded-xl bg-amber-100/60 hover:bg-amber-100 border border-amber-300/40"
          >
            <FiCheckCircle className="h-3.5 w-3.5" /> Set Default
          </button>
        )}
      </div>
    </motion.div>
  );
});

export default AddressCard;