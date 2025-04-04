import { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { useLocation } from 'react-router-dom';
import LaserShooter from './LaserShooter';
import TieFighter from './TieFighter';
import Explosion from './Explosion';
import '../styles/Background3D.css';

function Background3D() {
  const [fighters, setFighters] = useState([]);
  const [explosions, setExplosions] = useState([]);
  const checkHitFns = useRef({}); // Använd useRef för att lagra registrerade funktioner
  const location = useLocation();

  const spawnFighter = () => {
    if (fighters.length >= 10) return;
    const id = Date.now() + Math.random();
    setFighters((prev) => [...prev, { id }]);
  };

  const clearFighters = () => {
    setFighters([]);
    checkHitFns.current = {}; // Rensa registrerade funktioner
    setExplosions([]);
  };

  const handleHit = (id, position) => {
    delete checkHitFns.current[id]; // Ta bort funktionen från ref
    setFighters((prev) => prev.filter((f) => f.id !== id));
    setExplosions((prev) => [...prev, { id, position }]);
  };

  // 🧼 Navigera bort = rensa
  useEffect(() => {
    return () => {
      clearFighters(); // Rensa när komponenten avmonteras
    };
  }, [location.pathname]);

  return (
    <>
      <div className="fighter-ui">
        <button onClick={spawnFighter} className="spawn-button" disabled={fighters.length >= 10}>
          Spawn Tie Fighter
        </button>
        <button onClick={clearFighters} className="clear-button">Clear All</button>
        <div className="counter">Active: {fighters.length}/10</div>
      </div>

      <Canvas
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: -1,
          width: '100%',
          height: '100%',
        }}
      >
        <ambientLight intensity={0.3} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
        <LaserShooter
          active={fighters.length > 0}
          tieFighters={Object.values(checkHitFns.current)} // Skicka registrerade funktioner
        />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.2} />

        {fighters.map((fighter) => (
          <TieFighter
            key={fighter.id}
            id={fighter.id}
            onHit={(pos) => handleHit(fighter.id, pos)}
            registerCheckHit={(fn) => {
              checkHitFns.current[fighter.id] = fn; // Registrera funktionen i ref
            }}
          />
        ))}

        {explosions.map((explosion) => (
          <Explosion
            key={explosion.id}
            position={explosion.position}
            onComplete={() =>
              setExplosions((prev) =>
                prev.filter((e) => e.id !== explosion.id)
              )
            }
          />
        ))}
      </Canvas>
    </>
  );
}

export default Background3D;