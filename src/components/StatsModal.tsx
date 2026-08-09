import React from 'react';
import { X, Trophy, Coins, Gamepad2, Sparkles, Clock } from 'lucide-react';
import { GameStats } from '../types';

interface StatsModalProps {
  stats: GameStats;
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ stats, onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 z-40">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>LIFETIME STATS</span>
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats List */}
        <div className="py-4 space-y-3 font-mono">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-2.5">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-slate-300 font-sans">HIGH SCORE</span>
            </div>
            <span className="text-sm font-black text-amber-300">{stats.highScore.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-2.5">
              <Coins className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-slate-300 font-sans">TOTAL COINS COLLECTED</span>
            </div>
            <span className="text-sm font-black text-amber-300">{stats.totalCoinsCollected.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-2.5">
              <Gamepad2 className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-slate-300 font-sans">GAMES PLAYED</span>
            </div>
            <span className="text-sm font-black text-cyan-200">{stats.totalGamesPlayed.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-xs text-slate-300 font-sans">TOTAL NEAR MISSES</span>
            </div>
            <span className="text-sm font-black text-indigo-200">{stats.totalDodges.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-slate-300 font-sans">LONGEST SURVIVAL</span>
            </div>
            <span className="text-sm font-black text-emerald-300">{stats.longestSurvivalTime}s</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-700 transition-colors mt-2"
        >
          CLOSE
        </button>
      </div>
    </div>
  );
};
