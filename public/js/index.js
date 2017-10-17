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
	/*
	DOM manipulation by jQuery is replaced by Mustache
	var formattedTime = moment(message.createdAt).format('h:mm a');
	//console.log('newMessage', message);
	var li = $('<li></li>');
	li.text(`${message.from} at ${formattedTime} said: ${message.text}`);

	$('#messages').append(li);
	*/
	var formattedTime = moment(message.createdAt).format('h:mm a');
	var template = $('#message-template').html();
	var html = Mustache.render(template, {
		text: message.text,
		from: message.from,
		createdAt: formattedTime
	});
	$('#messages').append(html);
});

socket.on('newLocationMessage', function(message) {
	/*
	var formattedTime = moment(message.createdAt).format('h:mm a');
	var li = $('<li></li>');
	var a = $('<a target="_blank">My current location</a>');
	li.text(`${message.from}: ${formattedTime}`);
	a.attr('href', message.url);

	li.append(a);
	$('#messages').append(li);
	*/
	var formattedTime = moment(message.createdAt).format('h:mm a');
	var template = $('#location-message-template').html();
	var html = Mustache.render(template, {
		from: message.from,
		createdAt: formattedTime,
		url: message.url
	});
	$('#messages').append(html);
})

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
	
	var messageTextbox = $('[name=message]');
	socket.emit('createMessage', {
		from: 'User',
		text: $('[name=message]').val()
	}, function() {
		$('[name=message]').val('');
	});
});

var locationButton = $('#send-location');
locationButton.on('click', function() {
	if(!navigator.geolocation) {
		return alert('Your browser doesn\'t support geolocation.');
	}

	locationButton.attr('disabled', 'disabled').text('Sending Location...');
	navigator.geolocation.getCurrentPosition(function(position) {
		locationButton.removeAttr('disabled').text('Send Location');
		socket.emit('createLocationMessage', {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		});
	}, function(error) {
		console.log(error);
		locationButton.removeAttr('disabled').text('Send Location');
	});
});