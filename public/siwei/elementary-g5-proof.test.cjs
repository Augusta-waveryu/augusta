const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const target = 'elementary-g5-proof-units.js';
const scripts = [...fs.readFileSync(path.join(__dirname, 'textbook.html'), 'utf8').matchAll(/<script src="\/siwei\/([^"]+)"/g)].map(m => m[1]);
const plain = x => JSON.parse(JSON.stringify(x));
function load(includeTarget) {
  const c = {window:{}, document:{getElementById:()=>null}}; vm.createContext(c);
  for (const file of scripts) {
    if (['textbook.js','textbook-overview.js'].includes(file) || (!includeTarget && file === target)) continue;
    vm.runInContext(fs.readFileSync(path.join(__dirname,file),'utf8'),c,{filename:file});
  }
  return c.window;
}
const before=load(false), after=load(true);
const old=before.AOSHU_TEXTBOOK_LESSONS.find(l=>l.key==='g5-17');
const lesson=after.AOSHU_TEXTBOOK_LESSONS.find(l=>l.key==='g5-17');
const unit=lesson.deepUnit;

test('only g5-17 changes; original route, question, answer, source and other lessons remain',()=>{
  assert.equal(old.deepUnit,null); assert.equal(lesson.title,old.title);
  for (const field of ['grade','n','key','href','source','example','practice']) assert.equal(lesson[field],old[field],field);
  assert.deepEqual(plain(lesson.answers),plain(old.answers));
  assert.equal(after.AOSHU_TEXTBOOK_LESSONS.length,before.AOSHU_TEXTBOOK_LESSONS.length);
  for(const prev of before.AOSHU_TEXTBOOK_LESSONS){if(prev.key==='g5-17')continue; assert.deepEqual(plain(after.AOSHU_TEXTBOOK_LESSONS.find(l=>l.key===prev.key)),plain(prev),prev.key);}
  assert.ok(!lesson.steps.join('').includes('质数'));
  assert.match(lesson.steps.join(''),/2÷4/); assert.match(lesson.steps.join(''),/2a\+2b/); assert.match(lesson.steps.join(''),/奇数.*冲突/);
});

test('independently finds smallest valid witnesses and checks every answer',()=>{
  const nums=Array.from({length:100},(_,i)=>i+1);
  const firstCounterexample=nums.find(n=>n%2===0&&n%4!==0);
  const newRangeCounterexample=nums.find(n=>n>4&&n%2===0&&n%4!==0);
  const existence=nums.find(n=>n%2===0&&n%4===0);
  const firstOriginalCounterexample=nums.find(n=>n>10&&n%3===0&&n%2!==0);
  assert.equal(firstOriginalCounterexample,15);
  const originalFalse=firstOriginalCounterexample===undefined?'1':'0';
  const zeroIsCounterexample=0>0&&0%2===0&&0%4!==0;
  // These enumerations verify numeric examples; the lesson's arbitrary-integer proof is separate.
  for(let a=-30;a<=30;a++)for(let b=-30;b<=30;b++){
    assert.equal(Math.abs((2*a+2*b)%2),0);
    assert.equal(Math.abs((2*a+1+2*b+1)%2),0);
    if(Math.abs((a+b)%2)===1)assert.notEqual(Math.abs(a%2),Math.abs(b%2));
  }
  assert.deepEqual(plain(unit.practices.map(p=>p.answers[0])),[originalFalse,zeroIsCounterexample?'1':'0',String(firstCounterexample),String(newRangeCounterexample),String(existence),'偶数','1']);
});

test('model independently classifies all selectable candidates for both claims',()=>{
  const widget=after.AOSHU_FOUNDATION_WIDGETS;
  assert.ok(widget.supports('counterexample-check'));
  const candidates=[-2,0,2,3,4,6,8,9,10,12,15,18,20,21,24];
  for(const claim of ['even-four','multiple-three'])for(const n of candidates){
    const result={textContent:''},gates={innerHTML:''},visual={innerHTML:'',textContent:'',setAttribute(k,v){this[k]=v;}};
    const root={dataset:{bookModel:'counterexample-check',bookModelConfig:'{}'},querySelector(q){
      if(q==='[data-book-model-result]')return result;
      if(q==='[data-proof-gates]')return gates;
      if(q==='[data-proof-groups]')return visual;
      if(q.includes('"claim"'))return {value:claim};
      if(q.includes('"candidate"'))return {value:String(n)};
      throw new Error(q);
    }};
    assert.equal(widget.update(root),true);
    const positiveEvens=Array.from({length:12},(_,i)=>2*(i+1));
    const upperThrees=[12,15,18,21,24];
    const inRange=(claim==='even-four'?positiveEvens:upperThrees).includes(n);
    const holds=claim==='even-four'?[0,4,8,12,20,24].includes(n):n%2===0;
    assert.equal(root.dataset.proofVerdict,!inRange?'outside':holds?'support':'counterexample',claim+':'+n);
    if(n>0){
      assert.equal((visual.innerHTML.match(/<i /g)||[]).length,n);
      const d=claim==='even-four'?4:2;
      assert.equal((visual.innerHTML.match(/class="foundation-proof-group"/g)||[]).length,Math.floor(n/d));
      assert.equal(visual.innerHTML.includes('is-remainder'),n%d!==0);
    }
  }
});

test('lesson explains proof boundaries, feedback, review and original-source limits',()=>{
  assert.equal(unit.practices.length,7);
  assert.match(unit.scope,/原创/); assert.match(unit.scope,/待核/); assert.match(unit.idea,/先修/);
  assert.match(unit.methodCard.check,/没找到/);
  assert.match(unit.concepts.map(c=>c.text).join(''),/有限/);
  for(const p of unit.practices)for(const f of ['question','hint','wrongFeedback','correctFeedback','explanation'])assert.ok(p[f]);
  assert.ok(unit.diagrams.length===3&&unit.review.length===5);
});
