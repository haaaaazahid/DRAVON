export default function TermsPage() {
  return (
    <main className="container py-20 max-w-4xl">
      <p className="eyebrow mb-4">LEGAL</p>

      <h1 className="text-4xl md:text-6xl font-black tracking-tight">
        TERMS & CONDITIONS
      </h1>

      <p className="mt-6 text-sm text-[var(--muted)]">
        Last updated: September 2026
      </p>

      <div className="mt-12 space-y-10 text-sm leading-7 text-[var(--muted)]">
        <section>
          <h2 className="text-xl font-bold text-white mb-3">
            1. About These Terms
          </h2>
          <p>
            These Terms & Conditions govern your use of the DRAVON website and
            your purchase of products through the website.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">
            2. Products & Pricing
          </h2>
          <p>
            Product descriptions, availability, prices, offers, and images may
            change without prior notice. We aim to keep product information
            accurate but cannot guarantee that every detail is error-free.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">
            3. Orders
          </h2>
          <p>
            An order is subject to confirmation and product availability.
            DRAVON reserves the right to cancel an order where there is an
            inventory issue, pricing error, suspected fraud, or other valid
            operational reason.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">
            4. Payments
          </h2>
          <p>
            Payments are processed through authorized payment providers.
            Additional payment verification may be required before an order is
            confirmed.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">
            5. Shipping
          </h2>
          <p>
            Orders are shipped to the address supplied during checkout.
            Delivery times may vary depending on location, courier conditions,
            weather, operational delays, and other circumstances outside our
            direct control.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">
            6. Returns & Exchanges
          </h2>
          <p>
            Returns and exchanges are subject to DRAVON's applicable return and
            exchange policy. Customers should review the policy before placing
            an order.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">
            7. Website Use
          </h2>
          <p>
            You agree not to misuse the website, attempt unauthorized access,
            interfere with website operation, or use the service for unlawful
            purposes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">
            8. Contact
          </h2>
          <p>
            For questions regarding orders, products, returns, or these terms,
            please contact DRAVON through the contact information provided on
            the website.
          </p>
        </section>
      </div>
    </main>
  );
}