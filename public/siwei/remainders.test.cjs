const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {JSDOM} = require('jsdom');
const html = fs.readFileSync(path.join(__dirname,'branch-course.html'),'utf8');
const files = [...html.matchAll(/<script src="\/siwei\/([^"]+)"/g)].map(m=>m[1]);
const plain = x=>JSON.parse(JSON.stringify(x));
function data(include=true, branch='number') {
  const c={window:{},document:{getElementById:()=>null},location:{search:'?branch='+branch},URLSearchParams};
  vm.createContext(c);
  for(const f of files) if(!['branch-course.js','geometry-visuals.js'].includes(f) && (include || f!=='remainders-enrichment.js')) vm.runInContext(fs.readFileSync(path.join(__dirname,f),'utf8'),c);
  return c.window;
}
function page(saved) {
  const dom=new JSDOM(html,{runScripts:'outside-only',pretendToBeVisual:true,url:'http://localhost/siwei/branch-course.html?branch=number#bc-topic-remainders'});
  dom.window.HTMLElement.prototype.scrollIntoView=function(){};
  if(saved) dom.window.localStorage.setItem('siwei-curriculum-mastery-v1',JSON.stringify(saved));
  for(const f of files)dom.window.eval(fs.readFileSync(path.join(__dirname,f),'utf8'));
  return dom;
}
test('only remainder lesson changes; old answer indices and other branches stay compatible',()=>{
  const before=data(false),after=data();
  for(const b of before.AOSHU_CURRICULUM)for(const l of b.lessons){
    const n=after.AOSHU_CURRICULUM.find(x=>x.id===b.id).lessons.find(x=>x.id===l.id);
    if(l.id!=='remainders')assert.deepEqual(plain(n),plain(l));
    else {assert.deepEqual(plain(n.practice.slice(0,3).map(q=>q.a)),plain(l.practice.map(q=>q.a)));assert.equal(n.practice.length,7);assert.deepEqual(plain(n.example),plain(l.example));}
  }
  assert.deepEqual(plain(data(true,'arithmetic')),plain(data(false,'arithmetic')));
  const deep=after.AOSHU_DEEP_LESSONS.remainders;
  assert.equal(deep.steps.length,4);assert.equal(deep.table.rows.length,5);
  for(const k of ['chooseWhen','boundary','why','check','pitfall'])assert.ok(deep[k]);
  assert.match(deep.idea,/原创/);assert.match(deep.idea,/未核实/);
});
test('independent modular calculations and counterexamples',()=>{
  const mod=(a,m)=>((a%m)+m)%m;
  const pow=(a,n,m)=>Number(BigInt(a)**BigInt(n)%BigInt(m));
  assert.deepEqual(Array.from({length:5},(_,i)=>pow(2,i+1,5)),[2,4,3,1,2]);
  assert.deepEqual(Array.from({length:5},(_,i)=>pow(2,i+1,8)),[2,4,0,0,0]);
  assert.deepEqual(Array.from({length:5},(_,i)=>pow(2,i,6)),[1,2,4,2,4]);
  const q=data().AOSHU_CURRICULUM.find(b=>b.id==='number').lessons.find(l=>l.id==='remainders').practice;
  const answers=[mod(2026,9),pow(7,100,10),mod(100,7),mod(29,5),Number(mod(17,6)===mod(29,6)),pow(2,8,5),Number(mod(2*4,6)!==mod(2,6)||mod(4,6)===1)];
  assert.deepEqual(plain(q.map(x=>x.a[0])),answers.map(String));
  assert.equal(pow(2,20,5),1);assert.equal(mod(17+8,6),1);assert.equal(mod(17*2,6),4);
  assert.equal(mod(2*4,6),mod(2,6));assert.notEqual(mod(4,6),1);assert.equal(mod(4,3),1);
  assert.equal(29,5*5+4);assert.equal(29,5*4+9);assert.ok(9>=5);
});
test('empty/wrong/correct feedback, hints, save/reload and legacy records',async()=>{
  const dom=page(),w=dom.window,d=w.document;
  const scope=d.querySelector('#bc-topic-remainders');
  await new Promise(resolve=>w.setTimeout(resolve,150));
  assert.ok(scope.open);
  const qs=scope.querySelectorAll('.bc-question');assert.equal(qs.length,7);
  const answers=['1','1','2','4','1','1','0'];
  qs.forEach((card,i)=>{
    const input=card.querySelector('input'),button=card.querySelector('button'),feedback=card.querySelector('.bc-answer-feedback');
    button.click();assert.match(feedback.textContent,/先写一个答案/);
    input.value='999';button.click();assert.match(feedback.textContent,/还差一点。提示/);assert.equal(feedback.classList.contains('good'),false);
    assert.ok(card.querySelector('.bc-solution').textContent.includes('讲解'));
    input.value=answers[i];button.click();assert.equal(feedback.classList.contains('good'),true);
  });
  const saved=JSON.parse(w.localStorage.getItem('siwei-curriculum-mastery-v1'));
  assert.deepEqual(saved.remainders,{passed:[0,1,2,3,4,5,6],done:true});
  const reload=page(saved);assert.equal(reload.window.document.querySelector('#bc-topic-remainders .bc-practice-count').textContent,'7/7 完成');
  const legacy=page({remainders:{passed:[0,1,2],done:true},other:{passed:[0],done:false}});
  assert.equal(legacy.window.document.querySelector('#bc-topic-remainders .bc-lesson-status').textContent,'3/7 自测');
  const input=legacy.window.document.querySelector('#bc-ans-remainders-3');input.value='4';input.nextElementSibling.click();
  const migrated=JSON.parse(legacy.window.localStorage.getItem('siwei-curriculum-mastery-v1'));
  assert.deepEqual(migrated.other,{passed:[0],done:false});assert.deepEqual(migrated.remainders,{passed:[0,1,2,3],done:false});
  const cta=scope.querySelector('.bc-lesson-tools a');
  assert.equal(cta.getAttribute('href'),'/siwei/number-theory.html#nt-原讲义第 6 讲');assert.equal(cta.hasAttribute('data-open-lab'),false);
  const nt=fs.readFileSync(path.join(__dirname,'number-theory.html'),'utf8');assert.ok(nt.includes('id="nt-原讲义第 6 讲"'));
  assert.ok(nt.includes('id="nt-rem-a"'));assert.ok(nt.includes('id="nt-pow-base"'));
  for(const x of [dom,reload,legacy])x.window.close();
});
