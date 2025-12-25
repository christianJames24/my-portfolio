import React, { useContext } from "react";
import { LanguageContext } from "../App";

export default function Projects() {
  const { language } = useContext(LanguageContext);

  const content = {
    en: {
      title: "Projects",
      projects: [
        {
          name: "HyperTask",
          description: "A brutalist task management app that doesn't try to be your therapist. Built with React, Node.js, and PostgreSQL. Features real-time collaboration, keyboard shortcuts for everything, and a UI that gets out of your way.",
          tech: "React • Node.js • PostgreSQL • WebSockets • Redis",
          year: "2024",
          image: "https://picsum.photos/800/500?random=10"
        },
        {
          name: "DevJournal",
          description: "Markdown-based developer journal with syntax highlighting, git integration, and daily commit stats. Because documenting your debugging journey is cheaper than therapy.",
          tech: "Next.js • MongoDB • CodeMirror • GitHub API",
          year: "2024",
          image: "https://picsum.photos/800/500?random=11"
        },
        {
          name: "SoundScape",
          description: "Interactive audio visualizer built with Three.js and Web Audio API. Generates 3D landscapes that react to your music in real-time. It's like WinAmp visualizations but you can actually show people.",
          tech: "Three.js • Web Audio API • GLSL • React",
          year: "2023",
          image: "https://picsum.photos/800/500?random=12"
        },
        {
          name: "CLI Portfolio",
          description: "A terminal-style portfolio website because I thought it would be cool. It was. Features a custom shell interpreter, file system navigation, and easter eggs for people who actually read documentation.",
          tech: "TypeScript • Node.js • Custom Parser • Vercel",
          year: "2023",
          image: "https://picsum.photos/800/500?random=13"
        },
        {
          name: "QuickPoll",
          description: "Real-time polling app for presentations and meetings. Create a poll, share a link, watch votes come in live. No login required because nobody wants another account.",
          tech: "React • Express • Socket.io • Chart.js",
          year: "2023",
          image: "https://picsum.photos/800/500?random=14"
        },
        {
          name: "CodeSnap",
          description: "Beautiful code screenshot generator with tons of themes and customization. For when your code is actually clean enough to share on Twitter.",
          tech: "React • Prism.js • Canvas API • Tailwind",
          year: "2022",
          image: "https://picsum.photos/800/500?random=15"
        }
      ]
    },
    fr: {
      title: "Projets",
      projects: [
        {
          name: "HyperTask",
          description: "Une application brutale de gestion des tâches qui n'essaie pas d'être votre thérapeute. Construit avec React, Node.js et PostgreSQL. Fonctionnalités de collaboration en temps réel, raccourcis clavier pour tout, et une interface qui se retire de votre chemin.",
          tech: "React • Node.js • PostgreSQL • WebSockets • Redis",
          year: "2024",
          image: "https://picsum.photos/800/500?random=10"
        },
        {
          name: "DevJournal",
          description: "Journal de développeur basé sur Markdown avec coloration syntaxique, intégration git et statistiques de commit quotidiennes. Parce que documenter votre parcours de débogage est moins cher qu'une thérapie.",
          tech: "Next.js • MongoDB • CodeMirror • GitHub API",
          year: "2024",
          image: "https://picsum.photos/800/500?random=11"
        },
        {
          name: "SoundScape",
          description: "Visualiseur audio interactif construit avec Three.js et Web Audio API. Génère des paysages 3D qui réagissent à votre musique en temps réel. C'est comme les visualisations WinAmp mais vous pouvez vraiment montrer aux gens.",
          tech: "Three.js • Web Audio API • GLSL • React",
          year: "2023",
          image: "https://picsum.photos/800/500?random=12"
        },
        {
          name: "CLI Portfolio",
          description: "Un site portfolio de style terminal parce que je pensais que ce serait cool. C'était. Fonctionnalités d'un interpréteur shell personnalisé, navigation du système de fichiers et œufs de Pâques pour les gens qui lisent vraiment la documentation.",
          tech: "TypeScript • Node.js • Custom Parser • Vercel",
          year: "2023",
          image: "https://picsum.photos/800/500?random=13"
        },
        {
          name: "QuickPoll",
          description: "Application de sondage en temps réel pour les présentations et les réunions. Créez un sondage, partagez un lien, regardez les votes arriver en direct. Pas de connexion requise parce que personne ne veut un autre compte.",
          tech: "React • Express • Socket.io • Chart.js",
          year: "2023",
          image: "https://picsum.photos/800/500?random=14"
        },
        {
          name: "CodeSnap",
          description: "Générateur de captures d'écran de code magnifique avec des tonnes de thèmes et de personnalisation. Pour quand votre code est assez propre pour partager sur Twitter.",
          tech: "React • Prism.js • Canvas API • Tailwind",
          year: "2022",
          image: "https://picsum.photos/800/500?random=15"
        }
      ]
    }
  };

  const t = content[language];

  return (
    <div className="page-container projects-page">
      <h1>{t.title}</h1>

      {t.projects.map((project, index) => (
        <div key={index} className="content-card">
          {/* Project Image */}
          <img 
            src={project.image}
            alt={project.name}
            className={`project-image ${index % 2 === 0 ? 'float-right' : 'float-left'}`}
            style={{
              width: '100%',
              height: 'auto',
              marginBottom: '20px',
              border: `5px solid ${index % 3 === 0 ? '#39ff14' : index % 3 === 1 ? '#ff00ff' : '#00ffff'}`,
              boxShadow: `10px 10px 0 ${index % 3 === 0 ? '#ff00ff' : index % 3 === 1 ? '#00ffff' : '#39ff14'}`,
              clipPath: index % 2 === 0 
                ? 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 0 100%)'
                : 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = `15px 15px 0 ${index % 3 === 0 ? '#ff00ff' : index % 3 === 1 ? '#00ffff' : '#39ff14'}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = `10px 10px 0 ${index % 3 === 0 ? '#ff00ff' : index % 3 === 1 ? '#00ffff' : '#39ff14'}`;
            }}
          />
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'baseline',
            marginBottom: '12px',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <h2 style={{ margin: 0 }}>{project.name}</h2>
            <span style={{ 
              color: '#00ffff',
              fontSize: 'clamp(14px, 2vw, 18px)',
              fontWeight: '900',
              fontFamily: 'var(--font-bold)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              {project.year}
            </span>
          </div>
          <p>{project.description}</p>
          <p style={{ 
            color: '#39ff14',
            fontSize: 'clamp(14px, 2vw, 16px)',
            fontFamily: 'var(--font-bold)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginTop: '16px',
            clear: 'both'
          }}>
            {project.tech}
          </p>
        </div>
      ))}

      <style>{`
      .content-card {
    overflow: hidden;
  }
        @media (min-width: 808px) {
          .project-image {
            max-width: 50%;
          }
          
          .project-image.float-right {
            float: right;
            margin-left: 24px;
            margin-bottom: 16px;
          }
          
          .project-image.float-left {
            float: left;
            margin-right: 24px;
            margin-bottom: 16px;
          }
        }
        
        @media (max-width: 807px) {
          .project-image {
            width: 100%;
            float: none;
            margin-left: 0;
            margin-right: 0;
          }
        }
      `}</style>
    </div>
  );
}