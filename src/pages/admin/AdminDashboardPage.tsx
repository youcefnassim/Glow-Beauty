import React from 'react';
import { Link } from 'react-router-dom';
import { StorageService } from '@/services/storage';
import { formatPriceDZD } from '@/data/wilayas';
import { 
  Package, DollarSign, Clock, AlertTriangle, TrendingUp, 
  ArrowRight, CheckCircle2, ShoppingBag, Eye 
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
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

  return (
    <div className="space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-deep">Tableau de bord</h1>
          <p className="text-xs text-mutedText mt-1">
            Performance commerciale et suivi des commandes pour le marché algérien.
          </p>
        </div>
        <Link
          to="/admin/products/new"
          className="bg-deep hover:bg-rose-950 text-ivory text-xs font-semibold px-5 py-2.5 rounded-xl transition shadow-sm self-start sm:self-auto cursor-pointer"
        >
          + Nouveau Produit
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Orders */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-mutedText">Total Commandes</span>
            <p className="font-serif text-2xl font-bold text-deep mt-1">{totalOrdersCount}</p>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +12% ce mois
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-mutedText">Chiffre Encaissé</span>
            <p className="font-serif text-2xl font-bold text-deep mt-1">{formatPriceDZD(totalRevenue)}</p>
            <span className="text-[11px] text-mutedText mt-1 block">Commandes livrées & payées</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-mutedText">À Confirmer</span>
            <p className="font-serif text-2xl font-bold text-amber-700 mt-1">{pendingOrdersCount}</p>
            <span className="text-[11px] text-stone-500 mt-1 block">Appel client requis</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-mutedText">Alerte Stock Faible</span>
            <p className="font-serif text-2xl font-bold text-red-600 mt-1">{lowStockProducts.length}</p>
            <span className="text-[11px] text-red-600 font-semibold mt-1 block">&lt; 15 unités restantes</span>
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
            <h2 className="font-serif text-base font-bold text-deep">Activité des Ventes Récentes (Algérie)</h2>
            <span className="text-xs bg-rose-50 text-rose-800 font-semibold px-2.5 py-1 rounded-full">
              Derniers 7 jours
            </span>
          </div>

          <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2">
            {[
              { day: 'Sam', amount: 32000, height: '60%' },
              { day: 'Dim', amount: 48500, height: '85%' },
              { day: 'Lun', amount: 26000, height: '45%' },
              { day: 'Mar', amount: 54000, height: '95%' },
              { day: 'Mer', amount: 41000, height: '70%' },
              { day: 'Jeu', amount: 62000, height: '100%' },
              { day: 'Ven', amount: 18000, height: '35%' },
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-bold text-stone-600 opacity-0 group-hover:opacity-100 transition">
                  {Math.round(bar.amount / 1000)}k
                </span>
                <div 
                  className="w-full bg-rose-100 group-hover:bg-brand-rose rounded-t-xl transition-all duration-300"
                  style={{ height: bar.height }}
                />
                <span className="text-[11px] font-medium text-stone-500">{bar.day}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-mutedText">
            <span>Moyenne quotidienne : <strong>40 200 DA</strong></span>
            <span>Taux de livraison réussi : <strong className="text-emerald-700">96.4%</strong></span>
          </div>
        </div>

        {/* Best Selling Products (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h2 className="font-serif text-base font-bold text-deep">Top Soins & Produits</h2>
            <Link to="/admin/products" className="text-xs text-rose-700 hover:text-rose-900 font-semibold">
              Gérer le stock →
            </Link>
          </div>

          <div className="space-y-3">
            {bestSellers.map(prod => (
              <div key={prod.id} className="flex items-center gap-3 text-xs">
                <img
                  src={prod.images[0]?.url}
                  alt={prod.nameFr}
                  className="w-11 h-11 rounded-xl object-cover bg-stone-50 border border-stone-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-deep truncate">{prod.nameFr}</h4>
                  <p className="text-[11px] text-mutedText">{prod.brand} • {prod.stock} en stock</p>
                </div>
                <span className="font-bold text-deep shrink-0">{formatPriceDZD(prod.price)}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div>
            <h2 className="font-serif text-lg font-bold text-deep">Dernières Commandes Reçues</h2>
            <p className="text-xs text-mutedText">Commandes récentes nécessitant un traitement ou expédition.</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-bold text-rose-800 hover:underline flex items-center gap-1"
          >
            <span>Toutes les commandes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-100 text-mutedText font-semibold uppercase tracking-wider text-[10px]">
                <th className="pb-3">N° Commande</th>
                <th className="pb-3">Cliente</th>
                <th className="pb-3">Wilaya</th>
                <th className="pb-3">Montant TTC</th>
                <th className="pb-3">Statut Commande</th>
                <th className="pb-3">Paiement</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {recentOrders.map(order => (
                <tr key={order.id} className="hover:bg-stone-50/60 transition">
                  <td className="py-3.5 font-mono font-bold text-deep">{order.orderNumber}</td>
                  <td className="py-3.5 font-medium">
                    <p className="text-deep font-semibold">{order.customerName}</p>
                    <p className="text-[11px] text-mutedText">{order.customerPhone}</p>
                  </td>
                  <td className="py-3.5">
                    {order.shippingAddress.wilayaName} ({order.shippingAddress.wilayaCode})
                  </td>
                  <td className="py-3.5 font-bold text-deep">{formatPriceDZD(order.total)}</td>
                  <td className="py-3.5">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${
                      order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                      order.status === 'shipped' ? 'bg-indigo-100 text-indigo-800' :
                      order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {order.status === 'pending' ? 'En attente' : order.status === 'confirmed' ? 'Confirmée' : order.status === 'shipped' ? 'Expédiée' : order.status === 'delivered' ? 'Livrée' : order.status}
                    </span>
                  </td>
                  <td className="py-3.5">
                    <span className="text-[11px] font-medium text-stone-600">
                      {order.paymentMethod === 'cod' ? 'Cash livraison' : 'BaridiMob'}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <Link
                      to={`/admin/orders/${order.id}`}
                      className="inline-flex items-center gap-1 bg-stone-100 hover:bg-rose-100 text-deep text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border border-stone-200 transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Gérer</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
