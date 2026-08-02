import { useState, memo, useCallback } from 'react';
import { cn } from '@/utils/cn';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import Modal from '@/components/overlay/Modal';

const AddressForm = memo(function AddressForm({ initial, onSubmit, onCancel, isLoading }) {
  const [form, setForm] = useState({
    fullName: initial?.fullName || '',
    phoneNumber: initial?.phoneNumber || '',
    addressLine1: initial?.addressLine1 || '',
    addressLine2: initial?.addressLine2 || '',
    city: initial?.city || '',
    state: initial?.state || '',
    country: initial?.country || 'India',
    postalCode: initial?.postalCode || '',
    defaultAddress: initial?.defaultAddress || false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  const fields = [
    { label: 'Full Name', name: 'fullName', required: true },
    { label: 'Phone Number', name: 'phoneNumber', type: 'tel', required: true, pattern: '[6-9]\\d{9}' },
    { label: 'Address Line 1', name: 'addressLine1', required: true },
    { label: 'Address Line 2', name: 'addressLine2' },
    { label: 'City', name: 'city', required: true },
    { label: 'State', name: 'state', required: true },
    { label: 'Country', name: 'country', required: true },
    { label: 'Postal Code', name: 'postalCode', required: true },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {fields.map((f) => (
          <div key={f.name} className={f.name === 'addressLine1' || f.name === 'addressLine2' ? 'sm:col-span-2' : ''}>
            <label htmlFor={`addr-${f.name}`} className="block text-sm font-medium text-dark-charcoal mb-1">
              {f.label} {f.required && <span className="text-error">*</span>}
            </label>
            <input
              id={`addr-${f.name}`}
              name={f.name}
              type={f.type || 'text'}
              value={form[f.name]}
              onChange={handleChange}
              required={f.required}
              pattern={f.pattern}
              className="w-full rounded border border-muted-sand px-3 py-2 text-sm text-dark-charcoal focus:border-royal-blue focus:ring-1 focus:ring-royal-blue outline-none"
            />
          </div>
        ))}
      </div>
      <label className="flex items-center gap-2 text-sm text-dark-charcoal cursor-pointer">
        <input
          type="checkbox"
          name="defaultAddress"
          checked={form.defaultAddress}
          onChange={handleChange}
          className="rounded border-muted-sand text-royal-blue focus:ring-royal-blue"
        />
        Set as default address
      </label>
      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {initial ? 'Update Address' : 'Add Address'}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
});

function AddressSelector({ addresses, isLoading, isError, onRetry, selectedId, onSelect, onCreate, onUpdate, onDelete, onSetDefault }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [mutLoading, setMutLoading] = useState(false);

  const handleCreate = useCallback(async (data) => {
    setMutLoading(true);
    try {
      await onCreate(data);
      setShowForm(false);
    } finally {
      setMutLoading(false);
    }
  }, [onCreate]);

  const handleUpdate = useCallback(async (data) => {
    setMutLoading(true);
    try {
      await onUpdate(editing.id, data);
      setEditing(null);
    } finally {
      setMutLoading(false);
    }
  }, [onUpdate, editing]);

  if (isLoading) {
    return <div className="flex justify-center py-8"><Spinner size="md" /></div>;
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-error mb-2">Failed to load addresses</p>
        <Button variant="ghost" size="sm" onClick={onRetry}>Retry</Button>
      </div>
    );
  }

  const addrList = Array.isArray(addresses) ? addresses : [];

  return (
    <div>
      <div className="flex flex-col items-stretch gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="font-display text-lg font-semibold text-dark-charcoal">Shipping Address</h3>
        {!showForm && !editing && (
          <Button variant="outline" size="sm" onClick={() => setShowForm(true)}>
            + Add New
          </Button>
        )}
      </div>

      {showForm && (
        <div className="mb-4 p-4 rounded-lg border border-muted-sand/30 bg-white">
          <h4 className="text-sm font-medium text-dark-charcoal mb-3">New Address</h4>
          <AddressForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} isLoading={mutLoading} />
        </div>
      )}

      {editing && (
        <div className="mb-4 p-4 rounded-lg border border-muted-sand/30 bg-white">
          <h4 className="text-sm font-medium text-dark-charcoal mb-3">Edit Address</h4>
          <AddressForm initial={editing} onSubmit={handleUpdate} onCancel={() => setEditing(null)} isLoading={mutLoading} />
        </div>
      )}

      {addrList.length === 0 && !showForm && (
        <div className="text-center py-8 text-natural-wood text-sm">
          No addresses saved yet. Add one to continue.
        </div>
      )}

      <div className="space-y-3" role="radiogroup" aria-label="Select shipping address">
        {addrList.map((addr) => (
          <div
            key={addr.id}
            className={cn(
              'relative rounded-lg border p-4 cursor-pointer transition-all duration-150',
              selectedId === addr.id
                ? 'border-royal-blue bg-royal-blue/5 ring-1 ring-royal-blue'
                : 'border-muted-sand/30 bg-white hover:border-muted-sand',
            )}
            onClick={() => onSelect(addr.id)}
            role="radio"
            aria-checked={selectedId === addr.id}
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(addr.id); } }}
          >
            <div className="flex items-start gap-3">
              <div className={cn(
                'mt-0.5 h-4 w-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center',
                selectedId === addr.id ? 'border-royal-blue' : 'border-muted-sand',
              )}>
                {selectedId === addr.id && <div className="h-2 w-2 rounded-full bg-royal-blue" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-dark-charcoal">{addr.fullName}</p>
                <p className="text-xs text-natural-wood mt-0.5">{addr.phoneNumber}</p>
                <p className="text-xs text-natural-wood mt-0.5">
                  {addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}<br />
                  {addr.city}, {addr.state} - {addr.postalCode}
                </p>
                <div className="flex gap-3 mt-2">
                  {addr.defaultAddress && (
                    <span className="text-xs font-medium text-success">Default</span>
                  )}
                  {!addr.defaultAddress && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onSetDefault(addr.id); }}
                      className="text-xs text-royal-blue hover:underline"
                    >
                      Set as default
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setEditing(addr); }}
                    className="text-xs text-natural-wood hover:text-royal-blue"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onDelete(addr.id); }}
                    className="text-xs text-error hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AddressSelector;
