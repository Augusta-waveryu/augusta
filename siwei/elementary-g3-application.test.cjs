const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = __dirname;
const sentinel = {title:'existing unit must survive merge'};
const context = {window:{
  AOSHU_CURRICULUM:[],
  AOSHU_DEEP_LESSONS:{},
  AOSHU_ELEMENTARY_DEEP_UNITS:{'roadmap:g3-2':sentinel}
}};
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root,'textbook-data.js'),'utf8'),context);
const baseLessons = context.window.AOSHU_TEXTBOOK_LESSONS;
vm.runInContext(fs.readFileSync(path.join(root,'elementary-foundation-units.js'),'utf8'),context);
vm.runInContext(fs.readFileSync(path.join(root,'elementary-g3-application-units.js'),'utf8'),context);
vm.runInContext(fs.readFileSync(path.join(root,'elementary-roadmap-data.js'),'utf8'),context);
const units = context.window.AOSHU_ELEMENTARY_DEEP_UNITS;
const routes = context.window.AOSHU_TEXTBOOK_LESSONS;

function route(key) { return routes.find((lesson) => lesson.key === key); }
function unit(key) { return units[`roadmap:${key}`]; }

function calculate(check) {
  if (check.mode === 'groups-plus-extra') {
    assert.ok(Number.isInteger(check.groups) && check.groups > 0);
    assert.ok(Number.isInteger(check.each) && check.each > 0);
    assert.ok(Number.isInteger(check.extra) && check.extra >= 0);
    return check.groups * check.each + check.extra;
  }
  if (check.mode === 'groups-minus-removed') {
    assert.ok(Number.isInteger(check.groups) && check.groups > 0);
    assert.ok(Number.isInteger(check.each) && check.each > 0);
    assert.ok(Number.isInteger(check.removed) && check.removed > 0);
    const total = check.groups * check.each;
    assert.ok(check.removed < total, 'the question must leave a positive remainder');
    return total - check.removed;
  }
  if (check.mode === 'group-count-difference') {
    assert.ok(Number.isInteger(check.total) && check.total > 0);
    assert.ok(Number.isInteger(check.perGroupA) && check.perGroupA > 0);
    assert.ok(Number.isInteger(check.perGroupB) && check.perGroupB > 0);
    assert.equal(check.total % check.perGroupA, 0, 'first division must be exact');
    assert.equal(check.total % check.perGroupB, 0, 'second division must be exact');
    return Math.abs(check.total / check.perGroupA - check.total / check.perGroupB);
  }
  assert.fail(`unknown verification mode: ${check.mode}`);
}

function verifyCase(item, label) {
  assert.ok(item.verification, `${label}: independent arithmetic inputs are recorded`);
  const expected = calculate(item.verification);
  assert.equal(expected, item.verification.expected, `${label}: independently computed result`);
  const hasResultInReasoning = (item.steps || []).some((step) => step.includes(String(expected))) ||
    (item.explanation || '').includes(String(expected));
  assert.ok(hasResultInReasoning, `${label}: result appears in worked reasoning`);
  const inputs = Object.entries(item.verification)
    .filter(([key,value]) => key !== 'expected' && key !== 'mode' && Number.isFinite(value))
    .map(([,value]) => value);
  for (const value of inputs) assert.ok(item.question.includes(String(value)), `${label}: question contains input ${value}`);
  if (item.answers) {
    const canonical = item.answers.map((answer) => answer.replace(/[^0-9-]/gu,''));
    assert.ok(canonical.every((answer) => answer === String(expected)), `${label}: all accepted formats mean the same unique answer`);
    assert.equal(new Set(canonical).size, 1, `${label}: answer is numerically unique`);
  } else {
    assert.ok(item.steps?.some((step) => step.includes(`= ${expected}`)), `${label}: worked steps show the result`);
  }
}

function solveIntegerSumDifference(sum, difference) {
  if (!Number.isSafeInteger(sum) || !Number.isSafeInteger(difference) || sum < difference || difference < 0 || (sum - difference) % 2 !== 0) return null;
  return {small:(sum - difference) / 2,big:(sum + difference) / 2};
}

function verifySumDifferenceCase(item, label) {
  const check = item.verification;
  assert.ok(check, `${label}: recorded inputs for an independent check`);
  const solution = solveIntegerSumDifference(check.sum,check.difference);
  if (check.mode === 'sum-difference-integer-existence') {
    assert.equal(solution !== null,check.expected,`${label}: integer solution exists exactly when the remainder can be split evenly`);
    assert.deepEqual(Array.from(item.answers),[check.expected ? '存在' : '不存在'],`${label}: one unambiguous accepted response`);
    assert.ok(item.question.includes(String(check.sum)) && item.question.includes(String(check.difference)));
    assert.match(item.explanation,/不能分成两份整数/u);
    return;
  }
  assert.equal(check.mode,'sum-difference');
  assert.ok(solution,`${label}: a nonnegative integer pair exists`);
  assert.equal(solution.small + solution.big,check.sum,`${label}: numbers return to the stated sum`);
  assert.equal(solution.big - solution.small,check.difference,`${label}: numbers return to the stated difference`);
  const expected = check.target === 'big' ? solution.big : solution.small;
  assert.equal(check.expected,expected,`${label}: independently computed requested number`);
  if (item.answers) assert.deepEqual(Array.from(item.answers),[String(expected)],`${label}: one unique accepted numeric answer`);
  else assert.ok((item.steps || []).join(' ').includes(String(expected)),`${label}: worked example shows the independently computed answer`);
  assert.ok(item.question.includes(String(check.sum)) && item.question.includes(String(check.difference)));
  assert.ok((item.steps || []).join(' ').includes(String(expected)) || (item.explanation || '').includes(String(expected)),`${label}: worked reasoning names the answer`);
}

test('G3-25/26 preserve route IDs, source note, existing links, and old deep-unit data', () => {
  assert.strictEqual(units['roadmap:g3-2'], sentinel, 'Object.assign must preserve existing units');
  for (const [key,title] of [
    ['g3-25','应用题（一）：先分清数量关系'],
    ['g3-26','应用题（二）：比较两种分法']
  ]) {
    const current = route(key);
    assert.equal(current?.key, key, `${key}: progress/route key`);
    assert.equal(current?.title, title, `${key}: visible route title`);
    assert.match(current.source, /公开目录/u);
    assert.match(current.source, /逐讲映射\/页码待核/u);
    assert.match(current.source, /例题与练习为本项目原创/u);
    assert.ok(current.deepUnit, `${key}: deep unit is attached`);
  }
  assert.equal(route('g3-25').href,'/siwei/branch-course.html?branch=applications#bc-topic-equal-groups-extra');
  assert.equal(route('g3-25').link,'接着学：相同的几组，再加组外部分');
  assert.equal(route('g3-26').href,'/siwei/branch-course.html?branch=applications#bc-topic-fixed-total-grouping');
  assert.equal(route('g3-26').link,'接着学：固定总量下比较两种分组');
  assert.equal(route('g3-26').prerequisiteLinks[0]?.href,'#book-lesson-g2-12');
  assert.match(route('g3-26').prerequisite,/不要求盈亏法或比例/u);
});

test('both lessons retain their original example and original first self-test while adding teaching depth', () => {
  const expected = {
    'g3-25': {
      example:'4 个盒子各放 6 支铅笔，盒外还有 3 支，一共有多少支？',
      firstPractice:'3 包练习本每包 8 本，另外还有 4 本，一共多少本？'
    },
    'g3-26': {
      example:'30 颗糖每人分 3 颗能分给 10 人；若每人分 5 颗能分给 6 人，人数少几人？',
      firstPractice:'40 张贴纸每人分 4 张和每人分 5 张，能分的人数相差几人？'
    }
  };
  for (const key of Object.keys(expected)) {
    const current = route(key);
    const lesson = unit(key);
    assert.equal(lesson.roadmapTitle,expected[key].example.startsWith('4 个盒子') ? '应用题（一）：先分清数量关系' : '应用题（二）：比较两种分法');
    assert.equal(lesson.example.question,expected[key].example,`${key}: preserve original worked example`);
    assert.equal(lesson.practices[0].question,expected[key].firstPractice,`${key}: preserve original self-test as first exercise`);
    assert.equal(lesson.practices.length,3,`${key}: three progressive exercises`);
    assert.ok(lesson.methodCard && lesson.diagram && lesson.concepts.length >= 4,`${key}: teaching path and visual comparison`);
    assert.equal(lesson.review.length,3,`${key}: retrieval/return check`);
    for (const practice of lesson.practices) {
      assert.ok(practice.level && practice.hint && practice.wrongFeedback && practice.correctFeedback && practice.explanation,
        `${key}/${practice.level}: specific hint and feedback`);
    }
  }
});

test('G3-25 worked example and practice answers are independently verified and distinct', () => {
  const lesson = unit('g3-25');
  verifyCase(lesson.example,'G3-25 example');
  for (const [index,practice] of lesson.practices.entries()) verifyCase(practice,`G3-25 practice ${index + 1}`);
  assert.deepEqual(Array.from(lesson.practices,({verification}) => verification.expected),[28,22,30]);
  assert.equal(new Set(Array.from(lesson.practices,({verification}) => verification.expected)).size,3);
});

test('G3-26 both groupings divide evenly and all comparison answers are independently verified', () => {
  const lesson = unit('g3-26');
  verifyCase(lesson.example,'G3-26 example');
  for (const [index,practice] of lesson.practices.entries()) verifyCase(practice,`G3-26 practice ${index + 1}`);
  assert.deepEqual(Array.from(lesson.practices,({verification}) => verification.expected),[2,1,6]);
  assert.equal(new Set(Array.from(lesson.practices,({verification}) => verification.expected)).size,3);
});

test('G3-16 preserves its route, source note, existing sum-difference link, and first self-test', () => {
  const current = route('g3-16');
  const lesson = unit('g3-16');
  assert.equal(current?.key,'g3-16','route/progress ID stays stable');
  assert.equal(current?.title,'图能帮忙');
  assert.equal(current?.href,'/siwei/branch-course.html?branch=applications#bc-topic-sum-difference');
  assert.equal(current?.link,'接着学：和差线段图');
  assert.match(current.source,/公开目录/u);
  assert.match(current.source,/逐讲映射\/页码待核/u);
  assert.match(current.source,/例题与练习为本项目原创/u);
  assert.equal(lesson.example.question,'两数和为 36，差为 8，较大数是多少？');
  assert.equal(lesson.practices[0].question,'两数的和是 44，差是 12，较大数是多少？');
  assert.equal(current.deepUnit?.title,lesson.title);
  assert.equal(current.practice,lesson.practices[0].question);
  assert.equal(lesson.practices.length,3);
  assert.equal(lesson.diagram.type,'sum-difference-bars');
  assert.equal(lesson.diagram.sum,36);
  assert.equal(lesson.diagram.difference,8);
  assert.ok(lesson.methodCard && lesson.concepts.length >= 4);
  assert.equal(lesson.review.length,3);
  for (const practice of lesson.practices) {
    assert.ok(practice.level && practice.hint && practice.wrongFeedback && practice.correctFeedback && practice.explanation);
  }
});

test('G3-16 worked example, visual, progressive exercises, and integer edge case are independently verified', () => {
  const lesson = unit('g3-16');
  verifySumDifferenceCase(lesson.example,'G3-16 worked example');
  const diagramSolution = solveIntegerSumDifference(lesson.diagram.sum,lesson.diagram.difference);
  assert.ok(diagramSolution);
  assert.equal(diagramSolution.small,14);
  assert.equal(diagramSolution.big,22);
  for (const [index,practice] of lesson.practices.entries()) verifySumDifferenceCase(practice,`G3-16 practice ${index + 1}`);
  assert.deepEqual(Array.from(lesson.practices,({verification}) => verification.expected),[28,12,false]);
  assert.equal(solveIntegerSumDifference(25,6),null,'25−6 is odd, so it cannot be split into two equal integers');
  assert.equal(new Set(Array.from(lesson.practices,({answers}) => answers[0])).size,3,'each exercise has a distinct unambiguous answer');
});

test('G3-16 visual fills its shared segment and includes narrow-screen layout rules', () => {
  const renderer = fs.readFileSync(path.join(root,'textbook.js'),'utf8');
  const styles = fs.readFileSync(path.join(root,'textbook-roadmap.css'),'utf8');
  assert.ok(renderer.includes("if (visual.type === 'sum-difference-bars')"));
  assert.ok(renderer.includes('class="book-sum-difference-segment is-equal" style="width:100%"'));
  assert.ok(renderer.includes('style="width:${equalWidth.toFixed(2)}%"'));
  assert.ok(styles.includes('.book-sum-difference-row'));
  assert.ok(styles.includes('@media(max-width:650px)') && styles.includes('@media(max-width:340px)'));
});

test('new application-unit script runs after existing content modules and before route rendering', () => {
  const html = fs.readFileSync(path.join(root,'textbook.html'),'utf8');
  const repair = html.indexOf('/siwei/elementary-deep-units-repair.js');
  const motion = html.indexOf('/siwei/elementary-g3-motion-units.js');
  const application = html.indexOf('/siwei/elementary-g3-application-units.js');
  const foundation = html.indexOf('/siwei/elementary-foundation-units.js');
  const data = html.indexOf('/siwei/textbook-data.js');
  const roadmap = html.indexOf('/siwei/elementary-roadmap-data.js');
  const renderer = html.indexOf('/siwei/textbook.js');
  assert.ok(repair >= 0 && repair < motion && motion < foundation && foundation < application && application < data && data < roadmap && roadmap < renderer);
});
