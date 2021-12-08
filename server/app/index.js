const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const http = require('http');
const sio = require('socket.io');

const PORT = process.env.PORT || 5000;

const routes = require('./routes');
const socket = require('./socket');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cors({ origin: true }));

app.use('/api', routes);

app.start = () => {
    const server = http.createServer(app);

    const io = sio(server, {
        cors: {
            origin: '*',
        }
    });

    server.on('listening', () => {
        const p = PORT;

        console.log('\u001b[32m');
        console.log('┌───────────────────────────────────────────────┐');
        console.log(`│          Server started on port ${p}          │`);
        console.log('└───────────────────────────────────────────────┘');
        console.log('\u001b[00m');
    });

    io.on('connection', socket.onConnect);

    server.listen(PORT);
};

module.exports = app;
