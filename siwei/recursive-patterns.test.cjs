const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const html = fs.readFileSync(path.join(__dirname, 'branch-course.html'), 'utf8');
const target = 'recursive-patterns-enrichment.js';
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
test('only recursive deep explanation changes; original questions, answers, routes and sources remain exact', () => {
  const before = data(false), after = data(true);
  assert.deepEqual(plain(after.AOSHU_CURRICULUM), plain(before.AOSHU_CURRICULUM));
  assert.equal(before.AOSHU_DEEP_LESSONS['recursive-patterns'], undefined);
  const other = plain(after.AOSHU_DEEP_LESSONS); delete other['recursive-patterns'];
  assert.deepEqual(other, plain(before.AOSHU_DEEP_LESSONS));
  for (const branch of ['arithmetic', 'number', 'geometry', 'logic', 'applications', 'counting']) {
    assert.deepEqual(plain(data(true, branch)), plain(data(false, branch)));
  }
  assert.ok(scripts.indexOf(target) < scripts.indexOf('branch-course.js'));
  assert.ok(!fs.readFileSync(path.join(__dirname, 'textbook.html'), 'utf8').includes(target));
});
test('independent recurrence, indexed table, operator order and growth-count arithmetic', () => {
  const seq = [1, 1]; while (seq.length < 8) seq.push(seq.at(-2) + seq.at(-1));
  assert.deepEqual(seq, [1, 1, 2, 3, 5, 8, 13, 21]);
  const multiplyAdd = [2]; while (multiplyAdd.length < 5) multiplyAdd.push(multiplyAdd.at(-1) * 2 + 1);
  assert.deepEqual(multiplyAdd, [2, 5, 11, 23, 47]);
  const dots = Array.from({length: 5}, (_, i) => 4 + i * 3);
  assert.deepEqual(dots, [4, 7, 10, 13, 16]);
  const lesson = data(true).AOSHU_CURRICULUM.find(b => b.id === 'sequences').lessons.find(l => l.id === 'recursive-patterns');
  assert.deepEqual(plain(lesson.practice.map(q => q.a)), [['47'], ['21'], ['16']]);
  const deep = data(true).AOSHU_DEEP_LESSONS['recursive-patterns'];
  assert.match(deep.idea, /原创/); assert.match(deep.chooseWhen, /不能认定延伸规则唯一/);
  assert.match(deep.pitfall, /n−1/); assert.equal(deep.table.rows.length, 5);
  deep.table.rows.forEach((row, i) => {
    assert.equal(row.length, deep.table.headers.length);
    assert.equal(row[0], `第 ${i + 3} 项`);
    assert.equal(row[2], `${seq[i]}+${seq[i + 1]}=${seq[i + 2]}`);
  });
});
// Required for integration run: NODE_PATH=/tmp/average-qa/node_modules node --test this-file.
const {JSDOM} = require('jsdom');
function page(saved, review) {
  const dom = new JSDOM(html, {runScripts: 'outside-only', url: 'http://localhost/siwei/branch-course.html?branch=sequences#bc-topic-recursive-patterns', pretendToBeVisual: true});
  dom.window.HTMLElement.prototype.scrollIntoView = function () {};
  if (saved) dom.window.localStorage.setItem('siwei-curriculum-mastery-v1', JSON.stringify(saved));
  if (review) dom.window.localStorage.setItem('siwei-branch-review-sequences-v1', JSON.stringify(review));
  for (const f of scripts) dom.window.eval(fs.readFileSync(path.join(__dirname, f), 'utf8'));
  return dom;
}
test('real renderer: blank/wrong/right, exact IDs, partial/full test progress, refresh and links', () => {
  const dom = page(), w = dom.window, doc = w.document;
  const topic = doc.getElementById('bc-topic-recursive-patterns');
  const inputs = [...topic.querySelectorAll('input')];
  assert.deepEqual(inputs.map(x => x.id), [0, 1, 2].map(i => `bc-ans-recursive-patterns-${i}`));
  assert.match(topic.textContent, /窗口向右移/);
  const cards = [...topic.querySelectorAll('[data-bc-check]')];
  const submit = (i, answer) => {inputs[i].value = answer; cards[i].click(); return cards[i].closest('.bc-question').textContent;};
  for (let i = 0; i < 3; i++) {
    assert.match(submit(i, ''), /先写一个答案/);
    assert.match(submit(i, '999'), /还差一点/);
    assert.match(submit(i, ['47', '21', '16'][i]), /答对了/);
  }
  const saved = JSON.parse(w.localStorage.getItem('siwei-curriculum-mastery-v1'));
  assert.deepEqual(saved['recursive-patterns'], {passed: [0, 1, 2], done: true});
  const refresh = page(saved);
  assert.match(refresh.window.document.querySelector('#bc-topic-recursive-patterns summary').textContent, /已掌握/);
  assert.equal(refresh.window.document.querySelectorAll('#bc-topic-recursive-patterns .bc-answer-feedback.good').length, 3);
  const seeded = {'recursive-patterns': {passed: [1], done: false}, unrelated: {passed: [2], done: true}};
  const partial = page(seeded);
  assert.match(partial.window.document.querySelector('#bc-topic-recursive-patterns summary').textContent, /1\/3/);
  assert.deepEqual(JSON.parse(partial.window.localStorage.getItem('siwei-curriculum-mastery-v1')), seeded);
  const oldFull = page(saved);
  assert.deepEqual(JSON.parse(oldFull.window.localStorage.getItem('siwei-curriculum-mastery-v1')), saved);
  for (const a of topic.querySelectorAll('a[href^="#"]')) assert.ok(doc.getElementById(a.hash.slice(1)), a.hash);
  for (const d of [dom, refresh, partial, oldFull]) d.window.close();
});
