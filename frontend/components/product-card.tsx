"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  ArrowUpRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "./cart";

function swatch(color: string) {
  const c = color.toLowerCase();

  if (c === "white") return "#fff";
  if (c === "grey" || c === "gray") return "#777";
  if (c === "red") return "#8b0000";

  return "#111";
}

export function ProductCard({ p }: any) {
  const { add, open } = useCart();

  const sizes = p.sizes || [];
  const colors = p.colors || [];

  const defaultSize = sizes.includes("M")
    ? "M"
    : sizes[0] || "M";

  const defaultColor =
    colors[0] || "Black";

  const variants = p.variants || [];

  const selectedVariant =
    variants.find(
      (v: any) =>
        v.color === defaultColor &&
        v.size === defaultSize
    ) ||
    variants.find(
      (v: any) => Number(v.stock) > 0
    );

  const defaultVariantStock = Number(
    selectedVariant?.stock || 0
  );

  const canQuickAdd =
    selectedVariant
      ? defaultVariantStock > 0
      : true;

  const quickAdd = () => {
    if (!canQuickAdd) return;

    add({
      id: p.id,
      variantId: selectedVariant?.id,
      sku: selectedVariant?.sku,
      name: p.name,
      price: Number(p.price),
      image: p.image,
      size:
        selectedVariant?.size ||
        defaultSize,
      color:
        selectedVariant?.color ||
        defaultColor,
      quantity: 1,
    });

    open();
  };

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 16,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        margin: "-50px",
      }}
      transition={{
        duration: 0.4,
      }}
      className="group min-w-0"
    >
      <Link
        href={`/product/${p.slug}`}
        className="block"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-[var(--surface)]">
          <Image
            src={p.image}
            alt={p.name}
            fill
            sizes="(max-width:700px) 50vw, (max-width:1100px) 25vw, 20vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />

          {p.tag && (
            <span className="absolute left-3 top-3 bg-[var(--red)] px-2 py-1 text-[8px] font-black tracking-[.16em] text-white">
              {p.tag}
            </span>
          )}

          <button
            type="button"
            aria-label="Add to wishlist"
            onClick={(e) =>
              e.preventDefault()
            }
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center bg-[var(--bg)]/90"
          >
            <Heart size={14} />
          </button>

          <div className="absolute inset-x-0 bottom-0 hidden translate-y-full bg-[var(--fg)] py-3 text-center text-[8px] font-black tracking-[.18em] text-[var(--bg)] transition-transform duration-300 md:block md:group-hover:translate-y-0">
            VIEW PRODUCT{" "}
            <ArrowUpRight
              size={12}
              className="ml-1 inline"
            />
          </div>
        </div>
      </Link>

      <div className="pt-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-[10px] font-black leading-4 tracking-[.05em]">
              {p.name}
            </h3>

            <p className="mt-1 text-[9px] tracking-[.08em] text-[var(--muted)]">
              {p.category ||
                "PERFORMANCE"}
            </p>
          </div>

          <div className="whitespace-nowrap text-[10px] font-bold">
            ₹
            {Number(
              p.price
            ).toLocaleString("en-IN")}
          </div>
        </div>

        {p.mrp > p.price && (
          <div className="mt-1 text-[9px] text-[var(--muted)]">
            <del>
              ₹
              {Number(
                p.mrp
              ).toLocaleString("en-IN")}
            </del>

            <span className="ml-2 text-[var(--red)]">
              SAVE ₹
              {(
                Number(p.mrp) -
                Number(p.price)
              ).toLocaleString(
                "en-IN"
              )}
            </span>
          </div>
        )}

        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="flex gap-1.5">
            {colors.map(
              (c: string) => (
                <span
                  key={c}
                  title={c}
                  className="h-3 w-3 rounded-full border border-[var(--line)]"
                  style={{
                    background:
                      swatch(c),
                  }}
                />
              )
            )}
          </div>

          <span className="text-[8px] tracking-[.12em] text-[var(--muted)]">
            {sizes.join(" · ")}
          </span>
        </div>

        <button
          type="button"
          disabled={!canQuickAdd}
          onClick={quickAdd}
          className="mt-3 w-full border border-[var(--fg)] py-2.5 text-[8px] font-black tracking-[.18em] transition hover:bg-[var(--fg)] hover:text-[var(--bg)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {canQuickAdd
            ? `QUICK ADD — ${
                selectedVariant?.size ||
                defaultSize
              }`
            : "SOLD OUT"}
        </button>
      </div>
    </motion.article>
  );
}