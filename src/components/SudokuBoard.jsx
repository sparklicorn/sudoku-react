import React from 'react';
import PropTypes from 'prop-types';

import {
  buildFromString, INDICES, NUM_DIGITS, range
} from '../helpers/sudokuHelpers';

import Sudoku from '../models/Sudoku';

import '../styles/components/SudokuBoard.scss';

class SudokuBoard extends React.Component {
  /**
   *
   * @param {object} props
   * @param {Sudoku} props.sudoku
   */
  constructor(props) {
    super(props);

    const { sudoku } = props;

    /**
     * @typedef SudokuBoardState
     * @type {object}
     * @property {CellData[]} cellData
     * @property {number} selected
     */

    /**
     * @type {SudokuBoardState}
     */
    this.state = {
      cellData: sudoku.cellData,
      selected: -1
    };

    this._onKeyDown = this._onKeyDown.bind(this);
  }

  _refreshState() {
    const { sudoku } = this.props;
    this.setState({ cellData: sudoku.cellData });
  }

  /**
   *
   * @param {number} newValue
   */
  _updateSelectedCellValue(newValue) {
    const { selected } = this.state;
    const isCellSelected = selected > 1;

    if (isCellSelected) {
      const { sudoku } = this.props;
      sudoku.setValue(selected, newValue);
      this._refreshState();
    }
  }

  /**
   *
   * @param {KeyboardEvent} event
   */
  _onKeyDown(event) {
    console.log(`_onKeyDown(event.key: '${event.key}')`);

    switch (event.key) {
      case '1': case '2': case '3': case '4': case '5':
      case '6': case '7': case '8': case '9':
        this._updateSelectedCellValue(parseInt(event.key, 10));
        break;
      case 'Escape':
        // Deselect cell
        this.setState({ selected: -1 });
        break;
      case 'Backspace':
        this._updateSelectedCellValue(0);
        break;
      default:
        break;
    }
  }

  /**
   *
   * @param {MouseEvent} event
   * @param {number} cellIndex
   */
  _onMouseDown(event, cellIndex) {
    console.log(`_onMouseDown(event, ${cellIndex})`);
    const { selected } = this.state;

    if (event.button === 0) {
      if (selected === cellIndex) {
        this.setState({ selected: -1 });
      } else {
        this.setState({ selected: cellIndex });
      }
    } else if (event.button === 2) {
      this.setState({ selected: -1 });
    }
  }

  _renderCell(index) {
    const { cellData, selected } = this.state;
    const subjectData = cellData[index];
    const classNames = ['cellBtn'];

    if (!subjectData.valid) {
      classNames.push('invalid');
    }

    if (index === selected) {
      classNames.push('selected');
    }

    if (subjectData.locked) {
      classNames.push('locked');
    }

    return (
      <td key={`sudoku-board-cell-${index}`}>
        <button
          type="button"
          className={classNames.join(' ')}
          onMouseDown={(event) => this._onMouseDown(event, index)}
          onKeyDown={this._onKeyDown}
        >
          {subjectData.value > 0 ? subjectData.value : ''}
        </button>
      </td>
    );
  }

  _renderRow(row) {
    return (
      <tr key={`sudoku-board-row-${row}`}>
        { INDICES.ROW[row].map((index) => this._renderCell(index)) }
      </tr>
    );
  }

  render() {
    console.log('rendering');
    return (
      <div
        className="SudokuBoard"
        // onKeyDown={(event) => this.onKeyDown(event)}
      >
        <table>
          <colgroup span="3" />
          <colgroup span="3" />
          <colgroup span="3" />
          <tbody>
            {
              range(NUM_DIGITS).map((row) => this._renderRow(row))
            }
          </tbody>
        </table>
      </div>
    );
  }
}

const SAMPLE_SUDOKU = new Sudoku({
  solution: buildFromString('84..7.59.5.....38....5.3..2.2.....1.3.....9...7.9.52..9.5..4.....7.1....28...7...'),
  puzzle: buildFromString('84..7.59.5.....38....5.3..2.2.....1.3.....9...7.9.52..9.5..4.....7.1....28...7...'),
});

SudokuBoard.defaultProps = {
  /**
   * @type {Sudoku}
   */
  sudoku: SAMPLE_SUDOKU
};

SudokuBoard.propTypes = {
  sudoku: PropTypes.instanceOf(Sudoku),
};

export default SudokuBoard;
