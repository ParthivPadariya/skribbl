import Image from 'next/image'
import React from 'react'


import Pencil from '../assets/Pencil1.gif'

interface user {
  turn: boolean,
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

      <div className='flex gap-1 items-center justify-center m-1'>
        {
          props.turn ?
          <Image
          src={Pencil}
          width={30}
          height={40}
          alt="Pencil"
          /> : null
        }
        <h1>Image</h1>
      </div>
    </div>
  )
}

export default Player
