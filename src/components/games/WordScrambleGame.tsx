import React, { useState } from 'react';
import { Sparkles, HelpCircle, RotateCcw, Check, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WordPuzzle {
  word: string;
  clue: string;
  category: string;
}

const WORDS_DATABASE: WordPuzzle[] = [
  {
    word: 'ÖĞRETMEN',
    clue: 'Bilgi kıvılcımını tutuşturan, geleceği ilmek ilmek dokuyan rehber.',
    category: 'Eğitim & Meslek',
  },
  {
    word: 'BİLİM',
    clue: 'Evreni ve olayları deney, gözlem ve akıl süzgecinden geçirerek anlama çabası.',
    category: 'Fen & Düşünce',
  },
  {
    word: 'KİTAPLIK',
    clue: 'Sayfalarında binlerce yıllık insanlık hafızasını barındıran sessiz hazine.',
    category: 'Kültür & Edebiyat',
  },
  {
    word: 'GEZEGEN',
    clue: 'Güneş gibi bir yıldızın etrafında belirli bir yörüngede dönen gök cismi.',
    category: 'Astronomi & Doğa',
  },
  {
    word: 'TEKNOLOJİ',
    clue: 'İnsanın bilimi kullanarak hayatını kolaylaştıran araç ve yöntemler bütünü.',
    category: 'Bilişim & İnovasyon',
  },
  {
    word: 'MERAK',
    clue: 'Öğrenmenin, keşfetmenin ve tüm büyük buluşların ilk kıvılcımı olan duygu.',
    category: 'Psikoloji & Zihin',
  },
  {
    word: 'MÜFREDAT',
    clue: 'Bir öğretim döneminde işlenecek konuların ve kazanımların bütünü.',
    category: 'Pedagoji',
  },
  {
    word: 'CUMHURİYET',
    clue: 'Milletin egemenliği kendi elinde tuttuğu çağdaş yönetim biçimi.',
    category: 'Tarih & Değerler',
  },
];

export const WordScrambleGame: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentPuzzle = WORDS_DATABASE[currentIndex];

  const scramble = (str: string) => {
    const arr = str.split('');
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    // ensure it's not identical to original
    if (arr.join('') === str && str.length > 2) {
      return scramble(str);
    }
    return arr;
  };

  const [availableLetters, setAvailableLetters] = useState<{ id: number; char: string; used: boolean }[]>(() => {
    return scramble(currentPuzzle.word).map((char, id) => ({ id, char, used: false }));
  });

  const [selectedLetters, setSelectedLetters] = useState<{ id: number; char: string }[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);

  const resetCurrentPuzzle = (idx: number) => {
    const p = WORDS_DATABASE[idx];
    const letters = scramble(p.word).map((char, id) => ({ id, char, used: false }));
    setAvailableLetters(letters);
    setSelectedLetters([]);
    setIsCorrect(false);
    setShowHint(false);
  };

  const handlePickLetter = (item: { id: number; char: string; used: boolean }) => {
    if (item.used || isCorrect) return;

    const newSelected = [...selectedLetters, { id: item.id, char: item.char }];
    setSelectedLetters(newSelected);

    setAvailableLetters((prev) =>
      prev.map((letter) => (letter.id === item.id ? { ...letter, used: true } : letter))
    );

    // Check if word is complete
    const formedWord = newSelected.map((l) => l.char).join('');
    if (formedWord === currentPuzzle.word) {
      setIsCorrect(true);
      setScore((s) => s + 25);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    }
  };

  const handleRemoveLetter = (indexToRemove: number) => {
    if (isCorrect) return;
    const removed = selectedLetters[indexToRemove];
    const newSelected = selectedLetters.filter((_, idx) => idx !== indexToRemove);
    setSelectedLetters(newSelected);

    setAvailableLetters((prev) =>
      prev.map((letter) => (letter.id === removed.id ? { ...letter, used: false } : letter))
    );
  };

  const handleNextWord = () => {
    const nextIdx = (currentIndex + 1) % WORDS_DATABASE.length;
    setCurrentIndex(nextIdx);
    resetCurrentPuzzle(nextIdx);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-rose-50/80 to-pink-50/90 rounded-2xl border border-rose-200/80 max-w-xl mx-auto shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-rose-200">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-rose-500 text-white rounded-xl shadow-sm">
            <Sparkles className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-lg font-bold text-rose-950 font-display">Kelime Avcısı & Türkçe Anagram</h3>
            <p className="text-xs text-rose-800/80">Karışık harflerden gizli Türkçe sözcüğü keşfet!</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-rose-900 bg-rose-100 px-3 py-1.5 rounded-lg border border-rose-300">
          <span>Kelime: <span className="tabular-nums font-bold">{currentIndex + 1} / {WORDS_DATABASE.length}</span></span>
          <span className="text-rose-300">|</span>
          <span>Puan: <span className="tabular-nums font-bold">{score}</span></span>
        </div>
      </div>

      {/* Clue Box */}
      <div className="my-5 p-4 bg-white/90 rounded-xl border border-rose-200 shadow-xs">
        <div className="flex items-center justify-between text-xs text-rose-700 font-semibold mb-1">
          <span>Kategori: {currentPuzzle.category}</span>
          <button
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-1 text-rose-600 hover:text-rose-800 underline transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            {showHint ? 'İpucunu Gizle' : 'İlk Harfi Göster'}
          </button>
        </div>
        <p className="text-sm font-medium text-slate-700 italic">
          "{currentPuzzle.clue}"
        </p>
        {showHint && (
          <div className="mt-2 text-xs text-rose-700 font-bold bg-rose-50 p-2 rounded-lg border border-rose-200">
            💡 İpucu: Kelime "{currentPuzzle.word.charAt(0)}" harfiyle başlıyor ve toplam {currentPuzzle.word.length} harften oluşuyor.
          </div>
        )}
      </div>

      {/* Answer Slots */}
      <div className="my-6">
        <div className="text-xs text-center text-rose-900/70 font-semibold uppercase tracking-wider mb-2">
          Oluşturulan Sözcük (Çıkarmak için harfe tıklayın)
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 min-h-[58px] p-2 bg-white/80 rounded-2xl border-2 border-dashed border-rose-300">
          {selectedLetters.length === 0 && (
            <span className="text-sm text-rose-400 italic">Aşağıdaki harflere sırayla tıklayarak kelimeyi oluşturun</span>
          )}
          {selectedLetters.map((item, idx) => (
            <button
              key={`${item.id}-${idx}`}
              onClick={() => handleRemoveLetter(idx)}
              className="w-11 h-12 rounded-xl bg-gradient-to-b from-rose-500 to-rose-600 text-white font-extrabold text-xl shadow-sm hover:bg-rose-700 transition-all transform active:scale-90 flex items-center justify-center font-display"
            >
              {item.char}
            </button>
          ))}
        </div>
      </div>

      {/* Scrambled Available Letters */}
      <div className="my-4">
        <div className="text-xs text-center text-slate-500 font-semibold mb-2">
          Kullanılabilir Harfler:
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {availableLetters.map((item) => (
            <button
              key={item.id}
              disabled={item.used || isCorrect}
              onClick={() => handlePickLetter(item)}
              className={`w-11 h-12 rounded-xl text-xl font-bold transition-all shadow-xs flex items-center justify-center font-display ${
                item.used
                  ? 'bg-rose-100/50 text-rose-300 border border-transparent cursor-not-allowed scale-95'
                  : 'bg-white text-slate-800 border-2 border-rose-200 hover:border-rose-400 hover:bg-rose-50 active:scale-95'
              }`}
            >
              {item.char}
            </button>
          ))}
        </div>
      </div>

      {/* Action / Success Banner */}
      {isCorrect ? (
        <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-300 text-center animate-in fade-in">
          <div className="flex items-center justify-center gap-2 text-emerald-800 font-bold text-base mb-1">
            <Check className="w-5 h-5 text-emerald-600" />
            Tebrikler! Doğru Cevap: "{currentPuzzle.word}"
          </div>
          <p className="text-xs text-emerald-700 mb-3">+25 puan kazandınız!</p>
          <button
            onClick={handleNextWord}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm shadow-sm inline-flex items-center gap-2 transition-all active:scale-95"
          >
            <span>Sıradaki Kelimeye Geç</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between mt-6 pt-3 border-t border-rose-200/80">
          <button
            onClick={() => resetCurrentPuzzle(currentIndex)}
            className="px-3 py-1.5 text-xs text-rose-700 hover:text-rose-900 flex items-center gap-1 font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Temizle
          </button>

          <button
            onClick={handleNextWord}
            className="px-4 py-1.5 text-xs bg-rose-200/70 hover:bg-rose-200 text-rose-900 rounded-lg font-semibold flex items-center gap-1 transition-colors"
          >
            <span>Kelimeyi Pas Geç</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
