const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const dir = __dirname;
const target = 'elementary-g5-chicken-rabbit-units.js';
const html = fs.readFileSync(path.join(dir, 'textbook.html'), 'utf8');
const scripts = [...html.matchAll(/<script src="\/siwei\/([^"]+)"/g)].map((m) => m[1]);
const plain = (value) => JSON.parse(JSON.stringify(value));

function load(includeUnit) {
  const context = {window: {}, document: {getElementById: () => null}};
  vm.createContext(context);
  const files = [...scripts];
  if (!files.includes(target)) files.push(target);
  for (const file of files) {
    if (['textbook.js', 'textbook-overview.js'].includes(file)) continue;
    if (!includeUnit && file === target) continue;
    vm.runInContext(fs.readFileSync(path.join(dir, file), 'utf8'), context, {filename: file});
  }
  return context.window;
}

const before = load(false);
const after = load(true);
const oldLesson = before.AOSHU_TEXTBOOK_LESSONS.find((lesson) => lesson.key === 'g5-6');
const lesson = after.AOSHU_TEXTBOOK_LESSONS.find((item) => item.key === 'g5-6');
const unit = lesson?.deepUnit;

test('only g5-6 is enriched; identity, routes, sources and original questions remain unchanged', () => {
  assert.ok(oldLesson, 'baseline g5-6 lesson');
  assert.ok(lesson, 'updated g5-6 lesson');
  assert.equal(oldLesson.deepUnit, null);
  assert.strictEqual(lesson.deepUnit, unit);
  for (const field of ['key', 'title', 'n', 'grade', 'group', 'href', 'link', 'source', 'example', 'practice', 'answers', 'hint', 'explanation']) {
    assert.deepEqual(plain(lesson[field]), plain(oldLesson[field]), field);
  }
  assert.equal(lesson.status, unit.label);
  assert.equal(lesson.goal, unit.goal);
  assert.match(lesson.idea, /先修/);
  assert.deepEqual(plain(lesson.steps), plain(unit.example.steps));
  assert.equal(unit.example.question, '8 个头、22 条腿，鸡兔各几只？');
  assert.equal(unit.practices[0].question, '10 个头、28 条腿，兔子有几只？');
  assert.deepEqual(plain(unit.practices[0].answers), ['4']);
  assert.equal(after.AOSHU_TEXTBOOK_LESSONS.length, before.AOSHU_TEXTBOOK_LESSONS.length);
  for (const old of before.AOSHU_TEXTBOOK_LESSONS) {
    const current = after.AOSHU_TEXTBOOK_LESSONS.find((item) => item.key === old.key);
    assert.ok(current, old.key);
    if (old.key === 'g5-6') continue;
    assert.deepEqual(plain(current), plain(old), old.key);
  }
});

test('all practices independently enumerate to the stated answers', () => {
  const cases = [
    {heads: 10, legs: 28, ask: 'rabbit', answer: 4},
    {heads: 12, legs: 34, ask: 'chicken', answer: 7},
    {heads: 9, legs: 26, ask: 'rabbit', answer: 4},
    {heads: 6, legs: 12, ask: 'rabbit', answer: 0},
    {heads: 6, legs: 24, ask: 'chicken', answer: 0},
    {heads: 7, legs: 15, ask: 'feasible', answer: 0},
    {heads: 5, legs: 21, ask: 'feasible', answer: 0},
    {heads: 5, legs: 12, ask: 'tricycle', answer: 2}
  ];
  assert.equal(unit.practices.length, cases.length);
  const computed = cases.map(({heads, legs, ask}) => {
    if (ask === 'tricycle') return legs - heads * 2;
    const rabbit = (legs - heads * 2) / 2;
    const feasible = Number(Number.isInteger(rabbit) && rabbit >= 0 && rabbit <= heads);
    if (ask === 'feasible') return feasible;
    return ask === 'rabbit' ? rabbit : heads - rabbit;
  });
  assert.deepEqual(cases.map((item) => item.answer), computed);
  assert.deepEqual(plain(unit.practices.map((item) => Number(item.answers[0]))), computed);
  assert.match(unit.example.steps.join(' '), /鸡=10÷2=5只/u);
  for (const practice of unit.practices) {
    for (const field of ['hint', 'wrongFeedback', 'correctFeedback', 'explanation']) {
      assert.ok(practice[field]?.length > 8, `practice ${field}`);
    }
  }
});

test('chicken-rabbit feasibility, bounds and parity agree by exhaustive enumeration', () => {
  for (let heads = 0; heads <= 30; heads++) for (let legs = 0; legs <= 4 * heads + 3; legs++) {
    const rabbit = (legs - 2 * heads) / 2;
    const feasible = Number.isInteger(rabbit) && rabbit >= 0 && rabbit <= heads;
    const enumerated = Array.from({length: heads + 1}, (_, r) => 2 * (heads - r) + 4 * r)
      .some((total) => total === legs);
    assert.equal(feasible, enumerated, `heads=${heads}, legs=${legs}`);
    if (feasible) {
      const chicken = heads - rabbit;
      assert.equal(chicken + rabbit, heads);
      assert.equal(2 * chicken + 4 * rabbit, legs);
      assert.equal(legs % 2, 0);
    }
  }
});

test('deepUnit explains both assumptions, wheel migration, feedback review and honest scope', () => {
  assert.equal(unit.model.type, 'chicken-rabbit-swap');
  assert.match(unit.idea, /腿数每次增加2条/u);
  assert.match(unit.concepts.map((item) => item.text).join(' '), /全鸡/u);
  assert.match(unit.concepts.map((item) => item.text).join(' '), /全兔/u);
  assert.match(unit.concepts.map((item) => item.text).join(' '), /三轮车比两轮车/u);
  assert.ok(unit.review.length >= 4);
  assert.match(unit.scope, /原创/u);
  assert.match(unit.scope, /待核/u);
  assert.equal(unit.references[0].url, 'https://nrich.maths.org/problems/heads-and-feet');
  assert.match(unit.references[0].label, /非教材对应/u);
});
