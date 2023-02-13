/**
 * It returns an string combining the given key-value destructured from
 * the current item in the loop.
 *
 * @param {array} array An array containing the key-value pairs.
 * @returns {string} An string combining the key-value pairs.
 */
function keyValueToString([key, value]) {
	if (typeof value === 'object' && !Array.isArray(value)) {
		throw new Error(
			'Deep nested objects are not supported. Please, check your input.'
		);
	}

	return `${key}=${value}`;
}

/**
 * Checks if a given query string has a valid format.
 *
 * @param {string} qs The query string to be validated.
 * @returns {boolean} Whether the given query string has a property format or not.
 */
function isValidQueryString(qs) {
	return qs.match(/^(\?[\w\d]+=[\w\d\.,]+)(&[\w\d]+=[\w\d\.,]+)*$/g);
}

/**
 * It receives an object and converts into a query string format.
 *
 * @param {object} obj The object to be parsed.
 * @returns {string} The resultant query string.
 */
export function objectToQueryString(obj) {
	return `?${Object.entries(obj).map(keyValueToString).join('&')}`;
}

/**
 * It returns a parsed object from a given query string.
 *
 * @param {string} qs The query string.
 * @returns {object} The parsed object.
 */
export function queryStringToObject(qs) {
	if (!isValidQueryString(qs)) {
		throw new Error('Invalid query string syntax. Please, check your input');
	}

	return Object.fromEntries(
		qs
			.replace(/^\?/, '')
			.split('&')
			.map((entry) => {
				let [key, value] = entry.split('=');

				if (value.includes(',')) {
					value = value.split(',');
				}

				return [key, value];
			})
	);
}
