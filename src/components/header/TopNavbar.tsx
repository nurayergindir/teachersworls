import React from 'react';
import { LiveClockCalendar } from './LiveClockCalendar';
import { Sparkles, GraduationCap } from 'lucide-react';

interface TopNavbarProps {
  onNavigateSection: (sectionId: string) => void;
  onOpenQuickAdd: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  onNavigateSection,
  onOpenQuickAdd,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Single text wordmark with subtle educational badge */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-rose-500 to-amber-500 flex items-center justify-center text-white shadow-xs">
            <GraduationCap className="w-5 h-5" />
          </div>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onNavigateSection('home');
            }}
            className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap font-display flex items-center gap-1.5"
          >
            <span>Öğretmen Dünyası</span>
            <span className="hidden sm:inline-block text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
              Eğitim Portalı
            </span>
          </a>
        </div>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
          <button
            onClick={() => onNavigateSection('home')}
            className="hover:text-indigo-600 transition-colors whitespace-nowrap"
          >
            Ana Sayfa
          </button>
          <button
            onClick={() => onNavigateSection('games')}
            className="hover:text-indigo-600 transition-colors whitespace-nowrap"
          >
            Eğitsel Oyunlar
          </button>
          <button
            onClick={() => onNavigateSection('teacher-space')}
            className="hover:text-indigo-600 transition-colors whitespace-nowrap"
          >
            Öğretmen Alanı
          </button>
          <button
            onClick={() => onNavigateSection('quotes')}
            className="hover:text-indigo-600 transition-colors whitespace-nowrap"
          >
            İlham Veren Sözler
          </button>
        </nav>

        {/* Zone 3: Live Clock & Calendar (Sağ Üst Köşe Saat & Takvim) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <LiveClockCalendar />

          <button
            onClick={onOpenQuickAdd}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-xs active:scale-95 whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Hızlı Ekle</span>
          </button>
        </div>
      </div>
    </header>
  );
};
