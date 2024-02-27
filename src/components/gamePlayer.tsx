"use client"
import React,{useState} from 'react'
import socket from '@/socket/socket'
import Player from './Player';

const gamePlayer = () => {

  const [user,setUser] = useState<string[]>([]);

  socket.on('user-Joined',(data:{
    newUser:string
  }) => {
    setUser([...user,data.newUser]);
  })

  return (
    <div>
      <h1>Left Part</h1>
      <div className='my-4'>
        {
          user.map((item:string) => {
            return <Player user={item}/>
          })
        }
      </div>
    </div>
  )
}

export default gamePlayer
