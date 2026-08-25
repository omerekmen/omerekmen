import type { SystemDiagram } from '$lib/types/diagram';

/**
 * Two surfaces, one model — which is the decision the case study argues for —
 * and reporting reading the transactional tables, which is the one it argues
 * against.
 */
export const diagram: SystemDiagram = {
	title: 'SaaS commerce — one domain model, two surfaces',
	caption:
		'The public REST endpoints and the admin the client operates describe the same products, orders and customers, so neither can drift into meaning something the other does not. Reporting reads those same transactional tables — right at this size, and the first thing that strains.',
	nodes: [
		{
			id: 'clients',
			label: 'REST clients',
			detail: 'storefront · integrations',
			kind: 'source',
			col: 0,
			row: 0
		},
		{
			id: 'admin',
			label: 'Admin platform',
			detail: 'the client operates this',
			kind: 'serve',
			col: 0,
			row: 2
		},
		{
			id: 'domain',
			label: 'Django domain model',
			detail: 'auth · product · order · customer',
			kind: 'process',
			col: 1,
			row: 1
		},
		{
			id: 'postgres',
			label: 'PostgreSQL',
			detail: 'one schema, four concerns',
			kind: 'store',
			col: 2,
			row: 1
		},
		{
			id: 'reporting',
			label: 'Reporting endpoints',
			detail: 'read the same tables',
			kind: 'serve',
			col: 3,
			row: 1
		}
	],
	edges: [
		{ from: 'clients', to: 'domain' },
		{ from: 'admin', to: 'domain' },
		{ from: 'domain', to: 'postgres' },
		{ from: 'postgres', to: 'reporting', label: 'direct read' }
	],
	locales: {
		tr: {
			title: 'SaaS ticaret — tek alan modeli, iki yüzey',
			caption:
				'Genel REST uçları ve müşterinin işlettiği yönetim paneli aynı ürünleri, siparişleri ve müşterileri tarif ediyor; böylece hiçbiri diğerinin ifade etmediği bir şeye kayamıyor. Raporlama da aynı işlem tablolarından okuyor — bu ölçekte doğru olan ve ilk zorlanacak olan.',
			clients: 'REST istemcileri',
			'clients:detail': 'mağaza · entegrasyonlar',
			admin: 'Yönetim platformu',
			'admin:detail': 'müşteri bunu işletiyor',
			domain: 'Django alan modeli',
			'domain:detail': 'kimlik · ürün · sipariş · müşteri',
			'postgres:detail': 'tek şema, dört sorumluluk',
			reporting: 'Raporlama uçları',
			'reporting:detail': 'aynı tablolardan okuyor',
			'edge:postgres-reporting': 'doğrudan okuma',
			'kind:source': 'Yukarı akış kaynağı',
			'kind:process': 'İşleme',
			'kind:store': 'Depolama',
			'kind:serve': 'Sunum'
		}
	}
};
