<script lang="ts">
	import type { SystemDiagram, DiagramNode, NodeKind } from '$lib/types/diagram';

	interface Props {
		diagram: SystemDiagram;
		locale?: string;
	}

	let { diagram, locale = 'en' }: Props = $props();

	// ── Geometry ──
	// Authors give a grid position; everything below is derived, so a diagram
	// never carries hand-tuned coordinates that a later edit has to preserve.
	const CELL_W = 152;
	const CELL_H = 86;
	const GAP_X = 80;
	const GAP_Y = 54;
	const GROUP_PAD = 16;
	const PAD = 14;

	/** Translated text for a key, falling back to the English original. */
	const t = $derived((key: string, fallback: string) => {
		const table = diagram.locales?.[locale];
		return table?.[key] ?? fallback;
	});

	interface Box extends DiagramNode {
		x: number;
		y: number;
		w: number;
		h: number;
		lines: string[];
	}

	/** Breaks a label onto at most three lines without splitting words. */
	function wrap(text: string, max = 18): string[] {
		const words = text.split(' ');
		const lines: string[] = [];
		let line = '';
		for (const word of words) {
			const candidate = line ? `${line} ${word}` : word;
			if (candidate.length > max && line) {
				lines.push(line);
				line = word;
			} else {
				line = candidate;
			}
		}
		if (line) lines.push(line);
		return lines.slice(0, 3);
	}

	const boxes = $derived<Box[]>(
		diagram.nodes.map((node) => {
			const colSpan = node.colSpan ?? 1;
			const rowSpan = node.rowSpan ?? 1;
			return {
				...node,
				x: node.col * (CELL_W + GAP_X),
				y: node.row * (CELL_H + GAP_Y),
				w: colSpan * CELL_W + (colSpan - 1) * GAP_X,
				h: rowSpan * CELL_H + (rowSpan - 1) * GAP_Y,
				lines: wrap(t(node.id, node.label))
			};
		})
	);

	const byId = $derived(new Map(boxes.map((b) => [b.id, b])));

	interface GroupBox {
		label: string;
		kind?: NodeKind;
		x: number;
		y: number;
		w: number;
		h: number;
	}

	const groupBoxes = $derived<GroupBox[]>(
		(diagram.groups ?? []).map((group) => {
			const members = group.nodes.map((id) => byId.get(id)).filter((b): b is Box => Boolean(b));
			const x = Math.min(...members.map((m) => m.x)) - GROUP_PAD;
			const y = Math.min(...members.map((m) => m.y)) - GROUP_PAD - 14;
			const right = Math.max(...members.map((m) => m.x + m.w)) + GROUP_PAD;
			const bottom = Math.max(...members.map((m) => m.y + m.h)) + GROUP_PAD;
			return {
				label: t(`group:${group.label}`, group.label),
				kind: group.kind,
				x,
				y,
				w: right - x,
				h: bottom - y
			};
		})
	);

	interface Wire {
		d: string;
		dashed: boolean;
		label?: string;
		labelLines: string[];
		lx: number;
		ly: number;
		/** Which segment the label sits on, so it can be nudged off it. */
		onVertical: boolean;
	}

	/**
	 * Orthogonal routing between two boxes. Whichever axis separates them is the
	 * one the line travels along first, so an arrow always leaves and enters a
	 * box through a face rather than clipping a corner.
	 */
	function route(a: Box, b: Box): { d: string; lx: number; ly: number; onVertical: boolean } {
		const aMidY = a.y + a.h / 2;
		const bMidY = b.y + b.h / 2;
		const aMidX = a.x + a.w / 2;
		const bMidX = b.x + b.w / 2;

		const separatedHorizontally = b.x >= a.x + a.w || a.x >= b.x + b.w;

		if (separatedHorizontally) {
			const leftToRight = b.x >= a.x + a.w;
			const sx = leftToRight ? a.x + a.w : a.x;
			const ex = leftToRight ? b.x : b.x + b.w;
			const mx = (sx + ex) / 2;
			const d =
				aMidY === bMidY
					? `M ${sx} ${aMidY} L ${ex} ${bMidY}`
					: `M ${sx} ${aMidY} L ${mx} ${aMidY} L ${mx} ${bMidY} L ${ex} ${bMidY}`;
			// A dog-leg puts the midpoint on the vertical connector; a straight
			// run puts it on the horizontal line itself.
			return { d, lx: mx, ly: (aMidY + bMidY) / 2, onVertical: aMidY !== bMidY };
		}

		const topToBottom = b.y >= a.y + a.h;
		const sy = topToBottom ? a.y + a.h : a.y;
		const ey = topToBottom ? b.y : b.y + b.h;
		const my = (sy + ey) / 2;
		const d =
			aMidX === bMidX
				? `M ${aMidX} ${sy} L ${bMidX} ${ey}`
				: `M ${aMidX} ${sy} L ${aMidX} ${my} L ${bMidX} ${my} L ${bMidX} ${ey}`;
		return { d, lx: (aMidX + bMidX) / 2, ly: my, onVertical: aMidX === bMidX };
	}

	const wires = $derived<Wire[]>(
		diagram.edges.flatMap((edge) => {
			const a = byId.get(edge.from);
			const b = byId.get(edge.to);
			if (!a || !b) return [];
			const { d, lx, ly, onVertical } = route(a, b);
			return [
				{
					d,
					dashed: edge.dashed ?? false,
					label: edge.label ? t(`edge:${edge.from}-${edge.to}`, edge.label) : undefined,
					// A long label on a short segment runs into the boxes at both ends,
					// so wire labels wrap rather than trusting the gap to be wide enough.
					labelLines: edge.label ? wrap(t(`edge:${edge.from}-${edge.to}`, edge.label), 16) : [],
					lx,
					ly,
					onVertical
				}
			];
		})
	);

	const bounds = $derived.by(() => {
		const items = [...boxes, ...groupBoxes];
		const minX = Math.min(...items.map((i) => i.x));
		const minY = Math.min(...items.map((i) => i.y));
		const maxX = Math.max(...items.map((i) => i.x + i.w));
		const maxY = Math.max(...items.map((i) => i.y + i.h));
		return {
			x: minX - PAD,
			y: minY - PAD,
			w: maxX - minX + PAD * 2,
			h: maxY - minY + PAD * 2
		};
	});

	/**
	 * The picture in words. A diagram that only exists visually is a diagram
	 * half the readers cannot use.
	 */
	const description = $derived.by(() => {
		const steps = diagram.edges
			.map((edge) => {
				const from = byId.get(edge.from);
				const to = byId.get(edge.to);
				if (!from || !to) return null;
				const via = edge.label ? ` via ${t(`edge:${edge.from}-${edge.to}`, edge.label)}` : '';
				return `${t(from.id, from.label)} to ${t(to.id, to.label)}${via}`;
			})
			.filter(Boolean);
		return `${t('caption', diagram.caption)} Flow: ${steps.join('; ')}.`;
	});

	const KIND_LABELS: Record<NodeKind, string> = {
		source: 'Upstream source',
		process: 'Processing',
		store: 'Storage',
		serve: 'Serving',
		legacy: 'Being retired',
		target: 'Replacement'
	};

	/** Only the kinds this diagram actually uses reach the legend. */
	const legend = $derived(
		[...new Set(diagram.nodes.map((n) => n.kind ?? 'process'))].map((kind) => ({
			kind,
			label: t(`kind:${kind}`, KIND_LABELS[kind])
		}))
	);

	/** Baseline of a box's first line, with the whole text block centred. */
	function textTop(box: Box): number {
		const height = box.lines.length * 16 + (box.detail ? 16 : 0);
		return box.y + box.h / 2 - height / 2 + 12;
	}

	/** Scoped so two diagrams on one page cannot share a marker or a label id. */
	const uid = $props.id();
</script>

<figure class="diagram">
	<div class="scroll">
		<svg
			viewBox="{bounds.x} {bounds.y} {bounds.w} {bounds.h}"
			width={bounds.w}
			height={bounds.h}
			role="img"
			aria-labelledby="{uid}-title {uid}-desc"
		>
			<title id="{uid}-title">{t('title', diagram.title)}</title>
			<desc id="{uid}-desc">{description}</desc>

			<defs>
				<marker
					id="{uid}-arrow"
					viewBox="0 0 10 10"
					refX="9"
					refY="5"
					markerWidth="7"
					markerHeight="7"
					orient="auto-start-reverse"
				>
					<path d="M 0 0 L 10 5 L 0 10 z" class="arrow" />
				</marker>
			</defs>

			{#each groupBoxes as group (group.label)}
				<g class="group group-{group.kind ?? 'process'}">
					<rect x={group.x} y={group.y} width={group.w} height={group.h} rx="12" />
					<text x={group.x + 12} y={group.y + 16} class="group-label">{group.label}</text>
				</g>
			{/each}

			{#each wires as wire, i (i)}
				<g class="wire" class:dashed={wire.dashed}>
					<path d={wire.d} marker-end="url(#{uid}-arrow)" />
				</g>
			{/each}

			{#each boxes as box (box.id)}
				<g class="node node-{box.kind ?? 'process'}">
					<rect x={box.x} y={box.y} width={box.w} height={box.h} rx="10" />
					{#each box.lines as line, li (li)}
						<text x={box.x + box.w / 2} y={textTop(box) + li * 16} class="node-label">{line}</text>
					{/each}
					{#if box.detail}
						<text
							x={box.x + box.w / 2}
							y={textTop(box) + box.lines.length * 16 + 3}
							class="node-detail"
						>
							{t(`${box.id}:detail`, box.detail)}
						</text>
					{/if}
				</g>
			{/each}

			{#each wires as wire, i (i)}
				{#each wire.labelLines as line, li (li)}
					<text
						x={wire.onVertical ? wire.lx - 9 : wire.lx}
						y={(wire.onVertical ? wire.ly + 4 : wire.ly - 7) -
							(wire.labelLines.length - 1 - li) * 12}
						class="wire-label"
						class:beside={wire.onVertical}>{line}</text
					>
				{/each}
			{/each}
		</svg>
	</div>

	<figcaption>
		<span class="caption-text">{t('caption', diagram.caption)}</span>
		<span class="legend">
			{#each legend as item (item.kind)}
				<span class="legend-item legend-{item.kind}">
					<span class="swatch" aria-hidden="true"></span>{item.label}
				</span>
			{/each}
		</span>
	</figcaption>
</figure>

<style>
	.diagram {
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.scroll {
		overflow-x: auto;
		border: 1px solid var(--color-border-subtle);
		border-radius: 14px;
		background: var(--color-bg-secondary);
		padding: 1.5rem 1.25rem;
	}

	svg {
		display: block;
		margin-inline: auto;
		font-family: var(--font-sans);
	}

	/* ── Boxes ── */
	.node rect {
		fill: var(--color-bg);
		stroke: var(--color-border);
		stroke-width: 1.5;
	}

	.node-source rect {
		stroke-dasharray: 5 4;
		stroke: var(--color-border);
	}

	.node-store rect {
		stroke: var(--color-accent);
	}

	.node-serve rect {
		stroke: var(--color-accent);
		stroke-width: 2;
	}

	.node-legacy rect {
		stroke: var(--color-ongoing);
		stroke-dasharray: 5 4;
	}

	.node-target rect {
		stroke: var(--color-completed);
		stroke-width: 2;
	}

	.node-label {
		fill: var(--color-text);
		font-size: var(--text-md);
		font-weight: 600;
		text-anchor: middle;
	}

	.node-detail {
		fill: var(--color-text-muted);
		font-family: var(--font-mono);
		font-size: var(--text-2xs);
		text-anchor: middle;
	}

	/* ── Wires ── */
	.wire path {
		fill: none;
		stroke: var(--color-text-muted);
		stroke-width: 1.5;
	}

	.wire.dashed path {
		stroke-dasharray: 5 4;
	}

	.arrow {
		fill: var(--color-text-muted);
	}

	.wire-label {
		fill: var(--color-text-muted);
		font-family: var(--font-mono);
		font-size: var(--text-2xs);
		text-anchor: middle;
		paint-order: stroke;
		stroke: var(--color-bg-secondary);
		stroke-width: 6px;
		stroke-linejoin: round;
	}

	.wire-label.beside {
		text-anchor: end;
	}

	/* ── Groups ── */
	.group rect {
		fill: none;
		stroke: var(--color-border);
		stroke-width: 1;
		stroke-dasharray: 3 5;
	}

	.group-legacy rect {
		stroke: var(--color-ongoing);
	}

	.group-target rect {
		stroke: var(--color-completed);
	}

	.group-label {
		fill: var(--color-text-muted);
		font-family: var(--font-mono);
		font-size: var(--text-2xs);
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	/* ── Caption ── */
	figcaption {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.caption-text {
		color: var(--color-text-muted);
		font-size: var(--text-base);
		line-height: 1.6;
	}

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem 1.1rem;
	}

	.legend-item {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		color: var(--color-text-muted);
		font-family: var(--font-mono);
		font-size: var(--text-xs);
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.swatch {
		width: 14px;
		height: 10px;
		border-radius: 3px;
		border: 1.5px solid var(--color-border);
		background: var(--color-bg);
	}

	.legend-source .swatch {
		border-style: dashed;
	}

	.legend-store .swatch,
	.legend-serve .swatch {
		border-color: var(--color-accent);
	}

	.legend-legacy .swatch {
		border-color: var(--color-ongoing);
		border-style: dashed;
	}

	.legend-target .swatch {
		border-color: var(--color-completed);
	}
</style>
