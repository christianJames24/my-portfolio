import React, { useContext, useEffect, useState } from 'react';
import { LanguageContext } from '../App';

export default function Projects() {
  const { language } = useContext(LanguageContext);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch(
      process.env.NODE_ENV === "production"
        ? "https://YOUR-BACKEND-URL/api/projects"
        : "http://localhost:8080/api/projects"
    )
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error(err));
  }, []);

  const content = {
    en: {
      title: 'My Projects',
      description: 'Showcase your best work here.',
      empty: 'No projects loaded.'
    },
    fr: {
      title: 'Mes Projets',
      description: 'Présentez vos meilleurs travaux ici.',
      empty: 'Aucun projet chargé.'
    }
  };

  const t = content[language];

  return (
    <div className="page-container projects-page">
      <h1>{t.title}</h1>

      <div className="content-card">
        <p>{t.description}</p>

        {projects.length === 0 ? (
          <p>{t.empty}</p>
        ) : (
          <div className="projects-list">
            {projects.map(project => (
              <div key={project.id} className="project-card">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <small>{project.tech.join(", ")}</small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
