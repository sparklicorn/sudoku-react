import {
  countClues,
  _emptyBoard,
  MIN_PUZZLE_CLUES,
  NUM_CELLS,
  NUM_ROWS,
  NUM_COLUMNS,
  NUM_REGIONS,
  forEachNeighbor,
  getCellRowIndex
} from '../helpers/sudokuHelpers';

import { confine } from '../helpers/math';

import Solver from '../services/sudokuSolverService';
import Generator from '../services/sudokuGeneratorService';

class Sudoku {

  /**
   * @typedef CellData
   * @type {object}
   * @property {number} value
   * @property {boolean} locked Whether the cell value can be changed.
   * @property {number} invalidLevel A measure of how invalid the cell is. [0-4]
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
     * @type {Map<number, CellData}
     */
    this._cells = new Map();

    /** @type {number[]} */
    this._invalidRows = new Array(NUM_ROWS);
    /** @type {number[]} */
    this._invalidColumns = new Array(NUM_COLUMNS);
    /** @type {number[]} */
    this._invalidRegions = new Array(NUM_REGIONS);
    /** @type {number[]} */
    this._invalidCells = new Array(NUM_CELLS);

    this._invalidRows.fill(0);
    this._invalidColumns.fill(0);
    this._invalidRegions.fill(0);
    this._invalidCells.fill(0);

    _puzzle.forEach((value, index) => {
      this._cells.set(index, {
        value: 0,
        locked: false,
        invalidLevel: 0
      });

      this.setValue(index, value);
      this._lock(index);
    });

    /**
     * @type {number}
     */
    this.numClues = 0;
  }

  /**
   * Sets the value of the given index.
   * 
   * @param {*} cellIndex 
   * @param {*} value
   */
  setValue(cellIndex, value) {
    const _cellIndex = confine(cellIndex, 0, NUM_CELLS);
    const _value = confine(value, 0, 9);
    const cellData = this._cells.get(_cellIndex);

    if (cellData.locked) {
      return;
    }

    this._cells.get(cellIndex).value = value;

    const row = getCellRowIndex(cellIndex);
    if (!this._isRowValid(row)) {
      forRow(row, (rowCellIndex) => {

      });
    }

    forEachNeighbor(cellIndex, (neighborIndex) => {

    });
  }

  /**
   * @callback cellMapCallback
   * @param {object} cellData
   * @returns {*}
   */

  /**
   * // TODO
   * @param {cellMapCallback} callback
   */
  mapOverCells(func) {
    // TODO
  }

  _lock(cellIndex) {
    const _cellIndex = confine(cellIndex, 0, NUM_CELLS);
    const cellData = this._cells.get(_cellIndex);
    cellData.locked = true;
  }

  _isRowValid(rowIndex) {

  }
}

export default Sudoku;
