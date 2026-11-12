const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const dir = __dirname;
const target = 'elementary-g5-construction-units.js';
const html = fs.readFileSync(path.join(dir, 'textbook.html'), 'utf8');
const scripts = [...html.matchAll(/<script src="\/siwei\/([^"]+)"/g)].map(m => m[1]);
const plain = value => JSON.parse(JSON.stringify(value));

function load(includeUnit) {
  const context = { window: {}, document: { getElementById: () => null } };
  vm.createContext(context);
  for (const file of scripts) {
    if (['textbook.js', 'textbook-overview.js'].includes(file)) continue;
    if (!includeUnit && file === target) continue;
    vm.runInContext(fs.readFileSync(path.join(dir, file), 'utf8'), context, { filename: file });
  }
  return context.window;
}

function enumeratePairs(total, leftValue = 3, rightValue = 5) {
  const pairs = [];
  for (let left = 0; left <= total; left++) {
    for (let right = 0; right <= total; right++) {
      if (leftValue * left + rightValue * right === total) pairs.push([left, right]);
    }
  }
  return pairs;
}

function hasNonnegativeSolution(total, leftValue, rightValue) {
  return enumeratePairs(total, leftValue, rightValue).length > 0;
}

const before = load(false);
const after = load(true);
const oldLesson = before.AOSHU_TEXTBOOK_LESSONS.find(lesson => lesson.key === 'g5-18');
const lesson = after.AOSHU_TEXTBOOK_LESSONS.find(item => item.key === 'g5-18');
const unit = after.AOSHU_ELEMENTARY_DEEP_UNITS['5:construction'];

test('only g5-18 gains construction depth and route identity/original semantics remain', () => {
  assert.ok(oldLesson, 'old g5-18 route must exist');
  assert.ok(lesson, 'new g5-18 route must exist');
  assert.ok(unit, 'the construction deep unit must use key 5:construction');
  assert.equal(oldLesson.deepUnit, null);
  assert.equal(lesson.deepUnit, unit);
  for (const field of ['key', 'title', 'source', 'href']) assert.equal(lesson[field], oldLesson[field], field);
  assert.equal(unit.example.question, oldLesson.example);
  assert.equal(unit.practices[0].question, oldLesson.practice);
  assert.deepEqual(plain(unit.practices[0].answers), plain(oldLesson.answers));
  for (const oldItem of before.AOSHU_TEXTBOOK_LESSONS) {
    if (oldItem.key === 'g5-18') continue;
    const next = after.AOSHU_TEXTBOOK_LESSONS.find(item => item.key === oldItem.key);
    assert.deepEqual(plain(next), plain(oldItem), oldItem.key);
  }
});

test('independent double-loop enumeration verifies all eight bounded answers', () => {
  assert.equal(hasNonnegativeSolution(7, 4, 6), false);
  const expected = [
    ['0'], // 4a+6b=7: impossible by parity.
    [String(enumeratePairs(8).length)],
    [String(Math.max(...enumeratePairs(8).map(([, b]) => b)))],
    [String(enumeratePairs(15).length)],
    [String(enumeratePairs(1).length)],
    [String(enumeratePairs(6).find(([a]) => a > 0)?.[0] ?? 0)],
    ['0'], // Reordering the same stamp counts is not a new solution.
    [String(enumeratePairs(0).length)],
  ];
  assert.deepEqual(plain(unit.practices.map(practice => practice.answers)), expected);
  assert.deepEqual(enumeratePairs(8), [[1, 1]]);
  assert.deepEqual(enumeratePairs(15), [[0, 3], [5, 0]]);
  assert.deepEqual(enumeratePairs(0), [[0, 0]]);
});

test('construction lesson states nonnegative bounds, completeness, no duplicate orderings, and guided feedback', () => {
  assert.equal(unit.practices.length, 8);
  assert.match(unit.scope, /本站原创/);
  assert.match(unit.scope, /待核/);
  assert.match(unit.goal, /完整|列全|穷尽|没有遗漏/);
  assert.match(unit.idea, /非负|边界|列/);
  const text = JSON.stringify(unit);
  assert.match(text, /0.*张|0.*允许|非负/);
  assert.match(text, /最多|上限|超过|边界/);
  assert.match(text, /不重|重复|次序/);
  assert.match(text, /完整|列全|穷尽|没有遗漏/);
  for (const practice of unit.practices) {
    for (const field of ['level', 'question', 'answers', 'hint', 'wrongFeedback', 'correctFeedback', 'explanation']) {
      assert.ok(practice[field], field);
    }
    assert.ok(practice.wrongFeedback.length > 5);
    assert.ok(practice.correctFeedback.length > 5);
    assert.ok(practice.explanation.length > 10);
  }
});

test('textbook loads the construction script before roadmap assembly', () => {
  const targetIndex = scripts.indexOf(target);
  const roadmapIndex = scripts.indexOf('elementary-roadmap-data.js');
  assert.ok(targetIndex >= 0, `${target} must be loaded by textbook.html`);
  assert.ok(roadmapIndex >= 0 && targetIndex < roadmapIndex, 'construction data must load before roadmap data');
});
