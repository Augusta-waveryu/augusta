const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const dir = __dirname;
const target = 'elementary-g4-average-units.js';
const html = fs.readFileSync(path.join(dir, 'textbook.html'), 'utf8');
const scripts = [...html.matchAll(/<script src="\/siwei\/([^"]+)"/g)].map(m => m[1]);
const plain = value => JSON.parse(JSON.stringify(value));
function load(includeUnit) {
  const context = {window: {}, document: {getElementById: () => null}};
  vm.createContext(context);
  for (const file of scripts) {
    if (['textbook.js', 'textbook-overview.js'].includes(file)) continue;
    if (!includeUnit && file === target) continue;
    vm.runInContext(fs.readFileSync(path.join(dir, file), 'utf8'), context, {filename: file});
  }
  return context.window;
}
const before = load(false);
const after = load(true);
const unit = after.AOSHU_ELEMENTARY_DEEP_UNITS['4:average'];
const oldLesson = before.AOSHU_TEXTBOOK_LESSONS.find(l => l.key === 'g4-5');
const lesson = after.AOSHU_TEXTBOOK_LESSONS.find(l => l.key === 'g4-5');
test('only g4-5 gains depth; original question, answers, route and source stay', () => {
  assert.equal(oldLesson.deepUnit, null);
  assert.equal(lesson.deepUnit, unit);
  for (const field of ['key','title','source','href','prerequisite','suggestedDifficulty']) assert.equal(lesson[field], oldLesson[field], field);
  assert.equal(unit.example.question, oldLesson.example);
  assert.equal(unit.practices[0].question, oldLesson.practice);
  assert.deepEqual(plain(unit.practices[0].answers), plain(oldLesson.answers));
  assert.equal(after.AOSHU_TEXTBOOK_LESSONS.length, before.AOSHU_TEXTBOOK_LESSONS.length);
  for (const old of before.AOSHU_TEXTBOOK_LESSONS) {
    if (old.key === 'g4-5') continue;
    assert.deepEqual(plain(after.AOSHU_TEXTBOOK_LESSONS.find(l => l.key === old.key)), plain(old), old.key);
  }
});
test('independent arithmetic verifies every practice and both worked diagrams', () => {
  const mean = values => values.reduce((a,b) => a+b, 0) / values.length;
  const total = (average, count) => average * count;
  assert.equal(total(12,4), 48);
  assert.equal(mean([8,10,14,16]), 12);
  const answers = [65/5, mean([8,12,16])-8, (total(10,6)+17)/7, (total(12,4)-21)/3, mean([2,4,12]), mean([1,2]), (2*8+6*12)/(2+6), Number(false)];
  assert.deepEqual(plain(unit.practices.map(p => p.answers[0])), answers.map(String));
  assert.equal(unit.practices[5].answers.includes('3/2'), true);
  assert.equal(8+4,12);
  assert.equal(16-4,12);
  assert.equal(12*3,8+12+16);
  assert.notEqual((8+12)/2, answers[6]);
  assert.equal(mean([0,0,0]), 0);
  assert.equal(Number.isNaN(mean([])), true);
  for (const practice of unit.practices) for (const field of ['hint','wrongFeedback','correctFeedback','explanation']) assert.ok(practice[field]?.length > 5, field);
});
test('independent enumeration checks conservation, bounds, and weighted examples', () => {
  for (let a=0;a<=20;a++) for(let b=0;b<=20;b++) for(let c=0;c<=20;c++) {
    const sum = a+b+c, mean = sum/3;
    assert.ok(mean >= Math.min(a,b,c) && mean <= Math.max(a,b,c));
    const excess = [a,b,c].reduce((s,v) => s+Math.max(v-mean,0),0);
    const lack = [a,b,c].reduce((s,v) => s+Math.max(mean-v,0),0);
    assert.ok(Math.abs(excess-lack)<1e-10);
    assert.ok(Math.abs(mean*3-sum)<1e-10);
  }
  for(let n=1;n<=8;n++) for(let m=1;m<=8;m++) {
    const actual = Array(n).fill(8).concat(Array(m).fill(12));
    const pooled = actual.reduce((s,v) => s+v,0)/(n+m);
    assert.equal(pooled, (n*8+m*12)/(n+m));
    assert.equal(pooled === (8+12)/2, n === m);
  }
});
function modelRoot(caseIndex, view) {
  const nodes = {};
  const node = name => nodes[name] ||= {value: name === 'case' ? String(caseIndex) : view, innerHTML:'', textContent:'', attrs:{}, setAttribute(k,v){this.attrs[k]=v;}};
  return {dataset:{bookModel:'average-balance'},nodes,querySelector(selector){
    const name = {'[data-average-case]':'case','[data-average-view]':'view','[data-average-chart]':'chart','[data-book-model-result]':'result'}[selector];
    assert.ok(name, selector); return node(name);
  }};
}
test('all five data groups and before/after views agree with independent totals', () => {
  const cases = [[8,12,16],[2,4,12],[0,0,0],[1,2],[]];
  for(let i=0;i<cases.length;i++) for(const view of ['before','after']) {
    const root = modelRoot(i,view);
    assert.equal(after.AOSHU_FOUNDATION_WIDGETS.update(root),true);
    const values=cases[i], total=values.reduce((a,b)=>a+b,0), count=values.length;
    assert.equal(root.dataset.averageTotal,String(total));
    assert.equal(root.dataset.averageCount,String(count));
    assert.equal(root.dataset.averageMean,count?String(total/count):'undefined');
    if(!count){assert.match(root.nodes.result.textContent,/不能计算0÷0/);assert.doesNotMatch(root.nodes.chart.innerHTML,/book-average-marker/);continue;}
    const expected=view==='after'?values.map(()=>total/count):values;
    assert.match(root.nodes.chart.attrs['aria-label'],new RegExp(expected.join('、').replace(/\./g,'\\.')));
    assert.equal((root.nodes.chart.innerHTML.match(/book-average-row/g)||[]).length,count);
    assert.equal((root.nodes.chart.innerHTML.match(/book-average-marker/g)||[]).length,count);
    const widths=[...root.nodes.chart.innerHTML.matchAll(/style="width:([\d.]+)%"/g)].map(m=>Number(m[1]));
    assert.deepEqual(widths,expected.map(value=>value/Math.max(1,...values)*100));
    assert.ok(widths.every(w=>w>=0&&w<=100));
    assert.doesNotMatch(root.nodes.result.textContent,/NaN|Infinity/);
  }
});
test('model extension delegates existing widgets and emits accessible controls', () => {
  const widgets = after.AOSHU_FOUNDATION_WIDGETS;
  assert.equal(widgets.supports('average-balance'),true);
  for(const type of ['clock-face','paired-removal','pigeonhole-bins','counterexample-check']) {
    assert.equal(widgets.supports(type),true);
    assert.equal(widgets.markup({type}),before.AOSHU_FOUNDATION_WIDGETS.markup({type}));
  }
  assert.equal(widgets.supports('not-a-model'),false);
  const markup=widgets.markup(unit.model);
  assert.match(markup,/aria-label="平均实验数据组"/);
  assert.match(markup,/aria-label="平均实验展示方式"/);
  assert.match(markup,/aria-live="polite"/);
  assert.match(markup,/操作不计入答题进度/);
  assert.match(unit.scope,/原创/);
  assert.match(unit.scope,/页码与逐讲映射待核/);
  assert.equal(fs.existsSync(path.join(dir,'elementary-g4-average.css')),true);
});
