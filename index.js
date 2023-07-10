import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import users from "./routes/user.routes.js";
import blogs from "./routes/blog.routes.js";
import chats from "./routes/chat.routes.js";
import messages from "./routes/message.routes.js";
import dataBase from "./config/db.js";
import { Server } from 'socket.io';

const app = express();
let userss=[];
// Database
dataBase()

app.use(cors());
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use(express.json());
app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use('/api/users', users)
app.use('/api/blogs', blogs)
app.use('/api/chat', chats)
app.use('/api/message',messages)

const port = process.env.PORT || 8000;
const server=app.listen(port, () => console.log(`Listening on port ${port} 🚀`));

const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: 'http://localhost:3000',
    }
});

io.on('connection', (socket) => {
    console.log('Socket connected 🔥');
    socket.on('setup',(userData)=>{
        socket.join(userData.id);

        if(!userss.some(user => user.userId === userData.id)){
            userss.push({userId: userData.id, socketId: socket.id});
            console.log("New User is here",userss);
        }
        // console.log(socket.id);

        io.emit('get-users',userss);
        socket.emit('connected')
    })

    

    socket.on('join room', (room) => {
        socket.join(room)
        console.log('User Joined Room :',room);
    });

    socket.on('typing', (room) =>{
        socket.in(room).emit('typing')
        //  console.log("typing")
        });
    
    socket.on('stop typing', (room) =>{
        socket.in(room).emit('stop typing')
        // console.log("stop typing")
    });

    socket.on('new message', (newMessage) => {
        var chat = newMessage.chat;
        if(!chat.users) return console.log('Chat.users not defined');

        chat.users.map((user) => {
            if(user._id == newMessage.sender._id)return;
            socket.in(user._id).emit('message received', newMessage); 
        })
    })

    socket.off('setup', () => {
        console.log('Socket disconnected 🔥');
        socket.emit('updateUserStatus',userss);
        socket.leave(userData.id);
    });

    socket.on('disconnect', ()=>{
        console.log(socket.id);
        userss=userss.filter((user) => user.socketId !== socket.id);
        // console.log("User is disconnected",users);
        io.emit('get-users',userss);
    });

    socket.on('offline',()=>{
        userss=userss.filter((user) => user.socketId !== socket.id);
        // console.log("User is offline",users);
        io.emit('get-users',userss);
    })
    
});
