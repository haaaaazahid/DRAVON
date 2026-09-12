'use client';

import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from './cart';

export function ProductBuy({ p }: any) {
  const sizes = Array.from(new Set((p.sizes || []).filter(Boolean))) as string[];
  const colors = Array.from(new Set((p.colors || []).filter(Boolean))) as string[];
  const [size, setSize] = useState(sizes.includes('M') ? 'M' : sizes[0] || 'M');
  const [color, setColor] = useState(colors[0] || 'Black');
  const { add, open } = useCart();

  function addToCart() {
    add({
      id: String(p.id),
      name: p.name,
      price: Number(p.price || 0),
      image: p.image || p.gallery?.[0] || '',
      size,
      color,
      quantity: 1,
    });
    open();
  }

  function buyNow() {
    add({
      id: String(p.id),
      name: p.name,
      price: Number(p.price || 0),
      image: p.image || p.gallery?.[0] || '',
      size,
      color,
      quantity: 1,
    });
    window.location.href = '/checkout';
  }

  return (
    <div className="mt-7">
      <div className="text-[9px] tracking-[.15em] font-bold mb-2">COLOUR — {color}</div>
      <div className="flex gap-2 mb-5">
        {colors.map((x) => (
          <button
            key={x}
            type="button"
            onClick={() => setColor(x)}
            className={`w-7 h-7 rounded-full border-2 ${color === x ? 'border-[var(--red)]' : 'border-[var(--line)]'}`}
            style={{ background: x.toLowerCase() === 'white' ? '#fff' : x.toLowerCase() === 'grey' ? '#777' : '#111' }}
            aria-label={`Select ${x}`}
          />
        ))}
      </div>

      <div className="text-[9px] tracking-[.15em] font-bold mb-2">SIZE — {size}</div>
      <div className="grid grid-cols-6 gap-2">
        {sizes.map((x) => (
          <button key={x} type="button" onClick={() => setSize(x)} className={`py-3 border border-[var(--line)] text-[9px] font-bold ${size === x ? 'bg-[var(--fg)] text-[var(--bg)]' : ''}`}>
            {x}
          </button>
        ))}
      </div>

      <button type="button" className="btn btn-red w-full mt-5" onClick={addToCart}>
        <ShoppingBag size={14} /> ADD TO CART
      </button>
      <button type="button" className="w-full border border-[var(--line)] py-3 mt-2 text-[9px] tracking-[.16em] font-black" onClick={buyNow}>
        BUY NOW
      </button>
    </div>
  );
}
