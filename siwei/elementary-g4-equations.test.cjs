const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const target='elementary-g4-equations-units.js';
const scripts=[...fs.readFileSync(path.join(__dirname,'textbook.html'),'utf8').matchAll(/<script src="\/siwei\/([^\"]+)"/g)].map(x=>x[1]);
function load(include){const c={window:{},document:{getElementById:()=>null}};vm.createContext(c);for(const f of scripts){if(['textbook.js','textbook-overview.js'].includes(f)||(!include&&f===target))continue;vm.runInContext(fs.readFileSync(path.join(__dirname,f),'utf8'),c,{filename:f});}return c.window;}
const before=load(false),after=load(true),plain=x=>JSON.parse(JSON.stringify(x));
const old=before.AOSHU_TEXTBOOK_LESSONS.find(x=>x.key==='g4-19'),current=after.AOSHU_TEXTBOOK_LESSONS.find(x=>x.key==='g4-19'),unit=current.deepUnit;
test('only G4-19 changes, original identity/source/route/questions retained',()=>{
 assert.equal(old.deepUnit,null);
 for(const key of ['key','title','grade','n','group','href','link','prerequisite','source','suggestedDifficulty'])assert.deepEqual(current[key],old[key],key);
 assert.equal(unit.example.question,old.example);assert.equal(unit.practices[0].question,old.practice);assert.deepEqual(plain(unit.practices[0].answers),plain(old.answers));
 assert.equal(before.AOSHU_TEXTBOOK_LESSONS.length,after.AOSHU_TEXTBOOK_LESSONS.length);
 for(const item of before.AOSHU_TEXTBOOK_LESSONS)if(item.key!=='g4-19')assert.deepEqual(plain(after.AOSHU_TEXTBOOK_LESSONS.find(x=>x.key===item.key)),plain(item),item.key);
});
test('eight progressive answers independently satisfy original relations',()=>{
 const solutions=[14+9,0,(24-6)/3,5*4,18-7,1,0,(19-5)/2];
 assert.deepEqual(Array.from(unit.practices,p=>Number(p.answers[0])),solutions);
 assert.equal(solutions[0]-9,14);assert.equal(3*solutions[2]+6,24);assert.equal(solutions[3]/4,5);assert.equal(18-solutions[4],7);assert.equal(2*solutions[7]+5,19);
 assert.notEqual(20+7,20);assert.equal(0*3,0*4);
 for(const p of unit.practices)for(const field of ['hint','wrongFeedback','correctFeedback','explanation'])assert.ok(p[field].length>10,field);
 assert.match(unit.scope,/本站原创/);assert.match(unit.scope,/教材版本、页码及逐讲映射待核/);assert.match(unit.methodCard.check,/丢失原条件/);
});
function root(key,stage){const nodes={key:{value:key},stage:{value:String(stage)},plot:{innerHTML:''},result:{textContent:''}};return{dataset:{bookModel:'equation-balance'},nodes,querySelector(s){return nodes[{'[data-equation-case]':'key','[data-equation-stage]':'stage','[data-equation-plot]':'plot','[data-book-model-result]':'result'}[s]];}};}
test('all twelve model states plus fallback, semantics and older widget delegation',()=>{
 const expected={add:[['x+7','20'],['x','13'],['13+7','20']],two:[['3x+6','24'],['3x','18'],['x','6']],divide:[['x÷4','5'],['x','20'],['20÷4','5']],wrong:[['x+7','20'],['x','20'],['20+7','20']]};
 for(const [key,steps] of Object.entries(expected))for(let stage=0;stage<3;stage++){const r=root(key,stage);assert.equal(after.AOSHU_FOUNDATION_WIDGETS.update(r),true);const [left,right]=steps[stage];assert.ok(r.nodes.result.textContent.startsWith(`${key==='wrong'&&stage===1?'错误变形（与原式不等价）：':''}${left}${key==='wrong'&&stage===2?'≠':'='}${right}`));assert.equal(r.dataset.equationValid,String(!(key==='wrong'&&stage>0)));assert.match(r.nodes.plot.innerHTML,/viewBox="0 0 320 150" role="img" aria-label=/);assert.doesNotMatch(r.nodes.plot.innerHTML,/NaN|undefined/);}
 const fallback=root('invalid','NaN');after.AOSHU_FOUNDATION_WIDGETS.update(fallback);assert.match(fallback.nodes.result.textContent,/x\+7=20/);
 const markup=after.AOSHU_FOUNDATION_WIDGETS.markup(unit.model);assert.match(markup,/aria-live="polite"/);assert.match(markup,/data-foundation-model-control/);
 for(const type of ['grid-mirror','angles-relations','average-balance','planting-points']){assert.equal(after.AOSHU_FOUNDATION_WIDGETS.supports(type),true);assert.equal(after.AOSHU_FOUNDATION_WIDGETS.markup({type}),before.AOSHU_FOUNDATION_WIDGETS.markup({type}));}
});
