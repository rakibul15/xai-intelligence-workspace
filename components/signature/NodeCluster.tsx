"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Mesh, Group, BufferGeometry, LineBasicMaterial, LineSegments, Float32BufferAttribute, MeshBasicMaterial } from "three";
import { Vec3, LayoutName } from "@/lib/clusterLayouts";

const WAVE_SPEED = 2.6;
const WAVE_WIDTH = 0.5;
const WAVE_PUSH = 0.22;
const WAVE_LIFETIME = 1.6;

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const listener = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, []);
  return reduced;
}

function waveOffset(target: Vec3, elapsedSinceWave: number): Vec3 {
  if (elapsedSinceWave < 0 || elapsedSinceWave > WAVE_LIFETIME) return [0, 0, 0];
  const dist = Math.sqrt(target[0] * target[0] + target[1] * target[1] + target[2] * target[2]);
  if (dist < 0.001) return [0, 0, 0];
  const waveR = elapsedSinceWave * WAVE_SPEED;
  const distFromFront = Math.abs(waveR - dist);
  if (distFromFront > WAVE_WIDTH) return [0, 0, 0];
  const proximity = 1 - distFromFront / WAVE_WIDTH;
  const decay = 1 - elapsedSinceWave / WAVE_LIFETIME;
  const push = proximity * proximity * decay * WAVE_PUSH;
  const nx = target[0] / dist;
  const ny = target[1] / dist;
  const nz = target[2] / dist;
  return [nx * push, ny * push, nz * push];
}

function Node({
  target,
  reduced,
  waveStartRef,
}: {
  target: Vec3;
  reduced: boolean;
  waveStartRef: { current: number };
}) {
  const ref = useRef<Mesh>(null);
  const materialRef = useRef<MeshBasicMaterial>(null);

  useFrame((state, delta) => {
    if (!ref.current) return;
    if (reduced) {
      ref.current.position.set(target[0], target[1], target[2]);
      return;
    }
    const t = 1 - Math.exp(-5.5 * delta);

    const elapsedSinceWave = state.clock.elapsedTime - waveStartRef.current;
    const [ox, oy, oz] = waveOffset(target, elapsedSinceWave);
    const tx = target[0] + ox;
    const ty = target[1] + oy;
    const tz = target[2] + oz;

    ref.current.position.x += (tx - ref.current.position.x) * t;
    ref.current.position.y += (ty - ref.current.position.y) * t;
    ref.current.position.z += (tz - ref.current.position.z) * t;
  });

  return (
    <mesh ref={ref} position={target}>
      <sphereGeometry args={[0.045, 14, 14]} />
      <meshStandardMaterial
        color="#a9bbff"
        emissive="#6e8bff"
        emissiveIntensity={0.9}
        roughness={0.3}
        metalness={0.2}
      />
    </mesh>
  );
}

function ShockwaveRing({ waveStartRef }: { waveStartRef: { current: number } }) {
  const ref = useRef<Mesh>(null);
  const materialRef = useRef<MeshBasicMaterial>(null);

  useFrame((state) => {
    if (!ref.current || !materialRef.current) return;
    const elapsed = state.clock.elapsedTime - waveStartRef.current;
    if (elapsed < 0 || elapsed > WAVE_LIFETIME) {
      ref.current.scale.set(0.001, 0.001, 0.001);
      materialRef.current.opacity = 0;
      return;
    }
    const r = elapsed * WAVE_SPEED;
    ref.current.scale.set(r, r, r);
    const decay = 1 - elapsed / WAVE_LIFETIME;
    materialRef.current.opacity = 0.55 * decay * decay;
  });

  return (
    <>
      <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.96, 1.0, 96]} />
        <meshBasicMaterial
          ref={materialRef}
          color="#a9bbff"
          transparent
          opacity={0}
          side={2}
        />
      </mesh>
    </>
  );
}

function GraphEdges({
  nodeTargets,
  edges,
  visible,
  waveStartRef,
  reduced,
}: {
  nodeTargets: Vec3[];
  edges: Array<[number, number]>;
  visible: boolean;
  waveStartRef: { current: number };
  reduced: boolean;
}) {
  const ref = useRef<LineSegments>(null);
  const materialRef = useRef<LineBasicMaterial>(null);
  const nodePositionsRef = useRef<Vec3[]>(nodeTargets.map((t) => [...t] as Vec3));

  const geometry = useMemo(() => {
    const geo = new BufferGeometry();
    const arr = new Float32Array(edges.length * 6);
    geo.setAttribute("position", new Float32BufferAttribute(arr, 3));
    return geo;
  }, [edges.length]);

  useFrame((state, delta) => {
    const t = 1 - Math.exp(-5.5 * delta);
    const elapsedSinceWave = state.clock.elapsedTime - waveStartRef.current;

    for (let i = 0; i < nodeTargets.length; i++) {
      const cur = nodePositionsRef.current[i];
      const [ox, oy, oz] = reduced ? [0, 0, 0] : waveOffset(nodeTargets[i], elapsedSinceWave);
      const tx = nodeTargets[i][0] + ox;
      const ty = nodeTargets[i][1] + oy;
      const tz = nodeTargets[i][2] + oz;
      cur[0] += (tx - cur[0]) * t;
      cur[1] += (ty - cur[1]) * t;
      cur[2] += (tz - cur[2]) * t;
    }

    const pos = geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < edges.length; i++) {
      const [a, b] = edges[i];
      const pa = nodePositionsRef.current[a];
      const pb = nodePositionsRef.current[b];
      pos[i * 6 + 0] = pa[0];
      pos[i * 6 + 1] = pa[1];
      pos[i * 6 + 2] = pa[2];
      pos[i * 6 + 3] = pb[0];
      pos[i * 6 + 4] = pb[1];
      pos[i * 6 + 5] = pb[2];
    }
    geometry.attributes.position.needsUpdate = true;

    if (materialRef.current) {
      const targetOp = visible ? 0.5 : 0;
      materialRef.current.opacity += (targetOp - materialRef.current.opacity) * t * 0.6;
    }
  });

  return (
    <lineSegments ref={ref} geometry={geometry}>
      <lineBasicMaterial
        ref={materialRef}
        color="#6e8bff"
        transparent
        opacity={0}
      />
    </lineSegments>
  );
}

function CenterGlow({ reduced }: { reduced: boolean }) {
  const ref = useRef<Mesh>(null);
  useFrame((state) => {
    if (!ref.current || reduced) return;
    ref.current.rotation.z = state.clock.elapsedTime * 0.1;
    const s = 1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
    ref.current.scale.set(s, s, s);
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.15, 24, 24]} />
      <meshBasicMaterial color="#a9bbff" transparent opacity={0.12} />
    </mesh>
  );
}

interface Props {
  targets: Vec3[];
  edges: Array<[number, number]>;
  layout: LayoutName;
}

function Scene({ targets, edges, layout }: Props) {
  const groupRef = useRef<Group>(null);
  const reduced = useReducedMotion();
  const waveStartRef = useRef(-99);
  const lastLayoutRef = useRef(layout);

  useFrame((state, delta) => {
    if (lastLayoutRef.current !== layout) {
      waveStartRef.current = state.clock.elapsedTime;
      lastLayoutRef.current = layout;
    }
    if (groupRef.current && !reduced) {
      groupRef.current.rotation.y += delta * 0.06;
    }
  });

  return (
    <group ref={groupRef}>
      <CenterGlow reduced={reduced} />
      {!reduced && <ShockwaveRing waveStartRef={waveStartRef} />}
      {targets.map((t, i) => (
        <Node key={i} target={t} reduced={reduced} waveStartRef={waveStartRef} />
      ))}
      <GraphEdges
        nodeTargets={targets}
        edges={edges}
        visible={layout === "graph"}
        waveStartRef={waveStartRef}
        reduced={reduced}
      />
    </group>
  );
}

export function NodeCluster({ targets, edges, layout }: Props) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 42 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.35} />
      <pointLight position={[3, 3, 3]} intensity={1.2} color="#a9bbff" />
      <pointLight position={[-3, -2, 2]} intensity={0.7} color="#6e8bff" />
      <pointLight position={[0, 0, -3]} intensity={0.4} color="#ffffff" />
      <Scene targets={targets} edges={edges} layout={layout} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        rotateSpeed={0.7}
        dampingFactor={0.08}
      />
    </Canvas>
  );
}
