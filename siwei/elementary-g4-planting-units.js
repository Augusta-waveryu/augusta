(() => {
  const unit = {
    label: '本轮深讲 · 四年级植树与间隔',
    courseTitle: '植树与间隔',
    title: '先画点与段：为什么有时加1，有时不加？',
    scope: '本站精选路线，序号不是教材讲次；教材版本、页码与逐讲映射待核。本课讲解、图示、互动和新增练习为本站原创，保留原例题与原自测，不是教材或杯赛原题。讨论一条直路单侧或一条封闭路线、正长度和正间距，默认全程按同一间距分段且长度能整除间距；额外条件须另行判断。',
    goal: '分清位置点与长度段，先判断路线和端点，再用间隔数求点数；会检查整除、单位、单侧或双侧，能解释不可直接套公式的情形。',
    idea: '先修：会乘除、数位置和换算米与厘米。树或标记占一个位置，叫点；两个相邻位置之间的一段叫间隔。用手指点点，用笔描段，它们不是同一种东西。这里说的间隔数是全程分出的等长段数；端点不种时，最外面的段仍是路的一部分，不一定夹在两棵树之间。',
    example: {
      question: '环形花坛周长 24 米，每隔 4 米放一个标记，沿整圈放完，共几个标记？',
      steps: [
        '先辨路线：花坛是封闭的一圈，起点与绕一周后的终点是同一位置，不能算成两个标记。',
        '先数段：24÷4=6，整圈分成6个4米的间隔。单位一致，而且能恰好分完。',
        '沿圈从0米出发，标记在0、4、8、12、16、20米；走到24米就是回到0米，不再加一个新点。',
        '每个标记后面恰好接一个间隔，一点对应一段，因此6段对应6个不同标记；不是直线两端都种的7个。',
        '回查：6个间隔每段4米，6×4=24米，正好绕一圈；答案是6个标记。'
      ]
    },
    methodCard: {
      title: '认路线 → 统一单位 → 先数段 → 看端点 → 回查',
      formula: '设间隔数n=全长÷间距：直线两端都种n+1；只种一端n；两端都不种n−1；封闭一圈n。',
      when: '每段间距相同且全程可恰好分完时，用端点关系数位置；直线默认只数单侧。封闭例子须有足够的不同点形成一圈，本课互动至少3段。',
      steps: ['画简图，说明直线还是封闭路线', '全长与间距换成相同单位，检查能否整除', '算等长段数，不急着叫它树数', '按端点是否占用增减点数，封闭时合并重复起终点', '把段数乘间距查全长，再查点的位置和行数'],
      check: '若不能整除，不能机械把商加1或四舍五入；要看是否允许末段变短、端点是否必须种。道路两侧分别数再相加，不能给一侧的段数只加一次1。'
    },
    model: {type: 'planting-points'},
    diagrams: [
      {caption: '12米直路，每3米一个位置：四段、五个可能的位置', text: '位置(米)：0 — 3 — 6 — 9 — 12\n两端都种：● — ● — ● — ● — ●  → 5棵\n只种起点：● — ● — ● — ● — ○  → 4棵\n两端不种：○ — ● — ● — ● — ○  → 3棵\n●种，○不种；每个横段都是3米。'},
      {caption: '六段围一圈：最后一段仍要数，重复起点不能再数', text: '0 → 4 → 8 → 12 → 16 → 20 → 回到0\n6个不同的标记，6段各4米。\n“回到0”是原来的点，不是第7个新点。'}
    ],
    concepts: [
      {title: '1. 为什么直线两端都种要加1？', text: '先在起点放1棵，再走完一段增加1棵。四段会增加4棵，加起点共5棵。除法12÷3=4数到的是段，不是点。反过来5棵沿一侧排直线、两端都占用，会形成4个相邻间隔。'},
      {title: '2. 只种一端与两端不种', text: '先画出两端都种的5个位置。只去掉终点一棵，留下4棵；再去掉起点，留下3棵。只种终点不种起点也有4棵，但位置不同。若全路只有1段，两端不种就没有内部位置，树数是0，不是负数。'},
      {title: '3. 围成一圈为什么不加1？', text: '把直线的两个端点接成同一个点，原来多出的那个点就合并了。六个间隔只对应六个不同标记；仍要数从最后一个标记返回起点的那一段。不要既漏掉闭合段，又重复起点。'},
      {title: '4. 单位和道路两侧', text: '全长6米、间距150厘米，先换成600厘米，600÷150=4段。若两侧都按直线两端都种，每侧4+1=5棵，两侧共10棵；不是4×2+1=9棵。两侧若条件不同，应分别计算。'},
      {title: '5. 不能整除时先问条件', text: '10米直路从起点开始，每3米放一个标记，在0、3、6、9米处，共4个，末端剩1米；但这不是全程都分成3米的等长段。若还要求终点也放、所有相邻间距都必须恰好3米，就无解：9到10仅1米。若允许末段缩短，终点可另放一个，共5个。条件不同，答案不同，不能把10÷3加1后取整当通则。'},
      {title: '6. 锯木是点段关系，不是另一条神秘公式', text: '一根木条要成5段，逐次锯、每次只切一段且不叠放，一刀使总段数增加1；从1段到5段要4刀。若多根叠放一刀同时切，或折叠后切，条件变了，不能直接用段数减1。'}
    ],
    practices: [
      {level:'起步 · 保留原自测', question:'12 米直路每隔 3 米种一棵，起点种，终点不种，共几棵？', answers:['4'], hint:'先列0、3、6、9、12米；删掉哪一个端点？', wrongFeedback:'12÷3=4是段数；两端都种才是5棵。本题只种起点，位置是0、3、6、9米，终点12米不种。', correctFeedback:'对，4棵；4段中最末一段从9米通到不种树的终点12米。', explanation:'12÷3=4段。两端都种有5个点，去掉终点剩4棵。不能把最末一段漏掉。'},
      {level:'比较 · 两端都种', question:'同一条12米直路，每隔3米种一棵，只数一侧，两端都种，共几棵？', answers:['5'], hint:'起点先有一棵，每走3米再添一棵。', wrongFeedback:'4是段数，不是两端都种的树数；0米起点也要占一个位置。', correctFeedback:'对，5棵在0、3、6、9、12米，夹出4段。', explanation:'全程4段，两端都种为4+1=5棵；回查(5−1)×3=12米。'},
      {level:'比较 · 两端不种', question:'仍是12米直路，每隔3米一个位置，起点和终点都不种，只数一侧，共几棵？', answers:['3'], hint:'从两端都种的5棵中去掉两端。', wrongFeedback:'4是只种一端的数量；两端都不种只剩3、6、9米三个内部点。', correctFeedback:'对，3棵；路仍有4段，端点不种不等于最外两段消失。', explanation:'12÷3=4段；4+1−2=3棵，或4−1=3棵。'},
      {level:'理解 · 封闭路线', question:'环形花坛周长24米，每隔4米放一个标记，沿整圈放完，共几个不同标记？', answers:['6'], hint:'24米处就是0米起点，不能重复数。', wrongFeedback:'7把绕回的起点重复算了一次；封闭一圈6段配6个不同点。', correctFeedback:'对，6个；最后一段从20米回到0米，仍长4米。', explanation:'24÷4=6段；封闭路线段数等于不同标记数，不再加1。'},
      {level:'应用 · 单位与两侧', question:'6米直路两侧都种树，每侧每隔150厘米种一棵，各侧两端都种。两侧共几棵？', answers:['10'], hint:'先把6米换成600厘米，求一侧，再乘2。', wrongFeedback:'每侧600÷150=4段、5棵；两侧都各有一个额外起点，不能只在两侧段数合计后加1。', correctFeedback:'对，每侧5棵，两侧共10棵。', explanation:'6米=600厘米；每侧600÷150=4段，4+1=5棵，两侧5×2=10棵。'},
      {level:'反向 · 已知点数', question:'直路一侧两端都种，7棵树相邻间距都是2米。这段路长多少米？', answers:['12'], hint:'用笔连7个点，数中间有几段。', wrongFeedback:'7棵不是7段；两端都种时段数比树数少1。', correctFeedback:'对，6段各2米，路长12米。', explanation:'7−1=6段；6×2=12米。若算7×2=14，是多算一段。'},
      {level:'边界 · 不可机械取整', question:'10米直路要求起点和终点都放标记，且全程每个相邻间距必须恰好3米。能做到吗？（能填1，不能填0）', answers:['0'], hint:'从0按3米走，能正好停在10米吗？', wrongFeedback:'不能。0、3、6、9之后到10只剩1米；添加终点会破坏每段恰好3米的要求。', correctFeedback:'对，填0。长度不能被间距整除，这组严格条件无解。', explanation:'10不能被3整除。若允许末段1米，可以放5个，但本题明确每段必须恰好3米，故不允许。'},
      {level:'迁移 · 逐刀锯木', question:'一根木条锯成5段，每刀只切一段、不叠放，至少锯几刀？', answers:['4'], hint:'开始已有1段；一刀使总段数增加多少？', wrongFeedback:'不是每段各锯一刀。开始1段，每刀增加1段，从1到5只须增加4段。', correctFeedback:'对，4刀。这里不能叠放，是段数减1成立的必要操作条件。', explanation:'段数依次是1→2→3→4→5，锯4次；若叠放一刀可切多段，便不能照用这个关系。'}
    ],
    review: [
      {question:'除法全长÷间距得到的是什么？',answer:'全程分出的等长段数，不一定是树数。先统一单位并确认能恰好分完。'},
      {question:'四段直路，三种端点条件分别几棵？',answer:'两端都种5棵，只种一端4棵，两端都不种3棵。最外面的路段在端点不种时仍要计入全长。'},
      {question:'封闭一圈为什么没有额外的一棵？',answer:'起点与绕回终点是同一位置，要合并而不是重复数；每个标记对应后面的一个间隔。'},
      {question:'10米每3米时为什么不能随便取整？',answer:'要看是否要求终点也放、是否允许最后1米短段。全程每段恰好3米且两端都有标记时无解。'},
      {question:'两侧种树与叠放锯木有什么提醒？',answer:'两侧分别数再相加；段数减1的锯切关系只用于每刀增加一段、不叠放的情况。'}
    ]
  };
  window.AOSHU_ELEMENTARY_DEEP_UNITS = Object.assign({}, window.AOSHU_ELEMENTARY_DEEP_UNITS || {}, {'4:planting':unit});
  const previous = window.AOSHU_FOUNDATION_WIDGETS;
  if (!previous) return;
  const type='planting-points';
  const modes=[['both','直线：两端都种'],['one','直线：只种起点'],['neither','直线：两端不种'],['circle','封闭一圈']];
  window.AOSHU_FOUNDATION_WIDGETS = {
    supports: value => value===type || previous.supports(value),
    markup(config) {
      if(config.type!==type) return previous.markup(config);
      return `<section class="book-model-lab book-foundation-lab book-planting-lab" data-book-model="${type}" aria-label="植树点与间隔实验台"><div class="book-model-heading"><b>先预测点数，再切换端点</b><span>图中每段长3米，●表示种，○表示不种。封闭图的连线只表示相邻关系，不按外形测长度。</span></div><div class="book-foundation-controls"><label>段数<select data-foundation-model-control data-planting-count aria-label="植树实验段数"><option value="4">4段，全长12米</option><option value="6">6段，全长18米</option></select></label><label>路线与端点<select data-foundation-model-control data-planting-mode aria-label="植树实验路线">${modes.map(([value,label])=>`<option value="${value}">${label}</option>`).join('')}</select></label></div><div class="book-planting-chart" data-planting-chart role="img"></div><p class="book-model-result" data-book-model-result aria-live="polite"></p><p class="book-model-caption">同样的段数，改变端点条件会改变点数。操作不计入答题进度；本图仅表示一侧或一圈，不表示道路两侧。</p></section>`;
    },
    update(root) {
      if(root?.dataset.bookModel!==type) return previous.update(root);
      const n=Number(root.querySelector('[data-planting-count]')?.value)==6?6:4;
      const raw=root.querySelector('[data-planting-mode]')?.value;
      const mode=modes.some(([key])=>key===raw)?raw:'both';
      const circle=mode==='circle';
      const count=circle||mode==='one'?n:mode==='neither'?n-1:n+1;
      const points=Array.from({length:circle?n:n+1},(_,i)=>({i, planted:circle||mode==='both'||(mode==='one'?i<n:i>0&&i<n)}));
      const svg=[];
      if(circle) {
        const coords=points.map(({i})=>({x:120+75*Math.cos(-Math.PI/2+i*2*Math.PI/n),y:100+75*Math.sin(-Math.PI/2+i*2*Math.PI/n)}));
        coords.forEach((p,i)=>{const q=coords[(i+1)%n];svg.push(`<line x1="${p.x}" y1="${p.y}" x2="${q.x}" y2="${q.y}"/>`)});
        coords.forEach((p,i)=>svg.push(`<circle cx="${p.x}" cy="${p.y}" r="7" class="is-planted"/><text x="${p.x}" y="${p.y-12}">${i===0?'0(起终点)':i*3}</text>`));
        svg.push(`<text x="120" y="105">${n}段，各3米</text>`);
      } else {
        for(let i=0;i<n;i++)svg.push(`<line x1="${15+i*210/n}" y1="85" x2="${15+(i+1)*210/n}" y2="85"/><text x="${15+(i+.5)*210/n}" y="115">3米</text>`);
        points.forEach(({i,planted})=>svg.push(`<circle cx="${15+i*210/n}" cy="85" r="6" class="${planted?'is-planted':'is-empty'}"/><text x="${15+i*210/n}" y="65">${i*3}</text>`));
        svg.push('<text x="120" y="145">位置数值单位：米</text>');
      }
      const chart=root.querySelector('[data-planting-chart]');
      chart.innerHTML=`<svg viewBox="0 0 240 200" aria-hidden="true">${svg.join('')}</svg>`;
      const description=`${modes.find(([key])=>key===mode)[1]}，${n}段，每段3米，全长${n*3}米；${count}个种植位置。`;
      chart.setAttribute('aria-label',description);
      root.dataset.plantingPoints=String(count); root.dataset.plantingSegments=String(n);
      root.querySelector('[data-book-model-result]').textContent=description+(circle?'绕回起点仍是原来那个点；最后一段没有漏掉，起点没有重复。':`位置依次为${points.map(p=>`${p.i*3}米${p.planted?'种':'不种'}`).join('、')}。`);
      return true;
    }
  };
})();
