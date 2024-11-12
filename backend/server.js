const express = require('express');
const { chats } = require('./Data/Data')
const dotenv=require('dotenv')
const connectDB =require("./config/db")
const userRoutes =require("./routes/userRoutes");
const chatRoutes= require("./routes/chatRoutes")
const messageRoutes =require("./routes/messageRoutes")
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const path= require('path');

dotenv.config()
connectDB();
const app= express();
const port=5000




app.use(express.json()); // to accept json data

app.use("/api/user",userRoutes);
app.use('/api/chat',chatRoutes);
app.use('/api/message',messageRoutes);
// ------------deployment-----------
const __dirname1=path.resolve()
if(process.env.NODE_ENV === 'production'){
    
}
// ------------deployment-----------

app.use(notFound);
app.use(errorHandler);



const server=app.listen(5000 ,console.log(`server is runing on port ${port}`));

const io= require('socket.io')(server,{
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:5001",
    }
});

io.on("connection",(socket)=>{
    console.log("connected to socket.io");

    socket.on("setup",(userData)=>{
        socket.join(userData._id);
        socket.emit("connected");   
    });

    socket.on("join chat",(room)=>{
        socket.join(room);
        console.log("user joined room:" + room);
    });

    socket.on("typing", (room)=>socket.in(room).emit("typing"));
    socket.on("stop typing", (room)=>socket.in(room).emit("stop typing"));

    socket.on("new message",(newMessageRecieved)=>{
        var chat = newMessageRecieved.chat;
        if(!chat.users) return console.log("chat.users not defined");

        chat.users.forEach(user=>{
            if(user._id == newMessageRecieved.sender._id) return ;

            socket.in(user._id).emit("message recieved", newMessageRecieved);
        })
    });
    
    socket.off("setup", ()=>{
        console.log("user disconnected");
        socket.leave(userData._id);
    });

});

