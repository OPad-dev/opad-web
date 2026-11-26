// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import starlight from '@astrojs/starlight';

// The docs pages come from the OPad repository: `npm run sync-docs` (runs before dev and build).
const group = (label, es, directory, collapsed = true) => ({ label, translations: { es }, collapsed, items: [{ autogenerate: { directory } }] });

export default defineConfig({
	// TODO: set the real domain once the site is published.
	site: 'https://opad.dev',
	trailingSlash: 'always',
	fonts: [
		{
			// The desktop app's typeface (desktop/gui/assets/fonts); LVGL's built-in fonts on the pad are Montserrat too.
			provider: fontProviders.google(),
			name: 'Montserrat',
			cssVariable: '--font-sans',
			weights: [400, 500, 700],
			styles: ['normal'],
			subsets: ['latin', 'latin-ext'],
			fallbacks: ['system-ui', 'sans-serif'],
		},
		{
			provider: fontProviders.google(),
			name: 'JetBrains Mono',
			cssVariable: '--font-mono',
			weights: [400],
			styles: ['normal'],
			subsets: ['latin'],
			fallbacks: ['ui-monospace', 'monospace'],
		},
	],
	integrations: [
		starlight({
			title: 'OPad',
			description: 'Documentation for OPad, a low-latency three-key osu! keypad with a touchscreen.',
			defaultLocale: 'root',
			locales: {
				root: { label: 'English', lang: 'en' },
				es: { label: 'Español', lang: 'es' },
			},
			logo: { src: './src/assets/opad-mark.svg', alt: 'OPad', replacesTitle: false },
			favicon: '/favicon.svg',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/OPad-dev/OPad' }],
			customCss: ['./src/styles/tokens.css', './src/styles/starlight-opad.css'],
			components: { Head: './src/components/DocsHead.astro' },
			// The docs have udev rules blocks; Shiki has no udev grammar, and key="value" pairs read well as ini.
			expressiveCode: { shiki: { langAlias: { udev: 'ini' } } },
			sidebar: [
				{ label: 'Overview', translations: { es: 'Inicio' }, slug: 'docs' },
				group('Get started', 'Primeros pasos', 'docs/start', false),
				group('Build your own', 'Monta el tuyo', 'docs/build'),
				group('Guides', 'Guías', 'docs/guides'),
				{ label: 'Troubleshooting', translations: { es: 'Solución de problemas' }, slug: 'docs/troubleshooting' },
				{ label: 'Recovery', translations: { es: 'Recuperación' }, slug: 'docs/recovery' },
				group('Reference', 'Referencia', 'docs/reference'),
				group('How it works', 'Cómo funciona', 'docs/explanation'),
				group('Contributing', 'Contribuir', 'docs/develop'),
			],
		}),
	],
});
