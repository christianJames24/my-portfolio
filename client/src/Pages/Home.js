import React, { useContext, useEffect, useState } from 'react';
import ThreeD from '../ThreeD';
import { LanguageContext } from '../App';

export default function Home({ backendData }) {
  const { language } = useContext(LanguageContext);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const content = {
    en: {
      title: 'Welcome to My Portfolio',
      subtitle: 'Building amazing digital experiences'
    },
    fr: {
      title: 'Bienvenue sur Mon Portfolio',
      subtitle: 'Créer des expériences numériques incroyables'
    }
  };

  const t = content[language];

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const cowStyles = {
    pointerEvents: 'none',
    position: 'fixed',
    bottom: isMobile ? '-10%' : '0',
    right: isMobile ? '-20%' : '0',
    width: isMobile ? '75vw' : '50vw',
    height: isMobile ? '100vh' : '80vh',
    zIndex: 1,
    opacity: isMobile ? 0.3 : 1,
    transform: isMobile ? 'scale(0.7)' : 'scale(1)',
    transition: 'all 0.3s ease'
  };

  return (
    <div style={{
      position: 'relative',
      zIndex: 10,
      padding: '40px',
      maxWidth: '800px',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}>
      <h1 style={{
        fontSize: 'clamp(48px, 8vw, 96px)',
        color: '#0288D1',
        textShadow: '0 2px 4px rgba(255, 255, 255, 0.5)',
        margin: '0 0 20px 0',
        lineHeight: '1.2',
        position: 'relative',
        zIndex: 2
      }}>
        {t.title}
      </h1>
      
      <p style={{
        fontSize: 'clamp(18px, 3vw, 24px)',
        color: '#0288D1',
        fontWeight: '300',
        margin: '0',
        position: 'relative',
        zIndex: 2
      }}>
        {t.subtitle}
      </p>
      
      <div style={cowStyles}>
        <ThreeD />
      </div>
    </div>
  );
}