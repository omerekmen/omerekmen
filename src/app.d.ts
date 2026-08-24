// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

/** Replaced at build time by Vite. See vite.config.ts. */
declare const __SITE_ENV__: string;

declare global {
	namespace App {
		interface Platform {
			env: Env;
			ctx: ExecutionContext;
			caches: CacheStorage;
			cf?: IncomingRequestCfProperties;
		}

		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
	}
}

export {};
