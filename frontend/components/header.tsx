"use client";

import Link from "next/link";
import {
  Menu,
  Search,
  UserRound,
  Heart,
  ShoppingBag,
  X,
} from "lucide-react";
import { useState } from "react";
import ThemeToggle from "./theme-toggle";
import { useCart } from "./cart";

const nav = [
  ["HOME", "/"],
  ["SHOP", "/shop"],
  ["COLLECTIONS", "/collections"],
  ["ABOUT", "/about"],
  ["COMMUNITY", "/community"],
  ["CONTACT", "/contact"],
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { count, open: openCart } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--bg)]/95 backdrop-blur">
      <div className="flex h-7 items-center justify-center bg-[var(--fg)] text-[9px] font-bold tracking-[.12em] text-[var(--bg)]">
        FREE SHIPPING ON ORDERS ABOVE ₹2,999
      </div>

      <div className="container flex h-14 sm:h-16 items-center justify-between gap-3 sm:gap-5">
        <button
          className="mobile-only h-10 w-10 shrink-0 items-center justify-center"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>

        <Link
          href="/"
          aria-label="DRAVON home"
          className="flex shrink-0 items-center gap-2"
        >
          <img
            src="/brand/wordmark.png"
            alt="DRAVON"
            width={180}
            height={20}
            className="h-auto w-[150px] sm:w-[180px]"
          />
        </Link>

        <nav className="desktop-only flex-1 items-center justify-center gap-4 xl:gap-7">
          {nav.map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className="text-[9px] font-black tracking-[.16em] transition hover:text-[var(--red)]"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          <div className="desktop-only">
            <ThemeToggle />
          </div>

          <Link href="/shop" aria-label="Search products" className="desktop-only">
            <Search size={17} />
          </Link>

          <Link href="/account" className="desktop-only" aria-label="Account">
            <UserRound size={17} />
          </Link>

          <Link href="/wishlist" className="desktop-only" aria-label="Wishlist">
            <Heart size={17} />
          </Link>

          <button
            type="button"
            onClick={openCart}
            aria-label="Open shopping cart"
            className="relative"
          >
            <ShoppingBag size={17} />

            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--red)] text-[8px] text-white">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {open && (
        <div className="mobile-only flex-col space-y-4 border-t border-[var(--line)] px-5 py-5 lg:hidden">
          {nav.map(([label, href]) => (
            <Link
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              className="block text-xs font-black tracking-[.2em]"
            >
              {label}
            </Link>
          ))}

          <div className="flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-[var(--line)] pt-4">
            <Link href="/account" onClick={() => setOpen(false)} className="text-xs font-bold tracking-[.14em]">ACCOUNT</Link>
            <Link href="/wishlist" onClick={() => setOpen(false)} className="text-xs font-bold tracking-[.14em]">WISHLIST</Link>
            <Link href="/shop" onClick={() => setOpen(false)} className="text-xs font-bold tracking-[.14em]">SEARCH PRODUCTS</Link>
            <ThemeToggle />
          </div>
        </div>
      )}
    </header>
  );
}
