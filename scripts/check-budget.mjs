/**
 * Enforces the payload budget from docs/GUIDELINE.md.
 *
 * The site shed roughly 3 MB during the rebuild. Nothing stopped it creeping
 * back except intent, and intent does not survive six months, so the numbers
 * are asserted here.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { gzipSync } from 'node:zlib';

const OUT = '.svelte-kit/cloudflare';

const BUDGET = {
	// Every JS chunk the homepage pulls, gzipped and summed.
	homepageJsGzipKb: 150,
	// No single dependency chunk may dominate the bundle.
	largestChunkGzipKb: 60,
	// Any one image or font.
	assetKb: 200
};

function walk(dir, filter) {
	const out = [];
	for (const entry of readdirSync(dir)) {
		const path = join(dir, entry);
		if (statSync(path).isDirectory()) out.push(...walk(path, filter));
		else if (filter(path)) out.push(path);
	}
	return out;
}

const kb = (bytes) => Math.round((bytes / 1024) * 10) / 10;
const gzipKb = (path) => kb(gzipSync(readFileSync(path), { level: 9 }).length);

const failures = [];
const report = [];

// ── Homepage JS ──
const html = readFileSync(join(OUT, 'index.html'), 'utf8');
// Paths are emitted relative ("./_app/...") in href, src and dynamic imports.
const referenced = [...html.matchAll(/["'(]\.?(\/_app\/immutable\/[^"')]+\.js)/g)].map((m) => m[1]);
if (referenced.length === 0) {
	console.error(
		'Found no JS references in index.html — the budget check is not measuring anything.'
	);
	process.exit(1);
}
const unique = [...new Set(referenced)];
let homepageTotal = 0;
for (const href of unique) {
	try {
		homepageTotal += gzipKb(join(OUT, href));
	} catch {
		/* referenced but absent — the build would have failed already */
	}
}
homepageTotal = Math.round(homepageTotal * 10) / 10;
report.push(['homepage JS (gzip)', `${homepageTotal} KB`, `${BUDGET.homepageJsGzipKb} KB`]);
if (homepageTotal > BUDGET.homepageJsGzipKb) {
	failures.push(`homepage JS is ${homepageTotal} KB gzipped, over ${BUDGET.homepageJsGzipKb} KB`);
}

// ── Largest single chunk ──
const chunks = walk(join(OUT, '_app'), (p) => p.endsWith('.js'));
const largest = chunks.map((p) => ({ p, size: gzipKb(p) })).sort((a, b) => b.size - a.size)[0];
report.push(['largest chunk (gzip)', `${largest.size} KB`, `${BUDGET.largestChunkGzipKb} KB`]);
if (largest.size > BUDGET.largestChunkGzipKb) {
	failures.push(
		`${largest.p.split('/').pop()} is ${largest.size} KB gzipped, over ${BUDGET.largestChunkGzipKb} KB`
	);
}

// ── Static assets ──
const assetExts = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.woff2', '.gif']);
const heavy = walk(OUT, (p) => assetExts.has(extname(p)))
	.map((p) => ({ p, size: kb(statSync(p).size) }))
	.filter((a) => a.size > BUDGET.assetKb);
report.push(['assets over budget', `${heavy.length}`, `0`]);
for (const a of heavy) {
	failures.push(`${a.p.replace(OUT + '/', '')} is ${a.size} KB, over ${BUDGET.assetKb} KB`);
}

const width = Math.max(...report.map(([label]) => label.length));
for (const [label, actual, limit] of report) {
	console.log(`  ${label.padEnd(width)}  ${actual.padStart(9)}   budget ${limit}`);
}

if (failures.length > 0) {
	console.error('\nPayload budget exceeded:\n');
	for (const f of failures) console.error(`  ${f}`);
	console.error('\nSee docs/GUIDELINE.md "Performance budget".');
	process.exit(1);
}
console.log('\nWithin budget.');
