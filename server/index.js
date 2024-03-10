const http = require('http');

const {Server} = require('socket.io')
const PORT = process.env.PORT || 3001;

const SocketToUser = new Map();
const socketToRoom = new Map();

const userInRoom = new Map();
/*
    roomNo -> [

        {
            user:"Name"
            change: true
        }, 
        {
            user: "another"
            change: false
        },...
    ]
    
*/
const roomToDetails = new Map();


function init() {
    
    const httpServer = http.createServer();

    let randomRoom = 1;

    const io = new Server(httpServer, {
        cors:{
            origin:'http://localhost:3000'
        }
    });

    io.on('connect', (socket) => {
        // console.log(socket.id);
        
        socket.on("join-room", (data) => {
            const user = data.user;
            
            console.log(`Joining ${user}...`);
            socket.join(randomRoom);
            socket.emit("join-success", {success:true,user});
            console.log(`Joined SuccessFully ${user}...`);
            
            // size of socket
            // console.log(io.sockets.adapter.rooms.get(1)?.size);
            
            SocketToUser.set(socket.id,user);
            socketToRoom.set(socket.id,randomRoom);
            let result = userInRoom.get(randomRoom);
            
            
            if(result != undefined){
                userInRoom.set(randomRoom,[...userInRoom?.get(randomRoom),user]);
            }
            else{
                // No User
                userInRoom.set(randomRoom,[user]);
                roomToDetails.set(randomRoom, {
                    time: 60,
                    round:0
                });
            }

            // console.log("userInRoom", userInRoom);
            // const userData = JSON.stringify(Array.from(userInRoom.entries()));
            const userData = JSON.stringify(Array.from(userInRoom.get(randomRoom)));
            const roomData = JSON.stringify(roomToDetails.get(randomRoom));

            io.to(randomRoom).emit("user-joined", {newUser:user,userList:userData, room: randomRoom, roomDetails:roomData});

            let size = io.sockets.adapter.rooms.get(randomRoom)?.size
            // console.log(size,randomRoom);
            if(size > 3){
                randomRoom = Math.floor(Math.random()*10000+1);
                // console.log(randomRoom);
            }
        })

        socket.on('send-msg',(data) => {
            // console.log(data);
            const msg = data.message;
            
            const socketId = socket.id;

            // getting roomId
            const roomId = socketToRoom.get(socketId);
            const user = SocketToUser.get(socketId);

            // console.log(msg,socketId,roomId);
            io.to(roomId).emit('rec-msg', {message:data.message, user});
        })

        socket.on('update-room', ({remTime, currRound}) => {
            // console.log(remTime,currRound);

            const roomId = socketToRoom.get(socket.id);
            roomToDetails.set(roomId,{
                time: remTime,
                round: currRound
            })
            // console.log(roomToDetails.get(roomId));
            io.to(roomId).emit('update-room', {remTime, currRound});
        })

        socket.on('draw-line', ({prevPoint, currentPoint, color}) => {
            
            const socketId = socket.id;
            const roomId = socketToRoom.get(socketId);

            // socket.broadcast.emit('draw-line', {currentPoint,prevPoint,color})
            // socket.to(randomRoom).emit('draw-line', {prevPoint,currentPoint,color});
            io.to(roomId).emit('draw-line', {prevPoint,currentPoint,color, randomRoom});
        })

        socket.on('clear', () => {
            // console.log(socketId);
            const socketId = socket.id;

            const roomId = socketToRoom.get(socketId);
            io.to(roomId).emit('clear');
        })

        socket.on('disconnect', () => {
            console.log("Disconnect",socket.id);

            const userName = SocketToUser.get(socket.id);
            const room = socketToRoom.get(socket.id);

            socketToRoom.delete(socket.id);
            SocketToUser.delete(socket.id);
            
            let array = userInRoom.get(room);
            let index = array?.indexOf(userName);
            if(index != -1){
                array?.splice(index,1);
            }
            
            const userList = JSON.stringify(array);
            io.to(room).emit('leave-room',{userName,userList});

            // io.disconnectSockets()
            socket.disconnect();


        })
    })

    httpServer.listen(PORT,"",(err) => {
        console.log(`Socket.io Server Started at ${PORT}`);
    })
}

init()