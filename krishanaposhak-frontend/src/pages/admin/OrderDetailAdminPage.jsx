import { Helmet } from 'react-helmet-async';
import { useMemo, useCallback, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrder, useUpdateOrderStatus } from '@/hooks';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import Breadcrumb from '@/components/layout/Breadcrumb';
import PrintableInvoice from '@/components/invoice/PrintableInvoice';
import { getErrorMessage } from '@/utils/apiErrorParser';
import { formatDate } from '@/utils/formatDate';
import { formatPrice } from '@/utils/formatPrice';
import toast from 'react-hot-toast';
import { siteConfig } from '@/config/siteConfig';
import {
  FiArrowLeft,
  FiMapPin,
  FiUser,
  FiPhone,
  FiMail,
  FiPrinter,
  FiTruck,
  FiCheckCircle,
  FiShoppingBag,
  FiClock,
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { cn } from '@/utils/cn';


const ORDER_STATUSES = [
  'PENDING',
  'CONFIRMED',
  'PACKING',
  'SHIPPED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
  'RETURNED',
];

const STATUS_BADGES = {
  PENDING: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
  CONFIRMED: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
  PACKING: 'bg-indigo-500/10 text-indigo-700 border-indigo-500/20',
  SHIPPED: 'bg-sky-500/10 text-sky-700 border-sky-500/20',
  OUT_FOR_DELIVERY: 'bg-purple-500/10 text-purple-700 border-purple-500/20',
  DELIVERED: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
  CANCELLED: 'bg-rose-500/10 text-rose-700 border-rose-500/20',
  RETURNED: 'bg-rose-500/10 text-rose-700 border-rose-500/20',
};

export default function OrderDetailAdminPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { data: order, isLoading, isError, error } = useOrder(orderId);
  const updateStatusMutation = useUpdateOrderStatus();
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const handleStatusChange = useCallback((newStatus) => {
    if (!orderId) return;
    updateStatusMutation.mutate(
      { orderId, status: newStatus },
      {
        onSuccess: () => {
          toast.success(`Order status updated to ${newStatus.replace(/_/g, ' ')}`);
        },
        onError: (err) => {
          toast.error(getErrorMessage(err, 'Failed to update order status'));
        },
      },
    );
  }, [orderId, updateStatusMutation]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6 font-display">
        <Breadcrumb />
        <Skeleton variant="text" className="h-8 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton variant="rect" className="h-48 rounded-2xl" />
          <Skeleton variant="rect" className="h-48 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="space-y-6 font-display">
        <Breadcrumb />
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-8 text-center">
          <p className="text-sm font-semibold text-rose-600 mb-4">
            {getErrorMessage(error, 'Order not found')}
          </p>
          <Button variant="outline" size="sm" onClick={() => navigate('/admin/orders')}>
            Back to Orders List
          </Button>
        </div>
      </div>
    );
  }

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

  return (
    <>
      <Helmet>
        <title>Order {order.orderNumber} - Admin - Krishana Poshak</title>
      </Helmet>

      <div className="space-y-6 font-display print:hidden">
        <Breadcrumb />

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/admin/orders')}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <FiArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-amber-950 tracking-tight">
                  Order #{order.orderNumber}
                </h1>
                <span className={cn('inline-block border px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider', STATUS_BADGES[order.orderStatus])}>
                  {(order.orderStatus || 'PENDING').replace(/_/g, ' ')}
                </span>
              </div>
              <p className="mt-1 text-xs text-stone-600 font-body">
                Placed on {formatDate(order.orderDate || order.createdAt, { format: 'datetime' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowInvoiceModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-xs font-bold text-amber-900 shadow-2xs hover:bg-amber-100 transition-all"
            >
              <FiPrinter className="h-3.5 w-3.5 text-amber-800" />
              <span>Preview & Print Invoice</span>
            </button>
          </div>
        </div>

        {/* Status Update Control Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">Fulfillment Status Controller</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Select a new status to update devotee order timeline</p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={order.orderStatus || 'PENDING'}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={updateStatusMutation.isPending}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800 focus:border-amber-500 focus:bg-white focus:outline-none cursor-pointer"
            >
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1 & 2: Order Items & Pricing */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs overflow-hidden">
              <h3 className="font-serif text-base font-bold text-slate-900 mb-4">Itemized Products ({items.length})</h3>
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left text-xs" aria-label="Order items table">
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-y border-slate-200/80">
                    <tr>
                      <th scope="col" className="py-3 px-4">Product & Variant</th>
                      <th scope="col" className="py-3 px-4 text-center">Qty</th>
                      <th scope="col" className="py-3 px-4 text-right">Unit Price</th>
                      <th scope="col" className="py-3 px-4 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.map((item, idx) => (
                      <tr key={item.id || idx} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={item.productName || 'Product'}
                                className="h-12 w-12 object-cover rounded-xl border border-slate-200 shrink-0"
                              />
                            ) : (
                              <div className="h-12 w-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
                                <FiShoppingBag className="h-5 w-5" />
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-slate-900">{item.productName || item.name || 'Product Item'}</p>
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <span className="inline-block bg-amber-50 text-amber-800 border border-amber-200/80 px-2 py-0.5 rounded-md text-[10px] font-bold">
                                  Size: {item.size || item.variantSize || 'Standard'}
                                </span>
                                {item.sku && (
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    SKU: {item.sku}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-800">
                          {item.quantity}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-slate-600">
                          {formatPrice(item.price || item.unitPrice)}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-amber-700">
                          {formatPrice(item.totalPrice || ((item.price || item.unitPrice || 0) * (item.quantity || 1)))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Order Financial Summary */}
              <div className="border-t border-slate-200 mt-6 pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-mono">{formatPrice(order.subTotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount Applied {order.couponCode ? `(${order.couponCode})` : ''}</span>
                    <span className="font-mono">-{formatPrice(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Shipping Fee</span>
                  <span className="font-mono">{order.shippingCharge > 0 ? formatPrice(order.shippingCharge) : <span className="text-emerald-600 font-bold">✓ FREE DELIVERY</span>}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 font-serif text-base font-bold text-slate-900">
                  <span>Total Amount Paid</span>
                  <span className="font-mono text-amber-700">{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Order Notes */}
            {order.notes && (
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
                <h3 className="font-serif text-sm font-bold text-slate-900 mb-1">Customer Notes</h3>
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">{order.notes}</p>
              </div>
            )}
          </div>

          {/* Column 3: Customer & Shipping Details */}
          <div className="space-y-6">
            {/* Devotee Info Card */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-3">
              <h3 className="font-serif text-base font-bold text-slate-900 flex items-center gap-2">
                <FiUser className="h-4 w-4 text-amber-600" /> Devotee Customer
              </h3>
              <div className="text-xs space-y-2">
                <p className="font-bold text-slate-900 text-sm">{customerName}</p>
                <div className="flex items-center gap-2 text-slate-600 font-mono">
                  <FiMail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{customerEmail}</span>
                </div>
                {customerPhone && (
                  <div className="flex items-center gap-2">
                    <FiPhone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono text-slate-700">{customerPhone}</span>
                    <a
                      href={`https://wa.me/${customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Namaste ${customerName}, updating you regarding Krishna Poshak Order #${order.orderNumber}:`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 transition-colors"
                      title="Chat on WhatsApp"
                    >
                      <FaWhatsapp className="h-3.5 w-3.5" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Address Card */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-3">
              <h3 className="font-serif text-base font-bold text-slate-900 flex items-center gap-2">
                <FiMapPin className="h-4 w-4 text-amber-600" /> Shipping Destination
              </h3>
              {address ? (
                <div className="text-xs text-slate-700 space-y-1 font-body leading-relaxed">
                  <p className="font-bold text-slate-900">{address.fullName || customerName}</p>
                  {address.addressLine1 && <p>{address.addressLine1}</p>}
                  {address.addressLine2 && <p>{address.addressLine2}</p>}
                  <p>
                    {[address.city, address.state].filter(Boolean).join(', ')}
                    {address.postalCode ? ` - ${address.postalCode}` : ''}
                  </p>
                  <p className="font-semibold text-slate-500">{address.country || 'India'}</p>
                </div>
              ) : (
                <p className="text-xs text-slate-400">No shipping address recorded</p>
              )}
            </div>

            {/* Payment Details Card */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-3">
              <h3 className="font-serif text-base font-bold text-slate-900 flex items-center gap-2">
                <FiTruck className="h-4 w-4 text-amber-600" /> Payment Summary
              </h3>
              <div className="text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Method</span>
                  <span className="font-bold text-slate-900 uppercase">{order.paymentMethod || 'Online Payment'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Payment Status</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px] uppercase">
                    {order.paymentStatus || 'PAID'}
                  </span>
                </div>
                {order.paymentId && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Transaction ID</span>
                    <span className="font-mono text-[11px] text-slate-700 truncate max-w-[120px]">{order.paymentId}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Modal Preview */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 print:hidden">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-900 text-white">
              <h3 className="font-serif font-bold text-lg text-amber-400">Tax Invoice Preview (#{order.orderNumber})</h3>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-xs font-bold text-slate-950 shadow-md hover:shadow-lg transition-all"
                >
                  <FiPrinter className="h-4 w-4" /> Download PDF / Print
                </button>
                <button
                  type="button"
                  onClick={() => setShowInvoiceModal(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto bg-slate-100 flex-1">
              <div className="bg-white shadow-xl rounded-xl p-4 max-w-[210mm] mx-auto border border-slate-200">
                <div className="printable-invoice-preview font-serif text-slate-900 text-xs leading-relaxed p-4">
                  <div className="flex justify-between items-start border-b-2 border-amber-800/30 pb-4 mb-4">
                    <div>
                      <h1 className="text-xl font-bold tracking-wider text-amber-950 uppercase font-serif">
                        {siteConfig.name || 'KRISHANA POSHAK'}
                      </h1>
                      <p className="text-[11px] font-sans font-semibold text-amber-900/80">Divine Attire & Sacred Seva Accessories</p>
                      <p className="text-[10px] font-sans text-slate-600">Datawali, Meerut, Uttar Pradesh, India - 250001</p>
                      <p className="text-[10px] font-sans text-slate-600">Support: +91 7060785107 | www.krishanaposhak.com</p>
                    </div>
                    <div className="text-right font-sans">
                      <span className="inline-block bg-amber-900 text-amber-200 text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider mb-1">TAX INVOICE</span>
                      <p className="text-xs font-bold text-slate-900">Invoice #: INV-{order.orderNumber}</p>
                      <p className="text-[10px] text-slate-600">Date: {formatDate(order.orderDate || order.createdAt, { format: 'datetime' })}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4 font-sans text-[11px]">
                    <div className="rounded border border-slate-200 bg-slate-50 p-3">
                      <p className="font-bold text-amber-950 uppercase text-[9px] border-b border-slate-200 pb-1 mb-1">Billed To</p>
                      <p className="font-bold">{customerName}</p>
                      <p>{customerEmail}</p>
                      {customerPhone && <p>Ph: {customerPhone}</p>}
                    </div>
                    <div className="rounded border border-slate-200 bg-slate-50 p-3">
                      <p className="font-bold text-amber-950 uppercase text-[9px] border-b border-slate-200 pb-1 mb-1">Shipped To</p>
                      {address ? (
                        <div>
                          <p className="font-bold">{address.fullName || customerName}</p>
                          {address.addressLine1 && <p>{address.addressLine1}</p>}
                          {address.addressLine2 && <p>{address.addressLine2}</p>}
                          <p>{[address.city, address.state].filter(Boolean).join(', ')} - {address.postalCode}</p>
                        </div>
                      ) : <p>Express Shipping</p>}
                    </div>
                  </div>

                  <table className="w-full text-left font-sans border-collapse text-[11px] mb-4">
                    <thead>
                      <tr className="bg-slate-900 text-amber-300 font-bold uppercase text-[9px]">
                        <th className="py-2 px-2 border text-center">#</th>
                        <th className="py-2 px-2 border">Item Particulars</th>
                        <th className="py-2 px-2 border text-center">Size</th>
                        <th className="py-2 px-2 border text-center">Qty</th>
                        <th className="py-2 px-2 border text-right">Price</th>
                        <th className="py-2 px-2 border text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, idx) => (
                        <tr key={idx} className="border-b">
                          <td className="py-2 px-2 text-center font-mono">{idx + 1}</td>
                          <td className="py-2 px-2 font-bold">{item.productName || item.name}</td>
                          <td className="py-2 px-2 text-center font-mono">{item.size || 'Standard'}</td>
                          <td className="py-2 px-2 text-center font-mono font-bold">{item.quantity}</td>
                          <td className="py-2 px-2 text-right font-mono">{formatPrice(item.price)}</td>
                          <td className="py-2 px-2 text-right font-mono font-bold">{formatPrice(item.totalPrice || item.price * item.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="flex justify-end font-sans mb-4">
                    <div className="w-56 space-y-1 text-[11px] border p-3 rounded bg-slate-50">
                      <div className="flex justify-between"><span>Subtotal:</span><span className="font-mono">{formatPrice(order.subTotal)}</span></div>
                      {order.discount > 0 && <div className="flex justify-between text-emerald-700"><span>Discount:</span><span className="font-mono">-{formatPrice(order.discount)}</span></div>}
                      <div className="flex justify-between"><span>Shipping:</span><span className="font-mono">{order.shippingCharge > 0 ? formatPrice(order.shippingCharge) : 'FREE'}</span></div>
                      <div className="border-t pt-1 flex justify-between font-bold text-xs"><span>Total Paid:</span><span className="font-mono text-amber-900">{formatPrice(order.totalAmount)}</span></div>
                    </div>
                  </div>

                  <div className="border-t-2 border-slate-200 pt-3 flex justify-between items-end font-sans">
                    <div className="text-[10px] text-slate-500 space-y-0.5">
                      <p className="font-bold text-amber-950">Jai Shree Krishna! 🙏</p>
                      <p>Thank you for shopping at Kanhaji Poshak Kendra.</p>
                    </div>
                    <div className="text-center">
                      <p className="font-serif italic font-bold text-amber-950 text-xs">Anurag Chauhan</p>
                      <div className="h-0.5 w-24 bg-amber-900/40 my-0.5 mx-auto"></div>
                      <p className="text-[9px] font-bold uppercase text-slate-700">Authorized Signatory</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden PDF Printable Invoice Document */}
      <PrintableInvoice order={order} />
    </>
  );
}
