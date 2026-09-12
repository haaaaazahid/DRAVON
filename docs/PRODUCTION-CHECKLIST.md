# Launch checklist

This repository is the engineering foundation. Before accepting real orders:

- [ ] Replace seed/demo photography with licensed DRAVON assets.
- [ ] Put the official DRAVON logo SVG/PNG in `frontend/public/brand/` and use it without distortion.
- [ ] Configure Aiven/managed PostgreSQL and backups.
- [ ] Configure Cloudinary signed upload and delivery transformations.
- [ ] Configure Razorpay live keys, webhook endpoint and webhook secret.
- [ ] Implement DB-backed checkout/order creation before enabling live payment.
- [ ] Add transactional email/SMS provider for order confirmation/shipping events.
- [ ] Add shipping provider/API and pincode service if required by the fulfilment workflow.
- [ ] Configure customer authentication, password reset and account/order history.
- [ ] Publish legal pages: privacy, terms, shipping, returns/exchange, refund policy.
- [ ] Configure GA4, Search Console and Meta Pixel with consent/privacy requirements.
- [ ] Run dependency audit, security review, CSRF/origin review, rate-limit review and backup restore test.
- [ ] Run Lighthouse/PageSpeed on real mobile hardware and compress/transcode all media.
- [ ] Configure error monitoring and uptime monitoring.
- [ ] Set production CORS/HTTPS/domain cookies and rotate all secrets.
- [ ] Test payment success, failure, duplicate callbacks, webhook replay, refunds, inventory races and out-of-stock checkout.
