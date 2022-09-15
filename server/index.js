const http = require('http');
const express = require('express');
const cors = require('cors')

const PORT =4500 || process.env.PORT;
const socketIo = require('socket.io');
// const { Socket } = require('net');
const users = [{}];


const app = express()

const server = http.createServer(app);
const io = socketIo(server);
app.use(cors())
// socket connection
io.on("connection",(socket)=>{
    console.log("New Connection");

    socket.on('joined',({user})=>{
          users[socket.id]=user;
          console.log(`${user} has joined `);
          socket.broadcast.emit('userJoined',{user:"Admin",message:` ${users[socket.id]} has joined`});
          socket.emit('welcome',{user:"Admin",message:`Welcome to the chat,${users[socket.id]} `})
    })

    socket.on('message',({message,id})=>{
        io.emit('sendMessage',{user:users[id],message,id});
    })

    socket.on('disconect',()=>{
          socket.broadcast.emit('leave',{user:"Admin",message:`${users[socket.id]}  has left`});
        console.log(`user left`);
    })
});
server.listen(PORT,()=>{
    console.log(`App is listining on port ${PORT}`)
})

app.get('/',(req, res)=>{
    res.send('hello world')
})

