// Home.js
import React, { useContext, useEffect, useState } from 'react';
import { LanguageContext } from '../App';
import contentEn from '../data/home-en.json';
import contentFr from '../data/home-fr.json';
import EditableText from '../components/EditableText';
import ExportButton from '../components/ExportButton';
import { useEdit } from '../components/EditContext';

export default function Home({ backendData }) {
  const { language } = useContext(LanguageContext);
  const { canEdit, saveContent } = useEdit();
  const [content, setContent] = useState(language === 'en' ? contentEn : contentFr);

  // Fetch content from API with fallback to JSON
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`/api/content/home?lang=${language}`);
        const data = await res.json();

        if (data.useClientFallback) {
          setContent(language === 'en' ? contentEn : contentFr);
        } else {
          setContent(data);
        }
      } catch (err) {
        console.error('Error fetching home content:', err);
        setContent(language === 'en' ? contentEn : contentFr);
      }
    };

    fetchContent();
  }, [language]);

  useEffect(() => {
    const pageTitle = content.title || (language === 'en' ? 'Home' : 'Accueil');
    document.title = `Christian James Lee - ${pageTitle}`;
  }, [language, content.title]);

  // Update local state and save to backend
  const handleFieldSave = async (field, value) => {
    const newContent = { ...content, [field]: value };
    setContent(newContent);
    await saveContent('home', newContent, language);
  };

  const t = content;

  return (
    <div className="home-container" style={{
      position: 'relative',
      zIndex: 10,
      marginLeft: '7.5%',
      padding: '2.5%',
      maxWidth: '800px',
      marginTop: '2%',
      height: '98vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}>

      {canEdit && (
        <div style={{ marginBottom: '20px' }}>
          <ExportButton page="home" language={language} />
        </div>
      )}

      <h1>
        <EditableText
          value={t.title}
          field="title"
          page="home"
          language={language}
          onSave={(v) => handleFieldSave('title', v)}
        />
      </h1>

      <p style={{
        fontSize: 'clamp(16px, 3vw, 32px)',
        color: 'var(--color-black)',
        fontWeight: '400',
        margin: '0',
        position: 'relative',
        zIndex: 2,
        background: 'var(--color-yellow)',
        display: 'inline-block',
        padding: 'clamp(6px, 1.5vw, 8px) clamp(12px, 3vw, 16px)',
        transform: 'rotate(1deg)',
        border: '2px solid var(--color-black)',
        boxShadow: 'clamp(4px, 1vw, 6px) clamp(4px, 1vw, 6px) 0 var(--color-black)',
        maxWidth: 'fit-content',
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
        fontFamily: 'var(--font-body)'
      }}>
        <EditableText
          value={t.subtitle}
          field="subtitle"
          page="home"
          language={language}
          onSave={(v) => handleFieldSave('subtitle', v)}
        />
      </p>

      <style>{`
        .home-container {
          margin-left: 0;
        }
        
        @media (min-width: 768px) {
          .home-container {
            margin-left: 20px;
          }
        }
      `}</style>
    </div>
  );
}