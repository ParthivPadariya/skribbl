"use client"
import {useEffect,useRef,useState} from 'react'

interface Point {
    x: number,
    y: number
}

interface Draw {
    ctx: CanvasRenderingContext2D
    currentPoint: Point 
    prevPoint: Point | null
}

export const useDraw = (onDraw: ({ctx, currentPoint, prevPoint}:Draw) => void) => {
    
    const [mouseDown, setMouseDown] = useState(false);

    // canvas reference where we have to draw
    const canvasRef = useRef<HTMLCanvasElement>(null)
    // console.log(canvasRef);
    const prevPoint = useRef<null|Point>(null); 

    const onMouseDown = () => {
        setMouseDown(true);
    }

    const clear = () => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    useEffect(() => {   
        const handler = (e:MouseEvent) => {
            // console.log("Mouse Moving");
            
            // console.log({x: e.clientX, y: e.clientY});
            if (!mouseDown) {
                return
            }
            const currentPoint = computePointInCanvas(e);

            const ctx = canvasRef.current?.getContext('2d')
            if(!ctx || !currentPoint) return


            onDraw({ctx, currentPoint, prevPoint:prevPoint.current});
            prevPoint.current = currentPoint
        }

        const computePointInCanvas = (e: MouseEvent) => {
            const canvas = canvasRef.current

            if(!canvas) return

            const rect = canvas.getBoundingClientRect()
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            return {x,y}
        }

        const mouseUpHandler = () => {
            setMouseDown(false);
            prevPoint.current = null;
        }

        // Adding Event lister
        canvasRef.current?.addEventListener('mousemove', (e) => handler(e))
        window.addEventListener('mouseup', mouseUpHandler)

        // remove event listener
        return () => {
            canvasRef.current?.removeEventListener('mousemove', (e) => handler(e))
            window.removeEventListener('mouseup', mouseUpHandler)
        }
    },[onDraw])

    return {canvasRef, onMouseDown};
}