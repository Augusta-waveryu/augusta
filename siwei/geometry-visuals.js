(() => {
  const params = new URLSearchParams(location.search);
  if (params.get('branch') !== 'geometry') return;

  const intro = document.getElementById('bc-intro');
  if (intro && !document.querySelector('.bc-geometry-promise')) {
    const promise = document.createElement('div');
    promise.className = 'bc-geometry-promise';
    promise.innerHTML = '<span>8 个知识点，各有配套示意图</span><span>可拖动旋转的 3D 立体实验</span>';
    intro.insertAdjacentElement('afterend', promise);
  }

  const svgNumber = (value) => Number(value.toFixed(2));
  const angleArc = (vertex, radius, fromDegrees, toDegrees, color, width = 2.5) => {
    let delta = (toDegrees - fromDegrees) % 360;
    if (delta > 180) delta -= 360;
    if (delta <= -180) delta += 360;
    const point = (degrees) => {
      const radians = degrees * Math.PI / 180;
      return [svgNumber(vertex.x + radius * Math.cos(radians)), svgNumber(vertex.y + radius * Math.sin(radians))];
    };
    const [x1, y1] = point(fromDegrees);
    const [x2, y2] = point(fromDegrees + delta);
    return `<path d="M${x1} ${y1}A${radius} ${radius} 0 0 ${delta >= 0 ? 1 : 0} ${x2} ${y2}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round"/>`;
  };
  const angleLabel = (vertex, radius, fromDegrees, toDegrees, text, color) => {
    let delta = (toDegrees - fromDegrees) % 360;
    if (delta > 180) delta -= 360;
    if (delta <= -180) delta += 360;
    const radians = (fromDegrees + delta / 2) * Math.PI / 180;
    const x = svgNumber(vertex.x + radius * Math.cos(radians));
    const y = svgNumber(vertex.y + radius * Math.sin(radians));
    return `<text x="${x}" y="${y}" text-anchor="middle" class="g-label" fill="${color}">${text}</text>`;
  };
  const angleSumDrawing = () => {
    const baseY = 150, height = 112;
    const leftRun = height / Math.tan(50 * Math.PI / 180);
    const rightRun = height / Math.tan(60 * Math.PI / 180);
    const A = { x: 180 - (leftRun + rightRun) / 2, y: baseY };
    const B = { x: A.x + leftRun, y: baseY - height };
    const C = { x: A.x + leftRun + rightRun, y: baseY };
    const angleAB = Math.atan2(B.y - A.y, B.x - A.x) * 180 / Math.PI;
    const angleBA = Math.atan2(A.y - B.y, A.x - B.x) * 180 / Math.PI;
    const angleBC = Math.atan2(C.y - B.y, C.x - B.x) * 180 / Math.PI;
    const angleCB = Math.atan2(B.y - C.y, B.x - C.x) * 180 / Math.PI;
    return `<path d="M${svgNumber(B.x - 47)} ${B.y}H${svgNumber(B.x + 47)}" stroke="#91a591" stroke-width="1.7" stroke-dasharray="5 4"/><path d="M${svgNumber(A.x)} ${baseY}L${svgNumber(B.x)} ${B.y}L${svgNumber(C.x)} ${baseY}Z" fill="#e8f2e5" stroke="#548366" stroke-width="3" stroke-linejoin="round"/>${angleArc(A, 17, 0, angleAB, '#d48e63')}${angleArc(B, 12, 180, angleBA, '#d48e63', 2)}${angleArc(B, 21, angleBA, angleBC, '#6d86a0')}${angleArc(B, 12, angleBC, 0, '#bd805c', 2)}${angleArc(C, 17, 180, angleCB, '#bd805c')}${angleLabel(A, 36, 0, angleAB, '50°', '#a96542')}${angleLabel(B, 38, angleBA, angleBC, 'x', '#426e83')}${angleLabel(C, 36, 180, angleCB, '60°', '#426e83')}<text x="${svgNumber(B.x)}" y="22" text-anchor="middle" class="g-note">过顶点作底边平行线</text><rect x="67" y="168" width="226" height="24" rx="12" fill="#f6f2e8"/><text x="180" y="185" text-anchor="middle" class="g-note">50° + 60° + x = 180°</text>`;
  };

  const illustrations = {
    angles: {
      caption: '底角按 50°、60°绘制；顶点处的平行线把两底角移到平角两旁，因此 x = 70°。',
      title: '三角形内角和示意图',
      desc: '三角形两底角分别为50度与60度，顶角x为70度。通过顶点的水平线与底边平行，展示三个角拼成平角。',
      drawing: angleSumDrawing()
    },
    'triangle-inequality': {
      caption: '第三边 x 必须严格满足 2 &lt; x &lt; 12；若 x 是整数，可取 3 至 11，共 9 种。',
      title: '三角形三边关系示意图',
      desc: '已知边长5和7，第三边的开区间是2到12；端点空心不取，区间中的整数3到11各用绿点表示。',
      drawing: `<path d="M46 146H310" stroke="#a8b3a6" stroke-width="3" stroke-linecap="round"/><path d="M86 146h182" stroke="#71a982" stroke-width="7" stroke-linecap="round"/><path d="M86 131v30M268 131v30" stroke="#d18d64" stroke-width="2.5"/><circle cx="86" cy="146" r="8" fill="#fffefa" stroke="#d18d64" stroke-width="3"/><circle cx="268" cy="146" r="8" fill="#fffefa" stroke="#d18d64" stroke-width="3"/><circle cx="104.2" cy="146" r="4" fill="#477d58"/><circle cx="122.4" cy="146" r="4" fill="#477d58"/><circle cx="140.6" cy="146" r="4" fill="#477d58"/><circle cx="158.8" cy="146" r="4" fill="#477d58"/><circle cx="177" cy="146" r="4" fill="#477d58"/><circle cx="195.2" cy="146" r="4" fill="#477d58"/><circle cx="213.4" cy="146" r="4" fill="#477d58"/><circle cx="231.6" cy="146" r="4" fill="#477d58"/><circle cx="249.8" cy="146" r="4" fill="#477d58"/><text x="86" y="119" text-anchor="middle" class="g-label">2（不取）</text><text x="268" y="119" text-anchor="middle" class="g-label">12（不取）</text><rect x="55" y="42" width="250" height="43" rx="12" fill="#f0f6ec"/><text x="180" y="69" text-anchor="middle" class="g-formula">|7 − 5| &lt; x &lt; 7 + 5</text><text x="180" y="184" text-anchor="middle" class="g-note">整数候选：3 至 11（共 9 种）</text>`
    },
    'perimeter-area': {
      caption: '沿绿色边线走一圈是周长；浅绿色铺满的部分是面积。',
      title: '长方形周长与面积示意图',
      desc: '长8、宽5的长方形，绿色边框代表周长，内部方格代表面积。',
      drawing: `<rect x="80" y="38" width="200" height="125" rx="3" fill="#eaf2e6" stroke="#548366" stroke-width="5"/><path d="M105 38v125M130 38v125M155 38v125M180 38v125M205 38v125M230 38v125M255 38v125M80 63h200M80 88h200M80 113h200M80 138h200" stroke="#c9dcc6" stroke-width="1.2"/><path d="M80 28h200M80 23v10M280 23v10" stroke="#d38f64" stroke-width="2"/><text x="180" y="20" text-anchor="middle" class="g-label">长 8</text><path d="M296 38v125M291 38h10M291 163h10" stroke="#d38f64" stroke-width="2"/><text x="314" y="100.5" text-anchor="middle" class="g-label" transform="rotate(90 314 100.5)">宽 5</text><text x="180" y="105" text-anchor="middle" class="g-label">内部：8 × 5 = 40</text><text x="180" y="181" text-anchor="middle" class="g-note">周长 = 2 × (8 + 5) = 26；面积用平方单位</text>`
    },
    'composite-area': {
      caption: '从 10 × 8 的完整长方形扣掉右上角 4 × 3 缺口：80 − 12 = 68 平方单位。',
      title: '组合图形补形求面积示意图',
      desc: '一个长10宽8的矩形挖去右上角长4宽3的小矩形，完整外框与缺口的边长按同一比例绘制。',
      drawing: `<path d="M70 28H190V88H270V188H70Z" fill="#dfeee0" stroke="#548366" stroke-width="3" stroke-linejoin="round"/><rect x="190" y="28" width="80" height="60" fill="#fffefa" stroke="#d18d64" stroke-width="2.5" stroke-dasharray="6 5"/><path d="M70 22h200M70 18v8M270 18v8" stroke="#849882" stroke-width="1.5"/><text x="170" y="17" text-anchor="middle" class="g-label">外框长 10</text><text x="230" y="53" text-anchor="middle" class="g-label">缺口</text><text x="230" y="73" text-anchor="middle" class="g-label">4 × 3</text><text x="130" y="126" text-anchor="middle" class="g-label">保留区域</text><text x="170" y="184" text-anchor="middle" class="g-note">10 × 8 − 4 × 3 = 68（平方单位）</text>`
    },
    'area-equivalence': {
      caption: '两图都按底 12、高 5 成比例绘制；虚线是垂直高，不是斜边。平行四边形面积 60，三角形面积 30。',
      title: '三角形与平行四边形等积关系',
      desc: '左侧三角形与右侧平行四边形的底长和垂直高度按相同比例绘制；短横竖组成直角标记。',
      drawing: `<path d="M40 140 100 90 160 140Z" fill="#f5e8cb" stroke="#c58a4c" stroke-width="3"/><path d="M205 140 235 90 355 90 325 140Z" fill="#e1efe0" stroke="#548366" stroke-width="3"/><path d="M100 90v50M235 90v50" stroke="#7c927d" stroke-width="1.8" stroke-dasharray="5 4"/><path d="M100 130h10v10M235 130h10v10" fill="none" stroke="#548366" stroke-width="2"/><text x="100" y="79" text-anchor="middle" class="g-label">三角形</text><text x="295" y="79" text-anchor="middle" class="g-label">平行四边形</text><text x="100" y="161" text-anchor="middle" class="g-label">底 12</text><text x="83" y="116" text-anchor="end" class="g-note">高 5</text><text x="295" y="161" text-anchor="middle" class="g-label">底 12</text><text x="218" y="116" text-anchor="end" class="g-note">高 5</text><text x="100" y="190" text-anchor="middle" class="g-formula">12 × 5 ÷ 2 = 30</text><text x="295" y="190" text-anchor="middle" class="g-formula">12 × 5 = 60</text>`
    },
    'grid-symmetry': {
      caption: '原点在左下；P=(1,1) 与 P′=(3,1) 关于竖直轴 x=2 对称，两点各离轴 1 格。',
      title: '坐标格点与轴对称示意图',
      desc: '四列三行坐标网格，点P和点P撇位于真实格点，竖直对称轴为x等于2，两点纵坐标同为1且横向距离相等。',
      drawing: `<rect x="60" y="42" width="240" height="120" fill="#f7f8f1" stroke="#9aae98" stroke-width="1.5"/><path d="M120 42v120M180 42v120M240 42v120M60 82h240M60 122h240" stroke="#c8d6c5" stroke-width="1.5"/><path d="M180 32v138" stroke="#cf8c62" stroke-width="3" stroke-dasharray="6 4"/><path d="M60 162H311M60 162V30" stroke="#526f5a" stroke-width="1.7"/><circle cx="120" cy="122" r="6" fill="#628d69"/><circle cx="240" cy="122" r="6" fill="#6585a0"/><path d="M129 122h39M231 122h-39" stroke="#d18d64" stroke-width="2" marker-end="url(#g-arrow)"/><text x="180" y="27" text-anchor="middle" class="g-label">竖直对称轴 x=2</text><text x="120" y="145" text-anchor="middle" class="g-note">P(1,1)</text><text x="240" y="145" text-anchor="middle" class="g-note">P′(3,1)</text><text x="59" y="177" text-anchor="middle" class="g-note">0</text><text x="120" y="177" text-anchor="middle" class="g-note">1</text><text x="180" y="177" text-anchor="middle" class="g-note">2</text><text x="240" y="177" text-anchor="middle" class="g-note">3</text><text x="300" y="177" text-anchor="middle" class="g-note">4</text><text x="180" y="198" text-anchor="middle" class="g-note">x′=2×2−1=3；纵坐标仍为 1</text><defs><marker id="g-arrow" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0 0 7 3.5 0 7Z" fill="#d18d64"/></marker></defs>`
    },
    solids: {
      caption: '长 5、宽 3、高 2 cm；每种长方形面都有一块相对面，体积与表面积分别用 cm³ 和 cm²。',
      title: '长方体三对相对面示意图',
      desc: '长5宽3高2厘米的长方体，三个可见面的面积分别为15、10、6平方厘米，各自还有一块相对面；体积为30立方厘米，表面积为62平方厘米。',
      drawing: `<path d="M80 82 125 50 225 50 180 82Z" fill="#f4e7c9" stroke="#9b805c" stroke-width="2.5"/><path d="M80 82H180V142H80Z" fill="#dcebdd" stroke="#64876a" stroke-width="2.5"/><path d="M180 82 225 50V110L180 142Z" fill="#b9d5bc" stroke="#64876a" stroke-width="2.5"/><path d="M80 82 125 50M180 82H225M180 142 225 110M80 142H180V82" fill="none" stroke="#64876a" stroke-width="2.5"/><text x="130" y="111" text-anchor="middle" class="g-label">5×3=15</text><text x="151" y="71" text-anchor="middle" class="g-label">5×2=10</text><text x="202" y="109" text-anchor="middle" class="g-note">3×2=6</text><text x="130" y="157" text-anchor="middle" class="g-note">长 5 cm</text><text x="52" y="115" text-anchor="middle" class="g-note">高 3 cm</text><text x="231" y="58" class="g-note">宽 2 cm</text><rect x="32" y="8" width="296" height="24" rx="12" fill="#f1f5eb"/><text x="180" y="25" text-anchor="middle" class="g-note">三种可见面，各有一片相同的相对面</text><text x="180" y="190" text-anchor="middle" class="g-note">V=30 cm³；S=2×(15+10+6)=62 cm²</text>`
    },
    'geometric-counting': {
      caption: '与例题相同为 2 行、3 列：3 条横线、4 条竖线，各选两条，共 C(3,2)×C(4,2)=18 个长方形。',
      title: '网格边界选线计数示意图',
      desc: '两行三列的方格有三条横线和四条竖线，选两条横线和两条竖线即可唯一确定一个矩形；总数十八。',
      drawing: `<rect x="70" y="40" width="240" height="105" fill="#f7f8f1" stroke="#a9b8a3" stroke-width="2"/><path d="M130 40v105M190 40v105M250 40v105M70 92.5h240" stroke="#a9b8a3" stroke-width="2"/><rect x="130" y="40" width="120" height="52.5" fill="#e4f0df" fill-opacity=".86" stroke="#548366" stroke-width="4"/><text x="180" y="171" text-anchor="middle" class="g-formula">C(3,2) × C(4,2) = 18</text><text x="180" y="193" text-anchor="middle" class="g-note">先选两条横线，再选两条竖线</text>`,
      secondary: {
        caption: '三组长方形的边长和都为 10 cm，周长都是 20 cm；正整数边长下，5×5 面积最大。',
        title: '固定周长下的面积比较',
        desc: '按相同比例绘制的1乘9、4乘6、5乘5三个长方形，周长均为20厘米，面积分别为9、24、25平方厘米。',
        drawing: `<text x="180" y="23" text-anchor="middle" class="g-note">长+宽=10 cm（周长固定 20 cm）</text><text x="92" y="98" text-anchor="middle" class="g-label">1×9=9</text><rect x="20" y="104" width="144" height="16" fill="#f2e5c8" stroke="#bb8b57" stroke-width="2"/><text x="222" y="70" text-anchor="middle" class="g-label">4×6=24</text><rect x="174" y="76" width="96" height="64" fill="#e3eee0" stroke="#6c9474" stroke-width="2"/><text x="316" y="62" text-anchor="middle" class="g-label">5×5=25 最大</text><rect x="276" y="68" width="80" height="80" fill="#d2e5d0" stroke="#548366" stroke-width="2"/><text x="180" y="184" text-anchor="middle" class="g-note">三个矩形按相同比例绘制；面积单位：cm²</text>`
      }
    }
  };

  const makeFigure = (item, id) => `<figure id="bc-figure-${id}" class="bc-geometry-figure"><svg viewBox="0 0 360 205" role="img" aria-label="${item.title}"><title>${item.title}</title><desc>${item.desc}</desc><style>.g-label{font:700 13px system-ui,sans-serif;fill:#355443}.g-note{font:600 11px system-ui,sans-serif;fill:#65766a}.g-formula{font:800 17px system-ui,sans-serif;fill:#315a43}</style>${item.drawing}</svg><figcaption>${item.caption}</figcaption></figure>`;

  Object.entries(illustrations).forEach(([id, item]) => {
    const lesson = document.getElementById(`bc-topic-${id}`);
    const concept = lesson?.querySelector('.bc-concept-box');
    if (concept && !lesson.querySelector('.bc-geometry-figure')) concept.insertAdjacentHTML('afterend', makeFigure(item, id));
    if (concept && item.secondary && !document.getElementById(`bc-figure-${id}-optimization`)) {
      const primary = document.getElementById(`bc-figure-${id}`);
      (primary || concept).insertAdjacentHTML('afterend', makeFigure(item.secondary, `${id}-optimization`));
    }
  });

  const solidLesson = document.getElementById('bc-topic-solids');
  const solidFigure = document.getElementById('bc-figure-solids');
  if (solidLesson && solidFigure && !document.getElementById('bc-solid-net-lab')) {
    // A connected six-face net: the front has four neighbors, and the back is attached to the top flap.
    const solidNetFaces = [
      { id: 'back', name: '后面', net: [[2, -2], [7, -2], [7, 1], [2, 1]], world: [[0, 2, 0], [5, 2, 0], [5, 2, 3], [0, 2, 3]], color: 'is-long-tall', dimensions: '5 cm × 3 cm', area: 15 },
      { id: 'bottom', name: '下面', net: [[2, 6], [7, 6], [7, 8], [2, 8]], world: [[0, 0, 0], [5, 0, 0], [5, 2, 0], [0, 2, 0]], color: 'is-long-wide', dimensions: '5 cm × 2 cm', area: 10 },
      { id: 'left', name: '左面', net: [[0, 3], [2, 3], [2, 6], [0, 6]], world: [[0, 2, 3], [0, 0, 3], [0, 0, 0], [0, 2, 0]], color: 'is-side', dimensions: '3 cm × 2 cm', area: 6 },
      { id: 'top', name: '上面', net: [[2, 1], [7, 1], [7, 3], [2, 3]], world: [[0, 2, 3], [5, 2, 3], [5, 0, 3], [0, 0, 3]], color: 'is-long-wide', dimensions: '5 cm × 2 cm', area: 10 },
      { id: 'right', name: '右面', net: [[7, 3], [9, 3], [9, 6], [7, 6]], world: [[5, 0, 3], [5, 2, 3], [5, 2, 0], [5, 0, 0]], color: 'is-side', dimensions: '3 cm × 2 cm', area: 6 },
      { id: 'front', name: '前面', net: [[2, 3], [7, 3], [7, 6], [2, 6]], world: [[0, 0, 3], [5, 0, 3], [5, 0, 0], [0, 0, 0]], color: 'is-long-tall', dimensions: '5 cm × 3 cm', area: 15 }
    ];
    const netHinges = [
      { net: [[2, 3], [7, 3]], world: [[0, 0, 3], [5, 0, 3]] },
      { net: [[2, 1], [7, 1]], world: [[0, 2, 3], [5, 2, 3]] },
      { net: [[2, 6], [7, 6]], world: [[0, 0, 0], [5, 0, 0]] },
      { net: [[2, 3], [2, 6]], world: [[0, 0, 3], [0, 0, 0]] },
      { net: [[7, 3], [7, 6]], world: [[5, 0, 3], [5, 0, 0]] }
    ];
    const unit = 26;
    const netPoint = ([x, y]) => [63 + x * unit, 25 + (y + 2) * unit];
    const project = ([x, y, z]) => [180 + 22 * x + 14 * y, 156 + 6.5 * x - 6.5 * y - 22 * z];
    const midpoint = (points) => points.reduce((sum, point) => [sum[0] + point[0] / points.length, sum[1] + point[1] / points.length], [0, 0]);
    const pointText = (point) => point.map((value) => Number(value.toFixed(2))).join(',');
    const facesMarkup = solidNetFaces.map((face) => {
      const flatPoints = face.net.map(netPoint);
      const center = midpoint(flatPoints);
      const points = flatPoints.map(pointText).join(' ');
      const faceLabel = face.name;
      const dimensionLabel = face.color === 'is-side' ? '3 × 2' : face.dimensions;
      return `<polygon class="bc-solid-net-face ${face.color}" data-solid-net-face="${face.id}" points="${points}"/><text class="bc-solid-net-face-label${face.color === 'is-side' ? ' is-narrow' : ''}" data-solid-net-label="${face.id}" x="${center[0]}" y="${center[1]}" text-anchor="middle" dominant-baseline="middle"><tspan x="${center[0]}" dy="-9">${faceLabel}</tspan><tspan x="${center[0]}" dy="12">${dimensionLabel}</tspan><tspan x="${center[0]}" dy="12">${face.area} cm²</tspan></text>`;
    }).join('');
    const hingesMarkup = netHinges.map((hinge, index) => {
      const [start, end] = hinge.net.map(netPoint);
      return `<line class="bc-solid-net-hinge" data-solid-net-hinge="${index}" x1="${start[0]}" y1="${start[1]}" x2="${end[0]}" y2="${end[1]}"/>`;
    }).join('');

    solidFigure.insertAdjacentHTML('afterend', `<section id="bc-solid-net-lab" class="bc-solid-net-lab" aria-labelledby="bc-solid-net-title"><div class="bc-solid-net-heading"><span class="bc-section-label">动手试一试 · 剪开纸盒再折回</span><h3 id="bc-solid-net-title">六个面怎样拼成长方体？</h3><p>先看展开图：六块纸板沿虚线相连。拖动滑杆或按按钮，观察它们怎样合成一个盒子。本例长 5 cm、宽 2 cm、高 3 cm。</p></div><div class="bc-solid-net-layout"><figure class="bc-solid-net-figure"><svg id="bc-solid-net-svg" viewBox="0 0 360 310" role="img" aria-label="长方体的六面展开图，长5厘米、宽2厘米、高3厘米；各面面积为15、10、6平方厘米各两片"><title>5 cm × 2 cm × 3 cm 长方体展开图</title><desc>中间是前面，左右和下方各接一个侧面，上方接上面，再在上面外侧接后面；六面各出现一次。虚线表示折痕。</desc>${facesMarkup}<g class="bc-solid-net-hinges" aria-hidden="true">${hingesMarkup}</g></svg><figcaption>虚线是折痕；每块面都只出现一次。折好后，前后、上下、左右分别成为三对相对面。</figcaption></figure><div class="bc-solid-net-controls"><div class="bc-solid-net-slider-row"><label for="bc-solid-net-fold">折叠程度</label><output id="bc-solid-net-fold-out" for="bc-solid-net-fold">0%</output><input id="bc-solid-net-fold" type="range" min="0" max="100" step="1" value="0" aria-label="折叠程度；0%是展开图，100%是折成盒子"><small>按方向键逐步调节；触屏可拖动滑杆。</small></div><div class="bc-solid-net-actions" role="group" aria-label="展开图折叠控制"><button type="button" id="bc-solid-net-unfold">完全展开</button><button type="button" id="bc-solid-net-fold-button">折成盒子</button></div><p id="bc-solid-net-status" class="bc-solid-net-status" aria-live="polite">展开图：六个面各一次；沿虚线折起后，边要对接、面不能重叠。</p><div class="bc-solid-net-areas" aria-label="六个面的尺寸和面积"><p><b>前、后面各 1 片：</b>5 cm × 3 cm = 15 cm² / 片</p><p><b>上、下面各 1 片：</b>5 cm × 2 cm = 10 cm² / 片</p><p><b>左、右面各 1 片：</b>3 cm × 2 cm = 6 cm² / 片</p><strong>表面积：15 + 15 + 10 + 10 + 6 + 6 = 62 cm²</strong></div></div></div><aside class="bc-solid-net-misconception"><b>别把“相对面相等”误读成“六面都相等”</b><span>本例长方体的相对面面积相同，但三组面积分别是 15、10、6 cm²。只有长、宽、高都相等时才是正方体；正方体六个面才都是同样大的正方形。</span></aside><div class="bc-solid-net-check"><h4>小检查：本例中，面积为 15 cm² 的面有几块？</h4><div class="bc-solid-net-answers" role="group" aria-label="选择15平方厘米面的数量"><button type="button" data-solid-net-answer="1" aria-pressed="false">1 块</button><button type="button" data-solid-net-answer="2" aria-pressed="false">2 块</button><button type="button" data-solid-net-answer="3" aria-pressed="false">3 块</button></div><p id="bc-solid-net-check-feedback" aria-live="polite"></p></div><p class="bc-solid-net-source-note">课程当前标为“进阶”；逐课年级与教材页码尚未核定。本图是原创尺寸示意，不对应未核实的教材页。</p></section>`);

    const svg = document.getElementById('bc-solid-net-svg');
    const foldRange = document.getElementById('bc-solid-net-fold');
    const foldOutput = document.getElementById('bc-solid-net-fold-out');
    const status = document.getElementById('bc-solid-net-status');
    const faceElements = new Map([...svg.querySelectorAll('[data-solid-net-face]')].map((element) => [element.dataset.solidNetFace, element]));
    const labelElements = new Map([...svg.querySelectorAll('[data-solid-net-label]')].map((element) => [element.dataset.solidNetLabel, element]));
    const hingeElements = [...svg.querySelectorAll('[data-solid-net-hinge]')];
    const mixPoint = (flat, folded, amount) => [flat[0] + (folded[0] - flat[0]) * amount, flat[1] + (folded[1] - flat[1]) * amount];
    const centroid = (points) => midpoint(points);
    let animationFrame = 0;

    const updateNet = () => {
      const fold = Number(foldRange.value) / 100;
      const percent = Math.round(fold * 100);
      foldOutput.textContent = `${percent}%`;
      solidNetFaces.forEach((face) => {
        const flat = face.net.map(netPoint);
        const folded = face.world.map(project);
        const points = flat.map((point, index) => pointText(mixPoint(point, folded[index], fold))).join(' ');
        faceElements.get(face.id).setAttribute('points', points);
        const label = labelElements.get(face.id);
        const flatCenter = centroid(flat);
        const foldedCenter = centroid(folded);
        const labelCenter = mixPoint(flatCenter, foldedCenter, fold);
        label.setAttribute('x', labelCenter[0]);
        label.setAttribute('y', labelCenter[1]);
        label.querySelectorAll('tspan').forEach((span) => span.setAttribute('x', labelCenter[0]));
        label.style.opacity = String(Math.max(0, 1 - fold * 1.2));
      });
      hingeElements.forEach((line, index) => {
        const hinge = netHinges[index];
        const flat = hinge.net.map(netPoint);
        const folded = hinge.world.map(project);
        const [start, end] = flat.map((point, i) => mixPoint(point, folded[i], fold));
        line.setAttribute('x1', start[0]); line.setAttribute('y1', start[1]);
        line.setAttribute('x2', end[0]); line.setAttribute('y2', end[1]);
        line.style.opacity = String(1 - fold);
      });
      svg.setAttribute('aria-label', `折叠程度 ${percent}%。长5厘米、宽2厘米、高3厘米的长方体；六个面的面积是15、15、10、10、6、6平方厘米，总表面积62平方厘米。`);
      status.textContent = percent === 0
        ? '展开图：六个面各一次；沿虚线折起后，边要对接、面不能重叠。'
        : percent === 100
          ? '折好了：六个面围成一个长方体，三对相对面的面积分别为 15、10、6 cm²。'
          : `折叠示意：${percent}%。六片纸板沿相连的边合拢；到 100% 时成为长方体。`;
    };

    const cancelFoldAnimation = () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    };
    const animateFoldTo = (target) => {
      cancelFoldAnimation();
      const start = Number(foldRange.value) / 100;
      if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || start === target) {
        foldRange.value = String(target * 100);
        updateNet();
        return;
      }
      const duration = 520 * Math.abs(target - start);
      let startedAt = 0;
      const frame = (now) => {
        if (!startedAt) startedAt = now;
        const progress = Math.min(1, (now - startedAt) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        foldRange.value = String(Math.round((start + (target - start) * eased) * 100));
        updateNet();
        if (progress < 1) animationFrame = requestAnimationFrame(frame);
        else animationFrame = 0;
      };
      animationFrame = requestAnimationFrame(frame);
    };

    foldRange.addEventListener('input', () => { cancelFoldAnimation(); updateNet(); });
    document.getElementById('bc-solid-net-unfold').addEventListener('click', () => animateFoldTo(0));
    document.getElementById('bc-solid-net-fold-button').addEventListener('click', () => animateFoldTo(1));
    const answerButtons = [...solidLesson.querySelectorAll('[data-solid-net-answer]')];
    const answerFeedback = document.getElementById('bc-solid-net-check-feedback');
    answerButtons.forEach((button) => button.addEventListener('click', () => {
      answerButtons.forEach((item) => {
        item.setAttribute('aria-pressed', String(item === button));
        item.classList.remove('is-correct', 'is-wrong');
      });
      if (Number(button.dataset.solidNetAnswer) === 2) {
        button.classList.add('is-correct');
        answerFeedback.textContent = '答对了！5 cm × 3 cm = 15 cm²；前面和后面各一块，所以共有 2 块，共计 30 cm²。';
      } else {
        button.classList.add('is-wrong');
        answerFeedback.textContent = '再看这对相对面：前面和后面尺寸都是 5 cm × 3 cm。每块 15 cm²，一共有两块。';
      }
    }));
    updateNet();
  }

  const rectangleLesson = document.getElementById('bc-topic-perimeter-area');
  const rectangleFigure = document.getElementById('bc-figure-perimeter-area');
  if (rectangleLesson && rectangleFigure && !document.getElementById('bc-rectangle-lab')) {
    rectangleFigure.insertAdjacentHTML('afterend', `<section id="bc-rectangle-lab" class="bc-rectangle-lab" aria-labelledby="bc-rectangle-title"><div class="bc-rectangle-heading"><span class="bc-section-label">动手试一试 · 2D 长方形</span><h3 id="bc-rectangle-title">调一调边长，看看周长和面积怎么变</h3><p>每次只改一个边长，另一条边保持不变。键盘可用方向键；触屏可直接拖动滑杆。每个小格的边长是 1 cm。</p></div><div class="bc-rectangle-layout"><div class="bc-rectangle-controls"><label class="bc-rectangle-control" for="bc-rectangle-length"><span>长（cm）</span><input id="bc-rectangle-length" type="range" min="1" max="10" step="1" value="8" aria-describedby="bc-rectangle-hint"><output id="bc-rectangle-length-out" for="bc-rectangle-length">8 cm</output></label><label class="bc-rectangle-control" for="bc-rectangle-width"><span>宽（cm）</span><input id="bc-rectangle-width" type="range" min="1" max="8" step="1" value="3" aria-describedby="bc-rectangle-hint"><output id="bc-rectangle-width-out" for="bc-rectangle-width">3 cm</output></label><p id="bc-rectangle-hint" class="bc-rectangle-hint">浅绿色区域由 1 cm × 1 cm 的小格铺成；边框绕一圈是周长，格子铺开的大小是面积。</p><p id="bc-rectangle-result" class="bc-rectangle-result" aria-live="polite"></p><p id="bc-rectangle-change" class="bc-rectangle-change" aria-live="polite"></p></div><svg id="bc-rectangle-svg" class="bc-rectangle-svg" viewBox="0 0 460 280" role="img" aria-label="长8厘米、宽3厘米的长方形；周长22厘米，面积24平方厘米"></svg></div><aside class="bc-rectangle-guide" aria-label="宽度变化的带做比较"><h4>跟着比一比：只改宽，长不变</h4><p>固定长 <b>8 cm</b>，把宽从 <b>3 cm</b> 增加到 <b>5 cm</b>，所以 Δ=2 cm。周长从 22 cm 变成 26 cm，增加 <b>2×Δ=4 cm</b>；面积从 24 cm² 变成 40 cm²，增加 <b>长×Δ=8×2=16 cm²</b>。长保持 8 cm 不变。</p><button class="bc-rectangle-guide-button" type="button" id="bc-rectangle-guide-start">从长 8 cm、宽 3 cm 开始比较</button></aside></section>`);

    const lengthInput = document.getElementById('bc-rectangle-length');
    const widthInput = document.getElementById('bc-rectangle-width');
    const rectangleSvg = document.getElementById('bc-rectangle-svg');
    const result = document.getElementById('bc-rectangle-result');
    const change = document.getElementById('bc-rectangle-change');
    let previous = { length: 8, width: 3 };

    const renderRectangle = (forcedMessage = '') => {
      const length = Number(lengthInput.value);
      const width = Number(widthInput.value);
      const perimeter = 2 * (length + width);
      const area = length * width;
      const unit = 24;
      const rectWidth = length * unit;
      const rectHeight = width * unit;
      const x = (460 - rectWidth) / 2;
      const y = (280 - rectHeight) / 2;
      const midY = y + rectHeight / 2;
      const topMeasureY = y - 13;
      const widthMeasureX = x - 12;

      document.getElementById('bc-rectangle-length-out').textContent = `${length} cm`;
      document.getElementById('bc-rectangle-width-out').textContent = `${width} cm`;
      rectangleSvg.setAttribute('aria-label', `长${length}厘米、宽${width}厘米的长方形；周长${perimeter}厘米，面积${area}平方厘米。每个网格小格是1平方厘米。`);
      rectangleSvg.innerHTML = `<title>长 ${length} cm、宽 ${width} cm 的长方形</title><desc>长边和宽边按同一比例绘制；内部每个小格是 1 cm 乘 1 cm。周长 ${perimeter} cm，面积 ${area} cm²。</desc><defs><pattern id="bc-rectangle-grid" width="${unit}" height="${unit}" patternUnits="userSpaceOnUse"><rect width="${unit}" height="${unit}" fill="#e8f1e5"/><path d="M${unit} 0H0V${unit}" fill="none" stroke="#c4d8c2" stroke-width="1"/></pattern></defs><path d="M${x} ${topMeasureY}H${x + rectWidth}M${x} ${topMeasureY - 4}V${topMeasureY + 4}M${x + rectWidth} ${topMeasureY - 4}V${topMeasureY + 4}" fill="none" stroke="#c47d55" stroke-width="1.7"/><text x="230" y="${y - 21}" text-anchor="middle" class="bc-rectangle-svg-label">长 ${length} cm</text><path d="M${widthMeasureX} ${y}V${y + rectHeight}M${widthMeasureX - 4} ${y}H${widthMeasureX + 4}M${widthMeasureX - 4} ${y + rectHeight}H${widthMeasureX + 4}" fill="none" stroke="#c47d55" stroke-width="1.7"/><text x="42" y="${midY}" text-anchor="middle" dominant-baseline="middle" transform="rotate(-90 42 ${midY})" class="bc-rectangle-svg-label">宽 ${width} cm</text><rect x="${x}" y="${y}" width="${rectWidth}" height="${rectHeight}" fill="url(#bc-rectangle-grid)" stroke="#548366" stroke-width="3" rx="2"/>`;
      result.textContent = `周长：2 × (${length} + ${width}) = ${perimeter} cm。面积：${length} × ${width} = ${area} cm²。`;

      if (forcedMessage) {
        change.textContent = forcedMessage;
      } else if (length === previous.length && width !== previous.width) {
        const delta = Math.abs(width - previous.width);
        const direction = width > previous.width ? '增加' : '减少';
        change.textContent = `长保持 ${length} cm 不变；宽${direction} Δ=${delta} cm，所以周长${direction} 2×${delta}=${2 * delta} cm，面积${direction} ${length}×${delta}=${length * delta} cm²。`;
      } else if (width === previous.width && length !== previous.length) {
        const delta = Math.abs(length - previous.length);
        const direction = length > previous.length ? '增加' : '减少';
        change.textContent = `宽保持 ${width} cm 不变；长${direction} Δ=${delta} cm，所以周长${direction} 2×${delta}=${2 * delta} cm，面积${direction} ${width}×${delta}=${width * delta} cm²。`;
      } else if (length !== previous.length || width !== previous.width) {
        change.textContent = '长和宽都变了；比较面积或周长时，记得看清每一条边各改变了多少。';
      } else {
        change.textContent = '拖动一条边的滑杆；另一条边保持原值，观察周长和面积。';
      }
      previous = { length, width };
    };

    [lengthInput, widthInput].forEach((input) => input.addEventListener('input', () => renderRectangle()));
    document.getElementById('bc-rectangle-guide-start').addEventListener('click', () => {
      lengthInput.value = '8';
      widthInput.value = '3';
      previous = { length: 8, width: 3 };
      renderRectangle('比较起点已设好：长 8 cm、宽 3 cm。现在只把“宽”调到 5 cm，看看变化。');
    });
    renderRectangle();
  }

  const symmetryLesson = document.getElementById('bc-topic-grid-symmetry');
  const symmetryFigure = document.getElementById('bc-figure-grid-symmetry');
  if (symmetryLesson && symmetryFigure && !document.getElementById('bc-symmetry-lab')) {
    symmetryFigure.insertAdjacentHTML('afterend', `<section id="bc-symmetry-lab" class="bc-symmetry-lab" aria-labelledby="bc-symmetry-title"><div class="bc-symmetry-heading"><span class="bc-section-label">动手试一试 · 坐标镜像</span><h3 id="bc-symmetry-title">拖动坐标，看镜像点怎样移动</h3><p>对称轴固定为竖直线 x=2。滑动 P 的坐标，观察 P′ 如何保持等距。</p></div><div class="bc-symmetry-layout"><div class="bc-symmetry-controls"><div class="bc-symmetry-control-row"><label for="bc-symmetry-x">横坐标 x</label><input id="bc-symmetry-x" type="range" min="0" max="4" step="1" value="1"><output id="bc-symmetry-x-out" for="bc-symmetry-x">1</output></div><div class="bc-symmetry-control-row"><label for="bc-symmetry-y">纵坐标 y</label><input id="bc-symmetry-y" type="range" min="0" max="3" step="1" value="1"><output id="bc-symmetry-y-out" for="bc-symmetry-y">1</output></div><p id="bc-symmetry-result" class="bc-symmetry-result" aria-live="polite">P=(1,1) 关于 x=2 对称后，P′=(3,1)。</p></div><svg id="bc-symmetry-svg" viewBox="0 0 360 205" role="img" aria-label="坐标网格上 P 点与其关于竖直直线 x 等于 2 的镜像点 P 撇"><path d="M60 42V162M120 42V162M180 42V162M240 42V162M300 42V162M60 42H300M60 82H300M60 122H300M60 162H300" fill="none" stroke="#c8d6c5" stroke-width="1.5"/><path d="M180 32V170" stroke="#cf8c62" stroke-width="3" stroke-dasharray="6 4"/><path d="M60 162H311M60 162V30" fill="none" stroke="#526f5a" stroke-width="1.7"/><text x="180" y="26" text-anchor="middle" class="bc-symmetry-svg-note">x=2 对称轴</text><text x="60" y="179" text-anchor="middle" class="bc-symmetry-svg-note">0</text><text x="120" y="179" text-anchor="middle" class="bc-symmetry-svg-note">1</text><text x="180" y="179" text-anchor="middle" class="bc-symmetry-svg-note">2</text><text x="240" y="179" text-anchor="middle" class="bc-symmetry-svg-note">3</text><text x="300" y="179" text-anchor="middle" class="bc-symmetry-svg-note">4</text><line id="bc-symmetry-join" x1="120" y1="122" x2="240" y2="122" stroke="#d18d64" stroke-width="2" stroke-dasharray="4 4"/><circle id="bc-symmetry-point" cx="120" cy="122" r="6" fill="#628d69"/><circle id="bc-symmetry-image" cx="240" cy="122" r="6" fill="#6585a0"/><text id="bc-symmetry-point-label" x="120" y="109" text-anchor="middle" class="bc-symmetry-svg-label">P(1,1)</text><text id="bc-symmetry-image-label" x="240" y="109" text-anchor="middle" class="bc-symmetry-svg-label">P′(3,1)</text></svg></div></section>`);
    const xInput = document.getElementById('bc-symmetry-x');
    const yInput = document.getElementById('bc-symmetry-y');
    const updateSymmetry = () => {
      const x = Number(xInput.value);
      const y = Number(yInput.value);
      const mirroredX = 4 - x;
      const pointX = 60 + x * 60;
      const imageX = 60 + mirroredX * 60;
      const pointY = 162 - y * 40;
      const onAxis = x === 2;
      document.getElementById('bc-symmetry-x-out').textContent = x;
      document.getElementById('bc-symmetry-y-out').textContent = y;
      const point = document.getElementById('bc-symmetry-point');
      const image = document.getElementById('bc-symmetry-image');
      const join = document.getElementById('bc-symmetry-join');
      const pointLabel = document.getElementById('bc-symmetry-point-label');
      const imageLabel = document.getElementById('bc-symmetry-image-label');
      point.setAttribute('cx', pointX); point.setAttribute('cy', pointY);
      image.setAttribute('cx', imageX); image.setAttribute('cy', pointY);
      join.setAttribute('x1', pointX); join.setAttribute('y1', pointY);
      join.setAttribute('x2', imageX); join.setAttribute('y2', pointY);
      pointLabel.textContent = `P(${x},${y})`;
      imageLabel.textContent = `P′(${mirroredX},${y})`;
      pointLabel.setAttribute('x', onAxis ? pointX - 8 : pointX);
      pointLabel.setAttribute('y', onAxis ? pointY - 12 : pointY - 12);
      pointLabel.setAttribute('text-anchor', onAxis ? 'end' : 'middle');
      imageLabel.setAttribute('x', onAxis ? imageX + 8 : imageX);
      imageLabel.setAttribute('y', onAxis ? pointY + 22 : pointY - 12);
      imageLabel.setAttribute('text-anchor', onAxis ? 'start' : 'middle');
      document.getElementById('bc-symmetry-svg').setAttribute('aria-label', `点 P(${x},${y}) 关于竖直直线 x 等于 2 的镜像点为 P 撇(${mirroredX},${y})。`);
      document.getElementById('bc-symmetry-result').textContent = onAxis
        ? `P=(${x},${y}) 在对称轴 x=2 上，反射后与 P′ 重合；点到轴的距离为 0。`
        : `P=(${x},${y}) 关于 x=2 对称后，P′=(2×2−${x},${y})=(${mirroredX},${y})；纵坐标不变，横坐标中点为 2。`;
    };
    xInput.addEventListener('input', updateSymmetry);
    yInput.addEventListener('input', updateSymmetry);
  }

  const title = document.getElementById('bc-lab-title');
  const lead = document.getElementById('bc-lab-lead');
  const card = document.getElementById('bc-lab-card');
  const kicker = document.querySelector('#bc-lab .course-kicker');
  if (!card) return;
  if (title) title.textContent = '3D 立体观察台：拖动旋转，调一调棱长';
  if (lead) lead.textContent = '转一转长方体，从不同方向看清长、宽、高；改变棱长，体积和表面积会即时重算。';
  if (kicker) kicker.textContent = '可拖动旋转 · 实时调整棱长';

  card.innerHTML = `<div class="bc-solid-controls"><p><b>先观察，再计算：</b>长、宽、高是三个互相垂直的方向。拖动立体可以旋转；按住并拖动鼠标，或用手指滑动。</p><label class="bc-control-row" for="bc-solid-length">长 <input id="bc-solid-length" type="range" min="2" max="10" value="6"><output id="bc-solid-length-out">6</output></label><label class="bc-control-row" for="bc-solid-width">宽 <input id="bc-solid-width" type="range" min="2" max="8" value="4"><output id="bc-solid-width-out">4</output></label><label class="bc-control-row" for="bc-solid-height">高 <input id="bc-solid-height" type="range" min="2" max="7" value="3"><output id="bc-solid-height-out">3</output></label><div class="bc-solid-actions"><button class="bc-lab-button" type="button" id="bc-solid-cube">试试正方体</button><button class="bc-lab-button" type="button" id="bc-solid-reset">回到正面</button><button class="bc-lab-button" type="button" id="bc-solid-motion" aria-pressed="false">开始转动</button></div><p class="bc-lab-foot">键盘也能操作：先选中立体，再按方向键旋转；默认静止；点击“开始转动”可自动旋转，鼠标、手指或方向键手动旋转都会暂停自动转动。</p></div><div class="bc-lab-visual bc-solid-visual"><h3>长方体的三个方向</h3><canvas id="bc-solid-canvas" tabindex="0" role="img" aria-label="可交互的长方体三维示意图。用鼠标、手指拖动或方向键旋转。当前长6、宽4、高3。">你的浏览器暂不支持 Canvas 图形。</canvas><div class="bc-solid-legend"><span><i class="bc-legend-length"></i>长 <b id="bc-solid-legend-length">6</b></span><span><i class="bc-legend-width"></i>宽 <b id="bc-solid-legend-width">4</b></span><span><i class="bc-legend-height"></i>高 <b id="bc-solid-legend-height">3</b></span></div><div class="bc-live-result" id="bc-solid-result" aria-live="polite"></div></div>`;

  const canvas = document.getElementById('bc-solid-canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const length = document.getElementById('bc-solid-length');
  const width = document.getElementById('bc-solid-width');
  const height = document.getElementById('bc-solid-height');
  let yaw = 0.72;
  let pitch = -0.3;
  let isDragging = false;
  let lastX = 0;
  let lastY = 0;
  let isVisible = false;
  let spin = false;
  let previousTime = 0;
  let frameId = 0;

  const setSpin = (active) => {
    spin = active;
    const button = document.getElementById('bc-solid-motion');
    button.textContent = spin ? '暂停转动' : '开始转动';
    button.setAttribute('aria-pressed', String(spin));
    if (spin && isVisible && !frameId) frameId = requestAnimationFrame(animate);
  };

  const updateDimensions = () => {
    const l = Number(length.value);
    const w = Number(width.value);
    const h = Number(height.value);
    document.getElementById('bc-solid-length-out').textContent = l;
    document.getElementById('bc-solid-width-out').textContent = w;
    document.getElementById('bc-solid-height-out').textContent = h;
    document.getElementById('bc-solid-legend-length').textContent = l;
    document.getElementById('bc-solid-legend-width').textContent = w;
    document.getElementById('bc-solid-legend-height').textContent = h;
    document.getElementById('bc-solid-result').textContent = `体积 = ${l} × ${w} × ${h} = ${l * w * h} 立方单位；表面积 = 2 × (${l}×${w} + ${l}×${h} + ${w}×${h}) = ${2 * (l * w + l * h + w * h)} 平方单位。`;
    canvas.setAttribute('aria-label', `可交互的长方体三维示意图。长${l}、宽${w}、高${h}。用鼠标、手指拖动或方向键旋转。`);
    draw();
  };

  function draw() {
    const box = canvas.getBoundingClientRect();
    if (!box.width || !box.height) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const pixelWidth = Math.round(box.width * ratio);
    const pixelHeight = Math.round(box.height * ratio);
    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
    }
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, box.width, box.height);
    const dims = [Number(length.value), Number(height.value), Number(width.value)];
    const maxDim = Math.max(...dims);
    const unitScale = Math.min(box.width * 0.46, box.height * 0.58) / maxDim;
    const vertices = [];
    for (let z = -1; z <= 1; z += 2) {
      for (let y = -1; y <= 1; y += 2) {
        for (let x = -1; x <= 1; x += 2) {
          const rawX = x * Number(length.value) * unitScale / 2;
          const rawY = y * Number(height.value) * unitScale / 2;
          const rawZ = z * Number(width.value) * unitScale / 2;
          const rx = rawX * Math.cos(yaw) - rawZ * Math.sin(yaw);
          const rz = rawX * Math.sin(yaw) + rawZ * Math.cos(yaw);
          const ry = rawY * Math.cos(pitch) - rz * Math.sin(pitch);
          const depth = rawY * Math.sin(pitch) + rz * Math.cos(pitch);
          vertices.push({ x: box.width / 2 + rx, y: box.height * 0.49 + ry, depth });
        }
      }
    }
    const index = (x, y, z) => (z === 1 ? 4 : 0) + (y === 1 ? 2 : 0) + (x === 1 ? 1 : 0);
    const faces = [
      { ids: [index(-1,-1,-1), index(1,-1,-1), index(1,1,-1), index(-1,1,-1)], color: '#cce2cc' },
      { ids: [index(-1,-1,1), index(-1,1,1), index(1,1,1), index(1,-1,1)], color: '#dcebd8' },
      { ids: [index(-1,-1,-1), index(-1,-1,1), index(1,-1,1), index(1,-1,-1)], color: '#b9d7bd' },
      { ids: [index(-1,1,-1), index(1,1,-1), index(1,1,1), index(-1,1,1)], color: '#e6eee1' },
      { ids: [index(-1,-1,-1), index(-1,1,-1), index(-1,1,1), index(-1,-1,1)], color: '#a8c9ad' },
      { ids: [index(1,-1,-1), index(1,-1,1), index(1,1,1), index(1,1,-1)], color: '#c0d9c3' }
    ];
    faces.sort((a, b) => a.ids.reduce((sum, i) => sum + vertices[i].depth, 0) / 4 - b.ids.reduce((sum, i) => sum + vertices[i].depth, 0) / 4);
    faces.forEach((face) => {
      ctx.beginPath();
      face.ids.forEach((id, i) => i ? ctx.lineTo(vertices[id].x, vertices[id].y) : ctx.moveTo(vertices[id].x, vertices[id].y));
      ctx.closePath();
      ctx.fillStyle = face.color;
      ctx.fill();
      ctx.strokeStyle = '#52775b';
      ctx.lineWidth = 2;
      ctx.lineJoin = 'round';
      ctx.stroke();
    });

    const axisEdges = [
      { pairs: [[0,1],[2,3],[4,5],[6,7]], color: '#bd794c' },
      { pairs: [[0,2],[1,3],[4,6],[5,7]], color: '#507a59' },
      { pairs: [[0,4],[1,5],[2,6],[3,7]], color: '#6585a0' }
    ];
    axisEdges.forEach((axis) => {
      const [a, b] = axis.pairs.map((pair) => pair.map((i) => vertices[i])).sort((p, q) => ((q[0].depth + q[1].depth) - (p[0].depth + p[1].depth)))[0];
      ctx.strokeStyle = axis.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    });
  }

  function animate(time) {
    frameId = 0;
    if (!isVisible) return;
    if (spin && previousTime) yaw += Math.min(time - previousTime, 50) * 0.00024;
    previousTime = time;
    draw();
    if (spin) frameId = requestAnimationFrame(animate);
  }

  [length, width, height].forEach((input) => input.addEventListener('input', updateDimensions));
  document.getElementById('bc-solid-cube').addEventListener('click', () => {
    length.value = '4'; width.value = '4'; height.value = '4'; updateDimensions();
  });
  document.getElementById('bc-solid-reset').addEventListener('click', () => {
    yaw = 0.72; pitch = -0.3; draw();
  });
  document.getElementById('bc-solid-motion').addEventListener('click', () => setSpin(!spin));
  canvas.addEventListener('pointerdown', (event) => {
    isDragging = true; lastX = event.clientX; lastY = event.clientY;
    setSpin(false); canvas.setPointerCapture(event.pointerId); canvas.classList.add('is-dragging');
  });
  canvas.addEventListener('pointermove', (event) => {
    if (!isDragging) return;
    yaw += (event.clientX - lastX) * 0.012;
    pitch = Math.max(-1.2, Math.min(1.2, pitch + (event.clientY - lastY) * 0.009));
    lastX = event.clientX; lastY = event.clientY; draw();
  });
  const releasePointer = () => { isDragging = false; canvas.classList.remove('is-dragging'); };
  canvas.addEventListener('pointerup', releasePointer);
  canvas.addEventListener('pointercancel', releasePointer);
  canvas.addEventListener('keydown', (event) => {
    const amount = event.shiftKey ? 0.24 : 0.12;
    if (event.key === 'ArrowLeft') yaw -= amount;
    else if (event.key === 'ArrowRight') yaw += amount;
    else if (event.key === 'ArrowUp') pitch = Math.max(-1.2, pitch - amount);
    else if (event.key === 'ArrowDown') pitch = Math.min(1.2, pitch + amount);
    else return;
    event.preventDefault(); setSpin(false); draw();
  });

  const observer = new IntersectionObserver(([entry]) => {
    isVisible = entry.isIntersecting;
    if (isVisible) {
      draw();
      if (!frameId && spin) frameId = requestAnimationFrame(animate);
    } else {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = 0;
      previousTime = 0;
    }
  }, { threshold: 0.05 });
  observer.observe(canvas);
  new ResizeObserver(draw).observe(canvas);
  updateDimensions();
})();
