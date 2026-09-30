export type Language = 'en' | 'te' | 'tanglish';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type GameTone = 'normal' | 'fun';

export type MotionSensitivity = 'low' | 'medium' | 'high';

export interface GameCard {
  id: string;
  type?: string;            // 'movie' | 'actor' | 'actress' | 'character' | 'song' | 'dialogue' | 'meme' | 'celebrity' | 'custom'
  answer: string;           // Primary display in English / Latin script
  telugu?: string;          // Display in Telugu script
  tanglish?: string;        // Conversational/Tanglish representation if different
  subtext?: string;         // Clue/Context e.g. "Year: 2022 • Dir: Rajamouli"
  teluguSubtext?: string;
  clue?: string;            // Primary storyline / plot clue from CSV Overview or character/song hint
  info?: string;            // Secondary details: Year • Genre • Director • Lead Cast
  dialogue?: string;        // Famous punchline or hook dialogue if applicable
  category: string;         // Category or Deck ID
  tags: string[];           // e.g. ["mass", "family", "action", "hero"]
  difficulty: Difficulty;
  isFamilySafe?: boolean;
}

export interface MovieRecord {
  id: string;
  title: string;
  alternateTitle?: string;
  teluguTitle: string;
  releaseYear: number;
  releaseStatus: 'released' | 'upcoming';
  genre: string[];
  leadActors: string[];
  leadActresses: string[];
  director: string;
  famousCharacters?: string[];
  famousDialogues?: string[];
  songs?: string[];
  difficulty: Difficulty;
  tags: string[];
  isFamilySafe?: boolean;
}

export interface CategoryInfo {
  id: string;
  name: string;
  teluguName: string;
  description: string;
  teluguDescription: string;
  icon: string;             // Lucide icon name or emoji
  emoji: string;
  color: string;            // Tailwind color accent
  badge?: string;
  isSpecial?: boolean;
  isPopular?: boolean;
}

export interface Team {
  id: string;
  name: string;
  score: number;
  avatarColor: string;
}

export interface GameSettings {
  language: Language;
  timerDuration: number;    // 30, 45, 60, 90, 120
  motionControls: boolean;  // Tilt sensor enabled
  motionSensitivity: MotionSensitivity;
  soundEnabled: boolean;
  hapticEnabled: boolean;
  familySafeOnly: boolean;
  gameTone: GameTone;
  difficulty: 'easy' | 'mixed' | 'hardcore';
  showClues: boolean;       // Show hint/clue to explainer
}

export interface RoundResult {
  card: GameCard;
  status: 'correct' | 'pass';
  timeTakenMs: number;
}

export interface RoundSummary {
  id: string;
  timestamp: number;
  categoryName: string;
  teamName?: string;
  score: number;
  correctCount: number;
  passCount: number;
  totalCards: number;
  bestStreak: number;
  accuracy: number;
  fastestGuessSec: number | null;
  results: RoundResult[];
}

export interface OverallStats {
  totalGames: number;
  totalCorrect: number;
  totalPasses: number;
  bestScore: number;
  bestStreak: number;
  favoriteCategoryId?: string;
  categoryPlayCounts: Record<string, number>;
  totalPlayTimeSec: number;
}

export interface CustomDeck {
  id: string;
  title: string;
  description: string;
  createdAt: number;
  cards: Array<{
    id: string;
    answer: string;
    telugu?: string;
    subtext?: string;
  }>;
}

export interface DailyChallenge {
  dateKey: string;          // YYYY-MM-DD
  themeTitle: string;
  themeTelugu: string;
  categoryId: string;
  completed: boolean;
  score?: number;
  streak?: number;
}
