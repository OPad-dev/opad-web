#!/usr/bin/env node
/**
 * Copies the OPad user documentation into Starlight's content folder.
 *
 * Source: the `docs/` folder of the OPad repository on GitHub (see opad-repo.mjs).
 * The copy is committed, so the site still builds if GitHub cannot be reached;
 * every sync overwrites it, so it never drifts from the repository.
 *
 * What it does to each page, and nothing else:
 * - relative links to other pages become site routes (/docs/… or /es/docs/…);
 * - root-absolute links (/firmware/…) are read from the repository root, as GitHub does;
 * - links to pages that are not published here, and to files of the repository,
 *   become GitHub links;
 * - ```mermaid fences become <pre class="mermaid"> so the diagrams render;
 * - the `<!-- src: … -->` source citations are dropped (they are for the repository's
 *   editors, and would otherwise ship in the page's HTML);
 * - the frontmatter gets the page's GitHub edit link and the date of its last commit.
 *
 * A link to a page or repository file that does not exist fails the sync.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, posix, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { REF, REPO_URL, lastCommitDates, opadRepo, recordSource, repoPaths } from './opad-repo.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const repo = opadRepo();
const source = repo && join(repo, 'docs');
const out = { en: join(root, 'src/content/docs/docs'), es: join(root, 'src/content/docs/es/docs') };

/** Pages published on the site, relative to docs/ (and to docs/es/). */
const PUBLISHED = [/^index\.md$/, /^(start|build|guides|reference|explanation|develop)\//, /^(troubleshooting|recovery)\.md$/];
const isPublished = (rel) => rel.endsWith('.md') && PUBLISHED.some((re) => re.test(rel));

if (!source || !existsSync(source)) {
	if (existsSync(out.en)) {
		console.warn('sync-docs: OPad repository not available; keeping the committed copy of the docs.');
		process.exit(0);
	}
	console.error('sync-docs: OPad repository not available. Check the connection or set OPAD_REPO_DIR to a local checkout.');
	process.exit(1);
}

function walk(dir) {
	return readdirSync(dir).flatMap((name) => {
		const path = join(dir, name);
		return statSync(path).isDirectory() ? walk(path) : [path];
	});
}

const pages = {};
for (const lang of ['en', 'es']) {
	const from = lang === 'es' ? join(source, 'es') : source;
	pages[lang] = walk(from)
		.map((file) => relative(from, file).split('\\').join('/'))
		.filter((rel) => !(lang === 'en' && rel.startsWith('es/')) && isPublished(rel));
}
const published = { en: new Set(pages.en), es: new Set(pages.es) };

const paths = repoPaths(repo);
const dates = lastCommitDates(repo, 'docs');
const dirty = new Set(
	execFileSync('git', ['status', '--porcelain', '--', 'docs'], { cwd: repo, encoding: 'utf8' })
		.split('\n')
		.filter(Boolean)
		.map((line) => line.slice(3).replace(/^.* -> /, '')),
);
const broken = [];

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
	const docRoot = lang === 'es' ? 'docs/es' : 'docs';
	let repoPath;
	if (local) repoPath = local[1];
	else if (!path) return target;
	else if (path.startsWith('/')) repoPath = posix.normalize(path.slice(1));
	else repoPath = posix.normalize(posix.join(docRoot, posix.dirname(fileRel), path));
	repoPath = repoPath.replace(/\/$/, '');

	for (const [prefix, pageLang] of [['docs/es/', 'es'], ['docs/', 'en']]) {
		if (!repoPath.startsWith(prefix)) continue;
		const rel = repoPath.slice(prefix.length);
		if (pageLang === 'en' && rel.startsWith('es/')) continue;
		if (published[pageLang].has(rel)) return route(rel, pageLang) + anchor;
		if (isPublished(rel)) broken.push(`${docRoot}/${fileRel}: ${target} (no such page)`);
	}
	const isDir = paths.dirs.has(repoPath);
	if (!isDir && !paths.files.has(repoPath)) broken.push(`${docRoot}/${fileRel}: ${target} (not in the repository)`);
	return `${REPO_URL}/${isDir ? 'tree' : 'blob'}/${REF}/${repoPath}${anchor}`;
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
	text = text.replace(/^[ \t]*<!-- src:[\s\S]*?-->[ \t]*\n/gm, '').replace(/[ \t]*<!-- src:[\s\S]*?-->/g, '');
	text = text.replace(/\]\(([^)\s]+)\)/g, (_, target) => `](${rewriteLink(target, fileRel, lang)})`);
	text = text.replace(/\u0000FENCE(\d+)\u0000/g, (_, i) => fences[i]);
	return text.replace(/\u0000DIAGRAM(\d+)\u0000/g, (_, i) => diagrams[i]);
}

/** Adds the edit link and the last-updated date to the page's frontmatter. */
function frontmatter(text, repoFile) {
	const extra = [`editUrl: ${REPO_URL}/edit/${REF}/${repoFile}`];
	const date = !dirty.has(repoFile) && dates.get(repoFile);
	if (date) extra.push(`lastUpdated: ${date}`);
	if (!text.startsWith('---\n')) return `---\n${extra.join('\n')}\n---\n\n${text}`;
	return text.replace(/^---\n/, `---\n${extra.join('\n')}\n`);
}

let count = 0;
for (const lang of ['en', 'es']) {
	const from = lang === 'es' ? join(source, 'es') : source;
	rmSync(out[lang], { recursive: true, force: true });
	for (const rel of pages[lang]) {
		const repoFile = `${lang === 'es' ? 'docs/es' : 'docs'}/${rel}`;
		const dest = join(out[lang], rel.toLowerCase());
		mkdirSync(dirname(dest), { recursive: true });
		writeFileSync(dest, frontmatter(transform(readFileSync(join(from, rel), 'utf8'), rel, lang), repoFile));
		count++;
	}
}
recordSource(repo);
console.log(`sync-docs: ${count} pages from ${source}`);

if (broken.length) {
	console.error(`sync-docs: ${broken.length} broken links in the OPad docs (fix them in the OPad repository):`);
	for (const line of broken) console.error(`  ${line}`);
	process.exit(1);
}
