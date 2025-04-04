import '../styles/Home.css';
import profileImage from '../assets/avatar.jpg';
import { TypeAnimation } from 'react-type-animation';
import { motion } from 'framer-motion';
import Background3D from '../components/Background3D';
import { useLocation } from 'react-router-dom'; // 👈 Lägg till

function Home() {
  const location = useLocation(); // 👈 Hämta platsen

  return (
    <>
      {location.pathname === '/' && <Background3D />}

      <div className="home-container">
        <motion.img
          src={profileImage}
          alt="Philip Eriksson"
          className="profile-image"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />

        <h1>Philip Eriksson</h1>

        <TypeAnimation
          sequence={[
            'Software Developer',
            2000,
            'React Specialist',
            2000,
            'Data Integrations Expert',
            2000,
            'CRM & Profisee Support',
            2000,
            'C# & .NET Developer',
            2000,
            'Profisee MDM Consultant',
            2000,
            'BI & Power BI Enthusiast',
            2000,
            'Loves Clean Code & Design',
            2000,
          ]}
          wrapper="span"
          speed={50}
          repeat={Infinity}
          className="typewriter-text"
        />

        <div className="cta-buttons">
          <a href="/cv/Philip_Ericsson_CV.pdf" className="btn" download>
            Ladda ner CV
          </a>
          <a
            href="https://github.com/PECDigitalSolutions"
            className="btn"
            target="_blank"
            rel="noreferrer"
          >
            GitHub-profil
          </a>
        </div>

        <div className="socials">
          <a
            href="https://github.com/PECDigitalSolutions"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/philip-eriksson-b2234824b/"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
          <a href="mailto:philip.backgard@gmail.com?subject=Jobbförfrågan från din CV-sida">
            E-post
          </a>
        </div>
      </div>

      <div className="attribution">
        Tie fighter by{' '}
        <a
          href="https://poly.pizza/m/aba7TBlKyJE"
          target="_blank"
          rel="noreferrer"
        >
          Alberto Calvo
        </a>{' '}
        [
        <a
          href="https://creativecommons.org/licenses/by/3.0/"
          target="_blank"
          rel="noreferrer"
        >
          CC-BY
        </a>
        ]
      </div>
    </>
  );
}

export default Home;
