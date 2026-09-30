import React, { useState } from 'react';
import { CategoryInfo, CustomDeck, GameSettings, Team } from '../data/types';
import { categoriesList, categoryGroups } from '../data/categories';
import { translations } from '../data/translations';
import { X, Play, Clock, Users, User, ChevronDown } from 'lucide-react';

interface GameSetupModalProps {
  categoryId: string;
  customDeck?: CustomDeck;
  settings: GameSettings;
  teams: Team[];
  isTeamMode: boolean;
  activeTeamIndex: number;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onToggleTeamMode: (isTeam: boolean) => void;
  onClose: () => void;
  onStartGame: () => void;
  onOpenCalibration: () => void;
}

export const GameSetupModal: React.FC<GameSetupModalProps> = ({
  categoryId,
  customDeck,
  settings,
  teams,
  isTeamMode,
  activeTeamIndex,
  onUpdateSettings,
  onToggleTeamMode,
  onClose,
  onStartGame
}) => {
  const t = translations[settings.language];
  const [selectedCatId, setSelectedCatId] = useState<string>(categoryId);
  const [selectedTimer, setSelectedTimer] = useState<number>(settings.timerDuration || 90);

  const timerOptions = [30, 45, 60, 90, 120];

  const handleStart = () => {
    onUpdateSettings({ ...settings, timerDuration: selectedTimer });
    onStartGame();
  };

  const currentTeam = isTeamMode && teams.length > 0 ? teams[activeTeamIndex % teams.length] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-[#1c0d07] border border-amber-600/40 p-5 sm:p-6 shadow-2xl space-y-4 animate-in fade-in slide-in-from-bottom duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-amber-900/40 pb-3">
          <div>
            <h2 className="text-xl font-black text-amber-100 font-['Cinzel',serif]">
              QUICK PLAY
            </h2>
            <p className="text-xs text-amber-300/60">
              Select category and round duration to begin
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-amber-400 hover:text-white hover:bg-amber-950/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Category Selection Dropdown */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-amber-300 uppercase tracking-wider">
            Category
          </label>
          <div className="relative">
            <select
              value={selectedCatId}
              onChange={(e) => setSelectedCatId(e.target.value)}
              className="w-full appearance-none bg-black/50 border border-amber-800/60 rounded-xl px-4 py-3 text-sm font-bold text-amber-100 focus:outline-none focus:border-amber-500 cursor-pointer pr-10"
            >
              <optgroup label="Primary Decks">
                {categoriesList.slice(0, 12).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.emoji} {c.name}
                  </option>
                ))}
              </optgroup>
              {categoryGroups.map((g) => (
                <optgroup key={g.id} label={g.name}>
                  {g.categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.emoji} {c.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-amber-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* 2. Game Time Selection (90s and 120s prominent) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Game Time</span>
            </label>
            <span className="text-[11px] font-bold text-amber-400">
              Default: 90 Sec
            </span>
          </div>

          <div className="grid grid-cols-5 gap-1.5">
            {timerOptions.map((sec) => {
              const isProminent = sec === 90 || sec === 120;
              const isSelected = selectedTimer === sec;

              return (
                <button
                  key={sec}
                  type="button"
                  onClick={() => setSelectedTimer(sec)}
                  className={`py-2.5 rounded-xl text-xs font-black transition-all active:scale-95 flex flex-col items-center justify-center ${
                    isSelected
                      ? 'bg-amber-500 text-black shadow-lg shadow-amber-950/60 scale-105'
                      : isProminent
                        ? 'bg-[#2f180f] hover:bg-[#3d1f14] border-2 border-amber-600/50 text-amber-200'
                        : 'bg-black/40 hover:bg-[#28140c] border border-amber-900/50 text-amber-200/70'
                  }`}
                >
                  <span>{sec}</span>
                  <span className="text-[9px] font-bold uppercase">SEC</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Mode Selection (Solo vs Teams) */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span>Mode</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onToggleTeamMode(false)}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition active:scale-95 ${
                !isTeamMode
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'bg-black/40 text-amber-200/70 hover:bg-[#28140c] border border-amber-900/40'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>SOLO</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleTeamMode(true)}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition active:scale-95 ${
                isTeamMode
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'bg-black/40 text-amber-200/70 hover:bg-[#28140c] border border-amber-900/40'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>TEAMS ({teams.length})</span>
            </button>
          </div>
        </div>

        {/* Current Team Indicator if in Team Mode */}
        {isTeamMode && currentTeam && (
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs flex items-center justify-between text-amber-200">
            <span className="font-bold">Next Turn: {currentTeam.name}</span>
            <span className="font-mono text-amber-400 font-bold">{currentTeam.score} pts</span>
          </div>
        )}

        {/* START GAME Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleStart}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-black font-black text-lg tracking-wider uppercase shadow-xl shadow-amber-950/60 active:scale-98 transition group"
          >
            <Play className="w-5 h-5 fill-black text-black ml-0.5" />
            <span>START GAME</span>
          </button>
        </div>
      </div>
    </div>
  );
};
