(() => {
  const unit = {
    label: '本轮深讲 · 四年级平均数',
    courseTitle: '平均数与移多补少',
    title: '平均不是猜中间：先守住总量，再看份数',
    scope: '本站精选路线，序号不是教材讲次；教材版本、页码与逐讲映射待核。本课讲解、图示、互动与新增练习均为本站原创，保留原例题与原自测语义，不是教材或杯赛原题。只讨论同一种数量、同一单位的数据，每个数据在它所在的组内都计一次；份数必须大于0。',
    goal: '理解平均数由总量和份数共同决定；能反求总量、用移多补少解释平均、更新加入或拿走数据后的平均，并识别不同人数的两组不能直接平均组平均数。',
    idea: '先修：会加减乘除和平均分；1.5表示一又二分之一。平均数是把总量假想均分后每份的量，不要求原来每份相等，也不一定是原数据中的一个数。移多补少时总量、份数都不变；加入或拿走数据时，两者都要重查。',
    example: {
      question: '4 个数的平均数是 12，它们的总和是多少？',
      steps: [
        '先辨数量：4是数据的个数，12是把总量均分成4份后每份的量，不是其中某个数据必须等于12。',
        '从平均的含义出发：均分后的4份各是12，总和就是12+12+12+12=12×4=48。原来怎样分布不影响这个总和。',
        '例如8、10、14、16的和是48，平均48÷4=12；四个数没有一个等于12，也仍然符合条件。只给平均数和个数，不能确定每个原数。',
        '回查：48÷4=12，确实回到原平均数。答案是总和48，而不是“每个原数都是12”。'
      ]
    },
    methodCard: {
      title: '圈定数据 → 求总量 → 数份数 → 均分 → 回查',
      formula: '平均数=总量÷份数；总量=平均数×份数（份数>0）',
      when: '数据同类且单位一致，问“平均每份多少”或由平均反求总量时用；数据有增减或合并两组时，先恢复各自总量再计算。',
      steps: ['明确统计谁、每份是什么', '把所有数据相加，或用平均数乘份数还原总量', '逐一数份数，0这个数据也算一份', '用总量除以新份数', '乘回份数查总量，并查平均数是否在最小与最大数据之间'],
      check: '不能只平均最大、最小两个数，也不能把人数不同的两组平均数直接相加除以2。问的是平均量，不是原来每份都一样。'
    },
    model: {type: 'average-balance'},
    diagrams: [
      {caption: '移多补少：16里的4移给8，总量36不变', text: '原来：8、12、16，总量8+12+16=36，共3份\n目标：36÷3=12\n少的：8比12少4；多的：16比12多4\n移动：从16移4给8，变为12、12、12\n回查：12×3=36；移的是4，不是两端差8。'},
      {caption: '两组人数不同，先还原总量', text: '甲组2人，平均8本 → 总量2×8=16本\n乙组6人，平均12本 → 总量6×12=72本\n合并共8人、88本 → 平均88÷8=11本\n(8+12)÷2=10，把两组当成一样大，算错了。'}
    ],
    concepts: [
      {title: '1. 为什么能移多补少？', text: '8、12、16的总量是36，共3份。把第三份的4移给第一份，减少的4恰好等于增加的4，总量仍是36，份数仍是3，所以平均数仍是12。超过平均的部分与不足平均的部分总量相等；不是真把每个原数据改成了12。'},
      {title: '2. 多出的差，不全是要移动的量', text: '8与16相差8。移动1给少的一边，多的一边减1、少的一边加1，差会缩小2。因此要平衡这两份只需移动8÷2=4，而非移动8；移动8只会把两份交换。'},
      {title: '3. 加入或拿走，先换总量与份数', text: '6个数平均10，原总量60；加入17后，新总量77、份数7，平均77÷7=11。不能算(10+17)÷2，因为10代表原来的6份。反过来，4个数平均12，拿走21后，总量48−21=27、份数3，平均9；不是12−21。'},
      {title: '4. 平均数不等于“排在中间的数”', text: '2、4、12的平均数是(2+4+12)÷3=6，不是中间的4，也不是两端平均7。对有至少一个数据的有限组，平均数介于最小与最大数据之间；若结果跑出这个范围，说明总量或份数有错，但落在范围内也不保证算对。'},
      {title: '5. 平均数可以是小数，也可以是0', text: '1和2的平均数是3÷2=1.5，它不必等于任一原数据。三个0是三个数据，总量0、份数3，平均数0；没有数据时份数是0，不能计算0÷0，不能把“空组”也说成平均0。若物品不能分割，平均量仍可为小数，但不表示实际每人都能分到这么多完整物品。'},
      {title: '6. 不同人数，不能平均“两个平均数”', text: '甲组2人平均8本，乙组6人平均12本，合并平均(2×8+6×12)÷(2+6)=11本。乙组人数更多，对合并总量的影响更大。两组人数相同时，才可直接用两组平均数相加除以2；若两组平均数恰好相同，直接平均也会碰巧正确，不能据此推广。'}
    ],
    practices: [
      {level: '起步 · 保留原自测', question: '5 个数的总和是 65，平均数是多少？', answers: ['13'], hint: '总和除以个数。', wrongFeedback: '65是总量，5是份数；应把65均分成5份，不是再乘5。', correctFeedback: '对，平均每份13，13×5=65能回查总量。', explanation: '65÷5=13；份数5大于0，13×5=65。'},
      {level: '理解 · 移动不是交换', question: '三份数量是8、12、16，只从16那份移一些给8那份，使三份同样多。应移动多少？', answers: ['4'], hint: '先求平均数，再看8还缺多少；或看两端差会怎样变。', wrongFeedback: '两端相差8，但移动1会使差缩小2。若移动8，两份只是交换成16和8，仍未平衡。', correctFeedback: '对，移动4后是12、12、12，总量仍是36。', explanation: '(8+12+16)÷3=12；8需增加4，16正好多4。移动4，既补足又不改变总量。'},
      {level: '变化 · 加入一个数', question: '6 个数的平均数是 10，加入一个数 17 后，7 个数的平均数是多少？', answers: ['11'], hint: '原总量不是10，而是6×10；加入后份数变为7。', wrongFeedback: '不能把10和17直接平均：10代表原来的6份。先求60+17，再除以7。', correctFeedback: '对，新总量77、新份数7，平均11。', explanation: '原总量6×10=60，加入17后为77，份数6+1=7；77÷7=11。'},
      {level: '变化 · 拿走一个数', question: '4个数的平均数是12，拿走其中的21后，剩下3个数的平均数是多少？', answers: ['9'], hint: '先用平均数反求原总量，再同时更新总量和个数。', wrongFeedback: '21是拿走的数据，不是从平均数12里直接减。原总量48，剩27；个数也从4变成3。', correctFeedback: '对，27÷3=9；9×3+21=48能回查。', explanation: '原总量12×4=48，拿走21后是48−21=27；剩3个数，平均27÷3=9。'},
      {level: '辨析 · 不是找中间', question: '2、4、12这三个数的平均数是多少？', answers: ['6'], hint: '三个数都要计入总量；不能只取中间数或只平均两端。', wrongFeedback: '4只是排序后的中间数；7只平均了两端。三个数总和18，要除以3。', correctFeedback: '对，平均6；它在2和12之间，但不必等于原来的数。', explanation: '(2+4+12)÷3=18÷3=6；只取4或(2+12)÷2都没有均分完整总量。'},
      {level: '边界 · 不一定是整数', question: '1和2这两个数的平均数是多少？可填小数或分数。', answers: ['1.5', '3/2'], hint: '总量3均分成2份，不能因为原数据是整数就取整。', wrongFeedback: '平均数不要求是原数据之一，也不要求是整数。3÷2要保留准确值，不四舍五入。', correctFeedback: '对，1.5或3/2；乘回2得到总量3。', explanation: '(1+2)÷2=3/2=1.5。它是一个计算出的平均量，不表示不可分物品已实际分成半件。'},
      {level: '迁移 · 不同人数的两组', question: '甲组2人平均每人8本书，乙组6人平均每人12本书。两组不重叠，合并后平均每人多少本？', answers: ['11'], hint: '分别求两组总本数，再除以合并人数。', wrongFeedback: '10来自(8+12)÷2，把2人组与6人组当成同样大。应合并16本与72本，总人数8。', correctFeedback: '对，88÷8=11；不是把两个组平均数直接平均。', explanation: '甲组2×8=16本，乙组6×12=72本；合并总量88本、人数8，平均88÷8=11本。'},
      {level: '边界 · 零数据与没有数据', question: '三个数据都是0，平均数是0；若一个数据也没有，也能说平均数是0吗？（能填1，不能填0）', answers: ['0'], hint: '三个0的份数是3；空组的份数是几？能除以它吗？', wrongFeedback: '总量都写作0，不代表份数相同。三个0可算0÷3；空组却是0÷0，除数为0，不能计算。', correctFeedback: '对，填0。空组没有可定义的算术平均数，不能把它当作平均0。', explanation: '三个0有3份，平均0÷3=0；没有数据时份数0，算术平均数的除法不能进行，因而不能说平均数是0。'}
    ],
    review: [
      {question: '原例算出48，为什么不能说原来的四个数全是12？', answer: '平均只确定总量和均分后的量；例如8、10、14、16也平均12。原数据可以不相等。'},
      {question: '移多补少时什么变了，什么没变？', answer: '各份数量可变；移出多少就移入多少，总量和份数不变，平均数不变。'},
      {question: '新增或拿走数据，先改哪两项？', answer: '先改总量，再改份数。用新总量除以新份数；不能只在旧平均数上加减新增或拿走的数。'},
      {question: '什么时候可直接平均两组平均数？', answer: '两组人数相同时可以；人数不同时通常不行，须先还原总量。若两组平均数本来相同，结果也相同，但不是一般规则。'},
      {question: '平均数的范围检查能证明答案正确吗？', answer: '不能。平均须在最小与最大之间，但在范围内的错误答案仍很多；还要乘回份数查总量。'},
      {question: '0作数据为什么不能忽略？', answer: '0虽然不给总量增加数值，却增加1份；三个0与没有数据的份数不同，后者不能计算平均数。'}
    ]
  };
  window.AOSHU_ELEMENTARY_DEEP_UNITS = Object.assign({}, window.AOSHU_ELEMENTARY_DEEP_UNITS || {}, {'4:average': unit});

  // Extend, rather than change, other lessons' model types or progress behavior.
  const previous = window.AOSHU_FOUNDATION_WIDGETS;
  if (!previous) return;
  const type = 'average-balance';
  const cases = [[8,12,16], [2,4,12], [0,0,0], [1,2], []];
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  window.AOSHU_FOUNDATION_WIDGETS = {
    supports: value => value === type || previous.supports(value),
    markup(config) {
      if (config.type !== type) return previous.markup(config);
      return `<section class="book-model-lab book-foundation-lab book-average-lab" data-book-model="${type}" aria-label="平均数移多补少实验台"><div class="book-model-heading"><b>先预测平均线，再看均分后</b><span>用8、12、16试一试：从16移4给8，哪些量变了，哪些没变？再换到三个0、1和2、空组比较。</span></div><div class="book-foundation-controls"><label>数据组<select data-foundation-model-control data-average-case aria-label="平均实验数据组">${cases.map((values, i) => `<option value="${i}">${esc(values.length ? values.join('、') : '空组：没有数据')}</option>`).join('')}</select></label><label>展示方式<select data-foundation-model-control data-average-view aria-label="平均实验展示方式"><option value="before">原来的数量</option><option value="after">总量不变，假想均分后</option></select></label></div><div class="book-average-chart" data-average-chart role="img"></div><p class="book-model-result" data-book-model-result aria-live="polite"></p><p class="book-model-caption">条长按同一比例表示数值，虚线标记平均数；文字同时标数，不只靠颜色。小数表示平均量，不表示不可分物品已被切开。操作不计入答题进度。</p></section>`;
    },
    update(root) {
      if (root?.dataset.bookModel !== type) return previous.update(root);
      const chosen = Number(root.querySelector('[data-average-case]')?.value ?? 0);
      const values = cases[chosen] || cases[0];
      const after = root.querySelector('[data-average-view]')?.value === 'after';
      const count = values.length;
      const total = values.reduce((sum, value) => sum + value, 0);
      const mean = count ? total / count : null;
      const chart = root.querySelector('[data-average-chart]');
      const result = root.querySelector('[data-book-model-result]');
      root.dataset.averageTotal = String(total);
      root.dataset.averageCount = String(count);
      root.dataset.averageMean = mean === null ? 'undefined' : String(mean);
      if (!count) {
        chart.innerHTML = '<p>空组：没有可画的数据条，也没有平均线。</p>';
        chart.setAttribute('aria-label', '没有数据，份数0，平均数未定义');
        result.textContent = '总量0，但份数也是0，不能计算0÷0。空组没有算术平均数，不等于“三个0的平均数是0”。';
        return true;
      }
      const shown = after ? values.map(() => mean) : values;
      const scale = Math.max(1, ...values);
      const line = mean / scale * 100;
      chart.innerHTML = `<p class="book-average-line-label">平均线：${mean}；每条从0开始，同一比例</p>${shown.map((value, i) => `<div class="book-average-row"><b>第${i+1}份：${value}</b><div class="book-average-track"><span class="book-average-fill" style="width:${value / scale * 100}%"></span><i class="book-average-marker" style="left:${line}%" aria-hidden="true"></i></div><small>${after ? '均分后等于平均数' : value < mean ? `比平均数少${mean-value}` : value > mean ? `比平均数多${value-mean}` : '等于平均数'}</small></div>`).join('')}`;
      chart.setAttribute('aria-label', `${after ? '假想均分后' : '原数据'}：${shown.join('、')}；平均线${mean}；总量${total}、份数${count}`);
      const above = values.reduce((sum, value) => sum + Math.max(0, value - mean), 0);
      result.textContent = `总量${values.join('+')}=${total}，共${count}份，平均${total}÷${count}=${mean}。${after ? `均分后${count}份各${mean}，总量${mean}×${count}=${total}，总量和份数都没变。` : `原来高于平均线的量合计${above}，恰好补足低于平均线的量。`} ${chosen === 0 ? '16比平均12多4，8比平均12少4，只需移4，不是移两端差8。' : chosen === 2 ? '0也算一个数据：三份全为0，所以平均是0，不是没有数据。' : chosen === 3 ? '平均1.5不等于任何一个原数，也不必取整。' : '平均6不是排在中间的4，也不是只平均两端得到的7。'}`;
      return true;
    }
  };
})();
