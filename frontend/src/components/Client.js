import React from 'react'
import Avatar from 'react-avatar'

const Client = (props) => {
  return (
    <div className='flex gap-5 items-center mb-3 ml-3' >
          <Avatar name={props.userName} size='50' round="50px" />
          <h2 className='text-white font-serif' >{props.userName}</h2>
    </div>
  )
}

export default Client