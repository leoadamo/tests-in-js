// DEPENDENCIES
import { objectToQueryString, queryStringToObject } from './queryString';

describe('queryString.js: Converting objects into query strings', () => {
	it('Should create a valid query string when an object is provided.', () => {
		const obj = {
			name: 'Leonardo',
			role: 'Developer',
		};

		expect(objectToQueryString(obj)).toBe('?name=Leonardo&role=Developer');
	});

	it("Should create a valid query string even when an array is passed as an Object's property value.", () => {
		const obj = {
			name: 'Leonardo',
			role: 'Developer',
			skills: ['Vue.js', 'Jest'],
		};

		expect(objectToQueryString(obj)).toBe(
			'?name=Leonardo&role=Developer&skills=Vue.js,Jest'
		);
	});

	it('Should throw an error when we are passing deep nested objects.', () => {
		const obj = {
			name: 'Leonardo',
			role: 'Developer',
			address: {
				city: 'Pelotas',
				stateAbbr: 'RS',
				country: 'BR',
			},
		};

		expect(() => {
			objectToQueryString(obj);
		}).toThrowError();
	});
});

describe('queryString.js: Converting query strings into objects', () => {
	it('Should convert a given query string into an object.', () => {
		const qs = '?name=Leonardo&role=Developer';

		expect(queryStringToObject(qs)).toEqual({
			name: 'Leonardo',
			role: 'Developer',
		});
	});

	it('Should convert a given query string into an object even when a single parameter is given.', () => {
		const qs = '?name=Leonardo';

		expect(queryStringToObject(qs)).toEqual({
			name: 'Leonardo',
		});
	});

	it('Should convert a query string into an object taking care of comma separated values.', () => {
		const qs = '?name=Leonardo&abilities=Vue.js,Jest';

		expect(queryStringToObject(qs)).toEqual({
			name: 'Leonardo',
			abilities: ['Vue.js', 'Jest'],
		});
	});

	it("Should throw an error if the given query string hasn't a valid format.", () => {
		const invalidQs = 'name=Leonardo_role=Developer';

		expect(() => {
			queryStringToObject(invalidQs);
		}).toThrowError();
	});
});
