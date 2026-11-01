'use client';

import Image from 'next/image';
import { KeyboardEvent, PointerEvent, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ANGLE_LABEL, Slide } from '@/lib/gallery';

const SWIPE_THRESHOLD = 50;

export function ProductGallery({ slides, name }: { slides: Slide[]; name: string }) {
  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const start = useRef<{ x: number; y: number; id: number } | null>(null);
  const axis = useRef<'x' | 'y' | null>(null);
  const thumbs = useRef<HTMLDivElement>(null);
  const count = slides.length;

  // Reset when navigating between products.
  useEffect(() => { setIndex(0); setDragX(0); }, [slides[0]?.url, count]);

  // Keep the active thumbnail in view.
  useEffect(() => {
    const el = thumbs.current?.children[index] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
  }, [index]);

  if (count === 0) {
    return <div className="aspect-[.78] bg-[var(--surface)] grid place-items-center text-[10px] tracking-[.16em] text-[var(--muted)]">NO IMAGE</div>;
  }

  const go = (next: number) => setIndex(((next % count) + count) % count);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (count < 2 || (e.pointerType === 'mouse' && e.button !== 0)) return;
    start.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
    axis.current = null;
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const s = start.current;
    if (!s || s.id !== e.pointerId) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;

    if (!axis.current && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) {
      axis.current = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      if (axis.current === 'x') {
        e.currentTarget.setPointerCapture(e.pointerId);
        setDragging(true);
      }
    }
    if (axis.current === 'x') setDragX(dx);
  };

  const finish = (e: PointerEvent<HTMLDivElement>) => {
    const s = start.current;
    if (!s || s.id !== e.pointerId) return;
    const dx = e.clientX - s.x;
    if (axis.current === 'x' && Math.abs(dx) > SWIPE_THRESHOLD) go(index + (dx < 0 ? 1 : -1));
    start.current = null;
    axis.current = null;
    setDragging(false);
    setDragX(0);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1); }
  };

  const active = slides[index];

  return (
    <div className="grid md:grid-cols-[72px_1fr] gap-3 md:gap-4 items-start">
      {/* Thumbnails: vertical column on desktop, row under the image on mobile */}
      {count > 1 && (
        <div
          ref={thumbs}
          className="order-2 md:order-1 flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[640px] pb-1 md:pb-0 md:pr-1"
          role="tablist"
          aria-label={`${name} images`}
        >
          {slides.map((s, i) => (
            <button
              key={s.url + i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={s.angle ? `Show ${ANGLE_LABEL[s.angle].toLowerCase()} view` : `Show image ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`relative shrink-0 w-[60px] md:w-full aspect-[.78] bg-[var(--surface)] overflow-hidden border transition ${i === index ? 'border-[var(--fg)]' : 'border-transparent opacity-60 hover:opacity-100'}`}
            >
              <Image src={s.url} alt="" fill sizes="72px" className="object-cover" draggable={false} />
            </button>
          ))}
        </div>
      )}

      {/* Main slider */}
      <div className="order-1 md:order-2 relative">
        <div
          className="relative overflow-hidden bg-[var(--surface)] select-none outline-none focus-visible:ring-2 focus-visible:ring-[var(--red)]"
          style={{ touchAction: 'pan-y' }}
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label={`${name} gallery`}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={finish}
          onPointerCancel={finish}
        >
          <div
            className="flex"
            style={{
              transform: `translateX(calc(${-index * 100}% + ${dragX}px))`,
              transition: dragging ? 'none' : 'transform .45s cubic-bezier(.22,.8,.24,1)',
            }}
          >
            {slides.map((s, i) => (
              <div key={s.url + i} className="relative aspect-[.78] w-full shrink-0 grow-0 basis-full" aria-hidden={i !== index}>
                <Image
                  src={s.url}
                  alt={s.alt}
                  fill
                  priority={i === 0}
                  sizes="(max-width:768px) 100vw, (max-width:1024px) 90vw, 46vw"
                  className="object-cover pointer-events-none"
                  draggable={false}
                />
              </div>
            ))}
          </div>

          {count > 1 && (
            <>
              <button type="button" onClick={() => go(index - 1)} aria-label="Previous image" className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 grid place-items-center bg-[var(--bg)]/85 hover:bg-[var(--bg)] border border-[var(--line)] backdrop-blur">
                <ChevronLeft size={18} />
              </button>
              <button type="button" onClick={() => go(index + 1)} aria-label="Next image" className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 grid place-items-center bg-[var(--bg)]/85 hover:bg-[var(--bg)] border border-[var(--line)] backdrop-blur">
                <ChevronRight size={18} />
              </button>
            </>
          )}

          <div className="absolute left-3 bottom-3 flex items-center gap-2 text-[9px] font-bold tracking-[.16em]">
            {active.angle && <span className="bg-[var(--bg)]/85 backdrop-blur px-2 py-1">{ANGLE_LABEL[active.angle]}</span>}
            {count > 1 && <span className="bg-[var(--bg)]/85 backdrop-blur px-2 py-1">{index + 1} / {count}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
