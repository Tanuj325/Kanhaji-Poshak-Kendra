import { useState, useEffect } from 'react';
import Modal from '@/components/overlay/Modal';
import Button from '@/components/ui/Button';
import Textarea from '@/components/forms/Textarea';
import Select from '@/components/forms/Select';
import { FiAlertCircle } from 'react-icons/fi';

const COMMON_REASONS = [
  'Select a reason...',
  'Ordered by mistake',
  'Found a better price elsewhere',
  'Item will not arrive in time',
  'Changed my mind / No longer needed',
  'Product details/specifications issue',
  'Address or order information error',
  'Product out of stock / Unavailable',
  'Other'
];

export default function CancelOrderModal({
  isOpen,
  onClose,
  onConfirm,
  orderNumber,
  isLoading = false,
  title = 'Cancel Order Confirmation',
}) {
  const [selectedReason, setSelectedReason] = useState('Select a reason...');
  const [customReason, setCustomReason] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSelectedReason('Select a reason...');
      setCustomReason('');
      setError('');
    }
  }, [isOpen]);

  const handleConfirm = () => {
    let finalReason = '';
    if (selectedReason && selectedReason !== 'Select a reason...' && selectedReason !== 'Other') {
      finalReason = selectedReason;
      if (customReason.trim()) {
        finalReason += `: ${customReason.trim()}`;
      }
    } else if (customReason.trim()) {
      finalReason = customReason.trim();
    }

    if (!finalReason) {
      setError('Please select or enter a reason for cancellation.');
      return;
    }

    if (finalReason.length > 500) {
      setError('Cancellation reason cannot exceed 500 characters.');
      return;
    }

    setError('');
    onConfirm(finalReason);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-4 pt-2 font-display">
        <p className="text-sm text-dark-charcoal/80">
          Are you sure you want to cancel {orderNumber ? `Order #${orderNumber}` : 'this order'}? Please provide a reason below.
        </p>

        <div>
          <label className="block text-xs font-semibold text-dark-charcoal uppercase tracking-wider mb-1.5">
            Cancellation Reason <span className="text-red-500">*</span>
          </label>
          <Select
            value={selectedReason}
            onChange={(e) => {
              setSelectedReason(e.target.value);
              setError('');
            }}
            options={COMMON_REASONS.map(r => ({ value: r, label: r }))}
          />
        </div>

        {(selectedReason === 'Other' || selectedReason === 'Select a reason...' || customReason) && (
          <div>
            <label className="block text-xs font-semibold text-dark-charcoal uppercase tracking-wider mb-1.5">
              Additional Details {selectedReason === 'Other' && <span className="text-red-500">*</span>}
            </label>
            <Textarea
              placeholder="Provide details for cancellation..."
              value={customReason}
              onChange={(e) => {
                setCustomReason(e.target.value);
                setError('');
              }}
              rows={3}
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-dark-charcoal/50">
                {customReason.length}/500 characters
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
            <FiAlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-muted-sand/20">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Keep Order
          </Button>
          <Button variant="danger" size="sm" onClick={handleConfirm} isLoading={isLoading}>
            Confirm Cancellation
          </Button>
        </div>
      </div>
    </Modal>
  );
}
