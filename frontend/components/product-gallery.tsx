'use client';

import Image from 'next/image';
import { KeyboardEvent, PointerEvent, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { ANGLE_LABEL, Slide } from '@/lib/gallery';

const SWIPE_THRESHOLD = 50;

export function ProductGallery({ slides, name }: { slides: Slide[]; name: string }) {
  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
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
    if ((e.target as HTMLElement).closest('button') || (e.pointerType === 'mouse' && e.button !== 0)) return;
    start.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
    axis.current = null;
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const s = start.current;
    if (!s || s.id !== e.pointerId) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;

    if (count > 1 && !axis.current && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) {
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
    const dy = e.clientY - s.y;
    if (axis.current === 'x' && Math.abs(dx) > SWIPE_THRESHOLD) go(index + (dx < 0 ? 1 : -1));
    // A tap or click (no real movement) opens the full-screen zoom view.
    else if (!axis.current && e.type === 'pointerup' && Math.abs(dx) < 6 && Math.abs(dy) < 6) setZoomOpen(true);
    start.current = null;
    axis.current = null;
    setDragging(false);
    setDragX(0);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1); }
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setZoomOpen(true); }
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
          className="relative overflow-hidden bg-[var(--surface)] select-none outline-none cursor-zoom-in focus-visible:ring-2 focus-visible:ring-[var(--red)]"
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

      {zoomOpen && (
        <Lightbox slides={slides} index={index} name={name} onIndex={setIndex} onClose={() => setZoomOpen(false)} />
      )}
    </div>
  );
}

/** Full-screen viewer: click or tap the photo to zoom, move the pointer to pan, swipe or use arrows to change image. */
function Lightbox({ slides, index, name, onIndex, onClose }: {
  slides: Slide[]; index: number; name: string; onIndex: (i: number) => void; onClose: () => void;
}) {
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState('50% 50%');
  const touchX = useRef<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const count = slides.length;
  const slide = slides[index];

  const go = (next: number) => { setZoomed(false); setOrigin('50% 50%'); onIndex(((next % count) + count) % count); };
  const track = (e: { currentTarget: HTMLElement; clientX: number; clientY: number }) => {
    const r = e.currentTarget.getBoundingClientRect();
    setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
  };

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => { document.body.style.overflow = previous; };
  }, []);

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(index + 1);
      if (e.key === 'ArrowLeft') go(index - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, count]);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${name} images`}
      className="fixed inset-0 z-[200] bg-black/95 text-white"
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touchX.current === null || zoomed || count < 2) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > SWIPE_THRESHOLD) go(index + (dx < 0 ? 1 : -1));
      }}
    >
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between p-4 text-[10px] font-bold tracking-[.16em]">
        <span>{slide.angle ? `${ANGLE_LABEL[slide.angle]} · ` : ''}{index + 1} / {count}</span>
        <button ref={closeRef} type="button" onClick={onClose} aria-label="Close" className="h-10 w-10 grid place-items-center border border-white/30 hover:bg-white hover:text-black">
          <X size={18} />
        </button>
      </div>

      <div
        className={`absolute inset-0 overflow-hidden ${zoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
        onClick={(e) => { track(e); setZoomed((z) => !z); }}
        onMouseMove={(e) => { if (zoomed) track(e); }}
      >
        <div
          className="relative h-full w-full"
          style={{ transform: zoomed ? 'scale(2.2)' : 'scale(1)', transformOrigin: origin, transition: 'transform .3s ease' }}
        >
          <Image key={slide.url} src={slide.url} alt={slide.alt} fill sizes="100vw" quality={90} className="object-contain p-4 md:p-10" draggable={false} />
        </div>
      </div>

      {count > 1 && (
        <>
          <button type="button" onClick={() => go(index - 1)} aria-label="Previous image" className="absolute left-3 top-1/2 -translate-y-1/2 h-11 w-11 grid place-items-center border border-white/30 bg-black/60 hover:bg-white hover:text-black">
            <ChevronLeft size={20} />
          </button>
          <button type="button" onClick={() => go(index + 1)} aria-label="Next image" className="absolute right-3 top-1/2 -translate-y-1/2 h-11 w-11 grid place-items-center border border-white/30 bg-black/60 hover:bg-white hover:text-black">
            <ChevronRight size={20} />
          </button>
        </>
      )}
    </div>,
    document.body
  );
}
