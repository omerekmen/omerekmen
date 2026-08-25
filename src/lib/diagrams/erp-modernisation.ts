import type { SystemDiagram } from '$lib/types/diagram';

/**
 * The point of the picture is that both halves are live at once. A migration
 * diagram that shows only the target state hides the thing that made the work
 * hard.
 */
export const diagram: SystemDiagram = {
	title: 'ERP modernisation — migrating while serving',
	caption:
		'Framework support stayed alive in parallel with the new services, so no operational day depended on the migration being finished. Underneath both, one SQL Server carries the logic that belongs next to the data — and the reporting layer reads it directly, which is the part the retrospective argues against.',
	nodes: [
		{
			id: 'screens',
			label: 'Accounting & purchasing screens',
			detail: 'used all day',
			kind: 'serve',
			col: 0,
			row: 1
		},
		{
			id: 'monolith',
			label: '.NET Framework monolith',
			detail: 'still serving',
			kind: 'legacy',
			col: 1,
			row: 0
		},
		{
			id: 'services',
			label: '.NET 8/9 services',
			detail: 'ASP.NET Core · CQRS',
			kind: 'target',
			col: 1,
			row: 2
		},
		{
			id: 'broker',
			label: 'RabbitMQ · Redis',
			detail: 'messaging · read cache',
			kind: 'target',
			col: 2,
			row: 2
		},
		{
			id: 'sql',
			label: 'SQL Server',
			detail: '50+ stored procedures',
			kind: 'store',
			col: 2,
			row: 1
		},
		{
			id: 'ssrs',
			label: 'SSRS reports',
			detail: '15+, routed per unit',
			kind: 'serve',
			col: 3,
			row: 1
		},
		{
			id: 'sources',
			label: 'Source systems',
			detail: 'APIs · Setur systems',
			kind: 'source',
			col: 0,
			row: 3
		},
		{
			id: 'ssis',
			label: 'SSIS packages',
			detail: '6 scheduled ELT jobs',
			kind: 'process',
			col: 1,
			row: 3
		}
	],
	edges: [
		{ from: 'screens', to: 'monolith', label: 'legacy path' },
		{ from: 'screens', to: 'services', label: 'migrated path', dashed: true },
		{ from: 'monolith', to: 'sql' },
		{ from: 'services', to: 'sql' },
		{ from: 'services', to: 'broker' },
		{ from: 'sources', to: 'ssis' },
		{ from: 'ssis', to: 'sql' },
		{ from: 'sql', to: 'ssrs', label: 'direct query' }
	],
	groups: [
		{ label: 'Being retired', nodes: ['monolith'], kind: 'legacy' },
		{ label: 'Replacing it', nodes: ['services', 'broker'], kind: 'target' }
	],
	locales: {
		tr: {
			title: 'ERP modernizasyonu — hizmet verirken taşımak',
			caption:
				'Framework tarafındaki destek yeni servislerle paralelde canlı kaldı; böylece hiçbir operasyonel gün göçün bitmiş olmasına bağlı olmadı. İkisinin de altında, verinin yanında durması gereken mantığı taşıyan tek bir SQL Server var — ve raporlama katmanı onu doğrudan okuyor, ki retrospektifin karşı çıktığı kısım bu.',
			screens: 'Muhasebe ve satın alma ekranları',
			'screens:detail': 'gün boyu kullanılıyor',
			'monolith:detail': 'hâlâ hizmet veriyor',
			services: '.NET 8/9 servisleri',
			'broker:detail': 'mesajlaşma · okuma önbelleği',
			'sql:detail': '50+ saklı yordam',
			ssrs: 'SSRS raporları',
			'ssrs:detail': '15+, birime göre yönlendirilmiş',
			sources: 'Kaynak sistemler',
			'sources:detail': "API'ler · Setur sistemleri",
			ssis: 'SSIS paketleri',
			'ssis:detail': '6 zamanlanmış ELT işi',
			'edge:screens-monolith': 'eski yol',
			'edge:screens-services': 'taşınan yol',
			'edge:sql-ssrs': 'doğrudan sorgu',
			'group:Being retired': 'Emekliye ayrılıyor',
			'group:Replacing it': 'Yerini alan',
			'kind:source': 'Yukarı akış kaynağı',
			'kind:process': 'İşleme',
			'kind:store': 'Depolama',
			'kind:serve': 'Sunum',
			'kind:legacy': 'Emekliye ayrılıyor',
			'kind:target': 'Yerini alan'
		}
	}
};
