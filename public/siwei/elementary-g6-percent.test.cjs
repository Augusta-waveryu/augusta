const test=require('node:test'), assert=require('node:assert/strict'), fs=require('node:fs'), path=require('node:path'),vm=require('node:vm');
const target='elementary-g6-percent-units.js', scripts=[...fs.readFileSync(path.join(__dirname,'textbook.html'),'utf8').matchAll(/<script src="\/siwei\/([^"]+)"/g)].map(m=>m[1]);
const plain=x=>JSON.parse(JSON.stringify(x));
function load(include){const c={window:{},document:{getElementById:()=>null}};vm.createContext(c);for(const f of scripts){if(['textbook.js','textbook-overview.js'].includes(f)||(!include&&f===target))continue;vm.runInContext(fs.readFileSync(path.join(__dirname,f),'utf8'),c,{filename:f});}return c.window;}
const before=load(false), after=load(true),old=before.AOSHU_TEXTBOOK_LESSONS.find(x=>x.key==='g6-7'),lesson=after.AOSHU_TEXTBOOK_LESSONS.find(x=>x.key==='g6-7'),unit=lesson.deepUnit;
test('only g6-7 changes; original identity, first question, answers and route preserved',()=>{
 assert.equal(old.deepUnit,null);for(const k of ['key','title','n','grade','group','href','link','source','example','practice','answers','hint','explanation'])assert.deepEqual(plain(lesson[k]),plain(old[k]),k);
 for(const l of before.AOSHU_TEXTBOOK_LESSONS.filter(x=>x.key!=='g6-7'))assert.deepEqual(plain(after.AOSHU_TEXTBOOK_LESSONS.find(x=>x.key===l.key)),plain(l),l.key);
 assert.equal(unit.example.question,old.example);assert.equal(unit.practices[0].question,old.practice);assert.deepEqual(plain(unit.practices[0].answers),plain(old.answers));
 assert.equal(unit.practices.length,8);assert.match(unit.scope,/原创/);assert.match(unit.scope,/待核/);assert.match(lesson.idea,/先修/);
 for(const p of unit.practices)for(const k of ['hint','explanation','correctFeedback','wrongFeedback'])assert.ok(p[k].length>8,k);
});
test('independent rational arithmetic validates examples and practice answers',()=>{
 // Use integer hundredths rather than the model multipliers.
 const expected=[200*15/100,80-80*90/100,64*100/80,(50-40)*100/50,(50-40)*100/40,(100+20)-(100+20)*20/100,100*80/100*90/100,0];
 assert.deepEqual(plain(unit.practices.map(p=>p.answers[0])),expected.map(String));
 assert.equal(80*9/10,72);assert.notEqual(expected[5],100);assert.notEqual(expected[3],expected[4]);assert.equal(0*120/100,0);
});
function root(){const nodes={base:{value:'100'},scenario:{value:'rise-fall'},board:{innerHTML:''},result:{textContent:''}};return {dataset:{bookModel:'percent-base-change'},nodes,querySelector:s=>({'[data-percent-base]':nodes.base,'[data-percent-case]':nodes.scenario,'[data-percent-stations]':nodes.board,'[data-book-model-result]':nodes.result}[s])};}
test('4000 valid model states agree with independent fraction computations; input edges clear stale output',()=>{
 const api=after.AOSHU_FOUNDATION_WIDGETS,r=root();assert.ok(api.supports('percent-base-change'));assert.ok(api.supports('chicken-rabbit-swap'));assert.ok(api.supports('table-logic'));assert.equal(api.supports('unknown'),false);assert.match(api.markup(unit.model),/aria-live="polite"/);
 const rates={'rise-fall':[120,80],discounts:[80,90],'fall-rise':[80,125],zero:[0,120]};let count=0;
 for(const [key,[a,b]]of Object.entries(rates)){r.nodes.scenario.value=key;for(let n=1;n<=1000;n++){
 r.nodes.base.value=String(n);api.update(r);const values=[...r.nodes.board.innerHTML.matchAll(/<strong>([\d.]+)元<\/strong>/g)].map(x=>Number(x[1]));assert.deepEqual(values,[n,n*a/100,n*a*b/10000]);assert.doesNotMatch(r.nodes.result.textContent,/NaN|Infinity/);const widths=[...r.nodes.board.innerHTML.matchAll(/width:([\d.]+)%/g)].map(x=>Number(x[1]));assert.ok(widths.every(x=>x>=0&&x<=100));count++;
 }}assert.equal(count,4000);
 for(const v of ['','0','-1','1.1','1001','NaN']){r.nodes.base.value=v;api.update(r);assert.equal(r.nodes.board.innerHTML,'');assert.match(r.nodes.result.textContent,/请输入/);}
 r.nodes.base.value='100';r.nodes.scenario.value='invalid';api.update(r);assert.equal(r.nodes.board.innerHTML,'');
 r.nodes.scenario.value='zero';api.update(r);assert.match(r.nodes.result.textContent,/不代表从0到正数能定义增长率/);
 r.nodes.scenario.value='fall-rise';api.update(r);assert.match(r.nodes.result.textContent,/正好回到原价/);
});
