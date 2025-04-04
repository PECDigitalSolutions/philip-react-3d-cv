import { forwardRef, useImperativeHandle, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Laser = forwardRef(({ direction, startPosition, onOutOfBounds, onHit }, ref) => {
  const meshRef = useRef();
  const position = useRef(startPosition.clone());

  useFrame(() => {
    position.current.add(direction.clone().multiplyScalar(0.5));
    if (!meshRef.current) return;

    meshRef.current.position.copy(position.current);

    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      direction.clone().normalize()
    );
    meshRef.current.quaternion.copy(quaternion);

    // Träffkontroll (endast spelarens laser anropar detta)
    if (onHit && onHit(position.current, 'player')) {
      if (onOutOfBounds) onOutOfBounds();
    }

    if (position.current.length() > 100 && onOutOfBounds) {
      onOutOfBounds();
    }
  });

  useImperativeHandle(ref, () => ({
    getPosition: () => position.current.clone(),
  }));

  return (
    <mesh ref={meshRef}>
      <cylinderGeometry args={[0.03, 0.03, 2, 8]} />
      <meshBasicMaterial color="lime" />
    </mesh>
  );
});

export default Laser;
