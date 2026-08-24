/**
 * Asserts the palette's text/surface pairs meet WCAG AA.
 *
 * An axe run needs a browser and a built site; this reads the tokens directly,
 * so the failure that shipped here — a token sitting at 3.7:1 on one of three
 * surfaces — is caught in a second, deterministically.
 */
import { readFileSync } from 'node:fs';

const css = readFileSync('src/routes/layout.css', 'utf8');

/** Pulls a theme's token block. Light is the bare :root, dark is [data-theme]. */
function tokens(themeSelector) {
	const start = css.indexOf(themeSelector);
	if (start === -1) throw new Error(`theme block not found: ${themeSelector}`);
	const block = css.slice(start, css.indexOf('}', start));
	const found = {};
	for (const [, name, value] of block.matchAll(/--(color-[a-z-]+):\s*(#[0-9a-fA-F]{6})/g)) {
		found[name] = value;
	}
	return found;
}

const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const luminance = (c) => {
	const [r, g, b] = c
		.map((v) => v / 255)
		.map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
	const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
	return (hi + 0.05) / (lo + 0.05);
};
/** Composites a colour at alpha over a surface, as a tinted pill does. */
const over = (fg, alpha, bg) => fg.map((f, i) => Math.round(f * alpha + bg[i] * (1 - alpha)));

const SURFACES = ['color-bg', 'color-bg-secondary', 'color-bg-tertiary'];

/** Text tokens that must clear AA on every surface. */
const TEXT_ON_SURFACE = [
	'color-text',
	'color-text-secondary',
	'color-text-muted',
	'color-accent-text'
];

/** Badge text sitting on a 12% tint of its own semantic hue. */
const TINTED = [
	['color-completed-text', 'color-completed'],
	['color-ongoing-text', 'color-ongoing']
];

const AA = 4.5;
const failures = [];

for (const [themeName, selector] of [
	['light', ":root,\n[data-theme='light']"],
	['dark', "[data-theme='dark']"]
]) {
	const t = tokens(selector);

	for (const text of TEXT_ON_SURFACE) {
		for (const surface of SURFACES) {
			if (!t[text] || !t[surface]) continue;
			const r = contrast(rgb(t[text]), rgb(t[surface]));
			if (r < AA) {
				failures.push(
					`${themeName}: --${text} (${t[text]}) on --${surface} (${t[surface]}) = ${r.toFixed(2)}:1`
				);
			}
		}
	}

	for (const [text, tint] of TINTED) {
		for (const surface of SURFACES) {
			if (!t[text] || !t[tint] || !t[surface]) continue;
			const pill = over(rgb(t[tint]), 0.12, rgb(t[surface]));
			const r = contrast(rgb(t[text]), pill);
			if (r < AA) {
				failures.push(
					`${themeName}: --${text} (${t[text]}) on a 12% --${tint} pill over --${surface} = ${r.toFixed(2)}:1`
				);
			}
		}
	}
}

if (failures.length > 0) {
	console.error(`Palette pairs below WCAG AA (${AA}:1):\n`);
	for (const f of failures) console.error(`  ${f}`);
	console.error('\nSee docs/GUIDELINE.md "Colour".');
	process.exit(1);
}

console.log('All palette text/surface pairs meet WCAG AA.');
