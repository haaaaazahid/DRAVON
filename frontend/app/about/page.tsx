import Image from 'next/image';
import Link from 'next/link';
import { ArrowDownRight, ArrowRight, Check } from 'lucide-react';

const pillars = [
  ['01','STRENGTH','Build capability.'],['02','DISCIPLINE','Show up when motivation disappears.'],['03','CONTROL','Own every rep, every movement.'],['04','EVOLUTION','Never finish becoming better.'],
];

export default function AboutPage(){return <main>
  <section className="relative min-h-[72vh] overflow-hidden border-b border-[var(--line)] flex items-end">
    <Image src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=2200&q=85" alt="Athlete training" fill priority sizes="100vw" className="object-cover"/>
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/10"/>
    <div className="container relative z-10 text-white py-14 md:py-20"><div className="eyebrow"><span className="redline"/>THE DRAVON CODE</div><h1 className="text-[16vw] md:text-[10vw] leading-[.78] font-black tracking-[-.08em] mt-5">BUILT<br/><span className="text-[var(--red)]">DIFFERENT.</span></h1><p className="max-w-xl text-sm md:text-base leading-7 text-white/70 mt-8">DRAVON exists for people who train with intent. Performance gear shaped by the culture of movement, strength and relentless self-improvement.</p></div>
  </section>
  <section className="container py-20 md:py-28"><div className="grid md:grid-cols-[.7fr_1.3fr] gap-12"><div><div className="eyebrow"><span className="redline"/>WHY DRAVON</div><div className="text-7xl md:text-9xl font-black tracking-[-.08em] mt-4">MORE<br/>THAN<br/><span className="text-[var(--red)]">CLOTHING.</span></div></div><div className="md:pt-10"><p className="text-xl md:text-3xl leading-tight font-bold max-w-3xl">The garment is only the visible part. The mindset is what we wear underneath.</p><p className="text-sm leading-7 text-[var(--muted)] max-w-2xl mt-8">Born from calisthenics and athletic movement, DRAVON is built around a simple idea: your equipment should never be the reason you hold back. Clean silhouettes, movement-first construction and a visual language that belongs equally in the gym and on the street.</p><div className="grid sm:grid-cols-2 gap-px bg-[var(--line)] border border-[var(--line)] mt-12">{pillars.map(([n,t,d])=><div key={n} className="bg-[var(--bg)] p-7"><div className="text-[var(--red)] text-xs font-black">{n}</div><div className="font-black tracking-[.08em] mt-8">{t}</div><div className="text-xs text-[var(--muted)] mt-2">{d}</div></div>)}</div></div></div></section>
  <section className="bg-[var(--fg)] text-[var(--bg)] py-20 md:py-28"><div className="container grid md:grid-cols-2 gap-12 items-center"><div><div className="text-[10px] tracking-[.22em] font-bold text-[var(--red)]">THE MOVEMENT</div><h2 className="text-5xl md:text-7xl font-black tracking-[-.06em] mt-4">TRAIN.<br/>MOVE.<br/>MASTER.</h2></div><div className="text-sm leading-7 opacity-65 max-w-xl">DRAVON is not about looking like an athlete. It is about respecting the work it takes to become one. Every session. Every failure. Every small progression. That is the culture.</div></div></section>
  <section className="container py-20"><div className="flex flex-col md:flex-row justify-between md:items-end gap-6"><div><div className="eyebrow"><span className="redline"/>NEXT MOVE</div><h2 className="text-4xl md:text-6xl font-black tracking-[-.06em] mt-3">WEAR THE WORK.</h2></div><Link href="/shop" className="btn btn-red">SHOP DRAVON <ArrowRight size={14}/></Link></div></section>
</main>}
