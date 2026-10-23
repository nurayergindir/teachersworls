import React, { useState } from 'react';
import { Bot, Play, RotateCcw, ArrowUp, ArrowRight, ArrowLeft, Trash2, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

type Direction = 'UP' | 'RIGHT' | 'DOWN' | 'LEFT';
type Command = 'FORWARD' | 'TURN_RIGHT' | 'TURN_LEFT';

interface LevelConfig {
  id: number;
  name: string;
  gridSize: number;
  start: { r: number; c: number; dir: Direction };
  goal: { r: number; c: number };
  obstacles: { r: number; c: number }[];
  maxCommands: number;
}

const LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: 'Seviye 1: Düz Yol & İlk Komutlar',
    gridSize: 5,
    start: { r: 4, c: 2, dir: 'UP' },
    goal: { r: 1, c: 2 },
    obstacles: [{ r: 3, c: 1 }, { r: 3, c: 3 }],
    maxCommands: 6,
  },
  {
    id: 2,
    name: 'Seviye 2: Dönüşler ve Engeller',
    gridSize: 5,
    start: { r: 4, c: 0, dir: 'UP' },
    goal: { r: 1, c: 4 },
    obstacles: [{ r: 3, c: 0 }, { r: 2, c: 1 }, { r: 2, c: 2 }, { r: 3, c: 3 }],
    maxCommands: 8,
  },
  {
    id: 3,
    name: 'Seviye 3: Labirent Çözümü',
    gridSize: 5,
    start: { r: 4, c: 4, dir: 'LEFT' },
    goal: { r: 0, c: 0 },
    obstacles: [{ r: 4, c: 2 }, { r: 3, c: 2 }, { r: 2, c: 2 }, { r: 1, c: 2 }, { r: 2, c: 4 }, { r: 1, c: 0 }],
    maxCommands: 12,
  },
];

export const CodingLogicGame: React.FC = () => {
  const [levelIdx, setLevelIdx] = useState(0);
  const currentLevel = LEVELS[levelIdx];

  const [commands, setCommands] = useState<Command[]>([]);
  const [robotPos, setRobotPos] = useState<{ r: number; c: number; dir: Direction }>(currentLevel.start);
  const [isRunning, setIsRunning] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [gameStatus, setGameStatus] = useState<'idle' | 'success' | 'failed'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const resetToStart = (idx = levelIdx) => {
    setRobotPos(LEVELS[idx].start);
    setCommands([]);
    setIsRunning(false);
    setActiveStep(null);
    setGameStatus('idle');
    setStatusMessage('');
  };

  const handleLevelChange = (newIdx: number) => {
    setLevelIdx(newIdx);
    resetToStart(newIdx);
  };

  const addCommand = (cmd: Command) => {
    if (isRunning || commands.length >= currentLevel.maxCommands) return;
    setCommands([...commands, cmd]);
  };

  const removeCommand = (idx: number) => {
    if (isRunning) return;
    setCommands(commands.filter((_, i) => i !== idx));
  };

  const clearCommands = () => {
    if (isRunning) return;
    setCommands([]);
    setRobotPos(currentLevel.start);
    setGameStatus('idle');
    setStatusMessage('');
  };

  const runProgram = async () => {
    if (commands.length === 0 || isRunning) return;

    setIsRunning(true);
    setGameStatus('idle');
    setStatusMessage('Robot adımları uyguluyor...');

    let curR = currentLevel.start.r;
    let curC = currentLevel.start.c;
    let curDir = currentLevel.start.dir;

    setRobotPos({ r: curR, c: curC, dir: curDir });

    const directions: Direction[] = ['UP', 'RIGHT', 'DOWN', 'LEFT'];

    for (let i = 0; i < commands.length; i++) {
      setActiveStep(i);
      const cmd = commands[i];

      await new Promise((resolve) => setTimeout(resolve, 550));

      if (cmd === 'TURN_LEFT') {
        const curIdx = directions.indexOf(curDir);
        curDir = directions[(curIdx + 3) % 4];
      } else if (cmd === 'TURN_RIGHT') {
        const curIdx = directions.indexOf(curDir);
        curDir = directions[(curIdx + 1) % 4];
      } else if (cmd === 'FORWARD') {
        if (curDir === 'UP') curR -= 1;
        else if (curDir === 'DOWN') curR += 1;
        else if (curDir === 'LEFT') curC -= 1;
        else if (curDir === 'RIGHT') curC += 1;
      }

      setRobotPos({ r: curR, c: curC, dir: curDir });

      // Check bounds
      if (curR < 0 || curR >= currentLevel.gridSize || curC < 0 || curC >= currentLevel.gridSize) {
        setIsRunning(false);
        setActiveStep(null);
        setGameStatus('failed');
        setStatusMessage('Robot harita sınırlarının dışına çıktı! Algoritmayı düzenleyin.');
        return;
      }

      // Check obstacles
      const hitObstacle = currentLevel.obstacles.some((o) => o.r === curR && o.c === curC);
      if (hitObstacle) {
        setIsRunning(false);
        setActiveStep(null);
        setGameStatus('failed');
        setStatusMessage('Robot engele çarptı! Komut sırasını gözden geçirin.');
        return;
      }
    }

    setIsRunning(false);
    setActiveStep(null);

    // Check Goal
    if (curR === currentLevel.goal.r && curC === currentLevel.goal.c) {
      setGameStatus('success');
      setStatusMessage('Tebrikler! Robot başarıyla hedefe ulaştı.');
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    } else {
      setGameStatus('failed');
      setStatusMessage('Robot hedefe ulaşamadı. Eksik veya fazla komut olabilir.');
    }
  };

  const getDirArrow = (dir: Direction) => {
    if (dir === 'UP') return '▲';
    if (dir === 'RIGHT') return '▶';
    if (dir === 'DOWN') return '▼';
    return '◀';
  };

  return (
    <div className="p-6 bg-gradient-to-br from-emerald-50/80 to-teal-50/90 rounded-2xl border border-emerald-200/80 max-w-xl mx-auto shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-emerald-200">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-emerald-600 text-white rounded-xl shadow-sm">
            <Bot className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-lg font-bold text-emerald-950 font-display">Algoritma Robotu</h3>
            <p className="text-xs text-emerald-800/80">Komutları sırala, sevimli robotu hedefe ulaştır!</p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-emerald-100/80 p-1 rounded-xl border border-emerald-300">
          {LEVELS.map((lvl, idx) => (
            <button
              key={lvl.id}
              disabled={isRunning}
              onClick={() => handleLevelChange(idx)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                levelIdx === idx
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-emerald-900 hover:bg-emerald-200/60'
              }`}
            >
              Seviye {lvl.id}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* 5x5 Maze Grid */}
        <div className="bg-white p-3 rounded-2xl border border-emerald-200 shadow-xs flex flex-col items-center">
          <div className="grid grid-cols-5 gap-1.5 w-full max-w-[240px] aspect-square">
            {Array.from({ length: 25 }).map((_, i) => {
              const r = Math.floor(i / 5);
              const c = i % 5;
              const isRobot = robotPos.r === r && robotPos.c === c;
              const isGoal = currentLevel.goal.r === r && currentLevel.goal.c === c;
              const isObstacle = currentLevel.obstacles.some((o) => o.r === r && o.c === c);

              return (
                <div
                  key={i}
                  className={`rounded-lg flex flex-col items-center justify-center text-xs relative transition-all duration-200 ${
                    isRobot
                      ? 'bg-emerald-500 text-white ring-2 ring-emerald-300 font-bold scale-95 shadow-sm'
                      : isGoal
                      ? 'bg-amber-100 border-2 border-amber-400 text-amber-700 font-bold'
                      : isObstacle
                      ? 'bg-slate-200 border border-slate-300 text-slate-600'
                      : 'bg-emerald-50/50 border border-emerald-100/80'
                  }`}
                >
                  {isRobot ? (
                    <div className="flex flex-col items-center">
                      <span className="text-base leading-none">🤖</span>
                      <span className="text-[9px] mt-0.5 leading-none">{getDirArrow(robotPos.dir)}</span>
                    </div>
                  ) : isGoal ? (
                    <span className="text-base animate-pulse">⭐</span>
                  ) : isObstacle ? (
                    <span className="text-sm">🧱</span>
                  ) : null}
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-3">
            <span className="flex items-center gap-1">🤖 Robot</span>
            <span className="flex items-center gap-1">⭐ Hedef</span>
            <span className="flex items-center gap-1">🧱 Engel</span>
          </div>
        </div>

        {/* Command builder */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="text-xs font-semibold text-emerald-900 mb-2 flex items-center justify-between">
              <span>Algoritma Komutları:</span>
              <span className="text-slate-500 tabular-nums">
                {commands.length} / {currentLevel.maxCommands}
              </span>
            </div>

            {/* Command sequence cards */}
            <div className="min-h-[110px] max-h-[130px] overflow-y-auto p-2 bg-white/90 rounded-xl border border-emerald-200 space-y-1">
              {commands.length === 0 && (
                <div className="text-xs text-slate-400 italic text-center py-6">
                  Aşağıdaki butonlara basarak algoritmanızı oluşturun.
                </div>
              )}
              <div className="flex flex-wrap gap-1.5">
                {commands.map((cmd, idx) => (
                  <div
                    key={idx}
                    className={`px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1 shadow-xs transition-all ${
                      activeStep === idx
                        ? 'bg-emerald-600 text-white ring-2 ring-emerald-300'
                        : 'bg-emerald-100/80 text-emerald-950 border border-emerald-200'
                    }`}
                  >
                    <span>{idx + 1}.</span>
                    {cmd === 'FORWARD' && 'İleri ⬆️'}
                    {cmd === 'TURN_LEFT' && 'Sola Dön ⬅️'}
                    {cmd === 'TURN_RIGHT' && 'Sağa Dön ➡️'}
                    {!isRunning && (
                      <button
                        onClick={() => removeCommand(idx)}
                        className="text-emerald-700 hover:text-rose-600 ml-0.5"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Command buttons */}
            <div className="grid grid-cols-3 gap-1.5 mt-2.5">
              <button
                disabled={isRunning || commands.length >= currentLevel.maxCommands}
                onClick={() => addCommand('FORWARD')}
                className="py-2 px-1 text-xs font-semibold bg-white text-emerald-900 border border-emerald-300 rounded-lg hover:bg-emerald-100 flex flex-col items-center justify-center gap-0.5 shadow-2xs active:scale-95 disabled:opacity-50"
              >
                <ArrowUp className="w-3.5 h-3.5 text-emerald-700" />
                <span>İleri</span>
              </button>
              <button
                disabled={isRunning || commands.length >= currentLevel.maxCommands}
                onClick={() => addCommand('TURN_LEFT')}
                className="py-2 px-1 text-xs font-semibold bg-white text-emerald-900 border border-emerald-300 rounded-lg hover:bg-emerald-100 flex flex-col items-center justify-center gap-0.5 shadow-2xs active:scale-95 disabled:opacity-50"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-emerald-700" />
                <span>Sola Dön</span>
              </button>
              <button
                disabled={isRunning || commands.length >= currentLevel.maxCommands}
                onClick={() => addCommand('TURN_RIGHT')}
                className="py-2 px-1 text-xs font-semibold bg-white text-emerald-900 border border-emerald-300 rounded-lg hover:bg-emerald-100 flex flex-col items-center justify-center gap-0.5 shadow-2xs active:scale-95 disabled:opacity-50"
              >
                <ArrowRight className="w-3.5 h-3.5 text-emerald-700" />
                <span>Sağa Dön</span>
              </button>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2 mt-3 pt-2 border-t border-emerald-200">
            <button
              disabled={isRunning || commands.length === 0}
              onClick={runProgram}
              className="flex-1 py-2 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl text-xs shadow-sm hover:from-emerald-700 hover:to-teal-700 transition-all active:scale-95 flex items-center justify-center gap-1.5 disabled:opacity-60"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{isRunning ? 'Çalışıyor...' : 'Kodu Çalıştır'}</span>
            </button>

            <button
              disabled={isRunning}
              onClick={clearCommands}
              className="p-2 text-emerald-800 bg-white border border-emerald-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 rounded-xl transition-colors"
              title="Komutları Temizle"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              disabled={isRunning}
              onClick={() => resetToStart()}
              className="p-2 text-emerald-800 bg-white border border-emerald-200 hover:bg-emerald-100 rounded-xl transition-colors"
              title="Başa Dön"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`mt-3 p-2.5 rounded-xl text-xs font-medium flex items-center gap-2 ${
            gameStatus === 'success'
              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              : gameStatus === 'failed'
              ? 'bg-rose-100 text-rose-900 border border-rose-300'
              : 'bg-white text-slate-700 border border-emerald-200'
          }`}
        >
          {gameStatus === 'success' && <Award className="w-4 h-4 text-emerald-600 shrink-0" />}
          <span>{statusMessage}</span>
          {gameStatus === 'success' && levelIdx < LEVELS.length - 1 && (
            <button
              onClick={() => handleLevelChange(levelIdx + 1)}
              className="ml-auto underline font-bold text-emerald-800 hover:text-emerald-950"
            >
              Sonraki Seviye →
            </button>
          )}
        </div>
      )}
    </div>
  );
};
