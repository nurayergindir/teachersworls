export type TeacherCategory = 
  | 'sinavlarim' 
  | 'ders-kaynaklarim' 
  | 'ders-planlarim' 
  | 'ogretmen-dosyalarim' 
  | 'oyunlarim';

export interface CategoryInfo {
  id: TeacherCategory;
  name: string;
  description: string;
  shortDesc: string;
  iconName: string;
  gradient: string;
  accentColor: string;
  badgeCount?: number;
}

export interface ResourceLinkItem {
  id: string;
  categoryId: TeacherCategory;
  title: string;
  description?: string;
  url: string;
  subject?: string;
  gradeLevel?: string;
  tag?: string;
  fileType: 'link' | 'pdf' | 'doc' | 'sheet' | 'drive' | 'form' | 'game';
  dateAdded: string;
  isCustom?: boolean;
}

export type GameCategory = 'all' | 'matematik' | 'fen' | 'turkce' | 'zeka' | 'kodlama' | 'sosyal';

export interface EducationalGame {
  id: string;
  title: string;
  subtitle: string;
  category: 'matematik' | 'fen' | 'turkce' | 'zeka' | 'kodlama' | 'sosyal';
  categoryLabel: string;
  targetGrade: string;
  estimatedMinutes: string;
  players: string;
  description: string;
  keyConcepts: string[];
  image: string;
  badgeColor: string;
  gradientBg: string;
  playableType: 'math-quiz' | 'word-scramble' | 'memory-match' | 'pattern-logic' | 'external-link';
  externalUrl?: string;
  isCustom?: boolean;
}

export interface EducationalQuote {
  id: string;
  quote: string;
  author: string;
  role: string;
  category: 'cumhuriyet' | 'pedagoji' | 'felsefe' | 'bilim';
  categoryLabel: string;
  isCustom?: boolean;
}

export interface CalendarNote {
  id: string;
  dateStr: string; // YYYY-MM-DD
  title: string;
  type: 'sinav' | 'plan' | 'toplanti' | 'etkinlik';
  time?: string;
}
