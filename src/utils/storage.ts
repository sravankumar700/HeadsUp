import { CustomDeck, DailyChallenge, GameSettings, OverallStats, RoundSummary } from '../data/types';

const STORAGE_KEYS = {
  SETTINGS: 'mana_heads_up_settings',
  STATS: 'mana_heads_up_stats',
  CUSTOM_DECKS: 'mana_heads_up_custom_decks',
  DAILY_CHALLENGE: 'mana_heads_up_daily',
  HISTORY: 'mana_heads_up_history',
  FAVORITES: 'mana_heads_up_favorites'
};

export const defaultSettings: GameSettings = {
  language: 'tanglish', // Natural Telugu-English hybrid default, easily switchable to pure Telugu or English
  timerDuration: 90,     // 90s recommended default
  motionControls: false, // Default is manual controls; motion is optional
  motionSensitivity: 'medium',
  soundEnabled: true,
  hapticEnabled: true,
  familySafeOnly: false,
  gameTone: 'fun',
  difficulty: 'mixed',
  showClues: true
};

export const defaultStats: OverallStats = {
  totalGames: 0,
  totalCorrect: 0,
  totalPasses: 0,
  bestScore: 0,
  bestStreak: 0,
  categoryPlayCounts: {},
  totalPlayTimeSec: 0
};

// Default starter custom decks so user can test custom decks immediately!
const starterCustomDecks: CustomDeck[] = [
  {
    id: "deck_btech_gang",
    title: "B.Tech Batch Adda",
    description: "Engineering college memories, hostel life, backlogs & treats!",
    createdAt: Date.now(),
    cards: [
      { id: "c1", answer: "Proxy Attendance", telugu: "ప్రాక్సీ అటెండెన్స్", subtext: "Calling Present for your best friend" },
      { id: "c2", answer: "All Clear Student", telugu: "ఆల్ క్లియర్ స్టూడెంట్", subtext: "Zero backlogs topper" },
      { id: "c3", answer: "Maggi at 2 AM", telugu: "రాత్రి 2 గంటల మ్యాగీ", subtext: "Hostel survival meal" },
      { id: "c4", answer: "HOD Signature", telugu: "హెచ్ఓడి సంతకం", subtext: "Hardest achievement in college" },
      { id: "c5", answer: "Placement Treat", telugu: "ప్లేస్‌మెంట్ ట్రీట్", subtext: "Biryani from selected friend" },
      { id: "c6", answer: "Canteen Chai & Samosa", telugu: "క్యాంటీన్ చాయ్", subtext: "Daily adda spot" }
    ]
  }
];

export const storage = {
  getSettings(): GameSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) return { ...defaultSettings, ...JSON.parse(data) };
    } catch (e) {
      console.error(e);
    }
    return defaultSettings;
  },

  saveSettings(settings: GameSettings) {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  },

  getStats(): OverallStats {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STATS);
      if (data) return { ...defaultStats, ...JSON.parse(data) };
    } catch (e) {
      console.error(e);
    }
    return defaultStats;
  },

  updateStats(round: RoundSummary, playDurationSec: number) {
    try {
      const current = this.getStats();
      const updated: OverallStats = {
        totalGames: current.totalGames + 1,
        totalCorrect: current.totalCorrect + round.correctCount,
        totalPasses: current.totalPasses + round.passCount,
        bestScore: Math.max(current.bestScore, round.score),
        bestStreak: Math.max(current.bestStreak, round.bestStreak),
        totalPlayTimeSec: current.totalPlayTimeSec + playDurationSec,
        categoryPlayCounts: {
          ...current.categoryPlayCounts,
          [round.categoryName]: (current.categoryPlayCounts[round.categoryName] || 0) + 1
        }
      };

      // Determine favorite category
      let maxCount = 0;
      let fav = current.favoriteCategoryId;
      Object.entries(updated.categoryPlayCounts).forEach(([cat, count]) => {
        if (count > maxCount) {
          maxCount = count;
          fav = cat;
        }
      });
      updated.favoriteCategoryId = fav;

      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(updated));

      // Also append to history (keep last 30 rounds)
      const history = this.getHistory();
      history.unshift(round);
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history.slice(0, 30)));

      return updated;
    } catch (e) {
      console.error(e);
      return defaultStats;
    }
  },

  getHistory(): RoundSummary[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return [];
  },

  getCustomDecks(): CustomDeck[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_DECKS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return starterCustomDecks;
  },

  saveCustomDecks(decks: CustomDeck[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_DECKS, JSON.stringify(decks));
    } catch (e) {
      console.error(e);
    }
  },

  getFavorites(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return ['quick_mix', 'movies_2020_2024', 'mass_mode', 'actors'];
  },

  toggleFavorite(categoryId: string): string[] {
    try {
      const favs = this.getFavorites();
      const next = favs.includes(categoryId) ? favs.filter(id => id !== categoryId) : [...favs, categoryId];
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(next));
      return next;
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  getDailyChallenge(): DailyChallenge {
    const today = new Date().toISOString().slice(0, 10);
    const themes = [
      { id: "movies_2020_2024", title: "Tollywood Pan-India Storm", telugu: "పాన్-ఇండియా సునామీ" },
      { id: "actors", title: "Tollywood Kings & Heroes", telugu: "మన టాలీవుడ్ రారాజులు" },
      { id: "dialogues", title: "Blockbuster Punch Dialogues", telugu: "బాక్సాఫీస్ పంచ్ డైలాగులు" },
      { id: "mass_mode", title: "Mass Elevation Mania", telugu: "మాస్ ఎలివేషన్ రచ్చ" },
      { id: "songs", title: "Telugu Chartbuster Anthems", telugu: "సూపర్‌హిట్ తెలుగు పాటలు" },
      { id: "comedy_movies", title: "Hasya Brahma & Comedy Kings", telugu: "హాస్య బ్రహ్మ & నవ్వుల జల్లు" },
      { id: "pan_india", title: "Rajamouli & Global Cinema", telugu: "జక్కన్న & గ్లోబల్ సినిమా" }
    ];

    // Pick deterministic theme based on day
    const dayIndex = Math.abs(today.split('-').reduce((acc, part) => acc + parseInt(part, 10), 0)) % themes.length;
    const selectedTheme = themes[dayIndex];

    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DAILY_CHALLENGE);
      if (saved) {
        const parsed: DailyChallenge = JSON.parse(saved);
        if (parsed.dateKey === today) {
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }

    return {
      dateKey: today,
      themeTitle: selectedTheme.title,
      themeTelugu: selectedTheme.telugu,
      categoryId: selectedTheme.id,
      completed: false
    };
  },

  saveDailyChallenge(challenge: DailyChallenge) {
    try {
      localStorage.setItem(STORAGE_KEYS.DAILY_CHALLENGE, JSON.stringify(challenge));
    } catch (e) {
      console.error(e);
    }
  }
};
