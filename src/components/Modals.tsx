'use client';

import { ReactNode, useEffect } from 'react';
import { ModalKey } from '@/types';
import { TELEGRAM_CHANNELS, CHANGELOG } from '@/data';

interface ModalWrapperProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

function ModalWrapper({ open, onClose, title, children, size = 'md' }: ModalWrapperProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const maxW =
    size === 'sm' ? 'max-w-sm' : size === 'lg' ? 'max-w-2xl' : 'max-w-lg';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />

      {/* Panel */}
      <div
        className={`relative z-10 w-full ${maxW} rounded-2xl border border-white/10
          shadow-2xl animate-scale-in overflow-hidden`}
        style={{ background: 'var(--color-surface)' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b border-white/10"
          style={{ background: 'var(--color-surface-2)' }}
        >
          <h2 className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white/80 transition-colors text-xl leading-none"
            aria-label="Закрыть"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── Changelog Modal ──────────────────────────────────────────────────────────

interface ChangelogModalProps {
  open: boolean;
  onClose: () => void;
}

export function ChangelogModal({ open, onClose }: ChangelogModalProps) {
  return (
    <ModalWrapper open={open} onClose={onClose} title="📋 История обновлений" size="lg">
      <div className="flex flex-col gap-6">
        {CHANGELOG.map((entry) => (
          <div key={entry.version}>
            <div className="flex items-center gap-3 mb-2">
              <span
                className="px-2.5 py-0.5 rounded-full text-xs font-bold"
                style={{
                  background:
                    entry.type === 'major'
                      ? 'rgba(59,130,246,0.2)'
                      : entry.type === 'minor'
                      ? 'rgba(16,185,129,0.2)'
                      : 'rgba(148,163,184,0.2)',
                  color:
                    entry.type === 'major'
                      ? '#60a5fa'
                      : entry.type === 'minor'
                      ? '#34d399'
                      : '#94a3b8',
                }}
              >
                v{entry.version}
              </span>
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                {entry.date}
              </span>
            </div>
            <ul className="flex flex-col gap-1 ml-2">
              {entry.changes.map((change, i) => (
                <li key={i} className="flex items-start gap-2 text-sm"
                  style={{ color: 'var(--color-text)' }}>
                  <span style={{ color: 'var(--color-accent)' }}>•</span>
                  {change}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </ModalWrapper>
  );
}

// ─── Privacy Modal ────────────────────────────────────────────────────────────

interface PrivacyModalProps {
  open: boolean;
  onClose: () => void;
}

export function PrivacyModal({ open, onClose }: PrivacyModalProps) {
  return (
    <ModalWrapper open={open} onClose={onClose} title="🔒 Конфиденциальность" size="md">
      <div className="flex flex-col gap-4 text-sm" style={{ color: 'var(--color-text)' }}>
        <p style={{ color: 'var(--color-text-muted)' }}>
          LinkerRu XII уважает вашу конфиденциальность. Ознакомьтесь с тем, как
          приложение обрабатывает ваши данные.
        </p>

        <section className="flex flex-col gap-2">
          <h3 className="font-semibold" style={{ color: 'var(--color-accent)' }}>
            Локальное хранилище данных
          </h3>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Все настройки хранятся исключительно в{' '}
            <code className="px-1 rounded" style={{ background: 'var(--color-surface-2)' }}>
              localStorage
            </code>{' '}
            вашего браузера. Данные не передаются на сторонние серверы.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h3 className="font-semibold" style={{ color: 'var(--color-accent)' }}>
            API Погоды
          </h3>
          <p style={{ color: 'var(--color-text-muted)' }}>
            При использовании виджета погоды ваш город и API-ключ передаются
            непосредственно в{' '}
            <a
              href="https://openweathermap.org"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
              style={{ color: 'var(--color-primary)' }}
            >
              OpenWeatherMap
            </a>
            . Ключ хранится в localStorage.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h3 className="font-semibold" style={{ color: 'var(--color-accent)' }}>
            Прокси-сервис
          </h3>
          <p style={{ color: 'var(--color-text-muted)' }}>
            При включённом прокси ссылки перенаправляются через указанный вами
            сервер. LinkerRu не несёт ответственности за сторонние прокси-сервисы.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h3 className="font-semibold" style={{ color: 'var(--color-accent)' }}>
            Telegram ссылки
          </h3>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Ссылки на Telegram каналы открываются в новой вкладке браузера.
            LinkerRu не аффилирован с этими каналами.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h3 className="font-semibold" style={{ color: 'var(--color-accent)' }}>
            Удаление данных
          </h3>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Вы можете удалить все данные через настройки браузера, очистив
            localStorage для этого домена.
          </p>
        </section>
      </div>
    </ModalWrapper>
  );
}

// ─── Telegram Modal ───────────────────────────────────────────────────────────

interface TelegramModalProps {
  open: boolean;
  onClose: () => void;
}

export function TelegramModal({ open, onClose }: TelegramModalProps) {
  const categories = Array.from(new Set(TELEGRAM_CHANNELS.map((c) => c.category)));

  return (
    <ModalWrapper open={open} onClose={onClose} title="✈️ Telegram каналы" size="lg">
      <div className="flex flex-col gap-6">
        {categories.map((cat) => (
          <div key={cat}>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: 'var(--color-text-muted)' }}>
              {cat}
            </h3>
            <div className="flex flex-col gap-2">
              {TELEGRAM_CHANNELS.filter((c) => c.category === cat).map((ch) => (
                <a
                  key={ch.id}
                  href={ch.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 p-3 rounded-xl border border-white/5
                    hover:border-white/15 transition-colors group"
                  style={{ background: 'var(--color-surface-2)' }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm"
                    style={{ background: 'var(--color-primary)', color: '#fff' }}
                  >
                    {ch.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                        {ch.name}
                      </span>
                      {ch.verified && (
                        <span className="text-xs" style={{ color: 'var(--color-accent)' }}>✓</span>
                      )}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      {ch.handle}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                      {ch.description}
                    </div>
                  </div>
                  <span className="text-white/20 group-hover:text-white/60 transition-colors flex-shrink-0">
                    →
                  </span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ModalWrapper>
  );
}

// ─── Weather Modal ────────────────────────────────────────────────────────────

interface WeatherModalProps {
  open: boolean;
  onClose: () => void;
  city: string;
  apiKey: string;
}

export function WeatherModal({ open, onClose, city, apiKey }: WeatherModalProps) {
  return (
    <ModalWrapper open={open} onClose={onClose} title="🌤️ Погода" size="sm">
      <div className="flex flex-col gap-4 text-sm" style={{ color: 'var(--color-text)' }}>
        {!apiKey ? (
          <div className="text-center py-6">
            <div className="text-4xl mb-3">⚠️</div>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Для отображения погоды укажите API ключ OpenWeatherMap в настройках.
            </p>
            <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
              Бесплатный ключ:{' '}
              <a
                href="https://openweathermap.org/api"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
                style={{ color: 'var(--color-primary)' }}
              >
                openweathermap.org/api
              </a>
            </p>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="text-4xl mb-3">🌤️</div>
            <p style={{ color: 'var(--color-text-muted)' }}>
              Загрузка данных для: <strong style={{ color: 'var(--color-text)' }}>{city}</strong>
            </p>
            <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
              Живые данные о погоде доступны через серверный прокси или прямой запрос к API.
            </p>
          </div>
        )}
      </div>
    </ModalWrapper>
  );
}

// ─── Modals container ─────────────────────────────────────────────────────────

export type OpenModals = Partial<Record<ModalKey, boolean>>;

interface ModalsProps {
  open: OpenModals;
  onClose: (key: ModalKey) => void;
  weatherCity: string;
  weatherApiKey: string;
}

export default function Modals({ open, onClose, weatherCity, weatherApiKey }: ModalsProps) {
  return (
    <>
      <ChangelogModal open={!!open.changelog} onClose={() => onClose('changelog')} />
      <PrivacyModal open={!!open.privacy} onClose={() => onClose('privacy')} />
      <TelegramModal open={!!open.telegram} onClose={() => onClose('telegram')} />
      <WeatherModal
        open={!!open.weather}
        onClose={() => onClose('weather')}
        city={weatherCity}
        apiKey={weatherApiKey}
      />
    </>
  );
}
