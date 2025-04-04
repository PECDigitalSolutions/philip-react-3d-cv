import { useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import Laser from './Laser';

function LaserShooter({ active, tieFighters }) {
  const { camera } = useThree();
  const [lasers, setLasers] = useState([]);
  const mouseDownPos = useRef(null);

  useEffect(() => {
    const handleMouseDown = (e) => {
      mouseDownPos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = (e) => {
      const dx = Math.abs(e.clientX - mouseDownPos.current.x);
      const dy = Math.abs(e.clientY - mouseDownPos.current.y);
      const dragThreshold = 5;

      if (dx > dragThreshold || dy > dragThreshold || !active) return;

      const mouse = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1 + 0.02,
        -(e.clientY / window.innerHeight) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const targetPoint = new THREE.Vector3();
      raycaster.ray.at(100, targetPoint);

      const offset = new THREE.Vector3(-1, -1, 0);
      const startPosition = offset.applyMatrix4(camera.matrixWorld);
      const direction = targetPoint.clone().sub(startPosition).normalize();

      setLasers((prev) => [
        ...prev,
        { id: Date.now(), direction, startPosition }
      ]);
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [camera, active]);

  return (
    <>
      {lasers.map((laser) => (
        <Laser
          key={laser.id}
          direction={laser.direction}
          startPosition={laser.startPosition}
          onHit={(pos, source) => {
            for (const check of tieFighters) {
              if (check(pos, source)) return true;
            }
            return false;
          }}
          onOutOfBounds={() =>
            setLasers((prev) => prev.filter((l) => l.id !== laser.id))
          }
        />
      ))}
    </>
  );
}

export default LaserShooter;