const chai = require('chai');
const assert = chai.assert;
const SudokuSolver = require('../controllers/sudoku-solver.js');
const puzzlesAndSolutions = require('../controllers/puzzle-strings.js');
const solver = new SudokuSolver();

suite('Unit Tests', () => {
  test('Logic handles a valid puzzle string of 81 characters', () => {
    const validPuzzle = puzzlesAndSolutions[0][0];
    const result = solver.validate(validPuzzle);
    assert.isTrue(result.valid);
  });

  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
    const invalidPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8..6.....4.....8.5...7.9..2.3...6.15....4...a'; // Corrected to be exactly 81 characters
    const result = solver.validate(invalidPuzzle);
    assert.isFalse(result.valid);
    assert.equal(result.error, 'Invalid characters in puzzle');
  });

  test('Logic handles a puzzle string that is not 81 characters in length', () => {
    const shortPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8..6.....4.....8.5...7.9..2.3...6.15....4......'; // 80 characters long
    const result = solver.validate(shortPuzzle);
    assert.isFalse(result.valid);
    assert.equal(result.error, 'Expected puzzle to be 81 characters long');
  });

  test('Logic handles a valid row placement', () => {
    const validPuzzle = puzzlesAndSolutions[0][0];
    const result = solver.checkRowPlacement(validPuzzle, 0, 1, 3);
    assert.isTrue(result);
  });

  test('Logic handles an invalid row placement', () => {
    const validPuzzle = puzzlesAndSolutions[0][0];
    const result = solver.checkRowPlacement(validPuzzle, 0, 1, 1);
    assert.isFalse(result);
  });

  test('Logic handles a valid column placement', () => {
    const validPuzzle = puzzlesAndSolutions[0][0];
      // Assuming '3' can be validly placed in column '1' for the given puzzle
      const valueToPlace = '3'; // Adjust this value based on the puzzle's state
      const columnToCheck = 1; // Column index is 0-based
      // Assuming we're placing '3' in row '0' for simplicity, adjust as needed
      const rowToPlace = 0;
      const result = solver.checkColPlacement(validPuzzle, rowToPlace, columnToCheck, valueToPlace);
      assert.isTrue(result);
  });

  test('Logic handles an invalid column placement', () => {
    const validPuzzle = puzzlesAndSolutions[0][0];
    const result = solver.checkColPlacement(validPuzzle, 0, 1, 2);
    assert.isFalse(result);
  });

  test('Logic handles a valid region (3x3 grid) placement', () => {
    const validPuzzle = puzzlesAndSolutions[0][0];
    const result = solver.checkRegionPlacement(validPuzzle, 0, 1, 7);
    assert.isTrue(result);
  });

  test('Logic handles an invalid region (3x3 grid) placement', () => {
    const validPuzzle = puzzlesAndSolutions[0][0];
    const result = solver.checkRegionPlacement(validPuzzle, 0, 1, 2);
    assert.isFalse(result);
  });

  test('Valid puzzle strings pass the solver', () => {
    const validPuzzle = puzzlesAndSolutions[0][0];
    const solution = solver.solve(validPuzzle);
    assert.equal(solution, puzzlesAndSolutions[0][1]);
  });

  test('Invalid puzzle strings fail the solver', () => {
    const invalidPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8..6.....4.....8.5...7.9..2.3...6.15....4...a'; // Corrected to be exactly 81 characters
    const result = solver.solve(invalidPuzzle);
    assert.equal(result, 'Invalid characters in puzzle');
  });

  test('Solver returns the expected solution for an incomplete puzzle', () => {
    const incompletePuzzle = puzzlesAndSolutions[0][0];
    const solution = solver.solve(incompletePuzzle);
    assert.equal(solution, puzzlesAndSolutions[0][1]);
  });
});
