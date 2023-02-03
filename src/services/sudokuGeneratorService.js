export default {
  /**
   * Generates a random, full Sudoku board.
   * TODO
   *
   * @returns {number[]}
   */
  generateConfig: () => [],

  /**
   * Attempts to generate a Sudoku puzzle.
   * This may take a long time if `numClues` is specified and low (<24).
   * TODO
   *
   * @param {number[]} options.solution Puzzle solution. Default: random.
   * @param {number} options.numClues Number of clues on the resulting puzzle. Default: 27.
   * @returns {Sudoku}
   */
  generate: ({ solution, numClues = 27 } = { numClues: 27 }) => {}
};
