'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';

export function Footer() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  async function subscribe(event: FormEvent) {
    event.preventDefault();
    setMessage('');
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || 'Could not join the list.');
      setEmail('');
      setMessage('YOU’RE ON THE LIST.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message.toUpperCase() : 'SIGNUP FAILED.');
    }
  }

  return (
    <footer className="mt-24 border-t border-[var(--line)]">
      <div className="container grid gap-10 py-12 md:grid-cols-4">
        <div>
          <Link href="/" aria-label="DRAVON home" className="flex items-center gap-2">
            <img src="/brand/symbol.png" alt="" aria-hidden="true" width={34} height={34} className="h-8 w-auto object-contain" />
            <img src="/brand/wordmark.png" alt="DRAVON" width={155} height={17} className="h-auto w-[130px]" />
          </Link>
          <p className="mt-3 text-[10px] tracking-[.16em] text-[var(--muted)]">STRENGTH · DISCIPLINE · EVOLVE</p>
        </div>
        <div><div className="eyebrow mb-4">SHOP</div><Link className="mb-2 block text-xs hover:text-[var(--red)]" href="/shop">Shop</Link><Link className="mb-2 block text-xs hover:text-[var(--red)]" href="/collections">Collections</Link><Link className="mb-2 block text-xs hover:text-[var(--red)]" href="/shop">New Drop</Link><Link className="mb-2 block text-xs hover:text-[var(--red)]" href="/shop">Best Sellers</Link></div>
        <div><div className="eyebrow mb-4">ABOUT</div><Link className="mb-2 block text-xs hover:text-[var(--red)]" href="/about">Our Story</Link><Link className="mb-2 block text-xs hover:text-[var(--red)]" href="/community">Community</Link><Link className="mb-2 block text-xs hover:text-[var(--red)]" href="/contact">Contact</Link><Link className="mb-2 block text-xs hover:text-[var(--red)]" href="/contact">FAQ</Link></div>
        <div>
          <div className="eyebrow mb-4">DON’T MISS THE NEXT DROP</div>
          <form onSubmit={subscribe} className="flex border border-[var(--line)]">
            <label className="sr-only" htmlFor="newsletter-email">Email address</label>
            <input id="newsletter-email" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="min-w-0 flex-1 bg-transparent p-3 text-xs outline-none" placeholder="ENTER YOUR EMAIL" />
            <button type="submit" className="bg-[var(--red)] px-4 text-[10px] font-bold text-white hover:opacity-90">JOIN</button>
          </form>
          <p role="status" className="mt-2 min-h-4 text-[8px] tracking-[.1em] text-[var(--muted)]">{message}</p>
        </div>
      </div>
      <div className="container flex flex-col gap-3 border-t border-[var(--line)] py-5 text-[9px] text-[var(--muted)] md:flex-row md:items-center md:justify-between">
        <span>© 2026 DRAVON. ALL RIGHTS RESERVED.</span>
        <div className="flex flex-wrap items-center gap-4"><Link href="/privacy" className="hover:text-[var(--fg)]">Privacy Policy</Link><Link href="/terms" className="hover:text-[var(--fg)]">Terms & Conditions</Link><Link href="/admin" className="hover:text-[var(--fg)]">Admin Login</Link></div>
      </div>
    </footer>
  );
}
