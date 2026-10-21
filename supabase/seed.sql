-- Seed initial categories, brands, settings and coupons
INSERT INTO store_settings (id, store_name, tagline, announcement_text, announcement_active, free_delivery_threshold_dzd, contact_email, contact_phone)
VALUES (
  1, 
  'Glow Beauty', 
  'L’Art de la Beauté Naturelle & Haute Cosmétique',
  'Livraison offerte dans toute l’Algérie dès 8 000 DA d’achats ! 🌸', 
  true, 
  8000, 
  'contact@glowbeauty.dz', 
  '+213 550 12 34 56'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO coupons (code, discount_type, discount_value, min_order_amount_dzd, max_usage, usage_count, is_active)
VALUES 
  ('BIENVENUE10', 'percentage', 10, 3000, 500, 0, true),
  ('GLOW500', 'fixed', 500, 5000, 200, 0, true)
ON CONFLICT (code) DO NOTHING;
