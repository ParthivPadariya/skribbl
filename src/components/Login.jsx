"use client"
import React,{useState} from 'react'
import socket from '@/socket/socket'


const Login = () => {
    const [userName, setUserName] = useState("");
    const [roomCode, setRoomCode] = useState();

    socket.on("user-Joined", (data) => {
        console.log(data);
    })

    function joinGame() {
        // console.log(userName);
        socket.emit('Join-Game', {user:userName, roomCode: roomCode});
    }


  return (
    <>
        <h1>Join Game</h1>
        <h4>Enter User Name</h4>
        <input type="text" name='name' placeholder='Name'  onChange={(e) => setUserName(e.target.value)}/>
        <input type="text" name='roomCode' placeholder='Code'  onChange={(e) => setRoomCode(e.target.value)}/>
    
        <button onClick={joinGame}>Join Game</button>   
    </>
  )
}

export default Login
