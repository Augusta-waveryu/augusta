(() => {
  const unit = {
    label:'本轮深讲 · 四年级方程（本站原创）',
    courseTitle:'等量关系与一元方程',
    title:'等号像天平：两边同做，最后代回',
    scope:'本站精选路线，序号不是教材讲次；教材版本、页码及逐讲映射待核。本课新增讲解、图示和练习为本站原创，不是教材或杯赛原题；保留原例题及原自测。学习一个未知数的一步、两步方程，答案限非负整数；不展开含负数的变形或多未知数方程。',
    goal:'说清x代表什么，用等式表示同一种数量；解释两边同做的理由，解简单两步方程，并代回原式检查，识别只改一边和除以0的错误。',
    idea:'先修：会整数四则和平均分。x是一张写着未知数的标签，同一道题里的x始终表示同一个数。等号表示两边数量相等，不是“接下来算答案”。解方程要把x单独留下，同时不改变哪些数能让原式成立。',
    example:{question:'一个数加 7 等于 20，这个数是多少？',steps:['设这个数为x：x+7=20。左右都表示同一个总量。','想把x单独留下，要拿走左边附加的7；为保持相等，右边也减7：x+7−7=20−7。','化简得到x=13。不是把7随意搬家，而是两边同时减去7。','代回原题：13+7=20，左右相等，且13符合本课非负整数范围。']},
    methodCard:{title:'设未知数 → 找等量 → 两边同做 → 代回',formula:'等式两边同时加减同一个数，或同时乘除同一个非零数，解不变',when:'知道两个数量相等，却不知道其中一个数时。先把语言写成算式，再选择能让x单独留下的操作；不要见到数字就随意换边。',steps:['写明x代表的数量与单位','让等号两边表示同一种数量','先撤销外层加减，再撤销乘除；每次两边同做','把求出的数代回原式，检查相等及题意范围'],check:'两边同乘0虽能得到相等的0=0，却丢失原条件，不能据此求x；除以0没有意义。只有非零乘除才能保证前后方程的解不变。'},
    concepts:[
      {title:'1. x是同一个数，等号是相等关系',text:'x+x表示两个同样多的数，可写成2×x，简记2x；它不是两个任意不同的数。12=x+5和x+5=12是同一个关系，两边交换不改变含义。'},
      {title:'2. 为什么两边要同做',text:'像平衡天平两边各拿走相同重量，仍保持平衡。x+7=20两边减7得到x=13；若只减左边，却写成x=20，代回20+7≠20，说明弄坏了原关系。'},
      {title:'3. 两步方程：先拆最外一层',text:'3x+6=24表示三份同样多的x再加6。先两边减6得3x=18，再两边除以3得x=6。检查3×6+6=24。若想先除以3，必须把左边整边都除：x+2=8，而不是x+6=8。'},
      {title:'4. 乘除也能互相撤销',text:'x÷4=5表示x平均分成4份，每份5；两边乘4得x=20。减号顺序要看清：18−x=7时可先两边加x得18=7+x，再两边减7得11=x；不能套成x=7−18。'},
      {title:'5. 文字题先统一数量与单位',text:'3本同价练习本和一支6元的笔共24元。设每本x元，3x+6=24，不是3(x+6)=24；后者把笔的钱也重复算了3次。求得每本6元后检查3×6+6=24元。'},
      {title:'6. 边界：零不能随便乘除',text:'0×x=0对所有数都成立，不能唯一确定x；0×x=5则没有解。把x=3两边乘0只能得到0=0，不能再从0=0还原x=3。因此解方程只用非零数同时乘除；任何数都不能除以0。'}
    ],
    diagrams:[{caption:'同做一步，保留同一个解',text:'x + 7 = 20\n左边减7 ↔ 右边也减7\nx = 13\n代回：13 + 7 = 20'},{caption:'三份与额外的一份别混淆',text:'[ x ][ x ][ x ] + [ 6元 ] = 24元\n先拿走额外6元：三份合计18元\n再平均分3份：每份6元\n不是：[ x+6 ][ x+6 ][ x+6 ]'}],
    model:{type:'equation-balance'},
    practices:[
      {level:'起步 · 保留原自测',question:'x−9=14，x 是多少？',answers:['23'],hint:'为了单独留下x，两边要同时加9。',wrongFeedback:'x原来拿走9后才剩14，所以x比14大9；两边同时加9，不是再减9。',correctFeedback:'对，x=23；代回23−9=14，原式成立。',explanation:'x−9+9=14+9，得到x=23；代回23−9=14。'},
      {level:'理解 · 两边同做',question:'x+7=20，只把左边减7便写成x=20，这个变形正确吗？（正确填1，错误填0）',answers:['0'],hint:'右边有没有同时减去7？试把20代回原式。',wrongFeedback:'只改一边不能保持原来的相等关系。20+7=27，不是20；两边减7应得x=13。',correctFeedback:'对，填0；右边也必须减7，得到x=13。',explanation:'正确变形是x+7−7=20−7，所以x=13；x=20不满足原式。'},
      {level:'进阶 · 两步方程',question:'3x+6=24，x是多少？（3x表示3×x）',answers:['6'],hint:'先两边减6，再两边除以3；最后代回。',wrongFeedback:'24−6=18是3份x的总数，还不是1份x；继续除以3。不能只把3x除以3而留下6不变。',correctFeedback:'对，x=6；3×6+6=24，满足原式。',explanation:'两边减6得3x=18；两边除以3得x=6。代回3×6+6=24。'},
      {level:'迁移 · 未知数作被除数',question:'x÷4=5，x是多少？',answers:['20'],hint:'每份5，共4份，合起来多少？两边同乘4。',wrongFeedback:'5是每份，不是总数。x平均分4份后得5，应该乘回4，不能再除以4。',correctFeedback:'对，x=20；20÷4=5，乘回去恢复总量。',explanation:'两边同时乘4得x=5×4=20；代回20÷4=5。'},
      {level:'辨顺序 · 未知数作减数',question:'18−x=7，x是多少？',answers:['11'],hint:'18拿走x剩7，也就是7加上x等于18。',wrongFeedback:'减法不能交换顺序。18−7=11才是拿走的数量；可用7+11=18回查。',correctFeedback:'对，x=11；代回18−11=7。',explanation:'两边加x得18=7+x，再两边减7得11=x；代回18−11=7。'},
      {level:'建模 · 看清一份是什么',question:'3本同价练习本和一支6元的笔共24元。设每本x元，3x+6=24与3(x+6)=24，哪个符合题意？（前者填1，后者填2）',answers:['1'],hint:'笔只买一支，6元是否应该乘3？',wrongFeedback:'3(x+6)会把笔的6元也算3次；题中是3本本子加1支笔，应为3x+6=24。',correctFeedback:'对，填1；三份本子钱加一份笔钱，是3x+6。',explanation:'3本本子共3x元，笔6元，所以3x+6=24；解得每本6元，回查18+6=24元。'},
      {level:'边界 · 乘0丢条件',question:'把x=3两边乘0得到0=0后，能由0=0唯一确定x=3吗？（能填1，不能填0）',answers:['0'],hint:'x取4或5时，0×x是否也等于0？',wrongFeedback:'0=0没有保留x的信息。x取3、4、5都使0×x=0，不能唯一确定x；也不能通过除以0恢复。',correctFeedback:'对，填0；乘0后丢失了唯一确定x的条件。',explanation:'对任何x，0×x都等于0；0=0不能区分x=3和其他数。为保持解不变，同时乘除的数必须非零。'},
      {level:'挑战 · 先解再回查',question:'2x+5=19，x是多少？',answers:['7'],hint:'先撤销加5，再把两份平均分；把结果放回原式。',wrongFeedback:'19−5=14是两份x的总数；要再除以2。别把14直接当成x，也别只对左边做操作。',correctFeedback:'对，x=7；2×7+5=19，原式成立。',explanation:'两边减5得2x=14；两边除以2得x=7。代回2×7+5=19。'}
    ],
    review:[{question:'为什么不能只改等式一边？',answer:'只改一边可能改变原来的相等关系。要两边同做，再代回原式检查。'},{question:'3x+6=24先除以3可以吗？',answer:'可以，但必须整边都除，得到x+2=8。初学时先减6，再除3更直观。'},{question:'等式两边同乘0为什么不适合求解？',answer:'它把含有x的条件压成0=0，丢失信息，无法逆向恢复；除以0则没有意义。'}]
  };
  window.AOSHU_ELEMENTARY_DEEP_UNITS=Object.assign({},window.AOSHU_ELEMENTARY_DEEP_UNITS||{},{'4:equations':unit});
  const previous=window.AOSHU_FOUNDATION_WIDGETS;
  if(!previous)return;
  const cases={
    add:{name:'一步：x+7=20',steps:[['x+7','20','先想：怎样只留下x？'],['x','13','两边同时减7：x+7−7=20−7。'],['13+7','20','代回原式：13+7=20，原关系成立。']]},
    two:{name:'两步：3x+6=24',steps:[['3x+6','24','先撤销外层的加6，再把三份分开。'],['3x','18','两边同时减6，留下三份x。'],['x','6','两边同时除以非零数3，留下一份x；代回3×6+6=24。']]},
    divide:{name:'乘回去：x÷4=5',steps:[['x÷4','5','每份是5，一共4份；想怎样恢复总量。'],['x','20','两边同时乘非零数4，得到x=20。'],['20÷4','5','代回原式：20÷4=5，原关系成立。']]},
    wrong:{name:'反例：只减左边7',steps:[['x+7','20','原式的解是13。先看只改一边会怎样。'],['x','20','错误操作：只把左边减7，右边没变。新式与原式不等价。'],['20+7','20','把错误的x=20代回：27≠20。天平倾斜，说明不满足原式。']]}
  };
  window.AOSHU_FOUNDATION_WIDGETS={
    supports:type=>type==='equation-balance'||previous.supports(type),
    markup(config){if(config.type!=='equation-balance')return previous.markup(config);return `<section class="book-model-lab book-foundation-lab book-equation-lab" data-book-model="equation-balance" aria-label="等式同做实验台"><div class="book-model-heading"><b>先预测下一步，再选阶段核对</b><span>这是等量关系示意，不是按实物重量绘制的秤。实验不记答题进度。</span></div><div class="book-foundation-controls"><label>选方程<select data-foundation-model-control data-equation-case aria-label="方程实验案例">${Object.entries(cases).map(([key,c])=>`<option value="${key}">${c.name}</option>`).join('')}</select></label><label>看阶段<select data-foundation-model-control data-equation-stage aria-label="方程变形阶段"><option value="0">1. 原关系</option><option value="1">2. 第一步操作</option><option value="2">3. 继续或代回检查</option></select></label></div><div data-equation-plot></div><p class="book-model-result" data-book-model-result aria-live="polite"></p><p class="book-model-caption">换案例时可自行回到“原关系”再预测。反例前两幅只比较符号变形，最后一幅才代入错误答案检查数值。</p></section>`;},
    update(root){if(root?.dataset.bookModel!=='equation-balance')return previous.update(root);const key=root.querySelector('[data-equation-case]')?.value,c=cases[key]||cases.add;const raw=Number(root.querySelector('[data-equation-stage]')?.value),stage=Number.isInteger(raw)&&raw>=0&&raw<=2?raw:0;const [left,right,note]=c.steps[stage],failed=key==='wrong'&&stage===2;root.dataset.equationValid=String(!(key==='wrong'&&stage>0));root.querySelector('[data-equation-plot]').innerHTML=`<svg viewBox="0 0 320 150" role="img" aria-label="左边${left}，右边${right}，${failed?'不相等':'关系示意'}"><g fill="none" stroke="${failed?'#a14f30':'#477b66'}" stroke-width="3"><path d="M160 25V130M130 135H190M40 ${failed?55:40}L280 40M60 ${failed?57:40}V85M260 40V85"/><path d="M12 85Q60 145 108 85ZM212 85Q260 145 308 85Z" fill="#e9f0df"/></g><g text-anchor="middle" fill="#263d31" font-size="18"><text x="60" y="78">${left}</text><text x="260" y="78">${right}</text><text x="160" y="75">${failed?'≠':key==='wrong'&&stage===1?'?':'='}</text></g></svg>`;root.querySelector('[data-book-model-result]').textContent=`${key==='wrong'&&stage===1?'错误变形（与原式不等价）：':''}${left}${failed?'≠':'='}${right}。${note}`;return true;}
  };
})();
