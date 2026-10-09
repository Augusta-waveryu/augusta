(() => {
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
  const richSpan = (math, text) => `<span class="bc-rich-line ${math ? 'bc-rich-math' : 'bc-rich-prose'}"${math ? ' role="math"' : ''}>${esc(text)}</span>`;
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
  const renderFormulaLines = (value) => String(value ?? '').split(/[；;]/u).filter(Boolean).map((part) => {
    const text = standardizeMathSymbols(part.trim());
    const isEquation = mathPattern.test(text) || text.includes('/');
    return isEquation ? richSpan(true, text) : renderRichText(text);
  }).join('');
  const setRichText = (element, value) => { if (element) element.innerHTML = renderRichText(value); };
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
  const curriculum = window.AOSHU_CURRICULUM || [];
  const id = new URLSearchParams(location.search).get('branch') || 'arithmetic';
  const branch = curriculum.find((item) => item.id === id);
  const curriculumUrl = '/aoshu/curriculum.html';
  const routes = {
    number:{title:'数与规律',count:11,url:'/aoshu/number-theory.html'},
    arithmetic:{title:'计算、分数与比例',count:6,url:'/aoshu/branch-course.html?branch=arithmetic'},
    applications:{title:'经典数量关系',count:6,url:'/aoshu/branch-course.html?branch=applications'},
    geometry:{title:'几何与空间',count:8,url:'/aoshu/branch-course.html?branch=geometry'},
    counting:{title:'计数、组合与概率',count:7,url:'/aoshu/branch-course.html?branch=counting'},
    sequences:{title:'数列、周期与规律',count:8,url:'/aoshu/sequences.html'},
    algebra:{title:'代数思维与整数方程',count:5,url:'/aoshu/branch-course.html?branch=algebra'},
    logic:{title:'逻辑推理与解题策略',count:6,url:'/aoshu/branch-course.html?branch=logic'}
  };
  if (!branch) {
    document.querySelector('.bc-main').innerHTML = `<section class="bc-not-found"><h1>没有找到这条课程分支</h1><p>可以回知识树挑选课程，或者打开数列、数论专题课。</p><a href="${curriculumUrl}">返回全部知识点</a></section>`;
    return;
  }

  const methods = {
    arithmetic:[['先看数量关系','题目是在求总量、部分、倍数，还是变化后的量？'],['选合适的表示','画分数条、比值条或列出单位，别急着算。'],['按规则计算','通分、凑整、交叉相乘或统一单位。'],['估算并检查','结果大小和单位是否符合原来的问题？']],
    applications:[['圈出已知与所求','把总数、差、份数、变化量分别标出来。'],['画图或作假设','线段图、列表或“先全当一种”让关系看得见。'],['算出关键差量','比较两种方案相差多少，再除以每份的变化。'],['放回题目验算','人数、个数、时间和总量都要对上。']],
    geometry:[['先标图','边长、角度、直角、平行和相等边都标清。'],['找图形关系','判断能不能拼补、平移、对称或分成三角形。'],['选公式或性质','先说清为什么能用这个面积、角度或体积关系。'],['核对单位和范围','长度、面积、体积单位不同；图形也要符合条件。']],
    counting:[['说清“什么算一种”','顺序是否重要？对象是否可重复？哪些结果不合法？'],['先画计数结构','互斥类别用加法；每枝合法后续数相同才直接相乘；不同分枝逐枝相加。'],['选择清单或树','小规模列清单；连续选择画树；网格路径用格点表。'],['逐项核验边界','检查限制、障碍、顺序，以及每个完整结果是否只数一次。']],
    algebra:[['给未知量取名字','先写“设 x 表示……”并带上单位。'],['把文字翻译成等量','“一共、相差、几倍、剩下”对应不同关系。'],['保持等式平衡','等式两边做同一种运算，再逐步解出未知数。'],['代回原题检查','把答案放回每个条件，看是否都成立。']],
    logic:[['先辨题目目标','问唯一安排、原数、真假/不可能、可行/全部，还是最值与保证？'],['按目标选择工具','对应关系用候选表；起点倒推须可逆；全称找反例、不可能用反证；重复操作找不变量；存在用构造、全部做分类；最值看目标如何变化。'],['逐步留下证据','划掉候选写明线索；倒推保留余数；假设要写出冲突；分类要列全范围。'],['回查范围与结论','核对全部前提、整数/余数/单位、唯一性和边界；不要把“未排除”说成“已证明”。']]
  };

  const lessonRoutes = {
    arithmetic: {
      'order-operations': ['先按括号和运算规则确定顺序：先括号、再乘除、后加减；同级从左向右', '只有同级加法或乘法可交换、结合来凑整；减法和除法不随意重排', '按允许的顺序计算，或在不改变原值时先配出整十、整百', '用运算顺序复核；凑整变形可按原顺序重算核对'],
      fractions: ['确认分数表示同一个整体；分母与除法的除数都不能为 0', '分清求和差、求一个量的几分之几，还是数里面有几个分数单位', '加减先通分；乘法按分数相乘；除以非零分数改乘它的倒数', '约分或化带分数，再用大小关系或“商 × 除数 = 被除数”检查'],
      ratio: ['标清两量的前后顺序和单位，判断是在求等值比还是按比分配', '等值比先同除公因数约简或按对应位置列比例（后项非 0）；分配题先求总份数', '按比分配用总量 ÷ 总份数求一份，再分别乘各自份数', '回查总量与比的顺序；不可拆的物品还要检查分得整数'],
      percent: ['为每个百分数圈出它对应的基数；折扣先认清保留比例', '判断求部分、反求原量还是求变化后量：部分乘百分率，反求基数用除法', '每一步按当时的基数计算；连续涨跌要先更新基数再算下一步', '检查涨跌方向和数量级，再把结果代回基数与变化过程'],
      average: ['圈出同单位的总量、份数，并确认题目要平均数还是总量', '已知总量求平均数用总量 ÷ 份数；已知平均数求总量用平均数 × 份数', '若新增或拿走数据，先更新总量和份数，再重新求平均数', '把平均数乘回份数核验总量；新增数据题要逐项回查'],
      'speed-work': ['统一距离和时间单位；辨清求路程、速度、时间，还是工作量与效率', '单人行程用路程 = 速度 × 时间及其变式；工作先把整项任务看作 1', '相遇用速度和、追及用速度差；合作工作用效率和', '带上单位代回关系检查：路程、时间或总工作量是否符合题意']
    },
    applications: {
      'basic-application': ['确定同一对象的起点与所求', '逐次判断该对象增加还是减少', '按事件顺序更新；倒推就倒序撤销', '代回核对对象、单位与变化结果'],
      'sum-difference': ['确认同单位的和 S、差 D（大数减小数）', '要小数先算 S−D；要大数先算 S+D', '把对应的两份相等量除以 2', '回查和、差，并检查整数与非负边界'],
      'chicken-rabbit': ['头数固定，先假设全是腿少的一类', '用实有腿数减去假设腿数', '差额除以每次替换多出的腿数', '检查整数与只数范围，再回验头数和腿数'],
      'surplus-shortage': ['确认同一批物品、同一人数且每份数不同', '按盈亏方向求总差：一盈一亏相加，同向相减', '总差除以每人份额差，得到人数', '两种分配回算同一总量，并检查正整数人数'],
      planting: ['先辨直线或封闭圈，并标清端点种植情况', '总长 ÷ 间距求间隔数（等距且能整除）', '直线两端都种加 1；只种一端或围成一圈不加', '回验全程长度与首尾关系，不混用端点'],
      ages: ['设共同时间 t，两人年龄都加或减 t', '以同一时刻列出题目的倍数关系', '解 t，检查符合“几年前”或“几年后”的范围', '代回倍数条件，并核对年龄差不变']
    },
    counting: {
      'systematic-counting': ['先定义一个完整结果，并写清限制：顺序是否重要、对象能否重复', '选唯一分类标准（如十位）；各类须互不重叠且覆盖全部合法情况', '按固定顺序列清单；选择逐步发生时画树，只保留符合限制的分枝', '只数完整结果或叶端，检查每种合法结果恰好出现一次'],
      'add-multiply-principle': ['先说清完整结果是什么，判断是互斥类别“选一类”还是“每一步都要做”；“或”不自动表示互斥', '互不重叠的类别数相加；类别有交集时先去重或重新分类', '分步任务画树；只有每个前置选择后都有相同数量的合法后续选法，才直接相乘', '后续分枝数不同就逐枝数完整结果再相加，并检查每个结果只对应一组选择'],
      'permutations-selections': ['确认对象彼此不同、选取不重复；若允许重复或对象相同，先重新确定各步选法', '判断交换位置或职位后结果是否改变：改变是排列；无职位小组只看成员', '排列按位置依次选并相乘；组合先数有序选法，再除以 r!（每组选中对象确有 r! 种顺序）', '核对人数、限制与结果定义；职位交换是否另算，小组是否没有因书写顺序重复计数'],
      'path-counting': ['先限定起点、终点、允许方向和是否只数最短路；位置法要求无障碍且只向右、向上', '符合条件时固定 R 个右步、U 个上步；从 R+U 个位置中选 U 个放上步', '也可逐格递推：起点记 1、边缘按规则填；内部点=左边+下边，禁行点记 0', '核对每条路的步数与限制；有障碍、可后退或绕行时，不套固定步数的位置法'],
      pigeonhole: ['确认 N 个对象都且只归入 k 个明确、完整的类别', '按最坏情况尽量分散；至少一类的保证数为 ⌈N/k⌉', '可反查：若每类至多 ⌈N/k⌉−1，总数仍小于 N，故必有一类达到保证数', '若问取几次才能保证某事，先数最坏时仍可避开的对象，再加 1 并检查情形可行'],
      'inclusion-exclusion': ['界定全集、A、B及交集，辨清所求是“至少一类”还是“恰好一类”', '数至少属于一类：|A∪B|=|A|+|B|−|A∩B|；交集在两类中被多算一次', '恰好一类要分别扣除交集；三类并集=单项之和−三组两两交集+三重交集', '拆成只属 A、两类都属、只属 B、都不属核验；并集不得超过全集'],
      probability: ['写出试验和全部基本结果；结果须互斥、完整且机会相同，才能直接按个数计', '逐项标出符合条件的结果；多步试验按完整结果计，不等可能时改用概率权重', '概率=有利的等可能结果数÷全部等可能结果数，再约分', '检查结果在 0 与 1 之间，并用完整清单或补事件（总概率为 1）复核']
    }
  };

  const language = {
    'order-operations':['运算顺序 · 先做哪一步，后做哪一步','看清括号和运算符，再从容易凑整的部分开始。'],
    fractions:['单位“1” · 被平均分成几份、取了几份','同一个分数可以换一种等值写法，例如 1/2=2/4。'],
    ratio:['前项、后项、比值 · 两个量如何比较','比的两项一起乘或除同一个非零数，比值不变。'],
    percent:['百分率 · 每 100 份里占多少','先问“百分之几是谁的百分之几”，找到变化基数。'],
    average:['总量、份数、平均数 · 平均分之后每份一样多','总量不变时，平均数就是每份的大小。'],
    'speed-work':['路程、速度、时间 · 同一段路走了多久','单位先统一；工作问题把整件工作看成 1。'],
    'sum-difference':['和、差 · 两数合起来与相差多少','大数和小数的中间值是“和的一半”，再向两边分开。'],
    'basic-application':['已知量、变化量与所求 · 从故事变成算式','先找开始时的数量，再逐次判断增加还是减少。'],
    'chicken-rabbit':['假设量、差量 · 把多出来的部分找出来','每替换一个对象，总量会改变多少？把单位差说清楚。'],
    'surplus-shortage':['盈、亏、差额 · 两种分法差在哪里','一边剩、一边不够时相加；两边都剩或都不够时相减。'],
    planting:['间隔、端点 · 先数间隔，再数端点上的树','直线两端都种比间隔多 1；围成圈则没有额外端点。'],
    ages:['年龄差 · 一起长大，但两人的差不变','设几年后为 x，两个人的年龄都要加上同一个 x。'],
    angles:['平角、内角和、对应角 · 先找完整的一圈或一条直线','复杂图形可以补角、拆成三角形，记得角度相加。'],
    'triangle-inequality':['两边之和、两边之差 · 第三边必须落在范围内','第三边比两边差更长，又要比两边和更短。'],
    'perimeter-area':['周长、面积 · 边界长度和铺满的大小不是一回事','周长用长度单位；面积用平方单位。'],
    'composite-area':['补形、切割、平移 · 复杂图形变成熟悉图形','只移动或切拼，不会凭空增加或减少面积。'],
    'area-equivalence':['底、高、等积 · 形状不同也可能面积相同','底和对应的垂直高不变，面积关系就能比较。'],
    'grid-symmetry':['格点、对称轴 · 数格子，找镜像','对称点到对称轴的距离相同；线段和小格别混数。'],
    solids:['表面积、体积 · 外壳大小和装得下多少','表面积用平方单位；体积用立方单位。'],
    'geometric-counting':['边界、分类 · 由几条线围成一个图形','矩形由两条横线和两条竖线确定，选线比逐个数更稳。'],
    'systematic-counting':['分类标准 · 每种情况放进且只放进一类','分类要互不重叠又覆盖全部可能。'],
    'add-multiply-principle':['分类、分步 · 任选一类还是每一步都要做','互斥选法相加；连续选择相乘。'],
    'permutations-selections':['排列、组合 · 顺序改变算不算另一种','交换角色后如果结果不同，就是顺序重要。'],
    'path-counting':['路径、最后一步 · 一条路从哪里来到终点','到一个点的走法数，等于从各个可来方向的走法数相加。'],
    pigeonhole:['抽屉、最坏情况 · 对象放进较少类别','先尽量分散；超出类别数的下一个对象会和别人同类。'],
    'inclusion-exclusion':['并集、交集 · 重复算到的部分要减回去','先把“都会”那群人单独标出，再做加减。'],
    probability:['样本空间、等可能 · 所有基本结果机会一样大','先列全部结果，再数符合条件的结果。'],
    equations:['未知数、等量关系 · 两边说的是同一个数量','等式两边一起做同一种运算，等号才一直成立。'],
    'inverse-operations':['逆运算 · 从结果倒着还原','倒着走时，顺序反过来，运算也反过来。'],
    'assumption-method':['假设、修正量 · 先当成一种，再看差了多少','总差除以“每换一个会差多少”，得到替换个数。'],
    'factorization-identities':['恒等式、因式 · 两种写法表示同一个数','平方差可拆成一减一加；完全平方中间项有两个相同乘积。'],
    'integer-equations':['整数解、范围 · 答案必须是符合题意的整数','先用奇偶和整除缩小候选，再有序枚举并检查不重复。'],
    'tables-logic':['排除、唯一对应 · 每个对象只能占一个位置','划掉候选时写理由，别只凭“看起来像”。'],
    'work-backward':['倒推、逆运算 · 最后结果一步步还原','从最后一步倒着走；每一步都做相反的运算。'],
    contradiction:['反例、矛盾 · 一个合格反例就能推翻“所有”','反例必须满足题目的前提，不能只和结论不同。'],
    'invariant-parity':['不变量、奇偶 · 操作前后有些性质一直不变','比较每一步能改变什么、不能改变什么。'],
    construction:['构造、分类 · 做出一个例子或把情况分全','证明“能”给出一个例子；证明“都如此”必须不漏情况。'],
    'extremes-optimization':['最坏情况、边界 · 从最不利的安排开始','求最大最小时先看边界，再证明附近情况没有更好。']
  };

  const formulas = {
    'order-operations':['括号 → 乘除 → 加减；同级从左向右','先定顺序，再把可凑整的加数或乘数放在一起。'],
    fractions:['同分母：a/b ± c/b = (a ± c)/b；异分母：a/b ± c/d = (ad ± bc)/bd；乘：(a/b)×(c/d)=ac/bd；除：(a/b)÷(c/d)=(a/b)×(d/c)','分母不能为 0；除数也不能为 0。加减先统一单位份，乘法表示“求几分之几”，最后再约分。'],
    ratio:['a:b=c:d ⇔ ad=bc（b、d≠0）；按 a:b 分总量 T：第一份=T×a/(a+b)','先对齐比的顺序并统一单位。不可拆物品按比分配后，还要检查数量是否为整数。'],
    percent:['x%=x/100；部分量=基数×百分率；基数=部分量÷百分率；涨 p%：×(1+p/100)；降 p%：×(1−p/100)','每个百分数都要对应一个基数；连续涨跌逐步更新基数。打八折表示保留原量的 80%。'],
    average:['平均数=总量÷份数；总量=平均数×份数','新增或拿走数据后，总量和份数都要更新。'],
    'speed-work':['路程=速度×时间；工作量=效率×时间','相遇速度相加；追及速度相减；合作效率相加。'],
    'sum-difference':['大数=(和+差)÷2；小数=(和−差)÷2','先把大数多出来的“差”拿走，两份就相等。'],
    'chicken-rabbit':['另一类个数=(实际总量−假设总量)÷每次替换的差','求完后用对象总数、总量两次验算。'],
    'surplus-shortage':['人数/份数=总差额÷每份变化量','一盈一亏：差额相加；同盈或同亏：差额相减。'],
    'basic-application':['结果量=起始量+增加量−减少量','关键词只能提示，必须先确认变化对象、方向和单位。'],
    planting:['直线两端都种：棵数=间隔数+1；只种一端/围一圈：棵数=间隔数','直线的段数、楼梯台阶、锯木次数都先找端点。'],
    ages:['年龄差=较大年龄−较小年龄（始终不变）','x 年后：每个人年龄都加 x；倍数关系要列等式。'],
    angles:['三角形内角和=180°；四边形内角和=360°；n 边形=(n−2)×180°','平角 180°，周角 360°；平行线对应角相等。'],
    'triangle-inequality':['|a−b| < 第三边 < a+b','平行四边形对边相等；矩形四角直角；正方形兼有矩形和菱形性质。'],
    'perimeter-area':['长方形周长=2(长+宽)；面积=长×宽；三角形面积=底×高÷2','周长单位 cm；面积单位 cm²；体积单位 cm³。'],
    'composite-area':['组合图形面积=补成的大图形−多出的部分，或各小图形面积相加','剪拼和平移不改变面积；边长信息要逐段核对。'],
    'area-equivalence':['三角形面积=底×高÷2；平行四边形面积=底×高','相似图形边长放大 k 倍，面积放大 k² 倍。'],
    'grid-symmetry':['矩形对称轴 2 条；正方形对称轴 4 条','格点数不等于格子数；对称点到轴的距离相等。'],
    solids:['长方体体积=长×宽×高；表面积=2(长宽+长高+宽高)','正方体体积=a³；表面积=6a²。'],
    'geometric-counting':['m×n 网格矩形数=C(m+1,2)×C(n+1,2)','固定周长的长方形，边长越接近，面积越大。'],
    'systematic-counting':['清单：定标准 → 有序列；树状图：依次分枝 → 数合法叶端','每个合法结果恰好落入一类或一条完整分支。'],
    'add-multiply-principle':['加法：互斥类别数相加；乘法：每枝后续选法数相同才直接相乘','分枝数不同就逐枝计数再相加；“或者”不自动表示类别互斥。'],
    'permutations-selections':['不同对象且不重复：排列 n×(n−1)×…×(n−r+1)；组合再除以 r×(r−1)×…×1','只适用于从n个不同对象中选r个且每个最多使用一次；同一组选法的所有顺序都要合并。'],
    'path-counting':['无障碍最短路：R+U步中选U个位置走上步；内部点=左边+下边','位置法要求只能向右、向上且没有禁行点；有障碍时逐格排除并递推。'],
    pigeonhole:['至少一类数量 ≥ ⌈对象总数÷类别数⌉','保证题用最坏情况：先把对象尽量分散，再看下一次。'],
    'inclusion-exclusion':['|A∪B|=|A|+|B|−|A∩B|','两类都有的对象被重复数了一次，要减一次。'],
    probability:['概率=符合条件的等可能结果数÷全部等可能结果数','先完整列出样本空间，确认基本结果确实等可能。'],
    equations:['等式两边同时加、减、乘同一个数；除数不可为 0','写清未知数代表什么，再按逆运算解。'],
    'inverse-operations':['倒推顺序与原顺序相反；加减互逆、乘除互逆','每一步先撤销最后做的运算，最后正向代回。'],
    'assumption-method':['所求个数=(实际量−假设量)÷每次替换的差','也叫差量修正；先统一总量单位。'],
    'factorization-identities':['a²−b²=(a−b)(a+b)；(a±b)²=a²±2ab+b²','公式前后相等，可代入简单数检查。'],
    'integer-equations':['先用奇偶 / 整除筛选，再列出整数候选','x、y 为正整数时，0 不可取；有序解与无序组合要区分。'],
    'tables-logic':['列表 → 按条件排除 → 找唯一对应 → 全条件复核','每次划掉都要能指出是哪条线索。'],
    'work-backward':['结果 → 逆运算 → 上一步 → 继续还原','倒推每一步后，可从原数正向重做检查。'],
    contradiction:['推翻“所有”命题：找一个反例；证明不可能：假设可行并推出矛盾','反例须满足题目原有范围和前提。'],
    'invariant-parity':['不变量：每步操作后保持不变的性质','常看奇偶、余数、颜色格数或总量。'],
    construction:['证明“可以”：构造并验算；证明“全部”：完整分类','分类要互不重复且没有遗漏。'],
    'extremes-optimization':['保证数=最多仍未达标的取数+1','保证题先按最不利情况安排，再看下一次为什么必定达标。']
  };

  const pitfalls = {
    'order-operations':'不能把乘除加减混在一起从左到右做；同级才从左往右。',fractions:'分数加减不能直接把分子和分母分别相加。',ratio:'比的顺序有意义；a:b 与 b:a 通常不同。',percent:'连续涨跌的基数在变化，不能简单把百分数相加。',average:'增加一个数后，要同时更新总量和份数。','speed-work':'速度、时间单位要一致；相遇和追及别用错合速度。',
    'basic-application':'不要只凭“又、送、还剩”等词选运算；要按实际变化方向与时间顺序建式。','sum-difference':'和加差后必须除以 2，因为得到的是两个大数份数。','chicken-rabbit':'每替换一只带来的差量要先算准确，不能误除以总腿数。','surplus-shortage':'先判断是“一盈一亏”还是“两盈/两亏”，再决定差额相加或相减。',planting:'直线两端是否种树，决定要不要多加 1。',ages:'年龄差不变，但年龄和、倍数会随时间变化。',
    angles:'三角形内角和是 180°；平角和周角不是同一个量。','triangle-inequality':'第三边要严格大于两边差、严格小于两边和。','perimeter-area':'周长与面积单位不同，长和宽也不要漏乘 2。','composite-area':'补图后要减掉多出的部分，不要把挖空处算进去。','area-equivalence':'高必须是所选底边对应的垂直高度。','grid-symmetry':'数格点要数位置；数小格要数格子，两者相差边界。',solids:'面积和体积不能混用，单位指数也不同。','geometric-counting':'每个矩形由边界线确定；数边界而不是只数小格。',
    'systematic-counting':'分类标准不能重叠，否则会重复；也不能漏掉一类；树状图要数完整合法叶端。','add-multiply-principle':'加法类别要互斥；乘法要求每个前置分枝有相同数量的合法后续选法。','permutations-selections':'职位有别时交换顺序算不同；无职位小组要去重，且对象必须彼此不同、不能重复选。','path-counting':'简单位置法只数无障碍的右/上最短路；有障碍时先排除禁行点再递推。',pigeonhole:'“至少保证”要按最不利分布算，不是平均分配。','inclusion-exclusion':'交集只能减一次；漏减就把同一对象算了两遍。',probability:'只有基本结果等可能时，才能直接用有利情况数除以总数。',
    equations:'不能只在等号一边加减；保持等式平衡。','inverse-operations':'逆推时先撤销最后一步，不是按原顺序倒着算。','assumption-method':'差额要除以“每换一个多多少”，分子分母单位要对应。','factorization-identities':'平方差要一减一加；完全平方的中间项有 2ab。','integer-equations':'把零、负数或重复的有序解误当成有效答案。','tables-logic':'已知条件不够时不要猜；保留多个可能直到新线索出现。','work-backward':'倒推的运算顺序与正向流程相反。',contradiction:'反例本身必须在原题允许范围里。','invariant-parity':'要证明“始终不可能”，必须说明每一步都保持同一性质。',construction:'找到一个例子只能证明“至少有一种”，不能证明全部情况。','extremes-optimization':'发现一个最大候选后，还要说明为什么其他选择不可能更大。'
  };
  Object.entries(window.AOSHU_DEEP_LESSONS || {}).forEach(([lessonId, deep]) => {
    if (deep?.pitfall) pitfalls[lessonId] = deep.pitfall;
  });

  const progressKey = 'siwei-curriculum-mastery-v1';
  let progress = {};
  let progressStorageAvailable = true;
  let progressReadIssue = false;
  let reviewReadIssue = false;
  let storedProgressRaw = null;
  try { storedProgressRaw = localStorage.getItem(progressKey); } catch { progressStorageAvailable = false; }
  if (storedProgressRaw !== null) {
    try {
      const parsed = JSON.parse(storedProgressRaw);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) progress = parsed;
      else progressReadIssue = true;
    } catch { progressReadIssue = true; }
  }
  const escapeId = (value) => String(value).replace(/[^a-zA-Z0-9_-]/g, '-');
  const methodSteps = methods[branch.id] || methods.arithmetic;
  document.title = `${branch.title}：逐点讲解、互动与速查｜思维树屋`;
  document.getElementById('bc-eyebrow').textContent = `系统专题课 · ${branch.title}`;
  document.getElementById('bc-title').innerHTML = `${esc(branch.title)}<br><em>从看懂到会应用。</em>`;
  document.getElementById('bc-intro').textContent = `${branch.intro}本专题按 ${branch.lessons.length} 个知识点逐课讲：先用直白语言讲清关键想法，再列出本课子知识点，用分步例题解释“为什么这样做”，最后检查易错点、完成三题自测；另有互动实验、方法速查和跨课复习。`;
  document.getElementById('bc-icon').textContent = branch.icon;
  document.getElementById('bc-count').textContent = branch.lessons.length;
  document.getElementById('bc-map-title').textContent = `${branch.title} · ${branch.lessons.length} 个知识点`;
  document.getElementById('bc-lessons-title').textContent = `${branch.lessons.length} 课讲清${branch.title}`;
  document.getElementById('bc-learning-steps').innerHTML = methodSteps.map((step, i) => `<li><i>${i + 1}</i><div><b>${esc(step[0])}</b><span>${esc(step[1])}</span></div></li>`).join('');
  document.getElementById('bc-branch-links').innerHTML = Object.entries(routes).map(([key, item]) => `<a href="${item.url}"${key === branch.id ? ' aria-current="page"' : ''}>${esc(item.title)} · ${item.count}</a>`).join('');
  document.getElementById('bc-bottom-copy').textContent = branch.id === 'arithmetic' ? '分数与比例会在数量关系里再次出现；熟练后可以前往几何、计数或代数，看看同一条思路如何迁移。' : branch.id === 'applications' ? '和差、盈亏与鸡兔同笼会连接到代数方程和假设法；熟悉一种模型后，试着比较它们的共同结构。' : branch.id === 'geometry' ? '图形计数会连接到组合方法；面积关系也能借助代数表示。学会解释图上的关系，比单背公式更重要。' : branch.id === 'counting' ? '路线递推会连接数列；最坏情况与抽屉原理会连接逻辑策略。数论训练营讲义和原题仍整合在数与规律分支中。' : branch.id === 'algebra' ? '方程能把数量关系写成等式；假设法和数论中的因式分解，也会帮助缩小整数解范围。' : '列表、倒推、不变量、构造和最值可以互相配合；每种策略都要把理由和边界条件说清楚。';

  function lessonId(lesson) { return `bc-topic-${escapeId(lesson.id)}`; }
  function practiceCount(lesson) { return new Set(progress[lesson.id]?.passed || []).size; }
  function updateProgress() {
    const mastered = branch.lessons.filter((lesson) => progress[lesson.id]?.done).length;
    document.getElementById('bc-progress-count').textContent = `${mastered} / ${branch.lessons.length}`;
    document.getElementById('bc-progress-fill').style.width = `${mastered / branch.lessons.length * 100}%`;
    const status = document.querySelector('.bc-progress small');
    if (status) {
      status.setAttribute('aria-live', 'polite');
      status.textContent = !progressStorageAvailable
        ? '当前浏览器不能保存学习进度；练习可以继续，刷新后可能清零。'
        : progressReadIssue || reviewReadIssue
          ? '发现无法读取的旧进度；答题时会尝试先备份旧记录，再保存新进度。'
          : '学习进度保存在当前浏览器';
    }
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
  function renderMap() {
    document.getElementById('bc-map-grid').innerHTML = branch.lessons.map((lesson, i) => {
      const keyText = language[lesson.id]?.[0] || lesson.title;
      const deep = window.AOSHU_DEEP_LESSONS?.[lesson.id];
      const visibleKeys = deep?.subtopics?.map((item) => item.name).join(' · ') || (lesson.concept.length > 94 ? `${lesson.concept.slice(0, 94)}…` : lesson.concept);
      return `<a class="bc-map-card" href="#${lessonId(lesson)}"><span class="bc-map-no">${String(i + 1).padStart(2, '0')}</span><span class="bc-map-text"><b>${esc(lesson.title)}</b><small><strong>本课拆成：</strong>${esc(visibleKeys)}</small></span><span class="bc-map-level">${esc(lesson.level)}</span></a>`;
    }).join('');
  }
  function renderQuestion(lesson, q, index, passed) {
    const safeId = escapeId(lesson.id);
    const inputId = `bc-ans-${safeId}-${index}`;
    const feedback = passed ? '这题已答对，可以继续或复习。' : '';
    const answerValues = Array.isArray(q.a) ? q.a : [q.a];
    const decimalOnly = answerValues.length > 0 && answerValues.every((answer) => /^[+−-]?(?:\d+(?:\.\d*)?|\.\d+)$/u.test(String(answer ?? '').trim()));
    const placeholder = answerValues.some((answer) => String(answer ?? '').includes('/')) ? '例如 5/8' : '填答案';
    return `<div class="bc-question"><label for="${inputId}"><i>${index + 1}</i><span class="bc-question-copy">${renderRichText(q.q)}</span></label><div class="bc-answer-row"><input id="${inputId}" type="text" inputmode="${decimalOnly ? 'decimal' : 'text'}" autocomplete="off" placeholder="${placeholder}"><button type="button" data-bc-check="${safeId}" data-index="${index}">检查</button></div><p class="bc-answer-feedback${passed ? ' good' : ''}" aria-live="polite">${feedback}</p><details class="bc-solution"><summary>看提示与完整推理</summary><p><b>提示：</b>${renderRichText(q.hint)}</p><p><b>讲解：</b>${renderRichText(q.why)}</p></details></div>`;
  }
  function renderTopicTable(table) {
    if (!table || !Array.isArray(table.headers) || !Array.isArray(table.rows)) return '';
    const headers = table.headers.map((item) => `<th scope="col">${renderRichText(String(item))}</th>`).join('');
    const rows = table.rows.map((row) => `<tr>${row.map((cell, index) => index === 0 ? `<th scope="row">${renderRichText(String(cell))}</th>` : `<td>${renderRichText(String(cell))}</td>`).join('')}</tr>`).join('');
    return `<div class="bc-topic-table-wrap"><table class="bc-topic-table"><caption>${renderRichText(String(table.caption || '推理记录表'))}</caption><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table></div>`;
  }
  function renderDeepVisual(visual) {
    if (!visual?.type) return '';
    let svg = '';
    let viewBox = '0 0 420 160';
    if (visual.type === 'fraction-equivalence') {
      const bar = (y, denominator, shaded) => Array.from({length: denominator}, (_, i) => {
        const width = 260 / denominator;
        return `<rect x="${100 + i * width}" y="${y}" width="${width}" height="34" fill="${i < shaded ? '#8db595' : '#fffefa'}" stroke="#557a5b" stroke-width="2"/>`;
      }).join('');
      svg = `<text x="14" y="51" fill="#405d48" font-size="18" font-weight="700">1/2</text>${bar(24, 2, 1)}<text x="14" y="103" fill="#405d48" font-size="18" font-weight="700">2/4</text>${bar(76, 4, 2)}<text x="230" y="142" text-anchor="middle" fill="#617466" font-size="14">两条涂色部分一样多</text>`;
    } else if (visual.type === 'ratio-bars') {
      const row = (y, count, fill, totalLabel) => Array.from({length: count}, (_, i) => `<rect x="${100 + i * 39}" y="${y}" width="34" height="34" rx="4" fill="${fill}" stroke="#ffffff" stroke-width="2"/><text x="${117 + i * 39}" y="${y + 22}" text-anchor="middle" fill="#ffffff" font-size="13" font-weight="700">1</text>`).join('') + `<text x="${112 + count * 39}" y="${y + 22}" fill="#506457" font-size="14">${totalLabel}</text>`;
      svg = `<text x="14" y="59" fill="#405d48" font-size="16" font-weight="700">甲</text>${row(35, 3, '#7ea887', '3 份')}<text x="14" y="116" fill="#405d48" font-size="16" font-weight="700">乙</text>${row(92, 5, '#d49b75', '5 份')}<text x="320" y="151" fill="#718076" font-size="12">每格同样大</text>`;
    } else if (visual.type === 'percent-grid') {
      const cells = Array.from({length: 100}, (_, i) => {
        const x = 16 + (i % 10) * 12;
        const y = 18 + Math.floor(i / 10) * 12;
        return `<rect x="${x}" y="${y}" width="10" height="10" rx="1.5" fill="${i < 25 ? '#76a981' : '#e5ebe2'}"/>`;
      }).join('');
      svg = `${cells}<text x="155" y="59" fill="#405d48" font-size="20" font-weight="700">25% = 25/100</text><text x="155" y="88" fill="#617466" font-size="14">100 份中的 25 份</text>`;
      viewBox = '0 0 390 155';
    } else if (visual.type === 'counting-tree') {
      const line = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
      const edges = [
        line(52, 140, 111, 58), line(52, 140, 111, 140), line(52, 140, 111, 222),
        line(156, 58, 269, 32), line(156, 58, 269, 82),
        line(156, 140, 269, 114), line(156, 140, 269, 166),
        line(156, 222, 269, 198), line(156, 222, 269, 248)
      ].join('');
      svg = `<g fill="none" stroke="#93ad91" stroke-width="2">${edges}</g><g fill="#f0f7ed" stroke="#789979" stroke-width="2"><circle cx="48" cy="140" r="7"/><circle cx="135" cy="58" r="20"/><circle cx="135" cy="140" r="20"/><circle cx="135" cy="222" r="20"/></g><g fill="#405d48" font-family="Noto Sans SC, sans-serif" font-size="14" font-weight="700" text-anchor="middle"><text x="48" y="166">开始</text><text x="135" y="63">十位1</text><text x="135" y="145">十位2</text><text x="135" y="227">十位3</text><text x="302" y="37">12</text><text x="302" y="87">13</text><text x="302" y="119">21</text><text x="302" y="171">23</text><text x="302" y="203">31</text><text x="302" y="253">32</text><text x="135" y="22" fill="#738574" font-size="11">第一步</text><text x="302" y="22" fill="#738574" font-size="11">完整结果</text></g>`;
      viewBox = '0 0 360 270';
    } else return '';
    return `<figure class="bc-topic-visual"><div class="bc-topic-visual-art"><svg viewBox="${viewBox}" role="img" aria-label="${esc(visual.alt || visual.title)}" focusable="false">${svg}</svg></div><figcaption><b>${renderRichText(visual.title)}</b><span>${renderRichText(visual.caption)}</span></figcaption></figure>`;
  }
  function renderLessons() {
    document.getElementById('bc-lesson-stack').innerHTML = branch.lessons.map((lesson, i) => {
      const passed = new Set(progress[lesson.id]?.passed || []);
      const glossary = language[lesson.id] || [lesson.title, '抓住题目给出的条件，再选对应方法。'];
      const formula = formulas[lesson.id] || [lesson.title, lesson.concept];
      const formulaBox = `<div class="bc-lesson-formula" aria-label="${esc(lesson.title)}的公式与关键方法"><span class="bc-formula-label">本课公式 / 关键方法</span><div class=\"bc-formula-lines\">${renderFormulaLines(formula[0])}</div><div class="bc-formula-support">${renderRichText(formula[1])}</div></div>`;
      const deep = window.AOSHU_DEEP_LESSONS?.[lesson.id];
      const keyPreview = deep?.subtopics?.map((item) => item.name).join(' · ');
      const path = lessonRoutes[branch.id]?.[lesson.id] || methodSteps.map((step) => step[0]);
      const practice = lesson.practice.map((q, index) => renderQuestion(lesson, q, index, passed.has(index))).join('');
      const source = lesson.source ? `<span class="bc-pill source">${esc(lesson.source)} · 版本/页码待核，不表示逐讲对应</span>` : '';
      const subtopics = (deep?.subtopics || []).map((item, j) => `<article class="bc-subtopic"><span>${String(j + 1).padStart(2, '0')}</span><div><b>${esc(item.name)}</b><p>${renderRichText(item.explanation)}</p></div></article>`).join('');
      const flow = (deep?.flow || []).map((item, j) => `<span class="bc-flow-node"><i>${j + 1}</i><b>${esc(item)}</b></span>`).join('');
      const worked = (deep?.steps || []).map((item, j) => `<li><i>${j + 1}</i><div><b>${esc(item.title)}</b><p>${renderRichText(item.explanation)}</p></div></li>`).join('');
      const deepGuide = deep ? `<section class="bc-deep-guide" aria-label="${esc(lesson.title)}的详细讲解"><div class="bc-deep-head"><span>本课关键知识点</span><small>讲清楚 · 再记住</small></div><div class="bc-deep-idea"><b>先用一句话听懂</b><p>${renderRichText(deep.idea)}</p></div>${deep.chooseWhen ? `<div class="bc-method-choice"><b>先选方法：什么时候用这一招？</b><p>${renderRichText(deep.chooseWhen)}</p></div>` : ''}<div class="bc-subtopics"><h4>把知识点拆开看</h4><div class="bc-subtopic-grid">${subtopics}</div></div><div class="bc-flow-wrap"><h4>思考路线图</h4><div class="bc-deep-flow" role="img" aria-label="${esc(deep.flow.join('，然后'))}">${flow}</div></div>${renderTopicTable(deep.table)}${renderDeepVisual(deep.visual)}</section>` : '';
      const exampleSteps = worked ? `<ol class="bc-worked-steps">${worked}</ol>` : `<div class="bc-example-solution"><b>推理：</b>${renderRichText(lesson.example.solution)}</div>`;
      const why = deep ? `<div class="bc-why-check"><p><b>为什么这样做有效？</b>${renderRichText(deep.why)}</p><p><b>学完停一下：</b>${renderRichText(deep.check)}</p></div>` : '';
      const pathTitle = lessonRoutes[branch.id]?.[lesson.id] ? '本课解题路线' : '本分支通用的解题检查步骤';
      return `<details class="bc-lesson" id="${lessonId(lesson)}" data-lesson="${escapeId(lesson.id)}"${i === 0 ? ' open' : ''}><summary><span class="bc-lesson-number">${String(i + 1).padStart(2, '0')}</span><span class="bc-lesson-title"><small>${esc(lesson.level)} · 知识点 ${i + 1} / ${branch.lessons.length}</small><b>${esc(lesson.title)}</b>${keyPreview ? `<small class="bc-lesson-key-preview">重点：${esc(keyPreview)}</small>` : ''}</span><span class="bc-lesson-status">${progress[lesson.id]?.done ? '已掌握' : `${passed.size}/${lesson.practice.length} 自测`}</span><span class="bc-lesson-chevron" aria-hidden="true">＋</span></summary><div class="bc-lesson-body"><div class="bc-lesson-meta"><span class="bc-pill">关键词：${esc(glossary[0].split('·')[0].trim())}</span>${source}<span class="bc-pill">本课 3 道自测</span></div><div class="bc-concept-box"><span class="bc-section-label">先听懂 · 不只记答案</span><div class="bc-concept-text">${renderRichText(lesson.concept)}</div><div class="bc-language-row"><b>${esc(glossary[0].split('·')[0].trim())}</b><span>${esc(glossary[1])}</span></div></div>${formulaBox}${deepGuide}<div class="bc-path-box${branch.id === 'counting' ? ' bc-counting-path-box' : ''}"><b>${pathTitle}</b><ol>${path.map((step) => `<li>${esc(step)}</li>`).join('')}</ol></div><div class="bc-example-box"><span class="bc-section-label">老师示范 · 跟着线索一步步做</span><h4>${esc(lesson.example.q)}</h4>${exampleSteps}</div>${why}${deep?.transfer ? `<aside class="bc-transfer" aria-label="迁移练习"><b>换个情境再试一次</b><p>${esc(deep.transfer)}</p></aside>` : ''}<div class="bc-trap"><strong>易错提醒</strong><span>${esc(pitfalls[lesson.id] || '每做完一步，都回到题目条件检查一次。')}</span></div><div class="bc-practice"><div class="bc-practice-top"><div><span class="bc-section-label">轮到你了 · 先想再检查</span><h4>三道自测：练方法，也讲理由</h4></div><span class="bc-practice-count">${passed.size}/${lesson.practice.length} 完成</span></div>${practice}</div><div class="bc-lesson-tools"><a href="#bc-lab" data-open-lab="${escapeId(lesson.id)}">去互动实验台试一试 →</a><a href="#bc-formulas">查本课速查卡 ↑</a></div></div></details>`;
    }).join('');
  }
  function renderFormulas() {
    document.getElementById('bc-formula-grid').innerHTML = branch.lessons.map((lesson, i) => {
      const card = formulas[lesson.id] || [lesson.title, lesson.concept];
      return `<article class="bc-formula-card"><a href="#${lessonId(lesson)}">${String(i + 1).padStart(2, '0')} · ${esc(lesson.title)} ↗</a><div class=\"bc-formula-lines\">${renderFormulaLines(card[0])}</div><div class="bc-formula-support">${renderRichText(card[1])}</div></article>`;
    }).join('');
  }
  function renderReview() {
    const allQuestions = branch.lessons.flatMap((lesson) => lesson.practice.map((q, index) => ({lesson, q, index})));
    const chosen = Array.from({length:6}, (_, i) => allQuestions[Math.round(i * (allQuestions.length - 1) / 5)]);
    document.getElementById('bc-review-grid').innerHTML = chosen.map(({lesson, q, index}, i) => `<article class="bc-review-card" data-review="${i}"><small>${esc(lesson.title)} · 回顾 ${i + 1}/6</small><label for="bc-review-${i}">${renderRichText(q.q)}</label><div class="bc-answer-row"><input id="bc-review-${i}" type="text" autocomplete="off" placeholder="填答案"><button type="button" data-bc-review="${i}">检查</button></div><p class="bc-answer-feedback" aria-live="polite"></p><details class="bc-solution"><summary>提示与完整讲解</summary><p><b>提示：</b>${renderRichText(q.hint)}</p><p><b>讲解：</b>${renderRichText(q.why)}</p></details></article>`).join('');
    const reviewKey = `siwei-branch-review-${branch.id}-v1`;
    let reviewRaw = null;
    const passed = new Set();
    try { reviewRaw = localStorage.getItem(reviewKey); } catch { reviewReadIssue = true; progressStorageAvailable = false; }
    if (reviewRaw !== null) {
      try {
        const saved = JSON.parse(reviewRaw);
        if (Array.isArray(saved)) saved.filter((i) => Number.isInteger(i) && i >= 0 && i < chosen.length).forEach((i) => passed.add(i));
        else reviewReadIssue = true;
      } catch { reviewReadIssue = true; }
    }
    function saveReview() {
      try {
        if (reviewReadIssue && reviewRaw !== null) {
          const recoveryKey = `${reviewKey}:recovery`;
          if (localStorage.getItem(recoveryKey) === null) localStorage.setItem(recoveryKey, reviewRaw);
        }
        reviewRaw = JSON.stringify([...passed].sort((a,b) => a-b));
        localStorage.setItem(reviewKey, reviewRaw);
        reviewReadIssue = false;
        updateProgress();
      } catch { progressStorageAvailable = false; }
    }
    function updateReview() {
      document.getElementById('bc-review-progress').textContent = `答对 ${passed.size} / 6`;
      document.getElementById('bc-review-finish').hidden = passed.size !== 6;
    }
    document.querySelectorAll('[data-bc-review]').forEach((button) => button.addEventListener('click', () => {
      const i = Number(button.dataset.bcReview);
      const record = chosen[i];
      const card = button.closest('.bc-review-card');
      const input = card.querySelector('input');
      const feedback = card.querySelector('.bc-answer-feedback');
      if (!input.value.trim()) { feedback.textContent = `先试一试；需要线索可以展开提示：${record.q.hint}`; feedback.classList.remove('good'); input.focus(); return; }
      const correct = (record.q.a || []).some((answer) => answersMatch(answer, input.value));
      if (correct) { passed.add(i); saveReview(); feedback.textContent = '答对了！想一想你用的是哪个知识点。'; feedback.classList.add('good'); }
      else { feedback.textContent = `还差一点。提示：${record.q.hint}`; feedback.classList.remove('good'); }
      updateReview();
    }));
    document.querySelectorAll('.bc-review-card input').forEach((input, i) => input.addEventListener('keydown', (event) => { if (event.key === 'Enter') document.querySelector(`[data-bc-review="${i}"]`).click(); }));
    updateReview();
  }

  function renderLab() {
    const card = document.getElementById('bc-lab-card');
    const labs = {
      arithmetic: {lead:'把总量和两种份数调一调，观察按比例分配怎样变化。',html:`<div class="bc-lab-controls"><p><b>比例分配实验：</b>把总量切成两种份数。每一格代表相同大小的一份。</p><label class="bc-control-row" for="bc-ratio-total">总量 <input id="bc-ratio-total" type="range" min="24" max="120" step="6" value="72"><output id="bc-ratio-total-out">72</output></label><label class="bc-control-row" for="bc-ratio-a">第一份数 <input id="bc-ratio-a" type="range" min="1" max="6" value="2"><output id="bc-ratio-a-out">2</output></label><label class="bc-control-row" for="bc-ratio-b">第二份数 <input id="bc-ratio-b" type="range" min="1" max="6" value="3"><output id="bc-ratio-b-out">3</output></label><div class="bc-lab-foot">可以试着保持总份数不变，只增加其中一边，看看分到的量会怎样变化。</div></div><div class="bc-lab-visual"><h3>把总量想成一条可分的长带</h3><div class="bc-ratio-bars"><div class="bc-ratio-track" id="bc-ratio-track"></div></div><p id="bc-ratio-explain"></p><div class="bc-live-result" id="bc-ratio-result" aria-live="polite"></div></div>`},
      applications:{lead:'拖动“兔子”的数量，看相同头数下腿数如何增加；这就是假设法里的差量。',html:`<div class="bc-lab-controls"><p><b>鸡兔同笼实验：</b>先把所有动物假设成鸡，每多换一只兔，就多 2 条腿。</p><label class="bc-control-row" for="bc-heads">动物总数 <input id="bc-heads" type="range" min="3" max="12" value="8"><output id="bc-heads-out">8</output></label><label class="bc-control-row" for="bc-rabbits">兔子数量 <input id="bc-rabbits" type="range" min="0" max="8" value="3"><output id="bc-rabbits-out">3</output></label><div class="bc-lab-foot">每把一只鸡换成兔：头数不变，腿数增加 2。你可以试试全是鸡、全是兔和中间值。</div></div><div class="bc-lab-visual"><h3>头数固定，腿数跟着兔子数变化</h3><div class="bc-animal-row" id="bc-animal-row" aria-live="polite"></div><p id="bc-animal-explain"></p><div class="bc-live-result" id="bc-animal-result"></div></div>`},
      geometry:{lead:'调整长方形的长和宽，让面积和周长同时显示；观察边长改变时，两个量如何不同。',html:`<div class="bc-lab-controls"><p><b>周长与面积实验：</b>长是横边，宽是竖边。周长绕一圈，面积铺满里面。</p><label class="bc-control-row" for="bc-rect-length">长 <input id="bc-rect-length" type="range" min="3" max="15" value="9"><output id="bc-rect-length-out">9</output></label><label class="bc-control-row" for="bc-rect-width">宽 <input id="bc-rect-width" type="range" min="2" max="10" value="5"><output id="bc-rect-width-out">5</output></label><div class="bc-lab-foot">可以让长和宽互换：面积一样，但图形方向会转过来。</div></div><div class="bc-lab-visual"><h3>矩形的边与内部</h3><svg class="bc-rect-svg" viewBox="0 0 320 190" role="img" aria-label="长方形的长宽示意图"><rect id="bc-rect-shape" x="42" y="28" width="220" height="110" rx="8" fill="#dfeede" stroke="#6e9a76" stroke-width="3"/><text id="bc-rect-label-x" x="152" y="164" text-anchor="middle" fill="#4f7357" font-size="13">长 9</text><text id="bc-rect-label-y" x="287" y="90" text-anchor="middle" fill="#4f7357" font-size="13">宽 5</text><text id="bc-rect-center" x="152" y="91" text-anchor="middle" fill="#4b7353" font-size="15">铺满里面</text></svg><div class="bc-live-result" id="bc-rect-result"></div></div>`},
      counting:{lead:'改变网格的横步和竖步，表格里的数字按“从左边来 + 从下边来”累加。',html:`<div class="bc-lab-controls"><p><b>最短路线实验：</b>只能向右或向上。到一个格点的走法数，等于它前面两个方向的走法数相加。</p><label class="bc-control-row" for="bc-path-right">向右几步 <input id="bc-path-right" type="range" min="1" max="5" value="3"><output id="bc-path-right-out">3</output></label><label class="bc-control-row" for="bc-path-up">向上几步 <input id="bc-path-up" type="range" min="1" max="5" value="2"><output id="bc-path-up-out">2</output></label><div class="bc-lab-foot">从起点出发，先在边缘标 1，再把里面的格点按两边相加填满。</div></div><div class="bc-lab-visual"><h3>格点路线数（数字越大，走法越多）</h3><div id="bc-path-table" class="bc-path-table" aria-live="polite"></div><div class="bc-live-result" id="bc-path-result"></div></div>`},
      algebra:{lead:'先设出一个数，再看等式两边怎样保持平衡；试着输入自己的答案，并和真正解比较。',html:`<div class="bc-lab-controls"><p><b>天平方程实验：</b>方程两边像天平两端。两边做同一种运算，平衡关系不会变。</p><label class="bc-control-row" for="bc-eq-a">x 前面的数 a <input id="bc-eq-a" type="range" min="1" max="8" value="3"><output id="bc-eq-a-out">3</output></label><label class="bc-control-row" for="bc-eq-b">再加 b <input id="bc-eq-b" type="range" min="0" max="12" value="4"><output id="bc-eq-b-out">4</output></label><label class="bc-control-row" for="bc-eq-x">秘密答案 x <input id="bc-eq-x" type="range" min="0" max="12" value="5"><output id="bc-eq-x-out">5</output></label><label class="bc-control-row" for="bc-eq-guess">你的猜测 <input id="bc-eq-guess" type="number" min="0" max="24" value="5"></label><div class="bc-lab-foot">${renderRichText('观察：a×x+b=c；解方程时先两边减 b，再两边除以 a。')}</div></div><div class="bc-lab-visual"><h3>等式天平</h3><div class="bc-balance"><div class="bc-balance-side" id="bc-balance-left"><b>左边</b><strong id="bc-balance-left-value">19</strong></div><div class="bc-balance-side" id="bc-balance-right"><b>右边</b><strong id="bc-balance-right-value">19</strong></div></div><p id="bc-eq-expression"></p><div class="bc-live-result" id="bc-eq-result" aria-live="polite"></div></div>`},
      logic:{lead:'点“下一步”，看线索怎样逐个排除不可能，再检查答案是否同时满足全部条件。',html:`<div class="bc-lab-controls"><p><b>三人住楼实验：</b>甲、乙、丙分别住 1、2、3 楼；甲不住 1 楼，乙住 3 楼。试着自己说出丙在哪一层。</p><div class="bc-logic-board" id="bc-logic-board"><div class="bc-logic-stage active" data-stage="0"><b>线索 1：</b>乙住 3 楼，所以甲和丙不住 3 楼。</div><div class="bc-logic-stage" data-stage="1"><b>线索 2：</b>甲不住 1 楼；3 楼已给乙，所以甲只能住 2 楼。</div><div class="bc-logic-stage" data-stage="2"><b>推出：</b>剩下的 1 楼归丙。</div><div class="bc-logic-stage" data-stage="3"><b>复核：</b>甲 2 楼、乙 3 楼、丙 1 楼，各不相同并满足所有条件。</div></div><div class="bc-control-row"><span id="bc-logic-counter">第 1 / 4 步</span><button class="bc-lab-button" type="button" id="bc-logic-next">看下一步</button></div></div><div class="bc-lab-visual"><h3>条件推理不是猜楼层</h3><div class="bc-live-result" id="bc-logic-result" aria-live="polite">先记住：每个人只住一层，每层也只住一个人。</div><p>推理的关键是逐条用条件排除，最后再回到题目检查，不是凭直觉挑一个答案。</p></div>`}
    };
    const lab = labs[branch.id] || labs.arithmetic;
    document.getElementById('bc-lab-lead').textContent = lab.lead;
    card.innerHTML = lab.html;

    if (branch.id === 'arithmetic') {
      const total = document.getElementById('bc-ratio-total'); const a = document.getElementById('bc-ratio-a'); const b = document.getElementById('bc-ratio-b');
      const gcd = (n, d) => { while (d) { const remainder = n % d; n = d; d = remainder; } return n; };
      const exactFraction = (n, d) => { const common = gcd(n, d); const numerator = n / common; const denominator = d / common; return denominator === 1 ? String(numerator) : `${numerator}/${denominator}`; };
      const draw = () => {
        const t = Number(total.value), x = Number(a.value), y = Number(b.value), parts = x + y;
        const unit = exactFraction(t, parts), first = exactFraction(t * x, parts), second = exactFraction(t * y, parts);
        document.getElementById('bc-ratio-total-out').textContent = t;
        document.getElementById('bc-ratio-a-out').textContent = x;
        document.getElementById('bc-ratio-b-out').textContent = y;
        document.getElementById('bc-ratio-track').innerHTML = `<span style="width:${x / parts * 100}%">${first}</span><span style="width:${y / parts * 100}%">${second}</span>`;
        document.getElementById('bc-ratio-explain').textContent = `${t} 按 ${x}:${y} 分，一共 ${parts} 份；每份 ${unit}（最简分数表示）。`;
        setRichText(document.getElementById('bc-ratio-result'), `第一份 ${first}，第二份 ${second}。验算：${first} + ${second} = ${t}。`);
      };
      [total,a,b].forEach((el)=>el.addEventListener('input',draw)); draw();
    } else if (branch.id === 'applications') {
      const heads=document.getElementById('bc-heads'), rabbits=document.getElementById('bc-rabbits');
      const draw=()=>{const h=Number(heads.value); rabbits.max=h; const r=Math.min(Number(rabbits.value),h); rabbits.value=r; const legs=2*h+2*r; document.getElementById('bc-heads-out').textContent=h; document.getElementById('bc-rabbits-out').textContent=r; document.getElementById('bc-animal-row').innerHTML=`${'🐔'.repeat(h-r)}${'🐰'.repeat(r)}`; setRichText(document.getElementById('bc-animal-explain'),`先假设 ${h} 个头全是鸡：${h} × 2 = ${2*h} 条腿。每换一只兔，多 2 条腿。`); setRichText(document.getElementById('bc-animal-result'),`现在有 ${r} 只兔，腿数 = ${h} × 2 + ${r} × 2 = ${legs} 条。`);}; [heads,rabbits].forEach((el)=>el.addEventListener('input',draw)); draw();
    } else if (branch.id === 'geometry') {
      const length=document.getElementById('bc-rect-length'), width=document.getElementById('bc-rect-width');
      const draw=()=>{const l=Number(length.value),w=Number(width.value),svgW=220,svgH=110,max=15,ww=svgW*l/max,hh=svgH*w/max; document.getElementById('bc-rect-length-out').textContent=l;document.getElementById('bc-rect-width-out').textContent=w;const shape=document.getElementById('bc-rect-shape');shape.setAttribute('width',ww);shape.setAttribute('height',hh);shape.setAttribute('x',(320-ww)/2);shape.setAttribute('y',(160-hh)/2);document.getElementById('bc-rect-label-x').textContent=`长 ${l}`;document.getElementById('bc-rect-label-y').textContent=`宽 ${w}`;document.getElementById('bc-rect-center').setAttribute('x',160);document.getElementById('bc-rect-center').setAttribute('y',Math.max(24,(160-hh)/2+hh/2));setRichText(document.getElementById('bc-rect-result'),`周长 = 2 × (${l} + ${w}) = ${2*(l+w)}；面积 = ${l} × ${w} = ${l*w} 平方单位。`);};[length,width].forEach((el)=>el.addEventListener('input',draw));draw();
    } else if (branch.id === 'counting') {
      const right=document.getElementById('bc-path-right'), up=document.getElementById('bc-path-up');
      const draw=()=>{const r=Number(right.value),u=Number(up.value),dp=Array.from({length:u+1},()=>Array(r+1).fill(0));for(let y=0;y<=u;y++)for(let x=0;x<=r;x++)dp[y][x]=x===0&&y===0?1:(x?dp[y][x-1]:0)+(y?dp[y-1][x]:0);document.getElementById('bc-path-right-out').textContent=r;document.getElementById('bc-path-up-out').textContent=u;document.getElementById('bc-path-table').innerHTML=Array.from({length:u+1},(_,row)=>{const y=u-row;return `<div class="bc-path-row">${Array.from({length:r+1},(_,x)=>`<span class="bc-path-cell${x===0&&y===0?' start':''}${x===r&&y===u?' end':''}" title="到此格点有 ${dp[y][x]} 条路">${dp[y][x]}</span>`).join('')}</div>`;}).join('');const result=document.getElementById('bc-path-result'),answer=document.createElement('p'),rule=document.createElement('p');answer.className='bc-path-answer';answer.textContent=`最短路线：${r+u} 步（向右 ${r} 步、向上 ${u} 步），共 ${dp[u][r]} 条。`;rule.className='bc-path-rule';rule.textContent='格点递推：每个点的路线数＝左边＋下边。';result.replaceChildren(answer,rule);};[right,up].forEach((el)=>el.addEventListener('input',draw));draw();
    } else if (branch.id === 'algebra') {
      const a=document.getElementById('bc-eq-a'),b=document.getElementById('bc-eq-b'),x=document.getElementById('bc-eq-x'),guess=document.getElementById('bc-eq-guess');
      const draw=()=>{const av=Number(a.value),bv=Number(b.value),xv=Number(x.value),c=av*xv+bv,g=Number(guess.value||0),lhs=av*g+bv;document.getElementById('bc-eq-a-out').textContent=av;document.getElementById('bc-eq-b-out').textContent=bv;document.getElementById('bc-eq-x-out').textContent=xv;document.getElementById('bc-balance-left-value').textContent=lhs;document.getElementById('bc-balance-right-value').textContent=c;document.getElementById('bc-balance-left').classList.toggle('unbalanced',lhs!==c);setRichText(document.getElementById('bc-eq-expression'),`方程：${av}x + ${bv} = ${c}。先两边减 ${bv}，再除以 ${av}。`);setRichText(document.getElementById('bc-eq-result'),lhs===c?`猜对了：x = ${xv}，等式两边都是 ${c}。`:`你的 x = ${g} 时左边是 ${lhs}；真正的 x = ${xv}，因为 (${c} − ${bv}) ÷ ${av} = ${xv}。`);};[a,b,x,guess].forEach((el)=>el.addEventListener('input',draw));draw();
    } else if (branch.id === 'logic') {
      let step=0;const show=()=>{document.querySelectorAll('.bc-logic-stage').forEach((el,i)=>{el.classList.toggle('done',i<step);el.classList.toggle('active',i===step);});document.getElementById('bc-logic-counter').textContent=`第 ${Math.min(step+1,4)} / 4 步`;document.getElementById('bc-logic-next').textContent=step>=4?'再看一次':'看下一步';document.getElementById('bc-logic-result').textContent=step===0?'先记住：每个人只住一层，每层也只住一个人。':step===1?'乙已经住 3 楼，因此 3 楼不能再给甲或丙。':step===2?'甲不能住 1 楼，也不能住 3 楼，所以甲住 2 楼。':step===3?'只剩下 1 楼，丙住 1 楼。': '答案：甲 2 楼、乙 3 楼、丙 1 楼；三人楼层不同，且甲不住 1 楼。';};document.getElementById('bc-logic-next').addEventListener('click',()=>{step=step>=4?0:step+1;show();});show();
    }
  }

  document.getElementById('bc-lesson-stack').addEventListener('click',(event)=>{
    const button=event.target.closest('[data-bc-check]');
    if(button){const rawId=button.dataset.bcCheck;const index=Number(button.dataset.index);const lesson=branch.lessons.find((item)=>escapeId(item.id)===rawId);const q=lesson?.practice[index];if(!q)return;const card=button.closest('.bc-question');const input=card.querySelector('input');const feedback=card.querySelector('.bc-answer-feedback');if(!input.value.trim()){feedback.textContent='先写一个答案；卡住时可以打开提示。';feedback.classList.remove('good');input.focus();return;}const correct=(q.a||[]).some((answer)=>answersMatch(answer,input.value));if(correct){feedback.textContent='答对了！试着把用到的规律也讲出来。';feedback.classList.add('good');const passed=new Set(progress[lesson.id]?.passed||[]);passed.add(index);progress[lesson.id]={passed:[...passed].sort((a,b)=>a-b),done:passed.size===lesson.practice.length};saveProgress();const details=button.closest('.bc-lesson');details.querySelector('.bc-lesson-status').textContent=progress[lesson.id].done?'已掌握':`${passed.size}/${lesson.practice.length} 自测`;details.querySelector('.bc-practice-count').textContent=`${passed.size}/${lesson.practice.length} 完成`;updateProgress();}else{feedback.textContent=`还差一点。提示：${q.hint}`;feedback.classList.remove('good');}return;}
    const labLink=event.target.closest('[data-open-lab]');if(labLink){document.getElementById('bc-lab').scrollIntoView({behavior:'smooth'});}
  });
  document.getElementById('bc-lesson-stack').addEventListener('keydown',(event)=>{if(event.key==='Enter'&&event.target.matches('.bc-answer-row input'))event.target.nextElementSibling?.click();});
  document.querySelectorAll('.bc-map-card').forEach((link)=>link.addEventListener('click',()=>{const target=document.querySelector(link.getAttribute('href'));if(target)target.open=true;}));
  function jumpToHashLesson(){const target=document.getElementById(location.hash.slice(1));if(target?.matches('.bc-lesson')){target.open=true;requestAnimationFrame(()=>target.scrollIntoView({behavior:'smooth',block:'start'}));}}
  window.addEventListener('hashchange',jumpToHashLesson);
  document.getElementById('bc-print').addEventListener('click',()=>window.print());
  renderMap();renderLessons();renderFormulas();renderReview();renderLab();updateProgress();
  if(location.hash)requestAnimationFrame(jumpToHashLesson);
})();
