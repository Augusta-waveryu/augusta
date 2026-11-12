(() => {
  const old = window.AOSHU_ELEMENTARY_DEEP_UNITS?.['4:differences'];
  if (!old) return;
  const feedback = [
    ['先找下一差，不是把最后一个差6再用一次：下一差是7，20+7=27。','对，27；先让差从6变7，再让原数从20变27。'],
    ['差是2、4、6、8，下一差是10；不是把21直接加2。21+10=31。','对，31；差每次加2，原数这一回要加10。'],
    ['每次增加4，最后一项17再加4，得到21；不要多走一步。','对，21；21−17=4，仍符合题目给出的规则。'],
    ['递减也有相邻差：后一项减前一项是−3，所以7−3=4。','对，4；4−7=−3，与前面的每一步一致。']
  ];
  const unit = {
    ...old,
    label:'本轮深讲 · 四年级相邻差（本站原创）',
    title:'给每一步贴上变化标签：先求差，再按规则走',
    scope:'本站原创讲解、互动与新增练习；保留原例题及前4题的题目、答案与顺序。本站路线序号不是教材讲次；教材版本、页码及逐讲对应待核。先学固定差与明确给出的递增差，不展开高阶差分。有限项不能保证延续唯一。',
    goal:'会按“后一项减前一项”标出变化，区分固定差与变化的差；按明确规则求下一项或指定项，并检查步数与每个已知间隔。',
    idea:'先修：会按顺序做整数加减。把相邻两项想成两站：项是站点，差是从前一站到后一站的变化。增加记正，减少记负，不变记0；−3就是减少3。不要用较大数减较小数代替“后一项减前一项”。',
    example:{question:old.example.question,steps:[
      '把4、7、10、13按顺序排好；4到7是第一步，不把起点4也算成一步。',
      '逐个用后一项减前一项：7−4=3，10−7=3，13−10=3。4项之间只有3个间隔。',
      '这些已知差都为3，且题目明确要求继续每次增加3，所以从13再走一步：13+3=16。',
      '回查：16−13=3。16是第5项，不是再加一次得到的第6项19；只看前4项而没有延续规则，不能保证下一项唯一。'
    ]},
    methodCard:{title:'排顺序 → 标每步 → 读规则 → 走一步 → 回查',formula:'相邻差 = 后一项 − 前一项',when:'按顺序排列的数量变化；题目明确给出固定增减或差的变化规则时可预测。固定差可用于等距站点、每天同量增减；倍增、交替等不能硬套固定差。',steps:['逐一计算全部已知相邻差','确认是固定差，还是题目说明差怎样变','先确定下一差，再加到最后一项','指定第几项时，先数从起点走几步'],check:'固定差时，第n项=第1项+(n−1)×固定差；只适用于差固定。若差变化，必须逐步求差并累加，不能只乘最后一个差。'},
    concepts:[
      {title:'1. 为什么看相邻差',text:'原数有时看不清变化，把每一步的增加或减少单独写出，就能逐一核对。4、7、10、13的差都是3；每一对都要查，不能只看第一对。'},
      {title:'2. 差可以是0或负数',text:'6、6、6每一步不变，差是0；19、16、13的差是−3。负号表示向小的方向变，不能把它丢掉。负差不是“算错了”，也不要求各项本身都是负数。'},
      {title:'3. 项是站点，差是路段',text:'从第1项到第5项只走4步：5个站点之间有4段。按每次增加3，从4走到第5项为4+4×3=16。第1项还没走，走0步。'},
      {title:'4. 差也会长大：先更新差，再更新数',text:'按题目明确给出的“差从3起每次加1”，2、5、9、14、20的差是3、4、5、6。下一差为7，下一项才是20+7=27。不是20+1，也不是20+6。'},
      {title:'5. 一个不相同的间隔就能推翻固定差',text:'4、7、10、14的差为3、3、4，不能说每次加3。前两步相同不能代替全部检查；若题目没给其他规则，先报告它不是固定差，不要擅自改成13。'},
      {title:'6. 有限项只能支持猜想，规则决定延续',text:'只给4、7、10、13：规则甲“以后一直加3”得16；规则乙“先加3三次，以后一直加4”得17。两条规则都符合已知4项，所以没有给规则时不能断言16唯一。'}
    ],
    diagrams:[{caption:'第二个示范：差变大时分两层走',text:'原数：2 → 5 → 9 → 14 → 20 → 27\n每步：  +3  +4  +5   +6   +7\n题目规定：每一步的增加量都比上一步多1。\n先算6+1=7（下一差），再算20+7=27（下一项）。'}],
    model:{type:'adjacent-differences'},
    practices:[
      ...old.practices.map((p,i)=>({...p,level:['保留原题 · 差逐步加1','保留原题 · 差逐步加2','保留原题 · 固定增加','保留原题 · 固定减少'][i],hint:[p.hint,p.hint,'把最后一项17再增加4，只走一步。','每一步减少3，把最后一项7再减去3。'][i],explanation:[p.explanation,p.explanation,'最后一项17增加4，17+4=21；回查21−17=4。','每次变化为−3；7−3=4，回查4−7=−3。'][i],wrongFeedback:feedback[i][0],correctFeedback:feedback[i][1]})),
      {level:'辨界 · 不变',question:'按每次增加0的规则，6、6、6、6……下一项是多少？',answers:['6'],hint:'增加0表示数量不变，不是把数量变成0。',wrongFeedback:'0是变化量，不是下一项。最后一项6加0，仍是6。',correctFeedback:'对，6；相邻差为0也是固定差。',explanation:'6−6=0；按每次加0延续，下一项=6+0=6。'},
      {level:'辨界 · 有方向的差',question:'19、16、13中，按“后一项减前一项”算出的固定相邻差是多少？写带符号的数。',answers:['-3'],hint:'算16−19，而不是19−16；减少3记作−3。',wrongFeedback:'差要保留方向：16−19=−3，13−16=−3。3只说相差多大，没有表示减少。',correctFeedback:'对，−3；每次减少3，差应为负数。',explanation:'后一项都比前一项少3，因此每个相邻差都是−3。'},
      {level:'迁移 · 项数与步数',question:'从第1项4开始，每次增加3。第8项是多少？',answers:['25'],hint:'从第1项到第8项走8−1=7步，起点不是一步。',wrongFeedback:'第8项只走7步，不是8步：4+7×3=25。',correctFeedback:'对，25；8个站点之间有7个间隔。',explanation:'第1项4，第2项7……每增加一个项号就走一步；到第8项走7步，4+7×3=25。'},
      {level:'反例 · 检查每一步',question:'4、7、10、14的相邻差是否全部相同？（是/否）',answers:['否','不是','不相同'],hint:'不要只查前两个差，还要算14−10。',wrongFeedback:'7−4=3、10−7=3，但14−10=4。只要一个差不同，就不是全部相同。',correctFeedback:'对，否；最后一差4推翻了“每次加3”的判断。',explanation:'完整差列为3、3、4，不能只凭前两步判断为固定差。'},
      {level:'挑战 · 已知项不等于规则',question:'只给4、7、10、13，不说明后续规则，能保证下一项一定是16吗？（能/不能）',answers:['不能','不能保证','不一定'],hint:'比较“一直加3”和“先加3三次，以后一直加4”。',wrongFeedback:'不能保证。一直加3得16；先加3三次以后加4得17。两者都符合已知项。',correctFeedback:'对，不能；有限项符合一种规则，不代表只可能有这一种规则。',explanation:'必须再规定延续规则或限制规则范围，才能在该约定下确定下一项。'}
    ],
    review:[{question:'为什么不能总用大数减小数？',answer:'差要记录从前到后的方向；减少时是负差，不变时是0。'},{question:'从第1项到第n项为什么走n−1步？',answer:'起点没有走；每多一项才多一个间隔。只有差固定才能直接乘步数。'},{question:'差会变时，下一项怎样求？',answer:'按题目规则先求下一差，再把下一差加到最后一项，并回查全部已知差。'},{question:'只看到几个数，能保证延续唯一吗？',answer:'不能；要写明所用规则，再在规则下求值。'}]
  };
  window.AOSHU_ELEMENTARY_DEEP_UNITS = {...window.AOSHU_ELEMENTARY_DEEP_UNITS,'4:differences':unit};
  const previous=window.AOSHU_FOUNDATION_WIDGETS;
  if(!previous)return;
  const cases={
    increase:{name:'固定增加：从4起每次加3',terms:[4,7,10,13,16,19],note:'固定差3；从第1项到第6项是5步，不是6步。'},
    decrease:{name:'固定减少：从19起每次减3',terms:[19,16,13,10,7,4],note:'固定差−3；负号记录减少，不能换成+3。'},
    zero:{name:'不变：从6起每次加0',terms:[6,6,6,6,6,6],note:'固定差0；增加0不是变成0。'},
    growing:{name:'差增长：从2起，差从3起每次加1',terms:[2,5,9,14,20,27],note:'差3、4、5、6、7；差每次加1，不是原数每次加1。'},
    counter:{name:'反例：检查4、7、10、14、17、20',terms:[4,7,10,14,17,20],note:'已给六项的差为3、3、4、3、3；不是固定差。这里仅检查已知项，不预测后续。'}
  };
  window.AOSHU_FOUNDATION_WIDGETS={
    supports:type=>type==='adjacent-differences'||previous.supports(type),
    markup(config){if(config.type!=='adjacent-differences')return previous.markup(config);return `<section class="book-model-lab book-foundation-lab book-differences-lab" data-book-model="adjacent-differences" aria-label="相邻差分步实验台"><div class="book-model-heading"><b>先预测下一步，再展开核对</b><span>每张卡片是一项；后一项减前一项的差写在卡片上。切换案例会回到起点；不记录答题进度。</span></div><div class="book-foundation-controls"><label>变化规则<select data-foundation-model-control data-diff-case aria-label="相邻差案例">${Object.entries(cases).map(([key,c])=>`<option value="${key}">${c.name}</option>`).join('')}</select></label><label>展开到第几项<select data-foundation-model-control data-diff-count aria-label="展开项数">${[1,2,3,4,5,6].map(n=>`<option value="${n}">第${n}项 · 已走${n-1}步</option>`).join('')}</select></label></div><ol class="book-difference-stations" data-diff-stations aria-label="已展开项与到达变化"></ol><p class="book-model-result" data-book-model-result aria-live="polite"></p></section>`;},
    update(root){if(root?.dataset.bookModel!=='adjacent-differences')return previous.update(root);const choice=root.querySelector('[data-diff-case]'),control=root.querySelector('[data-diff-count]'),key=Object.hasOwn(cases,choice?.value)?choice.value:'increase',c=cases[key];if(root.dataset.diffCase!==key){root.dataset.diffCase=key;control.value='1';}const raw=Number(control.value),n=Number.isInteger(raw)?Math.max(1,Math.min(6,raw)):1;control.value=String(n);root.querySelector('[data-diff-stations]').innerHTML=c.terms.slice(0,n).map((value,i)=>`<li><span>第${i+1}项</span><strong>${value}</strong><small>${i?`到达这项：${c.terms[i]} − ${c.terms[i-1]} = ${value-c.terms[i-1]}`:'起点 · 尚未走步'}</small></li>`).join('');root.querySelector('[data-book-model-result]').textContent=`已展开${n}项，走了${n-1}步。${n>1?`最后一步的差是${c.terms[n-1]-c.terms[n-2]}。`:''}${c.note}`;return true;}
  };
})();
