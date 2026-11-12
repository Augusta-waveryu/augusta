(() => {
  const unit = {
    label:'本轮深讲 · 四年级逆推（本站原创）',
    courseTitle:'逆推与还原',
    title:'从终点往回走：顺序倒过来，操作也反过来',
    scope:'本站精选路线，序号不是教材讲次；教材版本、页码及逐讲映射待核。新增讲解、互动和练习为本站原创，不是教材或杯赛原题；保留原例题及原自测。本课在非负整数、除法恰好整除的范围内，学习已知操作路线的还原；不把取整、只报余数或乘0当作能唯一还原的步骤。',
    goal:'画清起点到终点的变化路线，从最后一步开始用相反运算逐步还原，解释顺序为什么要反过来，并用正向计算检查所有条件。',
    idea:'先修：会整数四则、括号与乘除互查。逆推像沿脚印往回走：最后穿上的外套，要先脱下来。只有每一步的操作和数量都清楚，而且能恢复前一步，才可以这样找回唯一的起点。',
    example:{question:'一个数乘 3 再减 4 得 17，原数是多少？',steps:[
      '先把“先、再”写成路线：原数 → 乘3 → 中间数 → 减4 → 17。17不是乘3后的数，而是又减了4的结果。',
      '从终点17先撤销最后的减4，用加4还原：17+4=21。21才是原数乘3后的中间数。',
      '再撤销乘3，用除以3还原：21÷3=7，所以原数是7。合写为(17+4)÷3=7，括号不能漏。',
      '正向回查：7×3=21，21−4=17，每一步都符合题意；答案7是非负整数。'
    ]},
    methodCard:{title:'画正向路线 → 从末步撤销 → 正向回查',formula:'加a ↔ 减a；乘非零数a ↔ 除以a；先做的最后还原',when:'只知道最后结果，却知道中间每一步做了什么时。先认清操作作用于哪个整体；不是把题目中的运算符号逐个换掉就结束。',steps:['按题意列出正向步骤','从最后一步开始，用相反运算找回中间数','按倒序撤销到起点','把原数按题意正着算一遍'],check:'求得的数和每个中间结果都要符合题意范围。乘0会丢失信息；只知道整数商或余数通常不能唯一还原。'},
    concepts:[
      {title:'1. 什么时候适合倒着找',text:'已知终点和完整的操作路线，要求起点时适合逆推。若只知道“变大了一些”，不知道增加多少，就少了条件，不能硬套。'},
      {title:'2. 为什么不按原顺序还原',text:'原数先加8再乘2得30，最后的乘2把“原数加8”整个变成了两倍。要先把整个结果除以2得到15，再减8得到7。若先30−8再除以2得11，正向(11+8)×2=38，不是30。'},
      {title:'3. 每个中间数都有意思',text:'17+4=21中的21，是“还没减4之前”的数，不是原数。写下中间数代表哪个阶段，可避免只做一步就停下；连续三步也要从最后一步一层层撤销。'},
      {title:'4. 除法也可以乘回去',text:'一个数先除以4再加6得11，先算11−6=5，再算5×4=20。这里题目中的除法恰好整除；正向20÷4+6=11。'},
      {title:'5. 相反运算不是随意交换',text:'本课“减6”指原数−6，不是6−原数；两者含义不同。“先加5再乘2”写成(原数+5)×2，而不是原数+5×2。先理解语言，再画箭头。'},
      {title:'6. 边界：丢掉的信息找不回来',text:'一个数乘0得0，原数可能是0、1、2等，不能除以0还原。若只报“除以4的整数商是3”，12、13、14、15都符合；不知道余数就不能唯一确定原数。'}
    ],
    diagrams:[{caption:'一条路线，两个方向',text:'正向：原数7 → ×3 → 21 → −4 → 17\n逆向：终点17 → +4 → 21 → ÷3 → 7\n最后的−4先撤销；最先的×3最后撤销。'}],
    model:{type:'inverse-path'},
    practices:[
      {level:'起步 · 保留原自测',question:'一个数加 8 后乘 2 得 30，原数是多少？',answers:['7'],hint:'先除以2，得到加8后的中间数；再减8。',wrongFeedback:'30是整个“原数加8”的两倍。先30÷2=15，再15−8=7；先减8再除2会得到11，正向却是38。',correctFeedback:'对，原数7；(7+8)×2=30。先撤销最后的乘2，再撤销加8。',explanation:'正向为原数→加8→乘2→30。逆向30÷2=15，15−8=7；回查(7+8)×2=30。'},
      {level:'理解 · 识别中间数',question:'原数乘3再减4得17。还原时17+4=21，这个21已经是原数了吗？（是填1，不是填0）',answers:['0'],hint:'21对应正向路线中的哪一步？乘3撤销了吗？',wrongFeedback:'21只是减4之前的数，仍是原数的3倍；还要21÷3=7。',correctFeedback:'对，填0；21是中间数，还要除以3才能找回原数7。',explanation:'原数×3=21，21−4=17。加4只撤销了最后一步，除以3后才得到7。'},
      {level:'辨错 · 倒序而非照顺序',question:'一个数加8后乘2得30，小明算(30−8)÷2=11。这个原数正确吗？（正确填1，错误填0）',answers:['0'],hint:'把11按题目正向算一遍，是否得到30？',wrongFeedback:'11代回得(11+8)×2=38，不是30。应先除2再减8，不能沿原顺序撤销。',correctFeedback:'对，填0；11回查不符，正确还原是30÷2−8=7。',explanation:'最后乘2要最先撤销。30÷2=15，15−8=7；(7+8)×2=30。'},
      {level:'进阶 · 减后除',question:'一个数先减6，再除以3，结果是4，原数是多少？',answers:['18'],hint:'最后是除以3，先乘回3；再撤销减6。',wrongFeedback:'先4×3=12找回减6后的数，再12+6=18。不是先加6再乘3。',correctFeedback:'对，原数18；(18−6)÷3=4。',explanation:'逆向4×3=12，12+6=18。正向18−6=12，12÷3=4。'},
      {level:'迁移 · 除后加',question:'一个数先除以4（恰好整除），再加6得11，原数是多少？',answers:['20'],hint:'先撤销加6，再把除以4变成乘4。',wrongFeedback:'11−6=5只是除以4后的数；还要5×4=20，不能再除以4。',correctFeedback:'对，原数20；20÷4+6=11，且20能被4整除。',explanation:'逆向11−6=5，5×4=20。正向20÷4=5，5+6=11。'},
      {level:'挑战 · 三步还原',question:'一个数先加5，再乘2，最后减4得12，原数是多少？',answers:['3'],hint:'从最后的减4开始：加4、除以2、减5。',wrongFeedback:'先12+4=16，再16÷2=8，最后8−5=3。8仍是加5后的数，不能停在这里。',correctFeedback:'对，原数3；(3+5)×2−4=12，三步全部回查通过。',explanation:'倒序撤销：12+4=16，16÷2=8，8−5=3；正向3+5=8，8×2=16，16−4=12。'},
      {level:'边界 · 乘0',question:'只知道一个非负整数乘0得0，能唯一确定原数吗？（能填1，不能填0）',answers:['0'],hint:'原数取2和3时，结果分别是多少？',wrongFeedback:'2×0和3×0都是0，很多原数都符合；乘0丢失信息，也不能除以0。',correctFeedback:'对，填0；乘0后多个原数得到同一结果，不能唯一还原。',explanation:'0、1、2等乘0都得0。不能把0÷0作为还原步骤，除以0没有意义。'},
      {level:'边界 · 只报整数商',question:'只知道一个非负整数除以4的整数商是3，没有告诉余数，能唯一确定原数吗？（能填1，不能填0）',answers:['0'],hint:'12÷4和13÷4的整数商都是几？',wrongFeedback:'12、13、14、15除以4的整数商都是3，但余数不同；缺少余数不能唯一确定。',correctFeedback:'对，填0；可能的原数有12、13、14、15，不只12。',explanation:'原数=4×3+余数，余数可为0、1、2、3，所以有四种可能。若明确恰好整除，才可确定原数12。'}
    ],
    review:[{question:'逆推时，顺序与运算分别怎样改变？',answer:'从最后一步开始倒序走；加减互相撤销，乘除以非零数互相撤销。'},{question:'为什么还要正向检查？',answer:'确认没有弄错顺序、漏掉步骤，并检查原数及中间数满足题意。'},{question:'什么时候不能唯一还原？',answer:'缺少操作条件，或操作丢失信息时，例如乘0、只报整数商而不报余数。'}]
  };
  window.AOSHU_ELEMENTARY_DEEP_UNITS=Object.assign({},window.AOSHU_ELEMENTARY_DEEP_UNITS||{},{'4:inverse-operations':unit});
  const previous=window.AOSHU_FOUNDATION_WIDGETS;
  if(!previous)return;
  const cases={
    times:{name:'乘3，再减4，得17',forward:'原数 → ×3 → 中间数 → −4 → 17',values:[17,21,7],operations:['+4','÷3'],notes:['先预测：最后一步是减4，该怎样撤销？','17+4=21；21是乘3后的数，还不是原数。','21÷3=7；回查7×3−4=17。']},
    plus:{name:'加8，再乘2，得30',forward:'原数 → +8 → 中间数 → ×2 → 30',values:[30,15,7],operations:['÷2','−8'],notes:['先预测：最后乘2作用于整个“原数加8”。','30÷2=15；15是加8后的数，下一步减8。','15−8=7；回查(7+8)×2=30。']},
    three:{name:'加5，乘2，再减4，得12',forward:'原数 → +5 → ×2 → −4 → 12',values:[12,16,8,3],operations:['+4','÷2','−5'],notes:['三步也从最后一步开始：先撤销减4。','12+4=16；回到了乘2之后。','16÷2=8；回到了加5之后，还没到起点。','8−5=3；回查(3+5)×2−4=12。']},
    zero:{name:'边界：乘0，得0',forward:'未知原数 → ×0 → 0',values:[0],operations:[],notes:['不能唯一还原：0×0=0，2×0=0，3×0=0。乘0把不同起点变成同一终点；不能除以0。']}
  };
  window.AOSHU_FOUNDATION_WIDGETS={
    supports:type=>type==='inverse-path'||previous.supports(type),
    markup(config){if(config.type!=='inverse-path')return previous.markup(config);return `<section class="book-model-lab book-foundation-lab book-inverse-lab" data-book-model="inverse-path" aria-label="倒着走还原实验台"><div class="book-model-heading"><b>先预测下一步，再逐步还原</b><span>互动只展示推理，不记录答题进度。切换案例后从终点重新开始。</span></div><div class="book-foundation-controls"><label>选路线<select data-foundation-model-control data-inverse-case aria-label="逆推实验案例">${Object.entries(cases).map(([key,c])=>`<option value="${key}">${c.name}</option>`).join('')}</select></label><label>还原几步<select data-foundation-model-control data-inverse-stage aria-label="逆推还原阶段"><option value="0">0 · 只看终点</option><option value="1">1 · 撤销末步</option><option value="2">2 · 再往前一步</option><option value="3">3 · 完成三步路线</option></select></label></div><p class="book-inverse-forward" data-inverse-forward></p><div class="book-inverse-path" data-inverse-path role="group" aria-label="从终点逐步还原的路线"></div><p class="book-model-result" data-book-model-result aria-live="polite"></p></section>`;},
    update(root){if(root?.dataset.bookModel!=='inverse-path')return previous.update(root);const choice=root.querySelector('[data-inverse-case]'),control=root.querySelector('[data-inverse-stage]');const key=Object.hasOwn(cases,choice?.value)?choice.value:'times',c=cases[key];if(root.dataset.inverseCase!==key){root.dataset.inverseCase=key;control.value='0';}const raw=Number(control.value),stage=Number.isInteger(raw)&&raw>=0?Math.min(raw,c.values.length-1):0;control.value=String(stage);for(const option of control.options)option.disabled=Number(option.value)>=c.values.length;root.querySelector('[data-inverse-forward]').textContent='正向路线：'+c.forward;root.querySelector('[data-inverse-path]').innerHTML=c.values.slice(0,stage+1).map((n,i)=>`${i?`<span class="book-inverse-arrow">${c.operations[i-1]} →</span>`:''}<span class="book-inverse-node"><small>${i===0?'终点':i===c.values.length-1?'原数':'中间数'}</small><b>${n}</b></span>`).join('');root.querySelector('[data-book-model-result]').textContent=c.notes[stage];return true;}
  };
})();
