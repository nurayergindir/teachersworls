import React from 'react';
import {
  FileCheck2,
  BookOpen,
  CalendarDays,
  FolderArchive,
  Gamepad2,
  Plus,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { CategoryInfo, ResourceLinkItem, TeacherCategory } from '../../types';
import { TEACHER_CATEGORIES } from '../../data/mockData';

interface TeacherSidebarProps {
  items: ResourceLinkItem[];
  selectedCategory: TeacherCategory | null;
  onSelectCategory: (category: CategoryInfo) => void;
  onOpenAddModal: () => void;
}

export const TeacherSidebar: React.FC<TeacherSidebarProps> = ({
  items,
  selectedCategory,
  onSelectCategory,
  onOpenAddModal,
}) => {
  const getCategoryCount = (catId: TeacherCategory) => {
    return items.filter((item) => item.categoryId === catId).length;
  };

  const getCategoryIcon = (iconName: string, className = 'w-5 h-5') => {
    switch (iconName) {
      case 'FileCheck2':
        return <FileCheck2 className={className} />;
      case 'BookOpen':
        return <BookOpen className={className} />;
      case 'CalendarDays':
        return <CalendarDays className={className} />;
      case 'FolderArchive':
        return <FolderArchive className={className} />;
      case 'Gamepad2':
        return <Gamepad2 className={className} />;
      default:
        return <BookOpen className={className} />;
    }
  };

  return (
    <aside className="w-full lg:w-72 shrink-0 flex flex-col gap-4">
      {/* Teacher Profile Box */}
      <div className="p-4 bg-gradient-to-br from-indigo-700 via-indigo-600 to-sky-600 rounded-3xl text-white shadow-md relative overflow-hidden">
        <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-center gap-3 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white border border-white/30 shadow-inner">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs uppercase font-extrabold tracking-wider text-indigo-200">
                Öğretmen Alanı
              </span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            </div>
            <h2 className="text-base font-bold font-display text-white">Öğretmen Masam</h2>
            <p className="text-[11px] text-white/80">2025 - 2026 Eğitim Yılı</p>
          </div>
        </div>
      </div>

      {/* Categories Navigation */}
      <div className="bg-white rounded-3xl p-3 border border-slate-200/80 shadow-xs flex flex-col gap-1.5">
        <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>Kategorilerim</span>
          <span className="text-[11px] font-normal text-slate-400">Tıkla & Yönet</span>
        </div>

        {TEACHER_CATEGORIES.map((cat) => {
          const count = getCategoryCount(cat.id);
          const isActive = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat)}
              className={`group w-full p-3 rounded-2xl text-left transition-all duration-200 flex items-start gap-3 relative ${
                isActive
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'hover:bg-slate-100/80 text-slate-700'
              }`}
            >
              <div
                className={`p-2.5 rounded-xl shrink-0 transition-transform group-hover:scale-105 ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : `bg-gradient-to-br ${cat.gradient} text-white shadow-2xs`
                }`}
              >
                {getCategoryIcon(cat.iconName, 'w-4 h-4')}
              </div>

              <div className="flex-1 min-w-0 pr-1">
                <div className="flex items-center justify-between gap-1">
                  <h3
                    className={`text-sm font-bold truncate ${
                      isActive ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {cat.name}
                  </h3>
                  <span
                    className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full tabular-nums ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                </div>
                <p
                  className={`text-xs truncate mt-0.5 ${
                    isActive ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  {cat.shortDesc}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Quick Add Custom Link Button */}
      <button
        onClick={onOpenAddModal}
        className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 text-white text-xs font-bold rounded-2xl shadow-sm transition-all duration-200 active:scale-98 flex items-center justify-center gap-2 group"
      >
        <span className="p-1 bg-white/20 rounded-lg group-hover:rotate-90 transition-transform">
          <Plus className="w-3.5 h-3.5" />
        </span>
        <span>Yeni Bağlantı / Belge Ekle</span>
      </button>

      {/* Helpful Teacher Note Card */}
      <div className="p-4 bg-sky-50/70 rounded-2xl border border-sky-200/60 text-xs text-sky-950">
        <h4 className="font-bold flex items-center gap-1.5 text-sky-900 mb-1">
          <span>📌</span>
          <span>Öğretmen Notu</span>
        </h4>
        <p className="text-[11px] text-sky-900/80 leading-relaxed">
          Sınav, ders planı ve döküman bağlantılarınızı istediğiniz zaman menülere tıklayarak veya "Yeni Bağlantı Ekle" ile sisteme dahil edebilirsiniz.
        </p>
      </div>
    </aside>
  );
};
