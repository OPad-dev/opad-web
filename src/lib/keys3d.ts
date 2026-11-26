/**
 * An MX switch's top housing and a Cherry-profile keycap, built at their real sizes (mm),
 * Z up, centred on the switch, with z = 0 at the plate's top face.
 *
 * Switch (Cherry MX datasheet): the top housing stands 6.6 mm above the plate, 15.6 mm
 * square at the plate, narrowing to about 11 x 11.6 mm at the top.
 * Keycap (Cherry profile, row 3): 18 x 18 mm at the skirt, a 12.7 x 14.6 mm top with a
 * cylindrical dish, about 8 mm tall, tilted slightly towards the player. At rest its skirt
 * is 5.5 mm above the plate and it travels 4 mm (the case model's keycap reference).
 */
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

export const CAP_REST = 5.5;
export const TRAVEL = 4;

type Ring = { w: number; h: number; r: number; cy?: number };

/** Points round a rounded rectangle, the same count for any size, so rings can be lofted. */
function ringPoints({ w, h, r, cy = 0 }: Ring, perCorner = 6): [number, number][] {
	const pts: [number, number][] = [];
	const corners: [number, number, number][] = [
		[w / 2 - r, h / 2 - r, 0],
		[-w / 2 + r, h / 2 - r, Math.PI / 2],
		[-w / 2 + r, -h / 2 + r, Math.PI],
		[w / 2 - r, -h / 2 + r, (3 * Math.PI) / 2],
	];
	for (const [x, y, a0] of corners) {
		for (let i = 0; i <= perCorner; i++) {
			const a = a0 + (i / perCorner) * (Math.PI / 2);
			pts.push([x + r * Math.cos(a), cy + y + r * Math.sin(a)]);
		}
	}
	return pts;
}

/** Side walls through rings at heights z (z may vary round the ring, through zAt). */
function loft(rings: { ring: Ring; z: number | ((x: number, y: number) => number) }[]) {
	const loops = rings.map(({ ring, z }) => ringPoints(ring).map(([x, y]) => [x, y, typeof z === 'number' ? z : z(x, y)]));
	const n = loops[0].length;
	const position = loops.flat(2);
	const index: number[] = [];
	for (let k = 0; k < loops.length - 1; k++) {
		for (let i = 0; i < n; i++) {
			const a = k * n + i;
			const b = k * n + ((i + 1) % n);
			index.push(a, b, a + n, b, b + n, a + n);
		}
	}
	const g = new THREE.BufferGeometry();
	g.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));
	g.setIndex(index);
	g.computeVertexNormals();
	return g;
}

/** A cap over a ring, filled from its edge to the middle, at heights zAt; UVs span the ring. */
function cap(ring: Ring, zAt: (x: number, y: number) => number, facingUp: boolean) {
	const steps = 8;
	const edge = ringPoints(ring);
	const n = edge.length;
	const cy = ring.cy ?? 0;
	const position: number[] = [];
	const uv: number[] = [];
	for (let j = 0; j < steps; j++) {
		const s = 1 - j / steps;
		for (const [x, y] of edge) {
			const [px, py] = [x * s, cy + (y - cy) * s];
			position.push(px, py, zAt(px, py));
			uv.push(px / ring.w + 0.5, (py - cy) / ring.h + 0.5);
		}
	}
	position.push(0, cy, zAt(0, cy));
	uv.push(0.5, 0.5);
	const centre = steps * n;
	const index: number[] = [];
	for (let j = 0; j < steps; j++) {
		for (let i = 0; i < n; i++) {
			const a = j * n + i;
			const b = j * n + ((i + 1) % n);
			if (j === steps - 1) index.push(a, b, centre);
			else index.push(a, b, a + n, b, b + n, a + n);
		}
	}
	if (!facingUp) for (let i = 0; i < index.length; i += 3) [index[i + 1], index[i + 2]] = [index[i + 2], index[i + 1]];
	const g = new THREE.BufferGeometry();
	g.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));
	g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
	g.setIndex(index);
	g.computeVertexNormals();
	return g;
}

const withUv = (g: THREE.BufferGeometry) => {
	if (!g.getAttribute('uv')) g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(g.getAttribute('position').count * 2), 2));
	return g;
};

/** The switch's top housing: a short straight flange on the plate, then the tapered body. */
export function switchGeometry() {
	const base: Ring = { w: 15.6, h: 15.6, r: 0.8 };
	const top: Ring = { w: 11.0, h: 11.6, r: 1.2 };
	return mergeGeometries([
		loft([
			{ ring: base, z: 0 },
			{ ring: base, z: 0.9 },
			{ ring: { w: 14.6, h: 14.8, r: 1.0 }, z: 1.4 },
			{ ring: top, z: 6.4 },
			{ ring: { w: 10.6, h: 11.2, r: 1.0 }, z: 6.6 },
		]),
		cap({ w: 10.6, h: 11.2, r: 1.0 }, () => 6.6, true),
	].map((g) => withUv(g.toNonIndexed())));
}

/**
 * The keycap, from its skirt (z = 0) up. Group 0 is the sides and underside, group 1 the
 * dished top, whose UVs span the top face (for the legend).
 */
export function keycapGeometry() {
	const skirt: Ring = { w: 18.0, h: 18.0, r: 1.0 };
	const top: Ring = { w: 12.7, h: 14.6, r: 2.0, cy: 0.6 };
	const height = 7.9;
	const tilt = Math.tan(THREE.MathUtils.degToRad(2.5));
	const dish = 0.6;
	// The top: tilted towards the front, with a cylindrical dish across its width.
	const topZ = (x: number, y: number) => height + (y - (top.cy ?? 0)) * tilt - dish * (1 - (2 * x) / top.w * ((2 * x) / top.w));
	// Walls bow out a little on the way up, like a moulded cap.
	const mid = (t: number, bow: number): Ring => ({
		w: skirt.w + (top.w - skirt.w) * t + bow,
		h: skirt.h + (top.h - skirt.h) * t + bow,
		r: skirt.r + (top.r - skirt.r) * t,
		cy: (top.cy ?? 0) * t,
	});
	const sides = loft([
		{ ring: skirt, z: 0 },
		{ ring: mid(0.25, 0.35), z: height * 0.25 },
		{ ring: mid(0.55, 0.45), z: height * 0.55 },
		{ ring: mid(0.85, 0.25), z: (x, y) => topZ(x * 1.02, y) - 0.9 },
		{ ring: { ...top, w: top.w + 0.5, h: top.h + 0.5, r: top.r + 0.25 }, z: (x, y) => topZ(x / 1.04, y) - 0.25 },
	]);
	const underside = cap(skirt, () => 0, false);
	const face = cap(top, topZ, true);
	return mergeGeometries([mergeGeometries([withUv(sides.toNonIndexed()), underside.toNonIndexed()]), face.toNonIndexed()], true);
}
