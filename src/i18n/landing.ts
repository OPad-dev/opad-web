/**
 * Landing copy, English and Spanish. Written for players: what they see and get.
 * Technical depth lives in the docs. Every fact is stated in the OPad docs; nothing
 * is for sale yet (a Kickstarter is planned, with no date, price or link).
 */
export type Lang = 'en' | 'es';

const REPO = 'https://github.com/OPad-dev/OPad';

export const links = {
	repo: REPO,
	releases: `${REPO}/releases`,
	docs: { en: '/docs/', es: '/es/docs/' },
	whatYouNeed: { en: '/docs/start/what-you-need/', es: '/es/docs/start/what-you-need/' },
	install: { en: '/docs/start/install-the-app/', es: '/es/docs/start/install-the-app/' },
	home: { en: '/', es: '/es/' },
};

export const t = {
	en: {
		meta: {
			title: 'OPad · The osu! keypad with a screen',
			description:
				'Three keys and a touchscreen that shows your PP, accuracy and combo while you play osu!. Plug it in and play. Coming to Kickstarter.',
		},
		skip: 'Skip to content',
		nav: { docs: 'Docs', download: 'Download', github: 'GitHub' },
		hero: {
			title: 'The osu! keypad with a screen',
			lede: 'Three keys to tap, and a touchscreen that shows your PP, accuracy and combo while you play. Plug it in and play.',
			primary: 'Get an OPad',
			secondary: 'See it live',
			availability: 'Coming to Kickstarter. Not on sale yet.',
		},
		pad: {
			label: 'OPad',
			hint: 'Press Z, X and C, or tap the keys',
			hintTouch: 'Tap the keys',
			key: (n: number, k: string) => `Key ${n} (${k})`,
			sample: 'Sample values',
		},
		live: {
			title: 'Your play, live',
			body: 'PP, accuracy, combo, grade, the song and how fast you’re tapping, updated as you play. Between maps it shows the time and how many times you’ve hit each key.',
			note: 'With the free OPad app.',
			label: 'The OPad screen during a map',
		},
		features: {
			title: 'Small keypad, a lot of game',
			items: [
				{ name: 'Touch to retry', body: 'Rest a finger on the screen to restart the map. Swipe to change the volume or skip the song.' },
				{ name: 'Make the screen yours', body: 'Pick what it shows and how it looks, in the app.' },
				{ name: 'Plug and play', body: 'It’s a keyboard on Windows and Linux. No drivers, nothing to install.' },
				{ name: 'Magnetic or mechanical', body: 'Magnetic switches with Rapid Trigger, or classic mechanical ones.' },
				{ name: 'Every press counted', body: 'Your total presses for each key, kept on the keypad itself.' },
				{ name: 'Fair play', body: 'Every press comes from your finger. No macros, ever.' },
			],
		},
		get: {
			title: 'Get an OPad',
			kickstarter: {
				name: 'Kickstarter',
				status: 'Coming soon',
				body: 'OPad will launch on Kickstarter. Date and price are on the way. Follow the project on GitHub to hear first.',
				action: 'Follow on GitHub',
			},
			build: {
				name: 'Build your own',
				body: 'Every file is open. The guide lists the parts and walks you through it.',
				action: 'What you need',
			},
			own: {
				name: 'Already have one',
				body: 'Get the free app for the screen, the counters and updates. Windows and Linux.',
				action: 'Download the app',
			},
		},
		footer: {
			licence: 'Open source. Software GPL-3.0-or-later, hardware CERN-OHL-S-2.0.',
			docs: 'Documentation',
			source: 'Source code',
			switchTo: 'Español',
		},
	},
	es: {
		meta: {
			title: 'OPad · El teclado de osu! con pantalla',
			description:
				'Tres teclas y una pantalla táctil que te enseña tus PP, tu precisión y tu combo mientras juegas a osu!. Lo enchufas y a jugar. Próximamente en Kickstarter.',
		},
		skip: 'Saltar al contenido',
		nav: { docs: 'Docs', download: 'Descargar', github: 'GitHub' },
		hero: {
			title: 'El teclado de osu! con pantalla',
			lede: 'Tres teclas para tapear y una pantalla táctil que te enseña tus PP, tu precisión y tu combo mientras juegas. Lo enchufas y a jugar.',
			primary: 'Consigue un OPad',
			secondary: 'Míralo en directo',
			availability: 'Próximamente en Kickstarter. Aún no está a la venta.',
		},
		pad: {
			label: 'OPad',
			hint: 'Pulsa Z, X y C, o toca las teclas',
			hintTouch: 'Toca las teclas',
			key: (n: number, k: string) => `Tecla ${n} (${k})`,
			sample: 'Valores de ejemplo',
		},
		live: {
			title: 'Tu partida, en directo',
			body: 'PP, precisión, combo, nota, la canción y lo rápido que estás tapeando, al momento. Entre mapas te enseña la hora y cuántas veces has pulsado cada tecla.',
			note: 'Con la app gratuita de OPad.',
			label: 'La pantalla de OPad durante un mapa',
		},
		features: {
			title: 'Un teclado pequeño, mucho juego',
			items: [
				{ name: 'Toca para reintentar', body: 'Apoya un dedo en la pantalla para reiniciar el mapa. Desliza para cambiar el volumen o pasar de canción.' },
				{ name: 'Tu pantalla, a tu gusto', body: 'Elige qué muestra y cómo se ve, desde la app.' },
				{ name: 'Enchufar y jugar', body: 'Es un teclado en Windows y Linux. Sin controladores, sin instalar nada.' },
				{ name: 'Magnético o mecánico', body: 'Switches magnéticos con Rapid Trigger, o mecánicos de toda la vida.' },
				{ name: 'Cada pulsación cuenta', body: 'Tus pulsaciones totales de cada tecla, guardadas en el propio teclado.' },
				{ name: 'Juego limpio', body: 'Cada pulsación sale de tu dedo. Sin macros, nunca.' },
			],
		},
		get: {
			title: 'Consigue un OPad',
			kickstarter: {
				name: 'Kickstarter',
				status: 'Muy pronto',
				body: 'OPad saldrá en Kickstarter. La fecha y el precio, muy pronto. Sigue el proyecto en GitHub para enterarte antes que nadie.',
				action: 'Seguir en GitHub',
			},
			build: {
				name: 'Móntatelo tú',
				body: 'Todos los archivos son abiertos. La guía te dice qué piezas necesitas y cómo montarlo.',
				action: 'Qué necesitas',
			},
			own: {
				name: 'Ya tengo uno',
				body: 'Descarga la app gratuita para la pantalla, los contadores y las actualizaciones. Windows y Linux.',
				action: 'Descargar la app',
			},
		},
		footer: {
			licence: 'Código abierto. Software GPL-3.0-or-later, hardware CERN-OHL-S-2.0.',
			docs: 'Documentación',
			source: 'Código fuente',
			switchTo: 'English',
		},
	},
} as const;
