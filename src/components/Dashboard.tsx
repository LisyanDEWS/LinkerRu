'use client';

import { useState, useEffect } from 'react';
import { UserSettings } from '@/types';
import { QUICK_LINKS } from '@/data';
import {
  formatTime,
  formatDate,
  getCalendarDays,
  MONTHS_RU,
  DAYS_RU,
  openLink,
} from '@/utils';

interface Props {
  settings: UserSettings;
  onOpenModal: (id: string) => void;
}

export default function Dashboard({ settings, onOpenModal }: Props) {
  const [now, setNow] = useState(new Date());
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const today = new Date();
  const calDays = getCalendarDays(calYear, calMonth);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = encodeURIComponent(searchQuery.trim());
    const url =
      settings.language === 'ru'
        ? `https://yandex.ru/search/?text=${q}`
        : `https://www.google.com/search?q=${q}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setSearchQuery('');
  };

  const handleLinkClick = (
    url: string,
    proxySupported: boolean | undefined
  ) => {
    openLink(url, settings.useProxy, settings.proxyUrl, proxySupported ?? false);
  };

  return (
    <div className="relative z-10 flex flex-col min-h-screen p-6 gap-6">

      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="text-xl font-semibold" style={{ color: 'var(--color-primary)' }}>
          LinkerRu XII
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onOpenModal('fullSettings')}
            className="px-4 py-1.5 rounded-lg text-sm border border-white/10 bg-white/5
              hover:bg-white/10 transition-colors"
            style={{ color: 'var(--color-text-muted)' }}
            title="Настройки (,)"
          >
            ⚙️ Настройки
          </button>
        </div>
      </div>

      {/* Search bar */}
      {settings.widgets.links && (
        <form
          onSubmit={handleSearch}
          className="flex items-center gap-2 px-4 py-3 rounded-2xl backdrop-blur-md border border-white/10"
          style={{ background: 'var(--color-surface)' }}
        >
          <span className="text-lg">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={settings.language === 'ru' ? 'Поиск...' : 'Search...'}
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: 'var(--color-text)' }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-white/30 hover:text-white/60 transition-colors"
            >
              ✕
            </button>
          )}
        </form>
      )}

      {/* Main grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">

        {/* Clock widget */}
        {settings.widgets.clock && (
          <div
            className="rounded-2xl p-5 backdrop-blur-md border border-white/10 flex flex-col items-center justify-center gap-1"
            style={{ background: 'var(--color-surface)' }}
          >
            <div
              className="text-5xl font-thin tracking-widest"
              style={{ color: 'var(--color-text)' }}
            >
              {formatTime(now, settings.showSeconds)}
            </div>
            <div
              className="text-sm capitalize"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {formatDate(now, settings.language)}
            </div>
          </div>
        )}

        {/* Weather widget */}
        {settings.widgets.weather && (
          <div
            className="rounded-2xl p-5 backdrop-blur-md border border-white/10 flex flex-col gap-3 cursor-pointer
              hover:border-white/20 transition-colors"
            style={{ background: 'var(--color-surface)' }}
            onClick={() => onOpenModal('weather')}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>
                🌤️ {settings.language === 'ru' ? 'Погода' : 'Weather'}
              </span>
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                {settings.weatherCity}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-4xl">🌤️</span>
              <div>
                <div className="text-3xl font-light" style={{ color: 'var(--color-text)' }}>
                  —°C
                </div>
                <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  {settings.language === 'ru'
                    ? 'Нажмите для обновления'
                    : 'Click to refresh'}
                </div>
              </div>
            </div>
            {settings.weatherApiKey ? null : (
              <div className="text-xs px-2 py-1 rounded-lg bg-yellow-500/10 border border-yellow-500/20"
                style={{ color: '#fbbf24' }}>
                {settings.language === 'ru'
                  ? '⚠️ API ключ не задан в настройках'
                  : '⚠️ Set API key in settings'}
              </div>
            )}
          </div>
        )}

        {/* Calendar widget */}
        {settings.widgets.calendar && (
          <div
            className="rounded-2xl p-5 backdrop-blur-md border border-white/10 flex flex-col gap-3"
            style={{ background: 'var(--color-surface)' }}
          >
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
                  else setCalMonth(m => m - 1);
                }}
                className="text-white/40 hover:text-white/80 transition-colors px-1"
              >‹</button>
              <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                {MONTHS_RU[calMonth]} {calYear}
              </span>
              <button
                onClick={() => {
                  if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
                  else setCalMonth(m => m + 1);
                }}
                className="text-white/40 hover:text-white/80 transition-colors px-1"
              >›</button>
            </div>
            <div className="grid grid-cols-7 gap-0.5 text-center">
              {DAYS_RU.map((d) => (
                <div key={d} className="text-xs py-0.5 font-medium"
                  style={{ color: 'var(--color-text-muted)' }}>{d}</div>
              ))}
              {calDays.map((day, i) => {
                const isToday =
                  day === today.getDate() &&
                  calMonth === today.getMonth() &&
                  calYear === today.getFullYear();
                return (
                  <div
                    key={i}
                    className={`text-xs py-1 rounded-full transition-colors ${
                      isToday
                        ? 'font-bold text-white'
                        : day
                        ? 'hover:bg-white/10 cursor-default'
                        : ''
                    }`}
                    style={{
                      color: isToday ? undefined : 'var(--color-text)',
                      background: isToday ? 'var(--color-primary)' : undefined,
                    }}
                  >
                    {day ?? ''}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick links */}
        {settings.widgets.links && (
          <div
            className="md:col-span-2 lg:col-span-2 rounded-2xl p-5 backdrop-blur-md border border-white/10"
            style={{ background: 'var(--color-surface)' }}
          >
            <div className="text-sm font-medium mb-3" style={{ color: 'var(--color-text-muted)' }}>
              🔗 {settings.language === 'ru' ? 'Быстрые ссылки' : 'Quick Links'}
              {settings.useProxy && (
                <span className="ml-2 text-xs px-1.5 py-0.5 rounded-md bg-green-500/20 text-green-400">
                  Proxy ON
                </span>
              )}
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {QUICK_LINKS.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.url, link.proxySupported)}
                  title={`${link.name}${settings.useProxy && link.proxySupported ? ' (через прокси)' : ''}`}
                  className="flex flex-col items-center gap-1 p-2 rounded-xl
                    hover:bg-white/10 transition-colors group"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">
                    {link.icon}
                  </span>
                  <span className="text-xs truncate w-full text-center"
                    style={{ color: 'var(--color-text-muted)' }}>
                    {link.name}
                  </span>
                  {settings.useProxy && link.proxySupported && (
                    <span className="text-[9px] text-green-400">proxy</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Telegram widget */}
        {settings.widgets.telegram && (
          <div
            className="rounded-2xl p-5 backdrop-blur-md border border-white/10 flex flex-col gap-3
              cursor-pointer hover:border-white/20 transition-colors"
            style={{ background: 'var(--color-surface)' }}
            onClick={() => onOpenModal('telegram')}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">✈️</span>
              <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                Telegram каналы
              </span>
            </div>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Подборка полезных Telegram каналов. Нажмите для просмотра.
            </p>
            <div
              className="text-xs px-2 py-1 rounded-lg w-fit"
              style={{ background: 'var(--color-surface-2)', color: 'var(--color-accent)' }}
            >
              Открыть каталог →
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
