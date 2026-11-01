# DRAVON movement-based product categories

## What changed
- Product editor now includes multi-select Movement Categories.
- Product assignments are persisted in PostgreSQL as `Product.movements` (a text array).
- The public products API supports `?movement=front-lever` and returns only matching products.
- The homepage Shop by Movement cards now link to movement filters rather than the unrelated collection filter.
- Products can belong to multiple movements. Products with no movement tags remain in the general shop.

## Apply the database change
Run from the project root after configuring the backend `DATABASE_URL`:

```powershell
cd backend
npx prisma db push
npx prisma generate
cd ..
```

`db push` adds the new nullable-free array column with an empty-array default and preserves existing product rows. A matching SQL migration is included at `backend/prisma/migrations/20261101120000_add_product_movements/migration.sql` for migration-managed deployments.

## Start the project
```powershell
npm install
npm --prefix frontend install
npm --prefix backend install
npm run dev
```

Existing products will initially have no movement tags. Edit each product in Admin and select its relevant movements.
