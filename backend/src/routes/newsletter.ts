import { Router } from 'express';
import { z } from 'zod';
import { db } from '../lib/db';

const r = Router();
const schema = z.object({
  email: z.string().trim().email().max(254),
});

r.post('/', async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Enter a valid email address.' });
  }

  try {
    const email = parsed.data.email.toLowerCase();
    await db.newsletterSubscriber.upsert({
      where: { email },
      create: { email },
      update: {},
    });
    return res.status(200).json({ ok: true, message: 'You are on the list.' });
  } catch (error) {
    console.error('Newsletter subscription failed:', error);
    return res.status(503).json({ message: 'Newsletter signup is temporarily unavailable.' });
  }
});

export default r;
