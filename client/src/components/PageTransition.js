import React, { useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { LanguageContext } from '../App';

export default function PageNavigation() {
  const location = useLocation();
  const { language, debouncedNavigate } = useContext(LanguageContext);
  const [hoveredButton, setHoveredButton] = useState(null);

  const content = {
    en: {
      prev: 'Previous',
      next: 'Next',
      pages: {
        home: 'Home',
        about: 'About',
        projects: 'Projects',
        resume: 'Resume',
        comments: 'Comments'
      }
    },
    fr: {
      prev: 'Précédent',
      next: 'Suivant',
      pages: {
        home: 'Accueil',
        about: 'À Propos',
        projects: 'Projets',
        resume: 'CV',
        comments: 'Commentaires'
      }
    }
  };

  const t = content[language];

  const pages = [
    { path: '/', name: 'home' },
    { path: '/about', name: 'about' },
    { path: '/projects', name: 'projects' },
    { path: '/resume', name: 'resume' },
    { path: '/comments', name: 'comments' }
  ];

  const currentIndex = pages.findIndex(page => page.path === location.pathname);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < pages.length - 1;
  const prevPage = hasPrev ? pages[currentIndex - 1] : null;
  const nextPage = hasNext ? pages[currentIndex + 1] : null;

  const handlePrev = () => {
    if (hasPrev) {
      debouncedNavigate(prevPage.path);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      debouncedNavigate(nextPage.path);
    }
  };

  const buttonStyle = {
    position: 'fixed',
    top: '50%',
    transform: 'translateY(-50%)',
    padding: '20px',
    border: '4px solid #000000',
    background: '#ffffff',
    cursor: 'pointer',
    fontSize: '32px',
    fontWeight: '900',
    boxShadow: '8px 8px 0 #000000',
    transition: 'all 0.2s',
    zIndex: 50,
    color: '#000000',
    width: '70px',
    height: '70px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const labelStyle = (isVisible) => ({
    position: 'absolute',
    background: '#000000',
    color: '#ffffff',
    padding: '12px 20px',
    border: '3px solid #000000',
    boxShadow: '6px 6px 0 #ffff00',
    fontSize: '16px',
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    whiteSpace: 'nowrap',
    opacity: isVisible ? 1 : 0,
    pointerEvents: 'none',
    transition: 'opacity 0.2s, transform 0.2s',
    transform: isVisible ? 'translateY(-50%) scale(1)' : 'translateY(-50%) scale(0.9)',
    top: '50%',
  });

  return (
    <>
      {/* Previous Button - Only render if there's a previous page */}
      {hasPrev && (
        <div style={{ position: 'fixed', left: '40px', top: '50%', transform: 'translateY(-50%)', zIndex: 50 }}>
          <button
            onClick={handlePrev}
            aria-label={`${t.prev}: ${t.pages[prevPage.name]}`}
            style={{
              ...buttonStyle,
              position: 'relative',
              transform: 'rotate(-3deg)',
            }}
            onMouseEnter={(e) => {
              setHoveredButton('prev');
              e.currentTarget.style.transform = 'rotate(0deg) translate(-4px, 0)';
              e.currentTarget.style.boxShadow = '12px 12px 0 #000000';
              e.currentTarget.style.background = '#00d4ff';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              setHoveredButton(null);
              e.currentTarget.style.transform = 'rotate(-3deg)';
              e.currentTarget.style.boxShadow = '8px 8px 0 #000000';
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.color = '#000000';
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'translate(2px, 2px)';
              e.currentTarget.style.boxShadow = '4px 4px 0 #000000';
            }}
          >
            ←
          </button>
          
          {/* Label for previous page - appears to the RIGHT */}
          <div style={{
            ...labelStyle(hoveredButton === 'prev'),
            left: 'calc(100% + 20px)',
          }}>
            {t.pages[prevPage.name]}
          </div>
        </div>
      )}

      {/* Next Button - Only render if there's a next page */}
      {hasNext && (
        <div style={{ position: 'fixed', right: '40px', top: '50%', transform: 'translateY(-50%)', zIndex: 50 }}>
          <button
            onClick={handleNext}
            aria-label={`${t.next}: ${t.pages[nextPage.name]}`}
            style={{
              ...buttonStyle,
              position: 'relative',
              transform: 'rotate(3deg)',
            }}
            onMouseEnter={(e) => {
              setHoveredButton('next');
              e.currentTarget.style.transform = 'rotate(0deg) translate(4px, 0)';
              e.currentTarget.style.boxShadow = '12px 12px 0 #000000';
              e.currentTarget.style.background = '#ff0055';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              setHoveredButton(null);
              e.currentTarget.style.transform = 'rotate(3deg)';
              e.currentTarget.style.boxShadow = '8px 8px 0 #000000';
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.color = '#000000';
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'translate(2px, 2px)';
              e.currentTarget.style.boxShadow = '4px 4px 0 #000000';
            }}
          >
            →
          </button>
          
          {/* Label for next page - appears to the LEFT */}
          <div style={{
            ...labelStyle(hoveredButton === 'next'),
            right: 'calc(100% + 20px)',
          }}>
            {t.pages[nextPage.name]}
          </div>
        </div>
      )}

      {/* Mobile hide styles */}
      <style>{`
        @media (max-width: 768px) {
          div[style*="fixed"] button[aria-label*="${t.prev}"],
          div[style*="fixed"] button[aria-label*="${t.next}"] {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}