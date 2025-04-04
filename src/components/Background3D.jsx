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
  const [isSpawning, setIsSpawning] = useState(false);
  const checkHitFns = useRef({});
  const location = useLocation();
  const spawnIntervalRef = useRef(null);

  const MAX_FIGHTERS = 10;

  const handleHit = (id, position) => {
    delete checkHitFns.current[id];
    setFighters((prev) => prev.filter((f) => f.id !== id));
    setExplosions((prev) => [...prev, { id, position }]);
  };

  const registerCheckHit = (id, fn) => {
    checkHitFns.current[id] = fn;
  };

  const clearFighters = () => {
    setFighters([]);
    checkHitFns.current = {};
    setExplosions([]);
    setIsSpawning(false);
    clearInterval(spawnIntervalRef.current);
  };

  const toggleSpawn = () => {
    if (isSpawning) {
      setIsSpawning(false);
      clearInterval(spawnIntervalRef.current);
    } else {
      setIsSpawning(true);
      spawnIntervalRef.current = setInterval(() => {
        setFighters((prev) => {
          if (prev.length >= MAX_FIGHTERS) return prev;
          const id = Date.now() + Math.random();
          return [...prev, { id }];
        });
      }, 1000); // Spawn en ny varje sekund
    }
  };

  // Rensa om man navigerar bort
  useEffect(() => {
    return () => clearFighters();
  }, [location.pathname]);

  return (
    <>
      <div className="fighter-ui">
        <button onClick={toggleSpawn} className="spawn-button">
          {isSpawning ? 'Stop Spawning' : 'TIE Fighter Invasion!'}
        </button>
        <button onClick={clearFighters} className="clear-button">
          Clear All
        </button>
        <div className="counter">Active: {fighters.length}/10</div>
      </div>

      <Canvas
        style={{
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: -1, // Se till att Canvas ligger under andra element
            width: '100%',
            height: '100%',
            pointerEvents: 'auto', // Tillåt Canvas att fånga musinteraktioner
        }}
        >
        <ambientLight intensity={0.3} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
        <LaserShooter
            active={fighters.length > 0}
            tieFighters={Object.values(checkHitFns.current)}
        />
        <OrbitControls
            enableZoom={false}
            autoRotate={true} // Aktivera automatisk rotation
            autoRotateSpeed={0.2}
            enablePan={true} // Tillåt panorering
            enableRotate={true} // Tillåt manuell rotation
            target={[0, 0, 0]} // Fokuspunkt för rotation
        />

        {fighters.map((fighter) => (
            <TieFighter
            key={fighter.id}
            id={fighter.id}
            onHit={(pos) => handleHit(fighter.id, pos)}
            registerCheckHit={(fn) => registerCheckHit(fighter.id, fn)}
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
