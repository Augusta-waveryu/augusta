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

  const illustrations = {
    angles: {
      caption: '三角形三个内角合起来是 180°，所以 x = 180° − 50° − 60° = 70°。',
      title: '三角形内角和示意图',
      desc: '一个三角形标出两个角50度和60度，第三个角标为x，旁边标注三角形内角和180度。',
      drawing: `<path d="M54 151 151 31 267 151Z" fill="#e8f2e5" stroke="#548366" stroke-width="3" stroke-linejoin="round"/><path d="M78 151A24 24 0 0 0 69.09 132.34M243 151A24 24 0 0 1 250.32 133.74M138.43 46.55A20 20 0 0 0 164.9 45.38" fill="none" stroke="#d48e63" stroke-width="3"/><text x="83" y="137" class="g-label">50°</text><text x="213" y="137" class="g-label">60°</text><text x="144" y="78" class="g-label">x</text><rect x="57" y="164" width="205" height="24" rx="12" fill="#f6f2e8"/><text x="159" y="181" text-anchor="middle" class="g-note">50° + 60° + x = 180°</text>`
    },
    'triangle-inequality': {
      caption: '第三边 x 必须比两边的差更长、比两边的和更短：2 &lt; x &lt; 12。',
      title: '三角形三边关系示意图',
      desc: '边长5和7已知，第三边x在2与12之间，端点不包括在内。',
      drawing: `<path d="M46 144H310" stroke="#90a28f" stroke-width="4" stroke-linecap="round"/><path d="M86 144h182" stroke="#71a982" stroke-width="12" stroke-linecap="round"/><path d="M86 130v28M268 130v28" stroke="#d18d64" stroke-width="3"/><circle cx="86" cy="144" r="8" fill="#fffefa" stroke="#d18d64" stroke-width="3"/><circle cx="268" cy="144" r="8" fill="#fffefa" stroke="#d18d64" stroke-width="3"/><text x="86" y="119" text-anchor="middle" class="g-label">2（不取）</text><text x="268" y="119" text-anchor="middle" class="g-label">12（不取）</text><text x="177" y="130" text-anchor="middle" class="g-label">可行的 x</text><rect x="55" y="42" width="250" height="43" rx="12" fill="#f0f6ec"/><text x="180" y="69" text-anchor="middle" class="g-formula">|7 − 5| &lt; x &lt; 7 + 5</text><text x="180" y="181" text-anchor="middle" class="g-note">两边之差 &lt; 第三边 &lt; 两边之和</text>`
    },
    'perimeter-area': {
      caption: '沿绿色边线走一圈是周长；浅绿色铺满的部分是面积。',
      title: '长方形周长与面积示意图',
      desc: '长8、宽5的长方形，绿色边框代表周长，内部方格代表面积。',
      drawing: `<rect x="80" y="38" width="200" height="125" rx="3" fill="#eaf2e6" stroke="#548366" stroke-width="5"/><path d="M105 38v125M130 38v125M155 38v125M180 38v125M205 38v125M230 38v125M255 38v125M80 63h200M80 88h200M80 113h200M80 138h200" stroke="#c9dcc6" stroke-width="1.2"/><path d="M80 28h200M80 23v10M280 23v10" stroke="#d38f64" stroke-width="2"/><text x="180" y="20" text-anchor="middle" class="g-label">长 8</text><path d="M296 38v125M291 38h10M291 163h10" stroke="#d38f64" stroke-width="2"/><text x="314" y="100.5" text-anchor="middle" class="g-label" transform="rotate(90 314 100.5)">宽 5</text><text x="180" y="105" text-anchor="middle" class="g-label">内部：8 × 5 = 40</text><text x="180" y="181" text-anchor="middle" class="g-note">周长 = 2 × (8 + 5) = 26；面积用平方单位</text>`
    },
    'composite-area': {
      caption: '先补成 10 × 8 的大长方形，再扣掉右上角缺口 3 × 3：面积是 71。',
      title: '组合图形补形求面积示意图',
      desc: '一个挖去右上角的L形，外框长10宽8，缺口长3宽3。',
      drawing: `<path d="M52 30H235V93H318V194H52Z" fill="#dfeee0" stroke="#548366" stroke-width="3" stroke-linejoin="round"/><rect x="235" y="30" width="83" height="63" fill="#fffefa" stroke="#d18d64" stroke-width="2.5" stroke-dasharray="6 5"/><path d="M52 20h266M52 16v9M318 16v9" stroke="#849882" stroke-width="1.5"/><text x="185" y="17" text-anchor="middle" class="g-label">总长 10</text><text x="276" y="66" text-anchor="middle" class="g-label">挖去 3 × 3</text><text x="185" y="125" text-anchor="middle" class="g-label">完整大图形 10 × 8</text><text x="185" y="177" text-anchor="middle" class="g-note">10 × 8 − 3 × 3 = 71（平方单位）</text>`
    },
    'area-equivalence': {
      caption: '底和垂直高相同的平行四边形面积是 12 × 5；三角形是它的一半。',
      title: '三角形与平行四边形等积关系',
      desc: '左侧三角形和右侧同底同高的平行四边形，虚线标出垂直高度。',
      drawing: `<path d="M47 150 145 44 174 150Z" fill="#f5e8cb" stroke="#c58a4c" stroke-width="3"/><path d="M215 150 258 44 335 44 292 150Z" fill="#e1efe0" stroke="#548366" stroke-width="3"/><path d="M145 44v106M258 44v106" stroke="#7c927d" stroke-width="1.5" stroke-dasharray="5 4"/><path d="M145 141h9v9" fill="none" stroke="#548366" stroke-width="2"/><path d="M258 141h9v9" fill="none" stroke="#548366" stroke-width="2"/><text x="111" y="172" text-anchor="middle" class="g-label">底 12，高 5</text><text x="275" y="172" text-anchor="middle" class="g-label">底 12，高 5</text><text x="108" y="105" text-anchor="middle" class="g-note">三角形</text><text x="273" y="105" text-anchor="middle" class="g-note">平行四边形</text><text x="180" y="190" text-anchor="middle" class="g-formula">12 × 5 ÷ 2 = 30</text>`
    },
    'grid-symmetry': {
      caption: '对称点在轴两侧，离轴都是 1 格；交点是格点，格子才是单位面积。',
      title: '方格与轴对称示意图',
      desc: '四列三行的方格，中线为对称轴，两侧对应点距离相等。',
      drawing: `<rect x="60" y="31" width="240" height="120" fill="#f7f8f1" stroke="#9aae98" stroke-width="1.5"/><path d="M120 31v120M180 31v120M240 31v120M60 71h240M60 111h240" stroke="#c8d6c5" stroke-width="1.5"/><path d="M180 23v137" stroke="#cf8c62" stroke-width="2.5" stroke-dasharray="5 4"/><circle cx="120" cy="91" r="7" fill="#628d69"/><circle cx="240" cy="91" r="7" fill="#628d69"/><path d="M128 91h42M232 91h-42" stroke="#d18d64" stroke-width="2" marker-end="url(#g-arrow)"/><text x="180" y="19" text-anchor="middle" class="g-label">对称轴</text><text x="120" y="133" text-anchor="middle" class="g-note">1 格</text><text x="240" y="133" text-anchor="middle" class="g-note">1 格</text><text x="180" y="179" text-anchor="middle" class="g-note">两点到对称轴的距离相等</text><defs><marker id="g-arrow" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0 0 7 3.5 0 7Z" fill="#d18d64"/></marker></defs>`
    },
    solids: {
      caption: '棱长 3 cm 的正方体有 6 个相同的面：体积 27 cm³，表面积 54 cm²。',
      title: '正方体表面积与体积示意图',
      desc: '标记三条棱长均为3厘米的正方体，区分表面积平方厘米和体积立方厘米。',
      drawing: `<path d="M93 70 178 35 258 73 173 110Z" fill="#f4e7c9" stroke="#9b805c" stroke-width="2.5"/><path d="M93 70 173 110V185L93 145Z" fill="#dcebdd" stroke="#64876a" stroke-width="2.5"/><path d="M173 110 258 73V148L173 185Z" fill="#b9d5bc" stroke="#64876a" stroke-width="2.5"/><path d="M93 70V145L173 185V110M173 110 258 73" fill="none" stroke="#64876a" stroke-width="2.5"/><text x="105" y="162" class="g-label">3 cm</text><text x="211" y="172" class="g-label">3 cm</text><text x="166" y="59" text-anchor="middle" class="g-label">3 cm</text><rect x="34" y="8" width="292" height="24" rx="12" fill="#f1f5eb"/><text x="180" y="25" text-anchor="middle" class="g-note">6 个面 × 3 × 3 = 54 cm²</text><text x="180" y="196" text-anchor="middle" class="g-note">3 × 3 × 3 = 27 cm³</text>`
    },
    'geometric-counting': {
      caption: '2 行、2 列的方格有 3 条横线和 3 条竖线；各选两条作边界，共 9 个矩形。',
      title: '网格中数矩形示意图',
      desc: '两行两列的方格中，用粗线高亮一个矩形；从三条横线和三条竖线中各选两条作为边界。',
      drawing: `<rect x="78" y="36" width="204" height="112" fill="#f7f8f1" stroke="#a9b8a3" stroke-width="2"/><path d="M146 36v112M214 36v112M78 92h204" stroke="#a9b8a3" stroke-width="2"/><rect x="146" y="36" width="136" height="56" fill="#e4f0df" fill-opacity=".86" stroke="#548366" stroke-width="4"/><circle cx="78" cy="36" r="4" fill="#d18d64"/><circle cx="146" cy="36" r="4" fill="#d18d64"/><circle cx="214" cy="36" r="4" fill="#d18d64"/><circle cx="282" cy="36" r="4" fill="#d18d64"/><text x="180" y="174" text-anchor="middle" class="g-formula">C(3, 2) × C(3, 2) = 9</text><text x="180" y="193" text-anchor="middle" class="g-note">选两条横线，再选两条竖线，唯一确定一个矩形</text>`
    }
  };

  const makeFigure = (item) => `<figure class="bc-geometry-figure"><svg viewBox="0 0 360 205" role="img" aria-label="${item.title}"><title>${item.title}</title><desc>${item.desc}</desc><style>.g-label{font:700 13px system-ui,sans-serif;fill:#355443}.g-note{font:600 11px system-ui,sans-serif;fill:#65766a}.g-formula{font:800 17px system-ui,sans-serif;fill:#315a43}</style>${item.drawing}</svg><figcaption>${item.caption}</figcaption></figure>`;

  Object.entries(illustrations).forEach(([id, item]) => {
    const lesson = document.getElementById(`bc-topic-${id}`);
    const concept = lesson?.querySelector('.bc-concept-box');
    if (concept && !lesson.querySelector('.bc-geometry-figure')) concept.insertAdjacentHTML('afterend', makeFigure(item));
  });

  const title = document.getElementById('bc-lab-title');
  const lead = document.getElementById('bc-lab-lead');
  const card = document.getElementById('bc-lab-card');
  const kicker = document.querySelector('#bc-lab .course-kicker');
  if (!card) return;
  if (title) title.textContent = '3D 立体观察台：拖动旋转，调一调棱长';
  if (lead) lead.textContent = '转一转长方体，从不同方向看清长、宽、高；改变棱长，体积和表面积会即时重算。';
  if (kicker) kicker.textContent = '可拖动旋转 · 实时调整棱长';

  card.innerHTML = `<div class="bc-solid-controls"><p><b>先观察，再计算：</b>长、宽、高是三个互相垂直的方向。拖动立体可以旋转；按住并拖动鼠标，或用手指滑动。</p><label class="bc-control-row" for="bc-solid-length">长 <input id="bc-solid-length" type="range" min="2" max="10" value="6"><output id="bc-solid-length-out">6</output></label><label class="bc-control-row" for="bc-solid-width">宽 <input id="bc-solid-width" type="range" min="2" max="8" value="4"><output id="bc-solid-width-out">4</output></label><label class="bc-control-row" for="bc-solid-height">高 <input id="bc-solid-height" type="range" min="2" max="7" value="3"><output id="bc-solid-height-out">3</output></label><div class="bc-solid-actions"><button class="bc-lab-button" type="button" id="bc-solid-cube">试试正方体</button><button class="bc-lab-button" type="button" id="bc-solid-reset">回到正面</button><button class="bc-lab-button" type="button" id="bc-solid-motion" aria-pressed="false">开始转动</button></div><p class="bc-lab-foot">键盘也能操作：先选中立体，再按方向键旋转；减少动态效果设置开启时，自动转动默认关闭。</p></div><div class="bc-lab-visual bc-solid-visual"><h3>长方体的三个方向</h3><canvas id="bc-solid-canvas" tabindex="0" role="img" aria-label="可交互的长方体三维示意图。用鼠标、手指拖动或方向键旋转。当前长6、宽4、高3。">你的浏览器暂不支持 Canvas 图形。</canvas><div class="bc-solid-legend"><span><i class="bc-legend-length"></i>长 <b id="bc-solid-legend-length">6</b></span><span><i class="bc-legend-width"></i>宽 <b id="bc-solid-legend-width">4</b></span><span><i class="bc-legend-height"></i>高 <b id="bc-solid-legend-height">3</b></span></div><div class="bc-live-result" id="bc-solid-result" aria-live="polite"></div></div>`;

  const canvas = document.getElementById('bc-solid-canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const length = document.getElementById('bc-solid-length');
  const width = document.getElementById('bc-solid-width');
  const height = document.getElementById('bc-solid-height');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let yaw = 0.72;
  let pitch = -0.3;
  let isDragging = false;
  let lastX = 0;
  let lastY = 0;
  let isVisible = false;
  let spin = !reducedMotion;
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
    const unitScale = Math.min(box.width * 0.25, box.height * 0.37) / maxDim;
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
      { label: `长 ${length.value}`, pairs: [[0,1],[2,3],[4,5],[6,7]], color: '#bd794c' },
      { label: `高 ${height.value}`, pairs: [[0,2],[1,3],[4,6],[5,7]], color: '#507a59' },
      { label: `宽 ${width.value}`, pairs: [[0,4],[1,5],[2,6],[3,7]], color: '#6585a0' }
    ];
    axisEdges.forEach((axis) => {
      const [a, b] = axis.pairs.map((pair) => pair.map((i) => vertices[i])).sort((p, q) => ((q[0].depth + q[1].depth) - (p[0].depth + p[1].depth)))[0];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const distance = Math.hypot(dx, dy) || 1;
      const nx = -dy / distance;
      const ny = dx / distance;
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2;
      ctx.strokeStyle = axis.color;
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
      ctx.fillStyle = '#fffefa';
      ctx.strokeStyle = axis.color;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(mx + nx * 13, my + ny * 13, 19, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#344a3c';
      ctx.font = '700 11px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(axis.label, mx + nx * 13, my + ny * 13);
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
  if (reducedMotion) setSpin(false);
})();
