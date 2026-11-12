(() => {
  const old = window.AOSHU_ELEMENTARY_DEEP_UNITS?.['4:figurate-numbers'];
  if (!old) return;
  const feedback = [
    ['下一幅是5行、每行5点，不是只加一行：5×5=25。', '对，25；第5幅的总数是5×5。'],
    ['15是已有总数，下一行有6点，所以15+6=21。', '对，21；总数与新添的一行要分开数。'],
    ['6表示每边有6个点，不是6个间隔；6行各6点，共36点。', '对，36；6×6数的是所有点，不是只数边框。']
  ];
  const unit = {
    ...old,
    label: '本轮深讲 · 四年级点阵数（本站原创）',
    title: '看全图，再数新层：总点数不等于新增点数',
    scope: '本站原创讲解、点阵、互动与新增练习；保留原例题及前3题的题目、答案和顺序。本站路线序号不是教材讲次；教材版本、页码与逐讲对应待核。只研究按明确规则逐层生长的实心三角形与正方形点阵，不把图形外观或有限数字当作唯一规律。',
    goal: '能分清第几幅、总点数与新增点数；用完整点阵解释三角形添一行、正方形添L形，并避免角点重复计数。',
    idea: '先修：会按行数点、加法和乘法。旧点保留，新点另作标记；下一幅总数=原有总数+新添点数。图中的点是离散物，不是面积单位或点间的空隙。',
    diagram: { caption: '完整三角形点阵：●为原有点，＋为本次新增点（＋也算一个点）', text: '第1幅：总数1，新增1\n＋\n\n第2幅：总数3，新增2\n●\n＋ ＋\n\n第3幅：总数6，新增3\n●\n● ●\n＋ ＋ ＋\n\n第4幅：总数10，新增4\n●\n● ●\n● ● ●\n＋ ＋ ＋ ＋\n每幅都保留上方的全部旧点，不是只画最下面一行。' },
    example: { question: old.example.question, steps: [
      '题目已说明按三角形点阵生长：第n幅有n行，从上往下分别是1、2、…、n个点。第几幅说的是行数，不是总点数。',
      '第4幅保留前3行的1+2+3=6点，再添第4行4点，总数6+4=10。相邻总数的差2、3、4，对应新增的一行。',
      '下一幅是第5幅，只添第5行5点，不是再添已有总数10：10+5=15。',
      '回查完整图：1+2+3+4+5=15。按题目给定的生长规则，下一项是15；新添5点和总共15点回答的是不同问题。'
    ] },
    methodCard: {
      title: '确认生长规则 → 保留旧点 → 标出新层 → 不重不漏 → 合并核对',
      formula: '下一幅总数 = 原有总数 + 新增点数',
      when: '题目明确每次在旧图基础上怎样添点时。三角形第n幅有1到n点的各行；正方形第n幅有n行、每行n点。这里n从1开始。',
      steps: ['先写第几幅及每行点数', '区分旧点与新增点', '三角形只添下一整行；正方形添底行和右列', '把新点分成不重叠的两部分，再加回旧总数'],
      check: '从3×3变4×4：新底行4点，右侧只数上面3点，新增7点，9+7=16。若底行4点和右列4点都完整数，要减掉重复的右下角1点。'
    },
    concepts: [
      { title: '1. 三种数先分清', text: '第4幅三角形有4行、总共10点、比第3幅新添4点。行数4、总数10、增量4虽然有时碰巧相同，意思却不同。每次“添一行”并不表示每次只添一个点。' },
      { title: '2. 三角形为什么越来越多加1点', text: '第n幅最下面一行有n点，下一幅的新行有n+1点；旧行不动。第4幅到第5幅加5，第5幅到第6幅加6，所以总数的相邻差依次是2、3、4、5、6。' },
      { title: '3. 正方形添的是一个L形', text: '从n行各n点变成n+1行各n+1点，要添底行n+1点，再添右列上方n点；角点归底行，右列不再数它。新增(n+1)+n=2×n+1点，是奇数。3×3变4×4添4+3=7点。' },
      { title: '4. 也可以先重数，再减重', text: '完整底行与完整右列各有n+1点，但右下角属于两者，会数两遍；因此新增(n+1)+(n+1)−1。3×3变4×4是4+4−1=7，不是8。两种分法要得到相同结果。' },
      { title: '5. 点数不是间隔数，也不是只数外框', text: '一边排6点，相邻点之间有5个间隔；6行各6点共36点。若说一边有6个间隔，就需要7点，实心正方形共有7×7=49点。只数边框或留空中心是别的规则，不能直接用实心点阵总数。' },
      { title: '6. 先有规则，才有预测依据', text: '只给1、3、6、10四个数，还不能保证下一项一定15。可以规定按三角形添行，也可以规定前四项照写、之后都写10；两条规则都符合前四项。题目明确按三角形点阵生长，才按这个条件求下一幅。' }
    ],
    model: { type: 'figurate-growth' },
    references: [{ label: '数学方法参考：三角形逐行相加、平方数逐层加奇数（英文）', url: 'https://www.themathpage.com/Arith/appendix.htm' }],
    practices: [
      ...old.practices.map((p, i) => ({ ...p, level: ['保留原题 · 平方总数', '保留原题 · 三角形下一层', '保留原题 · 点数与边长'][i], wrongFeedback: feedback[i][0], correctFeedback: feedback[i][1] })),
      { level: '辨认 · 只问新增', question: '三角形点阵第4幅有10点，下一幅添一行5点。只问新增了多少点？', answers: ['5'], hint: '题目问新增，不是下一幅总数。', wrongFeedback: '15是下一幅总数；只问新添的一行，是5点。', correctFeedback: '对，新增5点；旧10点加新5点才是总数15。', explanation: '10点保留，单独新添5点，所以新增点数是5，总点数是10+5=15。' },
      { level: '推理 · L形新增', question: '实心正方形点阵从3行各3点变成4行各4点，一共新增多少点？', answers: ['7'], hint: '先数底行4点；右侧上方还有几颗，不再数角点？', wrongFeedback: '4+4=8把右下角数了两遍；应为4+3=7，也可16−9=7。', correctFeedback: '对，7；底行4点与右列上方3点没有重叠。', explanation: '新底行4点，右列另有原3行对应的3个新点，共4+3=7；核对4×4−3×3=16−9=7。' },
      { level: '改错 · 重数角点', question: '从4×4点阵变成5×5，底行5点与完整右列5点都数了，应减去重复的几个角点？', answers: ['1'], hint: '这条底行与这条右列在哪里相交？', wrongFeedback: '这两条只在右下角相交1点，不是减4个角，也不是不减。', correctFeedback: '对，减1个；新增5+5−1=9点。', explanation: '右下角既在底行又在右列，合计时被数两次；只减去多算的一次，新增9点。' },
      { level: '迁移 · 下一幅总数', question: '按实心正方形点阵规律，从5行各5点变成下一幅，下一幅总共有多少点？', answers: ['36'], hint: '下一幅有6行各6点；或旧25点加新L形11点。', wrongFeedback: '11是新增点数，不是总数；25+6+5=36。', correctFeedback: '对，36；6×6=36，也等于25+11。', explanation: '下一幅是6×6；新增底行6点与右列上方5点，共11点，所以总数25+11=36。' },
      { level: '边界 · 点与间隔', question: '一个实心正方形点阵，每边相邻点之间有6个间隔，每行点数相同。总共有多少点？', answers: ['49'], hint: '先排两个点：它们之间只有1个间隔。6个间隔要几颗点？', wrongFeedback: '6个间隔需要7点，不是6点；7行各7点，共49点。', correctFeedback: '对，49；先把间隔6转成每边7点。', explanation: '每边点数比间隔数多1，所以有7行、每行7点，总共7×7=49点。' },
      { level: '条件 · 能否保证', question: '只给1、3、6、10四个数，不说明后面怎样变化，下一项一定是15吗？（是/否）', answers: ['否', '不一定', '不能确定'], hint: '比较“按三角形添行”与“前四项后都写10”。', wrongFeedback: '不一定；两条规则都符合前四项，下一项分别是15和10。', correctFeedback: '对，不一定；明确生长规则才有预测依据。', explanation: '按三角形生长可得15，但也有符合前四项且之后都写10的规则。有限前缀不能保证唯一下一项。' }
    ],
    review: [
      { question: '第4幅三角形的4、10、4分别表示什么？', answer: '4行、总数10点、比第3幅新增4点。不要把新增的一行当成完整第4幅。' },
      { question: '从n×n变成(n+1)×(n+1)，为什么不是新增2×(n+1)点？', answer: '整条底行和整条右列在右下角相交，直接相加把它算了两次；应减1，或只数底行n+1点与右列上方n点。' },
      { question: '一边6点和一边6个间隔一样吗？', answer: '不一样。6点之间5个间隔；6个间隔需要7点。先确认单位，再求总点数。' },
      { question: '为什么图形规则比只猜数字重要？', answer: '规则说明哪些旧点留下、哪里添新点；只给有限数字可以有不同延伸，不能保证唯一下一项。' }
    ]
  };
  window.AOSHU_ELEMENTARY_DEEP_UNITS = { ...window.AOSHU_ELEMENTARY_DEEP_UNITS, '4:figurate-numbers': unit };
  const previous = window.AOSHU_FOUNDATION_WIDGETS;
  if (!previous) return;
  window.AOSHU_FOUNDATION_WIDGETS = {
    supports: type => type === 'figurate-growth' || previous.supports(type),
    markup(config) {
      if (config.type !== 'figurate-growth') return previous.markup(config);
      return `<section class="book-model-lab book-foundation-lab book-figurate-lab" data-book-model="figurate-growth" aria-label="完整点阵与新增层实验台"><div class="book-model-heading"><b>先预测新添几颗，再对照完整图</b><span>实心图形；实心圆为旧点，带＋的圆为新点。图示操作不记录答题进度。</span></div><div class="book-foundation-controls"><label>图形<select data-foundation-model-control data-figurate-shape aria-label="点阵形状"><option value="triangle">三角形添一行</option><option value="square">正方形添L形</option></select></label><label>第几幅（1—10）<input type="number" min="1" max="10" step="1" value="4" data-foundation-model-control data-figurate-number aria-label="点阵幅数"></label></div><div class="book-figurate-board" data-figurate-board role="img"></div><p class="book-model-result" data-book-model-result aria-live="polite"></p></section>`;
    },
    update(root) {
      if (root?.dataset.bookModel !== 'figurate-growth') return previous.update(root);
      const shape = root.querySelector('[data-figurate-shape]').value === 'square' ? 'square' : 'triangle';
      const raw = root.querySelector('[data-figurate-number]').value.trim(), n = Number(raw);
      const board = root.querySelector('[data-figurate-board]'), result = root.querySelector('[data-book-model-result]');
      if (raw === '' || !Number.isInteger(n) || n < 1 || n > 10) {
        board.innerHTML = ''; board.removeAttribute('aria-label'); result.textContent = '请输入1到10之间的整数；空白、小数或超界值不画图。'; return true;
      }
      let oldCount = 0, added = 0;
      board.innerHTML = Array.from({ length: n }, (_, row) => {
        const width = shape === 'triangle' ? row + 1 : n;
        return `<div class="book-figurate-row">${Array.from({ length: width }, (_, col) => {
          const isNew = shape === 'triangle' ? row === n - 1 : row === n - 1 || col === n - 1;
          if (isNew) added++; else oldCount++;
          return `<span class="book-figurate-dot${isNew ? ' is-new' : ''}" aria-hidden="true">${isNew ? '+' : ''}</span>`;
        }).join('')}</div>`;
      }).join('');
      const total = oldCount + added;
      board.setAttribute('aria-label', `${shape === 'triangle' ? '三角形' : '正方形'}第${n}幅：${n}行，旧点${oldCount}，新增${added}，总共${total}点。`);
      result.textContent = shape === 'triangle'
        ? `第${n}幅有${n}行，每行从1点到${n}点；旧${oldCount}点+新行${added}点=总数${total}点。下一幅添${n + 1}点，总数${total + n + 1}点。`
        : `第${n}幅有${n}行、每行${n}点；旧${oldCount}点+新L形${added}点=总数${total}点。新底行${n}点+右列上方${n - 1}点=${added}点，角点只数一次。下一幅添${2 * n + 1}点，总数${(n + 1) * (n + 1)}点。`;
      return true;
    }
  };
})();
