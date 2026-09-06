import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GalaxySettings, PlanetId } from '../types';
import { PLANETS_DATA } from '../data/portfolioData';
import {
  createSunTexture,
  createMercuryTexture,
  createVenusTexture,
  createEarthTexture,
  createEarthSpecularMap,
  createEarthCloudsTexture,
  createMarsTexture,
  createJupiterTexture,
  createSaturnTexture,
  createSaturnRingTexture,
  createUranusTexture,
  createNeptuneTexture,
} from '../utils/planetTextures';

interface ThreeCanvasProps {
  settings: GalaxySettings;
  onFpsUpdate?: (fps: number) => void;
  onSelectPlanet?: (id: PlanetId) => void;
  scrollProgress: number;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  settings,
  onFpsUpdate,
  onSelectPlanet,
  scrollProgress,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hoveredPlanetRef = useRef<string | null>(null);
  const [hoveredName, setHoveredName] = useState<string | null>(null);
  const [hoveredPos, setHoveredPos] = useState<{ x: number; y: number } | null>(null);

  // Core Three.js references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // Celestial groups & meshes
  const systemPivotRef = useRef<THREE.Group | null>(null);
  const sunMeshRef = useRef<THREE.Mesh | null>(null);
  const sunCoronaRef = useRef<THREE.Mesh | null>(null);
  const earthCloudsRef = useRef<THREE.Mesh | null>(null);
  const moonPivotRef = useRef<THREE.Group | null>(null);
  const orbitLinesGroupRef = useRef<THREE.Group | null>(null);
  const asteroidBeltRef = useRef<THREE.Points | null>(null);
  const starsRef = useRef<THREE.Points | null>(null);
  const warpLinesRef = useRef<THREE.LineSegments | null>(null);
  const nebulaGroupRef = useRef<THREE.Group | null>(null);
  const spiralGalaxyRef = useRef<THREE.Points | null>(null);
  const solarFlaresRef = useRef<{ points: THREE.Points; velocities: THREE.Vector3[] } | null>(null);
  const meteorsRef = useRef<
    {
      line: THREE.Line;
      geometry: THREE.BufferGeometry;
      positions: Float32Array;
      startPos: THREE.Vector3;
      dir: THREE.Vector3;
      speed: number;
      progress: number;
      maxProgress: number;
      delay: number;
      material: THREE.LineBasicMaterial;
    }[]
  >([]);

  // Map of planet pivots and meshes
  const planetMeshesRef = useRef<Map<PlanetId, { pivot: THREE.Group; mesh: THREE.Mesh; data: any }>>(new Map());

  // Mouse & interaction state
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, rawX: 0, rawY: 0 });
  const isDraggingRef = useRef(false);
  const prevMousePosRef = useRef({ x: 0, y: 0 });
  const dragRotationRef = useRef({ x: 0, y: 0 });
  const zoomFactorRef = useRef(1.0);
  const camCurrentTargetRef = useRef(new THREE.Vector3(0, 0, 0));

  // Sync settings and focusedBody refs to avoid stale closure in animation loop
  const settingsRef = useRef(settings);
  const focusedBodyRef = useRef<PlanetId>(settings.focusedBody);

  useEffect(() => {
    settingsRef.current = settings;
    focusedBodyRef.current = settings.focusedBody;
    zoomFactorRef.current = 1.0;
  }, [settings]);

  // Raycaster for clicking & hovering celestial bodies
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseVectorRef = useRef(new THREE.Vector2());

  // 1. Initialize Scene & Galaxy
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x04060b, 0.008);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 800);
    camera.position.set(0, 18, 36);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    rendererRef.current = renderer;

    // System Pivot Group
    const systemPivot = new THREE.Group();
    scene.add(systemPivot);
    systemPivotRef.current = systemPivot;

    // Ambient Starlight
    const ambientLight = new THREE.AmbientLight(0x223355, 0.6);
    scene.add(ambientLight);

    // Sun Point Light radiating outward
    const sunLight = new THREE.PointLight(0xfff5e6, 4.5, 180, 0.55);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    // Deep space rim light for dramatic planetary silhouettes
    const cosmicRim = new THREE.DirectionalLight(0x38bdf8, 0.4);
    cosmicRim.position.set(10, 20, -10);
    scene.add(cosmicRim);

    // ==========================================
    // 2. BUILD THE SUN
    // ==========================================
    const sunGeo = new THREE.SphereGeometry(1.9, 64, 32);
    const sunTex = createSunTexture();
    const sunMat = new THREE.MeshBasicMaterial({
      map: sunTex,
      color: 0xffffff,
    });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    sunMesh.userData = { id: 'sun', name: 'The Sun' };
    systemPivot.add(sunMesh);
    sunMeshRef.current = sunMesh;

    // Sun Outer Pulsating Corona Aura Shell
    const coronaGeo = new THREE.SphereGeometry(2.35, 32, 16);
    const coronaMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
    });
    const sunCorona = new THREE.Mesh(coronaGeo, coronaMat);
    sunMesh.add(sunCorona);
    sunCoronaRef.current = sunCorona;

    // Procedural Circular Soft Star/Orb Texture (Eliminates square WebGL points)
    const createStarGlowTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
      gradient.addColorStop(0.25, 'rgba(255, 255, 255, 0.85)');
      gradient.addColorStop(0.55, 'rgba(160, 215, 255, 0.45)');
      gradient.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    };

    const starGlowTex = createStarGlowTexture();

    // Solar Flares & Erupting Plasma Particles
    const flareCount = 160;
    const flareGeo = new THREE.BufferGeometry();
    const flarePositions = new Float32Array(flareCount * 3);
    const flareVelocities: THREE.Vector3[] = [];

    for (let f = 0; f < flareCount; f++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2.0 + Math.random() * 0.4;

      flarePositions[f * 3] = r * Math.sin(phi) * Math.cos(theta);
      flarePositions[f * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      flarePositions[f * 3 + 2] = r * Math.cos(phi);

      flareVelocities.push(
        new THREE.Vector3(
          Math.sin(phi) * Math.cos(theta),
          Math.sin(phi) * Math.sin(theta),
          Math.cos(phi)
        ).multiplyScalar(0.006 + Math.random() * 0.008)
      );
    }

    flareGeo.setAttribute('position', new THREE.BufferAttribute(flarePositions, 3));
    const flareMat = new THREE.PointsMaterial({
      color: 0xf97316,
      size: 0.45,
      map: starGlowTex || undefined,
      transparent: true,
      opacity: 0.85,
      alphaTest: 0.01,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const solarFlares = new THREE.Points(flareGeo, flareMat);
    systemPivot.add(solarFlares);
    solarFlaresRef.current = { points: solarFlares, velocities: flareVelocities };

    // Register Sun in PlanetMap
    planetMeshesRef.current.set('sun', {
      pivot: systemPivot,
      mesh: sunMesh,
      data: PLANETS_DATA.find((p) => p.id === 'sun'),
    });

    // ==========================================
    // 3. BUILD ALL PLANETS
    // ==========================================
    const orbitLinesGroup = new THREE.Group();
    systemPivot.add(orbitLinesGroup);
    orbitLinesGroupRef.current = orbitLinesGroup;

    PLANETS_DATA.forEach((p) => {
      if (p.id === 'sun') return;

      // Orbit Pivot
      const pivot = new THREE.Group();
      systemPivot.add(pivot);

      // Orbit Line Path
      const orbitCurve = new THREE.EllipseCurve(
        0, 0,             // ax, aY
        p.distance, p.distance, // xRadius, yRadius
        0, 2 * Math.PI,   // aStartAngle, aEndAngle
        false,            // aClockwise
        0                 // aRotation
      );
      const points = orbitCurve.getPoints(120);
      const orbitGeo = new THREE.BufferGeometry().setFromPoints(
        points.map((pt) => new THREE.Vector3(pt.x, 0, pt.y))
      );
      const orbitMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(p.color).lerp(new THREE.Color(0xffffff), 0.25),
        transparent: true,
        opacity: 0.18,
      });
      const orbitLine = new THREE.LineLoop(orbitGeo, orbitMat);
      orbitLinesGroup.add(orbitLine);

      // Planet Mesh Geometry & Texture
      const geo = new THREE.SphereGeometry(p.radius, 64, 32);
      let mat: THREE.Material;

      if (p.id === 'earth') {
        mat = new THREE.MeshStandardMaterial({
          map: createEarthTexture(),
          roughnessMap: createEarthSpecularMap(),
          roughness: p.roughness,
          metalness: p.metalness,
        });
      } else if (p.id === 'mars') {
        mat = new THREE.MeshStandardMaterial({
          map: createMarsTexture(),
          roughness: p.roughness,
          metalness: p.metalness,
        });
      } else if (p.id === 'jupiter') {
        mat = new THREE.MeshStandardMaterial({
          map: createJupiterTexture(),
          roughness: p.roughness,
          metalness: p.metalness,
        });
      } else if (p.id === 'saturn') {
        mat = new THREE.MeshStandardMaterial({
          map: createSaturnTexture(),
          roughness: p.roughness,
          metalness: p.metalness,
        });
      } else if (p.id === 'uranus') {
        mat = new THREE.MeshStandardMaterial({
          map: createUranusTexture(),
          roughness: p.roughness,
          metalness: p.metalness,
        });
      } else if (p.id === 'neptune') {
        mat = new THREE.MeshStandardMaterial({
          map: createNeptuneTexture(),
          roughness: p.roughness,
          metalness: p.metalness,
        });
      } else if (p.id === 'mercury') {
        mat = new THREE.MeshStandardMaterial({
          map: createMercuryTexture(),
          roughness: p.roughness,
          metalness: p.metalness,
        });
      } else if (p.id === 'venus') {
        mat = new THREE.MeshStandardMaterial({
          map: createVenusTexture(),
          roughness: p.roughness,
          metalness: p.metalness,
        });
      } else {
        mat = new THREE.MeshStandardMaterial({
          color: p.color,
          roughness: p.roughness,
          metalness: p.metalness,
        });
      }

      const planetMesh = new THREE.Mesh(geo, mat);
      planetMesh.position.set(p.distance, 0, 0);
      planetMesh.castShadow = true;
      planetMesh.receiveShadow = true;
      planetMesh.userData = { id: p.id, name: `${p.name} (${p.subtitle})` };
      pivot.add(planetMesh);

      // Atmospheric Glow Shell for realistic planets
      const atmosColor =
        p.id === 'earth'
          ? 0x38bdf8
          : p.id === 'venus'
          ? 0xf59e0b
          : p.id === 'mars'
          ? 0xef4444
          : p.id === 'neptune'
          ? 0x2563eb
          : p.id === 'uranus'
          ? 0x2dd4bf
          : null;

      if (atmosColor) {
        const atmosGeo = new THREE.SphereGeometry(p.radius * 1.05, 32, 16);
        const atmosMat = new THREE.MeshBasicMaterial({
          color: atmosColor,
          transparent: true,
          opacity: 0.22,
          blending: THREE.AdditiveBlending,
          side: THREE.BackSide,
        });
        planetMesh.add(new THREE.Mesh(atmosGeo, atmosMat));
      }

      // Earth Clouds Layer & Orbiting Moon
      if (p.id === 'earth') {
        const cloudsGeo = new THREE.SphereGeometry(p.radius * 1.025, 48, 24);
        const cloudsMat = new THREE.MeshStandardMaterial({
          map: createEarthCloudsTexture(),
          transparent: true,
          opacity: 0.65,
          blending: THREE.AdditiveBlending,
        });
        const cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMat);
        planetMesh.add(cloudsMesh);
        earthCloudsRef.current = cloudsMesh;

        // Orbiting Moon
        const moonPivot = new THREE.Group();
        planetMesh.add(moonPivot);
        moonPivotRef.current = moonPivot;

        const moonGeo = new THREE.SphereGeometry(0.12, 16, 12);
        const moonMat = new THREE.MeshStandardMaterial({
          color: 0xcccccc,
          roughness: 0.9,
          metalness: 0.05,
        });
        const moonMesh = new THREE.Mesh(moonGeo, moonMat);
        moonMesh.position.set(0.85, 0.1, 0);
        moonPivot.add(moonMesh);
      }

      // Saturn Spectacular Rings!
      if (p.hasRings && p.id === 'saturn') {
        const ringGeo = new THREE.RingGeometry(p.ringInner || 1.15, p.ringOuter || 2.1, 64);
        // Correct UV coordinates so ring texture wraps radially
        const pos = ringGeo.attributes.position;
        const uvs = ringGeo.attributes.uv;
        for (let i = 0; i < pos.count; i++) {
          const vx = pos.getX(i);
          const vy = pos.getY(i);
          const dist = Math.sqrt(vx * vx + vy * vy);
          const normU = (dist - (p.ringInner || 1.15)) / ((p.ringOuter || 2.1) - (p.ringInner || 1.15));
          uvs.setXY(i, normU, 0.5);
        }
        uvs.needsUpdate = true;

        const ringMat = new THREE.MeshStandardMaterial({
          map: createSaturnRingTexture(),
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.92,
          roughness: 0.4,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2 + 0.45; // 26° axial tilt
        ringMesh.rotation.y = 0.2;
        planetMesh.add(ringMesh);
      }

      // Uranus subtle ring
      if (p.hasRings && p.id === 'uranus') {
        const ringGeo = new THREE.RingGeometry(p.ringInner || 0.8, p.ringOuter || 1.15, 48);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0x7dd3fc,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.35,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = 0.1;
        ringMesh.rotation.y = Math.PI / 2 + 0.3; // perpendicular tilt
        planetMesh.add(ringMesh);
      }

      // Atmosphere glow ring for Venus, Earth, Jupiter, Neptune
      if (['venus', 'earth', 'jupiter', 'neptune'].includes(p.id)) {
        const atmoGeo = new THREE.SphereGeometry(p.radius * 1.12, 24, 16);
        const atmoMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color(p.color).lerp(new THREE.Color(0xffffff), 0.4),
          transparent: true,
          opacity: 0.14,
          blending: THREE.AdditiveBlending,
          side: THREE.BackSide,
        });
        planetMesh.add(new THREE.Mesh(atmoGeo, atmoMat));
      }

      planetMeshesRef.current.set(p.id, {
        pivot,
        mesh: planetMesh,
        data: p,
      });
    });

    // ==========================================
    // 4. ASTEROID BELT (Between Mars & Jupiter)
    // ==========================================
    const asteroidCount = 1400;
    const asteroidGeo = new THREE.BufferGeometry();
    const asteroidPositions = new Float32Array(asteroidCount * 3);
    const asteroidColors = new Float32Array(asteroidCount * 3);

    for (let i = 0; i < asteroidCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 10.0 + Math.random() * 2.0; // Between 10.0 and 12.0
      const height = (Math.random() - 0.5) * 0.9;

      asteroidPositions[i * 3] = Math.cos(angle) * radius;
      asteroidPositions[i * 3 + 1] = height;
      asteroidPositions[i * 3 + 2] = Math.sin(angle) * radius;

      // Asteroid stone colors (gray, brown, rusted red)
      const tone = Math.random() * 0.35 + 0.35;
      asteroidColors[i * 3] = tone + (Math.random() * 0.1 - 0.05);
      asteroidColors[i * 3 + 1] = tone * 0.85;
      asteroidColors[i * 3 + 2] = tone * 0.7;
    }

    asteroidGeo.setAttribute('position', new THREE.BufferAttribute(asteroidPositions, 3));
    asteroidGeo.setAttribute('color', new THREE.BufferAttribute(asteroidColors, 3));

    const asteroidMat = new THREE.PointsMaterial({
      size: 0.07,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
    });
    const asteroidBelt = new THREE.Points(asteroidGeo, asteroidMat);
    systemPivot.add(asteroidBelt);
    asteroidBeltRef.current = asteroidBelt;

    // ==========================================
    // 5. DEEP GALAXY STARFIELD (5,000+ Stars)
    // ==========================================
    const starCount = 5200;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const starPalette = [
      new THREE.Color('#ffffff'), // White main sequence
      new THREE.Color('#93c5fd'), // Blue Giant
      new THREE.Color('#fde047'), // Yellow dwarf
      new THREE.Color('#fca5a5'), // Red giant
      new THREE.Color('#c084fc'), // Purple cosmic
      new THREE.Color('#38bdf8'), // Cyan
    ];

    for (let i = 0; i < starCount; i++) {
      // Sphere distribution with large radius (100 to 350)
      const r = 110 + Math.random() * 260;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = r * Math.cos(phi);

      const col = starPalette[Math.floor(Math.random() * starPalette.length)];
      starColors[i * 3] = col.r;
      starColors[i * 3 + 1] = col.g;
      starColors[i * 3 + 2] = col.b;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 1.8,
      map: starGlowTex || undefined,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      alphaTest: 0.01,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);
    starsRef.current = stars;

    // ==========================================
    // 6. WARP SPEED RELATIVISTIC STREAK LINES
    // ==========================================
    const warpCount = 600;
    const warpGeo = new THREE.BufferGeometry();
    const warpPositions = new Float32Array(warpCount * 2 * 3);
    for (let i = 0; i < warpCount; i++) {
      const x = (Math.random() - 0.5) * 60;
      const y = (Math.random() - 0.5) * 60;
      const z = (Math.random() - 0.5) * 80;
      warpPositions[i * 6] = x;
      warpPositions[i * 6 + 1] = y;
      warpPositions[i * 6 + 2] = z;

      warpPositions[i * 6 + 3] = x;
      warpPositions[i * 6 + 4] = y;
      warpPositions[i * 6 + 5] = z + Math.random() * 8 + 4; // length of streak
    }
    warpGeo.setAttribute('position', new THREE.BufferAttribute(warpPositions, 3));
    const warpMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const warpLines = new THREE.LineSegments(warpGeo, warpMat);
    scene.add(warpLines);
    warpLinesRef.current = warpLines;

    // ==========================================
    // 7. VOLUMETRIC COSMIC NEBULA CLOUDS
    // ==========================================
    const nebulaGroup = new THREE.Group();
    scene.add(nebulaGroup);
    nebulaGroupRef.current = nebulaGroup;

    const nebulaColors = [0x7c3aed, 0xec4899, 0x0284c7, 0x4f46e5];
    for (let n = 0; n < 4; n++) {
      const nGeo = new THREE.SphereGeometry(30, 16, 12);
      const nMat = new THREE.MeshBasicMaterial({
        color: nebulaColors[n],
        transparent: true,
        opacity: 0.035,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
      });
      const nMesh = new THREE.Mesh(nGeo, nMat);
      nMesh.position.set(
        (Math.random() - 0.5) * 120,
        (Math.random() - 0.5) * 60,
        -70 - Math.random() * 50
      );
      nebulaGroup.add(nMesh);
    }

    // ==========================================
    // 8. MILKY WAY SPIRAL GALAXY DUST ARMS
    // ==========================================
    const spiralParticles = 7000;
    const spiralGeo = new THREE.BufferGeometry();
    const spiralPositions = new Float32Array(spiralParticles * 3);
    const spiralColors = new Float32Array(spiralParticles * 3);
    const branches = 3;

    for (let i = 0; i < spiralParticles; i++) {
      const r = Math.pow(Math.random(), 1.7) * 160 + 12;
      const branchAngle = ((i % branches) * 2 * Math.PI) / branches;
      const spinAngle = r * 0.07;

      const randomX = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.3) * r;
      const randomY = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.25) * r;
      const randomZ = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.3) * r;

      const x = Math.cos(branchAngle + spinAngle) * r + randomX;
      const y = randomY + (Math.random() - 0.5) * 10;
      const z = Math.sin(branchAngle + spinAngle) * r + randomZ;

      spiralPositions[i * 3] = x;
      spiralPositions[i * 3 + 1] = y - 30;
      spiralPositions[i * 3 + 2] = z - 70;

      const mixRatio = r / 160;
      const coreColor = new THREE.Color(0xfbbf24);
      const midColor = new THREE.Color(0xd946ef);
      const outerColor = new THREE.Color(0x06b6d4);
      const finalColor =
        mixRatio < 0.35
          ? coreColor.clone().lerp(midColor, mixRatio / 0.35)
          : midColor.clone().lerp(outerColor, (mixRatio - 0.35) / 0.65);

      spiralColors[i * 3] = finalColor.r;
      spiralColors[i * 3 + 1] = finalColor.g;
      spiralColors[i * 3 + 2] = finalColor.b;
    }

    spiralGeo.setAttribute('position', new THREE.BufferAttribute(spiralPositions, 3));
    spiralGeo.setAttribute('color', new THREE.BufferAttribute(spiralColors, 3));

    const spiralMat = new THREE.PointsMaterial({
      size: 2.2,
      map: starGlowTex || undefined,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      alphaTest: 0.01,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const spiralGalaxy = new THREE.Points(spiralGeo, spiralMat);
    spiralGalaxy.rotation.x = 0.5;
    scene.add(spiralGalaxy);
    spiralGalaxyRef.current = spiralGalaxy;

    // ==========================================
    // 9. ULTRA-REALISTIC SHOOTING METEOR SHOWER (FALLING STARS)
    // ==========================================
    const meteorsGroup = new THREE.Group();
    scene.add(meteorsGroup);
    meteorsRef.current = [];

    const meteorCount = 8;
    const ptsPerMeteor = 18;

    for (let m = 0; m < meteorCount; m++) {
      const mGeo = new THREE.BufferGeometry();
      const mPos = new Float32Array(ptsPerMeteor * 3);
      const mCol = new Float32Array(ptsPerMeteor * 3);

      for (let p = 0; p < ptsPerMeteor; p++) {
        const alpha = Math.pow(1.0 - p / ptsPerMeteor, 1.8);
        const col = new THREE.Color('#ffffff').lerp(new THREE.Color('#38bdf8'), 1 - alpha);
        mCol[p * 3] = col.r * alpha;
        mCol[p * 3 + 1] = col.g * alpha;
        mCol[p * 3 + 2] = col.b * alpha;
      }

      mGeo.setAttribute('position', new THREE.BufferAttribute(mPos, 3));
      mGeo.setAttribute('color', new THREE.BufferAttribute(mCol, 3));

      const mMat = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
      });

      const mLine = new THREE.Line(mGeo, mMat);
      meteorsGroup.add(mLine);

      const startX = 50 + Math.random() * 70;
      const startY = 25 + Math.random() * 35;
      const startZ = -20 - Math.random() * 50;

      meteorsRef.current.push({
        line: mLine,
        geometry: mGeo,
        material: mMat,
        positions: mPos,
        startPos: new THREE.Vector3(startX, startY, startZ),
        dir: new THREE.Vector3(-1.25, -0.65, 0.45).normalize(),
        speed: 38 + Math.random() * 45,
        progress: 0,
        maxProgress: 130 + Math.random() * 60,
        delay: Math.random() * 3.5,
      });
    }

    // ==========================================
    // 10. INTERACTIVE MOUSE & RAYCASTING
    // ==========================================
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseRef.current.rawX = e.clientX;
      mouseRef.current.rawY = e.clientY;
      mouseRef.current.targetX = (e.clientX / innerWidth) * 2 - 1;
      mouseRef.current.targetY = -(e.clientY / innerHeight) * 2 + 1;

      mouseVectorRef.current.x = (e.clientX / innerWidth) * 2 - 1;
      mouseVectorRef.current.y = -(e.clientY / innerHeight) * 2 + 1;

      if (isDraggingRef.current && systemPivotRef.current) {
        const deltaX = e.clientX - prevMousePosRef.current.x;
        const deltaY = e.clientY - prevMousePosRef.current.y;
        dragRotationRef.current.y += deltaX * 0.005;
        dragRotationRef.current.x += deltaY * 0.005;
        prevMousePosRef.current = { x: e.clientX, y: e.clientY };
      }

      // Check raycast for planet hover tooltip
      if (cameraRef.current && sceneRef.current) {
        raycasterRef.current.setFromCamera(mouseVectorRef.current, cameraRef.current);
        const testMeshes: THREE.Mesh[] = [];
        planetMeshesRef.current.forEach((val) => testMeshes.push(val.mesh));

        const intersects = raycasterRef.current.intersectObjects(testMeshes, false);
        if (intersects.length > 0) {
          const hit = intersects[0].object;
          const name = hit.userData?.name;
          hoveredPlanetRef.current = name || null;
          setHoveredName(name || null);
          setHoveredPos({ x: e.clientX, y: e.clientY });
        } else {
          hoveredPlanetRef.current = null;
          setHoveredName(null);
        }
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.tagName === 'INPUT' || target.closest('#viewport-hud-toolbar')) return;
      isDraggingRef.current = true;
      prevMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.tagName === 'INPUT' || target.closest('#viewport-hud-toolbar')) return;

      if (cameraRef.current && sceneRef.current) {
        raycasterRef.current.setFromCamera(mouseVectorRef.current, cameraRef.current);
        const testMeshes: THREE.Mesh[] = [];
        planetMeshesRef.current.forEach((val) => testMeshes.push(val.mesh));

        const intersects = raycasterRef.current.intersectObjects(testMeshes, false);
        if (intersects.length > 0) {
          const hit = intersects[0].object;
          const id = hit.userData?.id as PlanetId;
          if (id && onSelectPlanet) {
            onSelectPlanet(id);
          }
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (!cameraRef.current || !sceneRef.current) return;

      const { innerWidth, innerHeight } = window;
      mouseVectorRef.current.x = (e.clientX / innerWidth) * 2 - 1;
      mouseVectorRef.current.y = -(e.clientY / innerHeight) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseVectorRef.current, cameraRef.current);
      const testMeshes: THREE.Mesh[] = [];
      planetMeshesRef.current.forEach((val) => testMeshes.push(val.mesh));

      const intersects = raycasterRef.current.intersectObjects(testMeshes, false);
      const currentFocus = focusedBodyRef.current;

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        const id = hit.userData?.id as PlanetId;
        if (id) {
          if (e.deltaY < 0) {
            // Zooming in on hovered planet -> fly close to target planet!
            if (onSelectPlanet && currentFocus !== id) {
              onSelectPlanet(id);
            }
            zoomFactorRef.current = Math.max(0.25, zoomFactorRef.current - 0.15);
            if (e.cancelable) e.preventDefault();
          } else if (e.deltaY > 0) {
            // Zooming out
            zoomFactorRef.current = Math.min(2.5, zoomFactorRef.current + 0.15);
            if (zoomFactorRef.current >= 1.8 && onSelectPlanet && currentFocus !== 'all') {
              onSelectPlanet('all');
              zoomFactorRef.current = 1.0;
            }
            if (e.cancelable) e.preventDefault();
          }
        }
      } else if (currentFocus !== 'all') {
        if (e.deltaY < 0) {
          zoomFactorRef.current = Math.max(0.25, zoomFactorRef.current - 0.15);
          if (e.cancelable) e.preventDefault();
        } else if (e.deltaY > 0) {
          zoomFactorRef.current = Math.min(2.5, zoomFactorRef.current + 0.15);
          if (zoomFactorRef.current >= 1.8 && onSelectPlanet) {
            onSelectPlanet('all');
            zoomFactorRef.current = 1.0;
          }
          if (e.cancelable) e.preventDefault();
        }
      }
    };

    // Touch interaction refs for Mobile Pinch-to-Zoom & Drag
    let prevTouchDist: number | null = null;
    let touchStartPos = { x: 0, y: 0, time: 0 };

    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'INPUT' ||
        target.closest('#viewport-hud-toolbar') ||
        target.closest('#main-navigation')
      ) return;

      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        prevMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        touchStartPos = { x: e.touches[0].clientX, y: e.touches[0].clientY, time: Date.now() };

        // Update raycasting vector for tap selection
        const { innerWidth, innerHeight } = window;
        mouseVectorRef.current.x = (e.touches[0].clientX / innerWidth) * 2 - 1;
        mouseVectorRef.current.y = -(e.touches[0].clientY / innerHeight) * 2 + 1;
      } else if (e.touches.length === 2) {
        isDraggingRef.current = false;
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        prevTouchDist = dist;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'INPUT' ||
        target.closest('#viewport-hud-toolbar') ||
        target.closest('#main-navigation')
      ) return;

      if (e.touches.length === 1 && isDraggingRef.current) {
        const deltaX = e.touches[0].clientX - prevMousePosRef.current.x;
        const deltaY = e.touches[0].clientY - prevMousePosRef.current.y;
        dragRotationRef.current.y += deltaX * 0.007;
        dragRotationRef.current.x += deltaY * 0.007;
        prevMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2 && prevTouchDist !== null) {
        const newDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const deltaDist = newDist - prevTouchDist;

        if (Math.abs(deltaDist) > 1.5) {
          if (deltaDist > 0) {
            // Pinch spreading -> ZOOM IN
            zoomFactorRef.current = Math.max(0.2, zoomFactorRef.current - 0.04);
          } else {
            // Pinch closing -> ZOOM OUT
            zoomFactorRef.current = Math.min(2.8, zoomFactorRef.current + 0.04);
            const currentFocus = focusedBodyRef.current;
            if (zoomFactorRef.current >= 2.0 && onSelectPlanet && currentFocus !== 'all') {
              onSelectPlanet('all');
              zoomFactorRef.current = 1.0;
            }
          }
          prevTouchDist = newDist;
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length === 0) {
        const touchDuration = Date.now() - touchStartPos.time;
        if (isDraggingRef.current && touchDuration < 280) {
          const distX = Math.abs(prevMousePosRef.current.x - touchStartPos.x);
          const distY = Math.abs(prevMousePosRef.current.y - touchStartPos.y);
          if (distX < 12 && distY < 12 && cameraRef.current && sceneRef.current) {
            raycasterRef.current.setFromCamera(mouseVectorRef.current, cameraRef.current);
            const testMeshes: THREE.Mesh[] = [];
            planetMeshesRef.current.forEach((val) => testMeshes.push(val.mesh));
            const intersects = raycasterRef.current.intersectObjects(testMeshes, false);
            if (intersects.length > 0) {
              const hit = intersects[0].object;
              const id = hit.userData?.id as PlanetId;
              if (id && onSelectPlanet) {
                onSelectPlanet(id);
              }
            }
          }
        }
        isDraggingRef.current = false;
        prevTouchDist = null;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('click', handleClick);
    window.addEventListener('wheel', handleWheel, { passive: false });

    // Touch Event Listeners for Mobile Zoom & Orbit Rotation
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // ==========================================
    // 9. ANIMATION LOOP
    // ==========================================
    let animationFrameId: number;
    let lastTime = performance.now();
    let frameCount = 0;
    let lastFpsUpdate = performance.now();

    const animate = (time: number) => {
      animationFrameId = requestAnimationFrame(animate);

      // FPS tracking
      frameCount++;
      if (time - lastFpsUpdate >= 500) {
        const fps = Math.round((frameCount * 1000) / (time - lastFpsUpdate));
        if (onFpsUpdate) onFpsUpdate(fps);
        frameCount = 0;
        lastFpsUpdate = time;
      }

      const delta = (time - lastTime) * 0.001;
      lastTime = time;

      const currentSettings = settingsRef.current;
      const currentFocus = focusedBodyRef.current;

      // Mouse Lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // 1. Rotate Sun
      if (sunMeshRef.current) {
        sunMeshRef.current.rotation.y += delta * 0.15;
      }

      // 2. Orbit & Spin All Planets
      const speedMult = currentSettings.orbitSpeed * (currentSettings.warpSpeed ? 3.5 : 1.0);

      planetMeshesRef.current.forEach((val, id) => {
        if (id === 'sun') return;
        const { pivot, mesh, data } = val;

        // Orbital rotation around Sun (calm, graceful speed scaling)
        const periodFactor = Math.pow(data.orbitPeriod || 1, 0.65);
        pivot.rotation.y += delta * (0.2 / periodFactor) * speedMult;

        // Axial spin of the planet itself
        mesh.rotation.y += delta * data.rotationSpeed * 50;
      });

      // Earth clouds spin & Moon orbit
      if (earthCloudsRef.current) {
        earthCloudsRef.current.rotation.y += delta * 0.4;
      }
      if (moonPivotRef.current) {
        moonPivotRef.current.rotation.y += delta * 0.4 * speedMult;
      }

      // Asteroid belt slow cosmic orbit
      if (asteroidBeltRef.current) {
        asteroidBeltRef.current.rotation.y += delta * 0.08 * speedMult;
      }

      // Stars background slow drift
      if (starsRef.current) {
        starsRef.current.rotation.y = time * 0.00003;
        starsRef.current.rotation.x = time * 0.000015;
      }

      // Warp speed streak lines
      if (warpLinesRef.current) {
        const targetOpacity = currentSettings.warpSpeed ? 0.85 : 0;
        const mat = warpLinesRef.current.material as THREE.LineBasicMaterial;
        mat.opacity += (targetOpacity - mat.opacity) * 0.1;

        if (currentSettings.warpSpeed) {
          warpLinesRef.current.rotation.z += delta * 0.5;
        }
      }

      // Sun Corona pulsation & Solar Flares emission animation
      if (sunCoronaRef.current) {
        const s = 1.0 + Math.sin(time * 0.003) * 0.05;
        sunCoronaRef.current.scale.set(s, s, s);
      }

      if (solarFlaresRef.current) {
        const { points, velocities } = solarFlaresRef.current;
        const posAttr = points.geometry.attributes.position as THREE.BufferAttribute;
        const positions = posAttr.array as Float32Array;

        for (let f = 0; f < velocities.length; f++) {
          positions[f * 3] += velocities[f].x;
          positions[f * 3 + 1] += velocities[f].y;
          positions[f * 3 + 2] += velocities[f].z;

          const dist = Math.hypot(positions[f * 3], positions[f * 3 + 1], positions[f * 3 + 2]);
          if (dist > 3.5) {
            const dir = velocities[f].clone().normalize();
            positions[f * 3] = dir.x * 2.0;
            positions[f * 3 + 1] = dir.y * 2.0;
            positions[f * 3 + 2] = dir.z * 2.0;
          }
        }
        posAttr.needsUpdate = true;
      }

      // Milky Way Spiral Galaxy slow rotation
      if (spiralGalaxyRef.current) {
        spiralGalaxyRef.current.rotation.y += delta * 0.015 * speedMult;
      }

      // Ultra-Realistic Shooting Meteors (Falling Stars)
      meteorsRef.current.forEach((m) => {
        if (m.delay > 0) {
          m.delay -= delta;
          m.material.opacity = 0;
          return;
        }

        m.progress += delta * m.speed * speedMult;

        const lifeRatio = m.progress / m.maxProgress;
        let opacity = 1.0;
        if (lifeRatio < 0.15) {
          opacity = lifeRatio / 0.15;
        } else if (lifeRatio > 0.75) {
          opacity = (1.0 - lifeRatio) / 0.25;
        }
        m.material.opacity = Math.max(0, Math.min(1.0, opacity * 0.95));

        const headPos = m.startPos.clone().addScaledVector(m.dir, m.progress);
        const streakLength = 14.0;

        for (let p = 0; p < 18; p++) {
          const tailOffset = (p / 18) * streakLength;
          const pPos = headPos.clone().addScaledVector(m.dir, -tailOffset);
          m.positions[p * 3] = pPos.x;
          m.positions[p * 3 + 1] = pPos.y;
          m.positions[p * 3 + 2] = pPos.z;
        }
        m.geometry.attributes.position.needsUpdate = true;

        if (m.progress >= m.maxProgress) {
          m.progress = 0;
          m.delay = 1.5 + Math.random() * 4.5;
          const startX = 50 + Math.random() * 70;
          const startY = 25 + Math.random() * 35;
          const startZ = -20 - Math.random() * 50;
          m.startPos.set(startX, startY, startZ);
          m.speed = 38 + Math.random() * 45;
          m.maxProgress = 130 + Math.random() * 60;
        }
      });

      // Drag inertia
      if (systemPivotRef.current) {
        systemPivotRef.current.rotation.y += dragRotationRef.current.y * 0.1;
        systemPivotRef.current.rotation.x += dragRotationRef.current.x * 0.1;
        dragRotationRef.current.y *= 0.92;
        dragRotationRef.current.x *= 0.92;
      }

      // 3. Smooth Camera Follow & Glide to Focused Body
      let targetPos = new THREE.Vector3(0, 14, 28);
      let lookTarget = new THREE.Vector3(0, 0, 0);

      if (currentFocus !== 'all') {
        const bodyObj = planetMeshesRef.current.get(currentFocus);
        if (bodyObj) {
          // Get world position of the target planet
          const worldPos = new THREE.Vector3();
          bodyObj.mesh.getWorldPosition(worldPos);
          lookTarget = worldPos;

          // Compute camera offset relative to planet size and dynamic zoom factor
          const r = bodyObj.data.radius;
          const baseDistOffset = r * 3.6 + 1.0;
          const distOffset = baseDistOffset * zoomFactorRef.current;
          targetPos = new THREE.Vector3(
            worldPos.x + distOffset * 0.8,
            worldPos.y + distOffset * 0.45,
            worldPos.z + distOffset * 1.1
          );
        }
      } else {
        // Panoramic system view - gentle tilt based on scroll progress and mouse
        const isMobile = window.innerWidth < 768;
        const camScrollY = (isMobile ? 22 : 16) - scrollProgress * (isMobile ? 12 : 6);
        const camScrollZ = ((isMobile ? 36 : 28) - scrollProgress * (isMobile ? 16 : 8)) * zoomFactorRef.current;
        targetPos = new THREE.Vector3(
          mouseRef.current.x * (isMobile ? 2.0 : 3.5),
          camScrollY + mouseRef.current.y * 2.0,
          camScrollZ
        );
        lookTarget = new THREE.Vector3(0, 0, 0);
      }

      // Camera lerp
      camera.position.lerp(targetPos, 0.08);
      camCurrentTargetRef.current.lerp(lookTarget, 0.08);
      camera.lookAt(camCurrentTargetRef.current);

      // Render
      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  // Reset zoom factor on focus change
  useEffect(() => {
    zoomFactorRef.current = 1.0;
  }, [settings.focusedBody]);

  // Update Orbit Lines visibility
  useEffect(() => {
    if (orbitLinesGroupRef.current) {
      orbitLinesGroupRef.current.visible = settings.showOrbits;
    }
  }, [settings.showOrbits]);

  // Update Asteroids visibility
  useEffect(() => {
    if (asteroidBeltRef.current) {
      asteroidBeltRef.current.visible = settings.showAsteroids;
    }
  }, [settings.showAsteroids]);

  // Update Nebula Glow visibility
  useEffect(() => {
    if (nebulaGroupRef.current) {
      nebulaGroupRef.current.visible = settings.nebulaGlow;
    }
  }, [settings.nebulaGlow]);

  return (
    <div
      ref={containerRef}
      id="three-galaxy-container"
      className="fixed inset-0 w-full h-full pointer-events-auto z-0 overflow-hidden"
    >
      <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing" />

      {/* Planet Hover Tooltip */}
      {hoveredName && hoveredPos && (
        <div
          className="fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-full px-3 py-1.5 rounded-lg bg-zinc-950/85 backdrop-blur-md border border-amber-400/40 text-xs font-mono text-amber-200 shadow-xl"
          style={{ left: hoveredPos.x, top: hoveredPos.y - 12 }}
        >
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block" />
            <span className="font-semibold tracking-wide">{hoveredName}</span>
          </div>
        </div>
      )}

      {/* Subtle bottom-left Cosmic Telemetry Badge */}
      <div className="absolute bottom-6 left-6 hidden lg:flex items-center gap-3 text-[11px] font-mono text-zinc-400 bg-zinc-950/75 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 z-10 pointer-events-none">
        <div className="flex items-center gap-1.5 text-amber-400">
          <span className="w-2 h-2 rounded-full bg-amber-400 inline-block animate-pulse" />
          <span>GALAXY ENGINE: ACTIVE</span>
        </div>
        <span className="text-zinc-600">|</span>
        <span className="text-zinc-300">
          {settings.focusedBody === 'all'
            ? 'VIEW: SOLAR SYSTEM OVERVIEW'
            : `FOCUSED: ${settings.focusedBody.toUpperCase()}`}
        </span>
        <span className="text-zinc-600">|</span>
        <span className="text-sky-400">
          {settings.warpSpeed ? 'WARP SPEED: 3.5X' : `ORBIT: ${settings.orbitSpeed.toFixed(1)}X`}
        </span>
      </div>
    </div>
  );
};
