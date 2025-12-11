const express = require('express');
const app = express()
const { Server } = require("socket.io");
const http = require('http')

const server = http.createServer(app);
const io = new Server(server);


// yejo server bana isko upgrade krke web socket m bana padega
// normal request upar handle hojayega web socket wala ab niche handle hogi

io.on("connection",(socket)=>{

    socket.on('message',(data)=>{
        io.emit('new-message',data);   // mtlb sbko ye message bhejrha  emit mtlb bhejna
    })

    socket.on("disconnect",()=>{
        console.log("Disconnected From Server");  // server ko aisa disconnect krta hai
    })
})

server.listen(4000,()=>{
    console.log("Server is running on port 4000");
})