const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const target = 'elementary-g4-inverse-units.js';
const scripts = [...fs.readFileSync(path.join(__dirname, 'textbook.html'), 'utf8')
  .matchAll(/<script src="\/siwei\/([^"]+)"/g)].map(x => x[1]);
function load(include) {
  const c = { window: {}, document: { getElementById: () => null } };
  vm.createContext(c);
  for (const file of scripts) {
    if (['textbook.js', 'textbook-overview.js'].includes(file) || (!include && file === target)) continue;
    vm.runInContext(fs.readFileSync(path.join(__dirname, file), 'utf8'), c, { filename: file });
  }
  return c.window;
}
const before = load(false);
const after = load(true);
const plain = x => JSON.parse(JSON.stringify(x));
const old = before.AOSHU_TEXTBOOK_LESSONS.find(x => x.key === 'g4-20');
const current = after.AOSHU_TEXTBOOK_LESSONS.find(x => x.key === 'g4-20');
const unit = current.deepUnit;

test('only g4-20 changes; original identity, question, answer, route, prerequisite and source remain', () => {
  assert.equal(old.deepUnit, null);
  for (const key of ['key', 'title', 'grade', 'n', 'group', 'href', 'link', 'prerequisite', 'source', 'suggestedDifficulty']) {
    assert.deepEqual(current[key], old[key], key);
  }
  assert.equal(unit.courseTitle, old.title);
  assert.equal(unit.example.question, old.example);
  assert.equal(unit.practices[0].question, old.practice);
  assert.deepEqual(plain(unit.practices[0].answers), plain(old.answers));
  assert.equal(before.AOSHU_TEXTBOOK_LESSONS.length, after.AOSHU_TEXTBOOK_LESSONS.length);
  for (const item of before.AOSHU_TEXTBOOK_LESSONS) {
    if (item.key !== 'g4-20') assert.deepEqual(plain(after.AOSHU_TEXTBOOK_LESSONS.find(x => x.key === item.key)), plain(item), item.key);
  }
});

test('every practice is independently checked in the nonnegative, exact-division domain', () => {
  const expected = [7, 0, 0, 18, 20, 3, 0, 0];
  assert.equal(unit.practices.length, expected.length);
  assert.deepEqual(Array.from(unit.practices, p => Number(p.answers[0])), expected);
  const checks = new Map([
    [0, x => (x + 8) * 2 === 30],
    [3, x => (x - 6) / 3 === 4],
    [4, x => x / 4 + 6 === 11],
    [5, x => (x + 5) * 2 - 4 === 12],
  ]);
  for (const [i, check] of checks) {
    assert.equal(check(expected[i]), true, `practice ${i}`);
    assert.equal(Number.isInteger(expected[i]) && expected[i] >= 0, true, `practice ${i} domain`);
  }
  assert.equal(expected[1], 0); // 21 is only the post-multiplication intermediate, not the original
  assert.equal(expected[2], 0); // the proposed 11 fails the forward check
  assert.equal(expected[6], 0); // multiplication by zero cannot identify a unique origin
  assert.equal(expected[7], 0); // quotient without remainder cannot identify a unique origin
  assert.equal(expected[4] % 4, 0);
  assert.equal(2 * 0, 3 * 0); // multiplication by zero is not injective
  assert.deepEqual([12, 13, 14, 15].map(x => Math.floor(x / 4)), [3, 3, 3, 3]); // quotient alone is not invertible
  for (const p of unit.practices) for (const field of ['hint', 'wrongFeedback', 'correctFeedback', 'explanation']) assert.ok(p[field].length > 10, field);
  assert.match(unit.scope, /非负整数/);
  assert.match(unit.scope, /恰好整除/);
  assert.match(unit.scope, /乘0/);
  assert.match(unit.scope, /只报余数/);
  assert.match(unit.methodCard.check, /丢失信息/);
});

function root(key = 'times', stage = 0) {
  const options = [0, 1, 2, 3].map(value => ({ value: String(value), disabled: false }));
  const nodes = {
    choice: { value: key },
    stage: { value: String(stage), options },
    forward: { textContent: '' },
    path: { innerHTML: '' },
    result: { textContent: '' },
  };
  return {
    dataset: { bookModel: 'inverse-path' },
    nodes,
    querySelector(selector) {
      return nodes[{ '[data-inverse-case]': 'choice', '[data-inverse-stage]': 'stage', '[data-inverse-forward]': 'forward', '[data-inverse-path]': 'path', '[data-book-model-result]': 'result' }[selector]];
    },
  };
}

test('all interaction cases × every valid stage, reset, invalid fallback and boundary behavior', () => {
  const cases = {
    times: { values: [17, 21, 7], ops: ['+4', '÷3'], end: '7', steps: 3 },
    plus: { values: [30, 15, 7], ops: ['÷2', '−8'], end: '7', steps: 3 },
    three: { values: [12, 16, 8, 3], ops: ['+4', '÷2', '−5'], end: '3', steps: 4 },
    zero: { values: [0], ops: [], end: '0', steps: 1 },
  };
  for (const [key, c] of Object.entries(cases)) {
    for (let stage = 0; stage < c.steps; stage++) {
      const r = root(key, stage);
      r.dataset.inverseCase = key;
      assert.equal(after.AOSHU_FOUNDATION_WIDGETS.update(r), true, `${key}/${stage}`);
      assert.equal(r.nodes.path.innerHTML.match(/book-inverse-node/g)?.length, stage + 1);
      assert.match(r.nodes.forward.textContent, /正向路线：/);
      assert.ok(r.nodes.result.textContent.length > 0);
      assert.doesNotMatch(r.nodes.path.innerHTML, /undefined|NaN/);
      assert.equal(r.nodes.stage.options.slice(c.values.length).every(o => o.disabled), true);
    }
    const reset = root(key, 3);
    reset.dataset.inverseCase = key === 'times' ? 'plus' : 'times';
    after.AOSHU_FOUNDATION_WIDGETS.update(reset);
    assert.equal(reset.nodes.stage.value, '0', `${key} resets on case switch`);
    assert.equal(reset.nodes.path.innerHTML.match(/book-inverse-node/g)?.length, 1);
    assert.match(reset.nodes.result.textContent, /不能唯一还原|先预测|终点|最后/);
  }
  const fallback = root('not-a-case', 'NaN');
  after.AOSHU_FOUNDATION_WIDGETS.update(fallback);
  assert.equal(fallback.dataset.inverseCase, 'times');
  assert.equal(fallback.nodes.stage.value, '0');
  assert.match(fallback.nodes.forward.textContent, /×3/);
  const overrun = root('times', 99);
  overrun.dataset.inverseCase = 'times';
  after.AOSHU_FOUNDATION_WIDGETS.update(overrun);
  assert.equal(overrun.nodes.stage.value, '2');
  assert.match(overrun.nodes.path.innerHTML, />7</);
});

test('inverse markup is accessible and all older foundation widgets still delegate unchanged', () => {
  const markup = after.AOSHU_FOUNDATION_WIDGETS.markup(unit.model);
  assert.match(markup, /data-inverse-case/);
  assert.match(markup, /data-inverse-stage/);
  assert.match(markup, /aria-live="polite"/);
  assert.match(markup, /data-foundation-model-control/);
  for (const type of ['equation-balance', 'grid-mirror', 'angles-relations', 'average-balance', 'planting-points']) {
    assert.equal(after.AOSHU_FOUNDATION_WIDGETS.supports(type), true, type);
    assert.equal(after.AOSHU_FOUNDATION_WIDGETS.markup({ type }), before.AOSHU_FOUNDATION_WIDGETS.markup({ type }), type);
  }
});
