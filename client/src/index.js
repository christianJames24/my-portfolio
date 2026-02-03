import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const Auth0ProviderWithRedirectCallback = ({ children, ...props }) => {
  const navigate = useNavigate();

  const onRedirectCallback = (appState) => {
    navigate(appState?.returnTo || window.location.pathname);
  };

  return (
    <Auth0Provider onRedirectCallback={onRedirectCallback} {...props}>
      {children}
    </Auth0Provider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Auth0ProviderWithRedirectCallback
      domain="dev-v1031rsex2ls46o4.us.auth0.com"
      clientId="HQAPjwdyUiHS1KcjgnElzsGXalhobC3e"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "https://reacttestwhatevs-api.com"
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
    >
      <App />
    </Auth0ProviderWithRedirectCallback>
  </Router>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();