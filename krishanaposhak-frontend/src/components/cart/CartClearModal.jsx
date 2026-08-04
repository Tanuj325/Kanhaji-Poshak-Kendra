import { memo } from 'react';
import ConfirmDialog from '@/components/overlay/ConfirmDialog';

const CartClearModal = memo(function CartClearModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Clear Shopping Cart"
      message="Are you sure you want to remove all items from your shopping cart? Saved items can also be moved to your wishlist."
      confirmText="Clear Entire Cart"
      type="danger"
      isLoading={isLoading}
    />
  );
});

export default CartClearModal;
