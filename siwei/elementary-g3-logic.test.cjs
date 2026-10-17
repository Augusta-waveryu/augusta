const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = __dirname;
const context = {
  window: {
    AOSHU_CURRICULUM: [],
    AOSHU_DEEP_LESSONS: {},
    AOSHU_ELEMENTARY_DEEP_UNITS: { 'roadmap:g3-2': { title: 'sentinel' } }
  }
};
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root, 'textbook-data.js'), 'utf8'), context);
const sourceRoute = context.window.AOSHU_TEXTBOOK_LESSONS.find((item) => item.n === 11);
const original = JSON.parse(JSON.stringify({
  n: sourceRoute.n,
  title: sourceRoute.title,
  href: sourceRoute.href,
  link: sourceRoute.link,
  example: sourceRoute.example,
  steps: sourceRoute.steps,
  practice: sourceRoute.practice,
  answers: sourceRoute.answers,
  hint: sourceRoute.hint,
  explanation: sourceRoute.explanation
}));
vm.runInContext(fs.readFileSync(path.join(root, 'elementary-g3-logic-units.js'), 'utf8'), context);
vm.runInContext(fs.readFileSync(path.join(root, 'elementary-roadmap-data.js'), 'utf8'), context);
const units = JSON.parse(JSON.stringify(context.window.AOSHU_ELEMENTARY_DEEP_UNITS));
const routes = JSON.parse(JSON.stringify(context.window.AOSHU_TEXTBOOK_LESSONS));
const unit = units['roadmap:g3-11'];
const route = routes.find((item) => item.key === 'g3-11');

function permutations(values) {
  if (values.length <= 1) return [values.slice()];
  return values.flatMap((value, index) => permutations(values.filter((_, i) => i !== index)).map((tail) => [value, ...tail]));
}

function satisfies(assignment, constraints, people) {
  const floorOf = (person) => assignment[people.indexOf(person)];
  return constraints.every((clue) => {
    if (clue.type === 'at') return floorOf(clue.person) === clue.floor;
    if (clue.type === 'not') return floorOf(clue.person) !== clue.floor;
    if (clue.type === 'not-in') return !clue.floors.includes(floorOf(clue.person));
    if (clue.type === 'above') return floorOf(clue.person) > floorOf(clue.other);
    if (clue.type === 'below') return floorOf(clue.person) < floorOf(clue.other);
    assert.fail(`unknown clue type: ${clue.type}`);
  });
}

function solutionsFor(problem) {
  return permutations(unit.verification.floors)
    .filter((assignment) => satisfies(assignment, problem.constraints, unit.verification.people));
}

function sameAnswers(actual, expected) {
  assert.deepEqual(Array.from(actual), expected);
}

test('G3-11 保留原路线、来源、专题链接与首道原自测', () => {
  assert.equal(route.key, 'g3-11');
  assert.equal(route.n, original.n);
  assert.equal(route.title, original.title);
  assert.equal(route.href, original.href);
  assert.equal(route.link, original.link);
  assert.equal(route.example, original.example);
  sameAnswers(route.steps, original.steps);
  assert.ok(route.source.includes('逐讲映射/页码待核'));
  assert.ok(route.source.includes('本项目原创'));
  assert.equal(unit.practices.length, 3);
  const first = unit.practices[0];
  assert.equal(first.question, original.practice);
  sameAnswers(first.answers, original.answers);
  assert.equal(first.hint, original.hint);
  assert.ok(first.explanation.startsWith(original.explanation));
  assert.ok(units['roadmap:g3-2'], 'existing deep unit must survive the merge');
});

test('G3-11 例题与唯一答案练习由穷举各自唯一确定', () => {
  assert.deepEqual(solutionsFor(unit.verification.example), [[2, 3, 1]]);
  for (const practice of unit.practices.slice(0, 2)) {
    const solutions = solutionsFor(practice.verification);
    assert.deepEqual(solutions, practice.verification.solutions, practice.level);
    assert.equal(solutions.length, 1, `${practice.level}: exactly one arrangement`);
    const targetFloor = solutions[0][unit.verification.people.indexOf(practice.verification.target)];
    const numericAnswers = practice.answers
      .map((answer) => String(answer).match(/\d+/u)?.[0])
      .filter(Boolean);
    assert.ok(numericAnswers.length > 0, `${practice.level}: accepted answer contains the floor`);
    assert.ok(numericAnswers.every((answer) => Number(answer) === targetFloor), `${practice.level}: answer formats agree`);
  }
});

test('G3-11 的线索不足练习恰有两套解，反馈要求回答不能确定', () => {
  const practice = unit.practices[2];
  const solutions = solutionsFor(practice.verification);
  assert.deepEqual(solutions, [[2, 1, 3], [3, 2, 1]]);
  assert.deepEqual(solutions, practice.verification.solutions);
  assert.equal(solutions.length, 2);
  assert.deepEqual(Array.from(practice.answers), ['不能确定', '无法唯一确定']);
  assert.equal(practice.verification.response, '不能确定');
  assert.ok(practice.explanation.includes('甲2楼、乙1楼、丙3楼'));
  assert.ok(practice.explanation.includes('甲3楼、乙2楼、丙1楼'));
});

test('三道练习都有具体提示、错答反馈、正答反馈和完整解法', () => {
  for (const practice of unit.practices) {
    assert.ok(practice.hint, `${practice.level}: hint`);
    assert.ok(practice.wrongFeedback, `${practice.level}: wrong feedback`);
    assert.ok(practice.correctFeedback, `${practice.level}: correct feedback`);
    assert.ok(practice.explanation, `${practice.level}: worked explanation`);
  }
  assert.equal(unit.review.length, 3);
});

test('逻辑候选表具备3×3数据、可访问标签与窄屏样式', () => {
  const diagram = unit.diagram;
  assert.equal(diagram.type, 'logic-elimination-grid');
  assert.equal(diagram.people.length, 3);
  assert.equal(diagram.positions.length, 3);
  assert.equal(diagram.states.length, 3);
  for (const row of diagram.states) {
    assert.equal(row.length, 3);
    assert.equal(row.filter((cell) => cell === 'confirmed').length, 1);
  }
  for (let column = 0; column < 3; column += 1) {
    assert.equal(diagram.states.filter((row) => row[column] === 'confirmed').length, 1);
  }
  const renderer = fs.readFileSync(path.join(root, 'textbook.js'), 'utf8');
  const styles = fs.readFileSync(path.join(root, 'textbook-roadmap.css'), 'utf8');
  assert.match(renderer, /logic-elimination-grid/u);
  assert.match(renderer, /scope="row"/u);
  assert.match(styles, /book-logic-elimination/u);
  assert.match(styles, /@media\s*\(max-width:\s*650px\)/u);
});
