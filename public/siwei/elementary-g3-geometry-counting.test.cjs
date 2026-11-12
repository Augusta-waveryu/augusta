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
vm.runInContext(fs.readFileSync(path.join(root,'elementary-g3-geometry-counting-units.js'),'utf8'),context);
vm.runInContext(fs.readFileSync(path.join(root,'elementary-roadmap-data.js'),'utf8'),context);
const units = context.window.AOSHU_ELEMENTARY_DEEP_UNITS;
const routes = context.window.AOSHU_TEXTBOOK_LESSONS;

function route(key) { return routes.find((lesson) => lesson.key === key); }
function unit(key) { return units[`roadmap:${key}`]; }
function original(n) { return originalLessons.find((lesson) => lesson.n === n); }
function strings(value) { return Array.from(value); }

function enumerateSegments(pointNames) {
  const labels = Array.from(pointNames);
  const pairs = [];
  const groupCounts = [];
  for (let left=0;left<labels.length;left++) {
    let count = 0;
    for (let right=left+1;right<labels.length;right++) {
      pairs.push([left,right]);
      count += 1;
    }
    if (left < labels.length - 1) groupCounts.push(count);
  }
  return {labels,pairs,groupCounts};
}

function verifySegmentCase(check,label) {
  assert.equal(check.kind,'line-segment-count',`${label}: declares a collinear-endpoint count`);
  const result = enumerateSegments(check.points);
  assert.equal(new Set(result.labels).size,result.labels.length,`${label}: point labels are distinct`);
  const keys = result.pairs.map(([left,right]) => `${result.labels[left]}|${result.labels[right]}`);
  assert.equal(new Set(keys).size,keys.length,`${label}: every endpoint pair is generated once`);
  assert.equal(result.pairs.length,check.expectedSegments,`${label}: independently enumerated all segments`);
  if (check.groupCounts) assert.deepEqual(result.groupCounts,Array.from(check.groupCounts),`${label}: left-endpoint group sizes`);
  if (check.adjacentSegments !== undefined) {
    const adjacent = result.pairs.filter(([left,right]) => right-left === 1).length;
    assert.equal(adjacent,check.adjacentSegments,`${label}: independently counted adjacent small segments`);
  }
  if (check.expectedAnswer !== undefined) {
    const selected = check.excludeAdjacent
      ? result.pairs.filter(([left,right]) => right-left > 1)
      : result.pairs;
    assert.equal(selected.length,check.expectedAnswer,`${label}: independently verified requested answer`);
  }
}

function enumerateRectangles(rows,columns) {
  const rectangles = [];
  const byHeight = new Map();
  for (let top=0;top<rows;top++) {
    for (let bottom=top+1;bottom<=rows;bottom++) {
      for (let left=0;left<columns;left++) {
        for (let right=left+1;right<=columns;right++) {
          rectangles.push(`${top},${bottom},${left},${right}`);
          const height = bottom-top;
          byHeight.set(height,(byHeight.get(height) || 0) + 1);
        }
      }
    }
  }
  return {rectangles,byHeight};
}

function verifyRectangleCase(check,label) {
  assert.equal(check.kind,'grid-rectangles',`${label}: declares a grid-boundary rectangle count`);
  const result = enumerateRectangles(check.rows,check.columns);
  assert.equal(new Set(result.rectangles).size,result.rectangles.length,`${label}: boundary quadruples are unique`);
  assert.equal(result.rectangles.length,check.expectedRectangles,`${label}: independently enumerated all rectangles, including squares`);
  return result;
}

function canonicalAnswer(answer) {
  const digits = {'零':'0','一':'1','二':'2','两':'2','三':'3','四':'4','五':'5','六':'6','七':'7','八':'8','九':'9'};
  return String(answer).replace(/[零一二两三四五六七八九]/gu,(digit) => digits[digit]).replace(/[^0-9-]/gu,'');
}

test('G3-12/13 keep original route IDs, titles, examples, first self-tests, and source boundary', () => {
  assert.strictEqual(units['roadmap:g3-25'],sentinel,'merging the new units must preserve unrelated G3 units');
  for (const [key,n,title] of [['g3-12',12,'数线段'],['g3-13',13,'数图形']]) {
    const current = route(key);
    const lesson = unit(key);
    const base = original(n);
    assert.equal(current?.key,key,`${key}: stable route/progress ID`);
    assert.equal(current?.n,n,`${key}: original route number`);
    assert.equal(current?.title,title,`${key}: exact route title`);
    assert.equal(lesson.roadmapTitle,title,`${key}: route label stays stable`);
    assert.equal(current?.goal,base.goal,`${key}: retain the original learning goal`);
    assert.equal(current?.href,base.href,`${key}: retain the original related-topic URL`);
    assert.match(current.source,/公开目录/u);
    assert.match(current.source,/逐讲映射\/页码待核/u);
    assert.match(current.source,/例题与练习为本项目原创/u);
    assert.equal(lesson.example.question,base.example,`${key}: preserve the original worked-example question`);
    assert.deepEqual(strings(lesson.example.steps).slice(0,strings(base.steps).length),strings(base.steps),`${key}: preserve the original worked-example steps`);
    assert.equal(lesson.practices[0].question,base.practice,`${key}: preserve the original first self-test`);
    assert.deepEqual(strings(lesson.practices[0].answers),strings(base.answers),`${key}: preserve the original accepted answers`);
    assert.equal(lesson.practices[0].hint,base.hint,`${key}: preserve the original hint`);
    assert.ok(lesson.practices[0].explanation.includes(base.explanation),`${key}: retain the original explanation inside the expanded solution`);
    assert.strictEqual(current.deepUnit,lesson,`${key}: deep unit is attached to the original route`);
    assert.ok(lesson.methodCard && lesson.concepts.length >= 4,`${key}: explicit child-level teaching path`);
    assert.equal(lesson.review.length,3,`${key}: retrieval/return check`);
    assert.equal(lesson.practices.length,3,`${key}: progressive practice set`);
    for (const [index,practice] of lesson.practices.entries()) {
      assert.ok(practice.level && practice.hint && practice.wrongFeedback && practice.correctFeedback && practice.explanation,
        `${key} practice ${index + 1}: level, specific hint, wrong/correct feedback, and solution`);
    }
  }
  assert.equal(route('g3-13').prerequisiteLinks[0]?.href,'#book-lesson-g3-12');
  assert.equal(route('g3-13').prerequisiteLinks[0]?.label,'3年级第12讲：数线段');
  assert.match(route('g3-13').prerequisite,/不是硬性前置/u);
});

test('all line-segment examples and exercises are independently enumerated by endpoint pairs', () => {
  const lesson = unit('g3-12');
  verifySegmentCase(lesson.example.verification,'G3-12 worked example');
  for (const [index,practice] of lesson.practices.entries()) {
    verifySegmentCase(practice.verification,`G3-12 practice ${index + 1}`);
  }
  assert.deepEqual(strings(unit('g3-12').example.verification.groupCounts),[4,3,2,1]);
  assert.equal(unit('g3-12').practices[1].verification.expectedAnswer,6,'five points contain six non-adjacent endpoint pairs');
  assert.deepEqual(strings(unit('g3-12').practices[2].verification.groupCounts),[6,5,4,3,2,1]);
});

test('all grid-rectangle examples and exercises are independently enumerated from four boundaries', () => {
  const lesson = unit('g3-13');
  verifyRectangleCase(lesson.example.verification,'G3-13 worked example');
  const cases = [];
  for (const [index,practice] of lesson.practices.entries()) {
    cases.push(verifyRectangleCase(practice.verification,`G3-13 practice ${index + 1}`));
  }
  assert.deepEqual([...cases[1].byHeight.entries()].sort((a,b) => a[0]-b[0]),[[1,6],[2,3]],'2×2 grid groups by height as 6+3');
  assert.deepEqual([...cases[2].byHeight.entries()].sort((a,b) => a[0]-b[0]),[[1,20],[2,10]],'2×4 grid has three height placements with ten widths each');
});

test('accepted answer aliases have one numerical meaning and match the independently counted result', () => {
  for (const key of ['g3-12','g3-13']) {
    const lesson = unit(key);
    for (const [index,practice] of lesson.practices.entries()) {
      const expected = practice.verification.expectedAnswer ?? practice.verification.expectedRectangles;
      const answers = strings(practice.answers).map(canonicalAnswer);
      assert.ok(answers.every((answer) => answer === String(expected)),`${key} practice ${index + 1}: every accepted form means ${expected}`);
      assert.equal(new Set(answers).size,1,`${key} practice ${index + 1}: answer is unique`);
    }
  }
  assert.deepEqual(strings(unit('g3-12').practices[0].answers),['6','六条','6条']);
  assert.deepEqual(strings(unit('g3-13').practices[0].answers),['3','三个','3个']);
});

test('diagrams fit narrow cards and the method explicitly transfers from segments to rectangle boundaries', () => {
  const lineUnit = unit('g3-12');
  const rectangleUnit = unit('g3-13');
  const diagrams = [lineUnit.diagram,...strings(rectangleUnit.diagrams)];
  for (const [index,diagram] of diagrams.entries()) {
    assert.ok(strings(diagram.text.split('\n')).every((line) => line.length <= 18),`diagram ${index + 1}: lines fit narrow screens`);
  }
  assert.match(lineUnit.methodCard.check,/长线段/u);
  assert.match(rectangleUnit.methodCard.check,/两条横边界和两条竖边界/u);
  assert.ok(rectangleUnit.concepts.some((concept) => concept.text.includes('数线段')),'G3-13 makes the prerequisite transfer explicit');
  assert.match(rectangleUnit.scope,/正方形也算长方形/u);
});

test('the new geometry-counting module loads after existing G3 units and before route construction', () => {
  const html = fs.readFileSync(path.join(root,'textbook.html'),'utf8');
  const application = html.indexOf('/siwei/elementary-g3-application-units.js');
  const graph = html.indexOf('/siwei/elementary-g3-graph-units.js');
  const geometryCounting = html.indexOf('/siwei/elementary-g3-geometry-counting-units.js');
  const data = html.indexOf('/siwei/textbook-data.js');
  const roadmap = html.indexOf('/siwei/elementary-roadmap-data.js');
  const renderer = html.indexOf('/siwei/textbook.js');
  assert.ok(application >= 0 && application < graph && graph < geometryCounting && geometryCounting < data && data < roadmap && roadmap < renderer);
});
