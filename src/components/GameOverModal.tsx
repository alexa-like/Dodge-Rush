import React, { useState } from 'react';
import { RotateCcw, Home, Trophy, Coins, Clock, Sparkles, Share2, Check, ShoppingBag } from 'lucide-react';

interface GameOverModalProps {
  score: number;
  highScore: number;
  isNewHighScore: boolean;
  coinsCollected: number;
  survivalTime: number;
  nearMisses: number;
  onRestart: () => void;
  onExit: () => void;
  onOpenShop: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  highScore,
  isNewHighScore,
  coinsCollected,
  survivalTime,
  nearMisses,
  onRestart,
  onExit,
  onOpenShop
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const text = `🚨 I scored ${score.toLocaleString()} points in Dodge Rush! Best: ${highScore.toLocaleString()} pts. Can you beat my high score? 🔥`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 z-40 overflow-y-auto">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col items-center text-center shadow-2xl relative">
        {/* New High Score Badge Header */}
        {isNewHighScore ? (
          <div className="mb-4 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(255,215,0,0.5)] animate-bounce">
            <Sparkles className="w-4 h-4 fill-current" />
            <span>NEW HIGH SCORE!</span>
          </div>
        ) : (
          <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">
            GAME OVER
          </div>
        )}

        {/* Final Score Display */}
        <div className="my-2">
          <span className="text-5xl font-black text-white tracking-tight font-mono drop-shadow-[0_4px_12px_rgba(0,240,255,0.4)]">
            {score.toLocaleString()}
          </span>
          <p className="text-xs text-slate-400 mt-1">FINAL SCORE</p>
        </div>

        {/* Stats Grid Breakdown */}
        <div className="w-full grid grid-cols-2 gap-2.5 my-5">
          {/* Best Score */}
          <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-2xl flex flex-col items-center">
            <Trophy className="w-4 h-4 text-amber-400 mb-1" />
            <span className="text-xs text-slate-400">BEST SCORE</span>
            <span className="text-sm font-bold text-white font-mono mt-0.5">{highScore.toLocaleString()}</span>
          </div>

          {/* Coins Earned */}
          <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-2xl flex flex-col items-center">
            <Coins className="w-4 h-4 text-amber-400 mb-1" />
            <span className="text-xs text-slate-400">COINS</span>
            <span className="text-sm font-bold text-amber-300 font-mono mt-0.5">+{coinsCollected}</span>
          </div>

          {/* Survival Time */}
          <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-2xl flex flex-col items-center">
            <Clock className="w-4 h-4 text-cyan-400 mb-1" />
            <span className="text-xs text-slate-400">TIME</span>
            <span className="text-sm font-bold text-cyan-200 font-mono mt-0.5">{survivalTime}s</span>
          </div>

          {/* Near Misses */}
          <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-2xl flex flex-col items-center">
            <Sparkles className="w-4 h-4 text-indigo-400 mb-1" />
            <span className="text-xs text-slate-400">NEAR MISSES</span>
            <span className="text-sm font-bold text-indigo-200 font-mono mt-0.5">{nearMisses}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-2.5">
          <button
            onClick={onRestart}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-base uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.3)] active:scale-98 transition-all hover:brightness-110"
          >
            <RotateCcw className="w-5 h-5" />
            <span>PLAY AGAIN</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onOpenShop}
              className="py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-slate-700 transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-cyan-400" />
              <span>SHOP</span>
            </button>

            <button
              onClick={handleShare}
              className="py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-slate-700 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-indigo-400" />}
              <span>{copied ? 'COPIED!' : 'SHARE'}</span>
            </button>
          </div>

          <button
            onClick={onExit}
            className="w-full py-2.5 text-slate-400 hover:text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5" />
            <span>MAIN MENU</span>
          </button>
        </div>
      </div>
    </div>
  );
};
