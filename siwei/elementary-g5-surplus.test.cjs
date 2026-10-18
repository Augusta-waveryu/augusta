const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const target='elementary-g5-surplus-units.js', html=fs.readFileSync(path.join(__dirname,'textbook.html'),'utf8');
const scripts=[...html.matchAll(/<script src="\/siwei\/([^"]+)"/g)].map(m=>m[1]);
const plain=x=>JSON.parse(JSON.stringify(x));
function load(include){const c={window:{},document:{getElementById:()=>null}};vm.createContext(c);for(const f of scripts){if(['textbook.js','textbook-overview.js'].includes(f)||(!include&&f===target))continue;vm.runInContext(fs.readFileSync(path.join(__dirname,f),'utf8'),c,{filename:f});}return c.window;}
const before=load(false),after=load(true),old=before.AOSHU_TEXTBOOK_LESSONS.find(x=>x.key==='g5-7'),lesson=after.AOSHU_TEXTBOOK_LESSONS.find(x=>x.key==='g5-7'),unit=lesson.deepUnit;
function enumerate(a,r,b,s){const matches=[];for(let n=1;n<=30;n++)for(let total=0;total<=200;total++)if(total-a*n===r&&total-b*n===s)matches.push({n,total});return matches;}
test('only g5-7 is enriched; original question, route, first answer and IDs stay intact',()=>{
 assert.equal(after.AOSHU_TEXTBOOK_LESSONS.length,before.AOSHU_TEXTBOOK_LESSONS.length);
 for(const prev of before.AOSHU_TEXTBOOK_LESSONS){const next=after.AOSHU_TEXTBOOK_LESSONS.find(l=>l.key===prev.key);if(prev.key!=='g5-7')assert.deepEqual(plain(next),plain(prev));}
 for(const key of ['key','n','grade','title','source','example','practice','answers','href','link'])assert.deepEqual(plain(lesson[key]),plain(old[key]),key);
 assert.equal(unit.practices[0].question,old.practice);assert.deepEqual(plain(unit.practices[0].answers),plain(old.answers));
 assert.equal(unit.practices.length,8);assert.ok(unit.concepts.length>=6);assert.ok(unit.review.length>=4);assert.match(unit.scope,/待核/);
 for(const p of unit.practices)for(const key of ['hint','wrongFeedback','correctFeedback','explanation'])assert.ok(p[key]);
});
test('independent enumeration verifies every answer, fixed-total conditions and worked example',()=>{
 assert.deepEqual(enumerate(3,8,5,-2),[{n:5,total:23}]);
 const cases=[[4,6,6,-4],[5,12,7,2],[4,-3,6,-11],[3,6,5,0],[4,5,6,-4],[3,2,5,6]];
 const m=cases.map(c=>enumerate(...c));assert.deepEqual(m.slice(0,4),[[{n:5,total:26}],[{n:5,total:37}],[{n:4,total:13}],[{n:3,total:15}]]);assert.deepEqual(m.slice(4),[[],[]]);
 const duplicate=enumerate(4,6,4,6);assert.ok(duplicate.length>1);
 const answers=[String(m[0][0].n),String(m[0][0].total),...m.slice(1,4).map(x=>String(x[0].n)),'0','0',duplicate.length===1?'1':'0'];
 assert.deepEqual(plain(unit.practices.map(p=>p.answers[0])),answers);
 for(let n=1;n<=30;n++)for(let total=0;total<=150;total++)for(let a=0;a<8;a++)for(let b=a+1;b<9;b++)assert.equal(((total-a*n)-(total-b*n))/(b-a),n);
});
function root(){const nodes={scenario:{value:'mixed'},people:{value:'1'},board:{innerHTML:'',setAttribute(k,v){this[k]=v;},removeAttribute(k){delete this[k];}},result:{textContent:''}};return {nodes,dataset:{bookModel:'surplus-comparison'},querySelector(q){return q==='[data-surplus-case]'?nodes.scenario:q==='[data-surplus-people]'?nodes.people:q==='[data-surplus-board]'?nodes.board:nodes.result;}};}
test('all 32 selectable model states use a shared scale and correct balances',()=>{
 const api=after.AOSHU_FOUNDATION_WIDGETS,r=root();assert.ok(api.supports(unit.model.type));assert.ok(api.supports('chicken-rabbit-swap'));assert.match(api.markup(unit.model),/aria-live="polite"/);
 const cases={mixed:[3,8,5,-2],surplus:[5,12,7,2],shortage:[4,-3,6,-11],exact:[3,6,5,0]};
 for(const [key,c] of Object.entries(cases)){r.nodes.scenario.value=key;const answer=enumerate(...c)[0];for(let n=1;n<=8;n++){
 r.nodes.people.value=String(n);api.update(r);assert.match(r.nodes.board['aria-label'],new RegExp(`预测${n}人`));
 const vals=[...r.nodes.board.innerHTML.matchAll(/：([\d]+)个<\/b>/g)].map(x=>Number(x[1]));assert.deepEqual(vals,[answer.total,c[0]*n,c[2]*n]);
 const widths=[...r.nodes.board.innerHTML.matchAll(/width:([\d.]+)%/g)].map(x=>Number(x[1]));const max=Math.max(...vals);widths.forEach((x,i)=>assert.ok(Math.abs(x-100*vals[i]/max)<1e-9));
 assert.equal(r.nodes.result.textContent.includes('两种分法都对上了'),n===answer.n);assert.doesNotMatch(r.nodes.result.textContent,/NaN|Infinity/);
 }}
 for(const value of ['', '0','-1','2.5','9','NaN']){r.nodes.people.value=value;api.update(r);assert.equal(r.nodes.board.innerHTML,'');assert.match(r.nodes.result.textContent,/有效/);}
 r.nodes.people.value='1';r.nodes.scenario.value='bogus';api.update(r);assert.equal(r.nodes.board.innerHTML,'');
});
test('existing answer handler preserves legacy completion and persists solved indexes through refresh',()=>{
 const source=fs.readFileSync(path.join(__dirname,'textbook.js'),'utf8');
 const normalize=source.slice(source.indexOf('  const normalize ='),source.indexOf('  const searchableText ='));
 const progressFns=source.slice(source.indexOf('  const practiceList ='),source.indexOf('  const grades ='));
 const handler=source.slice(source.indexOf('  function checkAnswer('),source.indexOf("  list.addEventListener('click'"));
 const c={lessons:[lesson],progress:{'g5-7':{done:true},unrelated:{done:true}},keyOf:l=>l.key,saveProgress(){c.saved=JSON.stringify(c.progress)},updateProgress(){}};vm.createContext(c);
 vm.runInContext(normalize+progressFns+handler+'\nthis.api={checkAnswer,solvedFor,legacyDoneFor,isDone,answersMatch};',c);
 assert.equal(c.api.legacyDoneFor(lesson),true);assert.equal(c.api.isDone(lesson),false);assert.deepEqual(plain(c.api.solvedFor(lesson)),[]);
 let value='',feedback={textContent:'',classList:{add(){},remove(){}}},count={textContent:''},hint={open:false};const classes={add(){},toggle(){}};
 const card={classList:classes,querySelector(q){return q.includes('data-book-answer')?{value,focus(){}}:q.includes('data-book-feedback')?feedback:q==='.book-count'?count:q==='.book-state'?{textContent:''}:{classList:classes};},querySelectorAll(){return Array.from({length:8},()=>({querySelector:()=>hint}));}};
 const button={dataset:{bookCheck:'g5-7',bookIndex:'0'},closest:()=>card};
 c.api.checkAnswer(button);assert.match(feedback.textContent,/先写/);assert.equal(c.saved,undefined);
 value='999';c.api.checkAnswer(button);assert.equal(feedback.textContent,unit.practices[0].wrongFeedback);assert.equal(hint.open,true);assert.equal(c.saved,undefined);
 for(let i=0;i<8;i++){button.dataset.bookIndex=String(i);value=unit.practices[i].answers[0];c.api.checkAnswer(button);assert.equal(feedback.textContent,unit.practices[i].correctFeedback);assert.equal(c.api.isDone(lesson),i===7);}
 assert.equal(c.progress['g5-7'].legacyDone,true);assert.deepEqual(plain(c.progress.unrelated),{done:true});
 c.progress=JSON.parse(c.saved);assert.equal(c.api.isDone(lesson),true);assert.deepEqual(plain(c.api.solvedFor(lesson)),[0,1,2,3,4,5,6,7]);assert.equal(c.api.answersMatch('5','10/2'),true);assert.equal(c.api.answersMatch('5','5/0'),false);
});
