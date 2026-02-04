// Projects.js
import React, { useContext, useState, useEffect } from "react";
import { LanguageContext } from "../App";
import contentEn from "../data/projects-en.json";
import contentFr from "../data/projects-fr.json";
import { useLightbox } from "../contexts/LightboxContext";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

export default function Projects() {
  const { language } = useContext(LanguageContext);
  const { openLightbox, closeLightbox } = useLightbox();
  const [projectsData, setProjectsData] = useState(null);
  const [index, setIndex] = useState(-1);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`/api/projects?lang=${language}`);
        const data = await res.json();

        if (data.useClientFallback || data.projects.length === 0) {
          setProjectsData(language === "en" ? contentEn : contentFr);
        } else {
          setProjectsData(data);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
        setProjectsData(language === "en" ? contentEn : contentFr);
      }
    };

    fetchProjects();
  }, [language]);

  useEffect(() => {
    const pageTitle = projectsData?.title || (language === 'en' ? 'Projects' : 'Projets');
    document.title = `Christian James Lee - ${pageTitle}`;
  }, [language, projectsData]);

  // Intersection Observer for scroll-based animations
  useEffect(() => {
    const images = document.querySelectorAll('.project-image');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const img = entry.target;

          const triggerSquish = () => {
            img.style.animation = "none";
            setTimeout(() => {
              img.style.animation = "gentleSquish 0.4s ease-in-out forwards";
            }, 10);
          };

          if (entry.isIntersecting) {
            if (img.complete) {
              triggerSquish();
            } else {
              // Wait for image to load before animating
              const onLoad = () => {
                triggerSquish();
                img.removeEventListener('load', onLoad);
              };
              img.addEventListener('load', onLoad);
            }
          } else {
            // Reset animation when leaving viewport
            img.style.animation = "none";
          }
        });
      },
      { threshold: 0.3 }
    );

    images.forEach((img) => observer.observe(img));

    return () => observer.disconnect();
  }, [projectsData]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (index >= 0) {
      document.body.style.overflow = "hidden";
      openLightbox();
    } else {
      document.body.style.overflow = "auto";
      closeLightbox();
    }

    return () => {
      document.body.style.overflow = "auto";
      closeLightbox();
    };
  }, [index, openLightbox, closeLightbox]);

  const t = projectsData || (language === "en" ? contentEn : contentFr);

  const getProjectColors = (index) => {
    const colors = [
      { border: "var(--color-neon-green)", shadow: "var(--color-magenta)" },
      { border: "var(--color-magenta)", shadow: "var(--color-cyan)" },
      { border: "var(--color-cyan)", shadow: "var(--color-neon-green)" },
    ];
    return colors[index % 3];
  };

  const slides = t.projects.map((project) => project.image);

  return (
    <div className="page-container projects-page">
      <h1>{t.title}</h1>

      {t.projects.map((project, i) => {
        const colors = getProjectColors(i);
        return (
          <div key={i} className="content-card">
            <img
              src={project.image}
              alt={project.name}
              className={`project-image ${i % 2 === 0 ? "float-right" : "float-left"}`}
              style={{
                width: "100%",
                height: "auto",
                marginBottom: "20px",
                border: `5px solid ${colors.border}`,
                boxShadow: `10px 10px 0 ${colors.shadow}`,
                clipPath:
                  i % 2 === 0
                    ? "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 0 100%)"
                    : "polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",
                transition: "transform 0.3s ease-out, filter 0.2s",
                cursor: "pointer"
              }}
              onClick={() => setIndex(i)}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: "12px",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              <h2 style={{ margin: 0 }}>{project.name}</h2>
              <span origin="end"
                style={{
                  color: "var(--color-cyan)",
                  fontSize: "clamp(14px, 2vw, 18px)",
                  fontWeight: "900",
                  fontFamily: "var(--font-bold)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                {project.year}
              </span>
            </div>
            <p>{project.description}</p>
            <p
              style={{
                color: "var(--color-neon-green)",
                fontSize: "clamp(14px, 2vw, 16px)",
                fontFamily: "var(--font-bold)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginTop: "16px",
                clear: "both",
              }}
            >
              {project.tech}
            </p>
            {project.link && (
              <div style={{ clear: "both", marginTop: "8px" }}>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "var(--color-white)",
                    fontSize: "14px",
                    fontWeight: "900",
                    textDecoration: "none",
                    borderBottom: "2px solid var(--color-cyan)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    display: "inline-block",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = "var(--color-cyan)";
                    e.target.style.borderBottom = "2px solid var(--color-white)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "var(--color-white)";
                    e.target.style.borderBottom = "2px solid var(--color-cyan)";
                  }}
                >
                  {language === "fr" ? "Lien" : "Link"} →
                </a>
              </div>
            )}
          </div>
        );
      })}

      {index >= 0 && (
        <Lightbox
          mainSrc={slides[index]}
          nextSrc={slides[(index + 1) % slides.length]}
          prevSrc={slides[(index + slides.length - 1) % slides.length]}
          onCloseRequest={() => setIndex(-1)}
          onMovePrevRequest={() =>
            setIndex((index + slides.length - 1) % slides.length)
          }
          onMoveNextRequest={() =>
            setIndex((index + 1) % slides.length)
          }
          enableZoom={true}
          clickOutsideToClose={true}
        />
      )}

      <style>{`
      @media (min-width: 768px) {
        .ril__image {
          max-width: 75vw !important;
          max-height: 75vh !important;
          width: auto !important;
          height: auto !important;
          object-fit: contain !important;
        }
      }
      
      .ril__image {
        transition: transform 0.2s ease-out !important;
      }

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