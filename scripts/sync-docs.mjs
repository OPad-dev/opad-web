#!/usr/bin/env node
/**
 * Copies the OPad user documentation into Starlight's content folder.
 *
 * Source: the `docs/` folder of the OPad repository (branch docs/overhaul).
 * Set OPAD_DOCS_DIR to point elsewhere; by default it is the local worktree
 * next to this repository. Later this can become a git checkout from GitHub.
 *
 * What it does to each page, and nothing else:
 * - relative links to other pages become site routes (/docs/… or /es/docs/…);
 * - links to pages that are not published here, and to files of the repository,
 *   become GitHub links;
 * - ```mermaid fences become <pre class="mermaid"> so the diagrams render.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, posix, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(process.env.OPAD_DOCS_DIR ?? join(root, '..', 'OPad-docs', 'docs'));
const repoBlob = 'https://github.com/OPad-dev/OPad/blob/main/';
const out = { en: join(root, 'src/content/docs/docs'), es: join(root, 'src/content/docs/es/docs') };

/** Pages published on the site, relative to docs/ (and to docs/es/). */
const PUBLISHED = [/^index\.md$/, /^(start|guides|reference|explanation|develop)\//, /^(troubleshooting|recovery|testing-checklist)\.md$/];
const isPublished = (rel) => rel.endsWith('.md') && PUBLISHED.some((re) => re.test(rel));

if (!existsSync(source)) {
	if (existsSync(out.en)) {
		console.warn(`sync-docs: ${source} not found; keeping the docs already synced.`);
		process.exit(0);
	}
	console.error(`sync-docs: ${source} not found. Set OPAD_DOCS_DIR to the OPad repository's docs/ folder.`);
	process.exit(1);
}

function walk(dir) {
	return readdirSync(dir).flatMap((name) => {
		const path = join(dir, name);
		return statSync(path).isDirectory() ? walk(path) : [path];
	});
}

/** Site route for a published page given its path relative to docs/ (or docs/es/). */
function route(rel, lang) {
	const base = lang === 'es' ? '/es/docs/' : '/docs/';
	const slug = rel.replace(/\.md$/, '').replace(/(^|\/)index$/, '');
	return base + (slug ? `${slug.toLowerCase()}/` : '');
}

function rewriteLink(target, fileRel, lang) {
	if (/^(https?:|mailto:|#)/.test(target)) return target;
	const [path, hash = ''] = target.split('#');
	const anchor = hash ? `#${hash}` : '';
	// A few links point at the author's local checkout: send them to GitHub.
	const local = path.match(/^file:\/\/.*?\/osu-pad-esp32\/(.*)$/);
	if (local) return repoBlob + local[1] + anchor;
	if (!path) return target;
	const docRoot = lang === 'es' ? 'docs/es' : 'docs';
	const repoPath = posix.normalize(posix.join(docRoot, posix.dirname(fileRel), path));
	if (repoPath.startsWith('docs/es/') && isPublished(repoPath.slice(8))) return route(repoPath.slice(8), 'es') + anchor;
	if (repoPath.startsWith('docs/') && !repoPath.startsWith('docs/es/') && isPublished(repoPath.slice(5))) {
		return route(repoPath.slice(5), 'en') + anchor;
	}
	const kind = path.endsWith('/') ? 'tree' : 'blob';
	return repoBlob.replace('/blob/', `/${kind}/`) + repoPath.replace(/\/$/, '') + anchor;
}

const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function transform(text, fileRel, lang) {
	// Mermaid fences first, so their contents are not touched by link rewriting.
	const diagrams = [];
	text = text.replace(/^```mermaid\n([\s\S]*?)^```$/gm, (_, body) => {
		diagrams.push(`<pre class="mermaid">\n${escapeHtml(body)}</pre>`);
		return `\u0000DIAGRAM${diagrams.length - 1}\u0000`;
	});
	// Leave other code fences alone.
	const fences = [];
	text = text.replace(/^(```|~~~)[^\n]*\n[\s\S]*?^\1$/gm, (block) => {
		fences.push(block);
		return `\u0000FENCE${fences.length - 1}\u0000`;
	});
	text = text.replace(/\]\(([^)\s]+)\)/g, (_, target) => `](${rewriteLink(target, fileRel, lang)})`);
	text = text.replace(/\u0000FENCE(\d+)\u0000/g, (_, i) => fences[i]);
	return text.replace(/\u0000DIAGRAM(\d+)\u0000/g, (_, i) => diagrams[i]);
}

let count = 0;
for (const lang of ['en', 'es']) {
	const from = lang === 'es' ? join(source, 'es') : source;
	rmSync(out[lang], { recursive: true, force: true });
	for (const file of walk(from)) {
		const rel = relative(from, file).split('\\').join('/');
		if (lang === 'en' && rel.startsWith('es/')) continue;
		if (!isPublished(rel)) continue;
		const dest = join(out[lang], rel.toLowerCase());
		mkdirSync(dirname(dest), { recursive: true });
		writeFileSync(dest, transform(readFileSync(file, 'utf8'), rel, lang));
		count++;
	}
}
console.log(`sync-docs: ${count} pages from ${source}`);
