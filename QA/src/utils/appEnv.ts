export type AppEnvironment = 'prod' | 'staging';

export const IS_STAGING: boolean = globalThis.__TZAVMAN_IS_STAGING__ === true;

export const APP_ENV: AppEnvironment = IS_STAGING ? 'staging' : 'prod';

export const APP_VERSION: string = (globalThis.__TZAVMAN_APP_VERSION__ || '1.0.0').trim();

/**
 * Isolated Firebase App name, IndexedDB name, BroadcastChannel name and localStorage keys
 * so Prod (/python-task/) and Pre-Prod (/python-task/staging/) NEVER collide even on the same origin.
 * Prod keeps its exact original keys so existing team sessions and preferences stay untouched.
 */
export const FIREBASE_APP_NAME = IS_STAGING ? 'tzavman-staging' : '[DEFAULT]';
export const ENV_BROADCAST_CHANNEL = IS_STAGING
  ? 'std_qa_live_channel_staging'
  : 'std_qa_live_channel';
export const ENV_IDB_NAME = IS_STAGING ? 'tzavman_qa_staging_idb_v1' : 'tzavman_qa_idb_v1';

export function envStorageKey(baseKey: string): string {
  return IS_STAGING ? `staging__${baseKey}` : baseKey;
}

export const PROD_APP_URL = 'https://abkss001-art.github.io/python-task/';
export const STAGING_APP_URL = 'https://abkss001-art.github.io/python-task/staging/';
