import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameCard, GameSettings, RoundResult, RoundSummary, Team } from '../data/types';
import { soundFX } from '../utils/audio';

interface GameplayScreenProps {
  cards: GameCard[];
  categoryName: string;
  settings: GameSettings;
  currentTeam: Team | null;
  roundNumber?: number;
  questionCycle?: number;
  onFinishRound: (summary: RoundSummary) => void;
  onExit: () => void;
}

export const GameplayScreen: React.FC<GameplayScreenProps> = ({
  cards,
  categoryName,
  settings,
  currentTeam,
  roundNumber,
  questionCycle,
  onFinishRound,
  onExit
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(settings.timerDuration || 90);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);
  const [cardStartTime, setCardStartTime] = useState<number>(Date.now());
  const [feedbackEffect, setFeedbackEffect] = useState<'correct' | 'skip' | null>(null);
  const [cluesVisible, setCluesVisible] = useState<boolean>(settings.showClues !== false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const safeCards = cards && cards.length > 0 ? cards : [];
  const currentCard = safeCards.length > 0 ? safeCards[currentIndex % safeCards.length] : null;
  const isQuestionRepeated = safeCards.length > 0 && currentIndex >= safeCards.length;

  // Complete round when total game timer expires
  const completeRound = useCallback(() => {
    soundFX.playTimeUp();
    if (timerRef.current) clearInterval(timerRef.current);

    const correctCount = results.filter((r) => r.status === 'correct').length;
    const passCount = results.filter((r) => r.status === 'pass').length;
    const totalCards = results.length;
    const accuracy = totalCards > 0 ? Math.round((correctCount / totalCards) * 100) : 0;

    const correctGuesses = results.filter((r) => r.status === 'correct');
    const fastestGuessSec = correctGuesses.length > 0
      ? Math.min(...correctGuesses.map((r) => r.timeTakenMs)) / 1000
      : null;

    const summary: RoundSummary = {
      id: `round_${Date.now()}`,
      timestamp: Date.now(),
      categoryName,
      teamName: currentTeam ? currentTeam.name : undefined,
      score: correctCount,
      correctCount,
      passCount,
      totalCards,
      bestStreak,
      accuracy,
      fastestGuessSec: fastestGuessSec ? parseFloat(fastestGuessSec.toFixed(1)) : null,
      results
    };

    onFinishRound(summary);
  }, [results, bestStreak, categoryName, currentTeam, onFinishRound]);

  // Handle Manual Correct button press
  const handleCorrect = useCallback(() => {
    if (showExitConfirm || !currentCard) return;

    const now = Date.now();
    const timeTaken = now - cardStartTime;

    soundFX.playCorrect();
    setFeedbackEffect('correct');
    setTimeout(() => setFeedbackEffect(null), 200);

    const nextStreak = currentStreak + 1;
    setCurrentStreak(nextStreak);
    if (nextStreak > bestStreak) setBestStreak(nextStreak);

    setResults((prev) => [
      ...prev,
      { card: currentCard, status: 'correct', timeTakenMs: timeTaken }
    ]);

    setCardStartTime(Date.now());
    setCurrentIndex((prev) => prev + 1);
  }, [showExitConfirm, currentCard, cardStartTime, currentStreak, bestStreak]);

  // Handle Manual Skip button press
  const handleSkip = useCallback(() => {
    if (showExitConfirm || !currentCard) return;

    const now = Date.now();
    const timeTaken = now - cardStartTime;

    soundFX.playPass();
    setFeedbackEffect('skip');
    setTimeout(() => setFeedbackEffect(null), 200);

    setCurrentStreak(0);

    setResults((prev) => [
      ...prev,
      { card: currentCard, status: 'pass', timeTakenMs: timeTaken }
    ]);

    setCardStartTime(Date.now());
    setCurrentIndex((prev) => prev + 1);
  }, [showExitConfirm, currentCard, cardStartTime]);

  // Game Timer Countdown
  useEffect(() => {
    if (showExitConfirm) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          completeRound();
          return 0;
        }
        if (prev <= 6) {
          soundFX.playUrgentTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [showExitConfirm, completeRound]);

  // Prevent accidental touch zoom or scroll during high-speed gameplay
  useEffect(() => {
    const preventDefault = (e: TouchEvent) => {
      if (e.touches.length > 1) e.preventDefault();
    };
    document.addEventListener('touchstart', preventDefault, { passive: false });
    return () => {
      document.removeEventListener('touchstart', preventDefault);
    };
  }, []);

  const getAnswerText = () => {
    if (!currentCard) return '';
    if (settings.language === 'te' && currentCard.telugu) {
      return currentCard.telugu;
    }
    return currentCard.answer;
  };

  const getSecondaryText = () => {
    if (!currentCard) return '';
    if (settings.language === 'te') {
      return currentCard.answer !== currentCard.telugu ? currentCard.answer : '';
    }
    return currentCard.telugu || '';
  };

  const answer = getAnswerText();
  const secondaryAnswer = getSecondaryText();
  const plotClue = currentCard?.clue || currentCard?.subtext || '';
  const infoLine = currentCard?.info || '';
  const dialogueLine = currentCard?.dialogue ? `"${currentCard.dialogue}"` : '';

  // Dynamic font sizing based on string length to guarantee maximum visibility without overflow
  const getFontSizeClass = () => {
    if (answer.length <= 10) return 'text-5xl sm:text-7xl md:text-8xl lg:text-9xl';
    if (answer.length <= 20) return 'text-4xl sm:text-6xl md:text-7xl lg:text-8xl';
    if (answer.length <= 32) return 'text-3xl sm:text-5xl md:text-6xl lg:text-7xl';
    return 'text-2xl sm:text-4xl md:text-5xl lg:text-6xl';
  };

  return (
    <div 
      className={`fixed inset-0 z-50 bg-[#090503] text-white select-none overflow-hidden touch-none flex flex-col justify-between p-3 sm:p-6 transition-colors duration-150 ${
        feedbackEffect === 'correct' 
          ? 'bg-emerald-950/80 ring-8 ring-emerald-500 ring-inset' 
          : feedbackEffect === 'skip' 
            ? 'bg-amber-950/80 ring-8 ring-amber-500 ring-inset' 
            : ''
      }`}
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
    >
      {/* 1. TOP: Timer, Category, Team Round, & Quick Clue Toggle */}
      <div className="w-full flex flex-col items-center justify-center pt-1 shrink-0 space-y-1">
        <div className={`font-mono font-black text-5xl sm:text-7xl md:text-8xl tracking-tight leading-none ${
          timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-amber-300'
        }`}>
          {timeLeft}
        </div>

        {/* Status badges row */}
        <div className="flex items-center gap-2 flex-wrap justify-center text-xs">
          {currentTeam && (
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-extrabold tracking-wider uppercase">
              {currentTeam.name} {roundNumber ? `• Round ${roundNumber}` : ''}
            </span>
          )}

          <span className="font-bold tracking-widest uppercase text-amber-200/60">
            {categoryName}
          </span>

          {/* Quick Clue Toggle */}
          <button
            type="button"
            onClick={() => setCluesVisible(!cluesVisible)}
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition flex items-center gap-1 ${
              cluesVisible 
                ? 'bg-amber-500/30 text-amber-200 border border-amber-500/50 hover:bg-amber-500/40' 
                : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-700'
            }`}
            title="Toggle Clues"
          >
            <span>💡</span>
            <span>Clue: {cluesVisible ? 'ON' : 'OFF'}</span>
          </button>

          {/* Repeated Questions Badge for Marathon Play */}
          {isQuestionRepeated && (
            <span className="px-2 py-0.5 rounded-full bg-blue-950 border border-blue-500/50 text-blue-300 font-semibold text-[10px]">
              🔄 Repeated Rematch
            </span>
          )}
        </div>
      </div>

      {/* 2. CENTER: Large Answer & Rich Explainer Clue (from CSV) */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-2 py-2 my-auto max-w-4xl mx-auto w-full">
        {/* Main Answer Title */}
        <h1 className={`font-black font-['Outfit',sans-serif] tracking-tight text-amber-50 drop-shadow-[0_4px_30px_rgba(255,179,0,0.3)] leading-tight break-words ${getFontSizeClass()}`}>
          {answer}
        </h1>

        {/* Secondary Title (Telugu / English alternate script) */}
        {secondaryAnswer && (
          <p className="text-base sm:text-xl font-bold text-amber-300/80 mt-1">
            {secondaryAnswer}
          </p>
        )}

        {/* Explainer Clue Box - From Data CSV */}
        {cluesVisible && (plotClue || infoLine || dialogueLine) && (
          <div className="mt-3 sm:mt-5 w-full rounded-2xl bg-[#1c0c05]/95 border-2 border-amber-500/50 p-3 sm:p-4 text-left shadow-2xl shadow-black/80 animate-in fade-in duration-150">
            {/* Primary Storyline Plot Clue from CSV */}
            {plotClue && (
              <div className="flex items-start gap-2.5">
                <span className="shrink-0 text-amber-400 font-black text-xs sm:text-sm tracking-wide bg-amber-500/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <span>💡</span> CLUE:
                </span>
                <p className="text-amber-100 font-semibold text-sm sm:text-lg leading-snug break-words">
                  {plotClue}
                </p>
              </div>
            )}

            {/* Context Line: Year, Genre, Director, Lead Cast, Rating */}
            {(infoLine || dialogueLine) && (
              <div className="mt-2 pt-2 border-t border-amber-900/60 flex items-center justify-between flex-wrap gap-1.5 text-xs sm:text-sm text-amber-300/80">
                {infoLine && <span className="font-mono">{infoLine}</span>}
                {dialogueLine && (
                  <span className="italic text-amber-200 font-medium">
                    💬 {dialogueLine}
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. BOTTOM: Large distinct buttons (SKIP, CORRECT) and smaller EXIT button */}
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center gap-2.5 pb-2 shrink-0">
        <div className="w-full grid grid-cols-2 gap-3 sm:gap-6">
          {/* SKIP Button */}
          <button
            type="button"
            onClick={handleSkip}
            className="flex items-center justify-center gap-2 py-4 sm:py-6 rounded-2xl sm:rounded-3xl bg-[#2a170e] hover:bg-[#3d1f13] border-2 border-amber-600/60 hover:border-amber-400 text-amber-300 font-extrabold text-xl sm:text-3xl tracking-wider uppercase shadow-xl shadow-black/70 active:scale-95 transition-transform"
          >
            <span className="text-xl sm:text-3xl">↩</span>
            <span>SKIP</span>
          </button>

          {/* CORRECT Button */}
          <button
            type="button"
            onClick={handleCorrect}
            className="flex items-center justify-center gap-2 py-4 sm:py-6 rounded-2xl sm:rounded-3xl bg-emerald-600 hover:bg-emerald-500 border-2 border-emerald-400 text-white font-black text-xl sm:text-3xl tracking-wider uppercase shadow-xl shadow-emerald-950/70 active:scale-95 transition-transform"
          >
            <span className="text-xl sm:text-3xl">✓</span>
            <span>CORRECT</span>
          </button>
        </div>

        {/* Smaller EXIT Button */}
        <button
          type="button"
          onClick={() => setShowExitConfirm(true)}
          className="text-xs sm:text-sm font-bold text-amber-200/50 hover:text-amber-100 py-1.5 px-4 rounded-xl hover:bg-white/5 transition flex items-center gap-1.5"
        >
          <span>✕</span>
          <span>EXIT</span>
        </button>
      </div>

      {/* EXIT Confirmation Dialog */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-xs rounded-3xl bg-[#1c0d07] border border-amber-600/50 p-6 text-center space-y-5 shadow-2xl">
            <h3 className="text-xl font-black text-amber-100 font-['Cinzel',serif]">
              Exit this game?
            </h3>
            <p className="text-xs text-amber-200/70">
              Your overall records and stats will be preserved.
            </p>
            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm tracking-wider uppercase transition active:scale-95"
              >
                CONTINUE PLAYING
              </button>
              <button
                type="button"
                onClick={() => {
                  if (timerRef.current) clearInterval(timerRef.current);
                  onExit();
                }}
                className="w-full py-2.5 rounded-xl bg-black/40 hover:bg-red-950/40 border border-amber-900/60 text-red-300 font-bold text-xs tracking-wider uppercase transition"
              >
                EXIT GAME
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
