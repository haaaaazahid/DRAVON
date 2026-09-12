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

r.post('/', adminAuth, async (req: AdminRequest, res) => {
  const parsed = body.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message:
        parsed.error.issues[0]?.message || 'Invalid product',
    });
  }

  const x = parsed.data;

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

  const x = parsed.data;

  try {
    const updated = await db.$transaction(async (tx) => {
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
          name: x.name,
          slug: x.slug,
          description: x.description,
          price: x.price,
          mrp: x.mrp,

          published: x.published,
          featured: x.featured,

          fabric: x.fabric,
          gsm: x.gsm,
          fit: x.fit,

          careInstructions: x.careInstructions,

          seoTitle: x.seoTitle,
          seoDescription: x.seoDescription,
        },
      });

      if (x.images) {
        await tx.productImage.deleteMany({
          where: {
            productId: u.id,
          },
        });

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

      if (x.variants) {
        await tx.productVariant.deleteMany({
          where: {
            productId: u.id,
          },
        });

        await tx.productVariant.createMany({
          data: x.variants.map((v) => ({
            productId: u.id,
            sku: v.sku,
            color: v.color,
            size: v.size,
            stock: v.stock,
          })),
        });
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
    });

    res.json(updated);
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return res.status(409).json({
        message: 'Slug or SKU already exists.',
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
  }
);

export default r;