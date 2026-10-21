export type UserRole = 'customer' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
}

export interface Address {
  id: string;
  userId?: string;
  fullName: string;
  phone: string;
  wilayaCode: number;
  wilayaName: string;
  commune: string;
  streetAddress: string;
  deliveryType: 'home' | 'stopdesk';
  isDefault?: boolean;
}

export interface Wilaya {
  code: number;
  nameFr: string;
  nameAr: string;
  homeDeliveryFee: number;
  stopDeskFee: number;
  estimatedDays: string;
}

export interface Category {
  id: string;
  slug: string;
  nameFr: string;
  nameAr: string;
  nameEn: string;
  description?: string;
  imageUrl?: string;
  icon?: string;
  productCount?: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  country?: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string; // e.g. "50ml", "Teinte 02 Beige Doré", "Rose Poudré"
  sku: string;
  price: number; // in DZD
  compareAtPrice?: number; // original price in DZD
  stock: number;
  colorHex?: string;
  volumeOrWeight?: string;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  altText: string;
  isPrimary: boolean;
  orderIndex: number;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  slug: string;
  nameFr: string;
  nameAr?: string;
  nameEn?: string;
  brand: string;
  categorySlug: string;
  price: number; // Default/primary price in DZD
  compareAtPrice?: number; // Original price before promo in DZD
  shortDescription: string;
  fullDescription: string;
  ingredients?: string;
  usageInstructions?: string;
  skinType?: 'all' | 'dry' | 'oily' | 'combination' | 'sensitive' | 'normal';
  skinConcern?: 'hydration' | 'anti-aging' | 'blemishes' | 'radiance' | 'sun-protection';
  images: ProductImage[];
  variants: ProductVariant[];
  stock: number; // Total stock
  rating: number;
  reviewsCount: number;
  isNewArrival?: boolean;
  isPromo?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  createdAt: string;
}

export interface CartItem {
  id: string; // cart item unique key (productId + variantId)
  productId: string;
  variantId?: string;
  product: Product;
  variant?: ProductVariant;
  quantity: number;
  priceAtAddition: number; // DZD
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  couponCode?: string;
}

export type OrderStatus = 
  | 'pending'          // En attente de confirmation
  | 'confirmed'        // Confirmée par téléphone
  | 'processing'       // En cours de préparation
  | 'shipped'          // Expédiée (Colis en route)
  | 'delivered'        // Livrée
  | 'cancelled';       // Annulée

export type PaymentMethod = 
  | 'cod'              // Paiement à la livraison (Cash on Delivery)
  | 'bank_transfer'    // Virement bancaire / CCP
  | 'baridimob'        // BaridiMob
  | 'edahabia_cib';    // Carte Edahabia / CIB (si activée)

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  variantName?: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  imageUrl?: string;
}

export interface OrderStatusHistory {
  status: OrderStatus;
  note: string;
  timestamp: string;
  updatedBy?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "GLW-2024-8392"
  userId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: Address;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  couponCode?: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  trackingNumber?: string;
  trackingCarrier?: string; // Yalidine, ZR Express, Kazitour, etc.
  notes?: string;
  history: OrderStatusHistory[];
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // e.g. 10 for 10% or 1000 for 1000 DA
  minOrderAmount?: number;
  maxUsage?: number;
  usageCount: number;
  isActive: boolean;
  expiresAt?: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  announcementText: string;
  announcementActive: boolean;
  freeDeliveryThreshold: number; // DZD (e.g. 8000 DA)
  defaultHomeDeliveryFee: number;
  defaultStopDeskFee: number;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  socialInstagram: string;
  socialFacebook: string;
  socialTiktok: string;
  enableOnlinePayments: boolean;
  // Production Option 2 notifications and integrations
  whatsappNotificationPhone?: string;
  telegramBotToken?: string;
  telegramChatId?: string;
  googleSheetWebhook?: string;
}

export interface HomepageBanner {
  id: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  imageUrl: string;
  isActive: boolean;
  endDate?: string;
}

export interface NewsletterSubscription {
  id: string;
  email: string;
  subscribedAt: string;
  consent: boolean;
}
