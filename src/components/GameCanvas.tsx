import React, { useEffect, useRef, useState } from 'react';
import { GameSettings, GameState, Obstacle, Item, Particle, Skin, PowerUpType, ObstacleType } from '../types';
import { soundEngine } from '../lib/audio';

interface GameCanvasProps {
  gameState: GameState;
  settings: GameSettings;
  selectedSkin: Skin;
  onGameOver: (finalScore: number, coinsCollected: number, survivalTime: number, nearMisses: number) => void;
  onUpdateScore: (score: number, coins: number, level: number) => void;
  onPowerUpChange: (activePowerUps: { type: PowerUpType; duration: number; maxDuration: number }[]) => void;
  onDashCooldownChange: (pct: number) => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  gameState,
  settings,
  selectedSkin,
  onGameOver,
  onUpdateScore,
  onPowerUpChange,
  onDashCooldownChange
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Touch control state
  const isPointerDownRef = useRef(false);
  const pointerXRef = useRef<number | null>(null);
  const keysPressedRef = useRef<{ [key: string]: boolean }>({});
  
  // Game Loop State Refs (for smooth 60fps performance without React re-render lag)
  const animFrameIdRef = useRef<number | null>(null);
  const scoreRef = useRef(0);
  const coinsRef = useRef(0);
  const levelRef = useRef(1);
  const survivalTimeRef = useRef(0);
  const nearMissesRef = useRef(0);
  const lastTimeRef = useRef<number>(0);

  // Dash & PowerUp Timers
  const dashCooldownRef = useRef(0);
  const isDashingRef = useRef(false);
  const dashTimeRemainingRef = useRef(0);

  const powerUpTimersRef = useRef<{ [key in PowerUpType]?: number }>({});

  // Virtual Button controls
  const moveLeftRef = useRef(false);
  const moveRightRef = useRef(false);

  // Background stars
  const starsRef = useRef<{ x: number; y: number; size: number; speed: number; alpha: number }[]>([]);

  // Core Entity State
  const playerRef = useRef({
    x: 0,
    y: 0,
    targetX: 0,
    width: 38,
    height: 38,
    speed: 7
  });

  const obstaclesRef = useRef<Obstacle[]>([]);
  const itemsRef = useRef<Item[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const scorePopupsRef = useRef<{ id: string; x: number; y: number; text: string; color: string; alpha: number; vy: number }[]>([]);

  // Timers for spawning
  const spawnTimerRef = useRef(0);
  const itemSpawnTimerRef = useRef(0);

  // Initialize Canvas & Screen size
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const width = container.clientWidth;
      const height = container.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      // Set initial player position
      if (playerRef.current.x === 0) {
        playerRef.current.x = width / 2;
        playerRef.current.targetX = width / 2;
      }
      playerRef.current.y = height - 70;

      // Initialize background stars
      if (starsRef.current.length === 0) {
        starsRef.current = Array.from({ length: 40 }, () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 2 + 1,
          speed: Math.random() * 1.5 + 0.5,
          alpha: Math.random() * 0.7 + 0.3
        }));
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressedRef.current[e.key] = true;
      if (e.key === ' ' || e.key === 'Shift') {
        triggerDash();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressedRef.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Trigger Dash capability
  const triggerDash = () => {
    if (dashCooldownRef.current >= 100 && !isDashingRef.current && gameState === 'PLAYING') {
      dashCooldownRef.current = 0;
      isDashingRef.current = true;
      dashTimeRemainingRef.current = 250;

      soundEngine.playDash(settings.soundEnabled);
      soundEngine.vibrate([20, 30, 20], settings.vibrationEnabled);

      // Dash particle burst
      const p = playerRef.current;
      for (let i = 0; i < 20; i++) {
        particlesRef.current.push({
          x: p.x + (Math.random() - 0.5) * p.width,
          y: p.y + p.height / 2,
          vx: (Math.random() - 0.5) * 8,
          vy: Math.random() * 6 + 2,
          size: Math.random() * 5 + 2,
          color: selectedSkin.color,
          alpha: 1,
          life: 0,
          maxLife: 20
        });
      }
    }
  };

  // Reset Game
  const resetGame = () => {
    scoreRef.current = 0;
    coinsRef.current = 0;
    levelRef.current = 1;
    survivalTimeRef.current = 0;
    nearMissesRef.current = 0;
    dashCooldownRef.current = 100;
    isDashingRef.current = false;
    dashTimeRemainingRef.current = 0;
    powerUpTimersRef.current = {};

    obstaclesRef.current = [];
    itemsRef.current = [];
    particlesRef.current = [];
    scorePopupsRef.current = [];

    const container = containerRef.current;
    if (container) {
      playerRef.current.x = container.clientWidth / 2;
      playerRef.current.targetX = container.clientWidth / 2;
      playerRef.current.y = container.clientHeight - 70;
    }
  };

  // Main Loop
  useEffect(() => {
    if (gameState === 'PLAYING') {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = performance.now();
      }
      animFrameIdRef.current = requestAnimationFrame(gameLoop);
    } else if (gameState === 'MENU' || gameState === 'GAME_OVER') {
      resetGame();
    }

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [gameState]);

  const addScorePopup = (x: number, y: number, text: string, color: string) => {
    scorePopupsRef.current.push({
      id: Math.random().toString(),
      x,
      y,
      text,
      color,
      alpha: 1,
      vy: -1.5
    });
  };

  // Spawn Obstacles according to level & difficulty curve
  const spawnObstacle = (width: number) => {
    const level = levelRef.current;
    const types: ObstacleType[] = ['standard'];

    if (level >= 2) types.push('zigzag');
    if (level >= 3) types.push('splitter');
    if (level >= 4) types.push('fast_spike');
    if (level >= 5) types.push('homing');

    const chosenType = types[Math.floor(Math.random() * types.length)];
    const speedMultiplier = 1 + (level - 1) * 0.18;
    const baseSpeed = (Math.random() * 2 + 3) * speedMultiplier;

    const obsWidth = chosenType === 'fast_spike' ? 20 : Math.random() * 24 + 28;
    const obsHeight = chosenType === 'fast_spike' ? 45 : obsWidth;
    const spawnX = Math.random() * (width - obsWidth - 20) + 10;

    let color = '#ff3366';
    if (chosenType === 'zigzag') color = '#ff9900';
    if (chosenType === 'fast_spike') color = '#ff0033';
    if (chosenType === 'splitter') color = '#cc00ff';
    if (chosenType === 'homing') color = '#00ffcc';

    obstaclesRef.current.push({
      id: Math.random().toString(),
      x: spawnX,
      y: -obsHeight - 10,
      width: obsWidth,
      height: obsHeight,
      speed: baseSpeed,
      vx: chosenType === 'zigzag' ? (Math.random() > 0.5 ? 2.5 : -2.5) : 0,
      type: chosenType,
      color,
      rotation: 0,
      rotationSpeed: (Math.random() - 0.5) * 0.1,
      warningTime: chosenType === 'fast_spike' ? 25 : 0,
      nearMissTriggered: false
    });
  };

  // Spawn Collectible items (coins and power-ups)
  const spawnItem = (width: number) => {
    const isPowerUp = Math.random() < 0.22;
    const itemX = Math.random() * (width - 40) + 20;

    if (isPowerUp) {
      const powerUpTypes: PowerUpType[] = ['shield', 'slow_mo', 'magnet', 'nuke', 'double_score'];
      const pType = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
      itemsRef.current.push({
        id: Math.random().toString(),
        x: itemX,
        y: -30,
        radius: 16,
        type: pType,
        value: 0,
        vy: 2.2,
        rotation: 0
      });
    } else {
      itemsRef.current.push({
        id: Math.random().toString(),
        x: itemX,
        y: -20,
        radius: 12,
        type: 'coin',
        value: 1,
        vy: 2.8,
        rotation: 0
      });
    }
  };

  // Main Canvas Game Loop
  const gameLoop = (timestamp: number) => {
    if (gameState !== 'PLAYING') return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const deltaTime = Math.min((timestamp - (lastTimeRef.current || timestamp)) / 1000, 0.1);
    lastTimeRef.current = timestamp;

    // Survival time & level progression
    survivalTimeRef.current += deltaTime;
    const isDoubleScore = (powerUpTimersRef.current.doubleScore || 0) > 0;
    const scoreInc = (10 * deltaTime) * (isDoubleScore ? 2 : 1);
    scoreRef.current += scoreInc;

    // Check level up (every 250 pts)
    const newLevel = Math.floor(scoreRef.current / 250) + 1;
    if (newLevel > levelRef.current) {
      levelRef.current = newLevel;
      soundEngine.playLevelUp(settings.soundEnabled);
      addScorePopup(width / 2, height / 2 - 40, `LEVEL ${newLevel}!`, '#00f0ff');
    }

    // Update Dash cooldown
    if (dashCooldownRef.current < 100 && !isDashingRef.current) {
      const rechargeRate = selectedSkin.id === 'vortex_glider' ? 25 : 20;
      dashCooldownRef.current = Math.min(100, dashCooldownRef.current + rechargeRate * deltaTime);
    }
    onDashCooldownChange(dashCooldownRef.current);

    if (isDashingRef.current) {
      dashTimeRemainingRef.current -= deltaTime * 1000;
      if (dashTimeRemainingRef.current <= 0) {
        isDashingRef.current = false;
      }
    }

    // Update active Power-Up durations
    const activePowerUpsList: { type: PowerUpType; duration: number; maxDuration: number }[] = [];
    (Object.keys(powerUpTimersRef.current) as PowerUpType[]).forEach(type => {
      const cur = powerUpTimersRef.current[type];
      if (cur !== undefined && cur > 0) {
        powerUpTimersRef.current[type] = cur - deltaTime * 1000;
        if ((powerUpTimersRef.current[type] || 0) <= 0) {
          delete powerUpTimersRef.current[type];
        } else {
          activePowerUpsList.push({
            type,
            duration: powerUpTimersRef.current[type]!,
            maxDuration: type === 'shield' ? 10000 : 7000
          });
        }
      }
    });
    onPowerUpChange(activePowerUpsList);

    // Update player position based on controls
    const player = playerRef.current;
    const isSlowMo = (powerUpTimersRef.current.slow_mo || 0) > 0;
    const speed = player.speed * (settings.sensitivity || 1) * (isDashingRef.current ? 2.5 : 1);

    if (settings.controlMode === 'touch_drag') {
      if (isPointerDownRef.current && pointerXRef.current !== null) {
        player.targetX = pointerXRef.current;
      }
      player.x += (player.targetX - player.x) * 0.25;
    } else {
      if (keysPressedRef.current['ArrowLeft'] || keysPressedRef.current['a'] || keysPressedRef.current['A'] || moveLeftRef.current) {
        player.x -= speed;
      }
      if (keysPressedRef.current['ArrowRight'] || keysPressedRef.current['d'] || keysPressedRef.current['D'] || moveRightRef.current) {
        player.x += speed;
      }
    }

    // Bound player within canvas walls
    const halfW = player.width / 2;
    player.x = Math.max(halfW, Math.min(width - halfW, player.x));

    // Player thruster particles
    if (Math.random() < 0.6) {
      particlesRef.current.push({
        x: player.x + (Math.random() - 0.5) * 12,
        y: player.y + player.height / 2,
        vx: (Math.random() - 0.5) * 1.5,
        vy: Math.random() * 3 + 2,
        size: Math.random() * 4 + 2,
        color: selectedSkin.secondaryColor,
        alpha: 0.8,
        life: 0,
        maxLife: 15
      });
    }

    // Spawn Obstacles
    spawnTimerRef.current += deltaTime * 1000;
    const spawnInterval = Math.max(220, 750 - levelRef.current * 45);
    if (spawnTimerRef.current >= spawnInterval) {
      spawnTimerRef.current = 0;
      spawnObstacle(width);
    }

    // Spawn Items
    itemSpawnTimerRef.current += deltaTime * 1000;
    if (itemSpawnTimerRef.current >= 1800) {
      itemSpawnTimerRef.current = 0;
      spawnItem(width);
    }

    // UPDATE OBSTACLES
    const slowMoFactor = isSlowMo ? 0.45 : 1.0;
    const nextObstacles: Obstacle[] = [];

    obstaclesRef.current.forEach(obs => {
      obs.y += obs.speed * slowMoFactor;
      obs.x += obs.vx * slowMoFactor;
      obs.rotation += obs.rotationSpeed;

      // Bounce zigzag obstacles off side edges
      if (obs.type === 'zigzag') {
        if (obs.x <= 10 || obs.x >= width - obs.width - 10) {
          obs.vx *= -1;
        }
      }

      // Homing obstacle drifts slightly towards player X
      if (obs.type === 'homing') {
        if (obs.x < player.x - 10) obs.x += 1.2 * slowMoFactor;
        if (obs.x > player.x + 10) obs.x -= 1.2 * slowMoFactor;
      }

      // Check splitter splitting mid-screen
      if (obs.type === 'splitter' && !obs.hasSplit && obs.y > height * 0.4) {
        obs.hasSplit = true;
        obstaclesRef.current.push({
          id: Math.random().toString(),
          x: obs.x - 15,
          y: obs.y,
          width: obs.width * 0.6,
          height: obs.height * 0.6,
          speed: obs.speed * 1.3,
          vx: -2.2,
          type: 'standard',
          color: '#ff00ff',
          rotation: 0,
          rotationSpeed: 0.2,
          nearMissTriggered: false
        });
        obstaclesRef.current.push({
          id: Math.random().toString(),
          x: obs.x + 15,
          y: obs.y,
          width: obs.width * 0.6,
          height: obs.height * 0.6,
          speed: obs.speed * 1.3,
          vx: 2.2,
          type: 'standard',
          color: '#ff00ff',
          rotation: 0,
          rotationSpeed: -0.2,
          nearMissTriggered: false
        });
      }

      // Near-Miss Bonus Detection (FIX: only trigger once per obstacle)
      const distToPlayer = Math.hypot(obs.x + obs.width / 2 - player.x, obs.y + obs.height / 2 - player.y);
      if (distToPlayer < 45 && distToPlayer > 28 && !isDashingRef.current && !obs.nearMissTriggered) {
        obs.nearMissTriggered = true;
        nearMissesRef.current++;
        scoreRef.current += 15;
        soundEngine.playNearMiss(settings.soundEnabled);
        addScorePopup(player.x, player.y - 30, '+15 DODGE!', '#00ffcc');
      }

      // COLLISION WITH PLAYER
      const playerHitBox = {
        left: player.x - halfW + 4,
        right: player.x + halfW - 4,
        top: player.y - player.height / 2 + 4,
        bottom: player.y + player.height / 2 - 4
      };

      const obsHitBox = {
        left: obs.x,
        right: obs.x + obs.width,
        top: obs.y,
        bottom: obs.y + obs.height
      };

      const isColliding = !(
        playerHitBox.right < obsHitBox.left ||
        playerHitBox.left > obsHitBox.right ||
        playerHitBox.bottom < obsHitBox.top ||
        playerHitBox.top > obsHitBox.bottom
      );

      if (isColliding && !isDashingRef.current) {
        const shieldActive = (powerUpTimersRef.current.shield || 0) > 0;

        if (shieldActive) {
          delete powerUpTimersRef.current.shield;
          soundEngine.playShieldHit(settings.soundEnabled);
          soundEngine.vibrate([40, 20, 40], settings.vibrationEnabled);

          for (let i = 0; i < 25; i++) {
            particlesRef.current.push({
              x: player.x,
              y: player.y,
              vx: (Math.random() - 0.5) * 10,
              vy: (Math.random() - 0.5) * 10,
              size: Math.random() * 5 + 2,
              color: '#00ccff',
              alpha: 1,
              life: 0,
              maxLife: 30
            });
          }
          addScorePopup(player.x, player.y - 30, 'SHIELD BROKEN!', '#00ccff');
          return;
        } else {
          soundEngine.playExplosion(settings.soundEnabled);
          soundEngine.vibrate([100, 50, 100], settings.vibrationEnabled);

          for (let i = 0; i < 40; i++) {
            particlesRef.current.push({
              x: player.x,
              y: player.y,
              vx: (Math.random() - 0.5) * 14,
              vy: (Math.random() - 0.5) * 14,
              size: Math.random() * 7 + 3,
              color: Math.random() > 0.5 ? '#ff0055' : '#ffdd00',
              alpha: 1,
              life: 0,
              maxLife: 40
            });
          }

          onGameOver(
            Math.floor(scoreRef.current),
            coinsRef.current,
            Math.floor(survivalTimeRef.current),
            nearMissesRef.current
          );
          return;
        }
      }

      if (obs.y < height + 50) {
        nextObstacles.push(obs);
      } else {
        scoreRef.current += 2;
      }
    });

    obstaclesRef.current = nextObstacles;

    // UPDATE COLLECTIBLES / ITEMS
    const isMagnet = (powerUpTimersRef.current.magnet || 0) > 0;
    const magnetRange = selectedSkin.id === 'golden_phoenix' ? 220 : 170;
    const nextItems: Item[] = [];

    itemsRef.current.forEach(item => {
      item.y += item.vy * slowMoFactor;
      item.rotation += 0.05;

      if (isMagnet || (item.type === 'coin' && isMagnet)) {
        const dx = player.x - item.x;
        const dy = player.y - item.y;
        const dist = Math.hypot(dx, dy);

        if (dist < magnetRange) {
          item.x += (dx / dist) * 7;
          item.y += (dy / dist) * 7;
        }
      }

      const distToPlayer = Math.hypot(item.x - player.x, item.y - player.y);
      if (distToPlayer < item.radius + player.width / 2) {
        if (item.type === 'coin') {
          coinsRef.current += 1;
          scoreRef.current += 15;
          soundEngine.playCoin(settings.soundEnabled);
          soundEngine.vibrate([20], settings.vibrationEnabled);
          addScorePopup(item.x, item.y, '+1 COIN', '#ffd700');

          for (let i = 0; i < 8; i++) {
            particlesRef.current.push({
              x: item.x,
              y: item.y,
              vx: (Math.random() - 0.5) * 6,
              vy: (Math.random() - 0.5) * 6,
              size: Math.random() * 4 + 2,
              color: '#ffd700',
              alpha: 1,
              life: 0,
              maxLife: 20
            });
          }
        } else {
          soundEngine.playPowerUp(settings.soundEnabled);
          soundEngine.vibrate([40, 40], settings.vibrationEnabled);

          if (item.type === 'nuke') {
            obstaclesRef.current.forEach(obs => {
              scoreRef.current += 20;
              for (let i = 0; i < 10; i++) {
                particlesRef.current.push({
                  x: obs.x + obs.width / 2,
                  y: obs.y + obs.height / 2,
                  vx: (Math.random() - 0.5) * 8,
                  vy: (Math.random() - 0.5) * 8,
                  size: Math.random() * 5 + 2,
                  color: '#ff3300',
                  alpha: 1,
                  life: 0,
                  maxLife: 25
                });
              }
            });
            obstaclesRef.current = [];
            addScorePopup(player.x, player.y - 40, 'NUKE BLAST!', '#ff3300');
          } else {
            const duration = item.type === 'shield' ? 10000 : 7000;
            powerUpTimersRef.current[item.type] = duration;
            const labelMap: { [key in PowerUpType]: string } = {
              shield: 'SHIELD UP!',
              slow_mo: 'TIME SLOW!',
              magnet: 'MAGNET ACTIVE!',
              nuke: 'NUKE!',
              double_score: '2X SCORE!'
            };
            addScorePopup(player.x, player.y - 30, labelMap[item.type], '#00ffcc');
          }
        }
        return;
      }

      if (item.y < height + 30) {
        nextItems.push(item);
      }
    });

    itemsRef.current = nextItems;

    // Update particles
    particlesRef.current = particlesRef.current.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life++;
      p.alpha = 1 - p.life / p.maxLife;
      return p.life < p.maxLife;
    });

    // Update score popups
    scorePopupsRef.current = scorePopupsRef.current.filter(sp => {
      sp.y += sp.vy;
      sp.alpha -= deltaTime * 1.5;
      return sp.alpha > 0;
    });

    // Notify parent of updated HUD info
    onUpdateScore(Math.floor(scoreRef.current), coinsRef.current, levelRef.current);

    // ==========================================
    // RENDERING PHASE
    // ==========================================
    ctx.save();
    ctx.scale(dpr, dpr);

    // Dark cyber backdrop
    ctx.fillStyle = '#0a0d1a';
    ctx.fillRect(0, 0, width, height);

    // Scrolling star field
    starsRef.current.forEach(star => {
      star.y += star.speed * (isSlowMo ? 0.5 : 1);
      if (star.y > height) {
        star.y = 0;
        star.x = Math.random() * width;
      }
      ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    });

    // Render background grid lines for cyber speed effect
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // DRAW COLLECTIBLE ITEMS
    itemsRef.current.forEach(item => {
      ctx.save();
      ctx.translate(item.x, item.y);
      ctx.rotate(item.rotation);

      if (item.type === 'coin') {
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(0, 0, item.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ff9900';
        ctx.beginPath();
        ctx.arc(0, 0, item.radius * 0.6, 0, Math.PI * 2);
        ctx.fill();
      } else {
        const powerUpColors: { [key in PowerUpType]: string } = {
          shield: '#00ccff',
          slow_mo: '#b026ff',
          magnet: '#ffd700',
          nuke: '#ff3300',
          double_score: '#00ff66'
        };
        const pColor = powerUpColors[item.type];
        ctx.shadowColor = pColor;
        ctx.shadowBlur = 12;

        ctx.fillStyle = pColor;
        ctx.beginPath();
        ctx.arc(0, 0, item.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const icons: { [key in PowerUpType]: string } = {
          shield: 'S',
          slow_mo: 'T',
          magnet: 'M',
          nuke: 'N',
          double_score: '2X'
        };
        ctx.fillText(icons[item.type], 0, 0);
      }

      ctx.restore();
    });

    // DRAW OBSTACLES
    obstaclesRef.current.forEach(obs => {
      ctx.save();
      ctx.translate(obs.x + obs.width / 2, obs.y + obs.height / 2);
      ctx.rotate(obs.rotation);

      ctx.shadowColor = obs.color;
      ctx.shadowBlur = 10;
      ctx.fillStyle = obs.color;

      if (obs.type === 'fast_spike') {
        ctx.beginPath();
        ctx.moveTo(0, -obs.height / 2);
        ctx.lineTo(obs.width / 2, obs.height / 2);
        ctx.lineTo(-obs.width / 2, obs.height / 2);
        ctx.closePath();
        ctx.fill();
      } else if (obs.type === 'zigzag') {
        ctx.beginPath();
        ctx.moveTo(0, -obs.height / 2);
        ctx.lineTo(obs.width / 2, 0);
        ctx.lineTo(0, obs.height / 2);
        ctx.lineTo(-obs.width / 2, 0);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.fillRect(-obs.width / 2, -obs.height / 2, obs.width, obs.height);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(-obs.width / 4, -obs.height / 4, obs.width / 2, obs.height / 2);
      }

      ctx.restore();
    });

    // DRAW PLAYER & TRAIL
    const p = playerRef.current;
    ctx.save();
    ctx.translate(p.x, p.y);

    // Active Shield Glow Bubble
    if ((powerUpTimersRef.current.shield || 0) > 0) {
      ctx.save();
      ctx.strokeStyle = '#00ccff';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#00ccff';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(0, 0, p.width * 0.85, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'rgba(0, 204, 255, 0.15)';
      ctx.fill();
      ctx.restore();
    }

    // Dashing invulnerability glow
    if (isDashingRef.current) {
      ctx.shadowColor = selectedSkin.color;
      ctx.shadowBlur = 25;
    } else {
      ctx.shadowColor = selectedSkin.color;
      ctx.shadowBlur = 12;
    }

    // Render Skin Shapes
    ctx.fillStyle = selectedSkin.color;
    ctx.strokeStyle = selectedSkin.secondaryColor;
    ctx.lineWidth = 3;

    if (selectedSkin.shape === 'square') {
      ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
      ctx.strokeRect(-p.width / 2, -p.height / 2, p.width, p.height);
    } else if (selectedSkin.shape === 'ship') {
      ctx.beginPath();
      ctx.moveTo(0, -p.height / 2);
      ctx.lineTo(p.width / 2, p.height / 2);
      ctx.lineTo(0, p.height / 4);
      ctx.lineTo(-p.width / 2, p.height / 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (selectedSkin.shape === 'orb') {
      ctx.beginPath();
      ctx.arc(0, 0, p.width / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else if (selectedSkin.shape === 'mech') {
      ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
      ctx.fillStyle = selectedSkin.secondaryColor;
      ctx.fillRect(-p.width / 4, -p.height / 4, p.width / 2, p.height / 2);
    } else if (selectedSkin.shape === 'phoenix') {
      ctx.beginPath();
      ctx.moveTo(0, -p.height / 2);
      ctx.lineTo(p.width / 1.8, p.height / 3);
      ctx.lineTo(p.width / 3, p.height / 2);
      ctx.lineTo(0, p.height / 3);
      ctx.lineTo(-p.width / 3, p.height / 2);
      ctx.lineTo(-p.width / 1.8, p.height / 3);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(0, -p.height / 2);
      ctx.lineTo(p.width / 2, p.height / 2);
      ctx.lineTo(-p.width / 2, p.height / 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    ctx.restore();

    // DRAW PARTICLES
    particlesRef.current.forEach(pt => {
      ctx.save();
      ctx.globalAlpha = pt.alpha;
      ctx.fillStyle = pt.color;
      ctx.shadowColor = pt.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // DRAW SCORE POPUPS
    scorePopupsRef.current.forEach(sp => {
      ctx.save();
      ctx.globalAlpha = sp.alpha;
      ctx.fillStyle = sp.color;
      ctx.shadowColor = sp.color;
      ctx.shadowBlur = 8;
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(sp.text, sp.x, sp.y);
      ctx.restore();
    });

    ctx.restore();

    // Loop
    animFrameIdRef.current = requestAnimationFrame(gameLoop);
  };

  // Pointer Handlers for Direct Touch Drag
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (gameState !== 'PLAYING') return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    isPointerDownRef.current = true;
    pointerXRef.current = e.clientX - rect.left;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current || gameState !== 'PLAYING') return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    pointerXRef.current = e.clientX - rect.left;
  };

  const handlePointerUp = () => {
    isPointerDownRef.current = false;
    pointerXRef.current = null;
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className="relative w-full h-full overflow-hidden select-none touch-none bg-slate-950 flex items-center justify-center"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />

      {/* On-screen Virtual Controls if configured */}
      {gameState === 'PLAYING' && settings.controlMode === 'virtual_buttons' && (
        <div className="absolute bottom-6 left-0 right-0 px-6 flex justify-between pointer-events-none z-10">
          <div className="flex gap-4 pointer-events-auto">
            <button
              onPointerDown={() => (moveLeftRef.current = true)}
              onPointerUp={() => (moveLeftRef.current = false)}
              onPointerLeave={() => (moveLeftRef.current = false)}
              className="w-16 h-16 rounded-full bg-cyan-500/30 border-2 border-cyan-400 text-white font-bold text-2xl flex items-center justify-center active:bg-cyan-500/60 transition-all shadow-lg shadow-cyan-500/20 backdrop-blur-sm"
            >
              &#9664;
            </button>
            <button
              onPointerDown={() => (moveRightRef.current = true)}
              onPointerUp={() => (moveRightRef.current = false)}
              onPointerLeave={() => (moveRightRef.current = false)}
              className="w-16 h-16 rounded-full bg-cyan-500/30 border-2 border-cyan-400 text-white font-bold text-2xl flex items-center justify-center active:bg-cyan-500/60 transition-all shadow-lg shadow-cyan-500/20 backdrop-blur-sm"
            >
              &#9654;
            </button>
          </div>

          <button
            onClick={triggerDash}
            className="pointer-events-auto w-16 h-16 rounded-full bg-amber-500/30 border-2 border-amber-400 text-amber-200 font-bold text-sm flex flex-col items-center justify-center active:bg-amber-500/60 transition-all shadow-lg shadow-amber-500/20 backdrop-blur-sm"
          >
            <span>DASH</span>
          </button>
        </div>
      )}

      {/* Touch/Double-tap overlay hint for Direct Drag mode */}
      {gameState === 'PLAYING' && settings.controlMode === 'touch_drag' && (
        <div className="absolute bottom-4 right-4 pointer-events-auto z-10">
          <button
            onClick={triggerDash}
            className="px-4 py-2.5 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-200 font-semibold text-xs flex items-center gap-2 active:bg-cyan-500/40 backdrop-blur-md transition-all shadow-md"
          >
            <span>DASH</span>
          </button>
        </div>
      )}
    </div>
  );
};
