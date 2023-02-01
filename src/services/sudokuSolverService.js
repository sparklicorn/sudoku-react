import {
  isDigit,
  ALL,
  NUM_DIGITS
} from '../helpers/sudokuHelpers';

class Constraints {
  static ROW_MASK = ALL << (NUM_DIGITS * 2);
  static COLUMN_MASK = ALL << NUM_DIGITS;
  static REGION_MASK = ALL;
  
  /**
   * 
   * @param {Constraints} other 
   */
  static copy(other) {
    const result = new Constraints();
    result.values = [...other.values];
  }

  /**
   * Creates a new Contraints mapping from a board, if provided.
   * 
   * @param {number[]} board 
   */
  constructor(board = null) {
    /**
     * Contains the contraints in the form `[... other bits][9 row bits][9 column bits][9 region bits]`.
     * Use the provided masks to filter for row, column, or region constraints.
     */
    this.values = new Array(NUM_DIGITS);

    if (board) {
      board.forEach((candidates, cellIndex) => {
        if (isDigit(candidates)) {
          add(cellIndex, decode(candidates));
        }
      });
    }
  }

  getForRow(rowIndex) {
    return (this.values[rowIndex] & ROW_MASK) >> (NUM_DIGITS * 2);
  }

  getForCol(columnIndex) {
    return (this.values[columnIndex] & COLUMN_MASK) >> NUM_DIGITS;
  }

  getForRegion(regionIndex) {
    return this.values[regionIndex] & REGION_MASK;
  }

  getForCell(cellIndex) {
    return getForRow(getCellRowIndex(cellIndex)) |
      getForCol(getCellColIndex(cellIndex)) |
      getForRegion(getCellRegionIndex(cellIndex));

    // int row = this.values[getCellRowIndex(cellIndex)] & ROW_MASK;
    // int col = this.values[getCellColIndex(cellIndex)] & COLUMN_MASK;
    // int region = this.values[getCellRegionIndex(cellIndex)] & REGION_MASK;

    // return row | col | region;
  }

  add(cellIndex, digit) {
    rowIndex = getCellRowIndex(cellIndex);
    columnIndex = getCellColIndex(cellIndex);
    regionIndex = getCellRegionIndex(cellIndex);
    // System.out.printf("Adding constraint on %d (%d,%d) -> %d\n", cellIndex, rowIndex + 1, columnIndex + 1, digit);

    this.values[rowIndex] |= 1 << (digit - 1 + (NUM_DIGITS * 2));
    this.values[columnIndex] |= 1 << (digit - 1 + NUM_DIGITS);
    this.values[regionIndex] |= 1 << (digit - 1);
  }

  // inspect(cellIndex) {
  //   return new [
  //     Integer.toBinaryString(getForRow(getCellRowIndex(cellIndex))),
  //     Integer.toBinaryString(getForCol(getCellColIndex(cellIndex))),
  //     Integer.toBinaryString(getForRegion(getCellRegionIndex(cellIndex))),
  //     Integer.toBinaryString(getForCell(cellIndex))
  //   ];
  // }

  // toString(cellIndex) {
  //   return String.format(
  //     "row: %s, col: %s, reg: %s, cel: %s",
  //     d(getForRow(getCellRowIndex(cellIndex))),
  //     d(getForCol(getCellColIndex(cellIndex))),
  //     d(getForRegion(getCellRegionIndex(cellIndex))),
  //     d(getForCell(cellIndex))
  //   );
  // }

  // bin(constraints) {
  //   const str = Integer.toBinaryString(constraints);
  //   const pad = "";

  //   if (str.length() < Board.NUM_DIGITS) {
  //     pad = "0".repeat(Board.NUM_DIGITS - str.length());
  //   }

  //   return pad + str;
  // }
}
// Other utility / private functions

export default {
  /**
   * Attempts to get all solutions for the given puzzle. Note that if there are
   * multiple solutions, then the given puzzle is not a Sudoku.
   * This may take a long time if there are few clues on the puzzle.
   *
   * @param {number[]} puzzle
   * @returns {number[][]}
   */
  getSolutions: (puzzle) => {
    // TODO
    return [];
  },

  /**
   * Determines if the puzzle solves to a single solution.
   * This may take a long time if there are few clues on the puzzle.
   *
   * @param {number[]} puzzle
   * @returns True if the board has exactly one solution.
   */
  isSudoku: (puzzle) => {
    // TODO
    return false;
  },

  /**
   * Determines if the puzzle solves uniquely to the given solution.
   * This may take a long time if there are few clues on the puzzle.
   *
   * @param {number[]} puzzle
   * @param {number[]} solution
   */
  verifySolution: (puzzle, solution) => {
    // TODO
    return false;
  },

  /**
   * Attempts to solve the given puzzle.
   * This may take a long time if there are few clues on the puzzle.
   *
   * @param {number[]} puzzle
   * @returns {number[]} The puzzle solution, or `null` if none exists.
   */
  solve: (puzzle) => {
    // TODO
    return [];
  }
};
