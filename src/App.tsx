import React, { useState, useEffect } from 'react';
import { GameState, GameSettings, GameStats, Skin, PowerUpType } from './types';
import { loadSettings, saveSettings, loadStats, saveStats, loadSkins, saveUnlockedSkins, loadSelectedSkinId, saveSelectedSkinId } from './lib/storage';
import { soundEngine } from './lib/audio';
import { GameCanvas } from './components/GameCanvas';
import { HUD } from './components/HUD';
import { StartScreen } from './components/StartScreen';
import { ShopModal } from './components/ShopModal';
import { PauseModal } from './components/PauseModal';
import { GameOverModal } from './components/GameOverModal';
import { StatsModal } from './components/StatsModal';
import { SettingsModal } from './components/SettingsModal';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('MENU');

  // Persistence States
  const [settings, setSettings] = useState<GameSettings>(loadSettings);
  const [stats, setStats] = useState<GameStats>(loadStats);
  const [skins, setSkins] = useState<Skin[]>(loadSkins);
  const [selectedSkinId, setSelectedSkinId] = useState<string>(loadSelectedSkinId);

  // Active Modals
  const [activeModal, setActiveModal] = useState<'shop' | 'stats' | 'settings' | null>(null);

  // Live HUD States
  const [currentScore, setCurrentScore] = useState(0);
  const [currentCoins, setCurrentCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [dashPct, setDashPct] = useState(100);
  const [activePowerUps, setActivePowerUps] = useState<{ type: PowerUpType; duration: number; maxDuration: number }[]>([]);

  // Last Run Stats for Game Over Screen
  const [lastRunStats, setLastRunStats] = useState({
    finalScore: 0,
    isNewHighScore: false,
    coinsCollected: 0,
    survivalTime: 0,
    nearMisses: 0
  });

  const selectedSkin = skins.find(s => s.id === selectedSkinId) || skins[0];

  // Sync BGM music state
  useEffect(() => {
    if (gameState === 'PLAYING' && settings.musicEnabled) {
      soundEngine.startMusic(true);
    } else {
      soundEngine.stopMusic();
    }
  }, [gameState, settings.musicEnabled]);

  // Start Game
  const handleStartGame = () => {
    soundEngine.playClick(settings.soundEnabled);
    setGameState('PLAYING');
    setCurrentScore(0);
    setCurrentCoins(0);
    setCurrentLevel(1);
    setActiveModal(null);
  };

  // Pause Game
  const handlePause = () => {
    soundEngine.playClick(settings.soundEnabled);
    setGameState('PAUSED');
  };

  // Resume Game
  const handleResume = () => {
    soundEngine.playClick(settings.soundEnabled);
    setGameState('PLAYING');
  };

  // Restart Game
  const handleRestart = () => {
    soundEngine.playClick(settings.soundEnabled);
    setGameState('PLAYING');
    setCurrentScore(0);
    setCurrentCoins(0);
    setCurrentLevel(1);
  };

  // Exit to Menu
  const handleExitToMenu = () => {
    soundEngine.playClick(settings.soundEnabled);
    setGameState('MENU');
    setActiveModal(null);
  };

  // Handle Game Over
  const handleGameOver = (
    finalScore: number,
    coinsCollected: number,
    survivalTime: number,
    nearMisses: number
  ) => {
    const isNewHighScore = finalScore > stats.highScore;
    const newHighScore = Math.max(stats.highScore, finalScore);
    const newTotalCoins = stats.totalCoins + coinsCollected;
    const newTotalGames = stats.totalGamesPlayed + 1;
    const newTotalDodges = stats.totalDodges + nearMisses;
    const newTotalCoinsCollected = stats.totalCoinsCollected + coinsCollected;
    const newLongestTime = Math.max(stats.longestSurvivalTime, survivalTime);

    const updatedStats: GameStats = {
      highScore: newHighScore,
      totalCoins: newTotalCoins,
      totalGamesPlayed: newTotalGames,
      totalDodges: newTotalDodges,
      totalCoinsCollected: newTotalCoinsCollected,
      longestSurvivalTime: newLongestTime
    };

    setStats(updatedStats);
    saveStats(updatedStats);

    setLastRunStats({
      finalScore,
      isNewHighScore,
      coinsCollected,
      survivalTime,
      nearMisses
    });

    setGameState('GAME_OVER');
  };

  // Skin purchasing
  const handleBuySkin = (skin: Skin) => {
    if (stats.totalCoins >= skin.price) {
      soundEngine.playPowerUp(settings.soundEnabled);
      const newCoins = stats.totalCoins - skin.price;
      const updatedStats = { ...stats, totalCoins: newCoins };
      setStats(updatedStats);
      saveStats(updatedStats);

      const updatedSkins = skins.map(s => (s.id === skin.id ? { ...s, unlocked: true } : s));
      setSkins(updatedSkins);
      const unlockedIds = updatedSkins.filter(s => s.unlocked).map(s => s.id);
      saveUnlockedSkins(unlockedIds);

      // Equip newly bought skin
      setSelectedSkinId(skin.id);
      saveSelectedSkinId(skin.id);
    }
  };

  // Skin selection
  const handleSelectSkin = (skinId: string) => {
    soundEngine.playClick(settings.soundEnabled);
    setSelectedSkinId(skinId);
    saveSelectedSkinId(skinId);
  };

  // Settings update
  const handleUpdateSettings = (newSettings: GameSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  return (
    <div className="w-screen h-screen bg-slate-950 flex items-center justify-center overflow-hidden p-0 sm:p-4 font-sans select-none">
      {/* Mobile viewport frame container */}
      <div className="relative w-full h-full max-w-md max-h-[900px] sm:rounded-3xl border-0 sm:border-4 sm:border-slate-800 bg-slate-950 overflow-hidden shadow-2xl flex flex-col">
        {/* Active Game Canvas */}
        <GameCanvas
          gameState={gameState}
          settings={settings}
          selectedSkin={selectedSkin}
          onGameOver={handleGameOver}
          onUpdateScore={(s, c, l) => {
            setCurrentScore(s);
            setCurrentCoins(c);
            setCurrentLevel(l);
          }}
          onPowerUpChange={setActivePowerUps}
          onDashCooldownChange={setDashPct}
        />

        {/* HUD overlay when playing */}
        {gameState === 'PLAYING' && (
          <HUD
            score={currentScore}
            highScore={stats.highScore}
            coins={currentCoins}
            level={currentLevel}
            dashPct={dashPct}
            activePowerUps={activePowerUps}
            onPause={handlePause}
          />
        )}

        {/* Start Screen Menu */}
        {gameState === 'MENU' && (
          <StartScreen
            stats={stats}
            selectedSkin={selectedSkin}
            onStartGame={handleStartGame}
            onOpenShop={() => setActiveModal('shop')}
            onOpenStats={() => setActiveModal('stats')}
            onOpenSettings={() => setActiveModal('settings')}
          />
        )}

        {/* Pause Screen Overlay */}
        {gameState === 'PAUSED' && (
          <PauseModal
            settings={settings}
            onResume={handleResume}
            onRestart={handleRestart}
            onExit={handleExitToMenu}
            onToggleSound={() => handleUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled })}
            onToggleMusic={() => handleUpdateSettings({ ...settings, musicEnabled: !settings.musicEnabled })}
          />
        )}

        {/* Game Over Screen Overlay */}
        {gameState === 'GAME_OVER' && (
          <GameOverModal
            score={lastRunStats.finalScore}
            highScore={stats.highScore}
            isNewHighScore={lastRunStats.isNewHighScore}
            coinsCollected={lastRunStats.coinsCollected}
            survivalTime={lastRunStats.survivalTime}
            nearMisses={lastRunStats.nearMisses}
            onRestart={handleRestart}
            onExit={handleExitToMenu}
            onOpenShop={() => setActiveModal('shop')}
          />
        )}

        {/* Modals */}
        {activeModal === 'shop' && (
          <ShopModal
            skins={skins}
            selectedSkinId={selectedSkinId}
            totalCoins={stats.totalCoins}
            onSelectSkin={handleSelectSkin}
            onBuySkin={handleBuySkin}
            onClose={() => setActiveModal(null)}
          />
        )}

        {activeModal === 'stats' && (
          <StatsModal
            stats={stats}
            onClose={() => setActiveModal(null)}
          />
        )}

        {activeModal === 'settings' && (
          <SettingsModal
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onClose={() => setActiveModal(null)}
          />
        )}
      </div>
    </div>
  );
}
