'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';
import TransformerModel, { type TransformerVisualState } from './TransformerModel';
import type { HealthStatus } from '@/types';
import { STATUS_COLORS } from '@/types';

interface TransformerCanvasContentProps {
  visualState: TransformerVisualState;
  isDarkMode: boolean;
}

function SceneLights({
  status,
  isDarkMode,
  isLoading,
}: {
  status: HealthStatus | null;
  isDarkMode: boolean;
  isLoading: boolean;
}) {
  const accent = status ? STATUS_COLORS[status] : isDarkMode ? '#00d4ff' : '#0066cc';

  return (
    <>
      <ambientLight intensity={isDarkMode ? 0.35 : 0.65} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={isDarkMode ? 1.2 : 0.9}
        color={isDarkMode ? '#aaccff' : '#ffffff'}
        castShadow
      />
      <pointLight position={[-3, 2, 2]} intensity={isLoading ? 2 : 1.2} color={accent} distance={12} />
      <pointLight position={[3, -1, -2]} intensity={0.8} color={isDarkMode ? '#00ff88' : '#00aa66'} />
      {status === 'CRITICAL' && (
        <pointLight position={[0, 3, 0]} intensity={2.5} color="#ff0000" distance={8} />
      )}
    </>
  );
}

export default function TransformerCanvasContent({
  visualState,
  isDarkMode,
}: TransformerCanvasContentProps) {
  const bg = useMemo(() => new THREE.Color(isDarkMode ? '#020817' : '#e8eef5'), [isDarkMode]);

  return (
    <Canvas shadows gl={{ antialias: true }} style={{ background: bg.getStyle() }}>
      <PerspectiveCamera makeDefault position={[4.5, 2.5, 5]} fov={45} />
      <SceneLights
        status={visualState.status}
        isDarkMode={isDarkMode}
        isLoading={visualState.isLoading}
      />
      <TransformerModel state={visualState} />
      <OrbitControls
        enablePan={false}
        minDistance={3}
        maxDistance={12}
        maxPolarAngle={Math.PI / 2 + 0.2}
      />
      <fog attach="fog" args={[bg, 8, 18]} />
    </Canvas>
  );
}
