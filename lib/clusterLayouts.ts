export type Vec3 = [number, number, number];
export const NODE_COUNT = 120;

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function gridLayout(): Vec3[] {
  const size = 5;
  const spacing = 0.55;
  const offset = -((size - 1) * spacing) / 2;
  const positions: Vec3[] = [];
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      for (let z = 0; z < size; z++) {
        if (positions.length >= NODE_COUNT) break;
        positions.push([
          offset + x * spacing,
          offset + y * spacing,
          offset + z * spacing,
        ]);
      }
    }
  }
  while (positions.length < NODE_COUNT) positions.push([0, 0, 0]);
  return positions;
}

export function sphereLayout(): Vec3[] {
  const r = 1.55;
  const phi = Math.PI * (Math.sqrt(5) - 1);
  return Array.from({ length: NODE_COUNT }, (_, i) => {
    const y = 1 - (i / (NODE_COUNT - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    const theta = phi * i;
    return [Math.cos(theta) * rad * r, y * r, Math.sin(theta) * rad * r] as Vec3;
  });
}

export function graphLayout(): Vec3[] {
  const rand = seededRandom(42);
  const clusters: Array<{ center: Vec3; count: number; spread: number }> = [
    { center: [-1.35, 0.8, 0.2], count: 32, spread: 0.75 },
    { center: [1.45, -0.35, 0.7], count: 34, spread: 0.85 },
    { center: [0.15, 1.35, -1.05], count: 26, spread: 0.65 },
    { center: [-0.55, -1.15, -0.85], count: 28, spread: 0.7 },
  ];

  const positions: Vec3[] = [];
  clusters.forEach(({ center, count, spread }) => {
    for (let i = 0; i < count; i++) {
      positions.push([
        center[0] + (rand() - 0.5) * spread,
        center[1] + (rand() - 0.5) * spread,
        center[2] + (rand() - 0.5) * spread,
      ]);
    }
  });

  while (positions.length < NODE_COUNT) {
    positions.push([
      (rand() - 0.5) * 3,
      (rand() - 0.5) * 3,
      (rand() - 0.5) * 3,
    ]);
  }
  return positions.slice(0, NODE_COUNT);
}

export type LayoutName = "grid" | "sphere" | "graph";

export function computeGraphEdges(positions: Vec3[]): Array<[number, number]> {
  const edges: Array<[number, number]> = [];
  const maxDist = 0.9;
  for (let i = 0; i < positions.length; i++) {
    let matches = 0;
    for (let j = i + 1; j < positions.length && matches < 3; j++) {
      const dx = positions[i][0] - positions[j][0];
      const dy = positions[i][1] - positions[j][1];
      const dz = positions[i][2] - positions[j][2];
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (d < maxDist) {
        edges.push([i, j]);
        matches++;
      }
    }
  }
  return edges;
}
