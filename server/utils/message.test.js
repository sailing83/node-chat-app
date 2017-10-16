var expect = require('expect');
var {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
	it('should generate correct message object', () => {
		var from = 'Jen';
		var text = 'A message for test';
		var message = generateMessage(from, text);

		expect(message.createdAt).toBeA('number');
		expect(message).toInclude({
			from: from,
			text: text
		});
	});
});

describe('generateLocationMessage', () => {
	it('should generate correct location object', () => {
		var from = 'Admin';
		var latitude = 50;
		var longitude = 100;
		var url = 'https://www.google.com/maps?q=50,100';
		var message = generateLocationMessage(from, latitude, longitude);
		expect(message.createdAt).toBeA('number');
		expect(message).toInclude({from ,url});
	});
});