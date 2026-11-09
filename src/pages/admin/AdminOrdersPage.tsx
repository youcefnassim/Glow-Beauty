import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { StorageService } from '@/services/storage';
import { Order } from '@/types';
import { ALGERIA_WILAYAS } from '@/data/wilayas';
import { useLanguage } from '@/context/LanguageContext';
import { Search, Eye, FileSpreadsheet } from 'lucide-react';

export const AdminOrdersPage: React.FC = () => {
  const { t, formatPrice, getWilayaName, language } = useLanguage();
  const [orders] = useState<Order[]>(() => StorageService.getOrders());
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [wilayaFilter, setWilayaFilter] = useState<string>('all');
  const [deliveryTypeFilter, setDeliveryTypeFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filteredOrders = orders.filter(o => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (wilayaFilter !== 'all' && String(o.shippingAddress.wilayaCode) !== wilayaFilter) return false;
    if (deliveryTypeFilter !== 'all' && o.shippingAddress.deliveryType !== deliveryTypeFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const matchNum = o.orderNumber.toLowerCase().includes(q);
      const matchName = o.customerName.toLowerCase().includes(q);
      const matchPhone = o.customerPhone.includes(q);
      const matchWilaya = o.shippingAddress.wilayaName.toLowerCase().includes(q);
      return matchNum || matchName || matchPhone || matchWilaya;
    }
    return true;
  });

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

  const handleExportCSV = () => {
    if (filteredOrders.length === 0) {
      alert(t('admin.orders.exportEmptyAlert'));
      return;
    }

    const headers = [
      'N° Commande',
      'Date',
      'Nom & Prénom',
      'Téléphone',
      'Wilaya Code',
      'Wilaya Nom',
      'Commune',
      'Adresse Complète',
      'Type Livraison',
      'Montant COD à Encaisser (DZD)',
      'Articles / Désignation',
      'Statut Commande',
      'N° Suivi Transporteur',
      'Instructions Client'
    ];

    const escapeCell = (str: string | number | undefined | null) => {
      if (str === undefined || str === null) return '""';
      const clean = String(str).replace(/"/g, '""');
      return `"${clean}"`;
    };

    const rows = filteredOrders.map(o => [
      escapeCell(o.orderNumber),
      escapeCell(new Date(o.createdAt).toLocaleDateString(language === 'ar' ? 'ar-DZ' : 'fr-FR')),
      escapeCell(o.customerName),
      escapeCell(o.customerPhone),
      escapeCell(o.shippingAddress.wilayaCode),
      escapeCell(o.shippingAddress.wilayaName),
      escapeCell(o.shippingAddress.commune),
      escapeCell(o.shippingAddress.streetAddress),
      escapeCell(o.shippingAddress.deliveryType === 'home' ? 'À Domicile' : 'Bureau Stop-Desk'),
      escapeCell(o.total),
      escapeCell(o.items.map(i => `${i.productName} (x${i.quantity})`).join(' + ')),
      escapeCell(o.status),
      escapeCell(o.trackingNumber || ''),
      escapeCell(o.notes || '')
    ]);

    const csvData = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\r\n');
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bordereau_yalidine_zr_glow_beauty_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-deep">{t('admin.orders.pageTitle')}</h1>
          <p className="text-xs text-mutedText mt-1">
            {t('admin.orders.pageSubtitle')}
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>{t('admin.orders.exportCsv')}</span>
          <span className="bg-emerald-900/60 text-white px-2 py-0.5 rounded-full text-[10px]">
            {filteredOrders.length}
          </span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute start-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('admin.orders.searchPlaceholder')}
              className="w-full text-xs ps-9 pe-3 py-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none"
            />
          </div>

          {/* Quick Selectors: Wilaya and Delivery Type */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto text-xs">
            {/* Wilaya Filter */}
            <select
              value={wilayaFilter}
              onChange={(e) => setWilayaFilter(e.target.value)}
              className="py-1.5 px-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-700 font-medium focus:outline-none"
            >
              <option value="all">📍 {t('admin.orders.allWilayas')}</option>
              {ALGERIA_WILAYAS.map(w => (
                <option key={w.code} value={String(w.code)}>
                  {w.code} - {getWilayaName(w)}
                </option>
              ))}
            </select>

            {/* Delivery Type */}
            <select
              value={deliveryTypeFilter}
              onChange={(e) => setDeliveryTypeFilter(e.target.value)}
              className="py-1.5 px-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-700 font-medium focus:outline-none"
            >
              <option value="all">🚚 {t('admin.orders.allDeliveries')}</option>
              <option value="home">🏠 {t('admin.orders.homeDelivery')}</option>
              <option value="desk">🏢 {t('admin.orders.stopDesk')}</option>
            </select>
          </div>
        </div>

        {/* Status Filter Buttons */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-stone-100">
          {[
            { label: t('admin.orders.allStatuses'), value: 'all' },
            { label: t('admin.orders.statusPending'), value: 'pending' },
            { label: t('admin.orders.statusConfirmed'), value: 'confirmed' },
            { label: t('admin.orders.statusShipped'), value: 'shipped' },
            { label: t('admin.orders.statusDelivered'), value: 'delivered' },
            { label: t('admin.orders.statusCancelled'), value: 'cancelled' },
          ].map(btn => (
            <button
              key={btn.value}
              onClick={() => setStatusFilter(btn.value)}
              className={`text-xs px-3 py-1.5 rounded-xl font-medium transition cursor-pointer ${
                statusFilter === btn.value
                  ? 'bg-deep text-ivory font-bold shadow-xs'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-600 border border-stone-200'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/70 text-mutedText font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4 text-start">{t('admin.orders.orderNumber')}</th>
                <th className="py-3 px-4 text-start">{t('admin.orders.customer')}</th>
                <th className="py-3 px-4 text-start">{t('admin.orders.wilaya')}</th>
                <th className="py-3 px-4 text-start">{t('admin.orders.colItems')}</th>
                <th className="py-3 px-4 text-start">{t('admin.orders.amount')}</th>
                <th className="py-3 px-4 text-start">{t('admin.orders.orderStatus')}</th>
                <th className="py-3 px-4 text-start">{t('admin.orderDetail.carrierTracking')}</th>
                <th className="py-3 px-4 text-end">{t('admin.orders.colActions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-mutedText">
                    {t('admin.orders.noOrdersMatching')}
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => {
                  const wilayaObj = ALGERIA_WILAYAS.find(w => w.code === order.shippingAddress.wilayaCode);
                  const displayWilaya = wilayaObj ? getWilayaName(wilayaObj) : order.shippingAddress.wilayaName;

                  return (
                    <tr key={order.id} className="hover:bg-stone-50/50 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-deep text-start">
                        {order.orderNumber}
                        <p className="text-[10px] text-mutedText font-sans">
                          {new Date(order.createdAt).toLocaleDateString(language === 'ar' ? 'ar-DZ' : 'fr-FR')}
                        </p>
                      </td>

                      <td className="py-3.5 px-4 text-start">
                        <p className="font-semibold text-deep">{order.customerName}</p>
                        <p className="text-[11px] text-rose-800 font-mono font-medium">{order.customerPhone}</p>
                      </td>

                      <td className="py-3.5 px-4 text-start">
                        <p className="font-medium text-deep">{displayWilaya} ({order.shippingAddress.wilayaCode})</p>
                        <p className="text-[11px] text-mutedText">
                          {order.shippingAddress.commune} • {order.shippingAddress.deliveryType === 'home' ? t('admin.orders.homeDelivery') : t('admin.orders.stopDesk')}
                        </p>
                      </td>

                      <td className="py-3.5 px-4 text-start">
                        <span className="font-semibold text-deep">{order.items.reduce((s, i) => s + i.quantity, 0)}</span>
                      </td>

                      <td className="py-3.5 px-4 font-serif font-bold text-sm text-deep text-start">
                        {formatPrice(order.total)}
                      </td>

                      <td className="py-3.5 px-4 text-start">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${
                          order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                          order.status === 'shipped' ? 'bg-indigo-100 text-indigo-800' :
                          order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {getOrderStatusLabel(order.status)}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-start">
                        {order.trackingNumber ? (
                          <span className="font-mono text-[11px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                            {order.trackingNumber}
                          </span>
                        ) : (
                          <span className="text-[10px] text-stone-400">—</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-end">
                        <Link
                          to={`/admin/orders/${order.id}`}
                          className="inline-flex items-center gap-1 bg-stone-100 hover:bg-rose-100 text-deep text-[11px] font-semibold px-3 py-1.5 rounded-xl border border-stone-200 transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{t('admin.orders.manage')}</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
