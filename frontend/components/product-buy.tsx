'use client';

import { useMemo, useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from './cart';

type Variant = { sku?: string; color?: string; size?: string; stock?: number };

function stockLabel(stock: number) {
  if (stock <= 0) return 'SOLD OUT';
  return stock <= 10 ? `${stock} left` : '';
}

export function ProductBuy({ p }: any) {
  const variants: Variant[] = Array.isArray(p.variants) ? p.variants : [];
  const colors = Array.from(new Set(variants.map((v) => v.color).filter(Boolean))) as string[];
  const fallbackSizes = Array.from(new Set((p.sizes || []).filter(Boolean))) as string[];
  const initialColor = colors[0] || 'Black';
  const [color, setColor] = useState(initialColor);

  const colorVariants = useMemo(() => variants.filter((v) => (v.color || initialColor) === color), [variants, color, initialColor]);
  const sizes = Array.from(new Set(colorVariants.map((v) => v.size).filter(Boolean))) as string[];
  const availableFirst = colorVariants.find((v) => Number(v.stock) > 0)?.size;
  const [size, setSize] = useState(availableFirst || sizes[0] || fallbackSizes[0] || 'M');
  const selectedVariant = colorVariants.find((v) => v.size === size);
  const selectedStock = Number(selectedVariant?.stock ?? 0);
  const { add, open } = useCart();

  function selectColor(nextColor: string) {
    setColor(nextColor);
    const next = variants.find((v) => v.color === nextColor && Number(v.stock) > 0) || variants.find((v) => v.color === nextColor);
    setSize(next?.size || 'M');
  }

  function addToCart() {
    if (!selectedVariant || selectedStock <= 0) return;
    add({ id: String(p.id), name: p.name, price: Number(p.price || 0), image: p.image || p.gallery?.[0] || '', size, color, quantity: 1 });
    open();
  }

  function buyNow() {
    if (!selectedVariant || selectedStock <= 0) return;
    add({ id: String(p.id), name: p.name, price: Number(p.price || 0), image: p.image || p.gallery?.[0] || '', size, color, quantity: 1 });
    window.location.href = '/checkout';
  }

  return (
    <div className="mt-7">
      <div className="text-[9px] tracking-[.15em] font-bold mb-2">COLOUR — {color}</div>
      <div className="flex gap-2 mb-5">
        {colors.map((x) => <button key={x} type="button" onClick={() => selectColor(x)} className={`w-7 h-7 rounded-full border-2 ${color === x ? 'border-[var(--red)]' : 'border-[var(--line)]'}`} style={{ background: x.toLowerCase() === 'white' ? '#fff' : x.toLowerCase() === 'grey' ? '#777' : '#111' }} aria-label={`Select ${x}`} />)}
      </div>

      <div className="text-[9px] tracking-[.15em] font-bold mb-2">SIZE</div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {sizes.map((x) => {
          const variant = colorVariants.find((v) => v.size === x);
          const stock = Number(variant?.stock || 0);
          const label = stockLabel(stock);
          return <button key={x} type="button" disabled={stock <= 0} onClick={() => setSize(x)} className={`min-h-[58px] border border-[var(--line)] text-[9px] font-bold flex flex-col items-center justify-center gap-1 ${size === x && stock > 0 ? 'bg-[var(--fg)] text-[var(--bg)]' : ''} ${stock <= 0 ? 'opacity-45 cursor-not-allowed line-through' : ''}`}><span>{x}</span>{label && <span className="text-[8px] tracking-[.06em] font-medium no-underline">{label}</span>}</button>;
        })}
      </div>

      {selectedVariant && selectedStock > 0 && selectedStock <= 10 && <div className="text-[9px] text-[var(--red)] font-bold tracking-[.12em] mt-3">ONLY {selectedStock} LEFT IN THIS SIZE</div>}
      {selectedVariant && selectedStock <= 0 && <div className="text-[9px] text-[var(--red)] font-bold tracking-[.12em] mt-3">SELECT AN AVAILABLE SIZE</div>}

      <button type="button" disabled={!selectedVariant || selectedStock <= 0} className="btn btn-red w-full mt-5 disabled:opacity-40 disabled:cursor-not-allowed" onClick={addToCart}><ShoppingBag size={14} /> ADD TO CART</button>
      <button type="button" disabled={!selectedVariant || selectedStock <= 0} className="w-full border border-[var(--line)] py-3 mt-2 text-[9px] tracking-[.16em] font-black disabled:opacity-40 disabled:cursor-not-allowed" onClick={buyNow}>BUY NOW</button>
    </div>
  );
}
