import React, { useEffect, useState } from 'react';
import { motionManager, MotionAction } from '../utils/motion';
import { soundFX } from '../utils/audio';
import { X, Smartphone, Check, Sparkles, AlertCircle, Compass } from 'lucide-react';

interface SensorCalibrationModalProps {
  onClose: () => void;
}

export const SensorCalibrationModal: React.FC<SensorCalibrationModalProps> = ({ onClose }) => {
  const [currentAngle, setCurrentAngle] = useState<number>(0);
  const [lastAction, setLastAction] = useState<MotionAction>(null);
  const [isSupported, setIsSupported] = useState<boolean>(motionManager.isSupported);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(motionManager.hasPermission);

  useEffect(() => {
    setIsSupported(motionManager.checkSupport());

    motionManager.startListening((action, angle) => {
      setCurrentAngle(Math.round(angle));
      if (action) {
        setLastAction(action);
        if (action === 'correct') {
          soundFX.playCorrect();
        } else if (action === 'pass') {
          soundFX.playPass();
        }
        setTimeout(() => setLastAction(null), 1000);
      }
    });

    return () => {
      motionManager.stopListening();
    };
  }, []);

  const handleRequestPermission = async () => {
    const granted = await motionManager.requestPermission();
    setPermissionGranted(granted);
    if (granted) {
      soundFX.playCorrect();
    }
  };

  const handleCalibrate = () => {
    motionManager.calibrate();
    soundFX.playCountdown(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-3xl bg-gradient-to-b from-[#21110a] to-[#120704] border border-amber-600/40 p-5 sm:p-7 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-900/40 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-amber-100">
                Motion Sensor Calibration
              </h2>
              <p className="text-xs text-amber-300/70">
                Test forehead gestures before playing
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

        {/* Live Tilt Bubble Meter */}
        <div className="p-4 rounded-2xl bg-black/40 border border-amber-900/50 space-y-3 text-center">
          <div className="flex items-center justify-between text-xs text-amber-300/80 font-bold">
            <span>Tilt Meter</span>
            <span className="font-mono text-amber-400 text-sm">
              {currentAngle > 0 ? `+${currentAngle}°` : `${currentAngle}°`}
            </span>
          </div>

          {/* Interactive Tilt Bar */}
          <div className="relative h-8 bg-zinc-900 rounded-full border border-amber-900/60 overflow-hidden flex items-center justify-center">
            {/* Center target indicator */}
            <div className="absolute w-0.5 h-full bg-amber-500/40 z-10" />

            {/* Moving Bubble */}
            <div
              className={`w-6 h-6 rounded-full shadow-lg transition-transform duration-100 ${
                lastAction === 'correct'
                  ? 'bg-emerald-400 scale-125'
                  : lastAction === 'pass'
                    ? 'bg-amber-400 scale-125'
                    : 'bg-amber-500'
              }`}
              style={{
                transform: `translateX(${Math.max(-120, Math.min(120, currentAngle * 3))}px)`
              }}
            />
          </div>

          {/* Action Trigger Indicator */}
          <div className="h-8 flex items-center justify-center">
            {lastAction === 'correct' && (
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-300 font-extrabold text-xs animate-bounce">
                ✓ NOD DOWN DETECTED: CORRECT!
              </span>
            )}
            {lastAction === 'pass' && (
              <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500 text-amber-300 font-extrabold text-xs animate-bounce">
                ⬆ LOOK UP DETECTED: PASS!
              </span>
            )}
            {!lastAction && (
              <span className="text-[11px] text-amber-300/60">
                Hold phone to forehead and nod down or look up to test!
              </span>
            )}
          </div>
        </div>

        {/* Permission Request if needed */}
        {!permissionGranted && (
          <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-700/50 flex items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="font-bold text-amber-200">Sensor Permission</span>
              <p className="text-[11px] text-amber-300/70">Required on iOS / modern phones</p>
            </div>
            <button
              onClick={handleRequestPermission}
              className="px-3 py-1.5 rounded-xl bg-amber-500 text-black font-bold text-xs"
            >
              Grant Access
            </button>
          </div>
        )}

        {/* Calibration instructions */}
        <div className="space-y-2 text-xs text-amber-200/80 leading-relaxed bg-[#1b0d07] p-3.5 rounded-2xl border border-amber-900/40">
          <p className="font-bold text-amber-300">How to Hold & Calibrate:</p>
          <ol className="list-decimal list-inside space-y-1 text-amber-200/70">
            <li>Hold phone screen firmly against your forehead facing outward.</li>
            <li>Stand upright in neutral position, then tap <strong>Set Neutral Angle</strong>.</li>
            <li>Tilt head <strong>DOWN</strong> to score Correct; tilt head <strong>UP</strong> to Pass.</li>
            <li>If motion is not working on your device, <strong>Tap Mode</strong> is automatically available during gameplay.</li>
          </ol>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={handleCalibrate}
            className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 text-black font-extrabold text-xs tracking-wider uppercase shadow-md"
          >
            Set Neutral Angle
          </button>
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-2xl bg-black/40 border border-amber-900/60 text-amber-300 font-bold text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
