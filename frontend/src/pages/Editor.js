import React, { useContext, useEffect, useRef, useState } from 'react'
import ConnectedUsers from '../components/ConnectedUsers'
import EditorComponent from '../components/EditorComponent'

import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import HtmlEditor from '../components/HtmlEditor';
import CssEditor from '../components/CssEditor';
import { SocketContext } from '../context/SocketContext';
import collab_logo from '../assets/new_logo.png';

import 'remixicon/fonts/remixicon.css'
import "@copilotkit/react-ui/styles.css"; 
import { CopilotPopup } from "@copilotkit/react-ui";

const Editor = () => {
 const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
     const socketRef= useContext(SocketContext)
      const location= useLocation();
      const codeRef= useRef(null);
      const htmlRef= useRef(null);
          const cssRef= useRef(null);
      const navigate= useNavigate();
      const [srcCode,setSrcCode]=useState('');
      const [connectedUsers,setConnectedUsers]=useState([]);

      const handleSaveButton = async () => {
          try {
              const response = await axios.post(
                  `${BACKEND_URL}/save-code`, // Backend URL
                  {
                      roomId: location.state.roomId,
                      jsCode:codeRef.current,
                      cssCode: cssRef.current,
                      htmlCode: htmlRef.current,
                  },
                  {
                      withCredentials: true,
                  }
              );
              toast.success('Code saved successfully!');
          //     console.log(response.data.message);
          } catch (error) {
          //     console.error('Error saving code:', error);
              toast.error('Failed to save code.');
          }
      };


     useEffect(()=>{
          // const handleError=(err)=>{
               // console.log(err)
          //      toast.error('An error occured during socket connection.');
          // }
          if(socketRef)
          {
               async function init()
          {
               
                socketRef.emit('join',{
                    roomId:location.state.roomId,
                    userName:location.state?.userName
                });

                socketRef.on('joined',({clients,userName,socketId})=>{
                    
                    if(userName!==location.state.userName)
                    {
                         console.log("joined",userName);
                         toast.success(`${userName} joined the room`);
                         socketRef.emit('html-sync-code',{
                              code:htmlRef.current,
                              socketId,
                           });
     
                           socketRef.emit('css-sync-code',{
                              code:cssRef.current,
                              socketId,
                           });
     
                           socketRef.emit('sync-code',{
                              code:codeRef.current,
                              socketId,
                           });
                    }

                     




                    setConnectedUsers(clients);
                })

                    socketRef.on('disconnected',({socketId,userName})=>{
                         // console.log('disconnected',socketId,userName);
                         toast.error(`${userName} left the room`);
                         setConnectedUsers((prev)=>{
                              return prev.filter((user)=>user.socketId!==socketId);
                         })
                    })


          }
            
          init();

          return ()=>{
               // socketRef.current.disconnect();
               socketRef.off('joined');
               socketRef.off('disconnected');
          }
          }

     },[socketRef])

     async function handleCopyButton()
     {
         try{
          navigator.clipboard.writeText(location.state.roomId);
          toast.success('Room ID copied successfully');
         }
         catch(err)
         {
          // console.log(err);
          toast.error('An error occured while copying room ID');
         }
     }

     const handleLeaveButton= ()=>{
          navigate('/');
     }

     const handleRunButton=()=>{
          const srcDoc=`
          <html>
          <body>${htmlRef.current}</body>
          <style>${cssRef.current}</style>
          <script>${codeRef.current}</script>
          </html>
          `;
          setSrcCode(srcDoc);
          
     }

  return (
    <div className='flex bg-[#1a1f2c] h-screen w-screen'>

          <div className='left   flex flex-col w-[18%] h-full justify-between border border-gray-800   ' >
                <div className='logo h-[10%] flex items-center' >
                         <img src={collab_logo} className='w-16 h-10' />
                         <div className='ml-1 flex flex-col' >
                         <h1 className='text-white text-2xl font-bold ' >devSync</h1>
                         <p className='text-gray-400 text-sm font-sans' >Collaborative code editor</p>
                         </div>
                </div>



                <div className='flex flex-col justify-between h-[90%] ' >
                    <ConnectedUsers connectedUsers={connectedUsers}/>

                    <div className='leave-btn flex flex-col gap-4 ml-3 mb-10'>
                         <button onClick={handleLeaveButton} className='bg-red-900 px-4 py-1 rounded-lg w-[85%] mx-auto font-semibold text-gray-100 text-lg hover:bg-red-800 '>
                         <i class="ri-logout-box-r-line mr-3"></i>
                              Leave Room
                         </button>

                         <button onClick={()=>{
                              handleCopyButton();
                         }} className='bg-[#020817] text-gray-400 font-bold  px-4 py-2 rounded-lg w-[85%] mx-auto hover:bg-gray-800  ' >
                              <i class="ri-clipboard-fill mr-3"></i>
                              Copy Room ID
                         </button>

                         <button
                        onClick={handleSaveButton}
                        className='bg-blue-900 text-gray-300 px-4 py-1 rounded-lg hover:bg-blue-800 w-[85%] mx-auto font-bold  '
                    >       <i class="ri-save-line mr-4"></i>
                              Save Project
                    </button>
                    </div>
                </div>
          </div>

          <div className=' w-[82%] h-screen flex flex-col  ' >
                   
                   
                  <div className='w-full flex h-[60%] bg-[#1a1f2c] ' >
                       <div className='w-[33.33%] mt-7  ' >
                         <div className='h-16 bg-[#111524]  px-4 w-[93%] mx-auto rounded-t-xl flex items-center gap-2 ' >
                                   <div className='h-4 w-4 rounded-full bg-red-500' ></div>
                                   <div className='h-4 w-4 rounded-full bg-yellow-500' ></div>
                                   <div className='h-4 w-4 rounded-full bg-green-500' ></div>
                                   <h2 className='text-gray-500 ml-6 font-bold text-lg' >JavaScript</h2>
   
                         </div>
                         <EditorComponent socketRef={socketRef} roomId={location.state.roomId} setCode={(code)=>{
                         codeRef.current=code;
                          }} />
                      </div>

                        <div className='w-[33.33%] mt-7  ' >
                         <div className='h-16 bg-[#111524]  px-4 w-[93%] mx-auto rounded-t-xl flex items-center gap-2 ' >
                                   <div className='h-4 w-4 rounded-full bg-red-500' ></div>
                                   <div className='h-4 w-4 rounded-full bg-yellow-500' ></div>
                                   <div className='h-4 w-4 rounded-full bg-green-500' ></div>
                                   <h2 className='text-gray-500 ml-6 font-bold text-lg' >HTML</h2>
   
                         </div>
                         <HtmlEditor socketRef={socketRef} roomId={location.state.roomId} setCode={(code)=>{
                         htmlRef.current=code;
                          }} />
                      </div>

                      <div className='w-[33.33%] mt-7  ' >
                         <div className='h-16 bg-[#111524]  px-4 w-[93%] mx-auto rounded-t-xl flex items-center gap-2 ' >
                                   <div className='h-4 w-4 rounded-full bg-red-500' ></div>
                                   <div className='h-4 w-4 rounded-full bg-yellow-500' ></div>
                                   <div className='h-4 w-4 rounded-full bg-green-500' ></div>
                                   <h2 className='text-gray-500 ml-6 font-bold text-lg' >CSS</h2>
   
                         </div>
                         <CssEditor socketRef={socketRef} roomId={location.state.roomId} setCode={(code)=>{
                         cssRef.current=code;
                          }} />
                      </div>
                  </div>

                   <div className='w-full  flex h-[40%] bg-[#202535] p-5 border-r border-gray-800  ' >

                              <iframe className='bg-[#1e2432]  rounded-xl  w-[95%] h-[100%]  ml-5 border border-gray-700'
                              
                                   srcDoc={srcCode}
                                   title='output'
                         
                    
                                   />

                                   <div className='' >
                                        <button onClick={handleRunButton} className='bg-green-400 px-5 h-10 ml-2 py-1 rounded-lg hover:bg-blue-400' >
                                             Run
                                        </button>
                                            
                                        <CopilotPopup
                                             instructions={"You are assisting the user as best as you can. Answer in the best way possible given the data you have."}
                                             labels={{
                                                  title: "Popup Assistant",
                                                  initial: "Need any help?",
                                             }}
                                             />
                                    

                                   </div>
                   </div>

                   
          </div>

    </div>
  )
}

export default Editor