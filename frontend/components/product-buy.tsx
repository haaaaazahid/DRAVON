"use client";

import { useMemo, useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { useCart } from "./cart";

function swatch(color: string) {
  const c = color.toLowerCase();

  if (c === "white") return "#fff";
  if (c === "grey" || c === "gray") return "#777";
  if (c === "red") return "#8b0000";

  return "#111";
}

export function ProductBuy({ p }: any) {
  const variants = p.variants || [];

  const colors = Array.from(
    new Set(
      variants
        .map((v: any) => v.color)
        .filter(Boolean)
    )
  ) as string[];

  const initialColor =
    colors[0] || p.colors?.[0] || "Black";

  const [color, setColor] = useState(initialColor);

  const colorVariants = useMemo(
    () =>
      variants.filter(
        (v: any) =>
          !v.color || v.color === color
      ),
    [variants, color]
  );

  const sizes = Array.from(
    new Set(
      colorVariants
        .map((v: any) => v.size)
        .filter(Boolean)
    )
  ) as string[];

  const firstAvailable =
    colorVariants.find(
      (v: any) => Number(v.stock) > 0
    )?.size ||
    sizes[0] ||
    "M";

  const [size, setSize] = useState(firstAvailable);

  const selected = variants.find(
    (v: any) =>
      v.color === color &&
      v.size === size
  );

  const stock = Number(selected?.stock || 0);
  const available = stock > 0;

  const { add, open } = useCart();

  const chooseColor = (next: string) => {
    setColor(next);

    const list = variants.filter(
      (v: any) => v.color === next
    );

    setSize(
      list.find(
        (v: any) => Number(v.stock) > 0
      )?.size ||
        list[0]?.size ||
        "M"
    );
  };

  const addToCart = () => {
    if (!available || !selected) return;

    add({
      id: p.id,
      variantId: selected.id,
      sku: selected.sku,
      name: p.name,
      price: Number(p.price),
      image: p.image,
      size,
      color,
      quantity: 1,
    });

    open();
  };

  return (
    <div className="mt-8">
      {/* COLOR */}
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-black tracking-[.16em]">
          COLOUR
        </span>

        <span className="text-[10px] text-[var(--muted)]">
          {color}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-3">
        {colors.map((x: string) => (
          <button
            type="button"
            key={x}
            onClick={() => chooseColor(x)}
            aria-label={`Select ${x}`}
            className={`flex h-9 w-9 items-center justify-center rounded-full border-2 ${
              color === x
                ? "border-[var(--red)]"
                : "border-[var(--line)]"
            }`}
          >
            <span
              className="h-6 w-6 rounded-full border border-black/10"
              style={{
                background: swatch(x),
              }}
            />
          </button>
        ))}
      </div>

      {/* SIZE */}
      <div className="mt-7 flex items-center justify-between">
        <span className="text-[9px] font-black tracking-[.16em]">
          SELECT SIZE
        </span>

        {selected && (
          <span
            className={`text-[9px] font-bold tracking-[.12em] ${
              available && stock <= 10
                ? "text-[var(--red)]"
                : "text-[var(--muted)]"
            }`}
          >
            {available
              ? stock <= 10
                ? `${stock} LEFT`
                : "IN STOCK"
              : "SOLD OUT"}
          </span>
        )}
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2">
        {sizes.map((x: string) => {
          const variant = colorVariants.find(
            (item: any) => item.size === x
          );

          const n = Number(
            variant?.stock || 0
          );

          return (
            <button
              type="button"
              key={x}
              disabled={n <= 0}
              onClick={() => setSize(x)}
              className={`relative border py-3 text-[9px] font-black transition ${
                size === x && n > 0
                  ? "border-[var(--fg)] bg-[var(--fg)] text-[var(--bg)]"
                  : ""
              } ${
                n <= 0
                  ? "cursor-not-allowed opacity-35 line-through"
                  : ""
              }`}
            >
              {x}

              {n > 0 && n <= 10 && (
                <small className="absolute -right-1 -top-2 bg-[var(--red)] px-1 py-0.5 text-[6px] text-white no-underline">
                  {n} LEFT
                </small>
              )}
            </button>
          );
        })}
      </div>

      {/* CTA */}
      <button
        type="button"
        disabled={!available}
        onClick={addToCart}
        className="btn btn-red mt-5 w-full py-4 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ShoppingBag size={14} />

        {available
          ? "ADD TO CART"
          : "SOLD OUT"}
      </button>

      {available && (
        <div className="mt-3 flex items-center justify-center gap-2 text-[8px] font-bold tracking-[.12em] text-[var(--muted)]">
          <Check
            size={12}
            className="text-[var(--red)]"
          />
          SECURE CHECKOUT · FAST DISPATCH
        </div>
      )}
    </div>
  );
}