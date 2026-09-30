import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { GameSettings, RoundSummary, Team } from '../data/types';
import { translations } from '../data/translations';
import { soundFX } from '../utils/audio';
import { 
  RotateCcw, 
  Home, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface RoundResultsScreenProps {
  summary: RoundSummary;
  teams: Team[];
  isTeamMode: boolean;
  settings: GameSettings;
  roundNumber?: number;
  questionCycle?: number;
  onPlayAgain: () => void;
  onNextTeam: () => void;
  onChangeCategory: () => void;
  onGoHome: () => void;
}

export const RoundResultsScreen: React.FC<RoundResultsScreenProps> = ({
  summary,
  teams,
  isTeamMode,
  settings,
  roundNumber,
  questionCycle,
  onPlayAgain,
  onNextTeam,
  onChangeCategory,
  onGoHome
}) => {
  const t = translations[settings.language];

  useEffect(() => {
    soundFX.playFanfare();

    if (summary.score >= 3) {
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#ffb300', '#e53935', '#4caf50', '#ffffff']
        });
      } catch {
        // Confetti handled gracefully
      }
    }
  }, [summary.score]);

  return (
    <div className="w-full max-w-md mx-auto px-4 py-8 space-y-6 animate-in fade-in duration-200">
      {/* 1. Header */}
      <div className="text-center space-y-1">
        <h1 className="text-3xl sm:text-4xl font-black font-['Cinzel',serif] text-amber-300 flex items-center justify-center gap-2">
          <span>TIME'S UP!</span>
          <span>🎬</span>
        </h1>
        {summary.teamName && (
          <p className="text-base font-extrabold text-amber-200">
            Team: {summary.teamName} {roundNumber ? `(Round ${roundNumber})` : ''}
          </p>
        )}
        <p className="text-xs text-amber-300/60 font-semibold">
          Deck: {summary.categoryName}
        </p>
        {questionCycle && questionCycle > 1 && (
          <div className="inline-block mt-1 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-500/50 text-blue-300 text-xs font-bold">
            🔄 Questions Repeated • Rematch Cycle {questionCycle}
          </div>
        )}
      </div>

      {/* 2. Score Highlights Card */}
      <div className="p-6 rounded-3xl bg-[#1b0d07] border border-amber-600/40 text-center space-y-5 shadow-2xl shadow-black/80">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40">
            <span className="text-4xl sm:text-5xl font-black text-emerald-400 font-mono">
              {summary.correctCount}
            </span>
            <p className="text-xs font-bold text-emerald-300 uppercase tracking-wider mt-1">
              Correct
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-950/60 border border-amber-500/40">
            <span className="text-4xl sm:text-5xl font-black text-amber-400 font-mono">
              {summary.passCount}
            </span>
            <p className="text-xs font-bold text-amber-300 uppercase tracking-wider mt-1">
              Skipped
            </p>
          </div>
        </div>

        {/* Secondary metrics */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-amber-900/40 text-xs">
          <div className="p-2.5 rounded-xl bg-black/40 border border-amber-950">
            <span className="text-amber-400/80">Best Streak</span>
            <p className="text-base font-extrabold text-amber-200 mt-0.5">
              🔥 {summary.bestStreak}
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-black/40 border border-amber-950">
            <span className="text-amber-400/80">Accuracy</span>
            <p className="text-base font-extrabold text-amber-200 mt-0.5">
              🎯 {summary.accuracy}%
            </p>
          </div>
        </div>
      </div>

      {/* 3. Team Standings (if team mode) */}
      {isTeamMode && teams.length > 0 && (
        <div className="p-4 rounded-2xl bg-[#170a05] border border-amber-900/40 space-y-2">
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
            Team Scores
          </span>
          <div className="space-y-1.5">
            {teams.map((team, idx) => (
              <div
                key={team.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#221008] border border-amber-950 text-xs font-bold"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="text-amber-100">{team.name}</span>
                </div>
                <span className="font-mono text-amber-300">{team.score} pts</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Action Buttons */}
      <div className="space-y-2.5 pt-1">
        {isTeamMode ? (
          <button
            type="button"
            onClick={onNextTeam}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 text-black font-extrabold text-base tracking-wider uppercase shadow-xl active:scale-98 transition"
          >
            <span>NEXT TEAM</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onPlayAgain}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 text-black font-extrabold text-base tracking-wider uppercase shadow-xl active:scale-98 transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>PLAY AGAIN</span>
          </button>
        )}

        <button
          type="button"
          onClick={onChangeCategory}
          className="w-full py-3.5 rounded-2xl bg-[#2a170e] hover:bg-[#381e13] border border-amber-700/50 text-amber-200 font-bold text-sm tracking-wider uppercase active:scale-98 transition"
        >
          CHANGE CATEGORY
        </button>

        <button
          type="button"
          onClick={onGoHome}
          className="w-full py-2.5 text-xs font-bold text-amber-300/60 hover:text-amber-200 transition flex items-center justify-center gap-1.5"
        >
          <Home className="w-3.5 h-3.5" />
          <span>HOME</span>
        </button>
      </div>
    </div>
  );
};
