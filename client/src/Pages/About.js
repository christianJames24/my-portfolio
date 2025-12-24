import React, { useContext } from "react";
import { LanguageContext } from "../App";

export default function About() {
  const { language } = useContext(LanguageContext);

  const content = {
    en: {
      title: "About Me",
      intro: `I am a passionate developer driven by curiosity, creativity, and an endless desire to build meaningful digital experiences. My journey began long before I wrote my first line of code — it started with a fascination for how things work: the logic behind systems, the elegance of design, and the power of technology to transform ideas into reality.

Over the years, I've immersed myself in countless projects, from small experimental apps to full-scale applications built with modern frameworks and tools. Each project taught me something new, whether it was mastering a new language, optimizing performance, enhancing accessibility, or refining the user experience.

My goal as a developer is not just to write code but to craft solutions that feel intuitive, efficient, and impactful. I'm constantly learning, adapting, and evolving with the rapidly-changing tech landscape.`,
      description: `My experience spans across frontend development, backend services, UI/UX best practices, and system architecture. I thrive in environments where problem‑solving, innovation, and collaboration come together.

Some highlights of my journey include:
- Building scalable React applications with state management patterns such as Context API and Redux.
- Developing efficient backend APIs with Node.js and Express.
- Diving into cloud technologies and deployment pipelines.
- Crafting responsive interfaces that feel smooth across all devices.
- Continuously improving code quality through testing, refactoring, and modern development workflows.

This section is intentionally long to test scrolling behavior within your app. You can add even more content or adjust the layout to suit your design.`,
      skills: "Skills & Expertise",
      skillsDesc: `Here are some areas where I excel:

Frontend:
- React, Next.js, Vue (beginner)
- TailwindCSS, CSS Modules, Styled Components
- Responsive design, accessibility, component architecture

Backend:
- Node.js, Express, REST APIs
- Database design with MongoDB and PostgreSQL
- Authentication, session handling, API security

Tools & Workflow:
- Git, GitHub, CI/CD
- Docker, container-based development
- Agile methodologies and collaborative environments

Soft Skills:
- Creative problem solving
- Clear communication
- Adaptability and continuous learning

Feel free to continue expanding this section to test infinite scroll or page performance.`,
    },
    fr: {
      title: "À Propos de Moi",
      intro: `Je suis un développeur passionné, motivé par la curiosité, la créativité et le désir constant de créer des expériences numériques utiles et engageantes. Mon parcours a commencé bien avant ma première ligne de code — avec une fascination pour le fonctionnement des systèmes, la logique derrière les processus, et l'incroyable pouvoir de la technologie.

Au fil des années, j'ai travaillé sur une multitude de projets allant de petites applications expérimentales à des plateformes plus complexes. Chaque projet a été une opportunité d'apprentissage, qu'il s'agisse d'explorer un nouveau langage, d'améliorer les performances, d'enrichir l'accessibilité ou de perfectionner l'expérience utilisateur.

Mon objectif en tant que développeur n'est pas seulement d'écrire du code, mais de créer des solutions intuitives, efficaces et significatives. J'apprends continuellement et m'adapte à l'évolution rapide du monde technologique.`,
      description: `Mon expérience couvre le développement frontend, les services backend, les bonnes pratiques UI/UX, ainsi que la conception d'architectures système. Je m'épanouis dans des environnements où résolution de problèmes, innovation et collaboration se rencontrent.

Voici quelques points forts de mon parcours :
- Développement d'applications React évolutives avec Context API et Redux.
- Création d'APIs backend performantes avec Node.js et Express.
- Exploration de technologies cloud et pipelines de déploiement.
- Conception d'interfaces fluides et responsives.
- Amélioration continue de la qualité du code grâce aux tests et au refactoring.

Cette section est volontairement longue afin de tester la fonctionnalité de défilement dans votre application.`,
      skills: "Compétences et Expertise",
      skillsDesc: `Voici quelques domaines où j'excelle :

Frontend :
- React, Next.js, Vue (débutant)
- TailwindCSS, CSS Modules, Styled Components
- Design responsive, accessibilité, architecture de composants

Backend :
- Node.js, Express, APIs REST
- Conception de bases de données avec MongoDB et PostgreSQL
- Authentification, gestion de sessions, sécurité API

Outils & Workflow :
- Git, GitHub, CI/CD
- Docker, développement basé sur des conteneurs
- Méthodologies agiles et travail collaboratif

Compétences Transversales :
- Résolution créative de problèmes
- Communication claire
- Adaptabilité et apprentissage continu

Ajoutez davantage de contenu si vous souhaitez tester encore plus le défilement.`,
    },
  };

  const t = content[language];

  return (
    <div className="page-container about-page">
      <h1>{t.title}</h1>
      <div className="content-card">
        <p>{t.intro}</p>
        <p>{t.description}</p>
      </div>
      <div className="content-card">
        <h2>{t.skills}</h2>
        <p>{t.skillsDesc}</p>
      </div>
      {/* <h1>{t.title}</h1>
      <div className="content-card">
        <p>{t.intro}</p>
        <p>{t.description}</p>
      </div>
      <div className="content-card">
        <h2>{t.skills}</h2>
        <p>{t.skillsDesc}</p>
      </div>
      <h1>{t.title}</h1>
      <div className="content-card">
        <p>{t.intro}</p>
        <p>{t.description}</p>
      </div>
      <div className="content-card">
        <h2>{t.skills}</h2>
        <p>{t.skillsDesc}</p>
      </div> */}
    </div>
  );
}
