import React, { useContext } from 'react';
import { LanguageContext } from '../App';
import '../styles/BottomBar.css';

export default function BottomBar() {
  const { language } = useContext(LanguageContext);

  const content = {
    en: {
      rights: '© 2026 All rights reserved',
      social: 'Connect with me'
    },
    fr: {
      rights: '© 2026 Tous droits réservés',
      social: 'Connectez-vous avec moi'
    }
  };

  const t = content[language];

  return (
    <footer className="bottom-bar">
      <div className="bottom-bar-content">
        <div className="bottom-bar-section">
          <span className="copyright">{t.rights}</span>
        </div>
        <div className="bottom-bar-section social-links">
          <span className="social-label">{t.social}</span>
          <a href="#" className="social-link" aria-label="GitHub">GitHub</a>
          <a href="#" className="social-link" aria-label="LinkedIn">LinkedIn</a>
          <a href="#" className="social-link" aria-label="Twitter">Twitter</a>
        </div>
      </div>
    </footer>
  );
}