// Copies the OPad case model (OpenSCAD's ASCII STL) from the OPad repository into
// public/models as compact binary STL, for the landing's 3D view.
// Source: hardware/3d/custom_case/V4 of the OPad repository (see opad-repo.mjs).
//
// The V-grooves along the side creases are split out of the top case into
// case-crease.stl, so the page can colour them. Their place comes from the V4 exterior
// in opad_params.scad (TOP_LINE, SIDE_FACETS, CREASE_V), in the top case's print frame
// (the STL is exported BASE_T lower than the assembly). If the model changes and the
// grooves are no longer found, the sync fails instead of shipping a case without them.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { opadRepo } from './opad-repo.mjs';

const repo = opadRepo();
const src = repo ? resolve(repo, 'hardware/3d/custom_case/V4') : '(OPad repository not available)';
const out = resolve('public/models');
const files = ['case-top.stl', 'case-crease.stl', 'case-bottom.stl'];

// opad_params.scad, V4 exterior (OpenSCAD's echo of the evaluated values).
const CASE_W = 84;
const BASE_T = 2;
const TOP_LINE = [[0, 9.1], [2.5, 11.6], [25, 11.6], [29.5, 13.4], [33, 17.1], [35, 21.6247], [78.3721, 34.0614], [79.5, 31.0614], [82.5, 17.6337]];
// SIDE_FACETS[1]. The groove's faces lie within 0.57 mm of the crease; 0.8 takes all of them
// (V4 has 160, and none more up to 1 mm) and none of the facets beside them.
const CREASE = { in: 2, down: -1.8, reach: 0.8 };
const MIN_CREASE_TRIS = 100;

if (!existsSync(src)) {
	if (files.every((f) => existsSync(resolve(out, f)))) {
		console.warn(`sync-model: ${src} not found; keeping the models already in public/models.`);
		process.exit(0);
	}
	console.error(`sync-model: ${src} not found. Check the connection or set OPAD_REPO_DIR to a local checkout.`);
	process.exit(1);
}

/** Height of the top line at y, in the top case's print frame. */
function topLine(y) {
	for (let i = 0; i < TOP_LINE.length - 1; i++) {
		const [[y0, z0], [y1, z1]] = [TOP_LINE[i], TOP_LINE[i + 1]];
		if (y <= y1) return z0 + ((Math.max(y, y0) - y0) / (y1 - y0)) * (z1 - z0) - BASE_T;
	}
	return TOP_LINE.at(-1)[1] - BASE_T;
}
const inCrease = ([x, y, z]) =>
	Math.min(Math.abs(x - CREASE.in), Math.abs(x - (CASE_W - CREASE.in))) <= CREASE.reach &&
	Math.abs(z - (topLine(y) + CREASE.down)) <= CREASE.reach;

const readTris = (file) => {
	const v = [...readFileSync(resolve(src, file), 'utf8').matchAll(/vertex\s+(\S+)\s+(\S+)\s+(\S+)/g)].map((m) => [+m[1], +m[2], +m[3]]);
	return Array.from({ length: v.length / 3 }, (_, i) => v.slice(i * 3, i * 3 + 3));
};

function write(name, tris) {
	const buf = Buffer.alloc(84 + tris.length * 50);
	buf.write('OPad case, from the OPad repository', 0);
	buf.writeUInt32LE(tris.length, 80);
	tris.forEach(([a, b, c], i) => {
		const o = 84 + i * 50;
		const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
		const w = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
		const n = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]];
		const len = Math.hypot(...n) || 1;
		[...n.map((x) => x / len), ...a, ...b, ...c].forEach((x, j) => buf.writeFloatLE(x, o + j * 4));
	});
	writeFileSync(resolve(out, name), buf);
	console.log(`sync-model: ${name} (${tris.length} triangles, ${(buf.length / 1024).toFixed(0)} KB)`);
}

mkdirSync(out, { recursive: true });
const top = readTris('opad_case_top.stl');
const crease = top.filter((t) => t.every(inCrease));
const sides = [crease.filter((t) => t[0][0] < CASE_W / 2).length, crease.filter((t) => t[0][0] > CASE_W / 2).length];
if (crease.length < MIN_CREASE_TRIS || sides.some((n) => n < MIN_CREASE_TRIS / 2)) {
	console.error(`sync-model: found ${sides.join(' + ')} crease triangles (left + right) in the top case, expected at least ${MIN_CREASE_TRIS / 2} a side.`);
	console.error('The V4 exterior changed: update TOP_LINE and CREASE in scripts/sync-model.mjs from opad_params.scad.');
	process.exit(1);
}
write('case-top.stl', top.filter((t) => !t.every(inCrease)));
write('case-crease.stl', crease);
write('case-bottom.stl', readTris('opad_case_bottom.stl'));
