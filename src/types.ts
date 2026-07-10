// Application types for LinkerRu XII

export interface AppItem {
  id: string;
  name: string;
  icon: string; // emoji or URL
  url: string;
  category: string;
  proxySupported?: boolean;
  description?: string;
}

export interface Widget {
  id: string;
  type: 'clock' | 'weather' | 'calendar' | 'links' | 'news' | 'telegram';
  enabled: boolean;
}

export interface ThemePreset {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  surface: string;
  surface2: string;
  text: string;
  textMuted: string;
  bgColor: string;
  bgType: 'solid' | 'gradient';
  bgGradient?: string;
}

export interface CustomTheme {
  primary: string;
  secondary: string;
  accent: string;
  surface: string;
  surface2: string;
  text: string;
  textMuted: string;
  bgColor: string;
  bgType: 'solid' | 'gradient';
  bgGradient: string;
}

export interface UserSettings {
  theme: string; // preset id or 'custom'
  customTheme: CustomTheme;
  language: 'ru' | 'en';
  useProxy: boolean;
  proxyUrl: string;
  particlesEnabled: boolean;
  particleColor: string;
  particleCount: number;
  particleSpeed: number;
  showDock: boolean;
  dockPosition: 'bottom' | 'top';
  widgets: Record<string, boolean>;
  hotkeys: Record<string, string>;
  showSeconds: boolean;
  weatherCity: string;
  weatherApiKey: string;
  startupAnimation: boolean;
  blurEnabled: boolean;
}

export interface DockItem {
  id: string;
  name: string;
  icon: string;
  action: 'modal' | 'url' | 'none';
  target?: string; // modal name or URL
  emoji?: string;
}

export interface ModalId {
  settings: boolean;
  fullSettings: boolean;
  changelog: boolean;
  privacy: boolean;
  telegram: boolean;
  weather: boolean;
}

export type ModalKey = keyof ModalId;

export interface TelegramChannel {
  id: string;
  name: string;
  handle: string;
  description: string;
  url: string;
  category: string;
  verified?: boolean;
}

export interface ChangelogEntry {
  version: string;
  date: string;
  changes: string[];
  type: 'major' | 'minor' | 'patch';
}

export interface WeatherData {
  city: string;
  temp: number;
  feelsLike: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}
