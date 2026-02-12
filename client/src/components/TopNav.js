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
      <div
        className="topnav-buttons"
        style={{
          position: 'fixed',
          top: '2em',
          right: '2em',
          zIndex: 100,
          display: 'flex',
          gap: '12px',
          alignItems: 'center'
        }}
      >
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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" />
              <circle cx="19" cy="5" r="2" fill="currentColor" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="4" />
              <rect x="11" y="1" width="2" height="4" rx="1" />
              <rect x="11" y="19" width="2" height="4" rx="1" />
              <rect x="19" y="11" width="4" height="2" rx="1" />
              <rect x="1" y="11" width="4" height="2" rx="1" />
              <rect x="17.5" y="4.1" width="2" height="4" rx="1" transform="rotate(45 18.5 6.1)" />
              <rect x="4.5" y="15.9" width="2" height="4" rx="1" transform="rotate(45 5.5 17.9)" />
              <rect x="15.9" y="17.5" width="4" height="2" rx="1" transform="rotate(45 17.9 18.5)" />
              <rect x="4.1" y="4.5" width="4" height="2" rx="1" transform="rotate(45 6.1 5.5)" />
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
      </div >

      <style>{`
        @media (min-width: 1100px) {
          .topnav-buttons {
            display: none !important;
          }
        }

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