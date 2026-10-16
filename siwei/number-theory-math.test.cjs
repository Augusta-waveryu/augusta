const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, 'number-theory-math.js'), 'utf8'), context);
const math = context.window.QuestionBankMath;
const bank = JSON.parse(fs.readFileSync(path.join(__dirname, 'question-bank-source.json'), 'utf8'));

function collectStrings(value) {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(collectStrings);
  return [];
}

const allQuestionStrings = bank.questions.flatMap(collectStrings);
const visibleQuestionContent = (question) => [question.problem, question.source_answer, question.source_solution, question.duplicate_notes, question.ambiguities, question.review?.note, question.review?.verified_answer, question.review?.verified_solution].flatMap(collectStrings);

 test('题库仍有192个唯一 ID；横线源表示的盘点数与审核一致', () => {
  assert.equal(bank.questions.length, 192);
  assert.equal(new Set(bank.questions.map((question) => question.id)).size, 192);
  assert.equal(allQuestionStrings.reduce((sum, text) => sum + (text.match(/\\overline\{/g) || []).length, 0), 42);
  assert.equal(allQuestionStrings.reduce((sum, text) => sum + (text.match(/\u0305/g) || []).length, 0), 33);
  assert.equal(bank.questions.filter((question) => collectStrings(question).some((text) => text.includes('\\overline{') || text.includes('\u0305'))).length, 18);
});

test('TeX 与前置组合横线都在整段字符上显示，并给出不增添限制的说明', () => {
  const tex = math.renderMathText('警号是 \\overline{a2026b}。');
  assert.match(tex, /class="qbank-overline"[^>]*>a2026b<\/span>/);
  assert.match(tex, /横线覆盖的字符要合起来看作一个数；位数和首位要求以题目文字为准/);
  assert.doesNotMatch(tex, /六位数|首位不得为零|首位不能为零/);

  const combining = math.renderMathText('数字 ̅b3 和 ̅1c26。');
  assert.match(combining, /class="qbank-overline"[^>]*>b3<\/span>/);
  assert.match(combining, /class="qbank-overline"[^>]*>1c26<\/span>/);
  assert.equal((combining.match(/class="qbank-overline"/g) || []).length, 2);

  const leadingZero = math.renderMathText('原文是 \\overline{0abc}。');
  assert.match(leadingZero, />0abc<\/span>/);
});

test('幂次、字母/数字下标、索引幂和括号指数清晰排版', () => {
  const html = math.renderMathText('2^3，a^a，p1^e1，p₁^a₁，2^(s−r)，T_k，x_min，(x+55)_min。');
  assert.match(html, /2<sup>3<\/sup>/);
  assert.match(html, /a<sup>a<\/sup>/);
  assert.match(html, /p<sub class="qbank-subscript">1<\/sub><sup>e<sub class="qbank-subscript">1<\/sub><\/sup>/);
  assert.match(html, /<sup>\(s − r\)<\/sup>/);
  assert.match(html, /T<sub class="qbank-subscript">k<\/sub>/);
  assert.match(html, /x<sub class="qbank-subscript">min<\/sub>/);
  assert.match(html, /\(x \+ 55\)<sub class="qbank-subscript">min<\/sub>/);
  assert.doesNotMatch(html, /\^/);
  const nested = math.renderMathText('47^(37^23)');
  assert.match(nested, /47<sup>\(37<sup>23<\/sup>\)<\/sup>/);
  assert.doesNotMatch(nested, /\^/);
  const negative = math.renderMathText('4^{-1}');
  assert.match(negative, /4<sup>−1<\/sup>/);
  assert.doesNotMatch(negative, /\^/);
});

test('数字分数和括号分式显示为有分子、分母及可访问标签的分数线', () => {
  const html = math.renderMathText('1/2，(6x+3)/(2x−1)。');
  assert.equal((html.match(/class="qbank-fraction"/g) || []).length, 2);
  assert.match(html, /分数，分子 1，分母 2/);
  assert.match(html, /class="qbank-fraction-bar" aria-hidden="true"/);
  assert.match(html, /class="qbank-fraction-part">\(6x \+ 3\)/);
  assert.match(html, /class="qbank-fraction-part">\(2x − 1\)/);
  const poweredNumerator = math.renderMathText('2025^2/d');
  assert.match(poweredNumerator, /class="qbank-fraction"/);
  assert.match(poweredNumerator, /2025<sup>2<\/sup>/);
  const compound = math.renderMathText('1/15 = (m+n)/(15(m+n)) + m/[15(m+n)]');
  assert.equal((compound.match(/class="qbank-fraction"/g) || []).length, 3);
  assert.doesNotMatch(compound.replace(/<[^>]*>/g, ''), /\//);
  assert.doesNotMatch(math.renderMathText('source_answer'), /<sub/);
});

test('复核说明的字段名只在显示层翻译；相关题 tooltip 用无歧义纯文本', () => {
  const display = math.renderMathText('现已修正source_answer和source_solution。');
  assert.match(display, /原答案记录和原解析记录/);
  assert.doesNotMatch(display, /source_answer|source_solution/);
  assert.match(bank.questions.find((question) => question.id === 'S01-Q015').review.note, /source_answer/);
  const tooltip = math.renderTooltipMathText('围绕1/15=1/a+1/b；再比较两种情况。');
  assert.match(tooltip, /1 除以 15 = 1 除以 a \+ 1 除以 b/);
  assert.doesNotMatch(tooltip, /\\|\^|_|\//);
  assert.match(math.renderTooltipMathText('属于变式/知识重叠。'), /变式\/知识重叠/);
});

test('题目清单预览不会截断横线标记本身', () => {
  const tex = `${'前'.repeat(40)}\\overline{a2026b}后面的文字`;
  const texPreview = math.truncateMathPreview(tex, 43);
  assert.ok(!texPreview.includes('\\overline{'));
  assert.match(math.renderCompactMathText(texPreview), /…/);

  const combining = `${'前'.repeat(41)}\u0305a2026b更多文字`;
  const combiningPreview = math.truncateMathPreview(combining, 43);
  assert.ok(!combiningPreview.includes('\u0305'));
});

test('对所有题库字段逐项渲染后不残留已审计的 raw TeX、组合横线或幂次符', () => {
  for (const question of bank.questions) {
    for (const text of collectStrings(question)) {
      const rendered = math.renderMathText(text);
      assert.doesNotMatch(rendered, /\\overline\{|\u0305|\^/u, `${question.id}: ${text}`);
    }
    for (const text of visibleQuestionContent(question)) {
      const visibleText = math.renderMathText(text).replace(/<[^>]*>/g, '');
      assert.doesNotMatch(visibleText, /(?<!_)_(?!_)/u, `${question.id}: ${text}`);
      assert.doesNotMatch(visibleText, /[A-Za-z0-9)\]]\s*\/\s*(?:[A-Za-z0-9]|\(|\[)/u, `${question.id}: ${text}`);
    }
  }
  for (const source of bank.sources || []) {
    for (const text of collectStrings(source.source_notes)) {
      assert.doesNotMatch(math.renderMathText(text), /\\overline\{|\u0305|\^/u, `${source.source_id}: ${text}`);
      assert.doesNotMatch(math.renderMathText(text).replace(/<[^>]*>/g, ''), /(?<!_)_(?!_)/u, `${source.source_id}: ${text}`);
    }
  }
  for (const ref of bank.cross_references || []) {
    const tooltip = math.renderTooltipMathText(ref.note || ref.relationship || '');
    assert.doesNotMatch(tooltip, /\\overline\{|\u0305|\^|_/u, `${ref.id}: ${tooltip}`);
    assert.doesNotMatch(tooltip, /[A-Za-z0-9)\]]\s*\/\s*(?:[A-Za-z0-9]|\(|\[)/u, `${ref.id}: ${tooltip}`);
  }
});

test('未知 TeX 不执行；HTML 输入按纯文本转义', () => {
  const rendered = math.renderMathText('\\href{javascript:alert(1)}<img src=x onerror=alert(1)>');
  assert.match(rendered, /&lt;\s*img\b/);
  assert.doesNotMatch(rendered, /<img\b/i);
  assert.match(rendered, /\\href\{javascript:alert\(1\)\}/);
});
