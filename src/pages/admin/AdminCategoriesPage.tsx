import React, { useState } from 'react';
import { StorageService } from '@/services/storage';
import { Category } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { Plus, Save, Edit2 } from 'lucide-react';
import { ImageUploadField } from '@/components/admin/ImageUploadField';

export const AdminCategoriesPage: React.FC = () => {
  const { t, getCategoryName, language } = useLanguage();
  const [categories, setCategories] = useState<Category[]>(() => StorageService.getCategories());
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [nameFr, setNameFr] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleEdit = (cat: Category) => {
    setEditingCategory(cat);
    setNameFr(cat.nameFr);
    setNameAr(cat.nameAr);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setImageUrl(cat.imageUrl || '');
  };

  const handleCreateNew = () => {
    setEditingCategory({
      id: `cat-${Date.now()}`,
      slug: '',
      nameFr: '',
      nameAr: '',
      nameEn: '',
      productCount: 0,
    });
    setNameFr('');
    setNameAr('');
    setSlug('');
    setDescription('');
    setImageUrl('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameFr.trim()) return;

    const autoSlug = slug.trim() || nameFr.toLowerCase().trim().replace(/[\s_-]+/g, '-');
    const updated: Category = {
      id: editingCategory ? editingCategory.id : `cat-${Date.now()}`,
      slug: autoSlug,
      nameFr: nameFr.trim(),
      nameAr: nameAr.trim(),
      nameEn: nameFr.trim(),
      description: description.trim(),
      imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
      productCount: editingCategory?.productCount || 0,
    };

    StorageService.saveCategory(updated);
    setCategories(StorageService.getCategories());
    setEditingCategory(null);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-deep">{t('admin.categories.pageTitle')}</h1>
          <p className="text-xs text-mutedText mt-1">
            {t('admin.categories.pageSubtitle')}
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="bg-deep hover:bg-rose-950 text-ivory text-xs font-semibold px-5 py-2.5 rounded-xl transition shadow-sm flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t('admin.categories.create')}</span>
        </button>
      </div>

      {/* Editor Modal / Panel */}
      {editingCategory && (
        <div className="bg-white p-6 rounded-3xl border border-rose-200 shadow-luxury space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-rose-100">
            <h3 className="font-serif text-base font-bold text-deep">
              {editingCategory.slug ? t('admin.categories.edit') : t('admin.categories.create')}
            </h3>
            <button onClick={() => setEditingCategory(null)} className="text-xs text-mutedText hover:text-deep cursor-pointer">
              {t('admin.categories.cancel')}
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-deep block mb-1">{t('admin.categories.nameFr')}</label>
                <input
                  type="text"
                  required
                  value={nameFr}
                  onChange={(e) => setNameFr(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50"
                />
              </div>
              <div>
                <label className="font-semibold text-deep block mb-1">{t('admin.categories.nameAr')}</label>
                <input
                  type="text"
                  dir="rtl"
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-deep block mb-1">{t('admin.categories.slug')}</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="ex: soins-visage"
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 font-mono"
                />
              </div>
              <div>
                <label className="font-semibold text-deep block mb-1">{t('admin.categories.description')}</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={language === 'ar' ? 'وصف مختصر للقسم...' : 'Description courte du rayon...'}
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50"
                />
              </div>
            </div>

            <ImageUploadField
              label={t('admin.categories.imageUrl')}
              value={imageUrl}
              onChange={setImageUrl}
              aspectRatio="video"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="px-4 py-2 rounded-xl border border-stone-300 font-semibold cursor-pointer"
              >
                {t('admin.categories.cancel')}
              </button>
              <button
                type="submit"
                className="bg-deep text-ivory font-semibold px-6 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{t('admin.categories.save')}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(cat => {
          const count = StorageService.getProducts().filter(p => p.categorySlug === cat.slug).length;
          return (
            <div key={cat.id} className="bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-xs flex flex-col justify-between">
              <div className="aspect-[16/9] relative overflow-hidden bg-stone-100">
                <img src={cat.imageUrl} alt={getCategoryName(cat)} className="w-full h-full object-cover" />
                <span className="absolute top-3 start-3 bg-deep/80 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                  {cat.slug}
                </span>
              </div>

              <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-serif text-base font-bold text-deep">{cat.nameFr}</h3>
                    <span className="text-xs text-rose-800 font-semibold font-serif" dir="rtl">{cat.nameAr}</span>
                  </div>
                  <p className="text-xs text-mutedText mt-1 line-clamp-2">{cat.description}</p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-mutedText">
                    {t('admin.categories.count', { count })}
                  </span>
                  <button
                    onClick={() => handleEdit(cat)}
                    className="inline-flex items-center gap-1 text-deep hover:text-rose-700 font-semibold cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>{t('admin.products.edit')}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
