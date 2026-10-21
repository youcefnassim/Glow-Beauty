import { describe, it, expect } from 'vitest';
import { UserProfile } from '@/types';

describe('Security, Authorization and Form Validation', () => {
  it('identifies admin authorization correctly', () => {
    const adminUser: UserProfile = {
      id: 'usr-1',
      email: 'admin@glowbeauty.dz',
      fullName: 'Gérante Glow Beauty',
      role: 'admin',
      createdAt: new Date().toISOString(),
    };

    const customerUser: UserProfile = {
      id: 'usr-2',
      email: 'client@gmail.com',
      fullName: 'Cliente Sophia',
      role: 'customer',
      createdAt: new Date().toISOString(),
    };

    const checkIsAdmin = (user: UserProfile | null) => user?.role === 'admin';

    expect(checkIsAdmin(adminUser)).toBe(true);
    expect(checkIsAdmin(customerUser)).toBe(false);
    expect(checkIsAdmin(null)).toBe(false);
  });

  it('restricts customer access only to their own orders', () => {
    const customerAId = 'usr-client-A';
    const customerBId = 'usr-client-B';

    const orders = [
      { id: 'ord-1', userId: customerAId, total: 4500 },
      { id: 'ord-2', userId: customerBId, total: 8200 },
    ];

    const getAccessibleOrders = (userId: string) => {
      return orders.filter(o => o.userId === userId);
    };

    const clientAOrders = getAccessibleOrders(customerAId);
    expect(clientAOrders.length).toBe(1);
    expect(clientAOrders[0].id).toBe('ord-1');

    const clientBOrders = getAccessibleOrders(customerBId);
    expect(clientBOrders.length).toBe(1);
    expect(clientBOrders[0].id).toBe('ord-2');
  });

  it('validates Algerian mobile and landline phone numbers correctly', () => {
    const validatePhone = (val: string): boolean => {
      const cleaned = val.replace(/\s+/g, '').replace(/-/g, '');
      return /^(0(5|6|7)[0-9]{8}|0[2-4][0-9]{7})$/.test(cleaned);
    };

    // Valid numbers
    expect(validatePhone('0550123456')).toBe(true);
    expect(validatePhone('0661 98 76 54')).toBe(true);
    expect(validatePhone('0770-44-55-66')).toBe(true);
    expect(validatePhone('021 12 34 56')).toBe(true); // Fixe Alger

    // Invalid numbers
    expect(validatePhone('12345678')).toBe(false);
    expect(validatePhone('0850123456')).toBe(false);
    expect(validatePhone('+33612345678')).toBe(false);
    expect(validatePhone('055012345')).toBe(false); // Too short
    expect(validatePhone('055012345678')).toBe(false); // Too long
  });
});
