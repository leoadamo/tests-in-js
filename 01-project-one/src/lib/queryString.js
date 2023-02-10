/**
 * It returns an string combining the given key-value destructured from
 * the current item in the loop.
 *
 * @param {array} array An array containing the key-value pairs.
 * @returns {string} An string combining the key-value pairs.
 */
const keyValueToString = ([key, value]) => {
  if (typeof value === 'object' && !Array.isArray(value)) {
    throw new Error(
      'Deep nested objects are not supported. Please, check your input.'
    );
  }

  return `${key}=${value}`;
};

/**
 * Checks if a given query string has a valid format.
 *
 * @param {string} qs The query string to be validated.
 * @returns {boolean} Whether the given query string has a property format or not.
 */
const isValidQueryString = (qs) =>
  qs.match(/^(\?[\w\d]+=[\w\d]+)(&[\w\d]+=[\w\d]+)*$/g);

/**
 * It receives an object and converts into a query string format.
 *
 * @param {object} obj The object to be parsed.
 * @returns {string} The resultant query string.
 */
const objectToQueryString = (obj) =>
  `?${Object.entries(obj).map(keyValueToString).join('&')}`;

/**
 * It returns a parsed object from a given query string.
 *
 * @param {string} qs The query string.
 * @returns {object} The parsed object.
 */
const queryStringToObject = (qs) => {
  if (!isValidQueryString(qs)) {
    throw new Error('Invalid query string syntax. Please, check your input');
  }

  return Object.fromEntries(
    qs
      .replace(/^\?/, '')
      .split('&')
      .map((entry) => entry.split('='))
  );
};

module.exports = {
  objectToQueryString,
  queryStringToObject,
};
