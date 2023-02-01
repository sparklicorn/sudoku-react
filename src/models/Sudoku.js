import {
  countClues,
  _emptyBoard,
  MIN_PUZZLE_CLUES,
  NUM_CELLS,
  forArea as forAreaIndices,
  getCellRowIndex,
  getCellColIndex,
  getCellRegionIndex,
  ROW_INDICES,
  COL_INDICES,
  REGION_INDICES,
  NUM_DIGITS,
  forEachNeighbor
} from '../helpers/sudokuHelpers';

import { confine } from '../helpers/math';

import Solver from '../services/sudokuSolverService';

class Sudoku {

  /**
   * @typedef CellData
   * @type {object}
   * @property {number} value
   * @property {boolean} locked Whether the cell value can be changed.
   * @property {number} invalidLevel A measure of how invalid the cell is. [0-4]
   */

  static INVALID_ROW_FLAG = 8;
  static INVALID_COL_FLAG = 4;
  static INVALID_REGION_FLAG = 2;
  static INVALID_CELL_FLAG = 1;

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

    for (let i = 0; i < NUM_CELLS; i++) {
      this._cells.set(i, {
        value: 0,
        locked: false,
        invalidLevel: 0
      });
    }

    _puzzle.forEach((value, index) => {
      this.setValue(index, value);
      this._lock(index);
    });

    /**
     * @type {number}
     */
    this.numClues = 0;
  }

  get cellData() {
    return this._cells;
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

    this._cells.get(_cellIndex).value = _value;
    this._updateValidity(_cellIndex);
  }

  _lock(cellIndex) {
    const _cellIndex = confine(cellIndex, 0, NUM_CELLS);
    const cellData = this._cells.get(_cellIndex);
    cellData.locked = true;
  }

  _updateValidity(cellIndex) {
    // Reset all neighbor's invalid levels
    forEachNeighbor(cellIndex, (neighborIndex) => {
      this._cells.get(neighborIndex).invalidLevel = 0;
    }, true);

    const row = getCellRowIndex(cellIndex);
    const rowValidity = this._isAreaValid(ROW_INDICES[row]);
    if (rowValidity.length > 0) {
      this._forArea(ROW_INDICES[row], (cellData, _areaCellIndex) => {
        cellData.invalidLevel |= Sudoku.INVALID_ROW_FLAG;
      });
      this._forArea(rowValidity, (cellData, _areaCellIndex) => {
        cellData.invalidLevel |= Sudoku.INVALID_CELL_FLAG;
      });
    }

    const col = getCellColIndex(cellIndex);
    const colValidity = this._isAreaValid(COL_INDICES[col]);
    if (colValidity.length > 0) {
      this._forArea(COL_INDICES[col], (cellData, _areaCellIndex) => {
        cellData.invalidLevel |= Sudoku.INVALID_COL_FLAG;
      });
      this._forArea(colValidity, (cellData, _areaCellIndex) => {
        cellData.invalidLevel |= Sudoku.INVALID_CELL_FLAG;
      });
    }

    const region = getCellRegionIndex(cellIndex);
    const regionValidity = this._isAreaValid(REGION_INDICES[region]);
    if (regionValidity.length > 0) {
      this._forArea(REGION_INDICES[region], (cellData, _areaCellIndex) => {
        cellData.invalidLevel |= Sudoku.INVALID_REGION_FLAG;
      });
      this._forArea(regionValidity, (cellData, _areaCellIndex) => {
        cellData.invalidLevel |= Sudoku.INVALID_CELL_FLAG;
      });
    }
  }

  /**
   *
   * @param {number[]} areaIndices
   * @returns {number[]} Array containing indices of duplicate area values.
   */
  _isAreaValid(areaIndices) {
    const result = [];
    let seen = new Array(NUM_DIGITS);
    seen.fill(-1);

    this._forArea(areaIndices, (cellData, cellIndex) => {
      if (cellData.value > 0) {
        if (seen[cellData.value] > -1) {
          result.push(cellIndex);
          result.push(seen[cellData.value]);
        }
        seen[cellData.value] = cellIndex;
      }
    });

    return result;
  }

  /**
   * @callback CellCallbackFn
   * @param {CellData} cellData
   * @param {number} cellIndex
   */

  /**
   * @param {number[]} indices
   * @param {CellCallbackFn} callbackFn
   */
  _forArea(indices, callbackFn) {
    forAreaIndices(indices, (cellIndex) => {
      const cellData = this._cells.get(cellIndex);
      callbackFn(cellData, cellIndex);
    });
  }
}

export default Sudoku;
