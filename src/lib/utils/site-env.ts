declare const __SITE_ENV__: string;
declare const __BUILD_COMMIT__: string;

export type SiteEnv = 'production' | 'staging';

/** Build-time environment. Set by the deploy workflow, defaults to production. */
export const siteEnv: SiteEnv = __SITE_ENV__ === 'staging' ? 'staging' : 'production';

export const isStaging = siteEnv === 'staging';

/** Short commit this bundle was built from, surfaced in a meta tag. */
export const buildCommit: string = __BUILD_COMMIT__;
