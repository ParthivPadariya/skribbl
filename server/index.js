const http = require('http');

const {Server} = require('socket.io')
const PORT = process.env.PORT || 3001;

const SocketToUser = new Map();
const socketToRoom = new Map();

const userInRoom = new Map();
/*
    userInRoom
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
                userInRoom.set(randomRoom,[...userInRoom?.get(randomRoom),{user:user,change:false}]);
            }
            else{
                // No User
                userInRoom.set(randomRoom,[{user:user,change:true}]);
                // console.log("==>",userInRoom.get(randomRoom));
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
            const roomId = socketToRoom.get(socket.id);
            
            let user = userInRoom.get(roomId);
            // 60 59 ......2 1 0
            if(remTime <= 1 && currRound <= 3){
                // Generate Random Number For Turn

                if (user != undefined) {
                    user = Array.from(user)
                    const length = (user?.length);
                    const randomTurn = Math.floor(Math.random()*length);
                    
                    console.log(randomTurn);
                    if(randomTurn != NaN && randomTurn < length){
                        // user[randomTurn].change = true
                    }
    
                    user = user?.map((item,index=0)=>{
                        if (item.change == true) {
                            item.change = false;
                        }
                        if(index == randomTurn){
                            item.change = true;
                        }
                        return item;
                    })
                }

                // Make Sure Previous false
                // console.log(user);
                userInRoom.set(roomId, user)

                remTime = 60;
                currRound++;
            }

            roomToDetails.set(roomId,{
                time: remTime,
                round: currRound
            })

            
            const roomDet = roomToDetails.get(roomId);

            const roomDetails = JSON.stringify(roomDet);
            const userList = JSON.stringify(user);
            io.to(roomId).emit('update-room', {roomDetails, userList});
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

            if (array != undefined) {
                array = Array.from(array);

                const result = array.filter((item) => {
                    if(item.user != userName){
                        return item;
                    }
                })

                array = result;
                if (array.length == 0) {
                    userInRoom.delete(room);
                    roomToDetails.delete(room);
                }
                else{
                    userInRoom.set(room,result);
                }

                // console.log(array);
                // const length = array.length;
                // for(let i = 0; i<length; i++){
                //     if(array[i] == userName){
                //         array?.splice(i,1);
                //         break
                //     }
                // }

                // console.log(userName,"---->",array);

                // const index = array.map((item,index) => {
                //     if(item.user == userName){
                //         return index
                //     }
                // })
                // console.log(index);
                // array?.splice(index,1);
                // console.log(array);
                // userInRoom.set(room,array);
                // console.log(userInRoom.get(room));
            }

            // console.log(array);
            // let index = array?.indexOf({user:userName});
            // console.log(index);
            // if(index != -1){
            //     array?.splice(index,1);
            // }

            
            
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