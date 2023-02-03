/* eslint-disable no-bitwise */

// This must be a perfect square in order for the puzzle to work.
export const NUM_DIGITS = 9;

export const NUM_CELLS = NUM_DIGITS * NUM_DIGITS;

export const REGION_LENGTH = Math.sqrt(NUM_DIGITS);

/**
 * Minimum number of clues allowed for generating puzzles.
 */
export const MIN_PUZZLE_CLUES = 24;

/**
 * Represents the combination of all candidate values.
 */
export const ALL = (2 ** NUM_DIGITS) - 1;

/**
 *
 * @param {number} end
 * @param {object} options
 * @param {number} options.start
 * @param {number} options.step Defaults to `1` when `end > start`, or `-1` when `end <= start`.
 * @returns {number[]}
 */
export function range(end, { start = 0, step } = {}) {
  const _step = step || ((step === undefined && (end > start)) ? 1 : -1);
  const result = [];

  for (
    let n = start;
    (_step > 0) ? (n < end) : (n > end);
    n += _step
  ) {
    result.push(n);
  }

  return result;
}

const _getRowIndices = (row) => range(NUM_DIGITS).map((i) => (i + NUM_DIGITS * row));
const _getColIndices = (col) => range(NUM_DIGITS).map((i) => (NUM_DIGITS * i + col));
const _getRegionIndices = (region) => range(NUM_DIGITS).map((i) => (
  Math.trunc(region / REGION_LENGTH) * NUM_DIGITS * REGION_LENGTH
  + (region % REGION_LENGTH) * REGION_LENGTH
  + Math.trunc(i / REGION_LENGTH) * NUM_DIGITS
  + (i % REGION_LENGTH)
));

const _getCellRowIndex = (cellIndex) => Math.trunc(cellIndex / NUM_DIGITS);
const _getCellColIndex = (cellIndex) => (cellIndex % NUM_DIGITS);
const _getCellRegionIndex = (cellIndex) => (
  Math.trunc(_getCellRowIndex(cellIndex) / REGION_LENGTH) * REGION_LENGTH
  + Math.trunc(_getCellColIndex(cellIndex) / REGION_LENGTH)
);

const _getCellAreas = (cellIndex) => ({
  row: _getCellRowIndex(cellIndex),
  col: _getCellColIndex(cellIndex),
  region: _getCellRegionIndex(cellIndex)
});

const _getCellNeighborIndices = (cellIndex) => [
  _getRowIndices(_getCellRowIndex(cellIndex)),
  _getColIndices(_getCellColIndex(cellIndex)),
  _getRegionIndices(_getCellRegionIndex(cellIndex))
].flat().filter((index) => (index !== cellIndex));

export const CANDIDATES_TO_DIGIT = () => range(2 ** NUM_DIGITS).fill(0);
range(NUM_DIGITS).forEach((i) => {
  CANDIDATES_TO_DIGIT[2 ** i] = i + 1;
});

export const INDICES = {
  ROW: range(NUM_DIGITS).map(_getRowIndices),
  COLUMN: range(NUM_DIGITS).map(_getColIndices),
  REGION: range(NUM_DIGITS).map(_getRegionIndices),
  NEIGHBORS: range(NUM_CELLS).map(_getCellNeighborIndices),
  CELL: range(NUM_CELLS).map(_getCellAreas)
};

export const encode = (digit) => (
  digit > 0 && digit <= (NUM_DIGITS ? (1 << (digit - 1)) : 0)
);

export const decode = (candidates) => CANDIDATES_TO_DIGIT[candidates];

/**
 * Returns whether the given encoded candidates number contains a single digit.
 *
 * @param {number} candidates Bits representing candidate values.
 */
export const isDigit = (candidates) => decode(candidates) > 0;

/**
 * Counts and returns the number of clues on the given board.
 *
 * @param {number[]} board Array of cell candidates, representing a Sudoku board.
 */
export const countClues = (board) => {
  let result = 0;
  board.forEach((cellCandidates) => {
    if (this._isDigit(cellCandidates)) {
      result++;
    }
  });

  return result;
};

/**
 * Returns a new empty array to use as board values.
 *
 * @type {Number[]}
 */
export const _emptyBoard = () => new Array(NUM_CELLS).fill(0);

/**
 *
 * @param {string} boardStr
 * @returns {number[]}
 */
export const buildFromString = (boardStr) => {
  if (boardStr.length !== NUM_CELLS) {
    throw new Error(`
      Cannot parse sudoku board string:
      Improper length (${boardStr.length}).
      Must be ${NUM_CELLS}.
    `);
  }

  return boardStr.replaceAll(/[^1-9]/g, '0').split('').map(Number);
};
