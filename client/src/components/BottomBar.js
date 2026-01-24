// BottomBar.js
import React, { useContext, useEffect, useState } from 'react';
import { LanguageContext } from '../App';
import '../styles/BottomBar.css';

export default function BottomBar({ show, instantHide }) {
  const { language } = useContext(LanguageContext);
  const currentYear = new Date().getFullYear();
  const [contactInfo, setContactInfo] = useState(null);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const res = await fetch(`/api/content/contact_info?lang=${language}`);
        const data = await res.json();
        if (!data.useClientFallback) {
          setContactInfo(data);
        }
      } catch (err) {
        console.error('Error fetching contact info:', err);
      }
    };
    fetchContactInfo();
  }, [language]);

  const content = {
    en: {
      rights: `© ${currentYear} All rights reserved`,
      social: 'Connect with me'
    },
    fr: {
      rights: `© ${currentYear} Tous droits réservés`,
      social: 'Connectez-vous avec moi'
    }
  };

  const t = content[language];

  return (
    <footer className={`bottom-bar ${show ? 'visible' : 'hidden'} ${instantHide ? 'instant-hide' : ''}`}>
      <div className="bottom-bar-content">
        <div className="bottom-bar-section">
          <span className="copyright">{t.rights}</span>
        </div>
        <div className="bottom-bar-section social-links">
          <span className="social-label">{t.social}</span>
          {contactInfo?.socials?.github && (
            <a href={contactInfo.socials.github} className="social-link" aria-label="GitHub" target="_blank" rel="noopener noreferrer">GitHub</a>
          )}
          {contactInfo?.socials?.linkedin && (
            <a href={contactInfo.socials.linkedin} className="social-link" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          )}
          {contactInfo?.socials?.twitter && (
            <a href={contactInfo.socials.twitter} className="social-link" aria-label="Twitter" target="_blank" rel="noopener noreferrer">Twitter</a>
          )}
          {!contactInfo?.socials && (
            <>
              <a href="#" className="social-link" aria-label="GitHub">GitHub</a>
              <a href="#" className="social-link" aria-label="LinkedIn">LinkedIn</a>
              <a href="#" className="social-link" aria-label="Twitter">Twitter</a>
            </>
          )}
        </div>
      </div>
    </footer>
  );
}
