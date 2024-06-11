const express = require('express');
const router = express.Router();
const SudokuSolver = require('../controllers/sudoku-solver.js');
const solver = new SudokuSolver();

router.post('/solve', (req, res) => {
  const { puzzle } = req.body;
  if (!puzzle) {
    return res.status(400).json({ error: 'Required field missing' });
  }
  const solution = solver.solve(puzzle);
  if (solution === 'Puzzle cannot be solved' || solution === 'Invalid characters in puzzle' || solution === 'Expected puzzle to be 81 characters long') {
    return res.status(400).json({ error: solution });
  }
  res.json({ solution });
});

router.post('/check', (req, res) => {
  const { puzzle, coordinate, value } = req.body;
  if (!puzzle || !coordinate || !value) {
    return res.status(400).json({ error: 'Required field missing' });
  }

  const validation = solver.validate(puzzle);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  const row = coordinate[0].toUpperCase().charCodeAt(0) - 65;
  const column = parseInt(coordinate[1]) - 1;

  if (row < 0 || row > 8 || column < 0 || column > 8) {
    return res.status(400).json({ error: 'Invalid coordinate' });
  }

  if (isNaN(value) || value < 1 || value > 9) {
    return res.status(400).json({ error: 'Invalid value' });
  }

  const rowValid = solver.checkRowPlacement(puzzle, row, column, value);
  const colValid = solver.checkColPlacement(puzzle, row, column, value);
  const regionValid = solver.checkRegionPlacement(puzzle, row, column, value);

  if (rowValid && colValid && regionValid) {
    return res.json({ valid: true });
  }

  const conflict = [];
  if (!rowValid) conflict.push('row');
  if (!colValid) conflict.push('column');
  if (!regionValid) conflict.push('region');

  res.json({ valid: false, conflict });
});

module.exports = router;
