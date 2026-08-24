declare const __SITE_ENV__: string;

export type SiteEnv = 'production' | 'staging';

/** Build-time environment. Set by the deploy workflow, defaults to production. */
export const siteEnv: SiteEnv = __SITE_ENV__ === 'staging' ? 'staging' : 'production';

export const isStaging = siteEnv === 'staging';
