"use client"

import React, { useEffect, useState } from 'react'
import {useDraw} from '@/hooks/useDraw'

// Context
import {useSocket} from '@/context/SocketProvider'

import { drawLine } from '@/utils/drawLine'

/*
interface Point {
  x: number,
  y: number
}

interface Draw {
  ctx: CanvasRenderingContext2D
  currentPoint: Point 
  prevPoint: Point | null
}
*/

interface propsType{
  user:string
}

const GameBoard:React.FC<propsType> = (user) => {

  
  const {canvasRef,onMouseDown, clear} = useDraw(createLine);

  const {sendPosition, socket, userInRoom} = useSocket();
  
  // const [change,setChange] = useState<boolean>(false);
  let change:boolean = false;

  const len = userInRoom.length;
  for(let i = 0; i<len; i++){
    if(userInRoom[i].user == user.user && userInRoom[i].change){
      change = true;
      break;
    }
  }
  

  useEffect(() => {

    const ctx = canvasRef.current?.getContext('2d');


    socket?.on('draw-line', ({prevPoint,currentPoint,color}:{prevPoint:Point|null, currentPoint:Point, color:string}) => {
      if (!ctx) {
        return;
      }
      drawLine({prevPoint,currentPoint,ctx,color});
    });

    socket?.on('clear', () => {
      clear();
    });

    return () => {
      socket?.off('draw-line');
      socket?.off('clear');
    }
  },[])

  function createLine({prevPoint, currentPoint, ctx}:Draw) {
    // socket.emit('draw-line', {prevPoint, currentPoint, color:"#000"})
    sendPosition({prevPoint,currentPoint,color:"#000"});
    drawLine({prevPoint,currentPoint,ctx,color:"#000"})
  }

  function clearCanvas() {
    const socketId = socket?.id;
    socket?.emit('clear', {socketId});
  }

  return (
    <div className='flex flex-col'>
      <div className='bg-white'>
        <canvas
          ref={canvasRef}
          onMouseDown={() => onMouseDown({change})}
          width={820}
          height={600}
          className='border-2 border-black rounded-md'
          style={{border:"2px solid black"}}
          />
        
        {/* <div className='flex absolute bg-gray-700 bg-opacity-80'>
          <button>Number-1</button>
          <button>Number-1</button>
          <button>Number-1</button>
        </div> */}
      </div>

      {
        change ? <button type='button' className='p-2 rounded-md bg-white text-black border border-black' onClick={() => clearCanvas()}>
          Clear Canvas 
        </button> : null
        
      }
    </div>
  )
}

export default GameBoard
