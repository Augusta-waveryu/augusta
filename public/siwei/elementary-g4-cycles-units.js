(() => {
  const old = window.AOSHU_ELEMENTARY_DEEP_UNITS?.['4:cyclic-patterns'];
  if (!old) return;
  const feedback = [
    ['11=3×3+2，余2对应组内第2项B，不是商3对应的C。', '对，B；去掉3整组后，还剩第1、2两个位置。'],
    ['21=4×5+1，余1回到组内第1项春。', '对，春；5整组之后再数1项。'],
    ['“后100天”从今天之后走100步；100=7×14+2，从周日走2步是周二。', '对，星期二；今天是第0天，不算作已走的一天。']
  ];
  const unit = {
    ...old,
    label: '本轮深讲 · 四年级重复周期（本站原创）',
    title: '先标起点，再找余数：第几项不等于走几步',
    scope: '本站原创讲解、图示、互动与新增练习；保留原例题和前3题的题目、答案与顺序。本站路线序号不是教材讲次；教材版本、页码与逐讲对应待核。本课限于明确按固定小组重复的序列和星期循环，不展开复杂同余运算。',
    goal: '能解释重复单位与余数的关系，区分从第1项数位置和从第0天数经过步数；正确处理整除边界，并检查重复规则是否有依据。',
    idea: '先修：会有余数的整数除法。把一长串分成相同的小组，去掉整组不会改变下一组的顺序；但先要看题目是在数“位置”还是从起点后走“步数”。',
    example: { question: old.example.question, steps: [
      '规则已说明按“红、蓝、蓝”重复；从左起第一颗红色标为第1项，最短重复单位长度为3。',
      '10=3×3+1。先圈出前9项的3个完整小组，第10项在下一组的第1个位置。',
      '小组第1个是红，所以第10项是红。商3告诉有几整组，余数1才告诉剩余位置。',
      '回查：第7、8、9项是红、蓝、蓝，第10项重新回到红。若改问第9项，9=3×3，余0，是第3组末尾的蓝，不是“第0项”。'
    ] },
    methodCard: {
      title: '读重复规则 → 标起点 → 分整组 → 对照位置 → 回查',
      formula: 'n = 小组长度 × 整组数 + 余数（余数小于小组长度）',
      when: '题目明确说明固定小组一直重复时。只看见开头几项相似，还不足以保证后面永远重复。',
      steps: ['写出完整重复单位并保留顺序', '标清第1项，或把今天标为经过0天', '第n项用n分组；经过d天用d分组', '位置余0取组尾；经过天数余0回到今天的星期'],
      check: '若把今天算第1天，求第n天要先算经过n−1天。用起点、刚好一整组、再多1项这三个小例子检查，最容易发现差一天的错误。'
    },
    concepts: [
      { title: '1. 重复单位要包含整个顺序', text: '红、蓝、蓝不是“红、蓝”重复，因为第3项应是红却是蓝。最短重复单位是能完整反复拼接出序列、长度最小的那一组；只数颜色有几种不等于求组长。' },
      { title: '2. 去掉整组，为什么只看余数', text: '每组的顺序相同；去掉前面几整组后，剩下的仍从组内第1项开始。n=长度×商+余数，余数大于0时指向下一组的对应位置，不是用商来选颜色。' },
      { title: '3. 余0是组尾，不是没有答案', text: 'A、B、C重复时，第3项是C，第6项也是C。6÷3余0说明前6项恰好装满2组，目标就是第2组最后一项。组内位置编号是1、2、3，没有第0个位置。' },
      { title: '4. “第几天”和“后几天”差在起点', text: '今天周日。“后1天”是周一，今天经过0天；“把今天算第1天”的第1天仍是周日。后100天走100步，余2到周二；含今天的第100天只走99步，99除以7余1到周一。' },
      { title: '5. 最短方便，完整大组也能用', text: '红、蓝一直重复，最短组长为2，也可用“红、蓝、红、蓝”作为长度4的完整重复组。用2或4分组都能正确定位，但不能随便截取长度3的“红、蓝、红”反复拼接。关键是所选小组确实完整重复，不是一定只能用最短组。' },
      { title: '6. 看见重复，不等于证明一直重复', text: '只给A、B、A、B四项：一直重复A、B会让第5项是A；前四项照写、之后全写C会让第5项是C。两条规则都符合开头四项。题目明确规定重复时，才按该规则定位远处项。' }
    ],
    diagrams: [{ caption: '同一周日，两种数法，先看第一格', text: '经过天数：0 → 1 → 2 → 3 → 4 → 5 → 6 → 7\n星期名称：日 → 一 → 二 → 三 → 四 → 五 → 六 → 日\n含今天数：1 → 2 → 3 → 4 → 5 → 6 → 7 → 8\n后7天是周日；含今天的第7天是周六。\n“第几项”数格子；“后几天”数格子之间走了几步。' }],
    model: { type: 'cycle-position' },
    references: [{ label: '数学方法参考：星期每7天循环，整周后只需看余数（英文）', url: 'https://www.mathematicalgemstones.com/gemstones/amber/days-of-the-week-and-modular-arithmetic/' }],
    practices: [
      ...old.practices.map((p, i) => ({ ...p, level: ['保留原题 · 组内位置', '保留原题 · 四季循环', '保留原题 · 经过天数'][i], wrongFeedback: feedback[i][0], correctFeedback: feedback[i][1] })),
      { level: '边界 · 恰好整组', question: 'A、B、C按顺序一直重复，第12项是什么？', answers: ['C'], hint: '12=3×4，余0；在第4组的哪里？', wrongFeedback: '余0不是取A或第0项；第12项恰好是第4组的最后一项C。', correctFeedback: '对，C；第3、6、9、12项都在组尾。', explanation: '12除以3商4余0，目标是第4组第3个位置，所以是C。' },
      { level: '对比 · 包含今天', question: '今天是周日，把今天算作第1天，第100天是星期几？', answers: ['星期一', '周一'], hint: '先写：第1天周日，第2天周一；第100天经过了几天？', wrongFeedback: '含今天的第100天只经过99天；99=7×14+1，周日后1天是周一。不是后100天。', correctFeedback: '对，星期一；先用100−1=99算经过天数，再看余数1。', explanation: '从第1天到第100天有99次跨天；去掉14整周，再从周日走1步到周一。' },
      { level: '边界 · 整周回到起点', question: '今天是周日，后98天是星期几？', answers: ['星期日', '星期天', '周日', '周天'], hint: '98=7×14，完整走14周后回到哪里？', wrongFeedback: '经过天数余0表示回到起点的星期，不是取周六。今天是周日，后98天仍是周日。', correctFeedback: '对，星期日；14整周后仍是起点的星期。', explanation: '98除以7余0；这里编号0代表经过0天的周日，与位置从1数的组尾解释不同。' },
      { level: '辨认 · 最短单位', question: 'A、B、A、B、A、B……按A、B一直重复，最短重复单位的长度是多少？', answers: ['2'], hint: 'ABAB含有几个相同的AB？长度1能表示交替吗？', wrongFeedback: 'ABAB是AB的两次重复，还能缩短为AB；长度1不能让A和B交替。', correctFeedback: '对，2；AB是最短单位，ABAB也是完整的大重复组。', explanation: 'AB能一直拼接出整个序列，A单独重复不能；因此最短长度为2。' },
      { level: '条件 · 大组能否使用', question: '红、蓝按顺序一直重复。用“红、蓝、红、蓝”作长度4的完整重复组来定位第10项，可以吗？（可以/不可以）', answers: ['可以', '能'], hint: '反复拼接这个4项小组，会改变红蓝交替的顺序吗？', wrongFeedback: '可以；它由两个完整的红蓝小组组成。10=4×2+2，取第2个蓝，与按长度2余0取蓝一致。', correctFeedback: '对，可以；不是最短也能用，但必须是实际完整重复的单位。', explanation: '长度4的组确实重复；第10项在下一组第2个位置，是蓝。长度2时第10项在组尾，也是蓝。' },
      { level: '反例 · 规则是否明确', question: '只给A、B、A、B四项，不说明后续规则，能保证第5项一定是A吗？（能/不能）', answers: ['不能', '不能保证', '不一定'], hint: '比较“一直重复AB”和“前四项后都写C”。', wrongFeedback: '不能保证；两条规则都符合开头四项，第5项却分别是A和C。', correctFeedback: '对，不能；需要明确的延续条件，不能把猜想当保证。', explanation: '有限前缀不能唯一确定后续；只有题目明确规定按AB重复时，才得到第5项A。' }
    ],
    review: [
      { question: '余0时，为什么有时取组尾，有时回到今天？', answer: '从第1项数位置，整组装满时在组尾；从经过0天起走步数，整周后回到起点。先写清编号再解释余数。' },
      { question: '含今天的第100天，为什么不是后100天？', answer: '第1天已是今天，尚未跨天；第100天只跨99次，而后100天要跨100次。' },
      { question: '一定只能用最短重复单位吗？', answer: '不是；多个完整最短单位组成的大组也可用，只是较长。不能使用拼接后会改变顺序的片段。' },
      { question: '看到ABAB就能保证第5项是A吗？', answer: '不能保证。必须有一直按AB重复等明确规则；否则也可能前四项之后全部写C。' }
    ]
  };
  window.AOSHU_ELEMENTARY_DEEP_UNITS = { ...window.AOSHU_ELEMENTARY_DEEP_UNITS, '4:cyclic-patterns': unit };
  const previous = window.AOSHU_FOUNDATION_WIDGETS;
  if (!previous) return;
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const cases = {
    beads: { name: '位置：红蓝蓝重复', labels: ['红', '蓝', '蓝'], kind: 'position' },
    large: { name: '位置：ABAB大组', labels: ['A', 'B', 'A', 'B'], kind: 'position' },
    after: { name: '周日后d天', labels: weekdays, kind: 'after' },
    inclusive: { name: '周日算第1天', labels: weekdays, kind: 'inclusive' }
  };
  window.AOSHU_FOUNDATION_WIDGETS = {
    supports: type => type === 'cycle-position' || previous.supports(type),
    markup(config) {
      if (config.type !== 'cycle-position') return previous.markup(config);
      return `<section class="book-model-lab book-foundation-lab book-cycles-lab" data-book-model="cycle-position" aria-label="周期起点与余数实验台"><div class="book-model-heading"><b>先预测落在哪格，再用余数核对</b><span>切换“位置”与“经过天数”，看余0的解释怎样变化。只操作图示，不记录答题进度。</span></div><div class="book-foundation-controls"><label>数法<select data-foundation-model-control data-cycle-case aria-label="周期数法">${Object.entries(cases).map(([key, c]) => `<option value="${key}">${c.name}</option>`).join('')}</select></label><label><span data-cycle-label>第几项（1—1000）</span><input type="number" min="1" max="1000" step="1" value="10" data-foundation-model-control data-cycle-number aria-label="周期目标数"></label></div><p data-cycle-origin></p><ol class="book-cycle-cells" data-cycle-cells aria-label="重复组与目标位置"></ol><p class="book-model-result" data-book-model-result aria-live="polite"></p></section>`;
    },
    update(root) {
      if (root?.dataset.bookModel !== 'cycle-position') return previous.update(root);
      const choice = root.querySelector('[data-cycle-case]'), input = root.querySelector('[data-cycle-number]');
      const key = Object.hasOwn(cases, choice?.value) ? choice.value : 'beads', c = cases[key], length = c.labels.length;
      if (root.dataset.cycleCase !== key) { root.dataset.cycleCase = key; input.value = c.kind === 'position' ? '10' : '100'; }
      const min = c.kind === 'after' ? 0 : 1;
      input.min = String(min);
      root.querySelector('[data-cycle-label]').textContent = c.kind === 'position' ? '第几项（1—1000）' : c.kind === 'after' ? '经过几天（0—1000）' : '含今天的第几天（1—1000）';
      root.querySelector('[data-cycle-origin]').textContent = c.kind === 'position' ? `从第1项开始；本组长度${length}${key === 'large' ? '，最短单位AB长2；这里故意用两个AB组成的大组' : ''}。` : c.kind === 'after' ? '今天周日是经过0天；每多1天才向前走1步。' : '今天周日算第1天；第n天只经过n−1天。图中标的是经过天数。';
      const raw = input.value.trim(), n = Number(raw), valid = raw !== '' && Number.isInteger(n) && n >= min && n <= 1000;
      const amount = c.kind === 'inclusive' ? n - 1 : n, q = Math.floor(amount / length), r = amount % length;
      const selected = !valid ? -1 : c.kind === 'position' ? (r === 0 ? length - 1 : r - 1) : r;
      root.querySelector('[data-cycle-cells]').innerHTML = c.labels.map((label, i) => `<li${i === selected ? ' class="is-cycle-target" aria-current="true"' : ''}><small>${c.kind === 'position' ? `组内第${i + 1}项` : `经过${i}天`}</small><strong>${label}</strong><span>${i === selected ? '目标落点' : '　'}</span></li>`).join('');
      const result = root.querySelector('[data-book-model-result]');
      if (!valid) { result.textContent = `请输入${min}到1000之间的整数；空白、小数、负数或超界值不定位。`; return true; }
      const equation = `${amount}=${length}×${q}+${r}`;
      result.textContent = c.kind === 'position'
        ? `${equation}。${r === 0 ? `恰好装满${q}整组，目标在最后一组第${length}项（组尾），不是第0项` : `先去掉${q}整组，目标在下一组第${r}项`}：${c.labels[selected]}。${key === 'large' ? '用最短组长2核对，答案仍相同。' : ''}`
        : `${c.kind === 'inclusive' ? `含今天第${n}天，先算经过${n}−1=${amount}天。` : `周日后${n}天，经过${n}步。`}${equation}。去掉${q}整周，${r === 0 ? '回到起点' : `再从周日走${r}步`}：${c.labels[selected]}。`;
      return true;
    }
  };
})();
