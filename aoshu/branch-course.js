(() => {
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const normalize = (value) => String(value ?? '').toLowerCase().replace(/[\s，,。.!！?？:：=（）()]/g, '');
  const curriculum = window.AOSHU_CURRICULUM || [];
  const id = new URLSearchParams(location.search).get('branch') || 'arithmetic';
  const branch = curriculum.find((item) => item.id === id);
  const curriculumUrl = '/aoshu/curriculum.html';
  const routes = {
    number:{title:'数与规律',count:11,url:'/aoshu/number-theory.html'},
    arithmetic:{title:'计算、分数与比例',count:6,url:'/aoshu/branch-course.html?branch=arithmetic'},
    applications:{title:'经典数量关系',count:5,url:'/aoshu/branch-course.html?branch=applications'},
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
    counting:[['说清“什么算一种”','顺序是否重要？对象是否可以重复？'],['选计数结构','互斥分类用加法；连续步骤用乘法；路径可从终点倒着数。'],['按固定顺序列','画树状图、表格或网格，防止重复和漏数。'],['检查边界情况','从最小规模试一遍，核对每一种结果都恰好数一次。']],
    algebra:[['给未知量取名字','先写“设 x 表示……”并带上单位。'],['把文字翻译成等量','“一共、相差、几倍、剩下”对应不同关系。'],['保持等式平衡','等式两边做同一种运算，再逐步解出未知数。'],['代回原题检查','把答案放回每个条件，看是否都成立。']],
    logic:[['把可能情况列出来','画表格或清单，不靠脑中记忆。'],['逐条套用条件','满足不了的就划去，并写清楚排除原因。'],['解释关键一步','指出哪条条件让可能性减少或只剩一种。'],['回头验所有线索','一个答案要同时满足全部条件，不能只满足最后一条。']]
  };

  const language = {
    'order-operations':['运算顺序 · 先做哪一步，后做哪一步','看清括号和运算符，再从容易凑整的部分开始。'],
    fractions:['单位“1” · 被平均分成几份、取了几份','同一个分数可以换一种等值写法，例如 1/2=2/4。'],
    ratio:['前项、后项、比值 · 两个量如何比较','比的两项一起乘或除同一个非零数，比值不变。'],
    percent:['百分率 · 每 100 份里占多少','先问“百分之几是谁的百分之几”，找到变化基数。'],
    average:['总量、份数、平均数 · 平均分之后每份一样多','总量不变时，平均数就是每份的大小。'],
    'speed-work':['路程、速度、时间 · 同一段路走了多久','单位先统一；工作问题把整件工作看成 1。'],
    'sum-difference':['和、差 · 两数合起来与相差多少','大数和小数的中间值是“和的一半”，再向两边分开。'],
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
    fractions:['a/b + c/d = (ad+bc)/bd；a/b × c/d = ac/bd；a/b ÷ c/d = a/b × d/c','加减先通分；乘除可先约分；分母不能为 0。'],
    ratio:['a:b = a/b；a:b=c:d ⇒ ad=bc','按 a:b 分总量 T：第一份=T×a/(a+b)。'],
    percent:['部分量=基数×百分率；基数=部分量÷百分率','打九折=原价×90%；百分数改变时先找当前基数。'],
    average:['平均数=总量÷份数；总量=平均数×份数','新增或拿走数据后，总量和份数都要更新。'],
    'speed-work':['路程=速度×时间；工作量=效率×时间','相遇速度相加；追及速度相减；合作效率相加。'],
    'sum-difference':['大数=(和+差)÷2；小数=(和−差)÷2','先把大数多出来的“差”拿走，两份就相等。'],
    'chicken-rabbit':['另一类个数=(实际总量−假设总量)÷每次替换的差','求完后用对象总数、总量两次验算。'],
    'surplus-shortage':['人数/份数=总差额÷每份变化量','一盈一亏：差额相加；同盈或同亏：差额相减。'],
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
    'systematic-counting':['枚举：定标准 → 分类别 → 类内有序列 → 查重漏','分类互斥并覆盖全体，才是不重不漏。'],
    'add-multiply-principle':['分类选法相加；分步选法相乘','先问“选一种即可”还是“每一步都要完成”。'],
    'permutations-selections':['排列：n×(n−1)×…；组合需去掉重复顺序','选 r 个排顺序为 n(n−1)…(n−r+1)；只选不排序要除重复排列。'],
    'path-counting':['到某点的路径数=左边路径数+下边路径数','固定向右、向上步数时，路径数也等于选择各步位置的方法数。'],
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
    'sum-difference':'和加差后必须除以 2，因为得到的是两个大数份数。','chicken-rabbit':'每替换一只带来的差量要先算准确，不能误除以总腿数。','surplus-shortage':'先判断是“一盈一亏”还是“两盈/两亏”，再决定差额相加或相减。',planting:'直线两端是否种树，决定要不要多加 1。',ages:'年龄差不变，但年龄和、倍数会随时间变化。',
    angles:'三角形内角和是 180°；平角和周角不是同一个量。','triangle-inequality':'第三边要严格大于两边差、严格小于两边和。','perimeter-area':'周长与面积单位不同，长和宽也不要漏乘 2。','composite-area':'补图后要减掉多出的部分，不要把挖空处算进去。','area-equivalence':'高必须是所选底边对应的垂直高度。','grid-symmetry':'数格点要数位置；数小格要数格子，两者相差边界。',solids:'面积和体积不能混用，单位指数也不同。','geometric-counting':'每个矩形由边界线确定；数边界而不是只数小格。',
    'systematic-counting':'分类标准不能重叠，否则会重复；也不能漏掉一类。','add-multiply-principle':'“任选其一”多用加法，“每一步都要完成”多用乘法。','permutations-selections':'职位有别时交换顺序算不同；组成小组通常不区分顺序。','path-counting':'只按题目允许的方向走，不能把无效路线加进去。',pigeonhole:'“至少保证”要按最不利分布算，不是平均分配。','inclusion-exclusion':'交集只能减一次；漏减就把同一对象算了两遍。',probability:'只有基本结果等可能时，才能直接用有利情况数除以总数。',
    equations:'不能只在等号一边加减；保持等式平衡。','inverse-operations':'逆推时先撤销最后一步，不是按原顺序倒着算。','assumption-method':'差额要除以“每换一个多多少”，分子分母单位要对应。','factorization-identities':'平方差要一减一加；完全平方的中间项有 2ab。','integer-equations':'把零、负数或重复的有序解误当成有效答案。','tables-logic':'已知条件不够时不要猜；保留多个可能直到新线索出现。','work-backward':'倒推的运算顺序与正向流程相反。',contradiction:'反例本身必须在原题允许范围里。','invariant-parity':'要证明“始终不可能”，必须说明每一步都保持同一性质。',construction:'找到一个例子只能证明“至少有一种”，不能证明全部情况。','extremes-optimization':'发现一个最大候选后，还要说明为什么其他选择不可能更大。'
  };

  const progressKey = 'siwei-curriculum-mastery-v1';
  let progress = {};
  try { progress = JSON.parse(localStorage.getItem(progressKey) || '{}') || {}; } catch { progress = {}; }
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
    return `<div class="bc-question"><label for="${inputId}"><i>${index + 1}</i><span>${esc(q.q)}</span></label><div class="bc-answer-row"><input id="${inputId}" type="text" inputmode="decimal" autocomplete="off" placeholder="填答案"><button type="button" data-bc-check="${safeId}" data-index="${index}">检查</button></div><p class="bc-answer-feedback${passed ? ' good' : ''}" aria-live="polite">${feedback}</p><details class="bc-solution"><summary>看提示与完整推理</summary><p><b>提示：</b>${esc(q.hint)}</p><p><b>讲解：</b>${esc(q.why)}</p></details></div>`;
  }
  function renderLessons() {
    document.getElementById('bc-lesson-stack').innerHTML = branch.lessons.map((lesson, i) => {
      const passed = new Set(progress[lesson.id]?.passed || []);
      const glossary = language[lesson.id] || [lesson.title, '抓住题目给出的条件，再选对应方法。'];
      const formula = formulas[lesson.id] || [lesson.title, lesson.concept];
      const deep = window.AOSHU_DEEP_LESSONS?.[lesson.id];
      const keyPreview = deep?.subtopics?.map((item) => item.name).join(' · ');
      const path = methodSteps.map((step) => step[0]);
      const practice = lesson.practice.map((q, index) => renderQuestion(lesson, q, index, passed.has(index))).join('');
      const source = lesson.source ? `<span class="bc-pill source">${esc(lesson.source)} · 已整合</span>` : '';
      const subtopics = (deep?.subtopics || []).map((item, j) => `<article class="bc-subtopic"><span>${String(j + 1).padStart(2, '0')}</span><div><b>${esc(item.name)}</b><p>${esc(item.explanation)}</p></div></article>`).join('');
      const flow = (deep?.flow || []).map((item, j) => `<span class="bc-flow-node"><i>${j + 1}</i><b>${esc(item)}</b></span>`).join('');
      const worked = (deep?.steps || []).map((item, j) => `<li><i>${j + 1}</i><div><b>${esc(item.title)}</b><p>${esc(item.explanation)}</p></div></li>`).join('');
      const deepGuide = deep ? `<section class="bc-deep-guide" aria-label="${esc(lesson.title)}的详细讲解"><div class="bc-deep-head"><span>本课关键知识点</span><small>讲清楚 · 再记住</small></div><div class="bc-deep-idea"><b>先用一句话听懂</b><p>${esc(deep.idea)}</p></div><div class="bc-subtopics"><h4>把知识点拆开看</h4><div class="bc-subtopic-grid">${subtopics}</div></div><div class="bc-flow-wrap"><h4>思考路线图</h4><div class="bc-deep-flow" role="img" aria-label="${esc(deep.flow.join('，然后'))}">${flow}</div></div></section>` : '';
      const exampleSteps = worked ? `<ol class="bc-worked-steps">${worked}</ol>` : `<p class="bc-example-solution"><b>推理：</b>${esc(lesson.example.solution)}</p>`;
      const why = deep ? `<div class="bc-why-check"><p><b>为什么这样做有效？</b>${esc(deep.why)}</p><p><b>学完停一下：</b>${esc(deep.check)}</p></div>` : '';
      return `<details class="bc-lesson" id="${lessonId(lesson)}" data-lesson="${escapeId(lesson.id)}"${i === 0 ? ' open' : ''}><summary><span class="bc-lesson-number">${String(i + 1).padStart(2, '0')}</span><span class="bc-lesson-title"><small>${esc(lesson.level)} · 知识点 ${i + 1} / ${branch.lessons.length}</small><b>${esc(lesson.title)}</b>${keyPreview ? `<small class="bc-lesson-key-preview">重点：${esc(keyPreview)}</small>` : ''}</span><span class="bc-lesson-status">${progress[lesson.id]?.done ? '已掌握' : `${passed.size}/${lesson.practice.length} 自测`}</span><span class="bc-lesson-chevron" aria-hidden="true">＋</span></summary><div class="bc-lesson-body"><div class="bc-lesson-meta"><span class="bc-pill">关键词：${esc(glossary[0].split('·')[0].trim())}</span>${source}<span class="bc-pill">本课 3 道自测</span></div><div class="bc-concept-box"><span class="bc-section-label">先听懂 · 不只记答案</span><p>${esc(lesson.concept)}</p><div class="bc-language-row"><b>${esc(glossary[0].split('·')[0].trim())}</b><span>${esc(glossary[1])}</span></div></div>${deepGuide}<div class="bc-path-box"><b>本分支通用的解题检查步骤</b><ol>${path.map((step) => `<li>${esc(step)}</li>`).join('')}</ol></div><div class="bc-example-box"><span class="bc-section-label">老师示范 · 跟着线索一步步做</span><h4>${esc(lesson.example.q)}</h4>${exampleSteps}</div>${why}<div class="bc-trap"><strong>易错提醒</strong><span>${esc(pitfalls[lesson.id] || '每做完一步，都回到题目条件检查一次。')}</span></div><div class="bc-practice"><div class="bc-practice-top"><div><span class="bc-section-label">轮到你了 · 先想再检查</span><h4>三道自测：练方法，也讲理由</h4></div><span class="bc-practice-count">${passed.size}/${lesson.practice.length} 完成</span></div>${practice}</div><div class="bc-lesson-tools"><a href="#bc-lab" data-open-lab="${escapeId(lesson.id)}">去互动实验台试一试 →</a><a href="#bc-formulas">查本课速查卡 ↑</a></div></div></details>`;
    }).join('');
  }
  function renderFormulas() {
    document.getElementById('bc-formula-grid').innerHTML = branch.lessons.map((lesson, i) => {
      const card = formulas[lesson.id] || [lesson.title, lesson.concept];
      return `<article class="bc-formula-card"><a href="#${lessonId(lesson)}">${String(i + 1).padStart(2, '0')} · ${esc(lesson.title)} ↗</a><code>${esc(card[0])}</code><p>${esc(card[1])}</p></article>`;
    }).join('');
  }
  function renderReview() {
    const allQuestions = branch.lessons.flatMap((lesson) => lesson.practice.map((q, index) => ({lesson, q, index})));
    const chosen = Array.from({length:6}, (_, i) => allQuestions[Math.round(i * (allQuestions.length - 1) / 5)]);
    document.getElementById('bc-review-grid').innerHTML = chosen.map(({lesson, q, index}, i) => `<article class="bc-review-card" data-review="${i}"><small>${esc(lesson.title)} · 回顾 ${i + 1}/6</small><label for="bc-review-${i}">${esc(q.q)}</label><div class="bc-answer-row"><input id="bc-review-${i}" type="text" autocomplete="off" placeholder="填答案"><button type="button" data-bc-review="${i}">检查</button></div><p class="bc-answer-feedback" aria-live="polite"></p><details class="bc-solution"><summary>提示与完整讲解</summary><p><b>提示：</b>${esc(q.hint)}</p><p><b>讲解：</b>${esc(q.why)}</p></details></article>`).join('');
    const passed = new Set();
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
      const correct = (record.q.a || []).some((answer) => normalize(answer) === normalize(input.value));
      if (correct) { passed.add(i); feedback.textContent = '答对了！想一想你用的是哪个知识点。'; feedback.classList.add('good'); }
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
      algebra:{lead:'先设出一个数，再看等式两边怎样保持平衡；试着输入自己的答案，并和真正解比较。',html:`<div class="bc-lab-controls"><p><b>天平方程实验：</b>方程两边像天平两端。两边做同一种运算，平衡关系不会变。</p><label class="bc-control-row" for="bc-eq-a">x 前面的数 a <input id="bc-eq-a" type="range" min="1" max="8" value="3"><output id="bc-eq-a-out">3</output></label><label class="bc-control-row" for="bc-eq-b">再加 b <input id="bc-eq-b" type="range" min="0" max="12" value="4"><output id="bc-eq-b-out">4</output></label><label class="bc-control-row" for="bc-eq-x">秘密答案 x <input id="bc-eq-x" type="range" min="0" max="12" value="5"><output id="bc-eq-x-out">5</output></label><label class="bc-control-row" for="bc-eq-guess">你的猜测 <input id="bc-eq-guess" type="number" min="0" max="24" value="5"></label><div class="bc-lab-foot">观察：a×x+b=c；解方程时先两边减 b，再两边除以 a。</div></div><div class="bc-lab-visual"><h3>等式天平</h3><div class="bc-balance"><div class="bc-balance-side" id="bc-balance-left"><b>左边</b><strong id="bc-balance-left-value">19</strong></div><div class="bc-balance-side" id="bc-balance-right"><b>右边</b><strong id="bc-balance-right-value">19</strong></div></div><p id="bc-eq-expression"></p><div class="bc-live-result" id="bc-eq-result" aria-live="polite"></div></div>`},
      logic:{lead:'点“下一步”，看线索怎样逐个排除不可能，再检查答案是否同时满足全部条件。',html:`<div class="bc-lab-controls"><p><b>三人住楼实验：</b>甲、乙、丙分别住 1、2、3 楼；甲不住 1 楼，乙住 3 楼。试着自己说出丙在哪一层。</p><div class="bc-logic-board" id="bc-logic-board"><div class="bc-logic-stage active" data-stage="0"><b>线索 1：</b>乙住 3 楼，所以甲和丙不住 3 楼。</div><div class="bc-logic-stage" data-stage="1"><b>线索 2：</b>甲不住 1 楼；3 楼已给乙，所以甲只能住 2 楼。</div><div class="bc-logic-stage" data-stage="2"><b>推出：</b>剩下的 1 楼归丙。</div><div class="bc-logic-stage" data-stage="3"><b>复核：</b>甲 2 楼、乙 3 楼、丙 1 楼，各不相同并满足所有条件。</div></div><div class="bc-control-row"><span id="bc-logic-counter">第 1 / 4 步</span><button class="bc-lab-button" type="button" id="bc-logic-next">看下一步</button></div></div><div class="bc-lab-visual"><h3>条件推理不是猜楼层</h3><div class="bc-live-result" id="bc-logic-result" aria-live="polite">先记住：每个人只住一层，每层也只住一个人。</div><p>推理的关键是逐条用条件排除，最后再回到题目检查，不是凭直觉挑一个答案。</p></div>`}
    };
    const lab = labs[branch.id] || labs.arithmetic;
    document.getElementById('bc-lab-lead').textContent = lab.lead;
    card.innerHTML = lab.html;

    if (branch.id === 'arithmetic') {
      const total = document.getElementById('bc-ratio-total'); const a = document.getElementById('bc-ratio-a'); const b = document.getElementById('bc-ratio-b');
      const draw = () => { const t=Number(total.value), x=Number(a.value), y=Number(b.value), unit=t/(x+y), first=unit*x, second=t-first; document.getElementById('bc-ratio-total-out').textContent=t; document.getElementById('bc-ratio-a-out').textContent=x; document.getElementById('bc-ratio-b-out').textContent=y; document.getElementById('bc-ratio-track').innerHTML=`<span style="width:${first/t*100}%">${first}</span><span style="width:${second/t*100}%">${second}</span>`; document.getElementById('bc-ratio-explain').textContent=`${t} 按 ${x}:${y} 分，一共 ${x+y} 份；每份 ${unit}。`; document.getElementById('bc-ratio-result').textContent=`第一份 ${first}，第二份 ${second}。验算：${first}+${second}=${t}。`; };
      [total,a,b].forEach((el)=>el.addEventListener('input',draw)); draw();
    } else if (branch.id === 'applications') {
      const heads=document.getElementById('bc-heads'), rabbits=document.getElementById('bc-rabbits');
      const draw=()=>{const h=Number(heads.value); rabbits.max=h; const r=Math.min(Number(rabbits.value),h); rabbits.value=r; const legs=2*h+2*r; document.getElementById('bc-heads-out').textContent=h; document.getElementById('bc-rabbits-out').textContent=r; document.getElementById('bc-animal-row').innerHTML=`${'🐔'.repeat(h-r)}${'🐰'.repeat(r)}`; document.getElementById('bc-animal-explain').textContent=`先假设 ${h} 个头全是鸡：${h}×2=${2*h} 条腿。每换一只兔，多 2 条腿。`; document.getElementById('bc-animal-result').textContent=`现在有 ${r} 只兔，腿数 = ${h}×2 + ${r}×2 = ${legs} 条。`;}; [heads,rabbits].forEach((el)=>el.addEventListener('input',draw)); draw();
    } else if (branch.id === 'geometry') {
      const length=document.getElementById('bc-rect-length'), width=document.getElementById('bc-rect-width');
      const draw=()=>{const l=Number(length.value),w=Number(width.value),svgW=220,svgH=110,max=15,ww=svgW*l/max,hh=svgH*w/max; document.getElementById('bc-rect-length-out').textContent=l;document.getElementById('bc-rect-width-out').textContent=w;const shape=document.getElementById('bc-rect-shape');shape.setAttribute('width',ww);shape.setAttribute('height',hh);shape.setAttribute('x',(320-ww)/2);shape.setAttribute('y',(160-hh)/2);document.getElementById('bc-rect-label-x').textContent=`长 ${l}`;document.getElementById('bc-rect-label-y').textContent=`宽 ${w}`;document.getElementById('bc-rect-center').setAttribute('x',160);document.getElementById('bc-rect-center').setAttribute('y',Math.max(24,(160-hh)/2+hh/2));document.getElementById('bc-rect-result').textContent=`周长 = 2×(${l}+${w}) = ${2*(l+w)}；面积 = ${l}×${w} = ${l*w} 平方单位。`;};[length,width].forEach((el)=>el.addEventListener('input',draw));draw();
    } else if (branch.id === 'counting') {
      const right=document.getElementById('bc-path-right'), up=document.getElementById('bc-path-up');
      const draw=()=>{const r=Number(right.value),u=Number(up.value),dp=Array.from({length:u+1},()=>Array(r+1).fill(0));for(let y=0;y<=u;y++)for(let x=0;x<=r;x++)dp[y][x]=x===0&&y===0?1:(x?dp[y][x-1]:0)+(y?dp[y-1][x]:0);document.getElementById('bc-path-right-out').textContent=r;document.getElementById('bc-path-up-out').textContent=u;document.getElementById('bc-path-table').innerHTML=Array.from({length:u+1},(_,row)=>{const y=u-row;return `<div class="bc-path-row">${Array.from({length:r+1},(_,x)=>`<span class="bc-path-cell${x===0&&y===0?' start':''}${x===r&&y===u?' end':''}" title="到此格点有 ${dp[y][x]} 条路">${dp[y][x]}</span>`).join('')}</div>`;}).join('');document.getElementById('bc-path-result').textContent=`最短路线需要 ${r+u} 步：向右 ${r} 步、向上 ${u} 步，共 ${dp[u][r]} 条。每个格点都把左边和下边的走法相加。`;};[right,up].forEach((el)=>el.addEventListener('input',draw));draw();
    } else if (branch.id === 'algebra') {
      const a=document.getElementById('bc-eq-a'),b=document.getElementById('bc-eq-b'),x=document.getElementById('bc-eq-x'),guess=document.getElementById('bc-eq-guess');
      const draw=()=>{const av=Number(a.value),bv=Number(b.value),xv=Number(x.value),c=av*xv+bv,g=Number(guess.value||0),lhs=av*g+bv;document.getElementById('bc-eq-a-out').textContent=av;document.getElementById('bc-eq-b-out').textContent=bv;document.getElementById('bc-eq-x-out').textContent=xv;document.getElementById('bc-balance-left-value').textContent=lhs;document.getElementById('bc-balance-right-value').textContent=c;document.getElementById('bc-balance-left').classList.toggle('unbalanced',lhs!==c);document.getElementById('bc-eq-expression').textContent=`方程：${av}x + ${bv} = ${c}。先两边减 ${bv}，再除以 ${av}。`;document.getElementById('bc-eq-result').textContent=lhs===c?`猜对了：x=${xv}，等式两边都是 ${c}。`:`你的 x=${g} 时左边是 ${lhs}；真正的 x=${xv}，因为 (${c}−${bv})÷${av}=${xv}。`;};[a,b,x,guess].forEach((el)=>el.addEventListener('input',draw));draw();
    } else if (branch.id === 'logic') {
      let step=0;const show=()=>{document.querySelectorAll('.bc-logic-stage').forEach((el,i)=>{el.classList.toggle('done',i<step);el.classList.toggle('active',i===step);});document.getElementById('bc-logic-counter').textContent=`第 ${Math.min(step+1,4)} / 4 步`;document.getElementById('bc-logic-next').textContent=step>=4?'再看一次':'看下一步';document.getElementById('bc-logic-result').textContent=step===0?'先记住：每个人只住一层，每层也只住一个人。':step===1?'乙已经住 3 楼，因此 3 楼不能再给甲或丙。':step===2?'甲不能住 1 楼，也不能住 3 楼，所以甲住 2 楼。':step===3?'只剩下 1 楼，丙住 1 楼。': '答案：甲 2 楼、乙 3 楼、丙 1 楼；三人楼层不同，且甲不住 1 楼。';};document.getElementById('bc-logic-next').addEventListener('click',()=>{step=step>=4?0:step+1;show();});show();
    }
  }

  document.getElementById('bc-lesson-stack').addEventListener('click',(event)=>{
    const button=event.target.closest('[data-bc-check]');
    if(button){const rawId=button.dataset.bcCheck;const index=Number(button.dataset.index);const lesson=branch.lessons.find((item)=>escapeId(item.id)===rawId);const q=lesson?.practice[index];if(!q)return;const card=button.closest('.bc-question');const input=card.querySelector('input');const feedback=card.querySelector('.bc-answer-feedback');if(!input.value.trim()){feedback.textContent='先写一个答案；卡住时可以打开提示。';feedback.classList.remove('good');input.focus();return;}const correct=(q.a||[]).some((answer)=>normalize(answer)===normalize(input.value));if(correct){feedback.textContent='答对了！试着把用到的规律也讲出来。';feedback.classList.add('good');const passed=new Set(progress[lesson.id]?.passed||[]);passed.add(index);progress[lesson.id]={passed:[...passed].sort((a,b)=>a-b),done:passed.size===lesson.practice.length};try{localStorage.setItem(progressKey,JSON.stringify(progress));}catch{}const details=button.closest('.bc-lesson');details.querySelector('.bc-lesson-status').textContent=progress[lesson.id].done?'已掌握':`${passed.size}/${lesson.practice.length} 自测`;details.querySelector('.bc-practice-count').textContent=`${passed.size}/${lesson.practice.length} 完成`;updateProgress();}else{feedback.textContent=`还差一点。提示：${q.hint}`;feedback.classList.remove('good');}return;}
    const labLink=event.target.closest('[data-open-lab]');if(labLink){document.getElementById('bc-lab').scrollIntoView({behavior:'smooth'});}
  });
  document.getElementById('bc-lesson-stack').addEventListener('keydown',(event)=>{if(event.key==='Enter'&&event.target.matches('.bc-answer-row input'))event.target.nextElementSibling?.click();});
  document.querySelectorAll('.bc-map-card').forEach((link)=>link.addEventListener('click',()=>{const target=document.querySelector(link.getAttribute('href'));if(target)target.open=true;}));
  window.addEventListener('hashchange',()=>{const target=document.querySelector(location.hash);if(target?.matches('.bc-lesson'))target.open=true;});
  document.getElementById('bc-print').addEventListener('click',()=>window.print());
  renderMap();renderLessons();renderFormulas();renderReview();renderLab();updateProgress();
})();
