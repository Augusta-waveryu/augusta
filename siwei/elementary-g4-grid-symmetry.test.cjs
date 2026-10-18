const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const target='elementary-g4-grid-symmetry-units.js';
const scripts=[...fs.readFileSync(path.join(__dirname,'textbook.html'),'utf8').matchAll(/<script src="\/siwei\/([^\"]+)"/g)].map(x=>x[1]);
function load(include){const c={window:{},document:{getElementById:()=>null}};vm.createContext(c);for(const f of scripts){if(['textbook.js','textbook-overview.js'].includes(f)||(!include&&f===target))continue;vm.runInContext(fs.readFileSync(path.join(__dirname,f),'utf8'),c,{filename:f});}return c.window;}
const before=load(false),after=load(true),plain=x=>JSON.parse(JSON.stringify(x));
const old=before.AOSHU_TEXTBOOK_LESSONS.find(x=>x.key==='g4-10'),current=after.AOSHU_TEXTBOOK_LESSONS.find(x=>x.key==='g4-10'),unit=current.deepUnit;
test('only G4-10 changes; original identity, source, route, example and first self-check retained',()=>{
 assert.equal(old.deepUnit,null);
 for(const key of ['key','title','grade','n','group','href','link','prerequisite','source','suggestedDifficulty'])assert.deepEqual(current[key],old[key],key);
 assert.equal(unit.example.question,old.example);assert.equal(unit.practices[0].question,old.practice);assert.deepEqual(plain(unit.practices[0].answers),plain(old.answers));
 assert.equal(before.AOSHU_TEXTBOOK_LESSONS.length,after.AOSHU_TEXTBOOK_LESSONS.length);
 for(const item of before.AOSHU_TEXTBOOK_LESSONS)if(item.key!=='g4-10')assert.deepEqual(plain(after.AOSHU_TEXTBOOK_LESSONS.find(x=>x.key===item.key)),plain(item),item.key);
});
test('eight progressive answers, worked reasoning and honest original scope',()=>{
 assert.deepEqual(Array.from(unit.practices,p=>p.answers[0]),['(2,3)',String((4+1)*(3+1)),`(${3+(3-1)},2)`,'0','(3,2)',`(2,${3+(3-1)})`,'2','0']);
 for(const p of unit.practices)for(const field of ['hint','wrongFeedback','correctFeedback','explanation'])assert.ok(p[field].length>10,field);
 assert.match(unit.scope,/原创/);assert.match(unit.scope,/版本、页码及逐讲映射待核/);assert.match(unit.scope,/不是教材或杯赛原题/);
 assert.match(unit.concepts[3].text,/不垂直/);assert.match(unit.concepts[5].text,/没有对称轴/);
});
function root(x,y,axis,view){const nodes={x:{value:String(x)},y:{value:String(y)},axis:{value:axis},view:{value:view},plot:{innerHTML:''},result:{textContent:''}};return {dataset:{bookModel:'grid-mirror'},nodes,querySelector(s){return nodes[{'[data-mirror-x]':'x','[data-mirror-y]':'y','[data-mirror-axis]':'axis','[data-mirror-view]':'view','[data-mirror-plot]':'plot','[data-book-model-result]':'result'}[s]];}};}
test('all 294 valid control states preserve perpendicular bisector and exact SVG location',()=>{
 for(let x=0;x<=6;x++)for(let y=0;y<=6;y++)for(const axis of ['vertical','horizontal'])for(const view of ['predict','mirror','counterexample']){
  const r=root(x,y,axis,view);assert.equal(after.AOSHU_FOUNDATION_WIDGETS.update(r),true);
  const counter=view==='counterexample',vertical=counter||axis==='vertical',ax=counter?1:x,ay=counter?2:y;
  const mx=Number(r.dataset.mirrorX),my=Number(r.dataset.mirrorY);
  if(vertical){assert.equal((ax+mx)/2,3);assert.equal(ay,my);assert.equal(6-mx,ax);}else{assert.equal((ay+my)/2,3);assert.equal(ax,mx);assert.equal(6-my,ay);}
  assert.match(r.nodes.plot.innerHTML,new RegExp(`cx="${40+40*ax}" cy="${290-40*ay}"`));
  if(view==='mirror'||counter)assert.match(r.nodes.plot.innerHTML,new RegExp(`rect x="${40+40*mx-8}" y="${290-40*my-8}"`));else assert.doesNotMatch(r.nodes.plot.innerHTML,/<rect/);
  assert.match(r.nodes.plot.innerHTML,/viewBox="0 0 340 335" role="img" aria-label=/);assert.doesNotMatch(r.nodes.plot.innerHTML,/NaN|undefined/);
  if(counter)assert.match(r.nodes.result.textContent,/真正的镜像是A′\(5,2\)/);
 }
 const r=root(6,5,'horizontal','counterexample');after.AOSHU_FOUNDATION_WIDGETS.update(r);
 assert.equal(r.nodes.axis.value,'vertical');assert.equal(r.nodes.x.value,'1');assert.equal(r.nodes.y.value,'2');
 for(const name of ['x','y','axis'])assert.equal(r.nodes[name].disabled,true);
 r.nodes.view.value='mirror';after.AOSHU_FOUNDATION_WIDGETS.update(r);
 for(const name of ['x','y','axis'])assert.equal(r.nodes[name].disabled,false);
 for(const value of ['NaN','-1','8','1.5']){const r=root(value,value,'vertical','mirror');after.AOSHU_FOUNDATION_WIDGETS.update(r);assert.equal(r.dataset.mirrorX,'5');assert.equal(r.dataset.mirrorY,'2');}
});
test('default controls, accessible announcements and old widget delegation',()=>{
 const markup=after.AOSHU_FOUNDATION_WIDGETS.markup(unit.model);assert.match(markup,/data-foundation-model-control/);assert.match(markup,/aria-live="polite"/);
 assert.match(markup,/data-mirror-x[^>]*>[\s\S]*?value="1" selected/);assert.match(markup,/data-mirror-y[^>]*>[\s\S]*?value="2" selected/);
 for(const type of ['angles-relations','perimeter-area-grid','order-operations-path','average-balance','sum-difference-bars','planting-points','pigeonhole-bins']){assert.equal(after.AOSHU_FOUNDATION_WIDGETS.supports(type),true);assert.equal(after.AOSHU_FOUNDATION_WIDGETS.markup({type}),before.AOSHU_FOUNDATION_WIDGETS.markup({type}));}
});
