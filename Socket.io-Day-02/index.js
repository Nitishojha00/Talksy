const express = require('express');
const app = express()
const { Server } = require("socket.io");
const http = require('http')
const path = require('path')

const server = http.createServer(app);
const io = new Server(server);

app.get('/',(req,res)=>{
    
    res.sendFile(path.join(__dirname,'index.html'));
    
})

// 

// yejo server bana isko upgrade krke web socket m bana padega
// normal request upar handle hojayega web socket wala ab niche handle hogi

io.on("connection",(socket)=>{

    // socket.on('message',(data)=>{
    //     // io.emit('new-message',data);   // mtlb sbko ye message bhejrha  emit mtlb bhejna
    //     socket.broadcast.emit('new-message',data);  // mujhe chodke dusro ko sbko jayega
    // })

    socket.on("join-room",(roomId)=>{
        // console.log(roomId)
        socket.join(roomId); 
    })

    socket.on("message",({roomId,msg})=>{
        // console.log(msg);
         socket.to(roomId).emit('new-message',msg);   // mtlb sbko ye message bhejrha  mujhe chodke
    })

    socket.on("disconnect",()=>{
        console.log("Disconnected From Server");  // server ko aisa disconnect krta hai
    })
})

server.listen(4000,()=>{
    console.log("Server is running on port 4000");
})