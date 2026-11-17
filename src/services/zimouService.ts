import { Order } from '@/types';
import { StorageService } from '@/services/storage';

export interface ZimouResponse {
  success: boolean;
  trackingCode?: string;
  bordereauUrl?: string;
  uuid?: string;
  packageId?: number;
  message?: string;
}

export interface ZimouAccountInfo {
  success: boolean;
  name?: string;
  phone?: string;
  email?: string;
  storeId?: number;
  message?: string;
}

const ZIMOU_API_BASE = 'https://zimou.express/api/v1';

export const ZimouService = {
  /**
   * Tests the connection with the given token against Zimou Express API
   */
  async testConnection(tokenInput?: string): Promise<ZimouAccountInfo> {
    const settings = StorageService.getSettings();
    const token = (tokenInput || settings.zimouApiToken || '').trim();

    if (!token) {
      return { success: false, message: 'Aucun token API Zimou Express renseigné.' };
    }

    try {
      const res = await fetch(`${ZIMOU_API_BASE}/user`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!res.ok) {
        return { 
          success: false, 
          message: `Échec de connexion (Code ${res.status}). Veuillez vérifier votre token API.` 
        };
      }

      const data = await res.json();
      return {
        success: true,
        name: data.name || 'Gérant',
        phone: data.phone,
        email: data.email,
        storeId: data.store_id,
        message: 'Connexion à Zimou Express réussie !',
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur réseau';
      return { success: false, message: `Erreur de connexion : ${msg}` };
    }
  },

  /**
   * Creates a parcel/package on Zimou Express for the specified order
   */
  async createPackage(order: Order, tokenOverride?: string): Promise<ZimouResponse> {
    const settings = StorageService.getSettings();
    const token = (tokenOverride || settings.zimouApiToken || '').trim();

    if (!token) {
      return { success: false, message: 'Token API Zimou manquant dans les paramètres boutique.' };
    }

    // Split customer full name into first and last name
    const rawName = (order.customerName || 'Cliente').trim();
    const parts = rawName.split(/\s+/);
    const firstName = parts[0] || 'Cliente';
    const lastName = parts.slice(1).join(' ') || '.';

    // Clean phone number (e.g. "0550 12 34 56" -> "0550123456")
    const cleanPhone = (order.customerPhone || '').replace(/\D/g, '');

    // Extract and clean wilaya name
    let wilaya = order.shippingAddress.wilayaName || 'Alger';
    if (wilaya.includes('-')) {
      wilaya = wilaya.split('-').pop()?.trim() || wilaya;
    }

    // Commune
    const commune = order.shippingAddress.commune || wilaya;

    // Delivery type
    const isStopDesk = order.shippingAddress.deliveryType === 'stopdesk';

    // Summary of products
    const productSummary = order.items
      .map(i => `${i.productName}${i.variantName ? ` (${i.variantName})` : ''} x${i.quantity}`)
      .join(', ')
      .substring(0, 190) || 'Cosmétiques Jin Makeup';

    const payload = {
      name: productSummary,
      client_first_name: firstName,
      client_last_name: lastName,
      client_phone: cleanPhone,
      address: order.shippingAddress.streetAddress || (isStopDesk ? 'Bureau Stop Desk Zimou' : 'Adresse cliente'),
      commune: commune,
      wilaya: wilaya,
      order_id: order.orderNumber,
      price: Math.round(order.total),
      type: 1, // 1 = E-commerce
      free_delivery: order.deliveryFee === 0 ? 1 : 0,
      is_stopdesk: isStopDesk ? 1 : 0,
      can_be_opened: 1, // Permettre au client de vérifier le colis
      weight: 1,
      observation: order.notes ? `${order.notes} | Jin Makeup` : 'Jin Makeup Cosmétiques - Fragile',
    };

    try {
      const res = await fetch(`${ZIMOU_API_BASE}/packages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.error === 0 && data.data) {
        const pkg = data.data;
        const trackingCode = pkg.tracking_code;
        const bordereauUrl = pkg.bordereau;
        const uuid = pkg.uuid;
        const packageId = pkg.id;

        // Automatically update the local order with tracking details
        StorageService.updateOrderWithZimou(order.id, {
          trackingCode,
          bordereauUrl,
          uuid,
          packageId,
        });

        return {
          success: true,
          trackingCode,
          bordereauUrl,
          uuid,
          packageId,
          message: data.message || 'Colis créé avec succès sur votre compte Zimou Express !',
        };
      } else {
        return {
          success: false,
          message: data.message || 'Erreur retournée par Zimou Express.',
        };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur de connexion';
      return {
        success: false,
        message: `Impossible de contacter Zimou Express : ${msg}`,
      };
    }
  },
};
