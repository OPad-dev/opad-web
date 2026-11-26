/**
 * The pad's screen, as the firmware draws it.
 *
 * Layouts: firmware/main/ui/core/ui_defaults.c (the built-in Idle and Playing screens).
 * Formatting: firmware/main/ui/core/ui_data.c (ui_data_format) and its source table.
 * Sample values: desktop/crates/opad-ui-preview/src/lib.rs (sample_values), the same
 * values the app's Screen Designer shows when tosu is not running.
 */

export const COLOR = {
	bg: '#0E0E16',
	card: '#1B1B28',
	border: '#2A2A3C',
	pink: '#FF66AA',
	white: '#FFFFFF',
	muted: '#8C8CA6',
	yellow: '#FFCC33',
	cyan: '#66CCFF',
	green: '#44DD88',
	off: '#3A3A4C',
} as const;

export type Kind = 'text' | 'keycard' | 'status' | 'rect' | 'progress' | 'grade';
export type Align = 'left' | 'center' | 'right';
export type Source =
	| 'none'
	| 'pad.clock'
	| 'pad.date'
	| 'status.pc'
	| 'status.tosu'
	| 'pad.total_lifetime'
	| 'pad.k1_lifetime'
	| 'pad.k2_lifetime'
	| 'profile.name'
	| 'profile.rank'
	| 'profile.pp'
	| 'map.title'
	| 'map.artist'
	| 'map.difficulty'
	| 'map.stars'
	| 'play.pp'
	| 'play.ppm_song'
	| 'play.ppm_peak'
	| 'play.accuracy'
	| 'play.combo'
	| 'play.grade'
	| 'pad.k1_map'
	| 'pad.k2_map'
	| 'play.k1_ppm'
	| 'play.k2_ppm'
	| 'map.time_elapsed'
	| 'map.progress'
	| 'map.time_remaining'
	| 'play.mods'
	| 'play.max_combo';

export interface Widget {
	kind: Kind;
	source: Source;
	font?: 12 | 14 | 16 | 20 | 24 | 32 | 48;
	align?: Align;
	x: number;
	y: number;
	w: number;
	h: number;
	fg?: string;
	bg?: string;
	accent?: string;
	radius?: number;
	label?: string;
	suffix?: string;
	/** UI_FLAG_BG_FILL */
	fill?: boolean;
	/** UI_FLAG_BORDER */
	border?: boolean;
	/** UI_FLAG_PER_SECOND: tap rates shown as keys per second */
	perSecond?: boolean;
	/** UI_FLAG_KEY_RATE: key card shows its key's live rate */
	keyRate?: boolean;
}

export interface Layout {
	background: string;
	widgets: Widget[];
}

const { bg: BG, card: CARD, pink: PINK, white: WHITE, muted: MUTED, yellow: YELLOW, cyan: CYAN, green: GREEN, off: OFF } = COLOR;

export const IDLE: Layout = {
	background: BG,
	widgets: [
		{ kind: 'text', source: 'pad.clock', font: 24, align: 'left', x: 12, y: 4, w: 76, h: 28, fg: WHITE },
		{ kind: 'text', source: 'pad.date', font: 14, align: 'left', x: 92, y: 8, w: 104, h: 22, fg: MUTED },
		{ kind: 'status', source: 'status.pc', font: 14, x: 198, y: 8, w: 44, h: 22, fg: MUTED, bg: OFF, accent: GREEN, label: 'PC' },
		{ kind: 'status', source: 'status.tosu', font: 14, x: 248, y: 8, w: 64, h: 22, fg: MUTED, bg: OFF, accent: GREEN, label: 'tosu' },
		{ kind: 'text', source: 'none', font: 14, align: 'center', x: 0, y: 40, w: 320, h: 18, fg: MUTED, label: 'TOTAL PRESSES' },
		{ kind: 'text', source: 'pad.total_lifetime', font: 48, align: 'center', x: 0, y: 58, w: 320, h: 54, fg: WHITE },
		{ kind: 'keycard', source: 'pad.k1_lifetime', font: 24, x: 12, y: 118, w: 144, h: 64, fg: BG, bg: PINK, accent: CARD, radius: 12, border: true, label: 'K1' },
		{ kind: 'keycard', source: 'pad.k2_lifetime', font: 24, x: 164, y: 118, w: 144, h: 64, fg: WHITE, bg: CARD, accent: PINK, radius: 12, border: true, label: 'K2' },
		{ kind: 'rect', source: 'none', x: 12, y: 190, w: 296, h: 42, bg: CARD, radius: 12 },
		{ kind: 'text', source: 'profile.name', font: 20, align: 'left', x: 24, y: 190, w: 116, h: 42, fg: WHITE },
		{ kind: 'text', source: 'profile.rank', font: 16, align: 'center', x: 140, y: 190, w: 86, h: 42, fg: MUTED, label: '#' },
		{ kind: 'text', source: 'profile.pp', font: 16, align: 'right', x: 226, y: 190, w: 70, h: 42, fg: PINK, suffix: 'pp' },
	],
};

export const PLAYING: Layout = {
	background: BG,
	widgets: [
		{ kind: 'text', source: 'none', font: 14, align: 'center', x: 96, y: 4, w: 128, h: 22, fg: BG, bg: PINK, radius: 11, fill: true, label: 'osu! PLAYING' },
		{ kind: 'text', source: 'map.title', font: 20, align: 'center', x: 8, y: 29, w: 304, h: 24, fg: WHITE },
		{ kind: 'text', source: 'map.artist', font: 14, align: 'center', x: 8, y: 53, w: 304, h: 18, fg: MUTED },
		{ kind: 'text', source: 'map.difficulty', font: 14, align: 'right', x: 8, y: 71, w: 200, h: 18, fg: CYAN, label: '[', suffix: ']' },
		{ kind: 'text', source: 'map.stars', font: 14, align: 'left', x: 214, y: 71, w: 98, h: 18, fg: YELLOW, suffix: ' *' },
		{ kind: 'text', source: 'play.pp', font: 48, align: 'center', x: 0, y: 87, w: 224, h: 54, fg: WHITE, suffix: 'pp' },
		{ kind: 'rect', source: 'none', font: 14, x: 226, y: 88, w: 88, h: 74, fg: '#2A2A3C', bg: CARD, radius: 12, border: true },
		{ kind: 'text', source: 'none', font: 12, align: 'center', x: 226, y: 92, w: 85, h: 14, fg: MUTED, label: 'AVG KPS' },
		{ kind: 'text', source: 'play.ppm_song', font: 32, align: 'center', x: 226, y: 105, w: 88, h: 34, fg: PINK, perSecond: true },
		{ kind: 'text', source: 'play.ppm_peak', font: 14, align: 'center', x: 226, y: 140, w: 88, h: 18, fg: WHITE, perSecond: true, label: 'PEAK ' },
		{ kind: 'text', source: 'play.accuracy', font: 20, align: 'center', x: 4, y: 140, w: 92, h: 24, fg: WHITE, suffix: '%' },
		{ kind: 'text', source: 'play.combo', font: 20, align: 'center', x: 96, y: 140, w: 64, h: 24, fg: WHITE, suffix: 'x' },
		{ kind: 'grade', source: 'play.grade', font: 24, align: 'center', x: 160, y: 138, w: 68, h: 27, fg: WHITE },
		{ kind: 'keycard', source: 'pad.k1_map', font: 24, x: 12, y: 166, w: 144, h: 48, fg: BG, bg: PINK, accent: CARD, radius: 12, border: true, keyRate: true, perSecond: true, label: 'K1' },
		{ kind: 'keycard', source: 'pad.k2_map', font: 24, x: 164, y: 166, w: 144, h: 48, fg: WHITE, bg: CARD, accent: PINK, radius: 12, border: true, keyRate: true, perSecond: true, label: 'K2' },
		{ kind: 'text', source: 'map.time_elapsed', font: 14, align: 'right', x: 2, y: 218, w: 48, h: 20, fg: MUTED },
		{ kind: 'progress', source: 'map.progress', x: 56, y: 224, w: 208, h: 8, bg: CARD, accent: PINK, radius: 4 },
		{ kind: 'text', source: 'map.time_remaining', font: 14, align: 'left', x: 270, y: 218, w: 48, h: 20, fg: MUTED, label: '-' },
		{ kind: 'text', source: 'play.mods', font: 14, align: 'left', x: 10, y: 6, w: 84, h: 18, fg: YELLOW },
		{ kind: 'text', source: 'play.max_combo', font: 14, align: 'right', x: 226, y: 6, w: 86, h: 18, fg: MUTED, label: 'max ', suffix: 'x' },
	],
};

type Format = 'text' | 'int' | 'grouped' | 'fixed' | 'percent' | 'duration';

/** Format and default decimals per source (ui_data.c, s_info). */
const INFO: Record<Exclude<Source, 'none'>, [Format, number]> = {
	'pad.clock': ['text', 0],
	'pad.date': ['text', 0],
	'status.pc': ['int', 0],
	'status.tosu': ['int', 0],
	'pad.total_lifetime': ['grouped', 0],
	'pad.k1_lifetime': ['grouped', 0],
	'pad.k2_lifetime': ['grouped', 0],
	'profile.name': ['text', 0],
	'profile.rank': ['grouped', 0],
	'profile.pp': ['fixed', 0],
	'map.title': ['text', 0],
	'map.artist': ['text', 0],
	'map.difficulty': ['text', 0],
	'map.stars': ['fixed', 2],
	'play.pp': ['fixed', 0],
	'play.ppm_song': ['int', 0],
	'play.ppm_peak': ['int', 0],
	'play.accuracy': ['fixed', 2],
	'play.combo': ['grouped', 0],
	'play.grade': ['text', 0],
	'pad.k1_map': ['grouped', 0],
	'pad.k2_map': ['grouped', 0],
	'play.k1_ppm': ['int', 0],
	'play.k2_ppm': ['int', 0],
	'map.time_elapsed': ['duration', 0],
	'map.progress': ['percent', 0],
	'map.time_remaining': ['duration', 0],
	'play.mods': ['text', 0],
	'play.max_combo': ['grouped', 0],
};

const TAP_RATES = new Set<Source>(['play.ppm_song', 'play.ppm_peak', 'play.k1_ppm', 'play.k2_ppm']);

export type Values = Partial<Record<Source, string | number>>;

/** The Screen Designer's sample values (sample_values()). */
export const SAMPLE: Values = {
	'pad.clock': '21:07',
	'pad.date': 'Sat 12 Sep',
	'status.pc': 1,
	'status.tosu': 1,
	'pad.total_lifetime': 2_475_181,
	'pad.k1_lifetime': 1_284_311,
	'pad.k2_lifetime': 1_190_870,
	'profile.name': 'osu!player',
	'profile.rank': 12_345,
	'profile.pp': 4321,
	'map.title': 'crystallized',
	'map.artist': 'Camellia',
	'map.difficulty': 'My Friends Never Die',
	'map.stars': 6.39,
	'play.pp': 286.4,
	'play.ppm_song': 212,
	'play.ppm_peak': 246,
	'play.accuracy': 98.62,
	'play.combo': 412,
	'play.grade': 'S',
	'pad.k1_map': 312,
	'pad.k2_map': 287,
	'play.k1_ppm': 104,
	'play.k2_ppm': 97,
	'map.time_elapsed': 95_000,
	'map.progress': 0.34,
	'map.time_remaining': 171_304,
	'play.mods': 'HD',
	'play.max_combo': 530,
};

function grouped(v: number): string {
	const digits = String(Math.abs(Math.round(v)));
	let out = v < 0 ? '-' : '';
	for (let i = 0; i < digits.length; i++) {
		if (i > 0 && (digits.length - i) % 3 === 0) out += ',';
		out += digits[i];
	}
	return out;
}

/** ui_data_format: the value part of a widget's text. */
export function format(source: Source, value: string | number | undefined, perSecond = false): string {
	if (source === 'none') return '';
	if (value === undefined) return '-';
	const [fmt, dec] = INFO[source];
	if (fmt === 'text' || typeof value === 'string') return String(value);
	if (perSecond && TAP_RATES.has(source)) return (value / 60).toFixed(1);
	switch (fmt) {
		case 'grouped':
			return grouped(value);
		case 'fixed':
			return value.toFixed(dec);
		case 'percent':
			return (value * 100).toFixed(dec);
		case 'duration': {
			const total = Math.floor(Math.abs(Math.round(value)) / 1000);
			const h = Math.floor(total / 3600);
			const m = Math.floor(total / 60) % 60;
			const s = String(total % 60).padStart(2, '0');
			return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${s}` : `${Math.floor(total / 60)}:${s}`;
		}
		default:
			return String(Math.round(value));
	}
}

/** ui_grade_color / ui_grade_shown. */
export function grade(g: string): { shown: string; color: string } {
	const shown = g === 'X' || g === 'XH' ? 'SS' : g === 'SH' ? 'S' : g;
	let color = '#9A9AB0';
	if (g === 'XH' || g === 'SSH' || g === 'SH') color = '#DDE6F0';
	else if (g === 'X' || g === 'SS') color = '#FFE066';
	else if (g[0] === 'S') color = '#FFC933';
	else if (g[0] === 'A') color = '#88DD44';
	else if (g[0] === 'B') color = '#44AAFF';
	else if (g[0] === 'C') color = '#DD66FF';
	else if (g[0] === 'D') color = '#FF5566';
	return { shown, color };
}

/** contrast_text in ui_screen.c: black on light colours, white on dark ones. */
export function contrastText(hex: string): string {
	const n = parseInt(hex.slice(1), 16);
	const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
	return (r * 299 + g * 587 + b * 114) / 1000 > 150 ? '#000000' : '#FFFFFF';
}

/** The key rate a key card shows (key_rate_source). */
export function keyRateSource(source: Source): Source {
	if (source === 'pad.k1_map' || source === 'pad.k1_lifetime') return 'play.k1_ppm';
	if (source === 'pad.k2_map' || source === 'pad.k2_lifetime') return 'play.k2_ppm';
	return 'none';
}

/** Which key (1 or 2) a key card belongs to. */
export function keyOf(source: Source): 1 | 2 | 0 {
	if (source.startsWith('pad.k1_')) return 1;
	if (source.startsWith('pad.k2_')) return 2;
	return 0;
}

/** LVGL Montserrat line heights for the firmware's sizes (lv_font_montserrat_*). */
export const LINE_HEIGHT: Record<number, number> = { 12: 15, 14: 16, 16: 18, 20: 22, 24: 27, 32: 35, 48: 51 };
