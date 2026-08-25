import type { SystemDiagram } from '$lib/types/diagram';

/**
 * Drawn as one real journey rather than as every service wired to every other.
 * An order arrives, is captured, becomes an event, and billing and notification
 * react to it without either knowing the other exists — which is the argument
 * the architecture is making.
 */
export const diagram: SystemDiagram = {
	title: 'TELCO CRM — nine services, one event bus',
	caption:
		'Nine services split along bounded-context lines, each owning its own PostgreSQL database. No service reads another’s tables; state moves between them as Kafka domain events, so billing and notification react to an order without knowing the other exists.',
	nodes: [
		{
			id: 'gateway',
			label: 'API Gateway',
			detail: 'JWT / OAuth2',
			kind: 'process',
			col: 0,
			row: 1
		},
		{
			id: 'kyc',
			label: 'Customer / KYC',
			detail: 'identity · consent',
			kind: 'process',
			col: 1,
			row: 0
		},
		{
			id: 'ordering',
			label: 'Ordering',
			detail: 'capture · orchestration',
			kind: 'process',
			col: 1,
			row: 1
		},
		{
			id: 'catalog',
			label: 'Catalog',
			detail: 'tariffs · eligibility',
			kind: 'process',
			col: 1,
			row: 2
		},
		{ id: 'usage', label: 'Usage', detail: 'metered consumption', kind: 'process', col: 1, row: 3 },
		{
			id: 'kafka',
			label: 'Kafka domain events',
			detail: 'the only shared state',
			kind: 'store',
			col: 2,
			row: 1,
			rowSpan: 2
		},
		{
			id: 'subscription',
			label: 'Subscription',
			detail: 'lifecycle state',
			kind: 'process',
			col: 3,
			row: 0
		},
		{
			id: 'billing',
			label: 'Billing & Payment',
			detail: 'invoicing · settlement',
			kind: 'process',
			col: 3,
			row: 1
		},
		{
			id: 'notification',
			label: 'Notification',
			detail: 'outbound messaging',
			kind: 'process',
			col: 3,
			row: 2
		},
		{
			id: 'ticketing',
			label: 'Ticketing',
			detail: 'support cases',
			kind: 'process',
			col: 3,
			row: 3
		}
	],
	edges: [
		{ from: 'gateway', to: 'ordering', label: 'REST' },
		{ from: 'catalog', to: 'ordering', label: 'eligibility' },
		{ from: 'ordering', to: 'kafka', label: 'order.placed' },
		{ from: 'kyc', to: 'kafka', label: 'customer.verified' },
		{ from: 'usage', to: 'kafka', label: 'usage.metered' },
		{ from: 'kafka', to: 'subscription' },
		{ from: 'kafka', to: 'billing' },
		{ from: 'kafka', to: 'notification' },
		{ from: 'kafka', to: 'ticketing' }
	],
	locales: {
		tr: {
			title: 'TELCO CRM — dokuz servis, tek olay veri yolu',
			caption:
				'Sınırlı bağlam sınırları boyunca dokuz servise ayrılmış, her biri kendi PostgreSQL veritabanına sahip. Hiçbir servis diğerinin tablolarını okumuyor; durum aralarında Kafka alan olayları olarak hareket ediyor, böylece faturalama ve bildirim bir siparişe birbirlerinden habersiz tepki veriyor.',
			kyc: 'Müşteri / KYC',
			'kyc:detail': 'kimlik · onay',
			ordering: 'Sipariş',
			'ordering:detail': 'alma · orkestrasyon',
			catalog: 'Katalog',
			'catalog:detail': 'tarifeler · uygunluk',
			usage: 'Kullanım',
			'usage:detail': 'ölçümlenen tüketim',
			kafka: 'Kafka alan olayları',
			'kafka:detail': 'tek paylaşılan durum',
			subscription: 'Abonelik',
			'subscription:detail': 'yaşam döngüsü durumu',
			billing: 'Faturalama ve Ödeme',
			'billing:detail': 'faturalama · mutabakat',
			notification: 'Bildirim',
			'notification:detail': 'giden mesajlaşma',
			ticketing: 'Destek talepleri',
			'ticketing:detail': 'destek vakaları',
			'edge:catalog-ordering': 'uygunluk',
			'kind:process': 'İşleme',
			'kind:store': 'Depolama'
		}
	}
};
