(() => {
  const unit = {
    label: '本轮深讲 · 四年级和差问题',
    courseTitle: '和差问题',
    title: '先让两段一样长：和与差为什么要除以2',
    scope: '本站精选路线，序号不是教材讲次；教材版本、页码与逐讲映射待核。本课讲解、图示、互动和新增练习均为本站原创，保留原例题与原自测语义，不是教材或杯赛原题。本课讨论同类、同单位的两个非负数量；差指较大数减较小数，可以为0。',
    goal: '读懂和、差各表示什么；用补齐或去掉多出的一段解释公式，求出两数并同时回查和与差；能区分可分长度与不可分物品的整数限制。',
    idea: '先修：会加减、平均分和简单小数。和是两份合起来的量，差是大份比小份多的量。去掉大份多出的那段，剩下两份都等于小份；给小份补同样一段，两份就都等于大份。这里的“较大、较小”是比较角色，差为0时两份相等。',
    example: {
      question: '两数和 36、差 8，较大的数是多少？',
      steps: [
        '先画同起点的两段：小段一份，大段由“同样一份+多出的8”组成；两段原来合计36。差8不是每份都要拿走8。',
        '补齐法：只给小段补8，小段就和大段一样长。新的合计36+8=44，是两份大段，所以大数44÷2=22。不是把原来的和直接平分。',
        '再求小数：22−8=14。也可从原合计中去掉大段多出的8，得36−8=28，这是两份小段，28÷2=14。',
        '同时回查：22+14=36，22−14=8，两项都符合。原题问较大数，答22；不能只答和的一半18，也不能把36−8=28当成小数。'
      ]
    },
    methodCard: {
      title: '认和差 → 画两段 → 补齐或去差 → 平分 → 双回查',
      formula: '大数=(和+差)÷2；小数=(和−差)÷2',
      when: '同类数量已知合计与相差多少，求其中一份时用。先统一单位；“多几”是差，“是几倍”不是差，不能直接套这张卡。',
      steps: ['标出和S、差D，D为大减小', '想小份就从和中去差，想大份就给和加差', '这时有两份一样的量，必须除以2', '补求另一份，并分别检查加起来与相减', '若是人数、枚数等不可分数量，还要检查是否为非负整数'],
      check: '非负数量要求和不小于差。若和与差是整数，要得到整数两份，它们须同奇偶；不能把半枚圆片四舍五入成整数。'
    },
    model: {type: 'sum-difference-bars'},
    diagrams: [
      {caption: '同起点的两段：去差后，合计变为两份小量', text: '大段：[ 同样的一份14 ][ 多8 ] =22\n小段：[ 同样的一份14 ]       =14\n原和36；只去掉上面多出的8 → 两份14合计28\n(36−8)÷2=14；14+8=22'},
      {caption: '反过来补齐：原和只增加一次差', text: '原来大22、小14，和36、差8\n给小段补8 → 变成22与22，合计44\n(36+8)÷2=22\n加差与减差是在造两份相等的量，不是随便换符号。'}
    ],
    concepts: [
      {title: '1. 为什么不能直接把和除以2？', text: '36÷2=18得到的是两份的平均量，不是原来的大数或小数。只有差为0、两份本来相等时，两份才都等于和的一半。差8表示两段的差距，不是每段都比平均多8或少8。'},
      {title: '2. 为什么只加一次差，或只减一次差？', text: '去差只从大段去掉多出的那一段，小段不变；补齐只给小段补一段，大段不变。因此合计只变化一个差。若两段都各减8，就没有消除原来的差。'},
      {title: '3. 从文字找“和”与“差”', text: '两根绳共30米，长绳比短绳多6米，和是30米，差是6米。先算短绳(30−6)÷2=12米，再算长绳18米。若一根以厘米计，先换成相同单位。“长绳是短绳3倍”给的是倍数，不是差3米。'},
      {title: '4. 差为0，公式仍然适用', text: '总长25米、两根同长，差是0，每根25÷2=12.5米。可分长度可以有小数；差0不是没有条件，而是明确两份相等。两份都为0时，和0、差0，也符合非负数量条件。'},
      {title: '5. 条件可能无法实现', text: '两个非负数量的和不可能小于它们的差。例如和6差8会算出小数(6−8)÷2=−1，本课非负数量不允许。若要把15枚完整圆片分成两组、相差4枚，公式给9.5和5.5；圆片不可分，所以没有整数方案，不可四舍五入。整数和与差同为奇数或同为偶数时，除以2才都得整数。'},
      {title: '6. 两个条件都要回查', text: '和20、差6，有人答12和8：12+8=20满足和，但12−8=4不满足差。正确是13和7，13+7=20且13−7=6。只检验一个条件不能证明答案正确，还要检查数值是否符合实际数量限制。'}
    ],
    practices: [
      {level: '起步 · 保留原自测', question: '两数和 46、差 10，较小数是多少？', answers: ['18'], hint: '去掉大份多出的10，剩下的是两份小量。', wrongFeedback: '46−10=36是两份小量的合计，还要除以2；(46+10)÷2=28则是大数，不是所问的小数。', correctFeedback: '对，小数18，大数28；18+28=46，28−18=10。', explanation: '小数(46−10)÷2=18，大数18+10=28；和46与差10都吻合。'},
      {level: '理解 · 同题换问', question: '两数和36、差8，较小数是多少？', answers: ['14'], hint: '原例的大数是22；也可以独立用去差法。', wrongFeedback: '22是原例求出的大数；18只是和的一半。小数应是(36−8)÷2。', correctFeedback: '对，小数14；22和14的和36、差8。', explanation: '36−8=28，这是两份相同的小量；28÷2=14。再加差8得大数22。'},
      {level: '应用 · 读懂单位与差', question: '两根绳总长30米，长绳比短绳长6米。长绳长多少米？', answers: ['18'], hint: '共30是和，多6是差；题目问大份。', wrongFeedback: '30−6后除以2得到短绳12米，不是长绳。求长绳可先补齐：(30+6)÷2。', correctFeedback: '对，长18米、短12米；合计30米，相差6米。', explanation: '给短绳补6米，变成两根长绳的长度，合计36米；36÷2=18米。短绳18−6=12米，回查成立。'},
      {level: '边界 · 两份相等', question: '两根可分割的绳总长25米，长度差0米。每根长多少米？可填小数或分数。', answers: ['12.5', '25/2'], hint: '差0表示两份相等；长度不必是整数。', wrongFeedback: '不能把12.5米取整为12或13米；两根同长且合计25米，要准确均分。', correctFeedback: '对，每根12.5米；和25米、差0米。', explanation: '(25−0)÷2=25/2=12.5米。12.5+12.5=25，12.5−12.5=0。'},
      {level: '辨析 · 不可分物品', question: '15枚完整圆片全部分成两组，要求相差4枚；圆片不能拆分。能做到吗？（能填1，不能填0）', answers: ['0'], hint: '先算两组各多少，再检查是否为整数。', wrongFeedback: '公式算出9.5与5.5，但半枚不符合完整圆片条件。四舍五入会破坏和或差。', correctFeedback: '对，不能。和15是奇数、差4是偶数，没有整数两组。', explanation: '大组(15+4)÷2=9.5，小组(15−4)÷2=5.5，均非整数。9与6差3，10与5差5，也不能用取整凑出差4。'},
      {level: '边界 · 非负条件', question: '两个非负数量的和是6、差是8，能同时成立吗？（能填1，不能填0）', answers: ['0'], hint: '先算小数，再看是否符合非负条件。', wrongFeedback: '虽然形式上可算出7和−1，但−1不是非负数量，不能当作本题的解。', correctFeedback: '对，不能。非负两数的和必须不小于差。', explanation: '小数(6−8)÷2=−1，不符合非负限制。对大数a、小数b，和减差=(a+b)−(a−b)=2b，非负时它不可能为负。'},
      {level: '核对 · 一个条件不够', question: '两数和20、差6。有人答12和8；这组数同时满足和与差吗？（满足填1，不满足填0）', answers: ['0'], hint: '分别做一次加法、一次减法，不能只检查和。', wrongFeedback: '12+8=20虽对，但12−8=4不是6。和正确不代表差也正确。', correctFeedback: '对，不满足；应是13和7，和20、差6才都对。', explanation: '12与8只满足和20，差为4；正确大数(20+6)÷2=13，小数(20−6)÷2=7。13+7=20且13−7=6。'},
      {level: '迁移 · 奇数和与奇数差', question: '两组完整积木合计27块，大组比小组多5块。小组有多少块？', answers: ['11'], hint: '和与差都是奇数，去差后可以均分成两份整数。', wrongFeedback: '27−5=22是两份小组的总量，不能忘记除以2；求小组不是(27+5)÷2。', correctFeedback: '对，小组11块、大组16块；和27，差5。', explanation: '(27−5)÷2=22÷2=11块；大组11+5=16块。11+16=27，16−11=5，都是完整块数。'}
    ],
    review: [
      {question: '和减差后，为什么还要除以2？', answer: '去掉大段多出的部分后，剩下的是两份相同的小段合计，不是一份，所以要平均分成2份。'},
      {question: '求大数为什么给和加差？', answer: '只把小段补成长段，需要增加一次差；新合计相当于两份大段，再除以2。'},
      {question: '差为0与和小于差，分别怎样处理？', answer: '差0时两份相等，各为和的一半；和小于差会得到负的小数，不符合本课非负数量限制。'},
      {question: '15枚完整圆片为什么不能分成差4的两组？', answer: '公式给9.5和5.5，不是整数；和与差奇偶不同。长度可有半米，完整圆片却不可有半枚，须看实际条件。'},
      {question: '算完后必须做哪两项检查？', answer: '两份相加等于原和，大份减小份等于原差；另检查单位与非负、整数等实际条件。'}
    ]
  };
  window.AOSHU_ELEMENTARY_DEEP_UNITS = Object.assign({}, window.AOSHU_ELEMENTARY_DEEP_UNITS || {}, {'4:sum-difference': unit});
  const previous = window.AOSHU_FOUNDATION_WIDGETS;
  if (!previous) return;
  const type = 'sum-difference-bars';
  const cases = [
    {sum:36,diff:8,label:'和36、差8'}, {sum:46,diff:10,label:'和46、差10'},
    {sum:30,diff:6,label:'绳长和30米、差6米'}, {sum:25,diff:0,label:'绳长和25米、差0米'},
    {sum:15,diff:4,label:'15枚完整圆片、差4枚',discrete:true}, {sum:6,diff:8,label:'非负数量和6、差8'}
  ];
  window.AOSHU_FOUNDATION_WIDGETS = {
    supports: value => value === type || previous.supports(value),
    markup(config) {
      if (config.type !== type) return previous.markup(config);
      return `<section class="book-model-lab book-foundation-lab book-sumdiff-lab" data-book-model="${type}" aria-label="和差线段图实验台"><div class="book-model-heading"><b>先预测：这时合计表示几份谁？</b><span>从原来的两段切换到去差、补齐；看哪一段改变，合计为什么只改变一次差。</span></div><div class="book-foundation-controls"><label>题目条件<select data-foundation-model-control data-sumdiff-case aria-label="和差实验条件">${cases.map((c,i)=>`<option value="${i}">${c.label}</option>`).join('')}</select></label><label>操作<select data-foundation-model-control data-sumdiff-view aria-label="和差实验操作"><option value="original">原来的两段</option><option value="remove">只从大段去掉差</option><option value="add">只给小段补上差</option></select></label></div><div data-sumdiff-chart class="book-sumdiff-chart" role="img"></div><p class="book-model-result" data-book-model-result aria-live="polite"></p><p class="book-model-caption">同一题各状态都用同一比例、同一起点；实心段为原有，斜纹段为多出或补上的差，数值和文字同时说明。操作不计入答题进度。</p></section>`;
    },
    update(root) {
      if (root?.dataset.bookModel !== type) return previous.update(root);
      const c = cases[Number(root.querySelector('[data-sumdiff-case]')?.value ?? 0)] || cases[0];
      const mode = root.querySelector('[data-sumdiff-view]')?.value || 'original';
      const small = (c.sum-c.diff)/2, large = (c.sum+c.diff)/2;
      const chart = root.querySelector('[data-sumdiff-chart]'), result = root.querySelector('[data-book-model-result]');
      root.dataset.sumdiffSmall = String(small); root.dataset.sumdiffLarge = String(large);
      if (small < 0 || (c.discrete && !Number.isInteger(small))) {
        const reason = small < 0 ? `小数(${c.sum}−${c.diff})÷2=${small}，不符合非负条件。` : `两组会是${large}枚与${small}枚，不是整数，完整圆片不能拆分。`;
        chart.innerHTML = '<p>条件不成立：不画成可实现的两段。</p>';
        chart.setAttribute('aria-label', reason);
        result.textContent = reason + '公式只是检查工具，不能忽略题目的实际限制；换一种操作也不能使原条件成立。';
        root.dataset.sumdiffValid = 'false'; return true;
      }
      root.dataset.sumdiffValid = 'true';
      const first = mode === 'remove' ? small : large, second = mode === 'add' ? large : small;
      const scale = Math.max(large,1);
      const bar = (name,value,extra) => `<div class="book-sumdiff-row"><b>${name}：${value}</b><div class="book-sumdiff-track"><span class="book-sumdiff-base" style="width:${small/scale*100}%"></span>${extra ? `<span class="book-sumdiff-extra" style="width:${c.diff/scale*100}%" aria-hidden="true"></span>` : ''}</div></div>`;
      chart.innerHTML = bar('原大段所在行',first,mode!=='remove') + bar('原小段所在行',second,mode==='add');
      chart.setAttribute('aria-label', `上段${first}，下段${second}；合计${first+second}；原和${c.sum}、差${c.diff}`);
      result.textContent = mode === 'remove' ? `只从大段去掉${c.diff}，合计${c.sum}−${c.diff}=${2*small}，变成两份小量；${2*small}÷2=${small}。原小数${small}、大数${large}。` : mode === 'add' ? `只给小段补${c.diff}，合计${c.sum}+${c.diff}=${2*large}，变成两份大量；${2*large}÷2=${large}。原小数${small}、大数${large}。` : `大段${large}=小段${small}+多出的${c.diff}。原和${large}+${small}=${c.sum}，差${large}−${small}=${c.diff}。预测去差或补齐后，合计会变成多少？`;
      if (c.diff===0) result.textContent += ' 差0，两段本来就一样长，补或去0都不改变合计；可分长度允许12.5米。';
      return true;
    }
  };
})();
