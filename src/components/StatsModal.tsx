import React from 'react';
import { OverallStats, RoundSummary } from '../data/types';
import { X, BarChart2, Trophy, Flame, Target, Award, Clock, History } from 'lucide-react';

interface StatsModalProps {
  stats: OverallStats;
  history: RoundSummary[];
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ stats, history, onClose }) => {
  const accuracy = stats.totalCorrect + stats.totalPasses > 0
    ? Math.round((stats.totalCorrect / (stats.totalCorrect + stats.totalPasses)) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#21110a] to-[#120704] border border-amber-600/40 p-5 sm:p-7 shadow-2xl space-y-5 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-900/40 pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-amber-100">
                Cinema Records & Stats
              </h2>
              <p className="text-xs text-amber-300/70">
                Track your Tollywood guessing milestones
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-amber-400 hover:text-white hover:bg-amber-950/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div className="p-3 rounded-2xl bg-[#29150d] border border-amber-900/40 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400/80">
                Games Played
              </span>
              <p className="text-2xl font-black text-amber-100 font-mono mt-1">
                {stats.totalGames}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#29150d] border border-amber-900/40 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400/80">
                Total Correct
              </span>
              <p className="text-2xl font-black text-emerald-400 font-mono mt-1">
                {stats.totalCorrect}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#29150d] border border-amber-900/40 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400/80">
                Total Passed
              </span>
              <p className="text-2xl font-black text-amber-400 font-mono mt-1">
                {stats.totalPasses}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#29150d] border border-amber-900/40 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400/80">
                Best Score
              </span>
              <p className="text-2xl font-black text-amber-300 font-mono mt-1">
                🏆 {stats.bestScore}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#29150d] border border-amber-900/40 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400/80">
                Best Streak
              </span>
              <p className="text-2xl font-black text-red-400 font-mono mt-1">
                🔥 {stats.bestStreak}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#29150d] border border-amber-900/40 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400/80">
                Accuracy
              </span>
              <p className="text-2xl font-black text-blue-400 font-mono mt-1">
                🎯 {accuracy}%
              </p>
            </div>
          </div>

          {stats.favoriteCategoryId && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <div>
                  <span className="text-xs text-amber-300/80 font-medium">Favorite Category</span>
                  <h4 className="text-sm font-bold text-amber-100">{stats.favoriteCategoryId}</h4>
                </div>
              </div>
            </div>
          )}

          {/* Recent Game History */}
          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <History className="w-3.5 h-3.5" />
              <span>Recent Rounds History</span>
            </h3>

            {history.length === 0 ? (
              <p className="text-xs text-amber-300/60 text-center py-4">
                No past games played yet. Complete a round to see records!
              </p>
            ) : (
              <div className="space-y-2 max-h-52 overflow-y-auto">
                {history.slice(0, 15).map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-black/40 border border-amber-950 flex items-center justify-between text-xs"
                  >
                    <div>
                      <h4 className="font-bold text-amber-100">{item.categoryName}</h4>
                      <p className="text-[11px] text-amber-300/60">
                        {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {item.teamName && ` • Team ${item.teamName}`}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-right">
                      <span className="font-mono font-black text-emerald-400 text-sm">
                        {item.correctCount} ✓
                      </span>
                      <span className="font-mono text-amber-400/80 text-xs">
                        {item.passCount} ⏭
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
