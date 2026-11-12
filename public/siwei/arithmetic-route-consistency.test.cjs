const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = __dirname;
const read = (name) => fs.readFileSync(path.join(root, name), 'utf8');
const curriculumSource = read('curriculum.js');
const depthSource = read('branch-course-depth.js');
const enrichmentSource = read('arithmetic-foundations-enrichment.js');
const strictGuard = "new URLSearchParams(location.search).get('branch') !== 'arithmetic'";
const currentGuard = "(new URLSearchParams(location.search).get('branch') || 'arithmetic') !== 'arithmetic'";

function run(search, source = enrichmentSource) {
  const context = {
    URLSearchParams,
    location: { search },
    window: { AOSHU_DEEP_LESSONS: {} },
    document: { getElementById: () => null }
  };
  vm.createContext(context);
  vm.runInContext(curriculumSource, context, { filename: 'curriculum.js' });
  vm.runInContext(depthSource, context, { filename: 'branch-course-depth.js' });
  vm.runInContext(source, context, { filename: 'arithmetic-foundations-enrichment.js' });
  return context.window;
}

function strictBaselineSource() {
  assert.ok(enrichmentSource.includes(currentGuard), 'current guard is the expected minimal default-entry guard');
  return enrichmentSource.replace(currentGuard, strictGuard);
}

function courseData(window) {
  return JSON.parse(JSON.stringify({
    curriculum: window.AOSHU_CURRICULUM,
    deepLessons: window.AOSHU_DEEP_LESSONS
  }));
}

function arithmetic(window) {
  return window.AOSHU_CURRICULUM.find((branch) => branch.id === 'arithmetic');
}

function ratio(window) {
  return arithmetic(window).lessons.find((lesson) => lesson.id === 'ratio');
}

const formal = run('?branch=arithmetic');
const defaultEntry = run('');
const emptyBranch = run('?branch=');
const utmEntry = run('?utm_source=test&utm_medium=entry');
const applications = run('?branch=applications');
const unknown = run('?branch=not-a-real-branch');

// The route snapshots are intentionally computed once per isolated VM: the scripts mutate
// their in-memory curriculum/deep-lesson objects just as the browser does.
test('formal arithmetic and every default-style entry expose identical course data', () => {
  assert.deepEqual(courseData(defaultEntry), courseData(formal));
  assert.deepEqual(courseData(emptyBranch), courseData(formal));
  assert.deepEqual(courseData(utmEntry), courseData(formal));
  assert.equal(ratio(formal).practice.length, 8, 'ratio has the expected eight-question set');
});

test('explicit non-arithmetic and unknown branches do not receive arithmetic enrichment', () => {
  const baseline = run('?branch=applications', strictBaselineSource());
  assert.deepEqual(courseData(applications), courseData(baseline));
  assert.deepEqual(courseData(unknown), courseData(run('?branch=not-a-real-branch', strictBaselineSource())));
  assert.notDeepEqual(courseData(applications), courseData(formal));
});

test('formal arithmetic data is unchanged from the strict-guard baseline', () => {
  const baseline = run('?branch=arithmetic', strictBaselineSource());
  assert.deepEqual(courseData(formal), courseData(baseline));
});

test('lesson IDs and the first eight ratio questions remain stable across equivalent routes', () => {
  const expectedLessonIds = JSON.parse(JSON.stringify(arithmetic(formal).lessons.map(({ id }) => id)));
  const expectedQuestions = JSON.parse(JSON.stringify(ratio(formal).practice.slice(0, 8).map(({ q }) => q)));
  for (const [label, window] of Object.entries({formal, defaultEntry, emptyBranch, utmEntry})) {
    assert.deepEqual(JSON.parse(JSON.stringify(arithmetic(window).lessons.map(({ id }) => id))), expectedLessonIds, `${label}: lesson IDs`);
    assert.deepEqual(JSON.parse(JSON.stringify(ratio(window).practice.slice(0, 8).map(({ q }) => q))), expectedQuestions, `${label}: first eight ratio questions`);
  }
});
