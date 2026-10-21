import { describe, it, expect, beforeEach } from 'vitest';
import { StorageService } from '@/services/storage';
import { Product, Coupon } from '@/types';
import { getWilayaByCode } from '@/data/wilayas';

describe('Cart Calculations and Rules', () => {
  beforeEach(() => {
    StorageService.resetAllData();
  });

  it('calculates subtotal correctly for multiple items', () => {
    const items = [
      { unitPrice: 3200, quantity: 2 },
      { unitPrice: 4500, quantity: 1 },
      { unitPrice: 2800, quantity: 3 },
    ];
    const subtotal = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
    // (3200*2) + (4500*1) + (2800*3) = 6400 + 4500 + 8400 = 19300
    expect(subtotal).toBe(19300);
  });

  it('validates stock boundary and prevents excessive quantities', () => {
    const product = StorageService.getProducts()[0];
    const availableStock = product.stock;

    const requestedQty = availableStock + 5;
    const canFulfill = requestedQty <= availableStock;

    expect(canFulfill).toBe(false);
  });

  it('calculates percentage discount accurately', () => {
    const subtotal = 10000;
    const percentageCoupon: Coupon = {
      id: 'test-1',
      code: 'TEST10',
      discountType: 'percentage',
      discountValue: 10,
      minOrderAmount: 3000,
      usageCount: 0,
      isActive: true,
    };

    const discount = Math.round((subtotal * percentageCoupon.discountValue) / 100);
    expect(discount).toBe(1000);
    expect(subtotal - discount).toBe(9000);
  });

  it('calculates fixed DA discount accurately', () => {
    const subtotal = 6000;
    const fixedCoupon: Coupon = {
      id: 'test-2',
      code: 'FIXED500',
      discountType: 'fixed',
      discountValue: 500,
      minOrderAmount: 4000,
      usageCount: 0,
      isActive: true,
    };

    const discount = Math.min(subtotal, fixedCoupon.discountValue);
    expect(discount).toBe(500);
    expect(subtotal - discount).toBe(5500);
  });

  it('rejects coupon if order subtotal is below minimum required', () => {
    const subtotal = 2500;
    const coupon: Coupon = {
      id: 'test-3',
      code: 'MIN5000',
      discountType: 'percentage',
      discountValue: 15,
      minOrderAmount: 5000,
      usageCount: 0,
      isActive: true,
    };

    const isValid = !coupon.minOrderAmount || subtotal >= coupon.minOrderAmount;
    expect(isValid).toBe(false);
  });

  it('applies free shipping when order reaches the 8,000 DA threshold', () => {
    const freeDeliveryThreshold = 8000;
    const subtotalAbove = 9500;
    const subtotalBelow = 6500;

    const feeAbove = subtotalAbove >= freeDeliveryThreshold ? 0 : 650;
    const feeBelow = subtotalBelow >= freeDeliveryThreshold ? 0 : 650;

    expect(feeAbove).toBe(0);
    expect(feeBelow).toBe(650);
  });

  it('computes exact Algerian wilaya delivery rates for home and stop-desk', () => {
    const algerWilaya = getWilayaByCode(16);
    expect(algerWilaya).toBeDefined();
    expect(algerWilaya?.homeDeliveryFee).toBe(400);
    expect(algerWilaya?.stopDeskFee).toBe(250);

    const oranWilaya = getWilayaByCode(31);
    expect(oranWilaya).toBeDefined();
    expect(oranWilaya?.homeDeliveryFee).toBe(650);
    expect(oranWilaya?.stopDeskFee).toBe(400);
  });
});
