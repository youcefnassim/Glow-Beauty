import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { formatPriceDZD } from '@/data/wilayas';
import { X, Trash2, ShoppingBag, ArrowRight, Truck, Plus, Minus } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { 
    items, 
    subtotal, 
    total, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeItem, 
    freeDeliveryThreshold,
    amountNeededForFreeShipping,
    getItemEffectivePrice,
  } = useCart();
  const { language, t, getProductName, formatPrice } = useLanguage();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-deep/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <aside 
          aria-label="Panier d'achat" 
          className="w-full sm:w-[440px] max-w-full bg-white shadow-2xl flex flex-col relative z-10 animate-slideInRight h-full"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-rose-100 flex items-center justify-between bg-ivory/60 shrink-0">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-rose-500" />
              <h2 className="font-serif text-lg sm:text-xl font-bold text-deep">{t('cart.title')}</h2>
              <span className="text-xs bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full">
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-stone-500 hover:text-deep p-2 rounded-xl hover:bg-rose-100 transition cursor-pointer"
              aria-label="Fermer le panier"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="bg-blush/20 p-4 border-b border-rose-100">
            <div className="flex items-center justify-between text-xs font-medium text-deep mb-1.5">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-rose-600" />
                {amountNeededForFreeShipping === 0 ? (
                  <span className="text-emerald-700 font-bold">{t('cart.freeShippingCongrats')}</span>
                ) : (
                  <span>
                    {language === 'ar' ? (
                      <>أضيفي بقيمة <strong className="text-rose-700">{formatPrice(amountNeededForFreeShipping)}</strong> للاستفادة من <strong>التوصيل المجاني</strong></>
                    ) : (
                      <>Plus que <strong className="text-rose-700">{formatPrice(amountNeededForFreeShipping)}</strong> pour la livraison offerte</>
                    )}
                  </span>
                )}
              </span>
              <span className="font-bold text-rose-800">{freeShippingProgress}%</span>
            </div>
            <div className="w-full bg-rose-200/60 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-brand-rose h-1.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-lg text-deep font-semibold">{t('cart.empty')}</h3>
                <p className="text-xs text-mutedText max-w-xs">
                  {language === 'ar' ? 'امنحي نفسك طقوس عناية استثنائية واكتشفي تشكيلة مستحضراتنا الراقية.' : 'Offrez-vous un rituel de soin d’exception. Découvrez notre sélection de cosmétiques haut de gamme.'}
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/shop');
                  }}
                  className="bg-deep hover:bg-rose-900 text-ivory text-xs font-semibold px-6 py-2.5 rounded-full transition shadow-sm cursor-pointer"
                >
                  {t('cart.continue')}
                </button>
              </div>
            ) : (
              items.map(item => (
                <div 
                  key={item.id} 
                  className="flex gap-3 p-2.5 rounded-xl bg-ivory/40 border border-rose-100/80 hover:border-rose-200 transition"
                >
                  <img
                    src={item.product.images[0]?.url}
                    alt={getProductName(item.product)}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover bg-white border border-rose-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-deep truncate">
                          {getProductName(item.product)}
                        </h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-stone-400 hover:text-red-500 transition cursor-pointer p-0.5"
                          title="Supprimer l'article"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.variant && (
                        <p className="text-[11px] text-rose-700 font-medium mt-0.5">
                          {item.variant.name}
                        </p>
                      )}

                      {item.isWholesalePriceApplied ? (
                        <div className="mt-1">
                          <span className="inline-block text-[10px] font-bold text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-200">
                            🏷️ {language === 'ar' ? 'سعر الجملة' : 'Tarif Grossiste'} ({formatPrice(getItemEffectivePrice(item).unitPrice)}/u)
                          </span>
                        </div>
                      ) : (
                        <p className="text-xs font-bold text-deep mt-1">
                          {formatPrice(item.priceAtAddition)}
                        </p>
                      )}
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-rose-200 rounded-lg bg-white overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-rose-50 text-deep transition cursor-pointer"
                          aria-label="Diminuer la quantité"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-deep min-w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-rose-50 text-deep transition cursor-pointer"
                          aria-label="Augmenter la quantité"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-rose-800 block">
                          {formatPrice(getItemEffectivePrice(item).unitPrice * item.quantity)}
                        </span>
                        {item.isWholesalePriceApplied && (
                          <span className="text-[10px] text-mutedText line-through">
                            {formatPrice(item.priceAtAddition * item.quantity)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-5 border-t border-rose-100 bg-ivory/60 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-mutedText">
                  <span>{t('cart.subtotal')}</span>
                  <span className="font-semibold text-deep">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-mutedText">
                  <span>{t('cart.shipping')}</span>
                  <span className="font-semibold text-deep">
                    {subtotal >= freeDeliveryThreshold ? (
                      <span className="text-emerald-600 font-bold">{t('cart.freeShipping')}</span>
                    ) : (
                      language === 'ar' ? 'تُحسب عند إتمام الطلب' : 'Calculée au checkout'
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-deep pt-1.5 border-t border-rose-200">
                  <span>{t('cart.total')}</span>
                  <span className="text-rose-900 font-serif text-base">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/checkout');
                  }}
                  className="w-full bg-deep hover:bg-rose-950 text-ivory font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition cursor-pointer"
                >
                  <span>{t('cart.checkout')}</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </button>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/cart');
                  }}
                  className="w-full bg-white hover:bg-rose-50 text-deep border border-rose-200 font-medium py-2 rounded-xl text-xs transition cursor-pointer"
                >
                  {t('cart.viewDetails')}
                </button>
              </div>

              <p className="text-[11px] text-center text-mutedText">
                {t('cart.secureNotice')}
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
