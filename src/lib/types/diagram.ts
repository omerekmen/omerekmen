/**
 * A system diagram, declared as data rather than drawn as SVG by hand.
 *
 * Authors place nodes on a grid and name the edges; the renderer owns geometry,
 * theming and the accessible description. Hand-written SVG would have to be
 * duplicated per locale and re-themed by hand, and neither survives contact
 * with a palette change.
 */

/**
 * What a box is, which decides how it is drawn.
 *
 * - `source` — something upstream this system reads but does not own
 * - `process` — where work happens
 * - `store` — where state lives
 * - `serve` — what a person or another system finally reads
 * - `legacy` — being retired, drawn in the ongoing colour
 * - `target` — what replaces it, drawn in the completed colour
 */
export type NodeKind = 'source' | 'process' | 'store' | 'serve' | 'legacy' | 'target';

export interface DiagramNode {
	id: string;
	label: string;
	/** One short line under the label — the technology, or the shape of the data. */
	detail?: string;
	kind?: NodeKind;
	/** Zero-indexed grid position. */
	col: number;
	row: number;
	/** Grid cells spanned, defaulting to one. */
	colSpan?: number;
	rowSpan?: number;
}

export interface DiagramEdge {
	from: string;
	to: string;
	/** What crosses this boundary, not what the arrow "means". */
	label?: string;
	/** Dashed marks a path that is temporary, asynchronous or being retired. */
	dashed?: boolean;
}

/** A labelled boundary drawn around a set of nodes. */
export interface DiagramGroup {
	label: string;
	nodes: string[];
	kind?: NodeKind;
}

export interface SystemDiagram {
	/** Names the diagram for screen readers and the caption line. */
	title: string;
	/** One sentence stating what the picture is claiming. */
	caption: string;
	nodes: DiagramNode[];
	edges: DiagramEdge[];
	groups?: DiagramGroup[];
	/**
	 * Per-locale overrides, keyed by locale then by node id, `title`, `caption`,
	 * a group label (`group:<label>`) or an edge (`edge:<from>-<to>`).
	 *
	 * Only the generic words need translating — product names stay as they are
	 * in Turkish technical writing too, so this stays small instead of becoming
	 * forty message keys nobody maintains.
	 */
	locales?: Record<string, Record<string, string>>;
}
