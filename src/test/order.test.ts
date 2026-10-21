import { describe, it, expect, beforeEach } from 'vitest';
import { StorageService } from '@/services/storage';

describe('Order Creation, Stock Management and Status History', () => {
  beforeEach(() => {
    StorageService.resetAllData();
  });

  it('creates an order with a unique GLW reference code and decrements stock', () => {
    const productsBefore = StorageService.getProducts();
    const targetProduct = productsBefore[0];
    const initialStock = targetProduct.stock;

    const createdOrder = StorageService.createOrder({
      customerName: 'Amina Test',
      customerPhone: '0550123456',
      shippingAddress: {
        id: 'addr-t1',
        fullName: 'Amina Test',
        phone: '0550123456',
        wilayaCode: 16,
        wilayaName: 'Alger',
        commune: 'Hydra',
        streetAddress: 'Rue des Jardins',
        deliveryType: 'home',
      },
      items: [
        {
          id: 'item-t1',
          orderId: '',
          productId: targetProduct.id,
          productName: targetProduct.nameFr,
          unitPrice: targetProduct.price,
          quantity: 2,
          totalPrice: targetProduct.price * 2,
        },
      ],
      subtotal: targetProduct.price * 2,
      discount: 0,
      deliveryFee: 400,
      total: targetProduct.price * 2 + 400,
      status: 'pending',
      paymentMethod: 'cod',
      paymentStatus: 'pending',
    });

    expect(createdOrder.orderNumber).toMatch(/^GLW-\d{4}-\d{4}$/);
    expect(createdOrder.status).toBe('pending');
    expect(createdOrder.history.length).toBeGreaterThan(0);

    // Verify stock was decremented by 2
    const productsAfter = StorageService.getProducts();
    const updatedTarget = productsAfter.find(p => p.id === targetProduct.id);
    expect(updatedTarget?.stock).toBe(initialStock - 2);
  });

  it('updates order status and records audit timeline history', () => {
    const orders = StorageService.getOrders();
    const order = orders[0];

    const updated = StorageService.updateOrderStatus(
      order.id, 
      'confirmed', 
      'Client joint par appel téléphonique à 10h30', 
      'Amira (Admin)'
    );

    expect(updated).not.toBeNull();
    expect(updated?.status).toBe('confirmed');
    expect(updated?.history[0].status).toBe('confirmed');
    expect(updated?.history[0].note).toBe('Client joint par appel téléphonique à 10h30');
    expect(updated?.history[0].updatedBy).toBe('Amira (Admin)');
  });

  it('assigns courier tracking carrier and tracking number', () => {
    const orders = StorageService.getOrders();
    const order = orders[0];

    const updated = StorageService.updateOrderPayment(
      order.id,
      'pending',
      'YAL-DZ-998877',
      'Yalidine Express'
    );

    expect(updated?.trackingNumber).toBe('YAL-DZ-998877');
    expect(updated?.trackingCarrier).toBe('Yalidine Express');
  });
});
