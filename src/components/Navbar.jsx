import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <div className="hamburger" onClick={toggleMenu}>
        <div className={`bar ${isOpen ? 'open' : ''}`}></div>
        <div className={`bar ${isOpen ? 'open' : ''}`}></div>
        <div className={`bar ${isOpen ? 'open' : ''}`}></div>
      </div>

      <nav className={`side-navbar ${isOpen ? 'open' : ''}`}>
        <h2 className="logo">PEC</h2>
        <ul onClick={() => setIsOpen(false)}>
          <li><NavLink to="/">Home</NavLink></li>
          <li><NavLink to="/about">Om mig</NavLink></li>
          <li><NavLink to="/skills">Skills</NavLink></li>
          <li><NavLink to="/experience">Erfarenhet</NavLink></li>
          <li><NavLink to="/projects">Projekt</NavLink></li>
          <li><NavLink to="/contact">Kontakt</NavLink></li>
        </ul>
      </nav>
    </>
  );
}

export default Navbar;
