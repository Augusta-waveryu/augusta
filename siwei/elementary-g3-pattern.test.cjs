const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = __dirname;
const context = {
  window: { AOSHU_CURRICULUM: [], AOSHU_DEEP_LESSONS: {}, AOSHU_ELEMENTARY_DEEP_UNITS: {} },
  document: { getElementById() { return null; } }
};
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root, 'textbook-data.js'), 'utf8'), context);
const original = context.window.AOSHU_TEXTBOOK_LESSONS.find((lesson) => lesson.n === 1);
vm.runInContext(fs.readFileSync(path.join(root, 'elementary-g3-pattern-units.js'), 'utf8'), context);
vm.runInContext(fs.readFileSync(path.join(root, 'elementary-roadmap-data.js'), 'utf8'), context);
const route = context.window.AOSHU_TEXTBOOK_LESSONS.find((lesson) => lesson.key === 'g3-1');
const unit = context.window.AOSHU_ELEMENTARY_DEEP_UNITS['roadmap:g3-1'];

function nextFromCycle(sequence, cycle) {
  assert.ok(sequence.length >= cycle.length, 'show at least one complete cycle');
  for (let index = 0; index < sequence.length; index += 1) {
    assert.equal(sequence[index], cycle[index % cycle.length], `sequence position ${index + 1} follows the proposed cycle`);
  }
  return cycle[sequence.length % cycle.length];
}

test('G3-1 keeps the existing route identity, original example, self-test and course link', () => {
  assert.equal(route.key, 'g3-1');
  assert.equal(route.title, original.title);
  assert.equal(route.example, original.example);
  assert.equal(route.practice, original.practice);
  assert.deepEqual(Array.from(route.answers), Array.from(original.answers));
  assert.equal(route.href, original.href);
  assert.equal(route.link, original.link);
  assert.equal(unit.practices[0].question, original.practice);
  assert.deepEqual(Array.from(unit.practices[0].answers), Array.from(original.answers));
  assert.match(route.source, /《奥数教程三年级（第八版）》公开目录/u);
  assert.match(route.source, /逐讲映射\/页码待核/u);
  assert.match(route.source, /例题与练习为本项目原创/u);
  assert.equal(unit.roadmapTitle, '找规律填图形');
  assert.equal(route.prerequisite, '会辨认常见图形并按顺序观察；不用会数列术语。');
});

test('all 28 Grade 3 route IDs remain present and the new unit adds exactly three progressive practices', () => {
  const gradeThree = context.window.AOSHU_TEXTBOOK_LESSONS.filter((lesson) => lesson.grade === 3);
  assert.equal(gradeThree.length, 28);
  assert.deepEqual(Array.from(gradeThree, (lesson) => lesson.key), Array.from({ length: 28 }, (_, index) => `g3-${index + 1}`));
  assert.equal(unit.practices.length, 3);
  for (const practice of unit.practices) {
    assert.ok(practice.hint);
    assert.ok(practice.wrongFeedback);
    assert.ok(practice.correctFeedback);
    assert.ok(practice.explanation);
  }
  assert.equal(unit.review.length, 3);
  assert.ok(unit.methodCard);
  assert.ok(unit.diagram.text.includes('第7幅：第1位'));
});

test('each worked repeating-pattern exercise has one correct next item', () => {
  const repeats = unit.practices.filter((practice) => practice.verification.kind === 'repeat');
  assert.equal(repeats.length, 2);
  for (const [index, practice] of repeats.entries()) {
    const expected = nextFromCycle(practice.verification.sequence, practice.verification.cycle);
    assert.equal(expected, practice.verification.expected, `repeat practice ${index + 1}`);
    assert.ok(practice.answers.includes(expected));
  }
  const exampleSequence = ['○', '△', '△', '○', '△', '△', '○'];
  assert.equal(nextFromCycle(exampleSequence, ['○', '△', '△']), '△');
});

test('the migration exercise demonstrates two valid rules with different next items', () => {
  const practice = unit.practices.find((item) => item.verification.kind === 'ambiguous');
  const { sequence, candidateCycles, nextValues, expected } = practice.verification;
  const computed = candidateCycles.map((cycle) => nextFromCycle(sequence, cycle));
  assert.deepEqual(computed, nextValues);
  assert.equal(new Set(computed).size, 2);
  assert.equal(expected, '不能唯一确定');
  assert.ok(practice.answers.includes(expected));
});

test('deepening preserves legacy completion handling and loads before route assembly', () => {
  const renderer = fs.readFileSync(path.join(root, 'textbook.js'), 'utf8');
  assert.match(renderer, /aoshu-elementary-roadmap-v2/u);
  assert.match(renderer, /saved\?\.legacyDone === true/u);
  assert.match(renderer, /saved\?\.done === true && !Array\.isArray\(saved\?\.solved\)/u);
  const html = fs.readFileSync(path.join(root, 'textbook.html'), 'utf8');
  const baseData = html.indexOf('textbook-data.js');
  const patterns = html.indexOf('elementary-g3-pattern-units.js');
  const routeData = html.indexOf('elementary-roadmap-data.js');
  assert.ok(baseData >= 0 && patterns > baseData && routeData > patterns);
});
