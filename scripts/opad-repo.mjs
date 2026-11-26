/**
 * Finds the OPad repository that the docs and the case model are copied from.
 *
 * - OPAD_REPO_DIR set: that local checkout, as it is (to preview docs not yet pushed).
 * - Otherwise: GitHub, branch main, as a sparse clone in .cache/opad that is updated on
 *   every run. Only the files of the folders the site uses are fetched; the history comes
 *   without file contents, which is enough for each page's last-updated date.
 * - If GitHub cannot be reached, returns null and each script keeps the copy committed here.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const REPO_URL = 'https://github.com/OPad-dev/OPad';
/** Branch the site follows: always main. */
export const REF = 'main';
const SPARSE = ['docs', 'hardware/3d/custom_case/V3'];

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const cache = join(root, '.cache', 'opad');
const git = (args, cwd) => execFileSync('git', args, { cwd, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] }).trim();

function fromGitHub() {
	try {
		if (!existsSync(join(cache, '.git'))) {
			mkdirSync(dirname(cache), { recursive: true });
			git(['clone', '--quiet', '--filter=blob:none', '--sparse', '--branch', REF, `${REPO_URL}.git`, cache], root);
		} else {
			const unshallow = existsSync(join(cache, '.git', 'shallow')) ? ['--unshallow'] : [];
			git(['fetch', '--quiet', ...unshallow, 'origin', `+refs/heads/${REF}:refs/remotes/origin/${REF}`], cache);
			git(['checkout', '--quiet', '--force', '-B', REF, `origin/${REF}`], cache);
		}
		git(['sparse-checkout', 'set', ...SPARSE], cache);
		return cache;
	} catch (error) {
		console.warn(`opad-repo: could not fetch ${REPO_URL} (${REF}): ${String(error.stderr || error.message).trim()}`);
		return null;
	}
}

/** Every file and folder path in the repository's HEAD (for checking links to it). */
export function repoPaths(repo) {
	const files = git(['ls-tree', '-r', '--name-only', 'HEAD'], repo).split('\n');
	const dirs = git(['ls-tree', '-r', '-d', '--name-only', 'HEAD'], repo).split('\n');
	return { files: new Set(files), dirs: new Set(dirs) };
}

/** Date of the last commit that touched each file under `dir` (repo-relative paths). */
export function lastCommitDates(repo, dir) {
	const dates = new Map();
	let date;
	for (const line of git(['log', '--format=%x00%cI', '--name-only', 'HEAD', '--', dir], repo).split('\n')) {
		if (line.startsWith('\0')) date = line.slice(1);
		else if (line && !dates.has(line)) dates.set(line, date);
	}
	return dates;
}

let resolved;
/** Path of the OPad repository, or null when it is not available. */
export function opadRepo() {
	if (resolved !== undefined) return resolved;
	resolved = process.env.OPAD_REPO_DIR ? resolve(root, process.env.OPAD_REPO_DIR) : fromGitHub();
	if (resolved && !existsSync(resolved)) {
		console.warn(`opad-repo: ${resolved} not found.`);
		resolved = null;
	}
	return resolved;
}

/** Records which OPad commit the committed copy comes from, in opad-source.json. */
export function recordSource(repo) {
	let commit = null;
	let dirty = false;
	try {
		commit = git(['rev-parse', 'HEAD'], repo);
		dirty = git(['status', '--porcelain', '--', ...SPARSE], repo) !== '';
	} catch {}
	const source = { repo: REPO_URL, ref: process.env.OPAD_REPO_DIR ? 'local checkout' : REF, commit, dirty };
	writeFileSync(join(root, 'opad-source.json'), JSON.stringify(source, null, '\t') + '\n');
}
