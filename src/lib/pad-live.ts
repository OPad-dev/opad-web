/**
 * The page's keypad state, in the browser. Physical Z/X/C (or press()/release() from a
 * tap on a drawn key) drive the counters the way the firmware does. Every screen drawn
 * with [data-live] follows along; listeners hear key changes and value changes.
 */
import { SAMPLE, format, type Source, type Values } from './pad';

export type Key = 1 | 2 | 3;

const values: Values = { ...SAMPLE };
const down: Record<Key, boolean> = { 1: false, 2: false, 3: false };
const taps: Record<1 | 2, number[]> = { 1: [], 2: [] };
const recent: number[] = [];
const keyListeners = new Set<(k: Key, isDown: boolean) => void>();
const changeListeners = new Set<() => void>();
let decay = 0;

const changed = () => changeListeners.forEach((cb) => cb());

const render = (src: Source) => {
	document.querySelectorAll<SVGTextElement>(`[data-live] [data-src="${src}"]`).forEach((el) => {
		const value = format(src, values[src], 'perSecond' in el.dataset);
		el.textContent = `${el.dataset.label ?? ''}${value}${el.dataset.suffix ?? ''}`;
	});
};
const bump = (src: Source) => {
	values[src] = Number(values[src] ?? 0) + 1;
	render(src);
};

// Live tap rate: presses in the last second, as keys per minute (the firmware's unit).
const updateRates = () => {
	const now = performance.now();
	let active = false;
	for (const k of [1, 2] as const) {
		taps[k] = taps[k].filter((t) => now - t < 1000);
		values[`play.k${k}_ppm`] = taps[k].length * 60;
		render(`play.k${k}_ppm`);
		active ||= taps[k].length > 0;
	}
	changed();
	if (active) decay = window.setTimeout(updateRates, 200);
};

const mark = (k: Key, isDown: boolean) => {
	document
		.querySelectorAll(`[data-live] .keycard[data-key="${k}"]`)
		.forEach((el) => el.classList.toggle('is-down', isDown));
	keyListeners.forEach((cb) => cb(k, isDown));
};

export const press = (k: Key) => {
	if (down[k]) return;
	down[k] = true;
	mark(k, true);
	bump('pad.total_lifetime');
	const now = performance.now();
	// The default screens show cards for keys 1 and 2; key 3 counts toward the total.
	if (k !== 3) {
		bump(`pad.k${k}_lifetime`);
		bump(`pad.k${k}_map`);
		taps[k].push(now);
	}
	// PEAK: the fastest 7 presses in a row, as the firmware measures it.
	recent.push(now);
	if (recent.length > 7) recent.shift();
	if (recent.length === 7) {
		const ppm = (6 / (now - recent[0])) * 60_000;
		if (ppm > Number(values['play.ppm_peak'] ?? 0)) {
			values['play.ppm_peak'] = ppm;
			render('play.ppm_peak');
		}
	}
	window.clearTimeout(decay);
	updateRates();
};

export const release = (k: Key) => {
	if (!down[k]) return;
	down[k] = false;
	mark(k, false);
	changed();
};

export const onKey = (cb: (k: Key, isDown: boolean) => void) => keyListeners.add(cb);
export const onChange = (cb: () => void) => changeListeners.add(cb);

const KEYS: Record<string, Key> = { KeyZ: 1, KeyX: 2, KeyC: 3 };
const typing = (target: EventTarget | null) =>
	target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));

addEventListener('keydown', (e) => {
	const k = KEYS[e.code];
	if (!k || e.repeat || e.ctrlKey || e.metaKey || e.altKey || typing(e.target)) return;
	press(k);
});
addEventListener('keyup', (e) => {
	const k = KEYS[e.code];
	if (k) release(k);
});
addEventListener('blur', () => ([1, 2, 3] as const).forEach(release));
