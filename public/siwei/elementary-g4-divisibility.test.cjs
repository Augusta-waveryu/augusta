const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const cp = require('node:child_process');
const path = require('node:path');
const dir = __dirname;
const plain = x => JSON.parse(JSON.stringify(x));
function load(baseline) {
  const context = {window:{},document:{getElementById:()=>null}};
  vm.createContext(context);
  // Use the same current module list on both sides. Only the divisibility
  // content module is replaced by its pre-enrichment version for comparison.
  const html = fs.readFileSync(path.join(dir,'textbook.html'),'utf8');
  for(const match of html.matchAll(/<script src="\/siwei\/([^"]+)"/g)) {
    const file = match[1];
    if(['textbook.js','textbook-overview.js'].includes(file)) continue;
    const content = baseline && file === 'elementary-deep-units-repair.js' ? cp.execFileSync('git',['show','ea29dde:siwei/'+file],{cwd:dir,encoding:'utf8'}) : fs.readFileSync(path.join(dir,file),'utf8');
    vm.runInContext(content,context,{filename:file});
  }
  return context.window;
}
const before = load(true), after = load(false);
const old = before.AOSHU_TEXTBOOK_LESSONS.find(l=>l.key==='g4-1');
const lesson = after.AOSHU_TEXTBOOK_LESSONS.find(l=>l.key==='g4-1');
const unit = lesson.deepUnit;
test('only G4-1 changes, original identity/source/routes/questions/answer positions retained',()=>{
  assert.equal(after.AOSHU_TEXTBOOK_LESSONS.length,127);
  for(const l of before.AOSHU_TEXTBOOK_LESSONS) if(l.key!=='g4-1') assert.deepEqual(plain(after.AOSHU_TEXTBOOK_LESSONS.find(x=>x.key===l.key)),plain(l),l.key);
  for(const key of ['key','n','grade','title','source','href','link','prerequisite','suggestedDifficulty']) assert.deepEqual(lesson[key],old[key],key);
  assert.equal(unit.example.question,old.deepUnit.example.question);
  for(let i=0;i<3;i++) {assert.equal(unit.practices[i].question,old.deepUnit.practices[i].question);assert.deepEqual(plain(unit.practices[i].answers),plain(old.deepUnit.practices[i].answers));}
  assert.equal(unit.practices.length,7);
  assert.match(unit.scope,/原创/);assert.match(unit.scope,/待核/);
  for(const p of unit.practices) {assert.ok(p.hint);assert.ok(p.explanation);assert.ok(p.wrongFeedback);}
});
test('independent division checks every practice and boundaries',()=>{
  const answers = [120%3===0,142%5===0,234%3===0&&234%9===0,0%7===0,16%7===0];
  answers.forEach((v,i)=>assert.equal(unit.practices[i].answers[0],v?'能':'不能'));
  const digits = Array.from({length:10},(_,i)=>i);
  assert.deepEqual(digits.filter(d=>d%2===0&&d%5===0),[0]);
  assert.equal(digits.find(d=>(402+10*d)%2===0&&(402+10*d)%9===0),Number(unit.practices[6].answers[0]));
  assert.equal(2*99+4*9+12,246);
  for(let n=0;n<=10000;n++) {
    const sum=String(n).split('').reduce((a,b)=>a+Number(b),0);
    for(const d of [3,9]) assert.equal(n%d,sum%d);
    for(const d of [2,5,10]) assert.equal(n%d===0,(n%10)%d===0);
  }
});
test('all selectable widget states agree with independent arithmetic and expose text alternative',()=>{
  const widgets = after.AOSHU_FOUNDATION_WIDGETS;
  assert.ok(widgets.supports(unit.model.type));
  assert.match(widgets.markup(unit.model),/data-foundation-model-control/);
  for(const n of [0,12,16,120,246,234,745,1740,3168]) for(const d of [2,3,5,7,9,10]) {
    const board={innerHTML:'',setAttribute(k,v){this[k]=v;}};
    const result={textContent:''};
    const root={dataset:{bookModel:unit.model.type},querySelector(s){return {'[data-div-number]':{value:String(n)},'[data-div-divisor]':{value:String(d)},'[data-div-place-value]':board,'[data-book-model-result]':result}[s];}};
    assert.equal(widgets.update(root),true);
    assert.ok(result.textContent.startsWith(`${n} ÷ ${d} ${n%d===0?'没有余数，能':'有余数，不能'}`));
    assert.match(result.textContent,new RegExp('直接核验余数为 '+n%d));
    assert.ok(board['aria-label'].includes('位值展开'));
    if(d===7) assert.match(result.textContent,/不能用数位和/);
  }
});
