import React, { useContext } from 'react';
import { LanguageContext } from '../App';

export default function Resume({ backendData }) {
  const { language } = useContext(LanguageContext);

  const content = {
    en: {
      title: 'Resume / CV',
      download: 'Download Resume',
      viewOnline: 'View Resume Online',
      description: 'Add your resume here.'
    },
    fr: {
      title: 'CV',
      download: 'Télécharger le CV',
      viewOnline: 'Voir le CV en Ligne',
      description: 'Ajoutez votre CV ici.'
    }
  };

  const t = content[language];

  return (
    <div className="page-container resume-page">
      <h1>{t.title}</h1>
      <div className="content-card">
        <p>{t.description}</p>
        <div className="button-group">
          <button className="btn-primary">{t.download}</button>
          <button className="btn-secondary">{t.viewOnline}</button>
        </div>
      </div>
      {backendData.users && (
        <div className="content-card">
          {backendData.users.map((user, i) => (
            <p key={i}>{user}</p>
          ))}
        </div>
      )}
    </div>
  );
}