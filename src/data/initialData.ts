import { Coupon, StoreSettings, Review, Order, UserProfile, Address } from '@/types';

export const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'Jin Makeup',
  tagline: 'L’Art du Maquillage & de la Haute Beauté',
  announcementText: 'Livraison offerte dans toute l’Algérie dès 8 000 DA d’achats ! 🌸',
  announcementActive: false,
  freeDeliveryThreshold: 8000,
  defaultHomeDeliveryFee: 650,
  defaultStopDeskFee: 400,
  contactEmail: 'contact@jinmakeup.dz',
  contactPhone: '+213 (0) 550 12 34 56',
  contactAddress: '14 Rue Didouche Mourad, Alger Centre, 16000 Alger, Algérie',
  socialInstagram: 'https://instagram.com/jinmakeup.dz',
  socialFacebook: 'https://facebook.com/jinmakeup.algerie',
  socialTiktok: 'https://tiktok.com/@jinmakeup.algerie',
  enableOnlinePayments: false, // Disabled until business configures real Satim / CIB gateway
  whatsappNotificationPhone: '0550123456',
  telegramBotToken: '',
  telegramChatId: '',
  googleSheetWebhook: '',
};

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'coup-1',
    code: 'BIENVENUE10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 3000,
    maxUsage: 500,
    usageCount: 0,
    isActive: true,
  },
  {
    id: 'coup-2',
    code: 'GLOW500',
    discountType: 'fixed',
    discountValue: 500,
    minOrderAmount: 5000,
    maxUsage: 200,
    usageCount: 0,
    isActive: true,
  },
  {
    id: 'coup-3',
    code: 'VIPBEAUTY',
    discountType: 'percentage',
    discountValue: 15,
    minOrderAmount: 10000,
    maxUsage: 50,
    usageCount: 0,
    isActive: true,
  },
];

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'usr-admin-1',
    email: 'admin@glowbeauty.dz',
    fullName: 'Ramzi (Gérant)',
    phone: '0550123456',
    role: 'admin',
    createdAt: '2024-01-01T08:00:00Z',
  },
  {
    id: 'usr-customer-1',
    email: 'sophia.client@gmail.com',
    fullName: 'Sophia Meziane',
    phone: '0661987654',
    role: 'customer',
    createdAt: '2024-01-10T14:30:00Z',
  },
];

export const INITIAL_ADDRESSES: Address[] = [
  {
    id: 'addr-1',
    userId: 'usr-customer-1',
    fullName: 'Sophia Meziane',
    phone: '0661987654',
    wilayaCode: 16,
    wilayaName: 'Alger',
    commune: 'Hydra',
    streetAddress: 'Cité des Pins, Bâtiment C, Apt 14',
    deliveryType: 'home',
    isDefault: true,
  },
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-serum-niacinamide',
    userName: 'Nour H.',
    rating: 5,
    title: 'Une révélation pour ma peau grasse',
    comment: 'Après seulement 10 jours d’utilisation matin et soir, mes pores sont visiblement resserrés et ma zone T ne brille plus en fin de journée. Texture ultra légère.',
    isVerifiedPurchase: true,
    isApproved: true,
    createdAt: '2024-02-14T18:20:00Z',
  },
  {
    id: 'rev-2',
    productId: 'prod-serum-niacinamide',
    userName: 'Amina B.',
    rating: 5,
    title: 'Excellent produit, livraison rapide à Oran',
    comment: 'Reçu en 48 heures à Oran par Yalidine. L’emballage était soigné avec un petit échantillon. Le sérum est parfait.',
    isVerifiedPurchase: true,
    isApproved: true,
    createdAt: '2024-02-28T11:45:00Z',
  },
  {
    id: 'rev-3',
    productId: 'prod-creme-ceramides',
    userName: 'Yasmine K.',
    rating: 5,
    title: 'Hydratation intense sans effet gras',
    comment: 'Ma peau tiraillait énormément à cause du vent et du froid. Cette crème l’a réparée en un clin d’œil. Je la recommande les yeux fermés !',
    isVerifiedPurchase: true,
    isApproved: true,
    createdAt: '2024-03-01T09:15:00Z',
  },
  {
    id: 'rev-4',
    productId: 'prod-rouge-levres-satine',
    userName: 'Selma M.',
    rating: 5,
    title: 'La couleur Rose Désert est splendide',
    comment: 'C’est le nude idéal pour tous les jours. Très confortable sur les lèvres, ne dessèche absolument pas.',
    isVerifiedPurchase: true,
    isApproved: true,
    createdAt: '2024-03-12T14:10:00Z',
  },
];

export const INITIAL_ORDERS: Order[] = [];
