import type { SystemDiagram } from '$lib/types/diagram';

export const diagram: SystemDiagram = {
	title: 'Transcription pipeline — four re-runnable stages',
	caption:
		'Each stage hands off through files on disk, so a failure late in the chain re-runs only from that point rather than paying for transcription again. Simple and debuggable; the same choice is what makes concurrency awkward.',
	nodes: [
		{
			id: 'source',
			label: 'Source video',
			detail: 'client archive',
			kind: 'source',
			col: 0,
			row: 0
		},
		{ id: 'extract', label: 'Extract', detail: 'FFmpeg', kind: 'process', col: 1, row: 0 },
		{ id: 'transcribe', label: 'Transcribe', detail: 'Whisper', kind: 'process', col: 2, row: 0 },
		{ id: 'translate', label: 'Translate', detail: 'DeepL', kind: 'process', col: 3, row: 0 },
		{
			id: 'emit',
			label: 'Emit',
			detail: 'subtitles · transcripts',
			kind: 'serve',
			col: 4,
			row: 0
		}
	],
	edges: [
		{ from: 'source', to: 'extract' },
		{ from: 'extract', to: 'transcribe', label: 'normalised audio' },
		{ from: 'transcribe', to: 'translate', label: 'timestamped text' },
		{ from: 'translate', to: 'emit', label: 'per language' }
	],
	locales: {
		tr: {
			title: 'Transkripsiyon hattı — yeniden çalıştırılabilir dört aşama',
			caption:
				'Her aşama diskteki dosyalar üzerinden devrediyor; zincirin sonunda bir hata olduğunda yalnızca o noktadan itibaren yeniden çalışıyor, transkripsiyon bedeli tekrar ödenmiyor. Basit ve hata ayıklanabilir; eşzamanlılığı zorlaştıran da aynı tercih.',
			source: 'Kaynak video',
			'source:detail': 'müşteri arşivi',
			extract: 'Çıkarma',
			transcribe: 'Deşifre',
			translate: 'Çeviri',
			emit: 'Üretim',
			'emit:detail': 'altyazı · transkript',
			'edge:extract-transcribe': 'normalize ses',
			'edge:transcribe-translate': 'zaman damgalı metin',
			'edge:translate-emit': 'dil başına',
			'kind:source': 'Yukarı akış kaynağı',
			'kind:process': 'İşleme',
			'kind:serve': 'Sunum'
		}
	}
};
