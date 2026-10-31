import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  X,
  RotateCw,
  Maximize2,
  Box,
  Eye,
  Sliders,
  ChevronDown,
  ChevronUp,
  Layers,
  Sparkles,
} from 'lucide-react';

interface ModelInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialModelIndex?: number;
}

type CameraPreset = 'isometric' | 'front' | 'top' | 'action';

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

  // Shared refs for Three.js manipulation
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const activeGroupRef = useRef<THREE.Group | null>(null);
  const materialsRef = useRef<THREE.Material[]>([]);

  const modelsList = [
    {
      id: 'speeder',
      name: 'Cyber Speeder Drone',
      tag: '8 Composite Parts',
      description: 'Aerodynamic interceptor with swept wings, dual turbo-thrusters, and plasma guidance tips.',
    },
    {
      id: 'neural',
      name: 'Quantum RAG Processor',
      tag: '7 Composite Parts',
      description: 'Vector embeddings neural core with dual gyroscopic orbital rings and data resonance nodes.',
    },
    {
      id: 'cloudnode',
      name: 'Cloud Supercluster Rack',
      tag: '8 Composite Parts',
      description: 'High-availability microservice chassis with neon cooling manifolds and status indicator diodes.',
    },
  ];

  // Update wireframe state on all tracked materials
  useEffect(() => {
    materialsRef.current.forEach((mat) => {
      if ('wireframe' in mat) {
        (mat as any).wireframe = wireframe;
      }
    });
  }, [wireframe]);

  // Set camera angle preset
  const setCameraPreset = (preset: CameraPreset) => {
    setActivePreset(preset);
    const camera = cameraRef.current;
    if (!camera) return;

    if (preset === 'isometric') {
      camera.position.set(4, 3, 5);
    } else if (preset === 'front') {
      camera.position.set(0, 0.5, 6);
    } else if (preset === 'top') {
      camera.position.set(0, 7, 0.1);
    } else if (preset === 'action') {
      camera.position.set(-3.5, 1.2, 3.5);
    }
    camera.lookAt(0, 0, 0);
  };

  useEffect(() => {
    if (!isOpen) return;

    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x080c14);
    scene.fog = new THREE.FogExp2(0x080c14, 0.035);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(4, 3, 5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // 2. Studio PBR Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5e6, 2.2);
    keyLight.position.set(6, 8, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe6f0ff, 0.9);
    fillLight.position.set(-6, -4, -6);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x38bdf8, 3.0, 20);
    rimLight.position.set(0, 3, -4);
    scene.add(rimLight);

    // Base Grid Floor
    const grid = new THREE.GridHelper(16, 24, 0x38bdf8, 0x1e293b);
    grid.position.y = -1.8;
    scene.add(grid);

    // 3. Build Model Based on selectedModel
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);
    activeGroupRef.current = rootGroup;

    const disposables: (THREE.BufferGeometry | THREE.Material)[] = [];
    materialsRef.current = [];

    const registerMat = (mat: THREE.Material) => {
      materialsRef.current.push(mat);
      disposables.push(mat);
      if (wireframe && 'wireframe' in mat) {
        (mat as any).wireframe = true;
      }
      return mat;
    };

    if (selectedModel === 0) {
      // 1. Cyber Speeder Drone (8 parts)
      const hullGeo = new THREE.ConeGeometry(0.7, 3.0, 6);
      hullGeo.rotateX(Math.PI / 2);
      const hullMat = registerMat(new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2, metalness: 0.9 }));
      const hull = new THREE.Mesh(hullGeo, hullMat);
      rootGroup.add(hull);

      const canopyGeo = new THREE.SphereGeometry(0.4, 16, 16);
      canopyGeo.scale(0.9, 0.5, 1.8);
      const canopyMat = registerMat(new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.8, roughness: 0.1, transmission: 0.5 }));
      const canopy = new THREE.Mesh(canopyGeo, canopyMat);
      canopy.position.set(0, 0.35, -0.2);
      rootGroup.add(canopy);

      const wingGeo = new THREE.BoxGeometry(2.0, 0.06, 1.1);
      const wingMat = registerMat(new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85, roughness: 0.3 }));
      const leftWing = new THREE.Mesh(wingGeo, wingMat);
      leftWing.position.set(-1.2, 0.05, 0.2);
      leftWing.rotation.y = -Math.PI / 12;
      rootGroup.add(leftWing);

      const rightWing = new THREE.Mesh(wingGeo, wingMat);
      rightWing.position.set(1.2, 0.05, 0.2);
      rightWing.rotation.y = Math.PI / 12;
      rootGroup.add(rightWing);

      const engineGeo = new THREE.CylinderGeometry(0.25, 0.28, 1.4, 16);
      engineGeo.rotateX(Math.PI / 2);
      const engineMat = registerMat(new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9 }));
      const leftEng = new THREE.Mesh(engineGeo, engineMat);
      leftEng.position.set(-0.7, 0.1, 0.7);
      rootGroup.add(leftEng);

      const rightEng = new THREE.Mesh(engineGeo, engineMat);
      rightEng.position.set(0.7, 0.1, 0.7);
      rootGroup.add(rightEng);

      const ringGeo = new THREE.TorusGeometry(0.26, 0.05, 12, 24);
      const ringMat = registerMat(new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
      const leftRing = new THREE.Mesh(ringGeo, ringMat);
      leftRing.position.set(-0.7, 0.1, 1.4);
      rootGroup.add(leftRing);

      const rightRing = new THREE.Mesh(ringGeo, ringMat);
      rightRing.position.set(0.7, 0.1, 1.4);
      rootGroup.add(rightRing);

      disposables.push(hullGeo, canopyGeo, wingGeo, engineGeo, ringGeo);
    } else if (selectedModel === 1) {
      // 2. Quantum RAG Processor (7 parts)
      const coreGeo = new THREE.IcosahedronGeometry(1.2, 1);
      const coreMat = registerMat(new THREE.MeshPhysicalMaterial({ color: 0x0284c7, emissive: 0x38bdf8, emissiveIntensity: 0.6, roughness: 0.1, metalness: 0.4, transmission: 0.6 }));
      const core = new THREE.Mesh(coreGeo, coreMat);
      rootGroup.add(core);

      const ring1Geo = new THREE.TorusGeometry(1.8, 0.05, 16, 64);
      const ring1Mat = registerMat(new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.9, roughness: 0.2 }));
      const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
      ring1.rotation.x = Math.PI / 4;
      rootGroup.add(ring1);

      const ring2Geo = new THREE.TorusGeometry(2.1, 0.05, 16, 64);
      const ring2Mat = registerMat(new THREE.MeshStandardMaterial({ color: 0x818cf8, metalness: 0.9, roughness: 0.2 }));
      const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
      ring2.rotation.y = Math.PI / 3;
      ring2.rotation.z = Math.PI / 6;
      rootGroup.add(ring2);

      // Shard nodes
      for (let i = 0; i < 4; i++) {
        const shardGeo = new THREE.OctahedronGeometry(0.22);
        const shardMat = registerMat(new THREE.MeshBasicMaterial({ color: 0xffffff }));
        const shard = new THREE.Mesh(shardGeo, shardMat);
        const angle = (i * Math.PI) / 2;
        shard.position.set(Math.cos(angle) * 1.8, Math.sin(angle) * 1.8, 0);
        rootGroup.add(shard);
        disposables.push(shardGeo);
      }

      disposables.push(coreGeo, ring1Geo, ring2Geo);
    } else {
      // 3. Cloud Supercluster Rack (8 parts)
      const frameGeo = new THREE.BoxGeometry(2.2, 3.4, 1.4);
      const frameMat = registerMat(new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.25 }));
      const frame = new THREE.Mesh(frameGeo, frameMat);
      rootGroup.add(frame);

      // 4 Server blade drawers
      for (let i = 0; i < 4; i++) {
        const bladeGeo = new THREE.BoxGeometry(2.0, 0.55, 1.35);
        const bladeMat = registerMat(new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.3 }));
        const blade = new THREE.Mesh(bladeGeo, bladeMat);
        blade.position.set(0, 1.1 - i * 0.72, 0.05);
        rootGroup.add(blade);

        // LED diode strip
        const diodeGeo = new THREE.BoxGeometry(0.3, 0.08, 0.05);
        const diodeMat = registerMat(new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0x38bdf8 : 0x10b981 }));
        const diode = new THREE.Mesh(diodeGeo, diodeMat);
        diode.position.set(-0.7, 1.1 - i * 0.72, 0.73);
        rootGroup.add(diode);
        disposables.push(bladeGeo, diodeGeo);
      }

      // Cooling pipe
      const pipeGeo = new THREE.CylinderGeometry(0.08, 0.08, 3.4, 16);
      const pipeMat = registerMat(new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.95, roughness: 0.1 }));
      const pipe = new THREE.Mesh(pipeGeo, pipeMat);
      pipe.position.set(1.0, 0, 0.65);
      rootGroup.add(pipe);

      disposables.push(frameGeo, pipeGeo);
    }

    // 4. Interactive Pointer Orbit Dragging
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const handlePointerDown = (e: PointerEvent) => {
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

      rootGroup.rotation.y += dx * 0.008;
      rootGroup.rotation.x += dy * 0.008;
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z = Math.max(3.0, Math.min(12.0, camera.position.z + e.deltaY * 0.005));
    };

    container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    container.addEventListener('wheel', handleWheel, { passive: false });

    // 5. Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 6. Animation loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const dt = clock.getDelta();

      if (autoRotate && !isDragging) {
        rootGroup.rotation.y += dt * 0.6 * rotationSpeed;
      }

      renderer.render(scene, camera);
    };

    animate();

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
  }, [isOpen, selectedModel, autoRotate, rotationSpeed]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#080C14]/95 backdrop-blur-xl flex flex-col overflow-hidden animate-in fade-in duration-200">
      {/* Top Header Bar */}
      <header className="relative z-20 px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/40">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#38BDF8]/10 border border-[#38BDF8]/30">
            <Box className="w-5 h-5 text-[#38BDF8]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>3D Model Studio & Inspector</span>
              <span className="text-[10px] font-mono text-[#38BDF8] bg-[#38BDF8]/15 px-2 py-0.5 rounded-full border border-[#38BDF8]/30">
                Three.js PBR
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Composite procedural models with orbit physics and studio lighting.
            </p>
          </div>
        </div>

        {/* Model Switcher Tabs */}
        <div className="hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/10">
          {modelsList.map((m, idx) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setSelectedModel(idx)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                selectedModel === idx
                  ? 'bg-[#38BDF8] text-[#08090C] shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-2 text-slate-400 hover:text-white rounded-xl bg-white/[0.05] hover:bg-white/10 transition-colors"
          aria-label="Close 3D Inspector"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* Main 3D Viewport */}
      <div className="relative flex-1 w-full h-full">
        <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Floating Model Info Card */}
        <div className="absolute top-4 left-4 z-10 max-w-xs p-4 rounded-xl bg-[#0E141F]/85 border border-white/10 text-xs shadow-xl pointer-events-none">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#38BDF8] mb-1">
            {modelsList[selectedModel].tag}
          </div>
          <div className="text-sm font-bold text-white mb-1">{modelsList[selectedModel].name}</div>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            {modelsList[selectedModel].description}
          </p>
          <div className="mt-2 text-[10px] text-slate-500 font-mono">
            Drag to rotate · Scroll to zoom
          </div>
        </div>

        {/* Collapsible Bottom Control Dock */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[95%] max-w-xl">
          <div className="bg-[#0E141F]/90 border border-white/15 rounded-2xl shadow-2xl overflow-hidden transition-all">
            {/* Dock Header Toggle */}
            <button
              type="button"
              onClick={() => setDockOpen(!dockOpen)}
              className="w-full px-4 py-2 flex items-center justify-between text-xs font-medium text-slate-300 hover:text-white bg-white/[0.02] border-b border-white/[0.06]"
            >
              <span className="flex items-center gap-1.5 font-mono text-[11px] text-[#38BDF8]">
                <Sliders className="w-3.5 h-3.5" />
                <span>3D VIEW CONTROLS</span>
              </span>
              {dockOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>

            {dockOpen && (
              <div className="p-4 space-y-3">
                {/* Camera View Presets */}
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="text-slate-400 font-medium">Camera Angle:</span>
                  <div className="flex gap-1">
                    {(['isometric', 'front', 'top', 'action'] as CameraPreset[]).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setCameraPreset(p)}
                        className={`px-2.5 py-1 text-[11px] font-mono capitalize rounded-lg transition-colors ${
                          activePreset === p
                            ? 'bg-[#38BDF8] text-[#08090C] font-bold'
                            : 'bg-white/[0.05] text-slate-300 hover:text-white'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Toggles & Slider */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t border-white/[0.06] text-xs">
                  {/* Wireframe toggle */}
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                    <input
                      type="checkbox"
                      checked={wireframe}
                      onChange={(e) => setWireframe(e.target.checked)}
                      className="rounded accent-[#38BDF8]"
                    />
                    <span>Wireframe Mesh</span>
                  </label>

                  {/* Auto-rotate toggle */}
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                    <input
                      type="checkbox"
                      checked={autoRotate}
                      onChange={(e) => setAutoRotate(e.target.checked)}
                      className="rounded accent-[#38BDF8]"
                    />
                    <span>Auto Rotate</span>
                  </label>

                  {/* Speed slider */}
                  <div className="col-span-2 sm:col-span-1 flex items-center gap-2">
                    <span className="text-slate-400 text-[11px]">Speed:</span>
                    <input
                      type="range"
                      min="0.2"
                      max="3.0"
                      step="0.2"
                      value={rotationSpeed}
                      onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
                      className="w-full accent-[#38BDF8]"
                    />
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
