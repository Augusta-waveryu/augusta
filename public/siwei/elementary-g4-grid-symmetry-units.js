(() => {
  const unit = {
    label: '本轮深讲 · 四年级格点与对称（本站原创）',
    courseTitle: '格点、对称与坐标观察',
    title: '数格看间隔，找镜像要沿垂线走',
    scope: '本站精选路线，序号不是教材讲次；教材版本、页码及逐讲映射待核。本课讲解、图示和新增练习均为本站原创，保留原例题和原自测语义，不是教材或杯赛原题。只讨论等距正方形网格、向右与向上为正的坐标，以及竖直或水平轴的镜像；中心对称只作辨认，不要求负数坐标或矩形组合计数。',
    goal: '区分单位小格与格点，按先横后纵读坐标；用垂直、等距、分居两侧找镜像点，理解轴上点不动，并区别轴对称与中心对称。',
    idea: '先修：会按行列相乘、数相邻刻度间隔，认识直角。坐标(x,y)像点的地址：从原点先向右x格，再向上y格。镜像不是随便找一个离轴一样远的点，而是沿垂直于轴的方向跨过去，走同样远。',
    example: {
      question: '一个 4 格宽、3 格高的长方形占多少个单位小格？',
      steps: ['先圈清对象：问的是边长1格的单位小格，不是所有大小的长方形，也不是格线交点。', '横向4个间隔，意味着每行4个小格；纵向3个间隔，意味着共有3行。', '按行数：4+4+4=12，也可算4×3=12个单位小格。', '边界格点另算：横向5个、纵向4个，共5×4=20个。12与20数的是不同对象，不能混用。']
    },
    methodCard: {
      title: '辨对象 → 定原点与方向 → 按格走 → 回查',
      formula: '竖直轴x=a：镜像横坐标=2×a−原横坐标，纵坐标不变；水平轴y=b时反过来',
      when: '数单位小格先看行列；读点的位置先定坐标；找竖直或水平轴的镜像时，沿垂直方向数到轴再数出去。公式是数格的简写，不必先背。',
      steps: ['分清问小格、格点还是对称点', '确认原点、横纵方向与一格单位', '先横后纵读坐标；镜像先数到轴的距离', '沿垂线跨轴走同样远，轴上点不动', '查对应点连线垂直于轴、被轴平分；再镜像一次应回到原始点A'],
      check: '只检查离轴等距还不够；竖直轴两侧的对应点必须在同一水平线上。对称轴是能让整个图形对折重合的直线，不是随便一条平分面积的线。'
    },
    concepts: [
      {title: '1. 小格与格点，不是同一件东西', text: '一行4个小格，两头也算在内，有5个格点。4格宽、3格高的完整网格有12个单位小格，却有20个格点。这里数的是完整网格上含边界的所有交点；若只数内部点，不能直接用这个数。'},
      {title: '2. 坐标是有顺序的地址', text: '(2,3)表示从原点先向右2格，再向上3格；(3,2)是另一个点。坐标数的是离原点几个单位间隔，不把原点再算作第1格。两条坐标轴上的点也有地址，例如(0,3)。'},
      {title: '3. 对应点要沿垂线、跨轴、等距', text: '竖直轴x=3是所有横坐标为3的点组成的直线。A(1,2)到轴横向2格，另一侧再走2格到A′(5,2)。纵坐标2不变，横坐标1与5的平均数是3；镜像两次回到A。'},
      {title: '4. 等距还不够，轴上点不用搬', text: 'B(5,4)也离x=3两格，但不是A(1,2)的镜像：两点不在同一水平线上，连线不垂直于轴。若点A是(3,2)，它就在轴上，镜像仍为(3,2)，不必强行放到“另一侧”。'},
      {title: '5. 换成水平轴，保持的是横坐标', text: '关于水平轴y=3，A(2,1)向上2格到轴，再向上2格到(2,5)。横坐标2不变；不能无论什么轴都只改横坐标。'},
      {title: '6. 对折与转半圈是两种检验', text: '非正方形的长方形只有穿过中心的横、竖两条对称轴，沿对角线折不能重合；正方形另有两条对角线，共4条。中心对称则是绕一个固定点转180°后整个图形重合。一般斜平行四边形有中心对称，却没有对称轴；不能把转半圈当作对折。'}
    ],
    model: {type: 'grid-mirror'},
    diagrams: [{caption: '先数间隔，再数交点', text: '一行：●—●—●—●—●\n       4个间隔，5个格点\n4格宽×3格高：12个单位小格\n5列格点×4行格点：20个格点（含边界）'}, {caption: '竖直轴x=3的两个检查', text: 'A(1,2) → 轴(3,2) → A′(5,2)\n         2格         2格\n同一水平线，连线垂直于轴；两段等长\nB(5,4)虽也离轴2格，却不在这条水平线上，不是A的镜像。'}],
    practices: [
      {level:'起步 · 保留原自测', question:'从左下角原点向右数 2 格、向上数 3 格，到达的格点坐标是多少？', answers:['(2,3)'], hint:'先写横向，再写纵向，用括号和逗号写成(x,y)。', wrongFeedback:'(3,2)把顺序反了。向右2是横坐标，向上3是纵坐标；原点不是额外的一格。', correctFeedback:'对，坐标是(2,3)：先横2，再纵3。', explanation:'从原点向右2格到横坐标2，再向上3格到纵坐标3，得到(2,3)。'},
      {level:'辨对象 · 数格点', question:'4格宽、3格高的完整网格，含边界一共有多少个格点？', answers:['20'], hint:'每行比小格数多1个点，格点的行数也比小格行数多1。', wrongFeedback:'12是单位小格数，不是格点数。横向有5个点，纵向有4行点，边界也要计入。', correctFeedback:'对，(4+1)×(3+1)=20个格点，单位小格仍是12个。', explanation:'横向4个间隔有5个格点，纵向3个间隔有4行格点，共5×4=20。'},
      {level:'应用 · 竖直轴镜像', question:'A(1,2)关于竖直轴x=3的镜像点坐标是多少？', answers:['(5,2)'], hint:'从横坐标1到轴3有2格，再向右走2格；纵坐标不变。', wrongFeedback:'不能只交换横纵坐标，也不能把横坐标加3。轴在x=3，从1走2格到轴，再走2格到5。', correctFeedback:'对，镜像点是(5,2)；它与A同高，到轴都是2格。', explanation:'横向距离3−1=2，镜像横坐标3+2=5；纵坐标保持2，所以是(5,2)。'},
      {level:'反例 · 等距还不够', question:'A(1,2)与B(5,4)都离竖直轴x=3两格。B是A关于这条轴的镜像吗？（是填1，不是填0）', answers:['0'], hint:'除了到轴等距，两点是否在同一水平线上？', wrongFeedback:'只满足等距不够。竖直轴镜像不改变纵坐标，A的纵坐标2与B的4不同。', correctFeedback:'对，填0；A真正的镜像是(5,2)，不是(5,4)。', explanation:'两点连线不垂直于竖直轴；镜像应保持纵坐标2，所以B不是A的镜像。'},
      {level:'边界 · 轴上点', question:'点(3,2)关于竖直轴x=3的镜像点坐标是多少？', answers:['(3,2)'], hint:'这个点到轴的距离是多少？', wrongFeedback:'点已在轴上，到轴0格；对折时它留在原位，不用搬到别处。', correctFeedback:'对，轴上点不动，仍为(3,2)。', explanation:'横坐标3等于轴的位置，到轴距离0；另一侧也是0，所以镜像点就是自身。'},
      {level:'迁移 · 换成水平轴', question:'点(2,1)关于水平轴y=3的镜像点坐标是多少？', answers:['(2,5)'], hint:'水平轴镜像保持横坐标；纵向从1到3，再走同样远。', wrongFeedback:'水平轴不是竖直轴：要改变纵坐标，横坐标2保持不变。1到3有2格，再走2格到5。', correctFeedback:'对，是(2,5)；两点在同一竖线上，到水平轴各2格。', explanation:'3−1=2，镜像纵坐标3+2=5，横坐标2不变，得到(2,5)。'},
      {level:'辨析 · 对称轴数量', question:'长4、宽3的长方形有几条对称轴？', answers:['2'], hint:'想一想沿对角线折，两侧真能完全重合吗？', wrongFeedback:'4条是正方形的结论。长4宽3不相等，沿对角线折不能重合，只有两条中线。', correctFeedback:'对，只有横、竖两条中线；两条对角线不是它的对称轴。', explanation:'两条中线对折可以重合；非正方形长方形沿对角线对折不能重合，所以共2条。'},
      {level:'辨析 · 旋转不等于对折', question:'一个既不是长方形也不是菱形的平行四边形，绕两条对角线交点转180°可重合。它一定有对称轴吗？（一定填1，不一定填0）', answers:['0'], hint:'中心对称检查转半圈，轴对称检查沿直线对折。', wrongFeedback:'转半圈重合只说明中心对称，不能推出存在对称轴；一般斜平行四边形就是反例。', correctFeedback:'对，填0；中心对称不保证轴对称。', explanation:'一般斜平行四边形绕对角线交点转180°重合，却不能沿某条直线对折重合。两种对称要分别检验。'}
    ],
    review: [
      {question:'为什么4格宽的一行不是4个格点？',answer:'4格是4个间隔，算上两端共5个格点。数之前先确定对象。'},
      {question:'只说两点到轴一样远，能保证互为镜像吗？',answer:'不能。对轴外的对应点，还要在轴两侧，连线垂直于轴；轴上点的镜像是自身。'},
      {question:'竖直轴和水平轴各保持哪个坐标？',answer:'竖直轴保持纵坐标，水平轴保持横坐标；另一个坐标沿垂线跨轴等距改变。'},
      {question:'能转半圈重合，就一定能对折重合吗？',answer:'不一定。一般斜平行四边形有中心对称而无对称轴。'}
    ]
  };
  window.AOSHU_ELEMENTARY_DEEP_UNITS = Object.assign({}, window.AOSHU_ELEMENTARY_DEEP_UNITS || {}, {'4:grid-symmetry':unit});
  const previous = window.AOSHU_FOUNDATION_WIDGETS;
  if (!previous) return;
  const type = 'grid-mirror';
  const bounded = (value, fallback) => {const n=Number(value);return Number.isInteger(n)&&n>=0&&n<=6?n:fallback;};
  window.AOSHU_FOUNDATION_WIDGETS = {
    supports: value => value===type || previous.supports(value),
    markup(config) {
      if(config.type!==type) return previous.markup(config);
      const options = Array.from({length:7},(_,n)=>`<option value="${n}"${n===1?' selected':''}>${n}</option>`).join('');
      return `<section class="book-model-lab book-foundation-lab book-grid-mirror" data-book-model="${type}" aria-label="格点镜像实验台"><div class="book-model-heading"><b>先预测镜像点，再对照格子</b><span>每格1单位；实心圆是A，空心方块是A′。先试A(1,2)，再试轴上的点和假候选B。</span></div><div class="book-foundation-controls"><label>横坐标x<select data-foundation-model-control data-mirror-x aria-label="原始点A的横坐标">${options}</select></label><label>纵坐标y<select data-foundation-model-control data-mirror-y aria-label="原始点A的纵坐标">${options.replace('value="1" selected','value="1"').replace('value="2"','value="2" selected')}</select></label><label>对称轴<select data-foundation-model-control data-mirror-axis aria-label="镜像对称轴"><option value="vertical">竖直轴x=3</option><option value="horizontal">水平轴y=3</option></select></label><label>观察方式<select data-foundation-model-control data-mirror-view aria-label="镜像观察方式"><option value="predict">只看A，先自己预测</option><option value="mirror">显示真正的镜像A′</option><option value="counterexample">固定反例A(1,2)、B(5,4)</option></select></label></div><div data-mirror-plot></div><p class="book-model-result" data-book-model-result aria-live="polite"></p><p class="book-model-caption">反例模式固定使用竖直轴x=3，坐标选择暂不适用。网格等比例；实线连接对应点，虚线只连接错误候选。此操作不记答题进度。</p></section>`;
    },
    update(root) {
      if(root?.dataset.bookModel!==type) return previous.update(root);
      const view=root.querySelector('[data-mirror-view]')?.value||'predict',counter=view==='counterexample';
      for(const [selector,value] of [['[data-mirror-x]','1'],['[data-mirror-y]','2'],['[data-mirror-axis]','vertical']]) {
        const control=root.querySelector(selector);
        if(control) {control.disabled=counter;if(counter)control.value=value;}
      }
      const vertical=counter || root.querySelector('[data-mirror-axis]')?.value!=='horizontal';
      const x=counter?1:bounded(root.querySelector('[data-mirror-x]')?.value,1), y=counter?2:bounded(root.querySelector('[data-mirror-y]')?.value,2);
      const mx=vertical?6-x:x, my=vertical?y:6-y, distance=Math.abs((vertical?x:y)-3),fixed=distance===0;
      root.dataset.mirrorX=String(mx);root.dataset.mirrorY=String(my);
      const px=n=>40+40*n,py=n=>290-40*n;
      let grid=''; for(let n=0;n<=6;n++)grid+=`<path d="M${px(n)} 50V290 M40 ${py(n)}H280" stroke="#d4ddd5" fill="none"/><text x="${px(n)}" y="309" text-anchor="middle">${n}</text><text x="27" y="${py(n)+5}" text-anchor="middle">${n}</text>`;
      const axis=vertical?'<path d="M160 40V290"/>':'<path d="M40 170H290"/>';
      let marks=`<circle cx="${px(x)}" cy="${py(y)}" r="6" fill="#265d3c"/><text x="${px(x)+9}" y="${py(y)-10}">A</text>`;
      if(counter) marks+=`<path d="M${px(x)} ${py(y)}L${px(5)} ${py(4)}" stroke="#a35a24" stroke-dasharray="5 4"/><path d="M${px(5)-6} ${py(4)-6}l12 12m0 -12l-12 12" stroke="#a35a24" stroke-width="3"/><text x="${px(5)+9}" y="${py(4)-10}">B</text>`;
      if(view==='mirror'||counter)marks+=`<path d="M${px(x)} ${py(y)}L${px(mx)} ${py(my)}" stroke="#33748f" stroke-width="2"/><rect x="${px(mx)-8}" y="${py(my)-8}" width="16" height="16" fill="none" stroke="#33748f" stroke-width="2"/><text x="${px(mx)+10}" y="${py(my)+23}">A′</text>`;
      const axisName=vertical?'x=3':'y=3';
      const result=counter?'A(1,2)和B(5,4)离竖直轴x=3都是2格，但纵坐标不同，连线不垂直于轴。真正的镜像是A′(5,2)，不能只检查等距。':view==='predict'?`A(${x},${y})，对称轴${axisName}。先数到轴有${distance}格，再预测镜像坐标；选“显示真正的镜像A′”核对。`:`A(${x},${y}) → A′(${mx},${my})，轴${axisName}，到轴距离${distance}格。${fixed?'A在轴上，圆与方块在同一点，镜像不动。':vertical?'纵坐标不变，连线水平且垂直于竖直轴；轴两侧各走同样远。':'横坐标不变，连线竖直且垂直于水平轴；轴两侧各走同样远。'}再镜像一次回到A(${x},${y})。`;
      root.querySelector('[data-mirror-plot]').innerHTML=`<svg viewBox="0 0 340 335" role="img" aria-label="${result}"><g font-size="14" fill="#263d31">${grid}<path d="M40 40V290H300" fill="none" stroke="#263d31" stroke-width="2"/><text x="308" y="295">x</text><text x="36" y="30">y</text><g stroke="#a64e72" stroke-width="3" stroke-dasharray="7 4">${axis}</g><text x="${vertical?165:44}" y="${vertical?37:162}" fill="#8d3b60">${axisName}</text>${marks}</g></svg>`;
      root.querySelector('[data-book-model-result]').textContent=result;
      return true;
    }
  };
})();
