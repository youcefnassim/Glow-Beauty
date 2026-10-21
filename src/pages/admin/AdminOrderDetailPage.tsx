import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { StorageService } from '@/services/storage';
import { Order, OrderStatus, PaymentStatus } from '@/types';
import { formatPriceDZD } from '@/data/wilayas';
import { 
  ArrowLeft, Save, Truck, ShieldCheck, CheckCircle2, 
  MapPin, Phone, User, Clock, AlertTriangle, Printer, ExternalLink 
} from 'lucide-react';

export const AdminOrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
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
    const text = `Bonjour ${o.customerName},\n\nNous vous contactons de la part de *Glow Beauty DZ* concernant votre commande *${o.orderNumber}* (${formatPriceDZD(o.total)}).\n\nSouhaitez-vous confirmer l'envoi vers ${o.shippingAddress.wilayaName} (${o.shippingAddress.commune}) ?\n\nMerci pour votre confiance ! 🌸`;
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
        <Link to="/admin/orders" className="text-xs text-rose-800 underline">← Retour aux commandes</Link>
        <p className="text-sm">Commande non trouvée.</p>
      </div>
    );
  }

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;

    // Update fulfillment status & history
    const note = statusNote.trim() || `Statut mis à jour vers : ${newStatus}`;
    StorageService.updateOrderStatus(order.id, newStatus, note, 'Administrateur');

    // Update payment & tracking info
    StorageService.updateOrderPayment(order.id, paymentStatus, trackingNumber.trim() || undefined, trackingCarrier);

    const reloaded = StorageService.getOrderById(order.id);
    if (reloaded) setOrder(reloaded);

    setStatusNote('');
    setFeedback('Commande mise à jour avec succès.');
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="max-w-4xl space-y-8">
      
      {/* Header */}
      <div>
        <Link to="/admin/orders" className="inline-flex items-center gap-1.5 text-xs text-mutedText hover:text-deep mb-2 transition">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Retour à toutes les commandes</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-serif text-3xl font-bold text-deep">{order.orderNumber}</h1>
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full capitalize">
                {order.status === 'pending' ? 'En attente' : order.status === 'confirmed' ? 'Confirmée' : order.status === 'shipped' ? 'Expédiée' : order.status === 'delivered' ? 'Livrée' : order.status === 'cancelled' ? 'Annulée' : order.status}
              </span>
            </div>
            <p className="text-xs text-mutedText mt-1">
              Passée le {new Date(order.createdAt).toLocaleString('fr-FR')}
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
              <span>WhatsApp Cliente</span>
            </a>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold px-4 py-2.5 rounded-xl border border-stone-200 shadow-xs transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer Bon</span>
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
          Mettre à jour le statut & l'expédition
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Order Status */}
          <div>
            <label className="text-xs font-semibold text-deep block mb-1">
              Statut de la commande (Fulfillment) *
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
              className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-stone-50 font-bold"
            >
              <option value="pending">En attente d'appel de confirmation</option>
              <option value="confirmed">Confirmée par téléphone</option>
              <option value="processing">En cours de préparation</option>
              <option value="shipped">Expédiée (Colis remis au transporteur)</option>
              <option value="delivered">Colis Livré au client</option>
              <option value="cancelled">Commande Annulée</option>
            </select>
          </div>

          {/* Payment Status */}
          <div>
            <label className="text-xs font-semibold text-deep block mb-1">
              Statut du Paiement (Encaissement) *
            </label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
              className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-stone-50 font-bold"
            >
              <option value="pending">En attente d'encaissement (Livraison en cours)</option>
              <option value="paid">Payé et Encaissé</option>
              <option value="failed">Échec d'encaissement</option>
              <option value="refunded">Remboursé</option>
            </select>
          </div>
        </div>

        {/* Carrier & Tracking */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          <div>
            <label className="text-xs font-semibold text-deep block mb-1">
              Transporteur Partenaire (Algérie)
            </label>
            <select
              value={trackingCarrier}
              onChange={(e) => setTrackingCarrier(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-stone-50"
            >
              <option value="Yalidine Express">Yalidine Express</option>
              <option value="ZR Express">ZR Express</option>
              <option value="Kazitour Express">Kazitour Express</option>
              <option value="Coursier Privé">Coursier Privé Glow Beauty</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-deep block mb-1">
              Numéro de Bordereau / Tracking
            </label>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Ex: YAL-DZ-9823412"
              className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-stone-50 font-mono"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-deep block mb-1">
            Note interne pour l'historique de suivi
          </label>
          <input
            type="text"
            value={statusNote}
            onChange={(e) => setStatusNote(e.target.value)}
            placeholder="Ex: Client confirmé au téléphone, expédié le 20/10..."
            className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-stone-50"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="bg-deep hover:bg-rose-950 text-ivory text-xs font-semibold px-6 py-3 rounded-xl transition shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Enregistrer les mises à jour</span>
          </button>
        </div>
      </form>

      {/* Customer & Address Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-3 text-xs">
          <h3 className="font-serif text-sm font-bold text-deep flex items-center gap-2">
            <User className="w-4 h-4 text-rose-600" />
            Informations de la Cliente
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
            Lieu de Livraison
          </h3>
          <p className="font-medium text-deep">{order.shippingAddress.streetAddress}</p>
          <p className="text-stone-600">
            {order.shippingAddress.commune}, Wilaya de {order.shippingAddress.wilayaName} ({order.shippingAddress.wilayaCode})
          </p>
          <p className="text-rose-900 font-semibold">
            Type : {order.shippingAddress.deliveryType === 'home' ? 'À domicile' : 'Bureau Stop-Desk'}
          </p>
          {order.notes && <p className="text-stone-500 italic">Instructions : « {order.notes} »</p>}
        </div>
      </div>

      {/* Products list in order */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
        <h3 className="font-serif text-base font-bold text-deep pb-2 border-b border-stone-100">
          Articles Commandés ({order.items.length})
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
                  <p className="text-mutedText">Qté: {item.quantity} × {formatPriceDZD(item.unitPrice)}</p>
                </div>
              </div>
              <span className="font-bold text-deep">{formatPriceDZD(item.totalPrice)}</span>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-stone-100 text-xs space-y-1.5 max-w-xs ml-auto">
          <div className="flex justify-between text-mutedText">
            <span>Sous-total :</span>
            <span className="font-semibold text-deep">{formatPriceDZD(order.subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-700">
              <span>Remise promo :</span>
              <span>-{formatPriceDZD(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-mutedText">
            <span>Livraison ({order.shippingAddress.wilayaName}) :</span>
            <span className="font-semibold text-deep">{order.deliveryFee === 0 ? 'Gratuite' : formatPriceDZD(order.deliveryFee)}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-deep pt-1.5 border-t border-stone-200">
            <span>Total Encaissable :</span>
            <span className="font-serif text-lg text-rose-900">{formatPriceDZD(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Status History Timeline */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
        <h3 className="font-serif text-base font-bold text-deep pb-2 border-b border-stone-100">
          Journal d'audit & Historique
        </h3>
        <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-rose-200">
          {order.history.map((h, i) => (
            <div key={i} className="relative text-xs">
              <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-rose-600" />
              <div className="flex items-center gap-2">
                <span className="font-bold text-deep capitalize">{h.status}</span>
                <span className="text-[11px] text-mutedText">{new Date(h.timestamp).toLocaleString('fr-FR')}</span>
                {h.updatedBy && <span className="text-[10px] bg-stone-100 px-1.5 py-0.5 rounded text-stone-600">{h.updatedBy}</span>}
              </div>
              <p className="text-stone-600 mt-0.5">{h.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Hidden on screen, visible only on print: Professional Delivery Slip (A4/A5) */}
      <div id="printable-delivery-slip" className="hidden print:block font-sans text-black p-4">
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight uppercase">Glow Beauty DZ</h1>
            <p className="text-xs text-gray-600">Cosmétiques & Soins de Beauté Haut de Gamme</p>
            <p className="text-xs text-gray-600 mt-1">14 Rue Didouche Mourad, Alger Centre</p>
            <p className="text-xs text-gray-600">Tél: 0550 12 34 56 | contact@glowbeauty.dz</p>
          </div>
          <div className="text-right">
            <div className="inline-block border-2 border-black px-3 py-1 font-mono font-bold text-lg mb-1">
              {order.orderNumber}
            </div>
            <p className="text-xs text-gray-600">Date: {new Date(order.createdAt).toLocaleDateString('fr-FR')}</p>
            <p className="text-xs font-bold uppercase mt-0.5">Transporteur : {order.trackingCarrier || 'Yalidine Express'}</p>
          </div>
        </div>

        {/* Recipient & Shipping Frame */}
        <div className="grid grid-cols-2 gap-4 border-2 border-black p-3 rounded-lg mb-4 text-xs">
          <div>
            <p className="font-bold uppercase text-[10px] text-gray-500 mb-1">DESTINATAIRE (CLIENTE) :</p>
            <p className="text-sm font-bold text-black">{order.customerName}</p>
            <p className="font-mono font-bold text-sm text-black mt-0.5">Tél: {order.customerPhone}</p>
            {order.customerEmail && <p className="text-gray-600">{order.customerEmail}</p>}
          </div>
          <div>
            <p className="font-bold uppercase text-[10px] text-gray-500 mb-1">ADRESSE DE LIVRAISON :</p>
            <p className="font-bold text-black">Wilaya : {order.shippingAddress.wilayaCode} - {order.shippingAddress.wilayaName}</p>
            <p className="font-bold text-black">Commune : {order.shippingAddress.commune}</p>
            <p className="text-black">{order.shippingAddress.streetAddress}</p>
            <p className="mt-1 font-bold inline-block px-2 py-0.5 bg-gray-200 border border-gray-400 rounded text-[11px]">
              Type : {order.shippingAddress.deliveryType === 'home' ? '🏠 À Domicile' : '🏢 Stop-Desk (Bureau)'}
            </p>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full text-xs border-collapse border border-black mb-4">
          <thead>
            <tr className="bg-gray-100 border-b border-black text-left">
              <th className="p-2 border-r border-black">Désignation Produit</th>
              <th className="p-2 border-r border-black text-center">Variante</th>
              <th className="p-2 border-r border-black text-center">Qté</th>
              <th className="p-2 border-r border-black text-right">Prix Unitaire</th>
              <th className="p-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, idx) => (
              <tr key={idx} className="border-b border-gray-300">
                <td className="p-2 border-r border-black font-semibold">{item.productName}</td>
                <td className="p-2 border-r border-black text-center text-gray-600">{item.variantName || '-'}</td>
                <td className="p-2 border-r border-black text-center font-bold">{item.quantity}</td>
                <td className="p-2 border-r border-black text-right font-mono">{formatPriceDZD(item.unitPrice)}</td>
                <td className="p-2 text-right font-mono font-bold">{formatPriceDZD(item.totalPrice)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals & Net COD to Collect */}
        <div className="flex justify-between items-end border-t border-black pt-2 mb-6">
          <div className="text-[11px] text-gray-600 max-w-xs">
            {order.notes && (
              <p className="mb-2 p-1.5 bg-gray-100 border border-gray-300 rounded">
                <strong>Note cliente :</strong> {order.notes}
              </p>
            )}
            <p>Paiement : Espèces à la livraison (Cash on Delivery)</p>
            <p className="italic mt-1">Merci pour votre confiance avec Glow Beauty !</p>
          </div>
          <div className="text-right space-y-1 text-xs">
            <p>Sous-total : <span className="font-mono font-semibold">{formatPriceDZD(order.subtotal)}</span></p>
            {order.discount > 0 && <p className="text-red-600">Remise : -{formatPriceDZD(order.discount)}</p>}
            <p>Frais de livraison : <span className="font-mono font-semibold">{order.deliveryFee === 0 ? 'Gratuit' : formatPriceDZD(order.deliveryFee)}</span></p>
            <div className="border-2 border-black p-2.5 rounded bg-gray-100 text-center mt-2">
              <span className="block text-[10px] font-bold uppercase tracking-wider">MONTANT NET À ENCAISSER (COD)</span>
              <span className="text-xl font-bold font-mono text-black">{formatPriceDZD(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-8 text-[11px] pt-4 border-t border-dashed border-gray-400">
          <div>
            <p className="font-semibold">Signature & Cachet Vendeur :</p>
            <div className="h-16 mt-1 border border-gray-300 rounded bg-gray-50 flex items-center justify-center text-gray-400 text-[10px]">
              Glow Beauty DZ
            </div>
          </div>
          <div>
            <p className="font-semibold">Émargement Cliente / Réception :</p>
            <div className="h-16 mt-1 border border-gray-300 rounded bg-gray-50 flex items-center justify-center text-gray-400 text-[10px]">
              Colis reçu conforme
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
