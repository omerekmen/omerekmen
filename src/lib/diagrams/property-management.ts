import type { SystemDiagram } from '$lib/types/diagram';

/**
 * The dashboard edge is drawn straight off PostgreSQL on purpose. That is what
 * the system does, and it is exactly what the retrospective says was wrong with
 * it — a diagram that quietly routed it through a modelled layer would be
 * describing the version that does not exist.
 */
export const diagram: SystemDiagram = {
	title: 'Property management — production Django, .NET reporting alongside',
	caption:
		'Django serves real users while the .NET reporting path is built beside it, not in place of it. The dashboard aggregates across the full history straight from the transactional schema, which is why it was the slowest surface in the system.',
	nodes: [
		{
			id: 'people',
			label: 'Tenants & managers',
			detail: 'day-to-day use',
			kind: 'source',
			col: 0,
			row: 1
		},
		{
			id: 'django',
			label: 'Django backend',
			detail: 'production · AWS',
			kind: 'process',
			col: 1,
			row: 1
		},
		{
			id: 'dotnet',
			label: '.NET reporting service',
			detail: 'in progress',
			kind: 'target',
			col: 1,
			row: 2
		},
		{
			id: 'postgres',
			label: 'PostgreSQL',
			detail: '15+ normalised tables',
			kind: 'store',
			col: 2,
			row: 1
		},
		{
			id: 'dashboard',
			label: 'Reporting dashboard',
			detail: 'load time -60%',
			kind: 'serve',
			col: 3,
			row: 1
		}
	],
	edges: [
		{ from: 'people', to: 'django' },
		{ from: 'django', to: 'postgres', label: 'tenancies · schedules' },
		{ from: 'dotnet', to: 'postgres', label: 'typed queries', dashed: true },
		{ from: 'postgres', to: 'dashboard', label: 'aggregates every load' }
	],
	groups: [{ label: 'Rebuild in progress', nodes: ['dotnet'], kind: 'target' }],
	locales: {
		tr: {
			title: 'Emlak yönetimi — üretimde Django, yanında .NET raporlama',
			caption:
				'Django gerçek kullanıcılara hizmet verirken .NET raporlama yolu onun yerine değil yanında kuruluyor. Panel, tüm geçmiş üzerinde doğrudan işlem şemasından toplama yapıyor; sistemdeki en yavaş yüzey olmasının sebebi bu.',
			people: 'Kiracılar ve yöneticiler',
			'people:detail': 'günlük kullanım',
			django: 'Django arka ucu',
			'django:detail': 'üretim · AWS',
			dotnet: '.NET raporlama servisi',
			'dotnet:detail': 'devam ediyor',
			'postgres:detail': '15+ normalize tablo',
			dashboard: 'Raporlama paneli',
			'dashboard:detail': 'yükleme süresi -60%',
			'edge:django-postgres': 'kiralamalar · planlar',
			'edge:dotnet-postgres': 'tipli sorgular',
			'edge:postgres-dashboard': 'her açılışta toplama',
			'group:Rebuild in progress': 'Yeniden yazım sürüyor',
			'kind:source': 'Yukarı akış kaynağı',
			'kind:process': 'İşleme',
			'kind:store': 'Depolama',
			'kind:serve': 'Sunum',
			'kind:target': 'Yerini alan'
		}
	}
};
