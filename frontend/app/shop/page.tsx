'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

import { products as fallback } from '@/lib/catalog';
import { ProductCard } from '@/components/product-card';

/*
|--------------------------------------------------------------------------
| API
|--------------------------------------------------------------------------
| All frontend API requests go through the Next.js same-origin proxy.
|
| Browser:
|   /api/products
|
| Next.js proxy:
|   https://dravon-api.onrender.com/api/products
|
| Do NOT use localhost:4000 here.
|--------------------------------------------------------------------------
*/

const API = '/api';

/*
|--------------------------------------------------------------------------
| Product normalization
|--------------------------------------------------------------------------
*/

function normalize(product: any) {
  const variants = Array.isArray(product?.variants)
    ? product.variants
    : [];

  const images = Array.isArray(product?.images)
    ? product.images
    : [];

  return {
    ...product,

    image: images[0]?.url || product?.image || '',

    gallery: images
      .slice(1)
      .map((image: any) => image?.url)
      .filter(Boolean),

    colors: Array.from(
      new Set(
        variants
          .map((variant: any) => variant?.color)
          .filter(Boolean)
      )
    ),

    sizes: Array.from(
      new Set(
        variants
          .map((variant: any) => variant?.size)
          .filter(Boolean)
      )
    ),

    category: product?.category || 'APPAREL',
  };
}

/*
|--------------------------------------------------------------------------
| Shop Page
|--------------------------------------------------------------------------
*/

export default function Shop() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('ALL');

  const [items, setItems] = useState<any[]>(
    Array.isArray(fallback) ? fallback : []
  );

  const [sort, setSort] = useState('featured');

  /*
  |--------------------------------------------------------------------------
  | Fetch products
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        const response = await fetch(
          `${API}/products?published=true`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
            },
            cache: 'no-store',
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to load products: ${response.status}`
          );
        }

        const data = await response.json();

        const products = Array.isArray(data)
          ? data
          : Array.isArray(data?.products)
            ? data.products
            : [];

        if (isMounted) {
          setItems(products.map(normalize));
        }
      } catch (error) {
        /*
         * Keep catalog fallback if the API is unavailable.
         * This prevents the shop from becoming completely blank.
         */
        console.error('DRAVON product fetch failed:', error);
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Categories
  |--------------------------------------------------------------------------
  */

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(
        items.map(
          (product) => product?.category || 'APPAREL'
        )
      )
    );

    return ['ALL', ...uniqueCategories];
  }, [items]);

  /*
  |--------------------------------------------------------------------------
  | Filter + Search + Sort
  |--------------------------------------------------------------------------
  */

  const filteredProducts = useMemo(() => {
    const search = query.trim().toLowerCase();

    const result = items.filter((product) => {
      const productName = String(
        product?.name || ''
      ).toLowerCase();

      const productCategory =
        product?.category || 'APPAREL';

      const matchesCategory =
        category === 'ALL' ||
        productCategory === category;

      const matchesSearch =
        !search ||
        productName.includes(search);

      return matchesCategory && matchesSearch;
    });

    if (sort === 'low') {
      result.sort(
        (a, b) =>
          Number(a?.price || 0) -
          Number(b?.price || 0)
      );
    }

    if (sort === 'high') {
      result.sort(
        (a, b) =>
          Number(b?.price || 0) -
          Number(a?.price || 0)
      );
    }

    return result;
  }, [items, query, category, sort]);

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <main className="container py-10 md:py-14">

      {/* ================================================================
          HEADER
      ================================================================ */}

      <section className="border-b border-[var(--line)] pb-8">

        <div className="eyebrow">
          <span className="redline" />
          SHOP DRAVON
        </div>

        <div className="mt-3 flex flex-col justify-between gap-6 md:flex-row md:items-end">

          {/* Heading */}

          <div>
            <h1 className="text-5xl font-black uppercase tracking-[-0.07em] md:text-7xl">
              THE STORE.
            </h1>

            <p className="mt-3 max-w-md text-xs leading-5 text-[var(--muted)]">
              Performance essentials for training,
              movement and the street.
            </p>
          </div>

          {/* Search */}

          <div className="flex w-full border border-[var(--line)] md:w-80">

            <Search
              size={15}
              className="m-3 shrink-0 text-[var(--muted)]"
            />

            <input
              type="search"
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
              placeholder="SEARCH PRODUCTS"
              aria-label="Search products"
              className="min-w-0 flex-1 bg-transparent px-0 py-3 text-[10px] tracking-[0.1em] outline-none placeholder:text-[var(--muted)]"
            />

          </div>

        </div>

      </section>

      {/* ================================================================
          FILTER BAR
      ================================================================ */}

      <section className="flex flex-col gap-4 border-b border-[var(--line)] py-5 md:flex-row md:items-center">

        {/* Categories */}

        <div className="flex gap-2 overflow-x-auto pb-1">

          {categories.map((itemCategory) => (
            <button
              key={itemCategory}
              type="button"
              onClick={() =>
                setCategory(itemCategory)
              }
              className={`
                whitespace-nowrap
                border
                border-[var(--line)]
                px-4
                py-2
                text-[9px]
                font-black
                tracking-[0.14em]
                transition
                ${
                  category === itemCategory
                    ? 'bg-[var(--fg)] text-[var(--bg)]'
                    : 'hover:bg-[var(--surface)]'
                }
              `}
            >
              {itemCategory}
            </button>
          ))}

        </div>

        {/* Sort */}

        <div className="ml-auto flex shrink-0 items-center gap-2">

          <SlidersHorizontal
            size={13}
            className="text-[var(--muted)]"
          />

          <select
            value={sort}
            onChange={(event) =>
              setSort(event.target.value)
            }
            aria-label="Sort products"
            className="border border-[var(--line)] bg-transparent px-3 py-2 text-[9px] font-bold tracking-[0.12em] outline-none"
          >
            <option value="featured">
              SORT: FEATURED
            </option>

            <option value="low">
              PRICE: LOW → HIGH
            </option>

            <option value="high">
              PRICE: HIGH → LOW
            </option>
          </select>

        </div>

      </section>

      {/* ================================================================
          PRODUCT COUNT / INFO
      ================================================================ */}

      <section className="flex items-center justify-between gap-4 py-5">

        <div className="text-[9px] font-bold tracking-[0.14em] text-[var(--muted)]">
          {filteredProducts.length} PRODUCTS
        </div>

        <div className="hidden text-right text-[8px] tracking-[0.12em] text-[var(--muted)] sm:block">
          SIZE AVAILABILITY SHOWN ON PRODUCT PAGE
        </div>

      </section>

      {/* ================================================================
          PRODUCT GRID
      ================================================================ */}

      {filteredProducts.length > 0 ? (

        <div className="grid grid-cols-2 gap-x-3 gap-y-12 md:grid-cols-4 lg:grid-cols-5">

          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id || product.slug}
              p={product}
            />
          ))}

        </div>

      ) : (

        /* ==============================================================
           EMPTY STATE
        ============================================================== */

        <div className="flex min-h-[300px] flex-col items-center justify-center border border-[var(--line)] px-6 text-center">

          <div className="text-xs font-black tracking-[0.16em]">
            NO PRODUCTS FOUND
          </div>

          <p className="mt-2 max-w-sm text-[10px] leading-5 text-[var(--muted)]">
            Try another search term or select a
            different category.
          </p>

          {(query || category !== 'ALL') && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setCategory('ALL');
              }}
              className="mt-5 border border-[var(--line)] px-5 py-3 text-[9px] font-black tracking-[0.14em] transition hover:bg-[var(--fg)] hover:text-[var(--bg)]"
            >
              CLEAR FILTERS
            </button>
          )}

        </div>

      )}

    </main>
  );
}