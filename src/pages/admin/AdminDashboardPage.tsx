import React from 'react';
import { Link } from 'react-router-dom';
import { StorageService } from '@/services/storage';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Package, DollarSign, Clock, AlertTriangle, TrendingUp, 
  ArrowRight, Eye, ShoppingBag 
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { t, formatPrice, getProductName, language } = useLanguage();
  const orders = StorageService.getOrders();
  const products = StorageService.getProducts();

  // Metrics calculation
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered');
  const totalRevenue = deliveredOrders.reduce((sum, o) => sum + o.total, 0);

  // Low stock products (< 15 units)
  const lowStockProducts = products.filter(p => p.stock < 15);
  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 5);

  // Recent 5 orders
  const recentOrders = orders.slice(0, 5);

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

  const getPaymentMethodLabel = (method: string) => {
    return method === 'cod' ? t('admin.orders.paymentCod') : t('admin.orders.paymentBaridi');
  };

  // Activity calculation for recent days
  const daysOfWeek = [
    { day: t('admin.days.sat'), amount: 0, height: '6px' },
    { day: t('admin.days.sun'), amount: 0, height: '6px' },
    { day: t('admin.days.mon'), amount: 0, height: '6px' },
    { day: t('admin.days.tue'), amount: 0, height: '6px' },
    { day: t('admin.days.wed'), amount: 0, height: '6px' },
    { day: t('admin.days.thu'), amount: 0, height: '6px' },
    { day: t('admin.days.fri'), amount: 0, height: '6px' },
  ];

  // If there are delivered orders, compute average daily revenue
  const dailyAverageRevenue = totalOrdersCount > 0 ? Math.round(totalRevenue / 7) : 0;
  const deliverySuccessRate = totalOrdersCount > 0 
    ? `${Math.round((deliveredOrders.length / totalOrdersCount) * 100)}%` 
    : '0%';

  return (
    <div className="space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-deep">{t('admin.dashboard.title')}</h1>
          <p className="text-xs text-mutedText mt-1">
            {t('admin.dashboard.subtitle')}
          </p>
        </div>
        <Link
          to="/admin/products/new"
          className="bg-deep hover:bg-rose-950 text-ivory text-xs font-semibold px-5 py-2.5 rounded-xl transition shadow-sm self-start sm:self-auto cursor-pointer"
        >
          {t('admin.dashboard.newProduct')}
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Orders */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-mutedText">{t('admin.dashboard.totalOrders')}</span>
            <p className="font-serif text-2xl font-bold text-deep mt-1">{totalOrdersCount}</p>
            {totalOrdersCount > 0 ? (
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" /> {t('admin.dashboard.thisMonth')}
              </span>
            ) : (
              <span className="text-[11px] text-stone-400 font-medium block mt-1">
                {language === 'ar' ? '0 طلبية مسجلة' : '0 commande enregistrée'}
              </span>
            )}
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-mutedText">{t('admin.dashboard.totalRevenue')}</span>
            <p className="font-serif text-2xl font-bold text-deep mt-1">{formatPrice(totalRevenue)}</p>
            <span className="text-[11px] text-mutedText mt-1 block">
              {totalOrdersCount > 0 ? t('admin.dashboard.deliveredPaid') : (language === 'ar' ? '0 دج محصل' : '0 DA encaissé')}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-mutedText">{t('admin.dashboard.pendingOrders')}</span>
            <p className="font-serif text-2xl font-bold text-amber-700 mt-1">{pendingOrdersCount}</p>
            <span className="text-[11px] text-stone-500 mt-1 block">
              {pendingOrdersCount > 0 ? t('admin.dashboard.callRequired') : (language === 'ar' ? 'لا توجد اتصالات معلقة' : 'Aucun appel requis')}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-mutedText">{t('admin.dashboard.lowStockAlert')}</span>
            <p className="font-serif text-2xl font-bold text-red-600 mt-1">{lowStockProducts.length}</p>
            <span className="text-[11px] text-red-600 font-semibold mt-1 block">{t('admin.dashboard.unitsLeft')}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Sales Visual Chart & Best Sellers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Weekly Volume Bar Visualizer (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h2 className="font-serif text-base font-bold text-deep">{t('admin.dashboard.salesActivity')}</h2>
            <span className="text-xs bg-rose-50 text-rose-800 font-semibold px-2.5 py-1 rounded-full">
              {t('admin.dashboard.last7Days')}
            </span>
          </div>

          <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2">
            {daysOfWeek.map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-bold text-stone-600 opacity-0 group-hover:opacity-100 transition">
                  {bar.amount}k
                </span>
                <div 
                  className="w-full bg-stone-200 group-hover:bg-brand-rose rounded-t-xl transition-all duration-300"
                  style={{ height: bar.height }}
                />
                <span className="text-[11px] font-medium text-stone-500">{bar.day}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-mutedText">
            <span>{t('admin.dashboard.dailyAverage')} <strong>{formatPrice(dailyAverageRevenue)}</strong></span>
            <span>{t('admin.dashboard.deliverySuccess')} <strong className="text-emerald-700">{deliverySuccessRate}</strong></span>
          </div>
        </div>

        {/* Best Selling Products (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h2 className="font-serif text-base font-bold text-deep">{t('admin.dashboard.topProducts')}</h2>
            <Link to="/admin/products" className="text-xs text-rose-700 hover:text-rose-900 font-semibold">
              {t('admin.dashboard.manageStock')}
            </Link>
          </div>

          <div className="space-y-3">
            {bestSellers.length > 0 ? (
              bestSellers.map(prod => (
                <div key={prod.id} className="flex items-center gap-3 text-xs">
                  <img
                    src={prod.images[0]?.url}
                    alt={getProductName(prod)}
                    className="w-11 h-11 rounded-xl object-cover bg-stone-50 border border-stone-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-deep truncate">{getProductName(prod)}</h4>
                    <p className="text-[11px] text-mutedText">{prod.brand} • {t('admin.dashboard.inStock', { count: prod.stock })}</p>
                  </div>
                  <span className="font-bold text-deep shrink-0">{formatPrice(prod.price)}</span>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-mutedText">
                <ShoppingBag className="w-8 h-8 text-stone-300 mx-auto mb-2 opacity-60" />
                <p className="font-semibold text-deep">
                  {language === 'ar' ? 'لا توجد مبيعات مسجلة حتى الآن' : 'Aucune vente enregistrée'}
                </p>
                <p className="text-[11px] text-mutedText mt-1">
                  {language === 'ar' ? 'سيتم ترتيب المنتجات الأكثر طلباً فور تسجيل أولى الطلبيات.' : 'Les meilleures ventes s’afficheront au fur et à mesure des commandes.'}
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div>
            <h2 className="font-serif text-lg font-bold text-deep">{t('admin.dashboard.recentOrders')}</h2>
            <p className="text-xs text-mutedText">{t('admin.dashboard.recentOrdersSub')}</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-bold text-rose-800 hover:underline flex items-center gap-1"
          >
            <span>{t('admin.dashboard.allOrders')}</span>
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead>
              <tr className="border-b border-stone-100 text-mutedText font-semibold uppercase tracking-wider text-[10px]">
                <th className="pb-3 text-start">{t('admin.orders.orderNumber')}</th>
                <th className="pb-3 text-start">{t('admin.orders.customer')}</th>
                <th className="pb-3 text-start">{t('admin.orders.wilaya')}</th>
                <th className="pb-3 text-start">{t('admin.orders.amount')}</th>
                <th className="pb-3 text-start">{t('admin.orders.orderStatus')}</th>
                <th className="pb-3 text-start">{t('admin.orders.payment')}</th>
                <th className="pb-3 text-end">{t('admin.orders.action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-mutedText">
                    <Package className="w-10 h-10 text-stone-300 mx-auto mb-2 opacity-60" />
                    <p className="font-semibold text-deep text-sm">
                      {language === 'ar' ? 'لا توجد أي طلبيات مسجلة حالياً' : 'Aucune commande reçue pour le moment'}
                    </p>
                    <p className="text-[11px] text-mutedText mt-1 max-w-sm mx-auto">
                      {language === 'ar' 
                        ? 'المتجر في انتظار أولى الطلبيات. ستظهر كل طلبية جديدة هنا مباشرة مع بيانات الزبونة وخيارات التوصيل.'
                        : 'Votre boutique est prête à recevoir ses premières ventes. Les nouvelles commandes apparaîtront ici en temps réel.'}
                    </p>
                  </td>
                </tr>
              ) : (
                recentOrders.map(order => (
                  <tr key={order.id} className="hover:bg-stone-50/60 transition">
                    <td className="py-3.5 font-mono font-bold text-deep text-start">{order.orderNumber}</td>
                    <td className="py-3.5 font-medium text-start">
                      <p className="text-deep font-semibold">{order.customerName}</p>
                      <p className="text-[11px] text-mutedText">{order.customerPhone}</p>
                    </td>
                    <td className="py-3.5 text-start">
                      {order.shippingAddress.wilayaName} ({order.shippingAddress.wilayaCode})
                    </td>
                    <td className="py-3.5 font-bold text-deep text-start">{formatPrice(order.total)}</td>
                    <td className="py-3.5 text-start">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${
                        order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                        order.status === 'shipped' ? 'bg-indigo-100 text-indigo-800' :
                        order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {getOrderStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="py-3.5 text-start">
                      <span className="text-[11px] font-medium text-stone-600">
                        {getPaymentMethodLabel(order.paymentMethod)}
                      </span>
                    </td>
                    <td className="py-3.5 text-end">
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="inline-flex items-center gap-1 bg-stone-100 hover:bg-rose-100 text-deep text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border border-stone-200 transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{t('admin.orders.manage')}</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
