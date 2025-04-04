// src/components/Explosion.jsx
import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Explosion({ position, onComplete }) {
  const meshRef = useRef();
  const startTime = useRef();

  useEffect(() => {
    startTime.current = performance.now();
  }, []);

  useFrame(() => {
    const elapsed = performance.now() - startTime.current;
    const t = elapsed / 1000; // i sekunder

    if (!meshRef.current) return;

    const scale = 1 + t * 4;
    meshRef.current.scale.set(scale, scale, scale);
    meshRef.current.material.opacity = Math.max(0, 1 - t); // fade out

    if (t > 1 && onComplete) {
      onComplete(); // ta bort explosion
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshBasicMaterial color="orange" transparent opacity={1} />
    </mesh>
  );
}

export default Explosion;
