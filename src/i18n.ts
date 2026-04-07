import catalog from './locales/catalog.json';

export type Locale = 'en' | 'zh-CN';
export type LocalizedCatalogEntry = Partial<Record<Locale, string>>;
export type LocaleCatalog = Record<string, LocalizedCatalogEntry>;

export const LOCALE_STORAGE_KEY = 'acn.demo.locale';
export const DEFAULT_LOCALE: Locale = 'zh-CN';
export const FALLBACK_LOCALE: Locale = 'en';
const PLACEHOLDER_PATTERN = /^\{\{\s*([^{}]+?)\s*\}\}$/;
const localeCatalog = catalog as LocaleCatalog;

export function isLocale(value: string | null | undefined): value is Locale {
  return value === 'en' || value === 'zh-CN';
}

export function getInitialLocale() {
  if (typeof window === 'undefined') {
    return DEFAULT_LOCALE;
  }
  const saved = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  return isLocale(saved) ? saved : DEFAULT_LOCALE;
}

export function resolveCatalogEntry(
  value: LocalizedCatalogEntry | undefined,
  locale: Locale,
  fallback: Locale = FALLBACK_LOCALE,
) {
  if (!value) {
    return '';
  }
  if (typeof value === 'string') {
    return value;
  }
  const preferred = value[locale];
  if (typeof preferred === 'string') {
    return preferred;
  }
  const fallbackValue = value[fallback];
  if (typeof fallbackValue === 'string') {
    return fallbackValue;
  }
  for (const candidate of Object.values(value)) {
    if (typeof candidate === 'string') {
      return candidate;
    }
  }
  return '';
}

export function isPlaceholder(value: string | undefined | null): value is string {
  return typeof value === 'string' && PLACEHOLDER_PATTERN.test(value);
}

export function getPlaceholderKey(value: string) {
  const match = value.match(PLACEHOLDER_PATTERN);
  return match?.[1]?.trim() ?? '';
}

export function getCatalogText(key: string, locale: Locale) {
  const resolved = resolveCatalogEntry(localeCatalog[key], locale);
  return resolved || `{{${key}}}`;
}

export function resolveTextValue(value: string | undefined, locale: Locale) {
  if (!value) {
    return '';
  }
  if (!isPlaceholder(value)) {
    return value;
  }
  return getCatalogText(getPlaceholderKey(value), locale);
}
