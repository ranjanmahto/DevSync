import { createContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";


export const SocketContext= createContext();

const SocketProvider= ({children}) => {
    const BACKEND_URL= process.env.REACT_APP_BACKEND_URL;

    const [socketRef,setSocketRef]=useState(null);

    useEffect(()=>{
        const handleError=(err)=>{
            console.log(err)
        }
        async function init()
        {
            const s=  io(BACKEND_URL,{transports:['websocket'],
            
            reconnectionAttempts: 'Infinity',
            timeout: 10000,

            });
            if(s)
            {
                setSocketRef(s);
            }
            s.on('connect',()=>{
                console.log('Connected to server');
                
            })
            s.on('connect_error',(err)=>{
                handleError(err);
            })
            s.on('connect_failed',(err)=>{
                handleError(err)});
            
        }
         init();

         return ()=>{
             if(socketRef)
             {
                 socketRef.disconnect();
             }
         }

         return ()=>{
                if(socketRef)
                {
                    socketRef.disconnect();
                }
         }
        
    },[])
    return (
        <SocketContext.Provider value={socketRef}> 
            {children}
        </SocketContext.Provider>
    )
}

export default SocketProvider;
