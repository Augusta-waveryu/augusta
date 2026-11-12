const test = require('node:test'), assert = require('node:assert/strict'), fs = require('node:fs'), vm = require('node:vm'), path = require('node:path');
const target = 'elementary-g4-ratios-units.js', scripts = [...fs.readFileSync(path.join(__dirname, 'textbook.html'), 'utf8').matchAll(/<script src="\/siwei\/([^"]+)"/g)].map(x => x[1]);
function load(include) { const c = { window: {}, document: { getElementById: () => null } }; vm.createContext(c); for (const f of scripts) { if (['textbook.js', 'textbook-overview.js'].includes(f) || (!include && f === target)) continue; vm.runInContext(fs.readFileSync(path.join(__dirname, f), 'utf8'), c, { filename: f }); } return c.window; }
const before = load(false), after = load(true), plain = x => JSON.parse(JSON.stringify(x)), old = before.AOSHU_TEXTBOOK_LESSONS.find(x => x.key === 'g4-15'), current = after.AOSHU_TEXTBOOK_LESSONS.find(x => x.key === 'g4-15'), unit = current.deepUnit;
test('only g4-15 changes; identities, source, prerequisite, route, original example and four answer positions stable', () => {
  assert.equal(after.AOSHU_TEXTBOOK_LESSONS.length, before.AOSHU_TEXTBOOK_LESSONS.length);
  for (const k of ['key', 'title', 'grade', 'n', 'group', 'href', 'link', 'prerequisite', 'source', 'suggestedDifficulty']) assert.deepEqual(current[k], old[k], k);
  for (const lesson of before.AOSHU_TEXTBOOK_LESSONS) if (lesson.key !== 'g4-15') assert.deepEqual(plain(after.AOSHU_TEXTBOOK_LESSONS.find(x => x.key === lesson.key)), plain(lesson), lesson.key);
  assert.equal(unit.example.question, old.deepUnit.example.question);
  for (let i = 0; i < 4; i++) { assert.equal(unit.practices[i].question, old.deepUnit.practices[i].question); assert.deepEqual(plain(unit.practices[i].answers), plain(old.deepUnit.practices[i].answers)); }
  assert.match(unit.scope, /原创/); assert.match(unit.scope, /待核/); assert.match(unit.methodCard.formula, /非零/);
});
test('independent iterative arithmetic, all ratios, finite-prefix counterexample and zero boundary', () => {
  function terms(first, operation, n) { const out = [first]; while (out.length < n) out.push(operation(out.at(-1))); return out; }
  assert.equal(terms(5, x => x * 2, 5).at(-1), 80); assert.equal(terms(64, x => x / 2, 5).at(-1), 4); assert.equal(terms(2, x => x * 3, 5).at(-1), 162);
  assert.deepEqual([6/2, 12/6, 24/12], [3, 2, 2]);
  assert.equal(terms(3, x => x * 2, 6).at(-1), 96); assert.equal(terms(7, x => x * 1, 4).at(-1), 7);
  assert.notEqual(25/12, 2); assert.notEqual(24*2, 24+1); assert.ok(Number.isNaN(0/0)); assert.equal(0*2, 0*3);
  assert.deepEqual(plain(unit.practices.map(p => p.answers[0])), ['80', '4', '162', '否', '96', '7', '否', '不能', '不能']);
  for (const p of unit.practices) for (const k of ['hint', 'wrongFeedback', 'correctFeedback', 'explanation']) assert.ok(p[k].length > 4, k);
  assert.match(unit.methodCard.check, /n−1/); assert.match(unit.concepts.map(x=>x.text).join(' '), /0÷0没有定义/);
});
function root() { const nodes = { choice: {value:'double'}, count:{value:'1'}, stations:{innerHTML:''}, result:{textContent:''} }; return {dataset:{bookModel:'adjacent-ratios'}, nodes, querySelector:s=>({'[data-ratio-case]':nodes.choice,'[data-ratio-count]':nodes.count,'[data-ratio-stations]':nodes.stations,'[data-book-model-result]':nodes.result}[s])}; }
test('all 36 widget states, count clamp and resets; no division by zero or unrelated widget loss', () => {
  const api=after.AOSHU_FOUNDATION_WIDGETS,r=root(),cases={double:[3,6,12,24,48,96],triple:[2,6,18,54,162,486],half:[64,32,16,8,4,2],same:[7,7,7,7,7,7],counter:[3,6,12,25,50,100],zero:[0,0,0,0,0,0]};
  assert.match(api.markup(unit.model), /aria-live="polite"/);
  for(const [key,values] of Object.entries(cases)) { r.nodes.choice.value=key; api.update(r); assert.equal(r.nodes.count.value,'1'); for(let n=1;n<=6;n++){r.nodes.count.value=String(n);api.update(r);assert.equal((r.nodes.stations.innerHTML.match(/<li/g)||[]).length,n);assert.ok(r.nodes.stations.innerHTML.includes(`<strong>${values[n-1]}</strong>`));assert.ok(r.nodes.result.textContent.includes(`走了${n-1}步`));assert.doesNotMatch(r.nodes.stations.innerHTML,/NaN|Infinity/);if(key==='zero'&&n>1)assert.match(r.nodes.stations.innerHTML,/没有定义/);if(key==='counter'&&n>3)assert.match(r.nodes.stations.innerHTML,/25\/12（不是2）/);}}
  for(const [value,expected] of [['99','6'],['-2','1'],['NaN','1'],['1.5','1']]){r.nodes.count.value=value;api.update(r);assert.equal(r.nodes.count.value,expected);}
  assert.ok(api.supports('adjacent-differences'));assert.ok(api.supports('table-logic'));assert.equal(api.supports('no-such-widget'),false);
});
