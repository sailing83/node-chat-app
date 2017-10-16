var socket = io();

socket.on('connect', function () {
	console.log('Connected to server.');

	/*
	socket.emit('createMessage', {
		from: 'Fan',
		text: 'How are you?'
	});
	*/
});

socket.on('disconnect', function () {
	console.log('Disconnected from server');
}); 

socket.on('newMessage', function(message) {	//Listen to newMessage event
	console.log('newMessage', message);
	var li = $('<li></li>');
	li.text(`${message.from} said: ${message.text}`);

	$('#messages').append(li);
});

/*
socket.emit('createMessage', {
	from: 'Frank',
	text: 'Hi'
}, function(data) {		//A callback function, fired when acknowledgement arrives at the client
	console.log('Got it!', data);
});
*/

$('#message-form').on('submit', function(e) {
	e.preventDefault();	
	//Prevent the default behavior of submit, which is submit the form and refresh the page
	socket.emit('createMessage', {
		from: 'User',
		text: $('[name=message]').val()
	}, function() {

	});
});