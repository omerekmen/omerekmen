import type { SystemDiagram } from '$lib/types/diagram';

export const diagram: SystemDiagram = {
	title: 'Travel group data platform',
	caption:
		'Five stages, and the value is in the boundaries between them. Every source arrives on its own schedule and in its own shape; everything downstream of the warehouse reads one set of governed models.',
	nodes: [
		{
			id: 'operational',
			label: 'Operational systems',
			detail: 'D365 · SAP · CRM',
			kind: 'source',
			col: 0,
			row: 0
		},
		{
			id: 'partners',
			label: 'Partner integrations',
			detail: 'REST endpoints',
			kind: 'source',
			col: 0,
			row: 1
		},
		{ id: 'files', label: 'File drops', detail: 'Parquet', kind: 'source', col: 0, row: 2 },
		{
			id: 'ingest',
			label: 'Ingestion',
			detail: 'Azure Data Factory',
			kind: 'process',
			col: 1,
			row: 1
		},
		{
			id: 'lakehouse',
			label: 'Lakehouse',
			detail: 'Python in Fabric',
			kind: 'store',
			col: 2,
			row: 1
		},
		{
			id: 'warehouse',
			label: 'Warehouse',
			detail: 'Conformed models',
			kind: 'store',
			col: 3,
			row: 1
		},
		{
			id: 'powerbi',
			label: 'Power BI',
			detail: 'Every business unit',
			kind: 'serve',
			col: 4,
			row: 0
		},
		{
			id: 'research',
			label: 'Forecasting & R&D',
			detail: 'Same governed models',
			kind: 'serve',
			col: 4,
			row: 2
		}
	],
	edges: [
		{ from: 'operational', to: 'ingest' },
		{ from: 'partners', to: 'ingest' },
		{ from: 'files', to: 'ingest' },
		{ from: 'ingest', to: 'lakehouse', label: 'watermarked' },
		{ from: 'lakehouse', to: 'warehouse', label: 'modelled' },
		{ from: 'warehouse', to: 'powerbi' },
		{ from: 'warehouse', to: 'research' }
	],
	locales: {
		tr: {
			title: 'Seyahat grubu veri platformu',
			caption:
				'Beş aşama, ve değer aralarındaki sınırlarda. Her kaynak kendi takvimiyle ve kendi şekliyle geliyor; ambarın altındaki her şey tek bir yönetilen model kümesinden okuyor.',
			operational: 'Operasyonel sistemler',
			partners: 'İş ortağı entegrasyonları',
			'partners:detail': 'REST uçları',
			files: 'Dosya bırakımları',
			ingest: 'Alım',
			lakehouse: 'Göl evi',
			'lakehouse:detail': 'Fabric’te Python',
			warehouse: 'Ambar',
			'warehouse:detail': 'Uyumlulaştırılmış modeller',
			'powerbi:detail': 'Her iş birimi',
			research: 'Tahminleme ve Ar-Ge',
			'research:detail': 'Aynı yönetilen modeller',
			'edge:ingest-lakehouse': 'filigranlı',
			'edge:lakehouse-warehouse': 'modellenmiş',
			'kind:source': 'Yukarı akış kaynağı',
			'kind:process': 'İşleme',
			'kind:store': 'Depolama',
			'kind:serve': 'Sunum'
		}
	}
};
