import React, { useState } from 'react';
import { X, Sparkles, Plus } from 'lucide-react';
import { EducationalQuote } from '../../types';

interface AddQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (quote: Omit<EducationalQuote, 'id'>) => void;
}

export const AddQuoteModal: React.FC<AddQuoteModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [role, setRole] = useState('');
  const [category, setCategory] = useState<EducationalQuote['category']>('pedagoji');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quote.trim() || !author.trim()) return;

    const categoryLabels: Record<EducationalQuote['category'], string> = {
      cumhuriyet: 'Cumhuriyet & Vizyon',
      pedagoji: 'Pedagoji & Metot',
      bilim: 'Bilim & Keşif',
      felsefe: 'Felsefe & Hikmet',
    };

    onSave({
      quote: quote.trim(),
      author: author.trim(),
      role: role.trim() || 'Eğitimci / Düşünür',
      category,
      categoryLabel: categoryLabels[category],
      isCustom: true,
    });

    setQuote('');
    setAuthor('');
    setRole('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-violet-700 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/20 rounded-xl">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-display">İlham Veren Söz Ekle</h3>
              <p className="text-xs text-white/80">Eğitim hafızanıza yeni bir düşünce kaydedin</p>
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
              Özlü Söz / Düşünce *
            </label>
            <textarea
              required
              rows={3}
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="Örn: Bir milletin büyüklüğü, öğretmenlerine verdiği değerle ölçülür..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 focus:outline-hidden resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Sözün Sahibi (Yazar / Düşünür) *
            </label>
            <input
              type="text"
              required
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Örn: Lev Vygotsky, Maria Montessori vb."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Unvan / Alanı (İsteğe Bağlı)
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Örn: Eğitim Felsefecisi veya Sınıf Öğretmeni"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Kategori
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as EducationalQuote['category'])}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
            >
              <option value="pedagoji">Pedagoji & Metot</option>
              <option value="cumhuriyet">Cumhuriyet & Vizyon</option>
              <option value="bilim">Bilim & Keşif</option>
              <option value="felsefe">Felsefe & Hikmet</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl shadow-sm inline-flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Sözü Kaydet</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
