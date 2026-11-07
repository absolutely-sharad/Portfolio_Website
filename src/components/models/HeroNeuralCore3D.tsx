import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RotateCw, Layers } from 'lucide-react';

interface HeroNeuralCore3DProps {
  className?: string;
}

// Pre-allocated scratch math helpers outside render loop to guarantee 0 GC pauses
const _vec3 = new THREE.Vector3();
const _scratchMat = new THREE.Matrix4();

export const HeroNeuralCore3D: React.FC<HeroNeuralCore3DProps> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [isRotating, setIsRotating] = useState<boolean>(true);

  // Keep ref for dynamic wireframe & rotation toggles without rebuilding scene
  const wireframeRef = useRef<boolean>(wireframe);
  wireframeRef.current = wireframe;

  const isRotatingRef = useRef<boolean>(isRotating);
  isRotatingRef.current = isRotating;

  useEffect(() => {
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

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const width = container.clientWidth || 480;
    const height = container.clientHeight || 480;

    // 1. Scene setup
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isSoftwareGl ? 1 : 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 2. Studio PBR Environment Map via RoomEnvironment + PMREMGenerator
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 3. Balanced Studio Lighting Rig: Warm Key Light + Cool HemisphereLight fill
    const hemiLight = new THREE.HemisphereLight(0x818cf8, 0x0f172a, 0.85);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff5e6, 2.0);
    keyLight.position.set(4, 5, 5);
    keyLight.castShadow = !isSoftwareGl;
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0x6366f1, 2.8, 18);
    rimLight.position.set(-3, -2, -3);
    scene.add(rimLight);

    const tealAccent = new THREE.PointLight(0x14b8a6, 2.2, 16);
    tealAccent.position.set(3, -3, 3);
    scene.add(tealAccent);

    // 4. Soft Radial Contact Shadow Grounding Plane (prevents floating in void)
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const shadowCtx = shadowCanvas.getContext('2d');
    if (shadowCtx) {
      const grad = shadowCtx.createRadialGradient(128, 128, 10, 128, 128, 120);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
      grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.25)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      shadowCtx.fillStyle = grad;
      shadowCtx.fillRect(0, 0, 256, 256);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowPlaneGeo = new THREE.PlaneGeometry(5.0, 5.0);
    const shadowPlaneMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
    });
    const contactShadow = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = -2.6;
    scene.add(contactShadow);

    // 5. Composite Procedural Model: Autonomous Agent Neural Core (THREE.Group)
    // Structure of 7 distinct parts:
    //  - Part 1: Central Quantum icosahedron with physical transmission and clearcoat
    //  - Part 2: Inner faceted geodesic telemetry lattice
    //  - Part 3: Primary Cyber Indigo gyro gimbal ring
    //  - Part 4: Tilted Neural Teal secondary gimbal ring
    //  - Part 5: Equatorial telemetry orbit ring with telemetry ticks
    //  - Part 6: Orbiting octahedral agent satellite swarm (4 units)
    //  - Part 7: Swirling neural particle field
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // Part 1: Inner Quantum Core
    const coreGeo = new THREE.IcosahedronGeometry(1.2, 1);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e1b4b,
      emissive: 0x4338ca,
      emissiveIntensity: 0.7,
      roughness: 0.12,
      metalness: 0.85,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    modelGroup.add(coreMesh);

    // Part 2: Inner Faceted Geodesic Lattice
    const latticeGeo = new THREE.IcosahedronGeometry(1.42, 2);
    const latticeMat = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const latticeMesh = new THREE.Mesh(latticeGeo, latticeMat);
    modelGroup.add(latticeMesh);

    // Part 3: Primary Gyro Ring (Cyber Indigo)
    const ring1Geo = new THREE.TorusGeometry(2.1, 0.038, 16, 64);
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0x6366f1,
      emissive: 0x4338ca,
      emissiveIntensity: 0.5,
      metalness: 0.95,
      roughness: 0.18,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ringMat1);
    modelGroup.add(ring1);

    // Part 4: Secondary Gyro Ring (Neural Teal)
    const ring2Geo = new THREE.TorusGeometry(2.45, 0.032, 16, 64);
    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0x14b8a6,
      emissive: 0x0f766e,
      emissiveIntensity: 0.45,
      metalness: 0.92,
      roughness: 0.22,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ringMat2);
    ring2.rotation.x = Math.PI / 3;
    ring2.rotation.y = Math.PI / 6;
    modelGroup.add(ring2);

    // Part 5: Outer Telemetry Equatorial Ring
    const ring3Geo = new THREE.TorusGeometry(2.8, 0.024, 16, 64);
    const ringMat3 = new THREE.MeshBasicMaterial({
      color: 0xa5b4fc,
      transparent: true,
      opacity: 0.45,
      wireframe: true,
    });
    const ring3 = new THREE.Mesh(ring3Geo, ringMat3);
    ring3.rotation.x = -Math.PI / 4;
    modelGroup.add(ring3);

    // Part 6: Orbiting Autonomous Agent Satellites
    const satCount = 4;
    const satGeo = new THREE.OctahedronGeometry(0.18, 0);
    const satMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x14b8a6,
      emissiveIntensity: 0.8,
      metalness: 0.9,
      roughness: 0.15,
    });
    const satellites: THREE.Mesh[] = [];
    for (let i = 0; i < satCount; i++) {
      const sat = new THREE.Mesh(satGeo, satMat);
      modelGroup.add(sat);
      satellites.push(sat);
    }

    // Part 7: Swirling Neural Particle Field
    const particleCount = isSoftwareGl ? 80 : 180;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const rad = 2.0 + Math.random() * 1.5;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(Math.random() * 2 - 1);
      particlePositions[i * 3] = rad * Math.sin(ph) * Math.cos(th);
      particlePositions[i * 3 + 1] = rad * Math.sin(ph) * Math.sin(th);
      particlePositions[i * 3 + 2] = rad * Math.cos(ph);
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.05,
      color: 0x6366f1,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const particleCloud = new THREE.Points(particleGeo, particleMat);
    modelGroup.add(particleCloud);

    // 6. Interactive Drag & Momentum Orbit
    let isDragging = false;
    let prevPointerX = 0;
    let prevPointerY = 0;
    let targetRotationX = 0.2;
    let targetRotationY = 0;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevPointerX = clientX;
      prevPointerY = clientY;
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const dx = clientX - prevPointerX;
      const dy = clientY - prevPointerY;
      prevPointerX = clientX;
      prevPointerY = clientY;

      targetRotationY += dx * 0.007;
      targetRotationX += dy * 0.007;
      targetRotationX = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, targetRotationX));
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);

    domEl.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);

    // 7. Responsive Resizing
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const entry = entries[0];
      const newWidth = entry.contentRect.width;
      const newHeight = entry.contentRect.height;
      if (newWidth > 0 && newHeight > 0) {
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      }
    });
    resizeObserver.observe(container);

    // 8. Lossless 60 FPS Animation Loop with Exponential Damping
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsedTime = clock.getElapsedTime();

      // Dynamic Wireframe sync
      coreMat.wireframe = wireframeRef.current;

      if (!prefersReducedMotion) {
        if (isRotatingRef.current && !isDragging) {
          targetRotationY += delta * 0.45;
          targetRotationX = Math.sin(elapsedTime * 0.5) * 0.15;
        }

        // Exponential damping: 1 - Math.exp(-k * dt)
        const dampFactor = 1 - Math.exp(-7 * delta);
        modelGroup.rotation.y += (targetRotationY - modelGroup.rotation.y) * dampFactor;
        modelGroup.rotation.x += (targetRotationX - modelGroup.rotation.x) * dampFactor;

        // Individual Ring Counter-rotations
        ring1.rotation.z += delta * 0.55;
        ring2.rotation.y -= delta * 0.4;
        ring3.rotation.z += delta * 0.25;
        particleCloud.rotation.y += delta * 0.18;

        // Pulsing Core
        const coreScale = 1.0 + Math.sin(elapsedTime * 2.2) * 0.05;
        coreMesh.scale.set(coreScale, coreScale, coreScale);

        // Orbiting satellites math
        satellites.forEach((sat, i) => {
          const orbitAngle = elapsedTime * 0.85 + (i * Math.PI) / 2;
          const orbitRadius = 3.2;
          sat.position.x = Math.cos(orbitAngle) * orbitRadius;
          sat.position.z = Math.sin(orbitAngle) * orbitRadius;
          sat.position.y = Math.sin(orbitAngle * 2) * 0.85;
          sat.rotation.x += delta * 2;
          sat.rotation.y += delta * 3;
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    // 9. Thorough Resource Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      domEl.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      domEl.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
      resizeObserver.disconnect();
      if (container.contains(domEl)) {
        container.removeChild(domEl);
      }
      coreGeo.dispose();
      coreMat.dispose();
      latticeGeo.dispose();
      latticeMat.dispose();
      ring1Geo.dispose();
      ringMat1.dispose();
      ring2Geo.dispose();
      ringMat2.dispose();
      ring3Geo.dispose();
      ringMat3.dispose();
      satGeo.dispose();
      satMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      shadowPlaneGeo.dispose();
      shadowPlaneMat.dispose();
      shadowTex.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      {/* 3D Canvas Mount Point */}
      <div
        ref={mountRef}
        className="w-full h-[360px] sm:h-[440px] lg:h-[480px] touch-none select-none"
        title="Interactive 3D Autonomous Agent Neural Core (Click and drag to orbit)"
      />

      {/* Floating 3D Control Strip: Solid RGBA surface (no backdrop-filter over WebGL), static clean status */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1.5 rounded-xl bg-[#0E1217] border border-white/10 shadow-xl text-xs z-20 max-w-[calc(100%-1.5rem)]">
        <button
          type="button"
          onClick={() => setWireframe(!wireframe)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-medium transition-all shrink-0 ${
            wireframe
              ? 'bg-[#6366F1] text-white font-semibold shadow-[0_0_10px_rgba(99,102,241,0.4)]'
              : 'text-zinc-400 hover:text-white bg-white/[0.04]'
          }`}
          title="Toggle wireframe topology view"
        >
          <Layers className="w-3 h-3 text-[#14B8A6]" />
          <span>{wireframe ? 'Solid' : 'Wireframe'}</span>
        </button>

        <span aria-hidden="true" className="text-zinc-600">·</span>

        <button
          type="button"
          onClick={() => setIsRotating(!isRotating)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-medium transition-all shrink-0 ${
            isRotating
              ? 'bg-white/[0.06] text-zinc-200 hover:text-white'
              : 'bg-[#6366F1]/20 text-[#818CF8] font-semibold'
          }`}
          title="Pause or resume auto-rotation"
        >
          <RotateCw className={`w-3 h-3 ${isRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
          <span>{isRotating ? 'Auto Orbit' : 'Paused'}</span>
        </button>
      </div>
    </div>
  );
};
