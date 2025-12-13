import React, { useEffect, useState, createContext } from "react";
import { useAuth0 } from '@auth0/auth0-react';
import {
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import BubbleMenu from "./components/BubbleMenu";
import BackgroundGradient from "./components/BackgroundGradient";
import TopNav from "./components/TopNav";
import BottomBar from "./components/BottomBar";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Projects from "./Pages/Projects";
import Resume from "./Pages/Resume";
import Comments from "./Pages/Comments";
import "./styles/animations.css";

export const LanguageContext = createContext();

//https://youtu.be/w3vs4a03y3I?si=cJiFQ1nQtIqFaHwx GOATED VIDEO
//run frontend: npm start
//run backend: npm run dev

const translations = {
  en: {
    nav: {
      home: 'home',
      about: 'about',
      projects: 'projects',
      resume: 'resume',
      comments: 'comments',
      login: 'login',
      logout: 'logout'
    }
  },
  fr: {
    nav: {
      home: 'accueil',
      about: 'à propos',
      projects: 'projets',
      resume: 'cv',
      comments: 'commentaires',
      login: 'connexion',
      logout: 'déconnexion'
    }
  }
};

function App() {
  const [backendData, setBackendData] = useState([{}]);
  const [scrollY, setScrollY] = useState(0);
  const [language, setLanguage] = useState('en');
  
  const navigate = useNavigate();
  const { isLoading } = useAuth0();

  const t = translations[language];

  const menuItems = [
    {
      label: t.nav.home,
      ariaLabel: t.nav.home,
      rotation: -8,
      hoverStyles: { bgColor: '#4CC9F0', textColor: '#ffffff' },
      path: '/'
    },
    {
      label: t.nav.about,
      ariaLabel: t.nav.about,
      rotation: 8,
      hoverStyles: { bgColor: '#4895EF', textColor: '#ffffff' },
      path: '/about'
    },
    {
      label: t.nav.projects,
      ariaLabel: t.nav.projects,
      rotation: -8,
      hoverStyles: { bgColor: '#7209B7', textColor: '#ffffff' },
      path: '/projects'
    },
    {
      label: t.nav.resume,
      ariaLabel: t.nav.resume,
      rotation: 8,
      hoverStyles: { bgColor: '#F72585', textColor: '#ffffff' },
      path: '/resume'
    },
    {
      label: t.nav.comments,
      ariaLabel: t.nav.comments,
      rotation: -8,
      hoverStyles: { bgColor: '#FF006E', textColor: '#ffffff' },
      path: '/comments'
    }
  ];

  useEffect(() => {
    fetch('/api')
      .then(response => response.json())
      .then(data => setBackendData(data))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMenuItemClick = (item) => {
    navigate(item.path);
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'fr' : 'en');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <LanguageContext.Provider value={{ language, t, toggleLanguage }}>
      <div style={{
        minHeight: '100vh',
        position: 'relative',
      }}>
        <BackgroundGradient scrollY={scrollY} />
        
        <TopNav />
        
        <BubbleMenu
          items={menuItems}
          menuAriaLabel="Toggle navigation"
          menuBg="rgba(255, 255, 255, 0.9)"
          menuContentColor="#0288D1"
          useFixedPosition={true}
          animationEase="back.out(1.5)"
          animationDuration={0.5}
          staggerDelay={0.12}
          onItemClick={handleMenuItemClick}
        />

        <Routes>
          <Route path="/" element={<Home backendData={backendData} />} />
          <Route path="/about" element={<About backendData={backendData} />} />
          <Route path="/projects" element={<Projects backendData={backendData} />} />
          <Route path="/resume" element={<Resume backendData={backendData} />} />
          <Route path="/comments" element={<Comments backendData={backendData} />} />
        </Routes>

        <BottomBar />
      </div>
    </LanguageContext.Provider>
  );
}

export default App;