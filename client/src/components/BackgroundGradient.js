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
        background: '#fafafa'
      }}
    >
      {/* Geometric accent shapes */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '5%',
        width: '300px',
        height: '300px',
        background: '#ffff00',
        opacity: 0.15,
        transform: 'rotate(45deg)',
        borderRadius: '20px'
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '15%',
        left: '8%',
        width: '200px',
        height: '200px',
        background: '#ff0055',
        opacity: 0.1,
        transform: 'rotate(-25deg)',
        borderRadius: '30px'
      }} />
      
      <div style={{
        position: 'absolute',
        top: '40%',
        left: '15%',
        width: '150px',
        height: '150px',
        background: '#00d4ff',
        opacity: 0.12,
        transform: 'rotate(15deg)',
        clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
      }} />

      {/* Grid pattern overlay */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundImage: `
          linear-gradient(rgba(0, 0, 0, 0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 0, 0, 0.02) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        opacity: 0.5
      }} />
    </div>
  );
}