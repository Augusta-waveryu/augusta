const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const scripts=[...fs.readFileSync(path.join(__dirname,'textbook.html'),'utf8').matchAll(/<script src="\/siwei\/([^\"]+)"/g)].map(x=>x[1]);
function load(include){const c={window:{},document:{getElementById:()=>null}};vm.createContext(c);for(const file of scripts){if(['textbook.js','textbook-overview.js'].includes(file)||(!include&&file==='elementary-g4-perimeter-area-units.js'))continue;vm.runInContext(fs.readFileSync(path.join(__dirname,file),'utf8'),c,{filename:file});}return c.window;}
const before=load(false),after=load(true),old=before.AOSHU_TEXTBOOK_LESSONS.find(x=>x.key==='g4-9'),current=after.AOSHU_TEXTBOOK_LESSONS.find(x=>x.key==='g4-9'),unit=current.deepUnit;
const plain=x=>JSON.parse(JSON.stringify(x));
test('only G4-9 enriched; original identity, source, prerequisites, example and first practice retained',()=>{
 assert.equal(old.deepUnit,null);
 for(const key of ['key','title','href','link','prerequisite','source','suggestedDifficulty'])assert.deepEqual(current[key],old[key],key);
 assert.equal(unit.example.question,old.example);assert.equal(unit.practices[0].question,old.practice);assert.deepEqual(plain(unit.practices[0].answers),plain(old.answers));
 assert.equal(before.AOSHU_TEXTBOOK_LESSONS.length,after.AOSHU_TEXTBOOK_LESSONS.length);
 for(const item of before.AOSHU_TEXTBOOK_LESSONS){if(item.key!=='g4-9')assert.deepEqual(plain(after.AOSHU_TEXTBOOK_LESSONS.find(x=>x.key===item.key)),plain(item),item.key);}
});
test('ten progressive answers computed independently; all provide targeted feedback',()=>{
 const expected=[10*6/2,2*(8+5),6*4,100**2,8*5/2,0,[2*(3+5),3*5,2*6].join(','),2*100*50,(24/4)**2,9*4].map(String);
 assert.deepEqual(Array.from(unit.practices,p=>p.answers[0]),expected);
 assert.equal(2*(3+5),2*(2+6));assert.notEqual(3*5,2*6);
 for(const p of unit.practices)for(const key of ['hint','wrongFeedback','correctFeedback','explanation'])assert.ok(p[key].length>10,key);
 assert.match(unit.scope,/原创/);assert.match(unit.scope,/版本、页码与逐讲映射待核/);
 assert.match(unit.idea,/垂直/);assert.match(unit.concepts.map(x=>x.text).join(''),/图形外/);
});
function root(index,view){const nodes={choice:{value:String(index)},view:{value:view},svg:{innerHTML:'',dataset:{}},result:{textContent:''}};return {dataset:{bookModel:'perimeter-area-grid'},nodes,setAttribute(k,v){this[k]=v;},querySelector(s){return nodes[{'[data-perimeter-case]':'choice','[data-perimeter-view]':'view','[data-perimeter-svg]':'svg','[data-book-model-result]':'result'}[s]];}};}
test('four cases × three modes: numeric results, visual state, grid order and accessible labels',()=>{
 const sizes=[[8,5],[3,5],[2,6],[10,6]];
 for(let i=0;i<4;i++)for(const view of ['both','boundary','area']){
  const r=root(i,view),[w,h]=sizes[i];assert.equal(after.AOSHU_FOUNDATION_WIDGETS.update(r),true);
  assert.equal(r.nodes.svg.dataset.view,view);assert.match(r.nodes.svg.innerHTML,/role="img" aria-label=/);assert.ok(r['aria-label'].length>10);
  if(i<3){
   const perimeter=String(2*(w+h)),area=String(w*h);
   if(view!=='area')assert.match(r.nodes.result.textContent,new RegExp('='+perimeter+'个长度单位'));
   if(view!=='boundary')assert.match(r.nodes.result.textContent,new RegExp('='+area+'个平方单位'));
   assert.ok(r.nodes.svg.innerHTML.indexOf('<rect')<r.nodes.svg.innerHTML.indexOf('<g class="book-perimeter-grid-lines"'));
   assert.equal((r.nodes.svg.innerHTML.match(/<line /g)||[]).length,w+h-2);
  }else{
   assert.match(r.nodes.svg.innerHTML,/book-perimeter-copy/);
   assert.match(r.nodes.svg.innerHTML,/M 85.5 18 L 85.5 156/);
   if(view==='boundary')assert.match(r.nodes.result.textContent,/不能确定周长/);else assert.match(r.nodes.result.textContent,/=30平方单位/);
  }
 }
});
test('legacy widgets delegated unchanged; controls use shared hook and live feedback',()=>{
 for(const type of ['order-operations-path','average-balance','sum-difference-bars','planting-points','pigeonhole-bins']){
  assert.equal(after.AOSHU_FOUNDATION_WIDGETS.supports(type),true);
  assert.equal(after.AOSHU_FOUNDATION_WIDGETS.markup({type}),before.AOSHU_FOUNDATION_WIDGETS.markup({type}));
 }
 const markup=after.AOSHU_FOUNDATION_WIDGETS.markup(unit.model);assert.match(markup,/data-foundation-model-control/);assert.match(markup,/aria-live="polite"/);assert.match(markup,/aria-label="选择周长面积案例"/);
});
