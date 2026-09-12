import Link from 'next/link';
import Image from 'next/image';
import {ArrowRight} from 'lucide-react';
import {Hero} from '@/components/hero';
import {ProductCard} from '@/components/product-card';
import {collections} from '@/lib/catalog';
import {getProducts} from '@/lib/api';

const movement=[['STRENGTH','Built to perform.'],['CONTROL','Made for precision.'],['DISCIPLINE','Designed for consistency.'],['MASTERY','Always improving.']];

export default async function Home(){
  const products=await getProducts();
  const featured=products.filter((p:any)=>p.featured).length?products.filter((p:any)=>p.featured):products;
  return <main>
    <Hero/>

    <section className="border-b border-[var(--line)] bg-[var(--fg)] text-[var(--bg)]">
      <div className="container grid gap-5 py-5 md:grid-cols-3 md:items-center">
        <div className="text-[9px] font-black tracking-[.2em]">ENGINEERED FOR MOVEMENT</div>
        <div className="hidden h-px bg-[var(--muted)]/30 md:block"/>
        <div className="text-[9px] tracking-[.14em] text-[var(--muted)] md:text-right">PERFORMANCE · STREETWEAR · CULTURE</div>
      </div>
    </section>

    <section className="container py-16 md:py-24">
      <div className="grid gap-10 md:grid-cols-[.72fr_1.28fr] md:items-end">
        <div>
          <div className="eyebrow"><span className="redline"/>THE NEW DROP</div>
          <h2 className="mt-4 text-4xl font-black uppercase leading-[.9] tracking-[-.05em] md:text-6xl">BUILT TO<br/>MOVE.</h2>
          <p className="mt-5 max-w-sm text-xs leading-6 text-[var(--muted)]">Performance pieces made for training, movement and everyday street culture.</p>
          <Link className="btn btn-red mt-7" href="/shop">SHOP THE DROP <ArrowRight size={13}/></Link>
        </div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">{products.slice(0,4).map((p:any)=><Link key={p.id} href={`/product/${p.slug}`} className="group relative aspect-[3/4] overflow-hidden bg-[var(--surface)]"><Image src={p.image} alt={p.name} fill sizes="25vw" className="object-cover transition-transform duration-700 group-hover:scale-105"/><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-10 text-[8px] font-black tracking-[.14em] text-white">{p.name}</div></Link>)}</div>
      </div>
    </section>

    <section className="border-y border-[var(--line)] bg-[var(--surface)] py-16 md:py-20">
      <div className="container">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><div className="eyebrow"><span className="redline"/>TRAIN. MOVE. MASTER.</div><h2 className="mt-3 text-3xl font-black uppercase tracking-[-.04em]">SHOP BY MOVEMENT</h2></div><Link href="/collections" className="text-[9px] font-black tracking-[.16em]">EXPLORE ALL <ArrowRight size={12} className="inline"/></Link></div>
        <div className="mt-8 grid grid-cols-2 gap-2 md:grid-cols-5">{collections.map(([name,img])=><Link key={name} href={`/shop?collection=${name.toLowerCase().replaceAll(' ','-')}`} className="group relative aspect-[.78] overflow-hidden bg-black"><Image src={img} alt={name} fill sizes="20vw" className="object-cover opacity-80 transition duration-700 group-hover:scale-105 group-hover:opacity-100"/><div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"/><div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[9px] font-black tracking-[.14em] text-white">{name}<ArrowRight size={12}/></div></Link>)}</div>
      </div>
    </section>

    <section className="container py-16 md:py-24">
      <div className="flex flex-col justify-between gap-4 border-b border-[var(--line)] pb-6 md:flex-row md:items-end"><div><div className="eyebrow"><span className="redline"/>BUILT TO BE WORN</div><h2 className="mt-3 text-3xl font-black uppercase tracking-[-.04em]">THE ESSENTIALS</h2></div><Link href="/shop" className="text-[9px] font-black tracking-[.16em]">VIEW ALL <ArrowRight size={12} className="inline"/></Link></div>
      <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-12 md:grid-cols-4 lg:grid-cols-6">{featured.slice(0,6).map((p:any)=><ProductCard p={p} key={p.id}/>)}</div>
    </section>

    <section className="container grid gap-px border border-[var(--line)] bg-[var(--line)] md:grid-cols-[1.05fr_1fr]">
      <div className="relative min-h-[460px] bg-[var(--surface)]"><Image src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=82" alt="Athlete training" fill sizes="50vw" className="object-cover grayscale"/></div>
      <div className="bg-[var(--bg)] p-8 md:p-14"><div className="eyebrow text-[var(--red)]">MORE THAN APPAREL.</div><h2 className="mt-4 text-4xl font-black uppercase leading-[.9] tracking-[-.05em] md:text-6xl">THE MOVEMENT<br/>IS BIGGER.</h2><p className="mt-6 max-w-md text-xs leading-6 text-[var(--muted)]">DRAVON was created from the culture of calisthenics — where strength, control, discipline and consistency matter. Every piece represents the mindset of people who refuse to stop improving.</p><div className="mt-8 grid grid-cols-2 gap-y-5">{movement.map(([a,b])=><div key={a}><div className="text-[10px] font-black tracking-[.15em]"><span className="mr-2 text-[var(--red)]">+</span>{a}</div><div className="mt-1 text-[9px] text-[var(--muted)]">{b}</div></div>)}</div><Link href="/about" className="btn mt-9">OUR STORY <ArrowRight size={13}/></Link></div>
    </section>

    <section className="container py-16 md:py-24"><div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-end"><div><div className="eyebrow">@DRAVONINDIA</div><h2 className="mt-3 text-4xl font-black uppercase tracking-[-.05em] md:text-6xl">FOLLOW THE<br/>MOVEMENT.</h2></div><Link href="/community" className="btn">EXPLORE COMMUNITY <ArrowRight size={13}/></Link></div><div className="mt-8 grid grid-cols-3 gap-1 md:grid-cols-6">{['1571019613454-1cb2f99b2d8b','1517836357463-d25dfeac3438','1599058917765-a780eda07a3e','1541534741688-6078c6bfb5c5','1584735175315-9d5df23860e6','1517963879433-6ad2b056d712'].map(id=><div className="relative aspect-square overflow-hidden" key={id}><Image src={`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=500&q=75`} alt="DRAVON community" fill sizes="16vw" className="object-cover grayscale transition duration-500 hover:scale-105 hover:grayscale-0"/></div>)}</div></section>
  </main>
}
