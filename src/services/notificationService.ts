import { Order } from '@/types';
import { formatPriceDZD } from '@/data/wilayas';
import { StorageService } from '@/services/storage';

export const NotificationService = {
  /**
   * Formats a clean, professional order message for WhatsApp or Telegram
   */
  formatOrderMessage(order: Order): string {
    const itemsText = order.items
      .map(
        (item, index) =>
          `  ${index + 1}. *${item.productName}* ${item.variantName ? `(${item.variantName})` : ''} × ${item.quantity} = ${formatPriceDZD(item.totalPrice)}`
      )
      .join('\n');

    return `🌸 *NOUVELLE COMMANDE GLOW BEAUTY DZ* 🌸
━━━━━━━━━━━━━━━━━━━━━━
📦 *Référence :* \`${order.orderNumber}\`
📅 *Date :* ${new Date(order.createdAt).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })}

👤 *CLIENTE :*
• Nom : *${order.customerName}*
• Téléphone : *${order.customerPhone}*
${order.customerEmail ? `• E-mail : ${order.customerEmail}` : ''}

📍 *LIVRAISON :*
• Wilaya : *${order.shippingAddress.wilayaCode} - ${order.shippingAddress.wilayaName}*
• Commune : *${order.shippingAddress.commune}*
• Adresse : ${order.shippingAddress.streetAddress}
• Type : *${order.shippingAddress.deliveryType === 'home' ? 'À Domicile' : 'Bureau Stop-Desk'}*
${order.notes ? `• Instructions : _${order.notes}_` : ''}

🛍️ *ARTICLES :*
${itemsText}

━━━━━━━━━━━━━━━━━━━━━━
💵 *Sous-total :* ${formatPriceDZD(order.subtotal)}
${order.discount > 0 ? `🎟️ *Remise (${order.couponCode || 'Promo'}) :* -${formatPriceDZD(order.discount)}\n` : ''}🚚 *Frais de livraison :* ${order.deliveryFee === 0 ? 'Offerte (Gratuit)' : formatPriceDZD(order.deliveryFee)}
💰 *TOTAL À ENCAISSER :* *${formatPriceDZD(order.total)}*
💳 *Mode :* ${order.paymentMethod === 'cod' ? 'Paiement à la livraison (Espèces)' : 'BaridiMob / CCP'}
━━━━━━━━━━━━━━━━━━━━━━
⏳ *Statut :* En attente d'appel de confirmation`;
  },

  /**
   * Generates a direct WhatsApp link to send the order to the store manager or confirmation team
   */
  getWhatsAppOrderUrl(order: Order, managerPhone?: string): string {
    const settings = StorageService.getSettings();
    // Default phone from settings (whatsappNotificationPhone or contactPhone), strip non-digits, replace leading 0 with Algerian country code 213
    let targetPhone = managerPhone || settings.whatsappNotificationPhone || settings.contactPhone || '0550123456';
    let cleanPhone = targetPhone.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '213' + cleanPhone.substring(1);
    } else if (!cleanPhone.startsWith('213')) {
      cleanPhone = '213' + cleanPhone;
    }

    const message = this.formatOrderMessage(order);
    return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;
  },

  /**
   * Sends the order notification to a Telegram group or channel if configured
   */
  async sendTelegramNotification(order: Order): Promise<boolean> {
    const settings = StorageService.getSettings();
    const botToken = settings.telegramBotToken || import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
    const chatId = settings.telegramChatId || import.meta.env.VITE_TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      // Telegram not configured, silently skip
      return false;
    }

    try {
      const text = this.formatOrderMessage(order);
      const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: 'Markdown',
        }),
      });
      return true;
    } catch (e) {
      console.warn('Telegram notification could not be sent:', e);
      return false;
    }
  },

  /**
   * Sends order details to Google Sheets Webhook if configured
   */
  async sendGoogleSheetWebhook(order: Order): Promise<boolean> {
    const settings = StorageService.getSettings();
    const webhookUrl = settings.googleSheetWebhook || import.meta.env.VITE_GOOGLE_SHEET_WEBHOOK;
    if (!webhookUrl) return false;

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'no-cors',
        body: JSON.stringify({
          orderNumber: order.orderNumber,
          date: new Date(order.createdAt).toISOString(),
          customerName: order.customerName,
          customerPhone: order.customerPhone,
          wilaya: `${order.shippingAddress.wilayaCode} - ${order.shippingAddress.wilayaName}`,
          commune: order.shippingAddress.commune,
          streetAddress: order.shippingAddress.streetAddress,
          deliveryType: order.shippingAddress.deliveryType,
          itemsCount: order.items.reduce((s, i) => s + i.quantity, 0),
          itemsDescription: order.items.map(i => `${i.productName} (x${i.quantity})`).join(', '),
          subtotal: order.subtotal,
          deliveryFee: order.deliveryFee,
          total: order.total,
          status: order.status,
          notes: order.notes || '',
        }),
      });
      return true;
    } catch (e) {
      console.warn('Google Sheet webhook could not be sent:', e);
      return false;
    }
  },
};
