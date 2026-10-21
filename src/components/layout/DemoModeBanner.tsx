import React, { useState } from 'react';
import { isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { ShieldCheck, UserCheck, RefreshCw, X, Database } from 'lucide-react';
import { StorageService } from '@/services/storage';

export const DemoModeBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);
  const { user, isAdmin, loginAsDemoAdmin, loginAsDemoCustomer, logout } = useAuth();

  if (dismissed) return null;

  return (
    <aside aria-label="Bannière d'information de démonstration" className="bg-deep text-ivory text-xs border-b border-stone-800 py-2 px-4 transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isSupabaseConfigured ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isSupabaseConfigured ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
          </span>
          <span className="font-medium">
            {isSupabaseConfigured ? (
              <span className="flex items-center gap-1.5 text-emerald-300">
                <Database className="w-3.5 h-3.5" /> Supabase PostgreSQL Connecté
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-200">
                Mode Démo Interactif (Données persistées localement)
              </span>
            )}
          </span>
          <span className="text-stone-400 hidden sm:inline">|</span>
          <span className="text-stone-300 hidden md:inline">
            Marché : Algérie (Dinar DZD) • 58 Wilayas
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {user ? (
            <div className="flex items-center gap-2 bg-stone-900/60 px-2.5 py-1 rounded-full border border-stone-700">
              <span className="text-stone-300">
                Connecté : <strong className="text-rose-300">{user.fullName}</strong> ({user.role === 'admin' ? 'Admin' : 'Client'})
              </span>
              <button
                onClick={() => logout()}
                className="text-stone-400 hover:text-white underline ml-1 cursor-pointer"
                title="Se déconnecter"
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="text-stone-400 hidden sm:inline">Accès rapide :</span>
              <button
                onClick={loginAsDemoAdmin}
                className="flex items-center gap-1 bg-rose-900/40 hover:bg-rose-900/70 text-rose-200 border border-rose-700/50 px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer"
              >
                <ShieldCheck className="w-3 h-3 text-rose-300" /> Tester Admin
              </button>
              <button
                onClick={loginAsDemoCustomer}
                className="flex items-center gap-1 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-600 px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer"
              >
                <UserCheck className="w-3 h-3 text-stone-300" /> Tester Client
              </button>
            </div>
          )}

          {isAdmin && (
            <a
              href="/admin"
              className="bg-brand-rose hover:bg-rose-600 text-white font-medium px-2.5 py-0.5 rounded text-[11px] transition shadow-sm"
            >
              Tableau de bord Admin →
            </a>
          )}

          <button
            onClick={() => {
              if (window.confirm('Réinitialiser toutes les données de démo aux valeurs d’origine ?')) {
                StorageService.resetAllData();
                window.location.reload();
              }
            }}
            title="Réinitialiser les données de démo"
            className="text-stone-400 hover:text-stone-200 p-1 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
          </button>

          <button
            onClick={() => setDismissed(true)}
            className="text-stone-400 hover:text-stone-200 p-1 cursor-pointer"
            aria-label="Fermer la bannière"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
