// Skills.js
import React, { useContext, useEffect, useState } from 'react';
import { LanguageContext } from '../App';
import contentEn from '../data/skills-en.json';
import contentFr from '../data/skills-fr.json';
import EditableText from '../components/EditableText';
import EditableList from '../components/EditableList';
import ExportButton from '../components/ExportButton';
import ImportButton from '../components/ImportButton';
import { useEdit } from '../components/EditContext';

export default function Skills() {
  const { language } = useContext(LanguageContext);
  const { canEdit, saveContent } = useEdit();
  const [content, setContent] = useState(language === 'en' ? contentEn : contentFr);

  const [previewUrl, setPreviewUrl] = useState(null);

  // Fetch content from API with fallback to JSON
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`/api/content/resume?lang=${language}`);
        const data = await res.json();

        if (data.useClientFallback) {
          setContent(language === 'en' ? contentEn : contentFr);
        } else {
          setContent(data);
        }
      } catch (err) {
        console.error('Error fetching skills content:', err);
        setContent(language === 'en' ? contentEn : contentFr);
      }
    };

    fetchContent();
  }, [language]);

  // Fetch PDF for preview
  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const res = await fetch(`/api/resumes/${language}`);
        if (res.ok) {
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          setPreviewUrl(url);

          return () => {
            if (url) URL.revokeObjectURL(url);
          };
        } else {
          setPreviewUrl(null);
        }
      } catch (err) {
        console.error('Error fetching PDF preview:', err);
        setPreviewUrl(null);
      }
    };

    fetchPdf();
  }, [language]);

  useEffect(() => {
    const pageTitle = content.title || (language === 'en' ? 'Skills' : 'Compétences');
    document.title = `Christian James Lee - ${pageTitle}`;
  }, [language, content.title]);

  // Update local state and save to backend
  const handleFieldSave = async (field, value) => {
    const newContent = { ...content, [field]: value };
    setContent(newContent);
    await saveContent('resume', newContent, language);
  };

  const t = content;

  // Field definitions for editable lists
  const jobFields = [
    { key: 'title', label: 'Job Title', default: '' },
    { key: 'company', label: 'Company', default: '' },
    { key: 'period', label: 'Period', default: '' },
    { key: 'description', label: 'Description', multiline: true, default: '' },
  ];

  const schoolFields = [
    { key: 'degree', label: 'Degree', default: '' },
    { key: 'school', label: 'School', default: '' },
    { key: 'period', label: 'Period', default: '' },
    { key: 'description', label: 'Description', multiline: true, default: '' },
  ];

  const handleDownload = async () => {
    try {
      const res = await fetch(`/api/resumes/${language}`);

      if (!res.ok) {
        if (res.status === 404) {
          alert(language === 'en'
            ? 'No resume available for download yet. Please upload one in the Dashboard.'
            : 'Aucun CV disponible au téléchargement. Veuillez en télécharger un dans le tableau de bord.');
        } else {
          alert(language === 'en' ? 'Error downloading resume' : 'Erreur lors du téléchargement du CV');
        }
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Resume_${language.toUpperCase()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download error:', err);
      alert(language === 'en' ? 'Error downloading resume' : 'Erreur lors du téléchargement du CV');
    }
  };

  return (
    <div className="page-container resume-page">
      <h1>
        <EditableText
          value={t.title}
          field="title"
          page="resume"
          language={language}
          onSave={(v) => handleFieldSave('title', v)}
        />
      </h1>

      {canEdit && (
        <div style={{ marginBottom: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <ExportButton page="resume" language={language} />
          <ImportButton page="resume" language={language} />
        </div>
      )}

      {/* <div className="content-card">
        <button className="btn-primary" onClick={handleDownload}>
          <EditableText
            value={t.download}
            field="download"
            page="resume"
            language={language}
            onSave={(v) => handleFieldSave('download', v)}
          />
        </button>
      </div> */}

      <div className="content-card">
        <h2>
          <EditableText
            value={t.skills}
            field="skills"
            page="resume"
            language={language}
            onSave={(v) => handleFieldSave('skills', v)}
          />
        </h2>
        <p style={{ whiteSpace: 'pre-line', margin: 0 }}>
          <EditableText
            value={t.skillsList}
            field="skillsList"
            page="resume"
            language={language}
            multiline
            onSave={(v) => handleFieldSave('skillsList', v)}
          />
        </p>
      </div>

      <div className="content-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <h2 style={{ marginBottom: "0" }}>
          <EditableText
            value={t.preview || (language === 'en' ? "Resume Preview" : "Aperçu du CV")}
            field="preview"
            page="resume"
            language={language}
            onSave={(v) => handleFieldSave('preview', v)}
          />
        </h2>
        <div
          className="resume-preview-container"
          style={{
            width: '100%',
            background: '#333',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '4px solid var(--color-black)',
            boxShadow: '8px 8px 0 var(--color-black)',
            overflow: 'hidden',
            aspectRatio: '1 / 1.3',
            maxHeight: '1500px'
          }}
        >
          {previewUrl ? (
            <iframe
              src={`${previewUrl}#navpanes=0&zoom=FitH`}
              title="Resume Preview"
              width="100%"
              height="100%"
              style={{ border: 'none' }}
              className="resume-iframe"
            />
          ) : (
            <p style={{ color: 'var(--color-yellow)' }}>
              {language === 'en'
                ? 'No resume uploaded yet. Visit the Dashboard to upload one.'
                : 'Aucun CV téléversé pour le moment. Visitez le tableau de bord pour en ajouter un.'}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button className="btn-primary" onClick={handleDownload}>
            <EditableText
              value={t.download}
              field="download"
              page="resume"
              language={language}
              onSave={(v) => handleFieldSave('download', v)}
            />
          </button>
        </div>
      </div>

      <style>{`
        .resume-preview-container {
          height: auto;
        }
        @media (max-width: 768px) {
          .resume-preview-container {
            border-width: 2px !important;
            box-shadow: 4px 4px 0 var(--color-black) !important;
          }
        }
      `}</style>

      <div className="content-card">
        <h2>
          <EditableText
            value={t.experience}
            field="experience"
            page="resume"
            language={language}
            onSave={(v) => handleFieldSave('experience', v)}
          />
        </h2>
        <EditableList
          items={t.jobs || []}
          field="jobs"
          page="resume"
          language={language}
          onSave={(jobs) => handleFieldSave('jobs', jobs)}
          itemFields={jobFields}
          renderItem={(job, index) => (
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
                  color: 'var(--color-magenta)',
                  fontSize: 'clamp(14px, 2vw, 16px)',
                  fontWeight: '900',
                  // fontFamily: 'var(--font-bold)'
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
          )}
        />
      </div>

      <div className="content-card">
        <h2>
          <EditableText
            value={t.education}
            field="education"
            page="resume"
            language={language}
            onSave={(v) => handleFieldSave('education', v)}
          />
        </h2>
        <EditableList
          items={t.schools || []}
          field="schools"
          page="resume"
          language={language}
          onSave={(schools) => handleFieldSave('schools', schools)}
          itemFields={schoolFields}
          renderItem={(school, index) => (
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
                  color: 'var(--color-magenta)',
                  fontSize: 'clamp(14px, 2vw, 16px)',
                  fontWeight: '900',
                  // fontFamily: 'var(--font-bold)'
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
          )}
        />
      </div>


      {/* <div className="content-card">
        <h2>
          <EditableText
            value={t.certifications}
            field="certifications"
            page="resume"
            language={language}
            onSave={(v) => handleFieldSave('certifications', v)}
          />
        </h2>
        {t.certs?.map((cert, index) => (
          <p key={index} style={{
            margin: '8px 0',
            color: 'var(--color-neon-green)',
            fontSize: 'clamp(16px, 2.5vw, 18px)',
            fontWeight: '700'
          }}>
            • <EditableText
              value={cert}
              field={`certs[${index}]`}
              page="resume"
              language={language}
              onSave={async (v) => {
                const newCerts = [...t.certs];
                newCerts[index] = v;
                await handleFieldSave('certs', newCerts);
              }}
            />
          </p>
        ))}
      </div> */}
    </div>
  );
}