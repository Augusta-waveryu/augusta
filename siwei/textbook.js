(() => {
  const lessons = window.AOSHU_TEXTBOOK_LESSONS || [];
  const progressKey = 'aoshu-elementary-roadmap-v2';
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
  const richSpan = (kind, text) => `<span class="${kind === 'math' ? 'book-rich-math' : 'book-rich-prose'}"${kind === 'math' ? ' role="math"' : ''}>${esc(text)}</span>`;
  const renderRichPart = (part) => {
    const text = standardizeMathSymbols(part);
    const matches = [...text.matchAll(new RegExp(mathExpressionSource, 'gu'))];
    if (!matches.length) {
      const math = mathPattern.test(text) && !/[\u3400-\u9fff]/u.test(text);
      return richSpan(math ? 'math' : 'prose', text);
    }
    let html = '';
    let cursor = 0;
    matches.forEach((match, index) => {
      if (match.index > cursor) html += richSpan('prose', text.slice(cursor, match.index));
      let end = match.index + match[0].length;
      let formula = match[0];
      const suffix = text.slice(end);
      const punctuation = suffix.match(/^\s*[，、；：。？！?！]+/u)?.[0] || '';
      if (punctuation) {
        formula += punctuation;
        end += punctuation.length;
      }
      html += richSpan('math', formula);
      cursor = end;
    });
    if (cursor < text.length) html += richSpan('prose', text.slice(cursor));
    return html;
  };
  const renderRichText = (value) => String(value ?? '').split(/(?<=[。；：])/u).filter(Boolean).map(renderRichPart).join('');
  const normalize = (value) => String(value ?? '').normalize('NFKC').toLowerCase()
    .replace(/[−–—]/g, '-').replace(/\*/g, '×')
    .replace(/^[，,。.!！?？]+|[，,。.!！?？]+$/g, '')
    .replace(/\s*([/+×÷=<>≤≥≠+\-])\s*/g, '$1').replace(/\s+/g, ' ').trim();
  const parseRational = (value) => {
    const text = String(value ?? '').normalize('NFKC').replace(/[−–—]/g, '-').trim().replace(/^[，,。.!！?？]+|[，,。.!！?？]+$/g, '').replace(/\s*\/\s*/g, '/').trim();
    if (text.length > 100) return null;
    const fraction = (numerator, denominator) => {
      let n = BigInt(numerator);
      let d = BigInt(denominator);
      if (d === 0n) return null;
      if (d < 0n) { n = -n; d = -d; }
      return {n, d};
    };
    let match = text.match(/^([+-]?\d+)(?:\s+|又)(\d+)\/(\d+)$/);
    if (match) {
      const sign = match[1].startsWith('-') ? -1n : 1n;
      const whole = BigInt(match[1].replace(/^[+-]/, ''));
      return fraction(sign * (whole * BigInt(match[3]) + BigInt(match[2])), match[3]);
    }
    match = text.match(/^([+-]?\d+)\/([+-]?\d+)$/);
    if (match) return fraction(match[1], match[2]);
    match = text.match(/^([+-]?)(?:(\d+)(?:\.(\d*))?|\.(\d+))$/);
    if (match) {
      const sign = match[1] === '-' ? -1n : 1n;
      const whole = match[2] || '0';
      const decimals = match[3] ?? match[4] ?? '';
      return fraction(sign * BigInt(`${whole}${decimals}`), 10n ** BigInt(decimals.length));
    }
    return null;
  };
  const looksNumeric = (value) => {
    const text = String(value ?? '').normalize('NFKC').replace(/[−–—]/g, '-').trim().replace(/^[，,。.!！?？]+|[，,。.!！?？]+$/g, '').replace(/又\s+/g, '又').replace(/\s*\/\s*/g, '/');
    return /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:(?:\s+|又)\d+\/[+-]?\d+|\/[+-]?\d+)?$/.test(text);
  };
  const answersMatch = (expected, actual) => {
    const a = parseRational(expected);
    const b = parseRational(actual);
    if (a || b) return Boolean(a && b && a.n * b.d === b.n * a.d);
    if (looksNumeric(expected) || looksNumeric(actual)) return false;
    return normalize(expected) === normalize(actual);
  };
  const searchableText = (value) => {
    if (Array.isArray(value)) return value.map(searchableText).join(' ');
    if (value && typeof value === 'object') return Object.values(value).map(searchableText).join(' ');
    return String(value ?? '');
  };
  const searchKey = (value) => String(value ?? '').normalize('NFKC').toLowerCase().replace(/\s+/gu, '');
  const keyOf = (lesson) => lesson.key || `g${lesson.grade || 3}-${lesson.n}`;
  const list = document.getElementById('book-lessons');
  const search = document.getElementById('book-search');
  const gradeFilter = document.getElementById('book-grade-filter');
  const topicFilter = document.getElementById('book-filter');
  const onlyUnmastered = document.getElementById('book-only-unmastered');
  const visibleCount = document.getElementById('book-visible-count');
  const empty = document.getElementById('book-empty');
  let progress = {};
  let progressStorageAvailable = true;
  let progressReadIssue = false;
  let storedProgressRaw = null;
  try { storedProgressRaw = localStorage.getItem(progressKey); } catch { progressStorageAvailable = false; }
  if (storedProgressRaw !== null) {
    try {
      const parsed = JSON.parse(storedProgressRaw);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) progress = parsed;
      else progressReadIssue = true;
    } catch { progressReadIssue = true; }
  }

  const practiceList = (lesson) => lesson.deepUnit?.practices?.length
    ? lesson.deepUnit.practices
    : [{question:lesson.practice,answers:lesson.answers,hint:lesson.hint,explanation:lesson.explanation}];
  const solvedFor = (lesson) => {
    const saved = progress[keyOf(lesson)];
    if (lesson.deepUnit) return Array.isArray(saved?.solved) ? saved.solved : [];
    return saved?.done ? [0] : [];
  };
  const legacyDoneFor = (lesson) => {
    const saved = progress[keyOf(lesson)];
    return Boolean(lesson.deepUnit && (saved?.legacyDone === true || (saved?.done === true && !Array.isArray(saved?.solved))));
  };
  const isDone = (lesson) => solvedFor(lesson).length >= practiceList(lesson).length;

  const grades = [...new Set(lessons.map((lesson) => Number(lesson.grade || 3)))].sort((a,b) => a-b);
  grades.forEach((grade) => {
    const option = document.createElement('option');
    option.value = String(grade);
    option.textContent = `${['','一年级','二年级','三年级','四年级','五年级','六年级'][grade] || `${grade}年级`}`;
    gradeFilter.append(option);
  });
  const topics = [...new Set(lessons.map((lesson) => lesson.group))];
  topics.forEach((topic) => {
    const option = document.createElement('option');
    option.value = topic;
    option.textContent = topic;
    topicFilter.append(option);
  });

  function updateProgress() {
    const done = lessons.filter(isDone).length;
    const count = document.getElementById('book-progress-count');
    const fill = document.getElementById('book-progress-fill');
    const caption = document.getElementById('book-progress-caption');
    count.textContent = `${done} / ${lessons.length}`;
    fill.style.width = `${lessons.length ? done / lessons.length * 100 : 0}%`;
    caption.textContent = !progressStorageAvailable
      ? '当前浏览器不能保存学习进度；这次练习可以继续，刷新后可能清零。'
      : progressReadIssue
        ? '发现无法读取的旧进度；答题时会尝试先备份旧记录，再保存新进度。'
        : done === lessons.length && done
      ? '所有课程都留下脚印了。挑一讲复习，或者打开关联专题做更多练习。'
      : done ? `已经完成 ${done} 讲；可以用年级筛选继续找还没掌握的内容。`
        : '每完成一讲的自测，就会记下一枚学习脚印。';
  }

  function saveProgress() {
    try {
      if (progressReadIssue && storedProgressRaw !== null) {
        const recoveryKey = `${progressKey}:recovery`;
        if (localStorage.getItem(recoveryKey) === null) localStorage.setItem(recoveryKey, storedProgressRaw);
      }
      storedProgressRaw = JSON.stringify(progress);
      localStorage.setItem(progressKey, storedProgressRaw);
      progressReadIssue = false;
      progressStorageAvailable = true;
      return true;
    } catch {
      progressStorageAvailable = false;
      return false;
    }
  }

  function learningVisualMarkup(visual) {
    if (!visual || typeof visual !== 'object') return '';
    const cap = (value, max) => Number.isFinite(Number(value)) ? Math.max(0, Math.min(max, Math.floor(Number(value)))) : 0;
    if (visual.type === 'puzzle-grid') {
      const rows = (Array.isArray(visual.cells) ? visual.cells : []).slice(0, 6).map((row) => Array.isArray(row) ? row.slice(0, 6) : []);
      const columns = Math.max(0, ...rows.map((row) => row.length));
      if (!rows.length || !columns) return '';
      const boxSize = cap(visual.boxSize, Math.max(rows.length, columns));
      const focusRow = Array.isArray(visual.focus) ? Number(visual.focus[0]) : -1;
      const focusColumn = Array.isArray(visual.focus) ? Number(visual.focus[1]) : -1;
      const cells = rows.map((row, rowIndex) => `<div class="book-puzzle-row" role="row">${Array.from({length:columns}, (_, columnIndex) => {
        const value = row[columnIndex];
        const isEmpty = value === undefined || value === null || value === '' || value === 0;
        const classes = ['book-puzzle-cell'];
        if (isEmpty) classes.push('is-empty');
        if (rowIndex === focusRow && columnIndex === focusColumn) classes.push('is-focus');
        if (columnIndex === columns - 1) classes.push('is-last-column');
        if (rowIndex === rows.length - 1) classes.push('is-last-row');
        if (boxSize > 0 && (columnIndex + 1) % boxSize === 0 && columnIndex < columns - 1) classes.push('is-box-right');
        if (boxSize > 0 && (rowIndex + 1) % boxSize === 0 && rowIndex < rows.length - 1) classes.push('is-box-bottom');
        const label = `第${rowIndex + 1}行第${columnIndex + 1}格，${isEmpty ? '待填' : `数字${value}`}`;
        return `<span class="${classes.join(' ')}" role="gridcell" aria-label="${esc(label)}">${isEmpty ? '□' : esc(value)}</span>`;
      }).join('')}</div>`).join('');
      return `<figure class="book-learning-visual book-puzzle-visual" aria-label="${esc(visual.title)}"><figcaption>${esc(visual.title)}</figcaption><div class="book-puzzle-grid" role="grid" aria-label="${esc(visual.title)}，${rows.length}行，每行${columns}格" aria-rowcount="${rows.length}" aria-colcount="${columns}" style="--puzzle-columns:${columns}">${cells}</div>${visual.note ? `<p class="book-visual-check">${esc(visual.note)}</p>` : ''}</figure>`;
    }
    if (visual.type === 'quantity-count') {
      const count = cap(visual.count, 10);
      const symbol = esc(visual.symbol || '●');
      const items = Array.from({length:count}, (_, index) => `<span class="book-count-item"><i aria-hidden="true">${symbol}</i><b>${index + 1}</b></span>`).join('');
      return `<figure class="book-learning-visual book-quantity-count" aria-label="${esc(visual.title)}"><figcaption>${esc(visual.title)}</figcaption><div class="book-count-model" role="img" aria-label="${count} 件物品逐个对应数词 1 到 ${count}">${items}</div><p class="book-visual-check">${esc(visual.totalLabel || `最后一个数词表示总量：${count}`)}</p><div class="book-zero-model"><b>0</b><span>空盒里没有物品，数量是 0。</span></div></figure>`;
    }
    if (visual.type === 'quantity-compare') {
      const leftCount = cap(visual.left?.count, 20);
      const rightCount = cap(visual.right?.count, 20);
      const pairCount = Math.min(leftCount, rightCount);
      const cells = Math.max(leftCount, rightCount);
      const row = (count) => Array.from({length:cells}, (_, index) => `<span class="book-compare-cell${index < pairCount ? ' is-paired' : index < count ? ' is-extra' : ''}" aria-hidden="true">${index < count ? '●' : ''}</span>`).join('');
      const scaleMax = Math.max(10, cap(visual.max, 20));
      const ticks = Array.from({length:scaleMax + 1}, (_, value) => `<span class="${value === leftCount ? 'is-left-value' : ''}${value === rightCount ? ' is-right-value' : ''}">${value}</span>`).join('');
      return `<figure class="book-learning-visual book-quantity-compare" aria-label="${esc(visual.title)}"><figcaption>${esc(visual.title)}</figcaption><div class="book-compare-row"><b>${esc(visual.left?.label || '左边')}</b><div class="book-compare-items" style="--pair-count:${cells}" role="img" aria-label="${esc(visual.left?.label || '左边')} ${leftCount} 件：${pairCount} 件配对，${Math.max(0,leftCount-pairCount)} 件未配对">${row(leftCount)}</div><strong>${leftCount}</strong></div><div class="book-compare-row"><b>${esc(visual.right?.label || '右边')}</b><div class="book-compare-items" style="--pair-count:${cells}" role="img" aria-label="${esc(visual.right?.label || '右边')} ${rightCount} 件：${pairCount} 件配对，${Math.max(0,rightCount-pairCount)} 件未配对">${row(rightCount)}</div><strong>${rightCount}</strong></div><div class="book-compare-scale" role="img" aria-label="数轴上 ${leftCount} 和 ${rightCount} 的位置">${ticks}</div><p class="book-visual-check">${esc(visual.check || '')}</p></figure>`;
    }
    if (visual.type === 'operation-number-line') {
      const maximum = Math.max(1, cap(visual.max, 20));
      const models = (visual.models || []).map((model) => {
        const start = cap(model.start, maximum);
        const change = cap(model.change, maximum);
        const end = cap(model.end, maximum);
        const isAddition = model.operation === 'add';
        const movement = isAddition ? '→' : '←';
        const dots = (count, removed = 0) => Array.from({length:count}, (_, index) => `<i class="${index >= count - removed ? 'is-removed' : ''}" aria-hidden="true">${index >= count - removed ? '×' : '●'}</i>`).join('');
        const groups = isAddition
          ? `<span>${dots(start)}</span><b aria-hidden="true">+</b><span>${dots(change)}</span><b aria-hidden="true">=</b><span>${dots(end)}</span>`
          : `<span>${dots(start, change)}</span><b aria-hidden="true">−</b><span>${dots(change)}</span><b aria-hidden="true">=</b><span>${dots(end)}</span>`;
        const ticks = Array.from({length:maximum + 1}, (_, value) => `<span class="book-operation-tick${value === start ? ' is-start' : ''}${value === end ? ' is-end' : ''}">${value}</span>`).join('');
        const left = Math.min(start, end) / maximum * 100;
        const width = Math.abs(end - start) / maximum * 100;
        return `<article class="book-operation-model"><h4>${esc(model.equation)}</h4><p>${esc(model.label)}</p><div class="book-operation-counters" role="img" aria-label="${esc(model.equation)} 的圆片表示">${groups}</div><div class="book-operation-line" role="img" aria-label="${esc(model.label)}，${start} 移动 ${change} 步到 ${end}"><span class="book-operation-arrow" style="left:${left}%;width:${width}%">${movement}</span><div class="book-operation-ticks">${ticks}</div></div></article>`;
      }).join('');
      return `<figure class="book-learning-visual book-operation-visual" aria-label="${esc(visual.title)}"><figcaption>${esc(visual.title)}</figcaption><div class="book-operation-grid">${models}</div><p class="book-visual-check">加法向右、减法向左；数轴上的每一步都是相邻两个数之间的一个间隔。</p></figure>`;
    }
    if (visual.type === 'part-whole') {
      const models = (visual.models || []).map((item) => `<article class="book-part-whole-model"><h4>${esc(item.label)}</h4><p class="book-visual-equation">${renderRichText(item.equation)}</p><div class="book-whole-box"><span>${esc(item.wholeLabel)}</span><strong>${esc(item.whole)}</strong></div><div class="book-part-boxes">${(item.parts || []).map((part) => `<div class="book-part-box"><span>${esc(part.label)}</span><strong>${esc(part.value)}</strong></div>`).join('')}</div><p class="book-visual-check">${renderRichText(item.check)}</p></article>`).join('');
      return `<figure class="book-learning-visual book-part-whole-visual" aria-label="${esc(visual.title)}"><figcaption>${esc(visual.title)}</figcaption><div class="book-part-whole-grid">${models}</div></figure>`;
    }
    if (visual.type === 'sum-difference-bars') {
      const sum = Number(visual.sum);
      const difference = Number(visual.difference);
      if (!Number.isSafeInteger(sum) || !Number.isSafeInteger(difference) || sum < difference || difference < 0 || (sum - difference) % 2 !== 0) return '';
      const small = (sum - difference) / 2;
      const big = small + difference;
      if (big <= 0) return '';
      const equalWidth = Math.max(0, Math.min(100, small / big * 100));
      const extraWidth = 100 - equalWidth;
      const smallLabel = visual.smallLabel || '较小数';
      const bigLabel = visual.bigLabel || '较大数';
      const shortBar = `<div class="book-sum-difference-track"><div class="book-sum-difference-bar" style="width:${equalWidth.toFixed(2)}%" role="img" aria-label="${esc(smallLabel)} ${small}，表示相同的一份"><span class="book-sum-difference-segment is-equal" style="width:100%">${small}</span></div></div>`;
      const longBar = `<div class="book-sum-difference-track"><div class="book-sum-difference-bar" style="width:100%" role="img" aria-label="${esc(bigLabel)} ${big}，由相同的一份 ${small} 和多出的 ${difference} 组成"><span class="book-sum-difference-segment is-equal" style="width:${equalWidth.toFixed(2)}%">${small}</span><span class="book-sum-difference-segment is-extra" style="width:${extraWidth.toFixed(2)}%">${difference}</span></div></div>`;
      const steps = [
        {title:'先拿走多出的差',equation:`${sum} − ${difference} = ${sum - difference}`,note:'剩下两段一样长'},
        {title:'平均分成两份',equation:`${sum - difference} ÷ 2 = ${small}`,note:`这就是${smallLabel}`},
        {title:'把差加回去',equation:`${small} + ${difference} = ${big}`,note:`这就是${bigLabel}`}
      ].map((item, index) => `<article class="book-sum-difference-step"><b>${index + 1}. ${esc(item.title)}</b><strong>${esc(item.equation)}</strong><span>${esc(item.note)}</span></article>`).join('');
      const ariaLabel = `${visual.title}。总和 ${sum}，差 ${difference}；${smallLabel} ${small}，${bigLabel} ${big}。`;
      return `<figure class="book-learning-visual book-sum-difference" aria-label="${esc(ariaLabel)}"><figcaption>${esc(visual.title)}</figcaption><p class="book-sum-difference-intro">两条线段左端对齐；下面长出的那一段就是差。</p><div class="book-sum-difference-bars" role="group" aria-label="较短与较长线段对比"><div class="book-sum-difference-row"><b>${esc(smallLabel)}</b>${shortBar}<strong>${small}</strong></div><div class="book-sum-difference-row"><b>${esc(bigLabel)}</b>${longBar}<strong>${big}</strong></div></div><div class="book-sum-difference-steps">${steps}</div><p class="book-visual-check">${esc(visual.check || `回查：${small}+${big}=${sum}，${big}−${small}=${difference}。`)}</p></figure>`;
    }
    if (visual.type === 'ten-strategies') {
      const start = cap(visual.start, 10);
      const completing = Math.min(10 - start, cap(visual.completing, 10));
      const addend = cap(visual.addend, 20);
      const remainder = cap(visual.remainder, 20);
      const total = cap(visual.total, 20);
      const cells = Array.from({length: 10}, (_, index) => {
        const kind = index < start ? 'is-filled' : index < start + completing ? 'is-completing' : '';
        return `<span class="book-ten-cell ${kind}" aria-hidden="true">${index < start ? '●' : index < start + completing ? '+' : ''}</span>`;
      }).join('');
      const sequence = (Array.isArray(visual.countOn) ? visual.countOn : []).map(Number).filter(Number.isFinite);
      const points = sequence.map((value) => `<span class="book-number-point">${esc(value)}</span>`).join('');
      return `<figure class="book-learning-visual book-ten-strategies" aria-label="${esc(visual.title)}"><figcaption>${esc(visual.title)}</figcaption><div class="book-strategy-grid"><section class="book-strategy-panel"><h4>办法一：凑十</h4><p>十格框里先有 ${esc(start)} 个，再补 ${esc(completing)} 个。</p><div class="book-ten-frame" role="img" aria-label="十格框：${esc(start)} 个已有，补入 ${esc(completing)} 个后凑成 10">${cells}</div><p>从 ${esc(addend)} 里拆出 ${esc(completing)} 补到 ${esc(start)}，剩下 ${esc(remainder)}。</p><strong>${renderRichText(String(start) + ' + ' + addend + ' = ' + start + ' + ' + completing + ' + ' + remainder + ' = 10 + ' + remainder + ' = ' + total)}</strong></section><section class="book-strategy-panel"><h4>办法二：接着数</h4><p>从 ${esc(start)} 开始，再数 ${Math.max(0, sequence.length - 1)} 个数：</p><div class="book-number-line" role="img" aria-label="接着数：${esc(sequence.join('、'))}；从起点后再数 ${Math.max(0, sequence.length - 1)} 步">${points}</div><p>起点 ${esc(start)} 不算新数；数到 ${esc(total)} 正好走了 ${Math.max(0, sequence.length - 1)} 步。</p><strong>${renderRichText(String(start) + ' + ' + addend + ' = ' + total)}</strong></section></div><p class="book-visual-check">两种办法只是路线不同，都在数同一批数量，所以结果相同：${esc(total)}。</p></figure>`;
    }
    if (visual.type === 'story-change') {
      const dots = (count) => Array.from({length: cap(count, 20)}, () => '<span aria-hidden="true"></span>').join('');
      const storyStep = (label, value, count, extra = '') => `<div class="book-story-step ${extra}"><span>${esc(label)}</span><strong>${esc(value)} <small>${esc(visual.unit)}</small></strong><div class="book-story-dots" aria-hidden="true">${dots(count)}</div></div>`;
      return `<figure class="book-learning-visual book-story-visual" aria-label="${esc(visual.title)}"><figcaption>${esc(visual.title)}</figcaption><div class="book-story-model">${storyStep(visual.startLabel, visual.start, visual.start)}<span class="book-story-operator" aria-hidden="true">→</span>${storyStep(visual.changeLabel, `+${visual.change}`, visual.change, 'is-change')}<span class="book-story-operator" aria-hidden="true">→</span>${storyStep(visual.endLabel, visual.end, visual.end, 'is-result')}</div><p class="book-visual-equation">${renderRichText(visual.formula)}</p><p class="book-visual-check"><b>故事核对：</b>${esc(visual.check)}</p></figure>`;
    }
    if (visual.type === 'counting-model') {
      if (visual.kind === 'combinations') {
        const first = (Array.isArray(visual.firstOptions) ? visual.firstOptions : []).slice(0, 5);
        const second = (Array.isArray(visual.secondOptions) ? visual.secondOptions : []).slice(0, 5);
        const firstLabel = visual.firstLabel || '第一类';
        const secondLabel = visual.secondLabel || '第二类';
        const pairCount = first.length * second.length;
        const headers = second.map((item) => `<th scope="col">${esc(item)}</th>`).join('');
        const rows = first.map((item) => `<tr><th scope="row">${esc(item)}</th>${second.map((partner) => `<td>${esc(item)} <span aria-hidden="true">+</span> ${esc(partner)}</td>`).join('')}</tr>`).join('');
        return `<figure class="book-learning-visual book-counting-visual book-combination-visual" aria-label="${esc(visual.title)}"><figcaption>${esc(visual.title)}</figcaption><div class="book-combination-table-wrap"><table class="book-combination-table" aria-label="${esc(firstLabel)}与${esc(secondLabel)}的完整搭配，共${pairCount}种"><caption>${esc(firstLabel)}与${esc(secondLabel)}的所有搭配</caption><thead><tr><th scope="col">${esc(firstLabel)}＼${esc(secondLabel)}</th>${headers}</tr></thead><tbody>${rows}</tbody></table></div><p class="book-visual-check">${esc(visual.check || `逐格点数，共 ${pairCount} 种搭配。`)}</p></figure>`;
      }
      if (visual.kind === 'overlap') {
        const firstCount = cap(visual.firstCount, 20);
        const secondCount = cap(visual.secondCount, 20);
        const sharedCount = cap(visual.sharedCount, Math.min(firstCount, secondCount));
        const firstOnly = firstCount - sharedCount;
        const secondOnly = secondCount - sharedCount;
        const total = firstOnly + sharedCount + secondOnly;
        const firstLabel = visual.firstLabel || '第一类';
        const secondLabel = visual.secondLabel || '第二类';
        const sharedLabel = visual.sharedLabel || '两类都属于';
        const ariaLabel = `${visual.title}：${firstLabel}共 ${firstCount} 人，${secondLabel}共 ${secondCount} 人，共同 ${sharedCount} 人；只在第一类 ${firstOnly} 人、共同 ${sharedCount} 人、只在第二类 ${secondOnly} 人，至少一类共 ${total} 人。`;
        return `<figure class="book-learning-visual book-counting-visual book-overlap-visual" aria-label="${esc(visual.title)}"><figcaption>${esc(visual.title)}</figcaption><div class="book-overlap-regions" role="img" aria-label="${esc(ariaLabel)}"><div class="book-overlap-region"><span>只${esc(firstLabel.replace(/^喜欢/u, '喜欢'))}</span><strong>${firstOnly} 人</strong></div><div class="book-overlap-region is-shared"><span>${esc(sharedLabel)}</span><strong>${sharedCount} 人</strong></div><div class="book-overlap-region"><span>只${esc(secondLabel.replace(/^喜欢/u, '喜欢'))}</span><strong>${secondOnly} 人</strong></div></div><p class="book-overlap-equation">${renderRichText(`${firstCount} + ${secondCount} − ${sharedCount} = ${total}`)} <span>人</span></p><p class="book-visual-check">${esc(visual.check || `两类人数相加后减去重复的一份，共 ${total} 人。`)}</p></figure>`;
      }
      if (visual.kind === 'pairs') {
        const total = cap(visual.count, 20);
        const pairGroups = Math.floor(total / 2);
        const leftover = total % 2;
        const itemLabel = visual.itemLabel || '物品';
        const pairs = Array.from({length:pairGroups}, (_, index) => `<span class="book-pair-group"><b aria-hidden="true">● ●</b><small>第 ${index + 1} 对</small></span>`).join('');
        const remainder = leftover ? '<span class="book-pair-remainder"><b aria-hidden="true">●</b><small>剩 1 个</small></span>' : '<span class="book-pair-remainder is-empty"><b>没有剩下</b></span>';
        const ariaLabel = `${total} ${itemLabel}分成 ${pairGroups} 对，剩 ${leftover} 个。`;
        return `<figure class="book-learning-visual book-counting-visual book-pairing-visual" aria-label="${esc(visual.title)}"><figcaption>${esc(visual.title)}</figcaption><div class="book-pair-groups" role="img" aria-label="${esc(ariaLabel)}">${pairs}${remainder}</div><p class="book-visual-check">${esc(visual.check || ariaLabel)}</p></figure>`;
      }
    }
    return '';
  }

  function deepUnitMarkup(unit, key) {
    if (!unit) return '';
    const concepts = (unit.concepts || []).map((item) => `<article><b>${esc(item.title)}</b><p>${renderRichText(item.text)}</p></article>`).join('');
    const model = unit.model ? (window.AOSHU_FOUNDATION_WIDGETS?.supports(unit.model.type) ? window.AOSHU_FOUNDATION_WIDGETS.markup(unit.model) : `<section class="book-model-lab" data-book-model="${esc(unit.model.type)}" data-book-model-config="${esc(JSON.stringify(unit.model))}" aria-label="互动图示"><div class="book-model-heading"><b>动手试一试</b><span>${unit.model.type === 'fraction-bar' ? '拖动分子或改变分母，看“每一份”怎样变化' : '拖动数轴上的数，检查它是否同时满足两个余数条件'}</span></div>${unit.model.type === 'fraction-bar' ? `<div class="book-model-controls"><label>分母 <select data-fraction-denominator aria-label="分母">${Array.from({length:11},(_,i)=>i+2).map((d)=>`<option value="${d}"${d===unit.model.denominator?' selected':''}>${d}</option>`).join('')}</select></label><label>分子 <input type="range" min="1" max="${unit.model.denominator}" value="${unit.model.numerator}" data-fraction-numerator aria-label="分子"></label></div><div class="book-fraction-bar" data-fraction-pieces role="img"></div><p class="book-model-result" data-book-model-result aria-live="polite"></p>` : `<label class="book-number-control">试一个数 x <input type="range" min="${unit.model.min}" max="${unit.model.max}" value="${unit.model.start}" data-remainder-candidate aria-label="选择候选数 x"></label><p class="book-model-result" data-book-model-result aria-live="polite"></p><div class="book-remainder-strip" data-remainder-strip role="img" aria-label="0 到 59 的候选数，标记同时满足条件的数"></div><p class="book-model-caption">带圆点的数同时满足两个条件；它们每隔 15 重复一次。</p>`}</section>`) : '';
    const renderDeepDiagram = (visual) => visual?.type ? learningVisualMarkup(visual) : visual ? `<figure class="book-deep-diagram"><figcaption>${esc(visual.caption)}</figcaption><pre class="book-diagram">${esc(visual.text)}</pre></figure>` : '';
    const diagram = Array.isArray(unit.diagrams) ? unit.diagrams.map(renderDeepDiagram).join('') : renderDeepDiagram(unit.diagram);
    const method = unit.methodCard ? `<section class="book-method-card" aria-label="方法卡"><span>小方法卡</span><h4>${esc(unit.methodCard.title)}</h4><strong class="book-method-formula">${renderRichText(unit.methodCard.formula)}</strong><div class="book-method-card-grid"><p><b>什么时候用：</b>${renderRichText(unit.methodCard.when)}</p><p><b>怎样做：</b>${renderRichText((unit.methodCard.steps || []).join(' → '))}</p><p><b>检查：</b>${renderRichText(unit.methodCard.check)}</p></div></section>` : '';
    const parityBoard = unit.parityBoard ? (() => {
      const visual = unit.parityBoard;
      const parityWord = (kind) => kind === 'odd' ? '奇' : '偶';
      const parityClass = (kind) => kind === 'odd' ? 'is-odd' : 'is-even';
      const chip = (kind, label) => `<span class="book-parity-chip ${parityClass(kind)}">${esc(label || parityWord(kind))}</span>`;
      const numberTag = (value, kind) => `<span class="book-parity-number ${parityClass(kind)}"><b>${esc(value)}</b><small>${parityWord(kind)}</small></span>`;
      const equation = (left, operator, right, result) => `<div class="book-parity-equation" aria-label="${parityWord(left)}${esc(operator)}${parityWord(right)}等于${parityWord(result)}">${chip(left)}<span class="book-parity-operator" aria-hidden="true">${esc(operator)}</span>${chip(right)}<span class="book-parity-equals" aria-hidden="true">=</span>${chip(result)}</div>`;
      const definitions = visual.definitions.map((item) => `<article class="book-parity-definition ${parityClass(item.kind)}"><div><span class="book-parity-definition-label">${esc(item.label)}</span><strong>${renderRichText(item.formula)}</strong></div><p>${esc(item.note)}</p></article>`).join('');
      const addition = visual.addition.map((item) => equation(item.left, '+', item.right, item.result)).join('');
      const multiplication = visual.multiplication.map((item) => item.type === 'equation'
        ? equation(item.left, '×', item.right, item.result)
        : `<div class="book-parity-general-rule"><b>${esc(item.label)}</b><span aria-hidden="true">→</span>${chip(item.result, item.resultLabel)}</div>`).join('');
      const example = visual.example;
      return `<section class="book-parity-board" aria-label="奇偶规律图卡"><header class="book-parity-board-head"><span>先看重点</span><h4>奇偶规律，一眼找到</h4><p>奇和偶用不同颜色标出来；公式比文字更容易对照。</p></header><div class="book-parity-definition-grid" aria-label="奇数和偶数的写法">${definitions}</div><div class="book-parity-law-grid"><section aria-label="加法规律"><h5>加法：看两数的奇偶</h5><div class="book-parity-rule-list">${addition}</div></section><section aria-label="乘法规律"><h5>乘法：先找偶数因数</h5><div class="book-parity-rule-list">${multiplication}</div></section></div><section class="book-parity-worked" aria-label="奇偶判断例题"><div class="book-parity-worked-head"><span>算式侦探</span><strong>${esc(standardizeMathSymbols(example.expression))}</strong></div><div class="book-parity-worked-steps"><div class="book-parity-worked-step"><b>① 先看乘法</b><div class="book-parity-equation" aria-label="${esc(example.left)}是${parityWord(example.leftKind)}数，乘以${esc(example.right)}这个${parityWord(example.rightKind)}数，结果是${parityWord(example.product)}数">${numberTag(example.left, example.leftKind)}<span class="book-parity-operator" aria-hidden="true">×</span>${numberTag(example.right, example.rightKind)}<span class="book-parity-equals" aria-hidden="true">=</span>${chip(example.product, example.productLabel)}</div></div><div class="book-parity-worked-step"><b>② 再加上 ${esc(example.addend)}</b><div class="book-parity-equation" aria-label="${parityWord(example.product)}加${parityWord(example.addendKind)}等于${parityWord(example.result)}">${chip(example.product, example.productLabel)}<span class="book-parity-operator" aria-hidden="true">+</span>${numberTag(example.addend, example.addendKind)}<span class="book-parity-equals" aria-hidden="true">=</span>${chip(example.result, example.resultLabel)}</div></div></div><p>${renderRichText(example.note)}</p></section><p class="book-parity-takeaway">${esc(visual.takeaway)}</p></section>`;
    })() : '';
    return `<section class="book-deep-unit" aria-label="本轮深讲内容"><header><span class="book-deep-label">${esc(unit.label)}</span><h3>${esc(unit.title)}</h3><p><b>本轮范围：</b>${renderRichText(unit.scope)}</p></header>${diagram}${method}${parityBoard}<div class="book-deep-concepts">${concepts}</div>${model}</section>`;
  }

  function reviewMarkup(unit) {
    if (!unit?.review?.length) return '';
    const items = unit.review.map((item) => `<li><p>${renderRichText(item.question)}</p><details><summary>展开核对</summary><p>${renderRichText(item.answer)}</p></details></li>`).join('');
    return `<section class="book-review"><h3>复习自检 · 不看答案先讲一遍</h3><ol>${items}</ol></section>`;
  }

  function lessonCard(lesson, index, openId) {
    const key = keyOf(lesson);
    const grade = Number(lesson.grade || 3);
    const done = isDone(lesson);
    const practices = practiceList(lesson);
    const solved = new Set(solvedFor(lesson));
    const legacyDone = legacyDoneFor(lesson);
    const expanded = openId ? key === openId : index === 0;
    const chapter = lesson.chapterLabel || (grade === 3 ? `三年级 · 第 ${lesson.n} 讲` : grade === 4 ? `四年级精选路线 · 第 ${lesson.n} 项` : `小学${grade}年级 · 第 ${lesson.n} 讲`);
    const displayNumber = lesson.displayNumber || String(lesson.n).padStart(2,'0');
    const steps = (lesson.steps || []).map((step) => `<li>${renderRichText(step)}</li>`).join('');
    const diagram = lesson.diagram ? `<pre class="book-diagram" aria-label="题目示意图">${esc(lesson.diagram)}</pre>` : '';
    const lessonId = `book-lesson-${key.replace(/[^a-zA-Z0-9_-]/g,'-')}`;
    const answerId = `book-answer-${key.replace(/[^a-zA-Z0-9_-]/g,'-')}`;
    const checks = practices.map((item, itemIndex) => {
      const itemDone = solved.has(itemIndex);
      const answers = JSON.stringify(item.answers || []);
      return `<div class="book-practice-item${itemDone ? ' is-correct' : ''}" data-book-practice-item="${itemIndex}"><p class="book-question">${lesson.deepUnit ? `<b>练习 ${itemIndex + 1}${item.level ? ` · ${esc(item.level)}` : ''}</b> · ` : ''}${renderRichText(item.question || lesson.practice)}</p><div class="book-answer-row"><input id="${esc(answerId)}-${itemIndex}" type="text" inputmode="text" autocomplete="off" aria-label="${esc(chapter)}第${itemIndex + 1}题答案" placeholder="写下你的答案" data-book-answer="${esc(key)}" data-book-index="${itemIndex}" data-answer-options="${esc(answers)}"><button type="button" data-book-check="${esc(key)}" data-book-index="${itemIndex}" aria-label="${esc(chapter)}第${itemIndex + 1}题检查答案">检查答案</button></div><p class="book-feedback${itemDone ? ' good' : ''}" aria-live="polite" data-book-feedback="${esc(key)}" data-book-index="${itemIndex}">${itemDone ? '这道练习已经答对；可以再用自己的话讲讲理由。' : '先独立完成；卡住时打开提示，再试一次。'}</p><details class="book-hint"><summary>卡住了？先看提示</summary><p>${renderRichText(item.hint || lesson.hint)}</p></details><details class="book-solution"><summary>看完整解法与核对</summary><p>${renderRichText(item.explanation || lesson.explanation)}</p></details></div>`;
    }).join('');
    const practiceCount = done ? '本讲已完成' : lesson.deepUnit ? `${solved.size} / ${practices.length} 题答对` : '自测 1 题';
    const moduleMarkup = deepUnitMarkup(lesson.deepUnit, key);
    const review = reviewMarkup(lesson.deepUnit);
    const sourceNote = `<p class="book-source-attribution"><b>课程来源/编排：</b>${esc(lesson.source || '待核；不宣称为教材原题。')}</p>`;
    const legacyNote = legacyDone && !done ? '<p class="book-progress-compat-note">已保留你完成旧版自测的记录；本讲现有 3 道新练习，旧记录不会被误算成新内容已完成。</p>' : '';
    const prerequisiteLinksMarkup = (lesson.prerequisiteLinks || []).map((item) => `<a class="book-prerequisite-link" href="${esc(item.href)}">${esc(item.label)}</a>`).join('、');
    const prerequisiteMarkup = grade === 3 && lesson.prerequisite ? `<p class="book-prerequisite"><b>先会：</b>${renderRichText(lesson.prerequisite)}${prerequisiteLinksMarkup ? `<br><b>可回看路线：</b>${prerequisiteLinksMarkup}` : ''}</p>` : grade === 4 && lesson.prerequisite ? `<p class="book-prerequisite"><b>学习前建议（本站）：</b>${renderRichText(lesson.prerequisite)}</p>` : '';
    const difficultyBadge = grade === 4 && lesson.suggestedDifficulty ? `<small class="book-level-badge" data-level="${esc(lesson.suggestedDifficulty)}">站内难度建议 · ${esc(lesson.suggestedDifficulty)}</small>` : '';
    const baseRelatedLabel = String(lesson.link || '打开相关课程').replace(/^接着学[：:]\s*/, '');
    const linkLevelLabel = grade === 3 && lesson.linkLevel && lesson.linkLevel !== '入门' ? `选学${lesson.linkLevel} · ` : '';
    const relatedLabel = `${linkLevelLabel}${baseRelatedLabel}`;
    return `<details class="book-lesson${done ? ' is-done' : ''}" id="${esc(lessonId)}" data-book-id="${esc(key)}" data-grade="${grade}"${expanded ? ' open' : ''}>
      <summary><span class="book-number">${esc(displayNumber)}</span><span class="book-heading"><small class="book-grade-label">${esc(chapter)}</small><span class="book-badges"><small class="book-group-badge">${esc(lesson.group)}</small><small class="book-status">${esc(lesson.status)}</small>${difficultyBadge}</span><b>${esc(lesson.title)}</b></span><span class="book-state">${done ? '已完成' : legacyDone ? '旧版自测已过' : '未完成'}</span><span class="book-fold" aria-hidden="true">＋</span></summary>
      <div class="book-body">
        ${sourceNote}${legacyNote}
        ${prerequisiteMarkup}
        <p class="book-goal"><b>这一讲要会：</b>${renderRichText(lesson.goal)}</p>
        <p class="book-idea"><b>关键想法：</b>${renderRichText(lesson.idea)}</p>
        <section class="book-example" aria-label="分步例题"><span class="book-example-label">老师示范 · 一步一步来</span><strong>${renderRichText(lesson.example)}</strong>${diagram}<ol>${steps}</ol></section>
        ${moduleMarkup}
        <section class="book-practice" aria-label="本讲自测"><div class="book-practice-top"><h3>${lesson.deepUnit ? '现在轮到你练习' : '轮到你试一题'}</h3><span class="book-count">${practiceCount}</span></div>${checks}</section>
        ${review}
        <a class="book-related" href="${esc(lesson.href || '/siwei/curriculum.html')}"><span>${esc(relatedLabel)}</span><span aria-hidden="true">↗</span></a>
      </div>
    </details>`;
  }

  function updateInteractiveModel(root) {
    if (window.AOSHU_FOUNDATION_WIDGETS?.update(root)) return;
    let config = {};
    try { config = JSON.parse(root.dataset.bookModelConfig || '{}'); } catch { config = {}; }
    const result = root.querySelector('[data-book-model-result]');
    if (root.dataset.bookModel === 'fraction-bar') {
      const denominator = root.querySelector('[data-fraction-denominator]');
      const numerator = root.querySelector('[data-fraction-numerator]');
      if (!denominator || !numerator || !result) return;
      const d = Number(denominator.value);
      numerator.min = '0';
      numerator.max = String(d);
      if (Number(numerator.value) > d) numerator.value = String(d);
      const n = Number(numerator.value);
      const gcd = (a,b) => b ? gcd(b,a%b) : a;
      const divisor = gcd(n,d);
      const simplifiedDenominator = d / divisor;
      const simplified = simplifiedDenominator === 1 ? String(n / divisor) : `${n/divisor}/${simplifiedDenominator}`;
      const pieces = root.querySelector('[data-fraction-pieces]');
      pieces.style.setProperty('--fraction-denominator', d);
      pieces.innerHTML = Array.from({length:d},(_,i)=>`<span class="${i<n?'is-shaded':''}" aria-hidden="true"></span>`).join('');
      pieces.setAttribute('aria-label', `${d} 等份中涂色 ${n} 份，表示 ${n}/${d}，约分后是 ${simplified}`);
      result.innerHTML = renderRichText(`${n}/${d} 表示 ${d} 个同样大小的份中取 ${n} 份；约分后是 ${simplified}。${config.caption ? ` ${config.caption}` : ''}`);
      return;
    }
    if (root.dataset.bookModel === 'remainder-line') {
      const slider = root.querySelector('[data-remainder-candidate]');
      const strip = root.querySelector('[data-remainder-strip]');
      if (!slider || !strip || !result) return;
      const value = Number(slider.value);
      const conditions = config.conditions || [];
      const remainderOf = (n,d) => ((n % d) + d) % d;
      const remainders = conditions.map(({divisor}) => remainderOf(value,divisor));
      const satisfies = conditions.every(({divisor,remainder},i) => remainders[i] === remainder);
      const statements = conditions.map(({divisor,remainder},i) => `${value} 除以 ${divisor} 余 ${remainders[i]}（目标 ${remainder}）`);
      result.innerHTML = renderRichText(`x = ${value}：${statements.join('；')}。${satisfies ? '两个条件同时成立。' : '这次没有同时满足两个条件。'}`);
      const cells = [];
      for (let n=Number(config.min); n<=Number(config.max); n++) {
        const match = conditions.every(({divisor,remainder}) => remainderOf(n,divisor) === remainder);
        cells.push(`<span class="${match?'is-match ':''}${n===value?'is-current':''}"${match?` aria-label="${n}：同时满足"`:''}>${n}</span>`);
      }
      strip.innerHTML = cells.join('');
    }
  }

  function render() {
    if (!lessons.length) {
      visibleCount.textContent = '课程内容正在整理';
      return;
    }
    const openId = document.querySelector('.book-lesson[open]')?.dataset.bookId || '';
    const term = searchKey(search.value);
    const selectedGrade = gradeFilter.value;
    const selectedTopic = topicFilter.value;
    const visible = lessons.filter((lesson) => {
      const grade = String(lesson.grade || 3);
      const searchCorpus = searchKey([lesson.title, lesson.group, lesson.goal, lesson.idea, lesson.example, lesson.practice, lesson.status, lesson.grade, searchableText(lesson.deepUnit)].join(' '));
      const matchesSearch = !term || searchCorpus.includes(term);
      const matchesGrade = selectedGrade === 'all' || grade === selectedGrade;
      const matchesTopic = selectedTopic === 'all' || lesson.group === selectedTopic;
      const matchesProgress = !onlyUnmastered.checked || !isDone(lesson);
      return matchesSearch && matchesGrade && matchesTopic && matchesProgress;
    }).sort((a,b) => (Number(a.grade||3)-Number(b.grade||3)) || (Number(a.routeOrder ?? a.n)-Number(b.routeOrder ?? b.n)));
    list.innerHTML = visible.map((lesson,index) => lessonCard(lesson,index,openId)).join('');
    list.querySelectorAll('.book-lesson').forEach((card) => {
      const lesson = visible.find((item) => keyOf(item) === card.dataset.bookId);
      if (!lesson) return;
      practiceList(lesson).forEach((practice, index) => {
        if (!practice.diagram) return;
        const question = card.querySelector(`[data-book-practice-item="${index}"] .book-question`);
        if (question) question.insertAdjacentHTML('afterend', learningVisualMarkup(practice.diagram));
      });
    });
    visibleCount.textContent = `显示 ${visible.length} / ${lessons.length} 讲`;
    empty.hidden = visible.length !== 0;
    list.querySelectorAll('[data-book-model]').forEach(updateInteractiveModel);
    updateProgress();
  }

  function checkAnswer(button) {
    const key = button.dataset.bookCheck;
    const lesson = lessons.find((item) => keyOf(item) === key);
    if (!lesson) return;
    const card = button.closest('.book-lesson');
    const index = Number(button.dataset.bookIndex || 0);
    const practice = practiceList(lesson)[index];
    const input = card.querySelector(`[data-book-answer][data-book-index="${index}"]`);
    const feedback = card.querySelector(`[data-book-feedback][data-book-index="${index}"]`);
    const answer = normalize(input?.value);
    if (!answer) {
      feedback.textContent = '先写一个答案；卡住时可以打开提示。';
      feedback.classList.remove('good');
      input?.focus();
      return;
    }
    const correct = (practice?.answers || []).some((expected) => answersMatch(expected, input?.value));
    if (correct) {
      const solved = new Set(solvedFor(lesson));
      solved.add(index);
      const done = solved.size >= practiceList(lesson).length;
      progress[key] = lesson.deepUnit ? {done,solved:[...solved],...(legacyDoneFor(lesson) ? {legacyDone:true} : {})} : {done:true};
      saveProgress();
      feedback.textContent = practice.correctFeedback || '答对了！打开解法核对步骤，再用自己的话讲讲为什么。';
      feedback.classList.add('good');
      card.querySelector(`[data-book-practice-item="${index}"]`)?.classList.add('is-correct');
      card.classList.toggle('is-done', done);
      card.querySelector('.book-state').textContent = done ? '已完成' : '练习中';
      card.querySelector('.book-count').textContent = done ? '本讲已完成' : `${solved.size} / ${practiceList(lesson).length} 题答对`;
      updateProgress();
    } else {
      feedback.textContent = practice.wrongFeedback || '再想一想：答案放回题目后，条件都满足吗？提示已经打开，找到不合的地方再试一次。';
      feedback.classList.remove('good');
      const hint = card.querySelectorAll('.book-practice-item')[index]?.querySelector('.book-hint');
      if (hint) hint.open = true;
    }
  }

  list.addEventListener('click', (event) => {
    const link = event.target.closest('a.book-related[href^="#book-lesson-"], a.book-prerequisite-link[href^="#book-lesson-"]');
    if (!link) return;
    const key = link.getAttribute('href').match(/^#book-lesson-([a-zA-Z0-9_-]+)$/)?.[1];
    if (!key || !lessons.some((lesson) => keyOf(lesson) === key)) return;
    event.preventDefault();
    search.value = '';
    gradeFilter.value = 'all';
    topicFilter.value = 'all';
    onlyUnmastered.checked = false;
    render();
    history.replaceState(null, '', `#book-lesson-${key}`);
    const target = document.getElementById(`book-lesson-${key}`);
    if (target) { target.open = true; target.scrollIntoView({behavior:'smooth',block:'start'}); }
  });
  list.addEventListener('click', (event) => {
    const button = event.target.closest('[data-book-check]');
    if (button) checkAnswer(button);
  });
  list.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && event.target.matches('[data-book-answer]')) {
      event.preventDefault();
      event.target.closest('.book-answer-row').querySelector('[data-book-check]').click();
    }
  });
  list.addEventListener('input', (event) => {
    if (event.target.matches('[data-foundation-model-control]')) updateInteractiveModel(event.target.closest('[data-book-model]'));
    if (event.target.matches('[data-fraction-numerator],[data-remainder-candidate]')) updateInteractiveModel(event.target.closest('[data-book-model]'));
  });
  list.addEventListener('change', (event) => {
    if (event.target.matches('[data-foundation-model-control],[data-fraction-denominator]')) updateInteractiveModel(event.target.closest('[data-book-model]'));
  });
  search.addEventListener('input', render);
  gradeFilter.addEventListener('change', render);
  topicFilter.addEventListener('change', render);
  onlyUnmastered.addEventListener('change', render);
  render();
})();
