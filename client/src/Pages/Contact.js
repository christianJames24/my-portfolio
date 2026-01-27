// Contact.js
import React, { useContext, useState, useEffect } from "react";
import { LanguageContext } from "../App";
import { sanitizeInput, validateContactForm } from "../utils/inputValidation";

export default function Contact() {
    const { language } = useContext(LanguageContext);
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [loading, setLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [contactInfo, setContactInfo] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    const t = {
        en: {
            title: "Contact",
            subtitle: "Get in Touch",
            nameLabel: "Your Name",
            emailLabel: "Your Email",
            messageLabel: "Your Message",
            send: "Send Message",
            sending: "Sending...",
            success: "Message sent successfully! I'll get back to you soon.",
            error: "Failed to send message. Please try again.",
            infoTitle: "Contact Information",
            email: "Email",
            phone: "Phone",
            location: "Location",
        },
        fr: {
            title: "Contact",
            subtitle: "Contactez-moi",
            nameLabel: "Votre Nom",
            emailLabel: "Votre Email",
            messageLabel: "Votre Message",
            send: "Envoyer",
            sending: "Envoi en cours...",
            success: "Message envoyé avec succès! Je vous répondrai bientôt.",
            error: "Échec de l'envoi. Veuillez réessayer.",
            infoTitle: "Coordonnées",
            email: "Courriel",
            phone: "Téléphone",
            location: "Lieu",
        },
    }[language];

    useEffect(() => {
        const pageTitle = language === "en" ? "Contact" : "Contact";
        document.title = `Christian James Lee - ${pageTitle}`;
    }, [language]);

    // Fetch contact info from API
    useEffect(() => {
        const fetchContactInfo = async () => {
            try {
                const res = await fetch(`/api/content/contact_info?lang=${language}`);
                const data = await res.json();
                if (!data.useClientFallback) {
                    setContactInfo(data);
                }
            } catch (err) {
                console.error("Error fetching contact info:", err);
            }
        };
        fetchContactInfo();
    }, [language]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const sanitizedValue = sanitizeInput(value);
        setFormData({ ...formData, [name]: sanitizedValue });
        
        // Clear validation error for this field when user starts typing
        if (validationErrors[name]) {
            setValidationErrors({ ...validationErrors, [name]: "" });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Client-side validation
        const validation = validateContactForm(formData);
        if (!validation.isValid) {
            setValidationErrors(validation.errors);
            setSubmitStatus("validation-error");
            return;
        }
        
        setLoading(true);
        setSubmitStatus(null);
        setValidationErrors({});

        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setSubmitStatus("success");
                setFormData({ name: "", email: "", message: "" });
            } else {
                const data = await res.json();
                setSubmitStatus("error");
                
                // Handle server-side validation errors
                if (data.details) {
                    const serverErrors = {};
                    data.details.forEach(err => {
                        serverErrors[err.field] = err.message;
                    });
                    setValidationErrors(serverErrors);
                }
                console.error("Error:", data.error);
            }
        } catch (err) {
            setSubmitStatus("error");
            console.error("Error sending message:", err);
        }
        setLoading(false);
    };

    const inputStyle = (hasError) => ({
        width: "100%",
        padding: "16px",
        border: hasError ? "4px solid var(--color-magenta)" : "4px solid var(--color-black)",
        background: "var(--color-white)",
        color: "var(--color-black)",
        fontSize: "16px",
        fontFamily: "var(--font-body)",
        marginBottom: "4px",
        boxShadow: hasError ? "4px 4px 0 var(--color-magenta)" : "4px 4px 0 var(--color-black)",
        boxSizing: "border-box",
        outline: "none",
    });
    
    const errorStyle = {
        color: "var(--color-magenta)",
        fontSize: "14px",
        marginBottom: "12px",
        fontWeight: "600",
    };

    return (
        <div className="page-container contact-page">
            <h1>{t.title}</h1>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                {/* Contact Form */}
                <div className="content-card">
                    <h2 style={{ marginBottom: "24px", color: "var(--color-neon-green)" }}>
                        {t.subtitle}
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <label
                            htmlFor="name"
                            style={{
                                display: "block",
                                marginBottom: "8px",
                                fontWeight: "700",
                                textTransform: "uppercase",
                                fontSize: "14px",
                                color: "var(--color-cyan)",
                            }}
                        >
                            {t.nameLabel}
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            maxLength="100"
                            style={inputStyle(validationErrors.name)}
                            aria-invalid={!!validationErrors.name}
                            aria-describedby={validationErrors.name ? "name-error" : undefined}
                        />
                        {validationErrors.name && (
                            <div id="name-error" style={errorStyle}>{validationErrors.name}</div>
                        )}

                        <label
                            htmlFor="email"
                            style={{
                                display: "block",
                                marginBottom: "8px",
                                fontWeight: "700",
                                textTransform: "uppercase",
                                fontSize: "14px",
                                color: "var(--color-cyan)",
                            }}
                        >
                            {t.emailLabel}
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            maxLength="255"
                            style={inputStyle(validationErrors.email)}
                            aria-invalid={!!validationErrors.email}
                            aria-describedby={validationErrors.email ? "email-error" : undefined}
                        />
                        {validationErrors.email && (
                            <div id="email-error" style={errorStyle}>{validationErrors.email}</div>
                        )}

                        <label
                            htmlFor="message"
                            style={{
                                display: "block",
                                marginBottom: "8px",
                                fontWeight: "700",
                                textTransform: "uppercase",
                                fontSize: "14px",
                                color: "var(--color-cyan)",
                            }}
                        >
                            {t.messageLabel}
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            rows={6}
                            maxLength="5000"
                            style={{ ...inputStyle(validationErrors.message), resize: "vertical", minHeight: "150px" }}
                            aria-invalid={!!validationErrors.message}
                            aria-describedby={validationErrors.message ? "message-error" : undefined}
                        />
                        {validationErrors.message && (
                            <div id="message-error" style={errorStyle}>{validationErrors.message}</div>
                        )}

                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                            style={{ width: "100%" }}
                        >
                            {loading ? t.sending : t.send}
                        </button>

                        {submitStatus === "success" && (
                            <p
                                style={{
                                    marginTop: "16px",
                                    padding: "12px 16px",
                                    background: "var(--color-neon-green)",
                                    color: "var(--color-black)",
                                    fontWeight: "700",
                                    border: "3px solid var(--color-black)",
                                    boxShadow: "4px 4px 0 var(--color-black)",
                                }}
                            >
                                {t.success}
                            </p>
                        )}

                        {submitStatus === "error" && (
                            <p
                                style={{
                                    marginTop: "16px",
                                    padding: "12px 16px",
                                    background: "var(--color-red-pink)",
                                    color: "var(--color-white)",
                                    fontWeight: "700",
                                    border: "3px solid var(--color-black)",
                                    boxShadow: "4px 4px 0 var(--color-black)",
                                }}
                            >
                                {t.error}
                            </p>
                        )}
                    </form>
                </div>

                {/* Contact Info */}
                <div className="content-card">
                    <h2 style={{ marginBottom: "24px", color: "var(--color-magenta)", wordBreak: "break-word", overflowWrap: "break-word" }}>
                        {t.infoTitle}
                    </h2>

                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        {contactInfo?.email && (
                            <div>
                                <h3
                                    style={{
                                        fontSize: "14px",
                                        textTransform: "uppercase",
                                        color: "var(--color-cyan)",
                                        marginBottom: "4px",
                                    }}
                                >
                                    {t.email}
                                </h3>
                                <a
                                    href={`mailto:${contactInfo.email}`}
                                    style={{
                                        color: "var(--color-neon-green)",
                                        fontSize: "18px",
                                        fontWeight: "700",
                                        textDecoration: "none",
                                    }}
                                >
                                    {contactInfo.email}
                                </a>
                            </div>
                        )}

                        {contactInfo?.phone && (
                            <div>
                                <h3
                                    style={{
                                        fontSize: "14px",
                                        textTransform: "uppercase",
                                        color: "var(--color-cyan)",
                                        marginBottom: "4px",
                                    }}
                                >
                                    {t.phone}
                                </h3>
                                <span style={{ color: "var(--color-white)", fontSize: "18px" }}>
                                    {contactInfo.phone}
                                </span>
                            </div>
                        )}

                        {contactInfo?.location && (
                            <div>
                                <h3
                                    style={{
                                        fontSize: "14px",
                                        textTransform: "uppercase",
                                        color: "var(--color-cyan)",
                                        marginBottom: "4px",
                                    }}
                                >
                                    {t.location}
                                </h3>
                                <span style={{ color: "var(--color-white)", fontSize: "18px" }}>
                                    {contactInfo.location}
                                </span>
                            </div>
                        )}

                        {contactInfo?.socials && (
                            <div style={{ marginTop: "12px" }}>
                                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                                    {contactInfo.socials.github && (
                                        <a
                                            href={contactInfo.socials.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                padding: "10px 20px",
                                                background: "var(--color-black)",
                                                color: "var(--color-white)",
                                                border: "3px solid var(--color-neon-green)",
                                                fontWeight: "700",
                                                textDecoration: "none",
                                                textTransform: "uppercase",
                                                fontSize: "14px",
                                            }}
                                        >
                                            GitHub
                                        </a>
                                    )}
                                    {contactInfo.socials.linkedin && (
                                        <a
                                            href={contactInfo.socials.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                padding: "10px 20px",
                                                background: "var(--color-black)",
                                                color: "var(--color-white)",
                                                border: "3px solid var(--color-cyan)",
                                                fontWeight: "700",
                                                textDecoration: "none",
                                                textTransform: "uppercase",
                                                fontSize: "14px",
                                            }}
                                        >
                                            LinkedIn
                                        </a>
                                    )}
                                    {contactInfo.socials.twitter && (
                                        <a
                                            href={contactInfo.socials.twitter}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                padding: "10px 20px",
                                                background: "var(--color-black)",
                                                color: "var(--color-white)",
                                                border: "3px solid var(--color-magenta)",
                                                fontWeight: "700",
                                                textDecoration: "none",
                                                textTransform: "uppercase",
                                                fontSize: "14px",
                                            }}
                                        >
                                            Twitter
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}

                        {!contactInfo && (
                            <p style={{ color: "var(--color-white)", opacity: 0.7 }}>
                                Contact information will be displayed here once configured.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
        @media (max-width: 900px) {
          .contact-page > div {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
        </div>
    );
}
