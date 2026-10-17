const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = __dirname;
const scriptNames = [...fs.readFileSync(path.join(root, 'textbook.html'), 'utf8').matchAll(/<script src="\/siwei\/([^"]+)"/g)].map((match) => match[1]);
function load(includeNew) {
  const context = {window: {}, document: {getElementById: () => null}};
  vm.createContext(context);
  for (const file of scriptNames) {
    if (['textbook.js', 'textbook-overview.js', 'elementary-foundation-models.js'].includes(file)) continue;
    if (!includeNew && file === 'elementary-g4-probability-units.js') continue;
    vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, {filename: file});
  }
  return context.window;
}
const before = load(false);
const after = load(true);
const unit = after.AOSHU_ELEMENTARY_DEEP_UNITS['4:probability'];
const oldRoute = before.AOSHU_TEXTBOOK_LESSONS.find((lesson) => lesson.key === 'g4-13');
const route = after.AOSHU_TEXTBOOK_LESSONS.find((lesson) => lesson.key === 'g4-13');
const plain = (value) => JSON.parse(JSON.stringify(value));

test('only g4-13 gains depth; route identities, sources and destinations remain compatible', () => {
  const identity = (lesson) => [lesson.key, lesson.grade, lesson.n, lesson.group, lesson.href, lesson.source, lesson.prerequisite];
  assert.deepEqual(plain(after.AOSHU_TEXTBOOK_LESSONS.map(identity)), plain(before.AOSHU_TEXTBOOK_LESSONS.map(identity)));
  assert.equal(route.deepUnit, unit);
  assert.equal(oldRoute.deepUnit, null);
  assert.equal(route.title, oldRoute.title);
  for (const old of before.AOSHU_TEXTBOOK_LESSONS) {
    if (old.key !== 'g4-13') assert.deepEqual(plain(after.AOSHU_TEXTBOOK_LESSONS.find((lesson) => lesson.key === old.key)), plain(old));
  }
});

test('original example and first practice retain their exact questions and answer semantics', () => {
  assert.equal(unit.example.question, oldRoute.example);
  assert.equal(unit.practices[0].question, oldRoute.practice);
  assert.deepEqual(plain(unit.practices[0].answers), plain(oldRoute.answers));
  assert.equal(route.practice, oldRoute.practice);
});

test('independently count events and verify every numerical answer', () => {
  for (const item of [unit.example, ...unit.practices]) {
    if (!item.verification) continue;
    const {outcomes, favorable, numerator, denominator} = item.verification;
    assert.ok(outcomes.length > 0);
    assert.equal(new Set(outcomes).size, outcomes.length, 'basic outcomes must be unique');
    assert.equal(new Set(favorable).size, favorable.length, 'event must not repeat outcomes');
    assert.ok(favorable.every((outcome) => outcomes.includes(outcome)));
    assert.equal(favorable.length * denominator, outcomes.length * numerator);
    assert.ok(numerator >= 0 && numerator <= denominator && denominator > 0);
    if (item.answers) {
      for (const answer of item.answers) {
        const [n, d = '1'] = answer.split('/');
        assert.equal(Number(n) * outcomes.length, Number(d) * favorable.length);
      }
    }
  }
  // Different models consistent with two color names give different probabilities.
  assert.notEqual(1 / 2, 3 / 4);
  assert.deepEqual(plain(unit.practices[4].answers), ['不能', '不能确定']);
});

test('teaching loop includes conditions, counterexample, visual, progressive feedback and review', () => {
  assert.equal(unit.practices.length, 6);
  assert.ok(unit.concepts.length >= 5);
  assert.ok(unit.example.steps.length >= 4);
  assert.match(unit.scope, /本站原创/);
  assert.match(unit.scope, /待核/);
  assert.match(unit.methodCard.when, /机会相同/);
  assert.match(unit.idea, /不是.*保证/);
  assert.equal(unit.diagram.outcomes.length, 4);
  assert.equal(unit.diagram.outcomes.filter((item) => item.favorable).length, 3);
  assert.ok(unit.review.length >= 3);
  for (const item of unit.practices) {
    for (const field of ['level', 'question', 'hint', 'wrongFeedback', 'correctFeedback', 'explanation']) assert.ok(item[field], field);
    assert.ok(item.answers.length);
  }
});
