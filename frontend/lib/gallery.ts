export const CORE_ANGLES = ['front', 'back', 'left', 'right'] as const;
export const EXTRA_ANGLES = ['detail', 'lifestyle', 'other'] as const;

export type Angle = (typeof CORE_ANGLES)[number] | (typeof EXTRA_ANGLES)[number];

export const ANGLE_LABEL: Record<Angle, string> = {
  front: 'FRONT',
  back: 'BACK',
  left: 'LEFT SIDE',
  right: 'RIGHT SIDE',
  detail: 'DETAIL',
  lifestyle: 'LIFESTYLE',
  other: 'OTHER',
};

export function isAngle(value: unknown): value is Angle {
  return typeof value === 'string' && value in ANGLE_LABEL;
}

/** Image as held in the admin editor (client-only fields: key, uploading). */
export type GalleryImage = {
  key: string;
  url: string;
  altText?: string;
  angle?: Angle | null;
  publicId?: string;
  uploading?: boolean;
};

/** Image as rendered by the storefront slider. */
export type Slide = { url: string; alt: string; angle: Angle | null };

/**
 * Builds the slider images for one product. Uses the product's own images
 * (already ordered by position, main image first); falls back to the
 * single image/gallery fields used by the static catalog.
 */
export function getSlides(p: any): Slide[] {
  const name = String(p?.name || 'DRAVON product');

  if (Array.isArray(p?.images) && p.images.length > 0) {
    return p.images
      .filter((x: any) => x?.url)
      .map((x: any) => ({
        url: String(x.url),
        alt: x.altText || name,
        angle: isAngle(x.angle) ? x.angle : null,
      }));
  }

  return [p?.image, ...(p?.gallery || [])]
    .filter(Boolean)
    .map((url: string) => ({ url, alt: name, angle: null }));
}
