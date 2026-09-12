"use client";

import { useMemo, useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { useCart } from "./cart";

function swatch(color: string) {
  const c = color.trim().toLowerCase();

  const colors: Record<string, string> = {
    black: "#111111",
    white: "#ffffff",

    red: "#8b0000",
    crimson: "#dc143c",
    maroon: "#800000",

    blue: "#2563eb",
    navy: "#0f172a",
    sky: "#38bdf8",
    cyan: "#06b6d4",

    green: "#16a34a",
    olive: "#808000",
    lime: "#84cc16",

    yellow: "#eab308",
    gold: "#d4af37",
    orange: "#f97316",

    brown: "#78350f",
    beige: "#d6c6a5",
    cream: "#fffdd0",

    purple: "#7c3aed",
    violet: "#8b5cf6",
    pink: "#ec4899",

    grey: "#777777",
    gray: "#777777",
    silver: "#c0c0c0",
  };

  if (colors[c]) return colors[c];

  // HEX
  if (/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(c)) {
    return c;
  }

  // RGB / RGBA / HSL / HSLA
  if (/^(rgb|rgba|hsl|hsla)\(/i.test(c)) {
    return c;
  }

  // Browser CSS color names
  if (typeof window !== "undefined") {
    const probe = document.createElement("span");
    probe.style.color = c;

    if (probe.style.color) {
      return c;
    }
  }

  return "#111111";
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
    colors[0] ||
    p.colors?.[0] ||
    "Black";

  const [color, setColor] =
    useState(initialColor);

  const colorVariants = useMemo(
    () =>
      variants.filter(
        (v: any) =>
          !v.color ||
          v.color === color
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
      (v: any) =>
        Number(v.stock) > 0
    )?.size ||
    sizes[0] ||
    "M";

  const [size, setSize] =
    useState(firstAvailable);

  const selected = variants.find(
    (v: any) =>
      v.color === color &&
      v.size === size
  );

  const stock = Number(
    selected?.stock || 0
  );

  const available = stock > 0;

  const { add, open } =
    useCart();

  /*
   * When changing colour:
   * automatically select the first
   * available size for that colour.
   */
  const chooseColor = (
    next: string
  ) => {
    setColor(next);

    const list =
      variants.filter(
        (v: any) =>
          v.color === next
      );

    const availableVariant =
      list.find(
        (v: any) =>
          Number(v.stock) > 0
      );

    setSize(
      availableVariant?.size ||
        list[0]?.size ||
        "M"
    );
  };

  const addToCart = () => {
    if (!available || !selected) {
      return;
    }

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

      {/* =========================
          COLOR
      ========================== */}

      <div className="flex items-center justify-between">
        <span className="text-[9px] font-black tracking-[.16em] text-[var(--fg)]">
          COLOUR
        </span>

        <span className="text-[10px] text-[var(--muted)]">
          {color}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-3">

        {colors.map(
          (x: string) => (
            <button
              type="button"
              key={x}
              onClick={() =>
                chooseColor(x)
              }
              aria-label={`Select ${x}`}
              title={x}
              className={`
                flex h-10 w-10
                items-center
                justify-center
                rounded-full
                border-2
                bg-[var(--surface)]
                transition
                ${
                  color === x
                    ? "border-[var(--red)]"
                    : "border-[var(--line)] hover:border-[var(--fg)]"
                }
              `}
            >
              <span
                className="
                  h-6 w-6
                  rounded-full
                  border border-black/20
                  shadow-sm
                "
                style={{
                  backgroundColor:
                    swatch(x),
                }}
              />
            </button>
          )
        )}

      </div>

      {/* =========================
          SIZE
      ========================== */}

      <div className="mt-7 flex items-center justify-between">
        <span className="text-[9px] font-black tracking-[.16em] text-[var(--fg)]">
          SELECT SIZE
        </span>

        {selected && (
          <span
            className={`
              text-[9px]
              font-bold
              tracking-[.12em]
              ${
                available &&
                stock <= 10
                  ? "text-[var(--red)]"
                  : "text-[var(--muted)]"
              }
            `}
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

        {sizes.map(
          (x: string) => {
            const variant =
              colorVariants.find(
                (item: any) =>
                  item.size === x
              );

            const n = Number(
              variant?.stock || 0
            );

            const selectedSize =
              size === x && n > 0;

            return (
              <button
                type="button"
                key={x}
                disabled={n <= 0}
                onClick={() =>
                  setSize(x)
                }
                className={`
                  relative
                  border
                  border-[var(--line)]
                  bg-[var(--surface)]
                  py-3
                  text-[9px]
                  font-black
                  text-[var(--fg)]
                  transition

                  ${
                    selectedSize
                      ? "border-[var(--fg)] bg-[var(--fg)] text-[var(--bg)]"
                      : n > 0
                        ? "hover:border-[var(--fg)]"
                        : ""
                  }

                  ${
                    n <= 0
                      ? "cursor-not-allowed opacity-35 line-through"
                      : ""
                  }
                `}
              >
                {x}

                {n > 0 &&
                  n <= 10 && (
                    <small
                      className="
                        absolute
                        -right-1
                        -top-2
                        bg-[var(--red)]
                        px-1
                        py-0.5
                        text-[6px]
                        text-white
                        no-underline
                      "
                    >
                      {n} LEFT
                    </small>
                  )}
              </button>
            );
          }
        )}

      </div>

      {/* =========================
          ADD TO CART
      ========================== */}

      <button
        type="button"
        disabled={!available}
        onClick={addToCart}
        className="
          btn
          btn-red
          mt-5
          w-full
          py-4
          disabled:cursor-not-allowed
          disabled:opacity-40
        "
      >
        <ShoppingBag size={14} />

        {available
          ? "ADD TO CART"
          : "SOLD OUT"}
      </button>

      {/* =========================
          TRUST MESSAGE
      ========================== */}

      {available && (
        <div
          className="
            mt-3
            flex
            items-center
            justify-center
            gap-2
            text-[8px]
            font-bold
            tracking-[.12em]
            text-[var(--muted)]
          "
        >
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