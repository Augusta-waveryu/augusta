(() => {
  const unit = {
    label: '本轮深讲 · 四年级运算顺序与凑整（本站原创）',
    courseTitle: '运算顺序与凑整',
    title: '先看结构，再选顺序：把计算变短而不变题',
    scope: '本课讲解、图示、互动和新增练习均为本站原创；保留路线原例与原自测题意、答案。教材版本、页码与逐讲映射待核，不冒称教材原题。讨论整数四则运算：括号优先，乘除同级、加减同级均左至右。',
    roadmapTitle: '运算顺序与凑整',
    roadmapGroup: '计算、分数与比例',
    goal: '先观察括号和运算符，再按规则决定顺序；只在同一层可交换时凑整，并用原式回查。',
    idea: '括号像“先完成的小房间”；没有括号时先乘除后加减，同级从左到右。乘法因数可以交换、结合来找25×4或125×8；加法加数也能配对。减法、除法不能随意换位，分配律拆开后要对每一项负责。',
    example: {
      question: '计算 25×17×4。',
      steps: [
        '先观察：全是乘法，没有括号；乘法同级，因数可以交换和结合，所以可以寻找25×4。',
        '重排而不改值：25×17×4 = 25×4×17。这里只调换乘法因数；若有加减夹在中间，不能这样跨过去。',
        '先凑整：25×4=100，原式变成100×17=1700。',
        '回查原顺序：25×17=425，425×4=1700；两条路线一致。'
      ]
    },
    methodCard: {
      title: '看结构 → 定规则 → 找可换位置 → 凑整 → 回查',
      formula: '括号优先；乘除同级、加减同级左至右',
      when: '先找括号，再看乘除与加减的层级；只有同一运算层且满足交换/结合律时才重排。',
      steps: ['圈括号并先算', '在剩余式中先做乘除、后做加减', '同级从左到右', '全乘法找25×4、125×8；全加法找整十整百', '把结果代回或按原顺序核验'],
      check: '减法与除法通常不能交换；除数不能为0；分配律拆开后每一项都要乘，不能漏项。'
    },
    diagrams: [
      {caption: '文字流程：先观察，再选路径', text: `观察括号？  →  有：先算括号
       ↓ 无
看乘除/加减层级 → 乘除先；同级左→右
       ↓
找可凑整组合 → 仅同级可换的因数/加数
       ↓
计算 → 回到原式检查，尤其看 −、÷ 与 0`},
      {caption: '凑整条块图：只把同一层的因数靠近', text: `25  ×  17  ×  4
│       │       │
└───────┴───────┘  可换因数位置
25 × 4 = 100  →  100 × 17 = 1700
不是在含加减的混合式中任意跨层移项。`}
    ],
    concepts: [
      {title: '1. 括号是第一观察点', text: '48÷(6−2)=48÷4=12；若忽略括号先做48÷6再减2，会得到6，已经改变题意。括号里的结果先完成，再把它放回外层。'},
      {title: '2. 同级为什么左至右？', text: '72÷6×2按左至右是(72÷6)×2=24；不能写成72÷(6×2)=6。乘除都“优先于”加减，但乘除彼此同级，不能凭感觉把后面的乘法先抱成分母。'},
      {title: '3. 哪些凑整合法安全？', text: '全是乘法时，25×17×4可换成25×4×17；全是加法时，48+199+52可把48和52配成100。交换与结合只适用于对应的加法或乘法。'},
      {title: '4. 减法、除法反例', text: '20−7−3=(20−7)−3=10，不等于20−(7−3)=16；48÷6÷2=(48÷6)÷2=4，不等于48÷(6÷2)=16。减法和除法通常不满足交换、结合，不能像加法乘法那样随意重排。'},
      {title: '5. 分配律要逐项', text: '25×(20−3)=25×20−25×3=500−75=425。括号中每一项都乘25；只算25×20−3会漏乘，得到497，是错的。'},
      {title: '6. 两个安全边界', text: '除数不能为0：36÷(3−3)没有意义，不是“等于0”。还要先观察是否能整除、结果是否合理；凑整是缩短路线，不是改变运算层级。'}
    ],
    model: {type: 'order-operations-path'},
    practices: [
      {level: '起步 · 保留原自测', question: '计算 125×8×7。', answers: ['7000'], hint: '先看全是乘法；先算125×8。', wrongFeedback: '125×8=1000，还要乘7；不要把125×(8×7)当成更方便的路线。', correctFeedback: '对，125×8=1000，1000×7=7000。', explanation: '全是乘法，可以先凑125×8=1000，再算1000×7=7000；原顺序125×8×7也得到7000。'},
      {level: '括号', question: '计算 48÷(6−2)。', answers: ['12'], hint: '先把括号内6−2算成一个数，再用48除以这个数。', wrongFeedback: '先算48÷6会跳过括号；6−2=4，应该是48÷4。', correctFeedback: '对，先6−2=4，再48÷4=12。', explanation: '括号优先：48÷(6−2)=48÷4=12。'},
      {level: '同级左至右', question: '计算 72÷6×2。', answers: ['24'], hint: '乘除同级，按从左到右计算。', wrongFeedback: '不能把6×2先合成12放在除数里；应先72÷6。', correctFeedback: '对，(72÷6)×2=12×2=24。', explanation: '乘除同级左至右：72÷6=12，12×2=24。'},
      {level: '加减同级', question: '计算 50−18+8。', answers: ['40'], hint: '加减同级，从左到右；先算50−18，再把8加回来。', wrongFeedback: '不能先算18+8再从50减；原式先做50−18。', correctFeedback: '对，(50−18)+8=32+8=40。', explanation: '先算50−18=32，再加8得40。若先把18与8相加再用50去减，会得到24，改变了原式中加8的含义。'},
      {level: '辨析', question: '判断：20−7−3 可以改写成 20−(7−3)。能改写填1，不能填0。', answers: ['0'], hint: '分别算两边，看结果是否相同。', wrongFeedback: '20−7−3=10，而20−(7−3)=16；减法不能任意结合。', correctFeedback: '对，填0，不能这样改写。', explanation: '减法不满足结合律，必须按(20−7)−3计算。'},
      {level: '分配律', question: '计算 25×(20−3)。', answers: ['425'], hint: '括号内两项都要乘25。', wrongFeedback: '25×20−3漏乘了第二项；应写成25×20−25×3。', correctFeedback: '对，500−75=425。', explanation: '25×(20−3)=25×20−25×3=500−75=425。'},
      {level: '除数边界', question: '36÷(3−3) 有意义吗？有意义填1，没有意义填0。', answers: ['0'], hint: '先算括号，再看除数是不是0。', wrongFeedback: '3−3=0，除数为0时除法没有意义，不能写成0。', correctFeedback: '对，填0；除数为0没有意义。', explanation: '括号结果为0，36÷0不定义，所以题式没有意义。'},
      {level: '迁移 · 先观察', question: '计算 48+199+52，用简便方法求结果。', answers: ['299'], hint: '全是加法，把48和52配成100。', wrongFeedback: '48+52=100后还要加199；100+199=299。', correctFeedback: '对，(48+52)+199=100+199=299。', explanation: '加法加数可交换结合：48+199+52=48+52+199=100+199=299。'},
      {level: '综合 · 先乘后加', question: '计算 25+3×4。', answers: ['37'], hint: '先找乘法这一组；25与4之间隔着加号，不能把它们凑成100。', wrongFeedback: '25×4=100不是原式中的一组；先算25+3再乘4也改变了顺序。应先算3×4。', correctFeedback: '对，先3×4=12，再25+12=37。', explanation: '乘法优先于加法：25+3×4=25+12=37。这里25是加数而不是乘法因数，不能与4跨过加号凑整。'}
    ],
    review: [
      {question: '遇到混合运算，第一眼看什么？', answer: '先看有没有括号；有就先算括号，再按乘除优先、加减随后，同级从左到右。'},
      {question: '为什么25×17×4能先算25×4？', answer: '全是乘法，交换和结合因数不改变积；把25和4靠近能凑成100。'},
      {question: '减法和除法为什么不能照搬凑整？', answer: '它们通常不满足交换、结合律；20−7−3与20−(7−3)、48÷6÷2与48÷(6÷2)结果不同。'},
      {question: '分配律和除数边界各要检查什么？', answer: '分配律要让括号内每一项都乘；除法要确认除数不为0。'},
      {question: '算完如何回查？', answer: '把重排还原或按原顺序再算一遍；同时检查括号、运算层级、符号和结果是否合理。'}
    ]
  };
  window.AOSHU_ELEMENTARY_DEEP_UNITS = Object.assign({}, window.AOSHU_ELEMENTARY_DEEP_UNITS || {}, {'4:order-operations': unit});

  const previous = window.AOSHU_FOUNDATION_WIDGETS;
  const type = 'order-operations-path';
  const cases = [
    {expression:'25×17×4', answer:'1700', path:'先找同级因数25×4', detail:'25×4=100 → 100×17=1700'},
    {expression:'125×8×7', answer:'7000', path:'先找同级因数125×8', detail:'125×8=1000 → 1000×7=7000'},
    {expression:'48÷(6−2)', answer:'12', path:'括号优先', detail:'6−2=4 → 48÷4=12'},
    {expression:'72÷6×2', answer:'24', path:'乘除同级左至右', detail:'72÷6=12 → 12×2=24'},
    {expression:'25×(20−3)', answer:'425', path:'分配律逐项', detail:'25×20−25×3=500−75=425'}
  ];
  window.AOSHU_FOUNDATION_WIDGETS = {
    supports: value => value === type || (previous?.supports ? previous.supports(value) : false),
    markup(config) {
      if (config.type !== type) return previous?.markup ? previous.markup(config) : '';
      return `<section class="book-model-lab book-order-lab" data-book-model="${type}" aria-label="运算顺序文字流程实验台"><div class="book-model-heading"><b>先观察，再选路径</b><span>切换算式，预测应先做什么；答案不会替你计入练习。</span></div><div class="book-model-controls"><label>算式<select data-foundation-model-control data-order-case aria-label="选择算式">${cases.map((item,index) => `<option value="${index}">${item.expression}</option>`).join('')}</select></label><label>观察角度<select data-foundation-model-control data-order-view aria-label="选择观察角度"><option value="rule">规则流程</option><option value="counter">边界提醒</option></select></label></div><div class="book-order-flow" data-order-flow role="img"></div><p class="book-model-result" data-book-model-result aria-live="polite"></p><p class="book-model-caption">条块从“观察”走到“回查”；若看到 − 或 ÷，先停下来确认不能随意交换。</p></section>`;
    },
    update(root) {
      if (root?.dataset.bookModel !== type) return previous?.update ? previous.update(root) : false;
      const item = cases[Number(root.querySelector('[data-order-case]')?.value || 0)] || cases[0];
      const view = root.querySelector('[data-order-view]')?.value || 'rule';
      const flow = root.querySelector('[data-order-flow]');
      const result = root.querySelector('[data-book-model-result]');
      const boundary = /−|÷/.test(item.expression) ? '看到减法或除法：不能凭感觉换位；先按规则，确认除数不为0。' : '全是加法或乘法时，才可在同级内交换、结合来凑整。';
      const labels = view === 'counter' ? ['看符号边界', '不跨运算层', '检查特殊条件'] : ['观察结构', item.path, '计算：' + item.detail, '回查原式'];
      if (flow) flow.innerHTML = labels.map((label,index) => `<span class="book-order-block ${index === 1 ? 'is-focus' : ''}"><b>${index + 1}</b>${label}</span><i aria-hidden="true">→</i>`).join('').replace(/<i aria-hidden="true">→<\/i>$/,'');
      if (flow) flow.setAttribute('aria-label', labels.join('，然后'));
      if (result) result.textContent = view === 'counter' ? boundary : `${item.expression}：${item.path}；${item.detail}。结果 ${item.answer}。`;
      return true;
    }
  };
})();
