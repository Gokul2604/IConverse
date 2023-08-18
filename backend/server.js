const express = require('express');
const dotenv = require('dotenv');
const connectDb = require('./config/db'); 
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const path = require('path');

dotenv.config();

connectDb();

const app = express();

app.use(express.json());

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

// _____________DEPLOYMENT_________________________
// ________________________________________________

const __dirname1 = path.resolve();

if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname1, "/frontend/build")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
    })
} else {
    app.get('/', (req, res) => {
        res.send("API is running");
    });
}

// ________________________________________________

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}...`);
});

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
    }
});

io.on("connection", (socket) => {
    console.log("Connected to Sockets...");

    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on("joinChat", (room) => {
        socket.join(room);
    });

    socket.on("newMessage", (newMessageReceived) => {
        var chat = newMessageReceived.chat;

        if(!chat.users) {
            return console.log("Users not defined!");
        }

        chat.users.forEach(user => {
            if(user._id === newMessageReceived.sender._id) return;

            socket.in(user._id).emit("messageReceived", newMessageReceived);
        });
    });

    socket.off("setup", () => {
        console.log("User Disconnected...");
        socket.leave(userData._id);
    })
});