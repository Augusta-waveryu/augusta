const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const target = 'second-differences-enrichment.js';
const html = fs.readFileSync(path.join(__dirname, 'branch-course.html'), 'utf8');
const scripts = [...html.matchAll(/<script src="\/siwei\/([^"]+)"/g)].map(m => m[1]);
const plain = value => JSON.parse(JSON.stringify(value));
function data(include, branch = 'sequences') {
  const c = {window: {}, document: {getElementById: () => null}, URLSearchParams, location: {search: '?branch=' + branch}};
  vm.createContext(c);
  for (const f of scripts) {
    if (['branch-course.js', 'geometry-visuals.js'].includes(f) || (!include && f === target)) continue;
    vm.runInContext(fs.readFileSync(path.join(__dirname, f), 'utf8'), c, {filename: f});
  }
  return c.window;
}
test('only this deep guide is added; original questions, indices, routes and all curriculum data stay exact', () => {
  const before = data(false), after = data(true);
  assert.deepEqual(plain(after.AOSHU_CURRICULUM), plain(before.AOSHU_CURRICULUM));
  assert.equal(before.AOSHU_DEEP_LESSONS['second-differences'], undefined);
  const other = plain(after.AOSHU_DEEP_LESSONS); delete other['second-differences'];
  assert.deepEqual(other, plain(before.AOSHU_DEEP_LESSONS));
  for (const branch of ['arithmetic', 'number', 'geometry', 'logic', 'applications', 'counting', 'algebra']) {
    assert.deepEqual(plain(data(true, branch)), plain(data(false, branch)));
  }
  assert.ok(scripts.indexOf(target) < scripts.indexOf('branch-course.js'));
  assert.ok(!fs.readFileSync(path.join(__dirname, 'textbook.html'), 'utf8').includes(target));
});
test('example and all retained practice answers follow their stated second differences', () => {
  const cases = [
    {terms: [2, 5, 10, 17], second: 2, next: 26},
    {terms: [1, 4, 9, 16], second: 2, next: 25},
    {terms: [1, 3, 6, 10], second: 1, next: 15},
    {terms: [2, 6, 12, 20], second: 2, next: 30}
  ];
  for (const c of cases) {
    const first = c.terms.slice(1).map((n, i) => n - c.terms[i]);
    const second = first.slice(1).map((n, i) => n - first[i]);
    assert.ok(second.every(n => n === c.second));
    const nextDiff = first.at(-1) + c.second;
    assert.equal(c.terms.at(-1) + nextDiff, c.next);
    assert.equal((c.next - c.terms.at(-1)) - first.at(-1), c.second);
  }
  const lesson = data(true).AOSHU_CURRICULUM.find(b => b.id === 'sequences').lessons.find(l => l.id === 'second-differences');
  assert.deepEqual(plain(lesson.practice.map(q => q.a)), [['25'], ['15'], ['30']]);
});
test('table records the correct layers and guide explains reverse filling and non-uniqueness', () => {
  const guide = data(true).AOSHU_DEEP_LESSONS['second-differences'];
  assert.equal(guide.table.headers.length, 6);
  assert.ok(guide.table.rows.every(row => row.length === guide.table.headers.length));
  assert.deepEqual(plain(guide.table.rows[0].slice(1, 5)), ['2', '5', '10', '17']);
  assert.deepEqual(plain(guide.table.rows[1].slice(2, 5)), ['3', '5', '7']);
  assert.deepEqual(plain(guide.table.rows[2].slice(3, 5)), ['2', '2']);
  const text = JSON.stringify(guide);
  for (const needed of ['7+2=9', '17+9=26', '26−17=9', '9−7=2', '不是唯一可能', '不是 17+2=19']) assert.ok(text.includes(needed), needed);
  assert.equal(guide.steps.length, 4);
  assert.equal(guide.subtopics.length, 3);
});

const {JSDOM} = require('jsdom');
function page(saved) {
  const dom = new JSDOM(html, {runScripts: 'outside-only', url: 'http://localhost/siwei/branch-course.html?branch=sequences#bc-topic-second-differences', pretendToBeVisual: true});
  dom.window.HTMLElement.prototype.scrollIntoView = function () {};
  if (saved) dom.window.localStorage.setItem('siwei-curriculum-mastery-v1', JSON.stringify(saved));
  for (const f of scripts) dom.window.eval(fs.readFileSync(path.join(__dirname, f), 'utf8'));
  return dom;
}
test('real renderer: every question blank/wrong/right, refresh, legacy data, exact IDs and in-page routes', async () => {
  const seeded = {unrelated: {passed: [2], done: true}};
  const dom = page(seeded), w = dom.window, d = w.document;
  await new Promise(resolve => w.requestAnimationFrame(resolve));
  const topic = d.getElementById('bc-topic-second-differences');
  assert.equal(topic.open, true);
  const inputs = [...topic.querySelectorAll('input')], buttons = [...topic.querySelectorAll('[data-bc-check]')];
  assert.deepEqual(inputs.map(x => x.id), [0, 1, 2].map(i => `bc-ans-second-differences-${i}`));
  assert.match(topic.querySelector('table').textContent, /17\s*\+\s*9\s*=\s*26/);
  assert.equal(topic.querySelectorAll('table tbody tr').length, 3);
  for (let i = 0; i < 3; i++) {
    const feedback = buttons[i].closest('.bc-question').querySelector('.bc-answer-feedback');
    for (const [answer, text] of [['', /先写一个答案/], ['999', /还差一点/], [['25', '15', '30'][i], /答对了/]]) {
      inputs[i].value = answer; buttons[i].click(); assert.match(feedback.textContent, text);
    }
  }
  const saved = JSON.parse(w.localStorage.getItem('siwei-curriculum-mastery-v1'));
  assert.deepEqual(saved['second-differences'], {passed: [0, 1, 2], done: true});
  assert.deepEqual(saved.unrelated, seeded.unrelated);
  const refresh = page(saved), rd = refresh.window.document;
  assert.equal(rd.querySelectorAll('#bc-topic-second-differences .bc-answer-feedback.good').length, 3);
  assert.match(rd.querySelector('#bc-topic-second-differences summary').textContent, /已掌握/);
  assert.deepEqual(JSON.parse(refresh.window.localStorage.getItem('siwei-curriculum-mastery-v1')), saved);
  const partialData = {'second-differences': {passed: [1], done: false}, ...seeded};
  const partial = page(partialData);
  assert.match(partial.window.document.querySelector('#bc-topic-second-differences summary').textContent, /1\/3/);
  assert.deepEqual(JSON.parse(partial.window.localStorage.getItem('siwei-curriculum-mastery-v1')), partialData);
  for (const a of topic.querySelectorAll('a[href^="#"]')) assert.ok(d.getElementById(a.hash.slice(1)), a.hash);
  for (const a of d.querySelectorAll('a[href="#bc-topic-second-differences"]')) {a.click(); assert.equal(topic.open, true);}
  for (const instance of [dom, refresh, partial]) instance.window.close();
});

test('only the difference lesson selects the existing second-difference lab, with correct results at every target', () => {
  const branchPage = page(), bd = branchPage.window.document;
  const cta = bd.querySelector('#bc-topic-second-differences .bc-lesson-tools a');
  assert.equal(cta.getAttribute('href'), '/siwei/sequences.html?pattern=secondDifference#sequence-lab');
  assert.equal(cta.hasAttribute('data-open-lab'), false);
  assert.equal(bd.querySelector('#bc-topic-recursive-patterns .bc-lesson-tools a').getAttribute('href'), '/siwei/sequences.html?pattern=fibonacci#sequence-lab');
  for (const a of bd.querySelectorAll('[data-open-lab]')) assert.equal(a.hash, '#bc-lab');
  const h = fs.readFileSync(path.join(__dirname, 'sequences.html'), 'utf8');
  for (let reload = 0; reload < 2; reload++) {
    const dom = new JSDOM(h, {runScripts: 'outside-only', url: 'http://localhost' + cta.getAttribute('href')});
    const w = dom.window, d = w.document;
    w.eval(fs.readFileSync(path.join(__dirname, 'sequences.js'), 'utf8'));
    assert.equal(d.getElementById('pattern-choice').value, 'secondDifference');
    assert.equal(d.getElementById('lab-reason').hidden, false);
    for (let n = 4; n <= 12; n++) {
      const range = d.getElementById('target-term'); range.value = n; range.dispatchEvent(new w.Event('input'));
      assert.deepEqual([...d.querySelectorAll('#term-strip span')].map(x => Number(x.textContent)), Array.from({length: n}, (_, i) => (i + 1) ** 2 + 1));
      assert.equal(d.querySelector('#term-strip .target').getAttribute('aria-label'), `第 ${n} 项 ${n * n + 1}`);
    }
    dom.window.close();
  }
  branchPage.window.close();
});
