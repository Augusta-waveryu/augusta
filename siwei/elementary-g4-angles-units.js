(() => {
  const unit = {
    label: '本轮深讲 · 角度、平行线与多边形（本站原创）',
    courseTitle: '角度、平行线与多边形',
    title: '从一束开口到整幅图：角度、平行线与多边形',
    scope: '本课讲解、图示、互动和新增练习均为本站原创；保留路线原例与原自测题意、身份、链接及先修关系。教材版本、页码与逐讲映射待核，不复制外部版权内容，也不冒称教材原题。',
    goal: '能把角看成两条射线的开口而不是线段长度，灵活使用90°、180°、360°，三角形和凸多边形内角和；在明确给出平行条件时识别同位角、内错角，并用反例和回查判断条件是否足够。',
    idea: '先看图形与条件，再找总和或平行关系。角的大小是两射线的张开程度，不是边画得长短；直角90°、平角180°、整周360°。三角形内角和180°；从一个顶点向其余不相邻顶点连对角线，可把凸n边形分成n−2个三角形，所以内角和为(n−2)×180°。同位角、内错角相等只在两线平行且有截线时成立；不平行或条件不足，不能套结论。',
    example: {
      question: '三角形两个角是 50° 和 60°，第三个角多少度？',
      steps: [
        '列总和：题目给的是三角形，三角形三个内角的总和是180°，所以设未知角为x，有50°+60°+x=180°。',
        '相减求角：先合并已知角：50°+60°=110°，再算x=180°−110°=70°，因为未知角是总和扣掉已知部分。',
        '核验答案：把70°放回去：50°+60°+70°=180°，符合三角形内角和，所以第三个角是70°。'
      ]
    },
    methodCard: {
      title: '辨开口 → 找条件 → 选总和/平行关系 → 计算 → 回查',
      formula: '直角=90°；平角=180°；整周=360°；三角形=180°；凸n边形=(n−2)×180°',
      when: '先圈出“平行”是否真的给出，再判断是同位角/内错角、同一直线补角、整周，还是多边形内角和。',
      steps: ['把角当作两射线的开口来读，不量线段长', '检查图中是否明确两线平行及角的位置', '写出总和或相等关系再减法', '把答案带回原图逐项相加', '若条件不足，回答“不能确定”并指出缺哪条条件'],
      check: '本课用凸多边形演示从同一顶点剖分；不把公式套到边相交的星形。总和除以边数得到的是平均角；只有另外知道各内角相等，才是每个角的度数，正多边形就满足。'
    },
    diagrams: [
      {caption: '角是开口，不是线段长度', text: '两条射线共用一个端点；把射线延长，开口大小不变。线画得长或短，不会改变角度。'},
      {caption: '凸多边形为何出现 n−2', text: '从同一顶点向不相邻顶点连对角线：三角形、四边形、五边形、六边形分别得到1、2、3、4个三角形。'},
      {caption: '平行线的对应位置', text: '两条明确平行的直线被一条截线穿过；同位角在两个交点的同一相对位置，内错角在截线两侧且夹在两平行线之间。'}
    ],
    concepts: [
      {title: '1. 角看开口', text: '角由有共同端点的两条射线组成，大小表示开口张开多少。射线可以无限延伸，边画长画短都不改变角；不能把角当成一条线段的长度。90°是直角，180°是平角，360°是一周。'},
      {title: '2. 三角形与平角', text: '同一直线上的相邻角组成平角，和为180°；绕一点转一周的角和为360°。三角形三个内角和为180°，已知部分就用180°减去它们的和。'},
      {title: '3. 凸多边形的三角形剖分', text: '从一个顶点向所有不相邻顶点连对角线，凸n边形不会交叉，恰好分成n−2个三角形。因此内角和=(n−2)×180°：四边形360°、五边形540°、六边形720°。'},
      {title: '4. 平行线与截线', text: '只有题目明确说两条直线平行（或给出足以证明平行的条件），被第三条直线截出时，才可用同位角相等、内错角相等。图上要按位置认：同位角是两个交点的同一相对角，内错角在两平行线之间、截线两侧。想象把上交点的角沿截线平移到下交点：平行线方向相同，对应射线重合，所以同位角相等；再用对顶角相等，可得到内错角相等。'},
      {title: '5. 每个角相等需要额外条件', text: '一般凸多边形只知道总内角和，不能说每个角等于平均角。必须另外知道“各内角相等”，例如正n边形，才能求每个内角为(n−2)×180°÷n。正多边形还要求各边相等，但本题求角只用到等角条件。'},
      {title: '6. 反例与边界', text: '两线没有平行条件时，即使图看起来像平行，也不能套同位角或内错角相等；题目只给一个角而未给平行、直线、三角形等条件时，可能无法确定。反例：固定上面一条线和截线，只旋转下面一条线，上交点的角不变，下交点的角却会改变；没有平行条件就不能确定。先写条件，再算数。'}
    ],
    model: {type: 'angles-relations'},
    practices: [
      {level: '起步 · 保留原自测', question: '一个平角被分成两个角，其中一个是 125°，另一个是多少度？', answers: ['55'], hint: '两个角相加等于 180°。', wrongFeedback: '平角不是整周360°；同一直线上的两个相邻角和为180°，应算180−125。', correctFeedback: '对，180−125=55°。', explanation: '平角由一条直线的两条反向射线组成，分成的两个相邻角合计180°；回查125°+55°=180°。'},
      {level: '直角', question: '直角被分成两个角，其中一个是35°，另一个是多少度？', answers: ['55'], hint: '直角总和是90°，用90减去已知角。', wrongFeedback: '90°是直角总和，不是360°；另一个角=90−35。', correctFeedback: '答对：55°，回查35°+55°=90°。', explanation: '两个相邻角拼成直角，所以35+ x=90，x=55°。'},
      {level: '整周', question: '绕一点转一周，已有三个角90°、120°、80°，剩余角是多少度？', answers: ['70'], hint: '整周360°，先加已知三个角再相减。', wrongFeedback: '不要用180°；整周是360°，已知和为290°，剩70°。', correctFeedback: '答对：360−(90+120+80)=70°。', explanation: '绕同一点一周的所有角组成360°；290°+70°=360°。'},
      {level: '三角形', question: '三角形两个角是50°和60°，第三个角是多少度？', answers: ['70'], hint: '三角形内角和180°，用180−50−60。', wrongFeedback: '50+60=110°只是两个已知角的和，不是第三角；第三角要用总和180°减去110°。', correctFeedback: '答对：180−50−60=70°。', explanation: '三角形内角和为180°；50+60+70=180°，带回去核验成立。'},
      {level: '平行关系', question: '两条直线明确平行，一条截线形成一对同位角；其中一个是68°，另一个是多少度？', answers: ['68'], hint: '题目给出平行条件，且是同位角。', wrongFeedback: '同位角在平行线被截时相等，不是相加成180°；答案仍为68°。', correctFeedback: '答对：同位角相等，另一个是68°。', explanation: '平行线与截线的同位角位置相同，大小相等；关键条件是“两条直线平行”。'},
      {level: '条件辨析', question: '两条直线看起来像平行，但题目没有说明平行；一条截线旁的角是68°，能否确定对应位置的另一个角？能填1，不能填0。', answers: ['0'], hint: '先检查是否有“平行”这个条件，而不是只看画得像不像。', wrongFeedback: '图形外观不能代替条件；未给平行，不能使用同位角相等。', correctFeedback: '对，填0。没有平行条件，另一个角可能改变，不能确定。', explanation: '同位角相等是平行线定理的使用结果，不是任意两条线都成立；题目缺少平行条件。'},
      {level: '四边形', question: '凸四边形三个内角是90°、80°、100°，第四个内角是多少度？', answers: ['90'], hint: '凸四边形可分成2个三角形，内角和为360°。', wrongFeedback: '四边形不是180°；总和是(4−2)×180°=360°，所以第四角为90°。', correctFeedback: '答对：360−90−80−100=90°。', explanation: '从一个顶点分成两个三角形，内角和360°；回查90+80+100+90=360°。'},
      {level: '五边形', question: '凸五边形四个内角分别是100°、110°、95°、105°，第五个内角是多少度？', answers: ['130'], hint: '五边形内角和=(5−2)×180°=540°。', wrongFeedback: '五边形要分成3个三角形，总和540°；已知和410°，剩130°。', correctFeedback: '答对：540−(100+110+95+105)=130°。', explanation: '从同一顶点连两条对角线，得到3个三角形；540−410=130°。'},
      {level: '六边形', question: '凸六边形的内角和是多少度？', answers: ['720'], hint: '从一个顶点分成6−2=4个三角形。', wrongFeedback: '不要把边数直接乘180°；三角形个数是n−2=4，所以4×180=720°。', correctFeedback: '答对：4个三角形各180°，合计720°。', explanation: '凸六边形可剖分为4个三角形，内角和=(6−2)×180°=720°；互动图中从同一顶点画3条对角线，得到4个三角形，也可回查。'},
      {level: '正多边形', question: '正五边形每个内角是多少度？', answers: ['108'], hint: '先求五边形总和540°，再因“正”而平均分给5个相等的角。', wrongFeedback: '540°是五个角的总和；本题“正五边形”保证五个角相等，所以540÷5=108°。', correctFeedback: '答对：540÷5=108°。', explanation: '五边形总和为540°；正五边形各内角相等，所以每个为540÷5=108°。只知道五边形而没有等角条件，就不能确定每个角。'}
    ],
    review: [
      {question: '角是什么？', answer: '角是有共同端点的两条射线形成的开口，边画长短不改变角度，不是线段长度。'},
      {question: '为什么凸n边形是(n−2)×180°？', answer: '从一个顶点向不相邻顶点连对角线，得到n−2个三角形；每个180°。'},
      {question: '何时能用同位角、内错角相等？', answer: '必须明确两条直线平行，并有同一条截线；看清同一相对位置或两平行线之间的交错位置。'},
      {question: '只知道凸多边形的边数，能确定每个内角吗？', answer: '不能。内角和除以边数只能得到平均角；还要知道各内角相等，例如正多边形，才能确定每个角。矩形虽然可能不是正方形，但各角都相等，也能用360°÷4=90°。'}
    ]
  };
  window.AOSHU_ELEMENTARY_DEEP_UNITS = Object.assign({}, window.AOSHU_ELEMENTARY_DEEP_UNITS || {}, {'4:angles': unit});

  const previous = window.AOSHU_FOUNDATION_WIDGETS;
  const type = 'angles-relations';
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const parallelSvg = (mode) => {
    const alternate = mode === 'alternate';
    const description = alternate ? '内错角A在上交点左下，B在下交点右上；两角在平行线之间、截线两侧' : '同位角A和B分别在两个交点的右上方，是同一相对位置';
    // The transversal x+y=250 meets y=50 and y=130 at (200,50) and (120,130).
    // Both radius-24 arc endpoints lie on the two rays forming their marked angle.
    const arcA = alternate ? 'M 176 50 A 24 24 0 0 0 183.0294 66.9706' : 'M 224 50 A 24 24 0 0 0 216.9706 33.0294';
    const arcB = 'M 144 130 A 24 24 0 0 0 136.9706 113.0294';
    return `<svg viewBox="0 0 320 190" role="img" aria-label="已知l₁∥l₂；${esc(description)}，所以A=B" focusable="false"><line class="angle-parallel-line" x1="24" y1="50" x2="296" y2="50"/><line class="angle-parallel-line" x1="24" y1="130" x2="296" y2="130"/><line class="angle-transversal" x1="80" y1="170" x2="240" y2="10"/><path class="angle-arc angle-arc-a" d="${arcA}"/><path class="angle-arc angle-arc-b" d="${arcB}"/><text x="35" y="26">l₁ ∥ l₂</text><text x="278" y="43">l₁</text><text x="278" y="123">l₂</text><text class="angle-letter" x="${alternate ? 155 : 239}" y="${alternate ? 79 : 32}">A</text><text class="angle-letter" x="158" y="112">B</text><text x="237" y="175">A = B</text></svg>`;
  };
  const polygonSvg = (n) => {
    const cx=120, cy=86, r=62, pts=[];
    for(let i=0;i<n;i++){const a=-Math.PI/2+i*2*Math.PI/n;pts.push([cx+r*Math.cos(a),cy+r*Math.sin(a)]);}
    const pointString=pts.map(p=>p.map(v=>v.toFixed(1)).join(',')).join(' ');
    const diagonals=pts.slice(2,-1).map(p=>`<line class="angle-diagonal" x1="${pts[0][0].toFixed(1)}" y1="${pts[0][1].toFixed(1)}" x2="${p[0].toFixed(1)}" y2="${p[1].toFixed(1)}"/>`).join('');
    return `<svg viewBox="0 0 240 180" role="img" aria-label="凸${n}边形，从同一顶点画${n-3}条对角线，剖分为${n-2}个三角形，内角和${(n-2)*180}度" focusable="false"><polygon class="angle-polygon" points="${pointString}"/>${diagonals}<circle class="angle-vertex" cx="${pts[0][0]}" cy="${pts[0][1]}" r="4"/><text x="120" y="169" text-anchor="middle">${n-2} × 180° = ${(n-2)*180}°</text></svg>`;
  };
  window.AOSHU_FOUNDATION_WIDGETS = {
    supports: value => value === type || (previous?.supports ? previous.supports(value) : false),
    markup(config) {
      if (config.type !== type) return previous?.markup ? previous.markup(config) : '';
      return `<section class="book-model-lab book-angles-lab" data-book-model="${type}" aria-label="角度平行线多边形互动实验台"><div class="book-model-heading"><b>先看位置，再写关系</b><span>切换平行线角的位置，或从同一顶点观察凸多边形的三角形剖分。</span></div><div class="book-angles-controls"><label>平行线角位置<select data-foundation-model-control data-angle-parallel aria-label="选择平行线角的位置"><option value="corresponding">同位角</option><option value="alternate">内错角</option></select></label><label>凸多边形边数<select data-foundation-model-control data-angle-polygon aria-label="选择凸多边形边数"><option value="3">三边形</option><option value="4">四边形</option><option value="5">五边形</option><option value="6">六边形</option></select></label></div><div class="book-angles-panels"><figure><div class="book-angles-svg" data-angle-parallel-svg></div><figcaption data-angle-position-caption></figcaption></figure><figure><div class="book-angles-svg" data-angle-polygon-svg></div><figcaption>红点为共同起点；数一数分出了几个三角形。</figcaption></figure></div><p class="book-model-result" data-book-model-result aria-live="polite"></p><p class="book-model-caption">图中“l₁∥l₂”标注才是已知平行条件，不能只凭两条实线看起来平行。多边形画成规则形状便于数三角形；剖分方法也适用于不规则的凸多边形。</p></section>`;
    },
    update(root) {
      if (root?.dataset.bookModel !== type) return previous?.update ? previous.update(root) : false;
      const parallel = root.querySelector('[data-angle-parallel]')?.value || 'corresponding';
      const rawN = Number(root.querySelector('[data-angle-polygon]')?.value || 3);
      const n = Number.isInteger(rawN) && rawN >= 3 && rawN <= 6 ? rawN : 3;
      const psvg=root.querySelector('[data-angle-parallel-svg]'); const gsvg=root.querySelector('[data-angle-polygon-svg]'); const result=root.querySelector('[data-book-model-result]');
      const caption = root.querySelector('[data-angle-position-caption]');
      if (caption) caption.textContent = parallel === 'alternate' ? '内错角：A在上交点左下，B在下交点右上；在两平行线之间、截线两侧。' : '同位角：A与B都在各自交点的右上方，是同一相对位置。';
      if(psvg) psvg.innerHTML=parallelSvg(parallel); if(gsvg) gsvg.innerHTML=polygonSvg(n);
      if(result) result.textContent = `${parallel==='alternate'?'内错角':'同位角'}：图中 l₁∥l₂，所以标出的两个角相等；凸${n}边形从同一顶点分成${n-2}个三角形，内角和为${(n-2)*180}°。`;
      root.setAttribute('aria-label', `平行线${parallel==='alternate'?'内错角':'同位角'}与凸${n}边形剖分互动`);
      return true;
    }
  };
})();
