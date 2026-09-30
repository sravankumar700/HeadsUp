import { MotionSensitivity } from '../data/types';

export interface MotionState {
  isSupported: boolean;
  hasPermission: boolean;
  isListening: boolean;
  tiltAngle: number;       // Current relative tilt angle
  neutralOffset: number;   // Calibrated center
  rawBeta: number;
  rawGamma: number;
}

export type MotionAction = 'correct' | 'pass' | null;

export class MotionManager {
  private listener: ((action: MotionAction, angle: number) => void) | null = null;
  private isCalibrated: boolean = false;
  private neutralAngle: number = 0;
  private hasTriggered: boolean = false; // Hysteresis flag: must return to neutral before triggering again
  private lastTriggerTime: number = 0;
  private orientationEventCount: number = 0;

  public sensitivity: MotionSensitivity = 'medium';
  public isSupported: boolean = false;
  public hasPermission: boolean = false;

  constructor() {
    this.checkSupport();
  }

  public checkSupport(): boolean {
    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      this.isSupported = true;
      return true;
    }
    return false;
  }

  // Request permission (primarily for iOS Safari)
  public async requestPermission(): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    const DOE = window.DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<'granted' | 'denied'>;
    };

    if (typeof DOE?.requestPermission === 'function') {
      try {
        const response = await DOE.requestPermission();
        this.hasPermission = response === 'granted';
        return this.hasPermission;
      } catch (err) {
        console.warn('Motion permission request error:', err);
        return false;
      }
    } else {
      // Non-iOS or permission not required
      this.hasPermission = true;
      return true;
    }
  }

  private getThresholds() {
    switch (this.sensitivity) {
      case 'high':
        return { tiltDown: 18, tiltUp: -18, resetZone: 10 };
      case 'low':
        return { tiltDown: 35, tiltUp: -35, resetZone: 16 };
      case 'medium':
      default:
        return { tiltDown: 26, tiltUp: -26, resetZone: 12 };
    }
  }

  // Calibrate current orientation as neutral center
  public calibrate() {
    this.isCalibrated = false;
    this.hasTriggered = false;
  }

  public startListening(callback: (action: MotionAction, currentAngle: number) => void) {
    this.listener = callback;
    this.hasTriggered = false;
    this.orientationEventCount = 0;

    window.addEventListener('deviceorientation', this.handleOrientation, true);
  }

  public stopListening() {
    window.removeEventListener('deviceorientation', this.handleOrientation, true);
    this.listener = null;
  }

  private handleOrientation = (e: DeviceOrientationEvent) => {
    this.orientationEventCount++;

    const beta = e.beta;   // [-180, 180] Pitch
    const gamma = e.gamma; // [-90, 90] Roll

    if (beta === null && gamma === null) return;

    // Detect if screen is currently in landscape or portrait
    const isLandscape = typeof window !== 'undefined' && window.innerWidth > window.innerHeight;

    // Effective tilt angle calculation:
    // In landscape when holding against forehead:
    // Gamma (or Beta depending on left/right landscape) dictates tilting down toward floor vs tilting up toward ceiling.
    let currentTilt = 0;

    if (isLandscape) {
      // In landscape, gamma or beta tilts forward/backward
      // Math.abs(gamma) typically represents forward/backward nod
      if (Math.abs(gamma ?? 0) > Math.abs(beta ?? 0)) {
        currentTilt = gamma ?? 0;
      } else {
        currentTilt = beta ?? 0;
      }
    } else {
      // Portrait mode on forehead: beta tilts toward floor (+) or ceiling (-)
      currentTilt = beta ?? 0;
    }

    // Auto-calibrate on first 3 events if not yet calibrated
    if (!this.isCalibrated && this.orientationEventCount >= 2) {
      this.neutralAngle = currentTilt;
      this.isCalibrated = true;
    }

    const relativeAngle = currentTilt - this.neutralAngle;
    const { tiltDown, tiltUp, resetZone } = this.getThresholds();
    const now = Date.now();

    // Check if user returned to neutral zone
    if (Math.abs(relativeAngle) < resetZone) {
      this.hasTriggered = false;
    }

    // Trigger action only if debounce passed (at least 600ms) and user returned to neutral
    if (!this.hasTriggered && now - this.lastTriggerTime > 600) {
      // Tilting forward / down (towards floor): Correct
      if (relativeAngle > tiltDown) {
        this.hasTriggered = true;
        this.lastTriggerTime = now;
        if (this.listener) {
          this.listener('correct', relativeAngle);
        }
      }
      // Tilting backwards / up (towards ceiling): Pass
      else if (relativeAngle < tiltUp) {
        this.hasTriggered = true;
        this.lastTriggerTime = now;
        if (this.listener) {
          this.listener('pass', relativeAngle);
        }
      }
    }
  };
}

export const motionManager = new MotionManager();
