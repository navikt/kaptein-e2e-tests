import { URL } from 'node:url';

export const getParsedUrl = (url: string): URL => new URL(url);

export const USE_LOCALHOST = process.env.TARGET === 'local';

export const DEV_DOMAIN = 'https://kaptein.intern.dev.nav.no';
export const LOCAL_DOMAIN = 'http://localhost:3000';

export const UI_DOMAIN = USE_LOCALHOST ? LOCAL_DOMAIN : DEV_DOMAIN;
