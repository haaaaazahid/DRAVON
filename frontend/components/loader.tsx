'use client';
import {useEffect,useState} from 'react';
import {SITE_IMAGES} from '@/lib/site-images';

export function Loader(){
  const [show,setShow]=useState(false);
  const [pct,setPct]=useState(0);
  useEffect(()=>{
    if(sessionStorage.getItem('dravon-loader'))return;
    setShow(true); sessionStorage.setItem('dravon-loader','1');
    let n=0; const t=setInterval(()=>{
      n+=7; setPct(Math.min(n,100));
      if(n>=100){clearInterval(t);setTimeout(()=>setShow(false),420)}
    },55);
    return()=>clearInterval(t);
  },[]);
  if(!show)return null;
  return <div className="fixed inset-0 z-[100] bg-black text-white flex items-center justify-center overflow-hidden">
    <img src={SITE_IMAGES.loader} alt="DRAVON athlete loading background" className="absolute inset-0 h-full w-full object-cover opacity-45"/>
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/35"/>
    <div className="relative z-10 w-[min(520px,82vw)]">
      <div className="flex items-end justify-between mb-10">
        <div><div className="text-[11px] tracking-[.35em] text-white/60 mb-2">DRAVON</div><div className="text-3xl font-black tracking-tight">LOADING MOVEMENT</div></div>
        <div className="text-xs tracking-[.25em]">{pct}%</div>
      </div>
      <div className="h-[2px] bg-white/20 relative overflow-hidden"><div className="absolute inset-y-0 left-0 bg-[#8b0000] transition-all duration-75" style={{width:`${pct}%`}}/></div>
      <div className="mt-5 text-[9px] tracking-[.3em] text-white/55">STRENGTH · DISCIPLINE · EVOLVE</div>
    </div>
  </div>;
}
