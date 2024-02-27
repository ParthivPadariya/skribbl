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

        socket.on("Join-Game", (data) => {
            const user = data.user;
            
            console.log(`Joining ${user}...`);
            socket.join(randomRoom);
            socket.emit("joined-success", {success:true});
            console.log(`Joined SuccessFully ${user}...`);

            userToSocket.set(user,socket.id);

            io.to(randomRoom).emit("user-Joined", {newUser:user});
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