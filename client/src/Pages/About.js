// About.js
import React, { useContext, useEffect, useState } from "react";
import { LanguageContext } from "../App";
import contentEn from "../data/about-en.json";
import contentFr from "../data/about-fr.json";
import EditableText from "../components/EditableText";
import EditableImage from "../components/EditableImage";
import ExportButton from "../components/ExportButton";
import ImportButton from "../components/ImportButton";
import { useEdit } from "../components/EditContext";
import { useLightbox } from "../contexts/LightboxContext";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

export default function About() {
  const { language } = useContext(LanguageContext);
  const { canEdit, saveContent, saveField } = useEdit();
  const { openLightbox, closeLightbox } = useLightbox();
  const [content, setContent] = useState(language === "en" ? contentEn : contentFr);
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  // Fetch content from API with fallback to JSON
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`/api/content/about?lang=${language}`);
        const data = await res.json();

        if (data.useClientFallback) {
          setContent(language === "en" ? contentEn : contentFr);
        } else {
          setContent(data);
        }
      } catch (err) {
        console.error("Error fetching about content:", err);
        setContent(language === "en" ? contentEn : contentFr);
      }
    };

    fetchContent();
  }, [language]);

  useEffect(() => {
    const pageTitle = content.title || (language === 'en' ? 'About' : 'À propos');
    document.title = `Christian James Lee - ${pageTitle}`;
  }, [language, content.title]);

  // Intersection Observer for scroll-based animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const img = entry.target;
          const isProfileImage = img.classList.contains('profile-image');
          const isSkillsImage = img.classList.contains('skills-image');
          const actualImg = img.querySelector('img');

          // Helper to trigger squish animation
          const triggerSquish = () => {
            if (isProfileImage) {
              actualImg.style.animation = "none";
              setTimeout(() => {
                actualImg.style.animation = "gentleSquishRotated 0.4s ease-in-out forwards";
              }, 10);
            } else if (isSkillsImage) {
              const allSkillsImages = document.querySelectorAll('.skills-image');
              const index = Array.from(allSkillsImages).indexOf(img);
              const animationName = index === 0 ? 'gentleSquishRotated1' : index === 1 ? 'gentleSquishRotated' : 'gentleSquishRotated2';
              actualImg.style.animation = "none";
              setTimeout(() => {
                actualImg.style.animation = `${animationName} 0.4s ease-in-out forwards`;
              }, index * 100 + 10);
            } else {
              actualImg.style.animation = "none";
              setTimeout(() => {
                actualImg.style.animation = "gentleSquish 0.4s ease-in-out forwards";
              }, 10);
            }
          };

          if (entry.isIntersecting) {
            if (actualImg && actualImg.complete) {
              triggerSquish();
            } else if (actualImg) {
              // Wait for image to load before animating
              const onLoad = () => {
                triggerSquish();
                actualImg.removeEventListener('load', onLoad);
              };
              actualImg.addEventListener('load', onLoad);
            }
          } else {
            // Reset animation when leaving viewport
            if (actualImg) actualImg.style.animation = "none";
          }
        });
      },
      { threshold: 0.3 }
    );

    const images = document.querySelectorAll('.profile-image, .section-image, .skills-image');
    images.forEach((img) => observer.observe(img));

    return () => observer.disconnect();
  }, [content]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightboxIndex >= 0) {
      document.body.style.overflow = "hidden";
      openLightbox();
    } else {
      document.body.style.overflow = "auto";
      closeLightbox();
    }

    // Cleanup ensures scroll is restored if component unmounts
    return () => {
      document.body.style.overflow = "auto";
      closeLightbox();
    };
  }, [lightboxIndex, openLightbox, closeLightbox]);

  // Update local state and save to backend
  const handleFieldSave = async (field, value) => {
    const newContent = { ...content, [field]: value };
    setContent(newContent);
    await saveContent("about", newContent, language);
  };

  // Save images to BOTH languages so they stay in sync
  const handleImageSave = async (field, value) => {
    // Update local state immediately
    const newContent = { ...content, [field]: value };
    setContent(newContent);
    // Save partial update to both en and fr using PATCH
    // This avoids overwriting text content in the other language
    await Promise.all([
      saveField("about", field, value, "en"),
      saveField("about", field, value, "fr"),
    ]);
  };



  // For image arrays - save to both languages
  const handleImageArraySave = async (field, index, value) => {
    // field is "skillsImages", index is the index
    const newArray = [...content[field]];
    newArray[index] = value;
    const newContent = { ...content, [field]: newArray };
    setContent(newContent);

    // Construct the path for PATCH (e.g. "skillsImages[0]")
    const path = `${field}[${index}]`;

    await Promise.all([
      saveField("about", path, value, "en"),
      saveField("about", path, value, "fr"),
    ]);
  };

  const t = content;

  // Create slides for all images on the About page
  const allSlides = [
    { src: t.profileImage },
    { src: t.journeyImage },
    ...(t.skillsImages?.map(img => ({ src: img })) || []),
    { src: t.outsideImage }
  ];

  return (
    <div className="page-container about-page">
      <h1>
        <EditableText
          value={t.title}
          field="title"
          page="about"
          language={language}
          onSave={(v) => handleFieldSave("title", v)}
        />
      </h1>

      {canEdit && (
        <div style={{ marginBottom: "20px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <ExportButton page="about" language={language} />
          <ImportButton page="about" language={language} />
        </div>
      )}

      <div className="content-card">
        <h2 style={{ marginBottom: "20px", clear: "both" }}>
          <EditableText
            value={t.intro}
            field="intro"
            page="about"
            language={language}
            onSave={(v) => handleFieldSave("intro", v)}
          />
        </h2>
        <div className="about-intro-content">
          <p>
            <EditableText
              value={t.introText}
              field="introText"
              page="about"
              language={language}
              multiline
              onSave={(v) => handleFieldSave("introText", v)}
            />
          </p>
          <EditableImage
            src={t.profileImage}
            alt="Profile"
            field="profileImage"
            page="about"
            language={language}
            onSave={(v) => handleImageSave("profileImage", v)}
            onImageClick={() => setLightboxIndex(0)}
            className="profile-image"
            style={{
              width: "100%",
              maxWidth: "300px",
              height: "auto",
              marginBottom: "20px",
              border: "6px solid var(--color-neon-green)",
              boxShadow:
                "12px 12px 0 var(--color-magenta), -6px -6px 0 var(--color-cyan)",
              transform: "rotate(-2deg) translateY(0)",
              transition: "transform 0.3s ease-out",
            }}
          />
        </div>
      </div>

      <div className="content-card">
        <h2 style={{ marginBottom: "20px" }}>
          <EditableText
            value={t.journey}
            field="journey"
            page="about"
            language={language}
            onSave={(v) => handleFieldSave("journey", v)}
          />
        </h2>
        <div className="about-section-content about-section-reverse">
          <p>
            <EditableText
              value={t.journeyText}
              field="journeyText"
              page="about"
              language={language}
              multiline
              onSave={(v) => handleFieldSave("journeyText", v)}
            />
          </p>
          <EditableImage
            src={t.journeyImage}
            alt="Journey"
            field="journeyImage"
            page="about"
            language={language}
            onSave={(v) => handleImageSave("journeyImage", v)}
            onImageClick={() => setLightboxIndex(1)}
            className="section-image"
            style={{
              width: "100%",
              height: "auto",
              border: "5px solid var(--color-cyan)",
              boxShadow: "10px 10px 0 var(--color-neon-green)",
              clipPath:
                "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 0 100%)",
              transform: "translateY(0)",
              transition: "transform 0.3s ease-out",
            }}
          />
        </div>
      </div>

      {/* <div className="content-card">
        <h2>
          <EditableText
            value={t.whatIDo}
            field="whatIDo"
            page="about"
            language={language}
            onSave={(v) => handleFieldSave("whatIDo", v)}
          />
        </h2>
        <p>
          <EditableText
            value={t.whatIDoText}
            field="whatIDoText"
            page="about"
            language={language}
            multiline
            onSave={(v) => handleFieldSave("whatIDoText", v)}
          />
        </p>
      </div> */}

      <div className="content-card">
        <h2>
          <EditableText
            value={t.skills}
            field="skills"
            page="about"
            language={language}
            onSave={(v) => handleFieldSave("skills", v)}
          />
        </h2>
        <p style={{ whiteSpace: "pre-line" }}>
          <EditableText
            value={t.skillsText}
            field="skillsText"
            page="about"
            language={language}
            multiline
            onSave={(v) => handleFieldSave("skillsText", v)}
          />
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "16px",
            marginTop: "24px",
          }}
        >
          {t.skillsImages?.map((image, index) => (
            <EditableImage
              key={index}
              src={image}
              alt={`Tech ${index + 1}`}
              field={`skillsImages[${index}]`}
              page="about"
              language={language}
              onSave={(v) => handleImageArraySave("skillsImages", index, v)}
              onImageClick={() => setLightboxIndex(2 + index)}
              className="skills-image"
              style={{
                width: "100%",
                height: "auto",
                border: `4px solid ${index === 0 ? 'var(--color-magenta)' :
                  index === 1 ? 'var(--color-neon-green)' :
                    'var(--color-cyan)'
                  }`,
                boxShadow: "6px 6px 0 var(--color-black)",
                transform: `rotate(${index === 0 ? '1deg' : index === 1 ? '-2deg' : '2deg'}) translateY(0)`,
                transition: "transform 0.3s ease-out",
              }}
            />
          ))}
        </div>
      </div>

      {/* <div className="content-card">
        <h2>
          <EditableText
            value={t.philosophy}
            field="philosophy"
            page="about"
            language={language}
            onSave={(v) => handleFieldSave("philosophy", v)}
          />
        </h2>
        <p>
          <EditableText
            value={t.philosophyText}
            field="philosophyText"
            page="about"
            language={language}
            multiline
            onSave={(v) => handleFieldSave("philosophyText", v)}
          />
        </p>
      </div> */}

      <div className="content-card">
        <h2 style={{ marginBottom: "20px" }}>
          <EditableText
            value={t.outside}
            field="outside"
            page="about"
            language={language}
            onSave={(v) => handleFieldSave("outside", v)}
          />
        </h2>
        <div className="about-section-content about-section-reverse">
          <EditableImage
            src={t.outsideImage}
            alt="Hobbies"
            field="outsideImage"
            page="about"
            language={language}
            onSave={(v) => handleImageSave("outsideImage", v)}
            onImageClick={() => setLightboxIndex(2 + (t.skillsImages?.length || 0))}
            className="section-image"
            style={{
              width: "100%",
              height: "auto",
              border: "5px solid var(--color-magenta)",
              boxShadow: "-10px 10px 0 var(--color-neon-green)",
              clipPath:
                "polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",
              transform: "translateY(0)",
              transition: "transform 0.3s ease-out",
            }}
          />
          <p>
            <EditableText
              value={t.outsideText}
              field="outsideText"
              page="about"
              language={language}
              multiline
              onSave={(v) => handleFieldSave("outsideText", v)}
            />
          </p>
        </div>
      </div>

      {lightboxIndex >= 0 && (
        <Lightbox
          mainSrc={allSlides[lightboxIndex].src}
          nextSrc={allSlides[(lightboxIndex + 1) % allSlides.length].src}
          prevSrc={allSlides[(lightboxIndex + allSlides.length - 1) % allSlides.length].src}
          onCloseRequest={() => setLightboxIndex(-1)}
          onMovePrevRequest={() =>
            setLightboxIndex((lightboxIndex + allSlides.length - 1) % allSlides.length)
          }
          onMoveNextRequest={() =>
            setLightboxIndex((lightboxIndex + 1) % allSlides.length)
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
  
  .about-intro-content,
  .about-section-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  @media (min-width: 808px) {
    .about-intro-content,
    .about-section-content {
      flex-direction: row;
      align-items: flex-start;
    }
    
    .about-intro-content.about-section-reverse,
    .about-section-content.about-section-reverse {
      flex-direction: row-reverse;
    }
    
    .about-intro-content .profile-image,
    .about-section-content .section-image {
      flex-shrink: 0;
      max-width: 350px;
    }
    
    .about-intro-content .profile-image {
      margin-right: 24px;
    }
    
    .about-intro-content.about-section-reverse .profile-image {
      margin-right: 0;
      margin-left: 24px;
    }
    
    .about-section-content .section-image {
      margin-left: 24px;
    }
    
    .about-section-reverse .section-image {
      margin-left: 0;
      margin-right: 24px;
    }
    
    .about-intro-content p,
    .about-section-content p {
      flex: 1;
      margin: 0;
    }
    
    .profile-image {
      max-width: 300px;
    }
  }
  
  @media (max-width: 807px) {
    .profile-image,
    .section-image {
      width: 100%;
      max-width: 300px;
      display: block;
      margin-left: auto;
      margin-right: auto;
    }
    
    .about-section-content p {
      margin: 0;
    }
  }
`}</style>
    </div>
  );
}