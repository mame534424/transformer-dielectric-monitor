'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import type { HealthStatus } from '@/types';
import { STATUS_COLORS } from '@/types';

export interface TransformerVisualState {
  BDV: number;
  Tan_Delta: number;
  Insulation_Resistance: number;
  Capacitance_Variation: number;
  Polarization_Index: number;
  DDF: number;
  status: HealthStatus | null;
  isLoading: boolean;
}

interface TransformerModelProps {
  state: TransformerVisualState;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpColor(current: THREE.Color, target: THREE.Color, t: number) {
  current.r = lerp(current.r, target.r, t);
  current.g = lerp(current.g, target.g, t);
  current.b = lerp(current.b, target.b, t);
}

export default function TransformerModel({ state }: TransformerModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const fieldRef = useRef<THREE.Mesh>(null);
  const leftCoilRef = useRef<THREE.Mesh>(null);
  const rightCoilRef = useRef<THREE.Mesh>(null);
  const emissiveTarget = useRef(new THREE.Color('#00d4ff'));
  const fieldColor = useRef(new THREE.Color('#00d4ff'));

  const statusColor = useMemo(() => {
    if (state.status) return new THREE.Color(STATUS_COLORS[state.status]);
    return new THREE.Color('#00d4ff');
  }, [state.status]);

  const bdvLow = state.BDV < 30;
  const bdvHigh = state.BDV > 70;
  const tanHigh = state.Tan_Delta > 0.7;
  const tanLow = state.Tan_Delta < 0.3;
  const irLow = state.Insulation_Resistance < 200;
  const irHigh = state.Insulation_Resistance > 700;
  const piLow = state.Polarization_Index < 3;
  const piHigh = state.Polarization_Index > 7;
  const ddfHigh = state.DDF > 0.7;
  const ddfLow = state.DDF < 0.2;

  const sparkleCount = irLow ? 80 : irHigh ? 30 : 50;
  const sparkleSpeed = irLow ? 2.5 : 0.8;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const group = groupRef.current;
    const core = coreRef.current;
    const field = fieldRef.current;
    const leftCoil = leftCoilRef.current;
    const rightCoil = rightCoilRef.current;

    if (!group || !core || !field || !leftCoil || !rightCoil) return;

    let targetEmissive = new THREE.Color(bdvHigh ? '#00ff88' : bdvLow ? '#ff2222' : '#4488ff');
    if (tanHigh) targetEmissive = new THREE.Color('#ff8800');
    if (tanLow) targetEmissive = new THREE.Color('#4488ff');
    if (state.status) targetEmissive = statusColor.clone();

    lerpColor(emissiveTarget.current, targetEmissive, 0.06);

    const mat = core.material as THREE.MeshStandardMaterial;
    mat.emissive.copy(emissiveTarget.current);
    mat.emissiveIntensity = state.isLoading
      ? 0.8 + Math.sin(t * 4) * 0.4
      : bdvLow
        ? 0.6 + Math.sin(t * 12) * 0.35
        : 0.35 + Math.sin(t * 2) * 0.1;

    (leftCoil.material as THREE.MeshStandardMaterial).emissive.copy(emissiveTarget.current);
    (rightCoil.material as THREE.MeshStandardMaterial).emissive.copy(emissiveTarget.current);
    (leftCoil.material as THREE.MeshStandardMaterial).emissiveIntensity = bdvLow
      ? 0.9 + Math.sin(t * 18) * 0.5
      : 0.4;
    (rightCoil.material as THREE.MeshStandardMaterial).emissiveIntensity = bdvLow
      ? 0.9 + Math.cos(t * 18) * 0.5
      : 0.4;

    const fieldTarget = state.status
      ? statusColor
      : tanHigh
        ? new THREE.Color('#ff8800')
        : tanLow
          ? new THREE.Color('#4488ff')
          : new THREE.Color('#00d4ff');
    lerpColor(fieldColor.current, fieldTarget, 0.05);
    const fieldMat = field.material as THREE.MeshStandardMaterial;
    fieldMat.color.copy(fieldColor.current);
    fieldMat.emissive.copy(fieldColor.current);
    fieldMat.opacity = state.isLoading ? 0.25 + Math.sin(t * 3) * 0.1 : 0.15;

    const rotSpeed = piHigh ? 0.15 : piLow ? 0.05 : 0.25;
    field.rotation.y += rotSpeed * 0.02;
    field.rotation.x = Math.sin(t * rotSpeed) * 0.1;

    if (tanHigh) {
      const wobble = 1 + Math.sin(t * 8) * 0.02;
      core.scale.set(wobble, 1 + Math.cos(t * 7) * 0.015, wobble);
    } else {
      core.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
    }

    if (piLow) {
      group.rotation.z = Math.sin(t * 6) * 0.04;
      group.position.y = Math.sin(t * 5) * 0.03;
    } else {
      group.rotation.z = lerp(group.rotation.z, 0, 0.08);
      group.position.y = lerp(group.position.y, 0, 0.08);
    }

    if (state.status === 'CRITICAL') {
      group.position.x = Math.sin(t * 30) * 0.06;
      group.position.y = Math.cos(t * 28) * 0.05;
    } else if (state.status === 'POOR') {
      group.position.x = Math.sin(t * 12) * 0.03;
    } else {
      group.position.x = lerp(group.position.x, 0, 0.1);
      group.position.y = lerp(group.position.y, 0, 0.1);
    }

    if (state.status === 'EXCELLENT') {
      group.scale.setScalar(1 + Math.sin(t * 1.5) * 0.02);
    } else if (state.status === 'GOOD') {
      group.scale.setScalar(1 + Math.sin(t * 2) * 0.015);
    } else if (state.status === 'MARGINAL') {
      group.scale.setScalar(1 + Math.sin(t * 4) * 0.025);
    } else {
      group.scale.lerp(new THREE.Vector3(1, 1, 1), 0.08);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, -0.6, 0]} receiveShadow>
        <boxGeometry args={[3.2, 0.2, 2.2]} />
        <meshStandardMaterial color="#1a2535" metalness={0.6} roughness={0.4} />
      </mesh>

      <mesh ref={coreRef} position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[1.4, 1.6, 1]} />
        <meshStandardMaterial color="#2a3545" metalness={0.7} roughness={0.35} emissive="#003344" />
      </mesh>

      <mesh ref={leftCoilRef} position={[-1.1, 0.2, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 1.5, 24]} />
        <meshStandardMaterial color="#3d4a5c" metalness={0.8} roughness={0.3} emissive="#002233" />
      </mesh>

      <mesh ref={rightCoilRef} position={[1.1, 0.2, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 1.5, 24]} />
        <meshStandardMaterial color="#3d4a5c" metalness={0.8} roughness={0.3} emissive="#002233" />
      </mesh>

      {[-0.5, 0, 0.5].map((x) => (
        <mesh key={x} position={[x, 1.15, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.1, 0.35, 12]} />
          <meshStandardMaterial color="#c9a227" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}

      <mesh ref={fieldRef}>
        <sphereGeometry args={[2.2, 32, 32]} />
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          transparent
          opacity={0.15}
          wireframe
        />
      </mesh>

      <Sparkles
        count={sparkleCount}
        scale={[4, 3, 4]}
        size={irLow ? 3 : 2}
        speed={sparkleSpeed}
        opacity={irLow ? 0.9 : 0.5}
        color={irLow ? '#ff6644' : bdvHigh ? '#00ff88' : '#00d4ff'}
      />

      {ddfHigh && (
        <Sparkles
          count={40}
          position={[0, 1.5, 0]}
          scale={[1.2, 2, 1.2]}
          size={4}
          speed={1.2}
          opacity={0.7}
          color="#888888"
        />
      )}

      {ddfLow && (
        <Sparkles
          count={20}
          scale={[2.5, 0.5, 2.5]}
          size={1.5}
          speed={0.3}
          opacity={0.6}
          color="#00ffcc"
        />
      )}

      {bdvLow && (
        <Sparkles
          count={25}
          position={[-1.1, 0.2, 0]}
          scale={0.8}
          size={5}
          speed={3}
          opacity={0.8}
          color="#ff2222"
        />
      )}
    </group>
  );
}
