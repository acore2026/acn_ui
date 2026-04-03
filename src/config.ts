export const BACKEND_ENDPOINT_STORAGE_KEY = 'acn.demo.backendEndpoint';
export const DEBUG_MODE_STORAGE_KEY = 'acn.demo.debugMode';

declare global {
  interface Window {
    __APP_CONFIG__?: {
      backendEndpoint?: string;
    };
  }
}

function trimTrailingSlashes(value: string) {
  return value.replace(/\/+$/, '');
}

export function getFallbackBackendEndpoint() {
  if (typeof window === 'undefined') {
    return 'http://127.0.0.1:18081';
  }
  return `${window.location.protocol}//${window.location.hostname}:18081`;
}

export function normalizeBackendEndpoint(raw: string | null | undefined) {
  const trimmed = raw?.trim() ?? '';
  if (!trimmed) {
    return '';
  }
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `http://${trimmed}`;
  return trimTrailingSlashes(withProtocol);
}

export function getRuntimeBackendEndpoint() {
  if (typeof window === 'undefined') {
    return getFallbackBackendEndpoint();
  }
  return normalizeBackendEndpoint(window.__APP_CONFIG__?.backendEndpoint) || getFallbackBackendEndpoint();
}

export function getConfiguredBackendEndpoint() {
  if (typeof window === 'undefined') {
    return getRuntimeBackendEndpoint();
  }
  return normalizeBackendEndpoint(window.localStorage.getItem(BACKEND_ENDPOINT_STORAGE_KEY))
    || getRuntimeBackendEndpoint();
}

export function getInitialBackendEndpointDraft() {
  if (typeof window === 'undefined') {
    return getRuntimeBackendEndpoint();
  }
  return window.localStorage.getItem(BACKEND_ENDPOINT_STORAGE_KEY) ?? getRuntimeBackendEndpoint();
}

export function getInitialDebugMode() {
  if (typeof window === 'undefined') {
    return false;
  }
  if (window.location.origin === 'http://101.245.78.174:8085' && window.location.search.includes('debug')) {
    return true;
  }
  return window.localStorage.getItem(DEBUG_MODE_STORAGE_KEY) === 'true';
}

export function buildBackendUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${getConfiguredBackendEndpoint()}${normalizedPath}`;
}
