import { memo } from 'react';
import CartItem from './CartItem';

const CartItemRow = memo(function CartItemRow(props) {
  return <CartItem {...props} />;
});

export default CartItemRow;