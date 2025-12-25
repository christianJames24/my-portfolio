import React, { useContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useLocation } from 'react-router-dom';
import { LanguageContext } from '../App';

export default function TopNav() {
  const { language, toggleLanguage, t } = useContext(LanguageContext);
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
          onClick={toggleLanguage}
          className="topnav-btn topnav-lang"
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            border: '3px solid #000000',
            background: '#ffffff',
            color: '#000000',
            fontSize: '16px',
            fontWeight: '900',
            cursor: 'pointer',
            boxShadow: '4px 4px 0 #000000',
            transition: 'all 0.2s',
            fontFamily: 'var(--font-special)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            transform: 'rotate(-2deg)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'rotate(0deg) translate(-2px, -2px)';
            e.currentTarget.style.boxShadow = '6px 6px 0 #000000';
            e.currentTarget.style.background = '#ffff00';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'rotate(-2deg)';
            e.currentTarget.style.boxShadow = '4px 4px 0 #000000';
            e.currentTarget.style.background = '#ffffff';
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'rotate(0deg) translate(2px, 2px)';
            e.currentTarget.style.boxShadow = '2px 2px 0 #000000';
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
            border: '3px solid #000000',
            background: isAuthenticated ? '#ff0055' : '#00d4ff',
            color: '#ffffff',
            fontSize: '16px',
            fontWeight: '900',
            cursor: 'pointer',
            boxShadow: '4px 4px 0 #000000',
            transition: 'all 0.2s',
            fontFamily: 'var(--font-special)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            transform: 'rotate(2deg)',
            whiteSpace: 'nowrap'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'rotate(0deg) translate(-2px, -2px)';
            e.currentTarget.style.boxShadow = '6px 6px 0 #000000';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'rotate(2deg)';
            e.currentTarget.style.boxShadow = '4px 4px 0 #000000';
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'rotate(0deg) translate(2px, 2px)';
            e.currentTarget.style.boxShadow = '2px 2px 0 #000000';
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