const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const dir = __dirname;
const target = 'elementary-g4-sum-difference-units.js';
const html = fs.readFileSync(path.join(dir, 'textbook.html'), 'utf8');
const scripts = [...html.matchAll(/<script src="\/siwei\/([^"]+)"/g)].map((m) => m[1]);
const plain = (value) => JSON.parse(JSON.stringify(value));

function load(includeUnit) {
  const context = {window: {}, document: {getElementById: () => null}};
  vm.createContext(context);
  for (const file of scripts) {
    if (['textbook.js', 'textbook-overview.js'].includes(file)) continue;
    if (!includeUnit && file === target) continue;
    vm.runInContext(fs.readFileSync(path.join(dir, file), 'utf8'), context, {filename: file});
  }
  return context.window;
}

const before = load(false);
const after = load(true);
const unit = after.AOSHU_ELEMENTARY_DEEP_UNITS['4:sum-difference'];
const oldLesson = before.AOSHU_TEXTBOOK_LESSONS.find((lesson) => lesson.key === 'g4-6');
const lesson = after.AOSHU_TEXTBOOK_LESSONS.find((item) => item.key === 'g4-6');

function modelRoot(caseIndex, view) {
  const nodes = {};
  const node = (name) => nodes[name] ||= {
    value: name === 'case' ? String(caseIndex) : view,
    innerHTML: '', textContent: '', attrs: {},
    setAttribute(key, value) { this.attrs[key] = value; }
  };
  return {
    dataset: {bookModel: 'sum-difference-bars'},
    nodes,
    querySelector(selector) {
      const name = {
        '[data-sumdiff-case]': 'case',
        '[data-sumdiff-view]': 'view',
        '[data-sumdiff-chart]': 'chart',
        '[data-book-model-result]': 'result'
      }[selector];
      assert.ok(name, selector);
      return node(name);
    }
  };
}

const legalCases = [
  {sum: 36, diff: 8},
  {sum: 46, diff: 10},
  {sum: 30, diff: 6},
  {sum: 25, diff: 0}
];
const views = ['original', 'remove', 'add'];

test('only g4-6 gains depth; original question, answers, route/source/prerequisite stay unchanged', () => {
  assert.equal(oldLesson.deepUnit, null);
  assert.strictEqual(lesson.deepUnit, unit);
  for (const field of ['key', 'title', 'source', 'href', 'link', 'prerequisite', 'suggestedDifficulty']) {
    assert.deepEqual(lesson[field], oldLesson[field], field);
  }
  assert.equal(unit.example.question, oldLesson.example);
  assert.equal(unit.practices[0].question, oldLesson.practice);
  assert.deepEqual(plain(unit.practices[0].answers), plain(oldLesson.answers));
  assert.equal(after.AOSHU_TEXTBOOK_LESSONS.length, before.AOSHU_TEXTBOOK_LESSONS.length);
  for (const old of before.AOSHU_TEXTBOOK_LESSONS) {
    if (old.key === 'g4-6') continue;
    assert.deepEqual(plain(after.AOSHU_TEXTBOOK_LESSONS.find((item) => item.key === old.key)), plain(old), old.key);
  }
});

test('every practice is independently calculated, including the changed seventh sum-only check', () => {
  const expected = ['18', '14', '18', '12.5', '0', '0', '0', '11'];
  assert.deepEqual(Array.from(unit.practices, (practice) => practice.answers[0]), expected);
  const computed = [
    (46 - 10) / 2,
    (36 - 8) / 2,
    (30 + 6) / 2,
    (25 - 0) / 2,
    Number(Number.isInteger((15 + 4) / 2)),
    Number((6 - 8) / 2 >= 0),
    Number(12 + 8 === 20 && 12 - 8 === 6),
    (27 - 5) / 2
  ];
  assert.deepEqual(Array.from(unit.practices, (practice) => Number(practice.answers[0])), computed);
  assert.match(unit.practices[6].question, /和20、差6/u);
  assert.match(unit.practices[6].question, /答12和8.*同时满足和与差/u);
  for (const practice of unit.practices) {
    for (const field of ['hint', 'wrongFeedback', 'correctFeedback', 'explanation']) {
      assert.ok(practice[field]?.length > 5, `practice ${field}`);
    }
  }
});

test('range and parity enumeration agrees with nonnegative integer feasibility', () => {
  for (let sum = 0; sum <= 40; sum++) for (let diff = 0; diff <= 40; diff++) {
    const small = (sum - diff) / 2;
    const large = (sum + diff) / 2;
    const valid = sum >= diff && (sum - diff) % 2 === 0;
    assert.equal(Number.isInteger(small) && Number.isInteger(large) && small >= 0 && large >= 0, valid,
      `sum=${sum}, diff=${diff}`);
    if (valid) {
      assert.equal(small + large, sum);
      assert.equal(large - small, diff);
      assert.equal(sum % 2, diff % 2);
    }
  }
});

test('all six model conditions × three operations preserve totals and segment lengths', () => {
  const cases = [...legalCases, {sum: 15, diff: 4, discrete: true}, {sum: 6, diff: 8}];
  for (let caseIndex = 0; caseIndex < cases.length; caseIndex++) for (const view of views) {
    const root = modelRoot(caseIndex, view);
    assert.equal(after.AOSHU_FOUNDATION_WIDGETS.update(root), true);
    const current = cases[caseIndex];
    const small = (current.sum - current.diff) / 2;
    const large = (current.sum + current.diff) / 2;
    root.nodes.chart.innerHTML ||= '';
    if (caseIndex >= 4) {
      assert.equal(root.dataset.sumdiffValid, 'false');
      assert.match(root.nodes.chart.innerHTML, /条件不成立/u);
      assert.match(root.nodes.chart.attrs['aria-label'], /不符合非负条件|不是整数/u);
      assert.doesNotMatch(root.nodes.chart.innerHTML, /book-sumdiff-row/u);
      assert.match(root.nodes.result.textContent, /不能使原条件成立/u);
      continue;
    }
    assert.equal(root.dataset.sumdiffValid, 'true');
    assert.equal(root.dataset.sumdiffSmall, String(small));
    assert.equal(root.dataset.sumdiffLarge, String(large));
    const expected = view === 'remove'
      ? {first: small, second: small, total: current.sum - current.diff, extras: 0}
      : view === 'add'
        ? {first: large, second: large, total: current.sum + current.diff, extras: 2}
        : {first: large, second: small, total: current.sum, extras: 1};
    assert.deepEqual([...root.nodes.chart.innerHTML.matchAll(/book-sumdiff-row"><b>[^：]+：([^<]+)/gu)].map((m) => Number(m[1])), [expected.first, expected.second]);
    assert.equal((root.nodes.chart.innerHTML.match(/book-sumdiff-extra/g) || []).length, expected.extras);
    assert.match(root.nodes.chart.attrs['aria-label'], new RegExp(`上段${expected.first}，下段${expected.second}；合计${expected.total}`));
    assert.doesNotMatch(root.nodes.result.textContent, /NaN|Infinity/u);
    assert.match(root.nodes.result.textContent, new RegExp(String(expected.total)));
    assert.equal(expected.first + expected.second, expected.total);
  }
});

test('original widgets remain delegated and the sum-difference markup is accessible', () => {
  const widgets = after.AOSHU_FOUNDATION_WIDGETS;
  assert.equal(widgets.supports('sum-difference-bars'), true);
  for (const type of ['clock-face', 'paired-removal', 'pigeonhole-bins', 'counterexample-check']) {
    assert.equal(widgets.supports(type), true);
    assert.equal(widgets.markup({type}), before.AOSHU_FOUNDATION_WIDGETS.markup({type}));
  }
  const delegatedRoot = {dataset: {bookModel: 'not-a-model'}, querySelector() { return null; }};
  assert.equal(widgets.update(delegatedRoot), before.AOSHU_FOUNDATION_WIDGETS.update(delegatedRoot));
  assert.equal(widgets.supports('not-a-model'), false);
  const markup = widgets.markup(unit.model);
  assert.match(markup, /<section[^>]+aria-label="和差线段图实验台"/u);
  assert.match(markup, /<label>题目条件<select[^>]+aria-label="和差实验条件"/u);
  assert.match(markup, /<label>操作<select[^>]+aria-label="和差实验操作"/u);
  assert.match(markup, /data-foundation-model-control/u);
  assert.match(markup, /data-sumdiff-chart[^>]+class="book-sumdiff-chart"[^>]*role="img"/u);
  assert.match(markup, /aria-live="polite"/u);
  assert.match(markup, /操作不计入答题进度/u);
  assert.match(unit.scope, /原创/u);
  assert.match(unit.scope, /页码与逐讲映射待核/u);
});
