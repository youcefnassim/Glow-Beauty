import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { CartProvider } from '@/context/CartContext';
import { Layout } from '@/components/layout/Layout';

// Public Storefront Pages
import { HomePage } from '@/pages/HomePage';
import { CatalogPage } from '@/pages/CatalogPage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { CartPage } from '@/pages/CartPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { OrderConfirmationPage } from '@/pages/OrderConfirmationPage';
import { TrackOrderPage } from '@/pages/TrackOrderPage';
import { WishlistPage } from '@/pages/WishlistPage';

// Auth Pages
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';

// Customer Account Pages
import { AccountPage } from '@/pages/account/AccountPage';
import { AccountOrdersPage } from '@/pages/account/AccountOrdersPage';
import { OrderDetailPage } from '@/pages/account/OrderDetailPage';

// Informational Pages
import { AboutPage } from '@/pages/info/AboutPage';
import { ContactPage } from '@/pages/info/ContactPage';
import { FaqPage } from '@/pages/info/FaqPage';
import { ShippingReturnsPage } from '@/pages/info/ShippingReturnsPage';
import { PrivacyPolicyPage } from '@/pages/info/PrivacyPolicyPage';
import { TermsPage } from '@/pages/info/TermsPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

// Admin Dashboard Pages
import { AdminLayout } from '@/pages/admin/AdminLayout';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminProductsPage } from '@/pages/admin/AdminProductsPage';
import { AdminProductFormPage } from '@/pages/admin/AdminProductFormPage';
import { AdminCategoriesPage } from '@/pages/admin/AdminCategoriesPage';
import { AdminOrdersPage } from '@/pages/admin/AdminOrdersPage';
import { AdminOrderDetailPage } from '@/pages/admin/AdminOrderDetailPage';
import { AdminCustomersPage } from '@/pages/admin/AdminCustomersPage';
import { AdminCouponsPage } from '@/pages/admin/AdminCouponsPage';
import { AdminContentPage } from '@/pages/admin/AdminContentPage';
import { AdminSettingsPage } from '@/pages/admin/AdminSettingsPage';

export function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <BrowserRouter>
              <Routes>
                {/* Storefront Routes wrapped in public Layout */}
                <Route
                  path="/"
                  element={
                    <Layout>
                      <HomePage />
                    </Layout>
                  }
                />
                <Route
                  path="/shop"
                  element={
                    <Layout>
                      <CatalogPage />
                    </Layout>
                  }
                />
                <Route
                  path="/categories/:slug"
                  element={
                    <Layout>
                      <CatalogPage />
                    </Layout>
                  }
                />
                <Route
                  path="/products/:slug"
                  element={
                    <Layout>
                      <ProductDetailPage />
                    </Layout>
                  }
                />
                <Route
                  path="/search"
                  element={
                    <Layout>
                      <CatalogPage />
                    </Layout>
                  }
                />
                <Route
                  path="/cart"
                  element={
                    <Layout>
                      <CartPage />
                    </Layout>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <Layout>
                      <CheckoutPage />
                    </Layout>
                  }
                />
                <Route
                  path="/order-confirmation/:orderReference"
                  element={
                    <Layout>
                      <OrderConfirmationPage />
                    </Layout>
                  }
                />
                <Route
                  path="/track-order"
                  element={
                    <Layout>
                      <TrackOrderPage />
                    </Layout>
                  }
                />
                <Route
                  path="/wishlist"
                  element={
                    <Layout>
                      <WishlistPage />
                    </Layout>
                  }
                />

                {/* Auth Routes */}
                <Route
                  path="/login"
                  element={
                    <Layout>
                      <LoginPage />
                    </Layout>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <Layout>
                      <RegisterPage />
                    </Layout>
                  }
                />
                <Route
                  path="/forgot-password"
                  element={
                    <Layout>
                      <ForgotPasswordPage />
                    </Layout>
                  }
                />

                {/* Customer Account Routes */}
                <Route
                  path="/account"
                  element={
                    <Layout>
                      <AccountPage />
                    </Layout>
                  }
                />
                <Route
                  path="/account/orders"
                  element={
                    <Layout>
                      <AccountOrdersPage />
                    </Layout>
                  }
                />
                <Route
                  path="/account/orders/:id"
                  element={
                    <Layout>
                      <OrderDetailPage />
                    </Layout>
                  }
                />

                {/* Informational Pages */}
                <Route
                  path="/about"
                  element={
                    <Layout>
                      <AboutPage />
                    </Layout>
                  }
                />
                <Route
                  path="/contact"
                  element={
                    <Layout>
                      <ContactPage />
                    </Layout>
                  }
                />
                <Route
                  path="/faq"
                  element={
                    <Layout>
                      <FaqPage />
                    </Layout>
                  }
                />
                <Route
                  path="/shipping-returns"
                  element={
                    <Layout>
                      <ShippingReturnsPage />
                    </Layout>
                  }
                />
                <Route
                  path="/privacy-policy"
                  element={
                    <Layout>
                      <PrivacyPolicyPage />
                    </Layout>
                  }
                />
                <Route
                  path="/terms"
                  element={
                    <Layout>
                      <TermsPage />
                    </Layout>
                  }
                />

                {/* Administration Dashboard Subroutes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboardPage />} />
                  <Route path="products" element={<AdminProductsPage />} />
                  <Route path="products/new" element={<AdminProductFormPage />} />
                  <Route path="products/:id" element={<AdminProductFormPage />} />
                  <Route path="categories" element={<AdminCategoriesPage />} />
                  <Route path="orders" element={<AdminOrdersPage />} />
                  <Route path="orders/:id" element={<AdminOrderDetailPage />} />
                  <Route path="customers" element={<AdminCustomersPage />} />
                  <Route path="coupons" element={<AdminCouponsPage />} />
                  <Route path="content" element={<AdminContentPage />} />
                  <Route path="settings" element={<AdminSettingsPage />} />
                </Route>

                {/* 404 Catch-All */}
                <Route
                  path="*"
                  element={
                    <Layout>
                      <NotFoundPage />
                    </Layout>
                  }
                />
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
