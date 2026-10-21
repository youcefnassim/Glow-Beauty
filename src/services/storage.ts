import { 
  Product, Category, Order, Coupon, StoreSettings, Review, UserProfile, OrderStatus, PaymentStatus 
} from '@/types';
import { INITIAL_PRODUCTS } from '@/data/mockProducts';
import { CATEGORIES } from '@/data/categories';
import { 
  INITIAL_SETTINGS, INITIAL_COUPONS, INITIAL_USERS, INITIAL_REVIEWS, INITIAL_ORDERS 
} from '@/data/initialData';

const KEYS = {
  PRODUCTS: 'glow_beauty_products_v1',
  CATEGORIES: 'glow_beauty_categories_v1',
  SETTINGS: 'glow_beauty_settings_v1',
  COUPONS: 'glow_beauty_coupons_v1',
  ORDERS: 'glow_beauty_orders_v1',
  REVIEWS: 'glow_beauty_reviews_v1',
  USERS: 'glow_beauty_users_v1',
  CURRENT_USER: 'glow_beauty_current_user_v1',
  WISHLIST: 'glow_beauty_wishlist_v1',
  CART: 'glow_beauty_cart_v1',
  NEWSLETTER: 'glow_beauty_newsletter_v1',
  ADMIN_PASSWORD: 'glow_beauty_admin_password_v1',
};

function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage`, e);
  }
}

export const StorageService = {
  // Products
  getProducts(): Product[] {
    const list = getFromStorage<Product[]>(KEYS.PRODUCTS, INITIAL_PRODUCTS);
    let updated = false;
    list.forEach(p => {
      p.images.forEach(img => {
        if (img.url.includes('1608248597359-5f257a41ec58')) {
          img.url = 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80';
          updated = true;
        }
      });
    });
    if (updated) {
      saveToStorage(KEYS.PRODUCTS, list);
    }
    return list;
  },

  getProductBySlug(slug: string): Product | undefined {
    const products = this.getProducts();
    return products.find(p => p.slug === slug);
  },

  getProductById(id: string): Product | undefined {
    const products = this.getProducts();
    return products.find(p => p.id === id);
  },

  saveProduct(product: Product): Product {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index >= 0) {
      products[index] = product;
    } else {
      products.unshift(product);
    }
    saveToStorage(KEYS.PRODUCTS, products);
    return product;
  },

  deleteProduct(id: string): void {
    const products = this.getProducts().filter(p => p.id !== id);
    saveToStorage(KEYS.PRODUCTS, products);
  },

  // Categories
  getCategories(): Category[] {
    return getFromStorage<Category[]>(KEYS.CATEGORIES, CATEGORIES);
  },

  saveCategory(category: Category): Category {
    const categories = this.getCategories();
    const index = categories.findIndex(c => c.id === category.id);
    if (index >= 0) {
      categories[index] = category;
    } else {
      categories.push(category);
    }
    saveToStorage(KEYS.CATEGORIES, categories);
    return category;
  },

  // Orders
  getOrders(): Order[] {
    return getFromStorage<Order[]>(KEYS.ORDERS, INITIAL_ORDERS);
  },

  getOrderById(id: string): Order | undefined {
    return this.getOrders().find(o => o.id === id);
  },

  getOrderByNumber(orderNumber: string): Order | undefined {
    const normalized = orderNumber.trim().toUpperCase();
    return this.getOrders().find(o => o.orderNumber.toUpperCase() === normalized);
  },

  getOrdersByUserId(userId: string): Order[] {
    return this.getOrders().filter(o => o.userId === userId);
  },

  createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'history'>): Order {
    const orders = this.getOrders();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `GLW-${new Date().getFullYear()}-${randomSuffix}`;
    const now = new Date().toISOString();

    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}-${randomSuffix}`,
      orderNumber,
      createdAt: now,
      updatedAt: now,
      history: [
        {
          status: orderData.status || 'pending',
          note: 'Commande passée en ligne avec succès',
          timestamp: now,
        },
      ],
    };

    // Decrement stock for purchased items
    const products = this.getProducts();
    for (const item of newOrder.items) {
      const prod = products.find(p => p.id === item.productId);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
        if (item.variantName && prod.variants) {
          const variant = prod.variants.find(v => v.name === item.variantName);
          if (variant) {
            variant.stock = Math.max(0, variant.stock - item.quantity);
          }
        }
      }
    }
    saveToStorage(KEYS.PRODUCTS, products);

    orders.unshift(newOrder);
    saveToStorage(KEYS.ORDERS, orders);
    return newOrder;
  },

  updateOrderStatus(orderId: string, status: OrderStatus, note: string, updatedBy?: string): Order | null {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) return null;

    order.status = status;
    order.updatedAt = new Date().toISOString();
    order.history.unshift({
      status,
      note,
      timestamp: new Date().toISOString(),
      updatedBy: updatedBy || 'Administrateur',
    });

    saveToStorage(KEYS.ORDERS, orders);
    return order;
  },

  updateOrderPayment(orderId: string, paymentStatus: PaymentStatus, trackingNumber?: string, carrier?: string): Order | null {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) return null;

    order.paymentStatus = paymentStatus;
    if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
    if (carrier !== undefined) order.trackingCarrier = carrier;
    order.updatedAt = new Date().toISOString();

    saveToStorage(KEYS.ORDERS, orders);
    return order;
  },

  // Store Settings
  getSettings(): StoreSettings {
    return getFromStorage<StoreSettings>(KEYS.SETTINGS, INITIAL_SETTINGS);
  },

  saveSettings(settings: StoreSettings): StoreSettings {
    saveToStorage(KEYS.SETTINGS, settings);
    return settings;
  },

  // Coupons
  getCoupons(): Coupon[] {
    return getFromStorage<Coupon[]>(KEYS.COUPONS, INITIAL_COUPONS);
  },

  getCouponByCode(code: string): Coupon | undefined {
    const coupons = this.getCoupons();
    return coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive);
  },

  saveCoupon(coupon: Coupon): Coupon {
    const coupons = this.getCoupons();
    const index = coupons.findIndex(c => c.id === coupon.id);
    if (index >= 0) {
      coupons[index] = coupon;
    } else {
      coupons.push(coupon);
    }
    saveToStorage(KEYS.COUPONS, coupons);
    return coupon;
  },

  deleteCoupon(id: string): void {
    const coupons = this.getCoupons().filter(c => c.id !== id);
    saveToStorage(KEYS.COUPONS, coupons);
  },

  // Reviews
  getReviews(productId?: string): Review[] {
    const reviews = getFromStorage<Review[]>(KEYS.REVIEWS, INITIAL_REVIEWS);
    if (productId) {
      return reviews.filter(r => r.productId === productId && r.isApproved);
    }
    return reviews;
  },

  addReview(review: Omit<Review, 'id' | 'createdAt' | 'isApproved'>): Review {
    const reviews = getFromStorage<Review[]>(KEYS.REVIEWS, INITIAL_REVIEWS);
    const newReview: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isApproved: true, // Demo auto-approval
    };
    reviews.unshift(newReview);
    saveToStorage(KEYS.REVIEWS, reviews);
    return newReview;
  },

  // Newsletter
  subscribeNewsletter(email: string): { success: boolean; message: string } {
    const list = getFromStorage<string[]>(KEYS.NEWSLETTER, ['amina.beauty@gmail.com', 'nour.h@yahoo.fr']);
    const normalized = email.toLowerCase().trim();
    if (list.includes(normalized)) {
      return { success: false, message: 'Cette adresse e-mail est déjà inscrite à notre lettre d’information.' };
    }
    list.push(normalized);
    saveToStorage(KEYS.NEWSLETTER, list);
    return { success: true, message: 'Merci pour votre inscription ! Votre code de bienvenue BIENVENUE10 (-10%) a été envoyé.' };
  },

  getNewsletterSubscribers(): string[] {
    return getFromStorage<string[]>(KEYS.NEWSLETTER, ['amina.beauty@gmail.com', 'nour.h@yahoo.fr', 'sarah.k@gmail.com']);
  },

  // Users
  getUsers(): UserProfile[] {
    return getFromStorage<UserProfile[]>(KEYS.USERS, INITIAL_USERS);
  },

  getCurrentUser(): UserProfile | null {
    return getFromStorage<UserProfile | null>(KEYS.CURRENT_USER, null);
  },

  setCurrentUser(user: UserProfile | null): void {
    saveToStorage(KEYS.CURRENT_USER, user);
  },

  // Admin Password Management
  getAdminPassword(): string {
    return getFromStorage<string>(KEYS.ADMIN_PASSWORD, 'glowadmin2025');
  },

  setAdminPassword(newPassword: string): void {
    saveToStorage(KEYS.ADMIN_PASSWORD, newPassword);
  },

  verifyAdminPassword(password: string): boolean {
    const current = this.getAdminPassword();
    return password.trim() === current.trim();
  },

  // Full Database Backup & Restore
  backupAllData(): string {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      store: 'Glow Beauty',
      products: this.getProducts(),
      categories: this.getCategories(),
      settings: this.getSettings(),
      coupons: this.getCoupons(),
      orders: this.getOrders(),
      reviews: getFromStorage(KEYS.REVIEWS, []),
      users: this.getUsers(),
      newsletter: this.getNewsletterSubscribers(),
    };
    return JSON.stringify(data, null, 2);
  },

  restoreAllData(jsonStr: string): { success: boolean; message: string } {
    try {
      const data = JSON.parse(jsonStr);
      if (!data || typeof data !== 'object') {
        return { success: false, message: 'Format de fichier de sauvegarde invalide.' };
      }
      if (Array.isArray(data.products)) saveToStorage(KEYS.PRODUCTS, data.products);
      if (Array.isArray(data.categories)) saveToStorage(KEYS.CATEGORIES, data.categories);
      if (data.settings && typeof data.settings === 'object') saveToStorage(KEYS.SETTINGS, data.settings);
      if (Array.isArray(data.coupons)) saveToStorage(KEYS.COUPONS, data.coupons);
      if (Array.isArray(data.orders)) saveToStorage(KEYS.ORDERS, data.orders);
      if (Array.isArray(data.reviews)) saveToStorage(KEYS.REVIEWS, data.reviews);
      if (Array.isArray(data.users)) saveToStorage(KEYS.USERS, data.users);
      if (Array.isArray(data.newsletter)) saveToStorage(KEYS.NEWSLETTER, data.newsletter);
      return { success: true, message: 'Données restaurées avec succès !' };
    } catch (e: unknown) {
      const err = e instanceof Error ? e.message : 'Erreur de lecture';
      return { success: false, message: `Erreur lors de la restauration: ${err}` };
    }
  },

  // Reset to initial demo data
  resetAllData(): void {
    localStorage.removeItem(KEYS.PRODUCTS);
    localStorage.removeItem(KEYS.CATEGORIES);
    localStorage.removeItem(KEYS.SETTINGS);
    localStorage.removeItem(KEYS.COUPONS);
    localStorage.removeItem(KEYS.ORDERS);
    localStorage.removeItem(KEYS.REVIEWS);
    localStorage.removeItem(KEYS.USERS);
    localStorage.removeItem(KEYS.CURRENT_USER);
    localStorage.removeItem(KEYS.WISHLIST);
    localStorage.removeItem(KEYS.CART);
    localStorage.removeItem(KEYS.NEWSLETTER);
    localStorage.removeItem(KEYS.ADMIN_PASSWORD);
  }
};
