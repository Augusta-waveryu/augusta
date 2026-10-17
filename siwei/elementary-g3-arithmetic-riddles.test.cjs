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
const original = context.window.AOSHU_TEXTBOOK_LESSONS.find((lesson) => lesson.n === 6);
vm.runInContext(fs.readFileSync(path.join(root, 'elementary-g3-arithmetic-riddles.js'), 'utf8'), context);
vm.runInContext(fs.readFileSync(path.join(root, 'elementary-roadmap-data.js'), 'utf8'), context);
const route = context.window.AOSHU_TEXTBOOK_LESSONS.find((lesson) => lesson.key === 'g3-6');
const unit = context.window.AOSHU_ELEMENTARY_DEEP_UNITS['roadmap:g3-6'];

test('G3-6 keeps its stable route, original text/questions, source label, and next-course link', () => {
  assert.equal(route.key, 'g3-6');
  assert.equal(route.title, original.title);
  assert.equal(route.group, original.group);
  assert.equal(route.goal, original.goal);
  assert.equal(route.idea, original.idea);
  assert.equal(route.example, original.example);
  assert.deepEqual(Array.from(route.steps), Array.from(original.steps));
  assert.equal(route.practice, original.practice);
  assert.deepEqual(Array.from(route.answers), Array.from(original.answers));
  assert.equal(route.hint, original.hint);
  assert.equal(route.explanation, original.explanation);
  assert.equal(route.href, original.href);
  assert.equal(route.link, original.link);
  assert.equal(unit.practices[0].question, original.practice);
  assert.deepEqual(Array.from(unit.practices[0].answers), Array.from(original.answers));
  assert.match(route.source, /《奥数教程三年级（第八版）》公开目录/u);
  assert.match(route.source, /逐讲映射\/页码待核/u);
  assert.match(route.source, /例题与练习为本项目原创/u);
});

test('all Grade 3 route IDs remain intact and G3-6 has four progressive practices', () => {
  const gradeThree = context.window.AOSHU_TEXTBOOK_LESSONS.filter((lesson) => lesson.grade === 3);
  assert.equal(gradeThree.length, 28);
  assert.deepEqual(Array.from(gradeThree, (lesson) => lesson.key), Array.from({ length: 28 }, (_, index) => `g3-${index + 1}`));
  assert.equal(unit.practices.length, 4);
  assert.match(unit.label, /本轮补深/u);
  for (const practice of unit.practices) {
    assert.ok(practice.hint);
    assert.ok(practice.wrongFeedback);
    assert.ok(practice.correctFeedback);
    assert.ok(practice.explanation);
  }
  assert.equal(unit.review.length, 3);
  assert.ok(unit.methodCard);
  assert.ok(unit.diagram.text.includes('向十位进 1'));
});

test('all numerical examples and single-solution practice answers check independently', () => {
  assert.equal(588 + 357, 945);
  assert.equal(478 + 218, 696);
  assert.equal(346 + 248, 594);
  const oneBlank = [];
  for (let d = 0; d <= 9; d += 1) if (300 + 10 * d + 6 + 248 === 594) oneBlank.push(d);
  assert.deepEqual(oneBlank, [4]);
  const twoColumns = [];
  for (let tens = 0; tens <= 9; tens += 1) {
    for (let units = 0; units <= 9; units += 1) {
      if (400 + 10 * tens + 8 + 320 + units === 805) twoColumns.push([tens, units]);
    }
  }
  assert.deepEqual(twoColumns, [[7, 7]]);
  assert.equal(478 + 327, 805);
  assert.ok(unit.practices[1].answers.includes('4'));
  assert.ok(unit.practices[2].answers.includes('77'));
});

test('the boundary exercise is genuinely underdetermined without a distinct-digit condition', () => {
  assert.equal(21 + 31, 52);
  assert.equal(22 + 31, 53);
  assert.ok(unit.practices[3].answers.includes('不能唯一确定'));
  assert.match(unit.methodCard.check, /不要擅自加上这个条件/u);
});

test('legacy completion remains visible and accurately reports the new practice count', () => {
  const renderer = fs.readFileSync(path.join(root, 'textbook.js'), 'utf8');
  assert.match(renderer, /saved\?\.legacyDone === true/u);
  assert.match(renderer, /saved\?\.done === true && !Array\.isArray\(saved\?\.solved\)/u);
  assert.match(renderer, /本讲现有 \$\{practices\.length\} 道新练习/u);
  const html = fs.readFileSync(path.join(root, 'textbook.html'), 'utf8');
  const baseData = html.indexOf('textbook-data.js');
  const riddles = html.indexOf('elementary-g3-arithmetic-riddles.js');
  const routeData = html.indexOf('elementary-roadmap-data.js');
  assert.ok(baseData >= 0 && riddles > baseData && routeData > riddles);
});
