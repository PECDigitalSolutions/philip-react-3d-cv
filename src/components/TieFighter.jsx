import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import LaserRed from './LaserRed';

function TieFighter({ id, onHit, registerCheckHit }) {
  const ref = useRef();
  const hitboxRef = useRef(new THREE.Box3());
  const gltf = useGLTF('/models/tie.glb');
  const [clonedScene] = useState(() => gltf.scene.clone(true));
  const [lasers, setLasers] = useState([]);
  const lastBurstTime = useRef(0);
  const [burstStep, setBurstStep] = useState(0);
  const burstInterval = 0.15;
  const burstSize = 4;
  const burstCooldown = 2;

  // Rörelsebanans slumpvärden
  const angleOffset = useRef(Math.random() * Math.PI * 2);
  const radius = useRef(10 + Math.random() * 5);
  const verticalOffset = useRef((Math.random() - 0.5) * 4);
  const angularSpeed = 0.2;

  useEffect(() => {
    setLasers([]);
    setBurstStep(0);
    lastBurstTime.current = 0;
  }, [id]);

  // Registrera checkHit till Background3D
  useEffect(() => {
    if (registerCheckHit) {
      registerCheckHit(checkHit);
    }
  }, [registerCheckHit]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const angle = t * angularSpeed + angleOffset.current;

    const x = Math.cos(angle) * radius.current;
    const y = verticalOffset.current + Math.sin(angle * 2) * 1.5;
    const z = Math.sin(angle) * radius.current;

    const nextAngle = angle + 0.01;
    const nextX = Math.cos(nextAngle) * radius.current;
    const nextY = verticalOffset.current + Math.sin(nextAngle * 2) * 1.5;
    const nextZ = Math.sin(nextAngle) * radius.current;

    if (!ref.current) return;

    const currentPos = new THREE.Vector3(x, y, z);
    const nextPos = new THREE.Vector3(nextX, nextY, nextZ);
    const direction = nextPos.clone().sub(currentPos).normalize();

    ref.current.position.copy(currentPos);
    ref.current.lookAt(nextPos);
    ref.current.rotation.z = Math.sin(t * 2) * 0.2;

    // Uppdatera hitbox
    hitboxRef.current.setFromObject(ref.current);

    // 🔫 Dubbel laser offset (vänster/höger vinge)
    const right = new THREE.Vector3()
      .crossVectors(direction, new THREE.Vector3(0, 1, 0))
      .normalize()
      .multiplyScalar(0.3);

    // Fire burst (4 skott, 2 par)
    if (burstStep < burstSize) {
      if (t - lastBurstTime.current > burstInterval) {
        lastBurstTime.current = t;
        setBurstStep((prev) => prev + 1);

        const leftGun = currentPos.clone().add(right.clone().negate());
        const rightGun = currentPos.clone().add(right);

        setLasers((prev) => [
          ...prev,
          {
            id: Date.now() + '_L',
            startPosition: leftGun,
            direction,
            createdAt: t,
          },
          {
            id: Date.now() + '_R',
            startPosition: rightGun,
            direction,
            createdAt: t,
          },
        ]);
      }
    } else {
      if (t - lastBurstTime.current > burstCooldown) {
        setBurstStep(0);
      }
    }

    // Ta bort gamla lasrar
    setLasers((prev) => prev.filter((l) => t - l.createdAt < 3));
  });

  // Träffkontroll från grön laser
  const checkHit = (laserPosition, source) => {
    if (source === 'player' && hitboxRef.current.distanceToPoint(laserPosition) < 0.5) {
      console.log('💥 HIT från spelaren!');
      onHit(ref.current.position.clone()); // Skicka position till explosion
      return true;
    }
    return false;
  };

  return (
    <>
      <primitive object={clonedScene} ref={ref} scale={0.5} />
      {lasers.map((laser) => (
        <LaserRed
          key={laser.id}
          startPosition={laser.startPosition}
          direction={laser.direction}
        />
      ))}
    </>
  );
}

useGLTF.preload('/models/tie.glb');
export default TieFighter;
