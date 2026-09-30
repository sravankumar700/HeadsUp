import React from 'react';
import { GameSettings, Language } from '../data/types';
import { translations } from '../data/translations';
import { X, Settings as SettingsIcon, Smartphone, AlertTriangle } from 'lucide-react';

interface SettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (settings: GameSettings) => void;
  onOpenCalibration: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onOpenCalibration,
  onClose
}) => {
  const t = translations[settings.language];

  const handleToggleMotion = () => {
    onUpdateSettings({ ...settings, motionControls: !settings.motionControls });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-3xl bg-[#1c0d07] border border-amber-600/40 p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-900/40 pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <SettingsIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-black text-amber-100 font-['Cinzel',serif]">
                Settings
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-amber-400 hover:text-white hover:bg-amber-950/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings List */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
          {/* Language Selector */}
          <div className="space-y-1.5">
            <label className="font-bold text-amber-300 uppercase tracking-wider">
              {t.language}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'tanglish', label: 'Tanglish (Mix)' },
                { id: 'te', label: 'తెలుగు (Telugu)' },
                { id: 'en', label: 'English' }
              ].map((lang) => (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => onUpdateSettings({ ...settings, language: lang.id as Language })}
                  className={`py-2 px-1 rounded-xl font-bold transition ${
                    settings.language === lang.id
                      ? 'bg-amber-500 text-black shadow-md'
                      : 'bg-black/40 border border-amber-900/60 text-amber-200 hover:bg-[#28140c]'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Default Round Timer */}
          <div className="space-y-1.5">
            <label className="font-bold text-amber-300 uppercase tracking-wider">
              Default Game Timer
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {[30, 45, 60, 90, 120].map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => onUpdateSettings({ ...settings, timerDuration: sec })}
                  className={`py-2 rounded-xl font-black ${
                    settings.timerDuration === sec
                      ? 'bg-amber-500 text-black'
                      : 'bg-black/40 border border-amber-900/60 text-amber-200'
                  }`}
                >
                  {sec}s
                </button>
              ))}
            </div>
          </div>

          {/* Motion Controls (Default OFF, Manual ON) */}
          <div className="p-3.5 rounded-2xl bg-black/40 border border-amber-900/60 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-amber-400" />
                  <h4 className="font-bold text-amber-100">Motion Controls</h4>
                </div>
                <p className="text-[11px] text-amber-300/60">
                  {settings.motionControls ? 'ON (Tilt Phone)' : 'OFF (Manual Buttons Active)'}
                </p>
              </div>

              <button
                type="button"
                onClick={handleToggleMotion}
                className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                  settings.motionControls ? 'bg-amber-500' : 'bg-zinc-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.motionControls ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {settings.motionControls && (
              <div className="pt-2 border-t border-amber-900/50 space-y-2">
                <div className="flex items-center gap-1.5 text-amber-300 text-[11px] bg-amber-950/50 p-2 rounded-xl border border-amber-800/40">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Motion mode may trigger actions when you tilt the phone.</span>
                </div>
                <button
                  type="button"
                  onClick={onOpenCalibration}
                  className="text-amber-400 underline font-bold"
                >
                  Calibrate Sensor Sensitivity
                </button>
              </div>
            )}
          </div>

          {/* Clues to Explainer Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-black/40 border border-amber-900/60">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base">💡</span>
                <h4 className="font-bold text-amber-100">Clues for Explainer</h4>
              </div>
              <p className="text-[11px] text-amber-300/60 mt-0.5">
                Show hints (lead cast, year, director) to help friends give clues
              </p>
            </div>
            <button
              type="button"
              onClick={() => onUpdateSettings({ ...settings, showClues: settings.showClues === false ? true : false })}
              className={`w-12 h-6 rounded-full transition-colors relative p-1 shrink-0 ${
                settings.showClues !== false ? 'bg-amber-500' : 'bg-zinc-800'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.showClues !== false ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Sound & Haptics */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-black/40 border border-amber-900/60">
              <span className="font-bold text-amber-100">Sound</span>
              <button
                type="button"
                onClick={() => onUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled })}
                className={`w-10 h-5 rounded-full transition-colors relative p-0.5 ${
                  settings.soundEnabled ? 'bg-amber-500' : 'bg-zinc-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-black/40 border border-amber-900/60">
              <span className="font-bold text-amber-100">Haptics</span>
              <button
                type="button"
                onClick={() => onUpdateSettings({ ...settings, hapticEnabled: !settings.hapticEnabled })}
                className={`w-10 h-5 rounded-full transition-colors relative p-0.5 ${
                  settings.hapticEnabled ? 'bg-amber-500' : 'bg-zinc-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.hapticEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm tracking-wider uppercase shadow-md"
          >
            {t.save} & {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
