const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = __dirname;
const context = { window: { AOSHU_CURRICULUM: [], AOSHU_DEEP_LESSONS: {} } };
vm.createContext(context);
for (const file of [
  'textbook-data.js',
  'elementary-g3-multiple-units.js',
  'elementary-roadmap-data.js'
]) {
  vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, { filename: file });
}
const routes = context.window.AOSHU_TEXTBOOK_LESSONS;
const units = context.window.AOSHU_ELEMENTARY_DEEP_UNITS;
const route = (key) => routes.find((lesson) => lesson.key === key);
const unit = (key) => units[`roadmap:${key}`];

function solve(check) {
  const integer = (value) => Number.isSafeInteger(value);
  if (check.mode === 'multiple-total') {
    if (!integer(check.base) || check.base <= 0 || !integer(check.multiplier) || check.multiplier < 1) return null;
    return check.base * check.multiplier;
  }
  if (check.mode === 'additive-more') {
    if (!integer(check.base) || check.base < 0 || !integer(check.increment) || check.increment < 0) return null;
    return check.base + check.increment;
  }
  if (check.mode === 'find-multiplier') {
    if (!integer(check.total) || check.total < 0 || !integer(check.base) || check.base <= 0 || check.total % check.base !== 0) return null;
    const multiplier = check.total / check.base;
    return multiplier >= 1 ? multiplier : null;
  }
  return null;
}

function verify(item, label) {
  assert.ok(item.verification, `${label}: carries independent verification inputs`);
  assert.equal(solve(item.verification), item.verification.expected, `${label}: independently calculated result`);
  const expected = String(item.verification.expected);
  assert.ok((item.steps || []).join(' ').includes(expected) || (item.explanation || '').includes(expected), `${label}: worked reasoning contains the answer`);
  if (item.answers?.length) {
    const numericAnswers = item.answers.map((answer) => String(answer).match(/^\s*(\d+)/u)?.[1]);
    assert.ok(numericAnswers.every((answer) => answer === expected), `${label}: every accepted answer has the same numeric value`);
    assert.equal(new Set(numericAnswers).size, 1, `${label}: answer is unique`);
  } else {
    assert.match(label, /worked example/u, `${label}: only the worked example omits an accepted-answer list`);
  }
}

test('G3-21 remains on its original route and clearly distinguishes topic reference from original teaching', () => {
  const current = route('g3-21');
  assert.equal(current?.key, 'g3-21', 'stable progress and route key');
  assert.equal(current?.title, '倍数问题', 'preserve the route title');
  assert.equal(current?.href, '/siwei/branch-course.html?branch=arithmetic#bc-topic-ratio', 'preserve the existing related route');
  assert.equal(current?.link, '接着学：比与按比分配', 'preserve the existing next-step link');
  assert.match(current?.source || '', /主题参照/u);
  assert.match(current?.source || '', /逐讲映射\/页码待核/u);
  assert.match(current?.source || '', /例题与练习为本项目原创/u);
  assert.match(unit('g3-21')?.label || '', /本站原创讲解/u);
  assert.doesNotMatch(unit('g3-21')?.scope || '', /教材原题|逐讲对应/u);
  assert.match(unit('g3-21')?.scope || '', /不涉及比例/u);
  const previous = route('g3-15');
  assert.equal(previous?.status, '目录只列讲名 · 原创迁移课');
  assert.equal(previous?.deepUnit, null, 'leave the clearly labeled transfer lesson untouched');
});

test('G3-21 keeps the original worked-example and self-test meaning under the same progress key', () => {
  const current = route('g3-21');
  const lesson = unit('g3-21');
  assert.equal(lesson.roadmapTitle, '倍数问题');
  assert.deepEqual(
    { base: lesson.example.verification.base, multiplier: lesson.example.verification.multiplier, expected: lesson.example.verification.expected },
    { base: 8, multiplier: 3, expected: 24 },
    'the original example still means 8 is taken three times'
  );
  assert.equal(lesson.practices[0].question, '一盒彩笔有 7 支，另一盒是它的 4 倍；另一盒有几支？');
  assert.deepEqual(Array.from(lesson.practices[0].answers), ['28', '28支']);
  assert.equal(current.key, 'g3-21', 'existing local progress remains keyed to the same lesson');
  assert.equal(lesson.practices.length, 3, 'progressive lesson loop: starting, contrast, inverse check');
  assert.equal(lesson.review.length, 3, 'retrieval check is available after practice');
});

test('worked example and all practices have one independently verified whole-number answer', () => {
  const lesson = unit('g3-21');
  verify(lesson.example, 'G3-21 worked example');
  for (const [index, practice] of lesson.practices.entries()) verify(practice, `G3-21 practice ${index + 1}`);
  assert.deepEqual(
    Array.from(lesson.practices, ({ verification }) => verification.expected),
    [28, 7, 4]
  );
  for (const practice of lesson.practices) {
    assert.ok(practice.level && practice.hint && practice.wrongFeedback && practice.correctFeedback && practice.explanation,
      `${practice.level}: specific hint, correct and incorrect feedback, and explanation`);
  }
});

test('positive integer and exact-division boundaries are explicit', () => {
  const lesson = unit('g3-21');
  assert.match(lesson.scope, /基准数量大于 0/u);
  assert.match(lesson.scope, /正整数倍数/u);
  assert.match(lesson.methodCard.check, /单位/u);
  assert.match(lesson.scope, /不涉及比例、分数倍或方程/u);
  assert.equal(solve({ mode: 'multiple-total', base: 8, multiplier: 1 }), 8, 'one times means one equal copy');
  assert.equal(solve({ mode: 'multiple-total', base: 0, multiplier: 3 }), null, 'zero is outside the lesson’s positive-base scope');
  assert.equal(solve({ mode: 'multiple-total', base: 8, multiplier: 0 }), null, 'zero multiplier is outside the lesson’s positive-integer scope');
  assert.equal(solve({ mode: 'find-multiplier', total: 25, base: 6 }), null, 'a non-exact division is outside this whole-number lesson');
  assert.equal(solve({ mode: 'find-multiplier', total: 24, base: 0 }), null, 'division by zero is rejected');
  assert.equal(solve({ mode: 'find-multiplier', total: 6, base: 6 }), 1, 'equal nonzero quantities are one times');
});
