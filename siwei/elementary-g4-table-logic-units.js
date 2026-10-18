(() => {
  const unit = {
    label:'本轮深讲 · 四年级列表推理（本站原创）',
    courseTitle:'列表、表格与条件推理',
    title:'每个叉都有理由：用表格找出所有可能',
    scope:'本站精选路线，序号不是教材讲次；教材版本、页码及逐讲映射待核。新增讲解、互动与练习为本站原创，不是教材或杯赛原题；保留原例题、原自测。本课的交叉表用于题目明确规定的一一对应：每人恰好对应一项，每项也恰好被一人使用。',
    goal:'把条件翻译成候选表，解释每次排除的依据；回查全部条件，并区分唯一解、条件不足和条件矛盾。',
    idea:'先修：会读“不是”“分别”“每人不同”等条件。表格像座位名单：行写人，列写可选项。？表示还没有排除，不表示已经确定；×表示不可能，✓表示确定。只有题目说每项也只用一次，才可确定一格后排除同行、同列。',
    example:{question:'甲、乙分别拿红球和蓝球；甲不拿红球。甲拿什么颜色？',steps:[
      '先读分配约定：两人分别拿红、蓝球，每人一种，两种各用一次。行写甲、乙，列写红、蓝，先把四格都记为？。',
      '“甲不拿红球”只排除甲—红，画×；甲这一行只剩蓝，所以甲—蓝画✓。',
      '蓝球只给一人，甲拿蓝后，乙—蓝画×；乙只剩红，乙—红画✓。',
      '回查：甲蓝、乙红，两人各一种，颜色不重复，且甲确实不拿红。每一步都有条件支持，不是看空格猜答案。'
    ]},
    methodCard:{title:'读分配约定 → 标条件 → 连锁排除 → 全部回查',formula:'？=未排除；×=不可能；✓=已确定',when:'人物与颜色、楼层、名次等候选有限，而且题目说明一一对应时。题目允许重复，就不能照搬“划掉同列”。',steps:['写全行、列，确认是否各用一次','先标直接给出的确定与排除条件','某行或列只剩一格时再确定，排除同行同列','检查全部线索与所有合法安排'],check:'找到一个安排只说明它可行；还要排除其他安排才能说唯一。两个或更多合法安排是条件不足；一个也没有是条件矛盾。'},
    concepts:[
      {title:'1. 为什么要列表',text:'把脑中来回猜的对应关系摆出来，不会漏掉某个人或某个选项。每格只回答“这个人能否对应这一项”，不能把不同属性混进同一列。'},
      {title:'2. 不是A，不一定就是B',text:'若有红、蓝、绿三种球，只知道甲不拿红，甲还可能拿蓝或绿。候选剩两个时继续找线索，不可随手选一个。'},
      {title:'3. 确定一格才触发同行同列排除',text:'每人恰住一层且每层恰住一人时，乙住3楼，就排除乙住1、2楼，也排除甲、丙住3楼。一个×只否定这一格，不能把整行或整列都划掉。'},
      {title:'4. 连锁推理要说出原因',text:'甲乙丙各住1、2、3楼且各不相同。乙住3楼，甲不住1楼：先排除3楼被别人再用，再得甲住2楼，最后丙住1楼。先写甲={2,3}，结合乙住3楼后才缩成{2}。'},
      {title:'5. 条件不足与矛盾不同',text:'甲乙丙各住不同的1、2、3楼，只知乙住3楼：甲1丙2、甲2丙1都合法，条件不足。若又说甲住3楼，则甲乙争同一楼层，无合法安排，是矛盾。'},
      {title:'6. 不能偷加“不重复”',text:'若甲乙可以选同色球，甲选红不代表乙不能选红。只有题目明确各用一次，才能划掉同一列的其他人；真实分组题未必是一一对应。'}
    ],
    diagrams:[{caption:'每一行、每一列都恰有一个✓（一一对应时）',text:'       红   蓝\n甲     ×    ✓\n乙     ✓    ×\n甲不拿红 → 甲只剩蓝 → 蓝不能再给乙 → 乙只剩红。'}],
    model:{type:'table-logic'},
    practices:[
      {level:'起步 · 保留原自测',question:'三个人甲乙丙分别住1、2、3楼，每人一层。甲不住1楼，乙住3楼，丙住几楼？',answers:['1'],hint:'先记甲={2,3}、乙={3}、丙={1,2,3}；乙占3楼后，再删去其他人的3楼。',wrongFeedback:'甲不能住1楼，3楼又给了乙，所以甲住2楼；丙只能住1楼。别把甲已排除的1楼放回候选。',correctFeedback:'对，丙住1楼；甲2楼、乙3楼，三人不同楼且全部线索满足。',explanation:'乙占3楼，甲不住1楼，只能2楼；丙剩1楼。回查每人一层、楼层各不相同，且甲不住1楼。'},
      {level:'理解 · 候选不是确定',question:'甲乙丙各拿红、蓝、绿中的一种球，三种颜色各用一次。只知道甲不拿红，甲还剩几种候选颜色？',answers:['2'],hint:'不拿红排除的只有红；蓝、绿是否都还可能？',wrongFeedback:'只有红被排除，蓝和绿都还可能，所以剩2种；“不是红”不能直接变成“就是蓝”。',correctFeedback:'对，还剩蓝、绿2种候选；需要更多条件才能确定甲的颜色。',explanation:'甲拿蓝或甲拿绿都可补全其他人的颜色，因此仅凭这条线索不能确定甲。'},
      {level:'操作 · 确定后排除',question:'甲乙丙各住不同的1、2、3楼，乙确定住3楼。其余两个人中，还能住3楼的有几人？',answers:['0'],hint:'每层只住一人，3楼已经给乙。',wrongFeedback:'楼层各不相同，乙占3楼后，甲、丙都不能再住3楼，因此是0人。',correctFeedback:'对，是0人；确定乙—3后，同列的甲—3、丙—3都要排除。',explanation:'3楼只用一次；乙住3楼就排除了其他人住3楼的可能。'},
      {level:'进阶 · 多条线索',question:'甲乙丙各住不同的1、2、3楼。甲不住1楼，也不住3楼；乙不住1楼。丙住几楼？',answers:['1'],hint:'先找被排除两项的人，再处理乙。',wrongFeedback:'甲排除1、3楼，只能2楼；乙不能1楼且2楼已用，只能3楼；丙住1楼。',correctFeedback:'对，丙住1楼；甲2、乙3、丙1是唯一合法安排。',explanation:'依次确定甲2楼、乙3楼、丙1楼。每个确定项都可由前面的排除推出。'},
      {level:'辨界 · 条件不足',question:'甲乙丙各住不同的1、2、3楼，只知道乙住3楼。满足条件的完整安排共有几种？',answers:['2'],hint:'先固定乙，再列甲、丙在1、2楼的两种次序。',wrongFeedback:'有甲1乙3丙2、甲2乙3丙1这2种。找到其中一种不能说它是唯一答案。',correctFeedback:'对，有2种；甲、丙可以交换1、2楼，条件还不足以确定唯一安排。',explanation:'固定乙3楼后，甲可取1或2楼，丙取剩下的一层，恰有两种。'},
      {level:'辨界 · 条件矛盾',question:'甲乙丙各住不同的1、2、3楼，条件却同时说甲住3楼、乙住3楼。满足全部条件的安排有几种？',answers:['0'],hint:'两人能否同时占用只给一人的楼层？',wrongFeedback:'甲乙都被要求住3楼，与各住不同楼层矛盾，合法安排是0种，不是“条件不够”。',correctFeedback:'对，是0种；条件相互冲突，不能靠随意删除一条线索来作答。',explanation:'无论丙住哪里，甲乙都重复3楼，已经违反分配约定，所以无解。'},
      {level:'迁移 · 允许重复',question:'甲乙都可以选红或蓝，允许同色。已知甲选红，乙有几种颜色可选？',answers:['2'],hint:'这次允许重复，还能划掉乙—红吗？',wrongFeedback:'允许同色，所以乙仍可选红或蓝，共2种。不能偷偷加上“每种颜色只用一次”。',correctFeedback:'对，乙有2种选择；本题不是颜色各用一次的一一对应。',explanation:'乙红、乙蓝都符合条件。甲红没有排除乙红。'},
      {level:'挑战 · 检查所有线索',question:'甲乙丙各住不同的1、2、3楼，甲住在乙的上面（楼层数更大），丙不住1楼。乙住几楼？',answers:['1'],hint:'若乙住2楼，甲只能3楼，那么丙会住哪里？',wrongFeedback:'乙不能3楼；若乙2楼，则甲3、丙1，违背丙不住1楼。因此乙只能1楼。',correctFeedback:'对，乙住1楼；甲2丙3或甲3丙2都合法。乙的位置唯一，不代表整个安排唯一。',explanation:'若乙2楼会迫使丙1楼，若乙3楼甲无处在其上。乙只能1楼；另外两人仍有两种安排。'}
    ],
    review:[{question:'？、×、✓分别表示什么？',answer:'未排除、不可能、已确定；候选不是确定。'},{question:'什么时候可划掉同列其他格？',answer:'题目明确一一对应，且已确定这一列由某人占用时。'},{question:'找到一个合法安排就能说唯一吗？',answer:'不能。还要排除其他安排；多个为条件不足，零个为条件矛盾。'}]
  };
  window.AOSHU_ELEMENTARY_DEEP_UNITS=Object.assign({},window.AOSHU_ELEMENTARY_DEEP_UNITS||{},{'4:tables-logic':unit});
  const previous=window.AOSHU_FOUNDATION_WIDGETS;
  if(!previous)return;
  const cases={
    unique:{name:'唯一：甲不住1楼，乙住3楼',stages:[['???','???','???'],['x??','???','???'],['x?x','xxv','??x'],['xvx','xxv','vxx']],notes:['三人各住不同的1、2、3楼；先预测第一条线索能排除哪一格。','甲不住1楼，只在甲—1画×；甲的2、3楼都尚未排除。','乙住3楼：确定乙—3，并排除乙的其他楼层与其他人的3楼。','甲只剩2楼，确定甲—2；丙只剩1楼。全部条件回查通过，完整安排唯一。']},
    multiple:{name:'不足：只知乙住3楼',stages:[['???','???','???'],['??x','xxv','??x']],notes:['三人各住不同楼层，只给乙住3楼，先不要替甲、丙选位置。','甲、丙各剩1、2楼：甲1丙2或甲2丙1，共2种完整安排。？不是已经确定；条件不足。']},
    conflict:{name:'矛盾：甲乙都住3楼',stages:[['???','???','???'],['xxv','xxv','???']],notes:['三人仍要求各住不同楼层，但线索说甲住3楼、乙也住3楼。','表中两条✓是冲突的线索要求，不是合法解：同列不能有两个✓。满足全部条件的安排为0种。']}
  };
  window.AOSHU_FOUNDATION_WIDGETS={
    supports:type=>type==='table-logic'||previous.supports(type),
    markup(config){if(config.type!=='table-logic')return previous.markup(config);return `<section class="book-model-lab book-foundation-lab book-table-logic-lab" data-book-model="table-logic" aria-label="一一对应排除实验台"><div class="book-model-heading"><b>先预测，再按线索更新表格</b><span>三人各住不同楼层。互动不记录答题进度；切换案例会重置步骤。</span></div><div class="book-foundation-controls"><label>选条件<select data-foundation-model-control data-table-case aria-label="列表推理案例">${Object.entries(cases).map(([key,c])=>`<option value="${key}">${c.name}</option>`).join('')}</select></label><label>推理步骤<select data-foundation-model-control data-table-stage aria-label="列表推理步骤"><option value="0">0 · 读分配约定</option><option value="1">1 · 标直接线索</option><option value="2">2 · 确定后排除</option><option value="3">3 · 连锁补全与回查</option></select></label></div><p>？未排除 · ×不可能 · ✓确定（矛盾案例中的✓表示互相冲突的要求）</p><table class="book-table-logic-grid"><caption>人物与楼层候选表</caption><thead><tr><th scope="col">人物</th><th scope="col">1楼</th><th scope="col">2楼</th><th scope="col">3楼</th></tr></thead><tbody data-table-grid></tbody></table><p class="book-model-result" data-book-model-result aria-live="polite"></p></section>`;},
    update(root){if(root?.dataset.bookModel!=='table-logic')return previous.update(root);const choice=root.querySelector('[data-table-case]'),control=root.querySelector('[data-table-stage]');const key=Object.hasOwn(cases,choice?.value)?choice.value:'unique',c=cases[key];if(root.dataset.tableCase!==key){root.dataset.tableCase=key;control.value='0';}const raw=Number(control.value),stage=Number.isInteger(raw)&&raw>=0?Math.min(raw,c.stages.length-1):0;control.value=String(stage);for(const option of control.options)option.disabled=Number(option.value)>=c.stages.length;const labels={x:['×','不可能'],v:['✓','确定或条件要求'],'?':['？','未排除']};root.querySelector('[data-table-grid]').innerHTML=c.stages[stage].map((row,i)=>`<tr><th scope="row">${['甲','乙','丙'][i]}</th>${[...row].map((cell,j)=>`<td data-table-cell="${cell}" aria-label="${['甲','乙','丙'][i]}，${j+1}楼，${labels[cell][1]}">${labels[cell][0]}</td>`).join('')}</tr>`).join('');root.querySelector('[data-book-model-result]').textContent=c.notes[stage];return true;}
  };
})();
