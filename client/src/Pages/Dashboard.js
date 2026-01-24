// Dashboard.js
import React, { useContext, useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../App";

export default function Dashboard() {
  const { language } = useContext(LanguageContext);
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("comments");
  const [comments, setComments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [imageMode, setImageMode] = useState("url"); // "url" or "upload"
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [storageStats, setStorageStats] = useState(null);
  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: "",
    location: "",
    socials: { github: "", linkedin: "" }
  });
  const [savingContact, setSavingContact] = useState(false);
  const [resumes, setResumes] = useState({ en: null, fr: null });
  const [uploadingResume, setUploadingResume] = useState(null);

  useEffect(() => {
    const pageTitle = language === 'en' ? 'Dashboard' : 'Tableau de bord';
    document.title = `Christian James Lee - ${pageTitle}`;
  }, [language]);

  const [projectForm, setProjectForm] = useState({
    name_en: "",
    name_fr: "",
    description_en: "",
    description_fr: "",
    tech: "",
    year: "",
    image: "",
    image_id: null,
    sort_order: 0,
  });

  const t = {
    en: {
      title: "Dashboard",
      comments: "Testimonials",
      projects: "Projects",
      pending: "Pending",
      approved: "Approved",
      rejected: "Rejected",
      approve: "Approve",
      reject: "Reject",
      delete: "Delete",
      edit: "Edit",
      add: "Add Project",
      save: "Save",
      cancel: "Cancel",
      exportEn: "Export EN",
      exportFr: "Export FR",
      noComments: "No testimonials to review",
      noProjects: "No projects yet",
      english: "English",
      french: "French",
      name: "Name",
      description: "Description",
      tech: "Technologies",
      year: "Year",
      image: "Image",
      imageUrl: "URL",
      imageUpload: "Upload",
      uploading: "Uploading...",
      storageUsed: "Storage",
      images: "Images",
      noImages: "No uploaded images",
      inUse: "In use by",
      unused: "Unused",
      confirmDeleteImage: "Delete this image?",
      order: "Sort Order",
      messages: "Messages",
      settings: "Settings",
      noMessages: "No messages yet",
      email: "Email",
      phone: "Phone",
      location: "Location",
      github: "GitHub URL",
      linkedin: "LinkedIn URL",
      twitter: "Twitter URL",
      contactInfo: "Contact Information",
      socialLinks: "Social Links",
      saving: "Saving...",
      saved: "Saved!",
      resumeUpload: "Resume Upload",
      uploadEn: "Upload English Resume (PDF)",
      uploadFr: "Upload French Resume (PDF)",
      currentFile: "Current file:",
      uploadSuccess: "Resume uploaded successfully!",
      markRead: "Mark as Read",
      unread: "Unread",
    },
    fr: {
      title: "Tableau de Bord",
      comments: "Témoignages",
      projects: "Projets",
      pending: "En attente",
      approved: "Approuvé",
      rejected: "Rejeté",
      approve: "Approuver",
      reject: "Rejeter",
      delete: "Supprimer",
      edit: "Modifier",
      add: "Ajouter Projet",
      save: "Sauvegarder",
      cancel: "Annuler",
      exportEn: "Exporter EN",
      exportFr: "Exporter FR",
      noComments: "Aucun témoignage à examiner",
      noProjects: "Aucun projet pour le moment",
      english: "Anglais",
      french: "Français",
      name: "Nom",
      description: "Description",
      tech: "Technologies",
      year: "Année",
      image: "Image",
      imageUrl: "URL",
      imageUpload: "Téléverser",
      uploading: "Téléversement...",
      storageUsed: "Stockage",
      images: "Images",
      noImages: "Aucune image téléversée",
      inUse: "Utilisé par",
      unused: "Inutilisé",
      confirmDeleteImage: "Supprimer cette image ?",
      order: "Ordre",
      messages: "Messages",
      settings: "Paramètres",
      noMessages: "Aucun message pour le moment",
      email: "Courriel",
      phone: "Téléphone",
      location: "Lieu",
      github: "URL GitHub",
      linkedin: "URL LinkedIn",
      twitter: "URL Twitter",
      contactInfo: "Coordonnées",
      socialLinks: "Liens sociaux",
      saving: "Enregistrement...",
      saved: "Enregistré!",
      resumePdf: "URL du CV PDF",
      markRead: "Marquer comme lu",
      unread: "Non lu",
    },
  }[language];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = await getAccessTokenSilently();
      const headers = { Authorization: `Bearer ${token}` };

      const [commentsRes, projectsRes, statsRes, messagesRes, contactRes] = await Promise.all([
        fetch("/api/dashboard/comments", { headers }),
        fetch("/api/dashboard/projects", { headers }),
        fetch("/api/uploads/stats/usage", { headers }),
        fetch("/api/messages", { headers }),
        fetch("/api/content/contact_info?lang=en"),
      ]);

      if (commentsRes.status === 403 || projectsRes.status === 403) {
        navigate("/");
        return;
      }

      setComments(await commentsRes.json());
      setProjects(await projectsRes.json());
      if (statsRes.ok) {
        setStorageStats(await statsRes.json());
      }
      if (messagesRes.ok) {
        setMessages(await messagesRes.json());
      }
      if (contactRes.ok) {
        const contactData = await contactRes.json();
        if (!contactData.useClientFallback) {
          // Filter out twitter if present in old data
          const { twitter, ...otherSocials } = contactData.socials || {};
          setContactInfo({
            ...contactData,
            socials: otherSocials
          });
        }
      }

      // Fetch resume info
      try {
        const resumesRes = await fetch("/api/resumes/info/all", { headers });
        if (resumesRes.ok) {
          const resumesData = await resumesRes.json();
          const newResumes = { en: null, fr: null };
          resumesData.forEach(r => {
            if (newResumes[r.language] !== undefined) {
              newResumes[r.language] = r;
            }
          });
          setResumes(newResumes);
        }
      } catch (e) {
        console.error("Error fetching resumes:", e);
      }

      // Fetch images list (don't sync on every load - it might remove valid entries)
      const imagesRes = await fetch("/api/uploads/list/all", { headers });
      if (imagesRes.ok) {
        const images = await imagesRes.json();
        console.log("Fetched images:", images.length);
        setUploadedImages(images);
      } else {
        console.error("Images fetch failed:", imagesRes.status, await imagesRes.text());
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      navigate("/");
    }
    setLoading(false);
  };

  const handleCommentAction = async (id, action) => {
    try {
      const token = await getAccessTokenSilently();
      await fetch(`/api/dashboard/comments/${id}/${action}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
    } catch (err) {
      console.error(`Error ${action} comment:`, err);
    }
  };

  const handleDeleteComment = async (id) => {
    if (!window.confirm("Delete this comment permanently?")) return;
    try {
      const token = await getAccessTokenSilently();
      await fetch(`/api/comments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await getAccessTokenSilently();
      const url = editingProject
        ? `/api/dashboard/projects/${editingProject.id}`
        : "/api/dashboard/projects";
      const method = editingProject ? "PUT" : "POST";

      await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(projectForm),
      });

      setShowProjectForm(false);
      setEditingProject(null);
      setProjectForm({
        name_en: "",
        name_fr: "",
        description_en: "",
        description_fr: "",
        tech: "",
        year: "",
        image: "",
        image_id: null,
        sort_order: 0,
      });
      setImagePreview(null);
      setImageMode("url");
      fetchData();
    } catch (err) {
      console.error("Error saving project:", err);
    }
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setProjectForm({
      name_en: project.name_en,
      name_fr: project.name_fr,
      description_en: project.description_en,
      description_fr: project.description_fr,
      tech: project.tech,
      year: project.year,
      image: project.image || "",
      image_id: project.image_id || null,
      sort_order: project.sort_order || 0,
    });
    setImageMode(project.image_id ? "upload" : "url");
    setImagePreview(project.image_id ? `/api/uploads/${project.image_id}` : null);
    setShowProjectForm(true);
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      const token = await getAccessTokenSilently();
      await fetch(`/api/dashboard/projects/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  const handleMoveProject = async (projectId, direction) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const currentOrder = project.sort_order ?? 0;
    const newOrder = direction === "up" ? currentOrder - 1 : currentOrder + 1;

    try {
      const token = await getAccessTokenSilently();
      await fetch(`/api/dashboard/projects/${projectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...project, sort_order: newOrder }),
      });
      fetchData();
    } catch (err) {
      console.error("Error moving project:", err);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const token = await getAccessTokenSilently();
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/uploads", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.error || "Upload failed");
        return;
      }

      const data = await res.json();

      // Only update project form if we're in the project form context
      if (showProjectForm) {
        setProjectForm({ ...projectForm, image: null, image_id: data.id });
        setImagePreview(data.url);
      }

      // Refresh all data (stats + images list)
      fetchData();
    } catch (err) {
      console.error("Error uploading image:", err);
      alert("Upload failed");
    } finally {
      setUploading(false);
      // Reset file input
      e.target.value = "";
    }
  };

  const handleExport = (lang) => {
    const isEnglish = lang === "en";

    const exportData = {
      title: isEnglish ? "Projects" : "Projets",
      projects: projects.map((p) => ({
        name: isEnglish ? p.name_en : p.name_fr,
        description: isEnglish ? p.description_en : p.description_fr,
        tech: p.tech,
        year: p.year,
        image: p.image,
      })),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `projects-${lang}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "var(--color-yellow)";
      case "approved":
        return "var(--color-neon-green)";
      case "rejected":
        return "var(--color-red-pink)";
      default:
        return "var(--color-white)";
    }
  };

  const pendingCount = comments.filter((c) => c.status === "pending").length;

  if (loading) {
    return (
      <div className="page-container">
        <h1>{t.title}</h1>
        <div className="content-card">Loading...</div>
      </div>
    );
  }

  return (
    <div className="page-container dashboard-page">
      <h1>{t.title}</h1>

      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "24px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => setActiveTab("comments")}
          className={`btn-tab ${activeTab === "comments" ? "active" : ""}`}
          style={{
            padding: "12px 24px",
            border: "4px solid var(--color-black)",
            background:
              activeTab === "comments"
                ? "var(--color-cyan)"
                : "var(--color-white)",
            color:
              activeTab === "comments"
                ? "var(--color-white)"
                : "var(--color-black)",
            fontWeight: "900",
            fontSize: "16px",
            cursor: "pointer",
            boxShadow: "4px 4px 0 var(--color-black)",
            textTransform: "uppercase",
            position: "relative",
          }}
        >
          {t.comments}
          {pendingCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-8px",
                right: "-8px",
                background: "var(--color-red-pink)",
                color: "var(--color-white)",
                borderRadius: "50%",
                width: "24px",
                height: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                border: "2px solid var(--color-black)",
              }}
            >
              {pendingCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("projects")}
          className={`btn-tab ${activeTab === "projects" ? "active" : ""}`}
          style={{
            padding: "12px 24px",
            border: "4px solid var(--color-black)",
            background:
              activeTab === "projects"
                ? "var(--color-magenta)"
                : "var(--color-white)",
            color:
              activeTab === "projects"
                ? "var(--color-white)"
                : "var(--color-black)",
            fontWeight: "900",
            fontSize: "16px",
            cursor: "pointer",
            boxShadow: "4px 4px 0 var(--color-black)",
            textTransform: "uppercase",
          }}
        >
          {t.projects}
        </button>
        <button
          onClick={() => setActiveTab("images")}
          className={`btn-tab ${activeTab === "images" ? "active" : ""}`}
          style={{
            padding: "12px 24px",
            border: "4px solid var(--color-black)",
            background:
              activeTab === "images"
                ? "var(--color-neon-green)"
                : "var(--color-white)",
            color:
              activeTab === "images"
                ? "var(--color-black)"
                : "var(--color-black)",
            fontWeight: "900",
            fontSize: "16px",
            cursor: "pointer",
            boxShadow: "4px 4px 0 var(--color-black)",
            textTransform: "uppercase",
          }}
        >
          {t.images}
        </button>
        <button
          onClick={() => setActiveTab("messages")}
          className={`btn-tab ${activeTab === "messages" ? "active" : ""}`}
          style={{
            padding: "12px 24px",
            border: "4px solid var(--color-black)",
            background:
              activeTab === "messages"
                ? "var(--color-yellow)"
                : "var(--color-white)",
            color: "var(--color-black)",
            fontWeight: "900",
            fontSize: "16px",
            cursor: "pointer",
            boxShadow: "4px 4px 0 var(--color-black)",
            textTransform: "uppercase",
            position: "relative",
          }}
        >
          {t.messages}
          {messages.length > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-8px",
                right: "-8px",
                background: "var(--color-red-pink)",
                color: "var(--color-white)",
                borderRadius: "50%",
                width: "24px",
                height: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                border: "2px solid var(--color-black)",
              }}
            >
              {messages.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`btn-tab ${activeTab === "settings" ? "active" : ""}`}
          style={{
            padding: "12px 24px",
            border: "4px solid var(--color-black)",
            background:
              activeTab === "settings"
                ? "var(--color-cyan)"
                : "var(--color-white)",
            color:
              activeTab === "settings"
                ? "var(--color-white)"
                : "var(--color-black)",
            fontWeight: "900",
            fontSize: "16px",
            cursor: "pointer",
            boxShadow: "4px 4px 0 var(--color-black)",
            textTransform: "uppercase",
          }}
        >
          {t.settings}
        </button>
      </div>

      {activeTab === "comments" && (
        <div>
          {comments.length === 0 ? (
            <div className="content-card">
              <p>{t.noComments}</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="content-card"
                style={{ marginBottom: "16px" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: "12px" }}
                  >
                    {comment.user_picture && (
                      <img
                        src={comment.user_picture}
                        alt={comment.user_name}
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          border: "3px solid var(--color-neon-green)",
                        }}
                      />
                    )}
                    <div>
                      <strong style={{ color: "var(--color-neon-green)", fontFamily: "var(--font-body)" }}>
                        {comment.user_name}
                      </strong>
                      <span
                        style={{
                          marginLeft: "12px",
                          padding: "4px 12px",
                          background: getStatusColor(comment.status),
                          color: "var(--color-black)",
                          fontSize: "12px",
                          fontWeight: "900",
                          textTransform: "uppercase",
                          border: "2px solid var(--color-black)",
                        }}
                      >
                        {t[comment.status] || comment.status}
                      </span>
                    </div>
                  </div>
                  <span style={{ color: "var(--color-cyan)", fontSize: "14px" }}>
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p style={{ margin: "16px 0", color: "var(--color-white)" }}>
                  {comment.text}
                </p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {comment.status === "pending" && (
                    <>
                      <button
                        onClick={() =>
                          handleCommentAction(comment.id, "approve")
                        }
                        className="btn-small"
                        style={{
                          background: "var(--color-neon-green)",
                          color: "var(--color-black)",
                        }}
                      >
                        {t.approve}
                      </button>
                      <button
                        onClick={() => handleCommentAction(comment.id, "reject")}
                        className="btn-small"
                        style={{
                          background: "var(--color-yellow)",
                          color: "var(--color-black)",
                        }}
                      >
                        {t.reject}
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="btn-small"
                    style={{
                      background: "var(--color-red-pink)",
                      color: "var(--color-white)",
                    }}
                  >
                    {t.delete}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "projects" && (
        <div>
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginBottom: "24px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {storageStats && (
              <div
                style={{
                  padding: "8px 16px",
                  background: "var(--color-black)",
                  border: "2px solid var(--color-cyan)",
                  color: "var(--color-white)",
                  fontSize: "12px",
                  marginRight: "auto",
                }}
              >
                {t.storageUsed}: {Math.round(storageStats.storageUsed / 1024 / 1024)}MB / {Math.round(storageStats.storageLimit / 1024 / 1024)}MB
                {" • "}
                {storageStats.projectCount} {t.projects.toLowerCase()}
              </div>
            )}
            <button
              onClick={() => {
                setEditingProject(null);
                setProjectForm({
                  name_en: "",
                  name_fr: "",
                  description_en: "",
                  description_fr: "",
                  tech: "",
                  year: "",
                  image: "",
                  image_id: null,
                  sort_order: 0,
                });
                setImageMode("url");
                setImagePreview(null);
                setShowProjectForm(true);
              }}
              className="btn-primary"
            >
              {t.add}
            </button>
            <button
              onClick={() => handleExport("en")}
              className="btn-primary"
              style={{ background: "var(--color-cyan)" }}
            >
              {t.exportEn}
            </button>
            <button
              onClick={() => handleExport("fr")}
              className="btn-primary"
              style={{ background: "var(--color-magenta)" }}
            >
              {t.exportFr}
            </button>
          </div>

          {showProjectForm && (
            <div className="content-card" style={{ marginBottom: "24px" }}>
              <form onSubmit={handleProjectSubmit}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        color: "var(--color-cyan)",
                        marginBottom: "12px",
                      }}
                    >
                      {t.english}
                    </h3>
                    <label className="form-label">{t.name}</label>
                    <input
                      type="text"
                      value={projectForm.name_en}
                      onChange={(e) =>
                        setProjectForm({ ...projectForm, name_en: e.target.value })
                      }
                      className="form-input"
                      required
                    />
                    <label className="form-label">{t.description}</label>
                    <textarea
                      value={projectForm.description_en}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          description_en: e.target.value,
                        })
                      }
                      className="form-textarea"
                      required
                    />
                  </div>
                  <div>
                    <h3
                      style={{
                        color: "var(--color-magenta)",
                        marginBottom: "12px",
                      }}
                    >
                      {t.french}
                    </h3>
                    <label className="form-label">{t.name}</label>
                    <input
                      type="text"
                      value={projectForm.name_fr}
                      onChange={(e) =>
                        setProjectForm({ ...projectForm, name_fr: e.target.value })
                      }
                      className="form-input"
                      required
                    />
                    <label className="form-label">{t.description}</label>
                    <textarea
                      value={projectForm.description_fr}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          description_fr: e.target.value,
                        })
                      }
                      className="form-textarea"
                      required
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr 1fr",
                    gap: "16px",
                    marginTop: "16px",
                  }}
                >
                  <div>
                    <label className="form-label">{t.tech}</label>
                    <input
                      type="text"
                      value={projectForm.tech}
                      onChange={(e) =>
                        setProjectForm({ ...projectForm, tech: e.target.value })
                      }
                      className="form-input"
                      placeholder="React • Node.js"
                    />
                  </div>
                  <div>
                    <label className="form-label">{t.year}</label>
                    <input
                      type="text"
                      value={projectForm.year}
                      onChange={(e) =>
                        setProjectForm({ ...projectForm, year: e.target.value })
                      }
                      className="form-input"
                      placeholder="2024"
                    />
                  </div>
                  <div>
                    <label className="form-label">{t.image}</label>
                    <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                      <button
                        type="button"
                        onClick={() => {
                          setImageMode("url");
                          setProjectForm({ ...projectForm, image_id: null });
                          setImagePreview(null);
                        }}
                        style={{
                          padding: "6px 12px",
                          border: "2px solid var(--color-black)",
                          background: imageMode === "url" ? "var(--color-cyan)" : "var(--color-white)",
                          color: imageMode === "url" ? "var(--color-white)" : "var(--color-black)",
                          fontWeight: "700",
                          fontSize: "12px",
                          cursor: "pointer",
                        }}
                      >
                        {t.imageUrl}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setImageMode("upload");
                          setProjectForm({ ...projectForm, image: "" });
                        }}
                        style={{
                          padding: "6px 12px",
                          border: "2px solid var(--color-black)",
                          background: imageMode === "upload" ? "var(--color-magenta)" : "var(--color-white)",
                          color: imageMode === "upload" ? "var(--color-white)" : "var(--color-black)",
                          fontWeight: "700",
                          fontSize: "12px",
                          cursor: "pointer",
                        }}
                      >
                        {t.imageUpload}
                      </button>
                    </div>
                    {imageMode === "url" ? (
                      <input
                        type="text"
                        value={projectForm.image || ""}
                        onChange={(e) =>
                          setProjectForm({ ...projectForm, image: e.target.value })
                        }
                        className="form-input"
                        placeholder="https://..."
                      />
                    ) : (
                      <div>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/gif,image/webp"
                          onChange={handleImageUpload}
                          disabled={uploading}
                          style={{ marginBottom: "8px" }}
                        />
                        {uploading && (
                          <p style={{ color: "var(--color-yellow)", fontSize: "12px" }}>
                            {t.uploading}
                          </p>
                        )}
                        {imagePreview && (
                          <img
                            src={imagePreview}
                            alt="Preview"
                            style={{
                              maxWidth: "100%",
                              maxHeight: "150px",
                              marginTop: "8px",
                              border: "2px solid var(--color-neon-green)",
                            }}
                          />
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="form-label">{t.order}</label>
                    <input
                      type="number"
                      value={projectForm.sort_order}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          sort_order: parseInt(e.target.value) || 0,
                        })
                      }
                      className="form-input"
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    marginTop: "24px",
                  }}
                >
                  <button type="submit" className="btn-primary">
                    {t.save}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowProjectForm(false);
                      setEditingProject(null);
                    }}
                    className="btn-primary"
                    style={{
                      background: "var(--color-white)",
                      color: "var(--color-black)",
                    }}
                  >
                    {t.cancel}
                  </button>
                </div>
              </form>
            </div>
          )}

          {projects.length === 0 ? (
            <div className="content-card">
              <p>{t.noProjects}</p>
            </div>
          ) : (
            projects.map((project, index) => (
              <div
                key={project.id}
                className="content-card"
                style={{ marginBottom: "16px" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: "12px",
                  }}
                >
                  <div>
                    <h3 style={{ color: "var(--color-neon-green)", fontFamily: "var(--font-body)", margin: 0 }}>
                      {language === "fr" ? project.name_fr : project.name_en}
                    </h3>
                    <span style={{ color: "var(--color-cyan)", fontSize: "14px" }}>
                      {project.year} • Order: {project.sort_order || 0}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      <button
                        onClick={() => handleMoveProject(project.id, "up")}
                        disabled={index === 0}
                        className="btn-small"
                        style={{
                          background: index === 0 ? "var(--color-white)" : "var(--color-yellow)",
                          color: "var(--color-black)",
                          padding: "4px 8px",
                          opacity: index === 0 ? 0.5 : 1,
                        }}
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => handleMoveProject(project.id, "down")}
                        disabled={index === projects.length - 1}
                        className="btn-small"
                        style={{
                          background: index === projects.length - 1 ? "var(--color-white)" : "var(--color-yellow)",
                          color: "var(--color-black)",
                          padding: "4px 8px",
                          opacity: index === projects.length - 1 ? 0.5 : 1,
                        }}
                      >
                        ▼
                      </button>
                    </div>
                    <button
                      onClick={() => handleEditProject(project)}
                      className="btn-small"
                      style={{
                        background: "var(--color-cyan)",
                        color: "var(--color-black)",
                      }}
                    >
                      {t.edit}
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="btn-small"
                      style={{
                        background: "var(--color-red-pink)",
                        color: "var(--color-white)",
                      }}
                    >
                      {t.delete}
                    </button>
                  </div>
                </div>
                <p style={{ color: "var(--color-white)", margin: "12px 0" }}>
                  {language === "fr"
                    ? project.description_fr
                    : project.description_en}
                </p>
                <p style={{ color: "var(--color-magenta)", fontSize: "14px" }}>
                  {project.tech}
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "images" && (
        <div>
          {storageStats && (
            <div
              style={{
                padding: "12px 16px",
                background: "var(--color-black)",
                border: "2px solid var(--color-neon-green)",
                color: "var(--color-white)",
                fontSize: "14px",
                marginBottom: "24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <span>
                {t.storageUsed}: {Math.round(storageStats.storageUsed / 1024 / 1024)}MB / {Math.round(storageStats.storageLimit / 1024 / 1024)}MB
                {" ("}{storageStats.storagePercent}%{")"}  •  {uploadedImages.length} {t.images.toLowerCase()}
              </span>
              <label
                style={{
                  padding: "8px 16px",
                  background: "var(--color-neon-green)",
                  color: "var(--color-black)",
                  fontWeight: "900",
                  fontSize: "12px",
                  cursor: "pointer",
                  border: "2px solid var(--color-black)",
                  textTransform: "uppercase",
                }}
              >
                {uploading ? t.uploading : t.imageUpload}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  style={{ display: "none" }}
                />
              </label>
            </div>
          )}

          {uploadedImages.length === 0 ? (
            <div className="content-card">
              <p>{t.noImages}</p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "16px",
              }}
            >
              {uploadedImages.map((img) => (
                <div
                  key={img.id}
                  className="content-card"
                  style={{ padding: "12px" }}
                >
                  <img
                    src={img.url}
                    alt={img.originalName}
                    style={{
                      width: "100%",
                      height: "120px",
                      objectFit: "cover",
                      border: "2px solid var(--color-neon-green)",
                      marginBottom: "8px",
                    }}
                  />
                  <p style={{ color: "var(--color-white)", fontSize: "12px", margin: "4px 0", wordBreak: "break-all" }}>
                    {img.originalName}
                  </p>
                  <p style={{ color: "var(--color-cyan)", fontSize: "11px", margin: "4px 0" }}>
                    {Math.round(img.sizeBytes / 1024)}KB
                  </p>
                  <p style={{
                    color: img.usedBy ? "var(--color-neon-green)" : "var(--color-yellow)",
                    fontSize: "11px",
                    margin: "4px 0"
                  }}>
                    {img.usedBy ? `${t.inUse}: ${img.usedBy.projectName}` : t.unused}
                  </p>
                  {/* Image deletion intentionally disabled - images are permanent */}
                </div>
              ))}
            </div>
          )}
        </div>
      )
      }

      {activeTab === "messages" && (
        <div>
          {messages.length === 0 ? (
            <div className="content-card">
              <p>{t.noMessages}</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className="content-card"
                style={{ marginBottom: "16px" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: "12px",
                  }}
                >
                  <div>
                    <strong style={{ color: "var(--color-neon-green)", fontFamily: "var(--font-body)" }}>
                      {msg.name}
                    </strong>
                    <span
                      style={{
                        marginLeft: "12px",
                        color: "var(--color-cyan)",
                        fontSize: "14px",
                      }}
                    >
                      {msg.email}
                    </span>
                  </div>
                  <span style={{ color: "var(--color-cyan)", fontSize: "14px" }}>
                    {new Date(msg.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p style={{ margin: "16px 0", color: "var(--color-white)" }}>
                  {msg.message}
                </p>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  {!msg.read && (
                    <span style={{ color: "var(--color-yellow)", fontSize: "12px", fontWeight: "700", marginRight: "8px" }}>
                      ({t.unread})
                    </span>
                  )}
                  {!msg.read && (
                    <button
                      onClick={async () => {
                        try {
                          const token = await getAccessTokenSilently();
                          await fetch(`/api/messages/${msg.id}/read`, {
                            method: "PATCH",
                            headers: { Authorization: `Bearer ${token}` },
                          });
                          fetchData();
                        } catch (err) {
                          console.error("Error marking message as read:", err);
                        }
                      }}
                      className="btn-small"
                      style={{
                        background: "var(--color-neon-green)",
                        color: "var(--color-black)",
                      }}
                    >
                      {t.markRead}
                    </button>
                  )}
                  <button
                    onClick={async () => {
                      if (!window.confirm("Delete this message?")) return;
                      try {
                        const token = await getAccessTokenSilently();
                        await fetch(`/api/messages/${msg.id}`, {
                          method: "DELETE",
                          headers: { Authorization: `Bearer ${token}` },
                        });
                        fetchData();
                      } catch (err) {
                        console.error("Error deleting message:", err);
                      }
                    }}
                    className="btn-small"
                    style={{
                      background: "var(--color-red-pink)",
                      color: "var(--color-white)",
                    }}
                  >
                    {t.delete}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "settings" && (
        <div className="content-card">
          <h2 style={{ color: "var(--color-neon-green)", marginBottom: "24px" }}>
            {t.contactInfo}
          </h2>

          <div style={{ display: "grid", gap: "16px", maxWidth: "500px" }}>
            <div>
              <label className="form-label">{t.email}</label>
              <input
                type="email"
                className="form-input"
                value={contactInfo.email || ""}
                onChange={(e) =>
                  setContactInfo({ ...contactInfo, email: e.target.value })
                }
              />
            </div>
            <div>
              <label className="form-label">{t.phone}</label>
              <input
                type="tel"
                className="form-input"
                value={contactInfo.phone || ""}
                onChange={(e) =>
                  setContactInfo({ ...contactInfo, phone: e.target.value })
                }
              />
            </div>
            <div>
              <label className="form-label">{t.location}</label>
              <input
                type="text"
                className="form-input"
                value={contactInfo.location || ""}
                onChange={(e) =>
                  setContactInfo({ ...contactInfo, location: e.target.value })
                }
              />
            </div>

            <h3 style={{ color: "var(--color-magenta)", marginTop: "16px" }}>
              {t.socialLinks}
            </h3>

            <div>
              <label className="form-label">{t.github}</label>
              <input
                type="url"
                className="form-input"
                value={contactInfo.socials?.github || ""}
                onChange={(e) =>
                  setContactInfo({
                    ...contactInfo,
                    socials: { ...contactInfo.socials, github: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <label className="form-label">{t.linkedin}</label>
              <input
                type="url"
                className="form-input"
                value={contactInfo.socials?.linkedin || ""}
                onChange={(e) =>
                  setContactInfo({
                    ...contactInfo,
                    socials: { ...contactInfo.socials, linkedin: e.target.value },
                  })
                }
              />
            </div>
          </div>

          <h3 style={{ color: "var(--color-yellow)", marginTop: "24px" }}>
            {t.resumeUpload}
          </h3>

          <div style={{ display: "grid", gap: "16px" }}>
            {["en", "fr"].map((lang) => (
              <div key={lang} style={{ padding: "12px", border: "2px solid var(--color-black)", background: "var(--color-black)" }}>
                <label className="form-label" style={{ marginTop: 0 }}>
                  {lang === "en" ? t.uploadEn : t.uploadFr}
                </label>

                {resumes[lang] && (
                  <p style={{ color: "var(--color-neon-green)", fontSize: "12px", marginBottom: "8px" }}>
                    {t.currentFile} {resumes[lang].file_name} <br />
                    <span style={{ color: "var(--color-cyan)" }}>
                      ({new Date(resumes[lang].updated_at).toLocaleDateString()})
                    </span>
                  </p>
                )}

                <input
                  type="file"
                  accept="application/pdf"
                  disabled={uploadingResume === lang}
                  onChange={async (e) => {
                    if (!e.target.files[0]) return;
                    const file = e.target.files[0];
                    setUploadingResume(lang);

                    try {
                      const formData = new FormData();
                      formData.append("resume", file);

                      const token = await getAccessTokenSilently();
                      const res = await fetch(`/api/resumes/${lang}`, {
                        method: "POST",
                        headers: { Authorization: `Bearer ${token}` },
                        body: formData
                      });

                      if (res.ok) {
                        alert(t.uploadSuccess);
                        // Refresh data
                        fetchData();
                      } else {
                        const err = await res.json();
                        alert("Error: " + err.error);
                      }
                    } catch (err) {
                      console.error("Upload error:", err);
                      alert("Upload failed");
                    }
                    setUploadingResume(null);
                  }}
                  style={{ color: "var(--color-white)" }}
                />
                {uploadingResume === lang && <span style={{ color: "var(--color-yellow)", marginLeft: "8px" }}>{t.uploading}</span>}
              </div>
            ))}
          </div>

          <button
            className="btn-primary"
            disabled={savingContact}
            onClick={async () => {
              setSavingContact(true);
              try {
                const token = await getAccessTokenSilently();
                await fetch("/api/content/contact_info", {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    content: contactInfo,
                    language: "en",
                  }),
                });
                alert(t.saved);
              } catch (err) {
                console.error("Error saving contact info:", err);
              }
              setSavingContact(false);
            }}
            style={{ marginTop: "16px" }}
          >
            {savingContact ? t.saving : t.save}
          </button>
        </div>
      )}

      <style>{`
        .btn-small {
          padding: 8px 16px;
          border: 3px solid var(--color-black);
          font-weight: 900;
          font-size: 12px;
          cursor: pointer;
          text-transform: uppercase;
          box-shadow: 3px 3px 0 var(--color-black);
          transition: all 0.2s;
        }
        .btn-small:hover {
          transform: translate(-2px, -2px);
          box-shadow: 5px 5px 0 var(--color-black);
        }
        .form-label {
          display: block;
          color: var(--color-white);
          font-weight: 700;
          margin-bottom: 6px;
          margin-top: 12px;
          text-transform: uppercase;
          font-size: 12px;
          letter-spacing: 0.05em;
        }
        .form-input, .form-textarea {
          width: 100%;
          padding: 12px;
          border: 3px solid var(--color-neon-green);
          background: var(--color-black);
          color: var(--color-white);
          font-size: 14px;
          font-family: var(--font-body);
          box-sizing: border-box;
        }
        .form-textarea {
          min-height: 100px;
          resize: vertical;
        }
        @media (max-width: 768px) {
          .content-card > div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          .content-card > div[style*="grid-template-columns: 1fr 1fr 1fr 1fr"] {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </div >
  );
}