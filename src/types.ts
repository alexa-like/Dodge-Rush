export type ControlMode = 'touch_drag' | 'virtual_buttons' | 'joystick';

export type PowerUpType = 'shield' | 'slow_mo' | 'magnet' | 'nuke' | 'double_score';

export type ObstacleType = 'standard' | 'zigzag' | 'fast_spike' | 'splitter' | 'homing' | 'laser_warning';

export interface Skin {
  id: string;
  name: string;
  description: string;
  price: number;
  unlocked: boolean;
  color: string;
  secondaryColor: string;
  trailColor: string;
  shape: 'square' | 'ship' | 'orb' | 'mech' | 'phoenix' | 'vortex';
  specialAbility?: string;
}

export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  vx: number;
  shieldActive: boolean;
  magnetActive: boolean;
  slowMoActive: boolean;
  doubleScoreActive: boolean;
  dashCooldown: number;
  isDashing: boolean;
  dashTimeRemaining: number;
}

export interface Obstacle {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  vx: number;
  type: ObstacleType;
  color: string;
  rotation: number;
  rotationSpeed: number;
  warningTime?: number; // for laser/fast spike warning
  health?: number;
  hasSplit?: boolean;
}

export interface Item {
  id: string;
  x: number;
  y: number;
  radius: number;
  type: 'coin' | PowerUpType;
  value: number;
  vy: number;
  rotation: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  shape?: 'circle' | 'square' | 'star' | 'spark';
}

export interface GameStats {
  highScore: number;
  totalCoins: number;
  totalGamesPlayed: number;
  totalDodges: number;
  totalCoinsCollected: number;
  longestSurvivalTime: number; // in seconds
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  vibrationEnabled: boolean;
  controlMode: ControlMode;
  sensitivity: number;
}

export interface ActivePowerUp {
  type: PowerUpType;
  duration: number; // in milliseconds remaining
  maxDuration: number;
}

export type GameState = 'MENU' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';
