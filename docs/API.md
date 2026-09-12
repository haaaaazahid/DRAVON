# API surface

Base: `/api`

## Public
- `GET /products?published=true&q=` — product search/catalog
- `GET /products/:slug` — product detail
- `GET /media/accepted` — supported upload extensions and size
- `GET /health` — service health

## Admin auth
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`

## Admin
- `GET /admin/dashboard`
- `GET /admin/orders`
- `PATCH /admin/orders/:id`
- `GET /admin/sections`
- `POST /admin/sections`
- `GET /admin/settings`
- `PUT /admin/settings/:key`
- `GET /admin/media`
- `GET /admin/audit`

## Product management
- `POST /products`
- `PUT /products/:id`
- `DELETE /products/:id`

## Media
- `POST /media/local` — development validation/ingest
- `GET /media/cloudinary-signature` — signed Cloudinary upload parameters when configured

## Payments
- `POST /payments/create-order`
- `POST /payments/verify`
- `POST /payments/webhook`

Live checkout should create the internal order before/around payment according to the final inventory reservation design, and payment status must be finalized by server-side verification/webhooks.
