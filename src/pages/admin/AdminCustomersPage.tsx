import React, { useState } from 'react';
import { StorageService } from '@/services/storage';
import { UserProfile } from '@/types';
import { formatPriceDZD } from '@/data/wilayas';
import { Users, Search, Phone, Mail, ShoppingBag } from 'lucide-react';

export const AdminCustomersPage: React.FC = () => {
  const users = StorageService.getUsers();
  const orders = StorageService.getOrders();
  const [search, setSearch] = useState('');

  const customerList = users.map(user => {
    const userOrders = orders.filter(o => 
      (o.userId && o.userId === user.id) || 
      (user.email && o.customerEmail?.toLowerCase() === user.email.toLowerCase())
    );
    const totalSpent = userOrders
      .filter(o => o.status === 'delivered')
      .reduce((sum, o) => sum + o.total, 0);

    return {
      ...user,
      orderCount: userOrders.length,
      totalSpent,
    };
  });

  const filtered = customerList.filter(c => {
    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();
    return c.fullName.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || (c.phone && c.phone.includes(q));
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-deep">Gestion des Clientes</h1>
        <p className="text-xs text-mutedText mt-1">
          Base de données des clientes enregistrées et historique de fidélité.
        </p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, e-mail ou téléphone..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none"
          />
        </div>
        <span className="text-xs text-mutedText hidden sm:inline">
          {filtered.length} clientes répertoriées
        </span>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/70 text-mutedText font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Contact Téléphonique</th>
                <th className="py-3 px-4">Rôle</th>
                <th className="py-3 px-4">Commandes Passées</th>
                <th className="py-3 px-4">Total Dépensé Encaissé</th>
                <th className="py-3 px-4">Date Inscription</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-stone-50/50 transition">
                  <td className="py-3 px-4">
                    <p className="font-semibold text-deep">{c.fullName}</p>
                    <p className="text-[11px] text-mutedText">{c.email}</p>
                  </td>
                  <td className="py-3 px-4 font-mono font-medium text-stone-600">
                    {c.phone || 'Non renseigné'}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      c.role === 'admin' ? 'bg-rose-100 text-rose-900' : 'bg-stone-100 text-stone-800'
                    }`}>
                      {c.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-deep">
                    {c.orderCount} commande(s)
                  </td>
                  <td className="py-3 px-4 font-bold text-rose-900 font-serif">
                    {formatPriceDZD(c.totalSpent)}
                  </td>
                  <td className="py-3 px-4 text-mutedText">
                    {new Date(c.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
