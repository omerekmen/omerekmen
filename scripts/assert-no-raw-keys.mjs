/**
 * Fails if a translation key reaches the rendered HTML as visible text.
 *
 * A lookup that misses renders its own key, which looks like working text to
 * every automated check and like a broken site to a visitor. This asserts on
 * the built output, which is the only place the failure is observable.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const OUT_DIR = '.svelte-kit/cloudflare';
const keys = Object.keys(JSON.parse(readFileSync('messages/en.json', 'utf8'))).filter(
	(k) => k !== '$schema'
);

function htmlFiles(dir) {
	const found = [];
	for (const entry of readdirSync(dir)) {
		if (entry === '_app') continue;
		const path = join(dir, entry);
		if (statSync(path).isDirectory()) found.push(...htmlFiles(path));
		else if (entry.endsWith('.html')) found.push(path);
	}
	return found;
}

// Matches a key sitting alone as an element's text content.
const patterns = keys.map((key) => ({
	key,
	re: new RegExp(`>\\s*${key}\\s*<`)
}));

const failures = [];
for (const file of htmlFiles(OUT_DIR)) {
	const html = readFileSync(file, 'utf8');
	for (const { key, re } of patterns) {
		if (re.test(html)) failures.push({ file, key });
	}
}

if (failures.length > 0) {
	console.error('Untranslated keys rendered into the built HTML:\n');
	for (const { file, key } of failures.slice(0, 20)) {
		console.error(`  ${key}  in  ${file}`);
	}
	if (failures.length > 20) console.error(`  ...and ${failures.length - 20} more`);
	console.error('\nA lookup is missing its message. Check for dynamic m[key] access.');
	process.exit(1);
}

console.log(`No raw keys in the rendered output (${keys.length} keys checked).`);
