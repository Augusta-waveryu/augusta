const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const target = 'elementary-g6-pigeonhole-units.js';
const scripts = [...fs.readFileSync(path.join(__dirname, 'textbook.html'), 'utf8').matchAll(/<script src="\/siwei\/([^"]+)"/g)].map(m => m[1]);

function load(includeTarget) {
  const context = { window: {}, document: { getElementById: () => null } };
  vm.createContext(context);
  for (const file of scripts) {
    if (['textbook.js', 'textbook-overview.js', 'elementary-foundation-models.js'].includes(file)) continue;
    if (!includeTarget && file === target) continue;
    vm.runInContext(fs.readFileSync(path.join(__dirname, file), 'utf8'), context, { filename: file });
  }
  return context.window;
}

const before = load(false);
const after = load(true);
const unit = after.AOSHU_ELEMENTARY_DEEP_UNITS['6:pigeonhole'];
const oldLesson = before.AOSHU_TEXTBOOK_LESSONS.find(l => l.key === 'g6-12');
const currentLesson = after.AOSHU_TEXTBOOK_LESSONS.find(l => l.key === 'g6-12');
const plain = value => JSON.parse(JSON.stringify(value));

function weakCompositions(total, bins) {
  const result = [];
  function visit(left, slots, row) {
    if (slots === 1) { result.push([...row, left]); return; }
    for (let n = 0; n <= left; n++) visit(left - n, slots - 1, [...row, n]);
  }
  visit(total, bins, []);
  return result;
}
function minMaxByEnumeration(total, bins) {
  return Math.min(...weakCompositions(total, bins).map(row => Math.max(...row)));
}
function combinations(values, size) {
  const result = [];
  function visit(start, chosen) {
    if (chosen.length === size) { result.push([...chosen]); return; }
    for (let i = start; i <= values.length - (size - chosen.length); i++) visit(i + 1, [...chosen, values[i]]);
  }
  visit(0, []);
  return result;
}
function sockAllocations(colors, draw, inventory) {
  return weakCompositions(draw, colors).filter(row => row.every((n, i) => n <= inventory[i]));
}

 test('only g6-12 changes and its original lesson fields are retained', () => {
  assert.equal(oldLesson.deepUnit, null);
  assert.equal(currentLesson.deepUnit, unit);
  assert.equal(currentLesson.title, oldLesson.title);
  assert.equal(currentLesson.href, oldLesson.href); // route
  assert.equal(unit.example.question, oldLesson.example); // question
  assert.equal(unit.practices[0].question, oldLesson.practice);
  assert.deepEqual(plain(unit.practices.map(p => p.answers[0])), plain(['4', '3', '9', '4', '3', '2', '13']));
  assert.deepEqual(plain(currentLesson.answers), plain(oldLesson.answers));
  assert.equal(currentLesson.source, oldLesson.source);
  assert.equal(currentLesson.key, oldLesson.key);
  assert.equal(currentLesson.n, oldLesson.n);
  for (const lesson of before.AOSHU_TEXTBOOK_LESSONS) {
    if (lesson.key === 'g6-12') continue;
    const next = after.AOSHU_TEXTBOOK_LESSONS.find(item => item.key === lesson.key);
    assert.deepEqual(plain(next), plain(lesson));
  }
});

test('independently enumerates weak distributions for the stated guarantees', () => {
  for (const [objects, bins, expected] of [[13, 4, 4], [12, 4, 3], [5, 4, 2], [2, 4, 1], [0, 4, 0]]) {
    assert.equal(minMaxByEnumeration(objects, bins), expected, `${objects}/${bins}`);
  }
  const target = 3;
  const firstEnough = Array.from({ length: 30 }, (_, n) => n).find(n => minMaxByEnumeration(n, 4) >= target);
  assert.equal(firstEnough, 9); // 8 = 2|2|2|2 still avoids 3
  assert.equal(minMaxByEnumeration(8, 4), 2);
});

test('checks all 5-subsets of 1..9 by odd/even allocation', () => {
  const values = combinations([1, 2, 3, 4, 5, 6, 7, 8, 9], 5);
  const guarantees = values.map(set => {
    const odd = set.filter(n => n % 2).length;
    return Math.max(odd, set.length - odd);
  });
  assert.equal(Math.min(...guarantees), 3);
  assert.ok(values.some(set => set.join(',') === '1,2,3,4,5'));
  assert.deepEqual(plain(unit.practices.map(p => p.answers[0])), ['4', '3', '9', '4', '3', '2', '13']);
});

test('enumerates the three-color sock worst cases for 3 and 4 draws', () => {
  const three = sockAllocations(3, 3, [5, 5, 5]);
  const four = sockAllocations(3, 4, [5, 5, 5]);
  assert.equal(Math.min(...three.map(row => Math.max(...row))), 1);
  assert.equal(Math.min(...four.map(row => Math.max(...row))), 2);
  assert.ok(three.some(row => row.join(',') === '1,1,1'));
  assert.ok(four.every(row => Math.max(...row) >= 2));
});

test('checks the month question with an independently enumerated worst allocation', () => {
  const allocations = weakCompositions(13, 12);
  let minimum = Infinity;
  for (const row of allocations) minimum = Math.min(minimum, Math.max(...row));
  assert.equal(minimum, 2);
  assert.ok(allocations.some(row => row.filter(n => n === 2).length === 1 && row.filter(n => n === 1).length === 11));
});

test('pigeonhole teaching loop contains concepts, method, diagrams, feedback, review and original model', () => {
  assert.equal(unit.practices.length, 7);
  assert.ok(unit.concepts.length >= 5);
  assert.ok(unit.diagrams.length >= 3);
  assert.ok(unit.review.length >= 4);
  assert.match(unit.scope, /待核/);
  assert.match(unit.scope, /本站原创/);
  assert.equal(unit.model.type, 'pigeonhole-bins');
  assert.deepEqual(plain([unit.model.objects, unit.model.bins]), [13, 4]);
  assert.match(unit.methodCard.title, /对象和类别/);
  for (const practice of unit.practices) {
    for (const field of ['level', 'question', 'hint', 'wrongFeedback', 'correctFeedback', 'explanation']) assert.ok(practice[field]);
  }
});
