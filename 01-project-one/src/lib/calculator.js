/**
 * It sums two given numbers.
 *
 * @param {number|string} num1 The first operator.
 * @param {number|string} num2 The second operator.
 * @returns {number} The operation result.
 */
export function sum(num1, num2) {
  const int1 = parseInt(num1);
  const int2 = parseInt(num2);

  if (isNaN(int1) || isNaN(int2)) {
    throw new Error('Invalid argument. Please, check your input.');
  }

  return int1 + int2;
}
