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
      {/* Accent line */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '40px',
        width: '120px',
        height: '8px',
        background: '#ff0055',
        transform: 'rotate(-3deg)',
        marginBottom: '40px'
      }} />
      
      <h1 style={{
        fontSize: 'clamp(64px, 10vw, 140px)',
        color: '#000000',
        margin: '0 0 20px 0',
        fontWeight: '900',
        letterSpacing: '-0.04em',
        lineHeight: '0.9',
        textTransform: 'uppercase',
        transform: 'rotate(-1deg)',
        position: 'relative',
        zIndex: 2
      }}>
        {t.title}
      </h1>
      
      <p style={{
        fontSize: 'clamp(20px, 3vw, 32px)',
        color: '#000000',
        fontWeight: '400',
        margin: '0',
        position: 'relative',
        zIndex: 2,
        background: '#ffff00',
        display: 'inline-block',
        padding: '8px 16px',
        transform: 'rotate(1deg)',
        border: '2px solid #000000',
        boxShadow: '6px 6px 0 #000000',
        maxWidth: 'fit-content'
      }}>
        {t.subtitle}
      </p>
    </div>
  );
}