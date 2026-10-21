import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { StorageService } from '@/services/storage';
import { formatPriceDZD } from '@/data/wilayas';
import { ArrowLeft, Package, Clock, Eye } from 'lucide-react';

export const AccountOrdersPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <p className="text-sm text-mutedText">Veuillez vous connecter pour voir vos commandes.</p>
        <Link to="/login" className="bg-deep text-ivory text-xs font-semibold px-6 py-2.5 rounded-full inline-block mt-4">
          Se connecter
        </Link>
      </div>
    );
  }

  const orders = StorageService.getOrders().filter(o =>
    (o.userId && o.userId === user.id) ||
    (user.email && o.customerEmail?.toLowerCase() === user.email.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <Link to="/account" className="inline-flex items-center gap-1.5 text-xs text-mutedText hover:text-deep mb-3 transition">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Retour à mon compte</span>
        </Link>
        <h1 className="font-serif text-3xl font-bold text-deep">Historique de mes commandes</h1>
        <p className="text-xs text-mutedText mt-1">Consultez le statut et les reçus de tous vos achats.</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-rose-100 shadow-card space-y-4 max-w-lg mx-auto">
          <Package className="w-12 h-12 text-rose-400 mx-auto" />
          <h2 className="font-serif text-lg font-bold text-deep">Aucune commande enregistrée</h2>
          <p className="text-xs text-mutedText">Vous n'avez pas encore passé de commande.</p>
          <Link to="/shop" className="bg-deep text-ivory text-xs font-semibold px-6 py-3 rounded-full inline-block">
            Découvrir la boutique
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-rose-100 shadow-card overflow-hidden divide-y divide-rose-100">
          {orders.map(order => (
            <div key={order.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-deep text-sm">{order.orderNumber}</span>
                  <span className="text-xs text-mutedText">• {new Date(order.createdAt).toLocaleDateString('fr-FR')}</span>
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full capitalize">
                    {order.status === 'pending' ? 'En attente' : order.status === 'confirmed' ? 'Confirmée' : order.status === 'shipped' ? 'Expédiée' : order.status === 'delivered' ? 'Livrée' : order.status}
                  </span>
                </div>
                <p className="text-xs text-stone-600">
                  {order.items.length} article{order.items.length > 1 ? 's' : ''} ({order.items.map(i => i.productName).join(', ')})
                </p>
                <p className="text-[11px] text-mutedText">
                  Livraison à : {order.shippingAddress.commune}, Wilaya de {order.shippingAddress.wilayaName} ({order.shippingAddress.deliveryType === 'home' ? 'Domicile' : 'Stop-Desk'})
                </p>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 pt-2 md:pt-0 border-t md:border-t-0 border-rose-50">
                <div className="text-right">
                  <span className="font-serif text-lg font-bold text-rose-900">{formatPriceDZD(order.total)}</span>
                  <p className="text-[10px] text-mutedText">{order.paymentMethod === 'cod' ? 'Paiement à la livraison' : 'BaridiMob'}</p>
                </div>
                <Link
                  to={`/account/orders/${order.id}`}
                  className="inline-flex items-center gap-1.5 bg-ivory hover:bg-rose-100 text-deep border border-rose-200 text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Détails & Facture</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
