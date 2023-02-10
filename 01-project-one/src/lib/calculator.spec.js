// DEPENDENCIES
const { sum } = require('./calculator');

it('Should sum 2 and 2 and the result must be 4.', () => {
  expect(sum(2, 2)).toBe(4);
});

it('Should sum "2" and 2 even if one of them is a string and the result must keep being 4.', () => {
  expect(sum('2', 2)).toBe(4);
});

it('Should throw an error if one of the operators cannot be converted into a number.', () => {
  expect(() => {
    sum('', 2);
  }).toThrowError();

  expect(() => {
    sum([2, 2]);
  }).toThrowError();

  expect(() => {
    sum({});
  }).toThrowError();

  expect(() => {
    sum();
  }).toThrowError();
});
