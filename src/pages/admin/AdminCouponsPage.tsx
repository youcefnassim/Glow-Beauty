import React, { useState } from 'react';
import { StorageService } from '@/services/storage';
import { Coupon } from '@/types';
import { formatPriceDZD } from '@/data/wilayas';
import { Tag, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export const AdminCouponsPage: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>(() => StorageService.getCoupons());
  const [isCreating, setIsCreating] = useState(false);

  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [minOrderAmount, setMinOrderAmount] = useState<number>(3000);
  const [maxUsage, setMaxUsage] = useState<number>(100);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const newCoupon: Coupon = {
      id: `coup-${Date.now()}`,
      code: code.trim().toUpperCase(),
      discountType,
      discountValue: Number(discountValue),
      minOrderAmount: Number(minOrderAmount),
      maxUsage: Number(maxUsage),
      usageCount: 0,
      isActive: true,
    };

    StorageService.saveCoupon(newCoupon);
    setCoupons(StorageService.getCoupons());
    setIsCreating(false);
    setCode('');
  };

  const handleToggleActive = (coupon: Coupon) => {
    const updated = { ...coupon, isActive: !coupon.isActive };
    StorageService.saveCoupon(updated);
    setCoupons(StorageService.getCoupons());
  };

  const handleDelete = (id: string, code: string) => {
    if (window.confirm(`Supprimer le code ${code} ?`)) {
      StorageService.deleteCoupon(id);
      setCoupons(StorageService.getCoupons());
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-deep">Codes Promotionnels</h1>
          <p className="text-xs text-mutedText mt-1">
            Gérez vos campagnes de réduction, remises d'accueil et offres privées.
          </p>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="bg-deep hover:bg-rose-950 text-ivory text-xs font-semibold px-5 py-2.5 rounded-xl transition shadow-sm flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Créer un code promo</span>
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-card space-y-4 text-xs animate-fadeIn">
          <h3 className="font-serif text-base font-bold text-deep pb-2 border-b border-stone-100">
            Nouveau Code Promo
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-deep block mb-1">Code (ex: SUMMER2026)</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Ex: PROMO15"
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 font-mono uppercase"
              />
            </div>

            <div>
              <label className="font-semibold text-deep block mb-1">Type de remise</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'fixed')}
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50"
              >
                <option value="percentage">Pourcentage (%)</option>
                <option value="fixed">Montant fixe en Dinars (DA)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-semibold text-deep block mb-1">
                Valeur ({discountType === 'percentage' ? '%' : 'DA'})
              </label>
              <input
                type="number"
                required
                min="1"
                value={discountValue}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 font-bold"
              />
            </div>

            <div>
              <label className="font-semibold text-deep block mb-1">Panier minimum (DA)</label>
              <input
                type="number"
                min="0"
                value={minOrderAmount}
                onChange={(e) => setMinOrderAmount(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50"
              />
            </div>

            <div>
              <label className="font-semibold text-deep block mb-1">Limite d'utilisations</label>
              <input
                type="number"
                min="1"
                value={maxUsage}
                onChange={(e) => setMaxUsage(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 rounded-xl border border-stone-300 font-semibold"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-deep text-ivory font-semibold px-6 py-2 rounded-xl"
            >
              Créer le code
            </button>
          </div>
        </form>
      )}

      {/* Coupons Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50/70 text-mutedText font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">Code</th>
              <th className="py-3 px-4">Valeur de remise</th>
              <th className="py-3 px-4">Panier Minimum</th>
              <th className="py-3 px-4">Utilisations</th>
              <th className="py-3 px-4">Statut</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-stone-700">
            {coupons.map(c => (
              <tr key={c.id} className="hover:bg-stone-50/50 transition">
                <td className="py-3.5 px-4 font-mono font-bold text-deep text-sm">
                  {c.code}
                </td>
                <td className="py-3.5 px-4 font-bold text-rose-800">
                  {c.discountType === 'percentage' ? `-${c.discountValue}%` : `-${formatPriceDZD(c.discountValue)}`}
                </td>
                <td className="py-3.5 px-4">
                  {c.minOrderAmount ? formatPriceDZD(c.minOrderAmount) : 'Aucun'}
                </td>
                <td className="py-3.5 px-4">
                  {c.usageCount} / {c.maxUsage || 'Illimité'}
                </td>
                <td className="py-3.5 px-4">
                  <button
                    onClick={() => handleToggleActive(c)}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer ${
                      c.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {c.isActive ? 'Actif' : 'Désactivé'}
                  </button>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => handleDelete(c.id, c.code)}
                    className="p-1.5 text-stone-400 hover:text-red-600 transition cursor-pointer"
                    title="Supprimer le code"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
