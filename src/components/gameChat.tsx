"use client";
import React, { useState } from "react";

// Context
import {useSocket} from '@/context/SocketProvider'


interface params {
  userName: string;
}


const gameChat: React.FC<params> = (params) => {

  const [msg, setMsg] = useState("");
  
  const {sendMessage, messages} = useSocket();

  function sendMess(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    sendMessage(msg);
  }

  return (
    <div className="flex flex-col justify-end border-2 p-2">
      <div className="top-1 mt-0 overflow-y-auto" style={{height:"570px"}}>
        {messages.map((item, key) => {
          return (
            <div key={key} className="flex gap-1">
              <h1>{item.user}</h1>
              <h1 style={{color:`${item.color}`, width:"240px"}}>{item.message}</h1>
            </div>
          );
        })}
      </div>

      <form className="flex gap-4" onSubmit={(e) => sendMess(e)}>
        <input
          type="text"
          className="p-2 text-black"
          placeholder="Type Your guess here"
          name="msg"
          onChange={(e) => {
            setMsg(e.target.value);
          }}
        />
        <button type="submit" className="border-2 p-1 rounded">
          Send
        </button>
      </form>
    </div>
  );
};

export default gameChat;
