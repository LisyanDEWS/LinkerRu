'use client';

import { useState } from 'react';
import { UserSettings, ThemePreset } from '@/types';
import { THEME_PRESETS } from '@/data';
import { applyTheme, saveSettings } from '@/utils';

interface Props {
  open: boolean;
  onClose: () => void;
  settings: UserSettings;
  onSave: (s: UserSettings) => void;
}

type Tab = 'appearance' | 'widgets' | 'proxy' | 'misc';

export default function FullSettings({ open, onClose, settings, onSave }: Props) {
  const [draft, setDraft] = useState<UserSettings>(settings);
  const [tab, setTab] = useState<Tab>('appearance');

  if (!open) return null;

  const update = (patch: Partial<UserSettings>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  };

  const updateCustomTheme = (patch: Partial<UserSettings['customTheme']>) => {
    setDraft((prev) => ({
      ...prev,
      customTheme: { ...prev.customTheme, ...patch },
    }));
  };

  const handleSave = () => {
    saveSettings(draft);
    applyTheme(draft.theme, draft.theme === 'custom' ? draft.customTheme : undefined);
    onSave(draft);
    onClose();
  };

  const handleReset = () => {
    if (confirm('Сбросить все настройки к значениям по умолчанию?')) {
      import('@/data').then(({ DEFAULT_SETTINGS }) => {
        setDraft(DEFAULT_SETTINGS);
      });
    }
  };

  const selectPreset = (preset: ThemePreset) => {
    update({ theme: preset.id });
    applyTheme(preset.id);
  };

  const TABS: { id: Tab; label: string; emoji: string }[] = [
    { id: 'appearance', label: 'Вид', emoji: '🎨' },
    { id: 'widgets', label: 'Виджеты', emoji: '📊' },
    { id: 'proxy', label: 'Прокси', emoji: '🔗' },
    { id: 'misc', label: 'Прочее', emoji: '⚙️' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative z-10 w-full max-w-2xl rounded-2xl border border-white/10
          shadow-2xl overflow-hidden animate-scale-in"
        style={{ background: 'var(--color-surface)' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b border-white/10"
          style={{ background: 'var(--color-surface-2)' }}
        >
          <h2 className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>
            ⚙️ Настройки LinkerRu XII
          </h2>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white/80 transition-colors text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Tab bar */}
        <div className="flex border-b border-white/10" style={{ background: 'var(--color-surface-2)' }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm transition-colors
                ${tab === t.id ? 'border-b-2' : 'opacity-50 hover:opacity-80'}`}
              style={{
                color: tab === t.id ? 'var(--color-primary)' : 'var(--color-text-muted)',
                borderColor: tab === t.id ? 'var(--color-primary)' : 'transparent',
              }}
            >
              <span>{t.emoji}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto flex flex-col gap-5">

          {/* ── Appearance Tab ── */}
          {tab === 'appearance' && (
            <>
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-3"
                  style={{ color: 'var(--color-text-muted)' }}>
                  Предустановленные темы
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {THEME_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => selectPreset(preset)}
                      className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all
                        ${draft.theme === preset.id
                          ? 'border-2'
                          : 'border-white/10 hover:border-white/20'}`}
                      style={{
                        background: preset.bgColor,
                        borderColor: draft.theme === preset.id ? preset.primary : undefined,
                      }}
                    >
                      <div className="flex gap-0.5">
                        <div className="w-3 h-3 rounded-full" style={{ background: preset.primary }} />
                        <div className="w-3 h-3 rounded-full" style={{ background: preset.accent }} />
                        <div className="w-3 h-3 rounded-full" style={{ background: preset.secondary }} />
                      </div>
                      <span className="text-[10px] text-white/70">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Custom theme mixer */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--color-text-muted)' }}>
                    Цветовой микшер (кастом)
                  </h3>
                  <button
                    onClick={() => update({ theme: 'custom' })}
                    className={`text-xs px-2 py-0.5 rounded-md border transition-colors
                      ${draft.theme === 'custom' ? 'border-current' : 'border-white/20 opacity-50'}`}
                    style={{ color: 'var(--color-accent)' }}
                  >
                    {draft.theme === 'custom' ? '✓ Активен' : 'Активировать'}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {(
                    [
                      { key: 'primary', label: 'Основной цвет' },
                      { key: 'secondary', label: 'Вторичный цвет' },
                      { key: 'accent', label: 'Акцент' },
                      { key: 'bgColor', label: 'Цвет фона' },
                    ] as { key: keyof UserSettings['customTheme']; label: string }[]
                  ).map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-2">
                      <input
                        type="color"
                        value={draft.customTheme[key] as string}
                        onChange={(e) => updateCustomTheme({ [key]: e.target.value })}
                        className="w-8 h-8 rounded cursor-pointer border border-white/20 bg-transparent"
                      />
                      <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        {label}
                      </span>
                    </label>
                  ))}
                </div>
              </section>

              {/* Particles */}
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-3"
                  style={{ color: 'var(--color-text-muted)' }}>
                  Частицы
                </h3>
                <div className="flex flex-col gap-3">
                  <label className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: 'var(--color-text)' }}>
                      Включить частицы
                    </span>
                    <input
                      type="checkbox"
                      checked={draft.particlesEnabled}
                      onChange={(e) => update({ particlesEnabled: e.target.checked })}
                      className="accent-blue-500"
                    />
                  </label>
                  {draft.particlesEnabled && (
                    <>
                      <label className="flex items-center gap-2">
                        <input
                          type="color"
                          value={draft.particleColor}
                          onChange={(e) => update({ particleColor: e.target.value })}
                          className="w-8 h-8 rounded cursor-pointer border border-white/20 bg-transparent"
                        />
                        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                          Цвет частиц
                        </span>
                      </label>
                      <label className="flex items-center justify-between gap-3">
                        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                          Количество ({draft.particleCount})
                        </span>
                        <input
                          type="range"
                          min={10}
                          max={200}
                          value={draft.particleCount}
                          onChange={(e) => update({ particleCount: Number(e.target.value) })}
                          className="flex-1 accent-blue-500"
                        />
                      </label>
                      <label className="flex items-center justify-between gap-3">
                        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                          Скорость ({draft.particleSpeed.toFixed(1)})
                        </span>
                        <input
                          type="range"
                          min={0.1}
                          max={3}
                          step={0.1}
                          value={draft.particleSpeed}
                          onChange={(e) => update({ particleSpeed: Number(e.target.value) })}
                          className="flex-1 accent-blue-500"
                        />
                      </label>
                    </>
                  )}
                </div>
              </section>

              {/* Blur */}
              <label className="flex items-center justify-between">
                <span className="text-sm" style={{ color: 'var(--color-text)' }}>
                  Эффект размытия (blur)
                </span>
                <input
                  type="checkbox"
                  checked={draft.blurEnabled}
                  onChange={(e) => update({ blurEnabled: e.target.checked })}
                  className="accent-blue-500"
                />
              </label>
            </>
          )}

          {/* ── Widgets Tab ── */}
          {tab === 'widgets' && (
            <>
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-3"
                  style={{ color: 'var(--color-text-muted)' }}>
                  Виджеты на панели
                </h3>
                <div className="flex flex-col gap-2">
                  {(
                    [
                      { key: 'clock', label: '🕐 Часы' },
                      { key: 'weather', label: '🌤️ Погода' },
                      { key: 'calendar', label: '📅 Календарь' },
                      { key: 'links', label: '🔗 Быстрые ссылки + поиск' },
                      { key: 'telegram', label: '✈️ Telegram каналы' },
                    ] as { key: string; label: string }[]
                  ).map(({ key, label }) => (
                    <label key={key} className="flex items-center justify-between py-1">
                      <span className="text-sm" style={{ color: 'var(--color-text)' }}>
                        {label}
                      </span>
                      <input
                        type="checkbox"
                        checked={!!draft.widgets[key]}
                        onChange={(e) =>
                          update({ widgets: { ...draft.widgets, [key]: e.target.checked } })
                        }
                        className="accent-blue-500"
                      />
                    </label>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-3"
                  style={{ color: 'var(--color-text-muted)' }}>
                  Dock-панель
                </h3>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center justify-between py-1">
                    <span className="text-sm" style={{ color: 'var(--color-text)' }}>
                      Показывать Dock
                    </span>
                    <input
                      type="checkbox"
                      checked={draft.showDock}
                      onChange={(e) => update({ showDock: e.target.checked })}
                      className="accent-blue-500"
                    />
                  </label>
                  <label className="flex items-center justify-between py-1">
                    <span className="text-sm" style={{ color: 'var(--color-text)' }}>
                      Позиция Dock
                    </span>
                    <select
                      value={draft.dockPosition}
                      onChange={(e) => update({ dockPosition: e.target.value as 'bottom' | 'top' })}
                      className="px-2 py-1 rounded-lg text-sm border border-white/10"
                      style={{ background: 'var(--color-surface-2)', color: 'var(--color-text)' }}
                    >
                      <option value="bottom">Снизу</option>
                      <option value="top">Сверху</option>
                    </select>
                  </label>
                </div>
              </section>

              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-3"
                  style={{ color: 'var(--color-text-muted)' }}>
                  Погода
                </h3>
                <div className="flex flex-col gap-3">
                  <label className="flex flex-col gap-1">
                    <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      Город
                    </span>
                    <input
                      type="text"
                      value={draft.weatherCity}
                      onChange={(e) => update({ weatherCity: e.target.value })}
                      placeholder="Moscow"
                      className="px-3 py-1.5 rounded-lg text-sm border border-white/10 outline-none"
                      style={{ background: 'var(--color-surface-2)', color: 'var(--color-text)' }}
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      OpenWeatherMap API Key
                    </span>
                    <input
                      type="password"
                      value={draft.weatherApiKey}
                      onChange={(e) => update({ weatherApiKey: e.target.value })}
                      placeholder="Введите API ключ..."
                      className="px-3 py-1.5 rounded-lg text-sm border border-white/10 outline-none"
                      style={{ background: 'var(--color-surface-2)', color: 'var(--color-text)' }}
                    />
                  </label>
                </div>
              </section>
            </>
          )}

          {/* ── Proxy Tab ── */}
          {tab === 'proxy' && (
            <>
              <section>
                <div className="flex flex-col gap-3">
                  <div
                    className="p-4 rounded-xl border border-yellow-500/20 text-sm"
                    style={{ background: 'rgba(234,179,8,0.05)', color: '#fbbf24' }}
                  >
                    ⚠️ Прокси-режим перенаправляет ссылки через указанный сервер.
                    Используйте только доверенные сервисы.
                  </div>

                  <label className="flex items-center justify-between py-1">
                    <span className="text-sm" style={{ color: 'var(--color-text)' }}>
                      Включить прокси
                    </span>
                    <input
                      type="checkbox"
                      checked={draft.useProxy}
                      onChange={(e) => update({ useProxy: e.target.checked })}
                      className="accent-blue-500"
                    />
                  </label>

                  {draft.useProxy && (
                    <label className="flex flex-col gap-1">
                      <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        URL прокси-сервера
                      </span>
                      <input
                        type="url"
                        value={draft.proxyUrl}
                        onChange={(e) => update({ proxyUrl: e.target.value })}
                        placeholder="https://your-proxy.example.com"
                        className="px-3 py-1.5 rounded-lg text-sm border border-white/10 outline-none"
                        style={{ background: 'var(--color-surface-2)', color: 'var(--color-text)' }}
                      />
                      <span className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                        Параметр <code>?url=</code> будет добавлен автоматически.
                        Работает только для ссылок с поддержкой прокси.
                      </span>
                    </label>
                  )}
                </div>
              </section>
            </>
          )}

          {/* ── Misc Tab ── */}
          {tab === 'misc' && (
            <>
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-3"
                  style={{ color: 'var(--color-text-muted)' }}>
                  Общие
                </h3>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center justify-between py-1">
                    <span className="text-sm" style={{ color: 'var(--color-text)' }}>
                      Язык интерфейса
                    </span>
                    <select
                      value={draft.language}
                      onChange={(e) => update({ language: e.target.value as 'ru' | 'en' })}
                      className="px-2 py-1 rounded-lg text-sm border border-white/10"
                      style={{ background: 'var(--color-surface-2)', color: 'var(--color-text)' }}
                    >
                      <option value="ru">Русский</option>
                      <option value="en">English</option>
                    </select>
                  </label>

                  <label className="flex items-center justify-between py-1">
                    <span className="text-sm" style={{ color: 'var(--color-text)' }}>
                      Показывать секунды на часах
                    </span>
                    <input
                      type="checkbox"
                      checked={draft.showSeconds}
                      onChange={(e) => update({ showSeconds: e.target.checked })}
                      className="accent-blue-500"
                    />
                  </label>

                  <label className="flex items-center justify-between py-1">
                    <span className="text-sm" style={{ color: 'var(--color-text)' }}>
                      Анимация при запуске
                    </span>
                    <input
                      type="checkbox"
                      checked={draft.startupAnimation}
                      onChange={(e) => update({ startupAnimation: e.target.checked })}
                      className="accent-blue-500"
                    />
                  </label>
                </div>
              </section>

              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-3"
                  style={{ color: 'var(--color-text-muted)' }}>
                  Горячие клавиши
                </h3>
                <div className="flex flex-col gap-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span>Открыть настройки</span>
                    <kbd className="px-1.5 py-0.5 rounded border border-white/20 text-[10px]">,</kbd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span>Закрыть окно</span>
                    <kbd className="px-1.5 py-0.5 rounded border border-white/20 text-[10px]">Esc</kbd>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Сброс к главной</span>
                    <kbd className="px-1.5 py-0.5 rounded border border-white/20 text-[10px]">Esc</kbd>
                  </div>
                </div>
              </section>

              <section className="pt-2 border-t border-white/10">
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-3"
                  style={{ color: 'var(--color-text-muted)' }}>
                  Данные
                </h3>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-lg text-sm border border-red-500/30 text-red-400
                    hover:bg-red-500/10 transition-colors"
                >
                  🔄 Сбросить все настройки
                </button>
              </section>
            </>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10"
          style={{ background: 'var(--color-surface-2)' }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm border border-white/10 hover:bg-white/5
              transition-colors"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-lg text-sm font-medium text-white transition-colors
              hover:opacity-90"
            style={{ background: 'var(--color-primary)' }}
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}
