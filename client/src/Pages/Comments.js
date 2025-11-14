import React, { useContext, useState } from 'react';
import { LanguageContext, AuthContext } from '../App';

export default function Comments() {
  const { language } = useContext(LanguageContext);
  const { isAuthenticated } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const content = {
    en: {
      title: 'Comments',
      placeholder: 'Leave a comment...',
      submit: 'Submit',
      loginRequired: 'Please login to leave a comment',
      noComments: 'No comments yet. Be the first!'
    },
    fr: {
      title: 'Commentaires',
      placeholder: 'Laisser un commentaire...',
      submit: 'Soumettre',
      loginRequired: 'Veuillez vous connecter',
      noComments: 'Pas encore de commentaires.'
    }
  };

  const t = content[language];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim() && isAuthenticated) {
      setComments([...comments, {
        id: Date.now(),
        text: newComment,
        date: new Date().toLocaleDateString()
      }]);
      setNewComment('');
    }
  };

  return (
    <div className="page-container comments-page">
      <h1>{t.title}</h1>
      <div className="content-card">
        {isAuthenticated ? (
          <form onSubmit={handleSubmit}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={t.placeholder}
              className="comment-input"
            />
            <button type="submit" className="btn-primary">{t.submit}</button>
          </form>
        ) : (
          <p className="login-message">{t.loginRequired}</p>
        )}
      </div>

      <div className="comments-list">
        {comments.length === 0 ? (
          <div className="content-card empty-state">{t.noComments}</div>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="comment-card">
              <p>{comment.text}</p>
              <span className="comment-date">{comment.date}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}