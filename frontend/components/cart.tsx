'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ArrowRight, Minus, Plus, X } from 'lucide-react';
import Link from 'next/link';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  add: (item: CartItem) => void;
  remove: (id: string, size?: string, color?: string) => void;
  updateQuantity: (id: string, size: string, color: string, quantity: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  // Kept as an alias so older components using setOpen(true) do not break.
  setOpen: (value?: boolean) => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = 'dravon-cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const value = useMemo<CartContextValue>(() => ({
    items,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    isOpen,
    add: (item) => setItems((current) => {
      const index = current.findIndex(
        (x) => x.id === item.id && x.size === item.size && x.color === item.color,
      );
      if (index === -1) return [...current, item];
      const next = [...current];
      next[index] = { ...next[index], quantity: next[index].quantity + item.quantity };
      return next;
    }),
    remove: (id, size, color) => setItems((current) =>
      current.filter((item) => !(item.id === id && (size === undefined || item.size === size) && (color === undefined || item.color === color))),
    ),
    updateQuantity: (id, size, color, quantity) => setItems((current) =>
      current.flatMap((item) => {
        if (item.id !== id || item.size !== size || item.color !== color) return [item];
        return quantity > 0 ? [{ ...item, quantity }] : [];
      }),
    ),
    clear: () => setItems([]),
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    setOpen: (value = true) => setIsOpen(value),
  }), [items, isOpen]);

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartDrawer />
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}

function CartDrawer() {
  const { items, subtotal, isOpen, close, remove, updateQuantity } = useCart();

  return (
    <div
      className={`fixed inset-0 z-[70] transition ${isOpen ? 'visible bg-black/50' : 'invisible pointer-events-none bg-transparent'}`}
      onClick={close}
      aria-hidden={!isOpen}
    >
      <aside
        onClick={(event) => event.stopPropagation()}
        className={`absolute right-0 top-0 h-full w-[min(440px,92vw)] bg-[var(--bg)] border-l border-[var(--line)] transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        aria-label="Shopping bag"
      >
        <div className="flex justify-between items-center px-5 py-5 border-b border-[var(--line)]">
          <div className="font-black tracking-[.18em]">YOUR BAG</div>
          <button onClick={close} aria-label="Close bag"><X size={20} /></button>
        </div>

        <div className="px-5 py-5 space-y-5 overflow-y-auto max-h-[calc(100vh-190px)]">
          {items.length === 0 ? (
            <div className="py-20 text-center text-sm text-[var(--muted)]">Your bag is empty.</div>
          ) : items.map((item) => (
            <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-3">
              <img src={item.image} className="w-20 h-24 object-cover bg-[var(--surface)]" alt={item.name} />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold truncate">{item.name}</div>
                <div className="text-[10px] text-[var(--muted)] mt-1">{item.color} / {item.size}</div>
                <div className="mt-2 font-bold text-xs">₹{item.price.toLocaleString('en-IN')}</div>
                <div className="flex items-center gap-2 mt-3">
                  <button onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)} className="border border-[var(--line)] p-1" aria-label="Decrease quantity"><Minus size={11} /></button>
                  <span className="text-xs min-w-4 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)} className="border border-[var(--line)] p-1" aria-label="Increase quantity"><Plus size={11} /></button>
                  <button onClick={() => remove(item.id, item.size, item.color)} className="ml-auto text-[10px] underline">REMOVE</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5 bg-[var(--bg)] border-t border-[var(--line)]">
          <div className="flex justify-between font-bold mb-4">
            <span>SUBTOTAL</span>
            <span>₹{subtotal.toLocaleString('en-IN')}</span>
          </div>
          <Link onClick={close} href="/checkout" className="btn btn-red w-full">
            CHECKOUT <ArrowRight size={14} />
          </Link>
        </div>
      </aside>
    </div>
  );
}
