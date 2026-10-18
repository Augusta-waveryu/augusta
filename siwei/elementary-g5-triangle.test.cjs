const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const dir = __dirname;
const html = fs.readFileSync(path.join(dir, 'textbook.html'), 'utf8');
const scripts = [...html.matchAll(/<script src="\/siwei\/([^"]+)"/g)].map(m => m[1]);
const unitFile = 'elementary-g5-triangle-units.js';
const widgetFile = 'elementary-g5-triangle-widget.js';
const plain = value => JSON.parse(JSON.stringify(value));

function load(includeTriangle) {
  const context = { window: {}, document: { getElementById: () => null } };
  vm.createContext(context);
  for (const file of scripts) {
    if (['textbook.js', 'textbook-overview.js'].includes(file)) continue;
    if (!includeTriangle && [unitFile, widgetFile].includes(file)) continue;
    vm.runInContext(fs.readFileSync(path.join(dir, file), 'utf8'), context, { filename: file });
  }
  return context.window;
}

const before = load(false);
const after = load(true);
const oldLesson = before.AOSHU_TEXTBOOK_LESSONS.find(item => item.key === 'g5-9');
const lesson = after.AOSHU_TEXTBOOK_LESSONS.find(item => item.key === 'g5-9');
const unit = lesson?.deepUnit;
const oldDeepUnit = oldLesson?.deepUnit;

function validTriangle(sides) {
  if (sides.length !== 3 || sides.some(x => !Number.isFinite(x) || x <= 0)) return false;
  return sides.every((x, i) => sides.every((y, j) => i === j || sides.every((z, k) => k === i || k === j || x + y > z)));
}

function root(value = '7') {
  const nodes = {
    input: { value },
    drawing: { innerHTML: '' },
    result: { textContent: '' },
  };
  return {
    dataset: { bookModel: 'triangle-boundary' },
    nodes,
    querySelector(selector) {
      return selector === '[data-triangle-drawing]' ? nodes.drawing
        : selector === '[data-book-model-result]' ? nodes.result
        : nodes.input;
    },
  };
}

test('整页加载后只有 g5-9 改变，旧路由字段与前三道练习顺序完整保留', () => {
  assert.ok(oldLesson, 'baseline g5-9 lesson');
  assert.ok(lesson?.deepUnit, 'triangle deepUnit');
  for (const field of ['key', 'title', 'grade', 'n', 'group', 'href', 'link', 'source', 'example', 'practice', 'answers', 'hint', 'explanation']) {
    assert.deepEqual(plain(lesson[field]), plain(oldLesson[field]), field);
  }
  for (const old of before.AOSHU_TEXTBOOK_LESSONS) {
    const current = after.AOSHU_TEXTBOOK_LESSONS.find(item => item.key === old.key);
    assert.ok(current, old.key);
    if (old.key === 'g5-9') continue;
    assert.deepEqual(plain(current), plain(old), old.key);
  }
  assert.equal(unit.example.question, oldDeepUnit.example.question);
  for (let i = 0; i < 3; i++) {
    assert.equal(unit.practices[i].question, oldDeepUnit.practices[i].question);
    assert.deepEqual(plain(unit.practices[i].answers), plain(oldDeepUnit.practices[i].answers));
  }
  assert.equal(after.AOSHU_TEXTBOOK_LESSONS.length, before.AOSHU_TEXTBOOK_LESSONS.length);
});

test('整页脚本中 units 先于 widget，widget 挂在最终数据之后', () => {
  const ui = scripts.indexOf(unitFile);
  const wi = scripts.indexOf(widgetFile);
  assert.ok(ui >= 0 && wi > ui);
  assert.ok(wi > scripts.indexOf('elementary-roadmap-data.js'));
});

test('三边逐对独立枚举验证九个整数候选及新增练习答案', () => {
  const candidates = Array.from({ length: 13 }, (_, i) => i + 1).filter(x => validTriangle([5, 7, x]));
  assert.deepEqual(candidates, [3, 4, 5, 6, 7, 8, 9, 10, 11]);
  assert.equal(candidates.length, 9);
  assert.equal(validTriangle([2, 3, 6]), false);
  assert.equal(validTriangle([5, 7, 2.5]), true);
  assert.deepEqual(plain(unit.practices.slice(3).map(p => p.answers[0])), ['20', '7', '不能', '能']);
  assert.match(unit.practices[3].explanation, /5<x<21/);
  assert.match(unit.practices[4].explanation, /0<x<8/);
  assert.match(unit.practices[5].explanation, /2\+3=5/);
  assert.match(unit.practices[5].explanation, /小于6/);
  assert.match(unit.practices[6].explanation, /2\.5\+5=7\.5>7/);
  assert.match(JSON.stringify(unit), /严格|边界|最长|小数/);
});

test('widget 绘图坐标始终有限，且 5、7 边长按统一比例准确', () => {
  const api = after.AOSHU_FOUNDATION_WIDGETS;
  for (const value of [3, 4, 5, 6, 7, 8, 9, 10, 11, 2.5]) {
    const r = root(String(value));
    api.update(r);
    assert.doesNotMatch(r.nodes.drawing.innerHTML, /NaN|Infinity/);
    assert.match(r.nodes.drawing.innerHTML, /<svg/);
  }
  for (const x of [5, 7]) {
    const r = root(String(x)); api.update(r);
    const d = r.nodes.drawing.innerHTML.match(/<path d="M ([\d.-]+) ([\d.-]+) L ([\d.-]+) ([\d.-]+) L ([\d.-]+) ([\d.-]+) Z"/);
    assert.ok(d, `triangle path for ${x}`);
    const [ax, ay, bx, by, cx, cy] = d.slice(1).map(Number);
    const distance = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]) / 18;
    assert.ok(Math.abs(distance([ax, ay], [bx, by]) - x) < 1e-9, `AB=${x}`);
    assert.ok(Math.abs(distance([ax, ay], [cx, cy]) - 5) < 1e-9, `AC=5 for x=${x}`);
    assert.ok(Math.abs(distance([bx, by], [cx, cy]) - 7) < 1e-9, `BC=7 for x=${x}`);
  }
});

test('有效小数、边界、空白负数和超范围均反馈并清理旧图', () => {
  const api = after.AOSHU_FOUNDATION_WIDGETS;
  for (const value of ['2.5', '0.1', '11.9']) {
    const r = root(value); api.update(r);
    assert.ok(r.nodes.drawing.innerHTML); assert.match(r.nodes.result.textContent, /能围成三角形/);
  }
  for (const value of ['', '  ', '-1', '14.1', 'NaN', 'Infinity']) {
    const r = root('7'); api.update(r); assert.ok(r.nodes.drawing.innerHTML);
    r.nodes.input.value = value; api.update(r);
    assert.equal(r.nodes.drawing.innerHTML, '', value);
    assert.match(r.nodes.result.textContent, /请输入|不能围成三角形/);
    assert.doesNotMatch(r.nodes.drawing.innerHTML, /NaN|Infinity/);
  }
  for (const value of ['0', '2', '12']) {
    const r = root(value); api.update(r);
    assert.ok(r.nodes.drawing.innerHTML);
    assert.match(r.nodes.result.textContent, /不能围成三角形|边界/);
  }
});

test('wrapper 保留基础 widget 的 supports、markup、update 行为', () => {
  const api = after.AOSHU_FOUNDATION_WIDGETS;
  assert.ok(api.supports('triangle-boundary'));
  assert.ok(api.supports('clock-face'));
  assert.match(api.markup({ type: 'clock-face' }), /book-model-lab/);
  assert.match(api.markup(unit.model), /aria-live="polite"/);
  const delegated = { window: { AOSHU_FOUNDATION_WIDGETS: {
    supports: type => type === 'legacy', markup: () => '<legacy>', update: () => 'delegated'
  } } };
  const isolated = vm.createContext(delegated);
  vm.runInContext(fs.readFileSync(path.join(dir, widgetFile), 'utf8'), isolated);
  assert.equal(isolated.window.AOSHU_FOUNDATION_WIDGETS.markup({ type: 'legacy' }), '<legacy>');
  assert.equal(isolated.window.AOSHU_FOUNDATION_WIDGETS.update({ dataset: { bookModel: 'legacy' } }), 'delegated');
  assert.ok(isolated.window.AOSHU_FOUNDATION_WIDGETS.supports('legacy'));
});
