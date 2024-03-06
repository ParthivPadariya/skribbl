"use client"
import {createContext, useEffect, useState, useCallback, useContext} from 'react'
import {useRouter} from 'next/navigation'


import {io, Socket} from 'socket.io-client'

interface SocketProviderProps {
    children?: React.ReactNode;
}

  
interface ISocketContext {
    joinRoom: ({userName}:{userName:string}) => any;
    sendMessage: (msg: string) => any;
    messages: string[];
    userInRoom: string[];
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
    const [messages, setMessages] = useState<string[]>([]);
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

    // Receive Part
    const receiveMessage = useCallback((msg:{message:string}) => {
        // console.log("Message", msg);
        setMessages((prev) => [...prev, msg.message]);
    },[])

    const onSuccessJoin = useCallback((msg:{success:boolean, user: string}) => {
        // console.log(msg);
        
        if (msg?.success) {
            // this solve Dynamic 
            router.replace(`/${msg.user}`);
        }

    }, []);

    const userJoined = useCallback((msg:{newUser: string}) => {
        setUserInRoom((prev) => [...prev, msg.newUser]);
    }, []);

    useEffect(() => {
        const _socket = io('http://localhost:3001');
        
        _socket.on('join-success',onSuccessJoin)
        _socket.on('rec-msg',receiveMessage);
        _socket.on('user-joined', userJoined);


        setSocket(_socket);

        return () => {
            _socket.off();
            _socket.disconnect();
            setSocket(undefined);
        }
    },[])


    return (
        <SocketContext.Provider value={{ sendMessage, messages, joinRoom, userInRoom }}>
            {children}
        </SocketContext.Provider>
    )
};