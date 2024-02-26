const http = require('http');

const {Server} = require('socket.io')
const PORT = process.env.PORT || 3001;

function init() {
    
    const httpServer = http.createServer();

    const io = new Server(httpServer, {
        cors:{
            origin:'http://localhost:3000'
        }
    });

    io.on('connect', (socket) => {
        console.log(socket.id);

        socket.on("Join-Game", (data) => {
            // console.log(data);
            const user = data.user;
            const room = data.roomCode;
            socket.join(room);
            io.to(room).emit("user-Joined", socket.id);
        })

        socket.on('disconnect', () => {
            console.log("Disconnect",socket.id);
            // io.disconnectSockets()
            // socket.disconnect();
        })
    })

    httpServer.listen(PORT,"",(err) => {
        console.log(`Socket.io Server Started at ${PORT}`);
    })
}

init()