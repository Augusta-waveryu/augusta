const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {JSDOM} = require('jsdom');
const html = fs.readFileSync(path.join(__dirname, 'textbook.html'), 'utf8');
const scripts = [...html.matchAll(/<script src="\/siwei\/([^"?]+)"/g)].map(m => m[1]);
const target = 'elementary-g5-ages-units.js';
const plain = value => JSON.parse(JSON.stringify(value));
function data(includeTarget) {
  const context = {window: {}, document: {getElementById: () => null}};
  vm.createContext(context);
  for (const file of scripts) {
    if (['textbook.js', 'textbook-overview.js'].includes(file) || (!includeTarget && file === target)) continue;
    vm.runInContext(fs.readFileSync(path.join(__dirname, file), 'utf8'), context, {filename: file});
  }
  return context.window.AOSHU_TEXTBOOK_LESSONS;
}
const before = data(false), after = data(true);
const old = before.find(l => l.key === 'g5-8'), lesson = after.find(l => l.key === 'g5-8');
const unit = lesson.deepUnit;
function page(storage) {
  const dom = new JSDOM(html, {url: 'https://example.test/siwei/textbook.html?lesson=g5-8#book-lesson-g5-8', runScripts: 'outside-only', pretendToBeVisual: true});
  dom.window.HTMLElement.prototype.scrollIntoView = function () {};
  if (storage) dom.window.localStorage.setItem('aoshu-elementary-roadmap-v2', JSON.stringify(storage));
  for (const file of scripts) vm.runInContext(fs.readFileSync(path.join(__dirname, file), 'utf8'), dom.getInternalVMContext(), {filename: file});
  return dom;
}
function submit(dom, i, value) {
  const item = dom.window.document.querySelector(`[data-book-practice-item="${i}"]`);
  item.querySelector('[data-book-answer]').value = value;
  item.querySelector('[data-book-check]').click();
  return item.querySelector('[data-book-feedback]');
}
test('only G5-8 deepens: original identity, example, self-test, href and source stay', () => {
  assert.equal(old.deepUnit, null);
  assert.equal(after.length, before.length);
  for (const field of ['grade','n','key','title','source','example','practice','href']) assert.equal(lesson[field], old[field], field);
  assert.equal(lesson.answers[0], old.answers[0]);
  for (const prev of before) if (prev.key !== 'g5-8') assert.deepEqual(plain(after.find(l => l.key === prev.key)), plain(prev), prev.key);
  assert.ok(scripts.indexOf(target) < scripts.indexOf('elementary-roadmap-data.js'));
  assert.match(unit.scope, /原创/);
  assert.match(unit.scope, /待核/);
  assert.match(unit.scope, /不是教材或杯赛原题/);
});
test('independent enumeration validates every numeric answer and future/past boundary', () => {
  const times = (A, B, k) => Array.from({length: 101}, (_, i) => i - 50).filter(t => B+t > 0 && A+t >= 0 && A+t === k*(B+t));
  assert.deepEqual(times(14, 8, 1.5), [4]);
  assert.deepEqual(times(40, 10, 3), [5]);
  assert.deepEqual(times(15, 10, 2), [-5]);
  assert.deepEqual(times(32, 8, 4), [0]);
  assert.deepEqual(times(10, 4, 2), [2]);
  assert.deepEqual(times(11, 5, 2), [1]);
  const expected = [(14+5)+(10+5), (14+5)-(8+5), times(14,8,1.5)[0], times(40,10,3)[0], Number(times(15,10,2).some(t=>t>0)), -times(15,10,2)[0], times(32,8,4)[0], Number(times(10,4,2)[0]===times(11,5,2)[0])].map(String);
  assert.deepEqual(plain(unit.practices.map(p => p.answers[0])), expected);
  for (let t = -7; t <= 40; t++) assert.equal((14+t)-(8+t), 6);
  assert.equal(14/8, 1.75); assert.equal(18/12, 1.5);
  for (const [A,B,t,k] of [[14,8,4,1.5],[40,10,5,3],[15,10,-5,2],[32,8,0,4]]) {
    assert.equal(A+t, k*(B+t)); assert.equal((A+t)-(B+t), A-B);
  }
});
test('teaching chain covers same-time models, valid k, no division by zero and information gap', () => {
  assert.equal(unit.diagrams.length, 3);
  assert.ok(unit.concepts.length >= 6 && unit.review.length >= 5);
  assert.match(unit.methodCard.when, /k>1/);
  assert.match(unit.methodCard.when, /准确年龄/);
  assert.match(unit.methodCard.check, /除以0/);
  assert.match(unit.concepts.map(x=>x.text).join(''), /缺少当前年龄/);
  for (const p of unit.practices) for (const field of ['question','hint','wrongFeedback','correctFeedback','explanation']) assert.ok(p[field]?.length > 8, field);
});
test('focused route renders one open lesson, labelled inputs and valid related topic', () => {
  const dom = page(); const doc = dom.window.document;
  assert.equal(doc.querySelectorAll('#book-lessons .book-lesson').length, 1);
  const card = doc.querySelector('#book-lesson-g5-8'); assert.ok(card.open);
  assert.equal(card.querySelectorAll('[data-book-answer]').length, 8);
  assert.equal(card.querySelectorAll('.book-deep-diagram').length, 3);
  assert.equal(card.querySelectorAll('.book-review li').length, 5);
  const labels = [...card.querySelectorAll('[data-book-answer]')].map(e=>e.getAttribute('aria-label'));
  assert.equal(new Set(labels).size, 8); assert.ok(labels.every(Boolean));
  const related = new URL(card.querySelector('.book-related').href);
  assert.equal(related.searchParams.get('branch'), 'applications'); assert.equal(related.hash, '#bc-topic-ages');
  const branchHtml = fs.readFileSync(path.join(__dirname,'branch-course.html'),'utf8'); assert.ok(branchHtml.includes('/siwei/branch-course.js'));
  assert.ok(fs.existsSync(path.join(__dirname, related.pathname.split('/').pop())));
  dom.window.close();
});
test('wrong answer gives targeted feedback without completion; all eight correct persist on reload', () => {
  const dom = page();
  const wrong = ['29','11','12','20','1','10','1','1'];
  for (let i=0; i<8; i++) {
    const feedback = submit(dom,i,wrong[i]);
    assert.equal(feedback.classList.contains('good'), false);
    assert.equal(feedback.textContent, unit.practices[i].wrongFeedback);
  }
  assert.equal(dom.window.document.querySelectorAll('.book-practice-item.is-correct').length, 0);
  for (let i=0; i<8; i++) {
    const feedback = submit(dom,i,unit.practices[i].answers[0]);
    assert.ok(feedback.classList.contains('good'));
    assert.ok(feedback.textContent.includes(unit.practices[i].correctFeedback));
    const saved=JSON.parse(dom.window.localStorage.getItem('aoshu-elementary-roadmap-v2'));
    assert.equal(saved['g5-8'].done, i===7);
  }
  const storage=JSON.parse(dom.window.localStorage.getItem('aoshu-elementary-roadmap-v2'));
  assert.equal(storage['g5-8'].solved.length, 8);
  const restored=page(storage); assert.equal(restored.window.document.querySelectorAll('.book-practice-item.is-correct').length,8);
  dom.window.close(); restored.window.close();
});
test('legacy one-question completion does not count as completion of new eight practices', () => {
  for (const oldProgress of [{done:true},{done:true,solved:[0]}]) {
    const dom=page({'g5-8':oldProgress}); const card=dom.window.document.querySelector('#book-lesson-g5-8');
    assert.equal(card.classList.contains('is-done'),false);
    submit(dom,2,'4');
    const stored=JSON.parse(dom.window.localStorage.getItem('aoshu-elementary-roadmap-v2'))['g5-8'];
    assert.equal(stored.done,false); assert.ok(stored.solved.includes(2));
    dom.window.close();
  }
});
