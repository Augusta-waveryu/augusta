const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {JSDOM} = require('jsdom');
const html = fs.readFileSync(path.join(__dirname, 'branch-course.html'), 'utf8');
const scripts = [...html.matchAll(/<script src="\/siwei\/([^"]+)"/g)].map(m => m[1]);
const target = 'squares-enrichment.js';
const read = f => fs.readFileSync(path.join(__dirname, f), 'utf8');
const plain = v => JSON.parse(JSON.stringify(v));
function data(include, branch = 'number') {
  const c = {window: {}, document: {getElementById: () => null}, URLSearchParams, location: {search: '?branch=' + branch}};
  vm.createContext(c);
  for (const f of scripts) {
    if (['branch-course.js', 'geometry-visuals.js'].includes(f) || (!include && f === target)) continue;
    vm.runInContext(read(f), c, {filename: f});
  }
  return c.window;
}
function page(saved) {
  const dom = new JSDOM(html, {runScripts: 'outside-only', url: 'http://localhost/siwei/branch-course.html?branch=number#bc-topic-squares', pretendToBeVisual: true});
  dom.window.HTMLElement.prototype.scrollIntoView = function () {};
  if (saved) dom.window.localStorage.setItem('siwei-curriculum-mastery-v1', JSON.stringify(saved));
  for (const f of scripts) dom.window.eval(read(f));
  return dom;
}
test('only squares guide is added; all curriculum fields, questions, answer indices and routes remain exact', () => {
  const before = data(false), after = data(true);
  assert.deepEqual(plain(after.AOSHU_CURRICULUM), plain(before.AOSHU_CURRICULUM));
  assert.equal(before.AOSHU_DEEP_LESSONS.squares, undefined);
  const other = plain(after.AOSHU_DEEP_LESSONS); delete other.squares;
  assert.deepEqual(other, plain(before.AOSHU_DEEP_LESSONS));
  for (const branch of ['arithmetic','sequences','geometry','logic','applications','counting','algebra']) assert.deepEqual(plain(data(true, branch)), plain(data(false, branch)));
  assert.ok(scripts.indexOf(target) < scripts.indexOf('branch-course.js'));
});
test('all residue rows are exhaustive, and minimum multipliers and retained answers are independently calculated', () => {
  const guide = data(true).AOSHU_DEEP_LESSONS.squares;
  for (const row of guide.table.rows) {
    const m = Number(row[0]);
    const residues = Array.from({length: m}, (_, r) => r * r % m);
    assert.deepEqual(row[1].split('、').map(Number), residues);
    assert.deepEqual(row[2].split('、').map(Number), [...new Set(residues)].sort((a,b) => a-b));
    for (let n = -200; n <= 200; n++) assert.ok(residues.includes(n*n % m));
  }
  const min = n => {for (let k=1; k<=n; k++) if (Number.isInteger(Math.sqrt(n*k))) return k;};
  assert.equal(min(12),3); assert.equal(min(18),2); assert.equal(min(36),1);
  assert.equal(17*17,289); assert.ok(4*4<17 && 17<5*5);
  const lesson = data(true).AOSHU_CURRICULUM.find(b=>b.id==='number').lessons.find(l=>l.id==='squares');
  assert.deepEqual(plain(lesson.practice.map(q=>q.a)), [['289'],['2'],['0']]);
  for (const text of ['0=0²','1=1²','不是外部教材原文','未排除','k≥3']) assert.ok(JSON.stringify(guide).includes(text));
});
test('real renderer: blank/wrong/right for all three; refresh, legacy partial progress and in-page links', async () => {
  const seed = {unrelated: {passed:[2],done:true}};
  const dom=page(seed), w=dom.window, d=w.document;
  await new Promise(r=>w.requestAnimationFrame(r));
  const topic=d.getElementById('bc-topic-squares');
  assert.equal(topic.open,true);
  assert.equal(topic.querySelectorAll('.bc-subtopic').length,4);
  assert.equal(topic.querySelectorAll('table tbody tr').length,3);
  const inputs=[...topic.querySelectorAll('input')], buttons=[...topic.querySelectorAll('[data-bc-check]')];
  assert.deepEqual(inputs.map(x=>x.id),[0,1,2].map(i=>`bc-ans-squares-${i}`));
  for(let i=0;i<3;i++) {
    const feedback=buttons[i].closest('.bc-question').querySelector('.bc-answer-feedback');
    for(const [answer,expected] of [['',/先写一个答案/],['999',/还差一点/],[['289','2','0'][i],/答对了/]]) {
      inputs[i].value=answer; buttons[i].click(); assert.match(feedback.textContent,expected);
    }
  }
  const saved=JSON.parse(w.localStorage.getItem('siwei-curriculum-mastery-v1'));
  assert.deepEqual(saved.squares,{passed:[0,1,2],done:true}); assert.deepEqual(saved.unrelated,seed.unrelated);
  const refresh=page(saved), rd=refresh.window.document;
  assert.match(rd.querySelector('#bc-topic-squares summary').textContent,/已掌握/);
  assert.equal(rd.querySelectorAll('#bc-topic-squares .bc-answer-feedback.good').length,3);
  assert.deepEqual(JSON.parse(refresh.window.localStorage.getItem('siwei-curriculum-mastery-v1')),saved);
  const partialData={squares:{passed:[1],done:false},...seed}, partial=page(partialData);
  assert.match(partial.window.document.querySelector('#bc-topic-squares summary').textContent,/1\/3/);
  assert.deepEqual(JSON.parse(partial.window.localStorage.getItem('siwei-curriculum-mastery-v1')),partialData);
  for(const a of topic.querySelectorAll('a[href^="#"]')) {assert.ok(d.getElementById(a.hash.slice(1)),a.hash);a.click();}
  for(const a of d.querySelectorAll('a[href="#bc-topic-squares"]')) {a.click();assert.equal(topic.open,true);}
  for(const instance of [dom,refresh,partial]) instance.window.close();
});

test('squares opens the existing square-residue section, not the unrelated ratio lab', () => {
  const dom=page(),d=dom.window.document;
  const link=d.querySelector('#bc-topic-squares .bc-lesson-tools a');
  assert.equal(link.textContent,'阅读平方余数专题与自测 →');
  assert.equal(link.hasAttribute('data-open-lab'),false);
  const u=new URL(link.href), targetHtml=read('number-theory.html');
  assert.equal(u.pathname,'/siwei/number-theory.html');
  assert.ok(targetHtml.includes(`id="${decodeURIComponent(u.hash.slice(1))}"`));
  assert.match(d.querySelector('#bc-topic-divisibility .bc-lesson-tools a').outerHTML,/data-open-lab="divisibility"/);
  dom.window.close();
});
