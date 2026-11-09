import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { StorageService } from '@/services/storage';
import { Order, OrderStatus, PaymentStatus } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { ALGERIA_WILAYAS } from '@/data/wilayas';
import { 
  ArrowLeft, Save, CheckCircle2, 
  MapPin, Phone, User, Printer 
} from 'lucide-react';

export const AdminOrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, formatPrice, getWilayaName, language, isRtl } = useLanguage();
  const [order, setOrder] = useState<Order | null>(null);

  // Status Form States
  const [newStatus, setNewStatus] = useState<OrderStatus>('pending');
  const [statusNote, setStatusNote] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingCarrier, setTrackingCarrier] = useState('Yalidine Express');
  const [feedback, setFeedback] = useState<string | null>(null);

  const getWhatsAppCustomerUrl = (o: Order) => {
    let cleanPhone = o.customerPhone.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) cleanPhone = '213' + cleanPhone.substring(1);
    else if (!cleanPhone.startsWith('213')) cleanPhone = '213' + cleanPhone;

    const wilayaObj = ALGERIA_WILAYAS.find(w => w.code === o.shippingAddress.wilayaCode);
    const wilayaStr = wilayaObj ? getWilayaName(wilayaObj) : o.shippingAddress.wilayaName;

    const text = language === 'ar'
      ? `مرحباً ${o.customerName}،\n\nنتصل بك من متجر *جين ميكب للجمال* بخصوص طلبيتك رقم *${o.orderNumber}* بمبلغ (${formatPrice(o.total)}).\n\nهل تؤكدين شحن طلبيتك إلى ${wilayaStr} (${o.shippingAddress.commune}) ؟\n\nشكراً لثقتك بنا ! 🌸`
      : `Bonjour ${o.customerName},\n\nNous vous contactons de la part de *Jin Makeup DZ* concernant votre commande *${o.orderNumber}* (${formatPrice(o.total)}).\n\nSouhaitez-vous confirmer l'envoi vers ${wilayaStr} (${o.shippingAddress.commune}) ?\n\nMerci pour votre confiance ! 🌸`;

    return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(text)}`;
  };

  useEffect(() => {
    if (id) {
      const found = StorageService.getOrderById(id);
      if (found) {
        setOrder(found);
        setNewStatus(found.status);
        setPaymentStatus(found.paymentStatus);
        setTrackingNumber(found.trackingNumber || '');
        setTrackingCarrier(found.trackingCarrier || 'Yalidine Express');
      }
    }
  }, [id]);

  if (!order) {
    return (
      <div className="space-y-4">
        <Link to="/admin/orders" className="text-xs text-rose-800 underline inline-flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
          <span>{t('admin.orderDetail.back')}</span>
        </Link>
        <p className="text-sm">{t('admin.orderDetail.notFound')}</p>
      </div>
    );
  }

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;

    // Update fulfillment status & history
    const defaultNote = language === 'ar'
      ? `تم تحديث الحالة إلى : ${newStatus}`
      : `Statut mis à jour vers : ${newStatus}`;
    const note = statusNote.trim() || defaultNote;
    StorageService.updateOrderStatus(order.id, newStatus, note, language === 'ar' ? 'المسؤول' : 'Administrateur');

    // Update payment & tracking info
    StorageService.updateOrderPayment(order.id, paymentStatus, trackingNumber.trim() || undefined, trackingCarrier);

    const reloaded = StorageService.getOrderById(order.id);
    if (reloaded) setOrder(reloaded);

    setStatusNote('');
    setFeedback(t('admin.orderDetail.success'));
    setTimeout(() => setFeedback(null), 3000);
  };

  const wilayaObj = ALGERIA_WILAYAS.find(w => w.code === order.shippingAddress.wilayaCode);
  const displayWilaya = wilayaObj ? getWilayaName(wilayaObj) : order.shippingAddress.wilayaName;

  const getOrderStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return t('admin.orders.statusPending');
      case 'confirmed': return t('admin.orders.statusConfirmed');
      case 'shipped': return t('admin.orders.statusShipped');
      case 'delivered': return t('admin.orders.statusDelivered');
      case 'cancelled': return t('admin.orders.statusCancelled');
      default: return status;
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      
      {/* Header */}
      <div>
        <Link to="/admin/orders" className="inline-flex items-center gap-1.5 text-xs text-mutedText hover:text-deep mb-2 transition">
          <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
          <span>{t('admin.orderDetail.back')}</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-serif text-3xl font-bold text-deep">{order.orderNumber}</h1>
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full capitalize">
                {getOrderStatusLabel(order.status)}
              </span>
            </div>
            <p className="text-xs text-mutedText mt-1">
              {t('admin.orderDetail.placedOn', { date: new Date(order.createdAt).toLocaleString(language === 'ar' ? 'ar-DZ' : 'fr-FR') })}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href={getWhatsAppCustomerUrl(order)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 2.013.82 2.796.82 3.183 0 5.768-2.587 5.768-5.766.001-3.182-2.585-5.766-5.768-5.766zm9.969 5.766c0 5.518-4.482 10-10 10-1.708 0-3.32-.435-4.733-1.2l-5.267 1.382 1.407-5.139c-.878-1.488-1.407-3.232-1.407-5.043 0-5.518 4.482-10 10-10s10 4.482 10 10z"/>
              </svg>
              <span>{t('admin.orderDetail.contactCustomer')}</span>
            </a>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold px-4 py-2.5 rounded-xl border border-stone-200 shadow-xs transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{t('admin.orderDetail.printInvoice')}</span>
            </button>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Status & Fulfillment Controller Form */}
      <form onSubmit={handleUpdateStatus} className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-6">
        <h2 className="font-serif text-base font-bold text-deep pb-3 border-b border-stone-100">
          {t('admin.orderDetail.statusUpdate')}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Order Status */}
          <div>
            <label className="text-xs font-semibold text-deep block mb-1">
              {t('admin.orderDetail.selectStatus')} *
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
              className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-stone-50 font-bold"
            >
              <option value="pending">{t('admin.orders.statusPending')}</option>
              <option value="confirmed">{t('admin.orders.statusConfirmed')}</option>
              <option value="processing">{language === 'ar' ? 'قيد التجهيز والتغليف' : 'En cours de préparation'}</option>
              <option value="shipped">{t('admin.orders.statusShipped')}</option>
              <option value="delivered">{t('admin.orders.statusDelivered')}</option>
              <option value="cancelled">{t('admin.orders.statusCancelled')}</option>
            </select>
          </div>

          {/* Payment Status */}
          <div>
            <label className="text-xs font-semibold text-deep block mb-1">
              {t('admin.orderDetail.paymentStatus')} *
            </label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
              className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-stone-50 font-bold"
            >
              <option value="pending">{t('admin.orders.paymentPending')}</option>
              <option value="paid">{t('admin.orders.paymentPaid')}</option>
              <option value="failed">{language === 'ar' ? 'فشل التحصيل' : 'Échec d\'encaissement'}</option>
              <option value="refunded">{language === 'ar' ? 'مسترجع' : 'Remboursé'}</option>
            </select>
          </div>
        </div>

        {/* Carrier & Tracking */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          <div>
            <label className="text-xs font-semibold text-deep block mb-1">
              {t('admin.orderDetail.carrier')}
            </label>
            <select
              value={trackingCarrier}
              onChange={(e) => setTrackingCarrier(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-stone-50"
            >
              <option value="Yalidine Express">Yalidine Express</option>
              <option value="ZR Express">ZR Express</option>
              <option value="Kazitour Express">Kazitour Express</option>
              <option value="Coursier Privé">Coursier Privé Jin Makeup</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-deep block mb-1">
              {t('admin.orderDetail.carrierTracking')}
            </label>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder={t('admin.orderDetail.trackingPlaceholder')}
              className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-stone-50 font-mono"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-deep block mb-1">
            {t('admin.orderDetail.statusNote')}
          </label>
          <input
            type="text"
            value={statusNote}
            onChange={(e) => setStatusNote(e.target.value)}
            placeholder={t('admin.orderDetail.statusNotePlaceholder')}
            className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-stone-50"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="bg-deep hover:bg-rose-950 text-ivory text-xs font-semibold px-6 py-3 rounded-xl transition shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{t('admin.orderDetail.saveChanges')}</span>
          </button>
        </div>
      </form>

      {/* Customer & Address Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-3 text-xs">
          <h3 className="font-serif text-sm font-bold text-deep flex items-center gap-2">
            <User className="w-4 h-4 text-rose-600" />
            {t('admin.orderDetail.customerInfo')}
          </h3>
          <p className="font-semibold text-deep">{order.customerName}</p>
          <p className="flex items-center gap-1 text-rose-800 font-mono font-bold">
            <Phone className="w-3.5 h-3.5" /> {order.customerPhone}
          </p>
          {order.customerEmail && <p className="text-stone-500">{order.customerEmail}</p>}
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-3 text-xs">
          <h3 className="font-serif text-sm font-bold text-deep flex items-center gap-2">
            <MapPin className="w-4 h-4 text-rose-600" />
            {t('admin.orderDetail.shippingAddress')}
          </h3>
          <p className="font-medium text-deep">{order.shippingAddress.streetAddress}</p>
          <p className="text-stone-600">
            {order.shippingAddress.commune} • {displayWilaya} ({order.shippingAddress.wilayaCode})
          </p>
          <p className="text-rose-900 font-semibold">
            {t('admin.orderDetail.deliveryMethod')} {order.shippingAddress.deliveryType === 'home' ? t('admin.orders.homeDelivery') : t('admin.orders.stopDesk')}
          </p>
          {order.notes && <p className="text-stone-500 italic">{t('admin.orderDetail.customerInstructions')} « {order.notes} »</p>}
        </div>
      </div>

      {/* Products list in order */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
        <h3 className="font-serif text-base font-bold text-deep pb-2 border-b border-stone-100">
          {t('admin.orderDetail.orderItems')} ({order.items.length})
        </h3>
        <div className="space-y-3">
          {order.items.map(item => (
            <div key={item.id} className="flex items-center justify-between text-xs py-2 border-b border-stone-100">
              <div className="flex items-center gap-3">
                {item.imageUrl && (
                  <img src={item.imageUrl} alt={item.productName} className="w-12 h-12 rounded-xl object-cover bg-stone-100 border border-stone-200" />
                )}
                <div>
                  <h4 className="font-bold text-deep">{item.productName}</h4>
                  {item.variantName && <p className="text-[11px] text-rose-700">{item.variantName}</p>}
                  <p className="text-mutedText">{t('admin.orderDetail.qty')}: {item.quantity} × {formatPrice(item.unitPrice)}</p>
                </div>
              </div>
              <span className="font-bold text-deep">{formatPrice(item.totalPrice)}</span>
            </div>
          ))}
        </div>

        <div className={`pt-3 border-t border-stone-100 text-xs space-y-1.5 max-w-xs ${isRtl ? 'mr-auto' : 'ml-auto'}`}>
          <div className="flex justify-between text-mutedText">
            <span>{t('admin.orderDetail.subtotal')} :</span>
            <span className="font-semibold text-deep">{formatPrice(order.subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-700">
              <span>{t('admin.orderDetail.discount')} :</span>
              <span>-{formatPrice(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-mutedText">
            <span>{t('admin.orderDetail.shipping')} ({displayWilaya}) :</span>
            <span className="font-semibold text-deep">{order.deliveryFee === 0 ? t('admin.orderDetail.free') : formatPrice(order.deliveryFee)}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-deep pt-1.5 border-t border-stone-200">
            <span>{t('admin.orderDetail.totalToCollect')} :</span>
            <span className="font-serif text-lg text-rose-900">{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Status History Timeline */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
        <h3 className="font-serif text-base font-bold text-deep pb-2 border-b border-stone-100">
          {t('admin.orderDetail.history')}
        </h3>
        <div className={`relative ps-6 space-y-4 before:absolute ${isRtl ? 'before:right-2' : 'before:left-2'} before:top-2 before:bottom-2 before:w-0.5 before:bg-rose-200`}>
          {order.history.map((h, i) => (
            <div key={i} className="relative text-xs">
              <div className={`absolute ${isRtl ? '-right-6' : '-left-6'} top-1 w-2.5 h-2.5 rounded-full bg-rose-600`} />
              <div className="flex items-center gap-2">
                <span className="font-bold text-deep capitalize">{h.status}</span>
                <span className="text-[11px] text-mutedText">{new Date(h.timestamp).toLocaleString(language === 'ar' ? 'ar-DZ' : 'fr-FR')}</span>
                {h.updatedBy && <span className="text-[10px] bg-stone-100 px-1.5 py-0.5 rounded text-stone-600">{h.updatedBy}</span>}
              </div>
              <p className="text-stone-600 mt-0.5">{h.note}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
