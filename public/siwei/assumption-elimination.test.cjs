const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {JSDOM}=require('jsdom');
const html=fs.readFileSync(path.join(__dirname,'branch-course.html'),'utf8');
const files=[...html.matchAll(/<script src="\/siwei\/([^"]+)"/g)].map(m=>m[1]);
const plain=x=>JSON.parse(JSON.stringify(x));
function data(include=true){
 const c={window:{},document:{getElementById:()=>null},location:{search:'?branch=algebra'},URLSearchParams};vm.createContext(c);
 for(const f of files)if(!['branch-course.js','geometry-visuals.js'].includes(f)&&(include||f!=='assumption-elimination-enrichment.js'))vm.runInContext(fs.readFileSync(path.join(__dirname,f),'utf8'),c);
 return c.window;
}
function page(saved){
 const dom=new JSDOM(html,{runScripts:'outside-only',pretendToBeVisual:true,url:'http://localhost/siwei/branch-course.html?branch=algebra#bc-topic-assumption-method'});
 dom.window.HTMLElement.prototype.scrollIntoView=function(){};
 if(saved)dom.window.localStorage.setItem('siwei-curriculum-mastery-v1',JSON.stringify(saved));
 for(const f of files)dom.window.eval(fs.readFileSync(path.join(__dirname,f),'utf8'));
 return dom;
}
const get=w=>w.AOSHU_CURRICULUM.find(b=>b.id==='algebra').lessons.find(l=>l.id==='assumption-method');
test('only G5-14 changes, original practice indices preserved, honest source and scope',()=>{
 const before=data(false),after=data();
 for(const b of before.AOSHU_CURRICULUM)for(const l of b.lessons){const n=after.AOSHU_CURRICULUM.find(x=>x.id===b.id).lessons.find(x=>x.id===l.id);if(l.id!=='assumption-method')assert.deepEqual(plain(n),plain(l));}
 assert.deepEqual(plain(get(after).practice.slice(0,3)),plain(get(before).practice));
 assert.deepEqual(plain(get(after).example),plain(get(before).example));
 assert.equal(get(after).practice.length,7);
 for(const key of Object.keys(before.AOSHU_DEEP_LESSONS))if(key!=='assumption-method')assert.deepEqual(plain(after.AOSHU_DEEP_LESSONS[key]),plain(before.AOSHU_DEEP_LESSONS[key]));
 const d=after.AOSHU_DEEP_LESSONS['assumption-method'];assert.equal(d.table.rows.length,4);assert.match(d.idea,/原创.*未核实/);assert.match(d.check,/不代表真实掌握/);assert.match(d.activity.label,/非两单消去模拟/);assert.match(d.boundary.fails.diagnosis,/单价改变/);
});
test('independent exhaustive checks of examples, practice and integer boundary',()=>{
 const solve=(a,b,c,d,t,u)=>{const out=[];for(let x=0;x<=30;x++)for(let y=0;y<=30;y++)if(a*x+b*y===t&&c*x+d*y===u)out.push([x,y]);return out;};
 assert.deepEqual(solve(2,1,2,3,11,17),[[4,3]]);
 assert.deepEqual(solve(3,2,3,5,18,27),[[4,3]]);
 for(const [n,low,high,total,want] of [[6,2,5,24,4],[4,5,8,26,2],[5,3,7,27,3],[8,3,5,34,5]]){const possible=Array.from({length:n+1},(_,k)=>k).filter(k=>k*high+(n-k)*low===total);assert.deepEqual(possible,[want]);}
 const possible=Array.from({length:6},(_,k)=>15+4*k);assert.deepEqual(possible,[15,19,23,27,31,35]);assert.equal(possible.includes(26),false);
 assert.equal(3-2,1);assert.equal(3-1,2);
});
test('feedback, saved progress compatibility, links and shared activity label',async()=>{
 const dom=page(),d=dom.window.document;await new Promise(r=>dom.window.setTimeout(r,150));const scope=d.querySelector('#bc-topic-assumption-method');assert.ok(scope.open);
 const answers=['2','3','5','3','4','0','0'];
 scope.querySelectorAll('.bc-question').forEach((card,i)=>{const input=card.querySelector('input'),button=card.querySelector('button'),feedback=card.querySelector('.bc-answer-feedback');button.click();assert.match(feedback.textContent,/先写一个答案/);input.value='999';button.click();assert.match(feedback.textContent,/还差一点。提示/);assert.equal(feedback.classList.contains('good'),false);input.value=answers[i];button.click();assert.ok(feedback.classList.contains('good'));assert.match(card.querySelector('.bc-solution').textContent,/讲解/);});
 const saved=JSON.parse(dom.window.localStorage.getItem('siwei-curriculum-mastery-v1'));assert.deepEqual(saved['assumption-method'],{passed:[0,1,2,3,4,5,6],done:true});
 const reload=page(saved);assert.equal(reload.window.document.querySelector('#bc-topic-assumption-method .bc-practice-count').textContent,'7/7 完成');
 const legacy=page({'assumption-method':{passed:[0,1,2],done:true},other:{passed:[0],done:false}});assert.equal(legacy.window.document.querySelector('#bc-topic-assumption-method .bc-lesson-status').textContent,'3/7 自测');
 const inp=legacy.window.document.querySelector('#bc-ans-assumption-method-3');inp.value='3';inp.nextElementSibling.click();const migrated=JSON.parse(legacy.window.localStorage.getItem('siwei-curriculum-mastery-v1'));assert.deepEqual(migrated.other,{passed:[0],done:false});assert.equal(migrated['assumption-method'].done,false);
 const links=[...scope.querySelectorAll('.bc-lesson-tools a')];assert.ok(links.some(a=>a.getAttribute('href')==='#bc-lab'&&/非两单消去模拟/.test(a.textContent)&&!a.hasAttribute('data-open-lab')));assert.ok(links.some(a=>a.getAttribute('href')==='#bc-formulas'));assert.ok(links.some(a=>a.getAttribute('href').endsWith('#bc-topic-chicken-rabbit')));
 for(const x of [dom,reload,legacy])x.window.close();
});
