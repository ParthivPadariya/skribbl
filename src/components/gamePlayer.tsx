"use client"
import React,{useState} from 'react'
import Player from './Player';
import {useSocket} from '@/context/SocketProvider'

const gamePlayer = () => {

  const {userInRoom} = useSocket();

  
  return (
    <div>
      {
        userInRoom.map((item:string,key) => {
          return <Player key={key} user={item}/>
        })
      }
    </div>
  )
}

export default gamePlayer
