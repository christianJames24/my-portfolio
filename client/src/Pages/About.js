// About.js
import React, { useContext, useEffect } from "react";
import { LanguageContext } from "../App";
import contentEn from "../data/about-en.json";
import contentFr from "../data/about-fr.json";

export default function About() {
  const { language } = useContext(LanguageContext);
  const t = language === "en" ? contentEn : contentFr;

  useEffect(() => {
    const pageTitle = t.title || (language === 'en' ? 'About' : 'À propos');
    document.title = `Christian James Lee - ${pageTitle}`;
  }, [language, t.title]);

  return (
    <div className="page-container about-page">
      <h1>{t.title}</h1>

      <div className="content-card">
        <h2>{t.intro}</h2>
        <img
          src={t.profileImage}
          alt="Profile"
          className="profile-image float-left"
          style={{
            width: "100%",
            maxWidth: "300px",
            height: "auto",
            marginBottom: "20px",
            border: "6px solid var(--color-neon-green)",
            boxShadow:
              "12px 12px 0 var(--color-magenta), -6px -6px 0 var(--color-cyan)",
            transform: "rotate(-2deg)",
            transition: "all 0.3s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "rotate(0deg) scale(1.05)";
            e.currentTarget.style.boxShadow =
              "16px 16px 0 var(--color-magenta), -8px -8px 0 var(--color-cyan)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "rotate(-2deg)";
            e.currentTarget.style.boxShadow =
              "12px 12px 0 var(--color-magenta), -6px -6px 0 var(--color-cyan)";
          }}
        />
        <p>{t.introText}</p>
      </div>

      <div className="content-card">
        <h2>{t.journey}</h2>
        <img
          src={t.journeyImage}
          alt="Journey"
          className="float-image float-right"
          style={{
            width: "100%",
            height: "auto",
            marginBottom: "20px",
            border: "5px solid var(--color-cyan)",
            boxShadow: "10px 10px 0 var(--color-neon-green)",
            clipPath:
              "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 0 100%)",
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
        <p style={{ whiteSpace: "pre-line" }}>{t.skillsText}</p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "16px",
            marginTop: "24px",
          }}
        >
          {t.skillsImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Tech ${index + 1}`}
              style={{
                width: "100%",
                height: "auto",
                border: `4px solid ${
                  index === 0 ? 'var(--color-magenta)' : 
                  index === 1 ? 'var(--color-neon-green)' : 
                  'var(--color-cyan)'
                }`,
                boxShadow: "6px 6px 0 var(--color-black)",
                transform: `rotate(${index === 0 ? '1deg' : index === 1 ? '-2deg' : '2deg'})`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="content-card">
        <h2>{t.philosophy}</h2>
        <p>{t.philosophyText}</p>
      </div>

      <div className="content-card">
        <h2>{t.outside}</h2>
        <img
          src={t.outsideImage}
          alt="Hobbies"
          className="float-image float-left"
          style={{
            width: "100%",
            height: "auto",
            marginBottom: "20px",
            border: "5px solid var(--color-magenta)",
            boxShadow: "-10px 10px 0 var(--color-neon-green)",
            clipPath:
              "polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",
          }}
        />
        <p>{t.outsideText}</p>
      </div>

      <style>{`
  .content-card {
    overflow: hidden;
  }
  
  @media (min-width: 808px) {
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
  
  @media (max-width: 807px) {
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