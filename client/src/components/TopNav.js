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
        style={{
          padding: '8px 16px',
          borderRadius: '24px',
          border: 'none',
          background: 'rgba(255, 255, 255, 0.9)',
          color: '#0288D1',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
          transition: 'all 0.2s',
          fontFamily: 'Comfortaa, sans-serif'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.12)';
        }}
      >
        {language === 'en' ? 'FR' : 'EN'}
      </button>

      <button
        onClick={isAuthenticated 
          ? () => logout({ logoutParams: { returnTo: window.location.origin } })
          : handleLogin
        }
        style={{
          padding: '8px 16px',
          borderRadius: '24px',
          border: 'none',
          background: isAuthenticated ? 'rgba(239, 68, 68, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          color: isAuthenticated ? '#ffffff' : '#0288D1',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
          transition: 'all 0.2s',
          fontFamily: 'Comfortaa, sans-serif'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.12)';
        }}
      >
        {isAuthenticated ? t.nav.logout : t.nav.login}
      </button>
    </div>
  );
}