import * as THREE from 'three';

type CleanupFn = () => void;

type BranchId = 'sql' | 'api' | 'insights';

type BranchNode = {
  mesh: THREE.Object3D;
  base: THREE.Vector3;
  phase: number;
};

type BranchResult = {
  id: BranchId;
  group: THREE.Group;
  nodes: BranchNode[];
  primaryAnchor: THREE.Vector3;
  dynamicMaterials: THREE.MeshBasicMaterial[];
  borderMaterial: THREE.LineBasicMaterial;
  baseBorderOpacity: number;
};

type SceneColors = {
  accent: THREE.Color;
  bright: THREE.Color;
  violet: THREE.Color;
  magenta: THREE.Color;
  success: THREE.Color;
  strong: THREE.Color;
};

type Packet = {
  mesh: THREE.Mesh;
  curve: THREE.Curve<THREE.Vector3>;
  speed: number;
  offset: number;
  lastProgress: number;
  startPulse?: BranchId;
  arrivalPulse: BranchId;
};

const SQL_ANCHOR = new THREE.Vector3(-1.35, -0.48, 0.08);
const API_ANCHOR = new THREE.Vector3(1.68, 1.02, -0.14);
const INSIGHTS_ANCHOR = new THREE.Vector3(1.78, -0.82, -0.34);
const SQL_SOCKET = new THREE.Vector3(0, 0.04, 0.35);
const API_SOCKET = new THREE.Vector3(0, 0, 0.12);
const INSIGHTS_SOCKET = new THREE.Vector3(0, 0.12, 0.08);

function readColor(token: string, fallback: string): THREE.Color {
  const rawValue = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  const channels = rawValue
    .split(/\s+/)
    .map((value) => Number.parseFloat(value))
    .filter((value) => Number.isFinite(value));

  if (channels.length < 3) return new THREE.Color(fallback);

  return new THREE.Color(channels[0] / 255, channels[1] / 255, channels[2] / 255);
}

function colorRgb(color: THREE.Color, alpha = 1): string {
  const red = Math.round(color.r * 255);
  const green = Math.round(color.g * 255);
  const blue = Math.round(color.b * 255);
  return alpha < 1 ? `rgba(${red}, ${green}, ${blue}, ${alpha})` : `rgb(${red}, ${green}, ${blue})`;
}

function getTexturePalette() {
  const surface = readColor('--color-surface-elevated', '#ffffff');
  const strong = readColor('--color-text-strong', '#0d1117');
  const muted = readColor('--color-text-muted', '#5c6c87');
  const isLightSurface = surface.r * 0.2126 + surface.g * 0.7152 + surface.b * 0.0722 > 0.65;

  return {
    panel: colorRgb(surface, isLightSurface ? 0.82 : 0.42),
    panelAlt: colorRgb(strong, isLightSurface ? 0.055 : 0.05),
    panelAltSubtle: colorRgb(strong, isLightSurface ? 0.032 : 0.025),
    strong: colorRgb(strong, isLightSurface ? 0.84 : 0.78),
    muted: colorRgb(muted, isLightSurface ? 0.78 : 0.65),
    subtle: colorRgb(muted, isLightSurface ? 0.66 : 0.45),
  };
}

function makeGlowTexture(color: THREE.Color): THREE.CanvasTexture {
  const size = 96;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');

  if (context) {
    const gradient = context.createRadialGradient(48, 48, 0, 48, 48, 48);
    gradient.addColorStop(0, colorRgb(color));
    gradient.addColorStop(0.36, colorRgb(color, 0.72));
    gradient.addColorStop(1, colorRgb(color, 0));
    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeDatabaseTexture(accent: THREE.Color, bright: THREE.Color): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 384;
  canvas.height = 256;
  const context = canvas.getContext('2d');

  if (context) {
    const palette = getTexturePalette();

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = palette.panel;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.strokeStyle = colorRgb(bright, 0.55);
    context.lineWidth = 2;
    context.strokeRect(28, 36, 328, 184);

    const gridLeft = 48;
    const gridTop = 72;
    const cellWidth = 58;
    const cellHeight = 28;

    for (let row = 0; row < 4; row += 1) {
      for (let column = 0; column < 5; column += 1) {
        const x = gridLeft + column * cellWidth;
        const y = gridTop + row * cellHeight;
        context.fillStyle =
          row === 0
            ? colorRgb(accent, 0.38)
            : row % 2 === 0
              ? palette.panelAlt
              : palette.panelAltSubtle;
        context.fillRect(x, y, cellWidth - 2, cellHeight - 2);
        context.strokeStyle = colorRgb(bright, 0.22);
        context.strokeRect(x, y, cellWidth - 2, cellHeight - 2);
      }
    }

    context.fillStyle = palette.strong;
    context.font = '700 28px Inter, sans-serif';
    context.fillText('DATA', 36, 52);

    context.font = '500 16px ui-monospace, monospace';
    context.fillStyle = colorRgb(bright, 0.62);
    context.fillText('records · indexed', 36, 228);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeTableChipTexture(
  accent: THREE.Color,
  bright: THREE.Color,
  caption = 'tables'
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 192;
  canvas.height = 128;
  const context = canvas.getContext('2d');

  if (context) {
    const palette = getTexturePalette();

    context.fillStyle = palette.panel;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = colorRgb(bright, 0.4);
    context.strokeRect(8, 8, 176, 112);

    context.fillStyle = colorRgb(bright, 0.62);
    context.font = '600 13px ui-monospace, monospace';
    context.fillText(caption, 14, 24);

    for (let row = 0; row < 3; row += 1) {
      for (let column = 0; column < 4; column += 1) {
        context.fillStyle = row === 0 ? colorRgb(accent, 0.35) : palette.panelAlt;
        context.fillRect(16 + column * 40, 32 + row * 26, 36, 20);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeApiServiceTexture(violet: THREE.Color, bright: THREE.Color): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 384;
  canvas.height = 256;
  const context = canvas.getContext('2d');

  if (context) {
    const palette = getTexturePalette();

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = palette.panel;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = colorRgb(violet, 0.5);
    context.lineWidth = 2;
    context.strokeRect(24, 24, 336, 208);

    context.fillStyle = palette.strong;
    context.font = '700 24px Inter, sans-serif';
    context.fillText('Service Layer', 36, 52);

    context.font = '600 18px ui-monospace, monospace';
    context.fillStyle = colorRgb(bright, 0.75);
    context.fillText('GET /records', 36, 92);

    context.font = '500 16px ui-monospace, monospace';
    context.fillStyle = colorRgb(violet, 0.85);
    context.fillText('{ "status": "ok" }', 36, 132);

    context.strokeStyle = colorRgb(violet, 0.35);
    context.beginPath();
    context.moveTo(36, 160);
    context.lineTo(348, 160);
    context.stroke();
    context.fillStyle = palette.subtle;
    context.font = '500 14px Inter, sans-serif';
    context.fillText('Validation · workflows', 36, 188);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeApiEndpointTexture(
  violet: THREE.Color,
  method: string,
  path: string
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 192;
  canvas.height = 96;
  const context = canvas.getContext('2d');

  if (context) {
    const palette = getTexturePalette();

    context.fillStyle = palette.panel;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = colorRgb(violet, 0.45);
    context.strokeRect(6, 6, 180, 84);
    context.font = '600 13px ui-monospace, monospace';
    context.fillStyle = colorRgb(violet, 0.82);
    context.fillText(`${method} ${path}`, 12, 40);
    context.font = '500 12px ui-monospace, monospace';
    context.fillStyle = palette.subtle;
    context.fillText('{ "status": "ok" }', 12, 68);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeMetricChipTexture(
  success: THREE.Color,
  accent: THREE.Color,
  label: string,
  value: string
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 176;
  canvas.height = 112;
  const context = canvas.getContext('2d');

  if (context) {
    const palette = getTexturePalette();

    context.fillStyle = palette.panel;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = colorRgb(success, 0.42);
    context.strokeRect(6, 6, 164, 100);
    context.fillStyle = palette.muted;
    context.font = '600 13px Inter, sans-serif';
    context.fillText(label, 14, 28);
    context.font = '700 22px Outfit, sans-serif';
    context.fillStyle = colorRgb(success, 0.92);
    context.fillText(value, 14, 58);
    context.font = '500 11px Inter, sans-serif';
    context.fillStyle = colorRgb(accent, 0.62);
    context.fillText('system metric', 14, 82);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeDashboardTexture(
  accent: THREE.Color,
  violet: THREE.Color,
  magenta: THREE.Color,
  success: THREE.Color
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 320;
  const context = canvas.getContext('2d');

  if (context) {
    const palette = getTexturePalette();

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = palette.panel;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = colorRgb(accent, 0.45);
    context.lineWidth = 2;
    context.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    context.strokeStyle = colorRgb(accent, 0.22);
    context.lineWidth = 1;
    for (let x = 48; x < canvas.width - 36; x += 52) {
      context.beginPath();
      context.moveTo(x, 56);
      context.lineTo(x, canvas.height - 48);
      context.stroke();
    }

    const bars = [
      [72, 208, 42, 62, violet],
      [132, 172, 42, 98, accent],
      [192, 132, 42, 138, magenta],
      [252, 148, 42, 122, accent],
      [312, 98, 42, 172, violet],
      [372, 128, 42, 142, success],
    ] as const;

    for (const [x, y, width, height, color] of bars) {
      const gradient = context.createLinearGradient(0, y, 0, y + height);
      gradient.addColorStop(0, colorRgb(color, 0.85));
      gradient.addColorStop(1, colorRgb(color, 0.15));
      context.fillStyle = gradient;
      context.fillRect(x, y, width, height);
    }

    context.strokeStyle = colorRgb(magenta, 0.92);
    context.lineWidth = 4;
    context.beginPath();
    context.moveTo(64, 168);
    context.bezierCurveTo(138, 108, 208, 198, 284, 122);
    context.bezierCurveTo(346, 62, 410, 102, 468, 66);
    context.stroke();

    context.fillStyle = palette.strong;
    context.font = '700 30px Inter, sans-serif';
    context.fillText('Insights', 36, 48);
    context.font = '600 20px Inter, sans-serif';
    context.fillStyle = colorRgb(success, 0.9);
    context.fillText('signals  ·  outcomes', 36, 78);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeKpiTexture(success: THREE.Color, accent: THREE.Color): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 160;
  const context = canvas.getContext('2d');

  if (context) {
    const palette = getTexturePalette();

    context.fillStyle = palette.panel;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = colorRgb(success, 0.45);
    context.strokeRect(8, 8, 240, 144);
    context.fillStyle = palette.muted;
    context.font = '600 18px Inter, sans-serif';
    context.fillText('health', 20, 36);
    context.font = '700 36px Outfit, sans-serif';
    context.fillStyle = colorRgb(success, 0.95);
    context.fillText('99.9%', 20, 82);
    context.font = '500 14px Inter, sans-serif';
    context.fillStyle = colorRgb(accent, 0.7);
    context.fillText('decision view', 20, 118);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeLineGeometry(points: THREE.Vector3[]): THREE.BufferGeometry {
  return new THREE.BufferGeometry().setFromPoints(points);
}

function applyBorderPulse(
  material: THREE.LineBasicMaterial,
  baseColor: THREE.Color,
  pulseColor: THREE.Color,
  baseOpacity: number,
  amount: number
) {
  material.color.copy(baseColor).lerp(pulseColor, amount);
  material.opacity = baseOpacity + amount * (0.92 - baseOpacity);
}

function addPathLine(
  group: THREE.Group,
  curve: THREE.Curve<THREE.Vector3>,
  material: THREE.LineBasicMaterial,
  segments = 52
): { curve: THREE.Curve<THREE.Vector3>; line: THREE.Line; segments: number } {
  const line = new THREE.Line(makeLineGeometry(curve.getPoints(segments)), material);
  group.add(line);
  return { curve, line, segments };
}

function refreshPathLine(line: THREE.Line, curve: THREE.Curve<THREE.Vector3>, segments: number) {
  line.geometry.dispose();
  line.geometry = makeLineGeometry(curve.getPoints(segments));
}

function buildPipelineCurve(start: THREE.Vector3, end: THREE.Vector3): THREE.CubicBezierCurve3 {
  const control1 = start.clone().lerp(end, 0.28).add(new THREE.Vector3(0, 0.1, -0.03));
  const control2 = start.clone().lerp(end, 0.72).add(new THREE.Vector3(0, -0.05, -0.02));
  return new THREE.CubicBezierCurve3(start, control1, control2, end.clone());
}

function socketPoint(anchor: THREE.Vector3, offset: THREE.Vector3): THREE.Vector3 {
  return anchor.clone().add(offset);
}

function addBranchSpoke(
  group: THREE.Group,
  from: THREE.Vector3,
  to: THREE.Vector3,
  material: THREE.LineBasicMaterial
) {
  const midpoint = from.clone().lerp(to, 0.5);
  midpoint.y += 0.035;
  midpoint.z += 0.04;
  const spoke = new THREE.CatmullRomCurve3([from.clone(), midpoint, to.clone()]);
  group.add(new THREE.Line(makeLineGeometry(spoke.getPoints(18)), material));
}

function createSqlBranch(
  colors: SceneColors,
  databaseMaterial: THREE.MeshPhysicalMaterial,
  badgeMaterial: THREE.MeshBasicMaterial,
  spokeMaterial: THREE.LineBasicMaterial
): BranchResult {
  const group = new THREE.Group();
  group.position.copy(SQL_ANCHOR);
  const nodes: BranchNode[] = [];
  const dynamicMaterials: THREE.MeshBasicMaterial[] = [];

  const bodyGeometry = new THREE.CylinderGeometry(0.5, 0.54, 0.56, 40, 1, false);
  const body = new THREE.Mesh(bodyGeometry, databaseMaterial);
  body.position.y = -0.05;
  group.add(body);

  const topCap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.54, 0.5, 0.07, 40, 1, false),
    databaseMaterial
  );
  topCap.position.y = 0.25;
  group.add(topCap);

  const basePlate = new THREE.Mesh(
    new THREE.CylinderGeometry(0.56, 0.56, 0.05, 40, 1, false),
    databaseMaterial
  );
  basePlate.position.y = -0.32;
  group.add(basePlate);

  const edgeMaterial = new THREE.LineBasicMaterial({
    color: colors.bright,
    opacity: 0.24,
    transparent: true,
  });
  const bodyOutline = new THREE.LineSegments(new THREE.EdgesGeometry(bodyGeometry), edgeMaterial);
  bodyOutline.position.copy(body.position);
  group.add(bodyOutline);

  const badge = new THREE.Mesh(new THREE.PlaneGeometry(0.76, 0.5), badgeMaterial);
  badge.position.set(0, 0.04, 0.58);
  group.add(badge);

  const badgeBorderMaterial = new THREE.LineBasicMaterial({
    color: colors.bright,
    opacity: 0.34,
    transparent: true,
  });
  const badgeEdge = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.PlaneGeometry(0.76, 0.5)),
    badgeBorderMaterial
  );
  badgeEdge.position.copy(badge.position);
  group.add(badgeEdge);

  const sqlChips = [
    {
      position: new THREE.Vector3(-0.5, 0.16, 0.3),
      rotation: [-0.06, 0.34, 0.04] as const,
      size: [0.34, 0.22] as const,
      caption: 'tables',
      phase: 0.65,
    },
    {
      position: new THREE.Vector3(-0.56, -0.22, 0.24),
      rotation: [-0.1, 0.28, 0.05] as const,
      size: [0.32, 0.2] as const,
      caption: 'procs',
      phase: 1.35,
    },
  ];

  const dbSpokeOrigin = new THREE.Vector3(0, 0.02, 0.34);

  sqlChips.forEach((chipConfig) => {
    const chipMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      map: makeTableChipTexture(colors.accent, colors.bright, chipConfig.caption),
      opacity: 0.7,
      side: THREE.DoubleSide,
      transparent: true,
    });
    dynamicMaterials.push(chipMaterial);

    const chip = new THREE.Mesh(
      new THREE.PlaneGeometry(chipConfig.size[0], chipConfig.size[1]),
      chipMaterial
    );
    chip.position.copy(chipConfig.position);
    chip.rotation.set(chipConfig.rotation[0], chipConfig.rotation[1], chipConfig.rotation[2]);
    group.add(chip);
    nodes.push({ base: chipConfig.position.clone(), mesh: chip, phase: chipConfig.phase });

    addBranchSpoke(group, dbSpokeOrigin, chipConfig.position, spokeMaterial);
  });

  return {
    id: 'sql',
    group,
    nodes,
    primaryAnchor: SQL_ANCHOR.clone(),
    dynamicMaterials,
    borderMaterial: badgeBorderMaterial,
    baseBorderOpacity: 0.34,
  };
}

function createApiBranch(
  colors: SceneColors,
  serviceMaterial: THREE.MeshBasicMaterial,
  spokeMaterial: THREE.LineBasicMaterial
): BranchResult {
  const group = new THREE.Group();
  group.position.copy(API_ANCHOR);
  group.scale.setScalar(1.24);
  const nodes: BranchNode[] = [];
  const dynamicMaterials: THREE.MeshBasicMaterial[] = [];

  const gateway = new THREE.Mesh(new THREE.PlaneGeometry(1.12, 0.72), serviceMaterial);
  gateway.rotation.set(-0.08, -0.42, 0.04);
  gateway.position.set(0, 0, 0.12);
  group.add(gateway);

  const gatewayBorderMaterial = new THREE.LineBasicMaterial({
    color: colors.bright,
    opacity: 0.34,
    transparent: true,
  });
  const gatewayEdge = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.PlaneGeometry(1.12, 0.72)),
    gatewayBorderMaterial
  );
  gatewayEdge.rotation.copy(gateway.rotation);
  gatewayEdge.position.copy(gateway.position);
  group.add(gatewayEdge);

  const apiEndpoints = [
    {
      position: new THREE.Vector3(0.54, 0.2, 0.06),
      rotation: [-0.08, -0.46, 0.04] as const,
      method: 'GET',
      path: '/records',
      phase: 0.95,
    },
    {
      position: new THREE.Vector3(0.62, -0.22, 0.1),
      rotation: [-0.1, -0.52, 0.05] as const,
      method: 'POST',
      path: '/events',
      phase: 1.55,
    },
  ];

  const gatewayOrigin = new THREE.Vector3(0, 0, 0.12);

  apiEndpoints.forEach((endpoint) => {
    const chipMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      map: makeApiEndpointTexture(colors.violet, endpoint.method, endpoint.path),
      opacity: 0.72,
      side: THREE.DoubleSide,
      transparent: true,
    });
    dynamicMaterials.push(chipMaterial);

    const chip = new THREE.Mesh(new THREE.PlaneGeometry(0.46, 0.24), chipMaterial);
    chip.position.copy(endpoint.position);
    chip.rotation.set(endpoint.rotation[0], endpoint.rotation[1], endpoint.rotation[2]);
    group.add(chip);
    nodes.push({ base: endpoint.position.clone(), mesh: chip, phase: endpoint.phase });

    addBranchSpoke(group, gatewayOrigin, endpoint.position, spokeMaterial);
  });

  return {
    id: 'api',
    group,
    nodes,
    primaryAnchor: API_ANCHOR.clone(),
    dynamicMaterials,
    borderMaterial: gatewayBorderMaterial,
    baseBorderOpacity: 0.34,
  };
}

function createInsightsBranch(
  colors: SceneColors,
  dashboardMaterial: THREE.MeshBasicMaterial,
  kpiMaterial: THREE.MeshBasicMaterial,
  spokeMaterial: THREE.LineBasicMaterial
): BranchResult {
  const group = new THREE.Group();
  group.position.copy(INSIGHTS_ANCHOR);
  const nodes: BranchNode[] = [];
  const dynamicMaterials: THREE.MeshBasicMaterial[] = [];

  const panelGeometry = new THREE.PlaneGeometry(1.48, 0.92);
  const dashboard = new THREE.Mesh(panelGeometry, dashboardMaterial);
  dashboard.rotation.set(-0.1, -0.44, 0.05);
  dashboard.position.set(0, 0.12, 0.08);
  group.add(dashboard);

  const dashboardBorderMaterial = new THREE.LineBasicMaterial({
    color: colors.bright,
    opacity: 0.32,
    transparent: true,
  });
  const dashboardEdge = new THREE.LineSegments(
    new THREE.EdgesGeometry(panelGeometry),
    dashboardBorderMaterial
  );
  dashboardEdge.rotation.copy(dashboard.rotation);
  dashboardEdge.position.copy(dashboard.position);
  group.add(dashboardEdge);

  const dashboardOrigin = new THREE.Vector3(0, 0.12, 0.08);
  const insightChips = [
    {
      position: new THREE.Vector3(-0.52, -0.3, 0.2),
      rotation: [-0.08, -0.36, 0.04] as const,
      size: [0.56, 0.34] as const,
      material: kpiMaterial,
      phase: 0.55,
    },
    {
      position: new THREE.Vector3(0.42, -0.26, 0.14),
      rotation: [-0.07, -0.4, 0.03] as const,
      size: [0.44, 0.28] as const,
      material: new THREE.MeshBasicMaterial({
        color: 0xffffff,
        map: makeMetricChipTexture(colors.success, colors.accent, 'activity', '12.4k/s'),
        opacity: 0.68,
        side: THREE.DoubleSide,
        transparent: true,
      }),
      phase: 1.15,
    },
  ];

  insightChips.forEach((chipConfig) => {
    const chip = new THREE.Mesh(
      new THREE.PlaneGeometry(chipConfig.size[0], chipConfig.size[1]),
      chipConfig.material
    );
    chip.position.copy(chipConfig.position);
    chip.rotation.set(chipConfig.rotation[0], chipConfig.rotation[1], chipConfig.rotation[2]);
    group.add(chip);
    nodes.push({ base: chipConfig.position.clone(), mesh: chip, phase: chipConfig.phase });

    if (chipConfig.material !== kpiMaterial) {
      dynamicMaterials.push(chipConfig.material);
    }

    addBranchSpoke(group, dashboardOrigin, chipConfig.position, spokeMaterial);
  });

  return {
    id: 'insights',
    group,
    nodes,
    primaryAnchor: INSIGHTS_ANCHOR.clone(),
    dynamicMaterials,
    borderMaterial: dashboardBorderMaterial,
    baseBorderOpacity: 0.32,
  };
}

export function initHeroDataFlow(): CleanupFn | void {
  const root = document.querySelector<HTMLElement>('[data-hero-data-flow]');
  const canvas = root?.querySelector<HTMLCanvasElement>('[data-flow-canvas]');

  if (!root || !canvas) return;

  const rootElement = root;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    canvas,
    powerPreference: 'high-performance',
  });
  const startTime = performance.now();
  const pointer = new THREE.Vector2(0, 0);
  const targetPointer = new THREE.Vector2(0, 0);
  const mainGroup = new THREE.Group();
  const stageElement =
    rootElement.querySelector<HTMLElement>('.hero-data-flow__stage') ?? rootElement;
  const reducedStaticOffset = prefersReducedMotion ? 0.8 : 0;
  let animationFrame = 0;
  let disposed = false;

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  camera.position.set(0, 0.2, 8.6);
  scene.add(mainGroup);

  let accent = readColor('--color-accent', '#22d3ee');
  let bright = readColor('--color-accent-bright', '#67e8f9');
  let violet = readColor('--color-violet', '#a78bfa');
  let magenta = readColor('--color-magenta', '#f472b6');
  let success = readColor('--color-success', '#10b981');
  let strong = readColor('--color-text-strong', '#f8fafc');

  const getColors = (): SceneColors => ({
    accent,
    bright,
    violet,
    magenta,
    success,
    strong,
  });

  const ambient = new THREE.AmbientLight(0xffffff, 0.52);
  const keyLight = new THREE.PointLight(0xffffff, 2.2, 18);
  const rimLight = new THREE.PointLight(violet, 3, 15);
  keyLight.position.set(-2, 3.8, 4.6);
  rimLight.position.set(3.3, -1.4, 3.2);
  scene.add(ambient, keyLight, rimLight);

  const databaseMaterial = new THREE.MeshPhysicalMaterial({
    color: accent,
    emissive: accent,
    emissiveIntensity: 0.09,
    metalness: 0.18,
    opacity: 0.58,
    roughness: 0.36,
    transparent: true,
  });

  const sqlBadgeMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    map: makeDatabaseTexture(accent, bright),
    opacity: 0.72,
    side: THREE.DoubleSide,
    transparent: true,
  });

  const apiServiceMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    map: makeApiServiceTexture(violet, bright),
    opacity: 0.68,
    side: THREE.DoubleSide,
    transparent: true,
  });

  const dashboardMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    map: makeDashboardTexture(accent, violet, magenta, success),
    opacity: 0.62,
    side: THREE.DoubleSide,
    transparent: true,
  });

  const kpiMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    map: makeKpiTexture(success, accent),
    opacity: 0.66,
    side: THREE.DoubleSide,
    transparent: true,
  });

  const lineMaterial = new THREE.LineBasicMaterial({
    color: accent,
    opacity: 0.32,
    transparent: true,
  });

  const outputLineMaterial = new THREE.LineBasicMaterial({
    color: success,
    opacity: 0.44,
    transparent: true,
  });

  const spokeMaterial = new THREE.LineBasicMaterial({
    color: bright,
    opacity: 0.16,
    transparent: true,
  });

  const packetMaterial = new THREE.MeshBasicMaterial({
    color: success,
    opacity: 0.82,
    transparent: true,
  });

  const accentPacketMaterial = new THREE.MeshBasicMaterial({
    color: accent,
    opacity: 0.78,
    transparent: true,
  });

  const haloMaterial = new THREE.SpriteMaterial({
    blending: THREE.AdditiveBlending,
    color: accent,
    depthWrite: false,
    map: makeGlowTexture(accent),
    opacity: 0.34,
    transparent: true,
  });

  const sqlBranch = createSqlBranch(getColors(), databaseMaterial, sqlBadgeMaterial, spokeMaterial);
  const apiBranch = createApiBranch(getColors(), apiServiceMaterial, spokeMaterial);
  const insightsBranch = createInsightsBranch(getColors(), dashboardMaterial, kpiMaterial, spokeMaterial);

  mainGroup.add(sqlBranch.group, apiBranch.group, insightsBranch.group);

  const halo = new THREE.Sprite(haloMaterial);
  halo.scale.set(2.8, 2.8, 1);
  halo.position.copy(SQL_ANCHOR).add(new THREE.Vector3(0, 0.02, -0.38));
  mainGroup.add(halo);

  let sqlToApiCurve = buildPipelineCurve(
    socketPoint(SQL_ANCHOR, SQL_SOCKET),
    socketPoint(API_ANCHOR, API_SOCKET)
  );
  let apiToInsightsCurve = buildPipelineCurve(
    socketPoint(API_ANCHOR, API_SOCKET),
    socketPoint(INSIGHTS_ANCHOR, INSIGHTS_SOCKET)
  );

  const sqlToApiPath = addPathLine(mainGroup, sqlToApiCurve, lineMaterial);
  const apiToInsightsPath = addPathLine(mainGroup, apiToInsightsCurve, outputLineMaterial);

  const branchPulse: Record<BranchId, { amount: number }> = {
    sql: { amount: 0 },
    api: { amount: 0 },
    insights: { amount: 0 },
  };

  const triggerBranchPulse = (branch: BranchId, strength = 1) => {
    branchPulse[branch].amount = Math.max(branchPulse[branch].amount, strength);
  };

  const packetGeometry = new THREE.SphereGeometry(0.032, 16, 12);
  const packets: Packet[] = [
    {
      arrivalPulse: 'api',
      curve: sqlToApiCurve,
      lastProgress: 0,
      mesh: new THREE.Mesh(packetGeometry, accentPacketMaterial.clone()),
      offset: reducedStaticOffset % 1,
      speed: 0.17,
      startPulse: 'sql',
    },
    {
      arrivalPulse: 'api',
      curve: sqlToApiCurve,
      lastProgress: 0.45,
      mesh: new THREE.Mesh(packetGeometry, accentPacketMaterial.clone()),
      offset: (0.45 + reducedStaticOffset) % 1,
      speed: 0.17,
      startPulse: 'sql',
    },
    {
      arrivalPulse: 'insights',
      curve: apiToInsightsCurve,
      lastProgress: 0,
      mesh: new THREE.Mesh(packetGeometry, packetMaterial.clone()),
      offset: (0.2 + reducedStaticOffset) % 1,
      speed: 0.18,
      startPulse: 'api',
    },
    {
      arrivalPulse: 'insights',
      curve: apiToInsightsCurve,
      lastProgress: 0.62,
      mesh: new THREE.Mesh(packetGeometry, packetMaterial.clone()),
      offset: (0.62 + reducedStaticOffset) % 1,
      speed: 0.18,
      startPulse: 'api',
    },
  ];

  packets.forEach((packet) => mainGroup.add(packet.mesh));

  const branchNodes = [...sqlBranch.nodes, ...apiBranch.nodes, ...insightsBranch.nodes];

  const starGeometry = new THREE.BufferGeometry();
  const starPositions: number[] = [];
  for (let index = 0; index < 60; index += 1) {
    const radius = 1.45 + Math.random() * 1.95;
    const angle = Math.random() * Math.PI * 2;
    starPositions.push(
      Math.cos(angle) * radius,
      -1.48 + Math.random() * 3.05,
      -1.55 + Math.random() * 0.75
    );
  }
  starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
  const starField = new THREE.Points(
    starGeometry,
    new THREE.PointsMaterial({
      blending: THREE.AdditiveBlending,
      color: strong,
      opacity: 0.14,
      size: 0.016,
      transparent: true,
    })
  );
  mainGroup.add(starField);

  const textureMaterials = [
    sqlBadgeMaterial,
    apiServiceMaterial,
    dashboardMaterial,
    kpiMaterial,
    ...sqlBranch.dynamicMaterials,
    ...apiBranch.dynamicMaterials,
    ...insightsBranch.dynamicMaterials,
  ];

  function refreshTextures() {
    const colors = getColors();

    const replaceMap = (material: THREE.MeshBasicMaterial, texture: THREE.CanvasTexture) => {
      material.map?.dispose();
      material.map = texture;
      material.needsUpdate = true;
    };

    replaceMap(sqlBadgeMaterial, makeDatabaseTexture(colors.accent, colors.bright));
    replaceMap(apiServiceMaterial, makeApiServiceTexture(colors.violet, colors.bright));
    replaceMap(dashboardMaterial, makeDashboardTexture(colors.accent, colors.violet, colors.magenta, colors.success));
    replaceMap(kpiMaterial, makeKpiTexture(colors.success, colors.accent));

    sqlBranch.dynamicMaterials.forEach((material, index) => {
      replaceMap(
        material,
        makeTableChipTexture(colors.accent, colors.bright, index === 0 ? 'tables' : 'procs')
      );
    });

    apiBranch.dynamicMaterials.forEach((material, index) => {
      replaceMap(
        material,
        makeApiEndpointTexture(
          colors.violet,
          index === 0 ? 'GET' : 'POST',
          index === 0 ? '/records' : '/events'
        )
      );
    });

    insightsBranch.dynamicMaterials.forEach((material) => {
      replaceMap(material, makeMetricChipTexture(colors.success, colors.accent, 'activity', '12.4k/s'));
    });
  }

  function syncColors() {
    accent = readColor('--color-accent', '#22d3ee');
    bright = readColor('--color-accent-bright', '#67e8f9');
    violet = readColor('--color-violet', '#a78bfa');
    magenta = readColor('--color-magenta', '#f472b6');
    success = readColor('--color-success', '#10b981');
    strong = readColor('--color-text-strong', '#f8fafc');

    databaseMaterial.color.copy(accent);
    databaseMaterial.emissive.copy(accent);
    lineMaterial.color.copy(accent);
    outputLineMaterial.color.copy(success);
    spokeMaterial.color.copy(bright);
    packetMaterial.color.copy(success);
    accentPacketMaterial.color.copy(accent);
    haloMaterial.color.copy(accent);
    rimLight.color.copy(violet);
    (starField.material as THREE.PointsMaterial).color.copy(strong);

    sqlBranch.borderMaterial.color.copy(bright);
    apiBranch.borderMaterial.color.copy(bright);
    insightsBranch.borderMaterial.color.copy(bright);
    sqlBranch.borderMaterial.opacity = sqlBranch.baseBorderOpacity;
    apiBranch.borderMaterial.opacity = apiBranch.baseBorderOpacity;
    insightsBranch.borderMaterial.opacity = insightsBranch.baseBorderOpacity;

    refreshTextures();
  }

  function syncPacketCurves() {
    packets.forEach((packet) => {
      packet.curve = packet.arrivalPulse === 'api' ? sqlToApiCurve : apiToInsightsCurve;
    });
  }

  function updatePipelineCurves(apiAnchor: THREE.Vector3, insightsAnchor: THREE.Vector3) {
    const sqlStart = socketPoint(SQL_ANCHOR, SQL_SOCKET);
    const apiPoint = socketPoint(apiAnchor, API_SOCKET);
    const insightsPoint = socketPoint(insightsAnchor, INSIGHTS_SOCKET);

    sqlToApiCurve = buildPipelineCurve(sqlStart, apiPoint);
    apiToInsightsCurve = buildPipelineCurve(apiPoint, insightsPoint);

    refreshPathLine(sqlToApiPath.line, sqlToApiCurve, sqlToApiPath.segments);
    refreshPathLine(
      apiToInsightsPath.line,
      apiToInsightsCurve,
      apiToInsightsPath.segments
    );
    syncPacketCurves();
  }

  let insightsBaseY = INSIGHTS_ANCHOR.y;

  function projectAnchorToScreen(anchor: THREE.Vector3): { x: number; y: number } {
    const stageRect = stageElement.getBoundingClientRect();
    const projected = anchor.clone();
    mainGroup.localToWorld(projected);
    projected.project(camera);

    return {
      x: (projected.x * 0.5 + 0.5) * stageRect.width + stageRect.left,
      y: (-projected.y * 0.5 + 0.5) * stageRect.height + stageRect.top,
    };
  }

  function screenDeltaToLocal(deltaX: number, deltaY: number): THREE.Vector3 {
    const stageRect = stageElement.getBoundingClientRect();
    const distance = camera.position.distanceTo(new THREE.Vector3(0, 0, 0));
    const vFov = (camera.fov * Math.PI) / 180;
    const visibleHeight = 2 * Math.tan(vFov / 2) * distance;
    const visibleWidth = visibleHeight * camera.aspect;

    return new THREE.Vector3(
      (deltaX / stageRect.width) * visibleWidth,
      -(deltaY / stageRect.height) * visibleHeight,
      0
    );
  }

  function alignBranchToLabel(
    branchGroup: THREE.Group,
    anchor: THREE.Vector3,
    labelSelector: string,
    targetFromLabel: { x: number; y: number }
  ) {
    const label = rootElement.querySelector<HTMLElement>(labelSelector);
    if (!label) return;

    const labelRect = label.getBoundingClientRect();
    const targetScreen = {
      x: labelRect.left + targetFromLabel.x,
      y: labelRect.top + targetFromLabel.y,
    };
    const currentScreen = projectAnchorToScreen(anchor);
    const localDelta = screenDeltaToLocal(
      targetScreen.x - currentScreen.x,
      targetScreen.y - currentScreen.y
    );

    anchor.add(localDelta);
    branchGroup.position.copy(anchor);
  }

  function alignBranchesToLabels(containerWidth: number) {
    const savedRotation = mainGroup.rotation.clone();
    mainGroup.rotation.set(0, 0, 0);
    mainGroup.updateMatrixWorld(true);

    const apiAnchor = API_ANCHOR.clone();
    const insightsAnchor = INSIGHTS_ANCHOR.clone();

    apiBranch.group.position.copy(apiAnchor);
    insightsBranch.group.position.copy(insightsAnchor);

    if (containerWidth < 520) {
      alignBranchToLabel(apiBranch.group, apiAnchor, '.flow-orbit-label--api', {
        x: -58,
        y: 48,
      });
      alignBranchToLabel(insightsBranch.group, insightsAnchor, '.flow-orbit-label--insights', {
        x: -52,
        y: -14,
      });
    } else if (containerWidth < 1024) {
      alignBranchToLabel(apiBranch.group, apiAnchor, '.flow-orbit-label--api', {
        x: -62,
        y: 50,
      });
      alignBranchToLabel(insightsBranch.group, insightsAnchor, '.flow-orbit-label--insights', {
        x: -50,
        y: -12,
      });
    } else {
      alignBranchToLabel(apiBranch.group, apiAnchor, '.flow-orbit-label--api', {
        x: -74,
        y: 58,
      });
      alignBranchToLabel(insightsBranch.group, insightsAnchor, '.flow-orbit-label--insights', {
        x: -60,
        y: -10,
      });
    }

    updatePipelineCurves(apiAnchor, insightsAnchor);
    insightsBaseY = insightsAnchor.y;

    mainGroup.rotation.copy(savedRotation);
    mainGroup.updateMatrixWorld(true);
  }

  function applySceneLayout(containerWidth: number) {
    if (containerWidth < 520) {
      mainGroup.position.set(0, -0.02, 0);
      mainGroup.scale.setScalar(1.02);
      camera.fov = 36;
      camera.position.set(0, 0.04, 7.55);
    } else if (containerWidth < 1024) {
      mainGroup.position.set(0.04, 0, 0);
      mainGroup.scale.setScalar(1.1);
      camera.fov = 33;
      camera.position.set(0.02, 0.08, 7.15);
    } else {
      mainGroup.position.set(0.12, 0.01, 0);
      mainGroup.scale.setScalar(1.16);
      camera.fov = 31;
      camera.position.set(0.04, 0.08, 6.85);
    }

    camera.updateProjectionMatrix();
  }

  function resize() {
    const rect = stageElement.getBoundingClientRect();
    const containerRect = rootElement.getBoundingClientRect();
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);
    camera.aspect = width / height;
    applySceneLayout(containerRect.width);
    alignBranchesToLabels(containerRect.width);
    renderer.setSize(width, height, false);
  }

  function animateLabels() {
    const labels = rootElement.querySelectorAll<HTMLElement>('.flow-orbit-label');
    labels.forEach((label, index) => {
      const strength = 8 + index * 2;
      label.style.setProperty('--label-x', `${pointer.x * strength}px`);
      label.style.setProperty('--label-y', `${pointer.y * -strength}px`);
    });
  }

  function render() {
    if (disposed) return;

    const elapsed = prefersReducedMotion ? 1.4 : (performance.now() - startTime) / 1000;
    pointer.lerp(targetPointer, 0.06);

    mainGroup.rotation.y = pointer.x * 0.26 + Math.sin(elapsed * 0.16) * 0.08;
    mainGroup.rotation.x = pointer.y * 0.16 + Math.sin(elapsed * 0.2) * 0.045;
    sqlBranch.group.rotation.y = elapsed * 0.28;
    insightsBranch.group.position.y = insightsBaseY + Math.sin(elapsed * 0.78) * 0.035;
    halo.material.opacity = 0.24 + Math.sin(elapsed * 1.4) * 0.05;

    branchNodes.forEach((node) => {
      node.mesh.position.y = node.base.y + Math.sin(elapsed * 1.1 + node.phase) * 0.06;
    });

    branchPulse.sql.amount *= 0.88;
    branchPulse.api.amount *= 0.88;
    branchPulse.insights.amount *= 0.88;

    const sqlPulse = branchPulse.sql.amount;
    const apiPulse = branchPulse.api.amount;
    const insightsPulse = branchPulse.insights.amount;

    applyBorderPulse(sqlBranch.borderMaterial, bright, success, sqlBranch.baseBorderOpacity, sqlPulse);
    applyBorderPulse(apiBranch.borderMaterial, bright, success, apiBranch.baseBorderOpacity, apiPulse);
    applyBorderPulse(
      insightsBranch.borderMaterial,
      bright,
      success,
      insightsBranch.baseBorderOpacity,
      insightsPulse
    );

    packets.forEach((packet) => {
      const progress = prefersReducedMotion
        ? packet.offset
        : (elapsed * packet.speed + packet.offset) % 1;

      if (!prefersReducedMotion) {
        if (packet.startPulse && packet.lastProgress < 0.06 && progress >= 0.06) {
          triggerBranchPulse(packet.startPulse, 0.85);
        }

        const arrived = packet.lastProgress < 0.94 && progress >= 0.94;
        const wrappedPastEnd = packet.lastProgress > progress && packet.lastProgress >= 0.94;

        if (arrived || wrappedPastEnd) {
          triggerBranchPulse(packet.arrivalPulse);
        }
      }

      packet.lastProgress = progress;
      packet.mesh.position.copy(packet.curve.getPointAt(progress));
      const scale = 0.82 + Math.sin(progress * Math.PI) * 0.55;
      packet.mesh.scale.setScalar(scale);
    });

    starField.rotation.z = elapsed * 0.025;
    animateLabels();
    renderer.render(scene, camera);

    if (!prefersReducedMotion) {
      animationFrame = window.requestAnimationFrame(render);
    }
  }

  function handlePointerMove(event: PointerEvent) {
    const rect = rootElement.getBoundingClientRect();
    targetPointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    targetPointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
  }

  function handlePointerLeave() {
    targetPointer.set(0, 0);
  }

  const resizeObserver = new ResizeObserver(resize);
  const themeObserver = new MutationObserver(syncColors);

  resizeObserver.observe(rootElement);
  themeObserver.observe(document.documentElement, {
    attributeFilter: ['class', 'data-theme'],
    attributes: true,
  });
  rootElement.addEventListener('pointermove', handlePointerMove);
  rootElement.addEventListener('pointerleave', handlePointerLeave);

  resize();
  syncColors();
  requestAnimationFrame(() => resize());
  render();

  return () => {
    disposed = true;
    window.cancelAnimationFrame(animationFrame);
    resizeObserver.disconnect();
    themeObserver.disconnect();
    rootElement.removeEventListener('pointermove', handlePointerMove);
    rootElement.removeEventListener('pointerleave', handlePointerLeave);

    const disposeMaterial = (material: THREE.Material | THREE.Material[]) => {
      const materials = Array.isArray(material) ? material : [material];
      materials.forEach((currentMaterial) => {
        Object.values(currentMaterial as unknown as Record<string, unknown>).forEach((value) => {
          if (value instanceof THREE.Texture) value.dispose();
        });
        currentMaterial.dispose();
      });
    };

    scene.traverse((object: THREE.Object3D) => {
      if (object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Points) {
        object.geometry.dispose();
        disposeMaterial(object.material);
      }

      if (object instanceof THREE.Sprite) {
        disposeMaterial(object.material);
      }
    });

    textureMaterials.forEach((material) => {
      material.map?.dispose();
    });

    renderer.dispose();
  };
}
