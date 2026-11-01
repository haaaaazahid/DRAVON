# DRAVON

> DEFY GRAVITY  
> STRENGTH · DISCIPLINE · EVOLVE

DRAVON is a performance and streetwear brand built around calisthenics, fitness, athletic movement and street culture.

## Tech Stack

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- Framer Motion

### Backend
- Node.js
- Express
- TypeScript
- Prisma
- PostgreSQL

### Infrastructure
- Neon PostgreSQL
- Cloudinary for media storage
- Razorpay for payments
- Vercel / production hosting

## Project Structure

```text
dravon-production-final/
├── frontend/
└── backend/
## Local setup

Use Node.js 20.9+ (Node.js 22 LTS recommended).

1. Copy `frontend/.env.example` to `frontend/.env.local`.
2. Copy `backend/.env.example` to `backend/.env`.
3. Set `DATABASE_URL` to a reachable PostgreSQL database and set a strong `JWT_SECRET`.
4. Install dependencies in each workspace:

   ```bash
   npm install
   npm --prefix frontend install
   npm --prefix backend install
   ```

5. Generate the Prisma client and apply your existing migrations (if present):

   ```bash
   npm --prefix backend exec prisma generate
   npm --prefix backend exec prisma db push
   ```

6. Start both applications from the repository root:

   ```bash
   npm run dev
   ```

Frontend: http://localhost:3000  
Backend health check: http://localhost:4000/health

Do not commit `.env`, `.env.local`, database URLs, API secrets, or admin passwords.
The example environment files contain placeholders only.
