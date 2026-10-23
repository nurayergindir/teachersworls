import React, { useState, useEffect } from 'react';
import { Clock, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, CheckCircle2, X } from 'lucide-react';
import { CalendarNote } from '../../types';

export const LiveClockCalendar: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [newNoteText, setNewNoteText] = useState('');
  const [newNoteType, setNewNoteType] = useState<CalendarNote['type']>('ders' as unknown as CalendarNote['type']);

  const [notes, setNotes] = useState<CalendarNote[]>(() => {
    const saved = localStorage.getItem('ogretmen_calendar_notes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    const todayStr = new Date().toISOString().split('T')[0];
    return [
      { id: '1', dateStr: todayStr, title: 'Zümre Toplantısı & 1. Yazılı Hazırlıkları', type: 'toplanti', time: '14:30' },
      { id: '2', dateStr: todayStr, title: 'Akıllı Tahtada Matematik Çarkı Etkinliği', type: 'etkinlik', time: '10:00' },
    ];
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const saveNotes = (updated: CalendarNote[]) => {
    setNotes(updated);
    localStorage.setItem('ogretmen_calendar_notes', JSON.stringify(updated));
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const newNote: CalendarNote = {
      id: Date.now().toString(),
      dateStr: selectedDateStr,
      title: newNoteText.trim(),
      type: newNoteType,
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    };

    saveNotes([...notes, newNote]);
    setNewNoteText('');
  };

  const handleDeleteNote = (id: string) => {
    saveNotes(notes.filter((n) => n.id !== id));
  };

  // Date formatting in Turkish
  const timeFormatted = currentTime.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const dateFormatted = currentTime.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long',
  });

  // Greeting
  const hour = currentTime.getHours();
  let greeting = 'İyi Günler';
  if (hour >= 6 && hour < 12) greeting = 'Günaydın';
  else if (hour >= 12 && hour < 18) greeting = 'İyi Günler';
  else if (hour >= 18 && hour < 22) greeting = 'İyi Akşamlar';
  else greeting = 'Hayırlı Geceler';

  // Calendar calculations
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();
  const monthName = currentMonthDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });

  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  const selectedNotes = notes.filter((n) => n.dateStr === selectedDateStr);

  return (
    <>
      {/* Top Right Widget Box */}
      <div
        onClick={() => setShowCalendarModal(true)}
        className="cursor-pointer group flex items-center gap-3 bg-white/90 hover:bg-white border border-slate-200/90 hover:border-indigo-300 p-2 sm:px-3.5 sm:py-2 rounded-2xl shadow-xs hover:shadow-md transition-all active:scale-98"
        title="Takvimi ve Ajandayı Aç"
      >
        <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 text-white shadow-xs group-hover:scale-105 transition-transform">
          <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>

        <div className="flex flex-col text-right sm:text-left">
          <div className="flex items-center gap-1.5 justify-end sm:justify-start">
            <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded-md">
              {greeting}
            </span>
            <span className="font-mono text-xs sm:text-sm font-bold text-slate-900 tabular-nums">
              {timeFormatted}
            </span>
          </div>

          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <CalendarIcon className="w-3 h-3 text-slate-400" />
            <span className="truncate max-w-[150px] sm:max-w-none">{dateFormatted}</span>
          </div>
        </div>
      </div>

      {/* Calendar & Agenda Interactive Modal */}
      {showCalendarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-indigo-600 to-sky-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white/20 rounded-xl">
                  <CalendarIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-display">Öğretmen Takvimi & Günlük Ajanda</h3>
                  <p className="text-xs text-white/80">{dateFormatted} · Saat: {timeFormatted}</p>
                </div>
              </div>
              <button
                onClick={() => setShowCalendarModal(false)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Calendar Controls */}
            <div className="p-5 overflow-y-auto max-h-[80vh]">
              <div className="flex items-center justify-between mb-3 px-1">
                <h4 className="text-sm font-bold text-slate-900 capitalize font-display">
                  {monthName}
                </h4>
                <div className="flex items-center gap-1">
                  <button
                    onClick={prevMonth}
                    className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextMonth}
                    className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-500 mb-1">
                <span>Pzt</span>
                <span>Sal</span>
                <span>Çar</span>
                <span>Per</span>
                <span>Cum</span>
                <span className="text-rose-500">Cmt</span>
                <span className="text-rose-500">Paz</span>
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-1 mb-5">
                {Array.from({ length: firstDayIndex }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-9" />
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const monthStr = String(month + 1).padStart(2, '0');
                  const dayStr = String(dayNum).padStart(2, '0');
                  const thisDateStr = `${year}-${monthStr}-${dayStr}`;

                  const isSelected = selectedDateStr === thisDateStr;
                  const isToday =
                    currentTime.getFullYear() === year &&
                    currentTime.getMonth() === month &&
                    currentTime.getDate() === dayNum;

                  const hasNotes = notes.some((n) => n.dateStr === thisDateStr);

                  return (
                    <button
                      key={dayNum}
                      onClick={() => setSelectedDateStr(thisDateStr)}
                      className={`h-9 rounded-xl text-xs font-semibold relative transition-all flex items-center justify-center ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-xs font-bold'
                          : isToday
                          ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200'
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span>{dayNum}</span>
                      {hasNotes && (
                        <span
                          className={`absolute bottom-1 w-1 h-1 rounded-full ${
                            isSelected ? 'bg-white' : 'bg-indigo-600'
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Selected Day Agenda */}
              <div className="border-t border-slate-200 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    {selectedDateStr} Tarihindeki Notlar & Görevler
                  </h5>
                  <span className="text-xs text-slate-500 font-medium">
                    {selectedNotes.length} Kayıt
                  </span>
                </div>

                {/* Notes List */}
                <div className="space-y-2 mb-4">
                  {selectedNotes.length === 0 ? (
                    <div className="text-xs text-slate-400 italic py-2">
                      Bu tarih için henüz plan veya not eklenmedi.
                    </div>
                  ) : (
                    selectedNotes.map((note) => (
                      <div
                        key={note.id}
                        className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-2 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="font-semibold text-slate-800">{note.title}</span>
                          {note.time && (
                            <span className="text-[11px] text-slate-400 font-mono">({note.time})</span>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          className="text-slate-400 hover:text-rose-600 transition-colors"
                          title="Sil"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Note Form */}
                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Bu gün için ders notu, sınav tarihi veya hatırlatıcı yazın..."
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all inline-flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ekle</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
