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
    AOSHU_ELEMENTARY_DEEP_UNITS: { 'roadmap:g3-11': { title: 'existing-sentinel' } }
  }
};
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root, 'textbook-data.js'), 'utf8'), context);
const base = {};
for (const n of [17, 18]) {
  const route = context.window.AOSHU_TEXTBOOK_LESSONS.find((item) => item.n === n);
  base[n] = JSON.parse(JSON.stringify({
    n: route.n,
    title: route.title,
    href: route.href,
    link: route.link,
    example: route.example,
    steps: route.steps,
    practice: route.practice,
    answers: route.answers,
    hint: route.hint,
    explanation: route.explanation
  }));
}
vm.runInContext(fs.readFileSync(path.join(root, 'elementary-g3-strategy-units.js'), 'utf8'), context);
vm.runInContext(fs.readFileSync(path.join(root, 'elementary-roadmap-data.js'), 'utf8'), context);
const units = JSON.parse(JSON.stringify(context.window.AOSHU_ELEMENTARY_DEEP_UNITS));
const routes = JSON.parse(JSON.stringify(context.window.AOSHU_TEXTBOOK_LESSONS));

function possibleHigherCounts(problem) {
  return Array.from({ length: problem.items + 1 }, (_, count) => count)
    .filter((count) => (problem.items - count) * problem.low + count * problem.high === problem.total);
}

function apply(value, operation) {
  if (operation.type === 'add') return value + operation.value;
  if (operation.type === 'subtract') return value - operation.value;
  if (operation.type === 'multiply') return value * operation.value;
  if (operation.type === 'divide') return value / operation.value;
  assert.fail(`unknown operation: ${operation.type}`);
}

function runForward(start, operations) {
  return operations.reduce((value, operation) => apply(value, operation), start);
}

function undo(result, operations) {
  let value = result;
  for (const operation of operations.slice().reverse()) {
    if (operation.type === 'add') value -= operation.value;
    else if (operation.type === 'subtract') value += operation.value;
    else if (operation.type === 'multiply') value /= operation.value;
    else if (operation.type === 'divide') value *= operation.value;
    else assert.fail(`unknown operation: ${operation.type}`);
  }
  return value;
}

function same(actual, expected) {
  assert.deepEqual(Array.from(actual), expected);
}

test('G3-17/18 保留原路线 ID、标题、示范、首题、来源和专题链接', () => {
  for (const [n, key] of [[17, 'g3-17'], [18, 'g3-18']]) {
    const route = routes.find((item) => item.key === key);
    const original = base[n];
    assert.equal(route.key, key);
    assert.equal(route.n, original.n);
    assert.equal(route.title, original.title);
    assert.equal(route.href, original.href);
    assert.equal(route.link, original.link);
    assert.equal(route.example, original.example);
    same(route.steps, original.steps);
    assert.ok(route.source.includes('逐讲映射/页码待核'));
    assert.ok(route.source.includes('本项目原创'));
    const first = route.deepUnit.practices[0];
    assert.equal(first.question, original.practice);
    same(first.answers, original.answers);
    assert.equal(first.hint, original.hint);
    assert.equal(first.explanation, original.explanation);
    assert.equal(route.deepUnit.practices.length, 3);
  }
  assert.ok(units['roadmap:g3-11'], 'previously registered deep unit must survive this merge');
});

test('G3-17 所有原题与递进练习的可替换数量由枚举独立验证', () => {
  const unit = units['roadmap:g3-17'];
  assert.deepEqual(possibleHigherCounts(unit.verification.example), [6]);
  for (const practice of unit.practices) {
    const solutions = possibleHigherCounts(practice.verification);
    assert.deepEqual(solutions, practice.verification.solutions, practice.level);
    if (solutions.length === 1) {
      const numericAnswers = practice.answers.map((answer) => String(answer).match(/\d+/u)?.[0]).filter(Boolean);
      assert.ok(numericAnswers.length > 0, `${practice.level}: numeric answer present`);
      assert.ok(numericAnswers.every((answer) => Number(answer) === solutions[0]), `${practice.level}: accepted number matches unique solution`);
    } else {
      assert.equal(solutions.length, 0, `${practice.level}: the integer count is impossible`);
      assert.ok(practice.answers.includes('不能'));
    }
  }
  assert.deepEqual(possibleHigherCounts(unit.practices[0].verification), [4]);
  assert.deepEqual(possibleHigherCounts(unit.practices[1].verification), [6]);
  assert.deepEqual(possibleHigherCounts(unit.practices[2].verification), []);
});

test('G3-18 每题正向演算与逆向还原互相吻合', () => {
  const unit = units['roadmap:g3-18'];
  const problems = [unit.verification.example, ...unit.practices.map((practice) => practice.verification)];
  for (const problem of problems) {
    assert.equal(runForward(problem.start, problem.operations), problem.result);
    assert.equal(undo(problem.result, problem.operations), problem.answer);
    assert.equal(problem.answer, problem.start);
  }
  assert.equal(undo(19, [{ type: 'multiply', value: 2 }, { type: 'add', value: 3 }]), 8);
  assert.ok(unit.concepts.some((concept) => concept.text.includes('不能从19先除以2再减3')));
});

test('G3-17/18 三道练习均带针对性提示、错答反馈、正答反馈和完整解法', () => {
  for (const key of ['roadmap:g3-17', 'roadmap:g3-18']) {
    const unit = units[key];
    assert.equal(unit.practices.length, 3);
    for (const practice of unit.practices) {
      assert.ok(practice.hint, `${key} ${practice.level}: hint`);
      assert.ok(practice.wrongFeedback, `${key} ${practice.level}: wrong feedback`);
      assert.ok(practice.correctFeedback, `${key} ${practice.level}: correct feedback`);
      assert.ok(practice.explanation, `${key} ${practice.level}: worked solution`);
    }
    assert.equal(unit.review.length, 3);
  }
});

test('两种教学图示数据完整，渲染器和窄屏样式已接线', () => {
  const guess = units['roadmap:g3-17'].diagram;
  const reverse = units['roadmap:g3-18'].diagram;
  assert.equal(guess.type, 'guess-check-steps');
  assert.equal(guess.steps.length, 4);
  assert.equal(reverse.type, 'reverse-operation-flow');
  assert.equal(reverse.forward.length, 5);
  assert.equal(reverse.backward.length, 5);
  const renderer = fs.readFileSync(path.join(root, 'textbook.js'), 'utf8');
  const styles = fs.readFileSync(path.join(root, 'textbook-roadmap.css'), 'utf8');
  const html = fs.readFileSync(path.join(root, 'textbook.html'), 'utf8');
  assert.match(renderer, /guess-check-steps/u);
  assert.match(renderer, /reverse-operation-flow/u);
  assert.match(styles, /book-guess-check-steps/u);
  assert.match(styles, /book-reverse-flow/u);
  assert.ok(html.indexOf('elementary-g3-strategy-units.js') > html.indexOf('elementary-g3-logic-units.js'));
  assert.ok(html.indexOf('elementary-g3-strategy-units.js') < html.indexOf('elementary-roadmap-data.js'));
});
