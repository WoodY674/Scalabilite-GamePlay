import express, {Express} from 'express';
import swaggerUi from 'swagger-ui-express';
import {swaggerDocument} from "./swagger/swagger";
import {corsApp} from "./cors/corsApp";
const port: number = 3000;
const app = express();
app.use(express.json());
const httpServer: Express = require('http').createServer(app);
const io = require('socket.io')(httpServer, corsApp);
app.use('/docs', swaggerUi.serve, swaggerDocument);



io.on('connection', (socket: { on: (arg0: string, arg1: (message: string) => void) => void; id: string; }) => {
    console.log('a user connected');

    socket.on('message', (message) => {
        console.log(message);
        io.emit('message', `${socket.id.substr(0, 2)} said ${message}`);
    });

    socket.on('disconnect', () => {
        console.log('a user disconnected!');
    });
});


httpServer.listen(port, () => console.log(`listening on port ${port}`));