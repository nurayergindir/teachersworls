import React, { useState, useEffect } from 'react';
import { Orbit, RotateCcw, Award, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CardItem {
  id: number;
  pairKey: string;
  name: string;
  symbol: string;
  color: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const SCIENCE_PAIRS = [
  { pairKey: 'earth', name: 'Dünya & Atmosfer', symbol: '🌍', color: 'from-blue-500 to-emerald-500' },
  { pairKey: 'sun', name: 'Güneş & Işık', symbol: '☀️', color: 'from-amber-400 to-orange-500' },
  { pairKey: 'saturn', name: 'Satürn & Halkalar', symbol: '🪐', color: 'from-purple-500 to-indigo-600' },
  { pairKey: 'atom', name: 'Atom & Çekirdek', symbol: '⚛️', color: 'from-cyan-400 to-blue-600' },
  { pairKey: 'microscope', name: 'Mikroskop & Hücre', symbol: '🔬', color: 'from-emerald-400 to-teal-600' },
  { pairKey: 'telescope', name: 'Teleskop & Uzay', symbol: '🔭', color: 'from-violet-500 to-purple-700' },
  { pairKey: 'dna', name: 'DNA & Genetik', symbol: '🧬', color: 'from-rose-400 to-pink-600' },
  { pairKey: 'magnet', name: 'Manyetizma & Mıknatıs', symbol: '🧲', color: 'from-red-500 to-orange-500' },
];

export const ScienceMemoryGame: React.FC = () => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  const initGame = () => {
    const deck: CardItem[] = [];
    let idCounter = 0;
    SCIENCE_PAIRS.forEach((pair) => {
      deck.push({
        id: idCounter++,
        pairKey: pair.pairKey,
        name: pair.name,
        symbol: pair.symbol,
        color: pair.color,
        isFlipped: false,
        isMatched: false,
      });
      deck.push({
        id: idCounter++,
        pairKey: pair.pairKey,
        name: pair.name,
        symbol: pair.symbol,
        color: pair.color,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle deck
    const shuffled = deck.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedIndices([]);
    setMoves(0);
    setMatchedPairs(0);
    setSeconds(0);
    setTimerActive(false);
    setIsLocked(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && matchedPairs < SCIENCE_PAIRS.length) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, matchedPairs]);

  const handleCardClick = (index: number) => {
    if (isLocked) return;
    if (cards[index].isMatched || cards[index].isFlipped) return;

    if (!timerActive) {
      setTimerActive(true);
    }

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      setIsLocked(true);

      const [firstIdx, secondIdx] = newFlipped;
      if (cards[firstIdx].pairKey === cards[secondIdx].pairKey) {
        // Match!
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, i) => (i === firstIdx || i === secondIdx ? { ...c, isMatched: true } : c))
          );
          setFlippedIndices([]);
          setIsLocked(false);
          setMatchedPairs((mp) => {
            const next = mp + 1;
            if (next === SCIENCE_PAIRS.length) {
              confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
            }
            return next;
          });
        }, 400);
      } else {
        // No match, flip back
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, i) => (i === firstIdx || i === secondIdx ? { ...c, isFlipped: false } : c))
          );
          setFlippedIndices([]);
          setIsLocked(false);
        }, 900);
      }
    }
  };

  const isCompleted = matchedPairs === SCIENCE_PAIRS.length;

  return (
    <div className="p-6 bg-gradient-to-br from-violet-50/80 to-indigo-50/90 rounded-2xl border border-violet-200/80 max-w-xl mx-auto shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-violet-200">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-violet-600 text-white rounded-xl shadow-sm">
            <Orbit className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-lg font-bold text-violet-950 font-display">Gezegenler & Fen Eşleştirme</h3>
            <p className="text-xs text-violet-800/80">Bilimsel kavramları eşleştir, hafızanı güçlendir!</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-violet-900 bg-violet-100 px-3 py-1.5 rounded-lg border border-violet-300">
          <span>Hamle: <span className="tabular-nums font-bold">{moves}</span></span>
          <span className="text-violet-300">|</span>
          <span>Süre: <span className="tabular-nums font-bold">{seconds}s</span></span>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-4 mb-3 flex items-center justify-between text-xs text-violet-900 font-medium">
        <span>Eşleşen: {matchedPairs} / {SCIENCE_PAIRS.length} çift</span>
        <button
          onClick={initGame}
          className="text-violet-700 hover:text-violet-950 flex items-center gap-1 font-semibold transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Yeniden Karıştır
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-4 gap-2.5 my-3">
        {cards.map((card, index) => {
          const showFace = card.isFlipped || card.isMatched;
          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(index)}
              disabled={card.isMatched || isLocked}
              className={`h-22 rounded-xl border transition-all duration-200 flex flex-col items-center justify-center p-1 relative ${
                card.isMatched
                  ? 'bg-emerald-50 border-emerald-300 opacity-90 shadow-none'
                  : showFace
                  ? 'bg-white border-violet-400 shadow-md scale-95'
                  : 'bg-gradient-to-br from-violet-600 to-indigo-700 border-violet-500 shadow-xs hover:from-violet-500 hover:to-indigo-600 active:scale-95 text-white'
              }`}
            >
              {showFace ? (
                <>
                  <span className="text-2xl mb-1">{card.symbol}</span>
                  <span className="text-[10px] font-semibold text-slate-800 text-center leading-tight line-clamp-1 px-1">
                    {card.name.split('&')[0]}
                  </span>
                  {card.isMatched && (
                    <span className="absolute top-1 right-1 text-emerald-600">
                      <CheckCircle className="w-3 h-3" />
                    </span>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <span className="text-xl opacity-40">✨</span>
                  <span className="text-[10px] font-medium tracking-wider text-violet-200 uppercase mt-0.5">FEN</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {isCompleted && (
        <div className="mt-4 p-4 bg-white rounded-xl border-2 border-emerald-400 text-center shadow-md animate-in fade-in">
          <div className="w-10 h-10 mx-auto mb-2 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
            <Award className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-slate-900">Mükemmel Hafıza!</h4>
          <p className="text-xs text-slate-600 mt-1 mb-3">
            Tüm fen kartlarını <span className="font-bold text-violet-700">{moves} hamlede</span> ve <span className="font-bold text-violet-700">{seconds} saniyede</span> tamamladınız.
          </p>
          <button
            onClick={initGame}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all"
          >
            Yeniden Oyna
          </button>
        </div>
      )}
    </div>
  );
};
