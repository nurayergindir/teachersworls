import React, { useState } from 'react';
import { X, Plus, ExternalLink, Trash2, Copy, Check, FileText, FileSpreadsheet, Globe, FolderPlus } from 'lucide-react';
import { CategoryInfo, ResourceLinkItem } from '../../types';

interface CategoryDetailsModalProps {
  category: CategoryInfo | null;
  items: ResourceLinkItem[];
  isOpen: boolean;
  onClose: () => void;
  onAddNew: (categoryId: string) => void;
  onDeleteItem: (id: string) => void;
}

export const CategoryDetailsModal: React.FC<CategoryDetailsModalProps> = ({
  category,
  items,
  isOpen,
  onClose,
  onAddNew,
  onDeleteItem,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen || !category) return null;

  const handleCopyLink = (item: ResourceLinkItem) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const getFormatIcon = (format: ResourceLinkItem['fileType']) => {
    switch (format) {
      case 'sheet':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-600" />;
      case 'doc':
      case 'pdf':
        return <FileText className="w-5 h-5 text-rose-600" />;
      case 'drive':
        return <FolderPlus className="w-5 h-5 text-amber-600" />;
      default:
        return <Globe className="w-5 h-5 text-sky-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className={`p-6 bg-gradient-to-r ${category.gradient} text-white flex items-center justify-between`}>
          <div>
            <div className="text-xs uppercase tracking-wider font-extrabold text-white/80 mb-1">
              Öğretmen Alanı Kategori Detayı
            </div>
            <h2 className="text-2xl font-bold font-display">{category.name}</h2>
            <p className="text-xs text-white/90 mt-1 max-w-lg">{category.description}</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 text-white transition-colors self-start"
            title="Kapat"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Sub toolbar */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-600">
            Toplam <span className="font-bold text-slate-900">{items.length}</span> bağlantı / materyal listeleniyor
          </div>

          <button
            onClick={() => onAddNew(category.id)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs inline-flex items-center gap-1.5 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Bağlantı / Belge Ekle</span>
          </button>
        </div>

        {/* Info banner */}
        <div className="mx-6 mt-4 p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
          <span className="text-amber-600 text-sm">💡</span>
          <div>
            <strong>Kişiselleştirme Alanı:</strong> İlerleyen zamanlarda ekleyeceğiniz tüm yeni sınav, ders planı, doküman veya web linklerini buraya ekleyebilir; dilediğiniz zaman tek tıkla doğrudan açabilirsiniz.
          </div>
        </div>

        {/* List of items */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {items.length === 0 ? (
            <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-2xl">
              <div className="w-12 h-12 mx-auto mb-3 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                <FolderPlus className="w-6 h-6" />
              </div>
              <h4 className="text-base font-semibold text-slate-800 mb-1">Henüz bağlantı eklenmemiş</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                Bu kategori için Google Drive klasörü, MEB kazanım testleri veya kendi özel ders dosyalarınızı eklemeye hemen başlayabilirsiniz.
              </p>
              <button
                onClick={() => onAddNew(category.id)}
                className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 transition-colors inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>İlk Bağlantını Ekle</span>
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2.5 bg-slate-100 rounded-xl shrink-0 mt-0.5">
                    {getFormatIcon(item.fileType)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-slate-900 font-display">
                        {item.title}
                      </h4>
                      {item.tag && (
                        <span className="text-[11px] text-slate-500">· {item.tag}</span>
                      )}
                      {item.gradeLevel && (
                        <span className="text-[11px] text-slate-500">· {item.gradeLevel}</span>
                      )}
                      {item.isCustom && (
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                          Özel Eklenen
                        </span>
                      )}
                    </div>

                    {item.description && (
                      <p className="text-xs text-slate-600 line-clamp-2">
                        {item.description}
                      </p>
                    )}

                    <div className="text-[11px] text-slate-400 font-mono truncate max-w-md">
                      {item.url}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => handleCopyLink(item)}
                    className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Bağlantıyı Kopyala"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>Aç</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  {item.isCustom && (
                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
