(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const mathPattern = /(?:[=≠<>≤≥≡∣×÷√²³⁴⁵⁶⁷⁸⁹⁰ⁿ₀-₉^+−±≈∈∉∪∩∑∏∞°]|\b\d+\s*\/\s*\d+\b)/u;
  const superscriptDigits = (value) => String(value).replace(/[0-9]/g, (digit) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(digit)]);
  const spaceMathOperators = (value) => {
    const operators = new Set(['+','−','×','÷','=','<','>','≤','≥','≠','≡','∣','±','≈','∈','∉','∪','∩']);
    const opening = new Set(['(', '[', '{']);
    const chars = [...String(value ?? '')];
    let output = '';
    chars.forEach((character, index) => {
      if (!operators.has(character)) { output += character; return; }
      const previous = chars[index - 1], next = chars[index + 1];
      const unaryMinus = character === '−' && (!previous || /\s/u.test(previous) || opening.has(previous) || operators.has(previous) || (/\p{Script=Han}/u.test(previous) && /[A-Za-z0-9]/u.test(next ?? '')));
      if (previous && !/\s/u.test(previous) && !operators.has(previous) && !opening.has(previous) && !unaryMinus && !output.endsWith(' ')) output += ' ';
      output += character;
      if (!unaryMinus && next && !/\s/u.test(next) && !operators.has(next)) output += ' ';
    });
    return output.replace(/[ \t]{2,}/g, ' ');
  };
  const standardizeMathSymbols = (value) => spaceMathOperators(String(value ?? '')
    .replace(/<=/g, '≤').replace(/>=/g, '≥').replace(/!=/g, '≠').replace(/\*/g, '×')
    .replace(/\^\{?(\d+|n)\}?/gi, (_, exponent) => exponent.toLowerCase() === 'n' ? 'ⁿ' : superscriptDigits(exponent))
    .replace(/([\p{L}\p{N})\]])\s*[·⋅]\s*([\p{L}\p{N}(])/gu, '$1 × $2')
    .replace(/(?<![\p{L}\p{N}])([\p{L}]|\d+|\))\s*-\s*([\p{L}]|\d+|\()/gu, '$1 − $2')
    .replace(/(^|[\s([{])-(?=\d)/g, '$1−'));
  const mathExpressionSource = (() => {
    const labels = [
      '到某点的走法数','每小时靠近的距离','两类分别计数之和','长方体表面积','正方体表面积','长方体体积','正方体体积','长方形周长','长方形面积','平行四边形面积','三角形面积','三角形内角和','四边形内角和','每份变化量','符合条件的结果数','全部结果数','每人份数','每份数量','较大年龄','较小年龄','哥哥年龄','妹妹年龄','多出的腿数','实际腿数','总头数','假设腿数','假设总量','实际总量','小格总数','每行点数','每行块数','每行数量','每组数量','左边走法数','下边走法数','符合结果数','结果数','最小公倍数','保留比例','糖果总数','间隔数','标记数','较大数','较小数','追上时间','相遇时间','原距离差','总距离','相遇速度','每小时缩短量','平方差','年龄差','总差额','长宽','长高','宽高','边长','棱长','周长','表面积','面积','体积','横向','纵向','行数','列数','对象数','类别数','概率','总数','总和','总量','份数','个数','平均数','大数','小数','差额','人数','总人数','每人','每份','组数','点数','走法数','树数','棵数','腿数','乘数','因数','乘积','交集','并集','原价','现价','打九折','折后价','基数','部分量','百分率','百分比','路程','速度','时间','工作量','效率','首项','末项','公差','项数','项和','前 n 项和','内角和','n边形','一个解','模数','整数','余数','奇数','偶数','奇','偶','和','差','底','对应垂直高','垂直高','高','长','宽','第 1 项'
    ].sort((a,b)=>b.length-a.length).map((value)=>value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|');
    const cjkVariable = String.raw`(?:第\s*(?:\d+|n)\s*项|${labels})(?:\s*\d+)?`;
    const unitValue = String.raw`\d+(?:\.\d+)?\s*(?:千米/小时|平方厘米|平方米|平方单位|立方厘米|立方单位|千米|厘米|小时|分钟|秒|元|角|米|个|只|人|棵|颗|段|步)`;
    const body = String.raw`(?:\d+(?:\.\d+)?[A-Za-z□][A-Za-z0-9□₀-₉⁰¹²³⁴⁵⁶⁷⁸⁹ₐ-ₜⁿ]*|[A-Za-z□][A-Za-z0-9□₀-₉⁰¹²³⁴⁵⁶⁷⁸⁹ₐ-ₜⁿ]*|${unitValue}|√\d+(?:\.\d+)?|${cjkVariable}|\d+(?:\.\d+)?)`;
    const term = String.raw`[+\-−]?${body}(?:[⁰¹²³⁴⁵⁶⁷⁸⁹ⁿ])?(?:%|°)?`;
    const operator = String.raw`[+\-−×÷*/=<>≤≥≠≡∣±≈∈∉∪∩^:]`;
    const group = String.raw`\(${term}(?:(?:\s*${operator}\s*|\s*[,，、]\s*)${term})+\)`;
    const numericGroup = String.raw`\([+\-−]?\d+(?:\.\d+)?\)`;
    const atom = String.raw`(?:${group}|${numericGroup}|${term})`;
    const chain = String.raw`${atom}(?:\s*${operator}\s*${atom}|${group})+`;
    const standalone = String.raw`(?:√\d+(?:\.\d+)?|\d+(?:\.\d+)?(?:[A-Za-z□][A-Za-z0-9□₀-₉⁰¹²³⁴⁵⁶⁷⁸⁹ₐ-ₜⁿ]*|[⁰¹²³⁴⁵⁶⁷⁸⁹ⁿ]+|[%°])|[A-Za-z][A-Za-z0-9₀-₉ⁿₐ-ₜ]*[⁰¹²³⁴⁵⁶⁷⁸⁹ₐ-ₜ₀-₉])`;
    return String.raw`(?:${chain}(?:\s*[,，、;；]\s*${chain})*|${standalone})`;
  })();
  const richSpan = (math, text) => `<span class="sequence-rich-line ${math ? 'sequence-rich-math' : 'sequence-rich-prose'}"${math ? ' role="math"' : ''}>${esc(text)}</span>`;
  const renderRichPart = (part) => {
    const text = standardizeMathSymbols(part);
    const matches = [...text.matchAll(new RegExp(mathExpressionSource, 'gu'))];
    if (!matches.length) {
      const math = mathPattern.test(text) && !/[\u3400-\u9fff]/u.test(text);
      return richSpan(math, text);
    }
    let html = '';
    let cursor = 0;
    matches.forEach((match, index) => {
      if (match.index > cursor) html += richSpan(false, text.slice(cursor, match.index));
      let end = match.index + match[0].length;
      let formula = match[0];
      const suffix = text.slice(end);
      const punctuation = suffix.match(/^\s*[，、；：。？！?！]+/u)?.[0] || '';
      if (punctuation) {
        formula += punctuation;
        end += punctuation.length;
      }
      html += richSpan(true, formula);
      cursor = end;
    });
    if (cursor < text.length) html += richSpan(false, text.slice(cursor));
    return html;
  };
  const renderRichText = (value) => String(value ?? '').split(/(?<=[。；：])/u).filter(Boolean).map(renderRichPart).join('');
  const enhanceMathElement = (element) => {
    if (element.querySelector('.sequence-rich-math')) return;
    const isCode = element.matches('code');
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      const text = standardizeMathSymbols(node.nodeValue);
      if (isCode || node.parentElement?.closest('code')) { node.nodeValue = text; return; }
      const matches = [...text.matchAll(new RegExp(mathExpressionSource, 'gu'))];
      if (!matches.length) { node.nodeValue = text; return; }
      const fragment = document.createDocumentFragment();
      let cursor = 0;
      matches.forEach((match) => {
        if (match.index > cursor) fragment.append(document.createTextNode(text.slice(cursor, match.index)));
        let end = match.index + match[0].length;
        let formula = match[0];
        const punctuation = text.slice(end).match(/^\s*[，、；：。？！?！]+/u)?.[0] || '';
        if (punctuation) {
          formula += punctuation;
          end += punctuation.length;
        }
        const equation = document.createElement('span');
        equation.className = 'sequence-rich-math';
        equation.setAttribute('role', 'math');
        equation.textContent = formula;
        fragment.append(equation);
        cursor = end;
      });
      if (cursor < text.length) fragment.append(document.createTextNode(text.slice(cursor)));
      node.replaceWith(fragment);
    });
  };
  document.querySelectorAll('.kid-explain,.worked-box p,.lesson-takeaway,.review-question label,.review-question details p,.formula-chip code,.formula-grid code,.formula-grid small').forEach(enhanceMathElement);
  const patternSelect = $('#pattern-choice');
  const targetTerm = $('#target-term');
  const patterns = {
    arithmetic: {name:'等差数列', term:n=>2+3*(n-1), label:'每次加 3', formula:'aₙ=2+3(n−1)', explain:'看相邻差：5−2=3、8−5=3、11−8=3，都是 3。公差固定，所以第 n 项可用 2+3×(n−1)。'},
    geometric: {name:'等比数列', term:n=>3*2**(n-1), label:'每次乘 2', formula:'aₙ=3×2ⁿ⁻¹', explain:'看相邻项的倍数：6÷3=2、12÷6=2、24÷12=2，都是 2。公比固定，所以每向后一项就乘 2。'},
    fibonacci: {name:'斐波那契数列', term:n=>{const a=[1,1];for(let i=2;i<n;i++)a.push(a[i-1]+a[i-2]);return a[n-1]}, label:'前两项相加', formula:'F₁=F₂=1；Fₙ=Fₙ₋₁+Fₙ₋₂', explain:'从第 3 项开始，每项等于前两项之和：1+1=2、1+2=3、2+3=5。要找新项时，向前看两项。'},
    triangular: {name:'三角数', term:n=>n*(n+1)/2, label:'依次加 2、3、4……', formula:'Tₙ=n(n+1)÷2', explain:'每层多一行点：1、1+2=3、3+3=6、6+4=10。第 n 个三角数是 1 到 n 的和，也可用 n(n+1)÷2。'},
    square: {name:'平方数', term:n=>n*n, label:'1×1、2×2、3×3……', formula:'Qₙ=n²', explain:'第 n 个平方数是 n 行、每行 n 个点，所以是 n×n。相邻差是 3、5、7、9……每次多 2。'},
    alternating: {name:'交错数列', term:n=>n%2===1?n+1:n+3, label:'奇数位和偶数位分开', formula:'奇数位：2、4、6…；偶数位：5、7、9…', explain:'奇数位是 2、4、6……，偶数位是 5、7、9……。两条各自每次加 2；第 n 项要先判断它落在哪一队。'}
  };
  function renderPattern() {
    const key = patternSelect.value;
    const item = patterns[key];
    const n = Number(targetTerm.value);
    $('#term-output').value = n;
    $('#term-output').textContent = n;
    const count = n;
    const values = Array.from({length:count}, (_, i) => item.term(i+1));
    $('#term-strip').innerHTML = values.map((value, i) => `<span class="term-chip${i===n-1?' target':''}" aria-label="第 ${i+1} 项 ${value}">${value}</span>`).join('');
    $('#lab-bars').innerHTML = values.map((value, i) => {
      const scaled = Math.max(8, Math.round(Math.sqrt(value / Math.max(...values)) * 92));
      return `<div class="lab-bar-wrap"><span class="lab-bar-value">${value}</span><span class="lab-bar" style="height:${scaled}px" aria-hidden="true"></span><span class="lab-bar-index">第${i+1}项</span></div>`;
    }).join('');
    $('#lab-bars').setAttribute('aria-label', `${item.name}前${count}项：${values.join('、')}`);
    $('#lab-caption').textContent = `${item.name}：${item.label}。高低只表示数值大小。`;
    const reason = $('#lab-reason');
    reason.innerHTML = `<strong>${esc(item.name)}的线索：</strong>${renderRichText(item.explain)}<div class="sequence-formula-card"><span>第 ${n} 项公式</span><strong class="sequence-rich-math">${esc(standardizeMathSymbols(item.formula))}</strong><small>代入 n = ${n}，第 ${n} 项 = ${item.term(n)}。</small></div>`;
    $('#lab-reveal').setAttribute('aria-expanded', String(!reason.hidden));
    $('#lab-reveal').textContent = reason.hidden ? '显示线索与推理' : '收起线索与推理';
  }
  patternSelect.addEventListener('change', renderPattern);
  targetTerm.addEventListener('input', renderPattern);
  $('#lab-reveal').addEventListener('click', () => {
    const reason = $('#lab-reason');
    reason.hidden = !reason.hidden;
    $('#lab-reveal').setAttribute('aria-expanded', String(!reason.hidden));
    $('#lab-reveal').textContent = reason.hidden ? '显示线索与推理' : '收起线索与推理';
  });
  renderPattern();

  const shapeKind = $('#shape-kind');
  const shapeSize = $('#shape-size');
  function renderShape() {
    const kind = shapeKind.value;
    const n = Number(shapeSize.value);
    $('#shape-output').value = n;
    $('#shape-output').textContent = n;
    const triangle = kind === 'triangle';
    const total = triangle ? n*(n+1)/2 : n*n;
    $('#shape-total').textContent = total;
    $('#shape-formula').textContent = triangle ? `1+2+…+${n} = ${total}` : `${n} × ${n} = ${total}`;
    let html = '';
    if (triangle) {
      for (let row=1; row<=n; row++) html += `<div class="shape-row" aria-hidden="true">${'<span class="shape-dot"></span>'.repeat(row)}</div>`;
      $('#shape-board').setAttribute('aria-label', `第 ${n} 个三角数点阵，共 ${total} 个点`);
    } else {
      html = `<div class="shape-square-grid" style="display:grid;grid-template-columns:repeat(${n},17px);gap:6px" aria-hidden="true">${'<span class="shape-dot square-dot"></span>'.repeat(total)}</div>`;
      $('#shape-board').setAttribute('aria-label', `第 ${n} 个平方数点阵，${n} 行 ${n} 列，共 ${total} 个点`);
    }
    $('#shape-board').innerHTML = html;
  }
  shapeKind.addEventListener('change', renderShape);
  shapeSize.addEventListener('input', renderShape);
  renderShape();

  const answers = ['17','48','13','21','8','黄'];
  const reviewKey = 'siwei-sequences-review-v1';
  let reviewRaw = null;
  let reviewStorageAvailable = true;
  let reviewReadIssue = false;
  const passed = new Set();
  try { reviewRaw = localStorage.getItem(reviewKey); } catch { reviewStorageAvailable = false; }
  if (reviewRaw !== null) {
    try {
      const saved = JSON.parse(reviewRaw);
      if (Array.isArray(saved)) saved.filter((i) => Number.isInteger(i) && i >= 0 && i < answers.length).forEach((i) => passed.add(i));
      else reviewReadIssue = true;
    } catch { reviewReadIssue = true; }
  }
  const hints = [
    '先算相邻两项的差。',
    '这是每次加一样多，还是乘一样多？',
    '斐波那契数列从第 3 项起，每项等于前两项之和。',
    '三角数可以逐次加下一层，也可以套 Tₙ=n(n+1)÷2。',
    '第 7 项在奇数位，先把两队分开。',
    '用 14 除以周期 3，看余数落在哪个颜色位置。'
  ];
  function updateReview() {
    $('#review-progress').textContent = !reviewStorageAvailable
      ? `答对 ${passed.size} / ${answers.length} · 当前浏览器不能保存，刷新后进度可能清零`
      : reviewReadIssue
        ? `答对 ${passed.size} / ${answers.length} · 旧记录无法读取；答题时会尝试先备份`
        : `答对 ${passed.size} / ${answers.length}`;
    $('#review-finish').hidden = passed.size !== answers.length;
  }
  function saveReview() {
    try {
      if (reviewReadIssue && reviewRaw !== null) {
        const recoveryKey = `${reviewKey}:recovery`;
        if (localStorage.getItem(recoveryKey) === null) localStorage.setItem(recoveryKey, reviewRaw);
      }
      const serialized = JSON.stringify([...passed].sort((a,b)=>a-b));
      localStorage.setItem(reviewKey, serialized);
      reviewRaw = serialized;
      reviewStorageAvailable = true;
      reviewReadIssue = false;
    } catch { reviewStorageAvailable = false; }
  }
  function checkReview(button) {
    const index = Number(button.dataset.review);
    const card = button.closest('.review-question');
    const input = $(`#review-${index}`);
    const feedback = $('.review-feedback', card);
    const value = input.value.normalize('NFKC').trim().replace(/\s/g,'').toLowerCase();
    feedback.classList.remove('good');
    if (!value) { feedback.textContent = `先写一个答案；卡住了可以看提示：${hints[index]}`; input.focus(); return; }
    const expected = answers[index].toLowerCase();
    const correct = value === expected || (index === 5 && value === '黄色');
    if (correct) {
      passed.add(index);
      feedback.textContent = '答对了！试着用一句话说出你用的规律。';
      feedback.classList.add('good');
      saveReview();
      updateReview();
    } else {
      feedback.textContent = `还差一点。提示：${hints[index]}`;
    }
  }
  $$('.review-question [data-review]').forEach(button => button.addEventListener('click', () => checkReview(button)));
  $$('.review-answer input').forEach((input, index) => input.addEventListener('keydown', event => { if (event.key === 'Enter') $(`[data-review="${index}"]`).click(); }));
  passed.forEach(index => {
    const card = $$('.review-question')[index];
    if (card) { $('.review-feedback', card).textContent = '这题已答对，可以继续复习。'; $('.review-feedback', card).classList.add('good'); }
  });
  updateReview();
  $('#print-card').addEventListener('click', () => window.print());
})();
