const http = require('http');

const {Server} = require('socket.io')
const PORT = process.env.PORT || 3001;

const userToSocket = new Map();

function init() {
    
    const httpServer = http.createServer();

    const randomRoom = 1;

    const io = new Server(httpServer, {
        cors:{
            origin:'http://localhost:3000'
        }
    });

    io.on('connect', (socket) => {
        console.log(socket.id);
        
        socket.on("join-room", (data) => {
            const user = data.user;
            
            console.log(`Joining ${user}...`);
            socket.join(randomRoom);
            socket.emit("join-success", {success:true,user});
            console.log(`Joined SuccessFully ${user}...`);

            userToSocket.set(user,socket.id);

            io.to(randomRoom).emit("user-joined", {newUser:user});
        })

        socket.on('send-msg',(data) => {
            console.log(data);
            io.to(randomRoom).emit('rec-msg', {message:data.message});
        })


        socket.on('draw-line', ({prevPoint, currentPoint, color}) => {
            // console.log("da");
            // socket.broadcast.emit('draw-line', {currentPoint,prevPoint,color})
            // socket.to(randomRoom).emit('draw-line', {prevPoint,currentPoint,color});
            io.to(randomRoom).emit('draw-line', {prevPoint,currentPoint,color});
        })

        socket.on('clear', () => {
            io.to(randomRoom).emit('clear');
        })

        socket.on('disconnect', () => {
            console.log("Disconnect",socket.id);
            // io.disconnectSockets()
            socket.disconnect();
        })
    })

    httpServer.listen(PORT,"",(err) => {
        console.log(`Socket.io Server Started at ${PORT}`);
    })
}

init()