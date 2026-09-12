'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  BarChart3, Check, Edit3, Eye, EyeOff, Image as ImageIcon, IndianRupee, LayoutDashboard,
  LogOut, Package, Plus, RefreshCw, Search, ShoppingBag, Trash2, Users, X,
} from 'lucide-react';

const API = '/api';
const ADMIN_EMAIL = 'admin@dravon.in';

type Variant = { id?: string; sku: string; color: string; size: string; stock: number };
type Product = {
  id: string; name: string; slug: string; description?: string; price: number | string; mrp?: number | string;
  published: boolean; featured: boolean; images?: { id?: string; url: string; altText?: string }[]; variants?: Variant[];
};

const emptyProduct: Omit<Product, 'id'> = {
  name: '', slug: '', description: '', price: 0, mrp: 0, published: false, featured: false,
  images: [], variants: [{ sku: '', color: 'Black', size: 'M', stock: 0 }],
};

function stockLabel(stock: number) {
  const n = Number(stock) || 0;
  if (n <= 0) return 'SOLD OUT';
  return n <= 10 ? `${n} left` : '';
}

function sizeAvailability(variants: Variant[] = []) {
  const groups = new Map<string, Variant[]>();
  for (const variant of variants) {
    const color = variant.color?.trim() || 'Default';
    const list = groups.get(color) || [];
    list.push(variant);
    groups.set(color, list);
  }
  return Array.from(groups.entries()).map(([color, list]) => ({
    color,
    sizes: list.map((v) => {
      const status = stockLabel(v.stock);
      return `${v.size}${status ? ` — ${status}` : ''}`;
    }),
  }));
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [tab, setTab] = useState<'dashboard' | 'products' | 'orders' | 'media'>('dashboard');
  const [dashboard, setDashboard] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [editor, setEditor] = useState<(Omit<Product, 'id'> & { id?: string }) | null>(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [uploadingImage, setUploadingImage] = useState<number | null>(null);

  async function api(path: string, options: RequestInit = {}) {
    return fetch(`${API}${path}`, { ...options, credentials: 'include', headers: { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(options.headers || {}) } });
  }

  async function loadAll() {
    setChecking(true);
    const me = await api('/auth/me');
    if (!me.ok) { setAuthenticated(false); setChecking(false); return; }
    setAuthenticated(true);
    const [d, p] = await Promise.all([
      api('/admin/dashboard').then((r) => r.json()),
      api(`/products?q=${encodeURIComponent(query)}`).then((r) => r.json()),
    ]);
    setDashboard(d);
    setProducts(Array.isArray(p) ? p : []);
    setChecking(false);
  }

  useEffect(() => { loadAll(); }, [query]);

  async function login(event: FormEvent) {
    event.preventDefault(); setError('');
    const response = await api('/auth/login', { method: 'POST', body: JSON.stringify({ email: ADMIN_EMAIL, password }) });
    if (!response.ok) { setError('Invalid admin email or password.'); return; }
    setPassword(''); await loadAll();
  }

  async function logout() {
    await api('/auth/logout', { method: 'POST' });
    setAuthenticated(false); setDashboard(null); setProducts([]);
  }

  async function loadOrders() {
    const response = await api('/admin/orders');
    if (response.ok) setOrders(await response.json());
  }

  function openNew() {
    setEditor({ ...emptyProduct, variants: [{ sku: `DRV-${Date.now()}`, color: 'Black', size: 'M', stock: 0 }] });
  }

  function openEdit(product: Product) {
    setEditor({
      ...product,
      price: Number(product.price), mrp: Number(product.mrp || 0),
      images: (product.images || []).map((x) => ({ url: x.url, altText: x.altText || '' })),
      variants: (product.variants || []).map((v) => ({ sku: v.sku, color: v.color, size: v.size, stock: Number(v.stock) })),
    });
  }

  function updateEditor<K extends keyof Product>(key: K, value: Product[K]) {
    setEditor((current) => current ? { ...current, [key]: value } : current);
  }

  async function uploadProductImage(index: number, file: File) {
    if (!editor) return;

    if (!file.type.startsWith('image/')) {
      setNotice('Please select an image file.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setNotice('Image must be 10 MB or smaller.');
      return;
    }

    setUploadingImage(index);
    setNotice('Preparing Cloudinary upload...');

    try {
      const signatureResponse = await api('/media/cloudinary-signature');
      const signatureData = await signatureResponse.json().catch(() => ({}));

      if (!signatureResponse.ok) {
        throw new Error(signatureData.message || 'Cloudinary is not configured.');
      }

      const form = new FormData();
      form.append('file', file);
      form.append('api_key', signatureData.apiKey);
      form.append('timestamp', String(signatureData.timestamp));
      form.append('folder', signatureData.folder);
      form.append('signature', signatureData.signature);

      const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/auto/upload`,
        { method: 'POST', body: form }
      );
      const cloudinaryData = await cloudinaryResponse.json().catch(() => ({}));

      if (!cloudinaryResponse.ok || !cloudinaryData.secure_url) {
        throw new Error(cloudinaryData.error?.message || 'Cloudinary upload failed.');
      }

      const images = [...(editor.images || [])];
      images[index] = {
        ...images[index],
        url: cloudinaryData.secure_url,
        altText: images[index]?.altText || editor.name || '',
      };
      setEditor({ ...editor, images });
      setNotice('Image uploaded to Cloudinary.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Cloudinary upload failed.');
    } finally {
      setUploadingImage(null);
    }
  }

  async function saveProduct(event: FormEvent) {
    event.preventDefault(); if (!editor) return; setSaving(true); setNotice('');
    const payload = {
      name: editor.name.trim(), slug: editor.slug.trim(), description: editor.description || '',
      price: Number(editor.price), mrp: Number(editor.mrp || 0), published: !!editor.published, featured: !!editor.featured,
      images: (editor.images || []).filter((x) => x.url.trim()).map((x) => ({ url: x.url.trim(), altText: x.altText || '' })),
      variants: (editor.variants || []).filter((v) => v.sku.trim() && v.color.trim() && v.size.trim()).map((v) => ({ sku: v.sku.trim(), color: v.color.trim(), size: v.size.trim(), stock: Math.max(0, Number(v.stock) || 0) })),
    };
    const response = editor.id
      ? await api(`/products/${editor.id}`, { method: 'PUT', body: JSON.stringify(payload) })
      : await api('/products', { method: 'POST', body: JSON.stringify(payload) });
    if (!response.ok) { const data = await response.json().catch(() => ({})); setNotice(data.message || 'Could not save product.'); setSaving(false); return; }
    setEditor(null); setNotice(editor.id ? 'Product updated.' : 'Product created.'); setSaving(false); await loadAll();
  }

  async function deleteProduct(product: Product) {
    if (!confirm(`Delete “${product.name}”? This cannot be undone.`)) return;
    const response = await api(`/products/${product.id}`, { method: 'DELETE' });
    if (!response.ok) { setNotice('Delete failed.'); return; }
    setNotice(`${product.name} deleted.`); await loadAll();
  }

  const totalStock = useMemo(() => products.reduce((sum, p) => sum + (p.variants || []).reduce((s, v) => s + Number(v.stock), 0), 0), [products]);

  if (checking) return <main className="min-h-screen bg-[#050505] text-white grid place-items-center"><RefreshCw className="animate-spin" size={20} /></main>;

  if (!authenticated) return (
    <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6">
      <form onSubmit={login} className="w-full max-w-sm border border-white/15 p-7">
        <div className="font-black tracking-[.2em] text-xl">DRAVON ADMIN</div>
        <div className="text-[9px] tracking-[.2em] text-white/50 mt-2">CONTROL THE MOVEMENT</div>
        <div className="relative mt-8">
          <input value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-transparent border border-white/20 p-3 pr-11 text-xs outline-none" placeholder="PASSWORD" type={showPassword ? 'text' : 'password'} autoComplete="current-password" />
          <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-0 top-0 h-full w-11 grid place-items-center text-white/45 hover:text-white" aria-label={showPassword ? 'Hide password' : 'Show password'}>
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        <button className="w-full bg-[#8b0000] py-3 mt-4 text-[10px] tracking-[.18em] font-bold">ENTER CONTROL ROOM</button>
        {error && <p className="text-red-400 text-xs mt-3">{error}</p>}
        <p className="text-[9px] text-white/30 mt-6 leading-relaxed">Admin credentials are controlled by the backend environment. Do not share the password with customers.</p>
      </form>
    </main>
  );

  const nav = [
    ['dashboard', 'DASHBOARD', LayoutDashboard], ['products', 'PRODUCTS', Package],
    ['orders', 'ORDERS', ShoppingBag], ['media', 'MEDIA', ImageIcon],
  ] as const;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="flex min-h-screen">
        <aside className="w-56 border-r border-white/10 p-5 hidden md:flex md:flex-col fixed inset-y-0 left-0 bg-[#0a0a0a]">
          <div className="font-black tracking-[.2em]">DRAVON</div>
          <div className="text-[8px] tracking-[.2em] text-white/40 mt-1">ADMIN CONTROL</div>
          <div className="mt-10 space-y-1">
            {nav.map(([key, label, Icon]) => <button key={key} onClick={() => { setTab(key); if (key === 'orders') loadOrders(); }} className={`w-full text-left p-3 text-[9px] tracking-[.16em] flex gap-3 items-center ${tab === key ? 'bg-white text-black' : 'text-white/70 hover:bg-white/5'}`}><Icon size={14} />{label}</button>)}
          </div>
          <div className="mt-auto space-y-3">
            <a href="/" className="block text-[9px] text-white/45 hover:text-white">← VIEW STORE</a>
            <button onClick={logout} className="text-[9px] flex gap-2 items-center"><LogOut size={13} />LOG OUT</button>
          </div>
        </aside>

        <section className="flex-1 md:ml-56 p-5 md:p-8 overflow-auto">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div><div className="text-[9px] tracking-[.2em] text-white/40">DRAVON / ADMIN</div><h1 className="text-3xl md:text-5xl font-black mt-2">{tab.toUpperCase()}.</h1></div>
            <div className="flex gap-2">
              <button onClick={loadAll} className="border border-white/15 px-3 py-3 text-[9px] tracking-[.15em]"><RefreshCw size={13} className="inline mr-2" />REFRESH</button>
              {tab === 'products' && <button onClick={openNew} className="bg-[#8b0000] px-4 py-3 text-[9px] font-bold tracking-[.16em]"><Plus size={13} className="inline mr-2" />ADD PRODUCT</button>}
            </div>
          </div>

          {notice && <div className="mt-5 border border-white/10 bg-white/[.03] px-4 py-3 text-xs flex justify-between"><span>{notice}</span><button onClick={() => setNotice('')}><X size={14} /></button></div>}

          {tab === 'dashboard' && dashboard && <div className="mt-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                ['REVENUE', `₹${Number(dashboard.revenue || 0).toLocaleString('en-IN')}`, IndianRupee],
                ['ORDERS', dashboard.orders, ShoppingBag], ['PRODUCTS', dashboard.products, Package], ['LOW STOCK', dashboard.lowStock, BarChart3],
              ].map(([label, value, Icon]: any) => <div key={label} className="border border-white/10 p-5 bg-white/[.03]"><Icon size={16} /><div className="text-[9px] tracking-[.16em] text-white/45 mt-7">{label}</div><div className="text-2xl font-black mt-1">{value}</div></div>)}
            </div>
            <div className="mt-5 grid md:grid-cols-2 gap-3">
              <div className="border border-white/10 p-5"><div className="text-[9px] tracking-[.16em] text-white/40">CURRENT CATALOG STOCK</div><div className="text-3xl font-black mt-2">{totalStock}</div><div className="text-[10px] text-white/40 mt-1">Units across all variants</div></div>
              <div className="border border-white/10 p-5"><div className="text-[9px] tracking-[.16em] text-white/40">ADMIN URL</div><div className="text-sm font-bold mt-2">/admin</div><div className="text-[10px] text-white/40 mt-1">Bookmark this page for your client.</div></div>
            </div>
          </div>}

          {tab === 'products' && <div className="mt-8">
            <div className="border border-white/10 flex max-w-xl"><Search size={14} className="m-3 text-white/40" /><input value={query} onChange={(e) => setQuery(e.target.value)} className="bg-transparent outline-none text-xs flex-1 py-3" placeholder="SEARCH PRODUCTS..." /></div>
            <div className="mt-5 border border-white/10 overflow-x-auto">
              <table className="w-full min-w-[980px] text-left text-xs"><thead className="text-[8px] tracking-[.16em] text-white/40"><tr><th className="p-3">PRODUCT</th><th>PRICE</th><th>SIZE AVAILABILITY</th><th>STOCK</th><th>STATUS</th><th>ACTIONS</th></tr></thead>
                <tbody>{products.map((p) => <tr className="border-t border-white/10 align-top" key={p.id}><td className="p-3"><div className="font-bold">{p.name}</div><div className="text-[9px] text-white/35 mt-1">{p.slug}</div></td><td className="pt-3">₹{Number(p.price).toLocaleString('en-IN')}</td><td className="pt-3"><div className="space-y-1.5">{sizeAvailability(p.variants || []).map((group) => <div key={group.color}><span className="text-[8px] tracking-[.12em] text-white/45">{group.color.toUpperCase()}</span><div className="text-[9px] leading-5 text-white/75">{group.sizes.join(' · ')}</div></div>)}{!p.variants?.length && <span className="text-white/30">NO SIZES</span>}</div></td><td className="pt-3">{(p.variants || []).reduce((a, v) => a + Number(v.stock), 0)}</td><td className="pt-3"><span className={p.published ? 'text-green-400' : 'text-white/40'}>{p.published ? 'LIVE' : 'DRAFT'}</span></td><td className="pt-3"><div className="flex gap-2"><button onClick={() => openEdit(p)} className="border border-white/15 p-2" title="Edit"><Edit3 size={13} /></button><button onClick={() => deleteProduct(p)} className="border border-red-900/60 text-red-400 p-2" title="Delete"><Trash2 size={13} /></button></div></td></tr>)}</tbody>
              </table>
              {!products.length && <div className="p-10 text-center text-xs text-white/40">No products found.</div>}
            </div>
          </div>}

          {tab === 'orders' && <div className="mt-8 border border-white/10 overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-xs"><thead className="text-[8px] tracking-[.16em] text-white/40"><tr><th className="p-3">ORDER</th><th>CUSTOMER</th><th>TOTAL</th><th>STATUS</th><th>DATE</th></tr></thead><tbody>
              {orders.map((o) => <tr key={o.id} className="border-t border-white/10"><td className="p-3 font-bold">{o.orderNumber}</td><td>{o.user?.email || o.address?.email || 'Guest'}</td><td>₹{Number(o.total).toLocaleString('en-IN')}</td><td>{o.status}</td><td>{new Date(o.createdAt).toLocaleString('en-IN')}</td></tr>)}
            </tbody></table>{!orders.length && <div className="p-10 text-center text-xs text-white/40">No orders yet.</div>}
          </div>}

          {tab === 'media' && <div className="mt-8 border border-dashed border-white/20 p-8"><div className="text-xs font-bold tracking-[.12em]">MEDIA INGEST</div><p className="text-xs text-white/45 mt-2 max-w-2xl">Upload product images after Cloudinary is configured. The current backend validates local uploads, but local server storage is not persistent production storage.</p><input type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif,video/mp4,video/quicktime,video/webm" className="mt-6 text-xs" onChange={async (e) => { const file = e.target.files?.[0]; if (!file) return; const form = new FormData(); form.append('file', file); const response = await fetch(`${API}/media/local`, { method: 'POST', body: form, credentials: 'include' }); setNotice(response.ok ? 'Media accepted by backend.' : 'Media upload failed.'); }} /><div className="text-[10px] text-white/35 mt-4">Max 100 MB</div></div>}
        </section>
      </div>

      {editor && <div className="fixed inset-0 z-[100] bg-black/70 p-4 md:p-8 overflow-y-auto"><form onSubmit={saveProduct} className="max-w-4xl mx-auto bg-[#101010] border border-white/15 p-5 md:p-8">
        <div className="flex justify-between items-center mb-7"><div><div className="text-[9px] tracking-[.2em] text-white/40">PRODUCT EDITOR</div><h2 className="text-2xl font-black mt-1">{editor.id ? 'EDIT PRODUCT' : 'NEW PRODUCT'}</h2></div><button type="button" onClick={() => setEditor(null)}><X /></button></div>
        <div className="grid md:grid-cols-2 gap-3">
          <Field label="NAME"><input required value={editor.name} onChange={(e) => updateEditor('name', e.target.value)} className="input" placeholder="DRAVON PERFORMANCE TEE" /></Field>
          <Field label="SLUG"><input required value={editor.slug} onChange={(e) => updateEditor('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-'))} className="input" placeholder="performance-tee" /></Field>
          <Field label="PRICE"><input required type="number" min="0" value={editor.price} onChange={(e) => updateEditor('price', Number(e.target.value))} className="input" /></Field>
          <Field label="MRP"><input type="number" min="0" value={editor.mrp || 0} onChange={(e) => updateEditor('mrp', Number(e.target.value))} className="input" /></Field>
        </div>
        <Field label="DESCRIPTION"><textarea value={editor.description || ''} onChange={(e) => updateEditor('description', e.target.value)} className="input min-h-24" /></Field>
        <div className="flex gap-5 mt-5 text-[10px] tracking-[.12em]"><label><input type="checkbox" checked={!!editor.published} onChange={(e) => updateEditor('published', e.target.checked)} className="mr-2" />PUBLISHED / LIVE</label><label><input type="checkbox" checked={!!editor.featured} onChange={(e) => updateEditor('featured', e.target.checked)} className="mr-2" />FEATURED</label></div>

        <div className="mt-8 border-t border-white/10 pt-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-[9px] tracking-[.18em] font-bold">PRODUCT IMAGES</div>
              <div className="text-[9px] text-white/35 mt-1">Upload directly to Cloudinary or paste an existing image URL.</div>
            </div>
            <button type="button" onClick={() => setEditor({ ...editor, images: [...(editor.images || []), { url: '', altText: '' }] })} className="text-[9px] border border-white/15 px-3 py-2"><Plus size={12} className="inline mr-1" />ADD IMAGE</button>
          </div>
          {(editor.images || []).map((image, index) => (
            <div key={index} className="mt-4 border border-white/10 p-3">
              <div className="grid md:grid-cols-[220px_1fr_auto] gap-3 items-start">
                <div>
                  {image.url ? (
                    <div className="aspect-square bg-black border border-white/10 overflow-hidden">
                      <img src={image.url} alt={image.altText || 'Product image'} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="aspect-square border border-dashed border-white/15 grid place-items-center text-[9px] text-white/30">NO IMAGE</div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <label className="inline-flex items-center justify-center border border-white/20 px-4 py-2 text-[9px] tracking-[.12em] font-bold cursor-pointer hover:bg-white/5">
                      {uploadingImage === index ? 'UPLOADING...' : 'UPLOAD TO CLOUDINARY'}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                        className="hidden"
                        disabled={uploadingImage !== null}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          e.currentTarget.value = '';
                          if (file) uploadProductImage(index, file);
                        }}
                      />
                    </label>
                    {image.url && <a href={image.url} target="_blank" rel="noreferrer" className="border border-white/10 px-4 py-2 text-[9px] tracking-[.12em] text-white/60 hover:text-white">OPEN IMAGE</a>}
                  </div>
                  <input value={image.url} onChange={(e) => { const images = [...(editor.images || [])]; images[index] = { ...images[index], url: e.target.value }; setEditor({ ...editor, images }); }} className="input" placeholder="https://..." />
                  <input value={image.altText || ''} onChange={(e) => { const images = [...(editor.images || [])]; images[index] = { ...images[index], altText: e.target.value }; setEditor({ ...editor, images }); }} className="input" placeholder="ALT TEXT" />
                  <div className="text-[8px] text-white/30">JPG, PNG, WEBP • MAX 10 MB</div>
                </div>
                <button type="button" onClick={() => setEditor({ ...editor, images: (editor.images || []).filter((_, i) => i !== index) })} className="border border-red-900 text-red-400 px-3 py-2" title="Remove image"><Trash2 size={13} /></button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t border-white/10 pt-6"><div className="flex justify-between items-center"><div><div className="text-[9px] tracking-[.18em] font-bold">VARIANTS & STOCK</div><div className="text-[9px] text-white/35 mt-1">Each size/color combination has its own stock.</div></div><button type="button" onClick={() => setEditor({ ...editor, variants: [...(editor.variants || []), { sku: `DRV-${Date.now()}`, color: 'Black', size: 'M', stock: 0 }] })} className="text-[9px] border border-white/15 px-3 py-2"><Plus size={12} className="inline mr-1" />ADD VARIANT</button></div>
          <div className="hidden md:grid md:grid-cols-[1.4fr_1fr_1fr_100px_110px_auto] gap-2 px-1 mb-2 text-[8px] tracking-[.14em] text-white/35"><span>SKU</span><span>COLOUR</span><span>SIZE</span><span>STOCK</span><span>AVAILABILITY</span><span /></div><div className="mt-3 space-y-2">{(editor.variants || []).map((variant, index) => <div key={index} className="grid grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_100px_110px_auto] gap-2 items-center"><input value={variant.sku} onChange={(e) => { const variants = [...(editor.variants || [])]; variants[index] = { ...variants[index], sku: e.target.value }; setEditor({ ...editor, variants }); }} className="input" placeholder="SKU" /><input value={variant.color} onChange={(e) => { const variants = [...(editor.variants || [])]; variants[index] = { ...variants[index], color: e.target.value }; setEditor({ ...editor, variants }); }} className="input" placeholder="COLOR" /><input value={variant.size} onChange={(e) => { const variants = [...(editor.variants || [])]; variants[index] = { ...variants[index], size: e.target.value }; setEditor({ ...editor, variants }); }} className="input" placeholder="SIZE" /><input type="number" min="0" value={variant.stock} onChange={(e) => { const variants = [...(editor.variants || [])]; variants[index] = { ...variants[index], stock: Number(e.target.value) }; setEditor({ ...editor, variants }); }} className="input" placeholder="STOCK" /><div className={`text-[9px] font-bold tracking-[.08em] px-2 ${Number(variant.stock) <= 0 ? 'text-red-400' : Number(variant.stock) <= 10 ? 'text-amber-300' : 'text-green-400'}`}>{stockLabel(Number(variant.stock)) || 'AVAILABLE'}</div><button type="button" onClick={() => setEditor({ ...editor, variants: (editor.variants || []).filter((_, i) => i !== index) })} className="border border-red-900 text-red-400 px-3"><Trash2 size={13} /></button></div>)}</div>
        </div>
        <div className="flex justify-end gap-2 mt-8"><button type="button" onClick={() => setEditor(null)} className="border border-white/15 px-5 py-3 text-[9px] tracking-[.16em]">CANCEL</button><button disabled={saving} className="bg-[#8b0000] px-6 py-3 text-[9px] font-bold tracking-[.16em]">{saving ? 'SAVING...' : editor.id ? 'SAVE CHANGES' : 'CREATE PRODUCT'}</button></div>
      </form></div>}
      <style jsx global>{`.input{width:100%;background:#0a0a0a;border:1px solid rgba(255,255,255,.14);padding:.75rem;font-size:.75rem;outline:none}.input:focus{border-color:rgba(255,255,255,.45)}label{display:block}.input::placeholder{color:rgba(255,255,255,.25)}`}</style>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block mt-4"><span className="text-[8px] tracking-[.16em] text-white/40 block mb-2">{label}</span>{children}</label>;
}
