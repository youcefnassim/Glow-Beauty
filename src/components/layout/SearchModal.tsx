import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import { StorageService } from '@/services/storage';
import { Product } from '@/types';
import { formatPriceDZD } from '@/data/wilayas';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase().trim();
    const products = StorageService.getProducts();
    const filtered = products.filter(p =>
      p.nameFr.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q) ||
      (p.ingredients && p.ingredients.toLowerCase().includes(q))
    ).slice(0, 6);

    setResults(filtered);
  }, [query]);

  const handleSelectProduct = (slug: string) => {
    onClose();
    navigate(`/products/${slug}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'Enter' && query.trim()) {
      onClose();
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-deep/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-2xl shadow-luxury w-full max-w-2xl overflow-hidden border border-rose-100"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-rose-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-rose-500" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Rechercher un soin, un sérum, du rouge à lèvres..."
            className="w-full text-base focus:outline-none text-deep placeholder:text-mutedText"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-mutedText hover:text-deep p-1">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs bg-ivory hover:bg-rose-100 text-deep px-3 py-1.5 rounded-lg border border-rose-200 transition"
          >
            Fermer (Échap)
          </button>
        </div>

        {/* Suggestions or Results */}
        <div className="max-h-96 overflow-y-auto p-4">
          {query.trim() === '' ? (
            <div>
              <p className="text-xs font-semibold text-mutedText uppercase tracking-wider mb-2">Recherches fréquentes</p>
              <div className="flex flex-wrap gap-2">
                {['Sérum Niacinamide', 'Céramides', 'Rouge à lèvres nude', 'Écran solaire SPF50', 'Argan', 'Coffret cadeau'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="text-xs bg-ivory hover:bg-rose-100 text-deep px-3 py-1.5 rounded-full border border-rose-200 transition cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-mutedText uppercase tracking-wider mb-2">
                {results.length} résultat{results.length > 1 ? 's' : ''} trouvé{results.length > 1 ? 's' : ''}
              </p>
              {results.map(prod => (
                <div
                  key={prod.id}
                  onClick={() => handleSelectProduct(prod.slug)}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-ivory cursor-pointer transition border border-transparent hover:border-rose-200"
                >
                  <img
                    src={prod.images[0]?.url}
                    alt={prod.nameFr}
                    className="w-12 h-12 rounded-lg object-cover bg-rose-50 border border-rose-100"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-rose-700 uppercase tracking-wider">{prod.brand}</p>
                    <h4 className="text-sm font-semibold text-deep truncate">{prod.nameFr}</h4>
                    <p className="text-xs text-rose-900 font-bold">{formatPriceDZD(prod.price)}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-mutedText" />
                </div>
              ))}
              <div className="pt-2 text-center">
                <button
                  onClick={() => {
                    onClose();
                    navigate(`/shop?search=${encodeURIComponent(query)}`);
                  }}
                  className="text-xs text-rose-700 hover:text-rose-900 font-semibold underline cursor-pointer"
                >
                  Voir tous les résultats pour « {query} » →
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-deep font-medium">Aucun produit ne correspond à votre recherche.</p>
              <p className="text-xs text-mutedText mt-1">Essayez avec un mot-clé plus général (ex. sérum, hydratant, parfum).</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
