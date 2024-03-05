"use client"

import React from 'react'
import {useDraw} from '@/hooks/useDraw'

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

  const {canvasRef,onMouseDown} = useDraw(drawLine);

  function drawLine({prevPoint, currentPoint, ctx}:Draw) {
    const {x:currX, y: currY} = currentPoint;
    
    const lineColor = "#000"
    const lineWidth = 5;
    

    let startPoint = prevPoint ?? currentPoint;
    ctx.beginPath()
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = lineColor;
    ctx.moveTo(startPoint.x, startPoint.y)
    ctx.lineTo(currX,currY)
    ctx.stroke()

    ctx.fillStyle = lineColor
    ctx.beginPath()
    ctx.arc(startPoint.x,startPoint.y, 2, 0, 2*Math.PI);
    ctx.fill()

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
    </div>
  )
}

export default GameBoard
