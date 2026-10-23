import React, { useState } from 'react';
import { X, Plus, Link as LinkIcon } from 'lucide-react';
import { ResourceLinkItem, TeacherCategory } from '../../types';
import { TEACHER_CATEGORIES } from '../../data/mockData';

interface AddResourceModalProps {
  isOpen: boolean;
  initialCategoryId?: TeacherCategory;
  onClose: () => void;
  onSave: (newItem: Omit<ResourceLinkItem, 'id' | 'dateAdded'>) => void;
}

export const AddResourceModal: React.FC<AddResourceModalProps> = ({
  isOpen,
  initialCategoryId = 'sinavlarim',
  onClose,
  onSave,
}) => {
  const [categoryId, setCategoryId] = useState<TeacherCategory>(initialCategoryId);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [fileType, setFileType] = useState<ResourceLinkItem['fileType']>('link');
  const [tag, setTag] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    onSave({
      categoryId,
      title: title.trim(),
      url: formattedUrl,
      description: description.trim() || undefined,
      gradeLevel: gradeLevel.trim() || undefined,
      fileType,
      tag: tag.trim() || undefined,
      isCustom: true,
    });

    // Reset
    setTitle('');
    setUrl('');
    setDescription('');
    setGradeLevel('');
    setTag('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-indigo-600 to-sky-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/20 rounded-xl">
              <LinkIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-display">Yeni Bağlantı / Materyal Ekle</h3>
              <p className="text-xs text-white/80">Öğretmen alanınıza özel link ve dosya kaydedin</p>
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
              Kategori Seçin
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value as TeacherCategory)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            >
              {TEACHER_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} ({cat.shortDesc})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Başlık / İsim *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Örn: 7. Sınıf Matematik 2. Dönem 1. Yazılı Soruları"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            >
            </input>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Web Bağlantısı (URL) *
            </label>
            <input
              type="text"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="drive.google.com/... veya eba.gov.tr/..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            >
            </input>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Materyal Türü
              </label>
              <select
                value={fileType}
                onChange={(e) => setFileType(e.target.value as ResourceLinkItem['fileType'])}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              >
                <option value="link">Web Sitesi / Portalı</option>
                <option value="pdf">PDF Dosyası</option>
                <option value="doc">Word / Doküman</option>
                <option value="sheet">Excel / Tablo</option>
                <option value="drive">Google Drive Klasörü</option>
                <option value="form">Form / Quiz</option>
                <option value="game">Oyun Bağlantısı</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Sınıf / Kademe (İsteğe Bağlı)
              </label>
              <input
                type="text"
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                placeholder="Örn: 5. Sınıf / Lise 1"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              >
              </input>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Kısa Not / Açıklama (İsteğe Bağlı)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Örn: Çarşamba günkü 3. derste işlenecek etkinlik şablonu."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm inline-flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Bağlantıyı Kaydet</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
