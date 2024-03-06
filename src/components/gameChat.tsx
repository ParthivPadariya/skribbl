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
    <div className="border-2 p-2">
      <div className="h-96 overflow-y-auto">
        <h3>Messages</h3>
        {messages.map((item, key) => {
          return (
            <div key={key}>
              <h1>{item}</h1>
            </div>
          );
        })}
      </div>

      <form className="flex gap-4" onSubmit={(e) => sendMess(e)}>
        <input
          type="text"
          className="p-2 text-black"
          placeholder="Enter Message"
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
