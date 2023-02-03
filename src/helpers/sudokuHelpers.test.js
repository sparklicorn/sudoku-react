import * as sudokuHelpers from './sudokuHelpers';

describe('buildFromString', () => {
  describe('when input is not length 81', () => {
    test('throws error', () => {
      expect(
        () => sudokuHelpers.buildFromString('1'.repeat(60))
      ).toThrow();
    });
  });

  describe('when input is correct length', () => {
    const inputStrs = [
      '84..7.59.5.....38....5.3..2.2.....1.3.....9...7.9.52..9.5..4.....7.1....28...7...'
    ];

    const expected = [
      [
        8, 4, 0, 0, 7, 0, 5, 9, 0,
        5, 0, 0, 0, 0, 0, 3, 8, 0,
        0, 0, 0, 5, 0, 3, 0, 0, 2,
        0, 2, 0, 0, 0, 0, 0, 1, 0,
        3, 0, 0, 0, 0, 0, 9, 0, 0,
        0, 7, 0, 9, 0, 5, 2, 0, 0,
        9, 0, 5, 0, 0, 4, 0, 0, 0,
        0, 0, 7, 0, 1, 0, 0, 0, 0,
        2, 8, 0, 0, 0, 7, 0, 0, 0
      ]
    ];

    test('converts to the expected array', () => {
      inputStrs.forEach((input, index) => {
        expect(
          sudokuHelpers.buildFromString(input)
        ).toEqual(expected[index]);
      });
    });
  });
});
