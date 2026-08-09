import React from 'react';
import { Pause, Trophy, Coins, Zap } from 'lucide-react';
import { PowerUpType } from '../types';

interface HUDProps {
  score: number;
  highScore: number;
  coins: number;
  level: number;
  dashPct: number;
  activePowerUps: { type: PowerUpType; duration: number; maxDuration: number }[];
  onPause: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  score,
  highScore,
  coins,
  level,
  dashPct,
  activePowerUps,
  onPause
}) => {
  const powerUpIcons: { [key in PowerUpType]: { label: string; color: string; icon: string } } = {
    shield: { label: 'Shield', color: 'bg-cyan-500', icon: '🛡️' },
    slow_mo: { label: 'Slow Mo', color: 'bg-purple-500', icon: '⏱️' },
    magnet: { label: 'Magnet', color: 'bg-amber-400', icon: '🧲' },
    nuke: { label: 'Nuke', color: 'bg-red-500', icon: '💥' },
    double_score: { label: '2X Score', color: 'bg-emerald-400', icon: '⚡' }
  };

  return (
    <div className="absolute top-0 left-0 right-0 p-4 pointer-events-none flex flex-col gap-2 z-20">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between gap-2">
        {/* Score & High Score */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-2xl font-black tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,240,255,0.6)] font-mono">
              {score.toLocaleString()}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-semibold tracking-wider">
              LVL {level}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
            <Trophy className="w-3 h-3 text-amber-400" />
            <span>BEST: {Math.max(score, highScore).toLocaleString()}</span>
          </div>
        </div>

        {/* Right side: Coins & Pause button */}
        <div className="flex items-center gap-3 pointer-events-auto">
          {/* Coins pill */}
          <div className="flex items-center gap-1.5 bg-slate-900/80 border border-amber-500/30 px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg shadow-amber-500/10">
            <Coins className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-sm font-bold text-amber-300 font-mono">{coins}</span>
          </div>

          {/* Pause Button */}
          <button
            onClick={onPause}
            className="p-2.5 rounded-full bg-slate-900/80 border border-slate-700 text-slate-200 active:scale-95 transition-transform backdrop-blur-md shadow-lg hover:border-cyan-400"
            aria-label="Pause Game"
          >
            <Pause className="w-5 h-5 text-cyan-300" />
          </button>
        </div>
      </div>

      {/* Dash Cooldown Bar */}
      <div className="w-full max-w-[180px] bg-slate-950/80 border border-slate-800 rounded-full h-2.5 overflow-hidden p-0.5 backdrop-blur-sm shadow-inner">
        <div
          className={`h-full rounded-full transition-all duration-100 ${
            dashPct >= 100
              ? 'bg-gradient-to-r from-amber-400 to-cyan-400 shadow-[0_0_10px_rgba(255,215,0,0.8)] animate-pulse'
              : 'bg-cyan-500/60'
          }`}
          style={{ width: `${Math.min(100, dashPct)}%` }}
        />
      </div>

      {/* Active Power-Up Timers list */}
      {activePowerUps.length > 0 && (
        <div className="flex flex-col gap-1.5 mt-1">
          {activePowerUps.map(p => {
            const info = powerUpIcons[p.type];
            const pct = Math.max(0, Math.min(100, (p.duration / p.maxDuration) * 100));
            return (
              <div
                key={p.type}
                className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/60 px-2.5 py-1 rounded-lg backdrop-blur-md w-fit shadow-md"
              >
                <span className="text-sm">{info.icon}</span>
                <span className="text-xs font-semibold text-slate-200">{info.label}</span>
                <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden border border-slate-700">
                  <div
                    className={`h-full ${info.color} transition-all duration-100`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
