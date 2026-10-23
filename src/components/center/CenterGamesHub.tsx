import React, { useState } from 'react';
import {
  Gamepad2,
  Play,
  Sparkles,
  Search,
  Plus,
  Users,
  Clock,
  Compass,
} from 'lucide-react';
import { EducationalGame, GameCategory } from '../../types';

interface CenterGamesHubProps {
  games: EducationalGame[];
  onPlayGame: (game: EducationalGame) => void;
  onAddNewGame: () => void;
}

export const CenterGamesHub: React.FC<CenterGamesHubProps> = ({
  games,
  onPlayGame,
  onAddNewGame,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<GameCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filterTabs: { id: GameCategory; label: string }[] = [
    { id: 'all', label: 'Tüm Oyunlar' },
    { id: 'matematik', label: 'Matematik' },
    { id: 'fen', label: 'Fen Bilimleri' },
    { id: 'turkce', label: 'Türkçe & Dil' },
    { id: 'kodlama', label: 'Kodlama & Mantık' },
  ];

  const filteredGames = games.filter((game) => {
    const matchesCategory =
      selectedFilter === 'all' || game.category === selectedFilter;
    const matchesSearch =
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.keyConcepts.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="flex-1 min-w-0 space-y-6">
      {/* Hero Banner with vivid educational colors */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-rose-500 to-violet-600 p-6 sm:p-8 text-white shadow-lg">
        {/* Decorative background shapes */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-48 h-48 rounded-full bg-amber-400/20 blur-xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 bg-white/20 rounded-xl backdrop-blur-xs">
              <Sparkles className="w-4 h-4 text-amber-200" />
            </span>
            <span className="text-xs uppercase tracking-wider font-extrabold text-amber-100">
              Canlı Eğitsel Oyun Alanı & Sınıf Etkinlikleri
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-white mb-2 leading-tight">
            Öğrenmeyi Oyunla Canlandırın
          </h1>
          <p className="text-xs sm:text-sm text-white/90 leading-relaxed mb-5">
            Ders içi motivasyonu artıran, kazanımları pekiştiren ve akıllı tahtada anında oynatılabilen interaktif eğitsel oyunlar ve sınıf etkinlikleri.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onPlayGame(games[0])}
              className="px-5 py-2.5 bg-white text-slate-900 font-bold rounded-2xl text-xs sm:text-sm shadow-md hover:bg-slate-50 transition-all active:scale-95 inline-flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-slate-900" />
              <span>Hemen Başla: {games[0]?.title.split('&')[0]}</span>
            </button>

            <button
              onClick={onAddNewGame}
              className="px-4 py-2.5 bg-black/20 hover:bg-black/30 backdrop-blur-xs text-white border border-white/30 font-semibold rounded-2xl text-xs sm:text-sm transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Oyun Ekle</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 ${
                selectedFilter === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Oyun veya kavram ara..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredGames.length === 0 ? (
          <div className="col-span-full text-center py-12 px-4 bg-white rounded-3xl border border-slate-200">
            <Gamepad2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">Aramanıza uygun oyun bulunamadı</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Farklı bir arama terimi deneyebilir veya platforma yeni bir oyun bağlantısı ekleyebilirsiniz.
            </p>
            <button
              onClick={onAddNewGame}
              className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-colors inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Oyun Ekle</span>
            </button>
          </div>
        ) : (
          filteredGames.map((game) => (
            <div
              key={game.id}
              className="group bg-white rounded-3xl border border-slate-200/90 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Card Image Banner */}
              <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                <img
                  src={game.image}
                  alt={game.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback visually if needed
                    e.currentTarget.style.display = 'none';
                  }}
                />

                {/* Scrim Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Top Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-md bg-white/90 text-slate-900 shadow-xs">
                    {game.categoryLabel}
                  </span>
                  {game.isCustom && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-amber-400 text-amber-950">
                      Özel
                    </span>
                  )}
                </div>

                {/* Bottom title on image */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="text-lg font-bold font-display leading-tight drop-shadow-sm">
                    {game.title}
                  </h3>
                  <p className="text-xs text-white/90 line-clamp-1 mt-0.5">
                    {game.subtitle}
                  </p>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  {/* Meta stats */}
                  <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{game.estimatedMinutes}</span>
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{game.targetGrade}</span>
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5 text-slate-400" />
                      <span>{game.players}</span>
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {game.description}
                  </p>

                  {/* Key concept pills */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {game.keyConcepts.map((concept, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"
                      >
                        #{concept}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action button */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-400">
                    Akıllı Tahta Uyumlu
                  </span>

                  <button
                    onClick={() => onPlayGame(game)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs inline-flex items-center gap-1.5 transition-all duration-200 active:scale-95 bg-gradient-to-r ${game.gradientBg} hover:opacity-95`}
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Hemen Oyna</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
};
