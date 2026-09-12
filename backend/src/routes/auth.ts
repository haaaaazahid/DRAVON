import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../lib/db';
import { z } from 'zod';
import { adminAuth, AdminRequest } from '../middleware/auth';

const r = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

/**
 * Admin authentication cookie.
 *
 * Production:
 * - httpOnly prevents JavaScript access
 * - secure requires HTTPS
 * - sameSite:none allows the cookie to be sent
 *   between Vercel frontend and Render backend
 */
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite:
    process.env.NODE_ENV === 'production'
      ? ('none' as const)
      : ('lax' as const),
  maxAge: 8 * 60 * 60 * 1000,
  path: '/',
};

r.post('/login', async (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: 'Invalid credentials',
      });
    }

    const email = parsed.data.email.trim().toLowerCase();

    const admin = await db.admin.findUnique({
      where: {
        email,
      },
    });

    if (!admin) {
      return res.status(401).json({
        message: 'Invalid admin email or password.',
      });
    }

    const passwordValid = await bcrypt.compare(
      parsed.data.password,
      admin.passwordHash
    );

    if (!passwordValid) {
      return res.status(401).json({
        message: 'Invalid admin email or password.',
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not configured.');
      return res.status(500).json({
        message: 'Server authentication configuration error.',
      });
    }

    const token = jwt.sign(
      {
        id: admin.id,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '8h',
      }
    );

    res.cookie('dravon_admin', token, cookieOptions);

    console.log(`Admin login successful: ${admin.email}`);

    return res.status(200).json({
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);

    return res.status(500).json({
      message: 'Login failed.',
    });
  }
});

r.post('/logout', adminAuth, (_req, res) => {
  res.clearCookie('dravon_admin', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite:
      process.env.NODE_ENV === 'production'
        ? ('none' as const)
        : ('lax' as const),
    path: '/',
  });

  return res.status(200).json({
    ok: true,
  });
});

r.get('/me', adminAuth, async (req: AdminRequest, res) => {
  try {
    const admin = await db.admin.findUnique({
      where: {
        id: req.admin!.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!admin) {
      return res.status(401).json({
        message: 'Admin account not found.',
      });
    }

    return res.status(200).json(admin);
  } catch (error) {
    console.error('Admin session error:', error);

    return res.status(500).json({
      message: 'Could not verify admin session.',
    });
  }
});

export default r;