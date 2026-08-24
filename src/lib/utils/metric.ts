export interface ParsedMetric {
	prefix: string;
	value: number;
	suffix: string;
	decimals: number;
	/** True when the value has no leading number to count toward. */
	literal: boolean;
}

/**
 * Splits a metric like "100+", "-60%" or "1.2M" into the parts a count-up
 * animation needs, keeping any prefix and suffix intact.
 */
export function parseMetric(raw: string): ParsedMetric {
	const match = /^([^\d-]*)(-?\d+(?:\.\d+)?)(.*)$/.exec(raw.trim());
	if (!match) {
		return { prefix: raw, value: 0, suffix: '', decimals: 0, literal: true };
	}
	const [, prefix, digits, suffix] = match;
	const decimals = digits.includes('.') ? digits.split('.')[1].length : 0;
	return { prefix, value: Number(digits), suffix, decimals, literal: false };
}

export function formatMetric(parsed: ParsedMetric, current: number): string {
	if (parsed.literal) return parsed.prefix;
	return `${parsed.prefix}${current.toFixed(parsed.decimals)}${parsed.suffix}`;
}
