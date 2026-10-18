const test = require('node:test'), assert = require('node:assert/strict'), fs = require('node:fs'), vm = require('node:vm'), path = require('node:path');
const target = 'elementary-g4-cycles-units.js', scripts = [...fs.readFileSync(path.join(__dirname, 'textbook.html'), 'utf8').matchAll(/<script src="\/siwei\/([^"]+)"/g)].map(x => x[1]);
function load(include) { const c = { window: {}, document: { getElementById: () => null } }; vm.createContext(c); for (const f of scripts) { if (['textbook.js', 'textbook-overview.js'].includes(f) || (!include && f === target)) continue; vm.runInContext(fs.readFileSync(path.join(__dirname, f), 'utf8'), c, { filename: f }); } return c.window; }
const before = load(false), after = load(true), plain = x => JSON.parse(JSON.stringify(x)), old = before.AOSHU_TEXTBOOK_LESSONS.find(x => x.key === 'g4-17'), current = after.AOSHU_TEXTBOOK_LESSONS.find(x => x.key === 'g4-17'), unit = current.deepUnit;
test('only g4-17 changes; identity, routes, source, prerequisite, original example and three practice positions stable', () => {
  assert.equal(after.AOSHU_TEXTBOOK_LESSONS.length, before.AOSHU_TEXTBOOK_LESSONS.length);
  for (const k of ['key', 'title', 'grade', 'n', 'group', 'href', 'link', 'prerequisite', 'source', 'suggestedDifficulty']) assert.deepEqual(current[k], old[k], k);
  for (const lesson of before.AOSHU_TEXTBOOK_LESSONS) if (lesson.key !== 'g4-17') assert.deepEqual(plain(after.AOSHU_TEXTBOOK_LESSONS.find(x => x.key === lesson.key)), plain(lesson), lesson.key);
  assert.equal(unit.example.question, old.deepUnit.example.question);
  for (let i = 0; i < 3; i++) { assert.equal(unit.practices[i].question, old.deepUnit.practices[i].question); assert.deepEqual(plain(unit.practices[i].answers), plain(old.deepUnit.practices[i].answers)); }
  assert.match(unit.scope, /原创/); assert.match(unit.scope, /待核/); assert.equal(unit.references.length, 1);
});
test('independent explicit-list and step-by-step answers, zero boundaries, larger units and finite-prefix alternatives', () => {
  const nth = (group, n) => { const all = []; while (all.length < n) all.push(...group); return all[n - 1]; };
  const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  function walk(n) { let i = 0; for (let step = 0; step < n; step++) i = i === 6 ? 0 : i + 1; return days[i]; }
  const expected = [nth(['A','B','C'], 11), nth(['春','夏','秋','冬'], 21), walk(100), nth(['A','B','C'],12), walk(99), walk(98), '2', '可以', '不能'];
  assert.deepEqual(plain(unit.practices.map(p=>p.answers[0])), expected);
  assert.equal(nth(['红','蓝','蓝'], 10), '红'); assert.equal(nth(['红','蓝','蓝'], 9), '蓝');
  assert.equal(nth(['A','B'], 10), nth(['A','B','A','B'], 10)); assert.notEqual(nth(['A','B'], 4), nth(['A','B','A'], 4));
  assert.notEqual(nth(['A','B'], 5), 'C'); assert.notEqual(walk(7), walk(6));
  for (const p of unit.practices) for (const k of ['hint', 'wrongFeedback', 'correctFeedback', 'explanation']) assert.ok(p[k].length > 4, k);
});
function root() { const nodes = { choice: {value:'beads'}, number:{value:'10'}, label:{textContent:''}, origin:{textContent:''}, cells:{innerHTML:''}, result:{textContent:''} }; return {dataset:{bookModel:'cycle-position'}, nodes, querySelector:s=>({'[data-cycle-case]':nodes.choice,'[data-cycle-number]':nodes.number,'[data-cycle-label]':nodes.label,'[data-cycle-origin]':nodes.origin,'[data-cycle-cells]':nodes.cells,'[data-book-model-result]':nodes.result}[s])}; }
test('all 4001 valid widget states checked by explicit traversal; reset, invalid inputs and delegated widgets', () => {
  const api=after.AOSHU_FOUNDATION_WIDGETS,r=root(),cases={beads:['红','蓝','蓝'],large:['A','B','A','B'],after:['周日','周一','周二','周三','周四','周五','周六'],inclusive:['周日','周一','周二','周三','周四','周五','周六']};
  assert.match(api.markup(unit.model), /aria-live="polite"/);
  let states=0;
  for(const [key,labels] of Object.entries(cases)) {
    r.nodes.choice.value=key; api.update(r); assert.equal(r.nodes.number.value,key==='beads'||key==='large'?'10':'100');
    const min=key==='after'?0:1;
    assert.equal(r.nodes.number.min,String(min));
    const explicit=[];while(explicit.length<1008)explicit.push(...labels);
    for(let n=min;n<=1000;n++) {
      r.nodes.number.value=String(n); api.update(r);const index=key==='after'?n:n-1, expected=explicit[index];
      const target=r.nodes.cells.innerHTML.match(/<li class="is-cycle-target"[^>]*><small>[^<]+<\/small><strong>([^<]+)<\/strong>/);
      assert.equal(target?.[1],expected,`${key}:${n}`);assert.equal((r.nodes.cells.innerHTML.match(/aria-current/g)||[]).length,1);assert.ok(r.nodes.result.textContent.includes(`：${expected}。`));assert.doesNotMatch(r.nodes.result.textContent,/NaN|Infinity/);states++;
    }
    for(const value of ['', '-1', '1.5', '1001', 'NaN', ...(min===1?['0']:[])]){r.nodes.number.value=value;api.update(r);assert.match(r.nodes.result.textContent,/请输入/);assert.doesNotMatch(r.nodes.cells.innerHTML,/aria-current/);}
  }
  assert.equal(states,4001);assert.ok(api.supports('adjacent-ratios'));assert.ok(api.supports('table-logic'));assert.equal(api.supports('no-such-widget'),false);
});
