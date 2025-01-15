import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import SocketProvider from './context/SocketContext';
import { CopilotKit } from "@copilotkit/react-core";

// import reportWebVitals from './reportWebVitals';
const apiKey= process.env.REACT_APP_COPILOTKIT_API_KEY;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <SocketProvider>
      <CopilotKit publicApiKey={apiKey} > 
            <App />
          </CopilotKit>
   </SocketProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
