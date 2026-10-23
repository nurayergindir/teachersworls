import React from 'react';
import { X, ExternalLink } from 'lucide-react';
import { EducationalGame } from '../../types';
import { MathSpeedGame } from './MathSpeedGame';
import { WordScrambleGame } from './WordScrambleGame';
import { ScienceMemoryGame } from './ScienceMemoryGame';
import { CodingLogicGame } from './CodingLogicGame';

interface PlayGameModalProps {
  game: EducationalGame | null;
  onClose: () => void;
}

export const PlayGameModal: React.FC<PlayGameModalProps> = ({ game, onClose }) => {
  if (!game) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className={`p-4 text-white bg-gradient-to-r ${game.gradientBg} flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase font-extrabold tracking-wider bg-white/20 px-2.5 py-1 rounded-lg backdrop-blur-xs">
              {game.categoryLabel}
            </span>
            <h2 className="text-lg font-bold font-display truncate max-w-md">
              {game.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
            title="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto">
          {game.playableType === 'math-quiz' && <MathSpeedGame onClose={onClose} />}
          {game.playableType === 'word-scramble' && <WordScrambleGame />}
          {game.playableType === 'memory-match' && <ScienceMemoryGame />}
          {game.playableType === 'pattern-logic' && <CodingLogicGame />}
          {game.playableType === 'external-link' && (
            <div className="text-center py-10 px-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-sky-100 rounded-full flex items-center justify-center text-sky-600">
                <ExternalLink className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{game.title}</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
                {game.description}
              </p>
              <a
                href={game.externalUrl || '#'}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-md transition-all"
              >
                <span>Dış Bağlantıyı Aç</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
