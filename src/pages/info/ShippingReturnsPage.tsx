import React from 'react';
import { Truck, RefreshCw, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { ALGERIA_WILAYAS, formatPriceDZD } from '@/data/wilayas';

export const ShippingReturnsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-rose-700">Logistique & Sérénité</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-deep">Livraison & Retours</h1>
        <p className="text-xs sm:text-sm text-mutedText max-w-xl mx-auto">
          Toutes les informations détaillées sur l’acheminement de vos colis à travers les 58 wilayas d’Algérie et notre politique de retour sous 48h.
        </p>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-3xl border border-rose-100 shadow-card space-y-2 text-center">
          <Truck className="w-8 h-8 text-rose-600 mx-auto" />
          <h3 className="font-serif text-sm font-bold text-deep">Expédition Express</h3>
          <p className="text-xs text-mutedText">24h à 48h sur Alger et wilayas du centre.</p>
        </div>
        <div className="p-6 bg-white rounded-3xl border border-rose-100 shadow-card space-y-2 text-center">
          <ShieldCheck className="w-8 h-8 text-rose-600 mx-auto" />
          <h3 className="font-serif text-sm font-bold text-deep">Paiement à Réception</h3>
          <p className="text-xs text-mutedText">Règlement en espèces sans aucun risque.</p>
        </div>
        <div className="p-6 bg-white rounded-3xl border border-rose-100 shadow-card space-y-2 text-center">
          <RefreshCw className="w-8 h-8 text-rose-600 mx-auto" />
          <h3 className="font-serif text-sm font-bold text-deep">Retour Garanti 48h</h3>
          <p className="text-xs text-mutedText">Échange immédiat en cas de non-conformité.</p>
        </div>
      </div>

      {/* Wilayas Delivery Table Sample */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-rose-100 shadow-card space-y-4">
        <h2 className="font-serif text-lg font-bold text-deep">Grille tarifaire indicative par zone</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-rose-200 text-deep font-bold">
                <th className="pb-3">Zone / Wilayas</th>
                <th className="pb-3">Livraison Domicile</th>
                <th className="pb-3">Bureau Stop-Desk</th>
                <th className="pb-3">Délai indicatif</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rose-50 text-stone-600">
              <tr>
                <td className="py-2.5 font-medium text-deep">Wilaya 16 (Alger)</td>
                <td>400 DA</td>
                <td>250 DA</td>
                <td>24h ouvrées</td>
              </tr>
              <tr>
                <td className="py-2.5 font-medium text-deep">Grand Centre (Blida, Tipaza, Boumerdès)</td>
                <td>500 DA</td>
                <td>300 DA</td>
                <td>24h à 48h</td>
              </tr>
              <tr>
                <td className="py-2.5 font-medium text-deep">Nord, Est & Ouest (Oran, Constantine, Sétif, Annaba...)</td>
                <td>650 - 700 DA</td>
                <td>400 - 450 DA</td>
                <td>2 à 3 jours</td>
              </tr>
              <tr>
                <td className="py-2.5 font-medium text-deep">Hauts-Plateaux & Portes du Sud (Biskra, Djelfa, M'Sila...)</td>
                <td>800 - 900 DA</td>
                <td>500 - 600 DA</td>
                <td>2 à 4 jours</td>
              </tr>
              <tr>
                <td className="py-2.5 font-medium text-deep">Grand Sud (Adrar, Béchar, Ouargla, Tamanrasset...)</td>
                <td>1 100 - 1 500 DA</td>
                <td>750 - 1 000 DA</td>
                <td>3 à 6 jours</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-mutedText italic pt-2">
          * Rappel : la livraison est entièrement gratuite dès 8 000 DA de commande, peu importe votre wilaya !
        </p>
      </div>

      {/* Return policy details */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-rose-100 shadow-card space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
        <h2 className="font-serif text-lg font-bold text-deep">Modalités de retour et réclamation</h2>
        <p>
          Pour des raisons d'hygiène et de sécurité sanitaire, les produits cosmétiques dont l'opercule de protection ou le sceau d'inviolabilité a été ouvert ou retiré ne peuvent faire l'objet d'un retour, sauf en cas de défaut avéré à la livraison.
        </p>
        <p>
          Si vous constatez un article cassé lors du transport ou une erreur de référence, contactez-nous dans un délai de <strong>48 heures</strong> suivant la réception. Notre équipe organisera sans délai l'échange du produit à nos frais exclusifs.
        </p>
      </div>

    </div>
  );
};
