const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const puzzlesAndSolutions = require('../controllers/puzzle-strings.js');
chai.use(chaiHttp);

suite('Functional Tests', () => {
  test('Solve a puzzle with valid puzzle string: POST request to /api/solve', done => {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: puzzlesAndSolutions[0][0] })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.solution, puzzlesAndSolutions[0][1]);
        done();
      });
  });

  test('Solve a puzzle with missing puzzle string: POST request to /api/solve', done => {
    chai.request(server)
      .post('/api/solve')
      .send({})
      .end((err, res) => {
        assert.equal(res.status, 400); // Changed to 400
        assert.equal(res.body.error, 'Required field missing');
        done();
      });
  });

  test('Solve a puzzle with invalid characters: POST request to /api/solve', done => {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8..6.....4.....8.5...7.9..2.3...6.15....4...a' })  // Corrected to be exactly 81 characters
      .end((err, res) => {
        assert.equal(res.status, 400); // Changed to 400
        assert.equal(res.body.error, 'Invalid characters in puzzle');
        done();
      });
  });

  test('Solve a puzzle with incorrect length: POST request to /api/solve', done => {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8..6.....4.....8.5...7.9..2.3...6.15....4...' })  // 80 characters long
      .end((err, res) => {
        assert.equal(res.status, 400); // Changed to 400
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
        done();
      });
  });

  test('Solve a puzzle that cannot be solved: POST request to /api/solve', done => {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8..6.....4.....8.5...7.9..2.3...6.15....4...2' })  // Corrected to be exactly 81 characters but unsolvable
      .end((err, res) => {
        assert.equal(res.status, 400); // Changed to 400
        assert.equal(res.body.error, 'Puzzle cannot be solved');
        done();
      });
  });

  test('Check a puzzle placement with all fields: POST request to /api/check', done => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: puzzlesAndSolutions[0][0], coordinate: 'A2', value: 3 })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, true);
        done();
      });
  });

  test('Check a puzzle placement with single placement conflict: POST request to /api/check', done => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: puzzlesAndSolutions[0][0], coordinate: 'A2', value: 1 })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, false);
        assert.include(res.body.conflict, 'row');
        done();
      });
  });

  test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', done => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: puzzlesAndSolutions[0][0], coordinate: 'A2', value: 2 })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, false);
        assert.include(res.body.conflict, 'row');
        assert.include(res.body.conflict, 'region');
        done();
      });
  });

  test('Check a puzzle placement with all placement conflicts: POST request to /api/check', done => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: puzzlesAndSolutions[0][0], coordinate: 'A2', value: 5 })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, false);
        assert.include(res.body.conflict, 'row');
        assert.include(res.body.conflict, 'region');
        done();
      });
  });

  test('Check a puzzle placement with missing required fields: POST request to /api/check', done => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: puzzlesAndSolutions[0][0] })
      .end((err, res) => {
        assert.equal(res.status, 400); // Changed to 400
        assert.equal(res.body.error, 'Required field(s) missing');
        done();
      });
  });

  test('Check a puzzle placement with invalid characters: POST request to /api/check', done => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8..6.....4.....8.5...7.9..2.3...6.15....4...a', coordinate: 'A2', value: 3 })  // Corrected to be exactly 81 characters
      .end((err, res) => {
        assert.equal(res.status, 400); // Changed to 400
        assert.equal(res.body.error, 'Invalid characters in puzzle');
        done();
      });
  });

  test('Check a puzzle placement with incorrect length: POST request to /api/check', done => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8..6.....4.....8.5...7.9..2.3...6.15....4...', coordinate: 'A2', value: 3 })  // 80 characters long
      .end((err, res) => {
        assert.equal(res.status, 400); // Changed to 400
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
        done();
      });
  });

  test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', done => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: puzzlesAndSolutions[0][0], coordinate: 'Z2', value: 3 })
      .end((err, res) => {
        assert.equal(res.status, 400);
        assert.equal(res.body.error, 'Invalid coordinate');
        done();
      });
  });

  test('Check a puzzle placement with invalid placement value: POST request to /api/check', done => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: puzzlesAndSolutions[0][0], coordinate: 'A2', value: 10 })
      .end((err, res) => {
        assert.equal(res.status, 400); // Changed to 400
        assert.equal(res.body.error, 'Invalid value');
        done();
      });
  });
});
