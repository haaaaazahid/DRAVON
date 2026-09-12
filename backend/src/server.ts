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

/*
|--------------------------------------------------------------------------
| CORS
|--------------------------------------------------------------------------
| Production frontend:
| https://dravon-six.vercel.app
|
| You can also provide FRONTEND_URL in Render environment variables.
|--------------------------------------------------------------------------
*/

const allowedOrigins = [
  'https://dravon-six.vercel.app',
  process.env.FRONTEND_URL,

  // Local development
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
      // Allow requests without Origin header
      // (health checks, server-to-server requests, etc.)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn(`CORS blocked origin: ${origin}`);

      return callback(new Error(`CORS blocked origin: ${origin}`));
    },

    credentials: true,

    methods: [
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
      'OPTIONS',
    ],

    allowedHeaders: [
      'Content-Type',
      'Authorization',
    ],
  })
);

/*
|--------------------------------------------------------------------------
| Middleware
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/

app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'dravon-api',
    time: new Date().toISOString(),
  });
});

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

app.use('/api/auth', auth);
app.use('/api/products', products);
app.use('/api/admin', admin);
app.use('/api/media', media);
app.use('/api/payments', payments);

/*
|--------------------------------------------------------------------------
| Root Route
|--------------------------------------------------------------------------
*/

app.get('/', (_req, res) => {
  res.json({
    ok: true,
    service: 'DRAVON API',
    message: 'API is running',
  });
});

/*
|--------------------------------------------------------------------------
| Error Handler
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| Server
|--------------------------------------------------------------------------
*/

const port = Number(process.env.PORT || 4000);

app.listen(port, () => {
  console.log(`DRAVON API running on ${port}`);
});