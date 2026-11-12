const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = __dirname;
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'elementary-g3-puzzles.js'), 'utf8'), context);
const units = JSON.parse(JSON.stringify(context.window.AOSHU_ELEMENTARY_DEEP_UNITS));
const expectedSudokuSolution = [
  [1, 2, 3, 4],
  [3, 4, 1, 2],
  [2, 1, 4, 3],
  [4, 3, 2, 1]
];

function copy(grid) {
  return grid.map((row) => row.slice());
}

function validSudokuPartial(grid) {
  if (!Array.isArray(grid) || grid.length !== 4 || grid.some((row) => !Array.isArray(row) || row.length !== 4)) return false;
  if (grid.flat().some((value) => !Number.isInteger(value) || value < 0 || value > 4)) return false;
  const unitsToCheck = [];
  for (let r = 0; r < 4; r += 1) unitsToCheck.push(grid[r]);
  for (let c = 0; c < 4; c += 1) unitsToCheck.push(grid.map((row) => row[c]));
  for (const r0 of [0, 2]) for (const c0 of [0, 2]) {
    unitsToCheck.push([grid[r0][c0], grid[r0][c0 + 1], grid[r0 + 1][c0], grid[r0 + 1][c0 + 1]]);
  }
  return unitsToCheck.every((line) => {
    const filled = line.filter((value) => value !== 0);
    return new Set(filled).size === filled.length;
  });
}

function sudokuCandidates(grid, row, column) {
  const used = new Set([
    ...grid[row],
    ...grid.map((line) => line[column]),
    grid[Math.floor(row / 2) * 2][Math.floor(column / 2) * 2],
    grid[Math.floor(row / 2) * 2][Math.floor(column / 2) * 2 + 1],
    grid[Math.floor(row / 2) * 2 + 1][Math.floor(column / 2) * 2],
    grid[Math.floor(row / 2) * 2 + 1][Math.floor(column / 2) * 2 + 1]
  ]);
  return [1, 2, 3, 4].filter((digit) => !used.has(digit));
}

function sudokuSolutions(input, limit = 2) {
  const grid = copy(input);
  if (!validSudokuPartial(grid)) return [];
  const found = [];
  function visit() {
    if (found.length >= limit) return;
    let bestCell = null;
    let bestCandidates = null;
    for (let row = 0; row < 4; row += 1) for (let column = 0; column < 4; column += 1) {
      if (grid[row][column] !== 0) continue;
      const candidates = sudokuCandidates(grid, row, column);
      if (!candidates.length) return;
      if (!bestCandidates || candidates.length < bestCandidates.length) {
        bestCell = [row, column];
        bestCandidates = candidates;
      }
    }
    if (!bestCell) {
      found.push(copy(grid));
      return;
    }
    const [row, column] = bestCell;
    for (const digit of bestCandidates) {
      grid[row][column] = digit;
      visit();
      grid[row][column] = 0;
      if (found.length >= limit) return;
    }
  }
  visit();
  return found;
}

function magicLines(grid) {
  return [
    ...grid,
    ...[0, 1, 2].map((column) => grid.map((row) => row[column])),
    [grid[0][0], grid[1][1], grid[2][2]],
    [grid[0][2], grid[1][1], grid[2][0]]
  ];
}

function magicSolutions(input, limit = 2) {
  const grid = copy(input);
  if (grid.length !== 3 || grid.some((row) => row.length !== 3)) return [];
  const flat = grid.flat();
  if (flat.some((value) => !Number.isInteger(value) || value < 0 || value > 9)) return [];
  const givens = flat.filter((value) => value !== 0);
  if (new Set(givens).size !== givens.length) return [];
  const found = [];
  function partialIsPossible() {
    for (const line of magicLines(grid)) {
      const known = line.filter((value) => value !== 0);
      if (known.reduce((sum, value) => sum + value, 0) > 15) return false;
      if (known.length === 3 && known.reduce((sum, value) => sum + value, 0) !== 15) return false;
    }
    return true;
  }
  function visit() {
    if (found.length >= limit) return;
    let row = -1;
    let column = -1;
    for (let r = 0; r < 3 && row === -1; r += 1) for (let c = 0; c < 3; c += 1) {
      if (grid[r][c] === 0) { row = r; column = c; break; }
    }
    if (row === -1) {
      found.push(copy(grid));
      return;
    }
    const used = new Set(grid.flat());
    for (let digit = 1; digit <= 9; digit += 1) {
      if (used.has(digit)) continue;
      grid[row][column] = digit;
      if (partialIsPossible()) visit();
      grid[row][column] = 0;
      if (found.length >= limit) return;
    }
  }
  if (partialIsPossible()) visit();
  return found;
}

function verifyFullSudoku(grid) {
  assert.equal(validSudokuPartial(grid), true);
  assert.equal(sudokuSolutions(grid).length, 1);
  const expected = [1, 2, 3, 4];
  for (const line of [...grid, ...[0, 1, 2, 3].map((column) => grid.map((row) => row[column]))]) {
    assert.deepEqual([...line].sort(), expected);
  }
  for (const r0 of [0, 2]) for (const c0 of [0, 2]) {
    assert.deepEqual([
      grid[r0][c0], grid[r0][c0 + 1], grid[r0 + 1][c0], grid[r0 + 1][c0 + 1]
    ].sort(), expected);
  }
}

test('新增专题沿用三年级原讲次键，且各自包含三道带反馈的递进练习', () => {
  assert.deepEqual(Object.keys(units).sort(), ['roadmap:g3-27', 'roadmap:g3-28', 'roadmap:g3-7', 'roadmap:g3-8']);
  for (const key of Object.keys(units)) {
    assert.equal(units[key].practices.length, 3, key);
    for (const practice of units[key].practices) {
      assert.ok(practice.hint && practice.wrongFeedback && practice.correctFeedback && practice.explanation, `${key}: every practice has guided feedback`);
    }
    assert.ok(units[key].review.length >= 3, `${key}: return-check questions`);
  }
});

test('G3-7 底行线索唯一确定标准三阶幻方；中心和对格关系成立', () => {
  const unit = units['roadmap:g3-7'];
  const solutions = magicSolutions(unit.example.puzzle);
  assert.equal(solutions.length, 1, 'bottom-row clues must not admit a second square');
  assert.deepEqual(solutions[0], unit.example.solution);
  const solution = unit.example.solution;
  assert.deepEqual([...solution.flat()].sort((a, b) => a - b), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  assert.equal(solution[1][1], 5);
  for (const line of magicLines(solution)) assert.equal(line.reduce((sum, value) => sum + value, 0), 15);
  assert.equal(45 - 5, 4 * (15 - 5));
  assert.equal(4 + 6, 10);
  assert.equal(1 + 9, 10);
  assert.equal(2 + 8, 10);
  const lastPractice = unit.practices[2];
  assert.equal(magicSolutions(lastPractice.puzzle).length, 1);
  assert.equal(lastPractice.puzzle[lastPractice.target[0]][lastPractice.target[1]], 0);
  assert.equal(lastPractice.answers.includes(String(solution[lastPractice.target[0]][lastPractice.target[1]])), true);
});

test('G3-8 数阵答案由横向与纵向步长独立推出且相互吻合', () => {
  const unit = units['roadmap:g3-8'];
  const solvedExample = unit.example.solution;
  assert.deepEqual(solvedExample, [[1, 4, 7], [3, 6, 9], [5, 8, 11]]);
  assert.deepEqual(unit.diagrams[0].cells, unit.example.puzzle);
  for (const row of solvedExample) {
    assert.deepEqual([row[1] - row[0], row[2] - row[1]], [3, 3]);
  }
  for (let column = 0; column < 3; column += 1) {
    assert.deepEqual([solvedExample[1][column] - solvedExample[0][column], solvedExample[2][column] - solvedExample[1][column]], [2, 2]);
  }
  for (const practice of unit.practices) {
    const [row, column] = practice.target;
    const grid = practice.puzzle;
    const horizontalStep = grid[0][1] - grid[0][0];
    const verticalStep = grid[1][0] - grid[0][0];
    const fromRow = grid[row][column - 1] + horizontalStep;
    const fromColumn = grid[row - 1][column] + verticalStep;
    assert.equal(fromRow, fromColumn, `${practice.level}: two routes must agree`);
    assert.equal(Number(practice.answers[0]), fromRow, `${practice.level}: answer must match both routes`);
    if (practice.level.includes('找出写错')) assert.notEqual(grid[row][column], fromRow);
    else assert.equal(grid[row][column], 0, `${practice.level}: target begins blank`);
  }
});

test('G3-27 和 G3-28 的每盘数独都无矛盾且只有一个解', () => {
  for (const key of ['roadmap:g3-27', 'roadmap:g3-28']) {
    const unit = units[key];
    const exampleSolutions = sudokuSolutions(unit.example.puzzle);
    assert.equal(exampleSolutions.length, 1, `${key}: worked-example puzzle must have exactly one solution`);
    assert.deepEqual(exampleSolutions[0], unit.example.solution, `${key}: worked solution must match the unique solution`);
    verifyFullSudoku(unit.example.solution);
    for (const practice of unit.practices) {
      if (!practice.puzzle) continue;
      assert.deepEqual(practice.diagram.cells, practice.puzzle, `${key}: displayed puzzle matches tested puzzle`);
      const solutions = sudokuSolutions(practice.puzzle);
      assert.equal(solutions.length, 1, `${key}: ${practice.level} must have exactly one solution`);
      const [row, column] = practice.target;
      assert.equal(practice.puzzle[row][column], 0, `${key}: target must be blank`);
      assert.equal(Number(practice.answers[0]), solutions[0][row][column], `${key}: answer matches the unique solution`);
    }
  }
});

test('G3-28 完整例题的解盘在每一行、列和2×2宫中都无重复', () => {
  const unit = units['roadmap:g3-28'];
  assert.deepEqual(unit.example.solution, expectedSudokuSolution);
  verifyFullSudoku(unit.example.solution);
  assert.deepEqual(unit.diagrams[0].cells, unit.example.puzzle);
  assert.deepEqual(unit.diagrams[1].cells, unit.example.solution);
});
