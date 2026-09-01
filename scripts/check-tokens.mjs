/**
 * Keeps the design system from being re-invented one component at a time.
 *
 * Colour was tokenised from the start and held. Nothing else was: an audit
 * found 45 distinct font sizes across the site, with eight of them inside a
 * quarter-rem. Scales now exist in layout.css, but migrating every call site at
 * once is a lot of visual churn to land in one commit.
 *
 * So this is a ratchet rather than a clean bill of health. It counts what is
 * still off-scale and fails if that number goes up. New code inherits the
 * system; the backlog can be paid down commit by commit, and the number in the
 * output says how much is left.
 *
 * /lab is exempt. Directions B and C carry deliberately different palettes and
 * type systems — they exist to be different, and holding them to the site's
 * scale would defeat the point.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const SRC = 'src';
const TOKENS_FILE = 'src/routes/layout.css';

/**
 * Ceilings, not targets. Lower them as call sites migrate; never raise them.
 *
 * The one permitted hex is the accent fallback in NetworkBackground, for the
 * frame before the stylesheet resolves. Defensive rather than lazy — a canvas
 * with no colour is a visible failure, and the token is read on every theme
 * change after that.
 */
const BUDGET = {
	offScaleFontSizes: 0,
	rawHexOutsideTokens: 1
};

/** Values a component may use directly without naming a token. */
const ALLOWED_LITERAL_SIZES = new Set(['inherit', '1em', '0.9em', '0.875em', '0.85em']);

function walk(dir) {
	const out = [];
	for (const entry of readdirSync(dir)) {
		const path = join(dir, entry);
		if (statSync(path).isDirectory()) out.push(...walk(path));
		else out.push(path);
	}
	return out;
}

const files = walk(SRC).filter(
	(p) =>
		(p.endsWith('.svelte') || p.endsWith('.css')) &&
		!p.includes(`${join('src', 'routes', 'lab')}`) &&
		!p.includes(join('src', 'lib', 'paraglide'))
);

const offScale = [];
const rawHex = [];

for (const file of files) {
	const text = readFileSync(file, 'utf8');

	for (const [, value] of text.matchAll(/font-size:\s*([^;]+);/g)) {
		const v = value.trim();
		if (v.startsWith('var(--text-') || v.startsWith('var(--display-')) continue;
		if (ALLOWED_LITERAL_SIZES.has(v)) continue;
		// Fluid display type is doing something a fixed step cannot — scaling with
		// the viewport. The oversized hero and marquee faces are bespoke per page
		// by design, so clamp() is allowed and fixed values are not.
		if (v.startsWith('clamp(')) continue;
		// Pure viewport units are the same case: type sized to the screen rather
		// than to a step.
		if (/^\d*\.?\d+vw$/.test(v)) continue;
		offScale.push({ file, value: v });
	}

	// The token file is where literal colours belong; everywhere else should
	// name one, or the palette can no longer be changed in one place.
	if (file === TOKENS_FILE) continue;

	/*
	 * Two exemptions, both real rather than convenient:
	 *
	 * - `@media print` needs fixed colours. Printed output must not follow the
	 *   screen theme, so the CV's print block states its own greys.
	 * - `<meta name="theme-color">` cannot reference a custom property at all.
	 *   Those two literals do duplicate --color-bg and can drift; there is no
	 *   markup that avoids it.
	 */
	const printBlocks = [...text.matchAll(/@media print\s*\{[\s\S]*?\n\t\}/g)].map((m) => m[0]);
	let scannable = text;
	for (const block of printBlocks) scannable = scannable.replace(block, '');
	scannable = scannable.replace(/<meta[^>]*name="theme-color"[^>]*>/g, '');

	for (const [hex] of scannable.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) {
		rawHex.push({ file, value: hex });
	}
}

const report = [
	['off-scale font sizes', offScale.length, BUDGET.offScaleFontSizes],
	['raw hex outside tokens', rawHex.length, BUDGET.rawHexOutsideTokens]
];

const width = Math.max(...report.map(([label]) => label.length));
for (const [label, actual, budget] of report) {
	const mark = actual > budget ? '!' : ' ';
	console.log(`${mark} ${label.padEnd(width)}  ${String(actual).padStart(4)}   ceiling ${budget}`);
}

const failures = [];
if (offScale.length > BUDGET.offScaleFontSizes) {
	failures.push(
		`off-scale font sizes rose to ${offScale.length} (ceiling ${BUDGET.offScaleFontSizes}).\n` +
			`  Use a --text-* or --display-* token from layout.css. New ones:\n` +
			offScale
				.slice(BUDGET.offScaleFontSizes)
				.map((o) => `    ${o.file}: ${o.value}`)
				.join('\n')
	);
}
if (rawHex.length > BUDGET.rawHexOutsideTokens) {
	failures.push(
		`raw hex colours rose to ${rawHex.length} (ceiling ${BUDGET.rawHexOutsideTokens}).\n` +
			`  Name a --color-* token in ${TOKENS_FILE} instead.`
	);
}

if (failures.length > 0) {
	console.error('\nDesign system regressed:\n');
	for (const f of failures) console.error(`  ${f}`);
	console.error('\nSee docs/GUIDELINE.md "Design system".');
	process.exit(1);
}

const remaining = offScale.length + rawHex.length;
console.log(
	remaining === 0
		? '\nEverything is on the scale.'
		: `\nWithin ceilings. ${remaining} call sites still to migrate — lower the ceilings as they go.`
);
