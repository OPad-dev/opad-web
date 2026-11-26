/**
 * Landing copy, English and Spanish. Bold, written for players, and true: every claim
 * comes from the OPad docs (sources below each one). Lines with no fact in them are
 * aspiration ("should be faster"), never a comparison with other keypads. Nothing is
 * for sale yet (a Kickstarter is planned, with no date, price or link).
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
			title: 'OPad · The osu! keypad with a screen of its own',
			description:
				'Three keys that fire the instant you press, a USB lane for every key, and a touchscreen with your PP, accuracy and combo live. Plug it in: it’s already a keyboard. Coming to Kickstarter.',
		},
		skip: 'Skip to content',
		nav: { docs: 'Docs', download: 'Download', github: 'GitHub' },
		hero: {
			title: 'Built for the fastest fingers in osu!',
			lede: 'Three keys that fire the instant you press, and a screen of its own with your PP, accuracy and combo as you play. Plug it in: it’s already a keyboard.',
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
			title: 'Your play, live, under your fingers',
			body: 'PP, accuracy, combo, grade, the song and how fast you’re tapping, updated as you play. Between maps: the clock and every press you’ve ever made, key by key. And you design what it shows.',
			note: 'With the free OPad app and tosu.',
			label: 'The OPad screen during a map',
		},
		features: {
			title: 'Your fingers are fast. Your keypad should be faster.',
			items: [
				// latency.md: the first edge is accepted at once; hall-effect.md: no contacts.
				{ name: 'Fires the instant you press', body: 'Mechanical keys take the first contact at once, with no debounce delay. Magnetic keys have no contacts at all: nothing to wait for.' },
				// latency.md: one endpoint per game key, polled at 1000 Hz.
				{ name: 'A USB lane for every key', body: 'Your two game keys never share a USB lane, so one never waits behind the other. 1000 Hz on every key.' },
				// hall-effect.md: 20 kHz frames on the V3 module, Rapid Trigger, actuation per key.
				{ name: 'Read 20,000 times a second', body: 'Magnetic switches with Rapid Trigger, and you choose where each key fires. Or classic mechanical, if that’s your thing.' },
				// AGENTS.md §1.4.
				{ name: 'Touch to retry', body: 'The screen is your fourth button. Rest a finger to restart the map. Swipe for volume and tracks.' },
				// AGENTS.md §1.2.
				{ name: 'Plug in. It’s a keyboard.', body: 'No driver, no setup, on Windows and Linux. The app adds the extras. The pad never needs it.' },
				// updates-and-rollback.md: two app slots, automatic rollback, no buttons.
				{ name: 'Updates can’t brick it', body: 'Two firmware slots and automatic rollback: if an update fails, the pad goes back to the one that worked. You never reach for a BOOT button.' },
			],
		},
		get: {
			title: 'Get an OPad',
			kickstarter: {
				name: 'Kickstarter',
				status: 'Coming soon',
				body: 'OPad is headed to Kickstarter. Date and price are on the way. Follow the project on GitHub and be the first to know.',
				action: 'Follow on GitHub',
			},
			build: {
				name: 'Build your own',
				body: 'Every file is open: firmware, app and hardware. The guide lists the parts and walks you through the build.',
				action: 'What you need',
			},
			own: {
				name: 'Already have one',
				body: 'Get the free app for the live screen, the counters and updates over USB. Windows and Linux.',
				action: 'Download the app',
			},
		},
		footer: {
			licence: 'Every key comes from a finger. Open source: software GPL-3.0-or-later, hardware CERN-OHL-S-2.0.',
			docs: 'Documentation',
			source: 'Source code',
			switchTo: 'Español',
		},
	},
	es: {
		meta: {
			title: 'OPad · El teclado de osu! con pantalla propia',
			description:
				'Tres teclas que responden en cuanto pulsas, un canal USB para cada tecla y una pantalla táctil con tus PP, tu precisión y tu combo en directo. Lo enchufas y ya es un teclado. Próximamente en Kickstarter.',
		},
		skip: 'Saltar al contenido',
		nav: { docs: 'Docs', download: 'Descargar', github: 'GitHub' },
		hero: {
			title: 'Hecho para los dedos más rápidos de osu!',
			lede: 'Tres teclas que responden en cuanto pulsas y una pantalla propia con tus PP, tu precisión y tu combo mientras juegas. Lo enchufas y ya es un teclado.',
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
			title: 'Tu partida, en directo, bajo tus dedos',
			body: 'PP, precisión, combo, nota, la canción y lo rápido que tapeas, al momento. Entre mapas: la hora y todas las pulsaciones que has hecho, tecla a tecla. Y lo que enseña lo diseñas tú.',
			note: 'Con la app gratuita de OPad y tosu.',
			label: 'La pantalla de OPad durante un mapa',
		},
		features: {
			title: 'Tus dedos son rápidos. Tu teclado debería serlo más.',
			items: [
				{ name: 'Responde en cuanto pulsas', body: 'Las teclas mecánicas aceptan el primer contacto al momento, sin retardo de antirrebote. Las magnéticas ni siquiera tienen contactos: no hay nada que esperar.' },
				{ name: 'Un canal USB para cada tecla', body: 'Tus dos teclas de juego nunca comparten canal USB, así que una nunca espera a la otra. 1000 Hz en cada tecla.' },
				{ name: 'Leídas 20.000 veces por segundo', body: 'Switches magnéticos con Rapid Trigger, y tú eliges dónde se activa cada tecla. O mecánicos de toda la vida, si lo tuyo es eso.' },
				{ name: 'Toca para reintentar', body: 'La pantalla es tu cuarto botón. Apoya un dedo para reiniciar el mapa. Desliza para el volumen y las canciones.' },
				{ name: 'Lo enchufas. Es un teclado.', body: 'Sin controladores ni configuración, en Windows y Linux. La app añade los extras. El teclado nunca la necesita.' },
				{ name: 'Una actualización no lo rompe', body: 'Dos ranuras de firmware y vuelta atrás automática: si una actualización falla, el teclado vuelve a la que funcionaba. Nunca tendrás que buscar un botón BOOT.' },
			],
		},
		get: {
			title: 'Consigue un OPad',
			kickstarter: {
				name: 'Kickstarter',
				status: 'Muy pronto',
				body: 'OPad va camino de Kickstarter. La fecha y el precio, muy pronto. Sigue el proyecto en GitHub y entérate antes que nadie.',
				action: 'Seguir en GitHub',
			},
			build: {
				name: 'Móntatelo tú',
				body: 'Todos los archivos son abiertos: firmware, app y hardware. La guía te dice qué piezas necesitas y cómo montarlo.',
				action: 'Qué necesitas',
			},
			own: {
				name: 'Ya tengo uno',
				body: 'Descarga la app gratuita para la pantalla en directo, los contadores y las actualizaciones por USB. Windows y Linux.',
				action: 'Descargar la app',
			},
		},
		footer: {
			licence: 'Cada tecla sale de un dedo. Código abierto: software GPL-3.0-or-later, hardware CERN-OHL-S-2.0.',
			docs: 'Documentación',
			source: 'Código fuente',
			switchTo: 'English',
		},
	},
} as const;
