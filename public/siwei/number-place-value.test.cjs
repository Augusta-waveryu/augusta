const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const html = fs.readFileSync(path.join(__dirname, 'branch-course.html'), 'utf8');
const target = 'number-place-value-enrichment.js';
const scripts = [...html.matchAll(/<script src="\/siwei\/([^"]+)"/g)].map(m => m[1]);
const plain = value => JSON.parse(JSON.stringify(value));
function data(include, branch = 'number') {
  const c = { window: {}, document: { getElementById: () => null }, URLSearchParams, location: { search: '?branch=' + branch } };
  vm.createContext(c);
  for (const f of scripts) {
    if (['branch-course.js', 'geometry-visuals.js'].includes(f) || (!include && f === target)) continue;
    vm.runInContext(fs.readFileSync(path.join(__dirname, f), 'utf8'), c, {filename: f});
  }
  return c.window;
}
test('only digits-bases deep explanation changes; all questions, routes, sources and other lessons stay exact', () => {
  const before = data(false), after = data(true);
  assert.deepEqual(plain(after.AOSHU_CURRICULUM), plain(before.AOSHU_CURRICULUM));
  assert.equal(before.AOSHU_DEEP_LESSONS['digits-bases'], undefined);
  const other = plain(after.AOSHU_DEEP_LESSONS); delete other['digits-bases'];
  assert.deepEqual(other, plain(before.AOSHU_DEEP_LESSONS));
  assert.deepEqual(plain(data(true, 'arithmetic')), plain(data(false, 'arithmetic')));
  assert.ok(scripts.indexOf(target) < scripts.indexOf('branch-course.js'));
  assert.ok(!fs.readFileSync(path.join(__dirname, 'textbook.html'), 'utf8').includes(target));
});
test('independent positional and repeated-division arithmetic, including zeros and legal-digit boundary', () => {
  const expand = (s, b) => [...s].reduce((n, d) => {
    assert.ok(Number(d) >= 0 && Number(d) < b); return n * b + Number(d);
  }, 0);
  const convert = (n, b) => {
    if (!n) return '0';
    const r = []; while (n > 0) { r.push(n % b); n = Math.floor(n / b); }
    return r.reverse().join('');
  };
  assert.equal(expand('1101', 2), 13); assert.equal(expand('111', 2), 7);
  assert.equal(expand('23', 5), 13); assert.equal(expand('11111', 2), 31);
  assert.equal(convert(13, 2), '1101'); assert.equal(convert(31, 2), '11111');
  assert.throws(() => expand('102', 2)); assert.throws(() => expand('25', 5));
  for (let b = 2; b <= 10; b++) for (let n = 0; n <= 1024; n++) assert.equal(expand(convert(n, b), b), n);
  const deep = data(true).AOSHU_DEEP_LESSONS['digits-bases'];
  assert.match(deep.idea, /原创/); assert.match(deep.steps[2].explanation, /余 0/);
  assert.match(deep.subtopics[1].explanation, /位权 2/); assert.match(deep.pitfall, /倒读/);
  assert.equal(deep.table.headers.length, 5); for (const row of deep.table.rows) assert.equal(row.length, 5);
});
// Optional DOM integration: NODE_PATH=<jsdom installation>/node_modules node --test this-file.
let JSDOM; try { ({JSDOM} = require('jsdom')); } catch {}
function page(saved) {
  const dom = new JSDOM(html, {runScripts: 'outside-only', url: 'http://localhost/siwei/branch-course.html?branch=number#bc-topic-digits-bases', pretendToBeVisual: true});
  dom.window.HTMLElement.prototype.scrollIntoView = function () {};
  if (saved) dom.window.localStorage.setItem('siwei-curriculum-mastery-v1', JSON.stringify(saved));
  for (const f of scripts) dom.window.eval(fs.readFileSync(path.join(__dirname, f), 'utf8'));
  return dom;
}
test('real renderer: empty/wrong/right answers, stable question IDs, refresh and old mastery', {skip: !JSDOM}, () => {
  let dom = page(); const w = dom.window, doc = w.document;
  const topic = doc.getElementById('bc-topic-digits-bases');
  const inputs = [...topic.querySelectorAll('input')];
  assert.equal(inputs.length, 3); assert.equal(new Set(inputs.map(x => x.id)).size, 3);
  assert.match(topic.textContent, /余数要倒着读/);
  const cards = [...topic.querySelectorAll('[data-bc-check]')];
  const submit = (i, answer) => { inputs[i].value = answer; cards[i].click(); return cards[i].closest('.bc-question').textContent; };
  assert.match(submit(0, ''), /先写/);
  assert.match(submit(0, '999'), /还差一点/);
  assert.match(submit(0, '20'), /答对/);
  assert.match(submit(1, '13'), /答对/);
  assert.match(submit(2, '11111'), /答对/);
  const saved = JSON.parse(w.localStorage.getItem('siwei-curriculum-mastery-v1'));
  assert.deepEqual(saved['digits-bases'].passed, [0, 1, 2]); assert.equal(saved['digits-bases'].done, true);
  const refreshed = page(saved); assert.match(refreshed.window.document.querySelector('#bc-topic-digits-bases summary').textContent, /已掌握/);
  const partial = page({'digits-bases': {passed: [0], done: false}, unrelated: {passed: [2], done: true}});
  assert.match(partial.window.document.querySelector('#bc-topic-digits-bases summary').textContent, /1\/3/);
  assert.deepEqual(JSON.parse(partial.window.localStorage.getItem('siwei-curriculum-mastery-v1')).unrelated, {passed: [2], done: true});
  for (const a of topic.querySelectorAll('a[href^="#"]')) assert.ok(doc.getElementById(a.hash.slice(1)), a.hash);
  dom.window.close(); refreshed.window.close(); partial.window.close();
});
