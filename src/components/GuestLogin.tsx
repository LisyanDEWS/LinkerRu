'use client';

import { useState, useEffect } from 'react';
import { setGuestSession } from '@/utils';

interface Props {
  onEnter: () => void;
}

export default function GuestLogin({ onEnter }: Props) {
  const [visible, setVisible] = useState(false);
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    // Entrance animation delay
    const t = setTimeout(() => setVisible(true), 100);

    const tick = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
      );
      setDate(
        now.toLocaleDateString('ru-RU', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
        })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(t);
      clearInterval(id);
    };
  }, []);

  const handleEnter = () => {
    setGuestSession(true);
    setVisible(false);
    setTimeout(onEnter, 300);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center
        transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div className="relative z-10 flex flex-col items-center gap-8 select-none">
        {/* Clock */}
        <div className="text-center">
          <div className="text-8xl font-thin tracking-widest text-white drop-shadow-2xl">
            {time}
          </div>
          <div className="mt-2 text-lg text-white/60 capitalize">
            {date}
          </div>
        </div>

        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <div
            className="text-4xl font-bold tracking-wider"
            style={{ color: 'var(--color-primary)' }}
          >
            LinkerRu
            <span className="text-xl font-light ml-2 opacity-60">XII</span>
          </div>
          <p className="text-sm text-white/40">Персональная стартовая страница</p>
        </div>

        {/* Enter button */}
        <button
          onClick={handleEnter}
          className="group relative px-10 py-3 rounded-full border border-white/20
            bg-white/5 backdrop-blur-md text-white/80 hover:text-white
            hover:bg-white/10 hover:border-white/40 transition-all duration-300
            hover:shadow-[0_0_30px_rgba(var(--color-primary-rgb),0.3)]"
        >
          <span className="text-sm font-medium tracking-widest uppercase">
            Продолжить как гость
          </span>
          <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100
            transition-opacity duration-300 bg-gradient-to-r from-transparent
            via-white/5 to-transparent" />
        </button>

        {/* Swipe hint */}
        <div className="flex flex-col items-center gap-1 opacity-30 animate-bounce">
          <span className="text-xs text-white/50">нажмите для входа</span>
        </div>
      </div>
    </div>
  );
}
