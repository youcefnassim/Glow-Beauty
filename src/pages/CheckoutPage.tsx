import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { StorageService } from '@/services/storage';
import { NotificationService } from '@/services/notificationService';
import { ALGERIA_WILAYAS, WILAYA_COMMUNES, formatPriceDZD } from '@/data/wilayas';
import { Order, PaymentMethod } from '@/types';
import confetti from 'canvas-confetti';
import { 
  ShieldCheck, ArrowLeft, CheckCircle2, AlertCircle, 
  Truck, Building2, CreditCard, Lock, Clock 
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { 
    items, 
    subtotal, 
    discount, 
    deliveryFee, 
    total, 
    appliedCoupon, 
    clearCart,
    selectedWilayaCode,
    setSelectedWilayaCode,
    selectedDeliveryType,
    setSelectedDeliveryType
  } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form Fields
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [wilayaCode, setWilayaCode] = useState<number>(selectedWilayaCode);
  const [commune, setCommune] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');

  // Submission & Validation States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync wilaya change with cart context for fee recalculation
  useEffect(() => {
    setSelectedWilayaCode(wilayaCode);
  }, [wilayaCode, setSelectedWilayaCode]);

  // If cart is empty, redirect to cart page
  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  const communesList = WILAYA_COMMUNES[wilayaCode] || [];

  const validatePhone = (val: string): boolean => {
    // Algerian numbers: Mobile 10 digits (05/06/07 xx xx xx) or Landline 9 digits (02x/03x/04x xx xx xx)
    const cleaned = val.replace(/\s+/g, '').replace(/-/g, '');
    const regex = /^(0(5|6|7)[0-9]{8}|0[2-4][0-9]{7})$/;
    return regex.test(cleaned);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation checks
    if (!fullName.trim() || fullName.trim().length < 3) {
      setErrorMessage('Veuillez renseigner votre nom et prénom complets.');
      return;
    }

    if (!validatePhone(phone)) {
      setErrorMessage('Veuillez saisir un numéro de téléphone algérien valide (ex: 0550 12 34 56 ou 0661 xx xx xx).');
      return;
    }

    if (!commune.trim()) {
      setErrorMessage('Veuillez préciser votre commune.');
      return;
    }

    if (!streetAddress.trim() || streetAddress.trim().length < 5) {
      setErrorMessage('Veuillez indiquer une adresse de livraison précise (Quartier, Bâtiment, Numéro de rue).');
      return;
    }

    if (items.length === 0) {
      setErrorMessage('Votre panier est vide.');
      return;
    }

    // Prevent double submissions
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const selectedWilayaObj = ALGERIA_WILAYAS.find(w => w.code === wilayaCode);
      const wilayaName = selectedWilayaObj ? selectedWilayaObj.nameFr : 'Alger';

      // Re-verify stock before creating authoritative order
      const freshProducts = StorageService.getProducts();
      for (const item of items) {
        const p = freshProducts.find(fp => fp.id === item.productId);
        if (!p || p.stock < item.quantity) {
          throw new Error(`Le produit « ${item.product.nameFr} » n’a plus assez de stock disponible.`);
        }
      }

      // Create Order in StorageService
      const newOrder = StorageService.createOrder({
        userId: user?.id,
        customerName: fullName.trim(),
        customerPhone: phone.trim(),
        customerEmail: email.trim() || undefined,
        shippingAddress: {
          id: `addr-${Date.now()}`,
          fullName: fullName.trim(),
          phone: phone.trim(),
          wilayaCode,
          wilayaName,
          commune: commune.trim(),
          streetAddress: streetAddress.trim(),
          deliveryType: selectedDeliveryType,
        },
        items: items.map(i => ({
          id: `ord-item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          orderId: '',
          productId: i.productId,
          productName: i.product.nameFr,
          variantName: i.variant?.name,
          unitPrice: i.priceAtAddition,
          quantity: i.quantity,
          totalPrice: i.priceAtAddition * i.quantity,
          imageUrl: i.product.images[0]?.url,
        })),
        subtotal,
        discount,
        deliveryFee,
        total,
        couponCode: appliedCoupon?.code,
        status: 'pending',
        paymentMethod,
        paymentStatus: 'pending',
        notes: deliveryNotes.trim() || undefined,
      });

      // Autonomous Notifications (Option 2: Telegram Bot & Google Sheet Webhook)
      NotificationService.sendTelegramNotification(newOrder).catch((e) => console.warn('Telegram notify error:', e));
      NotificationService.sendGoogleSheetWebhook(newOrder).catch((e) => console.warn('Sheet webhook error:', e));

      // Confetti celebration
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#C58E91', '#EAD5D2', '#352A27', '#D4AF37'],
        });
      } catch (e) {
        console.error(e);
      }

      // Clear cart
      clearCart();

      // Navigate to order confirmation
      navigate(`/order-confirmation/${newOrder.orderNumber}`, { state: { order: newOrder } });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Une erreur inattendue est survenue.';
      setErrorMessage(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Top Banner */}
      <div className="mb-8">
        <Link to="/cart" className="inline-flex items-center gap-1.5 text-xs text-mutedText hover:text-deep mb-3 transition">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Retour au panier</span>
        </Link>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-deep">Finaliser ma commande</h1>
        <p className="text-xs sm:text-sm text-mutedText mt-1">
          Paiement sécurisé en espèces à la livraison. Livraison rapide sur les 58 wilayas d’Algérie.
        </p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Form Details (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* 1. Customer Coordinates */}
          <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-card space-y-4">
            <h2 className="font-serif text-base font-bold text-deep flex items-center gap-2 pb-3 border-b border-rose-100">
              <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-800 text-xs flex items-center justify-center font-sans font-bold">1</span>
              Coordonnées de la cliente
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-deep block mb-1">
                  Nom et Prénom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ex: Sophia Meziane"
                  className="w-full text-xs p-3 rounded-xl border border-rose-200 bg-ivory focus:bg-white focus:outline-none focus:border-rose-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-deep block mb-1">
                    Numéro de Téléphone (Mobile) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ex: 0550 12 34 56 ou 0661..."
                    className="w-full text-xs p-3 rounded-xl border border-rose-200 bg-ivory focus:bg-white focus:outline-none focus:border-rose-400"
                  />
                  <span className="text-[10px] text-mutedText mt-1 block">
                    Important: Notre conseiller vous appellera pour confirmer l'envoi.
                  </span>
                </div>

                <div>
                  <label className="text-xs font-semibold text-deep block mb-1">
                    Adresse E-mail (Optionnelle)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Pour recevoir le récapitulatif"
                    className="w-full text-xs p-3 rounded-xl border border-rose-200 bg-ivory focus:bg-white focus:outline-none focus:border-rose-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Delivery Address in Algeria */}
          <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-card space-y-4">
            <h2 className="font-serif text-base font-bold text-deep flex items-center gap-2 pb-3 border-b border-rose-100">
              <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-800 text-xs flex items-center justify-center font-sans font-bold">2</span>
              Adresse de livraison en Algérie
            </h2>

            <div className="space-y-4">
              {/* Delivery Type Option */}
              <div>
                <label className="text-xs font-semibold text-deep block mb-1.5 uppercase tracking-wider">
                  Type de livraison :
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setSelectedDeliveryType('home')}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-start gap-3 ${
                      selectedDeliveryType === 'home'
                        ? 'border-deep bg-rose-50/50 ring-1 ring-deep'
                        : 'border-rose-200 bg-white hover:bg-rose-50/30'
                    }`}
                  >
                    <Truck className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-deep">Livraison à domicile</p>
                      <p className="text-[11px] text-mutedText">Remis en mains propres à votre porte</p>
                    </div>
                  </div>

                  <div
                    onClick={() => setSelectedDeliveryType('stopdesk')}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-start gap-3 ${
                      selectedDeliveryType === 'stopdesk'
                        ? 'border-deep bg-rose-50/50 ring-1 ring-deep'
                        : 'border-rose-200 bg-white hover:bg-rose-50/30'
                    }`}
                  >
                    <Building2 className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-deep">Bureau Stop-Desk</p>
                      <p className="text-[11px] text-mutedText">Retrait au centre Yalidine le plus proche</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Wilaya & Commune Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-deep block mb-1">
                    Wilaya <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={wilayaCode}
                    onChange={(e) => {
                      const code = Number(e.target.value);
                      setWilayaCode(code);
                      setCommune('');
                    }}
                    className="w-full text-xs p-3 rounded-xl border border-rose-200 bg-ivory font-medium"
                  >
                    {ALGERIA_WILAYAS.map(w => (
                      <option key={w.code} value={w.code}>
                        {w.code} - {w.nameFr} ({w.nameAr})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-deep block mb-1">
                    Commune <span className="text-red-500">*</span>
                  </label>
                  {communesList.length > 0 ? (
                    <select
                      value={commune}
                      onChange={(e) => setCommune(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-rose-200 bg-ivory"
                    >
                      <option value="">Sélectionnez votre commune</option>
                      {communesList.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      required
                      value={commune}
                      onChange={(e) => setCommune(e.target.value)}
                      placeholder="Nom de votre commune"
                      className="w-full text-xs p-3 rounded-xl border border-rose-200 bg-ivory"
                    />
                  )}
                </div>
              </div>

              {/* Full Street Address */}
              <div>
                <label className="text-xs font-semibold text-deep block mb-1">
                  Adresse exacte (Quartier, Cité, Rue, Bâtiment, Étage) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="Ex: Cité 500 Logements, Bâtiment 4, Porte 12"
                  className="w-full text-xs p-3 rounded-xl border border-rose-200 bg-ivory"
                />
              </div>

              {/* Delivery Instructions */}
              <div>
                <label className="text-xs font-semibold text-deep block mb-1">
                  Instructions de livraison (Optionnel)
                </label>
                <input
                  type="text"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  placeholder="Ex: Appeler avant d’arriver, disponible après 14h..."
                  className="w-full text-xs p-3 rounded-xl border border-rose-200 bg-ivory"
                />
              </div>
            </div>
          </div>

          {/* 3. Payment Method */}
          <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-card space-y-4">
            <h2 className="font-serif text-base font-bold text-deep flex items-center gap-2 pb-3 border-b border-rose-100">
              <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-800 text-xs flex items-center justify-center font-sans font-bold">3</span>
              Mode de paiement
            </h2>

            <div className="space-y-3">
              {/* Option 1: Cash on Delivery (Standard in Algeria) */}
              <label 
                className={`p-4 rounded-2xl border transition flex items-start gap-3 cursor-pointer ${
                  paymentMethod === 'cod' ? 'border-deep bg-rose-50/50 ring-1 ring-deep' : 'border-rose-200 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="mt-1 text-rose-700"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-deep">Paiement à la livraison (En espèces)</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Recommandé
                    </span>
                  </div>
                  <p className="text-[11px] text-mutedText mt-0.5">
                    Réglez en dinars algériens (DZD) directement au livreur lors de la réception de votre colis.
                  </p>
                </div>
              </label>

              {/* Option 2: BaridiMob / CCP */}
              <label 
                className={`p-4 rounded-2xl border transition flex items-start gap-3 cursor-pointer ${
                  paymentMethod === 'baridimob' ? 'border-deep bg-rose-50/50 ring-1 ring-deep' : 'border-rose-200 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="baridimob"
                  checked={paymentMethod === 'baridimob'}
                  onChange={() => setPaymentMethod('baridimob')}
                  className="mt-1 text-rose-700"
                />
                <div>
                  <span className="text-xs font-bold text-deep">BaridiMob / Virement postal (Algérie Poste)</span>
                  <p className="text-[11px] text-mutedText mt-0.5">
                    Effectuez le virement vers notre RIP Algérie Poste. Les instructions vous seront transmises après confirmation téléphonique.
                  </p>
                </div>
              </label>

              {/* Option 3: Online Edahabia/CIB (Disabled with transparent explanation) */}
              <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/60 opacity-75 flex items-start gap-3">
                <input type="radio" disabled className="mt-1" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-600">Carte Edahabia / CIB (En ligne)</span>
                    <span className="bg-stone-200 text-stone-700 text-[9px] font-semibold px-2 py-0.5 rounded">
                      En cours d’agrément SATIM
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-500 mt-0.5">
                    Le module de paiement électronique bancaire est en cours d’intégration officielle auprès de la SATIM. Choisissez le paiement à la livraison.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Order Review Sidebar (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-luxury space-y-5 sticky top-28">
            <h2 className="font-serif text-lg font-bold text-deep pb-3 border-b border-rose-100">
              Articles commandés ({items.length})
            </h2>

            {/* Items summary */}
            <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-3 text-xs">
                  <img
                    src={item.product.images[0]?.url}
                    alt={item.product.nameFr}
                    className="w-14 h-14 rounded-xl object-cover bg-ivory border border-rose-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-deep truncate">{item.product.nameFr}</p>
                    {item.variant && <p className="text-[11px] text-rose-700">{item.variant.name}</p>}
                    <p className="text-mutedText">Qté: {item.quantity} × {formatPriceDZD(item.priceAtAddition)}</p>
                  </div>
                  <span className="font-bold text-deep shrink-0">
                    {formatPriceDZD(item.priceAtAddition * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Cost Breakdown */}
            <div className="pt-3 border-t border-rose-100 space-y-2 text-xs">
              <div className="flex justify-between text-mutedText">
                <span>Sous-total</span>
                <span className="font-semibold text-deep">{formatPriceDZD(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Remise ({appliedCoupon?.code})</span>
                  <span>-{formatPriceDZD(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-mutedText">
                <span>Frais de livraison ({selectedDeliveryType === 'home' ? 'Domicile' : 'Stop-Desk'})</span>
                <span className="font-semibold text-deep">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-700 font-bold">Gratuite</span>
                  ) : (
                    formatPriceDZD(deliveryFee)
                  )}
                </span>
              </div>
              <div className="flex justify-between items-baseline text-base font-bold text-deep pt-3 border-t border-rose-200">
                <span>Total à régler</span>
                <span className="font-serif text-2xl text-rose-900">{formatPriceDZD(total)}</span>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-deep hover:bg-rose-950 text-ivory font-semibold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-luxury hover:shadow-xl transition cursor-pointer text-sm disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>Validation de la commande en cours...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Confirmer la commande ({formatPriceDZD(total)})</span>
                </>
              )}
            </button>

            <div className="space-y-1.5 pt-2 text-[11px] text-stone-500 text-center">
              <p className="flex items-center justify-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-stone-400" />
                Commande garantie • Aucun paiement bancaire préalable requis
              </p>
              <p>Notre équipe vous appellera sous 2 heures pour confirmer l'expédition.</p>
            </div>
          </div>
        </div>

      </form>

    </div>
  );
};
