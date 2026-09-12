import { Router } from 'express';
import { db } from '../lib/db';
import { adminAuth, AdminRequest, requireRole } from '../middleware/auth';
import { z } from 'zod';

const r = Router();

r.get('/', async (req, res) => {
  const q = String(req.query.q || '');
  const published = req.query.published === 'true';

  const data = await db.product.findMany({
    where: {
      ...(published ? { published: true } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: 'insensitive' } },
              { slug: { contains: q, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    include: {
      variants: true,
      images: {
        orderBy: { position: 'asc' },
      },
      collections: {
        include: {
          collection: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  res.json(data);
});

r.get('/:slug', async (req, res) => {
  const slug = String(req.params.slug);

  const p = await db.product.findUnique({
    where: {
      slug,
    },
    include: {
      variants: true,
      images: {
        orderBy: { position: 'asc' },
      },
      collections: {
        include: {
          collection: true,
        },
      },
      reviews: {
        where: {
          approved: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!p) {
    return res.status(404).json({
      message: 'Not found',
    });
  }

  res.json(p);
});

const variant = z.object({
  sku: z.string().min(1),
  color: z.string().min(1),
  size: z.string().min(1),
  stock: z.number().int().nonnegative(),
});

const image = z.object({
  url: z.string().url(),
  altText: z.string().optional(),
  type: z.string().optional(),
  publicId: z.string().optional(),
});

const body = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  price: z.number().nonnegative(),
  mrp: z.number().nonnegative().optional(),

  published: z.boolean().optional(),
  featured: z.boolean().optional(),

  fabric: z.string().optional(),
  gsm: z.string().optional(),
  fit: z.string().optional(),

  careInstructions: z.string().optional(),

  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),

  images: z.array(image).optional(),
  variants: z.array(variant).optional(),
});

type ProductUpdate = Partial<z.infer<typeof body>>;

/**
 * Checks whether the update contains duplicate SKUs.
 */
function findDuplicateSku(variants?: z.infer<typeof variant>[]) {
  if (!variants) return null;

  const seen = new Set<string>();

  for (const v of variants) {
    const sku = v.sku.trim().toLowerCase();

    if (seen.has(sku)) {
      return v.sku;
    }

    seen.add(sku);
  }

  return null;
}

/**
 * Checks whether any SKU belongs to another product.
 */
async function findConflictingSku(
  productId: string,
  variants?: z.infer<typeof variant>[],
) {
  if (!variants?.length) return null;

  const skus = variants.map((v) => v.sku.trim());

  const existing = await db.productVariant.findFirst({
    where: {
      sku: {
        in: skus,
      },
      productId: {
        not: productId,
      },
    },
    select: {
      sku: true,
    },
  });

  return existing?.sku || null;
}

/**
 * Performs the actual product update.
 *
 * The transaction uses Serializable isolation so two simultaneous
 * admin saves cannot corrupt the variant replacement operation.
 */
async function updateProduct(
  productId: string,
  x: ProductUpdate,
  req: AdminRequest,
) {
  return db.$transaction(
    async (tx) => {
      const before = await tx.product.findUnique({
        where: {
          id: productId,
        },
        include: {
          variants: true,
        },
      });

      if (!before) {
        throw new Error('Product not found');
      }

      const u = await tx.product.update({
        where: {
          id: productId,
        },

        data: {
          ...(x.name !== undefined ? { name: x.name } : {}),
          ...(x.slug !== undefined ? { slug: x.slug } : {}),
          ...(x.description !== undefined
            ? { description: x.description }
            : {}),
          ...(x.price !== undefined ? { price: x.price } : {}),
          ...(x.mrp !== undefined ? { mrp: x.mrp } : {}),

          ...(x.published !== undefined
            ? { published: x.published }
            : {}),
          ...(x.featured !== undefined
            ? { featured: x.featured }
            : {}),

          ...(x.fabric !== undefined ? { fabric: x.fabric } : {}),
          ...(x.gsm !== undefined ? { gsm: x.gsm } : {}),
          ...(x.fit !== undefined ? { fit: x.fit } : {}),

          ...(x.careInstructions !== undefined
            ? { careInstructions: x.careInstructions }
            : {}),

          ...(x.seoTitle !== undefined
            ? { seoTitle: x.seoTitle }
            : {}),
          ...(x.seoDescription !== undefined
            ? { seoDescription: x.seoDescription }
            : {}),
        },
      });

      /**
       * Replace images only when images were included in the request.
       */
      if (x.images !== undefined) {
        await tx.productImage.deleteMany({
          where: {
            productId: u.id,
          },
        });

        if (x.images.length > 0) {
          await tx.productImage.createMany({
            data: x.images.map((i, n) => ({
              productId: u.id,
              url: i.url,
              altText: i.altText,
              type: i.type || 'image',
              publicId: i.publicId,
              position: n,
            })),
          });
        }
      }

      /**
       * Replace variants only when variants were included.
       */
      if (x.variants !== undefined) {
        await tx.productVariant.deleteMany({
          where: {
            productId: u.id,
          },
        });

        if (x.variants.length > 0) {
          await tx.productVariant.createMany({
            data: x.variants.map((v) => ({
              productId: u.id,
              sku: v.sku.trim(),
              color: v.color.trim(),
              size: v.size.trim(),
              stock: v.stock,
            })),
          });
        }
      }

      if (req.admin) {
        await tx.auditLog.create({
          data: {
            adminId: req.admin.id,
            action: 'UPDATE',
            entity: 'Product',
            entityId: u.id,
            metadata: {
              name: u.name,
            },
          },
        });
      }

      return tx.product.findUnique({
        where: {
          id: u.id,
        },

        include: {
          images: {
            orderBy: {
              position: 'asc',
            },
          },
          variants: true,
        },
      });
    },
    {
      isolationLevel: 'Serializable',
    },
  );
}

/**
 * Retry a serializable transaction if PostgreSQL reports
 * a serialization conflict.
 */
async function updateProductWithRetry(
  productId: string,
  x: ProductUpdate,
  req: AdminRequest,
  attempts = 3,
) {
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await updateProduct(productId, x, req);
    } catch (error: any) {
      lastError = error;

      if (error?.code !== 'P2034' || attempt === attempts) {
        throw error;
      }

      await new Promise((resolve) =>
        setTimeout(resolve, 100 * attempt),
      );
    }
  }

  throw lastError;
}

r.post('/', adminAuth, async (req: AdminRequest, res) => {
  const parsed = body.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message:
        parsed.error.issues[0]?.message || 'Invalid product',
    });
  }

  const x = parsed.data;

  const duplicateSku = findDuplicateSku(x.variants);

  if (duplicateSku) {
    return res.status(409).json({
      message: `Duplicate SKU "${duplicateSku}" in this product.`,
    });
  }

  try {
    const created = await db.product.create({
      data: {
        name: x.name,
        slug: x.slug,
        description: x.description,
        price: x.price,
        mrp: x.mrp || 0,

        published: x.published ?? false,
        featured: x.featured ?? false,

        fabric: x.fabric,
        gsm: x.gsm,
        fit: x.fit,

        careInstructions: x.careInstructions,

        seoTitle: x.seoTitle,
        seoDescription: x.seoDescription,

        images: {
          create: (x.images || []).map((i, n) => ({
            ...i,
            position: n,
          })),
        },

        variants: {
          create: x.variants || [],
        },
      },

      include: {
        images: true,
        variants: true,
      },
    });

    res.status(201).json(created);
  } catch (error: any) {
    if (error?.code === 'P2002') {
      const target = Array.isArray(error?.meta?.target)
        ? error.meta.target.join(', ')
        : String(error?.meta?.target || '');

      if (target.toLowerCase().includes('slug')) {
        return res.status(409).json({
          message: `Slug "${x.slug}" already exists.`,
        });
      }

      if (target.toLowerCase().includes('sku')) {
        return res.status(409).json({
          message: 'One of the product SKUs already exists.',
        });
      }

      return res.status(409).json({
        message: 'A unique product value already exists.',
      });
    }

    throw error;
  }
});

r.put('/:id', adminAuth, async (req: AdminRequest, res) => {
  const productId = String(req.params.id);

  const parsed = body.partial().safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message:
        parsed.error.issues[0]?.message || 'Invalid product',
    });
  }

  const x: ProductUpdate = parsed.data;

  try {
    /**
     * Check duplicate SKUs in the request itself.
     */
    const duplicateSku = findDuplicateSku(x.variants);

    if (duplicateSku) {
      return res.status(409).json({
        message: `Duplicate SKU "${duplicateSku}" in this product.`,
      });
    }

    /**
     * Check SKU conflicts against other products.
     */
    const conflictingSku = await findConflictingSku(
      productId,
      x.variants,
    );

    if (conflictingSku) {
      return res.status(409).json({
        message: `SKU "${conflictingSku}" is already used by another product.`,
      });
    }

    /**
     * Check slug conflict before entering the transaction.
     */
    if (x.slug !== undefined) {
      const existingSlug = await db.product.findFirst({
        where: {
          slug: x.slug,
          id: {
            not: productId,
          },
        },
        select: {
          id: true,
        },
      });

      if (existingSlug) {
        return res.status(409).json({
          message: `Slug "${x.slug}" is already used by another product.`,
        });
      }
    }

    const updated = await updateProductWithRetry(
      productId,
      x,
      req,
    );

    res.json(updated);
  } catch (error: any) {
    if (error?.code === 'P2002') {
      const target = Array.isArray(error?.meta?.target)
        ? error.meta.target.join(', ')
        : String(error?.meta?.target || '');

      if (target.toLowerCase().includes('slug')) {
        return res.status(409).json({
          message: `Slug "${x.slug || ''}" already exists.`,
        });
      }

      if (target.toLowerCase().includes('sku')) {
        return res.status(409).json({
          message: 'One of the product SKUs already exists.',
        });
      }

      return res.status(409).json({
        message: 'A unique product value already exists.',
      });
    }

    if (error?.code === 'P2034') {
      return res.status(409).json({
        message:
          'Another admin update happened at the same time. Please save again.',
      });
    }

    if (error?.message === 'Product not found') {
      return res.status(404).json({
        message: error.message,
      });
    }

    throw error;
  }
});

r.delete(
  '/:id',
  adminAuth,
  requireRole('SUPER_ADMIN', 'ADMIN'),
  async (req: AdminRequest, res) => {
    const productId = String(req.params.id);

    const product = await db.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
      });
    }

    try {
      await db.$transaction(async (tx) => {
        await tx.product.delete({
          where: {
            id: productId,
          },
        });

        if (req.admin) {
          await tx.auditLog.create({
            data: {
              adminId: req.admin.id,
              action: 'DELETE',
              entity: 'Product',
              entityId: product.id,
              metadata: {
                name: product.name,
              },
            },
          });
        }
      });

      res.status(204).end();
    } catch (error: any) {
      if (error?.code === 'P2003') {
        return res.status(409).json({
          message:
            'This product has order history and cannot be permanently deleted. Unpublish it instead.',
        });
      }

      throw error;
    }
  },
);

export default r;