/**
 * The 3D OPad: the case model from the OPad repository (hardware/3d/custom_case),
 * plus keycaps and the screen at the model's own measurements (opad_params.scad).
 * Units are millimetres, Z up, origin at the case's front-left bottom corner.
 * Renders on demand: a frame is drawn only when something changes.
 */
import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { toCreasedNormals } from 'three/addons/utils/BufferGeometryUtils.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { onChange, onKey, press, release, type Key } from './pad-live';

// From opad_params.scad.
const CASE_W = 84;
const CASE_L = 82.5;
const KEY_X = [22.95, 42, 61.05];
const KEY_Y = 16.5;
const KEY_DECK_H = 11.6;
const TILT = THREE.MathUtils.degToRad(16);
const GLASS = { x: 59.22, y: 37.52, y_c: 56.6861, z_c: 27.843 };
// The 2-inch panel's active area (4:3), centred in the glass.
const ACTIVE = { x: 40.8, y: 30.6 };

// The app's colours (desktop/gui/src/theme.rs).
const COLOR = { case: 0x202032, switch: 0x0b0b12, plate: 0x13131e, keycap: 0x2a2a3c, legend: '#ff66aa', glass: 0x050508 };

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

export async function mount(figure: HTMLElement, opts: { still?: boolean } = {}) {
	const stage = figure.querySelector<HTMLElement>('[data-stage]')!;
	const source = figure.querySelector<SVGSVGElement>('[data-screen-texture]')!;

	const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: !!opts.still });
	renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
	renderer.outputColorSpace = THREE.SRGBColorSpace;
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 1.05;
	stage.append(renderer.domElement);

	const scene = new THREE.Scene();
	const pmrem = new THREE.PMREMGenerator(renderer);
	scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
	scene.environmentIntensity = 0.55;

	const camera = new THREE.PerspectiveCamera(26, 4 / 3, 10, 2000);
	camera.position.set(0, 128, 182);
	camera.lookAt(0, 8, 2);

	const key = new THREE.DirectionalLight(0xffffff, 2.2);
	key.position.set(-120, 260, 160);
	const rim = new THREE.DirectionalLight(0xffc2dc, 0.9);
	rim.position.set(160, 80, -200);
	scene.add(key, rim, new THREE.HemisphereLight(0xbfc3ff, 0x0e0e16, 0.5));

	// The model, in its own frame (mm, Z up), turned to Y up and centred.
	const turntable = new THREE.Group();
	const model = new THREE.Group();
	model.rotation.x = -Math.PI / 2;
	model.position.set(-CASE_W / 2, 0, CASE_L / 2);
	turntable.add(model);
	scene.add(turntable);

	const loader = new STLLoader();
	const caseMaterial = new THREE.MeshStandardMaterial({ color: COLOR.case, roughness: 0.62, metalness: 0 });
	const plateMaterial = new THREE.MeshStandardMaterial({ color: COLOR.plate, roughness: 0.7 });
	const [top, bottom] = await Promise.all(
		['/models/case-top.stl', '/models/case-bottom.stl'].map((url) => loader.loadAsync(url)),
	);
	for (const [geometry, material] of [
		[top, caseMaterial],
		[bottom, plateMaterial],
	] as const) {
		model.add(new THREE.Mesh(toCreasedNormals(geometry, THREE.MathUtils.degToRad(30)), material));
	}

	// Soft contact shadow under the case.
	{
		const c = document.createElement('canvas');
		c.width = c.height = 128;
		const g = c.getContext('2d')!;
		const grad = g.createRadialGradient(64, 64, 8, 64, 64, 64);
		grad.addColorStop(0, 'rgba(0,0,0,0.75)');
		grad.addColorStop(1, 'rgba(0,0,0,0)');
		g.fillStyle = grad;
		g.fillRect(0, 0, 128, 128);
		const shadow = new THREE.Mesh(
			new THREE.PlaneGeometry(CASE_W * 1.7, CASE_L * 1.6),
			new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false }),
		);
		shadow.position.set(CASE_W / 2, CASE_L / 2, -0.2);
		model.add(shadow);
	}

	// Keycaps: MX profile on the three switches, with the legends the keypad types.
	const fontFamily = getComputedStyle(document.body).fontFamily;
	await document.fonts.load(`700 120px ${fontFamily}`).catch(() => {});
	const keycaps: THREE.Group[] = [];
	const capGeometry = new RoundedBoxGeometry(17.8, 17.8, 7.6, 4, 2.2);
	const capMaterial = new THREE.MeshStandardMaterial({ color: COLOR.keycap, roughness: 0.55 });
	// The switches under the caps fill the deck's cutouts.
	const switchGeometry = new THREE.BoxGeometry(14, 14, 5.2);
	const switchMaterial = new THREE.MeshStandardMaterial({ color: COLOR.switch, roughness: 0.8 });
	for (const x of KEY_X) {
		const sw = new THREE.Mesh(switchGeometry, switchMaterial);
		sw.position.set(x, KEY_Y, KEY_DECK_H + 1.6);
		model.add(sw);
	}
	['Z', 'X', 'C'].forEach((letter, i) => {
		const cap = new THREE.Group();
		cap.position.set(KEY_X[i], KEY_Y, KEY_DECK_H + 3.4 + 3.8);
		const body = new THREE.Mesh(capGeometry, capMaterial);
		body.userData.key = i + 1;
		const c = document.createElement('canvas');
		c.width = c.height = 256;
		const g = c.getContext('2d')!;
		g.fillStyle = COLOR.legend;
		g.font = `700 120px ${fontFamily}`;
		g.textAlign = 'center';
		g.textBaseline = 'middle';
		g.fillText(letter, 128, 136);
		const legendTexture = new THREE.CanvasTexture(c);
		legendTexture.colorSpace = THREE.SRGBColorSpace;
		legendTexture.anisotropy = 4;
		const legend = new THREE.Mesh(
			new THREE.PlaneGeometry(12, 12),
			new THREE.MeshBasicMaterial({ map: legendTexture, transparent: true, toneMapped: false }),
		);
		legend.position.z = 3.81;
		cap.add(body, legend);
		model.add(cap);
		keycaps.push(cap);
	});

	// The screen: black glass, flush with the pod's frame, and the panel showing the live UI.
	const deck = new THREE.Group();
	deck.position.set(CASE_W / 2, GLASS.y_c, GLASS.z_c);
	deck.rotation.x = TILT;
	model.add(deck);
	{
		const shape = new THREE.Shape();
		const [w, h, r] = [GLASS.x / 2, GLASS.y / 2, 2.6];
		shape.moveTo(-w + r, -h);
		shape.lineTo(w - r, -h);
		shape.quadraticCurveTo(w, -h, w, -h + r);
		shape.lineTo(w, h - r);
		shape.quadraticCurveTo(w, h, w - r, h);
		shape.lineTo(-w + r, h);
		shape.quadraticCurveTo(-w, h, -w, h - r);
		shape.lineTo(-w, -h + r);
		shape.quadraticCurveTo(-w, -h, -w + r, -h);
		const glass = new THREE.Mesh(
			new THREE.ShapeGeometry(shape, 8),
			new THREE.MeshStandardMaterial({ color: COLOR.glass, roughness: 0.08, metalness: 0.2 }),
		);
		glass.position.z = 0.02;
		deck.add(glass);
	}
	const screenCanvas = document.createElement('canvas');
	screenCanvas.width = 960;
	screenCanvas.height = 720;
	const screenTexture = new THREE.CanvasTexture(screenCanvas);
	screenTexture.colorSpace = THREE.SRGBColorSpace;
	screenTexture.anisotropy = 8;
	const panel = new THREE.Mesh(
		new THREE.PlaneGeometry(ACTIVE.x, ACTIVE.y),
		new THREE.MeshBasicMaterial({ map: screenTexture, toneMapped: false }),
	);
	panel.position.z = 0.05;
	deck.add(panel);

	// Frames on demand.
	let frame = 0;
	const draw = () => {
		frame = 0;
		renderer.render(scene, camera);
	};
	const invalidate = () => {
		if (!frame) frame = requestAnimationFrame(draw);
	};

	// Copy the off-screen SVG (with the page's font embedded) onto the panel.
	const fontCss = await embeddedFont();
	let painting = false;
	let again = false;
	const paintScreen = async () => {
		if (painting) return void (again = true);
		painting = true;
		const clone = source.cloneNode(true) as SVGSVGElement;
		clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
		clone.setAttribute('width', String(screenCanvas.width));
		clone.setAttribute('height', String(screenCanvas.height));
		clone.removeAttribute('class');
		const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
		style.textContent = `${fontCss}
			text { font-family: OPadScreen, sans-serif; font-weight: 500; }
			.kc-card { fill: var(--kc-bg); stroke: var(--kc-accent); stroke-opacity: .5; }
			.kc-text { fill: var(--kc-fg); } .kc-title { fill-opacity: .7; }
			.keycard.is-down .kc-card { fill: var(--kc-accent); stroke: var(--kc-bg); }
			.keycard.is-down .kc-text { fill: var(--kc-down-fg); }`;
		clone.prepend(style);
		const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)], { type: 'image/svg+xml' }));
		const img = new Image();
		img.src = url;
		await img.decode().catch(() => {});
		const g = screenCanvas.getContext('2d')!;
		g.fillStyle = '#000';
		g.fillRect(0, 0, screenCanvas.width, screenCanvas.height);
		g.drawImage(img, 0, 0, screenCanvas.width, screenCanvas.height);
		URL.revokeObjectURL(url);
		screenTexture.needsUpdate = true;
		invalidate();
		painting = false;
		if (again) {
			again = false;
			paintScreen();
		}
	};
	await paintScreen();
	onChange(paintScreen);

	// Keys go down the switch's travel while held, instantly, like the real thing.
	const capRest = keycaps.map((cap) => cap.position.z);
	onKey((k, isDown) => {
		keycaps[k - 1].position.z = capRest[k - 1] - (isDown ? 3.2 : 0);
		invalidate();
	});

	// Size: the stage sets the aspect; the canvas follows it.
	const resize = () => {
		const { width, height } = stage.getBoundingClientRect();
		if (!width || !height) return;
		renderer.setSize(width, height, false);
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
		invalidate();
	};
	new ResizeObserver(resize).observe(stage);
	resize();

	// Turn: a three-quarter view at rest; drag sideways to turn it.
	const REST = -0.42;
	let yaw = REST;
	turntable.rotation.y = yaw;
	if (opts.still) return { renderer, draw };

	const raycaster = new THREE.Raycaster();
	const pointer = new THREE.Vector2();
	const keyAt = (e: PointerEvent): Key | 0 => {
		const r = renderer.domElement.getBoundingClientRect();
		pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
		raycaster.setFromCamera(pointer, camera);
		const hit = raycaster.intersectObjects(keycaps, true).find((h) => h.object.userData.key);
		return (hit?.object.userData.key as Key) ?? 0;
	};
	let drag: { x: number; yaw: number; id: number; moved: boolean; key: Key | 0 } | null = null;
	const canvas = renderer.domElement;
	canvas.addEventListener('pointerdown', (e) => {
		const k = keyAt(e);
		drag = { x: e.clientX, yaw, id: e.pointerId, moved: false, key: k };
		if (k) press(k);
	});
	canvas.addEventListener('pointermove', (e) => {
		if (!drag || drag.key || e.pointerId !== drag.id) return;
		const dx = e.clientX - drag.x;
		if (!drag.moved && Math.abs(dx) < 6) return;
		if (!drag.moved) canvas.setPointerCapture(e.pointerId);
		drag.moved = true;
		yaw = THREE.MathUtils.clamp(drag.yaw + dx * 0.008, REST - 1.1, REST + 1.5);
		turntable.rotation.y = yaw;
		invalidate();
	});
	const end = () => {
		if (drag?.key) release(drag.key);
		drag = null;
	};
	canvas.addEventListener('pointerup', end);
	canvas.addEventListener('pointercancel', end);
	canvas.addEventListener('pointerleave', () => drag?.key && end());

	// A hint of depth as the pointer crosses the hero (fine pointers only).
	if (!reducedMotion && matchMedia('(hover: hover) and (pointer: fine)').matches) {
		addEventListener(
			'pointermove',
			(e) => {
				if (drag) return;
				const nx = e.clientX / innerWidth - 0.5;
				const ny = e.clientY / innerHeight - 0.5;
				camera.position.set(nx * 26, 128 - ny * 16, 182);
				camera.lookAt(0, 8, 2);
				invalidate();
			},
			{ passive: true },
		);
	}
	return { renderer, draw };
}

/** The page's Montserrat 500, as a data URL @font-face named OPadScreen, for SVG drawn as an image. */
async function embeddedFont(): Promise<string> {
	for (const sheet of Array.from(document.styleSheets)) {
		let rules: CSSRuleList;
		try {
			rules = sheet.cssRules;
		} catch {
			continue;
		}
		for (const rule of Array.from(rules)) {
			if (!(rule instanceof CSSFontFaceRule)) continue;
			const family = rule.style.getPropertyValue('font-family');
			const weight = rule.style.getPropertyValue('font-weight');
			const range = rule.style.getPropertyValue('unicode-range');
			const url = rule.style.getPropertyValue('src').match(/url\("?([^")]+)"?\)/)?.[1];
			if (!/Montserrat/.test(family) || /fallback/.test(family) || !weight.includes('500') || !url) continue;
			if (range && !/U\+0(000)?-/i.test(range)) continue;
			try {
				const blob = await (await fetch(url)).blob();
				const data = await new Promise<string>((resolve) => {
					const reader = new FileReader();
					reader.onload = () => resolve(String(reader.result));
					reader.readAsDataURL(blob);
				});
				return `@font-face { font-family: OPadScreen; src: url(${data}); font-weight: 500; }`;
			} catch {
				return '';
			}
		}
	}
	return '';
}
