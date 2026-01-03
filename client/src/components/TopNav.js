// TopNav.js
import React, { useContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useLocation } from 'react-router-dom';
import { LanguageContext } from '../App';

export default function TopNav() {
  const { language, toggleLanguage, t, theme, toggleTheme } = useContext(LanguageContext);
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const location = useLocation();

  const handleLogin = () => {
    loginWithRedirect({
      appState: {
        returnTo: location.pathname
      }
    });
  };

  return (
    <>
      <div style={{
        position: 'fixed',
        top: '2em',
        right: '2em',
        zIndex: 100,
        display: 'flex',
        gap: '12px',
        alignItems: 'center'
      }}>
        <button
          onClick={toggleTheme}
          className="topnav-btn topnav-theme"
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            border: '3px solid var(--color-black)',
            background: 'var(--color-white)',
            color: 'var(--color-black)',
            fontSize: '16px',
            fontWeight: '900',
            cursor: 'pointer',
            boxShadow: '4px 4px 0 var(--color-black)',
            transition: 'all 0.2s',
            fontFamily: 'var(--font-special)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            transform: 'rotate(2deg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'rotate(0deg) translate(-2px, -2px)';
            e.currentTarget.style.boxShadow = '6px 6px 0 var(--color-black)';
            e.currentTarget.style.background = 'var(--color-cyan)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'rotate(2deg)';
            e.currentTarget.style.boxShadow = '4px 4px 0 var(--color-black)';
            e.currentTarget.style.background = 'var(--color-white)';
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'rotate(0deg) translate(2px, 2px)';
            e.currentTarget.style.boxShadow = '2px 2px 0 var(--color-black)';
          }}
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          )}
        </button>

        <button
          onClick={toggleLanguage}
          className="topnav-btn topnav-lang"
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            border: '3px solid var(--color-black)',
            background: 'var(--color-white)',
            color: 'var(--color-black)',
            fontSize: '16px',
            fontWeight: '900',
            cursor: 'pointer',
            boxShadow: '4px 4px 0 var(--color-black)',
            transition: 'all 0.2s',
            fontFamily: 'var(--font-special)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            transform: 'rotate(-2deg)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'rotate(0deg) translate(-2px, -2px)';
            e.currentTarget.style.boxShadow = '6px 6px 0 var(--color-black)';
            e.currentTarget.style.background = 'var(--color-yellow)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'rotate(-2deg)';
            e.currentTarget.style.boxShadow = '4px 4px 0 var(--color-black)';
            e.currentTarget.style.background = 'var(--color-white)';
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'rotate(0deg) translate(2px, 2px)';
            e.currentTarget.style.boxShadow = '2px 2px 0 var(--color-black)';
          }}
        >
          {language === 'en' ? 'FR' : 'EN'}
        </button>

        <button
          onClick={isAuthenticated
            ? () => logout({ logoutParams: { returnTo: window.location.origin } })
            : handleLogin
          }
          className="topnav-btn topnav-auth"
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            border: '3px solid var(--color-black)',
            background: isAuthenticated ? 'var(--color-red-pink)' : 'var(--color-light-blue)',
            color: 'var(--color-white)',
            fontSize: '16px',
            fontWeight: '900',
            cursor: 'pointer',
            boxShadow: '4px 4px 0 var(--color-black)',
            transition: 'all 0.2s',
            fontFamily: 'var(--font-special)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            transform: 'rotate(2deg)',
            whiteSpace: 'nowrap'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'rotate(0deg) translate(-2px, -2px)';
            e.currentTarget.style.boxShadow = '6px 6px 0 var(--color-black)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'rotate(2deg)';
            e.currentTarget.style.boxShadow = '4px 4px 0 var(--color-black)';
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'rotate(0deg) translate(2px, 2px)';
            e.currentTarget.style.boxShadow = '2px 2px 0 var(--color-black)';
          }}
        >
          {isAuthenticated ? t.nav.logout : t.nav.login}
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="top: 2em"][style*="right: 2em"] {
            top: 2em !important;
            right: 1em !important;
            gap: 6px !important;
          }
          
          .topnav-btn {
            padding: 10px 12px !important;
            font-size: 13px !important;
            letter-spacing: 0.02em !important;
          }
          
          .topnav-lang {
            min-width: 40px !important;
          }
          
          .topnav-auth {
            max-width: 80px !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
          }
        }
      `}</style>
    </>
  );
}