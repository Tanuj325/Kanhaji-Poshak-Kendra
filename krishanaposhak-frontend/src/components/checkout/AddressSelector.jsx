import { useState, memo, useCallback } from 'react';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import AddressCard from './AddressCard';
import AddressModal from './AddressModal';
import { FiMapPin, FiPlus } from 'react-icons/fi';

const AddressSelector = memo(function AddressSelector({
  addresses,
  isLoading,
  isError,
  onRetry,
  selectedId,
  onSelect,
  onCreate,
  onUpdate,
  onDelete,
  onSetDefault,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [mutLoading, setMutLoading] = useState(false);

  const handleOpenCreate = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (addr) => {
    setEditingAddress(addr);
    setIsModalOpen(true);
  };

  const handleFormSubmit = useCallback(
    async (formData) => {
      setMutLoading(true);
      try {
        if (editingAddress) {
          await onUpdate(editingAddress.id, formData);
        } else {
          await onCreate(formData);
        }
        setIsModalOpen(false);
      } finally {
        setMutLoading(false);
      }
    },
    [editingAddress, onCreate, onUpdate],
  );

  if (isLoading) {
    return (
      <div className="py-12 text-center rounded-2xl bg-white border border-amber-900/10 p-6">
        <Spinner label="Loading saved addresses..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8 rounded-2xl bg-white border border-rose-200 p-6">
        <p className="text-sm font-bold text-rose-700 mb-3 font-display">Failed to load shipping addresses</p>
        <Button variant="outline" size="sm" onClick={onRetry} className="rounded-xl min-h-[40px]">
          Retry Loading Addresses
        </Button>
      </div>
    );
  }

  const addrList = Array.isArray(addresses) ? addresses : [];

  return (
    <div className="space-y-4 font-display">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap pb-2">
        <div>
          <h3 className="font-heading text-lg sm:text-xl font-bold text-amber-950 flex items-center gap-2">
            <FiMapPin className="h-5 w-5 text-amber-800" />
            <span>Select Shipping Address</span>
          </h3>
          <p className="text-xs text-stone-500 font-body">Choose where your sacred order will be delivered</p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleOpenCreate}
          leftIcon={<FiPlus className="h-4 w-4" />}
          className="rounded-xl bg-amber-900 hover:bg-amber-950 text-white font-bold py-2.5 px-4 min-h-[40px]"
        >
          Add New Address
        </Button>
      </div>

      {/* Address Cards Grid */}
      {addrList.length === 0 ? (
        <div className="text-center py-10 px-4 rounded-2xl bg-white border border-dashed border-amber-900/20 space-y-3 font-body">
          <p className="text-sm font-bold text-amber-950">No saved addresses found</p>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Please add a delivery address to complete your checkout and receive express shipping updates.
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenCreate}
            leftIcon={<FiPlus className="h-4 w-4" />}
            className="rounded-xl bg-amber-900 text-white font-bold min-h-[44px]"
          >
            Add Delivery Address Now
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5" role="radiogroup" aria-label="Select shipping address">
          {addrList.map((addr) => (
            <AddressCard
              key={addr.id}
              address={addr}
              isSelected={selectedId === addr.id}
              onSelect={onSelect}
              onEdit={handleOpenEdit}
              onDelete={onDelete}
              onSetDefault={onSetDefault}
            />
          ))}
        </div>
      )}

      {/* Modal Form */}
      <AddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingAddress}
        onSubmit={handleFormSubmit}
        isLoading={mutLoading}
      />
    </div>
  );
});

export default AddressSelector;
