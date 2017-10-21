const expect = require('expect');

const {isRealString} = require('./validation');

describe('isRealString', () => {
	it('should reject non-string values', () => {
		var res = isRealString(123);
		expect(res).toBe(false);
	});

	it('should reject string with only spaced', () => {
		var res = isRealString('   ');
		expect(res).toBe(false);
	});

	it('should allow string with non-space characters', () => {
		var res= isRealString('test string  ');
		expect(res).toBe(true);
	})
});