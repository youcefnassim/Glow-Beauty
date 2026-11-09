import React, { useState } from 'react';
import { StorageService } from '@/services/storage';
import { useLanguage } from '@/context/LanguageContext';
import { Search } from 'lucide-react';

export const AdminCustomersPage: React.FC = () => {
  const { t, formatPrice, language } = useLanguage();
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
        <h1 className="font-serif text-3xl font-bold text-deep">{t('admin.customers.pageTitle')}</h1>
        <p className="text-xs text-mutedText mt-1">
          {t('admin.customers.pageSubtitle')}
        </p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute start-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('admin.customers.searchPlaceholder')}
            className="w-full text-xs ps-9 pe-3 py-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none"
          />
        </div>
        <span className="text-xs text-mutedText hidden sm:inline">
          {t('admin.customers.count', { count: filtered.length })}
        </span>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/70 text-mutedText font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4 text-start">{t('admin.customers.colName')}</th>
                <th className="py-3 px-4 text-start">{t('admin.customers.colContact')}</th>
                <th className="py-3 px-4 text-start">{t('admin.customers.colRole')}</th>
                <th className="py-3 px-4 text-start">{t('admin.customers.colOrders')}</th>
                <th className="py-3 px-4 text-start">{t('admin.customers.colSpent')}</th>
                <th className="py-3 px-4 text-start">{t('admin.customers.colJoined')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-mutedText">
                    {t('admin.customers.noCustomers')}
                  </td>
                </tr>
              ) : (
                filtered.map(c => (
                  <tr key={c.id} className="hover:bg-stone-50/50 transition">
                    <td className="py-3 px-4 text-start">
                      <p className="font-semibold text-deep">{c.fullName}</p>
                      <p className="text-[11px] text-mutedText">{c.email}</p>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-stone-600 text-start">
                      {c.phone || '—'}
                    </td>
                    <td className="py-3 px-4 text-start">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        c.role === 'admin' ? 'bg-rose-100 text-rose-900' : 'bg-stone-100 text-stone-800'
                      }`}>
                        {c.role === 'admin' ? t('admin.customers.roleAdmin') : t('admin.customers.roleCustomer')}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-deep text-start">
                      {c.orderCount}
                    </td>
                    <td className="py-3 px-4 font-bold text-rose-900 font-serif text-start">
                      {formatPrice(c.totalSpent)}
                    </td>
                    <td className="py-3 px-4 text-mutedText text-start">
                      {new Date(c.createdAt).toLocaleDateString(language === 'ar' ? 'ar-DZ' : 'fr-FR')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
