const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const target='elementary-g4-enumeration-units.js';
const scripts=[...fs.readFileSync(path.join(__dirname,'textbook.html'),'utf8').matchAll(/<script src="\/siwei\/([^"]+)"/g)].map(m=>m[1]);
function load(include){const c={window:{},document:{getElementById:()=>null}};vm.createContext(c);for(const f of scripts){if(['textbook.js','textbook-overview.js','elementary-foundation-models.js'].includes(f)||(!include&&f===target))continue;vm.runInContext(fs.readFileSync(path.join(__dirname,f),'utf8'),c);}return c.window;}
const before=load(false),after=load(true),unit=after.AOSHU_ELEMENTARY_DEEP_UNITS['4:systematic-counting'];
const old=before.AOSHU_TEXTBOOK_LESSONS.find(l=>l.key==='g4-11');
const current=after.AOSHU_TEXTBOOK_LESSONS.find(l=>l.key==='g4-11');
const plain=x=>JSON.parse(JSON.stringify(x));
test('only g4-11 gains depth; original question, ID, source, prerequisites and link retained',()=>{
 assert.equal(old.deepUnit,null);assert.equal(current.deepUnit,unit);
 const identity=l=>[l.key,l.grade,l.n,l.title,l.group,l.href,l.source,l.prerequisite,l.practice,l.answers];
 assert.deepEqual(plain(after.AOSHU_TEXTBOOK_LESSONS.map(identity)),plain(before.AOSHU_TEXTBOOK_LESSONS.map(identity)));
 assert.equal(unit.example.question,old.example);assert.equal(unit.practices[0].question,old.practice);assert.deepEqual(plain(unit.practices[0].answers),plain(old.answers));
 for(const l of before.AOSHU_TEXTBOOK_LESSONS)if(l.key!=='g4-11')assert.deepEqual(plain(after.AOSHU_TEXTBOOK_LESSONS.find(x=>x.key===l.key)),plain(l));
});
function numbers(digits,repeat=false,even=false){const out=[];for(let n=10;n<100;n++){const a=Math.floor(n/10),b=n%10;if(digits.includes(a)&&digits.includes(b)&&(repeat||a!==b)&&(!even||n%2===0))out.push(n);}return out;}
test('independently enumerate all answers from problem conditions',()=>{
 assert.deepEqual(numbers([1,2,3]),[12,13,21,23,31,32]);
 assert.deepEqual(numbers([0,1,2]),[10,12,20,21]);
 assert.deepEqual(numbers([1,2,3],true),[11,12,13,21,22,23,31,32,33]);
 const teams=new Set();for(const a of ['甲','乙','丙','丁'])for(const b of ['甲','乙','丙','丁'])if(a!==b)teams.add([a,b].sort().join(''));
 assert.deepEqual(numbers([0,1,2,3],false,true),[10,12,20,30,32]);
 const missing=numbers([1,2,3]).filter(n=>![12,13,21,23,31].includes(n));assert.deepEqual(missing,[32]);
 const expected=[numbers([1,2,3,4]).length,numbers([0,1,2]).length,numbers([1,2,3],true).length,teams.size,numbers([0,1,2,3],false,true).length,missing[0]];
 assert.deepEqual(expected,[12,4,9,6,5,32]);unit.practices.forEach((p,i)=>assert.deepEqual(plain(p.answers),[String(expected[i])]));
});
test('teaching loop includes place-value visual, conditions, boundaries, feedback and review',()=>{
 assert.equal(unit.practices.length,6);assert.ok(unit.concepts.length>=5);assert.ok(unit.example.steps.length>=4);assert.equal(unit.diagrams.length,2);
 assert.match(unit.scope,/本站原创/);assert.match(unit.scope,/待核/);assert.match(unit.methodCard.when,/互不重叠.*覆盖全部/);
 assert.match(unit.diagrams[1].text,/01不是两位数/);assert.match(unit.practices[3].explanation,/甲乙.*甲丙.*甲丁/);
 assert.ok(unit.review.length>=4);for(const p of unit.practices)for(const f of ['level','question','hint','wrongFeedback','correctFeedback','explanation'])assert.ok(p[f]);
});
