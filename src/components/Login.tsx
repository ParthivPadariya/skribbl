"use client"
import React,{useEffect, useState, useCallback} from 'react'
import socket from '@/socket/socket'
import {useRouter} from 'next/navigation'

const Login:React.FC = () => {
  const router = useRouter(); 
  const [userName, setUserName] = useState("");
  
  function joinGame(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (userName != "") {
      socket.emit('Join-Game', {user:userName});
    }
  }
  socket.on('joined-success', (data) => {
    if (data.success) {
      router.replace(`/${userName}`)
    }
  })

  return (
    <>
      <div className='flex w-full flex-col h-screen items-center justify-between'>
        <div>
          <h1>Logo</h1>
        </div>

        <form  className='flex flex-col w-80 border-2 rounded p-2 space-y-4' onSubmit={(e) => joinGame(e)} >

          <input className='text-black p-2' type="text" name='userName' onChange={(e) => {setUserName(e.target.value)}} placeholder='Enter your name' />
          
          {/* Image */}

          <button type='submit' className='game-play'>Play</button>
          <button className='game-play' >Create Private Room</button>
        </form>

        <div className='flex justify-between'>
          <div className='game-updates'>
            <h1>About</h1>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae laudantium laborum, vitae itaque ex ullam explicabo commodi corrupti dicta magni rem saepe distinctio veritatis, ea fugiat eveniet provident sapiente nobis.</p>
          </div>

          <div className='game-updates'>
            <h1>News</h1>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Reprehenderit doloribus quasi quis autem beatae perspiciatis ad impedit accusantium? Hic deserunt veniam voluptates harum libero, voluptatem fugit dolores quo saepe dolorum!</p>
          </div>

          <div className='game-updates'>
            <h1>How to Play </h1>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illum perspiciatis voluptates fugiat quos officia fugit, eius sequi excepturi rem dolore commodi aperiam hic. Necessitatibus, consectetur dolorem totam facere impedit aliquid!</p>
          </div>
        </div>

      </div>
    </>
  )
}

export default Login
