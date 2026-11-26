// Copies the OPad case model (OpenSCAD's ASCII STL) from the OPad repository into
// public/models as compact binary STL, for the landing's 3D view.
// Source: $OPAD_REPO_DIR (default ../OPad-docs)/hardware/3d/custom_case/V3.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const repo = resolve(process.env.OPAD_REPO_DIR ?? '../OPad-docs');
const src = resolve(repo, 'hardware/3d/custom_case/V3');
const out = resolve('public/models');
const parts = { 'opad_case_top.stl': 'case-top.stl', 'opad_case_bottom.stl': 'case-bottom.stl' };

if (!existsSync(src)) {
	if (Object.values(parts).every((f) => existsSync(resolve(out, f)))) {
		console.warn(`sync-model: ${src} not found; keeping the models already in public/models.`);
		process.exit(0);
	}
	console.error(`sync-model: ${src} not found. Set OPAD_REPO_DIR to the OPad repository.`);
	process.exit(1);
}

mkdirSync(out, { recursive: true });
for (const [from, to] of Object.entries(parts)) {
	const text = readFileSync(resolve(src, from), 'utf8');
	const v = [...text.matchAll(/vertex\s+(\S+)\s+(\S+)\s+(\S+)/g)].map((m) => [+m[1], +m[2], +m[3]]);
	const tris = v.length / 3;
	const buf = Buffer.alloc(84 + tris * 50);
	buf.write('OPad case, from the OPad repository', 0);
	buf.writeUInt32LE(tris, 80);
	for (let i = 0; i < tris; i++) {
		const o = 84 + i * 50;
		const [a, b, c] = [v[i * 3], v[i * 3 + 1], v[i * 3 + 2]];
		const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
		const w = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
		const n = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]];
		const len = Math.hypot(...n) || 1;
		[...n.map((x) => x / len), ...a, ...b, ...c].forEach((x, j) => buf.writeFloatLE(x, o + j * 4));
	}
	writeFileSync(resolve(out, to), buf);
	console.log(`sync-model: ${to} (${tris} triangles, ${(buf.length / 1024).toFixed(0)} KB)`);
}
