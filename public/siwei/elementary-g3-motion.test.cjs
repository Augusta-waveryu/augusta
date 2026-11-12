const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = __dirname;
const existing = {'roadmap:g3-2': {title: 'existing unit sentinel'}};
const context = {window: {AOSHU_ELEMENTARY_DEEP_UNITS: existing}};
vm.runInNewContext(fs.readFileSync(path.join(root, 'elementary-g3-motion-units.js'), 'utf8'), context);
const units = context.window.AOSHU_ELEMENTARY_DEEP_UNITS;

function checkedAnswer(check) {
  const {distance, expected} = check;
  if (check.mode === 'meeting-time') {
    const rate = check.speedA + check.speedB;
    assert.ok(distance > 0 && rate > 0);
    assert.equal(distance % rate, 0, 'meeting time must be an exact positive number of hours');
    return distance / rate;
  }
  if (check.mode === 'meeting-gap') {
    const rate = check.speedA + check.speedB;
    assert.ok(check.hours > 0 && rate > 0);
    assert.ok(check.hours < distance / rate, 'the pair must not already have met');
    return distance - rate * check.hours;
  }
  if (check.mode === 'chase-time') {
    assert.ok(check.fastSpeed > check.slowSpeed, 'the rear vehicle must be faster');
    const rate = check.fastSpeed - check.slowSpeed;
    assert.equal(distance % rate, 0, 'catch-up time must be an exact positive number of hours');
    return distance / rate;
  }
  if (check.mode === 'chase-gap') {
    assert.ok(check.fastSpeed > check.slowSpeed, 'the rear vehicle must be faster');
    const rate = check.fastSpeed - check.slowSpeed;
    assert.ok(check.hours > 0 && check.hours < distance / rate, 'the cars must not yet have caught up');
    return distance - rate * check.hours;
  }
  assert.fail(`unknown verification mode: ${check.mode}`);
}

function verifyRenderedCase(item, label) {
  assert.ok(item.verification, `${label}: independent arithmetic inputs are recorded`);
  const expected = checkedAnswer(item.verification);
  assert.equal(expected, item.verification.expected, `${label}: computed result`);
  if (Array.isArray(item.answers)) {
    assert.ok(item.answers.includes(String(expected)), `${label}: accepted answer includes computed result`);
  } else {
    assert.ok((item.steps || []).some((step) => step.includes(`= ${expected}`)), `${label}: worked steps show the computed result`);
  }
  if (item.question) {
    for (const value of [item.verification.distance, item.verification.speedA, item.verification.speedB,
      item.verification.fastSpeed, item.verification.slowSpeed, item.verification.hours].filter(Number.isFinite)) {
      assert.ok(item.question.includes(String(value)), `${label}: displayed question includes input ${value}`);
    }
  }
}

test('G3-23/24 keep the original route IDs and base lesson titles while adding deep units', () => {
  assert.ok(units['roadmap:g3-23']);
  assert.ok(units['roadmap:g3-24']);
  assert.equal(units['roadmap:g3-23'].roadmapTitle, '相遇问题');
  assert.equal(units['roadmap:g3-24'].roadmapTitle, '追及问题');
  assert.strictEqual(units['roadmap:g3-2'], existing['roadmap:g3-2'], 'merging must preserve existing deep units');

  const textbookContext = {window: {}};
  vm.runInNewContext(fs.readFileSync(path.join(root, 'textbook-data.js'), 'utf8'), textbookContext);
  const baseLessons = textbookContext.window.AOSHU_TEXTBOOK_LESSONS;
  assert.equal(baseLessons.find((lesson) => lesson.n === 23)?.title, '相遇问题');
  assert.equal(baseLessons.find((lesson) => lesson.n === 24)?.title, '追及问题');
});

test('两讲均明确保留原始目录映射待核和原创例题边界', () => {
  for (const key of ['roadmap:g3-23', 'roadmap:g3-24']) {
    const unit = units[key];
    assert.match(unit.scope, /逐讲映射与页码待核/u);
    assert.match(unit.scope, /本站原创/u);
    assert.match(unit.scope, /不是教材原题/u);
    assert.ok(unit.example.steps.length >= 4, `${key}: child-level worked reasoning`);
    assert.ok(unit.methodCard && unit.diagram && unit.concepts.length >= 4, `${key}: method and explanatory path`);
    assert.ok(unit.review.length >= 3, `${key}: retrieval/return check`);
    assert.equal(unit.practices.length, 3, `${key}: three progressive exercises`);
    for (const practice of unit.practices) {
      assert.ok(practice.level && practice.hint && practice.wrongFeedback && practice.correctFeedback && practice.explanation,
        `${key}/${practice.level}: specific hint and feedback`);
    }
  }
});

test('G3-23 worked example and all staged practice answers are independently verified', () => {
  const unit = units['roadmap:g3-23'];
  verifyRenderedCase(unit.example, 'G3-23 example');
  for (const [index, practice] of unit.practices.entries()) verifyRenderedCase(practice, `G3-23 practice ${index + 1}`);
  assert.deepEqual(Array.from(unit.practices, (practice) => practice.verification.expected), [3, 28, 3]);
});

test('G3-24 worked example and all staged practice answers are independently verified', () => {
  const unit = units['roadmap:g3-24'];
  verifyRenderedCase(unit.example, 'G3-24 example');
  for (const [index, practice] of unit.practices.entries()) verifyRenderedCase(practice, `G3-24 practice ${index + 1}`);
  assert.deepEqual(Array.from(unit.practices, (practice) => practice.verification.expected), [6, 18, 7]);
});

test('course script loads after the existing deep-unit data and before roadmap rendering', () => {
  const html = fs.readFileSync(path.join(root, 'textbook.html'), 'utf8');
  const repair = html.indexOf('/siwei/elementary-deep-units-repair.js');
  const motion = html.indexOf('/siwei/elementary-g3-motion-units.js');
  const roadmap = html.indexOf('/siwei/elementary-roadmap-data.js');
  const renderer = html.indexOf('/siwei/textbook.js');
  assert.ok(repair >= 0 && repair < motion && motion < roadmap && roadmap < renderer);
});
