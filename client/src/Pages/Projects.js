import React, { useContext } from 'react';
import { LanguageContext } from '../App';

export default function Projects() {
  const { language } = useContext(LanguageContext);

  const content = {
    en: {
      title: 'My Projects',
      description: 'Showcase your best work here.',
      placeholder: 'Project cards will go here...'
    },
    fr: {
      title: 'Mes Projets',
      description: 'Présentez vos meilleurs travaux ici.',
      placeholder: 'Les projets iront ici...'
    }
  };

  const t = content[language];

  return (
    <div className="page-container projects-page">
      <h1>{t.title}</h1>
      <div className="content-card">
        <p>{t.description}</p>
        <div className="placeholder">{t.placeholder}</div>
      </div>
    </div>
  );
}