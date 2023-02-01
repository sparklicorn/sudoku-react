import React from 'react';
import PropTypes from 'prop-types';

import {
  buildFromString,
  NUM_CELLS,
  ROW_INDICES
} from '../helpers/sudokuHelpers';

import Sudoku from '../models/Sudoku';
import Generator from '../services/sudokuGeneratorService';

import '../styles/components/SudokuBoard.scss';

class SudokuBoard extends React.Component {
  /**
   * 
   * @param {object} props
   * @param {Sudoku} props.sudoku
   */
  constructor(props) {
    super(props);

    const cellData = props.sudoku.puzzle.map((value) => ({
      value,
      activeHover: false
    }));

    this.state = { cellData };
  }

  renderCell(index) {
    const cellData = this.state.cellData[index];

    return (
      <td
        key={`sudoku-board-cell-${index}`}
        className={``}
        // onMouseDown={() => console.log(`MOUSE DOWN ${index}`)}
        // onMouseEnter={() => this.setState()}
        // onMouseLeave={() => console.log(`LEAVE ${index}`)}
        // onClick={() => console.log(`clicked ${index}`)}
      >
        { cellData.value > 0 ? cellData.value : '' }
      </td>
    );
  }

  renderRow(rowIndex) {
    return (
      <tr key={`sudoku-board-row-${rowIndex}`}>
        { ROW_INDICES[rowIndex].map((cellIndex) => this.renderCell(cellIndex)) }
      </tr>
    );
  }

  render() {
    return (
      <div className='SudokuBoard'>
        <table>
          <colgroup span='3' />
          <colgroup span='3' />
          <colgroup span='3' />
          <tbody>
            {
              [...Array(9).keys()].map((rowIndex) => this.renderRow(rowIndex))
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
