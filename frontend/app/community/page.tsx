import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Quote,
} from 'lucide-react';

const gallery = [
  {
    id: 'photo-1534438327276-14e5300c3a48',
    alt: 'Athlete training in the DRAVON community',
  },
  {
    id: 'photo-1549060279-7e168fcee0c2',
    alt: 'Athlete training outdoors',
  },
  {
    id: 'photo-1517836357463-d25dfeac3438',
    alt: 'Strength training athlete',
  },
  {
    id: 'photo-1583454110551-21f2fa2afe61',
    alt: 'Athlete performing a workout',
  },
  {
    id: 'photo-1599058917765-a780eda07a3e',
    alt: 'Performance training',
  },
  {
    id: 'photo-1538805060514-97d9cc17730c',
    alt: 'Street workout athlete',
  },
  {
    id: 'photo-1581009146145-b5ef050c2e1e',
    alt: 'Calisthenics training',
  },
  {
    id: 'photo-1571019613454-1cb2f99b2d8b',
    alt: 'Athlete training in the gym',
  },
];

const principles = [
  {
    number: '01',
    title: 'SHOW UP',
    description:
      'Consistency beats intensity when intensity is occasional.',
  },
  {
    number: '02',
    title: 'EARN CONTROL',
    description:
      'Strength means nothing without the ability to control it.',
  },
  {
    number: '03',
    title: 'RESPECT THE PROCESS',
    description:
      'Progress is built through repetitions nobody else sees.',
  },
];

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-[15px] w-[15px]"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle
        cx="17.5"
        cy="6.5"
        r="1"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

export default function CommunityPage() {
  return (
    <main className="overflow-hidden">
      {/* HERO */}
      <section className="relative flex min-h-[82vh] items-end overflow-hidden border-b border-[var(--line)] bg-black">
        <Image
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=2400&q=88"
          alt="DRAVON training community"
          fill
          priority
          sizes="100vw"
          className="scale-[1.02] object-cover"
        />

        {/* Image treatment */}
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

        <div className="container relative z-10 pb-12 text-white md:pb-20">
          <div className="eyebrow">
            <span className="redline" />
            DRAVON COMMUNITY
          </div>

          <h1 className="mt-5 text-[18vw] font-black leading-[0.75] tracking-[-0.095em] md:text-[11vw]">
            WE
            <br />
            <span className="text-[var(--red)]">MOVE.</span>
          </h1>

          <div className="mt-9 flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
            <p className="max-w-xl text-sm leading-7 text-white/65 md:text-base">
              Not spectators. Not followers. A community built around
              training, movement and becoming harder to stop.
            </p>

            <Link
              href="#movement"
              className="btn border-white/25 text-white transition-colors hover:bg-white hover:text-black"
            >
              ENTER THE COMMUNITY
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* THE CODE */}
      <section
        id="movement"
        className="container py-20 md:py-28"
      >
        <div className="grid gap-12 md:grid-cols-[0.7fr_1.3fr] md:gap-20">
          <div>
            <div className="eyebrow">
              <span className="redline" />
              THE CODE
            </div>

            <h2 className="mt-4 text-5xl font-black leading-[0.88] tracking-[-0.075em] md:text-7xl">
              NO
              <br />
              SHORTCUTS.
            </h2>

            <p className="mt-7 max-w-sm text-sm leading-6 text-[var(--muted)]">
              The DRAVON mindset isn't complicated. Train with intent.
              Build discipline. Stay in control.
            </p>
          </div>

          <div className="grid gap-px border border-[var(--line)] bg-[var(--line)]">
            {principles.map((principle) => (
              <div
                key={principle.number}
                className="bg-[var(--bg)] p-7 transition-colors hover:bg-[var(--surface)] md:p-9"
              >
                <div className="grid gap-5 md:grid-cols-[70px_1fr]">
                  <div className="text-xs font-black text-[var(--red)]">
                    {principle.number}
                  </div>

                  <div>
                    <h3 className="text-sm font-black tracking-[0.12em]">
                      {principle.title}
                    </h3>

                    <p className="mt-3 max-w-xl text-xs leading-6 text-[var(--muted)] md:text-sm">
                      {principle.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMUNITY FEED */}
      <section className="bg-[var(--surface)] py-16 md:py-24">
        <div className="container">
          <div className="mb-9 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="eyebrow">
                <span className="redline" />
                FROM THE MOVEMENT
              </div>

              <h2 className="mt-3 text-4xl font-black tracking-[-0.065em] md:text-6xl">
                THE FEED.
              </h2>
            </div>

            {/* INSTAGRAM */}
            <a
              href="https://instagram.com/dravonindia_official"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow DRAVON on Instagram"
              className="group flex w-fit items-center gap-3 text-[10px] font-bold tracking-[0.16em] transition-opacity hover:opacity-60"
            >
              <InstagramIcon />

              <span>@DRAVONINDIA_OFFICIAL</span>

              <ArrowUpRight
                size={13}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </div>

          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {gallery.map((item, index) => (
              <div
                key={item.id}
                className={`group relative overflow-hidden bg-black ${
                  index === 2 || index === 5
                    ? 'aspect-[0.75] md:row-span-2'
                    : 'aspect-square'
                }`}
              >
                <Image
                  src={`https://images.unsplash.com/${item.id}?auto=format&fit=crop&w=1000&q=85`}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/20" />

                {index === 0 && (
                  <div className="absolute left-3 top-3 bg-black/75 px-2.5 py-1.5 text-[8px] font-bold tracking-[0.18em] text-white backdrop-blur-sm">
                    DRAVON
                  </div>
                )}

                <div className="absolute bottom-3 right-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black">
                    <ArrowUpRight size={14} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MINDSET QUOTE */}
      <section className="container py-24 md:py-32">
        <div className="mx-auto max-w-5xl text-center">
          <Quote
            className="mx-auto text-[var(--red)]"
            size={30}
            strokeWidth={1.5}
          />

          <p className="mt-7 text-3xl font-black leading-[0.98] tracking-[-0.055em] md:text-6xl">
            THE GOAL IS NOT TO LOOK STRONG.
            <br />
            <span className="text-[var(--muted)]">
              IT IS TO BECOME HARD TO BREAK.
            </span>
          </p>

          <div className="mt-9 text-[9px] font-bold tracking-[0.22em] text-[var(--muted)]">
            THE DRAVON MINDSET
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[var(--fg)] text-[var(--bg)]">
        <div className="container flex flex-col gap-9 py-16 md:flex-row md:items-center md:justify-between md:py-20">
          <div>
            <div className="text-[9px] font-bold tracking-[0.22em] text-[var(--red)]">
              YOUR TURN
            </div>

            <h2 className="mt-3 text-4xl font-black tracking-[-0.065em] md:text-6xl">
              TRAIN.
              <br className="sm:hidden" /> TAG. REPEAT.
            </h2>
          </div>

          <Link
            href="/shop"
            className="btn btn-red w-fit"
          >
            SHOP THE GEAR
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </main>
  );
}