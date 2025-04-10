import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar({ startMinimized = false }) {
  const [isOpen, setIsOpen] = useState(!startMinimized);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    // Close the navbar by default on smaller screens
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsOpen(false);
      } else {
        setIsOpen(!startMinimized);
      }
    };

    handleResize(); // Set initial state based on screen size
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [startMinimized]);

  const handleLinkClick = (path) => {
    if (path === '/starwars-cv') {
      setIsOpen(false); // Close the navbar only for StarWarsCV
    }
  };

  return (
    <>
      <div className="hamburger" onClick={toggleMenu}>
        <div className={`bar ${isOpen ? 'open' : ''}`}></div>
        <div className={`bar ${isOpen ? 'open' : ''}`}></div>
        <div className={`bar ${isOpen ? 'open' : ''}`}></div>
      </div>

      <nav className={`side-navbar ${isOpen ? 'open' : ''}`}>
        <h2 className="logo">PEC</h2>
        <ul>
          <li>
            <NavLink to="/" onClick={() => handleLinkClick('/')}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" onClick={() => handleLinkClick('/about')}>
              About Me
            </NavLink>
          </li>
          <li>
            <NavLink to="/skills" onClick={() => handleLinkClick('/skills')}>
              Skills
            </NavLink>
          </li>
          <li>
            <NavLink to="/experience" onClick={() => handleLinkClick('/experience')}>
              Experience
            </NavLink>
          </li>
          <li>
            <NavLink to="/projects" onClick={() => handleLinkClick('/projects')}>
              Projects
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" onClick={() => handleLinkClick('/contact')}>
              Contact
            </NavLink>
          </li>
          <li>
            <NavLink to="/starwars-cv" onClick={() => handleLinkClick('/starwars-cv')}>
              Philip Episode CV
            </NavLink>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Navbar;