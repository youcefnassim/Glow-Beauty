import React, { useState } from 'react';
import { StorageService } from '@/services/storage';

export const WhatsAppFloatingButton: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const settings = StorageService.getSettings();

  const rawPhone = settings.whatsappNotificationPhone || settings.contactPhone || '0550123456';
  let cleanPhone = rawPhone.replace(/\D/g, '');
  if (cleanPhone.startsWith('0')) cleanPhone = '213' + cleanPhone.substring(1);
  else if (!cleanPhone.startsWith('213')) cleanPhone = '213' + cleanPhone;

  const message = encodeURIComponent("Bonjour Glow Beauty DZ, j'aimerais avoir un conseil pour ma routine beauté 🌸");
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${message}`;

  return (
    <aside
      aria-label="Assistance WhatsApp"
      className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 flex items-center gap-2.5 print:hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tooltip Pill */}
      <div
        className={`hidden sm:flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-stone-200/80 shadow-soft text-xs text-deep font-medium transition-all duration-300 pointer-events-none ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>Besoin d'un conseil ? <strong>Écrivez-nous</strong></span>
      </div>

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contacter le service client Glow Beauty sur WhatsApp"
        className="relative w-12 sm:w-14 h-12 sm:h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-luxury hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
      >
        {/* Pulse effect */}
        <span className="absolute inset-0 rounded-full bg-emerald-500/30 animate-ping -z-10" />

        {/* WhatsApp Icon */}
        <svg className="w-6 sm:w-7 h-6 sm:h-7 fill-current" viewBox="0 0 24 24">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 2.013.82 2.796.82 3.183 0 5.768-2.587 5.768-5.766.001-3.182-2.585-5.766-5.768-5.766zm9.969 5.766c0 5.518-4.482 10-10 10-1.708 0-3.32-.435-4.733-1.2l-5.267 1.382 1.407-5.139c-.878-1.488-1.407-3.232-1.407-5.043 0-5.518 4.482-10 10-10s10 4.482 10 10z" />
        </svg>

        {/* Online Badge */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full" />
      </a>
    </aside>
  );
};
