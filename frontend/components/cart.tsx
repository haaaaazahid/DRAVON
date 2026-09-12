"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import Image from "next/image";
import {
  X,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";

export type CartItem = {
  id: string;
  variantId?: string;
  sku?: string;
  name: string;
  slug?: string;
  price: number;
  image?: string;
  color?: string;
  size?: string;
  quantity: number;
};

type AddItem = {
  id: string;
  variantId?: string;
  sku?: string;
  name: string;
  slug?: string;
  price: number;
  image?: string;
  color?: string;
  size?: string;
  quantity?: number;
};

type CartContextType = {
  items: CartItem[];
  count: number;
  subtotal: number;

  isOpen: boolean;
  open: () => void;
  close: () => void;
  setOpen: (value: boolean) => void;

  add: (item: AddItem) => void;
  remove: (id: string, color?: string, size?: string) => void;
  updateQuantity: (
    id: string,
    quantity: number,
    color?: string,
    size?: string
  ) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "dravon-cart";

function getItemKey(
  id: string,
  color?: string,
  size?: string
) {
  return `${id}__${color || ""}__${size || ""}`;
}

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch (error) {
      console.error("DRAVON cart load error:", error);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(items)
      );
    } catch (error) {
      console.error("DRAVON cart save error:", error);
    }
  }, [items, mounted]);

  const add = (item: AddItem) => {
    setItems((current) => {
      const existingIndex = current.findIndex(
        (existing) =>
          getItemKey(
            existing.id,
            existing.color,
            existing.size
          ) ===
          getItemKey(item.id, item.color, item.size)
      );

      if (existingIndex !== -1) {
        return current.map((existing, index) =>
          index === existingIndex
            ? {
                ...existing,
                quantity:
                  existing.quantity +
                  (item.quantity ?? 1),
              }
            : existing
        );
      }

      return [
        ...current,
        {
          id: String(item.id),
          variantId: item.variantId,
          sku: item.sku,
          name: item.name,
          slug: item.slug,
          price: Number(item.price),
          image: item.image,
          color: item.color,
          size: item.size,
          quantity: item.quantity ?? 1,
        },
      ];
    });
  };

  const remove = (
    id: string,
    color?: string,
    size?: string
  ) => {
    setItems((current) =>
      current.filter(
        (item) =>
          getItemKey(
            item.id,
            item.color,
            item.size
          ) !== getItemKey(id, color, size)
      )
    );
  };

  const updateQuantity = (
    id: string,
    quantity: number,
    color?: string,
    size?: string
  ) => {
    if (quantity <= 0) {
      remove(id, color, size);
      return;
    }

    setItems((current) =>
      current.map((item) =>
        getItemKey(
          item.id,
          item.color,
          item.size
        ) === getItemKey(id, color, size)
          ? {
              ...item,
              quantity,
            }
          : item
      )
    );
  };

  const clear = () => {
    setItems([]);
  };

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  const setOpen = (value: boolean) => {
    setIsOpen(value);
  };

  const count = useMemo(
    () =>
      items.reduce(
        (total, item) => total + item.quantity,
        0
      ),
    [items]
  );

  const subtotal = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total +
          Number(item.price) * item.quantity,
        0
      ),
    [items]
  );

  const value: CartContextType = {
    items,
    count,
    subtotal,
    isOpen,
    open,
    close,
    setOpen,
    add,
    remove,
    updateQuantity,
    clear,
  };

  return (
    <CartContext.Provider value={value}>
      {children}

      <CartDrawer />
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside <CartProvider>"
    );
  }

  return context;
}

/* --------------------------------------------------
   CART DRAWER
-------------------------------------------------- */

function CartDrawer() {
  const {
    items,
    count,
    subtotal,
    isOpen,
    close,
    remove,
    updateQuantity,
  } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* BACKDROP */}
      <div
        className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-[2px]"
        onClick={close}
        aria-hidden="true"
      />

      {/* DRAWER */}
      <aside
        className="
          fixed
          right-0
          top-0
          z-[100]
          flex
          h-[100dvh]
          w-full
          max-w-[440px]
          flex-col
          border-l
          border-[var(--line)]
          bg-[var(--bg)]
          text-[var(--fg)]
          shadow-2xl
        "
        aria-label="Shopping cart"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-5">
          <div>
            <div className="eyebrow">
              YOUR BAG
            </div>

            <h2 className="mt-1 text-xl font-black tracking-[-0.03em]">
              CART
              {count > 0 && (
                <span className="ml-2 text-sm font-medium text-[var(--muted)]">
                  ({count})
                </span>
              )}
            </h2>
          </div>

          <button
            type="button"
            onClick={close}
            aria-label="Close cart"
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              border
              border-[var(--line)]
              transition
              hover:border-[var(--fg)]
            "
          >
            <X size={18} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <EmptyCart onClose={close} />
          ) : (
            <div className="divide-y divide-[var(--line)]">
              {items.map((item) => (
                <CartRow
                  key={getItemKey(
                    item.id,
                    item.color,
                    item.size
                  )}
                  item={item}
                  onRemove={() =>
                    remove(
                      item.id,
                      item.color,
                      item.size
                    )
                  }
                  onDecrease={() =>
                    updateQuantity(
                      item.id,
                      item.quantity - 1,
                      item.color,
                      item.size
                    )
                  }
                  onIncrease={() =>
                    updateQuantity(
                      item.id,
                      item.quantity + 1,
                      item.color,
                      item.size
                    )
                  }
                />
              ))}
            </div>
          )}
        </div>

        {/* FOOTER */}
        {items.length > 0 && (
          <div className="border-t border-[var(--line)] bg-[var(--bg)] p-5">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="text-[var(--muted)]">
                SUBTOTAL
              </span>

              <span className="font-bold">
                ₹{subtotal.toLocaleString("en-IN")}
              </span>
            </div>

            <p className="mb-4 text-[10px] leading-relaxed text-[var(--muted)]">
              Shipping and taxes are calculated at
              checkout.
            </p>

            <Link
              href="/checkout"
              onClick={close}
              className="
                flex
                h-12
                w-full
                items-center
                justify-center
                gap-2
                bg-[var(--fg)]
                px-5
                text-[10px]
                font-black
                tracking-[0.18em]
                text-[var(--bg)]
                transition
                hover:bg-[var(--red)]
                hover:text-white
              "
            >
              CHECKOUT
              <ArrowRight size={14} />
            </Link>

            <Link
              href="/shop"
              onClick={close}
              className="
                mt-2
                flex
                h-11
                w-full
                items-center
                justify-center
                border
                border-[var(--line)]
                text-[10px]
                font-black
                tracking-[0.18em]
                transition
                hover:border-[var(--fg)]
              "
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}

/* --------------------------------------------------
   CART ROW
-------------------------------------------------- */

function CartRow({
  item,
  onRemove,
  onDecrease,
  onIncrease,
}: {
  item: CartItem;
  onRemove: () => void;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  return (
    <div className="flex gap-4 p-5">
      {/* IMAGE */}
      <div className="relative h-28 w-24 shrink-0 overflow-hidden bg-black/5 dark:bg-white/5">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="96px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ShoppingBag
              size={20}
              className="text-[var(--muted)]"
            />
          </div>
        )}
      </div>

      {/* DETAILS */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-black uppercase">
              {item.name}
            </h3>

            {(item.size || item.color) && (
              <div className="mt-2 space-y-1 text-[10px] text-[var(--muted)]">
                {item.size && (
                  <div>
                    SIZE:{" "}
                    <span className="text-[var(--fg)]">
                      {item.size}
                    </span>
                  </div>
                )}

                {item.color && (
                  <div>
                    COLOR:{" "}
                    <span className="text-[var(--fg)]">
                      {item.color}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${item.name}`}
            className="shrink-0 text-[var(--muted)] transition hover:text-[var(--red)]"
          >
            <Trash2 size={15} />
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between">
          {/* QUANTITY */}
          <div className="flex h-8 items-center border border-[var(--line)]">
            <button
              type="button"
              onClick={onDecrease}
              className="flex h-full w-8 items-center justify-center transition hover:bg-black/5 dark:hover:bg-white/5"
              aria-label="Decrease quantity"
            >
              <Minus size={12} />
            </button>

            <span className="flex w-8 justify-center text-xs font-bold">
              {item.quantity}
            </span>

            <button
              type="button"
              onClick={onIncrease}
              className="flex h-full w-8 items-center justify-center transition hover:bg-black/5 dark:hover:bg-white/5"
              aria-label="Increase quantity"
            >
              <Plus size={12} />
            </button>
          </div>

          {/* PRICE */}
          <span className="text-sm font-black">
            ₹
            {(
              Number(item.price) *
              item.quantity
            ).toLocaleString("en-IN")}
          </span>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------
   EMPTY CART
-------------------------------------------------- */

function EmptyCart({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <div className="flex h-full min-h-[400px] flex-col items-center justify-center px-8 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center border border-[var(--line)]">
        <ShoppingBag
          size={23}
          strokeWidth={1.5}
        />
      </div>

      <div className="eyebrow mb-2">
        NOTHING HERE YET
      </div>

      <h3 className="text-2xl font-black tracking-[-0.04em]">
        YOUR BAG IS EMPTY.
      </h3>

      <p className="mt-3 max-w-[280px] text-xs leading-relaxed text-[var(--muted)]">
        Find something built for your next
        movement.
      </p>

      <Link
        href="/shop"
        onClick={onClose}
        className="
          mt-7
          flex
          h-11
          items-center
          gap-2
          bg-[var(--fg)]
          px-6
          text-[10px]
          font-black
          tracking-[0.18em]
          text-[var(--bg)]
          transition
          hover:bg-[var(--red)]
          hover:text-white
        "
      >
        SHOP DRAVON
        <ArrowRight size={13} />
      </Link>
    </div>
  );
}