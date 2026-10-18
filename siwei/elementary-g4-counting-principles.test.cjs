const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = __dirname;
const target = 'elementary-g4-counting-principles-units.js';
const scriptNames = [...fs.readFileSync(path.join(root, 'textbook.html'), 'utf8').matchAll(/<script src="\/siwei\/([^"]+)"/g)].map((m) => m[1]);
function load(includeNew) {
  const context = {window: {}, document: {getElementById: () => null}};
  vm.createContext(context);
  const files = scriptNames.includes(target) ? scriptNames : [...scriptNames, target];
  for (const file of files) {
    if (['textbook.js', 'textbook-overview.js', 'elementary-foundation-models.js'].includes(file)) continue;
    if (!includeNew && file === target) continue;
    vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, {filename: file});
  }
  return context.window;
}
const before = load(false);
const after = load(true);
const unit = after.AOSHU_ELEMENTARY_DEEP_UNITS['4:add-multiply-principle'];
const oldRoute = before.AOSHU_TEXTBOOK_LESSONS.find((lesson) => lesson.key === 'g4-12');
const route = after.AOSHU_TEXTBOOK_LESSONS.find((lesson) => lesson.key === 'g4-12');
const plain = (value) => JSON.parse(JSON.stringify(value));

test('only g4-12 gains depth and route identities remain unchanged', () => {
  const identity = (lesson) => [lesson.key, lesson.grade, lesson.n, lesson.group, lesson.href, lesson.source, lesson.prerequisite];
  assert.deepEqual(plain(after.AOSHU_TEXTBOOK_LESSONS.map(identity)), plain(before.AOSHU_TEXTBOOK_LESSONS.map(identity)));
  assert.equal(route.deepUnit, unit);
  assert.equal(oldRoute.deepUnit, null);
  assert.equal(route.title, oldRoute.title);
  for (const old of before.AOSHU_TEXTBOOK_LESSONS) {
    if (old.key !== 'g4-12') assert.deepEqual(plain(after.AOSHU_TEXTBOOK_LESSONS.find((lesson) => lesson.key === old.key)), plain(old));
  }
});

test('original courseTitle, example, first practice question and answers are exact', () => {
  assert.equal(unit.courseTitle, oldRoute.title);
  assert.equal(unit.example.question, oldRoute.example);
  assert.equal(unit.practices[0].question, oldRoute.practice);
  assert.deepEqual(plain(unit.practices[0].answers), plain(oldRoute.answers));
  assert.equal(route.practice, oldRoute.practice);
});

function cartesian(axes) {
  return axes.reduce((rows, axis) => rows.flatMap((row) => axis.map((choice) => [...row, choice])), [[]]);
}
function independentlyCount(model) {
  model.axes.forEach((axis) => assert.equal(new Set(axis).size, axis.length, 'no duplicate choices'));
  if (model.mode === 'and') return new Set(cartesian(model.axes).map(JSON.stringify)).size;
  if (model.mode === 'or' || model.mode === 'branch') {
    return new Set(model.axes.flatMap((axis, branch) => axis.map((choice) => JSON.stringify([branch, choice])))).size;
  }
  if (model.mode === 'overlap') return new Set(model.axes.flat()).size;
  throw new Error(`unknown counting mode: ${model.mode}`);
}

test('independently enumerate complete legal outcomes rather than trusting supplied counts', () => {
  // These enumerations are built from the problem conditions, not unit.countingModel.
  const outfits = [];
  for (const shirt of ['A', 'B', 'C']) for (const pants of [1, 2]) outfits.push(`${shirt}${pants}`);
  const destinations = [...Array.from({length:4}, (_,i) => `公园${i+1}`), ...Array.from({length:3}, (_,i) => `图书馆${i+1}`)];
  const passwords = [];
  for (let n=0;n<1000;n++) passwords.push(String(n).padStart(3, '0'));
  assert.equal(passwords[0], '000');
  const routes = [];
  for (let first=1;first<=2;first++) for (let second=1;second<=5;second++) routes.push(`${first}/${second}`);
  const restricted = outfits.filter((pair) => pair !== 'B2');
  assert.deepEqual(restricted, ['A1','A2','B1','C1','C2']);
  const orders = [];
  for (const flavor of ['原味','红豆']) for (const temperature of ['热','冷']) orders.push(`${flavor}${temperature}`);
  for (const juice of ['苹果汁','橙汁','葡萄汁']) orders.push(juice);
  const painters = new Set(['甲','乙','丙','画1','画2','画3','画4','画5']);
  const calligraphers = new Set(['甲','乙','丙','书1','书2','书3']);
  assert.equal([...painters].filter((person) => calligraphers.has(person)).length, 3);
  const attendees = [...new Set([...painters,...calligraphers])];
  const enumerated = [outfits,destinations,passwords,routes,restricted,orders,attendees];
  const items = [unit.example, ...unit.practices];
  items.forEach((item, index) => {
    const model = item.countingModel;
    assert.ok(model && model.axes.every((axis) => axis.length > 0));
    const expected = new Set(enumerated[index]).size;
    assert.equal(independentlyCount(model), expected);
    if (item.answers) assert.deepEqual(plain(item.answers), [String(expected)], 'all accepted answers must be correct');
  });
  const diagramOutfits = (diagram) => Array.from(diagram.rows).flatMap((row) => Array.from(row.choices, (pants) => `${row.label.replace('上衣','')}${pants.replace('裤子','')}`));
  assert.deepEqual(diagramOutfits(unit.diagram), outfits);
  assert.deepEqual(diagramOutfits(unit.limitDiagram), restricted);
  assert.deepEqual(plain(unit.practices[4].countingModel.axes.flat()), orders);
  assert.deepEqual(plain([...new Set(unit.practices[5].countingModel.axes.flat())]), attendees);
});

test('teaching loop has conditions, two choice-grid diagrams, progressive feedback and review', () => {
  assert.equal(unit.practices.length, 6);
  assert.ok(unit.concepts.length >= 5);
  assert.ok(unit.example.steps.length >= 4);
  assert.match(unit.scope, /本站原创/);
  assert.match(unit.scope, /待核/);
  assert.match(unit.idea, /不能.*机械/);
  assert.match(unit.methodCard.when, /互不重叠/);
  assert.match(unit.methodCard.when, /同样多/);
  for (const diagram of [unit.diagram, unit.limitDiagram]) {
    assert.equal(diagram.type, 'counting-choice-grid');
    assert.ok(diagram.title && diagram.caption && diagram.check);
    assert.ok(diagram.rows.every((row) => row.label && row.choices.length));
  }
  assert.deepEqual(Array.from(unit.diagram.rows, (row) => row.choices.length), [2, 2, 2]);
  assert.deepEqual(Array.from(unit.limitDiagram.rows, (row) => row.choices.length), [2, 1, 2]);
  assert.ok(unit.review.length >= 3);
  for (const item of unit.practices) {
    for (const field of ['level', 'question', 'hint', 'wrongFeedback', 'correctFeedback', 'explanation']) assert.ok(item[field], field);
    assert.ok(item.answers.length);
  }
});
