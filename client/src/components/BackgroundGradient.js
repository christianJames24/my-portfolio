import React from 'react';

export default function BackgroundGradient({ scrollY }) {
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        background: 'linear-gradient(180deg, #a6c1c5ff 0%, #B2EBF2 50%, #80DEEA 100%)',
        transform: `translateY(${scrollY * 0.5}px)`
      }}
    >
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundImage: `
          radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.2) 0%, transparent 50%),
          radial-gradient(circle at 40% 20%, rgba(135, 206, 250, 0.2) 0%, transparent 40%)
        `
      }} />
    </div>
  );
}