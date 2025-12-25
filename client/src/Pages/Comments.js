// Comments.js
import React, { useContext, useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router-dom";
import { LanguageContext } from "../App";

export default function Comments() {
  const { language } = useContext(LanguageContext);
  const { isAuthenticated, loginWithRedirect, user, getAccessTokenSilently } =
    useAuth0();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState([]);

  const content = {
    en: {
      title: "Comments",
      placeholder: "Leave a comment...",
      submit: "Submit",
      login: "Login to Comment",
      loginMessage: "You must be logged in to comment",
      delete: "Delete",
      noComments: "No comments yet. Be the first!",
      posting: "Posting...",
    },
    fr: {
      title: "Commentaires",
      placeholder: "Laisser un commentaire...",
      submit: "Soumettre",
      login: "Connexion pour commenter",
      loginMessage: "Vous devez être connecté pour commenter",
      delete: "Supprimer",
      noComments: "Pas encore de commentaires.",
      posting: "Publication...",
    },
  };

  const t = content[language];
  const isAdmin = permissions.includes("delete:comments");
  const location = useLocation();

  useEffect(() => {
    fetchComments();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPermissions();
    }
  }, [isAuthenticated]);

  const fetchPermissions = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch("/api/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setPermissions(data.permissions);
    } catch (err) {
      console.error("Error fetching permissions:", err);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch("/api/comments");
      const data = await response.json();
      setComments(data);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const token = await getAccessTokenSilently();

      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: newComment,
          user_name: user.name,
          user_picture: user.picture,
        }),
      });

      if (response.ok) {
        setNewComment("");
        fetchComments();
      }
    } catch (err) {
      console.error("Error posting comment:", err);
      alert("Error posting comment");
    }
    setLoading(false);
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;

    try {
      const token = await getAccessTokenSilently();

      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        fetchComments();
      }
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  const getCardColors = (index) => {
    const colors = [
      { border: "var(--color-neon-green)", shadow: "var(--color-magenta)" },
      { border: "var(--color-magenta)", shadow: "var(--color-cyan)" },
      { border: "var(--color-cyan)", shadow: "var(--color-neon-green)" },
    ];
    return colors[index % 3];
  };

  return (
    <div className="page-container comments-page">
      <h1 style={{ whiteSpace: "nowrap" }}>{t.title}</h1>

      <div className="content-card">
        {isAuthenticated ? (
          <form onSubmit={handleSubmit}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={t.placeholder}
              className="comment-input"
              disabled={loading}
              style={{
                width: "100%",
                minHeight: "120px",
                padding: "16px",
                border: "4px solid var(--color-neon-green)",
                background: "var(--color-black)",
                color: "var(--color-white)",
                fontSize: "16px",
                fontFamily: "var(--font-body)",
                resize: "vertical",
                marginBottom: "20px",
                boxShadow: "6px 6px 0 var(--color-magenta)",
                outline: "none",
                boxSizing: "border-box", // ADD THIS LINE
              }}
            />
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? t.posting : t.submit}
            </button>
          </form>
        ) : (
          <div>
            <p
              className="login-message"
              style={{
                fontSize: "clamp(16px, 2.5vw, 19px)",
                marginBottom: "20px",
              }}
            >
              {t.loginMessage}
            </p>
            <button
              onClick={() =>
                loginWithRedirect({
                  appState: { returnTo: location.pathname },
                })
              }
              className="btn-primary"
            >
              {t.login}
            </button>
          </div>
        )}
      </div>

      <div className="comments-list">
        {comments.length === 0 ? (
          <div className="content-card empty-state">
            <p style={{ margin: 0, fontSize: "clamp(16px, 2.5vw, 19px)" }}>
              {t.noComments}
            </p>
          </div>
        ) : (
          comments.map((comment, index) => {
            const colors = getCardColors(index);
            return (
              <div
                key={comment.id}
                className="comment-card"
                style={{
                  background: "var(--color-dark-gray)",
                  padding: "20px",
                  margin: "20px 0",
                  border: `4px solid ${colors.border}`,
                  boxShadow: `8px 8px 0 ${colors.shadow}`,
                  transform: `skewY(${index % 2 === 0 ? "-1deg" : "1deg"})`,
                  transition: "all 0.2s",
                  clipPath:
                    index % 2 === 0
                      ? "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))"
                      : "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "skewY(0deg) translateY(-3px)";
                  e.currentTarget.style.boxShadow = `12px 12px 0 ${colors.shadow}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = `skewY(${
                    index % 2 === 0 ? "-1deg" : "1deg"
                  })`;
                  e.currentTarget.style.boxShadow = `8px 8px 0 ${colors.shadow}`;
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "12px",
                    gap: "12px",
                  }}
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
                        boxShadow: "2px 2px 0 var(--color-magenta)",
                      }}
                    />
                  )}
                  <strong
                    style={{
                      color: "var(--color-neon-green)",
                      fontSize: "18px",
                      fontFamily: "var(--font-bold)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {comment.user_name}
                  </strong>
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      style={{
                        marginLeft: "auto",
                        background: "var(--color-red-pink)",
                        color: "var(--color-white)",
                        border: "3px solid var(--color-black)",
                        padding: "8px 16px",
                        cursor: "pointer",
                        fontWeight: "900",
                        fontFamily: "var(--font-bold)",
                        textTransform: "uppercase",
                        fontSize: "12px",
                        letterSpacing: "0.05em",
                        boxShadow: "3px 3px 0 var(--color-black)",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform =
                          "translate(-2px, -2px)";
                        e.currentTarget.style.boxShadow =
                          "5px 5px 0 var(--color-black)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translate(0, 0)";
                        e.currentTarget.style.boxShadow =
                          "3px 3px 0 var(--color-black)";
                      }}
                    >
                      {t.delete}
                    </button>
                  )}
                </div>
                <p
                  style={{
                    color: "var(--color-white)",
                    fontSize: "16px",
                    lineHeight: "1.6",
                    margin: "0 0 12px 0",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {comment.text}
                </p>
                <span
                  style={{
                    fontSize: "13px",
                    color: "var(--color-cyan)",
                    fontFamily: "var(--font-bold)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
