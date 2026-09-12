import {products as fallback} from './catalog';
const API=process.env.NEXT_PUBLIC_API_URL||'http://localhost:4000/api';
function normalize(p:any){return {...p,image:p.image||p.images?.[0]?.url||fallback.find(x=>x.slug===p.slug)?.image||'',gallery:p.gallery||p.images?.slice(1)?.map((x:any)=>x.url)||[],colors:p.colors||Array.from(new Set((p.variants||[]).map((v:any)=>v.color))).filter(Boolean),sizes:p.sizes||Array.from(new Set((p.variants||[]).map((v:any)=>v.size))).filter(Boolean),tag:p.tag||null}}
export async function getProducts(){try{const r=await fetch(`${API}/products?published=true`,{next:{revalidate:30}});if(!r.ok)throw new Error();return (await r.json()).map(normalize)}catch{return fallback}}
export async function getProduct(slug:string){try{const r=await fetch(`${API}/products/${slug}`,{next:{revalidate:30}});if(!r.ok)throw new Error();return normalize(await r.json())}catch{return fallback.find(x=>x.slug===slug)}}
export {API};
