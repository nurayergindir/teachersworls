import { useState } from 'react';
import {
  INITIAL_RESOURCE_ITEMS,
  EDUCATIONAL_GAMES,
  EDUCATIONAL_QUOTES,
  TEACHER_CATEGORIES,
} from './data/mockData';
import {
  CategoryInfo,
  EducationalGame,
  EducationalQuote,
  ResourceLinkItem,
  TeacherCategory,
} from './types';
import { TopNavbar } from './components/header/TopNavbar';
import { TeacherSidebar } from './components/sidebar/TeacherSidebar';
import { CenterGamesHub } from './components/center/CenterGamesHub';
import { RightInspirationSidebar } from './components/sidebar/RightInspirationSidebar';
import { CategoryDetailsModal } from './components/modals/CategoryDetailsModal';
import { PlayGameModal } from './components/games/PlayGameModal';
import { AddResourceModal } from './components/modals/AddResourceModal';
import { AddGameModal } from './components/modals/AddGameModal';
import { AddQuoteModal } from './components/modals/AddQuoteModal';
import { Gamepad2, GraduationCap, Quote } from 'lucide-react';

export default function App() {
  // Persistence for user-added resources, games, and quotes
  const [resourceItems, setResourceItems] = useState<ResourceLinkItem[]>(() => {
    const saved = localStorage.getItem('ogretmen_resources_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_RESOURCE_ITEMS;
  });

  const [games, setGames] = useState<EducationalGame[]>(() => {
    const saved = localStorage.getItem('ogretmen_games_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return EDUCATIONAL_GAMES;
  });

  const [quotes, setQuotes] = useState<EducationalQuote[]>(() => {
    const saved = localStorage.getItem('ogretmen_quotes_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return EDUCATIONAL_QUOTES;
  });

  // Active modals & selected state
  const [activeCategoryModal, setActiveCategoryModal] = useState<CategoryInfo | null>(null);
  const [activeGameForPlay, setActiveGameForPlay] = useState<EducationalGame | null>(null);
  const [isAddResourceModalOpen, setIsAddResourceModalOpen] = useState(false);
  const [addResourceTargetCategory, setAddResourceTargetCategory] = useState<TeacherCategory>('sinavlarim');
  const [isAddGameModalOpen, setIsAddGameModalOpen] = useState(false);
  const [isAddQuoteModalOpen, setIsAddQuoteModalOpen] = useState(false);

  // Mobile active tab view ('hub' | 'teacher' | 'quotes')
  const [mobileTab, setMobileTab] = useState<'teacher' | 'hub' | 'quotes'>('hub');

  // Category selection handler
  const handleSelectCategory = (cat: CategoryInfo) => {
    setActiveCategoryModal(cat);
  };

  // Add resource handler
  const handleSaveResource = (newItem: Omit<ResourceLinkItem, 'id' | 'dateAdded'>) => {
    const fullItem: ResourceLinkItem = {
      ...newItem,
      id: `custom-res-${Date.now()}`,
      dateAdded: new Date().toISOString().split('T')[0],
      isCustom: true,
    };
    const updated = [fullItem, ...resourceItems];
    setResourceItems(updated);
    localStorage.setItem('ogretmen_resources_v1', JSON.stringify(updated));
  };

  // Delete resource handler
  const handleDeleteResource = (id: string) => {
    const updated = resourceItems.filter((i) => i.id !== id);
    setResourceItems(updated);
    localStorage.setItem('ogretmen_resources_v1', JSON.stringify(updated));
  };

  // Add new game handler
  const handleSaveGame = (newGame: Omit<EducationalGame, 'id'>) => {
    const fullGame: EducationalGame = {
      ...newGame,
      id: `custom-game-${Date.now()}`,
      isCustom: true,
    };
    const updated = [fullGame, ...games];
    setGames(updated);
    localStorage.setItem('ogretmen_games_v1', JSON.stringify(updated));
  };

  // Add quote handler
  const handleSaveQuote = (newQuote: Omit<EducationalQuote, 'id'>) => {
    const fullQuote: EducationalQuote = {
      ...newQuote,
      id: `custom-quote-${Date.now()}`,
      isCustom: true,
    };
    const updated = [fullQuote, ...quotes];
    setQuotes(updated);
    localStorage.setItem('ogretmen_quotes_v1', JSON.stringify(updated));
  };

  // Quick navigation helper
  const handleNavigateSection = (sectionId: string) => {
    if (sectionId === 'teacher-space') {
      setMobileTab('teacher');
      setActiveCategoryModal(TEACHER_CATEGORIES[0]);
    } else if (sectionId === 'games') {
      setMobileTab('hub');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (sectionId === 'quotes') {
      setMobileTab('quotes');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setMobileTab('hub');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Top Navbar Contract: Brand Wordmark, Nav Links, Top-Right Clock & Calendar */}
      <TopNavbar
        onNavigateSection={handleNavigateSection}
        onOpenQuickAdd={() => {
          setAddResourceTargetCategory('sinavlarim');
          setIsAddResourceModalOpen(true);
        }}
      />

      {/* Mobile view switcher buttons */}
      <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-around text-xs font-bold sticky top-[61px] z-30">
        <button
          onClick={() => setMobileTab('teacher')}
          className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl transition-all ${
            mobileTab === 'teacher'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Öğretmen Alanı</span>
        </button>

        <button
          onClick={() => setMobileTab('hub')}
          className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl transition-all ${
            mobileTab === 'hub'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600'
          }`}
        >
          <Gamepad2 className="w-4 h-4" />
          <span>Eğitsel Oyunlar</span>
        </button>

        <button
          onClick={() => setMobileTab('quotes')}
          className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl transition-all ${
            mobileTab === 'quotes'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600'
          }`}
        >
          <Quote className="w-4 h-4" />
          <span>İlham Sözleri</span>
        </button>
      </div>

      {/* Main 3-Column Layout Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row items-start gap-6">
          {/* 1. Left Column: Öğretmen Alanı (Teacher Sidebar) */}
          <div
            className={`w-full lg:w-72 ${
              mobileTab === 'teacher' ? 'block' : 'hidden lg:block'
            }`}
          >
            <TeacherSidebar
              items={resourceItems}
              selectedCategory={activeCategoryModal?.id || null}
              onSelectCategory={handleSelectCategory}
              onOpenAddModal={() => {
                setAddResourceTargetCategory('sinavlarim');
                setIsAddResourceModalOpen(true);
              }}
            />
          </div>

          {/* 2. Center Column: Canlı Renkli Eğitsel Oyunlar Alanı */}
          <div
            className={`flex-1 min-w-0 w-full ${
              mobileTab === 'hub' ? 'block' : 'hidden lg:block'
            }`}
          >
            <CenterGamesHub
              games={games}
              onPlayGame={(game) => setActiveGameForPlay(game)}
              onAddNewGame={() => setIsAddGameModalOpen(true)}
            />
          </div>

          {/* 3. Right Column: İlham Veren Eğitim Sözleri & Düşünceler */}
          <div
            className={`w-full lg:w-80 ${
              mobileTab === 'quotes' ? 'block' : 'hidden lg:block'
            }`}
          >
            <RightInspirationSidebar
              quotes={quotes}
              onAddNewQuote={() => setIsAddQuoteModalOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* Clean Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-medium text-slate-600">
            Öğretmen Dünyası · Geleceği yetiştiren tüm öğretmenlerimize saygıyla
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Ders Planları</span>
            <span>·</span>
            <span>Kazanım Sınavları</span>
            <span>·</span>
            <span>Eğitsel Oyunlar</span>
            <span>·</span>
            <span>Pedagojik İlham</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {/* 1. Category Hub Modal (Sınavlarım, Ders Kaynaklarım, Ders Planlarım, Öğretmen Dosyalarım, Oyunlarım) */}
      <CategoryDetailsModal
        isOpen={Boolean(activeCategoryModal)}
        category={activeCategoryModal}
        items={
          activeCategoryModal
            ? resourceItems.filter((i) => i.categoryId === activeCategoryModal.id)
            : []
        }
        onClose={() => setActiveCategoryModal(null)}
        onAddNew={(catId) => {
          setAddResourceTargetCategory(catId as TeacherCategory);
          setIsAddResourceModalOpen(true);
        }}
        onDeleteItem={handleDeleteResource}
      />

      {/* 2. Interactive Play Game Modal */}
      <PlayGameModal
        game={activeGameForPlay}
        onClose={() => setActiveGameForPlay(null)}
      />

      {/* 3. Add Resource / Link Modal */}
      <AddResourceModal
        isOpen={isAddResourceModalOpen}
        initialCategoryId={addResourceTargetCategory}
        onClose={() => setIsAddResourceModalOpen(false)}
        onSave={handleSaveResource}
      />

      {/* 4. Add Custom Game Modal */}
      <AddGameModal
        isOpen={isAddGameModalOpen}
        onClose={() => setIsAddGameModalOpen(false)}
        onSave={handleSaveGame}
      />

      {/* 5. Add Inspirational Quote Modal */}
      <AddQuoteModal
        isOpen={isAddQuoteModalOpen}
        onClose={() => setIsAddQuoteModalOpen(false)}
        onSave={handleSaveQuote}
      />
    </div>
  );
}
