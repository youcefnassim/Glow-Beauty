import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { StorageService } from '@/services/storage';
import { Order } from '@/types';
import { formatPriceDZD } from '@/data/wilayas';
import { ArrowLeft, Printer, MapPin, Truck, ShieldCheck, Clock } from 'lucide-react';

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (id) {
      const found = StorageService.getOrderById(id);
      setOrder(found || null);
    }
  }, [id]);

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-deep">Commande introuvable</h2>
        <Link to="/account/orders" className="text-xs text-rose-800 font-semibold underline">
          Retour à la liste des commandes
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-rose-100 gap-4">
        <div>
          <Link to="/account/orders" className="inline-flex items-center gap-1.5 text-xs text-mutedText hover:text-deep mb-2 transition">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Retour à mes commandes</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-deep">
              Commande {order.orderNumber}
            </h1>
            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full capitalize">
              {order.status === 'pending' ? 'En attente' : order.status === 'confirmed' ? 'Confirmée' : order.status === 'shipped' ? 'Expédiée' : order.status === 'delivered' ? 'Livrée' : order.status}
            </span>
          </div>
          <p className="text-xs text-mutedText mt-1">
            Passée le {new Date(order.createdAt).toLocaleDateString('fr-FR', {
              day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
            })}
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 bg-white hover:bg-rose-50 text-deep border border-rose-200 text-xs font-semibold px-4 py-2.5 rounded-xl transition cursor-pointer self-start sm:self-auto"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimer la facture</span>
        </button>
      </div>

      {/* Main Order Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-card space-y-6">
        
        {/* Shipping address & payment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs pb-6 border-b border-rose-100">
          <div className="space-y-1.5">
            <h3 className="font-bold text-deep uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-600" /> Adresse de livraison
            </h3>
            <p className="font-semibold text-deep">{order.shippingAddress.fullName}</p>
            <p className="text-stone-600">{order.shippingAddress.streetAddress}</p>
            <p className="text-stone-600">
              {order.shippingAddress.commune}, Wilaya de {order.shippingAddress.wilayaName} ({order.shippingAddress.wilayaCode})
            </p>
            <p className="text-rose-800 font-medium">
              Mode : {order.shippingAddress.deliveryType === 'home' ? 'À domicile' : 'Bureau Stop-Desk'}
            </p>
            <p className="text-stone-500">Tél : {order.customerPhone}</p>
          </div>

          <div className="space-y-1.5">
            <h3 className="font-bold text-deep uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-600" /> Mode de règlement
            </h3>
            <p className="font-semibold text-deep">
              {order.paymentMethod === 'cod' ? 'Paiement en espèces à la livraison' : 'BaridiMob / CCP'}
            </p>
            <p className="text-stone-600">
              Statut paiement : <span className="capitalize font-bold text-amber-800">{order.paymentStatus === 'paid' ? 'Payé' : 'En attente d’encaissement'}</span>
            </p>
            {order.trackingNumber && (
              <p className="text-indigo-800 font-mono text-[11px] bg-indigo-50 p-2 rounded-lg mt-2">
                N° de suivi {order.trackingCarrier} : <strong>{order.trackingNumber}</strong>
              </p>
            )}
          </div>
        </div>

        {/* Ordered items */}
        <div className="space-y-3">
          <h3 className="font-serif text-sm font-bold text-deep">Articles inclus</h3>
          {order.items.map(item => (
            <div key={item.id} className="flex items-center justify-between text-xs py-3 border-b border-rose-50">
              <div className="flex items-center gap-3">
                {item.imageUrl && (
                  <img src={item.imageUrl} alt={item.productName} className="w-14 h-14 rounded-xl object-cover bg-ivory border border-rose-100" />
                )}
                <div>
                  <h4 className="font-bold text-deep">{item.productName}</h4>
                  {item.variantName && <p className="text-[11px] text-rose-700">{item.variantName}</p>}
                  <p className="text-mutedText">Qté: {item.quantity} × {formatPriceDZD(item.unitPrice)}</p>
                </div>
              </div>
              <span className="font-bold text-deep text-sm">{formatPriceDZD(item.totalPrice)}</span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="space-y-2 text-xs pt-4 border-t border-rose-100 max-w-sm ml-auto">
          <div className="flex justify-between text-mutedText">
            <span>Sous-total</span>
            <span className="font-semibold text-deep">{formatPriceDZD(order.subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-700">
              <span>Remise</span>
              <span>-{formatPriceDZD(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-mutedText">
            <span>Frais de livraison ({order.shippingAddress.wilayaName})</span>
            <span className="font-semibold text-deep">{order.deliveryFee === 0 ? 'Gratuit' : formatPriceDZD(order.deliveryFee)}</span>
          </div>
          <div className="flex justify-between items-baseline text-base font-bold text-deep pt-2 border-t border-rose-200">
            <span>Total TTC</span>
            <span className="font-serif text-xl text-rose-900">{formatPriceDZD(order.total)}</span>
          </div>
        </div>

      </div>

    </div>
  );
};
