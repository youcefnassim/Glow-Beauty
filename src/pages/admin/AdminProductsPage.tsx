import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { StorageService } from '@/services/storage';
import { CATEGORIES } from '@/data/categories';
import { Product } from '@/types';
import { formatPriceDZD } from '@/data/wilayas';
import { Plus, Search, Edit3, Trash2, Eye, AlertCircle } from 'lucide-react';

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(() => StorageService.getProducts());
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  const filtered = products.filter(p => {
    if (selectedCat !== 'all' && p.categorySlug !== selectedCat) return false;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      return p.nameFr.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
    }
    return true;
  });

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le produit « ${name} » ?`)) {
      StorageService.deleteProduct(id);
      setProducts(StorageService.getProducts());
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-deep">Gestion des Produits</h1>
          <p className="text-xs text-mutedText mt-1">
            {products.length} références actives dans le catalogue cosmétique.
          </p>
        </div>
        <Link
          to="/admin/products/new"
          className="bg-deep hover:bg-rose-950 text-ivory text-xs font-semibold px-5 py-2.5 rounded-xl transition shadow-sm flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Créer un produit</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom ou marque..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-mutedText hidden sm:inline">Filtrer catégorie :</span>
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="text-xs p-2 rounded-xl border border-stone-200 bg-stone-50 font-medium w-full sm:w-auto"
          >
            <option value="all">Toutes les catégories</option>
            {CATEGORIES.map(c => (
              <option key={c.id} value={c.slug}>{c.nameFr}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Product List Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/70 text-mutedText font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Produit</th>
                <th className="py-3 px-4">Marque / Catégorie</th>
                <th className="py-3 px-4">Prix Public</th>
                <th className="py-3 px-4">Stock Restant</th>
                <th className="py-3 px-4">Badges Actifs</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filtered.map(product => (
                <tr key={product.id} className="hover:bg-stone-50/50 transition">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images[0]?.url}
                        alt={product.nameFr}
                        className="w-12 h-12 rounded-xl object-cover bg-stone-100 border border-stone-200 shrink-0"
                      />
                      <div>
                        <Link to={`/products/${product.slug}`} target="_blank" className="font-semibold text-deep hover:text-rose-800 line-clamp-1">
                          {product.nameFr}
                        </Link>
                        <p className="text-[11px] text-mutedText font-mono">ID: {product.id}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <p className="font-semibold text-deep">{product.brand}</p>
                    <p className="text-[11px] text-mutedText capitalize">{product.categorySlug.replace(/-/g, ' ')}</p>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-bold text-deep font-serif text-sm">
                      {formatPriceDZD(product.price)}
                    </span>
                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                      <p className="text-[11px] text-mutedText line-through">
                        {formatPriceDZD(product.compareAtPrice)}
                      </p>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      product.stock > 15 ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                      product.stock > 0 ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                      'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                      {product.stock} unités
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {product.isNewArrival && (
                        <span className="bg-deep text-ivory text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">
                          New
                        </span>
                      )}
                      {product.isPromo && (
                        <span className="bg-rose-600 text-white text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">
                          Promo
                        </span>
                      )}
                      {product.isBestSeller && (
                        <span className="bg-brand-rose text-white text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">
                          Best-Seller
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/products/${product.id}`}
                        className="p-1.5 text-stone-500 hover:text-deep hover:bg-stone-100 rounded-lg transition"
                        title="Modifier le produit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id, product.nameFr)}
                        className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                        title="Supprimer définitivement"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
