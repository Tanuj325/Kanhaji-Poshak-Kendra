import { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { FiMapPin, FiPhone, FiEdit2, FiTrash2, FiCheck, FiStar } from 'react-icons/fi';

const AddressCard = memo(function AddressCard({
  address,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onSetDefault,
}) {
  if (!address) return null;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => onSelect?.(address.id)}
      role="radio"
      aria-checked={isSelected}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect?.(address.id);
        }
      }}
      className={cn(
        'relative rounded-2xl border-2 p-4 sm:p-5 transition-all duration-200 cursor-pointer font-display overflow-hidden text-left',
        isSelected
          ? 'border-amber-800 bg-amber-900/5 ring-2 ring-amber-800/20 shadow-md'
          : 'border-amber-900/10 bg-white hover:border-amber-700/40 hover:bg-amber-50/40 shadow-xs',
      )}
    >
      {/* Selection Radio Circle */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div
            className={cn(
              'mt-0.5 h-5 w-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all',
              isSelected ? 'border-amber-800 bg-amber-900 text-white' : 'border-stone-300 bg-white',
            )}
          >
            {isSelected && <FiCheck className="h-3 w-3 stroke-[3]" />}
          </div>

          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-heading font-extrabold text-sm sm:text-base text-amber-950 truncate">
                {address.fullName}
              </span>
              {address.defaultAddress && (
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300/60 uppercase tracking-wider">
                  <FiStar className="h-2.5 w-2.5 fill-amber-700 text-amber-700" /> Default
                </span>
              )}
            </div>

            {address.phoneNumber && (
              <p className="text-xs text-stone-600 font-medium font-mono flex items-center gap-1.5">
                <FiPhone className="h-3 w-3 text-amber-800 shrink-0" />
                <span>{address.phoneNumber}</span>
              </p>
            )}

            <p className="text-xs text-stone-700 leading-relaxed pt-1 font-body">
              {address.addressLine1}
              {address.addressLine2 ? `, ${address.addressLine2}` : ''}
              <br />
              <strong className="text-amber-950 font-bold">
                {address.city}, {address.state} — {address.postalCode}
              </strong>
            </p>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center gap-1 shrink-0">
          {onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(address);
              }}
              className="p-1.5 rounded-lg text-amber-800 hover:bg-amber-100/60 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
              title="Edit Address"
            >
              <FiEdit2 className="h-3.5 w-3.5" />
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(address.id);
              }}
              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
              title="Delete Address"
            >
              <FiTrash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
});

export default AddressCard;
