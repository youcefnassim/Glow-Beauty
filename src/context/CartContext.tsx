import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, ProductVariant, Coupon } from '@/types';
import { StorageService } from '@/services/storage';
import { getWilayaByCode } from '@/data/wilayas';

interface CartContextType {
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  itemCount: number;
  appliedCoupon: Coupon | null;
  couponError: string | null;
  selectedWilayaCode: number;
  selectedDeliveryType: 'home' | 'stopdesk';
  freeDeliveryThreshold: number;
  amountNeededForFreeShipping: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addItem: (product: Product, variant?: ProductVariant, quantity?: number) => { success: boolean; message?: string };
  updateQuantity: (cartItemId: string, newQuantity: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  setSelectedWilayaCode: (code: number) => void;
  setSelectedDeliveryType: (type: 'home' | 'stopdesk') => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'glow_beauty_cart_items_v1';
const COUPON_STORAGE_KEY = 'glow_beauty_applied_coupon_v1';
const WILAYA_STORAGE_KEY = 'glow_beauty_selected_wilaya_v1';
const DELIVERY_TYPE_STORAGE_KEY = 'glow_beauty_delivery_type_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => {
    try {
      const saved = localStorage.getItem(COUPON_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [couponError, setCouponError] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  const [selectedWilayaCode, setSelectedWilayaCodeState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(WILAYA_STORAGE_KEY);
      return saved ? Number(saved) : 16; // Default: 16 (Alger)
    } catch {
      return 16;
    }
  });

  const [selectedDeliveryType, setSelectedDeliveryTypeState] = useState<'home' | 'stopdesk'>(() => {
    try {
      const saved = localStorage.getItem(DELIVERY_TYPE_STORAGE_KEY);
      return (saved as 'home' | 'stopdesk') || 'home';
    } catch {
      return 'home';
    }
  });

  const settings = StorageService.getSettings();
  const freeDeliveryThreshold = settings.freeDeliveryThreshold || 8000;

  // Save cart changes to localStorage
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem(COUPON_STORAGE_KEY);
    }
  }, [appliedCoupon]);

  const setSelectedWilayaCode = (code: number) => {
    setSelectedWilayaCodeState(code);
    localStorage.setItem(WILAYA_STORAGE_KEY, String(code));
  };

  const setSelectedDeliveryType = (type: 'home' | 'stopdesk') => {
    setSelectedDeliveryTypeState(type);
    localStorage.setItem(DELIVERY_TYPE_STORAGE_KEY, type);
  };

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + item.priceAtAddition * item.quantity, 0);

  // Discount calculation
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.minOrderAmount && subtotal < appliedCoupon.minOrderAmount) {
      // Order subtotal fell below coupon requirement
      discount = 0;
    } else if (appliedCoupon.discountType === 'percentage') {
      discount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
    } else if (appliedCoupon.discountType === 'fixed') {
      discount = Math.min(subtotal, appliedCoupon.discountValue);
    }
  }

  // Delivery fee calculation
  const wilayaInfo = getWilayaByCode(selectedWilayaCode);
  let baseDeliveryFee = 650;
  if (wilayaInfo) {
    baseDeliveryFee = selectedDeliveryType === 'stopdesk' 
      ? wilayaInfo.stopDeskFee 
      : wilayaInfo.homeDeliveryFee;
  }

  const isFreeShipping = subtotal >= freeDeliveryThreshold && items.length > 0;
  const deliveryFee = items.length === 0 ? 0 : isFreeShipping ? 0 : baseDeliveryFee;
  const total = Math.max(0, subtotal - discount + deliveryFee);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const amountNeededForFreeShipping = Math.max(0, freeDeliveryThreshold - subtotal);

  const addItem = (product: Product, variant?: ProductVariant, quantity = 1): { success: boolean; message?: string } => {
    const variantId = variant?.id;
    const cartItemId = variantId ? `${product.id}_${variantId}` : product.id;
    const availableStock = variant ? variant.stock : product.stock;
    const price = variant ? variant.price : product.price;

    const existingIndex = items.findIndex(i => i.id === cartItemId);
    const currentQtyInCart = existingIndex >= 0 ? items[existingIndex].quantity : 0;

    if (currentQtyInCart + quantity > availableStock) {
      return { 
        success: false, 
        message: `Quantité demandée indisponible. Stock restant : ${availableStock}` 
      };
    }

    if (existingIndex >= 0) {
      const updated = [...items];
      updated[existingIndex].quantity += quantity;
      setItems(updated);
    } else {
      const newItem: CartItem = {
        id: cartItemId,
        productId: product.id,
        variantId,
        product,
        variant,
        quantity,
        priceAtAddition: price,
      };
      setItems([...items, newItem]);
    }

    setIsCartOpen(true);
    return { success: true };
  };

  const updateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(cartItemId);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item => {
        if (item.id === cartItemId) {
          const maxStock = item.variant ? item.variant.stock : item.product.stock;
          const cappedQty = Math.min(newQuantity, maxStock);
          return { ...item, quantity: cappedQty };
        }
        return item;
      })
    );
  };

  const removeItem = (cartItemId: string) => {
    setItems(prev => prev.filter(i => i.id !== cartItemId));
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    setCouponError(null);
  };

  const applyCoupon = (code: string): { success: boolean; message: string } => {
    setCouponError(null);
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      setCouponError('Veuillez saisir un code promo');
      return { success: false, message: 'Veuillez saisir un code promo' };
    }

    const coupon = StorageService.getCouponByCode(trimmed);
    if (!coupon) {
      setCouponError('Code promo invalide ou expiré');
      return { success: false, message: 'Code promo invalide ou expiré' };
    }

    if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
      const msg = `Ce code nécessite un panier minimum de ${coupon.minOrderAmount} DA`;
      setCouponError(msg);
      return { success: false, message: msg };
    }

    setAppliedCoupon(coupon);
    return { 
      success: true, 
      message: `Code ${coupon.code} appliqué : -${coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `${coupon.discountValue} DA`}` 
    };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        subtotal,
        discount,
        deliveryFee,
        total,
        itemCount,
        appliedCoupon,
        couponError,
        selectedWilayaCode,
        selectedDeliveryType,
        freeDeliveryThreshold,
        amountNeededForFreeShipping,
        isCartOpen,
        setIsCartOpen,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        applyCoupon,
        removeCoupon,
        setSelectedWilayaCode,
        setSelectedDeliveryType,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
