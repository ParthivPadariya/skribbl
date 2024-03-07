"use client"
import React,{useState} from 'react'
import Player from './Player';
import {useSocket} from '@/context/SocketProvider'

const gamePlayer = () => {

  const {userInRoom} = useSocket();

  return (
    <div>
      <h1>Left Part</h1>
      <div className='my-4'>
        {
          userInRoom.map((item:string,key) => {
            return <Player key={key} user={item}/>
          })
        }
      </div>
    </div>
  )
}

export default gamePlayer
