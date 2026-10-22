const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {JSDOM} = require('jsdom');

const root = __dirname;
const html = fs.readFileSync(path.join(root, 'textbook.html'), 'utf8');
const scriptSources = [...html.matchAll(/<script src="\/siwei\/([^"?]+)"/g)].map((match) => match[1]);

function load(url, storage = {}) {
  const dom = new JSDOM(html, {url: `https://example.test${url}`, runScripts: 'outside-only', pretendToBeVisual: true});
  const {window} = dom;
  window.HTMLElement.prototype.scrollIntoView = function () {};
  for (const [key, value] of Object.entries(storage)) window.localStorage.setItem(key, value);
  const context = dom.getInternalVMContext();
  for (const source of scriptSources) {
    vm.runInContext(fs.readFileSync(path.join(root, source), 'utf8'), context, {filename: source});
  }
  return dom;
}

function cards(dom) { return [...dom.window.document.querySelectorAll('#book-lessons .book-lesson')]; }
function keys(dom) { return cards(dom).map((card) => card.dataset.bookId); }
function route(dom) { return new URL(dom.window.location.href); }
function change(dom, element) { element.dispatchEvent(new dom.window.Event('change', {bubbles: true})); }

// The route data is loaded by the same scripts as the real page, not a hand-made fixture.
test('有效单课参数实际只渲染一张 card，未知参数不注入且无参行为保留', () => {
  const focused = load('/siwei/textbook.html?lesson=g5-12#book-lesson-g5-12');
  assert.equal(cards(focused).length, 1);
  assert.equal(cards(focused)[0].dataset.bookId, 'g5-12');
  assert.equal(focused.window.document.querySelector('.book-focus-prompt').textContent.includes('单课模式'), true);

  const unknown = load('/siwei/textbook.html?lesson=%3Cimg%20src=x%20onerror=alert(1)%3E');
  assert.equal(unknown.window.document.querySelectorAll('#book-lessons .book-lesson').length, unknown.window.AOSHU_TEXTBOOK_LESSONS.length);
  assert.equal(unknown.window.document.querySelector('#book-lessons').innerHTML.includes('<img'), false);
  assert.equal(route(unknown).searchParams.has('lesson'), false);

  const plain = load('/siwei/textbook.html');
  assert.equal(cards(plain).length, plain.window.AOSHU_TEXTBOOK_LESSONS.length);
  assert.equal(plain.window.document.querySelector('#book-grade-filter').value, 'all');
});

test('grade 初始化、旧 hash 锁定年级，退出单课同步 grade 并清掉旧 lesson hash', () => {
  const byGrade = load('/siwei/textbook.html?grade=6#not-a-book-hash');
  assert.equal(byGrade.window.document.querySelector('#book-grade-filter').value, '6');
  assert.ok(cards(byGrade).every((card) => card.dataset.grade === '6'));

  const byHash = load('/siwei/textbook.html#book-lesson-g5-12');
  assert.equal(byHash.window.document.querySelector('#book-grade-filter').value, '5');
  assert.ok(cards(byHash).every((card) => card.dataset.grade === '5'));

  const focused = load('/siwei/textbook.html?lesson=g5-12#book-lesson-g5-12');
  const filter = focused.window.document.querySelector('#book-grade-filter');
  filter.value = '6';
  change(focused, filter);
  assert.equal(route(focused).searchParams.get('lesson'), null);
  assert.equal(route(focused).searchParams.get('grade'), '6');
  assert.equal(route(focused).hash, '');
  assert.ok(cards(focused).every((card) => card.dataset.grade === '6'));

  const refreshed = load(route(focused).pathname + route(focused).search + route(focused).hash);
  assert.equal(refreshed.window.document.querySelector('#book-grade-filter').value, '6');
  assert.ok(cards(refreshed).every((card) => card.dataset.grade === '6'));

  filter.value = '4';
  change(focused, filter);
  assert.equal(route(focused).searchParams.get('grade'), '4');
  assert.ok(cards(focused).every((card) => card.dataset.grade === '4'));

  const all = load('/siwei/textbook.html?lesson=g5-12&grade=5#book-lesson-g5-12');
  const allFilter = all.window.document.querySelector('#book-grade-filter');
  allFilter.value = 'all';
  change(all, allFilter);
  assert.equal(route(all).searchParams.has('grade'), false);
  assert.equal(route(all).hash, '');
});

test('跨课 hash 导航即使目标已在 DOM 也同步目标年级，并保留其他 hash', () => {
  const dom = load('/siwei/textbook.html?lesson=g5-12#book-lesson-g5-12');
  // A focused cross-grade navigation exits focus and rebuilds the target grade.
  dom.window.history.replaceState(null, '', '/siwei/textbook.html?lesson=g5-12#book-lesson-g6-1');
  dom.window.dispatchEvent(new dom.window.HashChangeEvent('hashchange'));
  assert.equal(dom.window.document.querySelector('#book-grade-filter').value, '6');
  assert.equal(dom.window.document.querySelector('#book-lesson-g6-1')?.open, true);
  assert.equal(route(dom).searchParams.get('lesson'), null);
  assert.equal(route(dom).searchParams.get('grade'), '6');

  // When the target is already rendered in an all-grades DOM, it still selects its grade.
  const alreadyRendered = load('/siwei/textbook.html');
  const filter = alreadyRendered.window.document.querySelector('#book-grade-filter');
  assert.equal(alreadyRendered.window.document.querySelector('#book-lesson-g6-1') !== null, true);
  alreadyRendered.window.history.replaceState(null, '', '/siwei/textbook.html#book-lesson-g6-1');
  alreadyRendered.window.dispatchEvent(new alreadyRendered.window.HashChangeEvent('hashchange'));
  assert.equal(filter.value, '6');
  assert.equal(alreadyRendered.window.document.querySelector('#book-lesson-g6-1')?.open, true);
  assert.ok(cards(alreadyRendered).every((card) => card.dataset.grade === '6'));

  const keepHash = load('/siwei/textbook.html?lesson=g5-12#book-lesson-g5-12');
  keepHash.window.history.replaceState(null, '', '/siwei/textbook.html?lesson=g5-12#custom-anchor');
  const keepFilter = keepHash.window.document.querySelector('#book-grade-filter');
  keepFilter.value = '6';
  change(keepHash, keepFilter);
  assert.equal(route(keepHash).hash, '#custom-anchor');
});

test('跨课 focus 导航同步 grade；旧 hash 清理不影响普通 hash', () => {
  const dom = load('/siwei/textbook.html?lesson=g5-12#book-lesson-g5-12');
  // Put a different-grade target in the DOM by starting from all lessons, then enter focus.
  const filter = dom.window.document.querySelector('#book-grade-filter');
  filter.value = 'all';
  change(dom, filter);
  dom.window.history.replaceState(null, '', '/siwei/textbook.html?lesson=g5-12#book-lesson-g5-12');
  // hash navigation to a grade-6 card already present must still select grade 6.
  dom.window.history.replaceState(null, '', '/siwei/textbook.html?lesson=g5-12#book-lesson-g6-1');
  dom.window.dispatchEvent(new dom.window.HashChangeEvent('hashchange'));
  assert.equal(dom.window.document.querySelector('#book-grade-filter').value, '6');
  assert.equal(dom.window.document.querySelector('#book-lesson-g6-1')?.open, true);
  assert.equal(route(dom).searchParams.get('lesson'), 'g5-12');
});

test('答题进度使用当前 key，兼容旧版 done，并保留深讲 solved 数组', () => {
  const dom = load('/siwei/textbook.html?lesson=g5-12', {
    'aoshu-elementary-roadmap-v2': JSON.stringify({
      'g5-12': {done: true},
      'g6-1': {done: false, solved: [0]}
    })
  });
  const card = dom.window.document.querySelector('.book-lesson');
  assert.equal(card.dataset.bookId, 'g5-12');
  assert.match(card.textContent, /旧版自测已过|已完成/);
  assert.ok(card.querySelectorAll('[data-book-answer]').length >= 1);

  const input = card.querySelector('[data-book-answer]');
  const answer = JSON.parse(input.dataset.answerOptions)[0];
  input.value = answer;
  card.querySelector('[data-book-check]').click();
  const saved = JSON.parse(dom.window.localStorage.getItem('aoshu-elementary-roadmap-v2'));
  assert.ok(saved['g5-12']);
  assert.equal(saved['g5-12'].legacyDone, true);
  assert.equal(saved['g5-12'].done, false);
  assert.ok(Array.isArray(saved['g5-12'].solved));
  assert.ok(saved['g5-12'].solved.includes(0));

  const previousSix = load('/siwei/textbook.html?lesson=g5-12', {
    'aoshu-elementary-roadmap-v2': JSON.stringify({'g5-12': {done: true, solved: [0,1,2,3,4,5]}})
  });
  const previousCard = cards(previousSix)[0];
  assert.equal(previousCard.classList.contains('is-done'), false);
  assert.match(previousCard.querySelector('.book-count').textContent, /6 \/ 8/);
  assert.equal(previousCard.querySelectorAll('.book-practice-item.is-correct').length, 6);
});
