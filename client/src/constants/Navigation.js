export const NAVIGATION_ITEMS = [
  { id: 'about', label: 'about', direction: '→', color: '#4CC9F0' },
  { id: 'projects', label: 'projects', direction: '↓', color: '#4895EF' },
  { id: 'skills', label: 'skills', direction: '←', color: '#7209B7' },
  { id: 'contact', label: 'contact', direction: '↑', color: '#F72585' }
];

// Static content (kept for backward compatibility or as fallback)
export const MODAL_CONTENT = {

};

export const getModalContent = (backendData) => ({
  about: {
    title: 'About Me',
    content: (
      <div style={{ fontSize: '18px', color: '#424242', lineHeight: '1.8' }}>
        <p>Add your about content here. Talk about yourself, your background, interests, and what drives you.</p>
        
        {backendData?.users && (
          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            <h3 style={{ marginTop: 0, color: '#0288D1' }}>Users from Backend:</h3>
            <ul style={{ margin: '10px 0' }}>
              {backendData.users.map((user, i) => (
                <li key={i}>{user}</li>
              ))}
            </ul>
          </div>
        )}
        
        <p>Add your about content here. Talk about yourself, your background, interests, and what drives you.</p>
        <p>Add your about content here. Talk about yourself, your background, interests, and what drives you.</p>
      </div>
    )
  },
  projects: {
    title: 'My Projects',
    content: (
      <div style={{ fontSize: '18px', color: '#424242', lineHeight: '1.8' }}>
        <p>Add your projects here. Describe your work, accomplishments, and what you've built.</p>
        
        
      </div>
    )
  },
  skills: {
    title: 'Skills & Expertise',
    content: (
      <div style={{ fontSize: '18px', color: '#424242', lineHeight: '1.8' }}>
        <p>Add your skills here. List your technical abilities, tools you use, and areas of expertise.</p>
        
        
      </div>
    )
  },
  contact: {
    title: 'Get In Touch',
    content: (
      <div style={{ fontSize: '18px', color: '#424242', lineHeight: '1.8' }}>
        <p>Add your contact information here. Include email, social links, or a contact form.</p>
        
       
      </div>
    )
  },
  cv: {
    title: 'CV / Resume',
    content: (
      <div style={{ fontSize: '18px', color: '#424242', lineHeight: '1.8' }}>
        <p>Here is a downloadable form for my cv/resume</p>
        
       
      </div>
    )
  }
});