const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const target='elementary-g5-path-counting-units.js';
const scripts=[...fs.readFileSync(path.join(__dirname,'textbook.html'),'utf8').matchAll(/<script src="\/siwei\/([^"]+)"/g)].map(m=>m[1]);
function load(include){const c={window:{},document:{getElementById:()=>null}};vm.createContext(c);for(const f of scripts){if(['textbook.js','textbook-overview.js','elementary-foundation-models.js'].includes(f)||(!include&&f===target))continue;vm.runInContext(fs.readFileSync(path.join(__dirname,f),'utf8'),c);}return c.window;}
const before=load(false),after=load(true),unit=after.AOSHU_ELEMENTARY_DEEP_UNITS['5:path-counting'];
const old=before.AOSHU_TEXTBOOK_LESSONS.find(l=>l.key==='g5-12');
const current=after.AOSHU_TEXTBOOK_LESSONS.find(l=>l.key==='g5-12');
const plain=x=>JSON.parse(JSON.stringify(x));

test('only g5-12 gains path-counting depth; original lesson data is retained',()=>{
 assert.equal(old.deepUnit,null);assert.equal(current.deepUnit,unit);
 assert.equal(current.title,old.title);assert.equal(unit.example.question,old.example);
 assert.equal(unit.practices[0].question,old.practice);assert.deepEqual(plain(unit.practices[0].answers),plain(old.answers));
 assert.equal(current.href,old.href);assert.equal(current.source,old.source);
 const identity=l=>[l.key,l.grade,l.n,l.title,l.group,l.href,l.source,l.prerequisite,l.practice,l.answers];
 assert.deepEqual(plain(identity(current)),plain(identity(old)));
 for(const l of before.AOSHU_TEXTBOOK_LESSONS)if(l.key!=='g5-12'){
   const next=after.AOSHU_TEXTBOOK_LESSONS.find(x=>x.key===l.key);
   assert.deepEqual(plain(next),plain(l));
 }
});

function countDFS(rows,cols,blocked=[]){
 const ban=new Set(blocked.map(([x,y])=>`${x},${y}`));
 function visit(x,y){
   if(x<0||y<0||x>cols||y>rows||ban.has(`${x},${y}`))return 0;
   if(x===cols&&y===rows)return 1;
   return visit(x+1,y)+visit(x,y+1);
 }
 return visit(0,0);
}
function countRecurrence(rows,cols,blocked=[]){
 const ban=new Set(blocked.map(([x,y])=>`${x},${y}`)),ways=Array.from({length:rows+1},()=>Array(cols+1).fill(0));
 for(let y=0;y<=rows;y++)for(let x=0;x<=cols;x++){
   if(ban.has(`${x},${y}`))continue;
   ways[y][x]=(x===0&&y===0)?1:(x?ways[y][x-1]:0)+(y?ways[y-1][x]:0);
 }
 return ways[rows][cols];
}

test('independently enumerate the six answers by DFS and recurrence',()=>{
 const cases=[
   [1,3,[],4],
   [2,2,[],6],
   [2,2,[[1,1]],2],
   [2,3,[],10],
   [2,3,[[1,1]],4],
   [2,2,[[1,0],[0,1]],0]
 ];
 const expected=cases.map(([rows,cols,blocked,want])=>{
   assert.equal(countDFS(rows,cols,blocked),want);
   assert.equal(countRecurrence(rows,cols,blocked),want);
   return String(want);
 });
 assert.deepEqual(plain(unit.practices.map(p=>p.answers)),expected.map(answer=>[answer]));
});

test('path-counting teaching loop contains concepts, diagrams, feedback and review',()=>{
 assert.equal(unit.practices.length,6);assert.ok(unit.concepts.length>=5);assert.ok(unit.diagrams.length>=3);
 assert.ok(unit.review.length>=4);assert.match(unit.scope,/本站原创/);assert.match(unit.scope,/待核/);
 for(const p of unit.practices)for(const f of ['level','question','hint','wrongFeedback','correctFeedback','explanation'])assert.ok(p[f]);
});
