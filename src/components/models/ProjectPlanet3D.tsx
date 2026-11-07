import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ProjectPlanet3DProps {
  projectId: string;
  category: string;
  accent?: string;
  interactive?: boolean;
  className?: string;
}

export const ProjectPlanet3D: React.FC<ProjectPlanet3DProps> = ({
  projectId,
  category,
  accent = '#38BDF8',
  interactive = true,
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef<boolean>(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Detect software WebGL
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

    const width = container.clientWidth || 220;
    const height = container.clientHeight || 160;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.z = 5.2;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isSoftwareGl ? 1 : 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const accentColor = new THREE.Color(accent);
    const keyLight = new THREE.PointLight(accentColor, 2.5, 12);
    keyLight.position.set(2.5, 3, 3);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0xffffff, 1.2, 10);
    rimLight.position.set(-2, -2, -2);
    scene.add(rimLight);

    // 3. Project-Specific Procedural 3D Model Group
    const group = new THREE.Group();
    scene.add(group);

    const disposables: (THREE.BufferGeometry | THREE.Material)[] = [];

    // Distinct procedural models per project
    if (projectId.includes('job') || projectId.includes('copilot')) {
      // 1. AI Job-Hunt Copilot: Autonomous Radar & Targeting Compass
      // Primary: Faceted Core
      const coreGeo = new THREE.OctahedronGeometry(1.0, 1);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0x0369a1,
        emissive: 0x0284c7,
        emissiveIntensity: 0.5,
        roughness: 0.2,
        metalness: 0.8,
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      group.add(core);
      disposables.push(coreGeo, coreMat);

      // Secondary: Radar Scanning Ring
      const ringGeo = new THREE.TorusGeometry(1.5, 0.04, 16, 48);
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x38bdf8,
        emissiveIntensity: 0.6,
        wireframe: true,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 3;
      group.add(ring);
      disposables.push(ringGeo, ringMat);

      // Accent: Outer Targeting Nodes
      const nodeGeo = new THREE.TetrahedronGeometry(0.18);
      const nodeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.set(1.5, 0, 0);
      group.add(node);
      disposables.push(nodeGeo, nodeMat);
    } else if (projectId.includes('study')) {
      // 2. StudyOS: Knowledge Crystal & Concept Polyhedron
      const crystalGeo = new THREE.IcosahedronGeometry(1.1, 0);
      const crystalMat = new THREE.MeshPhysicalMaterial({
        color: 0x4338ca,
        emissive: 0x6366f1,
        emissiveIntensity: 0.6,
        roughness: 0.1,
        metalness: 0.6,
        transmission: 0.3,
        thickness: 0.5,
      });
      const crystal = new THREE.Mesh(crystalGeo, crystalMat);
      group.add(crystal);
      disposables.push(crystalGeo, crystalMat);

      const cageGeo = new THREE.IcosahedronGeometry(1.4, 1);
      const cageMat = new THREE.MeshBasicMaterial({
        color: 0x818cf8,
        wireframe: true,
        transparent: true,
        opacity: 0.4,
      });
      const cage = new THREE.Mesh(cageGeo, cageMat);
      group.add(cage);
      disposables.push(cageGeo, cageMat);
    } else if (projectId.includes('gemini') || projectId.includes('chat')) {
      // 3. Gemini Pro Chat: Dual-Synapse Quantum Processor
      const sphereGeo = new THREE.SphereGeometry(0.85, 24, 24);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        emissive: 0x38bdf8,
        emissiveIntensity: 0.7,
        roughness: 0.2,
        metalness: 0.8,
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      group.add(sphere);
      disposables.push(sphereGeo, sphereMat);

      const helixGeo1 = new THREE.TorusGeometry(1.4, 0.035, 16, 64);
      const helixMat1 = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        metalness: 0.9,
      });
      const helix1 = new THREE.Mesh(helixGeo1, helixMat1);
      helix1.rotation.x = Math.PI / 4;
      group.add(helix1);
      disposables.push(helixGeo1, helixMat1);

      const helixGeo2 = new THREE.TorusGeometry(1.4, 0.035, 16, 64);
      const helix2 = new THREE.Mesh(helixGeo2, helixMat1);
      helix2.rotation.y = Math.PI / 3;
      helix2.rotation.x = -Math.PI / 4;
      group.add(helix2);
      disposables.push(helixGeo2);
    } else if (projectId.includes('finance')) {
      // 4. Enterprise Finance Tracker: Encrypted Vault Core
      const boxGeo = new THREE.DodecahedronGeometry(1.0, 0);
      const boxMat = new THREE.MeshStandardMaterial({
        color: 0x065f46,
        emissive: 0x10b981,
        emissiveIntensity: 0.5,
        roughness: 0.25,
        metalness: 0.85,
      });
      const box = new THREE.Mesh(boxGeo, boxMat);
      group.add(box);
      disposables.push(boxGeo, boxMat);

      const ringGeo = new THREE.TorusGeometry(1.5, 0.05, 16, 48);
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0x34d399,
        wireframe: true,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      group.add(ring);
      disposables.push(ringGeo, ringMat);
    } else if (projectId.includes('doctor')) {
      // 5. Doctor Appointment App: Holographic Medical Pulse Node
      const coreGeo = new THREE.OctahedronGeometry(0.9, 2);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0x9d174d,
        emissive: 0xf472b6,
        emissiveIntensity: 0.6,
        roughness: 0.2,
        metalness: 0.7,
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      group.add(core);
      disposables.push(coreGeo, coreMat);

      // Orbiting health shield ring
      const shieldGeo = new THREE.TorusGeometry(1.4, 0.04, 16, 48);
      const shieldMat = new THREE.MeshBasicMaterial({
        color: 0xf472b6,
        wireframe: true,
      });
      const shield = new THREE.Mesh(shieldGeo, shieldMat);
      shield.rotation.x = Math.PI / 2.5;
      group.add(shield);
      disposables.push(shieldGeo, shieldMat);
    } else {
      // 6. Neural Path Runner: High-Speed WebGL Monolith & Quantum Speeder
      const monolithGeo = new THREE.ConeGeometry(0.9, 1.8, 5);
      const monolithMat = new THREE.MeshStandardMaterial({
        color: 0xb45309,
        emissive: 0xfbbf24,
        emissiveIntensity: 0.6,
        roughness: 0.2,
        metalness: 0.8,
      });
      const monolith = new THREE.Mesh(monolithGeo, monolithMat);
      group.add(monolith);
      disposables.push(monolithGeo, monolithMat);

      const warpRingGeo = new THREE.TorusGeometry(1.45, 0.04, 16, 48);
      const warpRingMat = new THREE.MeshStandardMaterial({
        color: 0xfbbf24,
        wireframe: true,
      });
      const warpRing = new THREE.Mesh(warpRingGeo, warpRingMat);
      warpRing.rotation.x = Math.PI / 4;
      group.add(warpRing);
      disposables.push(warpRingGeo, warpRingMat);
    }

    // 4. Hover Listeners
    const handleMouseEnter = () => {
      isHoveredRef.current = true;
    };
    const handleMouseLeave = () => {
      isHoveredRef.current = false;
    };

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    // 5. Visibility Intersection Observer (Pause when off-screen)
    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    // 6. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const delta = clock.getDelta();
      const speed = isHoveredRef.current ? 1.8 : 0.65;

      if (!prefersReducedMotion) {
        group.rotation.y += delta * speed;
        group.rotation.x += delta * (speed * 0.45);
        group.rotation.z += delta * (speed * 0.2);
      }

      renderer.render(scene, camera);
    };

    animate();

    // 7. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
    };
  }, [projectId, category, accent, interactive]);

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-full flex items-center justify-center overflow-hidden pointer-events-auto ${className}`}
      title={`3D Interactive Artifact: ${projectId}`}
    />
  );
};
