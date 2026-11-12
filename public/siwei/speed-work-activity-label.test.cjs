const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {JSDOM} = require('jsdom');
const html = fs.readFileSync(path.join(__dirname, 'branch-course.html'), 'utf8');
const scripts = [...html.matchAll(/<script src="\/siwei\/([^"]+)"/g)].map(m => m[1]);
function page(saved) {
  const dom = new JSDOM(html, {runScripts: 'outside-only', url: 'http://localhost/siwei/branch-course.html?branch=arithmetic#bc-topic-speed-work', pretendToBeVisual: true});
  dom.window.HTMLElement.prototype.scrollIntoView = function () {};
  if (saved) dom.window.localStorage.setItem('siwei-curriculum-mastery-v1', JSON.stringify(saved));
  for (const f of scripts) dom.window.eval(fs.readFileSync(path.join(__dirname, f), 'utf8'));
  return dom;
}
test('speed-work explicitly names the shared ratio activity without changing its target or other CTAs', () => {
  const dom = page(), d = dom.window.document;
  const cta = d.querySelector('#bc-topic-speed-work .bc-lesson-tools a');
  assert.equal(cta.textContent, '选做：本分支共用的按比分配实验（非行程模拟） →');
  assert.equal(cta.getAttribute('href'), '#bc-lab');
  assert.equal(cta.dataset.openLab, 'speed-work');
  for (const a of d.querySelectorAll('[data-open-lab]:not([data-open-lab="speed-work"])')) {
    assert.equal(a.textContent, '去互动实验台试一试 →');
  }
  cta.click();
  assert.ok(d.querySelector('#bc-lab #bc-ratio-total'));
  const total = d.getElementById('bc-ratio-total');
  total.value = '60'; total.dispatchEvent(new dom.window.Event('input', {bubbles:true}));
  assert.match(d.getElementById('bc-ratio-explain').textContent, /60/);
  assert.match(d.getElementById('bc-ratio-result').textContent, /24/);
  assert.match(d.getElementById('bc-ratio-result').textContent, /36/);
  dom.window.close();
});
test('all current five answer flows, explanations, partial and completed progress survive refresh', async () => {
  const seed = {unrelated: {passed:[2], done:true}};
  const dom = page(seed), w = dom.window, d = w.document;
  await new Promise(resolve => w.requestAnimationFrame(resolve));
  const topic = d.getElementById('bc-topic-speed-work');
  assert.equal(topic.open, true);
  const inputs = [...topic.querySelectorAll('.bc-question input')];
  const buttons = [...topic.querySelectorAll('[data-bc-check]')];
  assert.equal(inputs.length, 5);
  assert.equal(topic.querySelectorAll('.bc-question .bc-solution').length, 5);
  const expected = [36/(4+5), 6, 120/2, 12/(8-5), 1/(1/6+1/3)];
  for (let i=0; i<inputs.length; i++) {
    const feedback = buttons[i].closest('.bc-question').querySelector('.bc-answer-feedback');
    for (const [answer, message] of [['', /先写一个答案/], ['999', /还差一点/], [String(expected[i]), /答对了/]]) {
      inputs[i].value = answer; buttons[i].click(); assert.match(feedback.textContent, message);
    }
    assert.match(topic.querySelector('.bc-practice-count').textContent, new RegExp(`${i+1}/5`));
    if (i===0) {
      const partial = page(JSON.parse(w.localStorage.getItem('siwei-curriculum-mastery-v1')));
      assert.match(partial.window.document.querySelector('#bc-topic-speed-work summary').textContent, /1\/5/);
      partial.window.close();
    }
  }
  const saved = JSON.parse(w.localStorage.getItem('siwei-curriculum-mastery-v1'));
  assert.deepEqual(saved['speed-work'], {passed:[0,1,2,3,4], done:true});
  assert.deepEqual(saved.unrelated, seed.unrelated);
  const refresh = page(saved), rd = refresh.window.document;
  assert.equal(rd.querySelectorAll('#bc-topic-speed-work .bc-answer-feedback.good').length, 5);
  assert.match(rd.querySelector('#bc-topic-speed-work summary').textContent, /已掌握/);
  assert.deepEqual(JSON.parse(refresh.window.localStorage.getItem('siwei-curriculum-mastery-v1')), saved);
  for (const a of topic.querySelectorAll('a[href^="#"]')) assert.ok(d.getElementById(a.hash.slice(1)));
  dom.window.close(); refresh.window.close();
});
