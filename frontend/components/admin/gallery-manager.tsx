'use client';

import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, GripVertical, ImagePlus, Plus, RefreshCw, Star, Trash2 } from 'lucide-react';
import { ANGLE_LABEL, Angle, CORE_ANGLES, EXTRA_ANGLES, GalleryImage, isAngle } from '@/lib/gallery';

const ACCEPT = 'image/jpeg,image/png,image/webp';
const MAX_MB = 10;
const MAX_IMAGES = 12;

type Updater = (current: GalleryImage[]) => GalleryImage[];

type Props = {
  images: GalleryImage[];
  productName: string;
  onChange: (update: Updater) => void;
  upload: (file: File) => Promise<{ url: string; publicId?: string }>;
  onBusyChange?: (busy: boolean) => void;
  onError: (message: string) => void;
};

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

/** Core angles keep Front, Back, Left, Right order; everything else goes after them. */
const rank = (angle?: Angle | null) => {
  const i = CORE_ANGLES.indexOf(angle as (typeof CORE_ANGLES)[number]);
  return i === -1 ? 10 : i;
};

function insertIndex(list: GalleryImage[], angle: Angle) {
  const r = rank(angle);
  const i = list.findIndex((x) => rank(x.angle) > r);
  return i === -1 ? list.length : i;
}

function validate(file: File) {
  if (!file.type.startsWith('image/')) return 'Please select an image file.';
  if (!ACCEPT.split(',').includes(file.type)) return 'Use a JPG, PNG or WEBP image.';
  if (file.size > MAX_MB * 1024 * 1024) return `Image must be ${MAX_MB} MB or smaller.`;
  return null;
}

export function GalleryManager({ images, productName, onChange, upload, onBusyChange, onError }: Props) {
  const pending = useRef(0);
  const dragKey = useRef<string | null>(null);
  const [overKey, setOverKey] = useState<string | null>(null);

  const slotImage = (angle: Angle) => images.find((x) => x.angle === angle);
  const slotKeys = new Set(CORE_ANGLES.map((a) => slotImage(a)?.key).filter(Boolean) as string[]);
  const extras = images.filter((x) => !slotKeys.has(x.key));

  const track = (delta: number) => {
    pending.current += delta;
    onBusyChange?.(pending.current > 0);
  };

  async function ingest(file: File, angle: Angle, replaceKey?: string) {
    const problem = validate(file);
    if (problem) return onError(problem);

    const previous = replaceKey ? images.find((x) => x.key === replaceKey) : undefined;
    const key = replaceKey ?? uid();
    const preview = URL.createObjectURL(file);

    onChange((cur) => {
      if (replaceKey) {
        return cur.map((x) => (x.key === replaceKey ? { ...x, url: preview, uploading: true } : x));
      }
      const next = [...cur];
      next.splice(insertIndex(cur, angle), 0, { key, url: preview, angle, altText: '', uploading: true });
      return next;
    });

    track(1);
    try {
      const result = await upload(file);
      onChange((cur) =>
        cur.map((x) => (x.key === key ? { ...x, url: result.url, publicId: result.publicId, uploading: false } : x))
      );
    } catch (error) {
      onChange((cur) =>
        previous
          ? cur.map((x) => (x.key === key ? { ...previous, uploading: false } : x))
          : cur.filter((x) => x.key !== key)
      );
      onError(error instanceof Error ? error.message : 'Upload failed.');
    } finally {
      URL.revokeObjectURL(preview);
      track(-1);
    }
  }

  async function addExtras(files: File[]) {
    let room = MAX_IMAGES - images.length;
    for (const file of files) {
      if (room <= 0) return onError(`A product can have up to ${MAX_IMAGES} images.`);
      room -= 1;
      await ingest(file, 'detail');
    }
  }

  const remove = (key: string) => onChange((cur) => cur.filter((x) => x.key !== key));

  const setMain = (key: string) =>
    onChange((cur) => {
      const found = cur.find((x) => x.key === key);
      return found ? [found, ...cur.filter((x) => x.key !== key)] : cur;
    });

  const setAngle = (key: string, angle: Angle) =>
    onChange((cur) => cur.map((x) => (x.key === key ? { ...x, angle } : x)));

  const reorder = (fromKey: string, toKey: string) =>
    onChange((cur) => {
      const from = cur.findIndex((x) => x.key === fromKey);
      const to = cur.findIndex((x) => x.key === toKey);
      if (from < 0 || to < 0 || from === to) return cur;
      const next = [...cur];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });

  const nudge = (key: string, delta: number) =>
    onChange((cur) => {
      const from = cur.findIndex((x) => x.key === key);
      const to = from + delta;
      if (from < 0 || to < 0 || to >= cur.length) return cur;
      const next = [...cur];
      [next[from], next[to]] = [next[to], next[from]];
      return next;
    });

  const filePicker = (onFiles: (files: File[]) => void, multiple = false) => (
    <input
      type="file"
      accept={ACCEPT}
      multiple={multiple}
      className="hidden"
      onChange={(e) => {
        const files = Array.from(e.target.files || []);
        e.currentTarget.value = '';
        if (files.length) onFiles(files);
      }}
    />
  );

  const mainKey = images[0]?.key;

  return (
    <div className="mt-8 border-t border-white/10 pt-6">
      <div className="flex justify-between items-start gap-4">
        <div>
          <div className="text-[9px] tracking-[.18em] font-bold">PRODUCT GALLERY</div>
          <div className="text-[9px] text-white/35 mt-1">
            Shown to customers as a slider on this product only. The first image in the slide order is the main image.
          </div>
        </div>
        <div className="text-[9px] text-white/40 whitespace-nowrap">{images.length} / {MAX_IMAGES}</div>
      </div>

      {/* CORE ANGLES */}
      <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
        {CORE_ANGLES.map((angle, i) => {
          const img = slotImage(angle);
          return (
            <div key={angle}>
              <div className="flex justify-between text-[8px] tracking-[.16em] text-white/50 mb-1.5">
                <span>0{i + 1} · {ANGLE_LABEL[angle]}</span>
                {img && img.key === mainKey && <span className="text-white">MAIN</span>}
              </div>

              {img ? (
                <div className="relative aspect-[3/4] bg-black border border-white/10 overflow-hidden group">
                  <img src={img.url} alt={`${productName} ${ANGLE_LABEL[angle]}`} className="w-full h-full object-cover" draggable={false} />
                  {img.uploading && (
                    <div className="absolute inset-0 bg-black/60 grid place-items-center text-[9px] tracking-[.14em]">UPLOADING…</div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 flex justify-end gap-1 p-1.5 bg-gradient-to-t from-black/80 to-transparent">
                    {img.key !== mainKey && !img.uploading && (
                      <button type="button" onClick={() => setMain(img.key)} title="Make main image" className="p-1.5 bg-black/70 border border-white/20 hover:bg-white hover:text-black">
                        <Star size={12} />
                      </button>
                    )}
                    <label title="Replace image" className="p-1.5 bg-black/70 border border-white/20 hover:bg-white hover:text-black cursor-pointer">
                      <RefreshCw size={12} />
                      {filePicker(([file]) => ingest(file, angle, img.key))}
                    </label>
                    <button type="button" onClick={() => remove(img.key)} title="Delete image" className="p-1.5 bg-black/70 border border-red-900 text-red-400 hover:bg-red-600 hover:text-white">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ) : (
                <label className="aspect-[3/4] border border-dashed border-white/20 hover:border-white/50 hover:bg-white/[.03] grid place-items-center text-center cursor-pointer p-2">
                  <span>
                    <ImagePlus size={18} className="mx-auto text-white/50" />
                    <span className="block text-[9px] tracking-[.14em] mt-2">ADD {ANGLE_LABEL[angle]}</span>
                    {angle === 'front' && <span className="block text-[8px] text-white/35 mt-1">Main image</span>}
                  </span>
                  {filePicker(([file]) => ingest(file, angle))}
                </label>
              )}
            </div>
          );
        })}
      </div>

      {/* EXTRA IMAGES */}
      <div className="mt-6 flex justify-between items-center">
        <div>
          <div className="text-[9px] tracking-[.18em] font-bold">MORE IMAGES</div>
          <div className="text-[9px] text-white/35 mt-1">Fabric details, logos, close-ups and lifestyle photographs.</div>
        </div>
        <label className="text-[9px] border border-white/15 px-3 py-2 cursor-pointer hover:bg-white/5">
          <Plus size={12} className="inline mr-1" />ADD IMAGES
          {filePicker((files) => addExtras(files), true)}
        </label>
      </div>

      {extras.length > 0 && (
        <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
          {extras.map((img) => {
            const current = isAngle(img.angle) ? img.angle : undefined;
            const options: Angle[] = [...CORE_ANGLES.filter((a) => !slotImage(a)), ...EXTRA_ANGLES];
            return (
              <div key={img.key} className="border border-white/10 p-2">
                <div className="relative aspect-square bg-black overflow-hidden">
                  <img src={img.url} alt={img.altText || productName} className="w-full h-full object-cover" draggable={false} />
                  {img.uploading && <div className="absolute inset-0 bg-black/60 grid place-items-center text-[9px] tracking-[.14em]">UPLOADING…</div>}
                  {img.key === mainKey && <span className="absolute top-1 left-1 bg-white text-black text-[8px] font-bold px-1.5 py-0.5">MAIN</span>}
                </div>
                <select
                  value={current || ''}
                  onChange={(e) => setAngle(img.key, e.target.value as Angle)}
                  className="input mt-2 !py-1.5 text-[9px]"
                  aria-label="Image angle"
                >
                  {!current && <option value="" disabled>UNLABELLED</option>}
                  {current && !options.includes(current) && <option value={current}>{ANGLE_LABEL[current]}</option>}
                  {options.map((a) => <option key={a} value={a}>{ANGLE_LABEL[a]}</option>)}
                </select>
                <div className="flex justify-end gap-1 mt-2">
                  {img.key !== mainKey && !img.uploading && (
                    <button type="button" onClick={() => setMain(img.key)} title="Make main image" className="p-1.5 border border-white/20 hover:bg-white hover:text-black"><Star size={12} /></button>
                  )}
                  <label title="Replace image" className="p-1.5 border border-white/20 hover:bg-white hover:text-black cursor-pointer">
                    <RefreshCw size={12} />
                    {filePicker(([file]) => ingest(file, current || 'detail', img.key))}
                  </label>
                  <button type="button" onClick={() => remove(img.key)} title="Delete image" className="p-1.5 border border-red-900 text-red-400 hover:bg-red-600 hover:text-white"><Trash2 size={12} /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SLIDE ORDER */}
      {images.length > 1 && (
        <div className="mt-6">
          <div className="text-[9px] tracking-[.18em] font-bold">SLIDE ORDER</div>
          <div className="text-[9px] text-white/35 mt-1">Drag to reorder, or use the arrows. This is the order customers swipe through.</div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
            {images.map((img, index) => (
              <div
                key={img.key}
                draggable
                onDragStart={(e) => { dragKey.current = img.key; e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', img.key); }}
                onDragOver={(e) => { e.preventDefault(); setOverKey(img.key); }}
                onDragLeave={() => setOverKey((k) => (k === img.key ? null : k))}
                onDrop={(e) => { e.preventDefault(); const from = dragKey.current; dragKey.current = null; setOverKey(null); if (from) reorder(from, img.key); }}
                onDragEnd={() => { dragKey.current = null; setOverKey(null); }}
                className={`shrink-0 w-[86px] border p-1 cursor-grab active:cursor-grabbing ${overKey === img.key ? 'border-white' : 'border-white/10'}`}
              >
                <div className="relative aspect-[3/4] bg-black overflow-hidden">
                  <img src={img.url} alt="" className="w-full h-full object-cover" draggable={false} />
                  <span className="absolute top-0.5 left-0.5 bg-black/80 text-[8px] px-1">{index + 1}</span>
                  <GripVertical size={12} className="absolute top-0.5 right-0.5 text-white/70" />
                </div>
                <div className="text-[7px] tracking-[.1em] text-white/50 mt-1 truncate">
                  {index === 0 ? 'MAIN · ' : ''}{isAngle(img.angle) ? ANGLE_LABEL[img.angle] : 'UNLABELLED'}
                </div>
                <div className="flex justify-between mt-1">
                  <button type="button" disabled={index === 0} onClick={() => nudge(img.key, -1)} className="p-0.5 border border-white/15 disabled:opacity-25" aria-label="Move earlier"><ChevronLeft size={11} /></button>
                  <button type="button" disabled={index === images.length - 1} onClick={() => nudge(img.key, 1)} className="p-0.5 border border-white/15 disabled:opacity-25" aria-label="Move later"><ChevronRight size={11} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-[8px] text-white/30 mt-3">JPG, PNG, WEBP · MAX {MAX_MB} MB each · uploaded to Cloudinary</div>
    </div>
  );
}
