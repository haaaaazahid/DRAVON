import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import auth from './routes/auth';
import products from './routes/products';
import admin from './routes/admin';
import media from './routes/media';
import payments from './routes/payments';

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://dravon-six.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001',
].filter(Boolean) as string[];

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server / tools without an Origin header
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn(`CORS blocked origin: ${origin}`);

      return callback(
        new Error(`CORS blocked origin: ${origin}`)
      );
    },
    credentials: true,
  })
);

app.use(cookieParser());

app.use(
  express.json({
    limit: '2mb',
  })
);

app.use(morgan('tiny'));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'dravon-api',
    time: new Date().toISOString(),
  });
});

app.use('/api/auth', auth);
app.use('/api/products', products);
app.use('/api/admin', admin);
app.use('/api/media', media);
app.use('/api/payments', payments);

app.use(
  (err: any, _req: any, res: any, _next: any) => {
    console.error(err);

    res.status(500).json({
      message:
        process.env.NODE_ENV === 'production'
          ? 'Internal server error'
          : err.message,
    });
  }
);

const port = Number(process.env.PORT || 4000);

app.listen(port, () => {
  console.log(`DRAVON API running on ${port}`);
});