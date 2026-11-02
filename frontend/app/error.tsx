'use client';

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="container flex min-h-[50vh] flex-col items-center justify-center py-24 text-center">
      <div className="text-xs font-black tracking-[0.16em]">SOMETHING WENT WRONG</div>
      <p className="mt-2 max-w-sm text-[10px] leading-5 text-[var(--muted)]">
        The store could not load this page right now. Please try again in a moment.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 border border-[var(--line)] px-5 py-3 text-[9px] font-black tracking-[0.14em] transition hover:bg-[var(--fg)] hover:text-[var(--bg)]"
      >
        TRY AGAIN
      </button>
    </main>
  );
}
