// The landing's pad screen must format values exactly like the firmware (ui_data.c, ui_screen.c).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { IDLE, PLAYING, SAMPLE, contrastText, format, grade } from '../src/lib/pad.ts';

test('grouped integers use commas every three digits', () => {
	assert.equal(format('pad.total_lifetime', 2_475_181), '2,475,181');
	assert.equal(format('pad.k1_map', 312), '312');
	assert.equal(format('profile.rank', 12_345), '12,345');
});

test('tap rates are keys per minute, shown per second with one decimal', () => {
	assert.equal(format('play.ppm_song', 212, true), '3.5');
	assert.equal(format('play.ppm_song', 212, false), '212');
	assert.equal(format('play.k1_ppm', 0, true), '0.0');
});

test('fixed values keep the source default decimals', () => {
	assert.equal(format('play.pp', 286.4), '286');
	assert.equal(format('play.accuracy', 98.62), '98.62');
	assert.equal(format('map.stars', 6.39), '6.39');
});

test('durations are m:ss, or h:mm:ss past an hour', () => {
	assert.equal(format('map.time_elapsed', 95_000), '1:35');
	assert.equal(format('map.time_remaining', 171_304), '2:51');
	assert.equal(format('map.time_elapsed', 3_725_000), '1:02:05');
});

test('missing values show a dash, text passes through', () => {
	assert.equal(format('play.combo', undefined), '-');
	assert.equal(format('map.title', 'crystallized'), 'crystallized');
	assert.equal(format('none', 5), '');
});

test('grades and pressed-card text follow the firmware colours', () => {
	assert.deepEqual(grade('X'), { shown: 'SS', color: '#FFE066' });
	assert.deepEqual(grade('S'), { shown: 'S', color: '#FFC933' });
	assert.equal(contrastText('#FF66AA'), '#000000');
	assert.equal(contrastText('#1B1B28'), '#FFFFFF');
});

test('layouts match ui_defaults.c: 12 idle widgets, 20 playing, all on the 320×240 screen', () => {
	assert.equal(IDLE.widgets.length, 12);
	assert.equal(PLAYING.widgets.length, 20);
	for (const w of [...IDLE.widgets, ...PLAYING.widgets]) {
		assert.ok(w.x >= 0 && w.y >= 0 && w.x + w.w <= 320 && w.y + w.h <= 240, `${w.source} at ${w.x},${w.y}`);
		if (w.source !== 'none' && w.kind !== 'status') assert.ok(w.source in SAMPLE, `${w.source} has a sample value`);
	}
});
