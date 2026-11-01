# DRAVON repair notes

## Fixed in this package
- Restored the missing `/brand/wordmark.png` using the existing horizontal DRAVON brand artwork.
- Added `/icon.png` so the explicit browser icon metadata resolves.
- Optimized the oversized Back Lever and L-Sit WebP assets while preserving the source images' visual content.
- Added a backend `.env.example` with placeholder-only settings.
- Added explicit Prisma client generation to backend install/dev/build lifecycle scripts.
- Updated the Next.js API rewrite to use `NEXT_PUBLIC_API_URL`, so local development can reach localhost and production can use the configured API.
- Added the missing newsletter API endpoint backed by the existing `NewsletterSubscriber` model.
- Replaced the deprecated Next.js `next lint` script with a TypeScript check.
- Removed the remote Google Fonts build dependency; the site now uses a modern system font stack.
- Made the local setup and environment requirements explicit in README.
- Removed the insecure default admin seed password; seeding now requires a configured password of at least 12 characters.

## Important deployment setup
- Set `frontend/.env.local` from `frontend/.env.example`.
- Set `backend/.env` from `backend/.env.example`.
- Configure a real PostgreSQL `DATABASE_URL`, strong `JWT_SECRET`, and correct `FRONTEND_URL`.
- Configure Razorpay and Cloudinary credentials only when enabling those integrations.
- Do not commit real environment files or credentials.

## Verification limitation
The dependency installation could not complete in this isolated repair environment, so full Next.js and TypeScript production builds were not executed. Run the install and build commands in README on your machine and share any remaining compiler/runtime output for targeted fixes.
