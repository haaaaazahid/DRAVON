import { products as fallback } from './catalog';

const API =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://dravon-api.onrender.com/api';

function normalize(p: any) {
  return {
    ...p,
    image:
      p.image ||
      p.images?.[0]?.url ||
      fallback.find((x) => x.slug === p.slug)?.image ||
      '',
    gallery:
      p.gallery ||
      p.images?.slice(1)?.map((x: any) => x.url) ||
      [],
    colors:
      p.colors ||
      Array.from(
        new Set((p.variants || []).map((v: any) => v.color))
      ).filter(Boolean),
    sizes:
      p.sizes ||
      Array.from(
        new Set((p.variants || []).map((v: any) => v.size))
      ).filter(Boolean),
    tag: p.tag || null,
  };
}

export async function getProducts() {
  try {
    const r = await fetch(`${API}/products?published=true`, {
      next: { revalidate: 30 },
    });

    if (!r.ok) {
      throw new Error(`Products API returned ${r.status}`);
    }

    const data = await r.json();

    return Array.isArray(data) ? data.map(normalize) : fallback;
  } catch {
    return fallback;
  }
}

export async function getProduct(slug: string) {
  const aliases: Record<string, string> = {
    performance: 'performance-tank',
    joggers: 'joggers',
    hoodie: 'street-hoodie',
    shorts: 'training-shorts',
    'white-tshirt': 'white-tee',
    'black-tshirt': 'black-tee',
  };

  const resolvedSlug = aliases[slug] || slug;

  try {
    const r = await fetch(`${API}/products/${resolvedSlug}`, {
      next: { revalidate: 30 },
    });

    if (!r.ok) {
      throw new Error(`Product API returned ${r.status}`);
    }

    return normalize(await r.json());
  } catch {
    return fallback.find((x) => x.slug === resolvedSlug);
  }
}

export { API };