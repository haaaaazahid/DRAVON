'use client';
import {useEffect,useMemo,useState} from 'react';
import {Search,SlidersHorizontal} from 'lucide-react';
import {products as fallback} from '@/lib/catalog';
import {ProductCard} from '@/components/product-card';

const API=process.env.NEXT_PUBLIC_API_URL||'http://localhost:4000/api';
function normalize(p:any){return {...p,image:p.images?.[0]?.url||p.image||'',gallery:p.images?.slice(1)?.map((x:any)=>x.url)||[],colors:Array.from(new Set((p.variants||[]).map((v:any)=>v.color).filter(Boolean))),sizes:Array.from(new Set((p.variants||[]).map((v:any)=>v.size).filter(Boolean))),category:p.category||'APPAREL'}}

export default function Shop(){
 const [q,setQ]=useState(''); const [cat,setCat]=useState('ALL'); const [items,setItems]=useState<any[]>(fallback); const [sort,setSort]=useState('featured');
 useEffect(()=>{let live=true;fetch(`${API}/products?published=true`).then(r=>r.ok?r.json():Promise.reject()).then(d=>{if(live)setItems((Array.isArray(d)?d:d.products||[]).map(normalize))}).catch(()=>{});return()=>{live=false}},[]);
 const cats=['ALL',...Array.from(new Set(items.map(p=>p.category||'APPAREL')))];
 const list=useMemo(()=>{let out=items.filter(p=>(cat==='ALL'||(p.category||'APPAREL')===cat)&&p.name.toLowerCase().includes(q.toLowerCase()));if(sort==='low')out.sort((a,b)=>Number(a.price)-Number(b.price));if(sort==='high')out.sort((a,b)=>Number(b.price)-Number(a.price));return out},[q,cat,items,sort]);
 return <main className="container py-10 md:py-14">
  <div className="border-b border-[var(--line)] pb-8"><div className="eyebrow"><span className="redline"/>SHOP DRAVON</div><div className="mt-3 flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><h1 className="text-5xl font-black uppercase tracking-[-.07em] md:text-7xl">THE STORE.</h1><p className="mt-3 max-w-md text-xs leading-5 text-[var(--muted)]">Performance essentials for training, movement and the street.</p></div><div className="flex w-full border border-[var(--line)] md:w-80"><Search size={15} className="m-3 text-[var(--muted)]"/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="SEARCH PRODUCTS" className="flex-1 bg-transparent text-[10px] tracking-[.1em] outline-none"/></div></div></div>
  <div className="flex flex-col gap-4 border-b border-[var(--line)] py-5 md:flex-row md:items-center"><div className="flex gap-2 overflow-x-auto">{cats.map(c=><button onClick={()=>setCat(c)} className={`whitespace-nowrap border px-4 py-2 text-[9px] font-black tracking-[.14em] ${cat===c?'bg-[var(--fg)] text-[var(--bg)]':''}`} key={c}>{c}</button>)}</div><div className="ml-auto flex items-center gap-2"><SlidersHorizontal size={13}/><select value={sort} onChange={e=>setSort(e.target.value)} className="border border-[var(--line)] bg-transparent px-3 py-2 text-[9px] font-bold tracking-[.12em] outline-none"><option value="featured">SORT: FEATURED</option><option value="low">PRICE: LOW → HIGH</option><option value="high">PRICE: HIGH → LOW</option></select></div></div>
  <div className="flex items-center justify-between py-5"><div className="text-[9px] font-bold tracking-[.14em] text-[var(--muted)]">{list.length} PRODUCTS</div><div className="text-[8px] tracking-[.12em] text-[var(--muted)]">SIZE AVAILABILITY SHOWN ON PRODUCT PAGE</div></div>
  <div className="grid grid-cols-2 gap-x-3 gap-y-12 md:grid-cols-4 lg:grid-cols-5">{list.map(p=><ProductCard p={p} key={p.id}/>)}</div>
 </main>
}
