import React from 'react';

export default function BackgroundGradient({ scrollY }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 0,
      background: '#fafafa',
      overflow: 'hidden'
    }}>
      <svg style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0.08
      }}>
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(0, 0, 0, 0.3)" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)"/>
      </svg>

      <div style={{
        position: 'absolute',
        width: '150%',
        height: '150%',
        top: '-25%',
        right: '-25%',
        background: 'linear-gradient(130deg, transparent 0%, transparent 45%, rgba(0, 0, 0, 0.03) 45%, rgba(0, 0, 0, 0.08) 75%)',
        transform: 'rotate(-22deg)',
        clipPath: 'polygon(100% 0, 100% 100%, 0 100%)'
      }} />

      <div style={{
        position: 'absolute',
        top: '10%',
        right: '8%',
        width: '40vw',
        height: '45vh',
        background: 'rgba(255, 255, 0, 0.06)',
        clipPath: 'polygon(0 0, 100% 8%, 92% 100%, 0 92%)',
        transform: 'rotate(10deg)',
        border: '2px solid rgba(255, 255, 0, 0.15)'
      }} />

      <div style={{
        position: 'absolute',
        bottom: '15%',
        left: '6%',
        width: '38vw',
        height: '42vh',
        background: 'rgba(0, 212, 255, 0.06)',
        clipPath: 'polygon(8% 0, 100% 0, 100% 100%, 0 92%)',
        transform: 'rotate(-12deg)',
        border: '2px solid rgba(0, 212, 255, 0.15)'
      }} />

      <div style={{
        position: 'absolute',
        top: '30px',
        left: '30px',
        width: '120px',
        height: '120px',
        borderLeft: '3px solid rgba(0, 0, 0, 0.12)',
        borderTop: '3px solid rgba(0, 0, 0, 0.12)'
      }}>
        <div style={{
          position: 'absolute',
          top: '-2px',
          left: '-2px',
          width: '35px',
          height: '35px',
          borderLeft: '2px solid rgba(255, 0, 85, 0.4)',
          borderTop: '2px solid rgba(255, 0, 85, 0.4)'
        }}/>
      </div>

      <div style={{
        position: 'absolute',
        bottom: '30px',
        right: '30px',
        width: '120px',
        height: '120px',
        borderRight: '3px solid rgba(0, 0, 0, 0.12)',
        borderBottom: '3px solid rgba(0, 0, 0, 0.12)'
      }}>
        <div style={{
          position: 'absolute',
          bottom: '-2px',
          right: '-2px',
          width: '35px',
          height: '35px',
          borderRight: '2px solid rgba(0, 212, 255, 0.4)',
          borderBottom: '2px solid rgba(0, 212, 255, 0.4)'
        }}/>
      </div>
    </div>
  );
}