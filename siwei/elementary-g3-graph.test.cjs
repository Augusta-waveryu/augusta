const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = __dirname;
const sentinel = {title:'pre-existing G3 unit must survive merge'};
const context = {window:{
  AOSHU_CURRICULUM:[],
  AOSHU_DEEP_LESSONS:{},
  AOSHU_ELEMENTARY_DEEP_UNITS:{'roadmap:g3-25':sentinel}
}};
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root,'textbook-data.js'),'utf8'),context);
const originalLessons = context.window.AOSHU_TEXTBOOK_LESSONS;
vm.runInContext(fs.readFileSync(path.join(root,'elementary-g3-graph-units.js'),'utf8'),context);
vm.runInContext(fs.readFileSync(path.join(root,'elementary-roadmap-data.js'),'utf8'),context);
const units = context.window.AOSHU_ELEMENTARY_DEEP_UNITS;
const routes = context.window.AOSHU_TEXTBOOK_LESSONS;

function route(key) { return routes.find((lesson) => lesson.key === key); }
function unit(key) { return units[`roadmap:${key}`]; }
function original(n) { return originalLessons.find((lesson) => lesson.n === n); }

function edgeKey(a,b) { return [a,b].sort().join('\u0000'); }

function inspectGraph(edges) {
  const adjacency = new Map();
  const degree = new Map();
  const edgeSet = new Set();
  for (const [a,b] of edges) {
    assert.notEqual(a,b,'a line segment must join two distinct points');
    const key = edgeKey(a,b);
    assert.ok(!edgeSet.has(key),`duplicate source edge ${a}-${b}`);
    edgeSet.add(key);
    for (const point of [a,b]) {
      if (!adjacency.has(point)) adjacency.set(point,new Set());
      if (!degree.has(point)) degree.set(point,0);
    }
    adjacency.get(a).add(b);
    adjacency.get(b).add(a);
    degree.set(a,degree.get(a)+1);
    degree.set(b,degree.get(b)+1);
  }
  const unseen = new Set(adjacency.keys());
  const componentOddCounts = [];
  while (unseen.size) {
    const start = unseen.values().next().value;
    const stack = [start];
    const component = [];
    unseen.delete(start);
    while (stack.length) {
      const point = stack.pop();
      component.push(point);
      for (const neighbor of adjacency.get(point)) {
        if (unseen.delete(neighbor)) stack.push(neighbor);
      }
    }
    componentOddCounts.push(component.filter((point) => degree.get(point) % 2 === 1).length);
  }
  const oddPoints = [...degree].filter(([,count]) => count % 2 === 1).map(([point]) => point);
  return {adjacency,degree,edgeSet,oddPoints,componentOddCounts,components:componentOddCounts.length};
}

function theoreticalMinimum(componentOddCounts) {
  return componentOddCounts.reduce((sum,oddCount) => {
    assert.equal(oddCount % 2,0,'every component must have an even number of odd-degree points');
    return sum + Math.max(1,oddCount / 2);
  },0);
}

function verifyTrails(edges,trails,label) {
  const expected = new Set(edges.map(([a,b]) => edgeKey(a,b)));
  const used = new Map();
  for (const [trailIndex,trail] of trails.entries()) {
    assert.ok(trail.length >= 2,`${label}: trail ${trailIndex + 1} needs at least one edge`);
    for (let i=1;i<trail.length;i++) {
      const key = edgeKey(trail[i-1],trail[i]);
      assert.ok(expected.has(key),`${label}: ${trail[i-1]}-${trail[i]} is not in the graph`);
      used.set(key,(used.get(key) || 0) + 1);
      assert.ok(used.get(key) === 1,`${label}: edge ${trail[i-1]}-${trail[i]} is repeated`);
    }
  }
  assert.deepEqual([...used.keys()].sort(),[...expected].sort(),`${label}: every edge must be used`);
  for (const key of expected) assert.equal(used.get(key),1,`${label}: edge ${key} must be used exactly once`);
}

function verifyGraphCase(check,label) {
  assert.equal(check.mode,'graph-strokes',`${label}: graph verification is declared`);
  const graph = inspectGraph(check.edges);
  assert.equal(graph.oddPoints.length,check.expectedOdd,`${label}: independently counted odd points`);
  assert.equal(graph.components,check.componentCount ?? 1,`${label}: independently counted connected components`);
  const minimum = theoreticalMinimum(graph.componentOddCounts);
  assert.equal(minimum,check.minimumStrokes,`${label}: independently computed minimum number of strokes`);
  assert.equal(check.singleStroke,minimum === 1,`${label}: one-stroke possibility`);
  verifyTrails(check.edges,check.trails,label);
  assert.equal(check.trails.length,minimum,`${label}: the listed construction reaches the minimum`);
}

function strings(value) { return Array.from(value); }

test('G3-9/10 keep the original route IDs, titles, examples, first self-tests, and source boundary', () => {
  assert.strictEqual(units['roadmap:g3-25'],sentinel,'Object.assign must preserve other existing units');
  for (const [key,n,title] of [['g3-9',9,'一笔画'],['g3-10',10,'多笔画']]) {
    const current = route(key);
    const lesson = unit(key);
    const base = original(n);
    assert.equal(current?.key,key,`${key}: route/progress ID`);
    assert.equal(current?.n,n,`${key}: original lesson number`);
    assert.equal(current?.title,title,`${key}: exact live title`);
    assert.equal(lesson.roadmapTitle,title,`${key}: route label stays stable`);
    assert.match(current.source,/公开目录/u);
    assert.match(current.source,/逐讲映射\/页码待核/u);
    assert.match(current.source,/例题与练习为本项目原创/u);
    assert.equal(lesson.example.question,base.example,`${key}: preserve original worked example`);
    assert.equal(lesson.practices[0].question,base.practice,`${key}: preserve original first self-test`);
    assert.deepEqual(strings(lesson.practices[0].answers),strings(base.answers),`${key}: preserve original accepted answers`);
    assert.equal(current.deepUnit,lesson,`${key}: the deep unit is attached to its route`);
    assert.ok(lesson.methodCard && lesson.diagram && lesson.concepts.length >= 4,`${key}: teaching path and diagram`);
    assert.equal(lesson.review.length,3,`${key}: retrieval/return check`);
    for (const [index,practice] of lesson.practices.entries()) {
      assert.ok(practice.level && practice.hint && practice.wrongFeedback && practice.correctFeedback && practice.explanation,
        `${key} practice ${index + 1}: specific hint and feedback`);
    }
  }
  assert.equal(route('g3-10').prerequisiteLinks[0]?.href,'#book-lesson-g3-9');
  assert.equal(route('g3-10').prerequisiteLinks[0]?.label,'3年级第9讲：一笔画');
});

test('every G3-9/10 example and exercise has a verified graph and a minimum-length line-covering decomposition', () => {
  for (const key of ['g3-9','g3-10']) {
    const lesson = unit(key);
    verifyGraphCase(lesson.example.verification,`${key} example`);
    for (const [index,practice] of lesson.practices.entries()) {
      verifyGraphCase(practice.verification,`${key} practice ${index + 1}`);
    }
  }
  assert.equal(unit('g3-9').example.verification.expectedOdd,4);
  assert.equal(unit('g3-9').practices[1].verification.expectedOdd,2);
  assert.equal(unit('g3-9').practices[2].verification.expectedOdd,0);
  assert.equal(unit('g3-9').practices[3].verification.componentCount,2);
  assert.equal(unit('g3-10').example.verification.minimumStrokes,3);
  assert.equal(unit('g3-10').practices[2].verification.minimumStrokes,3);
});

test('accepted answer aliases are unique in meaning and the original answer forms remain unchanged', () => {
  assert.deepEqual(strings(unit('g3-9').practices[0].answers),['4个，不能','4不能','4,不能']);
  assert.deepEqual(strings(unit('g3-10').practices[0].answers),['2','两笔','2笔']);
  for (const [key,index,expected] of [
    ['g3-10',1,'2'],['g3-10',2,'3']
  ]) {
    const answers = strings(unit(key).practices[index].answers);
    const chineseDigits = {'两':'2','三':'3'};
    const canonical = answers.map((answer) => answer.replace(/[两三]/gu,(digit) => chineseDigits[digit]).replace(/[^0-9]/gu,''));
    assert.ok(canonical.every((answer) => answer === expected),`${key} practice ${index + 1}: all formats mean ${expected} strokes`);
    assert.equal(new Set(canonical).size,1,`${key} practice ${index + 1}: numerically unique answer`);
  }
  assert.deepEqual(strings(unit('g3-9').practices[1].answers),['能，2个','能，2','2个，能','能，2个奇点']);
  assert.deepEqual(strings(unit('g3-9').practices[2].answers),['能，0个','0个，能','能，0个奇点','能，零个']);
  assert.deepEqual(strings(unit('g3-9').practices[3].answers),['不能','不行','不能，分开','不能，因为分开']);
});

test('diagrams remain compact for narrow screens and the explanation teaches parity and connectivity', () => {
  for (const key of ['g3-9','g3-10']) {
    const lesson = unit(key);
    assert.ok(lesson.diagram.text.split('\n').every((line) => line.length <= 18),`${key}: diagram lines fit narrow cards`);
  }
  assert.match(unit('g3-9').methodCard.when,/连成一个图形/u);
  assert.match(unit('g3-9').methodCard.check,/分成几块/u);
  assert.ok(unit('g3-9').concepts.some((concept) => concept.title.includes('中间点为什么是偶点')));
  assert.ok(unit('g3-9').practices.some((practice) => practice.question.includes('彼此分开')));
  assert.match(unit('g3-10').methodCard.check,/至少几笔/u);
  assert.ok(unit('g3-10').concepts.some((concept) => concept.title.includes('不是“奇点数就是笔数”')));
});

test('graph-unit script loads after existing modules and before route data and rendering', () => {
  const html = fs.readFileSync(path.join(root,'textbook.html'),'utf8');
  const application = html.indexOf('/siwei/elementary-g3-application-units.js');
  const graph = html.indexOf('/siwei/elementary-g3-graph-units.js');
  const data = html.indexOf('/siwei/textbook-data.js');
  const roadmap = html.indexOf('/siwei/elementary-roadmap-data.js');
  const renderer = html.indexOf('/siwei/textbook.js');
  assert.ok(application >= 0 && application < graph && graph < data && data < roadmap && roadmap < renderer);
});
