import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { sound } from './VillageRunAudio.ts';
import {
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  X,
  Pause,
  Award,
  Zap,
  Shield,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface VillageRunGameProps {
  isOpen: boolean;
  onClose: () => void;
}

type GameState = 'title' | 'playing' | 'paused' | 'gameover' | 'victory';

const LANES = [-2.6, 0, 2.6];

export const VillageRunGame: React.FC<VillageRunGameProps> = ({ isOpen, onClose }) => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const resetEntitiesRef = useRef<() => void>(() => {});

  // React Game UI State
  const [gameState, setGameState] = useState<GameState>('title');
  const [score, setScore] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);
  const [multiplier, setMultiplier] = useState<number>(1);
  const [shields, setShields] = useState<number>(3);
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('sharad_villagerun_highscore') || '0', 10);
  });
  const [isMuted, setIsMuted] = useState<boolean>(sound.isMuted);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // References for the 60fps simulation loop
  const stateRef = useRef<{
    gameState: GameState;
    currentLane: number;
    targetLaneX: number;
    playerX: number;
    playerY: number;
    playerVY: number;
    isJumping: boolean;
    speed: number;
    distance: number;
    score: number;
    multiplier: number;
    streak: number;
    shields: number;
    shake: number;
    hitstop: number;
  }>({
    gameState: 'title',
    currentLane: 1, // center lane
    targetLaneX: 0,
    playerX: 0,
    playerY: 0,
    playerVY: 0,
    isJumping: false,
    speed: 38,
    distance: 0,
    score: 0,
    multiplier: 1,
    streak: 0,
    shields: 3,
    shake: 0,
    hitstop: 0,
  });

  // Sync stateRef with React state
  useEffect(() => {
    stateRef.current.gameState = gameState;
  }, [gameState]);

  // Three.js Scene Setup & Loop
  useEffect(() => {
    if (!isOpen) return;

    const container = canvasContainerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x06080d);
    scene.fog = new THREE.FogExp2(0x06080d, 0.022);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 180);
    camera.position.set(0, 3.8, 7.5);
    camera.lookAt(0, 1.2, -12);

    const renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: true,
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);

    // 2. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5e6, 2.2);
    keyLight.position.set(5, 12, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe6f0ff, 0.8);
    fillLight.position.set(-6, 8, -4);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x38bdf8, 3.5, 25);
    rimLight.position.set(0, 2, 2);
    scene.add(rimLight);

    // 3. Composite 3D Player Craft (8 parts in a THREE.Group)
    const playerGroup = new THREE.Group();
    playerGroup.position.set(0, 0.6, 0);
    scene.add(playerGroup);

    const disposables: (THREE.BufferGeometry | THREE.Material | THREE.Texture)[] = [];

    // Part 1: Main Hull Fuselage
    const hullGeo = new THREE.ConeGeometry(0.55, 2.4, 5);
    hullGeo.rotateX(Math.PI / 2);
    const hullMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.25,
      metalness: 0.9,
    });
    const hull = new THREE.Mesh(hullGeo, hullMat);
    hull.position.z = -0.2;
    playerGroup.add(hull);
    disposables.push(hullGeo, hullMat);

    // Part 2: Cockpit Visor (Cyan Tinted Glass)
    const visorGeo = new THREE.SphereGeometry(0.32, 16, 12);
    visorGeo.scale(1, 0.6, 1.6);
    const visorMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.8,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.4,
    });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.set(0, 0.25, -0.1);
    playerGroup.add(visor);
    disposables.push(visorGeo, visorMat);

    // Part 3: Left Swept Wing
    const wingGeo = new THREE.BoxGeometry(1.4, 0.05, 0.9);
    const wingMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.85,
      roughness: 0.3,
    });
    const leftWing = new THREE.Mesh(wingGeo, wingMat);
    leftWing.position.set(-0.85, 0.05, 0.2);
    leftWing.rotation.y = -Math.PI / 10;
    playerGroup.add(leftWing);
    disposables.push(wingGeo, wingMat);

    // Part 4: Right Swept Wing
    const rightWing = new THREE.Mesh(wingGeo, wingMat);
    rightWing.position.set(0.85, 0.05, 0.2);
    rightWing.rotation.y = Math.PI / 10;
    playerGroup.add(rightWing);

    // Part 5 & 6: Dual Jet Thruster Pods
    const engineGeo = new THREE.CylinderGeometry(0.18, 0.22, 1.1, 16);
    engineGeo.rotateX(Math.PI / 2);
    const engineMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.9,
      roughness: 0.2,
    });
    const leftEngine = new THREE.Mesh(engineGeo, engineMat);
    leftEngine.position.set(-0.55, 0.08, 0.6);
    playerGroup.add(leftEngine);

    const rightEngine = new THREE.Mesh(engineGeo, engineMat);
    rightEngine.position.set(0.55, 0.08, 0.6);
    playerGroup.add(rightEngine);
    disposables.push(engineGeo, engineMat);

    // Part 7: Booster Glow Rings
    const ringGeo = new THREE.TorusGeometry(0.2, 0.04, 12, 24);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const leftRing = new THREE.Mesh(ringGeo, ringMat);
    leftRing.position.set(-0.55, 0.08, 1.15);
    playerGroup.add(leftRing);

    const rightRing = new THREE.Mesh(ringGeo, ringMat);
    rightRing.position.set(0.55, 0.08, 1.15);
    playerGroup.add(rightRing);
    disposables.push(ringGeo, ringMat);

    // Part 8: Plasma Flame Tail
    const flameGeo = new THREE.ConeGeometry(0.2, 1.2, 8);
    flameGeo.rotateX(-Math.PI / 2);
    const flameMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.85,
    });
    const leftFlame = new THREE.Mesh(flameGeo, flameMat);
    leftFlame.position.set(-0.55, 0.08, 1.7);
    playerGroup.add(leftFlame);

    const rightFlame = new THREE.Mesh(flameGeo, flameMat);
    rightFlame.position.set(0.55, 0.08, 1.7);
    playerGroup.add(rightFlame);
    disposables.push(flameGeo, flameMat);

    // 4. Track Segments (Procedural Grid Canvas Texture)
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, 256, 256);

    // Lane divider neon dashes
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 6;
    ctx.setLineDash([24, 24]);
    ctx.beginPath();
    ctx.moveTo(85, 0);
    ctx.lineTo(85, 256);
    ctx.moveTo(171, 0);
    ctx.lineTo(171, 256);
    ctx.stroke();

    const trackTexture = new THREE.CanvasTexture(canvas);
    trackTexture.wrapS = THREE.RepeatWrapping;
    trackTexture.wrapT = THREE.RepeatWrapping;
    trackTexture.repeat.set(1, 20);
    disposables.push(trackTexture);

    const trackGeo = new THREE.PlaneGeometry(8.5, 160);
    trackGeo.rotateX(-Math.PI / 2);
    const trackMat = new THREE.MeshStandardMaterial({
      map: trackTexture,
      roughness: 0.5,
      metalness: 0.2,
    });
    const trackMesh = new THREE.Mesh(trackGeo, trackMat);
    trackMesh.position.set(0, 0, -60);
    scene.add(trackMesh);
    disposables.push(trackGeo, trackMat);

    // Side Cyber Rails
    const railGeo = new THREE.BoxGeometry(0.2, 0.4, 160);
    const railMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.4,
    });
    const leftRail = new THREE.Mesh(railGeo, railMat);
    leftRail.position.set(-4.3, 0.2, -60);
    scene.add(leftRail);

    const rightRail = new THREE.Mesh(railGeo, railMat);
    rightRail.position.set(4.3, 0.2, -60);
    scene.add(rightRail);
    disposables.push(railGeo, railMat);

    // 5. Procedural Obstacles & Collectibles Pool
    interface ObstacleItem {
      mesh: THREE.Group;
      lane: number;
      z: number;
      type: 'laser' | 'hazard';
      active: boolean;
    }

    interface OrbItem {
      mesh: THREE.Group;
      lane: number;
      z: number;
      active: boolean;
    }

    const obstacles: ObstacleItem[] = [];
    const orbs: OrbItem[] = [];

    // Create 14 pooled obstacles (mix of laser barriers and rotating hazard spikes)
    for (let i = 0; i < 14; i++) {
      const obsGroup = new THREE.Group();
      const pylonGeo = new THREE.CylinderGeometry(0.15, 0.18, 1.8, 8);
      const pylonMat = new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.8 });
      const p1 = new THREE.Mesh(pylonGeo, pylonMat);
      p1.position.set(-1.0, 0.9, 0);
      const p2 = new THREE.Mesh(pylonGeo, pylonMat);
      p2.position.set(1.0, 0.9, 0);

      const beamGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.0, 8);
      beamGeo.rotateZ(Math.PI / 2);
      const beamMat = new THREE.MeshBasicMaterial({ color: 0xff0055 });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.set(0, 1.1, 0);

      // Rotating hazard core
      const coreGeo = new THREE.OctahedronGeometry(0.35);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0xff0055,
        emissive: 0xff0055,
        emissiveIntensity: 0.7,
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      core.position.set(0, 1.1, 0);

      obsGroup.add(p1, p2, beam, core);
      obsGroup.position.set(0, 0, -200);
      obsGroup.visible = false;
      scene.add(obsGroup);

      obstacles.push({
        mesh: obsGroup,
        lane: 0,
        z: -200,
        type: 'laser',
        active: false,
      });

      disposables.push(pylonGeo, pylonMat, beamGeo, beamMat, coreGeo, coreMat);
    }

    // Create 18 pooled energy deployment orbs
    for (let i = 0; i < 18; i++) {
      const orbGroup = new THREE.Group();
      const sphereGeo = new THREE.SphereGeometry(0.32, 16, 16);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x38bdf8,
        emissiveIntensity: 0.9,
      });
      const orbSphere = new THREE.Mesh(sphereGeo, sphereMat);

      const ringOrbGeo = new THREE.TorusGeometry(0.5, 0.03, 8, 24);
      const ringOrbMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const orbRing = new THREE.Mesh(ringOrbGeo, ringOrbMat);
      orbRing.rotation.x = Math.PI / 3;

      orbGroup.add(orbSphere, orbRing);
      orbGroup.position.set(0, 0.8, -200);
      orbGroup.visible = false;
      scene.add(orbGroup);

      orbs.push({
        mesh: orbGroup,
        lane: 0,
        z: -200,
        active: false,
      });

      disposables.push(sphereGeo, sphereMat, ringOrbGeo, ringOrbMat);
    }

    // Spawner function: places an item at exact target Z
    const spawnItemAtZ = (targetZ: number) => {
      const lane = Math.floor(Math.random() * 3);
      // Continuous difficulty scaling: slightly higher obstacle ratio as distance increases
      const dist = stateRef.current.distance;
      const obstacleChance = Math.min(0.70, 0.50 + (dist / 8000));
      const isObstacle = Math.random() < obstacleChance;

      if (isObstacle) {
        const freeObs = obstacles.find((o) => !o.active);
        if (freeObs) {
          freeObs.active = true;
          freeObs.lane = lane;
          freeObs.z = targetZ;
          freeObs.mesh.position.set(LANES[lane], 0, targetZ);
          freeObs.mesh.visible = true;
        }
      } else {
        const freeOrb = orbs.find((o) => !o.active);
        if (freeOrb) {
          freeOrb.active = true;
          freeOrb.lane = lane;
          freeOrb.z = targetZ;
          freeOrb.mesh.position.set(LANES[lane], 0.8, targetZ);
          freeOrb.mesh.visible = true;
        }
      }
    };

    // Clean reset function for initial start and replay
    const resetEntities = () => {
      obstacles.forEach((o) => {
        o.active = false;
        o.mesh.visible = false;
        o.z = -200;
        o.mesh.position.set(0, 0, -200);
      });
      orbs.forEach((o) => {
        o.active = false;
        o.mesh.visible = false;
        o.z = -200;
        o.mesh.position.set(0, 0, -200);
      });

      // Seed initial wave from Z = -35 to Z = -130
      let z = -35;
      for (let i = 0; i < 6; i++) {
        spawnItemAtZ(z);
        z -= 18 + Math.random() * 8;
      }
    };

    // Expose resetEntities to React component
    resetEntitiesRef.current = resetEntities;
    resetEntities();

    // 6. Keyboard and Input Handlers
    const handleKeyDown = (e: KeyboardEvent) => {
      if (stateRef.current.gameState === 'title') {
        if (e.key === ' ' || e.key === 'Enter') {
          startGame();
        }
        return;
      }

      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        if (stateRef.current.gameState === 'playing') {
          setGameState('paused');
        } else if (stateRef.current.gameState === 'paused') {
          setGameState('playing');
        }
        return;
      }

      if (stateRef.current.gameState !== 'playing') return;

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        if (stateRef.current.currentLane > 0) {
          stateRef.current.currentLane -= 1;
          stateRef.current.targetLaneX = LANES[stateRef.current.currentLane];
          sound.playLaneSwitch();
        }
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        if (stateRef.current.currentLane < 2) {
          stateRef.current.currentLane += 1;
          stateRef.current.targetLaneX = LANES[stateRef.current.currentLane];
          sound.playLaneSwitch();
        }
      } else if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        if (!stateRef.current.isJumping) {
          stateRef.current.isJumping = true;
          stateRef.current.playerVY = 12.0;
          sound.playBoost();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // 7. Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 8. Animation & Physics Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const rawDelta = clock.getDelta();
      const dt = Math.min(rawDelta, 0.05); // Delta clamping

      const state = stateRef.current;

      // Hitstop freeze (30-80ms on impact)
      if (state.hitstop > 0) {
        state.hitstop -= dt;
        return;
      }

      if (state.gameState === 'playing') {
        // Distance and Speed Progression
        state.distance += state.speed * dt;
        state.speed = Math.min(68, 38 + state.distance * 0.015);
        setDistance(Math.floor(state.distance));

        // Player Lane Lerping
        const dx = state.targetLaneX - state.playerX;
        state.playerX += dx * Math.min(1.0, 15 * dt);

        // Player Jump Physics
        if (state.isJumping) {
          state.playerY += state.playerVY * dt;
          state.playerVY -= 35 * dt; // Gravity
          if (state.playerY <= 0) {
            state.playerY = 0;
            state.playerVY = 0;
            state.isJumping = false;
          }
        }

        // Apply Player Transforms
        playerGroup.position.x = state.playerX;
        playerGroup.position.y = 0.6 + state.playerY;
        // Bank roll when switching lanes
        const roll = -dx * 0.18;
        playerGroup.rotation.z = roll;
        playerGroup.rotation.y = -dx * 0.08;

        // Animate plasma flame flicker
        const flameScale = 1 + Math.sin(clock.getElapsedTime() * 30) * 0.15;
        leftFlame.scale.set(1, flameScale, 1);
        rightFlame.scale.set(1, flameScale, 1);

        // Move Track Texture for infinite highway illusion
        trackTexture.offset.y -= (state.speed * dt) / 8;

        // Continuous Horizon Spawner: maintains obstacles and orbs ahead regardless of distance
        let minActiveZ = 0;
        for (let i = 0; i < obstacles.length; i++) {
          if (obstacles[i].active && obstacles[i].z < minActiveZ) {
            minActiveZ = obstacles[i].z;
          }
        }
        for (let i = 0; i < orbs.length; i++) {
          if (orbs[i].active && orbs[i].z < minActiveZ) {
            minActiveZ = orbs[i].z;
          }
        }

        // If the furthest active entity is closer than -115, spawn ahead up to -135
        while (minActiveZ > -115) {
          const nextZ = Math.min(-35, minActiveZ - (18 + Math.random() * 8));
          spawnItemAtZ(nextZ);
          minActiveZ = nextZ;
        }

        // Move Obstacles forward
        obstacles.forEach((obs) => {
          if (!obs.active) return;
          obs.z += state.speed * dt;
          obs.mesh.position.z = obs.z;

          // Collision detection with player craft (z between -1.5 and 1.2)
          if (
            obs.z > -1.5 &&
            obs.z < 1.2 &&
            Math.abs(state.playerX - LANES[obs.lane]) < 1.1 &&
            state.playerY < 0.95
          ) {
            // Collision occurred!
            obs.active = false;
            obs.mesh.visible = false;
            state.shields -= 1;
            state.multiplier = 1;
            state.streak = 0;
            state.shake = 1.0;
            state.hitstop = 0.06; // 60ms hitstop
            setShields(state.shields);
            setMultiplier(1);
            sound.playCrash();

            if (state.shields <= 0) {
              setGameState('gameover');
              sound.playGameOver();
              if (state.score > highScore) {
                setHighScore(state.score);
                localStorage.setItem('sharad_villagerun_highscore', state.score.toString());
              }
            }
          }

          // Recycle obstacle past camera
          if (obs.z > 15) {
            obs.active = false;
            obs.mesh.visible = false;
          }
        });

        // Move Collectible Orbs forward
        orbs.forEach((orb) => {
          if (!orb.active) return;
          orb.z += state.speed * dt;
          orb.mesh.position.z = orb.z;
          orb.mesh.rotation.y += dt * 3;

          // Pickup check
          if (
            orb.z > -1.5 &&
            orb.z < 1.4 &&
            Math.abs(state.playerX - LANES[orb.lane]) < 1.1 &&
            Math.abs(state.playerY - 0.2) < 1.2
          ) {
            orb.active = false;
            orb.mesh.visible = false;
            state.streak += 1;
            if (state.streak >= 4) {
              state.multiplier = Math.min(4, Math.floor(state.streak / 4) + 1);
              setMultiplier(state.multiplier);
            }
            const pts = 100 * state.multiplier;
            state.score += pts;
            setScore(state.score);
            sound.playPickup();
          }

          if (orb.z > 15) {
            orb.active = false;
            orb.mesh.visible = false;
          }
        });
      }

      // Decaying Camera Shake
      if (state.shake > 0) {
        camera.position.x = (Math.random() - 0.5) * state.shake * 0.45;
        camera.position.y = 3.8 + (Math.random() - 0.5) * state.shake * 0.45;
        state.shake *= 0.88;
        if (state.shake < 0.02) {
          state.shake = 0;
          camera.position.x = 0;
          camera.position.y = 3.8;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
    };
  }, [isOpen]);

  const startGame = () => {
    stateRef.current = {
      gameState: 'playing',
      currentLane: 1,
      targetLaneX: 0,
      playerX: 0,
      playerY: 0,
      playerVY: 0,
      isJumping: false,
      speed: 38,
      distance: 0,
      score: 0,
      multiplier: 1,
      streak: 0,
      shields: 3,
      shake: 0,
      hitstop: 0,
    };
    resetEntitiesRef.current?.();
    setScore(0);
    setDistance(0);
    setMultiplier(1);
    setShields(3);
    setGameState('playing');
  };

  const handleLaneLeft = () => {
    if (stateRef.current.gameState === 'playing' && stateRef.current.currentLane > 0) {
      stateRef.current.currentLane -= 1;
      stateRef.current.targetLaneX = LANES[stateRef.current.currentLane];
      sound.playLaneSwitch();
    }
  };

  const handleLaneRight = () => {
    if (stateRef.current.gameState === 'playing' && stateRef.current.currentLane < 2) {
      stateRef.current.currentLane += 1;
      stateRef.current.targetLaneX = LANES[stateRef.current.currentLane];
      sound.playLaneSwitch();
    }
  };

  const handleJump = () => {
    if (stateRef.current.gameState === 'playing' && !stateRef.current.isJumping) {
      stateRef.current.isJumping = true;
      stateRef.current.playerVY = 12.0;
      sound.playBoost();
    }
  };

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#06080D] flex flex-col select-none overflow-hidden font-sans">
      {/* 3D WebGL Canvas Layer */}
      <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab" />

      {/* Low-Occlusion HUD Overlay (<15% viewport occlusion, NO backdrop-filter for 60fps) */}
      <header className="relative z-20 w-full px-4 sm:px-8 pt-4 flex items-center justify-between pointer-events-none">
        {/* Left: Score & Distance Badge */}
        <div className="pointer-events-auto flex items-center gap-3 bg-[#0B111A]/90 border border-white/10 rounded-xl px-4 py-2 text-xs shadow-lg">
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Score</div>
            <div className="text-lg font-black text-white font-mono tracking-tight">{score}</div>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Distance</div>
            <div className="text-sm font-bold text-[#38BDF8] font-mono">{distance}m</div>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
              {multiplier}x
            </span>
          </div>
        </div>

        {/* Center: Shield Energy Meter */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-[#0B111A]/90 border border-white/10 rounded-xl px-3 py-2 text-xs shadow-lg">
          <Shield className="w-3.5 h-3.5 text-[#38BDF8]" />
          <div className="flex gap-1">
            {[1, 2, 3].map((lvl) => (
              <div
                key={lvl}
                className={`w-4 h-2 rounded-sm transition-colors ${
                  lvl <= shields ? 'bg-[#38BDF8] shadow-[0_0_8px_#38BDF8]' : 'bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right: Sound, Pause, Exit Controls */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            type="button"
            onClick={toggleSound}
            className="p-2.5 rounded-xl bg-[#0B111A]/90 border border-white/10 hover:border-white/25 text-slate-300 hover:text-white transition-colors"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-[#38BDF8]" />}
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2.5 rounded-xl bg-[#0B111A]/90 border border-white/10 hover:border-white/25 text-slate-300 hover:text-white transition-colors hidden sm:block"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {gameState === 'playing' && (
            <button
              type="button"
              onClick={() => setGameState('paused')}
              className="p-2.5 rounded-xl bg-[#0B111A]/90 border border-white/10 hover:border-white/25 text-slate-300 hover:text-white transition-colors"
              title="Pause Game (Esc or P)"
            >
              <Pause className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 text-xs font-semibold transition-colors"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Exit</span>
          </button>
        </div>
      </header>

      {/* TITLE SCREEN MODAL */}
      {gameState === 'title' && (
        <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/60">
          <div className="max-w-md w-full bg-[#0E141F] border border-white/15 rounded-2xl p-7 text-center shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Bespoke Title Lockup */}
            <div className="inline-flex p-3 rounded-2xl bg-[#38BDF8]/10 border border-[#38BDF8]/30 mb-4 shadow-[0_0_20px_rgba(56,189,248,0.25)]">
              <Zap className="w-8 h-8 text-[#38BDF8]" />
            </div>

            <h1 className="text-3xl font-black text-white tracking-tight uppercase mb-1">
              Village Run 3D
            </h1>
            <p className="text-xs font-mono text-[#38BDF8] tracking-widest uppercase mb-4">
              Cyberpunk Speeder Arcade · 60 FPS Three.js
            </p>

            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              Dodge laser barricades, collect deployment nodes for multiplier combos, and survive the infinite quantum highway.
            </p>

            {/* Controls Guide */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-slate-300 mb-6 font-mono">
              <div>
                <span className="block text-[#38BDF8] font-bold">A / ←</span>
                <span className="text-[10px] text-slate-500">Left</span>
              </div>
              <div>
                <span className="block text-[#38BDF8] font-bold">D / →</span>
                <span className="text-[10px] text-slate-500">Right</span>
              </div>
              <div>
                <span className="block text-[#38BDF8] font-bold">Space / W</span>
                <span className="text-[10px] text-slate-500">Jump</span>
              </div>
            </div>

            {/* High score badge */}
            {highScore > 0 && (
              <div className="flex items-center justify-center gap-1.5 text-xs text-amber-400 font-mono mb-6">
                <Award className="w-4 h-4" />
                <span>All-Time High Score: {highScore}</span>
              </div>
            )}

            <button
              type="button"
              onClick={startGame}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#38BDF8] hover:bg-[#7dd3fc] text-[#08090C] font-bold text-sm tracking-wide shadow-[0_0_25px_rgba(56,189,248,0.4)] transition-all hover:scale-105"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>LAUNCH SIMULATION</span>
            </button>
          </div>
        </div>
      )}

      {/* PAUSE MODAL */}
      {gameState === 'paused' && (
        <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/60">
          <div className="max-w-sm w-full bg-[#0E141F] border border-white/15 rounded-2xl p-6 text-center shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-2">Simulation Paused</h2>
            <p className="text-xs text-slate-400 mb-6">Take a breath or resume when ready.</p>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setGameState('playing')}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#38BDF8] text-[#08090C] font-bold text-xs tracking-wide transition-colors hover:bg-[#7dd3fc]"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>RESUME</span>
              </button>
              <button
                type="button"
                onClick={startGame}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restart Run</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white text-xs transition-colors"
              >
                Exit to Portfolio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GAME OVER MODAL */}
      {gameState === 'gameover' && (
        <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/70 animate-in fade-in duration-200">
          <div className="max-w-md w-full bg-[#0E141F] border border-red-500/30 rounded-2xl p-7 text-center shadow-2xl">
            <div className="inline-flex p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 mb-3">
              <Zap className="w-7 h-7" />
            </div>

            <h2 className="text-2xl font-black text-white tracking-tight uppercase mb-1">
              Hull Depleted
            </h2>
            <p className="text-xs text-slate-400 mb-5">
              Impact threshold exceeded. Telemetry logged.
            </p>

            {/* Score & Stats Grid */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/10 mb-6">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-mono">Final Score</div>
                <div className="text-2xl font-black text-[#38BDF8] font-mono">{score}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-mono">Distance</div>
                <div className="text-2xl font-black text-white font-mono">{distance}m</div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={startGame}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#38BDF8] hover:bg-[#7dd3fc] text-[#08090C] font-bold text-xs tracking-wide transition-all shadow-[0_0_15px_rgba(56,189,248,0.35)]"
              >
                <RotateCcw className="w-4 h-4" />
                <span>PLAY AGAIN</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-colors"
              >
                Back to Portfolio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* On-Screen Mobile Touch Controls (shown on touch devices) */}
      {gameState === 'playing' && (
        <div className="sm:hidden absolute bottom-5 left-0 right-0 z-20 px-6 flex items-center justify-between pointer-events-none">
          <div className="flex gap-3 pointer-events-auto">
            <button
              type="button"
              onTouchStart={handleLaneLeft}
              onClick={handleLaneLeft}
              className="w-14 h-14 rounded-2xl bg-[#0B111A]/90 border border-white/20 active:bg-[#38BDF8] active:text-[#08090C] text-white flex items-center justify-center shadow-xl"
              aria-label="Move Left"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <button
              type="button"
              onTouchStart={handleLaneRight}
              onClick={handleLaneRight}
              className="w-14 h-14 rounded-2xl bg-[#0B111A]/90 border border-white/20 active:bg-[#38BDF8] active:text-[#08090C] text-white flex items-center justify-center shadow-xl"
              aria-label="Move Right"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>

          <div className="pointer-events-auto">
            <button
              type="button"
              onTouchStart={handleJump}
              onClick={handleJump}
              className="w-16 h-14 rounded-2xl bg-[#38BDF8]/90 border border-[#38BDF8] active:scale-95 text-[#08090C] font-bold flex items-center justify-center shadow-xl"
              aria-label="Boost / Jump"
            >
              <ArrowUp className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
