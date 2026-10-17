const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = __dirname;
const unrelated = {title:'pre-existing unrelated unit'};
const context = {window:{
  AOSHU_CURRICULUM:[],
  AOSHU_DEEP_LESSONS:{},
  AOSHU_ELEMENTARY_DEEP_UNITS:{'roadmap:g3-25':unrelated}
}};
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root,'textbook-data.js'),'utf8'),context);
const originalLessons = context.window.AOSHU_TEXTBOOK_LESSONS;
vm.runInContext(fs.readFileSync(path.join(root,'elementary-g3-geometry-counting-units.js'),'utf8'),context);
const geometryUnits = context.window.AOSHU_ELEMENTARY_DEEP_UNITS;
const existing12 = geometryUnits['roadmap:g3-12'];
const existing13 = geometryUnits['roadmap:g3-13'];
vm.runInContext(fs.readFileSync(path.join(root,'elementary-g3-cut-and-paste-units.js'),'utf8'),context);
vm.runInContext(fs.readFileSync(path.join(root,'elementary-roadmap-data.js'),'utf8'),context);
const units = context.window.AOSHU_ELEMENTARY_DEEP_UNITS;
const routes = context.window.AOSHU_TEXTBOOK_LESSONS;

function route(key) { return routes.find((lesson) => lesson.key === key); }
function original(n) { return originalLessons.find((lesson) => lesson.n === n); }
function unit() { return units['roadmap:g3-14']; }
function nativeGrid(grid) { return Array.from(grid, (row) => Array.from(row)); }
function canonicalAnswer(answer) { return String(answer).replace(/[^0-9-]/gu,''); }

function verifyCutAndPaste(check,label) {
  assert.equal(check.kind,'cut-and-paste-grid-area',`${label}: specifies a concrete grid cut-and-paste`);
  const sourceArea = check.source.width * check.source.height;
  const pieceArea = Array.from(check.pieces).reduce((sum,piece) => sum + piece.width * piece.height * piece.count,0);
  const targetArea = check.target.width * check.target.height;
  assert.equal(sourceArea,check.expectedArea,`${label}: source area independently calculated`);
  assert.equal(pieceArea,check.expectedArea,`${label}: areas of all complete pieces independently summed`);
  assert.equal(targetArea,check.expectedArea,`${label}: target rectangle independently calculated`);
  const grid = nativeGrid(check.layout);
  assert.equal(grid.length,check.target.height,`${label}: arrangement has the stated height`);
  assert.ok(grid.every((row) => row.length === check.target.width),`${label}: every row has the stated width`);
  const counts = {};
  for (const row of grid) for (const cell of row) counts[cell] = (counts[cell] || 0) + 1;
  for (const piece of check.pieces) {
    assert.equal(counts[piece.label],piece.width * piece.height * piece.count,`${label}: each labelled piece is used exactly once`);
  }
  assert.equal(Object.values(counts).reduce((sum,count) => sum + count,0),targetArea,`${label}: layout has no extra or missing cells`);
  return grid;
}

test('G3-14 keeps the original route, goal, idea, example, source boundary, and first self-test', () => {
  assert.strictEqual(units['roadmap:g3-12'],existing12,'adding G3-14 must preserve the existing G3-12 unit');
  assert.strictEqual(units['roadmap:g3-13'],existing13,'adding G3-14 must preserve the existing G3-13 unit');
  assert.strictEqual(units['roadmap:g3-25'],unrelated,'adding G3-14 must preserve an unrelated pre-existing unit');
  const current = route('g3-14');
  const base = original(14);
  const lesson = unit();
  assert.equal(current?.key,'g3-14','stable route/progress ID');
  assert.equal(current?.n,14,'stable route number');
  assert.equal(current?.title,'图形的剪拼','preserve exact original title');
  assert.equal(lesson.roadmapTitle,current.title,'deep unit maps to original route title');
  assert.equal(current.goal,base.goal,'preserve original learning goal');
  assert.equal(current.idea,base.idea,'preserve original learning idea');
  assert.equal(current.href,base.href,'preserve the existing related-topic URL');
  assert.equal(current.link,base.link,'preserve the existing related-topic label');
  assert.match(current.source,/公开目录/u);
  assert.match(current.source,/逐讲映射\/页码待核/u);
  assert.match(current.source,/例题与练习为本项目原创/u);
  assert.equal(current.example,base.example,'preserve original worked-example prompt');
  const originalSteps = Array.from(base.steps);
  const expandedSteps = Array.from(current.steps);
  let previousIndex = -1;
  for (const step of originalSteps) {
    const index = expandedSteps.indexOf(step);
    assert.ok(index > previousIndex,`preserve original example step in order: ${step}`);
    previousIndex = index;
  }
  assert.equal(lesson.example.question,base.example,'keep original prompt while elaborating it');
  const first = lesson.practices[0];
  assert.equal(first.question,base.practice,'deep practice keeps original first self-test verbatim');
  assert.deepEqual(Array.from(first.answers),Array.from(base.answers),'keep original accepted answers');
  assert.equal(first.hint,base.hint,'keep original hint');
  assert.ok(first.explanation.includes(base.explanation),'expanded solution retains original explanation');
  assert.equal(lesson.practices.length,3,'provide progressive practice');
  assert.equal(lesson.review.length,3,'provide a retrieval/return check');
  for (const [index,practice] of lesson.practices.entries()) {
    assert.ok(practice.level && practice.hint && practice.wrongFeedback && practice.correctFeedback && practice.explanation,
      `practice ${index + 1}: level, specific hint, wrong/correct feedback, and solution`);
  }
});

test('the original 8×3 example now has a concrete cut line and a valid 4×6 arrangement', () => {
  const lesson = unit();
  const example = lesson.example.verification;
  const practice = lesson.practices[1].verification;
  assert.deepEqual(verifyCutAndPaste(example,'worked example'),[
    ['A','A','A','A'],['A','A','A','A'],['A','A','A','A'],
    ['B','B','B','B'],['B','B','B','B'],['B','B','B','B']
  ]);
  assert.deepEqual(verifyCutAndPaste(practice,'practice 2'),[
    ['A','A','A','A'],['A','A','A','A'],['B','B','B','B'],['B','B','B','B']
  ]);
  assert.deepEqual(Array.from(example.pieces,(piece) => piece.width * piece.height),[12,12]);
  assert.deepEqual(Array.from(practice.pieces,(piece) => piece.width * piece.height),[8,8]);
  assert.ok(lesson.example.steps.some((step) => /沿第 4 列右侧的格线剪/u.test(step)),'specify the actual cut line');
  assert.ok(lesson.example.steps.some((step) => /把 B 整块移到 A 下方/u.test(step)),'specify the actual movement');
  assert.ok(lesson.example.steps.some((step) => /没有重叠也没有空缺/u.test(step)),'check exact reassembly');
  assert.ok(lesson.example.steps.some((step) => /4×6=24/u.test(step)),'verify target area');
});

test('the preserved 4×5 exercise and overlap counterexample have independently verified answers', () => {
  const lesson = unit();
  const originalPractice = lesson.practices[0];
  const originalCheck = originalPractice.verification;
  assert.equal(originalCheck.kind,'area-preservation');
  assert.equal(originalCheck.width * originalCheck.height,originalCheck.expectedArea);
  assert.equal(originalCheck.expectedArea,20);
  assert.ok(originalCheck.allPiecesUsed && originalCheck.noOverlap && originalCheck.noGaps);
  const overlap = lesson.practices[2].verification;
  assert.equal(overlap.kind,'overlap-area');
  assert.equal(Array.from(overlap.pieceAreas).reduce((sum,area) => sum + area,0) - overlap.overlap,overlap.expectedArea);
  assert.equal(overlap.expectedArea,11);
  assert.match(lesson.practices[2].wrongFeedback,/重叠格不能算两遍/u);
  assert.match(lesson.practices[2].explanation,/重复计算了一次/u);
});

test('all accepted answer forms have one numeric meaning and narrow-screen diagram lines stay short', () => {
  const lesson = unit();
  for (const [index,practice] of lesson.practices.entries()) {
    const expected = practice.verification.expectedArea;
    const answers = Array.from(practice.answers,canonicalAnswer);
    assert.ok(answers.every((answer) => answer === String(expected)),`practice ${index + 1}: every accepted form means ${expected}`);
    assert.equal(new Set(answers).size,1,`practice ${index + 1}: aliases are unique`);
  }
  assert.ok(lesson.diagram.text.split('\n').every((line) => Array.from(line).length <= 18),'diagram lines fit narrow cards');
  assert.match(lesson.methodCard.check,/重叠/u);
  assert.match(lesson.methodCard.check,/空隙/u);
  assert.ok(lesson.concepts.some((concept) => /反例/u.test(concept.title)),'teach a concrete overlap counterexample');
});

test('the cut-and-paste module loads after existing G3 units and before route construction', () => {
  const html = fs.readFileSync(path.join(root,'textbook.html'),'utf8');
  const geometryCounting = html.indexOf('/siwei/elementary-g3-geometry-counting-units.js');
  const cutAndPaste = html.indexOf('/siwei/elementary-g3-cut-and-paste-units.js');
  const data = html.indexOf('/siwei/textbook-data.js');
  const roadmap = html.indexOf('/siwei/elementary-roadmap-data.js');
  const renderer = html.indexOf('/siwei/textbook.js');
  assert.ok(geometryCounting >= 0 && geometryCounting < cutAndPaste && cutAndPaste < data && data < roadmap && roadmap < renderer);
});
