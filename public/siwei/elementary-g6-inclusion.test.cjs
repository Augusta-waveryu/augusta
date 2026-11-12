const test = require('node:test'), assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const target = 'elementary-g6-inclusion-units.js';
const scripts = [...fs.readFileSync(path.join(__dirname,'textbook.html'),'utf8').matchAll(/<script src="\/siwei\/([^"]+)"/g)].map(m=>m[1]);
const plain = x => JSON.parse(JSON.stringify(x));
function load(include) { const c={window:{},document:{getElementById:()=>null}};vm.createContext(c);for(const f of scripts){if(['textbook.js','textbook-overview.js'].includes(f)||(!include && f===target))continue;vm.runInContext(fs.readFileSync(path.join(__dirname,f),'utf8'),c,{filename:f});}return c.window; }
const before=load(false), after=load(true), old=before.AOSHU_TEXTBOOK_LESSONS.find(x=>x.key==='g6-13'), lesson=after.AOSHU_TEXTBOOK_LESSONS.find(x=>x.key==='g6-13'), unit=lesson.deepUnit;
test('only target changes; lesson identity, all old questions, answers and positions survive',()=>{
 for(const k of ['key','title','grade','n','group','href','link','source','example','practice','answers','hint','explanation']) assert.deepEqual(plain(lesson[k]),plain(old[k]),k);
 for(const l of before.AOSHU_TEXTBOOK_LESSONS.filter(x=>x.key!=='g6-13'))assert.deepEqual(plain(after.AOSHU_TEXTBOOK_LESSONS.find(x=>x.key===l.key)),plain(l),l.key);
 assert.equal(unit.example.question,old.deepUnit.example.question);
 for(let i=0;i<4;i++)for(const k of ['question','answers'])assert.deepEqual(plain(unit.practices[i][k]),plain(old.deepUnit.practices[i][k]),`${i}:${k}`);
 assert.ok(unit.practices.length>=7);assert.match(unit.scope,/原创/);assert.match(unit.scope,/待核/);assert.ok(unit.prerequisite);assert.ok(unit.references.length);
 for(const p of unit.practices)for(const k of ['hint','explanation','correctFeedback','wrongFeedback'])assert.ok(p[k]?.length>8, k);
});
test('all nine answers agree with independent counting and inverse checks',()=>{
 const multiples=Array.from({length:30},(_,i)=>i+1).filter(n=>n%2===0||n%5===0).length;
 const expected=[18+12-5,multiples,18+13-10,'不可能',9+7,7,14+13-20,(12-8)+(15-8),16+13-23].map(String);
 assert.deepEqual(plain(unit.practices.map(p=>p.answers[0])),expected);
 assert.equal(12+15-8,19);assert.ok(12+15-2>20);
 assert.equal(10+6+7+7,30);assert.equal(16+13-6,23);
});
function root(u,a,b,c) {const nodes={total:{value:String(u)},a:{value:String(a)},b:{value:String(b)},both:{value:String(c)},board:{innerHTML:''},result:{textContent:''}};return {dataset:{bookModel:'inclusion-four-regions'},nodes,querySelector:s=>s==='[data-inclusion-board]'?nodes.board:s==='[data-book-model-result]'?nodes.result:nodes[s.match(/data-inclusion-(\w+)/)[1]]};}
test('all two-set membership patterns up to 8 people independently verify every region and feasible range',()=>{
 const api=after.AOSHU_FOUNDATION_WIDGETS;assert.ok(api.supports('inclusion-four-regions'));assert.ok(api.supports('percent-base-change'));assert.match(api.markup(unit.model),/aria-live="polite"/);
 let count=0;
 // Enumerate four disjoint buckets; derive A,B from membership, not from the widget formula.
 for(let onlyA=0;onlyA<=8;onlyA++)for(let both=0;both<=8-onlyA;both++)for(let onlyB=0;onlyB<=8-onlyA-both;onlyB++)for(let neither=0;neither<=8-onlyA-both-onlyB;neither++){
  const r=root(onlyA+both+onlyB+neither,onlyA+both,onlyB+both,both);api.update(r);
  const actual=[...r.nodes.board.innerHTML.matchAll(/<strong>(\d+)人<\/strong>/g)].map(x=>Number(x[1]));
  assert.deepEqual(actual,[onlyA,both,onlyB,neither]);assert.equal((r.nodes.board.innerHTML.match(/<i>/g)||[]).length,onlyA+both+onlyB+neither);assert.doesNotMatch(r.nodes.result.textContent,/NaN|Infinity|不可能/);count++;
 }
 assert.equal(count,495);
 for(let u=0;u<=8;u++)for(let a=0;a<=u;a++)for(let b=0;b<=u;b++)for(let c=0;c<=8;c++){
  const r=root(u,a,b,c);api.update(r);let possible=false;
  for(let maskA=0;maskA<(1<<u)&&!possible;maskA++){
   if(maskA.toString(2).replace(/0/g,'').length!==a)continue;
   // WLOG A occupies first a members; B needs c among these and b-c among the rest.
   const inA=Array.from({length:a},(_,i)=>i),outside=Array.from({length:u-a},(_,i)=>i+a);
   possible=c<=inA.length && c<=b && b-c<=outside.length;
   break;
  }
  assert.equal(Boolean(r.nodes.board.innerHTML),possible,`${u},${a},${b},${c}`);
 }
});
test('invalid entries clear stale dots; zero, disjoint and inclusion boundaries render honestly',()=>{
 const api=after.AOSHU_FOUNDATION_WIDGETS,r=root(20,12,15,8);api.update(r);assert.ok(r.nodes.board.innerHTML);
 for(const v of ['', '-1','1.5','61','NaN']){r.nodes.both.value=v;api.update(r);assert.equal(r.nodes.board.innerHTML,'');assert.match(r.nodes.result.textContent,/请输入/);}
 for(const [u,a,b,c] of [[20,12,15,6],[20,12,15,13],[5,6,2,1]]){const s=root(u,a,b,c);api.update(s);assert.equal(s.nodes.board.innerHTML,'');assert.match(s.nodes.result.textContent,/不可能/);}
 for(const [u,a,b,c,text] of [[0,0,0,0,'互不重叠'],[20,8,6,0,'互不重叠'],[20,8,12,8,'完全包含']]){const s=root(u,a,b,c);api.update(s);assert.match(s.nodes.result.textContent,new RegExp(text));}
});
