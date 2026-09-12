import type { Config } from 'tailwindcss';
export default { darkMode:['class','[data-theme="dark"]'], content:['./app/**/*.{ts,tsx}','./components/**/*.{ts,tsx}'], theme:{extend:{fontFamily:{sans:['var(--font-inter)','Arial','sans-serif']}, letterSpacing:{'mega':'0.24em'}}}, plugins:[] } satisfies Config;
