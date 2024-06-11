class SudokuSolver {
  validate(puzzleString) {
    if (puzzleString.length !== 81) {
      return { valid: false, error: 'Expected puzzle to be 81 characters long' };
    }
    if (/[^1-9.]/g.test(puzzleString)) {
      return { valid: false, error: 'Invalid characters in puzzle' };
    }
    return { valid: true };
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const start = row * 9;
    for (let i = 0; i < 9; i++) {
      if (puzzleString[start + i] === value.toString() && column !== i) return false;
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
      for (let i = 0; i < 9; i++) {
        if (row !== i && puzzleString[column + i * 9] === value.toString()) {
          return false;
        }
      }
      return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(column / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (puzzleString[(startRow + i) * 9 + startCol + j] === value.toString()) return false;
      }
    }
    return true;
  }

  solve(puzzleString) {
    const validation = this.validate(puzzleString);
    if (!validation.valid) {
      return validation.error;
    }

    let board = puzzleString.split('');
    const isValid = (board, row, col, num) => {
      const value = num.toString();
      const isRowValid = this.checkRowPlacement(board.join(''), row, col, value);
      const isColValid = this.checkColPlacement(board.join(''), row, col, value);
      const isRegionValid = this.checkRegionPlacement(board.join(''), row, col, value);
      return isRowValid && isColValid && isRegionValid;
    };

    const findEmpty = (board) => {
      for (let i = 0; i < board.length; i++) {
        if (board[i] === '.') {
          return i;
        }
      }
      return -1;
    };

    const solveBoard = (board) => {
      const emptyIndex = findEmpty(board);
      if (emptyIndex === -1) return true;
      const row = Math.floor(emptyIndex / 9);
      const col = emptyIndex % 9;
      for (let num = 1; num <= 9; num++) {
        if (isValid(board, row, col, num)) {
          board[emptyIndex] = num.toString();
          if (solveBoard(board)) {
            return true;
          }
          board[emptyIndex] = '.';
        }
      }
      return false;
    };

    const solved = solveBoard(board);
    if (solved) {
      return board.join('');
    }
    return 'Puzzle cannot be solved';
  }
}

module.exports = SudokuSolver;
