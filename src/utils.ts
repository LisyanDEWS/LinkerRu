import { UserSettings, ThemePreset, CustomTheme } from './types';
import { DEFAULT_SETTINGS, THEME_PRESETS } from './data';

const SETTINGS_KEY = 'linkerru_settings';
const GUEST_KEY = 'linkerru_guest';

// ─── localStorage helpers ─────────────────────────────────────────────────────

export function loadSettings(): UserSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<UserSettings>;
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: UserSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Silently fail if storage is unavailable
  }
}

export function isGuestSession(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(GUEST_KEY) === 'true';
}

export function setGuestSession(value: boolean): void {
  if (typeof window === 'undefined') return;
  if (value) {
    localStorage.setItem(GUEST_KEY, 'true');
  } else {
    localStorage.removeItem(GUEST_KEY);
  }
}

// ─── Theme helpers ────────────────────────────────────────────────────────────

export function getThemePreset(id: string): ThemePreset | undefined {
  return THEME_PRESETS.find((t) => t.id === id);
}

export function applyTheme(
  presetId: string,
  customTheme?: CustomTheme
): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;

  if (presetId === 'custom' && customTheme) {
    root.style.setProperty('--color-primary', customTheme.primary);
    root.style.setProperty('--color-secondary', customTheme.secondary);
    root.style.setProperty('--color-accent', customTheme.accent);
    root.style.setProperty('--color-surface', customTheme.surface);
    root.style.setProperty('--color-surface-2', customTheme.surface2);
    root.style.setProperty('--color-text', customTheme.text);
    root.style.setProperty('--color-text-muted', customTheme.textMuted);
    document.body.style.background =
      customTheme.bgType === 'gradient'
        ? customTheme.bgGradient
        : customTheme.bgColor;
    return;
  }

  const preset = getThemePreset(presetId);
  if (!preset) return;

  root.style.setProperty('--color-primary', preset.primary);
  root.style.setProperty('--color-secondary', preset.secondary);
  root.style.setProperty('--color-accent', preset.accent);
  root.style.setProperty('--color-surface', preset.surface);
  root.style.setProperty('--color-surface-2', preset.surface2);
  root.style.setProperty('--color-text', preset.text);
  root.style.setProperty('--color-text-muted', preset.textMuted);
  document.body.style.background =
    preset.bgType === 'gradient'
      ? (preset.bgGradient ?? preset.bgColor)
      : preset.bgColor;
}

// ─── URL / Proxy helpers ──────────────────────────────────────────────────────

export function buildLaunchUrl(
  url: string,
  useProxy: boolean,
  proxyUrl: string,
  proxySupported = true
): string {
  if (useProxy && proxyUrl && proxySupported) {
    // Append url as a query param to the proxy base URL
    try {
      const proxy = new URL(proxyUrl);
      proxy.searchParams.set('url', url);
      return proxy.toString();
    } catch {
      return url;
    }
  }
  return url;
}

export function openLink(
  url: string,
  useProxy: boolean,
  proxyUrl: string,
  proxySupported = true
): void {
  const finalUrl = buildLaunchUrl(url, useProxy, proxyUrl, proxySupported);
  window.open(finalUrl, '_blank', 'noopener,noreferrer');
}

// ─── Date / Time helpers ──────────────────────────────────────────────────────

export function formatTime(date: Date, showSeconds: boolean): string {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  if (showSeconds) {
    const s = String(date.getSeconds()).padStart(2, '0');
    return `${h}:${m}:${s}`;
  }
  return `${h}:${m}`;
}

export function formatDate(date: Date, language: 'ru' | 'en'): string {
  return date.toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getCalendarDays(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay();
  // Adjust so week starts on Monday (0=Mon ... 6=Sun)
  const startOffset = (firstDay + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

export const MONTHS_RU = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];
export const DAYS_RU = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

// ─── Misc helpers ─────────────────────────────────────────────────────────────

export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}
