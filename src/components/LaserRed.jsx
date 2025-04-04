import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function LaserRed({ direction, startPosition }) {
  const ref = useRef();
  const position = useRef(startPosition.clone());

  useFrame(() => {
    // Flytta fram lasern
    position.current.add(direction.clone().multiplyScalar(0.7)); // Justera hastigheten här
    if (ref.current) {
      ref.current.position.copy(position.current);

      // Rikta lasern mot rörelseriktningen
      const quaternion = new THREE.Quaternion();
      quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0), // Ursprunglig riktning
        direction.clone().normalize() // Ny riktning
      );
      ref.current.setRotationFromQuaternion(quaternion);
    }
  });

  return (
    <mesh ref={ref}>
      <cylinderGeometry args={[0.05, 0.05, 2, 8]} /> {/* Justera storlek här */}
      <meshBasicMaterial color="red" /> {/* Färg för Tie Fighter-laser */}
    </mesh>
  );
}

export default LaserRed;