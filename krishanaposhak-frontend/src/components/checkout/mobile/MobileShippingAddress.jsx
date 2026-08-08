import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import ConfirmDialog from '@/components/overlay/ConfirmDialog';
import toast from 'react-hot-toast';
import {
  FiChevronLeft,
  FiMapPin,
  FiPlus,
  FiStar,
  FiHome,
  FiBriefcase,
  FiPhone,
  FiEdit2,
  FiTrash2,
  FiCheck,
  FiX,
  FiArrowRight,
  FiCheckCircle,
  FiCopy,
} from 'react-icons/fi';

const STATE_OPTIONS = [
  'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

const INITIAL_FORM = {
  fullName: '',
  phoneNumber: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: 'Uttar Pradesh',
  postalCode: '',
  country: 'India',
  defaultAddress: false,
  addressType: 'HOME',
};

// ----------------------------------------------------
// Premium Address Card Skeleton
// ----------------------------------------------------
function AddressCardSkeleton() {
  return (
    <div className="w-full rounded-[20px] p-5 border border-amber-900/10 bg-white space-y-3 animate-pulse shadow-2xs">
      <div className="flex items-center justify-between">
        <div className="h-5 w-36 bg-amber-900/10 rounded-md" />
        <div className="h-5 w-16 bg-amber-900/10 rounded-full" />
      </div>
      <div className="h-4 w-28 bg-amber-900/10 rounded-md" />
      <div className="space-y-1.5 pt-1">
        <div className="h-3.5 w-full bg-amber-900/10 rounded-md" />
        <div className="h-3.5 w-3/4 bg-amber-900/10 rounded-md" />
        <div className="h-3.5 w-1/2 bg-amber-900/10 rounded-md" />
      </div>
      <div className="flex justify-end gap-2 pt-3 border-t border-amber-900/10">
        <div className="h-8 w-16 bg-amber-900/10 rounded-xl" />
        <div className="h-8 w-16 bg-amber-900/10 rounded-xl" />
      </div>
    </div>
  );
}

// ----------------------------------------------------
// Premium Empty State Component
// ----------------------------------------------------
function AddressEmptyState({ onAdd }) {
  return (
    <div className="w-full rounded-[24px] bg-white border border-amber-900/10 p-8 sm:p-10 text-center space-y-4 shadow-sm my-4">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-100 to-amber-50 text-amber-900 flex items-center justify-center mx-auto border border-amber-200/80 shadow-xs">
        <FiMapPin className="w-8 h-8 text-amber-900" />
      </div>
      <div className="space-y-1 max-w-sm mx-auto">
        <h3 className="font-heading font-extrabold text-base sm:text-lg text-amber-950">
          No Saved Addresses
        </h3>
        <p className="text-xs sm:text-sm text-stone-600 font-body leading-relaxed">
          Add your delivery address to enjoy seamless, 1-click express checkout.
        </p>
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="inline-flex items-center gap-2 px-6 h-[46px] rounded-xl bg-gradient-to-r from-amber-800 to-amber-950 hover:from-amber-900 hover:to-stone-950 text-white font-extrabold text-xs shadow-md transition-all active:scale-95"
      >
        <FiPlus className="w-4 h-4 text-amber-200" />
        <span>Add New Address</span>
      </button>
    </div>
  );
}

// ----------------------------------------------------
// Premium Floating Label Input Component (50px height)
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
  enterKeyHint = 'next',
  required = false,
  pattern,
  maxLength,
  inputRef,
  onKeyDown,
  error,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value !== undefined && value !== null && String(value).trim().length > 0;
  const isFloated = isFocused || hasValue;

  return (
    <div className="relative w-full font-display">
      <div
        className={cn(
          'relative w-full h-[50px] rounded-[14px] border transition-all duration-200 bg-white font-display overflow-hidden flex items-center',
          error
            ? 'border-rose-400 ring-2 ring-rose-500/10'
            : isFocused
            ? 'border-amber-700 ring-2 ring-amber-700/20 bg-amber-50/10'
            : 'border-amber-900/20 hover:border-amber-700/40',
        )}
      >
        <label
          htmlFor={id}
          className={cn(
            'absolute left-3.5 transition-all duration-200 pointer-events-none origin-left font-body select-none',
            isFloated
              ? 'top-1.5 text-[10px] font-extrabold uppercase tracking-wider text-amber-900'
              : 'top-1/2 -translate-y-1/2 text-xs font-semibold text-stone-400',
          )}
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        <input
          ref={inputRef}
          id={id}
          name={name}
          type={type}
          inputMode={inputMode}
          autoComplete={autoComplete}
          enterKeyHint={enterKeyHint}
          value={value || ''}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={onKeyDown}
          required={required}
          pattern={pattern}
          maxLength={maxLength}
          className={cn(
            'w-full h-full bg-transparent px-3.5 font-display text-xs sm:text-sm font-bold text-amber-950 outline-none transition-all',
            isFloated ? 'pt-4 pb-1' : 'py-2.5',
          )}
        />
      </div>
      {error && <p className="text-[11px] font-bold text-rose-600 mt-1 px-1">{error}</p>}
    </div>
  );
}

// ----------------------------------------------------
// Rebuilt Mobile & Tablet Address Card
// ----------------------------------------------------
function RebuiltAddressCard({
  address,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onSetDefault,
  mode = 'checkout',
}) {
  if (!address) return null;

  const isOffice = address.addressType === 'OFFICE' || address.label === 'Office';
  const isHome = address.addressType === 'HOME' || address.label === 'Home';
  const isSelectable = mode === 'checkout' || Boolean(onSelect && mode !== 'management');

  const copyPhoneNumber = (e) => {
    e.stopPropagation();
    if (address.phoneNumber) {
      navigator.clipboard.writeText(address.phoneNumber);
      toast.success('Phone number copied!');
    }
  };

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={() => isSelectable && onSelect?.(address.id)}
      role={isSelectable ? 'radio' : undefined}
      aria-checked={isSelectable ? isSelected : undefined}
      tabIndex={isSelectable ? 0 : undefined}
      onKeyDown={(e) => {
        if (isSelectable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onSelect?.(address.id);
        }
      }}
      className={cn(
        'relative w-full rounded-[20px] p-4.5 sm:p-5 transition-all duration-200 font-display overflow-hidden text-left flex flex-col justify-between gap-3.5',
        isSelected && isSelectable
          ? 'border-2 border-[#D4AF37] bg-[#FAF4E8] shadow-md ring-2 ring-[#D4AF37]/20'
          : 'border border-amber-900/10 bg-white hover:border-amber-700/30 shadow-[0_2px_12px_rgba(44,40,36,0.04)] hover:shadow-[0_4px_20px_rgba(44,40,36,0.08)]',
        isSelectable && 'cursor-pointer',
      )}
    >
      {/* Top Gold Accent Line for Default Address */}
      {address.defaultAddress && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-700 via-[#D4AF37] to-amber-700" />
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          {/* Radio Indicator for Checkout */}
          {isSelectable && (
            <div
              className={cn(
                'mt-0.5 h-5 w-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all',
                isSelected
                  ? 'border-[#D4AF37] bg-[#D4AF37] text-amber-950'
                  : 'border-stone-300 bg-white',
              )}
            >
              {isSelected && <FiCheck className="h-3 w-3 stroke-[3] text-amber-950" />}
            </div>
          )}

          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-heading font-extrabold text-base text-amber-950 truncate">
                {address.fullName}
              </span>

              {/* Home / Office Badge */}
              {(isOffice || isHome) && (
                <span
                  className={cn(
                    'inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase tracking-wider',
                    isOffice
                      ? 'bg-blue-50 text-blue-900 border-blue-200/80'
                      : 'bg-amber-100/70 text-amber-950 border-amber-300/60',
                  )}
                >
                  {isOffice ? (
                    <>
                      <FiBriefcase className="h-2.5 w-2.5 text-blue-700" /> Office
                    </>
                  ) : (
                    <>
                      <FiHome className="h-2.5 w-2.5 text-amber-800" /> Home
                    </>
                  )}
                </span>
              )}

              {/* Default Badge */}
              {address.defaultAddress && (
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-amber-950 bg-gradient-to-r from-amber-100 via-amber-200 to-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300/80 uppercase tracking-wider shadow-2xs">
                  <FiStar className="h-2.5 w-2.5 fill-amber-700 text-amber-700" /> Default
                </span>
              )}
            </div>

            {/* Phone */}
            {address.phoneNumber && (
              <p className="text-xs text-stone-600 font-medium font-mono flex items-center gap-1.5 pt-0.5">
                <FiPhone className="h-3 w-3 text-amber-800 shrink-0" />
                <span>{address.phoneNumber}</span>
                <button
                  type="button"
                  onClick={copyPhoneNumber}
                  className="p-0.5 text-stone-400 hover:text-amber-900 transition-colors"
                  title="Copy phone number"
                >
                  <FiCopy className="h-3 w-3" />
                </button>
              </p>
            )}

            {/* Complete Address */}
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed pt-1 font-body">
              {address.addressLine1}
              {address.addressLine2 ? `, ${address.addressLine2}` : ''}
              <br />
              <strong className="text-amber-950 font-bold">
                {address.city}, {address.state} — {address.postalCode}
              </strong>
              {address.country && address.country !== 'India' && (
                <span className="text-stone-500 font-medium"> ({address.country})</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-2 pt-3 border-t border-amber-900/10 font-display">
        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(address);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 hover:text-amber-950 px-3 py-1.5 rounded-xl bg-amber-100/50 hover:bg-amber-100 border border-amber-200/50 transition-colors min-h-[36px]"
            >
              <FiEdit2 className="h-3.5 w-3.5 text-amber-800" />
              <span>Edit</span>
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(address.id);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 hover:text-rose-800 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200/40 transition-colors min-h-[36px]"
            >
              <FiTrash2 className="h-3.5 w-3.5 text-rose-600" />
              <span>Delete</span>
            </button>
          )}
        </div>

        {/* Set Default Action */}
        {onSetDefault && !address.defaultAddress && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSetDefault(address.id);
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-950 hover:text-amber-950 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-50 to-amber-100/80 hover:bg-amber-100 border border-amber-300/60 transition-colors min-h-[36px] shadow-2xs"
          >
            <FiCheckCircle className="h-3.5 w-3.5 text-amber-800" />
            <span>Set Default</span>
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ----------------------------------------------------
// Main Mobile/Tablet Full-Screen Address View
// ----------------------------------------------------
export default function MobileShippingAddress({
  addresses = [],
  isLoading = false,
  isError = false,
  onRetry,
  selectedId,
  onSelect,
  onCreate,
  onUpdate,
  onDelete,
  onSetDefault,
  onContinue,
  onBack,
  mode = 'checkout',
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const inputRefs = useRef([]);

  const addrList = useMemo(() => (Array.isArray(addresses) ? addresses : []), [addresses]);

  const handleOpenCreate = () => {
    setEditingAddress(null);
    setFormData(INITIAL_FORM);
    setErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (addr) => {
    setEditingAddress(addr);
    setFormData({
      fullName: addr.fullName || '',
      phoneNumber: addr.phoneNumber || '',
      addressLine1: addr.addressLine1 || '',
      addressLine2: addr.addressLine2 || '',
      city: addr.city || '',
      state: addr.state || 'Uttar Pradesh',
      postalCode: addr.postalCode || '',
      country: addr.country || 'India',
      defaultAddress: addr.defaultAddress || false,
      addressType: addr.addressType || (addr.label === 'Office' ? 'OFFICE' : 'HOME'),
    });
    setErrors({});
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (isModalOpen) {
      const timer = setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isModalOpen]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full name is required';
    if (!formData.phoneNumber.trim()) {
      errs.phoneNumber = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phoneNumber.trim())) {
      errs.phoneNumber = 'Enter a valid 10-digit phone number';
    }
    if (!formData.addressLine1.trim()) errs.addressLine1 = 'Address line 1 is required';
    if (!formData.city.trim()) errs.city = 'City is required';
    if (!formData.state.trim()) errs.state = 'State is required';
    if (!formData.postalCode.trim()) {
      errs.postalCode = 'PIN code is required';
    } else if (formData.postalCode.trim().length < 5) {
      errs.postalCode = 'Enter a valid PIN code';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFormSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        fullName: formData.fullName.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        addressLine1: formData.addressLine1.trim(),
        addressLine2: formData.addressLine2 ? formData.addressLine2.trim() : '',
        city: formData.city.trim(),
        state: formData.state.trim(),
        postalCode: formData.postalCode.trim(),
        country: formData.country ? formData.country.trim() : 'India',
        defaultAddress: !!formData.defaultAddress,
        addressType: formData.addressType || 'HOME',
      };

      if (editingAddress) {
        await onUpdate?.(editingAddress.id, payload);
        toast.success('Address updated successfully');
      } else {
        await onCreate?.(payload);
        toast.success('Address saved successfully');
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err?.message || 'Failed to save address');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (index < 6) {
        inputRefs.current[index + 1]?.focus();
      } else {
        handleFormSubmit();
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    try {
      await onDelete?.(deleteTargetId);
      toast.success('Address deleted');
      setDeleteTargetId(null);
    } catch {
      toast.error('Failed to delete address');
    }
  };

  return (
    <div className="fixed inset-0 z-[45] bg-[#FAF7F2] font-display flex flex-col justify-between overflow-y-auto lg:hidden">
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
            {mode === 'management' ? 'Saved Addresses' : 'Shipping Address'}
          </h1>
          <p className="text-[11px] font-bold text-amber-800 tracking-tight">
            {mode === 'management' ? 'Manage Delivery Locations' : 'Step 1 of Checkout'}
          </p>
        </div>

        {mode === 'management' ? (
          <button
            type="button"
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-800 to-amber-950 text-white font-extrabold text-xs shadow-xs hover:shadow-sm transition-all active:scale-95 min-h-[36px]"
          >
            <FiPlus className="w-4 h-4 text-amber-200" />
            <span className="hidden sm:inline">Add New</span>
          </button>
        ) : (
          <div className="w-9" />
        )}
      </header>

      {/* ---------------------------------------------------- */}
      {/* MAIN CONTENT CONTAINER */}
      {/* ---------------------------------------------------- */}
      <main className={cn('flex-1 w-full max-w-5xl mx-auto px-4 md:px-6 py-4 md:py-6 space-y-4', mode === 'checkout' ? 'pb-28' : 'pb-12')}>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AddressCardSkeleton />
            <AddressCardSkeleton />
          </div>
        ) : isError ? (
          <div className="text-center py-10 rounded-[20px] bg-white border border-rose-200 p-6 shadow-2xs space-y-3 font-body my-4">
            <p className="text-sm font-bold text-rose-700">Failed to load shipping addresses</p>
            <button
              type="button"
              onClick={onRetry}
              className="px-4 py-2.5 rounded-xl bg-amber-900 text-white font-bold text-xs min-h-[40px]"
            >
              Retry Loading Addresses
            </button>
          </div>
        ) : addrList.length === 0 ? (
          <AddressEmptyState onAdd={handleOpenCreate} />
        ) : (
          <>
            {/* Address Cards Grid: 1-column on Mobile (<768px), 2-column on Tablet (768-1023px) */}
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-3.5 md:gap-4.5"
              role={mode === 'checkout' ? 'radiogroup' : undefined}
              aria-label="Delivery addresses"
            >
              {addrList.map((addr) => (
                <RebuiltAddressCard
                  key={addr.id}
                  address={addr}
                  isSelected={selectedId === addr.id}
                  onSelect={onSelect}
                  onEdit={handleOpenEdit}
                  onDelete={(id) => setDeleteTargetId(id)}
                  onSetDefault={onSetDefault}
                  mode={mode}
                />
              ))}
            </div>

            {/* ADD NEW ADDRESS CARD CTA */}
            <button
              type="button"
              onClick={handleOpenCreate}
              className="w-full h-[68px] sm:h-[76px] rounded-[20px] border-2 border-dashed border-amber-900/25 hover:border-amber-700/60 bg-gradient-to-r from-amber-50/30 via-white to-amber-50/30 hover:bg-amber-50/60 transition-all flex items-center justify-center gap-3 px-4 shadow-2xs active:scale-[0.99] font-display mt-2"
            >
              <div className="w-10 h-10 rounded-full bg-amber-900 text-white flex items-center justify-center shadow-2xs">
                <FiPlus className="w-5 h-5 text-amber-100" />
              </div>
              <span className="font-heading font-extrabold text-amber-950 text-sm sm:text-base">
                Add New Address
              </span>
            </button>
          </>
        )}
      </main>

      {/* ---------------------------------------------------- */}
      {/* STICKY BOTTOM BAR (CHECKOUT MODE ONLY) */}
      {/* ---------------------------------------------------- */}
      {mode === 'checkout' && (
        <footer className="fixed bottom-0 left-0 right-0 z-30 h-[72px] bg-white/95 backdrop-blur-md border-t border-amber-900/10 px-4 md:px-6 flex items-center justify-center shadow-lg font-display">
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="button"
            disabled={!selectedId || isLoading || addrList.length === 0}
            onClick={onContinue}
            className="w-full max-w-lg h-[52px] rounded-[16px] bg-gradient-to-r from-amber-700 via-amber-800 to-amber-950 hover:from-amber-800 hover:to-stone-950 text-white font-extrabold text-sm sm:text-base shadow-md flex items-center justify-center gap-2 border border-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <span>Deliver to This Address</span>
            <FiArrowRight className="w-5 h-5 text-amber-200" />
          </motion.button>
        </footer>
      )}

      {/* ---------------------------------------------------- */}
      {/* ADDRESS FORM MODAL / BOTTOM SHEET */}
      {/* ---------------------------------------------------- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-stone-950/60 backdrop-blur-xs p-0 md:p-4">
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="w-full max-w-lg md:max-w-xl bg-white rounded-t-[28px] md:rounded-[28px] shadow-2xl overflow-hidden font-display flex flex-col max-h-[92vh]"
            >
              {/* Form Modal Header */}
              <div className="px-5 py-4 border-b border-amber-900/10 flex items-center justify-between bg-amber-50/30">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center">
                    <FiMapPin className="w-4 h-4" />
                  </div>
                  <h2 className="font-heading font-extrabold text-base text-amber-950">
                    {editingAddress ? 'Edit Delivery Address' : 'Add New Delivery Address'}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors min-h-[32px] min-w-[32px]"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>

              {/* Form Body with 14px Input Spacing */}
              <form onSubmit={handleFormSubmit} className="p-5 space-y-[14px] overflow-y-auto flex-1 font-display">
                {/* Address Type Selector */}
                <div className="flex items-center gap-3 pb-1">
                  <span className="text-xs font-bold text-amber-950">Address Type:</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, addressType: 'HOME' }))}
                      className={cn(
                        'flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold border transition-all min-h-[36px]',
                        formData.addressType === 'HOME'
                          ? 'bg-amber-900 text-white border-amber-900 shadow-xs'
                          : 'bg-white text-stone-600 border-amber-900/20 hover:bg-amber-50/50',
                      )}
                    >
                      <FiHome className="w-3.5 h-3.5" /> Home
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, addressType: 'OFFICE' }))}
                      className={cn(
                        'flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold border transition-all min-h-[36px]',
                        formData.addressType === 'OFFICE'
                          ? 'bg-amber-900 text-white border-amber-900 shadow-xs'
                          : 'bg-white text-stone-600 border-amber-900/20 hover:bg-amber-50/50',
                      )}
                    >
                      <FiBriefcase className="w-3.5 h-3.5" /> Office
                    </button>
                  </div>
                </div>

                {/* 1. Full Name */}
                <FloatingInput
                  id="mobile-addr-fullName"
                  name="fullName"
                  label="Full Name"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  inputRef={(el) => (inputRefs.current[0] = el)}
                  onKeyDown={(e) => handleKeyDown(e, 0)}
                  error={errors.fullName}
                  autoComplete="name"
                  enterKeyHint="next"
                />

                {/* 2. Phone Number */}
                <FloatingInput
                  id="mobile-addr-phoneNumber"
                  name="phoneNumber"
                  label="Mobile Phone Number"
                  type="tel"
                  inputMode="numeric"
                  required
                  maxLength={10}
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  inputRef={(el) => (inputRefs.current[1] = el)}
                  onKeyDown={(e) => handleKeyDown(e, 1)}
                  error={errors.phoneNumber}
                  autoComplete="tel"
                  enterKeyHint="next"
                />

                {/* 3. Address Line 1 */}
                <FloatingInput
                  id="mobile-addr-addressLine1"
                  name="addressLine1"
                  label="Flat, House No., Building, Street"
                  required
                  value={formData.addressLine1}
                  onChange={handleInputChange}
                  inputRef={(el) => (inputRefs.current[2] = el)}
                  onKeyDown={(e) => handleKeyDown(e, 2)}
                  error={errors.addressLine1}
                  autoComplete="address-line1"
                  enterKeyHint="next"
                />

                {/* 4. Address Line 2 */}
                <FloatingInput
                  id="mobile-addr-addressLine2"
                  name="addressLine2"
                  label="Area, Colony, Sector, Landmark (Optional)"
                  value={formData.addressLine2}
                  onChange={handleInputChange}
                  inputRef={(el) => (inputRefs.current[3] = el)}
                  onKeyDown={(e) => handleKeyDown(e, 3)}
                  autoComplete="address-line2"
                  enterKeyHint="next"
                />

                {/* City & State Row (2-column on tablet and mobile >400px) */}
                <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-[14px]">
                  <FloatingInput
                    id="mobile-addr-city"
                    name="city"
                    label="City"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    inputRef={(el) => (inputRefs.current[4] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 4)}
                    error={errors.city}
                    autoComplete="address-level2"
                    enterKeyHint="next"
                  />

                  <div className="relative w-full h-[50px] rounded-[14px] border border-amber-900/20 bg-white overflow-hidden flex items-center font-display">
                    <label
                      htmlFor="mobile-addr-state"
                      className="absolute left-3.5 top-1.5 text-[10px] font-extrabold uppercase tracking-wider text-amber-900 pointer-events-none"
                    >
                      State *
                    </label>
                    <select
                      id="mobile-addr-state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full h-full bg-transparent px-3.5 pt-4 pb-1 text-xs sm:text-sm font-bold text-amber-950 outline-none cursor-pointer"
                    >
                      {STATE_OPTIONS.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* PIN Code & Country Row (2-column on tablet and mobile >400px) */}
                <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-[14px]">
                  <FloatingInput
                    id="mobile-addr-postalCode"
                    name="postalCode"
                    label="PIN Code"
                    type="text"
                    inputMode="numeric"
                    required
                    maxLength={6}
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    inputRef={(el) => (inputRefs.current[5] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 5)}
                    error={errors.postalCode}
                    autoComplete="postal-code"
                    enterKeyHint="next"
                  />

                  <FloatingInput
                    id="mobile-addr-country"
                    name="country"
                    label="Country"
                    required
                    value={formData.country}
                    onChange={handleInputChange}
                    inputRef={(el) => (inputRefs.current[6] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 6)}
                    autoComplete="country-name"
                    enterKeyHint="done"
                  />
                </div>

                {/* Default Address Checkbox */}
                <label className="flex items-center gap-2 text-xs font-bold text-amber-950 cursor-pointer pt-1 select-none">
                  <input
                    type="checkbox"
                    name="defaultAddress"
                    checked={formData.defaultAddress}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-amber-900/30 text-amber-900 focus:ring-amber-800 cursor-pointer"
                  />
                  <span>Set as default shipping address</span>
                </label>

                {/* Submit / Action Bar */}
                <div className="pt-3 border-t border-amber-900/10 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 h-[44px] rounded-xl border border-amber-900/20 text-xs font-bold text-stone-600 hover:bg-stone-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 h-[44px] rounded-xl bg-amber-900 hover:bg-amber-950 text-white font-extrabold text-xs shadow-md disabled:opacity-50 flex items-center gap-2 transition-all active:scale-95"
                  >
                    {isSubmitting ? (
                      <span>Saving...</span>
                    ) : (
                      <span>{editingAddress ? 'Update Address' : 'Save Address'}</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Address"
        message="Are you sure you want to remove this delivery address?"
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}

