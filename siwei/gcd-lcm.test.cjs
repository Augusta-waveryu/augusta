const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {JSDOM}=require('jsdom');
const html=fs.readFileSync(path.join(__dirname,'branch-course.html'),'utf8');
const files=[...html.matchAll(/<script src="\/siwei\/([^"]+)"/g)].map(m=>m[1]);
const plain=x=>JSON.parse(JSON.stringify(x));
function data(include=true,branch='number'){
 const c={window:{},document:{getElementById:()=>null},location:{search:'?branch='+branch},URLSearchParams};vm.createContext(c);
 for(const f of files)if(!['branch-course.js','geometry-visuals.js'].includes(f)&&(include||f!=='gcd-lcm-enrichment.js'))vm.runInContext(fs.readFileSync(path.join(__dirname,f),'utf8'),c);
 return c.window;
}
function page(saved){
 const dom=new JSDOM(html,{runScripts:'outside-only',pretendToBeVisual:true,url:'http://localhost/siwei/branch-course.html?branch=number#bc-topic-gcd-lcm'});
 dom.window.HTMLElement.prototype.scrollIntoView=function(){};
 if(saved)dom.window.localStorage.setItem('siwei-curriculum-mastery-v1',JSON.stringify(saved));
 for(const f of files)dom.window.eval(fs.readFileSync(path.join(__dirname,f),'utf8'));
 return dom;
}
const get=w=>w.AOSHU_CURRICULUM.find(b=>b.id==='number').lessons.find(l=>l.id==='gcd-lcm');
test('only target changes; original three question indices and answers retained',()=>{
 const before=data(false),after=data();
 for(const b of before.AOSHU_CURRICULUM)for(const l of b.lessons){const n=after.AOSHU_CURRICULUM.find(x=>x.id===b.id).lessons.find(x=>x.id===l.id);if(l.id!=='gcd-lcm')assert.deepEqual(plain(n),plain(l));}
 const old=get(before),now=get(after);assert.equal(now.practice.length,9);
 assert.deepEqual(plain(now.practice.slice(0,3).map(q=>[q.q,q.a])),plain(old.practice.map(q=>[q.q,q.a])));
 assert.deepEqual(plain(now.example),plain(old.example));
 assert.deepEqual(plain(data(true,'arithmetic')),plain(data(false,'arithmetic')));
 assert.match(now.practice[2].why,/84.*不能整除 126/);
 const deep=after.AOSHU_DEEP_LESSONS['gcd-lcm'];
 for(const k of ['chooseWhen','boundary','table','why','check','pitfall'])assert.ok(deep[k]);
 assert.equal(deep.steps.length,4);assert.match(deep.idea,/原创/);assert.match(deep.idea,/未核实/);
});
const divisors=n=>Array.from({length:n},(_,i)=>i+1).filter(d=>n%d===0);
const gcd=(a,b)=>Math.max(...divisors(a).filter(d=>b%d===0));
const lcm=(a,b)=>{for(let n=1;n<=a*b;n++)if(n%a===0&&n%b===0)return n;};
test('independent divisor/multiple enumeration checks every practice answer and boundaries',()=>{
 const q=get(data()).practice;
 const wants=[gcd(36,60),lcm(18,24),gcd(84,126),gcd(12,18),gcd(18,24),lcm(6,8),lcm(4,8),lcm(8,9),Number(gcd(2,gcd(4,8))*lcm(2,lcm(4,8))===2*4*8)];
 assert.deepEqual(plain(q.map(x=>x.a[0])),wants.map(String));
 for(const [a,b,g,l]of [[18,24,6,72],[12,20,4,60],[1,9,1,9],[4,8,4,8],[8,9,1,72]]){assert.equal(gcd(a,b),g);assert.equal(lcm(a,b),l);assert.equal(g*l,a*b);}
 assert.equal(18/6,3);assert.equal(24/6,4);assert.equal(84/42,2);assert.equal(126/42,3);assert.equal(84%84,0);assert.notEqual(126%84,0);
 assert.ok(Array.from({length:50},(_,i)=>i*6).every(t=>(t-1)%8!==0));
});
test('empty/wrong/correct, specific hints, save/reload, compatible old records and matched activity link',async()=>{
 const dom=page(),w=dom.window,d=w.document,scope=d.querySelector('#bc-topic-gcd-lcm');
 await new Promise(r=>w.setTimeout(r,150));assert.ok(scope.open);
 const cards=scope.querySelectorAll('.bc-question');assert.equal(cards.length,9);
 const answers=['12','72','42','6','6','24','8','72','0'];
 cards.forEach((card,i)=>{
  const input=card.querySelector('input'),button=card.querySelector('button'),feedback=card.querySelector('.bc-answer-feedback');
  button.click();assert.match(feedback.textContent,/先写一个答案/);
  input.value='999';button.click();assert.match(feedback.textContent,/还差一点。提示/);assert.equal(feedback.classList.contains('good'),false);
  assert.ok(card.querySelector('.bc-solution').textContent.includes('讲解'));
  input.value=answers[i];button.click();assert.ok(feedback.classList.contains('good'));
 });
 const saved=JSON.parse(w.localStorage.getItem('siwei-curriculum-mastery-v1'));
 assert.deepEqual(saved['gcd-lcm'],{passed:[0,1,2,3,4,5,6,7,8],done:true});
 const reload=page(saved);assert.equal(reload.window.document.querySelector('#bc-topic-gcd-lcm .bc-practice-count').textContent,'9/9 完成');
 const legacy=page({'gcd-lcm':{passed:[0,1,2],done:true},other:{passed:[0],done:false}});
 assert.equal(legacy.window.document.querySelector('#bc-topic-gcd-lcm .bc-lesson-status').textContent,'3/9 自测');
 const input=legacy.window.document.querySelector('#bc-ans-gcd-lcm-3');input.value='6';input.nextElementSibling.click();
 const migrated=JSON.parse(legacy.window.localStorage.getItem('siwei-curriculum-mastery-v1'));
 assert.deepEqual(migrated.other,{passed:[0],done:false});assert.deepEqual(migrated['gcd-lcm'],{passed:[0,1,2,3],done:false});
 const cta=scope.querySelector('.bc-lesson-tools a');assert.equal(cta.getAttribute('href'),'/siwei/number-theory.html#nt-gcd');assert.equal(cta.hasAttribute('data-open-lab'),false);
 const nt=fs.readFileSync(path.join(__dirname,'number-theory.html'),'utf8');for(const id of ['nt-gcd','nt-gcd-a','nt-gcd-b','nt-gcd-button'])assert.ok(nt.includes('id="'+id+'"'));
 for(const x of [dom,reload,legacy])x.window.close();
});
