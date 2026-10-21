import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { formatPriceDZD, ALGERIA_WILAYAS } from '@/data/wilayas';
import { 
  ShoppingBag, Trash2, ArrowRight, ArrowLeft, Plus, Minus, 
  Tag, Truck, ShieldCheck, CheckCircle2, AlertCircle 
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const { 
    items, 
    subtotal, 
    discount, 
    deliveryFee, 
    total, 
    updateQuantity, 
    removeItem, 
    clearCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    couponError,
    selectedWilayaCode,
    setSelectedWilayaCode,
    selectedDeliveryType,
    setSelectedDeliveryType,
    freeDeliveryThreshold,
    amountNeededForFreeShipping
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponFeedback(res.message);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-400 mx-auto flex items-center justify-center">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-deep">Votre panier est actuellement vide</h1>
        <p className="text-sm text-mutedText max-w-md mx-auto">
          Découvrez notre collection de haute cosmétique et créez votre rituel sur-mesure pour sublimer votre peau.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 bg-deep hover:bg-rose-950 text-ivory text-xs font-semibold px-8 py-3.5 rounded-full transition shadow-luxury"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Découvrir la collection de cosmétiques</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Title & Back */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-rose-100 gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-deep">Mon Panier d'Achats</h1>
          <p className="text-xs text-mutedText mt-0.5">
            {items.reduce((s, i) => s + i.quantity, 0)} articles sélectionnés
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-red-600 hover:text-red-800 underline self-start sm:self-auto cursor-pointer"
        >
          Vider l'ensemble du panier
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Cart Items List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Free Shipping Progress bar */}
          <div className="p-4 rounded-2xl bg-white border border-rose-100 shadow-xs flex items-center gap-3">
            <Truck className="w-5 h-5 text-rose-600 shrink-0" />
            <div className="flex-1 text-xs">
              {amountNeededForFreeShipping === 0 ? (
                <span className="font-bold text-emerald-700">
                  Félicitations ! Vous bénéficiez de la livraison offerte sur les 58 wilayas d’Algérie !
                </span>
              ) : (
                <span>
                  Ajoutez encore <strong className="text-rose-800">{formatPriceDZD(amountNeededForFreeShipping)}</strong> pour débloquer la <strong>livraison gratuite</strong> !
                </span>
              )}
              <div className="w-full bg-rose-100 rounded-full h-1.5 mt-2 overflow-hidden">
                <div 
                  className="bg-brand-rose h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100))}%` }}
                />
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="bg-white rounded-3xl border border-rose-100/80 shadow-card overflow-hidden divide-y divide-rose-100/60">
            {items.map(item => (
              <div key={item.id} className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <img
                    src={item.product.images[0]?.url}
                    alt={item.product.nameFr}
                    className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl object-cover bg-ivory border border-rose-100 shrink-0"
                  />
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold text-rose-700 uppercase tracking-wider">{item.product.brand}</p>
                    <Link to={`/products/${item.product.slug}`} className="font-serif text-sm font-semibold text-deep hover:text-rose-800 line-clamp-1">
                      {item.product.nameFr}
                    </Link>
                    {item.variant && (
                      <p className="text-xs text-stone-500">
                        Option: <strong className="text-deep">{item.variant.name}</strong>
                      </p>
                    )}
                    <p className="text-xs font-bold text-deep sm:hidden">
                      {formatPriceDZD(item.priceAtAddition)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0">
                  {/* Quantity controls */}
                  <div className="flex items-center border border-rose-200 rounded-xl bg-ivory overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 hover:bg-rose-100 text-deep transition cursor-pointer"
                      aria-label="Diminuer la quantité de l'article"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-deep min-w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 hover:bg-rose-100 text-deep transition cursor-pointer"
                      aria-label="Augmenter la quantité de l'article"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Subtotal for line */}
                  <div className="text-right min-w-24">
                    <span className="font-serif text-sm sm:text-base font-bold text-deep">
                      {formatPriceDZD(item.priceAtAddition * item.quantity)}
                    </span>
                    <p className="text-[11px] text-mutedText hidden sm:block">
                      {formatPriceDZD(item.priceAtAddition)} / unité
                    </p>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-stone-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition cursor-pointer"
                    title="Supprimer cet article"
                    aria-label="Supprimer cet article"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-deep hover:text-rose-800 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Continuer mes achats</span>
            </Link>
          </div>
        </div>

        {/* Order Summary Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-luxury space-y-5">
            <h2 className="font-serif text-lg font-bold text-deep pb-3 border-b border-rose-100">
              Récapitulatif de Commande
            </h2>

            {/* Wilaya Estimator */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-deep block uppercase tracking-wider">
                Estimer la livraison (Wilaya) :
              </label>
              <select
                value={selectedWilayaCode}
                onChange={(e) => setSelectedWilayaCode(Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-xl border border-rose-200 bg-ivory text-deep font-medium"
                aria-label="Sélectionner la wilaya de livraison"
              >
                {ALGERIA_WILAYAS.map(w => (
                  <option key={w.code} value={w.code}>
                    {w.code} - {w.nameFr} ({w.nameAr})
                  </option>
                ))}
              </select>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedDeliveryType('home')}
                  className={`p-2 rounded-xl text-xs font-medium border text-center transition cursor-pointer ${
                    selectedDeliveryType === 'home'
                      ? 'border-deep bg-deep text-ivory font-bold'
                      : 'border-rose-200 bg-ivory text-deep hover:bg-rose-50'
                  }`}
                >
                  À domicile
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDeliveryType('stopdesk')}
                  className={`p-2 rounded-xl text-xs font-medium border text-center transition cursor-pointer ${
                    selectedDeliveryType === 'stopdesk'
                      ? 'border-deep bg-deep text-ivory font-bold'
                      : 'border-rose-200 bg-ivory text-deep hover:bg-rose-50'
                  }`}
                >
                  Bureau Stop-desk
                </button>
              </div>
            </div>

            {/* Promo Code Input */}
            <div className="pt-2 border-t border-rose-100 space-y-2">
              <label className="text-xs font-semibold text-deep block uppercase tracking-wider">
                Code de réduction
              </label>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                  <div>
                    <span className="font-bold text-emerald-900">{appliedCoupon.code}</span>
                    <span className="text-emerald-700 ml-1.5">
                      (-{appliedCoupon.discountType === 'percentage' ? `${appliedCoupon.discountValue}%` : `${appliedCoupon.discountValue} DA`})
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-red-500 hover:text-red-700 text-xs font-bold underline cursor-pointer"
                  >
                    Retirer
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Ex: BIENVENUE10"
                    className="w-full text-xs p-2.5 rounded-xl border border-rose-200 bg-ivory uppercase font-mono"
                  />
                  <button
                    type="submit"
                    className="bg-deep text-ivory text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-rose-950 transition cursor-pointer shrink-0"
                  >
                    Appliquer
                  </button>
                </form>
              )}
              {couponError && (
                <p className="text-[11px] text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {couponError}
                </p>
              )}
              {couponFeedback && !couponError && (
                <p className="text-[11px] text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 shrink-0" />
                  {couponFeedback}
                </p>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2 text-xs pt-3 border-t border-rose-100">
              <div className="flex justify-between text-mutedText">
                <span>Sous-total articles</span>
                <span className="font-semibold text-deep">{formatPriceDZD(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Remise code promo</span>
                  <span>-{formatPriceDZD(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-mutedText">
                <span>Frais de livraison</span>
                <span className="font-semibold text-deep">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-700 font-bold">Gratuite</span>
                  ) : (
                    formatPriceDZD(deliveryFee)
                  )}
                </span>
              </div>
              <div className="flex justify-between items-baseline text-base font-bold text-deep pt-3 border-t border-rose-200">
                <span>Total TTC</span>
                <span className="font-serif text-2xl text-rose-900">{formatPriceDZD(total)}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <div className="pt-2 space-y-3">
              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-deep hover:bg-rose-950 text-ivory font-semibold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-luxury hover:shadow-xl transition cursor-pointer text-sm"
              >
                <span>Passer la commande</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Paiement en espèces à la livraison (Algérie 58 Wilayas)</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
