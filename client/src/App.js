import React, { useEffect, useState, useMemo } from "react";
import ThreeD from "./ThreeD";
import BubbleMenu from "./components/BubbleMenu";
import Modal from "./components/Modal";
import BackgroundGradient from "./components/BackgroundGradient";
import ContentSection from "./components/ContentSection";
// import Ballpit from "./components/Ballpit";
import "./styles/animations.css";

//https://youtu.be/w3vs4a03y3I?si=cJiFQ1nQtIqFaHwx GOATED VIDEO
//run frontend: npm start
//run backend: npm run dev

function App() {
  const [backendData, setBackendData] = useState([{}]);
  const [modals, setModals] = useState([]);
  const [scrollY, setScrollY] = useState(0);

  const menuItems = [
    {
      label: 'about',
      ariaLabel: 'About',
      rotation: -8,
      hoverStyles: { bgColor: '#4CC9F0', textColor: '#ffffff' },
      id: 'about'
    },
    {
      label: 'projects',
      ariaLabel: 'Projects',
      rotation: 8,
      hoverStyles: { bgColor: '#4895EF', textColor: '#ffffff' },
      id: 'projects'
    },
    {
      label: 'skills',
      ariaLabel: 'Skills',
      rotation: -8,
      hoverStyles: { bgColor: '#7209B7', textColor: '#ffffff' },
      id: 'skills'
    },
    {
      label: 'contact',
      ariaLabel: 'Contact',
      rotation: 8,
      hoverStyles: { bgColor: '#F72585', textColor: '#ffffff' },
      id: 'contact'
    },
    {
      label: 'cv',
      ariaLabel: 'cv',
      rotation: -8,
      hoverStyles: { bgColor: '#F72585', textColor: '#ffffff' },
      id: 'cv'
    }
  ];

  useEffect(() => {
    fetch('/api')
      .then(response => response.json())
      .then(data => setBackendData(data));
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (modals.length > 0) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [modals]);

  const handleMenuItemClick = (item) => {
    const newModal = {
      id: Date.now(),
      type: item.id
    };
    setModals(prev => [...prev, newModal]);
  };

  const handleCloseModal = (modalId) => {
    setModals(prev => prev.filter(m => m.id !== modalId));
  };

  const cowComponent = useMemo(() => (
    <div style={{ 
      pointerEvents: 'none',
      position: 'fixed',
      bottom: 0,
      right: 0,
      width: 'min(60vw, 60vh)',
      height: 'min(60vw, 60vh)',
      zIndex: 5
    }}>
      <ThreeD />
    </div>
  ), []);

  return (
    <div style={{
      minHeight: '100vh',
      height: '100vh',
      position: 'relative',
      overflow: 'hidden',
      background: '#E0F7FA'
    }}>
      <BackgroundGradient scrollY={scrollY} />
      <BubbleMenu
        items={menuItems}
        menuAriaLabel="Toggle navigation"
        menuBg="rgba(255, 255, 255, 0.9)"
        menuContentColor="#0288D1"
        useFixedPosition={true}
        animationEase="back.out(1.5)"
        animationDuration={0.5}
        staggerDelay={0.12}
        onItemClick={handleMenuItemClick}
        isDisabled={modals.length > 0}
      />
      <ContentSection backendData={backendData} />
      
      {modals.map(modal => (
        <Modal 
          key={modal.id}
          activeModal={modal.type}
          onClose={() => handleCloseModal(modal.id)}
          backendData={backendData}
        />
      ))}
      
      {cowComponent}

      {/* <div
        style={{
          position: "relative",
          overflow: "hidden",
          height: "100%",
          width: "100%",
        }}
      >
        <Ballpit
          count={200}
          gravity={0.7}
          friction={0.8}
          wallBounce={0.95}
          followCursor={true}
        />
      </div> */}
    </div>
  );
}

export default App;
