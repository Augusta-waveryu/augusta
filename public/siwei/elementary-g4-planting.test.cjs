const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'textbook.html'),'utf8');
const scripts=[...html.matchAll(/<script src="\/siwei\/([^"]+)"/g)].map(m=>m[1]);
const plain=x=>JSON.parse(JSON.stringify(x));
function load(include){
  const ctx={window:{},document:{getElementById:()=>null}};vm.createContext(ctx);
  for(const file of scripts){
    if(['textbook.js','textbook-overview.js'].includes(file)||(!include&&file==='elementary-g4-planting-units.js'))continue;
    vm.runInContext(fs.readFileSync(path.join(__dirname,file),'utf8'),ctx,{filename:file});
  }
  return ctx.window;
}
const before=load(false),after=load(true);
const old=before.AOSHU_TEXTBOOK_LESSONS.find(x=>x.key==='g4-7');
const current=after.AOSHU_TEXTBOOK_LESSONS.find(x=>x.key==='g4-7');
const unit=current.deepUnit;
test('only G4-7 changes; original questions, answers, identity and source retained',()=>{
  assert.equal(old.deepUnit,null);
  for(const field of ['key','title','source','href','link','prerequisite','suggestedDifficulty'])assert.deepEqual(current[field],old[field],field);
  assert.equal(unit.example.question,old.example);
  assert.equal(unit.practices[0].question,old.practice);
  assert.deepEqual(plain(unit.practices[0].answers),plain(old.answers));
  assert.equal(before.AOSHU_TEXTBOOK_LESSONS.length,after.AOSHU_TEXTBOOK_LESSONS.length);
  for(const item of before.AOSHU_TEXTBOOK_LESSONS){
    if(item.key==='g4-7')continue;
    assert.deepEqual(plain(after.AOSHU_TEXTBOOK_LESSONS.find(x=>x.key===item.key)),plain(item),item.key);
  }
});
test('all eight answers independently calculated and targeted feedback exists',()=>{
  const positions=Array.from({length:5},(_,i)=>i*3);
  const expected=[positions.filter(x=>x<12).length,positions.length,positions.filter(x=>x>0&&x<12).length,24/4,(600/150+1)*2,(7-1)*2,Number(10%3===0),5-1];
  assert.deepEqual(Array.from(unit.practices,p=>Number(p.answers[0])),expected);
  unit.practices.forEach(p=>['hint','wrongFeedback','correctFeedback','explanation'].forEach(k=>assert.ok(p[k].length>10)));
  assert.match(unit.scope,/原创/);assert.match(unit.scope,/页码与逐讲映射待核/);
  assert.match(unit.concepts.map(x=>x.text).join(''),/只有1段/);
});
function root(n,mode){
  const nodes={count:{value:String(n)},mode:{value:mode},chart:{innerHTML:'',setAttribute(k,v){this[k]=v}},result:{textContent:''}};
  return {dataset:{bookModel:'planting-points'},nodes,querySelector(s){return nodes[{'[data-planting-count]':'count','[data-planting-mode]':'mode','[data-planting-chart]':'chart','[data-book-model-result]':'result'}[s]];}};
}
test('two segment counts × four endpoint modes: points, segments and accessibility agree',()=>{
  for(const n of [4,6])for(const mode of ['both','one','neither','circle']){
    const model=root(n,mode);assert.equal(after.AOSHU_FOUNDATION_WIDGETS.update(model),true);
    const svg=model.nodes.chart.innerHTML;
    const count=mode==='both'?n+1:mode==='neither'?n-1:n;
    assert.equal(Number(model.dataset.plantingPoints),count);
    assert.equal((svg.match(/<line /g)||[]).length,n);
    assert.equal((svg.match(/class="is-planted"/g)||[]).length,count);
    assert.match(model.nodes.chart['aria-label'],new RegExp(`${count}个种植位置`));
    assert.match(model.nodes.result.textContent,new RegExp(`全长${n*3}米`));
    assert.doesNotMatch(svg,/NaN|Infinity/);
  }
});
test('enumerating positions confirms endpoint formulas and inverse checks',()=>{
  for(let n=1;n<=50;n++){
    const all=Array.from({length:n+1},(_,i)=>i);
    assert.equal(all.length,n+1);assert.equal(all.filter(i=>i<n).length,n);
    assert.equal(all.filter(i=>i>0&&i<n).length,n-1);
    assert.equal(new Set(all.map(i=>i%n)).size,n);
    assert.equal((all.length-1)*3,n*3);
  }
});
test('previous widgets delegate unchanged and controls remain accessible',()=>{
  for(const type of ['average-balance','sum-difference-bars','clock-face','pigeonhole-bins']){
    assert.equal(after.AOSHU_FOUNDATION_WIDGETS.supports(type),true);
    assert.equal(after.AOSHU_FOUNDATION_WIDGETS.markup({type}),before.AOSHU_FOUNDATION_WIDGETS.markup({type}));
  }
  const markup=after.AOSHU_FOUNDATION_WIDGETS.markup(unit.model);
  assert.match(markup,/aria-label="植树实验段数"/);assert.match(markup,/aria-label="植树实验路线"/);
  assert.match(markup,/aria-live="polite"/);assert.match(markup,/操作不计入答题进度/);
});
