const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const read = (name) => fs.readFileSync(path.join(__dirname, name), 'utf8');
const html = read('branch-course.html');
const scripts = [...html.matchAll(/<script src="\/siwei\/([^"]+)"/g)].map((m) => m[1]);
const plain = (value) => JSON.parse(JSON.stringify(value));
function page(saved) {
  const dom = new JSDOM(html, { runScripts: 'outside-only', pretendToBeVisual: true,
    url: 'https://local.test/siwei/branch-course.html?branch=geometry#bc-topic-geometric-counting' });
  dom.window.HTMLElement.prototype.scrollIntoView = function () {};
  // This suite checks DOM/SVG and answer state, not Canvas rendering or viewport layout.
  dom.window.HTMLCanvasElement.prototype.getContext = () => null;
  if (saved) dom.window.localStorage.setItem('siwei-curriculum-mastery-v1', JSON.stringify(saved));
  for (const script of scripts) dom.window.eval(read(script));
  return dom;
}
const number = (el, name) => Number(el.getAttribute(name));
function rectangles(rows, columns) {
  let count = 0;
  for (let top = 0; top < rows; top++) for (let bottom = top + 1; bottom <= rows; bottom++)
    for (let left = 0; left < columns; left++) for (let right = left + 1; right <= columns; right++) count++;
  return count;
}
test('drawn grid really has two rows and three square columns; highlighted boundaries align', () => {
  const dom = page();
  try {
    const figure = dom.window.document.querySelector('#bc-figure-geometric-counting');
    const svg = figure.querySelector('svg');
    const [outer, selected] = svg.querySelectorAll('rect');
    const x = number(outer, 'x'), y = number(outer, 'y');
    const width = number(outer, 'width'), height = number(outer, 'height');
    const commands = svg.querySelector('path').getAttribute('d');
    const vertical = [...commands.matchAll(/M([\d.]+) ([\d.]+)v([\d.]+)/g)];
    const horizontal = [...commands.matchAll(/M([\d.]+) ([\d.]+)h([\d.]+)/g)];
    const xs = [x, ...vertical.map((m) => Number(m[1])), x + width];
    const ys = [y, ...horizontal.map((m) => Number(m[2])), y + height];
    assert.equal(xs.length, 4, 'four vertical boundaries, not five');
    assert.equal(ys.length, 3);
    for (const m of vertical) { assert.equal(Number(m[2]), y); assert.equal(Number(m[3]), height); }
    for (const m of horizontal) { assert.equal(Number(m[1]), x); assert.equal(Number(m[3]), width); }
    const spacing = xs[1] - xs[0];
    for (let i = 1; i < xs.length; i++) assert.equal(xs[i] - xs[i - 1], spacing);
    for (let i = 1; i < ys.length; i++) assert.equal(ys[i] - ys[i - 1], spacing);
    assert.ok(xs.includes(number(selected, 'x')));
    assert.ok(xs.includes(number(selected, 'x') + number(selected, 'width')));
    assert.ok(ys.includes(number(selected, 'y')));
    assert.ok(ys.includes(number(selected, 'y') + number(selected, 'height')));
    assert.equal(number(selected, 'width') / spacing, 2);
    assert.equal(number(selected, 'height') / spacing, 1);
    assert.equal(rectangles(ys.length - 1, xs.length - 1), 18);
    assert.match(figure.textContent, /2 行、3 列/);
    assert.match(figure.textContent, /18/);
    assert.match(svg.getAttribute('aria-label'), /网格边界/);
  } finally { dom.window.close(); }
});
test('independent enumeration agrees with example and all three retained answers', () => {
  const dom = page();
  try {
    const lesson = dom.window.AOSHU_CURRICULUM.find((b) => b.id === 'geometry').lessons.find((l) => l.id === 'geometric-counting');
    assert.equal(rectangles(2, 3), 18);
    const candidates = [];
    for (let a = 1; a < 10; a++) for (let b = a; b < 10; b++) if (2 * (a + b) === 20) candidates.push(a * b);
    assert.deepEqual(candidates, [9, 16, 21, 24, 25]);
    assert.deepEqual(plain(lesson.practice.map((q) => q.a)), [[String(rectangles(1, 4))], [String(rectangles(2, 2))], [String(Math.max(...candidates))]]);
    assert.match(lesson.example.solution, /18/);
  } finally { dom.window.close(); }
});
test('real renderer: blank/wrong/right, hints, persisted progress, preserved unrelated test data', async () => {
  const seed = { unrelated: { passed: [2], done: true } };
  const dom = page(seed);
  let refresh;
  try {
    const w = dom.window, d = w.document;
    await new Promise((resolve) => w.requestAnimationFrame(resolve));
    const topic = d.querySelector('#bc-topic-geometric-counting');
    assert.equal(topic.open, true);
    const qs = [...topic.querySelectorAll('.bc-question')];
    assert.equal(qs.length, 3);
    for (const [i, expected] of ['10', '9', '25'].entries()) {
      const input = qs[i].querySelector('input'), button = qs[i].querySelector('button');
      const feedback = qs[i].querySelector('.bc-answer-feedback');
      button.click(); assert.match(feedback.textContent, /先写一个答案/);
      input.value = '-999'; button.click(); assert.match(feedback.textContent, /还差一点。提示/);
      const hint = qs[i].querySelector('details'); hint.open = true;
      assert.ok(hint.textContent.includes('提示'));
      input.value = expected; button.click(); assert.match(feedback.textContent, /答对了/);
    }
    const saved = JSON.parse(w.localStorage.getItem('siwei-curriculum-mastery-v1'));
    assert.deepEqual(saved.unrelated, seed.unrelated);
    assert.deepEqual(saved['geometric-counting'], { passed: [0, 1, 2], done: true });
    refresh = page(saved);
    assert.match(refresh.window.document.querySelector('#bc-topic-geometric-counting summary').textContent, /已掌握/);
    assert.deepEqual(JSON.parse(refresh.window.localStorage.getItem('siwei-curriculum-mastery-v1')), saved);
  } finally { dom.window.close(); refresh?.window.close(); }
});
test('only counting tools link returns to the static matching figure; all local targets exist', () => {
  const dom = page();
  try {
    const d = dom.window.document;
    const topic = d.querySelector('#bc-topic-geometric-counting');
    const link = topic.querySelector('.bc-lesson-tools a');
    assert.equal(link.hash, '#bc-figure-geometric-counting');
    assert.equal(link.textContent, '回看本课选边界示意图（静态） ↑');
    assert.equal(link.hasAttribute('data-open-lab'), false);
    for (const a of topic.querySelectorAll('a[href^="#"]')) assert.ok(d.getElementById(a.hash.slice(1)), a.hash);
    for (const other of d.querySelectorAll('.bc-lesson:not(#bc-topic-geometric-counting) .bc-lesson-tools a:first-child')) {
      assert.equal(other.hash, '#bc-lab');
      assert.equal(other.textContent, '去互动实验台试一试 →');
      assert.equal(other.hasAttribute('data-open-lab'), true);
    }
    assert.match(d.querySelector('#bc-lab-title').textContent, /3D 立体观察台/);
  } finally { dom.window.close(); }
});
