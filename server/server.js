const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
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

	socket.emit('newMessage', generateMessage('Admin', 'Welcome to chat app.'));

	socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined.'));


	socket.on('createMessage', (message, callback) => {	//Listen to createMessage event
		console.log('createMessage', message);
		
		/*
		io.emit('newMessage', {		//emit newMessage event
			from: message.from,
			text: message.text,
			createdAt: new Date().getTime()
		}); //emit an event to every single connection
		// while socket.emit only emits an event to one connection
		*/
		io.emit('newMessage', generateMessage(message.from, message.text));
		callback('This is from server.');
		/*
		socket.broadcast.emit('newMessage', {
			from: message.from,
			text: message.text,
			createdAt: new Date().getTime()
			//Broadcast a message: 
			//Other all connections can receive the message, but the connection itself cannot.
		});
		*/
	});

	socket.on('createLocationMessage', (coords) => {
		io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
	});

	/*
	socket.emit('newMessage', {
		from: 'John',
		text: 'Nice to meet you',
		createdAt: 2000
	});
	*/
});

server.listen(port, () => {
	console.log(`Server is up on port ${port}.`);
})
