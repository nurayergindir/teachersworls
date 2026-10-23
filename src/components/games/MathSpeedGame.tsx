import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RotateCcw, Award, Zap, CheckCircle2, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MathSpeedGameProps {
  onClose?: () => void;
}

export const MathSpeedGame: React.FC<MathSpeedGameProps> = () => {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [num1, setNum1] = useState(5);
  const [num2, setNum2] = useState(3);
  const [operator, setOperator] = useState<'+' | '-' | '×'>('+');
  const [correctAnswer, setCorrectAnswer] = useState(8);
  const [options, setOptions] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [isPlaying, setIsPlaying] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('ogretmen_math_highscore') || '0', 10);
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const generateQuestion = useCallback((diff: 'easy' | 'medium' | 'hard') => {
    let n1 = 0;
    let n2 = 0;
    let op: '+' | '-' | '×' = '+';
    let ans = 0;

    if (diff === 'easy') {
      op = Math.random() > 0.4 ? '+' : '-';
      n1 = Math.floor(Math.random() * 15) + 3;
      n2 = Math.floor(Math.random() * 12) + 2;
      if (op === '-' && n1 < n2) {
        [n1, n2] = [n2, n1];
      }
      ans = op === '+' ? n1 + n2 : n1 - n2;
    } else if (diff === 'medium') {
      const ops: Array<'+' | '-' | '×'> = ['+', '-', '×'];
      op = ops[Math.floor(Math.random() * ops.length)];
      if (op === '×') {
        n1 = Math.floor(Math.random() * 9) + 2;
        n2 = Math.floor(Math.random() * 9) + 2;
        ans = n1 * n2;
      } else {
        n1 = Math.floor(Math.random() * 40) + 10;
        n2 = Math.floor(Math.random() * 30) + 5;
        if (op === '-' && n1 < n2) [n1, n2] = [n2, n1];
        ans = op === '+' ? n1 + n2 : n1 - n2;
      }
    } else {
      const ops: Array<'+' | '-' | '×'> = ['+', '-', '×'];
      op = ops[Math.floor(Math.random() * ops.length)];
      if (op === '×') {
        n1 = Math.floor(Math.random() * 15) + 3;
        n2 = Math.floor(Math.random() * 12) + 3;
        ans = n1 * n2;
      } else {
        n1 = Math.floor(Math.random() * 90) + 20;
        n2 = Math.floor(Math.random() * 70) + 15;
        if (op === '-' && n1 < n2) [n1, n2] = [n2, n1];
        ans = op === '+' ? n1 + n2 : n1 - n2;
      }
    }

    setNum1(n1);
    setNum2(n2);
    setOperator(op);
    setCorrectAnswer(ans);

    // Generate 4 distinct options
    const opts = new Set<number>([ans]);
    while (opts.size < 4) {
      const offset = (Math.floor(Math.random() * 7) + 1) * (Math.random() > 0.5 ? 1 : -1);
      const fake = Math.max(0, ans + offset);
      if (fake !== ans) opts.add(fake);
    }
    setOptions(Array.from(opts).sort(() => Math.random() - 0.5));
  }, []);

  const startGame = () => {
    setScore(0);
    setStreak(0);
    setTimeLeft(45);
    setIsPlaying(true);
    setFeedback(null);
    generateQuestion(difficulty);
  };

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isPlaying && timeLeft === 0) {
      setIsPlaying(false);
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('ogretmen_math_highscore', score.toString());
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      }
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, timeLeft, score, highScore]);

  const handleSelectOption = (chosen: number) => {
    if (!isPlaying) return;

    if (chosen === correctAnswer) {
      const addedPoints = 10 + streak * 2;
      setScore((s) => s + addedPoints);
      setStreak((st) => st + 1);
      setFeedback('correct');
      setTimeout(() => {
        setFeedback(null);
        generateQuestion(difficulty);
      }, 350);
    } else {
      setStreak(0);
      setFeedback('wrong');
      setTimeout(() => {
        setFeedback(null);
        generateQuestion(difficulty);
      }, 500);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-amber-50/70 to-orange-50/80 rounded-2xl border border-amber-200/80 max-w-xl mx-auto shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-amber-200">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-amber-500 text-white rounded-xl shadow-sm">
            <Zap className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-lg font-bold text-amber-950 font-display">Matematik Çarkı & Hızlı Hesaplama</h3>
            <p className="text-xs text-amber-800/80">Zamanla yarış, zihinden işlem hızını katla!</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-amber-900 bg-amber-100/80 px-3 py-1.5 rounded-lg border border-amber-300">
          <Award className="w-4 h-4 text-amber-600" />
          <span>En Yüksek: <span className="tabular-nums font-bold">{highScore}</span></span>
        </div>
      </div>

      {/* Difficulty selector */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5 bg-amber-100/60 p-1 rounded-xl border border-amber-200 text-xs">
          {(['easy', 'medium', 'hard'] as const).map((diff) => (
            <button
              key={diff}
              disabled={isPlaying}
              onClick={() => {
                setDifficulty(diff);
                if (!isPlaying) generateQuestion(diff);
              }}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                difficulty === diff
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-amber-900 hover:bg-amber-200/50'
              }`}
            >
              {diff === 'easy' ? 'Kolay (İlkokul)' : diff === 'medium' ? 'Orta (5-6. Sınıf)' : 'Zor (7-8. Sınıf)'}
            </button>
          ))}
        </div>

        {isPlaying && (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-amber-800/80 block">Kalan Süre</span>
              <span className={`text-lg font-bold tabular-nums ${timeLeft <= 10 ? 'text-rose-600 animate-pulse' : 'text-amber-950'}`}>
                {timeLeft}s
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-amber-800/80 block">Puan</span>
              <span className="text-lg font-bold text-amber-950 tabular-nums">{score}</span>
            </div>
          </div>
        )}
      </div>

      {!isPlaying ? (
        <div className="my-8 text-center py-6 bg-white/70 rounded-xl border border-amber-200/60 backdrop-blur-xs">
          <div className="w-16 h-16 mx-auto mb-3 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
            <Zap className="w-8 h-8" />
          </div>
          <h4 className="text-xl font-bold text-slate-800 mb-1">
            {timeLeft === 0 ? 'Oyun Tamamlandı!' : 'Hazır mısın Öğretmenim?'}
          </h4>
          <p className="text-sm text-slate-600 max-w-sm mx-auto mb-5">
            {timeLeft === 0
              ? `Toplam ${score} puan topladın! Harika bir beyin jimnastiği oldu.`
              : '45 saniye boyunca karşına çıkan matematik işlemlerini en hızlı şekilde çöz ve seriyi yakala.'}
          </p>

          <button
            onClick={startGame}
            className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl shadow-md hover:from-amber-600 hover:to-orange-600 transition-all active:scale-95 inline-flex items-center gap-2"
          >
            {timeLeft === 0 ? <RotateCcw className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
            {timeLeft === 0 ? 'Yeniden Oyna' : 'Oyunu Başlat'}
          </button>
        </div>
      ) : (
        <div className="my-6">
          {/* Question Box */}
          <div className="relative py-8 px-6 bg-white rounded-2xl border-2 border-amber-300 text-center shadow-md mb-6 overflow-hidden">
            {feedback === 'correct' && (
              <div className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center backdrop-blur-xs animate-in fade-in">
                <CheckCircle2 className="w-12 h-12 text-emerald-600" />
              </div>
            )}
            {feedback === 'wrong' && (
              <div className="absolute inset-0 bg-rose-500/10 flex items-center justify-center backdrop-blur-xs animate-in fade-in">
                <XCircle className="w-12 h-12 text-rose-600" />
              </div>
            )}

            <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-2">
              {streak > 1 ? `🔥 ${streak}x Doğru Serisi!` : 'Soru'}
            </div>
            <div className="text-4xl font-extrabold text-slate-900 tracking-tight font-display">
              {num1} {operator} {num2} = ?
            </div>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-2 gap-3">
            {options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectOption(opt)}
                className="py-4 px-5 text-xl font-bold bg-white text-slate-800 rounded-xl border border-amber-200/90 hover:bg-amber-500 hover:text-white hover:border-amber-600 transition-all shadow-xs active:scale-98 tabular-nums"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="text-center pt-2 text-xs text-amber-900/60">
        💡 İpucu: Bu mini oyunu akıllı tahtada açarak öğrencilerinizle ders başında 2 dakikalık ısınma yarışması yapabilirsiniz.
      </div>
    </div>
  );
};
