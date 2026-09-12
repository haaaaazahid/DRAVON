export default function PrivacyPage() {
  return (
    <main className="container py-20 max-w-4xl">
      <p className="eyebrow mb-4">LEGAL</p>

      <h1 className="text-4xl md:text-6xl font-black tracking-tight">
        PRIVACY POLICY
      </h1>

      <p className="mt-6 text-sm text-[var(--muted)]">
        Last updated: September 2026
      </p>

      <div className="mt-12 space-y-10 text-sm leading-7 text-[var(--muted)]">
        <section>
          <h2 className="text-xl font-bold text-white mb-3">
            1. Information We Collect
          </h2>
          <p>
            When you use DRAVON, place an order, contact us, subscribe to
            updates, or create an account, we may collect information such as
            your name, email address, phone number, shipping address, order
            details, and information you voluntarily provide.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">
            2. How We Use Your Information
          </h2>
          <p>
            We use your information to process orders, provide customer
            support, communicate with you about your purchases, improve our
            website and services, and provide updates where you have opted in.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">
            3. Payments
          </h2>
          <p>
            Payment information is processed through our authorized payment
            provider. DRAVON does not intentionally store complete card or
            banking credentials on its own servers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">
            4. Cookies
          </h2>
          <p>
            We may use cookies and similar technologies for authentication,
            shopping-cart functionality, preferences, analytics, and website
            security.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">
            5. Third-Party Services
          </h2>
          <p>
            We may use third-party services for payments, hosting, analytics,
            email, image storage, and other operational purposes. These
            providers may process information according to their own privacy
            policies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">
            6. Data Security
          </h2>
          <p>
            We use reasonable technical and organizational measures to protect
            information from unauthorized access, alteration, disclosure, or
            destruction.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">
            7. Contact
          </h2>
          <p>
            For privacy-related questions, please contact DRAVON through the
            contact details provided on the website.
          </p>
        </section>
      </div>
    </main>
  );
}