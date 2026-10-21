-- ====================================================================
-- GLOW BEAUTY - PRODUCTION DATABASE MIGRATION
-- Market: Algeria (DZD Currency)
-- Schema: Products, Orders, Customers, Inventory, RLS Policies
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
CREATE TYPE user_role_enum AS ENUM ('customer', 'admin');
CREATE TYPE order_status_enum AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE payment_method_enum AS ENUM ('cod', 'bank_transfer', 'baridimob', 'edahabia_cib');
CREATE TYPE payment_status_enum AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE discount_type_enum AS ENUM ('percentage', 'fixed');

-- 3. PROFILES & ROLES
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT,
  role user_role_enum DEFAULT 'customer' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. ADDRESSES
CREATE TABLE IF NOT EXISTS addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  wilaya_code INT NOT NULL,
  wilaya_name TEXT NOT NULL,
  commune TEXT NOT NULL,
  street_address TEXT NOT NULL,
  delivery_type TEXT DEFAULT 'home' NOT NULL, -- 'home' or 'stopdesk'
  is_default BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. BRANDS
CREATE TABLE IF NOT EXISTS brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  country TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  name_fr TEXT NOT NULL,
  name_ar TEXT,
  name_en TEXT,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 7. PRODUCTS
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  name_fr TEXT NOT NULL,
  name_ar TEXT,
  name_en TEXT,
  brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
  category_id UUID REFERENCES categories(id) ON DELETE RESTRICT,
  price_dzd BIGINT NOT NULL, -- Stored as integer Algerian Dinars (e.g. 3200 DZD)
  compare_at_price_dzd BIGINT,
  short_description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  ingredients TEXT,
  usage_instructions TEXT,
  skin_type TEXT,
  skin_concern TEXT,
  is_new_arrival BOOLEAN DEFAULT false NOT NULL,
  is_promo BOOLEAN DEFAULT false NOT NULL,
  is_featured BOOLEAN DEFAULT false NOT NULL,
  is_published BOOLEAN DEFAULT true NOT NULL,
  stock INT DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 8. PRODUCT IMAGES
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  alt_text TEXT,
  is_primary BOOLEAN DEFAULT false NOT NULL,
  order_index INT DEFAULT 0 NOT NULL
);

-- 9. PRODUCT VARIANTS
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  sku TEXT NOT NULL UNIQUE,
  price_dzd BIGINT NOT NULL,
  compare_at_price_dzd BIGINT,
  stock INT DEFAULT 0 NOT NULL,
  color_hex TEXT,
  volume_or_weight TEXT
);

-- 10. REVIEWS
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  title TEXT NOT NULL,
  comment TEXT NOT NULL,
  is_verified_purchase BOOLEAN DEFAULT false NOT NULL,
  is_approved BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 11. COUPONS & PROMOTIONS
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  discount_type discount_type_enum NOT NULL,
  discount_value INT NOT NULL,
  min_order_amount_dzd BIGINT DEFAULT 0 NOT NULL,
  max_usage INT,
  usage_count INT DEFAULT 0 NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 12. ORDERS & ORDER ITEMS
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  wilaya_code INT NOT NULL,
  wilaya_name TEXT NOT NULL,
  commune TEXT NOT NULL,
  street_address TEXT NOT NULL,
  delivery_type TEXT NOT NULL,
  subtotal_dzd BIGINT NOT NULL,
  discount_dzd BIGINT DEFAULT 0 NOT NULL,
  delivery_fee_dzd BIGINT NOT NULL,
  total_dzd BIGINT NOT NULL,
  coupon_code TEXT,
  status order_status_enum DEFAULT 'pending' NOT NULL,
  payment_method payment_method_enum DEFAULT 'cod' NOT NULL,
  payment_status payment_status_enum DEFAULT 'pending' NOT NULL,
  tracking_number TEXT,
  tracking_carrier TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  variant_name TEXT,
  unit_price_dzd BIGINT NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  total_price_dzd BIGINT NOT NULL,
  image_url TEXT
);

CREATE TABLE IF NOT EXISTS order_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  status order_status_enum NOT NULL,
  note TEXT NOT NULL,
  updated_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 13. STORE SETTINGS & NEWSLETTER
CREATE TABLE IF NOT EXISTS store_settings (
  id INT PRIMARY KEY DEFAULT 1,
  store_name TEXT NOT NULL DEFAULT 'Glow Beauty',
  tagline TEXT,
  announcement_text TEXT,
  announcement_active BOOLEAN DEFAULT true NOT NULL,
  free_delivery_threshold_dzd BIGINT DEFAULT 8000 NOT NULL,
  contact_email TEXT,
  contact_phone TEXT,
  social_instagram TEXT,
  social_facebook TEXT,
  social_tiktok TEXT,
  enable_online_payments BOOLEAN DEFAULT false NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  consent BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Helper function to check if caller is an admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Public can read published products, images, variants, approved reviews, store settings
CREATE POLICY "Public can view published products" ON products FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view product images" ON product_images FOR SELECT USING (true);
CREATE POLICY "Public can view product variants" ON product_variants FOR SELECT USING (true);
CREATE POLICY "Public can view approved reviews" ON reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "Public can view store settings" ON store_settings FOR SELECT USING (true);

-- Admins full access
CREATE POLICY "Admins full access products" ON products FOR ALL TO authenticated USING (is_admin());
CREATE POLICY "Admins full access categories" ON categories FOR ALL TO authenticated USING (is_admin());
CREATE POLICY "Admins full access orders" ON orders FOR ALL TO authenticated USING (is_admin());
CREATE POLICY "Admins full access reviews" ON reviews FOR ALL TO authenticated USING (is_admin());
CREATE POLICY "Admins full access coupons" ON coupons FOR ALL TO authenticated USING (is_admin());
CREATE POLICY "Admins full access settings" ON store_settings FOR ALL TO authenticated USING (is_admin());

-- Customers can view their own orders & profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can view own orders" ON orders FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can view own addresses" ON addresses FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Anyone can submit order (including guest checkout)
CREATE POLICY "Anyone can create order" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can insert order items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_subscriptions FOR INSERT WITH CHECK (true);
