'use client';
import {ThemeProvider} from 'next-themes'; import {Header} from './header'; import {Loader} from './loader'; import {CartProvider} from './cart'; import {Footer} from './footer';
export function SiteShell({children}:{children:React.ReactNode}){return <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem={false}><CartProvider><Loader/><Header/><div>{children}</div><Footer/></CartProvider></ThemeProvider>}
