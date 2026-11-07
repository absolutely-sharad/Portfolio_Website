import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  X,
  RotateCw,
  Box,
  Sliders,
  ChevronDown,
  ChevronUp,
  Layers,
  Sparkles,
  Eye,
  Maximize2,
  Palette,
  Compass,
} from 'lucide-react';

interface ModelInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialModelIndex?: number;
}

type CameraPreset = 'isometric' | 'front' | 'top' | 'action';
type FinishPalette = 'indigo' | 'teal' | 'gold';

// Pre-allocated scratch math helpers outside render loop to guarantee 0 GC pauses
const _vec3 = new THREE.Vector3();
const _scratchPos = new THREE.Vector3();
const _color = new THREE.Color();
const _targetCam = new THREE.Vector3(4.5, 3.2, 5.5);
const _lookTarget = new THREE.Vector3(0, 0, 0);

interface PartDescriptor {
  mesh: THREE.Mesh;
  basePos: THREE.Vector3;
  explodeDirection: THREE.Vector3;
  explodeMagnitude: number;
  finishType?: 'hull' | 'secondary' | 'accent' | 'glass';
}

export const ModelInspectorModal: React.FC<ModelInspectorModalProps> = ({
  isOpen,
  onClose,
  initialModelIndex = 0,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedModel, setSelectedModel] = useState<number>(initialModelIndex);
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [rotationSpeed, setRotationSpeed] = useState<number>(1.0);
  const [dockOpen, setDockOpen] = useState<boolean>(true);
  const [activePreset, setActivePreset] = useState<CameraPreset>('isometric');
  const [finish, setFinish] = useState<FinishPalette>('indigo');
  const [explodedAmount, setExplodedAmount] = useState<number>(0.0);

  // References for Three.js state manipulation without tearing down WebGL canvas
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const activeGroupRef = useRef<THREE.Group | null>(null);
  const partsRef = useRef<PartDescriptor[]>([]);
  const materialsRef = useRef<THREE.Material[]>([]);
  const explodedRef = useRef<number>(0.0);
  explodedRef.current = explodedAmount;

  const modelsList = [
    {
      id: 'speeder',
      name: 'Cyber Speeder Interceptor',
      tag: '10 Composite Parts · Aerodynamic PBR',
      description:
        'High-velocity reconnaissance drone with swept delta wings, beveled optical canopy, dual turbofan intakes, and twin plasma vector thrusters.',
    },
    {
      id: 'neural',
      name: 'Quantum RAG Neural Core',
      tag: '9 Composite Parts · Autonomous Agent Rig',
      description:
        'Gimbal-stabilized knowledge processor with faceted quantum crystal core, counter-rotating telemetry rings, and 4 orbiting agent probes.',
    },
    {
      id: 'cloudnode',
      name: 'Cloud Supercluster Chassis',
      tag: '11 Composite Parts · High-Availability Rack',
      description:
        'Enterprise microservice infrastructure with extruded aluminum structural pillars, 4 hot-swap server sleds, and neon cooling conduits.',
    },
    {
      id: 'rover',
      name: 'Autonomous Exploration Rover',
      tag: '10 Composite Parts · Planetary Robotics',
      description:
        'All-terrain autonomous rover featuring beveled armored body, 4 high-traction knobby wheels with suspension arms, and dual lidar sensor mast.',
    },
  ];

  // Set camera angle preset with smooth target position
  const setCameraPreset = (preset: CameraPreset) => {
    setActivePreset(preset);
    if (preset === 'isometric') {
      _targetCam.set(4.5, 3.2, 5.5);
    } else if (preset === 'front') {
      _targetCam.set(0, 0.4, 6.2);
    } else if (preset === 'top') {
      _targetCam.set(0, 8.0, 0.1);
    } else if (preset === 'action') {
      _targetCam.set(-3.8, 1.2, 3.6);
    }
  };

  // Keyboard shortcuts listener: 'H' for Zen/Cinema mode, Esc for close
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'h' || e.key === 'H') {
        setDockOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Main Three.js Scene Lifecycle
  useEffect(() => {
    if (!isOpen) return;

    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL as recommended in Three.js skill
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene, Camera, and Renderer Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x080c14);
    scene.fog = new THREE.FogExp2(0x080c14, 0.032);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.copy(_targetCam);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isSoftwareGl ? 1 : 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 2. Mandatory Studio Environment Reflection via RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 3. Balanced Studio Lighting Rig: Warm Key Light + Cool HemisphereLight fill
    const hemiLight = new THREE.HemisphereLight(0x818cf8, 0x0f172a, 0.9);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff4e6, 2.2);
    keyLight.position.set(6, 8, 6);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.shadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 25;
      keyLight.shadow.camera.left = -5;
      keyLight.shadow.camera.right = 5;
      keyLight.shadow.camera.top = 5;
      keyLight.shadow.camera.bottom = -5;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xc7d2fe, 0.85);
    fillLight.position.set(-6, -2, -5);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x14b8a6, 2.8, 18);
    rimLight.position.set(0, 3.5, -4.5);
    scene.add(rimLight);

    // 4. Studio Grounding: Floor Grid & Contact Shadow (Zero Z-Fighting)
    const grid = new THREE.GridHelper(18, 24, 0x6366f1, 0x1e293b);
    grid.position.y = -1.8;
    scene.add(grid);

    // Soft Radial Contact Shadow Grounding Plane (y = -1.78, offset by 0.02 from grid)
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(128, 128, 10, 128, 128, 120);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
      grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.3)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 256, 256);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    shadowTex.colorSpace = THREE.SRGBColorSpace;
    const shadowGeo = new THREE.PlaneGeometry(6.0, 6.0);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    });
    const contactShadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    contactShadowMesh.rotation.x = -Math.PI / 2;
    contactShadowMesh.position.y = -1.78;
    scene.add(contactShadowMesh);

    // 5. Build Selected Composite 3–12 Part Procedural Model (THREE.Group)
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);
    activeGroupRef.current = rootGroup;

    const disposables: (THREE.BufferGeometry | THREE.Material | THREE.Texture)[] = [
      shadowGeo,
      shadowMat,
      shadowTex,
    ];
    materialsRef.current = [];
    partsRef.current = [];

    const registerMat = (mat: THREE.Material) => {
      materialsRef.current.push(mat);
      disposables.push(mat);
      if (wireframe && 'wireframe' in mat) {
        (mat as any).wireframe = true;
      }
      return mat;
    };

    const addPart = (
      mesh: THREE.Mesh,
      explodeDir: THREE.Vector3,
      explodeMag: number,
      finishType: 'hull' | 'secondary' | 'accent' | 'glass' = 'hull'
    ) => {
      mesh.castShadow = !isSoftwareGl;
      mesh.receiveShadow = !isSoftwareGl;
      rootGroup.add(mesh);
      partsRef.current.push({
        mesh,
        basePos: mesh.position.clone(),
        explodeDirection: explodeDir.clone().normalize(),
        explodeMagnitude: explodeMag,
        finishType,
      });
    };

    // Color theme values for finish
    const hullHex = finish === 'gold' ? 0x1c1917 : finish === 'teal' ? 0x0f172a : 0x0f172a;
    const secondaryHex = finish === 'gold' ? 0x292524 : finish === 'teal' ? 0x134e4a : 0x1e1b4b;
    const accentHex = finish === 'gold' ? 0xf59e0b : finish === 'teal' ? 0x14b8a6 : 0x6366f1;
    const emissiveHex = finish === 'gold' ? 0xd97706 : finish === 'teal' ? 0x0d9488 : 0x4f46e5;

    if (selectedModel === 0) {
      // 1. Cyber Speeder Interceptor (10 composite parts)
      // Part 1: Main Aerodynamic Fuselage
      const hullGeo = new THREE.ConeGeometry(0.75, 3.2, 8);
      hullGeo.rotateX(Math.PI / 2);
      const hullMat = registerMat(
        new THREE.MeshStandardMaterial({
          color: hullHex,
          roughness: 0.22,
          metalness: 0.92,
        })
      );
      const hull = new THREE.Mesh(hullGeo, hullMat);
      addPart(hull, new THREE.Vector3(0, 0, -1), 0.5, 'hull');

      // Part 2: Beveled Cockpit Canopy (Optical Glass)
      const canopyGeo = new THREE.SphereGeometry(0.42, 24, 16);
      canopyGeo.scale(0.85, 0.48, 1.85);
      const canopyMat = registerMat(
        new THREE.MeshPhysicalMaterial({
          color: accentHex,
          emissive: emissiveHex,
          emissiveIntensity: 0.65,
          roughness: 0.1,
          metalness: 0.2,
          clearcoat: 1.0,
          clearcoatRoughness: 0.05,
          transparent: true,
          opacity: 0.85,
        })
      );
      const canopy = new THREE.Mesh(canopyGeo, canopyMat);
      canopy.position.set(0, 0.38, -0.2);
      addPart(canopy, new THREE.Vector3(0, 1, 0), 0.9, 'glass');

      // Parts 3 & 4: Swept Delta Wings with Ailerons
      const wingGeo = new THREE.BoxGeometry(2.2, 0.065, 1.25);
      const wingMat = registerMat(
        new THREE.MeshStandardMaterial({
          color: secondaryHex,
          metalness: 0.88,
          roughness: 0.3,
        })
      );
      const leftWing = new THREE.Mesh(wingGeo, wingMat);
      leftWing.position.set(-1.3, 0.05, 0.25);
      leftWing.rotation.y = -Math.PI / 12;
      addPart(leftWing, new THREE.Vector3(-1, 0, 0), 1.2, 'secondary');

      const rightWing = new THREE.Mesh(wingGeo, wingMat);
      rightWing.position.set(1.3, 0.05, 0.25);
      rightWing.rotation.y = Math.PI / 12;
      addPart(rightWing, new THREE.Vector3(1, 0, 0), 1.2, 'secondary');

      // Parts 5 & 6: Turbofan Engine Nacelles
      const engineGeo = new THREE.CylinderGeometry(0.26, 0.3, 1.5, 20);
      engineGeo.rotateX(Math.PI / 2);
      const engineMat = registerMat(
        new THREE.MeshStandardMaterial({
          color: 0x334155,
          metalness: 0.95,
          roughness: 0.18,
        })
      );
      const leftEng = new THREE.Mesh(engineGeo, engineMat);
      leftEng.position.set(-0.75, 0.12, 0.75);
      addPart(leftEng, new THREE.Vector3(-0.6, 0, 0.8), 1.1, 'secondary');

      const rightEng = new THREE.Mesh(engineGeo, engineMat);
      rightEng.position.set(0.75, 0.12, 0.75);
      addPart(rightEng, new THREE.Vector3(0.6, 0, 0.8), 1.1, 'secondary');

      // Parts 7 & 8: Vector Exhaust Glow Rings
      const ringGeo = new THREE.TorusGeometry(0.28, 0.055, 16, 32);
      const ringMat = registerMat(
        new THREE.MeshStandardMaterial({
          color: accentHex,
          emissive: emissiveHex,
          emissiveIntensity: 1.5,
          roughness: 0.1,
          metalness: 0.9,
        })
      );
      const leftRing = new THREE.Mesh(ringGeo, ringMat);
      leftRing.position.set(-0.75, 0.12, 1.55);
      addPart(leftRing, new THREE.Vector3(-0.6, 0, 1.5), 1.6, 'accent');

      const rightRing = new THREE.Mesh(ringGeo, ringMat);
      rightRing.position.set(0.75, 0.12, 1.55);
      addPart(rightRing, new THREE.Vector3(0.6, 0, 1.5), 1.6, 'accent');

      // Part 9: Dorsal Fin & Telemetry Mast
      const finGeo = new THREE.BoxGeometry(0.08, 0.75, 0.9);
      const finMat = registerMat(
        new THREE.MeshStandardMaterial({
          color: accentHex,
          metalness: 0.9,
          roughness: 0.2,
        })
      );
      const fin = new THREE.Mesh(finGeo, finMat);
      fin.position.set(0, 0.65, 0.65);
      fin.rotation.x = -Math.PI / 8;
      addPart(fin, new THREE.Vector3(0, 1, 0.2), 1.0, 'accent');

      // Part 10: Nose Sensor Tip
      const noseGeo = new THREE.SphereGeometry(0.18, 16, 16);
      const noseMat = registerMat(
        new THREE.MeshStandardMaterial({
          color: 0xffffff,
          emissive: accentHex,
          emissiveIntensity: 0.9,
        })
      );
      const nose = new THREE.Mesh(noseGeo, noseMat);
      nose.position.set(0, 0, -1.65);
      addPart(nose, new THREE.Vector3(0, 0, -1), 1.2, 'accent');

      disposables.push(hullGeo, canopyGeo, wingGeo, engineGeo, ringGeo, finGeo, noseGeo);
    } else if (selectedModel === 1) {
      // 2. Quantum RAG Neural Core & Gyroscopic Rig (9 composite parts)
      // Part 1: Central Faceted Quantum Crystal Core
      const coreGeo = new THREE.IcosahedronGeometry(1.25, 1);
      const coreMat = registerMat(
        new THREE.MeshPhysicalMaterial({
          color: accentHex,
          emissive: emissiveHex,
          emissiveIntensity: 0.8,
          roughness: 0.1,
          metalness: 0.85,
          clearcoat: 1.0,
          clearcoatRoughness: 0.08,
        })
      );
      const core = new THREE.Mesh(coreGeo, coreMat);
      addPart(core, new THREE.Vector3(0, 0, 0), 0.0, 'accent');

      // Part 2: Inner Geodesic Shell
      const shellGeo = new THREE.IcosahedronGeometry(1.5, 2);
      const shellMat = registerMat(
        new THREE.MeshBasicMaterial({
          color: accentHex,
          wireframe: true,
          transparent: true,
          opacity: 0.45,
        })
      );
      const shell = new THREE.Mesh(shellGeo, shellMat);
      addPart(shell, new THREE.Vector3(0, 1, 0), 0.4, 'glass');

      // Part 3: Horizontal Primary Gimbal Ring
      const ring1Geo = new THREE.TorusGeometry(2.1, 0.055, 16, 64);
      const ring1Mat = registerMat(
        new THREE.MeshStandardMaterial({
          color: secondaryHex,
          emissive: emissiveHex,
          emissiveIntensity: 0.3,
          metalness: 0.95,
          roughness: 0.18,
        })
      );
      const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
      addPart(ring1, new THREE.Vector3(0, 1.2, 0), 1.2, 'secondary');

      // Part 4: Tilted Secondary Gimbal Ring
      const ring2Geo = new THREE.TorusGeometry(2.5, 0.05, 16, 64);
      const ring2Mat = registerMat(
        new THREE.MeshStandardMaterial({
          color: hullHex,
          emissive: accentHex,
          emissiveIntensity: 0.4,
          metalness: 0.92,
          roughness: 0.22,
        })
      );
      const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
      ring2.rotation.x = Math.PI / 3;
      ring2.rotation.y = Math.PI / 6;
      addPart(ring2, new THREE.Vector3(0, -1.2, 0), 1.2, 'secondary');

      // Part 5: Equatorial Telemetry Orbit Ring
      const ring3Geo = new THREE.TorusGeometry(2.85, 0.035, 16, 64);
      const ring3Mat = registerMat(
        new THREE.MeshBasicMaterial({
          color: accentHex,
          wireframe: true,
          transparent: true,
          opacity: 0.5,
        })
      );
      const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
      ring3.rotation.x = -Math.PI / 4;
      addPart(ring3, new THREE.Vector3(1, 0, 0), 0.8, 'accent');

      // Parts 6-9: 4 Orbiting Octahedral Satellites
      for (let i = 0; i < 4; i++) {
        const satGeo = new THREE.OctahedronGeometry(0.24, 0);
        const satMat = registerMat(
          new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: accentHex,
            emissiveIntensity: 0.9,
            metalness: 0.9,
            roughness: 0.1,
          })
        );
        const sat = new THREE.Mesh(satGeo, satMat);
        const angle = (i * Math.PI) / 2;
        sat.position.set(Math.cos(angle) * 3.1, Math.sin(angle) * 0.5, Math.sin(angle) * 3.1);
        addPart(sat, new THREE.Vector3(Math.cos(angle), 0.3, Math.sin(angle)), 1.5, 'accent');
        disposables.push(satGeo);
      }

      disposables.push(coreGeo, shellGeo, ring1Geo, ring2Geo, ring3Geo);
    } else if (selectedModel === 2) {
      // 3. Enterprise Cloud Supercluster Chassis (11 composite parts)
      // Part 1: Structural Chassis Pillar Frame
      const frameGeo = new THREE.BoxGeometry(2.4, 3.6, 1.6);
      const frameMat = registerMat(
        new THREE.MeshStandardMaterial({
          color: hullHex,
          metalness: 0.92,
          roughness: 0.25,
        })
      );
      const frame = new THREE.Mesh(frameGeo, frameMat);
      addPart(frame, new THREE.Vector3(0, 0, -0.6), 0.4, 'hull');

      // Part 2: Top Cooling Exhaust Manifold
      const manifoldGeo = new THREE.BoxGeometry(2.3, 0.3, 1.5);
      const manifoldMat = registerMat(
        new THREE.MeshStandardMaterial({
          color: secondaryHex,
          metalness: 0.9,
          roughness: 0.2,
        })
      );
      const manifold = new THREE.Mesh(manifoldGeo, manifoldMat);
      manifold.position.set(0, 1.95, 0);
      addPart(manifold, new THREE.Vector3(0, 1, 0), 1.2, 'secondary');

      // Parts 3-6: 4 Modular Hot-Swap Blade Server Sleds
      for (let i = 0; i < 4; i++) {
        const bladeGeo = new THREE.BoxGeometry(2.1, 0.58, 1.5);
        const bladeMat = registerMat(
          new THREE.MeshStandardMaterial({
            color: secondaryHex,
            metalness: 0.85,
            roughness: 0.28,
          })
        );
        const blade = new THREE.Mesh(bladeGeo, bladeMat);
        const yPos = 1.15 - i * 0.78;
        blade.position.set(0, yPos, 0.1);
        addPart(blade, new THREE.Vector3(0, 0, 1), 0.8 + i * 0.3, 'secondary');

        // Part 7: LED Diagnostic Status Diode Array
        const ledGeo = new THREE.BoxGeometry(0.35, 0.08, 0.06);
        const ledMat = registerMat(
          new THREE.MeshStandardMaterial({
            color: i % 2 === 0 ? accentHex : 0x10b981,
            emissive: i % 2 === 0 ? emissiveHex : 0x059669,
            emissiveIntensity: 1.2,
          })
        );
        const led = new THREE.Mesh(ledGeo, ledMat);
        led.position.set(-0.7, yPos, 0.86);
        addPart(led, new THREE.Vector3(0, 0, 1), 1.2 + i * 0.3, 'accent');
        disposables.push(bladeGeo, ledGeo);
      }

      // Parts 8 & 9: Dual Vertical Neon Cooling Conduits
      const pipeGeo = new THREE.CylinderGeometry(0.08, 0.08, 3.5, 16);
      const pipeMat = registerMat(
        new THREE.MeshStandardMaterial({
          color: accentHex,
          emissive: emissiveHex,
          emissiveIntensity: 0.9,
          metalness: 0.95,
          roughness: 0.1,
        })
      );
      const leftPipe = new THREE.Mesh(pipeGeo, pipeMat);
      leftPipe.position.set(-1.1, 0, 0.75);
      addPart(leftPipe, new THREE.Vector3(-1, 0, 0.5), 1.3, 'accent');

      const rightPipe = new THREE.Mesh(pipeGeo, pipeMat);
      rightPipe.position.set(1.1, 0, 0.75);
      addPart(rightPipe, new THREE.Vector3(1, 0, 0.5), 1.3, 'accent');

      // Part 10: Base Heavy Footing Plate
      const baseGeo = new THREE.BoxGeometry(2.6, 0.2, 1.8);
      const baseMat = registerMat(
        new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.95, roughness: 0.4 })
      );
      const basePlate = new THREE.Mesh(baseGeo, baseMat);
      basePlate.position.set(0, -1.8, 0);
      addPart(basePlate, new THREE.Vector3(0, -1, 0), 0.6, 'hull');

      // Part 11: Top Broadcast Transponder Antenna
      const antGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.8, 8);
      const antMat = registerMat(
        new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: accentHex, emissiveIntensity: 0.8 })
      );
      const antenna = new THREE.Mesh(antGeo, antMat);
      antenna.position.set(0.8, 2.4, 0);
      addPart(antenna, new THREE.Vector3(0.5, 1, 0), 1.5, 'accent');

      disposables.push(frameGeo, manifoldGeo, pipeGeo, baseGeo, antGeo);
    } else {
      // 4. Autonomous Exploration Rover Bot (10 composite parts)
      // Part 1: Beveled Low-Slung Armored Chassis Hull
      const bodyGeo = new THREE.BoxGeometry(2.0, 0.6, 2.6);
      const bodyMat = registerMat(
        new THREE.MeshStandardMaterial({
          color: hullHex,
          metalness: 0.9,
          roughness: 0.24,
        })
      );
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.position.set(0, 0, 0);
      addPart(body, new THREE.Vector3(0, 0.5, 0), 0.4, 'hull');

      // Parts 2-5: 4 Independent Knobby Wheels with Alloy Rims
      const wheelPositions = [
        { x: -1.25, z: 1.0, dir: new THREE.Vector3(-1, 0, 0.6) },
        { x: 1.25, z: 1.0, dir: new THREE.Vector3(1, 0, 0.6) },
        { x: -1.25, z: -1.0, dir: new THREE.Vector3(-1, 0, -0.6) },
        { x: 1.25, z: -1.0, dir: new THREE.Vector3(1, 0, -0.6) },
      ];
      const tireGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.35, 24);
      tireGeo.rotateZ(Math.PI / 2);
      const tireMat = registerMat(
        new THREE.MeshStandardMaterial({
          color: 0x18181b,
          roughness: 0.85,
          metalness: 0.2,
        })
      );
      const rimGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.36, 16);
      rimGeo.rotateZ(Math.PI / 2);
      const rimMat = registerMat(
        new THREE.MeshStandardMaterial({
          color: accentHex,
          metalness: 0.95,
          roughness: 0.15,
        })
      );

      wheelPositions.forEach((pos) => {
        const wheelGroup = new THREE.Group();
        const tire = new THREE.Mesh(tireGeo, tireMat);
        const rim = new THREE.Mesh(rimGeo, rimMat);
        wheelGroup.add(tire);
        wheelGroup.add(rim);
        wheelGroup.position.set(pos.x, -0.3, pos.z);
        // Cast as Mesh for PartDescriptor
        addPart(wheelGroup as any, pos.dir, 1.4, 'secondary');
      });

      // Parts 6 & 7: Dual Wishbone Suspension Arms
      const armGeo = new THREE.BoxGeometry(2.3, 0.1, 0.15);
      const armMat = registerMat(
        new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.9, roughness: 0.2 })
      );
      const frontArm = new THREE.Mesh(armGeo, armMat);
      frontArm.position.set(0, -0.28, 1.0);
      addPart(frontArm, new THREE.Vector3(0, -1, 0.5), 0.9, 'secondary');

      const rearArm = new THREE.Mesh(armGeo, armMat);
      rearArm.position.set(0, -0.28, -1.0);
      addPart(rearArm, new THREE.Vector3(0, -1, -0.5), 0.9, 'secondary');

      // Part 8: Steerable Sensor Turret Mast
      const mastGeo = new THREE.CylinderGeometry(0.08, 0.1, 1.1, 12);
      const mastMat = registerMat(
        new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.9, roughness: 0.2 })
      );
      const mast = new THREE.Mesh(mastGeo, mastMat);
      mast.position.set(0.5, 0.85, 0.6);
      addPart(mast, new THREE.Vector3(0.5, 1, 0.5), 1.1, 'secondary');

      // Part 9: Dual Optical Camera Visor
      const visorGeo = new THREE.BoxGeometry(0.65, 0.25, 0.35);
      const visorMat = registerMat(
        new THREE.MeshPhysicalMaterial({
          color: accentHex,
          emissive: emissiveHex,
          emissiveIntensity: 0.9,
          roughness: 0.1,
          metalness: 0.8,
          clearcoat: 1.0,
        })
      );
      const visor = new THREE.Mesh(visorGeo, visorMat);
      visor.position.set(0.5, 1.45, 0.6);
      addPart(visor, new THREE.Vector3(0.5, 1.5, 0.8), 1.4, 'accent');

      // Part 10: Top Spinning Lidar Prism Scanner
      const lidarGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.22, 16);
      const lidarMat = registerMat(
        new THREE.MeshStandardMaterial({ color: 0x0f172a, emissive: accentHex, emissiveIntensity: 0.5 })
      );
      const lidar = new THREE.Mesh(lidarGeo, lidarMat);
      lidar.position.set(0.5, 1.68, 0.6);
      addPart(lidar, new THREE.Vector3(0.5, 2.0, 0.5), 1.7, 'accent');

      disposables.push(bodyGeo, tireGeo, rimGeo, armGeo, mastGeo, visorGeo, lidarGeo);
    }

    // 6. Interactive Drag Orbit Controls with Smooth Damping
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotY = 0;
    let targetRotX = 0.2;

    const handlePointerDown = (e: PointerEvent) => {
      // Don't drag if clicking UI dock
      if ((e.target as HTMLElement)?.closest('.ui-dock')) return;
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouseX;
      const dy = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      targetRotY += dx * 0.0075;
      targetRotX += dy * 0.0075;
      targetRotX = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, targetRotX));
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY * 0.006;
      _targetCam.multiplyScalar(1 + zoomFactor * 0.1);
      _targetCam.clampLength(2.8, 14.0);
    };

    container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    container.addEventListener('wheel', handleWheel, { passive: false });

    // 7. Responsive Resizing
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 8. Lossless 60fps Loop with Damped Interpolation
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.1);

      // Auto-rotation when not interacting
      if (autoRotate && !isDragging) {
        targetRotY += dt * 0.5 * rotationSpeed;
      }

      // Smooth camera damping: 1 - Math.exp(-6 * dt)
      const camDamp = 1 - Math.exp(-6 * dt);
      camera.position.lerp(_targetCam, camDamp);
      camera.lookAt(_lookTarget);

      // Smooth model rotation damping
      const rotDamp = 1 - Math.exp(-8 * dt);
      rootGroup.rotation.y += (targetRotY - rootGroup.rotation.y) * rotDamp;
      rootGroup.rotation.x += (targetRotX - rootGroup.rotation.x) * rotDamp;

      // Smooth Exploded View Separation
      const expAmt = explodedRef.current;
      const expDamp = 1 - Math.exp(-8 * dt);
      for (let i = 0; i < partsRef.current.length; i++) {
        const part = partsRef.current[i];
        _scratchPos
          .copy(part.basePos)
          .addScaledVector(part.explodeDirection, part.explodeMagnitude * expAmt);
        part.mesh.position.lerp(_scratchPos, expDamp);
      }

      renderer.render(scene, camera);
    };

    animate();

    // 9. Thorough WebGL Disposal
    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
    };
  }, [isOpen, selectedModel, finish, wireframe, autoRotate, rotationSpeed]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#080C14] flex flex-col overflow-hidden animate-in fade-in duration-200 select-none">
      {/* Top Header Bar: Solid dark surface, high-contrast typography, zero pulsation */}
      <header className="relative z-20 px-4 sm:px-6 py-3.5 border-b border-white/10 flex items-center justify-between bg-[#0B0F17] shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#6366F1]/15 border border-[#6366F1]/30">
            <Box className="w-5 h-5 text-[#14B8A6]" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span>Three.js 3D Studio & Inspector</span>
              <span className="text-[10px] font-mono text-[#14B8A6] bg-[#14B8A6]/15 px-2 py-0.5 rounded-full border border-[#14B8A6]/30">
                PBR · 60 FPS
              </span>
            </h2>
            <p className="text-xs text-zinc-400 hidden sm:block">
              Composite procedural models with exploded kinematics, RoomEnvironment, and studio softbox lighting.
            </p>
          </div>
        </div>

        {/* Model Switcher Tabs (Desktop) */}
        <div className="hidden lg:flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/10">
          {modelsList.map((m, idx) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setSelectedModel(idx)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                selectedModel === idx
                  ? 'bg-[#6366F1] text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="p-2 text-zinc-400 hover:text-white rounded-xl bg-white/[0.05] hover:bg-white/10 transition-colors focus:outline-none"
          aria-label="Close 3D Studio"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* Main Full-Bleed 3D Viewport */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        {/* WebGL Canvas Container */}
        <div
          ref={mountRef}
          className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
          title="Click and drag to rotate · Scroll to zoom"
        />

        {/* Model Spec Badge (Top-Left): Solid surface, clean typography */}
        <div className="absolute top-4 left-4 z-10 max-w-xs p-3.5 rounded-xl bg-[#0E141F] border border-white/10 text-xs shadow-xl pointer-events-none">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#14B8A6] font-semibold mb-1">
            {modelsList[selectedModel].tag}
          </div>
          <div className="text-sm font-bold text-white mb-1">{modelsList[selectedModel].name}</div>
          <p className="text-zinc-300 leading-relaxed text-[11px]">
            {modelsList[selectedModel].description}
          </p>
          <div className="mt-2 text-[10px] text-zinc-500 font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6366F1]" />
            <span>Drag to rotate · Scroll to zoom · Press H for Zen Mode</span>
          </div>
        </div>

        {/* Unified Bottom Control Dock (Collapsible, <= 15% Viewport Footprint, Solid Surface) */}
        <div className="ui-dock absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[95%] max-w-3xl">
          <div className="bg-[#0E141F] border border-white/15 rounded-2xl shadow-2xl overflow-hidden transition-all">
            {/* Dock Header & Collapse Button */}
            <div className="px-4 py-2 flex items-center justify-between text-xs bg-[#131B28] border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-[#14B8A6]">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>3D STUDIO CONTROLS</span>
                </span>
                <span className="text-zinc-600">·</span>
                <span className="text-[10px] text-zinc-400 font-mono">
                  {dockOpen ? 'Expanded' : 'Compact'}
                </span>
              </div>

              {/* Model selection dropdown for mobile */}
              <div className="flex lg:hidden items-center gap-1">
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(parseInt(e.target.value, 10))}
                  className="bg-black/40 text-white text-xs border border-white/10 rounded-md px-2 py-0.5"
                >
                  {modelsList.map((m, idx) => (
                    <option key={m.id} value={idx}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cinema / Zen Mode Toggle Button */}
              <button
                type="button"
                onClick={() => setDockOpen(!dockOpen)}
                className="flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-mono text-zinc-300 hover:text-white bg-white/[0.06] hover:bg-white/[0.1] transition-colors"
                title={dockOpen ? 'Hide controls (Zen Mode - Press H)' : 'Show controls (Press H)'}
              >
                <span>{dockOpen ? 'Hide' : 'Show'}</span>
                {dockOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Expanded Controls Grid */}
            {dockOpen && (
              <div className="p-3.5 space-y-3 bg-[#0E141F]">
                {/* Row 1: Exploded View Slider & Material Finishes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Exploded View Slider */}
                  <div className="flex items-center gap-2 bg-white/[0.03] p-2 rounded-xl border border-white/[0.06]">
                    <Layers className="w-4 h-4 text-[#6366F1] shrink-0" />
                    <span className="text-zinc-300 font-medium whitespace-nowrap text-[11px]">
                      Exploded View:
                    </span>
                    <input
                      type="range"
                      min="0.0"
                      max="1.0"
                      step="0.05"
                      value={explodedAmount}
                      onChange={(e) => setExplodedAmount(parseFloat(e.target.value))}
                      className="w-full accent-[#6366F1] cursor-pointer"
                    />
                    <span className="font-mono text-[10px] text-zinc-400 w-8 text-right shrink-0">
                      {Math.round(explodedAmount * 100)}%
                    </span>
                  </div>

                  {/* Material Finish Swatches */}
                  <div className="flex items-center justify-between gap-2 bg-white/[0.03] p-2 rounded-xl border border-white/[0.06]">
                    <div className="flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-[#14B8A6]" />
                      <span className="text-zinc-300 font-medium text-[11px]">Finish:</span>
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => setFinish('indigo')}
                        className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono transition-all ${
                          finish === 'indigo'
                            ? 'bg-[#6366F1] text-white font-bold shadow-[0_0_8px_rgba(99,102,241,0.5)]'
                            : 'bg-white/[0.05] text-zinc-300 hover:text-white'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-[#6366F1]" />
                        <span>Indigo</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFinish('teal')}
                        className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono transition-all ${
                          finish === 'teal'
                            ? 'bg-[#14B8A6] text-zinc-950 font-bold shadow-[0_0_8px_rgba(20,184,166,0.5)]'
                            : 'bg-white/[0.05] text-zinc-300 hover:text-white'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-[#14B8A6]" />
                        <span>Teal</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFinish('gold')}
                        className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono transition-all ${
                          finish === 'gold'
                            ? 'bg-[#F59E0B] text-zinc-950 font-bold shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                            : 'bg-white/[0.05] text-zinc-300 hover:text-white'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                        <span>Gold</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Row 2: Camera Presets & Orbit Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/[0.06] text-xs">
                  {/* Camera Angles */}
                  <div className="flex items-center gap-2">
                    <Compass className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span className="text-zinc-400 text-[11px]">Camera:</span>
                    <div className="flex gap-1 flex-1">
                      {(['isometric', 'front', 'top', 'action'] as CameraPreset[]).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setCameraPreset(p)}
                          className={`flex-1 px-2 py-1 text-[10px] font-mono capitalize rounded-md transition-colors ${
                            activePreset === p
                              ? 'bg-[#6366F1] text-white font-bold'
                              : 'bg-white/[0.05] text-zinc-300 hover:text-white'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Wireframe, Auto-Rotate & Speed */}
                  <div className="flex items-center justify-between gap-3">
                    <label className="flex items-center gap-1.5 cursor-pointer text-zinc-300 hover:text-white text-[11px]">
                      <input
                        type="checkbox"
                        checked={wireframe}
                        onChange={(e) => setWireframe(e.target.checked)}
                        className="rounded accent-[#6366F1]"
                      />
                      <span>Wireframe</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer text-zinc-300 hover:text-white text-[11px]">
                      <input
                        type="checkbox"
                        checked={autoRotate}
                        onChange={(e) => setAutoRotate(e.target.checked)}
                        className="rounded accent-[#14B8A6]"
                      />
                      <span>Auto Orbit</span>
                    </label>

                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                      <span>Speed:</span>
                      <input
                        type="range"
                        min="0.4"
                        max="2.5"
                        step="0.3"
                        value={rotationSpeed}
                        onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
                        className="w-16 accent-[#14B8A6]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
