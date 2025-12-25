import React, { useContext } from 'react';
import { LanguageContext } from '../App';

export default function Resume() {
  const { language } = useContext(LanguageContext);

  const content = {
    en: {
      title: 'Resume',
      download: 'Download PDF',
      
      experience: 'Experience',
      jobs: [
        {
          title: 'Senior Full-Stack Developer',
          company: 'TechCorp Inc.',
          period: '2022 - Present',
          description: 'Leading development of scalable web applications serving 100k+ users. Architected microservices infrastructure, reduced load times by 60%, and mentored junior developers. Tech stack: React, Node.js, PostgreSQL, AWS.'
        },
        {
          title: 'Full-Stack Developer',
          company: 'StartupXYZ',
          period: '2020 - 2022',
          description: 'Built and shipped features for a SaaS platform from MVP to Series A. Implemented real-time collaboration features, RESTful APIs, and responsive frontend. Wore many hats, broke things, fixed things.'
        },
        {
          title: 'Frontend Developer',
          company: 'Digital Agency Co.',
          period: '2019 - 2020',
          description: 'Created pixel-perfect responsive websites for various clients. Specialized in React, animation libraries, and making designers happy. Learned that "make it pop" is not useful feedback.'
        }
      ],
      
      education: 'Education',
      schools: [
        {
          degree: 'B.S. Computer Science',
          school: 'University of Technology',
          period: '2015 - 2019',
          description: 'Graduated with honors. Relevant coursework: Data Structures, Algorithms, Web Development, Database Systems, Software Engineering.'
        }
      ],
      
      skills: 'Technical Skills',
      skillsList: `**Languages:** JavaScript/TypeScript, Python, HTML/CSS, SQL, Bash

**Frontend:** React, Next.js, Vue, Tailwind CSS, GSAP, Three.js, Redux

**Backend:** Node.js, Express, Django, REST APIs, GraphQL, WebSockets

**Database:** PostgreSQL, MongoDB, Redis, Prisma, Supabase

**DevOps:** Docker, AWS, Vercel, GitHub Actions, CI/CD, Nginx

**Tools:** Git, VS Code, Figma, Postman, Linux, Vim (I can exit it)`,
      
      certifications: 'Certifications',
      certs: [
        'AWS Certified Developer - Associate',
        'MongoDB Certified Developer',
        'Meta Frontend Developer Professional Certificate'
      ]
    },
    fr: {
      title: 'CV',
      download: 'Télécharger PDF',
      
      experience: 'Expérience',
      jobs: [
        {
          title: 'Développeur Full-Stack Senior',
          company: 'TechCorp Inc.',
          period: '2022 - Présent',
          description: 'Direction du développement d\'applications web évolutives servant 100k+ utilisateurs. Architecture d\'infrastructure de microservices, réduction des temps de chargement de 60%, et mentorat de développeurs juniors. Stack technique: React, Node.js, PostgreSQL, AWS.'
        },
        {
          title: 'Développeur Full-Stack',
          company: 'StartupXYZ',
          period: '2020 - 2022',
          description: 'Construit et expédié des fonctionnalités pour une plateforme SaaS de MVP à Série A. Implémentation de fonctionnalités de collaboration en temps réel, APIs RESTful, et frontend responsive. Porté plusieurs chapeaux, cassé des choses, réparé des choses.'
        },
        {
          title: 'Développeur Frontend',
          company: 'Digital Agency Co.',
          period: '2019 - 2020',
          description: 'Créé des sites web responsives pixel-perfect pour divers clients. Spécialisé en React, bibliothèques d\'animation, et rendre les designers heureux. Appris que "fais-le ressortir" n\'est pas un retour utile.'
        }
      ],
      
      education: 'Éducation',
      schools: [
        {
          degree: 'B.S. Informatique',
          school: 'Université de Technologie',
          period: '2015 - 2019',
          description: 'Diplômé avec mention. Cours pertinents: Structures de Données, Algorithmes, Développement Web, Systèmes de Base de Données, Génie Logiciel.'
        }
      ],
      
      skills: 'Compétences Techniques',
      skillsList: `**Langages:** JavaScript/TypeScript, Python, HTML/CSS, SQL, Bash

**Frontend:** React, Next.js, Vue, Tailwind CSS, GSAP, Three.js, Redux

**Backend:** Node.js, Express, Django, REST APIs, GraphQL, WebSockets

**Base de Données:** PostgreSQL, MongoDB, Redis, Prisma, Supabase

**DevOps:** Docker, AWS, Vercel, GitHub Actions, CI/CD, Nginx

**Outils:** Git, VS Code, Figma, Postman, Linux, Vim (je peux en sortir)`,
      
      certifications: 'Certifications',
      certs: [
        'AWS Certified Developer - Associate',
        'MongoDB Certified Developer',
        'Meta Frontend Developer Professional Certificate'
      ]
    }
  };

  const t = content[language];

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
                color: '#39ff14',
                margin: 0,
                fontWeight: '900',
                textTransform: 'uppercase'
              }}>
                {job.title}
              </h3>
              <span style={{ 
                color: '#00ffff',
                fontSize: 'clamp(14px, 2vw, 16px)',
                fontWeight: '900',
                fontFamily: 'var(--font-bold)'
              }}>
                {job.period}
              </span>
            </div>
            <p style={{ 
              color: '#ff00ff',
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
                color: '#39ff14',
                margin: 0,
                fontWeight: '900',
                textTransform: 'uppercase'
              }}>
                {school.degree}
              </h3>
              <span style={{ 
                color: '#00ffff',
                fontSize: 'clamp(14px, 2vw, 16px)',
                fontWeight: '900',
                fontFamily: 'var(--font-bold)'
              }}>
                {school.period}
              </span>
            </div>
            <p style={{ 
              color: '#ff00ff',
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
            color: '#39ff14',
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