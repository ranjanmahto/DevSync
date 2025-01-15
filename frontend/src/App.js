import './App.css';
import { BrowserRouter,Route,Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Editor from './pages/Editor';
import { Toaster } from 'react-hot-toast';
import { CopilotKit } from "@copilotkit/react-core";

// import reportWebVitals from './reportWebVitals';




function App() {
  const apiKey= process.env.REACT_APP_COPILOTKIT_API_KEY;
  return (
    <>

        <Toaster position='top-center' >
            
        </Toaster>
    
            
            <BrowserRouter>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/editor/:roomId" element={<CopilotKit publicApiKey={apiKey} > 
             <Editor />
          </CopilotKit>} />
                </Routes>
            </BrowserRouter>
            
    </>

    
  )
}

export default App;
