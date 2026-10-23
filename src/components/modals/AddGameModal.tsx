import React, { useState } from 'react';
import { X, Gamepad2, Plus } from 'lucide-react';
import { EducationalGame } from '../../types';

interface AddGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (game: Omit<EducationalGame, 'id'>) => void;
}

export const AddGameModal: React.FC<AddGameModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<EducationalGame['category']>('matematik');
  const [externalUrl, setExternalUrl] = useState('');
  const [targetGrade, setTargetGrade] = useState('1 - 8. Sınıf');
  const [estimatedMinutes, setEstimatedMinutes] = useState('5-10 dk');
  const [description, setDescription] = useState('');
  const [keyConceptsStr, setKeyConceptsStr] = useState('Eğlence, Dikkat, Kazanım');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const categoryLabels: Record<EducationalGame['category'], string> = {
      matematik: 'Matematik',
      fen: 'Fen Bilimleri',
      turkce: 'Türkçe & Dil',
      zeka: 'Zeka & Mantık',
      kodlama: 'Kodlama & Robotik',
      sosyal: 'Sosyal & Tarih',
    };

    const gradientMaps: Record<EducationalGame['category'], string> = {
      matematik: 'from-amber-500 to-orange-600',
      fen: 'from-violet-600 to-indigo-700',
      turkce: 'from-rose-500 to-pink-600',
      zeka: 'from-sky-500 to-blue-600',
      kodlama: 'from-emerald-500 to-teal-600',
      sosyal: 'from-amber-600 to-yellow-600',
    };

    let formattedUrl = externalUrl.trim();
    if (formattedUrl && !formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    onSave({
      title: title.trim(),
      subtitle: subtitle.trim() || 'Eğlenceli ders etkinliği ve interaktif oyun',
      category,
      categoryLabel: categoryLabels[category],
      targetGrade,
      estimatedMinutes,
      players: 'Sınıf / Bireysel',
      description: description.trim() || 'Bu eğitsel oyun öğrencilerin derse katılımını ve motivasyonunu artırmak için tasarlanmıştır.',
      keyConcepts: keyConceptsStr.split(',').map((s) => s.trim()).filter(Boolean),
      image: '/src/assets/images/math_game_card_1792774726102.jpg',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      gradientBg: gradientMaps[category],
      playableType: 'external-link',
      externalUrl: formattedUrl || 'https://wordwall.net',
      isCustom: true,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/20 rounded-xl">
              <Gamepad2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-display">Yeni Eğitsel Oyun Ekle</h3>
              <p className="text-xs text-white/80">Kahoot, Wordwall, PHET veya özel oyun bağlantısı</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Oyun Başlığı *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Örn: 6. Sınıf Fen Sindirim Sistemi Çarkı"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EducationalGame['category'])}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
              >
                <option value="matematik">Matematik</option>
                <option value="fen">Fen Bilimleri</option>
                <option value="turkce">Türkçe & Dil</option>
                <option value="kodlama">Kodlama & Mantık</option>
                <option value="zeka">Zeka & Hafıza</option>
                <option value="sosyal">Sosyal Bilgiler</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Hedef Kademe
              </label>
              <input
                type="text"
                value={targetGrade}
                onChange={(e) => setTargetGrade(e.target.value)}
                placeholder="Örn: 4 - 8. Sınıf"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Oyun Bağlantısı (URL)
            </label>
            <input
              type="text"
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              placeholder="wordwall.net/... veya kahoot.it/..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Kazanımlar / Anahtar Kelimeler (Virgülle ayırın)
            </label>
            <input
              type="text"
              value={keyConceptsStr}
              onChange={(e) => setKeyConceptsStr(e.target.value)}
              placeholder="Örn: Geometri, Açı Ölçümü, Hızlı Düşünme"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Oyun Açıklaması
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Örn: Akıllı tahtada gruplar halinde oynatılabilen eğlenceli yarışma..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:outline-hidden resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl transition-colors"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm inline-flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Oyunu Listeye Ekle</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
