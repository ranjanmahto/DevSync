import React, { useState } from 'react'
import {v4 as uuid} from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import collab_logo from '../assets/homepage_logo.png';




const HomePage = () => {
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

    const [roomId,setRoomId]= useState('');
    const [userName,setUserName]= useState('');
    const [join,setJoin]= useState(true);
    const navigate= useNavigate();

    const createRoomHandler = async() => {
       const roomId= uuid();
    
         setRoomId(roomId);
        //  toast.success('New room created successfully'); 
         try{
                const response=await axios.post(`${BACKEND_URL}/create-room`,{roomId},{withCredentials:true});
                // console.log(response);
                if(response.data)
                {
                    toast.success('Room created successfully');
                    navigate(`/editor/${roomId}`,{state:{roomId,userName}});   

                }
                else
                {
                    toast.error('Failed to create room');
                }
         }
         catch(err)
         {
                toast.error('Failed to create room');
         }
    }

    const joinRoomHandler = async () => {
        if(!userName || !roomId)
        {
            toast.error('Please enter both fields');
            return;
        }

        try{
            const response= await axios.post(`${BACKEND_URL}/get-code`,{roomId},{withCredentials:true});
            if(response.data)
            {
                navigate(`/editor/${roomId}`,{state:{roomId,userName}});
            }
            else
            {
                toast.error('Room not found');
            }
        }
        catch(err)
        {
            toast.error('Room not found');
        }



    }
  return (
    <div className='flex justify-center items-center bg-[#0f172a] h-screen w-screen ' >
        <div className=' rounded-2xl p-5 border border-gray-800  w-[30%] h-[56%] ' >
              <div className='logo flex flex-col gap-3 items-center justify-center ' >
                       <img src={collab_logo} className='w-12 h-12' />
                       <h1 className='text-2xl font-bold text-white' >devSync</h1>
              </div>

              <div>
                 <h1 className='text-white text-lg font-medium mt-3 '>{join?"Enter room details to Join":"Enter your Username"} </h1>
                 <div className='input box flex flex-col gap-3 my-5' >
                     {join && <input value={roomId} onChange={(e)=>{
                        setRoomId(e.target.value);
                     }} onKeyUp={(e)=>{
                        
                        if(e.key==='Enter')
                        {
                            joinRoomHandler();
                        }
                     }}  type='text' placeholder='Room ID' className='px-3 rounded-md py-1 bg-transparent border border-gray-800 placeholder:text-gray-500 text-white  ' />}
                    <input onKeyUp={(e)=>{
                       
                        if(e.key==='Enter')
                        {
                            joinRoomHandler();
                        }
                    }} value={userName} onChange={(e)=>{
                        setUserName(e.target.value);
                    }}  type='text' placeholder='Username' className='px-3 rounded-md py-1 bg-transparent border border-gray-800 placeholder:text-gray-500  text-white ' />
                 </div>

                 <button className=' join-button bg-[#10b981] px-3 py-2 w-full rounded-lg mx-auto font-semibold hover:bg-blue-400 ' onClick={()=>{
                    {join?joinRoomHandler():createRoomHandler()}
                 }}  >{join?"Join":"Create Room"}</button>
              </div>
              <div className=' create-room px-2 flex justify-center' >
                <h2 className='text-gray-400 mt-5 mr-2' >{join?"If you don't have any invite then create":"Already have Room ID"} <span onClick={()=>{
                    setJoin(!join);
                }} className='text-green-400  cursor-pointer text-lg  hover:text-blue-400' >{join?"Create Room":"Join a room"}</span> </h2>
              </div>
        </div>
    </div>
  )
}

export default HomePage