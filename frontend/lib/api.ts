const API =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://dravon-api.onrender.com/api';

function normalize(p: any) {
  const images = Array.isArray(p?.images) ? p.images : [];

  return {
    ...p,
    image: p?.image || images[0]?.url || '',
    gallery: p?.gallery || images.slice(1).map((x: any) => x?.url).filter(Boolean),
    colors:
      p?.colors ||
      Array.from(new Set((p?.variants || []).map((v: any) => v.color))).filter(Boolean),
    sizes:
      p?.sizes ||
      Array.from(new Set((p?.variants || []).map((v: any) => v.size))).filter(Boolean),
    tag: p?.tag || null,
  };
}

/** Published products from the database. Returns [] if the API is unreachable (never fake products). */
export async function getProducts() {
  try {
    const r = await fetch(`${API}/products?published=true`, {
      next: { revalidate: 30 },
    });

    if (!r.ok) {
      throw new Error(`Products API returned ${r.status}`);
    }

    const data = await r.json();
    const list = Array.isArray(data) ? data : Array.isArray(data?.products) ? data.products : [];

    return list.map(normalize);
  } catch (error) {
    console.error('DRAVON: could not load products', error);
    return [];
  }
}

/**
 * One product by its real slug.
 * - 404 from the API  -> null (the page shows "not found")
 * - any other failure -> throws, so a temporary API outage is not cached as a 404
 */
export async function getProduct(slug: string) {
  const r = await fetch(`${API}/products/${encodeURIComponent(slug)}`, {
    next: { revalidate: 30 },
  });

  if (r.status === 404) return null;

  if (!r.ok) {
    throw new Error(`Product API returned ${r.status}`);
  }

  return normalize(await r.json());
}

export { API };
