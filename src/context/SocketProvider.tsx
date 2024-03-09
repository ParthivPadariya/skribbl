"use client"
import {createContext, useEffect, useState, useCallback, useContext} from 'react'
import {useRouter} from 'next/navigation'


import {io, Socket} from 'socket.io-client'

interface SocketProviderProps {
    children?: React.ReactNode;
}

interface Point {
    x: number,
    y: number
}
  
interface ISocketContext {
    joinRoom: ({userName}:{userName:string}) => any;
    sendMessage: (msg: string) => any;
    sendPosition: ({prevPoint, currentPoint, color}:{prevPoint:Point|null, currentPoint:Point|null, color:string|undefined}) => any
    messages: {
        message: string,
        user: string,
        color: string
    }[];
    userInRoom: string[];
    socket:Socket | undefined
}


const SocketContext = createContext<ISocketContext | null>(null);

export const useSocket = () => {
    const state = useContext(SocketContext);
    if (!state) {
        throw new Error("State is Not Defined");
    }

    return state
}

export const SocketProvider:React.FC<SocketProviderProps> = ({children}) => {

    const [socket, setSocket] = useState<Socket>();
    const [messages, setMessages] = useState<{message:string, user:string, color:string}[]>([]);
    const [userInRoom, setUserInRoom] = useState<string[]>([]);

    const router = useRouter(); 

    // Sending Part
    const sendMessage: ISocketContext["sendMessage"] = useCallback(
        (msg) => {
            // console.log("Send Message", msg);
            if (socket) {
                socket.emit("send-msg", { message: msg });
            }
        },
        [socket]
    );
    
    const joinRoom: ISocketContext["joinRoom"] = useCallback(
        ({userName}) => {
            // console.log("Join Room",userName);
            socket?.emit("join-room",{user:userName});
        },[socket]
    )
    
    const sendPosition: ISocketContext["sendPosition"] = ({prevPoint, currentPoint, color}) => 
    {
        // const socketId = socket?.id;
        // console.log(prevPoint,currentPoint,color);
        socket?.emit('draw-line',{prevPoint,currentPoint,color});    
    }

    // Receive Part
    const receiveMessage = useCallback((msg:{message:string, user:string}) => {
        // console.log("Message", msg);
        var randomColor = Math.floor(Math.random()*16777215).toString(16);
        setMessages((prev) => [...prev, {message:msg.message, user:msg.user, color:`#${randomColor}`}]);
    },[])

    const onSuccessJoin = useCallback((msg:{success:boolean, user: string}) => {
        // console.log(msg);
        
        if (msg?.success) {
            // this solve Dynamic 
            router.replace(`/${msg.user}`);
        }

    }, []);

    const userJoined = (msg:{newUser: string, userList: string, room:number}) => {
        // console.log(msg.userList);
        const receiveMap = new Map(JSON.parse(msg.userList));
        const result:string[]|any = receiveMap.get(msg.room);
  
        setUserInRoom(result);
        // setUserInRoom((prev) => [...prev, msg.newUser]);
    }

    useEffect(() => {
        const _socket = io('http://localhost:3001');
        
        _socket.on('join-success',onSuccessJoin)
        _socket.on('rec-msg',receiveMessage);
        _socket.on('user-joined', userJoined);
        // _socket.on('draw-line',recPosition);

        setSocket(_socket);

        return () => {
            _socket.off();
            _socket.disconnect();
            setSocket(undefined);
        }
    },[])

    return (
        <SocketContext.Provider value={{ socket, sendMessage, messages, joinRoom, userInRoom, sendPosition }}>
            {children}
        </SocketContext.Provider>
    )
};