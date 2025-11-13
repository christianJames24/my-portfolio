import React, {useEffect, useState} from 'react';
import ThreeD from "./ThreeD";
//https://youtu.be/w3vs4a03y3I?si=cJiFQ1nQtIqFaHwx GOATED VIDEO

//run frontend: npm start
//run backend: npm run dev

function App() {

  const [backendData, setBackendData] = useState([{}]);

  useEffect(() => {
    fetch('/api').then(
      response => response.json()
    ).then(
      data =>{
        setBackendData(data);
      }
    )
  },[]);

  return (
    <div>
      <h1>ok</h1>
      
      {(typeof backendData.users === 'undefined') ? (
        <p>Loading...</p>
      ) : (
        backendData.users.map((user, i) => (
          <p key={i}>{user}</p>
        ))
      )}
      <ThreeD />
    </div>
  );
}

export default App;