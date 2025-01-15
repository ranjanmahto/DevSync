const {Server} = require('socket.io');

let io;



function initializeSocket(server) {
    io = new Server(server,{
        cors: {
            origin: "https://devsync-frontend-5b3e.onrender.com",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    const userSocketMap={};

    function getClients(roomId) {
        const clients = Array.from(io.sockets.adapter.rooms.get(roomId)||[]).map((socketId) => {
            return {
                socketId,
                userName: userSocketMap[socketId]
            }
        });
        return clients;
    }

    io.on('connection', (socket) => {
        

        socket.on('join', ({roomId,userName}) => {
            socket.join(roomId);
            userSocketMap[socket.id]= userName;
            const clients= getClients(roomId);

            

            clients.forEach((client)=>{
                io.to(client.socketId).emit('joined', {clients,userName,socketId:socket.id});
            });
        })

        socket.on('code-change',({code,roomId})=>{
            
            socket.in(roomId).emit('code-change',{code});
        });
        socket.on('html-code-change',({code,roomId})=>{
            
            socket.in(roomId).emit('html-code-change',{code});
        });
        socket.on('css-code-change',({code,roomId})=>{
            
            socket.in(roomId).emit('css-code-change',{code});
        });

        socket.on('sync-code',({socketId,code})=>{
               
            socket.to(socketId).emit('code-change',{code})
        })

        socket.on('html-sync-code',({socketId,code})=>{
            //    console.log('html-sync-code');
            socket.to(socketId).emit('html-code-change',{code})
        })

        socket.on('css-sync-code',({socketId,code})=>{
               
            socket.to(socketId).emit('css-code-change',{code})
        })

        socket.on('disconnecting', () => {
            const rooms=  [...socket.rooms];
            rooms.forEach((room)=>{
                
                    socket.in(room).emit('disconnected',{
                        socketId:socket.id,
                        userName:userSocketMap[socket.id]
                    });


                    
                
            })

            delete userSocketMap[socket.id];
            socket.leave();
        });
    });
}

function sendMessageToSocketId(socketId, message) {
    if (io) {
        io.to(socketId).emit('message', message);
    } else {
        console.error('Socket.io is not initialized.');
    }
}

module.exports = {
    initializeSocket,
    sendMessageToSocketId
};
