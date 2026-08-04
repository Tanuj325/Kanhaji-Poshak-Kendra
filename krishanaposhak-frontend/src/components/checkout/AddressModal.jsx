import { useState, useEffect, memo } from 'react';
import Modal from '@/components/overlay/Modal';
import Button from '@/components/ui/Button';

const AddressModal = memo(function AddressModal({
  isOpen,
  onClose,
  initialData,
  onSubmit,
  isLoading = false,
}) {
  const [form, setForm] = useState({
    fullName: '',
    phoneNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: 'India',
    postalCode: '',
    defaultAddress: false,
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        fullName: initialData.fullName || '',
        phoneNumber: initialData.phoneNumber || '',
        addressLine1: initialData.addressLine1 || '',
        addressLine2: initialData.addressLine2 || '',
        city: initialData.city || '',
        state: initialData.state || '',
        country: initialData.country || 'India',
        postalCode: initialData.postalCode || '',
        defaultAddress: initialData.defaultAddress || false,
      });
    } else {
      setForm({
        fullName: '',
        phoneNumber: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        country: 'India',
        postalCode: '',
        defaultAddress: false,
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  const fields = [
    { label: 'Full Name *', name: 'fullName', required: true, placeholder: 'e.g. Rahul Sharma' },
    { label: 'Mobile Phone Number *', name: 'phoneNumber', type: 'tel', required: true, pattern: '[6-9]\\d{9}', placeholder: '10-digit mobile number' },
    { label: 'Flat, House No., Building *', name: 'addressLine1', required: true, placeholder: 'House/Flat No, Street, Landmark' },
    { label: 'Area, Colony, Sector', name: 'addressLine2', placeholder: 'Near temple, market, etc.' },
    { label: 'City *', name: 'city', required: true, placeholder: 'e.g. Meerut' },
    { label: 'State *', name: 'state', required: true, placeholder: 'e.g. Uttar Pradesh' },
    { label: 'Pincode / Postal Code *', name: 'postalCode', required: true, placeholder: '6-digit pincode' },
    { label: 'Country', name: 'country', required: true },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Shipping Address' : 'Add New Shipping Address'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2 font-display">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {fields.map((f) => (
            <div key={f.name} className={f.name === 'addressLine1' || f.name === 'addressLine2' ? 'sm:col-span-2' : ''}>
              <label htmlFor={`modal-addr-${f.name}`} className="block text-xs font-bold uppercase tracking-wider text-amber-950 mb-1">
                {f.label}
              </label>
              <input
                id={`modal-addr-${f.name}`}
                name={f.name}
                type={f.type || 'text'}
                value={form[f.name]}
                onChange={handleChange}
                required={f.required}
                pattern={f.pattern}
                placeholder={f.placeholder}
                className="w-full rounded-xl border border-amber-900/20 bg-amber-50/20 px-3.5 py-2.5 text-xs font-bold text-amber-950 focus:border-amber-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-800/20 font-body transition-all"
              />
            </div>
          ))}
        </div>

        <label className="flex items-center gap-2 text-xs font-bold text-amber-950 cursor-pointer pt-1">
          <input
            type="checkbox"
            name="defaultAddress"
            checked={form.defaultAddress}
            onChange={handleChange}
            className="rounded border-amber-900/20 text-amber-900 focus:ring-amber-800"
          />
          Set as default shipping address
        </label>

        <div className="flex flex-col-reverse sm:flex-row gap-2.5 pt-4 border-t border-amber-900/10 sm:justify-end">
          <Button type="button" variant="outline" onClick={onClose} className="rounded-xl min-h-[44px]">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            className="rounded-xl bg-amber-900 text-white font-bold min-h-[44px]"
          >
            {initialData ? 'Update Address' : 'Save & Use Address'}
          </Button>
        </div>
      </form>
    </Modal>
  );
});

export default AddressModal;
