(() => {
  const unit = {
    label: '本轮深讲 · 四年级周长、面积与单位（本站原创）',
    courseTitle: '周长、面积与单位',
    title: '沿边走一圈，铺格算大小：周长、面积与单位',
    scope: '本课讲解、图示、互动和新增练习均为本站原创；保留路线原例与原自测题意、身份、链接及先修关系。教材版本、页码与逐讲映射待核，不冒称教材原题。',
    goal: '能区分周长（边界一圈的长度）和面积（图形铺开的大小），用统一单位计算长方形、正方形、平行四边形和三角形面积；能用单位换算、反例和回查检查答案。',
    idea: '先修：会用尺量长度、乘除法，并知道直角和垂直。周长沿边界量，面积像铺满不重不漏的单位方格；长度用厘米、米，面积用平方厘米、平方米。三角形的高必须是对所选底边的垂直距离；同底同高的平行四边形面积是一整份，三角形是它的一半。换单位先把长度单位统一，面积单位要平方换算；同一周长不一定同一面积。',
    example: {
      question: '长方形长 8、宽 5，面积是多少？',
      steps: [
        '先辨题目问面积，不是沿边一圈的周长；长和宽必须用同一长度单位。',
        '把长方形想成8列、5行的单位方格：每行8格，共8×5=40格。',
        '所以面积=长×宽=8×5=40平方单位；若边长用厘米，就是40平方厘米。',
        '回查：40个单位方格，横向8格、纵向5格；周长另算为2×(8+5)=26，不能混用。'
      ]
    },
    methodCard: {
      title: '先辨对象 → 统一单位 → 画边/铺格 → 选公式 → 回查',
      formula: '长方形周长=2×(长+宽)；长方形面积=长×宽；平行四边形面积=底×对应垂直高；三角形面积=底×对应垂直高÷2',
      when: '问边界一圈用周长；问铺满大小用面积。三角形的高必须垂直于所选底；涉及换算时先统一单位。',
      steps: ['圈出“周长”还是“面积”', '检查长度单位是否相同', '周长沿四周相加，面积数方格或用公式', '三角形确认对应垂直高并除2', '周长写长度单位，面积写平方单位，再反算回查'],
      check: '长度单位与面积单位不是一回事；1米=100厘米，但1平方米=10000平方厘米。周长相同不保证面积相同。'
    },
    diagrams: [
      {caption: '8×5长方形：沿边与铺格是两种问题', text: '沿边：8+5+8+5=26（长度单位）\n铺格：8列×5行=40（平方单位）\n同一图形，问题不同，单位和答案也不同。'},
      {caption: '三角形为什么除以2', text: '把一个底10、高6的三角形复制、翻转，拼成底10、高6的平行四边形。\n平行四边形面积10×6=60；一个三角形正好是一半，60÷2=30。高是垂直距离，不是斜边。'}
    ],
    concepts: [
      {title: '1. 周长是边界，面积是内部', text: '沿长方形四条边走一圈得到周长2×(长+宽)；铺满不重叠、不留空的单位方格得到面积长×宽。8×5长方形的周长是26个长度单位，面积是40个平方单位，两个数不能互换。'},
      {title: '2. 单位方格说明面积公式', text: '长方形横向有长个单位格、纵向有宽行，每行一样多，所以总格数是长×宽。每个1厘米×1厘米的小格是1平方厘米，不是1厘米。'},
      {title: '3. 三角形除以2有来由', text: '将三角形复制一份并翻转，可拼成同底同高的平行四边形。平行四边形面积是底×高，一个三角形占其中一半，所以三角形面积=底×对应垂直高÷2；斜边不一定是高。'},
      {title: '4. 换单位要同步换平方', text: '计算前把长度化为同一单位。1米=100厘米，但1平方米=(100厘米)×(100厘米)=10000平方厘米；不能把1平方米写成100平方厘米。加减面积也必须使用同一种面积单位。'},
      {title: '5. 同周长未必同面积', text: '3×5长方形周长2×(3+5)=16、面积15；2×6长方形周长也为16，但面积12。周长只管边界总长，面积还取决于长和宽怎样分配。'},
      {title: '6. 边界与反例检查', text: '面积不能把外框周长相加；周长不能数内部方格。把不垂直于所选底的斜边误当高会算错；高是顶点到所选底所在直线的垂直距离，可能在图形外。若出现不同单位、除以2漏掉或答案单位不对，先停下重查。'}
    ],
    model: {type: 'perimeter-area-grid'},
    practices: [
      {level: '起步 · 保留原自测', question: '底 10、高 6 的三角形面积是多少？', answers: ['30'], hint: '底×对应的垂直高后再除以2。', wrongFeedback: '10×6=60是同底同高平行四边形的面积；一个三角形占一半，所以还要÷2。', correctFeedback: '对，10×6÷2=30平方单位。', explanation: '复制并翻转一个同样的三角形可拼成面积60的平行四边形，一个三角形是一半，面积30平方单位。回查：30×2=60=10×6。'},
      {level: '辨认', question: '长方形长8、宽5，周长是多少？', answers: ['26'], hint: '沿四条边走一圈：2×(长+宽)。', wrongFeedback: '8×5=40是面积，不是周长；周长要把两条长和两条宽相加。', correctFeedback: '对，2×(8+5)=26个长度单位。', explanation: '周长=8+5+8+5=26；面积40平方单位是另一件事。'},
      {level: '铺格', question: '一个长6、宽4的长方形铺满单位方格，有多少个单位方格？', answers: ['24'], hint: '每行6格，共4行，把各行的小格合起来。', wrongFeedback: '周长是20；面积数内部方格，应该算6×4。', correctFeedback: '对，共6×4=24个单位方格。', explanation: '每行6格，共4行，6×4=24个平方单位。'},
      {level: '单位', question: '1平方米等于多少平方厘米？', answers: ['10000'], hint: '1米=100厘米，面积要把两个方向都换算。', wrongFeedback: '100是长度换算；面积有长和宽两个方向，100×100=10000。', correctFeedback: '对，1平方米=10000平方厘米。', explanation: '1平方米=1米×1米=100厘米×100厘米=10000平方厘米。'},
      {level: '对应高', question: '三角形底8、高5（高垂直于底），面积是多少？', answers: ['20'], hint: '5是对着底8的垂直高；先求同底同高平行四边形面积，再取一半。', wrongFeedback: '8×5=40是同底同高平行四边形的面积；三角形要除以2。', correctFeedback: '对，8×5÷2=20平方单位。', explanation: '底与对应垂直高相乘得40，再取拼成平行四边形的一半，面积20。'},
      {level: '条件辨析', question: '只知三角形底10、另一条斜边8，未给对应垂直高，能直接用10×8÷2求面积吗？能填1，不能填0。', answers: ['0'], hint: '另一条边不一定垂直于所选底；先检查8能否当作对应高。', wrongFeedback: '8只是斜边长，没有条件说明它垂直于底，不能直接当高。', correctFeedback: '对，填0。缺少对应垂直高，不能把斜边8直接代入。', explanation: '底×高÷2中的高必须是顶点到所选底所在直线的垂直距离。只给底10和另一边8，夹角未定，面积不唯一。'},
      {level: '反例', question: '3×5和2×6的长方形周长都是多少？它们的面积分别是多少？请按“周长,面积1,面积2”填写。', answers: ['16,15,12', '16 15 12'], hint: '周长都用2×(长+宽)，面积分别用长×宽。', wrongFeedback: '3+5=8、2+6=8，所以周长都是16；面积却分别是15和12，不能只看周长。', correctFeedback: '对：16，15，12。相同周长不代表相同面积。', explanation: '2×(3+5)=2×(2+6)=16；3×5=15，2×6=12。这是“同周长未必同面积”的反例。'},
      {level: '边界', question: '长方形长2米、宽50厘米，面积是多少平方厘米？', answers: ['10000'], hint: '先把2米换成200厘米，再算200×50。', wrongFeedback: '不能直接把2和50相乘；先统一为厘米，2米=200厘米。', correctFeedback: '对，200×50=10000平方厘米。', explanation: '2米=200厘米；面积=200厘米×50厘米=10000平方厘米。也就是1平方米。'},
      {level: '综合 · 回查', question: '正方形周长24厘米，面积是多少平方厘米？', answers: ['36'], hint: '先用周长÷4求边长，再用边长×边长。', wrongFeedback: '24是四条边的总长，边长是24÷4=6；面积不是24×4。', correctFeedback: '对，边长6厘米，面积6×6=36平方厘米。', explanation: '正方形四边相等，边长=24÷4=6厘米；面积=6×6=36平方厘米。回查周长4×6=24。'},
      {level: '迁移', question: '平行四边形底9、高4，面积是多少平方单位？', answers: ['36'], hint: '平行四边形是底×垂直高，不除以2。', wrongFeedback: '除以2是三角形公式；平行四边形整块面积是9×4。', correctFeedback: '对，9×4=36平方单位。', explanation: '平行四边形面积=底×高=9×4=36；若取它的一半才是相应三角形面积18。'}
    ],
    review: [
      {question: '怎样一眼区分周长和面积？', answer: '周长沿边界走一圈，单位是长度；面积是内部铺满的大小，单位是平方单位。'},
      {question: '三角形为什么要除以2，高要满足什么条件？', answer: '复制一个完全一样的三角形并转半圈，可与原图拼成同底同高的平行四边形，所以一个占一半；高必须是对所选底边的垂直距离。'},
      {question: '换算1平方米为什么不是100平方厘米？', answer: '1米=100厘米，面积有两个方向，所以1平方米=100×100=10000平方厘米。'},
      {question: '3×5与2×6说明了什么？', answer: '两者周长都为16，但面积分别是15和12；相同周长未必有相同面积。'},
      {question: '算完如何回查？', answer: '查长度单位是否统一、面积单位是否平方；用公式反算或数格子，并确认三角形高垂直、除2没有漏。'}
    ]
  };
  window.AOSHU_ELEMENTARY_DEEP_UNITS = Object.assign({}, window.AOSHU_ELEMENTARY_DEEP_UNITS || {}, {'4:perimeter-area': unit});

  const previous = window.AOSHU_FOUNDATION_WIDGETS;
  const type = 'perimeter-area-grid';
  const cases = [
    {kind:'rect', label:'矩形 8×5', w:8, h:5, perimeter:26, area:40},
    {kind:'rect', label:'矩形 3×5', w:3, h:5, perimeter:16, area:15},
    {kind:'rect', label:'矩形 2×6', w:2, h:6, perimeter:16, area:12},
    {kind:'tri', label:'三角形 底10×高6', w:10, h:6, perimeter:'（只演示底与高）', area:30}
  ];
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const svgFor = item => {
    const max = Math.max(item.w, item.h);
    const scale = Math.min(230 / max, 30);
    const x = 28, y = 18, width = item.w * scale, height = item.h * scale;
    const grid = [];
    if (item.kind === 'rect') {
      for (let i=1;i<item.w;i++) grid.push(`<line x1="${x+i*scale}" y1="${y}" x2="${x+i*scale}" y2="${y+height}" />`);
      for (let i=1;i<item.h;i++) grid.push(`<line x1="${x}" y1="${y+i*scale}" x2="${x+width}" y2="${y+i*scale}" />`);
      return `<svg viewBox="0 0 ${Math.max(300,x+width+28)} ${Math.max(190,y+height+45)}" role="img" aria-label="${esc(item.label)}：边界周长${item.perimeter}，方格面积${item.area}" focusable="false"><rect class="book-perimeter-shape" x="${x}" y="${y}" width="${width}" height="${height}" /><g class="book-perimeter-grid-lines">${grid.join('')}</g><text x="${x+width/2}" y="${y+height+28}" text-anchor="middle">${item.w} 格</text><text x="${x-8}" y="${y+height/2}" text-anchor="end" dominant-baseline="middle">${item.h}</text></svg>`;
    }
    const baseX=x, baseY=y+height, apexX=x+width*.25, apexY=y;
    return `<svg viewBox="0 0 345 205" role="img" aria-label="${esc(item.label)}：实线原三角形与虚线全等副本拼成平行四边形；底${item.w}、垂直高${item.h}，原三角形面积${item.area}；红色虚线为垂直高" focusable="false"><path class="book-perimeter-copy" d="M ${baseX+width} ${baseY} L ${apexX+width} ${apexY} L ${apexX} ${apexY} Z"/><path class="book-perimeter-triangle" d="M ${baseX} ${baseY} L ${baseX+width} ${baseY} L ${apexX} ${apexY} Z"/><path class="book-perimeter-height" d="M ${apexX} ${apexY} L ${apexX} ${baseY}"/><path class="book-perimeter-right" d="M ${apexX-8} ${baseY} L ${apexX-8} ${baseY-8} L ${apexX} ${baseY-8}"/><text x="${baseX+width/2}" y="${baseY+28}" text-anchor="middle">底 ${item.w}</text><text x="${apexX+10}" y="${(apexY+baseY)/2}" dominant-baseline="middle">高 ${item.h}</text></svg>`;
  };
  window.AOSHU_FOUNDATION_WIDGETS = {
    supports: value => value === type || (previous?.supports ? previous.supports(value) : false),
    markup(config) {
      if (config.type !== type) return previous?.markup ? previous.markup(config) : '';
      return `<section class="book-model-lab book-perimeter-area-lab" data-book-model="${type}" aria-label="周长面积方格实验台"><div class="book-model-heading"><b>沿边走一圈，还是铺满方格？</b><span>选择案例，观察边界周长与内部面积；三角形会标出垂直高。</span></div><div class="book-perimeter-controls"><label>图形案例<select data-foundation-model-control data-perimeter-case aria-label="选择周长面积案例">${cases.map((item,index) => `<option value="${index}">${esc(item.label)}</option>`).join('')}</select></label><label>显示<select data-foundation-model-control data-perimeter-view aria-label="选择显示内容"><option value="both">周长与面积</option><option value="boundary">只看边界周长</option><option value="area">只看铺格面积</option></select></label></div><div class="book-perimeter-svg" data-perimeter-svg></div><p class="book-model-result" data-book-model-result aria-live="polite"></p><p class="book-model-caption">方格线帮助数面积；虚线高必须垂直于底。这个互动只帮助观察，不会代替练习判分。</p></section>`;
    },
    update(root) {
      if (root?.dataset.bookModel !== type) return previous?.update ? previous.update(root) : false;
      const item = cases[Number(root.querySelector('[data-perimeter-case]')?.value || 0)] || cases[0];
      const view = root.querySelector('[data-perimeter-view]')?.value || 'both';
      const svg = root.querySelector('[data-perimeter-svg]');
      const result = root.querySelector('[data-book-model-result]');
      if (svg) { svg.innerHTML = svgFor(item); svg.dataset.view = view; }
      if (result) {
        if (item.kind === 'tri') result.textContent = view === 'boundary'
          ? '三角形的周长需要三条边长；只给底10与垂直高6，不能确定周长。虚线副本与红色高不是原三角形的边界。'
          : `底${item.w}×垂直高${item.h}÷2=${item.area}平方单位；虚线全等副本与原图拼成面积${item.w*item.h}的平行四边形，原三角形取一半。`;
        else {
          const perimeter = `周长=2×(${item.w}+${item.h})=${item.perimeter}个长度单位。`;
          const area = `面积=${item.w}×${item.h}=${item.area}个平方单位。`;
          result.textContent = (view === 'boundary' ? perimeter : view === 'area' ? area : perimeter + area) + ([2,3].includes(item.w) ? '3×5与2×6周长同为16，但面积分别为15与12。' : '每个小格边长是1个长度单位，面积是1个平方单位。');
        }
      }
      root.setAttribute('aria-label', item.kind === 'tri' ? `${item.label}互动：底${item.w}，垂直高${item.h}，面积${item.area}平方单位` : `${item.label}互动：周长${item.perimeter}，面积${item.area}`);
      return true;
    }
  };
})();
