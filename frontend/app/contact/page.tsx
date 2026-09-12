"use client";

import { FormEvent, useState } from "react";
import {
  ArrowUpRight,
  Mail,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";

const CONTACT = {
  phone: "+91 77159 03503",
  phoneRaw: "917715903503",

  whatsapp: "+91 77159 03503",
  whatsappRaw: "917715903503",

  email: "dravon8549@gmail.com",

  instagram: "@dravon_india",
  instagramUrl: "https://instagram.com/dravon_india",
};

const channels = [
  {
    label: "CALL",
    value: CONTACT.phone,
    detail: "Customer support",
    icon: Phone,
    href: `tel:+${CONTACT.phoneRaw}`,
  },
  {
    label: "WHATSAPP",
    value: CONTACT.whatsapp,
    detail: "Fastest way to reach us",
    icon: MessageCircle,
    href: `https://wa.me/${CONTACT.whatsappRaw}?text=${encodeURIComponent(
      "Hi DRAVON, I have an enquiry."
    )}`,
  },
  {
    label: "EMAIL",
    value: CONTACT.email,
    detail: "For detailed enquiries",
    icon: Mail,
    href: `mailto:${CONTACT.email}`,
  },
];

const enquiryTypes = [
  ["01", "ORDER SUPPORT", "Delivery, returns, exchanges & order help"],
  ["02", "PRODUCT QUESTIONS", "Sizing, fit, fabric & product information"],
  ["03", "COLLABORATIONS", "Creators, athletes & brand partnerships"],
  ["04", "WHOLESALE", "Stockists, gyms, academies & bulk enquiries"],
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <main className="bg-[var(--bg)] text-[var(--fg)]">
      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative min-h-[78vh] overflow-hidden border-b border-[var(--line)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,var(--fg),transparent_35%)] opacity-[0.055]" />

        <div className="container relative flex min-h-[78vh] flex-col justify-between py-8 md:py-12">
          <div className="eyebrow">
            <span className="redline" /> DRAVON / CONTACT
          </div>

          <div className="grid items-end gap-10 lg:grid-cols-[1.35fr_.65fr]">
            <div>
              <p className="mb-5 max-w-xl text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--muted)] md:text-xs">
                QUESTIONS. ORDERS. COLLABORATIONS. THE MOVEMENT.
              </p>

              <h1 className="text-[22vw] font-black leading-[0.72] tracking-[-0.105em] sm:text-[19vw] lg:text-[12.5vw]">
                LET&apos;S
                <br />
                <span className="text-[var(--red)]">TALK.</span>
              </h1>
            </div>

            <div className="max-w-md border-l border-[var(--line)] pb-1 pl-6 md:pl-8">
              <p className="text-sm leading-7 text-[var(--muted)] md:text-base md:leading-8">
                Need help with an order? Want to work with DRAVON? Or just have
                something to say? Reach out. We&apos;re building this movement
                with people who move.
              </p>

              <div className="mt-7 flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.18em]">
                <span className="h-px w-10 bg-[var(--red)]" />
                BUILT FOR MOVEMENT
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-[var(--line)] pt-5 text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
            <span>MUMBAI / INDIA</span>
            <span>SCROLL TO CONNECT ↓</span>
          </div>
        </div>
      </section>

      {/* =========================================================
          CONTACT CHANNELS
      ========================================================= */}
      <section className="border-b border-[var(--line)]">
        <div className="container py-16 md:py-24">
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="eyebrow mb-4">01 / DIRECT LINE</div>

              <h2 className="max-w-2xl text-4xl font-black uppercase leading-[0.92] tracking-[-0.055em] md:text-6xl">
                CHOOSE YOUR
                <br />
                <span className="text-[var(--red)]">CHANNEL.</span>
              </h2>
            </div>

            <p className="max-w-sm text-xs leading-6 text-[var(--muted)]">
              Real people. Clear answers. No unnecessary forms when a simple
              message will do.
            </p>
          </div>

          {/* CONTACT CARDS */}
          <div className="grid border border-[var(--line)] md:grid-cols-3">
            {channels.map(
              ({ label, value, detail, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="group min-h-[250px] border-b border-[var(--line)] bg-[var(--bg)] p-6 transition-colors duration-300 hover:bg-[var(--fg)] hover:text-[var(--bg)] md:border-b-0 md:border-r last:md:border-r-0 md:p-8"
                >
                  <div className="flex items-start justify-between">
                    <Icon size={20} strokeWidth={1.6} />

                    <ArrowUpRight
                      size={17}
                      className="opacity-40 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                    />
                  </div>

                  <div className="mt-16 text-[9px] font-black tracking-[0.2em] opacity-60">
                    {label}
                  </div>

                  <div className="mt-3 break-words text-xl font-black tracking-[-0.03em] md:text-2xl">
                    {value}
                  </div>

                  <div className="mt-2 text-[10px] text-[var(--muted)] transition-colors group-hover:text-[var(--bg)]/60">
                    {detail}
                  </div>
                </a>
              )
            )}
          </div>

          {/* INSTAGRAM */}
          <a
            href={CONTACT.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-4 flex flex-col gap-4 border border-[var(--line)] p-5 transition-colors duration-300 hover:bg-[var(--fg)] hover:text-[var(--bg)] md:flex-row md:items-center md:justify-between md:px-7"
          >
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.15em]">
              <span className="text-base leading-none text-[var(--red)]">
                ◎
              </span>

              <span>INSTAGRAM</span>

              <span className="font-normal tracking-normal text-[var(--muted)] transition-colors group-hover:text-[var(--bg)]/60">
                {CONTACT.instagram}
              </span>
            </div>

            <div className="flex items-center gap-3 text-[9px] uppercase tracking-[0.15em] text-[var(--muted)] transition-colors group-hover:text-[var(--bg)]/60">
              <span>SOCIAL / COMMUNITY / DROPS</span>

              <ArrowUpRight
                size={15}
                className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
              />
            </div>
          </a>
        </div>
      </section>

      {/* =========================================================
          ENQUIRIES
      ========================================================= */}
      <section className="bg-black text-white">
        <div className="container py-16 md:py-24">
          <div className="grid gap-14 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24">
            <div>
              <div className="eyebrow mb-5 text-white/50">
                02 / WHY ARE YOU HERE?
              </div>

              <h2 className="text-5xl font-black uppercase leading-[0.86] tracking-[-0.06em] md:text-7xl">
                PICK A
                <br />
                <span className="text-[var(--red)]">LANE.</span>
              </h2>

              <p className="mt-7 max-w-sm text-xs leading-6 text-white/50">
                Start with the closest match. It helps us route your message
                to the right place faster.
              </p>
            </div>

            <div className="divide-y divide-white/15 border-y border-white/15">
              {enquiryTypes.map(([number, title, description]) => (
                <div
                  key={number}
                  className="group grid gap-4 py-6 md:grid-cols-[55px_1fr_auto] md:items-center"
                >
                  <span className="text-[9px] font-black tracking-[0.2em] text-[var(--red)]">
                    {number}
                  </span>

                  <div>
                    <h3 className="text-lg font-black tracking-[-0.025em] md:text-2xl">
                      {title}
                    </h3>

                    <p className="mt-1 text-[10px] leading-5 text-white/45 md:text-xs">
                      {description}
                    </p>
                  </div>

                  <ArrowUpRight
                    size={18}
                    className="hidden opacity-50 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 md:block"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CONTACT FORM
      ========================================================= */}
      <section className="border-b border-[var(--line)]">
        <div className="container py-16 md:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24">
            <div>
              <div className="eyebrow mb-5">03 / DROP US A LINE</div>

              <h2 className="text-5xl font-black uppercase leading-[0.86] tracking-[-0.06em] md:text-7xl">
                SEND A
                <br />
                <span className="text-[var(--red)]">MESSAGE.</span>
              </h2>

              <p className="mt-7 max-w-sm text-xs leading-6 text-[var(--muted)]">
                Give us the details and we&apos;ll take it from there. Please
                avoid sending payment information or passwords through this
                form.
              </p>

              <div className="mt-10 border-l-2 border-[var(--red)] pl-5">
                <div className="text-[9px] font-black uppercase tracking-[0.18em]">
                  RESPONSE TIME
                </div>

                <div className="mt-2 text-xs text-[var(--muted)]">
                  Usually within 1–2 business days.
                </div>
              </div>
            </div>

            <div className="border border-[var(--line)] p-5 md:p-8 lg:p-10">
              {sent ? (
                <div className="flex min-h-[470px] flex-col justify-center">
                  <div className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--red)]">
                    MESSAGE RECEIVED
                  </div>

                  <h3 className="mt-4 text-5xl font-black uppercase leading-[0.85] tracking-[-0.06em] md:text-7xl">
                    WE&apos;LL
                    <br />
                    GET BACK.
                  </h3>

                  <p className="mt-6 max-w-md text-xs leading-6 text-[var(--muted)]">
                    Thanks for reaching out to DRAVON. This demo form currently
                    confirms the submission locally; connect it to the backend
                    before launch.
                  </p>

                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="mt-8 w-fit text-[9px] font-black uppercase tracking-[0.18em] underline underline-offset-4"
                  >
                    SEND ANOTHER MESSAGE
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-8">
                  {/* NAME + EMAIL */}
                  <div className="grid gap-8 md:grid-cols-2">
                    <label className="block">
                      <span className="field-label">NAME</span>

                      <input
                        required
                        name="name"
                        autoComplete="name"
                        className="contact-input"
                      />
                    </label>

                    <label className="block">
                      <span className="field-label">EMAIL</span>

                      <input
                        required
                        type="email"
                        name="email"
                        autoComplete="email"
                        className="contact-input"
                      />
                    </label>
                  </div>

                  {/* ORDER + REASON */}
                  <div className="grid gap-8 md:grid-cols-2">
                    <label className="block">
                      <span className="field-label">ORDER NUMBER</span>

                      <input
                        name="order"
                        placeholder="OPTIONAL"
                        className="contact-input placeholder:text-[var(--muted)]"
                      />
                    </label>

                    <label className="block">
                      <span className="field-label">REASON</span>

                      <select
                        name="reason"
                        defaultValue="General enquiry"
                        className="contact-input"
                      >
                        <option>General enquiry</option>
                        <option>Order support</option>
                        <option>Product questions</option>
                        <option>Collaboration</option>
                        <option>Wholesale</option>
                      </select>
                    </label>
                  </div>

                  {/* MESSAGE */}
                  <label className="block">
                    <span className="field-label">MESSAGE</span>

                    <textarea
                      required
                      name="message"
                      rows={7}
                      className="contact-input resize-none"
                    />
                  </label>

                  {/* SUBMIT */}
                  <button
                    type="submit"
                    className="btn btn-red flex w-full items-center justify-center gap-3 py-5"
                  >
                    SEND MESSAGE
                    <Send size={15} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FINAL CTA
      ========================================================= */}
      <section className="overflow-hidden bg-[var(--red)] text-white">
        <div className="container py-16 md:py-24">
          <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
            <div>
              <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/60">
                DRAVON / THE MOVEMENT
              </div>

              <h2 className="mt-5 text-[18vw] font-black uppercase leading-[0.7] tracking-[-0.1em] md:text-[11vw]">
                MOVE.
              </h2>
            </div>

            <div className="max-w-sm text-xs leading-6 text-white/70">
              Follow the movement, discover new drops and see how the DRAVON
              community trains, moves and evolves.

              <a
                href={CONTACT.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center font-black uppercase tracking-[0.15em] text-white underline-offset-4 transition-opacity hover:opacity-70"
              >
                {CONTACT.instagram}
                <ArrowUpRight size={13} className="ml-2" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          LOCAL STYLES
      ========================================================= */}
      <style jsx>{`
        .field-label {
          display: block;
          margin-bottom: 10px;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.18em;
        }

        .contact-input {
          width: 100%;
          border: 0;
          border-bottom: 1px solid var(--line);
          background: transparent;
          padding: 13px 0;
          font-size: 12px;
          outline: none;
          color: inherit;
          transition: border-color 180ms ease;
        }

        .contact-input:focus {
          border-color: var(--red);
        }

        select.contact-input {
          border-radius: 0;
        }

        select.contact-input option {
          background: var(--bg);
          color: var(--fg);
        }
      `}</style>
    </main>
  );
}