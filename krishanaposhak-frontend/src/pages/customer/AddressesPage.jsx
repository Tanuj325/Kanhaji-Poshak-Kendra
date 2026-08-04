import { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import { AddressCard } from '@/components/customer';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import Modal from '@/components/overlay/Modal';
import ConfirmDialog from '@/components/overlay/ConfirmDialog';
import Input from '@/components/forms/Input';
import Select from '@/components/forms/Select';
import Textarea from '@/components/forms/Textarea';
import Checkbox from '@/components/forms/Checkbox';
import {
  useAddresses,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
} from '@/hooks/useAddresses';
import { siteConfig } from '@/config/siteConfig';
import { getErrorMessage } from '@/utils/apiErrorParser';
import toast from 'react-hot-toast';
import { FiMapPin, FiPlus } from 'react-icons/fi';

const breadcrumbItems = [
  { label: 'Home', href: '/' },
  { label: 'My Account', href: '/account/profile' },
  { label: 'Address Book' },
];

const stateOptions = [
  { value: 'ANDAMAN_AND_NICOBAR_ISLANDS', label: 'Andaman and Nicobar Islands' },
  { value: 'ANDHRA_PRADESH', label: 'Andhra Pradesh' },
  { value: 'ARUNACHAL_PRADESH', label: 'Arunachal Pradesh' },
  { value: 'ASSAM', label: 'Assam' },
  { value: 'BIHAR', label: 'Bihar' },
  { value: 'CHANDIGARH', label: 'Chandigarh' },
  { value: 'CHHATTISGARH', label: 'Chhattisgarh' },
  { value: 'DADRA_AND_NAGAR_HAVELI_AND_DAMAN_AND_DIU', label: 'Dadra and Nagar Haveli and Daman and Diu' },
  { value: 'DELHI', label: 'Delhi' },
  { value: 'GOA', label: 'Goa' },
  { value: 'GUJARAT', label: 'Gujarat' },
  { value: 'HARYANA', label: 'Haryana' },
  { value: 'HIMACHAL_PRADESH', label: 'Himachal Pradesh' },
  { value: 'JAMMU_AND_KASHMIR', label: 'Jammu and Kashmir' },
  { value: 'JHARKHAND', label: 'Jharkhand' },
  { value: 'KARNATAKA', label: 'Karnataka' },
  { value: 'KERALA', label: 'Kerala' },
  { value: 'LADAKH', label: 'Ladakh' },
  { value: 'LAKSHADWEEP', label: 'Lakshadweep' },
  { value: 'MADHYA_PRADESH', label: 'Madhya Pradesh' },
  { value: 'MAHARASHTRA', label: 'Maharashtra' },
  { value: 'MANIPUR', label: 'Manipur' },
  { value: 'MEGHALAYA', label: 'Meghalaya' },
  { value: 'MIZORAM', label: 'Mizoram' },
  { value: 'NAGALAND', label: 'Nagaland' },
  { value: 'ODISHA', label: 'Odisha' },
  { value: 'PUDUCHERRY', label: 'Puducherry' },
  { value: 'PUNJAB', label: 'Punjab' },
  { value: 'RAJASTHAN', label: 'Rajasthan' },
  { value: 'SIKKIM', label: 'Sikkim' },
  { value: 'TAMIL_NADU', label: 'Tamil Nadu' },
  { value: 'TELANGANA', label: 'Telangana' },
  { value: 'TRIPURA', label: 'Tripura' },
  { value: 'UTTAR_PRADESH', label: 'Uttar Pradesh' },
  { value: 'UTTARAKHAND', label: 'Uttarakhand' },
  { value: 'WEST_BENGAL', label: 'West Bengal' },
];

const initialForm = {
  fullName: '',
  phoneNumber: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  country: 'India',
  postalCode: '',
  defaultAddress: false,
};

export default function AddressesPage() {
  const { data: addresses, isLoading, isError, error, refetch } = useAddresses();
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();
  const setDefaultAddress = useSetDefaultAddress();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState(initialForm);

  const addrList = Array.isArray(addresses)
    ? addresses
    : addresses?.data || addresses?.content || [];

  const openCreateModal = () => {
    setEditingAddress(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const openEditModal = (addr) => {
    setEditingAddress(addr);
    setFormData({
      fullName: addr.fullName || '',
      phoneNumber: addr.phoneNumber || '',
      addressLine1: addr.addressLine1 || '',
      addressLine2: addr.addressLine2 || '',
      city: addr.city || '',
      state: addr.state || '',
      country: addr.country || 'India',
      postalCode: addr.postalCode || '',
      defaultAddress: addr.defaultAddress || false,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.addressLine1 || !formData.city || !formData.state || !formData.postalCode) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (formData.postalCode.length < 5) {
      toast.error('Please enter a valid PIN code');
      return;
    }
    const payload = {
      ...formData,
      country: formData.country || 'India',
    };

    try {
      if (editingAddress) {
        await updateAddress.mutateAsync({ addressId: editingAddress.id, data: payload });
        toast.success('Address updated successfully');
      } else {
        await createAddress.mutateAsync(payload);
        toast.success('Address saved successfully');
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await deleteAddress.mutateAsync(deleteTarget.id);
      toast.success('Address removed');
      setDeleteTarget(null);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }, [deleteAddress, deleteTarget]);

  if (isLoading) {
    return (
      <div className="space-y-6 w-full max-w-5xl">
        <Breadcrumb items={breadcrumbItems} />
        <Skeleton variant="text" className="h-8 w-48 bg-temple-gold/20" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton variant="card" className="h-48 w-full rounded-3xl bg-temple-gold/15" />
          <Skeleton variant="card" className="h-48 w-full rounded-3xl bg-temple-gold/15" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-8 w-full max-w-5xl">
        <ErrorState title="Failed to load addresses" message={getErrorMessage(error)} onRetry={refetch} />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`Saved Addresses | ${siteConfig.name}`}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-8 w-full max-w-5xl font-display"
      >
        <Breadcrumb items={breadcrumbItems} />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-muted-sand/20">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-amber-950 flex items-center gap-2.5">
              <FiMapPin className="h-6 w-6 text-amber-800" /> Address Book
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-0.5 font-medium font-body">Manage your default and saved delivery locations for express checkout</p>
          </div>

          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={openCreateModal}
            leftIcon={<FiPlus className="h-4 w-4 text-amber-200" />}
            className="font-bold shadow-md bg-amber-900 text-white rounded-xl min-h-[44px]"
          >
            Add New Address
          </Button>
        </div>

        {addrList.length === 0 ? (
          <EmptyState
            title="No addresses saved yet"
            message="Save your home, temple, or office address for seamless 1-click checkout."
            action={
              <Button variant="primary" onClick={openCreateModal} leftIcon={<FiPlus className="h-4 w-4" />} className="font-bold">
                Add Address Now
              </Button>
            }
          />
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {addrList.map((addr) => (
                <AddressCard
                  key={addr.id}
                  address={addr}
                  onEdit={openEditModal}
                  onDelete={handleDelete}
                  onSetDefault={(id) => {
                    setDefaultAddress.mutateAsync(id);
                    toast.success('Default address updated!');
                  }}
                />
              ))}
            </div>
          </AnimatePresence>
        )}
      </motion.div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAddress ? 'Edit Delivery Address' : 'Add New Delivery Address'}
        size="md"
      >
        <div className="space-y-4 pt-2 font-display">
          <Input
            label="Full Name *"
            value={formData.fullName}
            onChange={(e) => setFormData((p) => ({ ...p, fullName: e.target.value }))}
            placeholder="Recipient's full name"
          />
          <Input
            label="Phone Number *"
            value={formData.phoneNumber}
            onChange={(e) => setFormData((p) => ({ ...p, phoneNumber: e.target.value }))}
            placeholder="10-digit mobile number"
          />
          <Textarea
            label="Address Line 1 *"
            value={formData.addressLine1}
            onChange={(e) => setFormData((p) => ({ ...p, addressLine1: e.target.value }))}
            placeholder="House/Flat No., Building, Street, Landmark"
            rows={2}
          />
          <Input
            label="Address Line 2 (Optional)"
            value={formData.addressLine2}
            onChange={(e) => setFormData((p) => ({ ...p, addressLine2: e.target.value }))}
            placeholder="Area, Locality"
          />
          <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
            <Input
              label="City *"
              value={formData.city}
              onChange={(e) => setFormData((p) => ({ ...p, city: e.target.value }))}
              placeholder="City"
            />
            <Select
              label="State *"
              options={stateOptions}
              value={formData.state}
              onChange={(e) => setFormData((p) => ({ ...p, state: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
            <Input
              label="Postal Code *"
              value={formData.postalCode}
              onChange={(e) => setFormData((p) => ({ ...p, postalCode: e.target.value }))}
              placeholder="6-digit PIN code"
            />
            <Input
              label="Country *"
              value={formData.country}
              onChange={(e) => setFormData((p) => ({ ...p, country: e.target.value }))}
              placeholder="Country"
            />
          </div>

          <div className="pt-2">
            <Checkbox
              label="Set as default delivery address"
              checked={formData.defaultAddress}
              onChange={() => setFormData((p) => ({ ...p, defaultAddress: !p.defaultAddress }))}
              size="sm"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-muted-sand/20">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleSubmit}
              disabled={createAddress.isPending || updateAddress.isPending}
              className="font-bold shadow-md"
            >
              {editingAddress ? 'Update Address' : 'Save Address'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
