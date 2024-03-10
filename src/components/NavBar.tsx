"use client"
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

import {useSocket} from '@/context/SocketProvider'
// Image
import Timer from '../assets/Timer.png'
import Setting from '../assets/Setting.png'

const NavBar = () => {

  // const [randomIndex, setRandomIndex] = useState(0);
  
  // const randomName = ["Lion","Bag", "Elephants", "Milk", "Water", "Rain", "River", "grass"];
  
  const {socket, roomDetails} = useSocket();

  const [time, setTime] = useState(roomDetails.time)
  const [currRound, setCurrRound] = useState(roomDetails.round);
  

  useEffect(() => {
    const result:any = time > 0 && setInterval(() => {
      socket?.emit('update-room', {remTime:time,currRound:currRound})
      setTime(time-1);
    },1000)

    return () => {
      clearInterval(result);
    }

  },[time])
  


  if (time == 0 && currRound < 3) {
    setTime(60);
    setCurrRound(currRound+1);
  }

  if (currRound == 3) {
    console.log("Result Declare");
  }

  // const size = randomName[randomIndex].length;
  // console.log(randomIndex);
  
  return (
    <div className='flex justify-center items-center p-2 my-2 mt-8 w-11/12 border'>
        
        <Image 
          src={Timer}
          width={50}
          height={50}
          alt="Picture of Timer"/>
        <p>
          {
            time
          }
        </p>
        <p>No of Round:{currRound}</p>

        <div className='flex flex-col justify-center items-center w-10/12 '>
            <p>Guess This</p> 
            {
              <div>
                <span>_</span>
                <span>_</span>
                <span>_</span>
                <span>_</span>
              </div>
            }
        </div>

        <Image 
          src={Setting}
          width={50}
          height={50}
          alt="Picture of Setting"/>
    
    </div>
  )
}

export default NavBar
