const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.Server(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
	console.log('New user connected.');

	socket.on('disconnect', () => {
		console.log('User is disconnected.');
	});

	socket.on('createMessage', (message) => {
		console.log('createMessage', message);
	})

	socket.emit('newMessage', {
		from: 'John',
		text: 'Nice to meet you',
		createdAt: 2000
	});
});

server.listen(port, () => {
	console.log(`Server is up on port ${port}.`);
})
