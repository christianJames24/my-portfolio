// ContentSection.js
import React from 'react';

export default function ContentSection({ backendData }) {
  return (
    <div style={{
      position: 'relative',
      zIndex: 10,
      padding: '40px',
      maxWidth: '800px',
    }}>
      <h1 style={{
        fontSize: '48px',
        color: 'var(--color-blue-3)',
        textShadow: '0 2px 4px rgba(255, 255, 255, 0.5)',
        // fontFamily: 'system-ui, -apple-system, sans-serif',
        // fontWeight: '300',
        margin: '0 0 20px 0'
      }}>
        
      </h1>
      
      {/* {(typeof backendData.users === 'undefined') ? (
        <p style={{ color: 'var(--color-blue-3)', fontSize: '18px' }}>Loading...</p>
      ) : (
        backendData.users.map((user, i) => (
          <p key={i} style={{ color: 'var(--color-blue-3)', fontSize: '18px', margin: '8px 0' }}>{user}</p>
        ))
      )} */}
    </div>
  );
}