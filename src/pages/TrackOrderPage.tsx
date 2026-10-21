import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { StorageService } from '@/services/storage';
import { Order, OrderStatus } from '@/types';
import { formatPriceDZD } from '@/data/wilayas';
import { 
  Search, Package, Clock, CheckCircle2, Truck, AlertCircle, Phone, MapPin 
} from 'lucide-react';

export const TrackOrderPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [orderQuery, setOrderQuery] = useState(searchParams.get('ref') || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (orderQuery) {
      handleSearch();
    }
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!orderQuery.trim()) return;

    setSearched(true);
    const found = StorageService.getOrderByNumber(orderQuery.trim());
    setOrder(found || null);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full">En attente de confirmation</span>;
      case 'confirmed':
        return <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">Confirmée par téléphone</span>;
      case 'processing':
        return <span className="bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full">En cours de préparation</span>;
      case 'shipped':
        return <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full">Expédiée (En route)</span>;
      case 'delivered':
        return <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">Colis Livré</span>;
      case 'cancelled':
        return <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full">Annulée</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <span className="text-xs font-bold tracking-widest uppercase text-rose-700">Expéditions 58 Wilayas</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-deep">Suivi de votre commande</h1>
        <p className="text-xs sm:text-sm text-mutedText">
          Saisissez votre numéro de référence (reçu lors de la commande ou par SMS) pour consulter le statut en temps réel.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-card max-w-2xl mx-auto">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-rose-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={orderQuery}
              onChange={(e) => setOrderQuery(e.target.value.toUpperCase())}
              placeholder="Ex: GLW-2024-7821"
              className="w-full text-xs font-mono uppercase pl-10 pr-4 py-3 rounded-xl border border-rose-200 bg-ivory focus:bg-white focus:outline-none focus:border-rose-400"
            />
          </div>
          <button
            type="submit"
            className="bg-deep hover:bg-rose-950 text-ivory text-xs font-semibold px-6 py-3 rounded-xl transition cursor-pointer"
          >
            Rechercher mon colis
          </button>
        </form>

      </div>

      {/* Results View */}
      {order ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-card space-y-8 animate-fadeIn">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-rose-100 gap-4">
            <div>
              <span className="text-[10px] text-mutedText uppercase tracking-wider">Référence</span>
              <h2 className="font-mono text-xl font-bold text-deep">{order.orderNumber}</h2>
              <p className="text-xs text-mutedText mt-0.5">Destinataire : {order.customerName}</p>
            </div>
            <div className="flex flex-col sm:items-end gap-1">
              {getStatusBadge(order.status)}
              <span className="text-[11px] text-mutedText">
                Commandé le {new Date(order.createdAt).toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>

          {/* Carrier Tracking Badge if Shipped */}
          {order.trackingNumber && (
            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Truck className="w-6 h-6 text-indigo-600 shrink-0" />
                <div>
                  <h3 className="text-xs font-bold text-indigo-900">
                    Colis en acheminement via {order.trackingCarrier || 'Yalidine Express'}
                  </h3>
                  <p className="text-xs font-mono text-indigo-800">
                    Numéro de bordereau transporteur : <strong>{order.trackingNumber}</strong>
                  </p>
                </div>
              </div>
              <span className="text-[11px] bg-white text-indigo-900 px-3 py-1 rounded-full font-semibold border border-indigo-200 self-start sm:self-auto">
                Livraison imminente
              </span>
            </div>
          )}

          {/* Timeline History */}
          <div className="space-y-4">
            <h3 className="font-serif text-base font-bold text-deep">Historique de la commande</h3>
            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-rose-200">
              {order.history.map((event, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-rose-600 ring-4 ring-rose-100" />
                  <div className="text-xs space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-deep capitalize">
                        {event.status === 'pending' ? 'Commande reçue' : event.status === 'confirmed' ? 'Confirmée' : event.status === 'shipped' ? 'Expédiée' : event.status === 'delivered' ? 'Livrée' : event.status}
                      </span>
                      <span className="text-[11px] text-mutedText">
                        {new Date(event.timestamp).toLocaleString('fr-FR')}
                      </span>
                    </div>
                    <p className="text-stone-600">{event.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Destination and Order items */}
          <div className="pt-6 border-t border-rose-100 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-1.5">
              <h4 className="font-bold text-deep flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-rose-600" /> Lieu de livraison :
              </h4>
              <p className="text-stone-700">{order.shippingAddress.streetAddress}</p>
              <p className="text-stone-700">
                {order.shippingAddress.commune}, Wilaya de {order.shippingAddress.wilayaName} ({order.shippingAddress.wilayaCode})
              </p>
              <p className="text-mutedText">
                Mode : {order.shippingAddress.deliveryType === 'home' ? 'À domicile' : 'Bureau Stop-Desk'}
              </p>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-bold text-deep uppercase tracking-wider text-[11px]">
                Règlement :
              </h4>
              <p className="text-stone-700">
                {order.paymentMethod === 'cod' ? 'Paiement en espèces à la livraison' : 'BaridiMob / CCP'}
              </p>
              <p className="font-bold text-rose-900 text-sm">
                Montant total : {formatPriceDZD(order.total)}
              </p>
            </div>
          </div>

        </div>
      ) : searched ? (
        <div className="bg-white rounded-3xl p-8 border border-rose-100 shadow-card text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-deep">Aucune commande trouvée</h3>
          <p className="text-xs text-mutedText max-w-md mx-auto">
            Vérifiez l’orthographe du numéro de référence (ex: GLW-2024-XXXX) ou contactez notre service client au {StorageService.getSettings().contactPhone}.
          </p>
        </div>
      ) : null}

    </div>
  );
};
