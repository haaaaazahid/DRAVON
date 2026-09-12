import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SiteShell } from '@/components/site-shell';
const inter=Inter({subsets:['latin'],variable:'--font-inter'});
export const metadata:Metadata={title:'DRAVON — Defy Gravity',description:'DRAVON performance and streetwear. Built by athletes. Worn by warriors.',metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL||'http://localhost:3000')};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth"><body className={inter.variable}><SiteShell>{children}</SiteShell></body></html>}
