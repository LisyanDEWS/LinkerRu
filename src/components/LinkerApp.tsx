'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserSettings } from '@/types';
import { ModalKey } from '@/types';
import { loadSettings, applyTheme, isGuestSession } from '@/utils';

import ParticleCanvas from './ParticleCanvas';
import GuestLogin from './GuestLogin';
import Dashboard from './Dashboard';
import Dock from './Dock';
import Modals, { OpenModals } from './Modals';
import FullSettings from './FullSettings';

export default function LinkerApp() {
  const [mounted, setMounted] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [modals, setModals] = useState<OpenModals>({});

  // Hydrate from localStorage only after mount (avoid SSR mismatch)
  useEffect(() => {
    const s = loadSettings();
    setSettings(s);
    applyTheme(s.theme, s.theme === 'custom' ? s.customTheme : undefined);
    setLoggedIn(isGuestSession());
    setMounted(true);
  }, []);

  // Global hotkeys
  useEffect(() => {
    if (!mounted) return;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (e.key === ',') {
        e.preventDefault();
        setModals((prev) => ({ ...prev, fullSettings: true }));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mounted]);

  const openModal = useCallback((key: ModalKey | string) => {
    setModals((prev) => ({ ...prev, [key]: true }));
  }, []);

  const closeModal = useCallback((key: ModalKey) => {
    setModals((prev) => ({ ...prev, [key]: false }));
  }, []);

  const handleDockAction = useCallback(
    (action: string, target?: string) => {
      if (action === 'modal' && target) {
        openModal(target as ModalKey);
      } else if (action === 'home') {
        // already home
      }
    },
    [openModal]
  );

  const handleSaveSettings = useCallback((s: UserSettings) => {
    setSettings(s);
    applyTheme(s.theme, s.theme === 'custom' ? s.customTheme : undefined);
  }, []);

  // Don't render anything until hydrated (prevents flicker from localStorage)
  if (!mounted || !settings) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#0f172a]">
        <div className="text-blue-400 text-2xl animate-pulse font-thin tracking-widest">
          LinkerRu
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Animated background */}
      <ParticleCanvas
        color={settings.particleColor}
        count={settings.particleCount}
        speed={settings.particleSpeed}
        enabled={settings.particlesEnabled}
      />

      {/* Guest login screen */}
      {!loggedIn && (
        <GuestLogin onEnter={() => setLoggedIn(true)} />
      )}

      {/* Main app — shown after login */}
      {loggedIn && (
        <>
          <Dashboard settings={settings} onOpenModal={openModal} />
          <Dock settings={settings} onAction={handleDockAction} />
        </>
      )}

      {/* Modals (always mounted for smooth transitions) */}
      <Modals
        open={modals}
        onClose={closeModal}
        weatherCity={settings.weatherCity}
        weatherApiKey={settings.weatherApiKey}
      />

      {/* Full settings panel */}
      <FullSettings
        open={!!modals.fullSettings}
        onClose={() => closeModal('fullSettings')}
        settings={settings}
        onSave={handleSaveSettings}
      />
    </div>
  );
}
