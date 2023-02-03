/* eslint-disable no-bitwise */
import {
  countClues,
  _emptyBoard,
  MIN_PUZZLE_CLUES,
  NUM_CELLS,
  NUM_DIGITS,
  INDICES,
} from '../helpers/sudokuHelpers';

import { confine } from '../helpers/math';

import Solver from '../services/sudokuSolverService';

class Sudoku {
  /**
   * @typedef CellData
   * @type {object}
   * @property {number} value
   * @property {boolean} locked Whether the cell value can be changed.
   * @property {number} valid True if the cell's row, column, or region is invalid.
   */

  /**
   * Tests whether the puzzle is valid, throwing an exception if it is null, empty,
   * has too few clues, or does not solve into a single solution. The solution is
   * returned if the puzzle is valid.
   *
   * The validation process attempts to get all solutions for the puzzle, which may
   * be an expensive operation for puzzles with few clues.
   *
   * @param puzzle {number[]}
   * @return The puzzle's solution
   * @throws NullPointerException if <code>puzzle</code> is null.
   * @throws IllegalArgumentException if <code>puzzle</code> is incorrect size,
   * contains too few or too many clues, or does not have one and only one solution.
   */
  static _validatePuzzle(puzzle) {
    if (puzzle == null) {
      throw new Error('Sudoku puzzle cannot be null.');
    }

    if (puzzle.length !== NUM_CELLS) {
      throw new Error(`Sudoku puzzle array must have length ${NUM_CELLS}.`);
    }

    // TODO this logic doesn't fit here - this func shouldn't care about num clues
    const clues = countClues(puzzle);
    if (clues < MIN_PUZZLE_CLUES) {
      throw new Error(
        `Sudoku puzzle array has too few clues (${clues}, min is ${MIN_PUZZLE_CLUES})`
      );
    } else if (clues > NUM_CELLS) {
      throw new Error(
        `Sudoku puzzle array has too many clues (${clues}, max is ${NUM_CELLS})`
      );
    }

    const solutions = Solver.getSolutions(puzzle);
    if (solutions.length === 0) {
      throw new Error('Sudoku puzzle has no solution.');
    }
    if (solutions.length > 1) {
      throw new Error('Sudoku puzzle has multiple solutions.');
    }

    return solutions.get(0);
  }

  /**
   * @typedef ValidityMap
   * @type {object}
   * @property {boolean[]} ROW
   * @property {boolean[]} COL
   * @property {boolean[]} REGION
   */

  /**
   * @typedef options
   * @type {object}
   * @property {Number[]} solution
   * @property {Number[]} puzzle
   */

  /**
   *
   * @param {options} options
   */
  constructor({ solution, puzzle } = {}) {
    /**
     * @type {number[]}
     */
    const _puzzle = puzzle || _emptyBoard();

    /**
     * @type ValidityMap
     */
    this._validity = {
      ROW: new Array(NUM_DIGITS).fill(true),
      COL: new Array(NUM_DIGITS).fill(true),
      REGION: new Array(NUM_DIGITS).fill(true),
    };

    /**
     * @type {CellData[]}
     */
    this._cells = new Array(NUM_CELLS);

    for (let i = 0; i < NUM_CELLS; i++) {
      this._cells[i] = ({
        value: 0,
        locked: false
      });
    }

    _puzzle.forEach((value, index) => {
      if (value > 0) {
        this.setValue(index, value, { skipValidation: true });
        this._lock(index);
      }
    });
  }

  /**
   * @type {CellData[]}
   */
  get cellData() {
    const copy = new Array(NUM_CELLS);
    for (let i = 0; i < NUM_CELLS; i++) {
      copy[i] = {
        value: this._cells[i].value,
        locked: this._cells[i].locked,
        valid: this._isCellValid(i),
      };
    }
    return copy;
  }

  get validity() {
    return {
      ROW: [...this._validity.ROW]
    };
  }

  /**
   * Sets the value of the given index.
   *
   * @param {*} cellIndex
   * @param {*} value
   */
  setValue(
    cellIndex,
    value,
    { skipValidation } = { skipValidation: false }
  ) {
    const _cellIndex = confine(cellIndex, 0, NUM_CELLS);
    const _value = confine(value, 0, 9);
    const cellData = this._cells[_cellIndex];

    if (cellData.locked) {
      return;
    }

    const prevValue = cellData.value;
    cellData.value = _value;
    // if (!skipValidation && (prevValue !== _value)) {
    //   console.log('updating validity');
    this._updateValidity(_cellIndex);
    // }
  }

  /**
   *
   * @param {number} cellIndex
   * @returns {boolean}
   */
  _isCellValid(cellIndex) {
    const { row, col, region } = INDICES.CELL[cellIndex];
    return (
      this._validity.ROW[row] && this._validity.COL[col] && this._validity.REGION[region]
    );
  }

  _lock(cellIndex) {
    const _cellIndex = confine(cellIndex, 0, NUM_CELLS);
    const cellData = this._cells[_cellIndex];
    cellData.locked = true;
  }

  _updateValidity(cellIndex) {
    const { row, col, region } = INDICES.CELL[cellIndex];
    this._validity.ROW[row] = this._isAreaValid(INDICES.ROW[row]);
    this._validity.COL[col] = this._isAreaValid(INDICES.COLUMN[col]);
    this._validity.REGION[region] = this._isAreaValid(INDICES.REGION[region]);
  }

  /**
   *
   * @param {number[]} areaIndices
   * @returns {boolean}
   */
  _isAreaValid(areaIndices) {
    const seen = new Array(NUM_DIGITS);
    seen.fill(false);

    for (let i = 0; i < areaIndices.length; i++) {
      const cell = this._cells[areaIndices[i]];
      const cellValue = cell.value;

      if (cellValue > 0) {
        if (seen[cellValue]) {
          return false;
        }
        seen[cellValue] = true;
      }
    }

    return true;
  }
}

export default Sudoku;
