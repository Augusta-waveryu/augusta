const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const scripts=[...fs.readFileSync(path.join(__dirname,'textbook.html'),'utf8').matchAll(/<script src="\/siwei\/([^"]+)"/g)].map(x=>x[1]);
function load(include){const c={window:{},document:{getElementById:()=>null}};vm.createContext(c);for(const file of scripts){if(['textbook.js','textbook-overview.js'].includes(file)||(!include&&file==='elementary-g4-order-operations-units.js'))continue;vm.runInContext(fs.readFileSync(path.join(__dirname,file),'utf8'),c,{filename:file});}return c.window;}
const before=load(false),after=load(true),old=before.AOSHU_TEXTBOOK_LESSONS.find(x=>x.key==='g4-4'),current=after.AOSHU_TEXTBOOK_LESSONS.find(x=>x.key==='g4-4'),unit=current.deepUnit;
const plain=x=>JSON.parse(JSON.stringify(x));
test('only G4-4 is enriched; original identities, links, prerequisites, sources and questions retained',()=>{
 assert.equal(old.deepUnit,null);
 for(const key of ['key','title','href','link','prerequisite','source','suggestedDifficulty'])assert.deepEqual(current[key],old[key],key);
 assert.equal(unit.example.question,old.example);assert.equal(unit.practices[0].question,old.practice);assert.deepEqual(plain(unit.practices[0].answers),plain(old.answers));
 assert.equal(before.AOSHU_TEXTBOOK_LESSONS.length,after.AOSHU_TEXTBOOK_LESSONS.length);
 for(const item of before.AOSHU_TEXTBOOK_LESSONS){if(item.key!=='g4-4')assert.deepEqual(plain(after.AOSHU_TEXTBOOK_LESSONS.find(x=>x.key===item.key)),plain(item),item.key);}
});
test('all nine answers independently computed and feedback explains misconceptions',()=>{
 const expected=[125*8*7,48/(6-2),72/6*2,50-18+8,Number(20-7-3===20-(7-3)),25*(20-3),Number(Number.isFinite(36/(3-3))),48+199+52,25+3*4];
 assert.deepEqual(Array.from(unit.practices,p=>Number(p.answers[0])),expected);
 assert.equal(25*17*4,1700);assert.equal(48/6/2,4);assert.equal(48/(6/2),16);assert.equal(25*20-3,497);
 for(const p of unit.practices)for(const key of ['hint','wrongFeedback','correctFeedback','explanation'])assert.ok(p[key].length>10,key);
 assert.match(unit.scope,/原创/);assert.match(unit.scope,/页码与逐讲映射待核/);
});
function root(index,view){const nodes={choice:{value:String(index)},view:{value:view},flow:{innerHTML:'',setAttribute(k,v){this[k]=v}},result:{textContent:''}};return {dataset:{bookModel:'order-operations-path'},nodes,querySelector(s){return nodes[{'[data-order-case]':'choice','[data-order-view]':'view','[data-order-flow]':'flow','[data-book-model-result]':'result'}[s]];}};}
test('all five interaction cases × both views have correct results and accessible flow labels',()=>{
 const expected=[25*17*4,125*8*7,48/(6-2),72/6*2,25*(20-3)];
 for(let i=0;i<5;i++)for(const view of ['rule','counter']){const r=root(i,view);assert.equal(after.AOSHU_FOUNDATION_WIDGETS.update(r),true);assert.ok(r.nodes.flow['aria-label'].length>10);assert.match(r.nodes.flow.innerHTML,/book-order-block/);if(view==='rule')assert.match(r.nodes.result.textContent,new RegExp('结果 '+expected[i]));else assert.match(r.nodes.result.textContent,/交换|换位/);}
});
test('old widgets delegate unchanged; controls use shared event hook and live feedback',()=>{
 for(const type of ['average-balance','sum-difference-bars','planting-points','pigeonhole-bins']){assert.equal(after.AOSHU_FOUNDATION_WIDGETS.supports(type),true);assert.equal(after.AOSHU_FOUNDATION_WIDGETS.markup({type}),before.AOSHU_FOUNDATION_WIDGETS.markup({type}));}
 const markup=after.AOSHU_FOUNDATION_WIDGETS.markup(unit.model);assert.match(markup,/data-foundation-model-control/);assert.match(markup,/aria-live="polite"/);assert.match(markup,/aria-label="选择算式"/);
});
