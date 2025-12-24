import React, { useEffect, useState, createContext } from "react";
import { useAuth0 } from '@auth0/auth0-react';
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import BubbleMenu from "./components/BubbleMenu";
import BackgroundGradient from "./components/BackgroundGradient";
import TopNav from "./components/TopNav";
import BottomBar from "./components/BottomBar";
import PageNavigation from "./components/PageNavigation";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Projects from "./Pages/Projects";
import Resume from "./Pages/Resume";
import Comments from "./Pages/Comments";
import "./styles/animations.css";
import "./styles/pageTransitions.css";

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

const pages = [
  { path: '/', name: 'home' },
  { path: '/about', name: 'about' },
  { path: '/projects', name: 'projects' },
  { path: '/resume', name: 'resume' },
  { path: '/comments', name: 'comments' }
];

function App() {
  const [backendData, setBackendData] = useState([{}]);
  const [scrollY, setScrollY] = useState(0);
  const [language, setLanguage] = useState('en');
  const [displayLocation, setDisplayLocation] = useState(null);
  const [transitionStage, setTransitionStage] = useState('idle');
  const [direction, setDirection] = useState('forward');
  
  const navigate = useNavigate();
  const location = useLocation();
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

  useEffect(() => {
    if (displayLocation === null) {
      setDisplayLocation(location);
      setTransitionStage('idle');
      return;
    }

    if (location.pathname !== displayLocation.pathname) {
      const currentIndex = pages.findIndex(p => p.path === displayLocation.pathname);
      const nextIndex = pages.findIndex(p => p.path === location.pathname);
      
      const isForward = nextIndex > currentIndex;
      setDirection(isForward ? 'forward' : 'backward');
      
      setTransitionStage('exiting');
    }
  }, [location, displayLocation]);

  const handleTransitionEnd = () => {
    if (transitionStage === 'exiting') {
      setDisplayLocation(location);
      setTransitionStage('entering');
    } else if (transitionStage === 'entering') {
      setTransitionStage('idle');
    }
  };

  const handleMenuItemClick = (item) => {
    navigate(item.path);
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'fr' : 'en');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const getTransitionClass = () => {
    if (transitionStage === 'exiting') {
      return direction === 'forward' ? 'page-transition-exit-forward' : 'page-transition-exit-backward';
    }
    if (transitionStage === 'entering') {
      return direction === 'forward' ? 'page-transition-enter-forward' : 'page-transition-enter-backward';
    }
    return '';
  };

  const renderPage = (pathname) => {
    switch(pathname) {
      case '/':
        return <Home backendData={backendData} />;
      case '/about':
        return <About backendData={backendData} />;
      case '/projects':
        return <Projects backendData={backendData} />;
      case '/resume':
        return <Resume backendData={backendData} />;
      case '/comments':
        return <Comments backendData={backendData} />;
      default:
        return <Home backendData={backendData} />;
    }
  };

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

        <PageNavigation isTransitioning={transitionStage !== 'idle'} />

        <div className="page-transition-wrapper">
          <div 
            className={`page-transition-content ${transitionStage !== 'idle' ? 'transitioning' : ''} ${getTransitionClass()}`}
            onAnimationEnd={handleTransitionEnd}
          >
            {displayLocation && renderPage(displayLocation.pathname)}
          </div>
        </div>

        <BottomBar />
      </div>
    </LanguageContext.Provider>
  );
}

export default App;