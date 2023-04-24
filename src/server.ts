import express from 'express';
import { userRoutes } from './routes/user.routes';
import { config } from 'dotenv';

config();
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = app.listen(4000, () => console.log('Servidor rodando!'));
const io = socketIo(server);
const users: any = [];

io.on('connection', (socket: any) => {
    socket.on('userDisconnect', (nameToRemove: string) => {
        const userIndex = users.findIndex((user: any) => user.name === nameToRemove);
        if (userIndex !== -1) {
            const user = users[userIndex];
            users.splice(userIndex, 1);
            io.emit('joinMessage', { name: null, message: `${user.name} saiu do chat!` });
            io.emit('usersUpdate', users);
        }
    });

    socket.on("userJoin", (name: string) => {
        const user = { id: socket.id, name };
        users.push(user);
        io.emit("joinMessage", { name: null, message: `${name} entrou no chat!` });
        io.emit("usersUpdate", users);
    });

    socket.on("sendMessage", (receivedMessage: any) => {
        io.emit("updateMessages", receivedMessage);
    });
});

app.use(express.json());
app.use('/user', userRoutes);