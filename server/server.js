const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.Server(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
	console.log('New user connected.');

	socket.on('disconnect', () => {
		//console.log('User is disconnected.');
		var user = users.removeUser(socket.id);
		if(user) {
			io.to(user.room).emit('updateUserList', users.getUsersList(user.room));
			io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the room.`));
		}
	});

	//socket.emit('newMessage', generateMessage('Admin', 'Welcome to chat app.'));

	//socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined.'));

	socket.on('join', (params, callback) => {
		if(!isRealString(params.name) || !isRealString(params.room)) {
			return callback('Name and room name are required.');
		}

		socket.join(params.room);
		users.removeUser(socket.id);
		users.addUser(socket.id, params.name, params.room);
		io.to(params.room).emit('updateUserList', users.getUsersList(params.room));
		//Update the users list in the chat room

		socket.emit('newMessage', generateMessage('Admin', 'Welcome to chat app.'));
		socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} joined.`));

		callback();
	});

	socket.on('createMessage', (message, callback) => {	//Listen to createMessage event
		var user = users.getUser(socket.id);

		if(user && isRealString(message.text)) {
			io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
		}
		/*
		io.emit('newMessage', {		//emit newMessage event
			from: message.from,
			text: message.text,
			createdAt: new Date().getTime()
		}); //emit an event to every single connection
		// while socket.emit only emits an event to one connection
		*/
		callback();
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
		var user = users.getUser(socket.id);

		if(user) {
			io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude))
		}
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
