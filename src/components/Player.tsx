import React from 'react'

interface user {
    user: string
}

const Player:React.FC<user> = (props) => {
  return (

    <div className='flex gap-2 w-60 border rounded-s items-center justify-center p-2'>

      <div>
        {/* Maximum Points show 1st rank */}
        <h1>#1</h1>
      </div>

      <div className='flex flex-col w-32 items-center justify-center'>
        <div>
          <h1>{props.user}</h1>
        </div>
        <p className='text-xs'>175 Points</p>
      </div>

      <div>
        <h1>Image</h1>
      </div>
    </div>
  )
}

export default Player
