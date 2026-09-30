import React, { useEffect, useState } from 'react';
import { GameSettings, Team } from '../data/types';
import { soundFX } from '../utils/audio';

interface CountdownScreenProps {
  settings: GameSettings;
  team: Team | null;
  categoryName: string;
  roundNumber?: number;
  onCountdownComplete: () => void;
}

export const CountdownScreen: React.FC<CountdownScreenProps> = ({
  settings,
  team,
  categoryName,
  roundNumber,
  onCountdownComplete
}) => {
  const [count, setCount] = useState<number>(3);
  const [isGo, setIsGo] = useState<boolean>(false);

  useEffect(() => {
    // Sound for initial count 3
    soundFX.playCountdown(false);

    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev === 1) {
          setIsGo(true);
          soundFX.playCountdown(true);
          setTimeout(() => {
            onCountdownComplete();
          }, 600);
          clearInterval(interval);
          return 0;
        } else {
          soundFX.playCountdown(false);
          return prev - 1;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onCountdownComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 text-amber-50 p-6 select-none overflow-hidden">
      {/* Decorative pulse background */}
      <div className="absolute w-96 h-96 rounded-full bg-amber-500/10 blur-3xl animate-pulse pointer-events-none" />

      {/* Top Banner Info */}
      <div className="text-center space-y-1 z-10 mb-8">
        {team && (
          <div className="inline-block px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-extrabold text-sm tracking-wider uppercase mb-2">
            Team: {team.name} {roundNumber ? `• Round ${roundNumber}` : ''}
          </div>
        )}
        <h3 className="text-lg font-bold text-amber-300/80">
          Deck: {categoryName}
        </h3>
        <p className="text-base sm:text-lg text-amber-100 font-semibold animate-bounce mt-2">
          📱 Place phone on your forehead facing friends!
        </p>
      </div>

      {/* Giant Animated Number */}
      <div className="relative z-10 flex items-center justify-center w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-gradient-to-br from-amber-500/20 via-red-900/30 to-amber-950/40 border-4 border-amber-500/40 shadow-2xl shadow-amber-900/50">
        <span className={`font-black font-['Cinzel',serif] tracking-tighter ${
          isGo 
            ? 'text-6xl sm:text-8xl text-emerald-400 scale-110 transition-transform duration-200' 
            : 'text-7xl sm:text-9xl text-amber-300 animate-pulse'
        }`}>
          {isGo ? 'GO!' : count}
        </span>
      </div>

      {/* Forehead posture illustration */}
      <div className="z-10 mt-10 text-center max-w-sm space-y-2">
        <div className="flex items-center justify-center gap-6 text-sm font-bold text-amber-200/80">
          <span className="flex items-center gap-1.5 text-emerald-300">
            ⬇️ Nod Down = Got It
          </span>
          <span className="flex items-center gap-1.5 text-amber-300">
            ⬆️ Look Up = Pass
          </span>
        </div>
        <p className="text-xs text-amber-300/60">
          Screen must face your friends. You must NOT see the screen!
        </p>

        {/* Quick Skip button */}
        <button
          onClick={() => {
            soundFX.playCountdown(true);
            onCountdownComplete();
          }}
          className="mt-4 px-5 py-2 rounded-xl bg-amber-950/60 hover:bg-amber-900/60 border border-amber-700/40 text-amber-300 text-xs font-bold transition"
        >
          Skip Countdown & Play Now
        </button>
      </div>
    </div>
  );
};
