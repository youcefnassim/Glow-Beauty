import { describe, it, expect, beforeEach } from 'vitest';
import { StorageService } from '@/services/storage';
import { NotificationService } from '@/services/notificationService';
import { Order } from '@/types';

describe('Autonomous Notification Service (Option 2 - No Supabase)', () => {
  beforeEach(() => {
    StorageService.resetAllData();
  });

  const mockOrder: Order = {
    id: 'ord-test-1',
    orderNumber: 'GLW-2026-9999',
    customerName: 'Yasmine Benali',
    customerPhone: '0550123456',
    customerEmail: 'yasmine@test.dz',
    shippingAddress: {
      id: 'addr-1',
      fullName: 'Yasmine Benali',
      phone: '0550123456',
      wilayaCode: 16,
      wilayaName: 'Alger',
      commune: 'Hydra',
      streetAddress: '12 Boulevard des Martyrs',
      deliveryType: 'home',
    },
    items: [
      {
        id: 'item-1',
        orderId: 'ord-test-1',
        productId: 'prod-1',
        productName: 'Sérum Éclat Vitamine C 15%',
        unitPrice: 3800,
        quantity: 2,
        totalPrice: 7600,
      },
    ],
    subtotal: 7600,
    discount: 0,
    deliveryFee: 450,
    total: 8050,
    status: 'pending',
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    createdAt: '2026-10-20T12:00:00Z',
    updatedAt: '2026-10-20T12:00:00Z',
    history: [],
  };

  it('formats clean WhatsApp / Telegram order message with all Algerian order fields', () => {
    const text = NotificationService.formatOrderMessage(mockOrder);

    expect(text).toContain('NOUVELLE COMMANDE GLOW BEAUTY DZ');
    expect(text).toContain('GLW-2026-9999');
    expect(text).toContain('Yasmine Benali');
    expect(text).toContain('0550123456');
    expect(text).toContain('16 - Alger');
    expect(text).toContain('Hydra');
    expect(text).toContain('Sérum Éclat Vitamine C 15%');
    expect(text).toContain('8');
    expect(text).toContain('050 DA');
  });

  it('generates a direct WhatsApp link with normalized 213 country code', () => {
    const url = NotificationService.getWhatsAppOrderUrl(mockOrder, '0550123456');

    expect(url).toContain('https://api.whatsapp.com/send?phone=213550123456');
    expect(url).toContain(encodeURIComponent('GLW-2026-9999'));
  });

  it('allows store admin to configure and save notification settings', () => {
    const settings = StorageService.getSettings();
    expect(settings.whatsappNotificationPhone).toBeDefined();

    const updated = StorageService.saveSettings({
      ...settings,
      whatsappNotificationPhone: '0661234567',
      telegramBotToken: 'bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11',
      telegramChatId: '-100987654321',
      googleSheetWebhook: 'https://script.google.com/macros/s/AKfycbz_test/exec',
    });

    expect(updated.whatsappNotificationPhone).toBe('0661234567');
    expect(updated.telegramBotToken).toBe('bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11');
    expect(updated.telegramChatId).toBe('-100987654321');
    expect(updated.googleSheetWebhook).toBe('https://script.google.com/macros/s/AKfycbz_test/exec');

    // Check reloaded from storage
    const reloaded = StorageService.getSettings();
    expect(reloaded.whatsappNotificationPhone).toBe('0661234567');
  });
});
