"use client";
import React, { useState, useEffect, useCallback } from "react";
import socket from "@/socket/socket";

interface params {
  userName: string;
}

const gameChat: React.FC<params> = (params) => {
  const [msg, setMsg] = useState("");
  const [msgList, setMsgList] = useState<
    {
      msg: string;
    }[]>([]);

  function sendMessage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    socket.emit("send-msg", { message: msg, user: params.userName });
  }

  const receiveMessage = useCallback(() => {
    socket.on("receive-msg", (data) => {
      setMsgList((list) => [...list, { msg: data.msg }]);
    });
  }, [socket]);

  useEffect(() => {
    receiveMessage();
    return () => receiveMessage();
  }, [receiveMessage]);

  return (
    <div className="border-2 p-2">
      <div className="h-96 overflow-y-auto">
        <h3>Messages</h3>
        {msgList.map((item, key) => {
          return (
            <div key={key}>
              <h1>{item.msg}</h1>
            </div>
          );
        })}
      </div>

      <form className="flex gap-4" onSubmit={(e) => sendMessage(e)}>
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
