"use client"
import React from 'react'
import Player from './Player';
import {useSocket} from '@/context/SocketProvider'

const gamePlayer = () => {

  const {userInRoom} = useSocket();


  const length = userInRoom.length;
  
  let randomTorn = 0;
  // let randomTorn = Math.floor(Math.random()*length);

  // setTimeout(() => {
  //   randomTorn = Math.floor(Math.random()*length);
  // }, 2000);

  return (
    <div>
      {
        userInRoom.map((item:string,key=0) => {
          // console.log(key,randomTorn);
          return <Player key={key} user={item} turn={randomTorn == key ? true : false}/>
        })
      }
    </div>
  )
}

export default gamePlayer
