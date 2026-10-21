import React from 'react';
import { AnnouncementBar } from './AnnouncementBar';
import { Header } from './Header';
import { Footer } from './Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { MobileBottomNav } from './MobileBottomNav';
import { WhatsAppFloatingButton } from './WhatsAppFloatingButton';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-ivory text-deep selection:bg-rose-200 selection:text-deep">
      <AnnouncementBar />
      <Header />
      <main className="flex-1 pb-16 lg:pb-0">
        {children}
      </main>
      <Footer />
      <CartDrawer />
      <MobileBottomNav />
      <WhatsAppFloatingButton />
    </div>
  );
};
