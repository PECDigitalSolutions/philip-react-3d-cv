import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Skills from './pages/Skills';
import Experience from './pages/Experience';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import StarWarsCV from './pages/StarWarsCV';

function App() {
  return (
    <>
      <Routes>
        <Route path="/starwars-cv" element={<Navbar startMinimized={true} />} />
        <Route path="*" element={<Navbar />} />
      </Routes>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/starwars-cv" element={<StarWarsCV />} />
      </Routes>
    </>
  );
}

export default App;