'use client';

import { UserSettings } from '@/types';
import { DOCK_ITEMS } from '@/data';

interface Props {
  settings: UserSettings;
  onAction: (action: string, target?: string) => void;
}

export default function Dock({ settings, onAction }: Props) {
  if (!settings.showDock) return null;

  return (
    <div
      className={`fixed z-30 left-1/2 -translate-x-1/2 ${
        settings.dockPosition === 'top' ? 'top-4' : 'bottom-4'
      }`}
    >
      <div
        className="flex items-center gap-2 px-4 py-2.5 rounded-2xl backdrop-blur-xl border border-white/10
          shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
        style={{ background: 'var(--color-surface)' }}
      >
        {DOCK_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              if (item.action === 'modal' && item.target) {
                onAction('modal', item.target);
              } else if (item.action === 'url' && item.target) {
                window.open(item.target, '_blank', 'noopener,noreferrer');
              } else {
                onAction(item.id);
              }
            }}
            title={item.name}
            className="group flex flex-col items-center justify-center w-10 h-10 rounded-xl
              hover:bg-white/10 transition-all duration-200 hover:scale-110"
          >
            <span className="text-xl transition-transform duration-200 group-hover:-translate-y-0.5">
              {item.icon}
            </span>
            {/* Tooltip */}
            <span
              className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-lg
                text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity
                pointer-events-none"
              style={{
                background: 'var(--color-surface-2)',
                color: 'var(--color-text)',
              }}
            >
              {item.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
