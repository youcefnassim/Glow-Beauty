import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export const FaqPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqItems = [
    {
      category: 'Commandes & Livraison',
      items: [
        {
          q: 'Dans quelles wilayas livrez-vous ?',
          a: 'Glow Beauty dessert les 58 wilayas d’Algérie sans exception, via nos partenaires logistiques Yalidine Express et ZR Express.'
        },
        {
          q: 'Quels sont les tarifs de livraison ?',
          a: 'Les tarifs dépendent de la zone géographique et du mode choisi : 400 DA pour Alger (250 DA en stop-desk), 500 à 750 DA pour les wilayas du nord et de l’est/ouest, et 850 à 1 500 DA pour le grand sud. La livraison est 100% offerte dès 8 000 DA d’achats !'
        },
        {
          q: 'Combien de temps prend la livraison ?',
          a: 'Le délai est de 24h à 48h ouvrées pour Alger et les wilayas proches, et de 2 à 4 jours ouvrés pour les autres wilayas.'
        }
      ]
    },
    {
      category: 'Paiement & Sécurité',
      items: [
        {
          q: 'Puis-je payer en espèces à la livraison ?',
          a: 'Oui, c’est le mode de règlement par défaut en Algérie. Vous réglez directement le livreur au moment où il vous remet votre colis.'
        },
        {
          q: 'Le virement BaridiMob est-il accepté ?',
          a: 'Oui, vous pouvez opter pour un virement BaridiMob ou CCP. Les coordonnées du compte RIP vous sont transmises lors de la confirmation téléphonique.'
        }
      ]
    },
    {
      category: 'Produits & Formulations',
      items: [
        {
          q: 'Les produits sont-ils authentiques ?',
          a: 'Tous nos soins sont 100% authentiques, certifiés conformes et stockés dans nos entrepôts tempérés à Alger.'
        },
        {
          q: 'Les cosmétiques conviennent-ils aux femmes enceintes ?',
          a: 'La grande majorité de nos soins hydratants et nourrissants conviennent parfaitement. Toutefois, pour les soins contenant des huiles essentielles fortes ou des acides concentrés, demandez conseil à votre médecin ou vérifiez la mention sur la fiche produit.'
        }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-rose-700">Aide & Conseils</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-deep">Foire Aux Questions (FAQ)</h1>
        <p className="text-xs sm:text-sm text-mutedText max-w-lg mx-auto">
          Toutes les réponses à vos interrogations sur la commande, la livraison dans les 58 wilayas et nos soins d'exception.
        </p>
      </div>

      <div className="space-y-8">
        {faqItems.map((section, sIdx) => (
          <div key={sIdx} className="space-y-3">
            <h2 className="font-serif text-lg font-bold text-deep pb-2 border-b border-rose-100">
              {section.category}
            </h2>
            <div className="space-y-3">
              {section.items.map((item, idx) => {
                const uniqueKey = sIdx * 10 + idx;
                const isOpen = openIndex === uniqueKey;
                return (
                  <div key={idx} className="bg-white rounded-2xl border border-rose-100 overflow-hidden shadow-xs">
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : uniqueKey)}
                      className="w-full p-4 text-left flex items-center justify-between gap-4 cursor-pointer"
                    >
                      <span className="text-xs sm:text-sm font-semibold text-deep">{item.q}</span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-rose-600 shrink-0" /> : <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-xs text-mutedText leading-relaxed border-t border-rose-50 pt-2.5">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
