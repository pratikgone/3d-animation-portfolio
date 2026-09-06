import * as THREE from 'three';

// High-Fidelity 2048x1024 Procedural Canvas Texture Generators for Realistic Planets

// Helper: Seeded noise for realistic organic patterns
function simpleNoise(x: number, y: number, frequency: number): number {
  return (
    Math.sin(x * frequency * 0.01) * Math.cos(y * frequency * 0.01) +
    Math.sin((x + y) * frequency * 0.02) * 0.5 +
    Math.cos(Math.sqrt(x * x + y * y) * frequency * 0.015) * 0.25
  );
}

// 1. Sun Surface: Granulated boiling plasma, magnetic arc loops & sunspots
export function createSunTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Base glowing plasma gradient
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, '#ff7700');
  grad.addColorStop(0.2, '#ffaa00');
  grad.addColorStop(0.5, '#ffd700');
  grad.addColorStop(0.8, '#ffaa00');
  grad.addColorStop(1, '#ff6600');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Micro plasma granulation (thousands of heat convection cells)
  for (let i = 0; i < 1500; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const r = Math.random() * 40 + 12;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    const isHot = Math.random() > 0.35;
    g.addColorStop(0, isHot ? 'rgba(255, 255, 220, 0.45)' : 'rgba(220, 50, 0, 0.35)');
    g.addColorStop(0.6, 'rgba(255, 140, 0, 0.15)');
    g.addColorStop(1, 'rgba(255, 80, 0, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Dark sunspots with active penumbra borders
  for (let i = 0; i < 12; i++) {
    const sx = Math.random() * canvas.width;
    const sy = (Math.random() * 0.6 + 0.2) * canvas.height;
    const sr = Math.random() * 25 + 10;

    // Penumbra
    const pen = ctx.createRadialGradient(sx, sy, sr * 0.3, sx, sy, sr);
    pen.addColorStop(0, '#3a0800');
    pen.addColorStop(0.7, '#882200');
    pen.addColorStop(1, 'rgba(255, 120, 0, 0)');
    ctx.fillStyle = pen;
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fill();

    // Dark Umbra Core
    ctx.fillStyle = '#110200';
    ctx.beginPath();
    ctx.arc(sx, sy, sr * 0.45, 0, Math.PI * 2);
    ctx.fill();
  }

  // Solar coronal prominence arcs
  ctx.strokeStyle = 'rgba(255, 240, 180, 0.5)';
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    ctx.lineWidth = Math.random() * 6 + 2;
    ctx.beginPath();
    ctx.arc(x, y, Math.random() * 60 + 30, 0, Math.PI);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// 2. Earth Surface: High-res Oceans, Realistic Continents, Deserts, Ice Caps
export function createEarthTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Deep ocean gradient with shelf depth variation
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  oceanGrad.addColorStop(0, '#0a1d37');
  oceanGrad.addColorStop(0.3, '#103768');
  oceanGrad.addColorStop(0.5, '#154886');
  oceanGrad.addColorStop(0.7, '#103768');
  oceanGrad.addColorStop(1, '#0a1d37');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Shallow turquoise coastal waters around continents
  ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
  for (let i = 0; i < 60; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    ctx.beginPath();
    ctx.arc(x, y, Math.random() * 120 + 40, 0, Math.PI * 2);
    ctx.fill();
  }

  // Detailed organic landmasses
  ctx.fillStyle = '#1e5128';
  const landmasses = [
    { cx: 450, cy: 360, rx: 280, ry: 180 },  // North America
    { cx: 620, cy: 680, rx: 180, ry: 260 },  // South America
    { cx: 1050, cy: 380, rx: 220, ry: 170 }, // Europe
    { cx: 1100, cy: 600, rx: 260, ry: 260 }, // Africa
    { cx: 1480, cy: 360, rx: 380, ry: 220 }, // Asia
    { cx: 1680, cy: 740, rx: 180, ry: 140 }, // Australia
    { cx: 900, cy: 220, rx: 120, ry: 80 },   // Greenland
  ];

  landmasses.forEach(({ cx, cy, rx, ry }) => {
    ctx.beginPath();
    for (let a = 0; a < Math.PI * 2; a += 0.08) {
      const noise = (Math.sin(a * 6) + Math.cos(a * 11) + simpleNoise(cx + a * 50, cy, 3)) * 35;
      const x = cx + (rx + noise) * Math.cos(a);
      const y = cy + (ry + noise) * Math.sin(a);
      if (a === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();

    // Arid desert interiors (Sahara, Gobi, Outback)
    const desertGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rx * 0.65);
    desertGrad.addColorStop(0, '#c29b38');
    desertGrad.addColorStop(0.5, '#4e9f3d');
    desertGrad.addColorStop(1, 'rgba(30, 81, 40, 0)');
    ctx.fillStyle = desertGrad;
    ctx.fill();
  });

  // Polar ice caps with rugged jagged edges
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, 70);
  ctx.rect(0, canvas.height - 75, canvas.width, 75);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// 2b. Earth Specular Map: Ocean shines brightly, land is matte
export function createEarthSpecularMap(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Oceans shine bright white (high specularity)
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Land is matte black (no specularity)
  ctx.fillStyle = '#111111';
  const landmasses = [
    { cx: 220, cy: 180, rx: 140, ry: 90 },
    { cx: 300, cy: 340, rx: 90, ry: 130 },
    { cx: 520, cy: 190, rx: 110, ry: 90 },
    { cx: 540, cy: 300, rx: 130, ry: 130 },
    { cx: 740, cy: 180, rx: 190, ry: 110 },
    { cx: 840, cy: 370, rx: 90, ry: 70 },
  ];

  landmasses.forEach(({ cx, cy, rx, ry }) => {
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// 3. Earth Clouds Texture: Multi-layer swirling weather patterns
export function createEarthCloudsTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';

  // Tropical hurricane swirls & trade wind cloud bands
  for (let i = 0; i < 350; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * (canvas.height - 200) + 100;
    const rx = Math.random() * 140 + 40;
    const ry = Math.random() * 30 + 10;
    const angle = Math.sin(x * 0.01) * 0.3;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, angle, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// 4. Mars: Rusted Iron-Oxide Deserts, Valles Marineris Canyon & Olympus Mons
export function createMarsTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Base red dust gradient
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, '#661b0e');
  grad.addColorStop(0.25, '#9e321b');
  grad.addColorStop(0.5, '#c44525');
  grad.addColorStop(0.75, '#9e321b');
  grad.addColorStop(1, '#661b0e');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Dark Mare volcanic regions (Syrtis Major, Acidalia Planitia)
  ctx.fillStyle = 'rgba(45, 12, 5, 0.55)';
  for (let i = 0; i < 70; i++) {
    const cx = Math.random() * canvas.width;
    const cy = Math.random() * (canvas.height - 240) + 120;
    const rx = Math.random() * 180 + 50;
    const ry = Math.random() * 120 + 40;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, Math.random() * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Valles Marineris Canyon Rift (Deep horizontal slash)
  ctx.strokeStyle = '#220803';
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.moveTo(700, 520);
  ctx.bezierCurveTo(900, 500, 1100, 560, 1300, 530);
  ctx.stroke();

  // Impact Craters with sunlit rims
  for (let i = 0; i < 180; i++) {
    const cx = Math.random() * canvas.width;
    const cy = Math.random() * canvas.height;
    const r = Math.random() * 20 + 5;

    ctx.strokeStyle = 'rgba(255, 180, 140, 0.45)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = 'rgba(35, 8, 3, 0.4)';
    ctx.beginPath();
    ctx.arc(cx + 2, cy + 2, r * 0.8, 0, Math.PI * 2);
    ctx.fill();
  }

  // White CO2 Polar Caps
  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(0, 0, canvas.width, 50);
  ctx.fillRect(0, canvas.height - 55, canvas.width, 55);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// 5. Jupiter: Rich Cloud Belts, Turbulence Storm Vortices & Great Red Spot
export function createJupiterTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  const bands = [
    '#4a2e1b', '#8c5a37', '#d9b38c', '#a87349', '#f2dfce',
    '#6e4326', '#fefae0', '#8c5a37', '#b8865c', '#573319',
    '#d9b38c', '#6e4326', '#f2dfce', '#8c5a37', '#4a2e1b'
  ];

  const bandH = canvas.height / bands.length;
  bands.forEach((col, i) => {
    ctx.fillStyle = col;
    ctx.fillRect(0, i * bandH, canvas.width, bandH + 4);
  });

  // Turbulence wave noise along cloud belt interfaces
  for (let y = 0; y < canvas.height; y += 6) {
    const offset = Math.sin(y * 0.03) * 30 + Math.cos(y * 0.08) * 15;
    ctx.fillStyle = `rgba(255, 255, 255, ${0.12 + Math.sin(y * 0.05) * 0.06})`;
    ctx.fillRect(offset, y, canvas.width, 3);
  }

  // Swirling white storm ovals
  for (let i = 0; i < 20; i++) {
    const sx = Math.random() * canvas.width;
    const sy = Math.random() * canvas.height;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.ellipse(sx, sy, Math.random() * 30 + 15, Math.random() * 12 + 6, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Great Red Spot with swirl ring
  const spotX = canvas.width * 0.65;
  const spotY = canvas.height * 0.68;
  const spotGrad = ctx.createRadialGradient(spotX, spotY, 10, spotX, spotY, 90);
  spotGrad.addColorStop(0, '#991b1b');
  spotGrad.addColorStop(0.5, '#dc2626');
  spotGrad.addColorStop(0.85, '#f97316');
  spotGrad.addColorStop(1, 'rgba(217, 119, 6, 0)');

  ctx.fillStyle = spotGrad;
  ctx.beginPath();
  ctx.ellipse(spotX, spotY, 90, 48, 0, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// 6. Saturn Surface: Golden Butterscotch & Cream Atmospheric Bands
export function createSaturnTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  const bands = [
    '#806240', '#ab8b63', '#d9c5a5', '#bfa178', '#eddcc4',
    '#f5ebd6', '#d9c5a5', '#b89870', '#ab8b63', '#947550',
    '#eddcc4', '#bfa178', '#ab8b63', '#806240'
  ];

  const bandH = canvas.height / bands.length;
  bands.forEach((col, i) => {
    ctx.fillStyle = col;
    ctx.fillRect(0, i * bandH, canvas.width, bandH + 3);
  });

  // Soft atmospheric haze
  for (let y = 0; y < canvas.height; y += 8) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fillRect(0, y, canvas.width, 4);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// 7. Saturn Ring System: Ultra-high detail Cassini & Encke Divisions
export function createSaturnRingTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
  grad.addColorStop(0, 'rgba(200, 170, 130, 0)');
  grad.addColorStop(0.06, 'rgba(180, 150, 110, 0.25)');
  grad.addColorStop(0.18, 'rgba(235, 215, 185, 0.9)');
  grad.addColorStop(0.46, 'rgba(210, 180, 140, 0.75)');
  // Cassini Division
  grad.addColorStop(0.49, 'rgba(5, 5, 10, 0.05)');
  grad.addColorStop(0.55, 'rgba(5, 5, 10, 0.05)');
  // A Ring
  grad.addColorStop(0.58, 'rgba(225, 200, 165, 0.8)');
  // Encke Gap
  grad.addColorStop(0.78, 'rgba(10, 10, 15, 0.1)');
  grad.addColorStop(0.80, 'rgba(210, 185, 150, 0.7)');
  grad.addColorStop(0.94, 'rgba(180, 150, 110, 0.3)');
  grad.addColorStop(1, 'rgba(140, 110, 80, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Micro-ring groove striations
  for (let x = 80; x < canvas.width - 80; x += 4) {
    if (Math.random() > 0.35) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
      ctx.fillRect(x, 0, 1.5, canvas.height);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 8. Uranus Surface: Pale Cyan Aquamarine Ice Giant
export function createUranusTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, '#5eead4');
  grad.addColorStop(0.5, '#2dd4bf');
  grad.addColorStop(1, '#0f766e');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Faint high-altitude cloud bands
  for (let y = 0; y < canvas.height; y += 16) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.fillRect(0, y, canvas.width, 8);
  }

  return new THREE.CanvasTexture(canvas);
}

// 9. Neptune Surface: Mystic Deep Azure with High Winds & Great Dark Spot
export function createNeptuneTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, '#1e3a8a');
  grad.addColorStop(0.35, '#1d4ed8');
  grad.addColorStop(0.7, '#2563eb');
  grad.addColorStop(1, '#1e3a8a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Fast supersonic methane cirrus clouds
  ctx.fillStyle = 'rgba(191, 219, 254, 0.35)';
  for (let i = 0; i < 28; i++) {
    const y = Math.random() * canvas.height;
    ctx.fillRect(0, y, canvas.width, Math.random() * 5 + 1);
  }

  // Neptune Great Dark Spot
  const darkSpot = ctx.createRadialGradient(550, 280, 5, 550, 280, 60);
  darkSpot.addColorStop(0, '#090d16');
  darkSpot.addColorStop(0.7, '#1e3a8a');
  darkSpot.addColorStop(1, 'rgba(29, 78, 216, 0)');
  ctx.fillStyle = darkSpot;
  ctx.beginPath();
  ctx.ellipse(550, 280, 60, 32, 0, 0, Math.PI * 2);
  ctx.fill();

  return new THREE.CanvasTexture(canvas);
}

// 10. Mercury Surface: Highly Cratered Gray Lunar-like Terrain
export function createMercuryTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, '#4b5563');
  grad.addColorStop(0.5, '#6b7280');
  grad.addColorStop(1, '#374151');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Craters galore
  for (let i = 0; i < 200; i++) {
    const cx = Math.random() * canvas.width;
    const cy = Math.random() * canvas.height;
    const r = Math.random() * 16 + 3;

    ctx.strokeStyle = 'rgba(229, 231, 235, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = 'rgba(17, 24, 39, 0.35)';
    ctx.beginPath();
    ctx.arc(cx + 1, cy + 1, r * 0.8, 0, Math.PI * 2);
    ctx.fill();
  }

  return new THREE.CanvasTexture(canvas);
}

// 11. Venus Surface: Thick Sulfuric Golden Amber Clouds
export function createVenusTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, '#b45309');
  grad.addColorStop(0.3, '#d97706');
  grad.addColorStop(0.5, '#f59e0b');
  grad.addColorStop(0.7, '#d97706');
  grad.addColorStop(1, '#b45309');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Swirling sulfuric cloud streaks
  ctx.fillStyle = 'rgba(254, 243, 199, 0.2)';
  for (let i = 0; i < 40; i++) {
    const y = Math.random() * canvas.height;
    ctx.beginPath();
    ctx.ellipse(canvas.width / 2, y, canvas.width * 0.6, 25, Math.sin(y * 0.05) * 0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  return new THREE.CanvasTexture(canvas);
}

