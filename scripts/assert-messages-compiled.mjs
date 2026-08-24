/**
 * Fails if paraglide compiled message stubs that return their own id.
 *
 * When the compiler knows a message id but has no value for it, it emits a
 * function returning the id. The page then renders `hero_title` where the
 * headline should be — valid HTML, no error anywhere, and a broken site. This
 * runs as part of the paraglide step, so every build checks it, including
 * builds run by Cloudflare rather than by us.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DIR = 'src/lib/paraglide/messages';

if (!existsSync(DIR)) {
	console.error(`No compiled messages at ${DIR}.`);
	process.exit(1);
}

const files = readdirSync(DIR).filter((f) => f.endsWith('.js') && f !== '_index.js');

if (files.length === 0) {
	console.error('paraglide compiled zero messages. The message files were not read.');
	process.exit(1);
}

const stubs = [];
for (const file of files) {
	const id = file.replace(/\.js$/, '');
	const source = readFileSync(join(DIR, file), 'utf8');
	// A locale variant that returns the bare message id is a stub, not a value.
	const returned = [...source.matchAll(/return\s*\/\*\*[^*]*\*\/\s*\(`([^`]*)`\)/g)].map(
		(m) => m[1]
	);
	if (returned.length > 0 && returned.every((v) => v === id)) {
		stubs.push(id);
	}
}

if (stubs.length > 0) {
	console.error(
		`paraglide emitted ${stubs.length} message(s) that return their own id, meaning it found the ids but not their values:\n`
	);
	for (const id of stubs.slice(0, 10)) console.error(`  ${id}`);
	if (stubs.length > 10) console.error(`  ...and ${stubs.length - 10} more`);
	console.error('\nCheck that messages/*.json were readable during the build.');
	process.exit(1);
}

console.log(`paraglide compiled ${files.length} messages with real values.`);
