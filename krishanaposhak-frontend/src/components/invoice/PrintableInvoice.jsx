import { siteConfig } from '@/config/siteConfig';
import { formatDate } from '@/utils/formatDate';
import { formatPrice } from '@/utils/formatPrice';

export default function PrintableInvoice({ order }) {
  if (!order) return null;

  const items = order.items || order.orderItems || [];
  const customerName =
    order.customerName ||
    (order.userFirstName ? `${order.userFirstName} ${order.userLastName || ''}` : null) ||
    order.shippingAddress?.fullName ||
    'Devotee Customer';
  const customerEmail = order.customerEmail || order.userEmail || order.shippingAddress?.email || '—';
  const customerPhone = order.customerPhone || order.shippingAddress?.phoneNumber || order.userPhoneNumber || '';

  const address = order.shippingAddress || (order.addressLine1 ? {
    fullName: customerName,
    addressLine1: order.addressLine1,
    addressLine2: order.addressLine2,
    city: order.city,
    state: order.state,
    postalCode: order.postalCode,
    country: order.country,
  } : null);

  const formattedDate = formatDate(order.orderDate || order.createdAt, { format: 'datetime' });

  return (
    <div className="printable-invoice-wrapper hidden print:block font-serif text-slate-900 p-8 max-w-[210mm] mx-auto bg-white text-xs leading-normal">
      {/* Invoice Header / Branding */}
      <div className="flex justify-between items-start border-b-2 border-amber-600 pb-6 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-wide text-amber-900 uppercase">
            {siteConfig.name || 'KRISHANA POSHAK'}
          </h1>
          <p className="text-[11px] font-sans text-slate-600 mt-1">
            Divine Attire & Sacred Poshak Collections
          </p>
          <p className="text-[10px] font-sans text-slate-500 mt-0.5">
            Datawali, Meerut, Uttar Pradesh, India, 250001
          </p>
          <p className="text-[10px] font-sans text-slate-500">
            Email: kanhajiposhak.support@gmail.com | Contact: +91 7060785107
          </p>
        </div>
        <div className="text-right">
          <span className="inline-block bg-amber-100 text-amber-900 text-xs font-sans font-bold px-3 py-1 rounded uppercase tracking-wider mb-2 border border-amber-300">
            TAX INVOICE / RECEIPT
          </span>
          <p className="text-sm font-sans font-bold text-slate-900">
            Invoice No: <span className="font-mono">INV-{order.orderNumber}</span>
          </p>
          <p className="text-xs font-sans text-slate-600">
            Order Date: <span className="font-mono">{formattedDate}</span>
          </p>
        </div>
      </div>

      {/* Meta Grid: Bill To / Ship To / Payment */}
      <div className="grid grid-cols-2 gap-6 mb-6 font-sans">
        <div className="border border-slate-200 p-4 rounded-lg bg-slate-50/50">
          <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1">
            Customer / Billed To
          </h3>
          <p className="font-bold text-slate-900 text-xs">{customerName}</p>
          {customerEmail && <p className="text-slate-600">{customerEmail}</p>}
          {customerPhone && <p className="text-slate-600">Phone: {customerPhone}</p>}
        </div>

        <div className="border border-slate-200 p-4 rounded-lg bg-slate-50/50">
          <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1">
            Shipping Destination
          </h3>
          {address ? (
            <div className="text-slate-700 space-y-0.5">
              <p className="font-bold text-slate-900">{address.fullName || customerName}</p>
              {address.addressLine1 && <p>{address.addressLine1}</p>}
              {address.addressLine2 && <p>{address.addressLine2}</p>}
              <p>
                {[address.city, address.state].filter(Boolean).join(', ')}
                {address.postalCode ? ` - ${address.postalCode}` : ''}
              </p>
              <p className="font-semibold text-slate-600">{address.country || 'India'}</p>
            </div>
          ) : (
            <p className="text-slate-500">Standard Delivery</p>
          )}
        </div>
      </div>

      {/* Payment & Status Info */}
      <div className="flex justify-between items-center bg-slate-100 p-3 rounded-lg border border-slate-200 mb-6 font-sans text-xs">
        <div>
          <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">Payment Method:</span>{' '}
          <span className="font-bold text-slate-800 uppercase">{order.paymentMethod || 'Online (Razorpay)'}</span>
        </div>
        <div>
          <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">Payment Status:</span>{' '}
          <span className="font-bold text-emerald-700 uppercase">{order.paymentStatus || 'PAID'}</span>
        </div>
        <div>
          <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">Fulfillment Status:</span>{' '}
          <span className="font-bold text-amber-800 uppercase">{order.orderStatus || 'PENDING'}</span>
        </div>
      </div>

      {/* Itemized Table */}
      <table className="w-full text-left font-sans border-collapse mb-6" aria-label="Invoice Particulars">
        <thead>
          <tr className="bg-slate-800 text-white text-[11px] font-bold uppercase tracking-wider">
            <th scope="col" className="py-2.5 px-3 border border-slate-800 text-center w-12">#</th>
            <th scope="col" className="py-2.5 px-3 border border-slate-800">Particulars / Divine Item</th>
            <th scope="col" className="py-2.5 px-3 border border-slate-800 text-center w-20">Size</th>
            <th scope="col" className="py-2.5 px-3 border border-slate-800 text-center w-16">Qty</th>
            <th scope="col" className="py-2.5 px-3 border border-slate-800 text-right w-24">Price</th>
            <th scope="col" className="py-2.5 px-3 border border-slate-800 text-right w-28">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 border border-slate-200">
          {items.map((item, index) => (
            <tr key={item.id || index} className="text-xs">
              <td className="py-3 px-3 text-center font-mono font-bold text-slate-500">{index + 1}</td>
              <td className="py-3 px-3">
                <p className="font-bold text-slate-900">{item.productName || item.name || 'Product Item'}</p>
                {item.color && <p className="text-[10px] text-amber-900 font-semibold">Color: {item.color}</p>}
                {item.sku && <p className="text-[10px] text-slate-500 font-mono">SKU: {item.sku}</p>}
              </td>
              <td className="py-3 px-3 text-center font-mono">{item.size || item.variantSize || 'Standard'}</td>
              <td className="py-3 px-3 text-center font-mono font-bold">{item.quantity}</td>
              <td className="py-3 px-3 text-right font-mono">{formatPrice(item.price || item.unitPrice)}</td>
              <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                {formatPrice(item.totalPrice || ((item.price || item.unitPrice || 0) * (item.quantity || 1)))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Financial Breakdown */}
      <div className="flex justify-end font-sans mb-8">
        <div className="w-64 space-y-2 border border-slate-200 p-4 rounded-lg bg-slate-50">
          <div className="flex justify-between text-slate-600 text-xs">
            <span>Subtotal:</span>
            <span className="font-mono font-bold">{formatPrice(order.subTotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-700 text-xs font-semibold">
              <span>Discount {order.couponCode ? `(${order.couponCode})` : ''}:</span>
              <span className="font-mono">-{formatPrice(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-600 text-xs">
            <span>Shipping Charge:</span>
            <span className="font-mono font-bold">
              {order.shippingCharge > 0 ? formatPrice(order.shippingCharge) : <span className="text-emerald-700 font-bold">FREE DELIVERY</span>}
            </span>
          </div>
          <div className="border-t border-slate-300 pt-2 flex justify-between text-sm font-bold text-slate-900">
            <span>Total Amount Paid:</span>
            <span className="font-mono text-amber-800">{formatPrice(order.totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* Devotional Footer & Declaration */}
      <div className="border-t-2 border-slate-200 pt-6 mt-8 flex justify-between items-end font-sans">
        <div className="max-w-md text-[10px] text-slate-500 space-y-1">
          <p className="font-bold text-amber-900 text-xs">Radhe Radhe! 🙏</p>
          <p>Thank you for choosing Kanhaji Poshak Kendra for your divine seva attire.</p>
          <p>For support, returns or sizing guidance, reach out to kanhajiposhak.support@gmail.com</p>
          <p className="text-[9px] text-slate-400">This is a computer generated invoice and does not require a physical signature.</p>
        </div>

        <div className="text-center">
          <p className="font-serif italic font-bold text-amber-950 text-sm tracking-wide">Anurag Chauhan</p>
          <div className="h-0.5 w-32 bg-amber-900/40 my-1 mx-auto"></div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-700">Authorized Signatory</p>
          <p className="text-[9px] text-slate-500">Kanhaji Poshak Kendra</p>
        </div>
      </div>
    </div>
  );
}
