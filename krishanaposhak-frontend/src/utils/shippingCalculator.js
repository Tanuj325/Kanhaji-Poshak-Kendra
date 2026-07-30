import { formatPrice } from './formatPrice';

export const FREE_SHIPPING_THRESHOLD = 8000;

/**
 * Calculates shipping charge based on order subtotal according to business rules:
 * - Subtotal < ₹2,000                => Shipping = ₹120
 * - Subtotal ₹2,000 – ₹3,999.99     => Shipping = ₹240
 * - Subtotal ₹4,000 – ₹7,999.99     => Shipping = ₹400
 * - Subtotal ≥ ₹8,000               => Shipping = ₹0 (FREE DELIVERY)
 *
 * @param {number} subtotal - The cart/order subtotal amount in INR
 * @returns {{
 *   shipping: number,
 *   isFreeShipping: boolean,
 *   freeShippingThreshold: number,
 *   remainingForFreeShipping: number,
 *   freeShippingMessage: string
 * }}
 */
export function calculateShipping(subtotal = 0) {
  const numericSubtotal = Math.max(0, Number(subtotal) || 0);

  let shipping = 0;
  if (numericSubtotal < 2000) {
    shipping = 120;
  } else if (numericSubtotal < 4000) {
    shipping = 240;
  } else if (numericSubtotal < 8000) {
    shipping = 400;
  } else {
    shipping = 0;
  }

  const isFreeShipping = shipping === 0;
  const remainingForFreeShipping = isFreeShipping
    ? 0
    : Math.max(0, FREE_SHIPPING_THRESHOLD - numericSubtotal);

  const freeShippingMessage = isFreeShipping
    ? 'FREE DELIVERY'
    : `Add ${formatPrice(remainingForFreeShipping)} more to get FREE Delivery`;

  return {
    shipping,
    isFreeShipping,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    remainingForFreeShipping,
    freeShippingMessage,
  };
}

export default calculateShipping;
