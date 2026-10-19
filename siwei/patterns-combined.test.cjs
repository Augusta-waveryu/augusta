const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {JSDOM} = require('jsdom');
const html = fs.readFileSync(path.join(__dirname, 'branch-course.html'), 'utf8');
const files = [...html.matchAll(/<script src="\/siwei\/([^"]+)"/g)].map(m => m[1]);
const target = 'patterns-combined-enrichment.js';
const plain = x => JSON.parse(JSON.stringify(x));
function data(include = true, branch = 'sequences') {
  const c = {window:{}, document:{getElementById:()=>null}, location:{search:'?branch=' + branch}, URLSearchParams};
  vm.createContext(c);
  for (const file of files) {
    if (['branch-course.js', 'geometry-visuals.js'].includes(file) || (!include && file === target)) continue;
    vm.runInContext(fs.readFileSync(path.join(__dirname, file), 'utf8'), c, {filename:file});
  }
  return c.window;
}
function page(saved) {
  const dom = new JSDOM(html, {runScripts:'outside-only', pretendToBeVisual:true, url:'http://localhost/siwei/branch-course.html?branch=sequences#bc-topic-patterns-combined'});
  dom.window.HTMLElement.prototype.scrollIntoView = function() {};
  if (saved) dom.window.localStorage.setItem('siwei-curriculum-mastery-v1', JSON.stringify(saved));
  for (const file of files) dom.window.eval(fs.readFileSync(path.join(__dirname,file),'utf8'));
  return dom;
}
test('only G6-15 branch content changes, first three answer indices remain compatible', () => {
  const before = data(false), after = data();
  for (const branch of before.AOSHU_CURRICULUM) {
    const other = after.AOSHU_CURRICULUM.find(b => b.id === branch.id);
    for (const lesson of branch.lessons) {
      const next = other.lessons.find(l => l.id === lesson.id);
      if (lesson.id !== 'patterns-combined') assert.deepEqual(plain(next),plain(lesson));
      else {
        assert.equal(next.link, lesson.link);
        assert.deepEqual(plain(next.practice.slice(0,3).map(q=>q.a)),plain(lesson.practice.map(q=>q.a)));
        assert.equal(next.practice.length,7);
      }
    }
  }
  assert.deepEqual(plain(data(true,'number')),plain(data(false,'number')));
  const deep=after.AOSHU_DEEP_LESSONS['patterns-combined'];
  assert.equal(deep.steps.length,4);
  assert.equal(deep.table.rows.length,3);
  for(const key of ['idea','chooseWhen','why','check','pitfall']) assert.ok(deep[key]);
  assert.match(deep.idea,/原创/);
  assert.match(deep.idea,/未核/);
  assert.match(deep.subtopics.map(s=>s.explanation).join(''),/第5项6.*第5项2/);
});
test('independent arithmetic covers given rules, position/value distinction and non-unique extension', () => {
  const a = n=>n%2 ? n+1 : n+3;
  assert.deepEqual(Array.from({length:8},(_,i)=>a(i+1)),[2,5,4,7,6,9,8,11]);
  const odd=[2,4,6,8], even=[5,7,9,11];
  for(let k=1;k<=4;k++){assert.equal(a(2*k-1),odd[k-1]);assert.equal(a(2*k),even[k-1]);}
  const q=data().AOSHU_CURRICULUM.find(b=>b.id==='sequences').lessons.find(l=>l.id==='patterns-combined').practice;
  const original = [1,4,2,5,3,6,4];
  let triangular=1;for(let diff=2;diff<=6;diff++)triangular+=diff;
  assert.deepEqual(plain(q.map(x=>x.a[0])), [String(original[6]),String(triangular),String(10*2**5),'1',String(a(8)),'0','0']);
  assert.notEqual(4-5,3);
  const cycle=n=>[2,5,4,7][(n-1)%4];
  for(let n=1;n<=4;n++) assert.equal(a(n),cycle(n));
  assert.notEqual(a(5),cycle(5));
});
test('renderer handles every blank/wrong/right answer, hints, saved progress and legacy expansion', () => {
  const dom=page(),w=dom.window,d=w.document;
  const card=d.querySelector('#bc-topic-patterns-combined');
  const qs=[...card.querySelectorAll('.bc-question')];
  const answers=['4','21','320','1','11','0','0'];
  assert.equal(qs.length,7);
  qs.forEach((q,i)=>{
    const input=q.querySelector('input'), button=q.querySelector('button'), feedback=q.querySelector('.bc-answer-feedback');
    button.click();assert.match(feedback.textContent,/先写一个答案/);
    input.value='999';button.click();assert.match(feedback.textContent,/提示/);assert.equal(feedback.classList.contains('good'),false);
    q.querySelector('.bc-solution').open=true;assert.match(q.querySelector('.bc-solution').textContent,/讲解/);
    input.value=answers[i];button.click();assert.equal(feedback.classList.contains('good'),true);
  });
  const saved=JSON.parse(w.localStorage.getItem('siwei-curriculum-mastery-v1'));
  assert.deepEqual(saved['patterns-combined'],{passed:[0,1,2,3,4,5,6],done:true});
  const refreshed=page(saved);
  assert.equal(refreshed.window.document.querySelector('#bc-topic-patterns-combined .bc-practice-count').textContent,'7/7 完成');
  const old=page({'patterns-combined':{passed:[0,1,2],done:true},unrelated:{passed:[0],done:false}});
  assert.equal(old.window.document.querySelector('#bc-topic-patterns-combined .bc-lesson-status').textContent,'3/7 自测');
  const input=old.window.document.querySelector('#bc-ans-patterns-combined-3');input.value='1';input.nextElementSibling.click();
  const migrated=JSON.parse(old.window.localStorage.getItem('siwei-curriculum-mastery-v1'));
  assert.deepEqual(migrated.unrelated,{passed:[0],done:false});
  assert.deepEqual(migrated['patterns-combined'],{passed:[0,1,2,3],done:false});
  for(const instance of [dom,refreshed,old])instance.window.close();
});
test('course CTA selects the real alternating lab, static return link exists and lab outputs all allowed targets',()=>{
  const dom=page(),d=dom.window.document;
  const tools=d.querySelector('#bc-topic-patterns-combined .bc-lesson-tools');
  const links=[...tools.querySelectorAll('a')];
  const cta=links.find(a=>a.textContent.includes('操作本例'));
  assert.equal(cta.getAttribute('href'),'/siwei/sequences.html?pattern=alternating#sequence-lab');
  assert.equal(cta.hasAttribute('data-open-lab'),false);
  assert.equal(links.find(a=>a.textContent.includes('回查交错')).getAttribute('href'),'/siwei/sequences.html#seq-mixed');
  const seqHtml=fs.readFileSync(path.join(__dirname,'sequences.html'),'utf8');
  const lab=new JSDOM(seqHtml,{runScripts:'outside-only',url:'http://localhost'+cta.getAttribute('href')});
  lab.window.eval(fs.readFileSync(path.join(__dirname,'sequences.js'),'utf8'));
  const ld=lab.window.document;
  assert.ok(ld.querySelector('#seq-mixed'));
  assert.equal(ld.querySelector('#pattern-choice').value,'alternating');
  assert.equal(ld.querySelector('#lab-reason').hidden,false);
  for(let n=4;n<=12;n++){
    const range=ld.querySelector('#target-term');range.value=n;range.dispatchEvent(new lab.window.Event('input'));
    assert.equal(ld.querySelector('#term-strip .target').getAttribute('aria-label'),`第 ${n} 项 ${n%2?n+1:n+3}`);
  }
  dom.window.close();lab.window.close();
});
