import React, { useContext, useEffect } from 'react';
import { LanguageContext } from '../App';

export default function Home({ backendData }) {
  const { language } = useContext(LanguageContext);

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

  return (
    <div className="home-container" style={{
      position: 'relative',
      zIndex: 10,
      padding: '20px',
      maxWidth: '800px',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}>
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '20px',
        width: 'clamp(60px, 15vw, 120px)',
        height: 'clamp(6px, 1.5vw, 8px)',
        background: '#ff0055',
        transform: 'rotate(-3deg)',
        marginBottom: '40px'
      }} />
      
      <h1>
        {t.title}
      </h1>
      
      <p style={{
        fontSize: 'clamp(16px, 3vw, 32px)',
        color: '#000000',
        fontWeight: '400',
        margin: '0',
        position: 'relative',
        zIndex: 2,
        background: '#ffff00',
        display: 'inline-block',
        padding: 'clamp(6px, 1.5vw, 8px) clamp(12px, 3vw, 16px)',
        transform: 'rotate(1deg)',
        border: '2px solid #000000',
        boxShadow: 'clamp(4px, 1vw, 6px) clamp(4px, 1vw, 6px) 0 #000000',
        maxWidth: 'fit-content',
        wordWrap: 'break-word',
        overflowWrap: 'break-word'
      }}>
        {t.subtitle}
      </p>

      <style>{`
        .home-container {
          margin-left: 0;
        }
        
        @media (min-width: 768px) {
          .home-container {
            margin-left: 20px;
          }
        }
      `}</style>
    </div>
  );
}