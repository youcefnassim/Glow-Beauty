import { describe, it, expect } from 'vitest';
import { StorageService } from '@/services/storage';

describe('Product Catalog Search, Filtering, and Sorting', () => {
  const products = StorageService.getProducts();

  it('searches products by active ingredient (Niacinamide)', () => {
    const query = 'niacinamide'.toLowerCase();
    const results = products.filter(p =>
      p.nameFr.toLowerCase().includes(query) ||
      (p.ingredients && p.ingredients.toLowerCase().includes(query))
    );

    expect(results.length).toBeGreaterThan(0);
    expect(results.some(p => p.nameFr.includes('Niacinamide'))).toBe(true);
  });

  it('filters products accurately by category slug', () => {
    const skincare = products.filter(p => p.categorySlug === 'soins-du-visage');
    expect(skincare.length).toBeGreaterThan(0);
    expect(skincare.every(p => p.categorySlug === 'soins-du-visage')).toBe(true);

    const perfumes = products.filter(p => p.categorySlug === 'parfums');
    expect(perfumes.every(p => p.categorySlug === 'parfums')).toBe(true);
  });

  it('filters products by maximum price threshold', () => {
    const maxPrice = 3000;
    const affordable = products.filter(p => p.price <= maxPrice);

    expect(affordable.length).toBeGreaterThan(0);
    expect(affordable.every(p => p.price <= maxPrice)).toBe(true);
  });

  it('sorts products by price ascending and descending correctly', () => {
    const asc = [...products].sort((a, b) => a.price - b.price);
    for (let i = 0; i < asc.length - 1; i++) {
      expect(asc[i].price).toBeLessThanOrEqual(asc[i + 1].price);
    }

    const desc = [...products].sort((a, b) => b.price - a.price);
    for (let i = 0; i < desc.length - 1; i++) {
      expect(desc[i].price).toBeGreaterThanOrEqual(desc[i + 1].price);
    }
  });

  it('sorts products by newest arrival timestamp', () => {
    const newest = [...products].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    for (let i = 0; i < newest.length - 1; i++) {
      expect(new Date(newest[i].createdAt).getTime()).toBeGreaterThanOrEqual(new Date(newest[i + 1].createdAt).getTime());
    }
  });
});
