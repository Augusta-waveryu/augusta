(() => {
  const old = window.AOSHU_ELEMENTARY_DEEP_UNITS?.['4:geometric-sequences'];
  if (!old) return;
  const feedback = [
    ['题目规定每次乘2，不是每次加2：40×2=80。', '对，80；80÷40=2，与每一个已知相邻比一致。'],
    ['每次除以2是把现有数量分成相等的两份，8÷2=4；不是减去2。', '对，4；4÷8=1/2，仍是前一项的一半。'],
    ['只从最后一项54再乘3一次，54×3=162；不是再加3。', '对，162；162÷54=3，符合每次乘3。'],
    ['要检查全部相邻比：6÷2=3，12÷6=2，24÷12=2；第一步就不同。', '对，否；后两步都是乘2，不能掩盖第一步乘3。']
  ];
  const unit = {
    ...old,
    label: '本轮深讲 · 四年级等比变化（本站原创）',
    title: '每次加一样，还是每次乘一样？把每一步都查清',
    scope: '本站原创讲解、互动与新增练习；保留原例题和前4题的题目、答案与顺序。本站路线序号不是教材讲次；教材版本、页码及逐讲对应待核。本课以正数项和固定正整数乘数为主，保留“每次折半”作直观衔接，不展开一般分数、负数公比与求和公式。含零情形只辨认除法边界。',
    goal: '能说明固定倍数的含义，检查每个相邻比；在明确规则下求下一项或指定项，并分清起点、乘法次数及除数非零的条件。',
    idea: '先修：会整数乘法；本课把“后一项÷前一项”解释为后一项是前一项的几倍，并用乘法回查。折半就是取现有量的一半，不要求先学一般分数运算。相邻差问加了多少，相邻比问乘了几倍。',
    example: { question: old.example.question, steps: [
      '先标起点：第1项是3。3到6才是第一次乘2，不把起点也算作一次乘法。',
      '前一项都非零，可以逐对检查：6÷3=2，12÷6=2，24÷12=2；三个相邻比全部相同。固定的相邻比叫公比。',
      '题目明确规定继续每次乘2，因此从最后一项24再走一步：24×2=48。不是24+2，也不是再乘两次。',
      '回查48÷24=2；它是第5项，从第1项3起乘了4次2。若只给前4个数、不规定延续方式，就不能保证下一项唯一。'
    ] },
    methodCard: {
      title: '读规则 → 查每对 → 数步数 → 乘一次 → 回查',
      formula: '相邻比 = 后一项 ÷ 前一项（前一项非零）',
      when: '题目明确给出每次翻倍、变为3倍、保持原量或折半等固定倍数变化时。只看某一对碰巧有倍数关系，不能当作全部数都符合。',
      steps: ['确认每一步是加同一个数，还是乘同一个数', '计算全部相邻比，不能漏查第一步或最后一步', '求下一项只走一步；求第n项从起点走n−1步', '把结果除以前一项回查，除数必须非零'],
      check: '固定倍数时，从第1项到第n项，把起点连续乘n−1次同一个倍数。连续乘5次2就是2×2×2×2×2，简写为2⁵；不是2×5。规则不固定时不能直接这样算。'
    },
    concepts: [
      { title: '1. 倍数怎样解释变化', text: '3到6可以说加3，也可以说乘2；还需查6到12、12到24。它们增加6、12，差不同，但每一步都是前一项的2倍。固定差与固定比不是同一种条件。' },
      { title: '2. 为什么要逐对相除', text: '若后一项=前一项×固定倍数，当前一项非零时，用除法就能把这个倍数找回来。每一对都得到同一个比，才说明全部已知项符合固定倍数；预测还要依据题目明确的延续规则。' },
      { title: '3. 第1项还没有乘过', text: '从第1项3到第6项，连续乘2五次：3→6→12→24→48→96。6个站点之间只有5次变化；不能乘6次，也不能把3直接乘2再乘5。' },
      { title: '4. 乘1不变，折半会变小', text: '7、7、7每次乘1，公比为1；固定倍数不一定让数量增大。64、32、16、8每次除以2，也就是每次取原来的一半，可写作乘1/2；下一项8÷2=4。这里只用折半理解，不展开一般分数运算。' },
      { title: '5. 遇到0，先停下相除', text: '0不能作除数：0÷0没有定义，不等于0，也不等于1。0、0、0虽能由“每次乘2”得到，也能由“每次乘3”得到，因此不能用相邻相除确定唯一公比。本课的相邻比判定以各项非零为前提。' },
      { title: '6. 符合已知项，不表示只能这样延续', text: '只给3、6、12、24：规则甲“以后一直乘2”得到48；规则乙“先乘2三次，以后一直加1”得到25。两条规则都符合已知4项。只有写明延续规则，才能在该规则下确定下一项。' }
    ],
    diagrams: [{ caption: '第二个示范：从起点走到第6项', text: '项号： 1 → 2 → 3 → 4 → 5 → 6\n数值： 3 → 6 →12 →24 →48 →96\n每步：   ×2  ×2  ×2  ×2  ×2\n3×2×2×2×2×2=96：6项，5次乘法。\n对照3、6、9、12：每次加3，但相邻比2、3/2、4/3并不相同。' }],
    model: { type: 'adjacent-ratios' },
    practices: [
      ...old.practices.map((p, i) => ({ ...p, level: ['保留原题 · 翻倍', '保留原题 · 折半', '保留原题 · 三倍', '保留原题 · 逐对检验'][i], wrongFeedback: feedback[i][0], correctFeedback: feedback[i][1] })),
      { level: '迁移 · 项数与次数', question: '第1项是3，之后每次乘2。第6项是多少？', answers: ['96'], hint: '先写6个站点，数一数有几次乘2。', wrongFeedback: '从第1项到第6项只乘5次2：3→6→12→24→48→96；不是3×2×5。', correctFeedback: '对，96；起点3之后乘2五次，项数比乘法次数多1。', explanation: '连续计算为3、6、12、24、48、96，共6项；3×2×2×2×2×2=96。' },
      { level: '辨界 · 保持原量', question: '按每次乘1的规则，7、7、7……下一项是多少？', answers: ['7'], hint: '乘1保持原来的量，不是加1。', wrongFeedback: '乘1不是加1；7×1=7。', correctFeedback: '对，7；相邻比7÷7=1，固定倍数也可以不改变数量。', explanation: '题目规定每次乘1，因此下一项7×1=7。' },
      { level: '反例 · 不能只查开头', question: '3、6、12、25的相邻比是否全部相同？（是/否）', answers: ['否', '不是', '不相同'], hint: '前两步乘2后，最后一步是否也应乘2？', wrongFeedback: '如果一直乘2，12后应是24，不是25；25÷12不等于2。', correctFeedback: '对，否；最后一步不符合，不能只查前两步。', explanation: '6÷3=2、12÷6=2，但25不等于12×2，所以相邻比并非全部相同。' },
      { level: '挑战 · 规则与猜想', question: '只给3、6、12、24，不说明后续规则，能保证下一项一定是48吗？（能/不能）', answers: ['不能', '不能保证', '不一定'], hint: '比较“一直乘2”和“先乘2三次，以后一直加1”。', wrongFeedback: '不能保证。按一直乘2得48；按先乘2三次以后加1得25，两者都符合已知项。', correctFeedback: '对，不能；需要题目说明延续规则，不能把一种猜想说成唯一答案。', explanation: '有限项可以符合多种延续规则；在明确“每次乘2”时才据此得到48。' },
      { level: '边界 · 零作除数', question: '对0、0、0，能用相邻相除确定唯一公比吗？（能/不能）', answers: ['不能', '不能确定'], hint: '相邻相除要算0÷0；先问除数能否为0。', wrongFeedback: '不能。0÷0没有定义；每次乘2或乘3都能得到全零项，不能由这些项确定唯一倍数。', correctFeedback: '对，不能；0不能作除数，也不能把0÷0当成0或1。', explanation: '相邻比判定要求前一项非零。全零项无法用相除找公比；这不等于说0乘2不能得到0。' }
    ],
    review: [
      { question: '相邻差与相邻比各问什么？', answer: '差问加了多少，比问乘了几倍；3、6、12的差不同，但相邻比都是2。' },
      { question: '从第1项到第n项为什么只乘n−1次？', answer: '起点尚未变化，每多一项才多一次乘法；第1项本身乘0次。' },
      { question: '只检查第一对或最后一对够吗？', answer: '不够，要检查每个已知间隔；预测还要依据明确的延续规则。' },
      { question: '为什么全零项不能用相除确定唯一公比？', answer: '0不能作除数，0÷0没有定义；许多不同倍数乘0仍为0，不能据此分辨倍数。' }
    ]
  };
  window.AOSHU_ELEMENTARY_DEEP_UNITS = { ...window.AOSHU_ELEMENTARY_DEEP_UNITS, '4:geometric-sequences': unit };
  const previous = window.AOSHU_FOUNDATION_WIDGETS;
  if (!previous) return;
  const cases = {
    double: { name: '翻倍：从3起每次乘2', terms: [3, 6, 12, 24, 48, 96], note: '每一步乘2；6项只乘了5次2，不是把起点乘2再乘5。' },
    triple: { name: '三倍：从2起每次乘3', terms: [2, 6, 18, 54, 162, 486], note: '每一步乘3；增加量不是固定的3。' },
    half: { name: '折半：从64起每次除以2', terms: [64, 32, 16, 8, 4, 2], note: '每一步取前一项的一半，写作乘1/2；固定倍数也可使数量变小。' },
    same: { name: '不变：从7起每次乘1', terms: [7, 7, 7, 7, 7, 7], note: '相邻比1；乘1不是加1，数量保持不变。' },
    counter: { name: '反例：中间一步不是乘2', terms: [3, 6, 12, 25, 50, 100], note: '已知第三次变化不符合乘2：12×2=24，不是25。这里仅检查已知项，不预测后续。' },
    zero: { name: '零项：不能用0÷0求比', terms: [0, 0, 0, 0, 0, 0], note: '0÷0没有定义，不能用相邻相除确定唯一公比；乘2和乘3都可以保持0。这里只展示已知零项。' }
  };
  window.AOSHU_FOUNDATION_WIDGETS = {
    supports: type => type === 'adjacent-ratios' || previous.supports(type),
    markup(config) {
      if (config.type !== 'adjacent-ratios') return previous.markup(config);
      return `<section class="book-model-lab book-foundation-lab book-ratios-lab" data-book-model="adjacent-ratios" aria-label="逐对检查倍数实验台"><div class="book-model-heading"><b>先预测，再展开一站核对</b><span>每张卡片是一项；到达这项的倍数写在下面。切换案例回到起点；操作不记录答题进度。</span></div><div class="book-foundation-controls"><label>变化案例<select data-foundation-model-control data-ratio-case aria-label="倍数变化案例">${Object.entries(cases).map(([key, c]) => `<option value="${key}">${c.name}</option>`).join('')}</select></label><label>展开到第几项<select data-foundation-model-control data-ratio-count aria-label="倍数展开项数">${[1, 2, 3, 4, 5, 6].map(n => `<option value="${n}">第${n}项 · 已走${n - 1}步</option>`).join('')}</select></label></div><ol class="book-ratio-stations" data-ratio-stations aria-label="已展开项与到达倍数"></ol><p class="book-model-result" data-book-model-result aria-live="polite"></p></section>`;
    },
    update(root) {
      if (root?.dataset.bookModel !== 'adjacent-ratios') return previous.update(root);
      const choice = root.querySelector('[data-ratio-case]'), control = root.querySelector('[data-ratio-count]');
      const key = Object.hasOwn(cases, choice?.value) ? choice.value : 'double', c = cases[key];
      if (root.dataset.ratioCase !== key) { root.dataset.ratioCase = key; control.value = '1'; }
      const raw = Number(control.value), n = Number.isInteger(raw) ? Math.max(1, Math.min(6, raw)) : 1;
      control.value = String(n);
      const ratioText = (i) => !i ? '起点 · 尚未变化' : c.terms[i - 1] === 0 ? '0÷0没有定义；不计算比值' : `${c.terms[i]} ÷ ${c.terms[i - 1]} = ${key === 'half' ? '1/2' : key === 'counter' && i === 3 ? '25/12（不是2）' : c.terms[i] / c.terms[i - 1]}`;
      root.querySelector('[data-ratio-stations]').innerHTML = c.terms.slice(0, n).map((value, i) => `<li${key === 'counter' && i === 3 ? ' class="is-ratio-exception"' : ''}><span>第${i + 1}项</span><strong>${value}</strong><small>${ratioText(i)}</small></li>`).join('');
      root.querySelector('[data-book-model-result]').textContent = `已展开${n}项，从起点走了${n - 1}步。${n > 1 ? `最后一步：${ratioText(n - 1)}。` : ''}${c.note}`;
      return true;
    }
  };
})();
