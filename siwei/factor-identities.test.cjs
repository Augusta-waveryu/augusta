const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {JSDOM} = require('jsdom');
const read = f => fs.readFileSync(path.join(__dirname, f), 'utf8');
const html = read('branch-course.html');
const scripts = [...html.matchAll(/<script src="\/siwei\/([^"]+)"/g)].map(m => m[1]);
const plain = x => JSON.parse(JSON.stringify(x));
function page(saved, include = true, branch = 'number') {
  const dom = new JSDOM(html, {runScripts:'outside-only', pretendToBeVisual:true, url:`http://localhost/siwei/branch-course.html?branch=${branch}#bc-topic-factor-identities`});
  dom.window.HTMLElement.prototype.scrollIntoView = function () {};
  if (saved) dom.window.localStorage.setItem('siwei-curriculum-mastery-v1', JSON.stringify(saved));
  for (const f of scripts) if (include || f !== 'factor-identities-enrichment.js') dom.window.eval(read(f));
  return dom;
}
test('new guide preserves all original questions, indices, routes and other guides', () => {
  const a = page(null,false), b = page();
  assert.deepEqual(plain(a.window.AOSHU_CURRICULUM),plain(b.window.AOSHU_CURRICULUM));
  const after = plain(b.window.AOSHU_DEEP_LESSONS); delete after['factor-identities'];
  assert.deepEqual(after,plain(a.window.AOSHU_DEEP_LESSONS));
  assert.equal(scripts.indexOf('factor-identities-enrichment.js') < scripts.indexOf('branch-course.js'),true);
  for (const branch of ['arithmetic','geometry','sequences','counting','logic','algebra','applications']) {
    const x=page(null,false,branch),y=page(null,true,branch);
    assert.deepEqual(plain(x.window.AOSHU_DEEP_LESSONS),plain(y.window.AOSHU_DEEP_LESSONS));
    x.window.close();y.window.close();
  }
  a.window.close();b.window.close();
});
test('identities, original numeric answers and complete positive factor pairs are independently checked', () => {
  for (let a=-20;a<=20;a++) for (let b=-20;b<=20;b++) {
    assert.ok(a*a-b*b === (a-b)*(a+b));
    assert.equal((a+b)**2,a*a+2*a*b+b*b);
    assert.equal((a-b)**2,a*a-2*a*b+b*b);
    assert.equal(9*a*a-25,(3*a-5)*(3*a+5));
  }
  assert.equal(51**2-49**2,200);assert.equal(16**2-14**2,60);assert.equal(101**2-99**2,400);
  assert.equal(7**2-3**2,40);assert.equal((7-3)**2,16);assert.equal(51**2,2601);
  const pairs=[];for(let a=1;a*a<=20;a++)if(20%a===0)pairs.push([a,20/a]);
  assert.deepEqual(pairs,[[1,20],[2,10],[4,5]]);
  assert.deepEqual(pairs.filter(([a,b])=>b-a===1).map(([a])=>a-2),[2]);
  const dom=page(),t=dom.window.document.querySelector('#bc-topic-factor-identities');
  assert.match(t.textContent,/中间项不能漏/);assert.match(t.textContent,/本站原创补充/);assert.match(t.textContent,/版本、页码与逐讲对应仍待核/);
  const a=t.querySelector('.bc-lesson-tools a'),u=new URL(a.href);
  assert.equal(u.pathname,'/siwei/number-theory.html');assert.equal(u.hash,'#nt-identities');
  assert.equal(a.hasAttribute('data-open-lab'),false);assert.ok(read('number-theory.html').includes('id="nt-identities"'));
  dom.window.close();
});
test('blank, incorrect, explanations, three correct answers and partial/full refresh preserve test progress', async () => {
  const seed={unrelated:{passed:[2],done:false}},dom=page(seed),w=dom.window,d=w.document;
  await new Promise(r=>w.requestAnimationFrame(r));
  const t=d.getElementById('bc-topic-factor-identities'),inputs=[...t.querySelectorAll('.bc-question input')],buttons=[...t.querySelectorAll('[data-bc-check]')],feedback=[...t.querySelectorAll('.bc-answer-feedback')];
  assert.equal(t.open,true);assert.equal(inputs.length,3);
  buttons[0].click();assert.ok(feedback[0].textContent.trim());assert.equal(feedback[0].classList.contains('good'),false);
  inputs[0].value='4';buttons[0].click();assert.ok(feedback[0].textContent.trim());assert.equal(feedback[0].classList.contains('good'),false);
  for(const el of t.querySelectorAll('.bc-solution')) {el.open=true;assert.match(el.textContent,/讲解/);}
  inputs[0].value='60';buttons[0].click();
  const partial=JSON.parse(w.localStorage.getItem('siwei-curriculum-mastery-v1'));
  const restored=page(partial);assert.match(restored.window.document.querySelector('#bc-topic-factor-identities summary').textContent,/1\/3/);restored.window.close();
  ['60','400','2'].forEach((answer,i)=>{inputs[i].value=answer;buttons[i].click();assert.equal(feedback[i].classList.contains('good'),true);});
  const saved=JSON.parse(w.localStorage.getItem('siwei-curriculum-mastery-v1'));
  assert.deepEqual(saved.unrelated,seed.unrelated);assert.equal(saved['factor-identities'].done,true);assert.deepEqual(saved['factor-identities'].passed,[0,1,2]);
  const refresh=page(saved);assert.match(refresh.window.document.querySelector('#bc-topic-factor-identities summary').textContent,/已掌握/);
  assert.deepEqual(JSON.parse(refresh.window.localStorage.getItem('siwei-curriculum-mastery-v1')),saved);
  dom.window.close();refresh.window.close();
});
