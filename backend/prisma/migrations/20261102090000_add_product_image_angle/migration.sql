-- Adds an optional camera-angle label (front, back, left, right, detail, ...) to each product image.
-- Existing images keep their URLs and order; their angle stays NULL until labelled in the admin editor.
ALTER TABLE "ProductImage" ADD COLUMN "angle" TEXT;
