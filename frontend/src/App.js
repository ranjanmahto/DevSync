import './App.css';
import { BrowserRouter,Route,Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Editor from './pages/Editor';
import { Toaster } from 'react-hot-toast';
import SocketProvider from './context/SocketContext';



function App() {
  return (
    <>

        <Toaster position='top-center' >
            
        </Toaster>
    
            
            <BrowserRouter>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/editor/:roomId" element={<Editor />} />
                </Routes>
            </BrowserRouter>
            
    </>

    
  )
}

export default App;
