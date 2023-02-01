/**
 * Builds an index of rows -> cell indicies in row.
 *
 * @type {number[][]}
 */
const _getRowIndices = () => {
  const result = new Array(NUM_ROWS);

  for (let row = 0; row < NUM_ROWS; row++) {
    result[row] = new Array(NUM_DIGITS);

    for (let i = 0; i < NUM_DIGITS; i++) {
      result[row][i] = row * NUM_DIGITS + i;
    }
  }

  return result;
};

/**
 * Builds an index of columns -> cell indicies in column.
 *
 * @type {number[][]}
 */
const _getColIndices = () => {
  const result = new Array(NUM_COLUMNS);

  for (let col = 0; col < NUM_COLUMNS; col++) {
    result[col] = new Array(NUM_DIGITS);

    for (let i = 0; i < NUM_DIGITS; i++) {
      result[col][i] = col + i * NUM_DIGITS;
    }
  }

  return result;
};

/**
 * Builds an index of regions -> cell indicies in region.
 *
 * @type {number[][]}
 */
const _getRegionIndices = () => {
  const result = new Array(NUM_REGIONS);

  for (let region = 0; region < NUM_REGIONS; region++) {
    result[region] = new Array(NUM_DIGITS);

    const subRow = Math.trunc(region / NUM_ROWS_IN_REGION);
    const subCol = region % NUM_COLS_IN_REGION;
    for (let i = 0; i < NUM_DIGITS; i++) {
      result[region][i] =
        subRow * NUM_DIGITS * NUM_ROWS_IN_REGION +
        subCol * NUM_COLS_IN_REGION +
        Math.trunc(i / NUM_ROWS_IN_REGION) * NUM_DIGITS +
        (i % NUM_COLS_IN_REGION);
    }
  }

  return result;
};

/**
 * Builds an index of candidate values -> digit value.
 * Useful for a O(1) look-up of whether a candidate represents a digit.
 *
 * @type {number[][]}
 */
const _getCandidatesToDigitsMap = () => {
  const result = new Array(1 << NUM_DIGITS);
  result.fill(0);

  for (let digit = 1; digit <= NUM_DIGITS; digit++) {
    result[1 << (digit - 1)] = digit;
  }

  return result;
};

export const NUM_CELLS = 81;
export const NUM_DIGITS = 9;
export const NUM_ROWS = 9;
export const NUM_COLUMNS = 9;
export const NUM_REGIONS = 9;
export const NUM_ROWS_IN_REGION = 3;
export const NUM_COLS_IN_REGION = 3;

/**
 * @type {number[][]}
 */
export const ROW_INDICES = _getRowIndices();

/**
 * @type {number[][]}
 */
export const COL_INDICES = _getColIndices();

/**
 * @type {number[][]}
 */
export const REGION_INDICES = _getRegionIndices();

/**
 * @type {number[]}
 */
export const CANDIDATES_TO_DIGIT = _getCandidatesToDigitsMap();

/**
 * Minimum number of clues allowed for generating puzzles.
 */
export const MIN_PUZZLE_CLUES = 24;

/**
 * Represents the combination of all candidate values.
 */
export const ALL = 0x1ff;

export const encode = (digit) => {
  return digit > 0 && digit <= NUM_DIGITS ? 1 << (digit - 1) : 0;
};

export const decode = (candidates) => {
  return CANDIDATES_TO_DIGIT[candidates];
};

/**
 * Returns whether the given encoded candidates number contains a single digit.
 *
 * @param {number} candidates Bits representing candidate values.
 */
export const isDigit = (candidates) => {
  return decode(candidates) > 0;
};

/**
 * Counts and returns the number of clues on the given board.
 *
 * @param {number[]} board Array of cell candidates, representing a Sudoku board.
 */
export const countClues = (board) => {
  let result = 0;
  for (let cellCandidates in board) {
    if (this._isDigit(cellCandidates)) {
      result++;
    }
  }
  return result;
};

/**
 * Returns a new empty array to use as board values.
 *
 * @type {Number[]}
 */
export const _emptyBoard = () => {
  const emptyBoard = new Array(NUM_CELLS);
  emptyBoard.fill(0);
  return emptyBoard;
};

export const getCellRowIndex = (cellIndex) => Math.trunc(cellIndex / NUM_COLUMNS);
export const getCellColIndex = (cellIndex) => (cellIndex % NUM_COLUMNS);
export const getCellRegionIndex = (cellIndex) => {
  const row = getCellRowIndex(cellIndex);
  const col = getCellColIndex(cellIndex);
  return Math.trunc(row / NUM_COLS_IN_REGION) * NUM_COLS_IN_REGION + Math.trunc(col / NUM_COLS_IN_REGION);
};

/**
 *
 * @param {string} boardStr
 * @returns {number[]}
 */
export const buildFromString = (boardStr) => {
  if (boardStr.length != NUM_CELLS) {
    throw new Error(`Cannot parse sudoku board string: Improper length (${boardStr.length}). Must be ${NUM_CELLS}.`);
  }

  return boardStr.replaceAll(/[^1-9]/g, '0').split('').map(Number);
}

/**
 * @callback Callback
 * @param {number} cellIndex
 */

/**
 *
 * @param {number} cellIndex
 * @param {NeighborCallback} callback
 * @param {boolean} inclusive Whether `callback` should also be invoked for the given `cellIndex`.
 */
export const forEachNeighbor = (cellIndex, callback, inclusive = false) => {
  const invokeCallbackForNeighbor = (neighborIndex) => {
    if (neighborIndex !== cellIndex || inclusive) {
      callback(neighborIndex);
    }
  };

  ROW_INDICES[getCellRowIndex(cellIndex)].forEach(invokeCallbackForNeighbor);
  COL_INDICES[getCellColIndex(cellIndex)].forEach(invokeCallbackForNeighbor);
  REGION_INDICES[getCellRegionIndex(cellIndex)].forEach(invokeCallbackForNeighbor);
};

/**
 *
 * @param {number} indices
 * @param {Callback} callback
 */
export const forArea = (indices, callback) => {
  indices.forEach((cellIndex) => callback(cellIndex));
};
