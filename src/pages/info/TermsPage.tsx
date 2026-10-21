import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-deep">Conditions Générales de Vente</h1>
        <p className="text-xs text-mutedText mt-1">Dernière mise à jour : 2026</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-rose-100 shadow-card space-y-6 text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
        <section className="space-y-2">
          <h2 className="font-serif text-base font-bold text-deep">1. Champ d'application</h2>
          <p>
            Les présentes Conditions Générales de Vente s’appliquent à toutes les commandes passées sur le site officiel de Glow Beauty par les clients résidant sur le territoire algérien.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-base font-bold text-deep">2. Prix et monnaie</h2>
          <p>
            Tous les prix affichés sur notre boutique sont libellés en Dinars Algériens (DZD / DA) et s’entendent toutes taxes comprises (TTC), hors frais de livraison applicables selon la wilaya sélectionnée.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-base font-bold text-deep">3. Validation de la commande et paiement</h2>
          <p>
            Toute commande passée sur notre plateforme fait l'objet d'un appel téléphonique préalable par nos équipes de confirmation. Le règlement est effectué en totalité en espèces au livreur lors de la réception du colis.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-base font-bold text-deep">4. Droit applicable</h2>
          <p>
            Les présentes conditions sont régies par le droit algérien applicable au commerce électronique et à la protection du consommateur.
          </p>
        </section>
      </div>
    </div>
  );
};
