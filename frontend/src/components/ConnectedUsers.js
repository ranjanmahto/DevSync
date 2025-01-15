import React, { useEffect, useState } from 'react'
import Client from './Client'

const ConnectedUsers = ({connectedUsers}) => {

  

    useEffect(()=>{
              
    },[])
  return (
    <div className='overflow-scroll hide-scrollbar ' >
          <h2 className=' px-4 border-b border-gray-800 my-7 py-2 text-gray-400  font-semibold'> <i class="ri-group-line mr-3"></i>  Connected Users</h2>
          <div>
            {
                connectedUsers.map((user,index)=>{

                    return <Client key={index} userName={user.userName} />

                    })
            }
          </div>
    </div>
  )
}

export default ConnectedUsers