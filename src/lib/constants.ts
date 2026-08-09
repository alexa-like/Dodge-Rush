import { Skin, GameSettings, GameStats } from '../types';

export const SKINS: Skin[] = [
  {
    id: 'neon_square',
    name: 'Neon Runner',
    description: 'The agile classic block with bright cyber glow.',
    price: 0,
    unlocked: true,
    color: '#00f0ff',
    secondaryColor: '#7000ff',
    trailColor: 'rgba(0, 240, 255, 0.4)',
    shape: 'square'
  },
  {
    id: 'cyber_ship',
    name: 'Cyber Ship',
    description: 'Sleek fighter vessel equipped with thruster particles.',
    price: 150,
    unlocked: false,
    color: '#ff0055',
    secondaryColor: '#ff9900',
    trailColor: 'rgba(255, 0, 85, 0.5)',
    shape: 'ship'
  },
  {
    id: 'speed_orb',
    name: 'Plasma Orb',
    description: 'Energetic sphere with a smooth flowing aura.',
    price: 300,
    unlocked: false,
    color: '#00ff88',
    secondaryColor: '#00ccff',
    trailColor: 'rgba(0, 255, 136, 0.5)',
    shape: 'orb'
  },
  {
    id: 'mech_bot',
    name: 'Mech Bot',
    description: 'Heavy armor plated runner with custom shield flare.',
    price: 500,
    unlocked: false,
    color: '#ffdd00',
    secondaryColor: '#ff3300',
    trailColor: 'rgba(255, 221, 0, 0.5)',
    shape: 'mech'
  },
  {
    id: 'golden_phoenix',
    name: 'Golden Phoenix',
    description: 'Legendary radiant aura with sparkling gold trail.',
    price: 1000,
    unlocked: false,
    color: '#ffd700',
    secondaryColor: '#ffffff',
    trailColor: 'rgba(255, 215, 0, 0.7)',
    shape: 'phoenix',
    specialAbility: 'Coin Magnet range +25%'
  },
  {
    id: 'vortex_glider',
    name: 'Void Glider',
    description: 'Mysterious shadow ship emitting dark matter particles.',
    price: 1500,
    unlocked: false,
    color: '#b026ff',
    secondaryColor: '#00ffff',
    trailColor: 'rgba(176, 38, 255, 0.7)',
    shape: 'vortex',
    specialAbility: 'Dash cooldown reduced by 15%'
  }
];

export const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  musicEnabled: true,
  vibrationEnabled: true,
  controlMode: 'touch_drag',
  sensitivity: 1.2
};

export const DEFAULT_STATS: GameStats = {
  highScore: 0,
  totalCoins: 0,
  totalGamesPlayed: 0,
  totalDodges: 0,
  totalCoinsCollected: 0,
  longestSurvivalTime: 0
};

export const GAME_CANVAS_ASPECT_RATIO = 9 / 16; // Mobile portrait orientation ratio
