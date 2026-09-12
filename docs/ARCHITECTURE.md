# DRAVON Architecture

```text
Browser
  |
  | HTTPS
  v
Next.js frontend
  |  product/search/cart/admin UI
  v
Node/Express API  -----> PostgreSQL (Prisma)
  |                     Aiven / Neon / local
  +-----> Cloudinary (media)
  +-----> Razorpay (payments)
  +-----> Email provider (notifications)
  +-----> Analytics (GA4 / Meta Pixel)
```

## Admin control
Products, variants, stock, collections, homepage sections, media, orders, customers, coupons, reviews, settings, audit log.

## Customer control
Browse, search, filter, theme preference, wishlist/cart, checkout, account/order history once customer auth is enabled. Guest checkout can be used with a verified email/phone flow.

## Payment trust boundary
The client never decides that an order is paid. Backend creates Razorpay order, verifies payment signature and webhook, then updates the order/payment state and inventory transactionally.
