import React from 'react';
import { Play, ShoppingBag, BarChart3, Settings as SettingsIcon, Trophy, Coins, ShieldAlert } from 'lucide-react';
import { GameStats, Skin } from '../types';

interface StartScreenProps {
  stats: GameStats;
  selectedSkin: Skin;
  onStartGame: () => void;
  onOpenShop: () => void;
  onOpenStats: () => void;
  onOpenSettings: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  stats,
  selectedSkin,
  onStartGame,
  onOpenShop,
  onOpenStats,
  onOpenSettings
}) => {
  return (
    <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-between p-6 z-30 overflow-y-auto">
      {/* Top Bar Stats */}
      <div className="w-full flex items-center justify-between gap-2 max-w-sm">
        {/* High Score pill */}
        <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-300 backdrop-blur-md shadow-sm">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>BEST: <strong className="text-white font-mono">{stats.highScore.toLocaleString()}</strong></span>
        </div>

        {/* Coins pill */}
        <div className="flex items-center gap-2 bg-slate-900/80 border border-amber-500/30 px-3 py-1.5 rounded-full text-xs font-semibold text-amber-300 backdrop-blur-md shadow-sm">
          <Coins className="w-4 h-4 text-amber-400" />
          <span className="font-mono">{stats.totalCoins} COINS</span>
        </div>
      </div>

      {/* Hero Branding Section */}
      <div className="flex flex-col items-center text-center my-auto py-6">
        {/* Character Icon Preview */}
        <div className="relative mb-6 group cursor-pointer" onClick={onOpenShop}>
          <div className="w-24 h-24 rounded-2xl bg-slate-900 border-2 border-cyan-400/60 flex items-center justify-center shadow-[0_0_30px_rgba(0,240,255,0.3)] transition-transform group-hover:scale-105">
            <div
              className="w-12 h-12 rounded-lg"
              style={{
                backgroundColor: selectedSkin.color,
                boxShadow: `0 0 20px ${selectedSkin.color}`
              }}
            />
          </div>
          <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-wider font-bold bg-cyan-500 text-slate-950 px-2.5 py-0.5 rounded-full whitespace-nowrap shadow-md">
            {selectedSkin.name}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-200 to-indigo-400 tracking-tight drop-shadow-[0_5px_15px_rgba(0,240,255,0.4)] font-mono">
          DODGE RUSH
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xs font-medium">
          Dodge falling obstacles, grab power-ups, and survive the rush!
        </p>

        {/* Quick controls badge */}
        <div className="mt-4 flex items-center gap-2 text-[11px] text-cyan-300/80 bg-cyan-950/40 border border-cyan-800/40 px-3 py-1 rounded-full">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Swipe or Drag to Move • Double-Tap to Dash</span>
        </div>
      </div>

      {/* Main Action Buttons */}
      <div className="w-full max-w-sm flex flex-col gap-3">
        {/* Play Button */}
        <button
          onClick={onStartGame}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-lg tracking-wider uppercase flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(0,240,255,0.4)] active:scale-98 hover:brightness-110 transition-all border border-cyan-300/30 cursor-pointer"
        >
          <Play className="w-6 h-6 fill-current" />
          <span>START RUSH</span>
        </button>

        {/* Secondary Action Grid */}
        <div className="grid grid-cols-3 gap-2.5">
          {/* Character Shop */}
          <button
            onClick={onOpenShop}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 text-slate-300 active:scale-95 transition-all cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5 text-cyan-400 mb-1" />
            <span className="text-[11px] font-semibold">SKINS</span>
          </button>

          {/* Stats */}
          <button
            onClick={onOpenStats}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 text-slate-300 active:scale-95 transition-all cursor-pointer"
          >
            <BarChart3 className="w-5 h-5 text-indigo-400 mb-1" />
            <span className="text-[11px] font-semibold">STATS</span>
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 text-slate-300 active:scale-95 transition-all cursor-pointer"
          >
            <SettingsIcon className="w-5 h-5 text-slate-400 mb-1" />
            <span className="text-[11px] font-semibold">SETTINGS</span>
          </button>
        </div>
      </div>
    </div>
  );
};
