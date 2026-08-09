import React from 'react';
import { Play, RotateCcw, Home, Volume2, VolumeX, Music } from 'lucide-react';
import { GameSettings } from '../types';

interface PauseModalProps {
  settings: GameSettings;
  onResume: () => void;
  onRestart: () => void;
  onExit: () => void;
  onToggleSound: () => void;
  onToggleMusic: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  settings,
  onResume,
  onRestart,
  onExit,
  onToggleSound,
  onToggleMusic
}) => {
  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-40">
      <div className="w-full max-w-xs bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col items-center text-center shadow-2xl">
        <h2 className="text-2xl font-black text-white tracking-wide mb-1 font-mono">GAME PAUSED</h2>
        <p className="text-xs text-slate-400 mb-6">Take a breath, then jump right back in!</p>

        {/* Primary Controls */}
        <div className="w-full space-y-2.5">
          <button
            onClick={onResume}
            className="w-full py-3.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 hover:bg-cyan-400 active:scale-98 transition-all shadow-lg shadow-cyan-500/20"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>RESUME</span>
          </button>

          <button
            onClick={onRestart}
            className="w-full py-3.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-700 active:scale-98 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>RESTART</span>
          </button>

          <button
            onClick={onExit}
            className="w-full py-3 rounded-xl bg-transparent text-slate-400 font-semibold text-xs flex items-center justify-center gap-2 hover:text-white transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>MAIN MENU</span>
          </button>
        </div>

        {/* Audio Quick Toggles */}
        <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-800/80 w-full justify-center">
          <button
            onClick={onToggleSound}
            className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-semibold transition-all ${
              settings.soundEnabled
                ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300'
                : 'bg-slate-800 border-slate-700 text-slate-500'
            }`}
          >
            {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>SFX</span>
          </button>

          <button
            onClick={onToggleMusic}
            className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-semibold transition-all ${
              settings.musicEnabled
                ? 'bg-indigo-950/40 border-indigo-500/50 text-indigo-300'
                : 'bg-slate-800 border-slate-700 text-slate-500'
            }`}
          >
            <Music className="w-4 h-4" />
            <span>MUSIC</span>
          </button>
        </div>
      </div>
    </div>
  );
};
