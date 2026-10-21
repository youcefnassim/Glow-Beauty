import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { StorageService } from '@/services/storage';
import { NotificationService } from '@/services/notificationService';
import { Order } from '@/types';
import { formatPriceDZD } from '@/data/wilayas';
import { 
  CheckCircle2, PackageCheck, PhoneCall, Truck, Printer, 
  ArrowRight, Clock, ShieldCheck, MapPin 
} from 'lucide-react';

export const OrderConfirmationPage: React.FC = () => {
  const { orderReference } = useParams<{ orderReference: string }>();
  const location = useLocation();
  const [order, setOrder] = useState<Order | null>((location.state as { order?: Order })?.order || null);

  useEffect(() => {
    if (!order && orderReference) {
      const found = StorageService.getOrderByNumber(orderReference);
      if (found) {
        setOrder(found);
      }
    }
  }, [order, orderReference]);

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-deep">Recherche de votre commande...</h2>
        <p className="text-sm text-mutedText">
          Si votre confirmation ne s'affiche pas, vérifiez votre numéro de commande dans la page de suivi.
        </p>
        <Link to="/track-order" className="bg-deep text-ivory text-xs font-semibold px-6 py-3 rounded-full inline-block">
          Suivre une commande
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Success Hero Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-soft">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Commande enregistrée avec succès
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-deep">
          Merci pour votre confiance, {order.customerName.split(' ')[0]} !
        </h1>
        <p className="text-xs sm:text-sm text-mutedText max-w-lg mx-auto">
          Votre commande porte la référence unique <strong className="font-mono text-rose-800">{order.orderNumber}</strong>. Notre équipe prépare votre colis avec le plus grand soin.
        </p>
      </div>

      {/* Next Steps Progress Alert */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-card space-y-6">
        <h2 className="font-serif text-lg font-bold text-deep flex items-center gap-2">
          <Clock className="w-5 h-5 text-rose-600" />
          Prochaines étapes de votre livraison :
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-800 font-bold text-xs flex items-center justify-center shrink-0">
              1
            </div>
            <div>
              <h3 className="text-xs font-bold text-deep flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-rose-600" /> Appel de confirmation
              </h3>
              <p className="text-[11px] text-mutedText mt-1">
                Notre conseiller vous contacte au <strong>{order.customerPhone}</strong> sous 2 heures pour valider vos coordonnées.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-800 font-bold text-xs flex items-center justify-center shrink-0">
              2
            </div>
            <div>
              <h3 className="text-xs font-bold text-deep flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-rose-600" /> Expédition 58 Wilayas
              </h3>
              <p className="text-[11px] text-mutedText mt-1">
                Votre colis est confié au transporteur. Vous recevrez un SMS avec le numéro de suivi Yalidine / ZR Express.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-800 font-bold text-xs flex items-center justify-center shrink-0">
              3
            </div>
            <div>
              <h3 className="text-xs font-bold text-deep flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-rose-600" /> Paiement à la réception
              </h3>
              <p className="text-[11px] text-mutedText mt-1">
                Vous réglez le montant exact de <strong>{formatPriceDZD(order.total)}</strong> en espèces directement au livreur.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Fast Confirmation Callout */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-white rounded-3xl p-6 border border-emerald-200/80 shadow-soft flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 2.013.82 2.796.82 3.183 0 5.768-2.587 5.768-5.766.001-3.182-2.585-5.766-5.768-5.766zm9.969 5.766c0 5.518-4.482 10-10 10-1.708 0-3.32-.435-4.733-1.2l-5.267 1.382 1.407-5.139c-.878-1.488-1.407-3.232-1.407-5.043 0-5.518 4.482-10 10-10s10 4.482 10 10z"/>
            </svg>
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-deep">
              Accélérez le départ de votre colis !
            </h3>
            <p className="text-xs text-stone-600 mt-0.5">
              Validez immédiatement vos coordonnées avec notre équipe sur WhatsApp sans attendre l’appel téléphonique.
            </p>
          </div>
        </div>

        <a
          href={NotificationService.getWhatsAppOrderUrl(order)}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full md:w-auto shrink-0 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6 py-3.5 rounded-full transition-all shadow-md hover:scale-[1.02] cursor-pointer"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 2.013.82 2.796.82 3.183 0 5.768-2.587 5.768-5.766.001-3.182-2.585-5.766-5.768-5.766zm9.969 5.766c0 5.518-4.482 10-10 10-1.708 0-3.32-.435-4.733-1.2l-5.267 1.382 1.407-5.139c-.878-1.488-1.407-3.232-1.407-5.043 0-5.518 4.482-10 10-10s10 4.482 10 10z"/>
          </svg>
          <span>Confirmer ma commande sur WhatsApp</span>
        </a>
      </div>

      {/* Order Details & Summary Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-rose-100 gap-2">
          <div>
            <span className="text-[10px] text-mutedText uppercase tracking-wider">Référence Commande</span>
            <p className="font-mono text-lg font-bold text-deep">{order.orderNumber}</p>
          </div>
          <div>
            <span className="text-[10px] text-mutedText uppercase tracking-wider">Date & Heure</span>
            <p className="text-xs font-semibold text-deep">
              {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
              })}
            </p>
          </div>
          <div>
            <span className="text-[10px] text-mutedText uppercase tracking-wider">Statut</span>
            <p className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 inline-block">
              En attente de confirmation
            </p>
          </div>
        </div>

        {/* Shipping details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="space-y-1.5">
            <h3 className="font-bold text-deep flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-rose-600" /> Adresse de réception :
            </h3>
            <p className="text-stone-700 font-medium">{order.shippingAddress.fullName}</p>
            <p className="text-mutedText">{order.shippingAddress.streetAddress}</p>
            <p className="text-mutedText">
              {order.shippingAddress.commune}, Wilaya de {order.shippingAddress.wilayaName} ({order.shippingAddress.wilayaCode})
            </p>
            <p className="text-rose-800 font-semibold">
              Mode : {order.shippingAddress.deliveryType === 'home' ? 'Livraison à domicile' : 'Bureau Stop-Desk'}
            </p>
          </div>

          <div className="space-y-1.5">
            <h3 className="font-bold text-deep uppercase tracking-wider text-[11px]">
              Mode de Règlement :
            </h3>
            <p className="text-stone-700 font-medium">
              {order.paymentMethod === 'cod' ? 'Paiement à la livraison (En espèces)' : 'BaridiMob / CCP'}
            </p>
            <p className="text-stone-500 text-[11px]">
              Statut du paiement : En attente de remise au livreur ({formatPriceDZD(order.total)})
            </p>
            {order.notes && (
              <p className="text-mutedText italic text-[11px]">Note : « {order.notes} »</p>
            )}
          </div>
        </div>

        {/* Items List */}
        <div className="pt-4 border-t border-rose-100">
          <h3 className="font-serif text-sm font-bold text-deep mb-3">Produits commandés</h3>
          <div className="space-y-3">
            {order.items.map(item => (
              <div key={item.id} className="flex items-center justify-between text-xs py-2 border-b border-rose-50">
                <div className="flex items-center gap-3">
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.productName} className="w-12 h-12 rounded-lg object-cover bg-ivory" />
                  )}
                  <div>
                    <h4 className="font-semibold text-deep">{item.productName}</h4>
                    {item.variantName && <p className="text-[11px] text-rose-700">{item.variantName}</p>}
                    <p className="text-mutedText">Quantité: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-bold text-deep">{formatPriceDZD(item.totalPrice)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Totals */}
        <div className="space-y-1.5 text-xs pt-2 border-t border-rose-100">
          <div className="flex justify-between text-mutedText">
            <span>Sous-total</span>
            <span>{formatPriceDZD(order.subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-700 font-medium">
              <span>Remise</span>
              <span>-{formatPriceDZD(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-mutedText">
            <span>Livraison ({order.shippingAddress.wilayaName})</span>
            <span>{order.deliveryFee === 0 ? 'Offerte' : formatPriceDZD(order.deliveryFee)}</span>
          </div>
          <div className="flex justify-between items-baseline text-base font-bold text-deep pt-2 border-t border-rose-200">
            <span>Total à régler au livreur</span>
            <span className="font-serif text-xl text-rose-900">{formatPriceDZD(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button
          onClick={() => window.print()}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-rose-50 text-deep border border-rose-200 text-xs font-semibold px-6 py-3 rounded-full transition shadow-xs cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimer le reçu</span>
        </button>

        <Link
          to={`/track-order?ref=${order.orderNumber}`}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-deep hover:bg-rose-950 text-ivory text-xs font-semibold px-8 py-3 rounded-full transition shadow-luxury cursor-pointer"
        >
          <PackageCheck className="w-4 h-4" />
          <span>Suivre l’avancement de mon colis</span>
        </Link>
      </div>

    </div>
  );
};
