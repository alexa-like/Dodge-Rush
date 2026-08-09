import React, { useState } from 'react';
import { X, Volume2, VolumeX, Music, Smartphone, Vibrate, Info, PackageCheck } from 'lucide-react';
import { GameSettings, ControlMode } from '../types';

interface SettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClose
}) => {
  const [showApkGuide, setShowApkGuide] = useState(false);

  const toggleSound = () => {
    onUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled });
  };

  const toggleMusic = () => {
    onUpdateSettings({ ...settings, musicEnabled: !settings.musicEnabled });
  };

  const toggleVibration = () => {
    onUpdateSettings({ ...settings, vibrationEnabled: !settings.vibrationEnabled });
  };

  const setControlMode = (mode: ControlMode) => {
    onUpdateSettings({ ...settings, controlMode: mode });
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 z-40 overflow-y-auto">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col shadow-2xl my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white">SETTINGS</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Options */}
        <div className="py-4 space-y-4">
          {/* Audio Toggles */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Audio & Haptics</span>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={toggleSound}
                className={`p-3 rounded-2xl border flex items-center justify-between text-xs font-semibold transition-all ${
                  settings.soundEnabled
                    ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300'
                    : 'bg-slate-950/60 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-2">
                  {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
                  <span>Sound FX</span>
                </div>
                <span className="text-[10px] uppercase font-bold">{settings.soundEnabled ? 'ON' : 'OFF'}</span>
              </button>

              <button
                onClick={toggleMusic}
                className={`p-3 rounded-2xl border flex items-center justify-between text-xs font-semibold transition-all ${
                  settings.musicEnabled
                    ? 'bg-indigo-950/40 border-indigo-500/50 text-indigo-300'
                    : 'bg-slate-950/60 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-indigo-400" />
                  <span>Music</span>
                </div>
                <span className="text-[10px] uppercase font-bold">{settings.musicEnabled ? 'ON' : 'OFF'}</span>
              </button>
            </div>

            <button
              onClick={toggleVibration}
              className={`w-full p-3 rounded-2xl border flex items-center justify-between text-xs font-semibold transition-all ${
                settings.vibrationEnabled
                  ? 'bg-amber-950/40 border-amber-500/50 text-amber-300'
                  : 'bg-slate-950/60 border-slate-800 text-slate-500'
              }`}
            >
              <div className="flex items-center gap-2">
                <Vibrate className="w-4 h-4 text-amber-400" />
                <span>Haptic Vibration</span>
              </div>
              <span className="text-[10px] uppercase font-bold">{settings.vibrationEnabled ? 'ON' : 'OFF'}</span>
            </button>
          </div>

          {/* Controls Selection */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Control Scheme</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setControlMode('touch_drag')}
                className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all ${
                  settings.controlMode === 'touch_drag'
                    ? 'bg-cyan-950/50 border-cyan-400 text-white shadow-md'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-5 h-5 text-cyan-400" />
                <span className="text-xs font-bold">Touch / Drag</span>
                <span className="text-[10px] text-slate-400">Direct Finger Follow</span>
              </button>

              <button
                onClick={() => setControlMode('virtual_buttons')}
                className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all ${
                  settings.controlMode === 'virtual_buttons'
                    ? 'bg-cyan-950/50 border-cyan-400 text-white shadow-md'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex gap-1 text-cyan-400 font-bold text-xs">◀ ▶</div>
                <span className="text-xs font-bold">On-Screen Buttons</span>
                <span className="text-[10px] text-slate-400">Left & Right Arrows</span>
              </button>
            </div>
          </div>

          {/* Android Packaging Info Accordion */}
          <div className="pt-2">
            <button
              onClick={() => setShowApkGuide(!showApkGuide)}
              className="w-full p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-slate-300 text-xs font-medium flex items-center justify-between hover:bg-slate-950 transition-colors"
            >
              <div className="flex items-center gap-2">
                <PackageCheck className="w-4 h-4 text-emerald-400" />
                <span>Export as Android App (APK) Info</span>
              </div>
              <Info className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {showApkGuide && (
              <div className="mt-2 p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 leading-relaxed space-y-1.5 font-sans">
                <p className="font-semibold text-emerald-400">📱 How to package as Android App:</p>
                <ol className="list-decimal list-inside space-y-1 text-slate-400">
                  <li>Export / download project files (using Settings menu).</li>
                  <li>Run <code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded">npx @capacitor/cli init</code> in project folder.</li>
                  <li>Run <code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded">npm run build</code> to produce <code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded">dist/</code>.</li>
                  <li>Add android target: <code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded">npx cap add android</code> and sync.</li>
                  <li>Open in Android Studio to build APK or install on phone!</li>
                </ol>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-700 transition-colors mt-2"
        >
          DONE
        </button>
      </div>
    </div>
  );
};
