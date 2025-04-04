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

  // ✨ Nytt: styr när vi är i "inkommande fas"
  const [isApproaching, setIsApproaching] = useState(true);
  const [approachProgress, setApproachProgress] = useState(0); // 0 → 1

  const burstInterval = 0.15;
  const burstSize = 4;
  const burstCooldown = 2;

  // 🔄 För omloppsrörelse
  const angleOffset = useRef(Math.random() * Math.PI * 2); // Slumpad vinkelstart
  const radius = useRef(15 + Math.random() * 15);            // Slumpad radie
  const verticalOffset = useRef((Math.random() - 0.5) * 4); // Slumpad höjd
  const angularSpeed = 0.2;

  // ✨ Startposition långt borta
  const entryPoint = useRef(new THREE.Vector3(
    (Math.random() - 0.5) * 40,
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 40
  ));

  useEffect(() => {
    // När komponenten mountas eller id ändras
    setLasers([]);
    setBurstStep(0);
    lastBurstTime.current = 0;
    setIsApproaching(true);
    setApproachProgress(0);
  }, [id]);

  // Registrera träff-funktion
  useEffect(() => {
    if (registerCheckHit) {
      registerCheckHit(checkHit);
    }
  }, [registerCheckHit]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const angle = t * angularSpeed + angleOffset.current;

    // 🧭 Målposition i omloppsbana (målet vi ska flyga till)
    const orbitX = Math.cos(angle) * radius.current;
    const orbitY = verticalOffset.current + Math.sin(angle * 2) * 1.5;
    const orbitZ = Math.sin(angle) * radius.current;
    const targetOrbitPos = new THREE.Vector3(orbitX, orbitY, orbitZ);

    if (!ref.current) return;

    // ✈️ Om vi fortfarande håller på att flyga in
    if (isApproaching) {
      const newProgress = Math.min(1, approachProgress + 0.01);
      setApproachProgress(newProgress);

      // Lerpa från entry till målposition
      const currentPos = new THREE.Vector3().lerpVectors(
        entryPoint.current,
        targetOrbitPos,
        newProgress
      );

      ref.current.position.copy(currentPos);
      ref.current.lookAt(targetOrbitPos);

      if (newProgress >= 1) {
        setIsApproaching(false); // Klart att flyga in!
      }

      return; // Stoppa vidare uppdatering tills vi är framme
    }

    // ✨ Normal omloppsrörelse
    const nextAngle = angle + 0.01;
    const nextX = Math.cos(nextAngle) * radius.current;
    const nextY = verticalOffset.current + Math.sin(nextAngle * 2) * 1.5;
    const nextZ = Math.sin(nextAngle) * radius.current;

    const currentPos = targetOrbitPos;
    const nextPos = new THREE.Vector3(nextX, nextY, nextZ);
    const direction = nextPos.clone().sub(currentPos).normalize();

    ref.current.position.copy(currentPos);
    ref.current.lookAt(nextPos);
    ref.current.rotation.z = Math.sin(t * 2) * 0.2;

    // 🔲 Uppdatera hitbox för träffdetektering
    hitboxRef.current.setFromObject(ref.current);

    // 🔫 Beräkna vänster/höger vinge för laser
    const right = new THREE.Vector3()
      .crossVectors(direction, new THREE.Vector3(0, 1, 0))
      .normalize()
      .multiplyScalar(0.3);

    // 🔫 Laser burst
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
        setBurstStep(0); // Börja om ny burst
      }
    }

    // ⏱️ Ta bort gamla lasrar
    setLasers((prev) => prev.filter((l) => t - l.createdAt < 3));
  });

  // 🎯 Träffkontroll från spelarens gröna laser
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
