const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const scripts = [...fs.readFileSync(path.join(__dirname, 'textbook.html'), 'utf8').matchAll(/<script src="\/siwei\/([^"]+)"/g)].map(m => m[1]);
const context = {window: {}, document: {getElementById: () => null}};
vm.createContext(context);
for (const file of scripts) {
  if (['textbook.js', 'textbook-overview.js'].includes(file)) continue;
  vm.runInContext(fs.readFileSync(path.join(__dirname, file), 'utf8'), context, {filename: file});
}
const lesson = context.window.AOSHU_TEXTBOOK_LESSONS.find(l => l.key === 'g4-3');
const unit = lesson.deepUnit;
const plain = x => JSON.parse(JSON.stringify(x));
test('G4-3 preserves lesson identity, first three questions and truthful source boundary', () => {
  assert.equal(lesson.title, '质数判断：因数成对检查');
  assert.equal(lesson.href, '/siwei/branch-course.html?branch=number#bc-topic-primes');
  assert.match(lesson.source, /教材版本、页码与逐讲对应未核实/);
  assert.match(unit.scope, /本站原创/);
  assert.match(unit.scope, /不是教材原题/);
  assert.equal(unit.example.question, '29 是质数还是合数？');
  assert.deepEqual(plain(unit.practices.slice(0, 3).map(p => [p.question, p.answers])), [
    ['51 是质数还是合数？', ['合数', '不是质数']],
    ['37 是质数还是合数？', ['质数']],
    ['1 是质数、合数，还是两者都不是？', ['两者都不是', '既不是质数也不是合数', '都不是']]
  ]);
  assert.equal(unit.practices.length, 5);
});
test('independent full divisor enumeration agrees with inclusive square-boundary trial division', () => {
  function pairedPrime(n) {
    if (n < 2) return false;
    for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
    return true;
  }
  for (let n = 0; n <= 1000; n++) {
    const divisors = Array.from({length: n}, (_, i) => i + 1).filter(d => n % d === 0);
    assert.equal(pairedPrime(n), divisors.length === 2, `n=${n}`);
  }
  for (const n of [4, 9, 25, 49, 121, 169, 289, 961]) assert.equal(pairedPrime(n), false);
  for (const n of [2, 3, 5, 29, 37]) assert.equal(pairedPrime(n), true);
  assert.equal(51 % 3, 0);
  assert.equal(7 * 7, 49);
  assert.equal(11 * 11, 121);
  assert.deepEqual(Array.from(unit.practices.slice(3), p => p.answers[0]), ['合数', '11']);
});
test('square equality, stopping condition and the exception for 1 are explicit', () => {
  const concepts = unit.concepts.map(c => c.text).join('\n');
  assert.match(concepts, /若乘积恰好相等，这个数仍要检查/);
  assert.match(concepts, /1=1×1 不属于这种情况/);
  assert.match(unit.diagram.text, /7 × 7 = 49（相等，7 仍要查）/);
  assert.match(unit.diagram.text, /8 × 8 = 64 > 49/);
  for (const p of unit.practices.slice(3)) {
    for (const field of ['hint', 'wrongFeedback', 'correctFeedback', 'explanation']) assert.ok(p[field].length > 15, field);
  }
  assert.match(unit.practices[4].explanation, /最多查到 11/);
});
