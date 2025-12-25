import React, { useContext } from "react";
import { LanguageContext } from "../App";

export default function About() {
  const { language } = useContext(LanguageContext);

  const content = {
    en: {
      title: "About Me",
      intro: "Hey, I'm a Developer",
      introText: `I build things for the web. Sometimes they break. Most of the time they work. I'm passionate about creating digital experiences that don't suck—clean code, smooth interfaces, and solutions that actually solve problems.`,
      
      journey: "The Journey",
      journeyText: `Started coding because I wanted to make a game. Ended up building websites, apps, and everything in between. Along the way, I've picked up a ridiculous amount of frameworks, broken more things than I can count, and learned that Stack Overflow is humanity's greatest achievement.`,
      
      whatIDo: "What I Do",
      whatIDoText: `I specialize in full-stack development with a focus on modern web technologies. Frontend? Backend? DevOps? Yeah, I mess with all of it. Jack of all trades, master of Googling error messages.`,
      
      skills: "Skills & Tech",
      skillsText: `**Frontend:** React, Next.js, TypeScript, Tailwind CSS, GSAP, Three.js
      
**Backend:** Node.js, Express, Python, PostgreSQL, MongoDB, Redis

**Tools:** Git, Docker, AWS, Vercel, Figma, VS Code (obviously)

**Currently Learning:** Rust, WebAssembly, whatever new framework dropped this week`,
      
      philosophy: "My Philosophy",
      philosophyText: `Code should be clean, comments should be honest, and coffee should be strong. I believe in building things that matter, iterating fast, and never being afraid to scrap everything and start over when something doesn't feel right.`,
      
      outside: "Outside of Code",
      outsideText: `When I'm not staring at a screen, you'll find me staring at a different screen (gaming), or occasionally touching grass. I'm into music production, photography, mechanical keyboards, and convincing myself I need another monitor.`,
    },
    fr: {
      title: "À Propos de Moi",
      intro: "Salut, je suis Développeur",
      introText: `Je construis des choses pour le web. Parfois elles cassent. La plupart du temps elles marchent. Je suis passionné par la création d'expériences numériques qui ne sont pas nulles—du code propre, des interfaces fluides et des solutions qui résolvent vraiment des problèmes.`,
      
      journey: "Le Parcours",
      journeyText: `J'ai commencé à coder parce que je voulais faire un jeu. J'ai fini par construire des sites web, des applications et tout ce qui se trouve entre les deux. En chemin, j'ai appris un nombre ridicule de frameworks, cassé plus de choses que je ne peux compter, et appris que Stack Overflow est la plus grande réalisation de l'humanité.`,
      
      whatIDo: "Ce Que Je Fais",
      whatIDoText: `Je me spécialise dans le développement full-stack avec un focus sur les technologies web modernes. Frontend? Backend? DevOps? Ouais, je touche à tout. Un touche-à-tout, maître de Google les messages d'erreur.`,
      
      skills: "Compétences & Tech",
      skillsText: `**Frontend:** React, Next.js, TypeScript, Tailwind CSS, GSAP, Three.js
      
**Backend:** Node.js, Express, Python, PostgreSQL, MongoDB, Redis

**Outils:** Git, Docker, AWS, Vercel, Figma, VS Code (évidemment)

**En Apprentissage:** Rust, WebAssembly, peu importe le nouveau framework sorti cette semaine`,
      
      philosophy: "Ma Philosophie",
      philosophyText: `Le code devrait être propre, les commentaires devraient être honnêtes, et le café devrait être fort. Je crois en la construction de choses qui comptent, l'itération rapide, et ne jamais avoir peur de tout jeter et recommencer quand quelque chose ne se sent pas bien.`,
      
      outside: "En Dehors du Code",
      outsideText: `Quand je ne fixe pas un écran, vous me trouverez en train de fixer un écran différent (gaming), ou occasionnellement toucher de l'herbe. Je suis dans la production musicale, la photographie, les claviers mécaniques, et me convaincre que j'ai besoin d'un autre moniteur.`,
    }
  };

  const t = content[language];

  return (
    <div className="page-container about-page">
      <h1>{t.title}</h1>
      
      <div className="content-card">
        <h2>{t.intro}</h2>
        {/* Profile Image */}
        <img 
          src="https://picsum.photos/400/400?random=1" 
          alt="Profile"
          className="profile-image float-left"
          style={{
            width: '100%',
            maxWidth: '300px',
            height: 'auto',
            marginBottom: '20px',
            border: '6px solid #39ff14',
            boxShadow: '12px 12px 0 #ff00ff, -6px -6px 0 #00ffff',
            transform: 'rotate(-2deg)',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'rotate(0deg) scale(1.05)';
            e.currentTarget.style.boxShadow = '16px 16px 0 #ff00ff, -8px -8px 0 #00ffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'rotate(-2deg)';
            e.currentTarget.style.boxShadow = '12px 12px 0 #ff00ff, -6px -6px 0 #00ffff';
          }}
        />
        <p>{t.introText}</p>
      </div>

      <div className="content-card">
        <h2>{t.journey}</h2>
        {/* Journey Image */}
        <img 
          src="https://picsum.photos/800/400?random=2" 
          alt="Journey"
          className="float-image float-right"
          style={{
            width: '100%',
            height: 'auto',
            marginBottom: '20px',
            border: '5px solid #00ffff',
            boxShadow: '10px 10px 0 #39ff14',
            clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 0 100%)'
          }}
        />
        <p>{t.journeyText}</p>
      </div>

      <div className="content-card">
        <h2>{t.whatIDo}</h2>
        <p>{t.whatIDoText}</p>
      </div>

      <div className="content-card">
        <h2>{t.skills}</h2>
        <p style={{ whiteSpace: 'pre-line' }}>{t.skillsText}</p>
        {/* Skills collage */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          marginTop: '24px'
        }}>
          <img 
            src="https://picsum.photos/300/200?random=3" 
            alt="Tech 1"
            style={{
              width: '100%',
              height: 'auto',
              border: '4px solid #ff00ff',
              boxShadow: '6px 6px 0 #000000',
              transform: 'rotate(1deg)'
            }}
          />
          <img 
            src="https://picsum.photos/300/200?random=4" 
            alt="Tech 2"
            style={{
              width: '100%',
              height: 'auto',
              border: '4px solid #39ff14',
              boxShadow: '6px 6px 0 #000000',
              transform: 'rotate(-2deg)'
            }}
          />
          <img 
            src="https://picsum.photos/300/200?random=5" 
            alt="Tech 3"
            style={{
              width: '100%',
              height: 'auto',
              border: '4px solid #00ffff',
              boxShadow: '6px 6px 0 #000000',
              transform: 'rotate(2deg)'
            }}
          />
        </div>
      </div>

      <div className="content-card">
        <h2>{t.philosophy}</h2>
        <p>{t.philosophyText}</p>
      </div>

      <div className="content-card">
        <h2>{t.outside}</h2>
        {/* Outside interests image */}
        <img 
          src="https://picsum.photos/800/500?random=6" 
          alt="Hobbies"
          className="float-image float-left"
          style={{
            width: '100%',
            height: 'auto',
            marginBottom: '20px',
            border: '5px solid #ff00ff',
            boxShadow: '-10px 10px 0 #39ff14',
            clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)'
          }}
        />
        <p>{t.outsideText}</p>
      </div>

      <style>{`
        @media (min-width: 1101px) {
          .profile-image {
            float: left;
            margin-right: 24px;
            margin-bottom: 16px;
            max-width: 300px;
          }
          
          .float-image {
            max-width: 45%;
          }
          
          .float-right {
            float: right;
            margin-left: 24px;
            margin-bottom: 16px;
          }
          
          .float-left {
            float: left;
            margin-right: 24px;
            margin-bottom: 16px;
          }
        }
        
        @media (max-width: 1100px) {
          .profile-image {
            width: 100%;
            max-width: 300px;
            display: block;
            margin-left: auto;
            margin-right: auto;
            float: none;
          }
          
          .float-image {
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