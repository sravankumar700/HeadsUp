import React, { useState } from 'react';
import { CategoryInfo, DailyChallenge, GameSettings } from '../data/types';
import { primaryCategories, categoryGroups } from '../data/categories';
import { translations } from '../data/translations';
import { 
  Play, 
  Zap, 
  Users, 
  Sparkles, 
  Calendar, 
  FolderPlus,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

interface HomeScreenProps {
  settings: GameSettings;
  dailyChallenge: DailyChallenge;
  favorites: string[];
  onToggleFavorite: (categoryId: string) => void;
  onSelectCategory: (categoryId: string) => void;
  onQuickPlay: () => void;
  onOpenTeams: () => void;
  onOpenCustomDecks: () => void;
  onOpenCalibration: () => void;
  onPlayDailyChallenge: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  settings,
  dailyChallenge,
  onSelectCategory,
  onQuickPlay,
  onOpenTeams,
  onOpenCustomDecks,
  onPlayDailyChallenge
}) => {
  const t = translations[settings.language];
  const [activeTab, setActiveTab] = useState<'featured' | 'groups'>('featured');
  const [expandedGroup, setExpandedGroup] = useState<string>('group_telugu_cinema');

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-5 pb-24 space-y-6">
      {/* Hero Banner with Cinematic Glow */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#23120b] via-[#1a0c07] to-[#120704] border border-amber-600/30 p-5 sm:p-7 shadow-2xl text-center">
        {/* Subtle decorative background film sprockets */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-[radial-gradient(circle,#ffb300_2px,transparent_2px)] bg-[size:16px_16px] opacity-20" />
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-[radial-gradient(circle,#ffb300_2px,transparent_2px)] bg-[size:16px_16px] opacity-20" />

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Tollywood Party Guessing Game</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-['Cinzel',serif] bg-gradient-to-r from-amber-200 via-amber-400 to-red-400 bg-clip-text text-transparent">
            {t.appName}
          </h1>

          <p className="text-xs sm:text-sm font-medium text-amber-200/80 max-w-md mx-auto leading-relaxed">
            {t.instructionForehead}
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="relative z-10 mt-5 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-sm mx-auto">
          {/* Quick Play Button */}
          <button
            type="button"
            onClick={onQuickPlay}
            className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-black font-black text-lg tracking-wider uppercase shadow-xl shadow-amber-950/60 active:scale-95 transition"
          >
            <Zap className="w-5 h-5 fill-black" />
            <span>QUICK PLAY</span>
          </button>
        </div>
      </div>

      {/* Daily Challenge Card & Team Mode Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Daily Challenge */}
        <div 
          onClick={onPlayDailyChallenge}
          className="cursor-pointer group relative overflow-hidden rounded-2xl bg-[#1c0e09] border border-amber-800/40 hover:border-amber-500/60 p-4 transition-all active:scale-98 shadow-lg"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-red-400 uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5" />
                <span>Today's Challenge</span>
              </div>
              <h3 className="text-base font-extrabold text-amber-100 group-hover:text-amber-300 transition">
                {dailyChallenge.themeTitle}
              </h3>
              <p className="text-xs text-amber-200/60">
                1 Minute Blitz • Instant Play
              </p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-xl shrink-0">
              🏆
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-amber-900/30">
            <span className={dailyChallenge.completed ? "text-emerald-400 font-semibold" : "text-amber-400/80 font-medium"}>
              {dailyChallenge.completed ? `Score: ${dailyChallenge.score}` : "Ready to play"}
            </span>
            <span className="flex items-center gap-1 text-amber-300 font-bold group-hover:translate-x-1 transition">
              Play <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Teams & Custom Decks */}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={onOpenTeams}
            className="flex-1 flex items-center justify-between p-3 rounded-2xl bg-[#1c0e09] hover:bg-[#28150d] border border-amber-800/40 text-left transition active:scale-98 shadow-md"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-amber-100">Team Party Battle</h4>
                <p className="text-[11px] text-amber-200/60">2, 3 or 4 Teams • Live score tracker</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-amber-400" />
          </button>

          <button
            type="button"
            onClick={onOpenCustomDecks}
            className="flex-1 flex items-center justify-between p-3 rounded-2xl bg-[#1c0e09] hover:bg-[#28150d] border border-amber-800/40 text-left transition active:scale-98 shadow-md"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <FolderPlus className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-amber-100">Custom Decks</h4>
                <p className="text-[11px] text-amber-200/60">Add friend names, college memories</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>

      {/* Category Selection Tabs (UpHeads Style) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-amber-900/40 pb-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('featured')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition active:scale-95 ${
                activeTab === 'featured'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'bg-[#1e100a] text-amber-200/70 hover:bg-[#2c170e]'
              }`}
            >
              ⭐ Primary Decks
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('groups')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition active:scale-95 ${
                activeTab === 'groups'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'bg-[#1e100a] text-amber-200/70 hover:bg-[#2c170e]'
              }`}
            >
              📚 All Categories By Group
            </button>
          </div>
        </div>

        {/* Tab 1: Primary UpHeads-style Decks */}
        {activeTab === 'featured' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {primaryCategories.map((cat) => {
              const name = settings.language === 'te' ? cat.teluguName : cat.name;

              return (
                <div
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className="group cursor-pointer p-4 rounded-2xl bg-[#1b0d07] hover:bg-[#26130b] border border-amber-800/40 hover:border-amber-500/60 flex flex-col justify-between items-center text-center space-y-2 shadow-md hover:scale-[1.02] active:scale-98 transition-all"
                >
                  <span className="text-3xl p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 group-hover:scale-110 transition">
                    {cat.emoji}
                  </span>
                  <div>
                    {cat.badge && (
                      <span className="inline-block text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-red-600/20 text-red-300 border border-red-500/20 mb-1">
                        {cat.badge}
                      </span>
                    )}
                    <h3 className="font-black text-xs sm:text-sm text-amber-100 group-hover:text-amber-300 transition">
                      {name}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Grouped Categories (Telugu Cinema, People, Special) */}
        {activeTab === 'groups' && (
          <div className="space-y-4">
            {categoryGroups.map((group) => {
              const isExpanded = expandedGroup === group.id;

              return (
                <div
                  key={group.id}
                  className="rounded-2xl bg-[#180c06] border border-amber-900/40 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedGroup(isExpanded ? '' : group.id)}
                    className="w-full flex items-center justify-between p-3.5 bg-[#200f08] hover:bg-[#28130a] text-left transition"
                  >
                    <span className="font-extrabold text-sm text-amber-100 uppercase tracking-wider font-['Cinzel',serif]">
                      {settings.language === 'te' ? group.teluguName : group.name} ({group.categories.length})
                    </span>
                    <ChevronDown className={`w-4 h-4 text-amber-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  {isExpanded && (
                    <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2 border-t border-amber-950">
                      {group.categories.map((cat) => (
                        <div
                          key={cat.id}
                          onClick={() => onSelectCategory(cat.id)}
                          className="cursor-pointer p-3 rounded-xl bg-[#231209] hover:bg-[#2f180d] border border-amber-900/50 flex items-center justify-between transition active:scale-98"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-xl">{cat.emoji}</span>
                            <div>
                              <h4 className="font-bold text-xs text-amber-100">
                                {settings.language === 'te' ? cat.teluguName : cat.name}
                              </h4>
                              <p className="text-[11px] text-amber-200/60 line-clamp-1">
                                {cat.description}
                              </p>
                            </div>
                          </div>
                          <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
