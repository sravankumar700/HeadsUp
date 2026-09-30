import React, { useState } from 'react';
import { GameSettings, Language } from '../data/types';
import { translations } from '../data/translations';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { soundFX } from '../utils/audio';
import { 
  Volume2, 
  VolumeX, 
  Settings as SettingsIcon, 
  BarChart2, 
  Download, 
  Sparkles,
  Smartphone
} from 'lucide-react';

interface HeaderProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onOpenSettings: () => void;
  onOpenStats: () => void;
  onOpenCalibration: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  onUpdateSettings,
  onOpenSettings,
  onOpenStats,
  onOpenCalibration
}) => {
  const t = translations[settings.language];
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  const toggleSound = () => {
    const next = !settings.soundEnabled;
    soundFX.enabled = next;
    onUpdateSettings({ ...settings, soundEnabled: next });
    if (next) soundFX.playCorrect();
  };

  const cycleLanguage = () => {
    const langs: Language[] = ['tanglish', 'te', 'en'];
    const nextIdx = (langs.indexOf(settings.language) + 1) % langs.length;
    onUpdateSettings({ ...settings, language: langs[nextIdx] });
  };

  const getLangLabel = (l: Language) => {
    if (l === 'te') return 'తెలుగు';
    if (l === 'tanglish') return 'Tanglish';
    return 'English';
  };

  return (
    <header className="w-full bg-[#140c08]/90 backdrop-blur-md border-b border-amber-900/40 sticky top-0 z-30 px-3 sm:px-6 py-2.5 flex items-center justify-between">
      {/* Brand title & film ticket logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 via-red-600 to-amber-700 p-0.5 shadow-md shadow-amber-900/40 flex items-center justify-center">
          <div className="w-full h-full bg-[#120805] rounded-[10px] flex items-center justify-center">
            <span className="text-lg">🎬</span>
          </div>
        </div>
        <div>
          <h1 className="font-extrabold tracking-wider text-base sm:text-lg bg-gradient-to-r from-amber-300 via-amber-100 to-amber-400 bg-clip-text text-transparent flex items-center gap-1.5 font-['Cinzel',serif]">
            {t.appName}
            <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Tollywood
            </span>
          </h1>
          <p className="text-[11px] text-amber-200/60 font-medium hidden sm:block">
            {t.tagline}
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Language switcher button */}
        <button
          onClick={cycleLanguage}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900/80 border border-amber-800/40 text-amber-200 text-xs font-semibold transition active:scale-95 shadow-sm"
          title="Change Language"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{getLangLabel(settings.language)}</span>
        </button>

        {/* PWA Install Button */}
        {!isInstalled && isInstallable && (
          <button
            onClick={install}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-black font-bold text-xs shadow-md transition active:scale-95"
            title="Install App"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Install</span>
          </button>
        )}

        {/* iOS Install Guide trigger */}
        {!isInstalled && isIOS && (
          <button
            onClick={() => setShowIOSGuide(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-950/50 hover:bg-amber-900/60 border border-amber-700/40 text-amber-300 text-xs font-medium transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Install</span>
          </button>
        )}

        {/* Motion sensor calibration button */}
        <button
          onClick={onOpenCalibration}
          className={`p-2 rounded-lg border text-xs font-medium transition active:scale-95 ${
            settings.motionControls
              ? 'bg-amber-950/50 border-amber-800/40 text-amber-300 hover:bg-amber-900/60'
              : 'bg-zinc-900/50 border-zinc-800 text-zinc-500'
          }`}
          title="Calibrate Motion Sensor"
        >
          <Smartphone className="w-4 h-4" />
        </button>

        {/* Sound toggle */}
        <button
          onClick={toggleSound}
          className="p-2 rounded-lg bg-amber-950/50 hover:bg-amber-900/60 border border-amber-800/40 text-amber-300 text-xs font-medium transition active:scale-95"
          title={settings.soundEnabled ? 'Mute Sound' : 'Enable Sound'}
        >
          {settings.soundEnabled ? (
            <Volume2 className="w-4 h-4 text-amber-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-zinc-500" />
          )}
        </button>

        {/* Stats button */}
        <button
          onClick={onOpenStats}
          className="p-2 rounded-lg bg-amber-950/50 hover:bg-amber-900/60 border border-amber-800/40 text-amber-300 transition active:scale-95"
          title="Game Statistics"
        >
          <BarChart2 className="w-4 h-4" />
        </button>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-lg bg-amber-950/50 hover:bg-amber-900/60 border border-amber-800/40 text-amber-300 transition active:scale-95"
          title="Settings"
        >
          <SettingsIcon className="w-4 h-4" />
        </button>
      </div>

      {/* iOS Safari PWA guide popup */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-[#1a0f0a] border border-amber-700/60 p-6 shadow-2xl text-amber-100">
            <h3 className="text-lg font-bold text-amber-300 flex items-center gap-2">
              <span>📲</span> Install on iPhone / iPad
            </h3>
            <p className="mt-3 text-sm text-amber-200/80 leading-relaxed">
              1. Tap the <strong>Share</strong> icon (square with arrow) at the bottom of Safari.<br />
              2. Scroll down and select <strong>Add to Home Screen</strong>.<br />
              3. Tap <strong>Add</strong> to play offline in full screen anytime!
            </p>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full rounded-xl bg-amber-500 hover:bg-amber-400 py-2.5 text-sm font-bold text-black transition active:scale-98"
            >
              Done / Got it
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
