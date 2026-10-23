import React, { useState } from 'react';
import {
  Quote as QuoteIcon,
  Sparkles,
  Shuffle,
  Volume2,
  Copy,
  Check,
  Plus,
  BookOpen,
  Heart,
} from 'lucide-react';
import { EducationalQuote } from '../../types';

interface RightInspirationSidebarProps {
  quotes: EducationalQuote[];
  onAddNewQuote: () => void;
}

export const RightInspirationSidebar: React.FC<RightInspirationSidebarProps> = ({
  quotes,
  onAddNewQuote,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'cumhuriyet' | 'pedagoji' | 'bilim' | 'felsefe'>('all');
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('ogretmen_quote_favs');
    return saved ? JSON.parse(saved) : ['q-1', 'q-2'];
  });

  const featuredQuote = quotes[featuredIndex] || quotes[0];

  const filteredQuotes = quotes.filter((q) => {
    if (activeCategory === 'all') return true;
    return q.category === activeCategory;
  });

  const handleShuffleQuote = () => {
    let nextIdx = Math.floor(Math.random() * quotes.length);
    if (nextIdx === featuredIndex && quotes.length > 1) {
      nextIdx = (nextIdx + 1) % quotes.length;
    }
    setFeaturedIndex(nextIdx);
  };

  const handleCopy = (quote: EducationalQuote) => {
    const text = `"${quote.quote}" — ${quote.author} (${quote.role})`;
    navigator.clipboard.writeText(text);
    setCopiedId(quote.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleToggleFavorite = (id: string) => {
    let updated: string[];
    if (favorites.includes(id)) {
      updated = favorites.filter((f) => f !== id);
    } else {
      updated = [...favorites, id];
    }
    setFavorites(updated);
    localStorage.setItem('ogretmen_quote_favs', JSON.stringify(updated));
  };

  const handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (isPlayingAudio) {
      setIsPlayingAudio(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'tr-TR';
    utterance.rate = 0.95;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <aside className="w-full lg:w-80 shrink-0 flex flex-col gap-4">
      {/* Featured Quote Box */}
      <div className="bg-gradient-to-br from-violet-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-5 shadow-lg relative overflow-hidden border border-indigo-800/40">
        {/* Glow */}
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-32 h-32 rounded-full bg-violet-500/20 blur-xl pointer-events-none" />

        <div className="flex items-center justify-between gap-2 mb-3 relative z-10">
          <div className="flex items-center gap-1.5">
            <span className="p-1 bg-violet-500/30 rounded-lg text-violet-300">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <span className="text-[11px] font-extrabold tracking-wider uppercase text-violet-300">
              Günün Eğitim İlhamı
            </span>
          </div>

          <button
            onClick={handleShuffleQuote}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Farklı Bir İlham Sözü Getir"
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quote body */}
        <div className="relative my-3 z-10">
          <QuoteIcon className="w-8 h-8 text-violet-400/30 absolute -top-3 -left-2 -z-1" />
          <p className="text-xs sm:text-sm font-medium leading-relaxed italic text-white/95">
            "{featuredQuote.quote}"
          </p>
        </div>

        {/* Author info */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between relative z-10">
          <div>
            <h4 className="text-xs font-bold text-violet-200 font-display">
              {featuredQuote.author}
            </h4>
            <p className="text-[10px] text-white/60 line-clamp-1">
              {featuredQuote.role}
            </p>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => handleSpeak(featuredQuote.quote)}
              className={`p-1.5 rounded-lg transition-colors ${
                isPlayingAudio
                  ? 'bg-amber-500 text-white animate-pulse'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
              title="Sesli Dinle"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => handleCopy(featuredQuote)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Sözü Kopyala"
            >
              {copiedId === featuredQuote.id ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Quote Library */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Eğitimcilerin Düşünceleri
            </h3>
          </div>

          <button
            onClick={onAddNewQuote}
            className="p-1.5 text-xs text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors inline-flex items-center gap-1 font-semibold"
            title="Söz Ekle"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Söz Ekle</span>
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[11px]">
          {(
            [
              { id: 'all', label: 'Tümü' },
              { id: 'cumhuriyet', label: 'Cumhuriyet' },
              { id: 'pedagoji', label: 'Pedagoji' },
              { id: 'bilim', label: 'Bilim & Felsefe' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id as typeof activeCategory)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all whitespace-nowrap shrink-0 ${
                activeCategory === tab.id
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Quotes List */}
        <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
          {filteredQuotes.map((item, idx) => {
            const isFav = favorites.includes(item.id);

            return (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70 hover:border-indigo-200 hover:bg-white hover:shadow-xs transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                      {item.categoryLabel}
                    </span>

                    <button
                      onClick={() => handleToggleFavorite(item.id)}
                      className="text-slate-300 hover:text-rose-500 transition-colors"
                      title={isFav ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          isFav ? 'fill-rose-500 text-rose-500' : ''
                        }`}
                      />
                    </button>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed italic line-clamp-3">
                    "{item.quote}"
                  </p>
                </div>

                <div className="pt-2 mt-2 border-t border-slate-200/60 flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <h5 className="text-xs font-bold text-slate-900 truncate">
                      {item.author}
                    </h5>
                    <p className="text-[10px] text-slate-500 truncate">
                      {item.role}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleSpeak(item.quote)}
                      className="p-1 text-slate-400 hover:text-indigo-600 rounded transition-colors"
                      title="Seslendir"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleCopy(item)}
                      className="p-1 text-slate-400 hover:text-indigo-600 rounded transition-colors"
                      title="Kopyala"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
