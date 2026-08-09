import { GameSettings, GameStats, Skin } from '../types';
import { DEFAULT_SETTINGS, DEFAULT_STATS, SKINS } from './constants';

const STORAGE_KEYS = {
  SETTINGS: 'dodge_rush_settings_v1',
  STATS: 'dodge_rush_stats_v1',
  UNLOCKED_SKINS: 'dodge_rush_unlocked_skins_v1',
  SELECTED_SKIN: 'dodge_rush_selected_skin_v1'
};

export const loadSettings = (): GameSettings => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (data) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    }
  } catch (e) {
    console.error('Failed to load settings:', e);
  }
  return DEFAULT_SETTINGS;
};

export const saveSettings = (settings: GameSettings): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
};

export const loadStats = (): GameStats => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.STATS);
    if (data) {
      return { ...DEFAULT_STATS, ...JSON.parse(data) };
    }
  } catch (e) {
    console.error('Failed to load stats:', e);
  }
  return DEFAULT_STATS;
};

export const saveStats = (stats: GameStats): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save stats:', e);
  }
};

export const loadSkins = (): Skin[] => {
  try {
    const unlockedIdsData = localStorage.getItem(STORAGE_KEYS.UNLOCKED_SKINS);
    const unlockedIds: string[] = unlockedIdsData ? JSON.parse(unlockedIdsData) : ['neon_square'];

    return SKINS.map(skin => ({
      ...skin,
      unlocked: unlockedIds.includes(skin.id)
    }));
  } catch (e) {
    console.error('Failed to load skins:', e);
    return SKINS;
  }
};

export const saveUnlockedSkins = (unlockedSkinIds: string[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.UNLOCKED_SKINS, JSON.stringify(unlockedSkinIds));
  } catch (e) {
    console.error('Failed to save unlocked skins:', e);
  }
};

export const loadSelectedSkinId = (): string => {
  try {
    const skinId = localStorage.getItem(STORAGE_KEYS.SELECTED_SKIN);
    if (skinId) return skinId;
  } catch (e) {
    console.error('Failed to load selected skin:', e);
  }
  return 'neon_square';
};

export const saveSelectedSkinId = (skinId: string): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SELECTED_SKIN, skinId);
  } catch (e) {
    console.error('Failed to save selected skin:', e);
  }
};
