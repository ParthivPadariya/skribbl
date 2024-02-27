import React from 'react'

interface user {
    user: string
}

const Player:React.FC<user> = (props) => {
  return (
    <div className='w-56 p-2 border-2 h-10 border-white flex items-center'>
        <h1>{props.user}</h1>
    </div>
  )
}

export default Player
