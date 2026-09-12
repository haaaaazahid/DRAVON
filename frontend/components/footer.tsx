import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-[var(--line)] mt-24">
      <div className="container py-12 grid md:grid-cols-4 gap-10">
        {/* BRAND */}
        <div>
          <div className="font-black tracking-[.2em] text-lg">
            ◢ DRAVON
          </div>

          <p className="text-[10px] tracking-[.16em] text-[var(--muted)] mt-3">
            STRENGTH · DISCIPLINE · EVOLVE
          </p>
        </div>

        {/* SHOP */}
        <div>
          <div className="eyebrow mb-4">SHOP</div>

          <Link
            className="block text-xs mb-2 hover:text-[var(--red)] transition-colors"
            href="/shop"
          >
            Shop
          </Link>

          <Link
            className="block text-xs mb-2 hover:text-[var(--red)] transition-colors"
            href="/collections"
          >
            Collections
          </Link>

          <Link
            className="block text-xs mb-2 hover:text-[var(--red)] transition-colors"
            href="/shop?filter=new"
          >
            New Drop
          </Link>

          <Link
            className="block text-xs mb-2 hover:text-[var(--red)] transition-colors"
            href="/shop?filter=best-sellers"
          >
            Best Sellers
          </Link>
        </div>

        {/* ABOUT */}
        <div>
          <div className="eyebrow mb-4">ABOUT</div>

          <Link
            className="block text-xs mb-2 hover:text-[var(--red)] transition-colors"
            href="/about"
          >
            Our Story
          </Link>

          <Link
            className="block text-xs mb-2 hover:text-[var(--red)] transition-colors"
            href="/community"
          >
            Community
          </Link>

          <Link
            className="block text-xs mb-2 hover:text-[var(--red)] transition-colors"
            href="/contact"
          >
            Contact
          </Link>

          <Link
            className="block text-xs mb-2 hover:text-[var(--red)] transition-colors"
            href="/contact"
          >
            FAQ
          </Link>
        </div>

        {/* NEWSLETTER */}
        <div>
          <div className="eyebrow mb-4">
            DON’T MISS THE NEXT DROP
          </div>

          <div className="flex border border-[var(--line)]">
            <input
              type="email"
              className="bg-transparent p-3 flex-1 outline-none text-xs min-w-0"
              placeholder="Enter your email"
            />

            <button
              type="button"
              className="bg-[var(--red)] text-white px-4 text-[10px] font-bold hover:opacity-90 transition-opacity"
            >
              JOIN
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM FOOTER */}
      <div className="container py-5 border-t border-[var(--line)] text-[9px] text-[var(--muted)] flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <span>
          © 2027 DRAVON. ALL RIGHTS RESERVED.
        </span>

        <div className="flex items-center gap-4">
          <Link
            href="/privacy"
            className="hover:text-white transition-colors"
          >
            Privacy Policy
          </Link>

          <Link
            href="/terms"
            className="hover:text-white transition-colors"
          >
            Terms & Conditions
          </Link>

          <Link
            href="/admin"
            className="hover:text-white transition-colors"
          >
            Admin Login
          </Link>
        </div>
      </div>
    </footer>
  );
}