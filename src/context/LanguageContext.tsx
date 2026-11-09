import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminTranslations } from '@/locales/adminTranslations';

export type Language = 'fr' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRtl: boolean;
  t: (key: string, params?: Record<string, string | number>) => string;
  getProductName: (product: { nameFr: string; nameAr?: string }) => string;
  getCategoryName: (category: { nameFr: string; nameAr?: string }) => string;
  getWilayaName: (wilaya: { nameFr: string; nameAr: string }) => string;
  formatPrice: (amount: number) => string;
}

const translations: Record<Language, Record<string, string>> = {
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.shop': 'Boutique',
    'nav.skincare': 'Soins du visage',
    'nav.makeup': 'Maquillage',
    'nav.haircare': 'Cheveux',
    'nav.perfumes': 'Parfums',
    'nav.sets': 'Coffrets',
    'nav.wholesale': 'Vente en Gros',
    'nav.promotions': 'Promotions',
    'nav.newArrivals': 'Nouveautés',
    'nav.search': 'Rechercher un soin, parfum...',
    'nav.account': 'Mon Compte',
    'nav.wishlist': 'Favoris',
    'nav.cart': 'Panier',
    'nav.trackOrder': 'Suivre mon colis',
    'nav.admin': 'Tableau de bord Admin',

    // Value Props & Hero
    'hero.tag': 'HAUTE COSMÉTIQUE & SOINS PURIFIÉS • ALGÉRIE',
    'hero.title': 'Révélez votre beauté naturelle',
    'hero.subtitle': 'Découvrez des rituels de soins formulés avec les actifs botaniques les plus nobles et une rigueur dermatologique absolue. Une expérience sensorielle sur-mesure.',
    'hero.ctaCollection': 'Découvrir la collection',
    'hero.ctaNew': 'Nos nouveautés',
    'props.wilayas': '58 Wilayas desservies',
    'props.cod': '100% Paiement à la livraison',
    'props.satisfaction': 'Satisfaction cliente',

    // Product Card & Detail
    'product.addToCart': 'Ajouter au panier',
    'product.buyNow': 'Commander maintenant (Paiement à la livraison)',
    'product.outOfStock': 'Rupture de stock',
    'product.inStock': 'En stock disponible',
    'product.ingredients': 'Ingrédients & Formulation (INCI)',
    'product.usage': 'Conseils d’Utilisation & Rituel',
    'product.skinType': 'Type de peau conseillé',
    'product.reviews': 'Avis vérifiés',
    'product.writeReview': 'Donner mon avis',
    'product.new': 'Nouveau',
    'product.promo': 'Promo',
    'product.bestSeller': 'Top Vente',
    'product.wholesaleAvailable': 'Dispo en Gros',
    'product.addedSuccess': 'Ajouté !',
    'product.selectVariant': 'Sélectionnez votre teinte / format :',

    // Wholesale B2B
    'wholesale.title': 'Vente en Gros & Professionnels',
    'wholesale.subtitle': 'Tarifs préférentiels dégressifs pour salons de beauté, instituts et revendeurs en Algérie.',
    'wholesale.badge': 'Espace Pro & Gros',
    'wholesale.orderWhatsApp': 'Commander par WhatsApp',
    'wholesale.minPack': 'Lot de {qty} pièces',
    'wholesale.unitPrice': 'Tarif unitaire gros :',
    'wholesale.savings': 'Économisez',

    // Cart & Checkout
    'cart.title': 'Votre Panier',
    'cart.empty': 'Votre panier est actuellement vide.',
    'cart.continue': 'Découvrir nos soins',
    'cart.subtotal': 'Sous-total articles',
    'cart.shipping': 'Livraison estimée',
    'cart.freeShipping': 'Gratuite',
    'cart.freeShippingCongrats': 'Félicitations ! Livraison offerte partout en Algérie !',
    'cart.freeShippingThreshold': 'Plus que {amount} pour la livraison offerte',
    'cart.total': 'Total estimé',
    'cart.checkout': 'Passer la commande (Paiement à la livraison)',
    'cart.viewDetails': 'Voir les détails du panier',
    'cart.secureNotice': 'Paiement sécurisé en espèces à la livraison partout en Algérie (58 wilayas)',

    // Checkout Form
    'checkout.title': 'Finaliser ma commande',
    'checkout.customerInfo': 'Coordonnées de livraison',
    'checkout.fullName': 'Nom & Prénom *',
    'checkout.phone': 'Numéro de téléphone *',
    'checkout.phoneHint': 'Nous vous appellerons pour confirmer la livraison.',
    'checkout.wilaya': 'Wilaya de destination *',
    'checkout.commune': 'Commune / Ville *',
    'checkout.address': 'Adresse exacte de livraison *',
    'checkout.deliveryType': 'Mode de livraison *',
    'checkout.homeDelivery': 'Livraison à domicile',
    'checkout.stopDesk': 'Point relais / Stop-desk Yalidine',
    'checkout.paymentMethod': 'Mode de paiement',
    'checkout.codLabel': 'Paiement en espèces à la livraison (COD)',
    'checkout.orderSummary': 'Récapitulatif de votre commande',
    'checkout.placeOrder': 'Valider ma commande en 1 clic',
    'checkout.orderSuccess': 'Commande confirmée avec succès !',

    // Footer
    'footer.about': 'Jin Makeup DZ — Maison de cosmétiques & beauté de prestige en Algérie. Livraison express 58 wilayas avec paiement sécurisé à la livraison.',
    'footer.quickLinks': 'Liens Rapides',
    'footer.customerService': 'Service Client & Aide',
    'footer.contact': 'Contact & Showroom',
    'footer.address': 'Alger Centre, Algérie',
    'footer.rights': 'Tous droits réservés.',

    // Common
    'common.currency': 'DA',
    'common.viewAll': 'Tout afficher',
    'common.filter': 'Filtrer',
    'common.sort': 'Trier par',
    'common.loading': 'Chargement...',
    'common.back': 'Retour',

    ...adminTranslations.fr,
  },

  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.shop': 'المتجر',
    'nav.skincare': 'العناية بالبشرة',
    'nav.makeup': 'المكياج',
    'nav.haircare': 'العناية بالشعر',
    'nav.perfumes': 'العطور',
    'nav.sets': 'أطقم الهدايا',
    'nav.wholesale': 'البيع بالجملة',
    'nav.promotions': 'التخفيضات',
    'nav.newArrivals': 'جديدنا',
    'nav.search': 'ابحثي عن مستحضر، عطر، مكياج...',
    'nav.account': 'حسابي',
    'nav.wishlist': 'المفضلة',
    'nav.cart': 'السلة',
    'nav.trackOrder': 'تتبع طلبيتي',
    'nav.admin': 'لوحة الإدارة',

    // Value Props & Hero
    'hero.tag': 'مستحضرات تجميل راقية وعناية نقية • الجزائر',
    'hero.title': 'أبرزي جمالك الطبيعي',
    'hero.subtitle': 'اكتشفي طقوس عناية استثنائية مصممة بأجود المكونات الطبيعية النباتية ومعايير طبية جلدية عالية. تجربة عناية تفوق التوقعات.',
    'hero.ctaCollection': 'اكتشفي المجموعة',
    'hero.ctaNew': 'جديد منتجاتنا',
    'props.wilayas': 'التوصيل لكافة الـ 58 ولاية',
    'props.cod': 'دفع 100% عند الاستلام',
    'props.satisfaction': 'رضاء زبائننا هدفنا الأول',

    // Product Card & Detail
    'product.addToCart': 'أضف إلى السلة',
    'product.buyNow': 'اطلبي الآن (الدفع عند الاستلام)',
    'product.outOfStock': 'نفذت الكمية',
    'product.inStock': 'متوفر في المخزون',
    'product.ingredients': 'المكونات والتركيبة (INCI)',
    'product.usage': 'طريقة الاستعمال وطقوس العناية',
    'product.skinType': 'نوع البشرة المناسب',
    'product.reviews': 'تقييمات موثوقة',
    'product.writeReview': 'اكتبي تقييماً',
    'product.new': 'جديد',
    'product.promo': 'تخفيض',
    'product.bestSeller': 'الأكثر طلباً',
    'product.wholesaleAvailable': 'متوفر بالجملة',
    'product.addedSuccess': 'تمت الإضافة !',
    'product.selectVariant': 'اختاري الحجم أو الدرجة :',

    // Wholesale B2B
    'wholesale.title': 'البيع بالجملة والمهنيين',
    'wholesale.subtitle': 'أسعار تفضيلية خاصة بصالونات الحلاقة والتجميل، والموزعين في كامل ولايات الجزائر.',
    'wholesale.badge': 'فضاء المحترفين والجملة',
    'wholesale.orderWhatsApp': 'الطلب المباشر عبر واتساب',
    'wholesale.minPack': 'حزمة من {qty} قطع',
    'wholesale.unitPrice': 'سعر الوحدة بالجملة :',
    'wholesale.savings': 'وفري',

    // Cart & Checkout
    'cart.title': 'سلة مشترياتك',
    'cart.empty': 'سلة مشترياتك فارغة حالياً.',
    'cart.continue': 'استكشفي منتجاتنا',
    'cart.subtotal': 'مجموع المنتجات',
    'cart.shipping': 'التوصيل التقديري',
    'cart.freeShipping': 'مجاني',
    'cart.freeShippingCongrats': 'تهانينا ! التوصيل مجاني لكافة ولايات الجزائر !',
    'cart.freeShippingThreshold': 'تبقى {amount} للاستفادة من التوصيل المجاني',
    'cart.total': 'المجموع الكلي',
    'cart.checkout': 'إتمام الطلب (الدفع عند الاستلام)',
    'cart.viewDetails': 'عرض تفاصيل السلة',
    'cart.secureNotice': 'دفع آمن نقداً عند الاستلام في كافة الـ 58 ولاية جزائرية',

    // Checkout Form
    'checkout.title': 'تأكيد طلبك',
    'checkout.customerInfo': 'معلومات المستلم والتوصيل',
    'checkout.fullName': 'الاسم واللقب *',
    'checkout.phone': 'رقم الهاتف *',
    'checkout.phoneHint': 'سنتصل بك لتأكيد التوصيل قبل الإرسال.',
    'checkout.wilaya': 'الولاية *',
    'checkout.commune': 'البلدية / المدينة *',
    'checkout.address': 'العنوان بالتفصيل *',
    'checkout.deliveryType': 'طريقة الاستلام *',
    'checkout.homeDelivery': 'توصيل لباب المنزل',
    'checkout.stopDesk': 'استلام من مكتب التوصيل (Stop-Desk)',
    'checkout.paymentMethod': 'طريقة الدفع',
    'checkout.codLabel': 'الدفع نقداً عند استلام الطرد',
    'checkout.orderSummary': 'ملخص طلبيتك',
    'checkout.placeOrder': 'تأكيد الطلب بضغطة واحدة',
    'checkout.orderSuccess': 'تم تسجيل طلبيتك بنجاح !',

    // Footer
    'footer.about': 'جين ميكب ديزاد — دار مستحضرات التجميل والمكياج الراقية في الجزائر. توصيل سريع لـ 58 ولاية مع دفع آمن عند الاستلام.',
    'footer.quickLinks': 'روابط سريعة',
    'footer.customerService': 'خدمة الزبائن والمساعدة',
    'footer.contact': 'التواصل والمعرض',
    'footer.address': 'الجزائر العاصمة، الجزائر',
    'footer.rights': 'جميع الحقوق محفوظة.',

    // Common
    'common.currency': 'دج',
    'common.viewAll': 'عرض الكل',
    'common.filter': 'تصفية',
    'common.sort': 'ترتيب حسب',
    'common.loading': 'جاري التحميل...',
    'common.back': 'رجوع',

    ...adminTranslations.ar,
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('glow_language');
    return saved === 'ar' ? 'ar' : 'fr';
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

  const t = (key: string, params?: Record<string, string | number>): string => {
    let str = translations[language]?.[key] || translations.fr[key] || key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      });
    }
    return str;
  };

  const getProductName = (product: { nameFr: string; nameAr?: string }): string => {
    if (isRtl && product.nameAr && product.nameAr.trim().length > 0) {
      return product.nameAr;
    }
    return product.nameFr;
  };

  const getCategoryName = (category: { nameFr: string; nameAr?: string }): string => {
    if (isRtl && category.nameAr && category.nameAr.trim().length > 0) {
      return category.nameAr;
    }
    return category.nameFr;
  };

  const getWilayaName = (wilaya: { nameFr: string; nameAr: string }): string => {
    if (isRtl && wilaya.nameAr) {
      return wilaya.nameAr;
    }
    return wilaya.nameFr;
  };

  const formatPrice = (amount: number): string => {
    const formatted = amount.toLocaleString(isRtl ? 'ar-DZ' : 'fr-DZ');
    return isRtl ? `${formatted} دج` : `${formatted} DA`;
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      isRtl, 
      t, 
      getProductName, 
      getCategoryName, 
      getWilayaName, 
      formatPrice 
    }}>
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
