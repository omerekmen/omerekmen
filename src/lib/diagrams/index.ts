import type { SystemDiagram } from '$lib/types/diagram';

/**
 * Diagrams are keyed by project slug and looked up by the detail page, so a
 * project gains a diagram by adding a file here rather than by editing markdown
 * in every locale it is translated into.
 */
const modules = import.meta.glob<{ diagram: SystemDiagram }>('./*.ts', { eager: true });

const registry = new Map<string, SystemDiagram>();
for (const [path, module] of Object.entries(modules)) {
	const slug = path.replace(/^\.\//, '').replace(/\.ts$/, '');
	if (slug === 'index') continue;
	if (!module.diagram) throw new Error(`Diagram ${slug} has no "diagram" export`);
	registry.set(slug, module.diagram);
}

export function getDiagram(slug: string): SystemDiagram | undefined {
	return registry.get(slug);
}

export const diagramSlugs: string[] = [...registry.keys()].sort();
