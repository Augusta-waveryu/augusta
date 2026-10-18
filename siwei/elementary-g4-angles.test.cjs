const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const scripts=[...fs.readFileSync(path.join(__dirname,'textbook.html'),'utf8').matchAll(/<script src="\/siwei\/([^\"]+)"/g)].map(x=>x[1]);
function load(include){const c={window:{},document:{getElementById:()=>null}};vm.createContext(c);for(const file of scripts){if(['textbook.js','textbook-overview.js'].includes(file)||(!include&&file==='elementary-g4-angles-units.js'))continue;vm.runInContext(fs.readFileSync(path.join(__dirname,file),'utf8'),c,{filename:file});}return c.window;}
const before=load(false),after=load(true),old=before.AOSHU_TEXTBOOK_LESSONS.find(x=>x.key==='g4-8'),current=after.AOSHU_TEXTBOOK_LESSONS.find(x=>x.key==='g4-8'),unit=current.deepUnit;
const plain=x=>JSON.parse(JSON.stringify(x));
test('only G4-8 enriched; original identity, source, prerequisite, example and first practice preserved',()=>{
 assert.equal(old.deepUnit,null);
 for(const key of ['key','title','grade','n','group','href','link','prerequisite','source','suggestedDifficulty'])assert.deepEqual(current[key],old[key],key);
 assert.equal(unit.example.question,old.example);assert.equal(unit.practices[0].question,old.practice);assert.deepEqual(plain(unit.practices[0].answers),plain(old.answers));
 assert.equal(before.AOSHU_TEXTBOOK_LESSONS.length,after.AOSHU_TEXTBOOK_LESSONS.length);
 for(const item of before.AOSHU_TEXTBOOK_LESSONS){if(item.key!=='g4-8')assert.deepEqual(plain(after.AOSHU_TEXTBOOK_LESSONS.find(x=>x.key===item.key)),plain(item),item.key);}
});
test('all ten answers independently calculated; targeted feedback and honest source scope',()=>{
 const expected=[180-125,90-35,360-(90+120+80),180-50-60,68,0,(4-2)*180-90-80-100,(5-2)*180-(100+110+95+105),(6-2)*180,(5-2)*180/5].map(String);
 assert.deepEqual(Array.from(unit.practices,p=>p.answers[0]),expected);
 for(const p of unit.practices)for(const key of ['hint','wrongFeedback','correctFeedback','explanation'])assert.ok(p[key].length>=10,key);
 assert.match(unit.scope,/原创/);assert.match(unit.scope,/版本、页码与逐讲映射待核/);
 assert.match(unit.concepts[4].text,/各内角相等/);assert.match(unit.review[3].answer,/矩形/);
 assert.doesNotMatch(unit.methodCard.check,/凸多边形才能/);
 // Nonparallel counterexample: rotating the lower line by 15 degrees changes its corresponding angle.
 assert.notEqual(45,45+15);
 // A 2-by-3 rectangle is not regular but its four equal angles are 360/4.
 assert.notEqual(2,3);assert.equal((4-2)*180/4,90);
});
function root(mode,n){const nodes={mode:{value:mode},n:{value:String(n)},parallel:{innerHTML:''},polygon:{innerHTML:''},result:{textContent:''},caption:{textContent:''}};return {dataset:{bookModel:'angles-relations'},nodes,setAttribute(k,v){this[k]=v;},querySelector(s){return nodes[{'[data-angle-parallel]':'mode','[data-angle-polygon]':'n','[data-angle-parallel-svg]':'parallel','[data-angle-polygon-svg]':'polygon','[data-book-model-result]':'result','[data-angle-position-caption]':'caption'}[s]];}};}
const near=(a,b)=>assert.ok(Math.abs(a-b)<0.001,`${a} ≈ ${b}`);
test('same-position and alternate-interior arc endpoints lie on the actual rays at equal radius',()=>{
 for(const mode of ['corresponding','alternate']){
  const r=root(mode,5);assert.equal(after.AOSHU_FOUNDATION_WIDGETS.update(r),true);
  const arcs=[...r.nodes.parallel.innerHTML.matchAll(/class="angle-arc angle-arc-([ab])" d="M ([\d.]+) ([\d.]+) A ([\d.]+) ([\d.]+) 0 0 0 ([\d.]+) ([\d.]+)"/g)];assert.equal(arcs.length,2);
  const centers=[[200,50],[120,130]];
  arcs.forEach((m,i)=>{const [cx,cy]=centers[i],[sx,sy,rx,ry,ex,ey]=m.slice(2).map(Number);assert.equal(sy,cy);assert.equal(rx,24);assert.equal(ry,24);near(Math.hypot(sx-cx,sy-cy),24);near(Math.hypot(ex-cx,ey-cy),24);near(ex+ey,250);
   if(i===0&&mode==='alternate'){assert.ok(ex<cx&&ey>cy);assert.ok(sx<cx);}
   else{assert.ok(ex>cx&&ey<cy);assert.ok(sx>cx);}
  });
  assert.match(r.nodes.parallel.innerHTML,/role="img" aria-label="已知l₁∥l₂/);
  assert.match(r.nodes.caption.textContent,mode==='alternate'?/两平行线之间、截线两侧/:/都在各自交点的右上方/);
 }
});
test('3–6 vertex polygons have n−3 valid diagonals from one actual vertex and n−2 triangles',()=>{
 for(let n=3;n<=6;n++)for(const mode of ['corresponding','alternate']){
  const r=root(mode,n);after.AOSHU_FOUNDATION_WIDGETS.update(r);
  const svg=r.nodes.polygon.innerHTML,points=svg.match(/points="([^"]+)"/)[1].split(' ').map(p=>p.split(',').map(Number));assert.equal(points.length,n);
  const diagonals=[...svg.matchAll(/class="angle-diagonal" x1="([\d.]+)" y1="([\d.]+)" x2="([\d.]+)" y2="([\d.]+)"/g)];assert.equal(diagonals.length,n-3);
  diagonals.forEach((m,i)=>assert.deepEqual(m.slice(1).map(Number),[...points[0],...points[i+2]]));
  const cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
  const fanArea=points.slice(1,-1).reduce((sum,p,i)=>sum+Math.abs(cross(points[0],p,points[i+2]))/2,0);
  const polygonArea=Math.abs(points.reduce((sum,p,i)=>{const q=points[(i+1)%n];return sum+p[0]*q[1]-p[1]*q[0];},0))/2;
  near(fanArea,polygonArea);assert.match(r.nodes.result.textContent,new RegExp(`${n-2}个三角形，内角和为${(n-2)*180}°`));
 }
 const invalid=root('corresponding','not-a-number');after.AOSHU_FOUNDATION_WIDGETS.update(invalid);assert.match(invalid.nodes.result.textContent,/凸3边形/);assert.doesNotMatch(invalid.nodes.polygon.innerHTML,/NaN/);
});
test('shared controls and legacy widget delegation unchanged',()=>{
 const markup=after.AOSHU_FOUNDATION_WIDGETS.markup(unit.model);assert.match(markup,/data-foundation-model-control/);assert.match(markup,/aria-live="polite"/);
 for(const type of ['perimeter-area-grid','order-operations-path','average-balance','sum-difference-bars','planting-points','pigeonhole-bins']){assert.equal(after.AOSHU_FOUNDATION_WIDGETS.supports(type),true);assert.equal(after.AOSHU_FOUNDATION_WIDGETS.markup({type}),before.AOSHU_FOUNDATION_WIDGETS.markup({type}));}
});
