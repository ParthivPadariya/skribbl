"use client"

import React, { useEffect } from 'react'
import {useDraw} from '@/hooks/useDraw'

// Context
import {useSocket} from '@/context/SocketProvider'
import {Socket} from 'socket.io-client'

import { drawLine } from '@/utils/drawLine'

interface Point {
  x: number,
  y: number
}

interface Draw {
  ctx: CanvasRenderingContext2D
  currentPoint: Point 
  prevPoint: Point | null
}

const GameBoard = () => {

  const {canvasRef,onMouseDown, clear} = useDraw(createLine);

  const {sendPosition, socket} = useSocket();

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
    socket?.emit('clear')
  }

  return (
    <div className='bg-white'>
      <canvas
        ref={canvasRef}
        onMouseDown={onMouseDown}
        width={650}
        height={580}
        className='border-2 border-black rounded-md'
        style={{border:"2px solid black"}}
      />

      <button type='button' className='p-2 rounded-md text-white border border-black' onClick={() => clearCanvas()}>
        Clear Canvas 
      </button>
    </div>
  )
}

export default GameBoard
