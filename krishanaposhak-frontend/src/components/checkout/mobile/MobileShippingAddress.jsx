import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import Spinner from '@/components/ui/Spinner';
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
  FiAlertCircle,
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
// Premium Floating Label Input Component (52px height, 14px rounded)
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
          'relative w-full h-[52px] rounded-[14px] border transition-all duration-200 bg-white font-display overflow-hidden flex items-center',
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
// Rebuilt Mobile Address Card (100% width, 18px rounded, 16px padding, Temple Gold)
// ----------------------------------------------------
function RebuiltAddressCard({
  address,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}) {
  if (!address) return null;

  const isOffice = address.addressType === 'OFFICE' || address.label === 'Office';

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
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
        'relative w-full rounded-[18px] p-4 transition-all duration-200 cursor-pointer font-display overflow-hidden text-left flex flex-col justify-between gap-3',
        isSelected
          ? 'border-2 border-[#D4AF37] bg-[#FAF4E8] shadow-md ring-2 ring-[#D4AF37]/20'
          : 'border border-amber-900/10 bg-white hover:border-amber-700/30 shadow-xs hover:shadow-sm',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          {/* Custom Radio Circle */}
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

          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-heading font-extrabold text-sm sm:text-base text-amber-950 truncate">
                {address.fullName}
              </span>

              {/* Home / Office Badge */}
              <span
                className={cn(
                  'inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full border uppercase tracking-wider',
                  isOffice
                    ? 'bg-blue-50 text-blue-900 border-blue-200/80'
                    : 'bg-amber-100/80 text-amber-950 border-amber-300/60',
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

              {/* Default Badge */}
              {address.defaultAddress && (
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-amber-950 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200 px-2 py-0.5 rounded-full border border-amber-400/60 uppercase tracking-wider shadow-2xs">
                  <FiStar className="h-2.5 w-2.5 fill-amber-800 text-amber-800" /> Default
                </span>
              )}
            </div>

            {/* Phone */}
            {address.phoneNumber && (
              <p className="text-xs text-stone-600 font-medium font-mono flex items-center gap-1.5 pt-0.5">
                <FiPhone className="h-3 w-3 text-amber-800 shrink-0" />
                <span>{address.phoneNumber}</span>
              </p>
            )}

            {/* Complete Address */}
            <p className="text-xs text-stone-700 leading-relaxed pt-1 font-body">
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

      {/* Action Buttons: Edit & Delete */}
      <div className="flex items-center justify-end gap-2 pt-2 border-t border-amber-900/10">
        {onEdit && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(address);
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 hover:text-amber-950 px-3 py-1.5 rounded-xl bg-amber-100/50 hover:bg-amber-100 transition-colors min-h-[36px]"
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
            className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 hover:text-rose-800 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 transition-colors min-h-[36px]"
          >
            <FiTrash2 className="h-3.5 w-3.5 text-rose-600" />
            <span>Delete</span>
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ----------------------------------------------------
// Main Mobile Shipping Address Page Component
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

  // Field refs for Next keyboard navigation
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

  // Auto focus first input when modal opens
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

  // Keyboard navigation handler: Next field on Enter key, Done on final field
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
    <div className="min-h-screen bg-[#FAF7F2] font-display flex flex-col justify-between">
      {/* ---------------------------------------------------- */}
      {/* STICKY HEADER (54px height) */}
      {/* ---------------------------------------------------- */}
      <header className="sticky top-0 z-40 w-full h-[54px] bg-white/95 backdrop-blur-md border-b border-amber-900/10 px-4 flex items-center justify-between shadow-2xs">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-amber-50 text-amber-950 hover:bg-amber-100 transition-colors border border-amber-900/10 active:scale-95 min-h-[36px] min-w-[36px]"
          aria-label="Go back"
        >
          <FiChevronLeft className="w-5 h-5 text-amber-900" />
        </button>

        <div className="text-center min-w-0 px-2">
          <h1 className="font-heading text-base font-extrabold text-amber-950 truncate leading-tight">
            Shipping Address
          </h1>
          <p className="text-[11px] font-bold text-amber-800 tracking-tight">
            Step 1 of Checkout
          </p>
        </div>

        <div className="w-9" />
      </header>

      {/* ---------------------------------------------------- */}
      {/* MAIN CONTENT (16px outer padding, 12px card spacing) */}
      {/* ---------------------------------------------------- */}
      <main className="flex-1 px-4 py-4 space-y-3 pb-28">
        {isLoading ? (
          <div className="py-16 text-center rounded-[18px] bg-white border border-amber-900/10 p-6 shadow-xs">
            <Spinner label="Loading delivery addresses..." />
          </div>
        ) : isError ? (
          <div className="text-center py-10 rounded-[18px] bg-white border border-rose-200 p-6 shadow-xs space-y-3 font-body">
            <p className="text-sm font-bold text-rose-700">Failed to load shipping addresses</p>
            <button
              type="button"
              onClick={onRetry}
              className="px-4 py-2.5 rounded-xl bg-amber-900 text-white font-bold text-xs min-h-[40px]"
            >
              Retry Loading Addresses
            </button>
          </div>
        ) : (
          <>
            {/* Address List Cards */}
            {addrList.length > 0 && (
              <div className="space-y-3" role="radiogroup" aria-label="Select shipping address">
                {addrList.map((addr) => (
                  <RebuiltAddressCard
                    key={addr.id}
                    address={addr}
                    isSelected={selectedId === addr.id}
                    onSelect={onSelect}
                    onEdit={handleOpenEdit}
                    onDelete={(id) => setDeleteTargetId(id)}
                  />
                ))}
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* ADD NEW ADDRESS CARD (Dashed Border, Plus Icon, Rounded 18px, Height 72px) */}
            {/* ---------------------------------------------------- */}
            <button
              type="button"
              onClick={handleOpenCreate}
              className="w-full h-[72px] rounded-[18px] border-2 border-dashed border-amber-900/25 hover:border-amber-700/60 bg-amber-50/20 hover:bg-amber-50/50 transition-all flex items-center justify-center gap-3 px-4 shadow-xs active:scale-[0.99] font-display"
            >
              <div className="w-9 h-9 rounded-full bg-amber-900/10 text-amber-900 flex items-center justify-center">
                <FiPlus className="w-5 h-5 text-amber-900" />
              </div>
              <span className="font-heading font-bold text-amber-950 text-sm">
                Add New Shipping Address
              </span>
            </button>
          </>
        )}
      </main>

      {/* ---------------------------------------------------- */}
      {/* STICKY BOTTOM BAR (72px height, 52px button, Temple Gold Gradient) */}
      {/* ---------------------------------------------------- */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 h-[72px] bg-white/95 backdrop-blur-md border-t border-amber-900/10 px-4 flex items-center justify-center shadow-lg font-display">
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

      {/* ---------------------------------------------------- */}
      {/* ADDRESS FORM MODAL / BOTTOM SHEET */}
      {/* ---------------------------------------------------- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-stone-950/60 backdrop-blur-xs p-0 sm:p-4">
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="w-full max-w-lg bg-white rounded-t-[24px] sm:rounded-[24px] shadow-2xl overflow-hidden font-display flex flex-col max-h-[90vh]"
            >
              {/* Form Modal Header */}
              <div className="px-5 py-4 border-b border-amber-900/10 flex items-center justify-between bg-amber-50/30">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center">
                    <FiMapPin className="w-4 h-4" />
                  </div>
                  <h2 className="font-heading font-extrabold text-base text-amber-950">
                    {editingAddress ? 'Edit Shipping Address' : 'Add New Shipping Address'}
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
                {/* Address Type Selector (Home / Office) */}
                <div className="flex items-center gap-3 pb-1">
                  <span className="text-xs font-bold text-amber-950">Address Type:</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, addressType: 'HOME' }))}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all min-h-[36px]',
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
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all min-h-[36px]',
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

                {/* City & State Row */}
                <div className="grid grid-cols-2 gap-[14px]">
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

                  <div className="relative w-full h-[52px] rounded-[14px] border border-amber-900/20 bg-white overflow-hidden flex items-center font-display">
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

                {/* PIN Code & Country Row */}
                <div className="grid grid-cols-2 gap-[14px]">
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
                    className="px-4 h-[44px] rounded-xl border border-amber-900/20 text-xs font-bold text-stone-600 hover:bg-stone-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 h-[44px] rounded-xl bg-amber-900 hover:bg-amber-950 text-white font-extrabold text-xs shadow-md disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>Saving...</span>
                    ) : (
                      <span>{editingAddress ? 'Update Address' : 'Save & Use Address'}</span>
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
