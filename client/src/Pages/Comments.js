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
      posting: "Posting..."
    },
    fr: {
      title: "Commentaires",
      placeholder: "Laisser un commentaire...",
      submit: "Soumettre",
      login: "Connexion pour commenter",
      loginMessage: "Vous devez être connecté pour commenter",
      delete: "Supprimer",
      noComments: "Pas encore de commentaires.",
      posting: "Publication..."
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

  return (
    <div className="page-container comments-page">
      <h1 style={{ whiteSpace: 'nowrap' }}>{t.title}</h1>

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
                width: '100%',
                minHeight: '100px',
                padding: '12px',
                border: '3px solid #000000',
                borderRadius: '8px',
                fontSize: '16px',
                fontFamily: 'inherit',
                resize: 'vertical',
                marginBottom: '16px'
              }}
            />
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? t.posting : t.submit}
            </button>
          </form>
        ) : (
          <div>
            <p className="login-message" style={{
              fontSize: 'clamp(16px, 2.5vw, 19px)',
              marginBottom: '20px'
            }}>
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
          <div className="content-card empty-state">{t.noComments}</div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="comment-card"
              style={{
                background: "white",
                padding: "15px",
                margin: "10px 0",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                {comment.user_picture && (
                  <img
                    src={comment.user_picture}
                    alt={comment.user_name}
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      marginRight: "10px",
                    }}
                  />
                )}
                <strong>{comment.user_name}</strong>
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    style={{
                      marginLeft: "auto",
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    {t.delete}
                  </button>
                )}
              </div>
              <p>{comment.text}</p>
              <span style={{ fontSize: "12px", color: "#666" }}>
                {new Date(comment.created_at).toLocaleDateString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}