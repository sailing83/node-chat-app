const expect = require('expect');
const {Users} = require('./users');

describe('Users', () => {

	beforeEach(() => {
		users = new Users();
		users.users = [{
			id: '1',
			name: 'Mike',
			room: 'Node Course'
		}, {
			id: '2',
			name: 'Jason',
			room: 'React Course'
		}, {
			id: '3',
			name: 'Julie',
			room: 'Node Course'
		}
		];
	});

	it('should add a new user', () => {
		var users = new Users();
		var user = {
			id: '001',
			name: 'Fan',
			room: 'Football'
		};

		var resUser = users.addUser(user.id, user.name, user.room);	
		expect(users.users).toEqual([user]);
	});

	it('should return names for node course', () => {
		var userList = users.getUsersList('Node Course');
		expect(userList).toEqual(['Mike', 'Julie']);
	});

	it('should find a user', () => {
		var userId = '2';
		var user = users.getUser(userId);
		expect(user.id).toBe(userId);
	});

	it('should not find a user', () => {
		var userId = '100';
		var user = users.getUser(userId);
		expect(user).toNotExist();
	});

	it('should remove a user', () => {
		var userId = '1';
		var user = users.removeUser(userId);

		expect(user.id).toBe(userId);
		expect(users.users.length).toBe(2);
	});

	it('should not remove a user', () => {
		var userId = '99';
		var user = users.removeUser(userId);

		expect(user).toNotExist();
		expect(users.users.length).toBe(3);
	});
})