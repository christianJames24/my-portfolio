// Resume.js
import React, { useContext } from 'react';
import { LanguageContext } from '../App';
import contentEn from '../data/resume-en.json';
import contentFr from '../data/resume-fr.json';

export default function Resume() {
  const { language } = useContext(LanguageContext);
  const t = language === 'en' ? contentEn : contentFr;

  return (
    <div className="page-container resume-page">
      <h1>{t.title}</h1>

      <div className="content-card">
        <button className="btn-primary" onClick={() => alert('PDF download would go here!')}>
          {t.download}
        </button>
      </div>

      <div className="content-card">
        <h2>{t.experience}</h2>
        {t.jobs.map((job, index) => (
          <div key={index} style={{ marginBottom: index < t.jobs.length - 1 ? '32px' : '0' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'baseline',
              marginBottom: '8px',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              <h3 style={{ 
                fontSize: 'clamp(20px, 3vw, 28px)',
                color: 'var(--color-neon-green)',
                margin: 0,
                fontWeight: '900',
                textTransform: 'uppercase'
              }}>
                {job.title}
              </h3>
              <span style={{ 
                color: 'var(--color-cyan)',
                fontSize: 'clamp(14px, 2vw, 16px)',
                fontWeight: '900',
                fontFamily: 'var(--font-bold)'
              }}>
                {job.period}
              </span>
            </div>
            <p style={{ 
              color: 'var(--color-magenta)',
              fontSize: 'clamp(16px, 2.5vw, 18px)',
              fontWeight: '700',
              margin: '0 0 12px 0'
            }}>
              {job.company}
            </p>
            <p style={{ margin: 0 }}>{job.description}</p>
          </div>
        ))}
      </div>

      <div className="content-card">
        <h2>{t.education}</h2>
        {t.schools.map((school, index) => (
          <div key={index}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'baseline',
              marginBottom: '8px',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              <h3 style={{ 
                fontSize: 'clamp(20px, 3vw, 28px)',
                color: 'var(--color-neon-green)',
                margin: 0,
                fontWeight: '900',
                textTransform: 'uppercase'
              }}>
                {school.degree}
              </h3>
              <span style={{ 
                color: 'var(--color-cyan)',
                fontSize: 'clamp(14px, 2vw, 16px)',
                fontWeight: '900',
                fontFamily: 'var(--font-bold)'
              }}>
                {school.period}
              </span>
            </div>
            <p style={{ 
              color: 'var(--color-magenta)',
              fontSize: 'clamp(16px, 2.5vw, 18px)',
              fontWeight: '700',
              margin: '0 0 12px 0'
            }}>
              {school.school}
            </p>
            <p style={{ margin: 0 }}>{school.description}</p>
          </div>
        ))}
      </div>

      <div className="content-card">
        <h2>{t.skills}</h2>
        <p style={{ whiteSpace: 'pre-line', margin: 0 }}>{t.skillsList}</p>
      </div>

      <div className="content-card">
        <h2>{t.certifications}</h2>
        {t.certs.map((cert, index) => (
          <p key={index} style={{ 
            margin: '8px 0',
            color: 'var(--color-neon-green)',
            fontSize: 'clamp(16px, 2.5vw, 18px)',
            fontWeight: '700'
          }}>
            • {cert}
          </p>
        ))}
      </div>
    </div>
  );
}