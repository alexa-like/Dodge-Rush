import React from 'react';
import { X, Coins, Check, Lock } from 'lucide-react';
import { Skin } from '../types';

interface ShopModalProps {
  skins: Skin[];
  selectedSkinId: string;
  totalCoins: number;
  onSelectSkin: (skinId: string) => void;
  onBuySkin: (skin: Skin) => void;
  onClose: () => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  skins,
  selectedSkinId,
  totalCoins,
  onSelectSkin,
  onBuySkin,
  onClose
}) => {
  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 z-40">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col max-h-[85vh] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>CHARACTER SHOP</span>
            </h2>
            <p className="text-xs text-slate-400">Unlock new runners with earned coins</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Coins Balance */}
            <div className="flex items-center gap-1.5 bg-slate-800/80 border border-amber-500/30 px-3 py-1 rounded-full">
              <Coins className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-amber-300 font-mono">{totalCoins}</span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Skins Grid */}
        <div className="overflow-y-auto py-4 space-y-3 pr-1">
          {skins.map(skin => {
            const isSelected = skin.id === selectedSkinId;
            const canAfford = totalCoins >= skin.price;

            return (
              <div
                key={skin.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-center gap-4 ${
                  isSelected
                    ? 'bg-cyan-950/30 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Skin Color Box */}
                <div className="w-14 h-14 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0 relative">
                  <div
                    className="w-8 h-8 rounded-md"
                    style={{
                      backgroundColor: skin.color,
                      boxShadow: `0 0 12px ${skin.color}`
                    }}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white truncate">{skin.name}</h3>
                    {isSelected && (
                      <span className="text-[10px] font-bold bg-cyan-500 text-slate-950 px-2 py-0.2 rounded-full">
                        EQUIPPED
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{skin.description}</p>
                  {skin.specialAbility && (
                    <span className="inline-block mt-1 text-[10px] text-amber-300 font-medium">
                      ✨ {skin.specialAbility}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="shrink-0">
                  {skin.unlocked ? (
                    <button
                      onClick={() => onSelectSkin(skin.id)}
                      disabled={isSelected}
                      className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all ${
                        isSelected
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'bg-slate-800 text-white hover:bg-cyan-600'
                      }`}
                    >
                      {isSelected ? <Check className="w-3.5 h-3.5" /> : 'EQUIP'}
                    </button>
                  ) : (
                    <button
                      onClick={() => onBuySkin(skin)}
                      disabled={!canAfford}
                      className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                        canAfford
                          ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 cursor-pointer shadow-md shadow-amber-500/20'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>{skin.price}</span>
                      <Coins className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
