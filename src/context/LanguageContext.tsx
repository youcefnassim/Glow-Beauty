import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'fr' | 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRtl: boolean;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  fr: {
    'nav.home': 'Accueil',
    'nav.skincare': 'Soins du visage',
    'nav.makeup': 'Maquillage',
    'nav.haircare': 'Cheveux',
    'nav.perfumes': 'Parfums',
    'nav.sets': 'Coffrets',
    'nav.promotions': 'Promotions',
    'nav.newArrivals': 'Nouveautés',
    'nav.search': 'Rechercher un soin, parfum...',
    'nav.account': 'Compte',
    'nav.wishlist': 'Favoris',
    'nav.cart': 'Panier',
    
    // Product
    'product.addToCart': 'Ajouter au panier',
    'product.buyNow': 'Acheter maintenant',
    'product.outOfStock': 'Rupture de stock',
    'product.inStock': 'En stock',
    'product.ingredients': 'Ingrédients & Composition',
    'product.usage': 'Conseils d’application',
    'product.skinType': 'Type de peau conseillé',
    'product.reviews': 'Avis vérifiés',
    'product.writeReview': 'Donner mon avis',
    'product.new': 'Nouveau',
    'product.promo': 'Promo',
    'product.bestSeller': 'Best-seller',

    // Cart & Checkout
    'cart.title': 'Votre Panier',
    'cart.empty': 'Votre panier est actuellement vide.',
    'cart.continue': 'Découvrir nos soins',
    'cart.subtotal': 'Sous-total',
    'cart.discount': 'Remise code promo',
    'cart.shipping': 'Frais de livraison',
    'cart.freeShipping': 'Livraison offerte !',
    'cart.freeShippingThreshold': 'Plus que {amount} pour bénéficier de la livraison offerte',
    'cart.total': 'Total TTC',
    'cart.checkout': 'Passer la commande',
    'cart.couponPlaceholder': 'Code promo (ex: BIENVENUE10)',
    'cart.apply': 'Appliquer',

    // Checkout
    'checkout.title': 'Finaliser ma commande',
    'checkout.customerInfo': 'Coordonnées du client',
    'checkout.deliveryInfo': 'Adresse de livraison en Algérie',
    'checkout.paymentMethod': 'Mode de règlement',
    'checkout.orderSummary': 'Récapitulatif de la commande',
    'checkout.placeOrder': 'Confirmer la commande (Paiement à la livraison)',
    'checkout.homeDelivery': 'Livraison à domicile',
    'checkout.stopDesk': 'Livraison en bureau / Stop-desk (Yalidine)',
    'checkout.codDesc': 'Réglez en espèces à la réception de votre colis en toute sérénité.',

    // Common
    'common.currency': 'DA',
    'common.viewAll': 'Tout afficher',
    'common.filter': 'Filtrer',
    'common.sort': 'Trier par',
    'common.loading': 'Chargement...',
  },
  ar: {
    'nav.home': 'الرئيسية',
    'nav.skincare': 'العناية بالبشرة',
    'nav.makeup': 'المكياج',
    'nav.haircare': 'العناية بالشعر',
    'nav.perfumes': 'العطور',
    'nav.sets': 'أطقم الهدايا',
    'nav.promotions': 'العروض والتخفيضات',
    'nav.newArrivals': 'وصل حديثاً',
    'nav.search': 'ابحثي عن منتج، عطر، عناية...',
    'nav.account': 'حسابي',
    'nav.wishlist': 'المفضلة',
    'nav.cart': 'السلة',

    // Product
    'product.addToCart': 'أضف إلى السلة',
    'product.buyNow': 'اشتري الآن',
    'product.outOfStock': 'نفذت الكمية',
    'product.inStock': 'متوفر بالمخزون',
    'product.ingredients': 'المكونات والتركيبة',
    'product.usage': 'طريقة الاستعمال',
    'product.skinType': 'نوع البشرة المناسب',
    'product.reviews': 'تقييمات موثوقة',
    'product.writeReview': 'اكتبي تقييماً',
    'product.new': 'جديد',
    'product.promo': 'تخفيض',
    'product.bestSeller': 'الأكثر طلباً',

    // Cart & Checkout
    'cart.title': 'سلة المشتريات',
    'cart.empty': 'سلة التسوق فارغة حالياً.',
    'cart.continue': 'استكشفي منتجاتنا',
    'cart.subtotal': 'المجموع الفرعي',
    'cart.discount': 'قيمة التخفيض',
    'cart.shipping': 'تكلفة التوصيل',
    'cart.freeShipping': 'توصيل مجاني !',
    'cart.freeShippingThreshold': 'تبقى {amount} للاستفادة من التوصيل المجاني',
    'cart.total': 'المجموع الكلي',
    'cart.checkout': 'إتمام الطلب',
    'cart.couponPlaceholder': 'رمز القسيمة (مثال: BIENVENUE10)',
    'cart.apply': 'تطبيق',

    // Checkout
    'checkout.title': 'تأكيد الطلب',
    'checkout.customerInfo': 'معلومات الزبونة',
    'checkout.deliveryInfo': 'عنوان التوصيل في الجزائر',
    'checkout.paymentMethod': 'طريقة الدفع',
    'checkout.orderSummary': 'ملخص الطلبية',
    'checkout.placeOrder': 'تأكيد الطلب (الدفع عند الاستلام)',
    'checkout.homeDelivery': 'توصيل إلى باب المنزل',
    'checkout.stopDesk': 'استلام من مكتب التوصيل (Stop-Desk)',
    'checkout.codDesc': 'ادفعي نقداً بأمان تام عند استلام طردك من عون التوصيل.',

    // Common
    'common.currency': 'دج',
    'common.viewAll': 'عرض الكل',
    'common.filter': 'تصفية',
    'common.sort': 'ترتيب حسب',
    'common.loading': 'جاري التحميل...',
  },
  en: {
    'nav.home': 'Home',
    'nav.skincare': 'Skincare',
    'nav.makeup': 'Makeup',
    'nav.haircare': 'Haircare',
    'nav.perfumes': 'Perfumes',
    'nav.sets': 'Gift Sets',
    'nav.promotions': 'Promotions',
    'nav.newArrivals': 'New Arrivals',
    'nav.search': 'Search skincare, perfume...',
    'nav.account': 'Account',
    'nav.wishlist': 'Wishlist',
    'nav.cart': 'Cart',

    // Product
    'product.addToCart': 'Add to Cart',
    'product.buyNow': 'Buy Now',
    'product.outOfStock': 'Out of Stock',
    'product.inStock': 'In Stock',
    'product.ingredients': 'Ingredients & Formula',
    'product.usage': 'How to Apply',
    'product.skinType': 'Skin Type',
    'product.reviews': 'Verified Reviews',
    'product.writeReview': 'Write a Review',
    'product.new': 'New',
    'product.promo': 'Sale',
    'product.bestSeller': 'Best Seller',

    // Cart & Checkout
    'cart.title': 'Shopping Bag',
    'cart.empty': 'Your shopping bag is empty.',
    'cart.continue': 'Discover our collection',
    'cart.subtotal': 'Subtotal',
    'cart.discount': 'Discount',
    'cart.shipping': 'Shipping Fee',
    'cart.freeShipping': 'Free Shipping!',
    'cart.freeShippingThreshold': 'Add {amount} more to qualify for Free Shipping',
    'cart.total': 'Total',
    'cart.checkout': 'Proceed to Checkout',
    'cart.couponPlaceholder': 'Promo code (e.g. BIENVENUE10)',
    'cart.apply': 'Apply',

    // Checkout
    'checkout.title': 'Complete Your Order',
    'checkout.customerInfo': 'Customer Information',
    'checkout.deliveryInfo': 'Delivery Address in Algeria',
    'checkout.paymentMethod': 'Payment Method',
    'checkout.orderSummary': 'Order Summary',
    'checkout.placeOrder': 'Confirm Order (Cash on Delivery)',
    'checkout.homeDelivery': 'Home Delivery',
    'checkout.stopDesk': 'Pick up at Bureau / Stop-Desk',
    'checkout.codDesc': 'Pay securely with cash upon delivery of your package.',

    // Common
    'common.currency': 'DZD',
    'common.viewAll': 'View all',
    'common.filter': 'Filter',
    'common.sort': 'Sort by',
    'common.loading': 'Loading...',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('glow_language') as Language) || 'fr';
  });

  const isRtl = language === 'ar';

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('glow_language', lang);
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
  }, [language, isRtl]);

  const t = (key: string): string => {
    return translations[language][key] || translations.fr[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isRtl, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
