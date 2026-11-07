import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Layers } from 'lucide-react';

interface HeroNeuralCore3DProps {
  className?: string;
}

export const HeroNeuralCore3D: React.FC<HeroNeuralCore3DProps> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [isRotating, setIsRotating] = useState<boolean>(true);

  // Keep ref for dynamic wireframe toggles without rebuilding scene
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
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 2. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const cyanPointLight = new THREE.PointLight(0x38bdf8, 3.5, 20);
    cyanPointLight.position.set(3, 4, 4);
    scene.add(cyanPointLight);

    const blueBackLight = new THREE.PointLight(0x0284c7, 2.5, 15);
    blueBackLight.position.set(-3, -3, -3);
    scene.add(blueBackLight);

    // 3. Composite 3D Model: Autonomous Agent Neural Core (THREE.Group)
    // Structure:
    //  - Core: Pulsing Icosahedron with inner crystalline structure
    //  - Shell: Geodesic wireframe sphere
    //  - Outer Gyro Ring 1: Torus with data nodes (Pitch/Roll)
    //  - Outer Gyro Ring 2: Torus with sensor clips (Yaw)
    //  - Orbiting Satellites: 4 Octahedral micro-agent probes with trailing particle beams
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // A. Inner Quantum Core
    const coreGeo = new THREE.IcosahedronGeometry(1.2, 1);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x082f49,
      emissive: 0x0284c7,
      emissiveIntensity: 0.6,
      roughness: 0.15,
      metalness: 0.85,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      wireframe: false,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    modelGroup.add(coreMesh);

    // B. Inner Faceted Geodesic Lattice
    const latticeGeo = new THREE.IcosahedronGeometry(1.4, 2);
    const latticeMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const latticeMesh = new THREE.Mesh(latticeGeo, latticeMat);
    modelGroup.add(latticeMesh);

    // C. Gyro Ring 1 (Horizontal Torus)
    const ring1Geo = new THREE.TorusGeometry(2.1, 0.035, 16, 64);
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0369a1,
      emissiveIntensity: 0.4,
      metalness: 0.9,
      roughness: 0.2,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ringMat1);
    modelGroup.add(ring1);

    // D. Gyro Ring 2 (Tilted Ring)
    const ring2Geo = new THREE.TorusGeometry(2.5, 0.03, 16, 64);
    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0x7dd3fc,
      emissive: 0x0284c7,
      emissiveIntensity: 0.3,
      metalness: 0.95,
      roughness: 0.15,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ringMat2);
    ring2.rotation.x = Math.PI / 3;
    ring2.rotation.y = Math.PI / 6;
    modelGroup.add(ring2);

    // E. Gyro Ring 3 (Equatorial Ring with telemetry notches)
    const ring3Geo = new THREE.TorusGeometry(2.8, 0.025, 16, 64);
    const ringMat3 = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.5,
      wireframe: true,
    });
    const ring3 = new THREE.Mesh(ring3Geo, ringMat3);
    ring3.rotation.x = -Math.PI / 4;
    modelGroup.add(ring3);

    // F. Orbiting Autonomous Agent Satellites
    const satellites: THREE.Mesh[] = [];
    const satCount = 4;
    const satGeo = new THREE.OctahedronGeometry(0.18, 0);
    const satMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.8,
      metalness: 0.9,
      roughness: 0.1,
    });

    for (let i = 0; i < satCount; i++) {
      const sat = new THREE.Mesh(satGeo, satMat);
      satellites.push(sat);
      scene.add(sat);
    }

    // G. Neural Data Particle Ring
    const particleCount = 200;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 1.8 + (Math.random() - 0.5) * 0.4;
      particlePositions[i * 3] = Math.cos(angle) * radius;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
      particlePositions[i * 3 + 2] = Math.sin(angle) * radius;

      particleColors[i * 3] = 0.22;
      particleColors[i * 3 + 1] = 0.74;
      particleColors[i * 3 + 2] = 0.97;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particleCloud = new THREE.Points(particleGeo, particleMat);
    modelGroup.add(particleCloud);

    // 4. Mouse interaction & Drag to orbit
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationX = 0.2;
    let targetRotationY = 0;

    const handlePointerDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handlePointerMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        targetRotationY += deltaX * 0.008;
        targetRotationX += deltaY * 0.008;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const domEl = renderer.domElement;
    domEl.style.cursor = 'grab';
    domEl.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);

    // Resize Observer for exact container sizing
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    // 5. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Dynamic Wireframe sync
      coreMat.wireframe = wireframeRef.current;

      if (!prefersReducedMotion) {
        if (isRotatingRef.current && !isDragging) {
          targetRotationY += delta * 0.45;
          targetRotationX = Math.sin(elapsedTime * 0.5) * 0.2;
        }

        // Smooth damping
        modelGroup.rotation.y += (targetRotationY - modelGroup.rotation.y) * 0.08;
        modelGroup.rotation.x += (targetRotationX - modelGroup.rotation.x) * 0.08;

        // Individual Ring Counter-rotations
        ring1.rotation.z += delta * 0.6;
        ring2.rotation.y -= delta * 0.4;
        ring3.rotation.z += delta * 0.3;
        particleCloud.rotation.y += delta * 0.2;

        // Pulsing Core
        const coreScale = 1.0 + Math.sin(elapsedTime * 2.5) * 0.06;
        coreMesh.scale.set(coreScale, coreScale, coreScale);

        // Orbiting satellites math
        satellites.forEach((sat, i) => {
          const orbitAngle = elapsedTime * 0.85 + (i * Math.PI) / 2;
          const orbitRadius = 3.2;
          sat.position.x = Math.cos(orbitAngle) * orbitRadius;
          sat.position.z = Math.sin(orbitAngle) * orbitRadius;
          sat.position.y = Math.sin(orbitAngle * 2) * 0.9;
          sat.rotation.x += delta * 2;
          sat.rotation.y += delta * 3;
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    // 6. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      domEl.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
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
      renderer.dispose();
    };
  }, []);

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      {/* 3D Canvas Mount Point */}
      <div
        ref={mountRef}
        className="w-full h-[360px] sm:h-[440px] lg:h-[500px] touch-none select-none"
        title="Interactive 3D Autonomous Agent Neural Core (Click and drag to rotate)"
      />

      {/* Floating 3D HUD / Controls Strip */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1.5 rounded-xl bg-[#0E1217]/85 backdrop-blur-md border border-white/10 shadow-lg text-xs z-20 max-w-[calc(100%-1.5rem)]">
        <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 text-slate-300 font-mono text-[11px] shrink-0">
          <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse" />
          <span className="text-white font-semibold">AI Neural Core</span>
        </div>

        <span aria-hidden="true" className="hidden sm:inline text-slate-600">·</span>

        <button
          type="button"
          onClick={() => setWireframe(!wireframe)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all shrink-0 ${
            wireframe
              ? 'bg-[#38BDF8] text-[#08090C] font-semibold'
              : 'text-slate-400 hover:text-white bg-white/[0.04]'
          }`}
          title="Toggle wireframe topology view"
        >
          <Layers className="w-3 h-3" />
          <span>{wireframe ? 'Solid' : 'Wireframe'}</span>
        </button>

        <button
          type="button"
          onClick={() => setIsRotating(!isRotating)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all shrink-0 ${
            isRotating
              ? 'bg-white/[0.08] text-slate-200'
              : 'bg-[#38BDF8]/20 text-[#38BDF8]'
          }`}
          title="Pause or resume auto-rotation"
        >
          <RotateCw className={`w-3 h-3 ${isRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
          <span>{isRotating ? 'Auto' : 'Paused'}</span>
        </button>
      </div>
    </div>
  );
};
