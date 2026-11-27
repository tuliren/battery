import { expect, test } from '@jest/globals';

import { soften } from '@/salmon/palette';

// Reference values from the Tinycharts Pro build script's soften().
const CASES = [
  ['#ecc98e', '#e3c999'],
  ['#ef6a4c', '#d6826d'],
  ['#76a0e2', '#96adc7'],
  ['#93d3b0', '#a0cab4'],
  ['#8a6a55', '#9e7e71'],
  ['#2b2930', '#2a2b2f'],
  ['#e45a4f', '#d47867'],
];

test.each(CASES)('soften(%s) = %s', (input, expected) => {
  expect(soften(input)).toBe(expected);
});
