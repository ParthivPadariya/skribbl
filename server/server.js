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

        socket.on('join-room', (data) => {
            // Join User In Room

            // let size = io.sockets.adapter.rooms.get(randomRoom)?.size
            
        });

        
        socket.on('send-message', (data) => {
            
        });

        
        socket.on('send-position', (data) => {
            
        });

        
        socket.on('user-room', (data) => {
            
        });

        socket.on('room-details', (data) => {
            
        })
        
        socket.on('disconnect', (data) => {
            

            socket.disconnect();
        });


    })

    httpServer.listen(PORT, (err) => {
        if (!err) {
            console.log(`Server Started ${PORT}`);
        }
    })
}

init()