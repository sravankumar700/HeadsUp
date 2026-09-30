/**
 * Mana Heads Up - The Ultimate Telugu & Indian Cinema Guessing Party Game
 * @license Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  GameCard, 
  GameSettings, 
  OverallStats, 
  RoundSummary, 
  Team, 
  CustomDeck, 
  DailyChallenge 
} from './data/types';
import { getCardsForCategory, categoriesList } from './data/categories';
import { storage, defaultSettings, defaultStats } from './utils/storage';
import { soundFX } from './utils/audio';

import { Header } from './components/Header';
import { HomeScreen } from './components/HomeScreen';
import { GameSetupModal } from './components/GameSetupModal';
import { CountdownScreen } from './components/CountdownScreen';
import { GameplayScreen } from './components/GameplayScreen';
import { RoundResultsScreen } from './components/RoundResultsScreen';
import { TeamManagerModal } from './components/TeamManagerModal';
import { CustomDecksModal } from './components/CustomDecksModal';
import { StatsModal } from './components/StatsModal';
import { SettingsModal } from './components/SettingsModal';
import { SensorCalibrationModal } from './components/SensorCalibrationModal';

type GamePhase = 'home' | 'countdown' | 'playing' | 'results';

export default function App() {
  // App Persistent State
  const [settings, setSettings] = useState<GameSettings>(defaultSettings);
  const [stats, setStats] = useState<OverallStats>(defaultStats);
  const [history, setHistory] = useState<RoundSummary[]>([]);
  const [customDecks, setCustomDecks] = useState<CustomDeck[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [dailyChallenge, setDailyChallenge] = useState<DailyChallenge>(storage.getDailyChallenge());

  // Teams State
  const [teams, setTeams] = useState<Team[]>([
    { id: 't1', name: 'Hyderabad Heroes', score: 0, avatarColor: 'from-amber-500 to-red-600' },
    { id: 't2', name: 'Mass Maharajas', score: 0, avatarColor: 'from-red-600 to-orange-500' }
  ]);
  const [isTeamMode, setIsTeamMode] = useState<boolean>(false);
  const [activeTeamIndex, setActiveTeamIndex] = useState<number>(0);
  const [teamRoundNumber, setTeamRoundNumber] = useState<number>(1);
  const [teamQuestionCycle, setTeamQuestionCycle] = useState<number>(1);
  const [teamCardQueue, setTeamCardQueue] = useState<GameCard[]>([]);

  // Active Game State
  const [gamePhase, setGamePhase] = useState<GamePhase>('home');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('quick_mix');
  const [selectedCustomDeck, setSelectedCustomDeck] = useState<CustomDeck | undefined>(undefined);
  const [activeDeckCards, setActiveDeckCards] = useState<GameCard[]>([]);
  const [lastRoundSummary, setLastRoundSummary] = useState<RoundSummary | null>(null);

  // Modal Dialog States
  const [showSetupModal, setShowSetupModal] = useState<boolean>(false);
  const [showTeamsModal, setShowTeamsModal] = useState<boolean>(false);
  const [showCustomDecksModal, setShowCustomDecksModal] = useState<boolean>(false);
  const [showStatsModal, setShowStatsModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showCalibrationModal, setShowCalibrationModal] = useState<boolean>(false);

  // Initial Load from localStorage
  useEffect(() => {
    const loadedSettings = storage.getSettings();
    const loadedStats = storage.getStats();
    const loadedHistory = storage.getHistory();
    const loadedDecks = storage.getCustomDecks();
    const loadedFavs = storage.getFavorites();

    setSettings(loadedSettings);
    setStats(loadedStats);
    setHistory(loadedHistory);
    setCustomDecks(loadedDecks);
    setFavorites(loadedFavs);
    soundFX.enabled = loadedSettings.soundEnabled;
    soundFX.hapticEnabled = loadedSettings.hapticEnabled;
  }, []);

  const handleUpdateSettings = (newSettings: GameSettings) => {
    setSettings(newSettings);
    storage.saveSettings(newSettings);
    soundFX.enabled = newSettings.soundEnabled;
    soundFX.hapticEnabled = newSettings.hapticEnabled;
  };

  const handleToggleFavorite = (categoryId: string) => {
    const updated = storage.toggleFavorite(categoryId);
    setFavorites(updated);
  };

  // Helper to draw cards for a team round, automatically repeating questions when running low
  const drawCardsForTeamRound = (
    catId: string,
    currentQueue: GameCard[],
    customCards?: GameCard[]
  ): { hand: GameCard[]; nextQueue: GameCard[]; newCycle: number } => {
    let pool = [...currentQueue];
    let cycle = teamQuestionCycle;

    // If pool has fewer than 25 cards, replenish with all category questions so questions repeat!
    if (pool.length < 25) {
      const freshDeck = getCardsForCategory(catId, settings, customCards);
      pool = [...pool, ...freshDeck];
      cycle += 1;
    }

    const handSize = 35;
    const hand = pool.slice(0, handSize);
    const nextQueue = pool.slice(handSize);

    return { hand, nextQueue, newCycle: cycle };
  };

  // Launch Category Setup
  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setSelectedCustomDeck(undefined);
    setShowSetupModal(true);
  };

  // One-tap Quick Play
  const handleQuickPlay = () => {
    setSelectedCategoryId('quick_mix');
    setSelectedCustomDeck(undefined);
    setTeamRoundNumber(1);
    setTeamQuestionCycle(1);

    const fullDeck = getCardsForCategory('quick_mix', settings);
    if (isTeamMode) {
      const { hand, nextQueue } = drawCardsForTeamRound('quick_mix', fullDeck);
      setTeamCardQueue(nextQueue);
      setActiveDeckCards(hand);
    } else {
      setActiveDeckCards(fullDeck);
    }

    setShowSetupModal(false);
    setGamePhase('countdown');
  };

  // Start Daily Challenge
  const handlePlayDailyChallenge = () => {
    setSelectedCategoryId(dailyChallenge.categoryId);
    setSelectedCustomDeck(undefined);
    const cards = getCardsForCategory(dailyChallenge.categoryId, settings);
    setActiveDeckCards(cards);
    setGamePhase('countdown');
  };

  // Start Custom Deck
  const handlePlayCustomDeck = (deck: CustomDeck) => {
    setSelectedCategoryId('custom');
    setSelectedCustomDeck(deck);
    setShowCustomDecksModal(false);
    setShowSetupModal(true);
  };

  // From Setup Modal to Countdown
  const handleStartFromSetup = () => {
    const customCards = selectedCustomDeck
      ? selectedCustomDeck.cards.map((c) => ({
          id: c.id,
          answer: c.answer,
          telugu: c.telugu || c.answer,
          subtext: c.subtext,
          clue: c.subtext || c.answer,
          category: 'custom',
          tags: ['custom'],
          difficulty: 'medium' as const,
          isFamilySafe: true
        }))
      : undefined;

    setTeamRoundNumber(1);
    setTeamQuestionCycle(1);

    const fullDeck = getCardsForCategory(selectedCategoryId, settings, customCards);
    if (isTeamMode) {
      const { hand, nextQueue } = drawCardsForTeamRound(selectedCategoryId, fullDeck, customCards);
      setTeamCardQueue(nextQueue);
      setActiveDeckCards(hand);
    } else {
      setActiveDeckCards(fullDeck);
    }

    setShowSetupModal(false);
    setGamePhase('countdown');
  };

  // From Countdown to Active Play
  const handleCountdownComplete = () => {
    // Softly attempt landscape lock on supported mobile browsers
    if (typeof screen !== 'undefined' && screen.orientation && 'lock' in screen.orientation) {
      (screen.orientation as any).lock('landscape').catch(() => {});
    }
    setGamePhase('playing');
  };

  // Complete Round & Process Score
  const handleFinishRound = (summary: RoundSummary) => {
    setLastRoundSummary(summary);
    setGamePhase('results');

    // Update Persistent Stats
    const updatedStats = storage.updateStats(summary, settings.timerDuration);
    setStats(updatedStats);
    setHistory(storage.getHistory());

    // Update Team score if team mode
    if (isTeamMode && teams.length > 0) {
      setTeams((prev) =>
        prev.map((t, idx) =>
          idx === activeTeamIndex % prev.length
            ? { ...t, score: t.score + summary.correctCount }
            : t
        )
      );
    }

    // Check if daily challenge was being played
    if (selectedCategoryId === dailyChallenge.categoryId && !dailyChallenge.completed) {
      const updatedDaily: DailyChallenge = {
        ...dailyChallenge,
        completed: true,
        score: summary.correctCount,
        streak: summary.bestStreak
      };
      setDailyChallenge(updatedDaily);
      storage.saveDailyChallenge(updatedDaily);
    }
  };

  // Play Again (same deck, same team/solo)
  const handlePlayAgain = () => {
    if (isTeamMode) {
      const nextRound = teamRoundNumber + 1;
      setTeamRoundNumber(nextRound);
      const { hand, nextQueue, newCycle } = drawCardsForTeamRound(selectedCategoryId, teamCardQueue);
      setTeamCardQueue(nextQueue);
      setTeamQuestionCycle(newCycle);
      setActiveDeckCards(hand);
    } else {
      const cards = getCardsForCategory(selectedCategoryId, settings);
      setActiveDeckCards(cards);
    }
    setGamePhase('countdown');
  };

  // Next Team Turn in Team Battle - Continues queue and repeats questions when needed!
  const handleNextTeam = () => {
    setActiveTeamIndex((prev) => (prev + 1) % teams.length);
    const nextRound = teamRoundNumber + 1;
    setTeamRoundNumber(nextRound);

    const { hand, nextQueue, newCycle } = drawCardsForTeamRound(selectedCategoryId, teamCardQueue);
    setTeamCardQueue(nextQueue);
    setTeamQuestionCycle(newCycle);
    setActiveDeckCards(hand);
    setGamePhase('countdown');
  };

  const handleChangeCategory = () => {
    setGamePhase('home');
    setShowSetupModal(true);
  };

  const handleGoHome = () => {
    setGamePhase('home');
  };

  const currentTeam = isTeamMode && teams.length > 0 ? teams[activeTeamIndex % teams.length] : null;
  const currentCategoryName = selectedCustomDeck
    ? selectedCustomDeck.title
    : categoriesList.find((c) => c.id === selectedCategoryId)?.name || 'Telugu Cinema';

  return (
    <div className="min-h-screen bg-[#0b0604] text-amber-50 flex flex-col font-['Outfit',sans-serif]">
      {/* Header bar (only shown on Home or Results) */}
      {(gamePhase === 'home' || gamePhase === 'results') && (
        <Header
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onOpenSettings={() => setShowSettingsModal(true)}
          onOpenStats={() => setShowStatsModal(true)}
          onOpenCalibration={() => setShowCalibrationModal(true)}
        />
      )}

      {/* Main View Router */}
      <main className="flex-1 flex flex-col">
        {gamePhase === 'home' && (
          <HomeScreen
            settings={settings}
            dailyChallenge={dailyChallenge}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onSelectCategory={handleSelectCategory}
            onQuickPlay={handleQuickPlay}
            onOpenTeams={() => setShowTeamsModal(true)}
            onOpenCustomDecks={() => setShowCustomDecksModal(true)}
            onOpenCalibration={() => setShowCalibrationModal(true)}
            onPlayDailyChallenge={handlePlayDailyChallenge}
          />
        )}

        {gamePhase === 'countdown' && (
          <CountdownScreen
            settings={settings}
            team={currentTeam}
            categoryName={currentCategoryName}
            roundNumber={isTeamMode ? teamRoundNumber : undefined}
            onCountdownComplete={handleCountdownComplete}
          />
        )}

        {gamePhase === 'playing' && (
          <GameplayScreen
            cards={activeDeckCards}
            categoryName={currentCategoryName}
            settings={settings}
            currentTeam={currentTeam}
            roundNumber={isTeamMode ? teamRoundNumber : undefined}
            questionCycle={isTeamMode ? teamQuestionCycle : undefined}
            onFinishRound={handleFinishRound}
            onExit={handleGoHome}
          />
        )}

        {gamePhase === 'results' && lastRoundSummary && (
          <RoundResultsScreen
            summary={lastRoundSummary}
            teams={teams}
            isTeamMode={isTeamMode}
            settings={settings}
            roundNumber={isTeamMode ? teamRoundNumber : undefined}
            questionCycle={isTeamMode ? teamQuestionCycle : undefined}
            onPlayAgain={handlePlayAgain}
            onNextTeam={handleNextTeam}
            onChangeCategory={handleChangeCategory}
            onGoHome={handleGoHome}
          />
        )}
      </main>

      {/* Modals */}
      {showSetupModal && (
        <GameSetupModal
          categoryId={selectedCategoryId}
          customDeck={selectedCustomDeck}
          settings={settings}
          teams={teams}
          isTeamMode={isTeamMode}
          activeTeamIndex={activeTeamIndex}
          onUpdateSettings={handleUpdateSettings}
          onToggleTeamMode={setIsTeamMode}
          onClose={() => setShowSetupModal(false)}
          onStartGame={handleStartFromSetup}
          onOpenCalibration={() => setShowCalibrationModal(true)}
        />
      )}

      {showTeamsModal && (
        <TeamManagerModal
          teams={teams}
          isTeamMode={isTeamMode}
          onUpdateTeams={setTeams}
          onToggleTeamMode={setIsTeamMode}
          onClose={() => setShowTeamsModal(false)}
          onStartTournament={() => {
            setShowTeamsModal(false);
            setShowSetupModal(true);
          }}
        />
      )}

      {showCustomDecksModal && (
        <CustomDecksModal
          customDecks={customDecks}
          onSaveDecks={(decks) => {
            setCustomDecks(decks);
            storage.saveCustomDecks(decks);
          }}
          onPlayCustomDeck={handlePlayCustomDeck}
          onClose={() => setShowCustomDecksModal(false)}
        />
      )}

      {showStatsModal && (
        <StatsModal
          stats={stats}
          history={history}
          onClose={() => setShowStatsModal(false)}
        />
      )}

      {showSettingsModal && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onOpenCalibration={() => {
            setShowSettingsModal(false);
            setShowCalibrationModal(true);
          }}
          onClose={() => setShowSettingsModal(false)}
        />
      )}

      {showCalibrationModal && (
        <SensorCalibrationModal
          onClose={() => setShowCalibrationModal(false)}
        />
      )}
    </div>
  );
}
