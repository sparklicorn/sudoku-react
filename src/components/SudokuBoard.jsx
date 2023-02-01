import React from 'react';
import PropTypes from 'prop-types';

import { confine } from '../helpers/math';

import {
  buildFromString,
  ROW_INDICES
} from '../helpers/sudokuHelpers';

import Sudoku from '../models/Sudoku';

import '../styles/components/SudokuBoard.scss';

const INVALID_LEVEL_MAP = [0,1,1,2,1,2,2,3,1,2,2,3,2,3,3,4];
const NUMBER_KEYS = ['1','2','3','4','5','6','7','8','9'];

class SudokuBoard extends React.Component {
  /**
   *
   * @param {object} props
   * @param {Sudoku} props.sudoku
   */
  constructor(props) {
    super(props);

    this.state = {
      cellData: props.sudoku.cellData,
      selected: -1
    };
  }

  _renderCell(cellIndex) {
    const cellData = this.state.cellData.get(cellIndex);
    const classNames = [];

    if (cellData.invalidLevel > 0) {
      classNames.push(`invalid-${INVALID_LEVEL_MAP[cellData.invalidLevel]}`);
    }

    if (cellIndex === this.state.selected) {
      classNames.push('selected');
    }

    return (
      <td
        key={`sudoku-board-cell-${cellIndex}`}
        className={classNames.join(' ')}
        onMouseDown={(event) => {
          event.target.focus();
          this.setState({ selected: cellIndex })
        }}
        onKeyDown={(event) => {
          console.log(event.key);

          if (NUMBER_KEYS.includes(event.key)) {
            const value = confine(parseInt(event.key), 1, 9);
            this.props.sudoku.setValue(cellIndex, value);
          }

          if (event.key === "Backspace") {

          }
        }}
      >
        { cellData.value > 0 ? cellData.value : '' }
      </td>
    );
  }

  _renderRow(rowIndex) {
    return (
      <tr key={`sudoku-board-row-${rowIndex}`}>
        { ROW_INDICES[rowIndex].map((cellIndex) => this._renderCell(cellIndex)) }
      </tr>
    );
  }

  render() {
    console.log('rendering');
    return (
      <div className='SudokuBoard'>
        <table>
          <colgroup span='3' />
          <colgroup span='3' />
          <colgroup span='3' />
          <tbody>
            {
              [...Array(9).keys()].map((rowIndex) => this._renderRow(rowIndex))
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
})

SudokuBoard.defaultProps = {
  sudoku: SAMPLE_SUDOKU
};

SudokuBoard.propTypes = {
  sudoku: PropTypes.instanceOf(Sudoku),
};

export default SudokuBoard;
