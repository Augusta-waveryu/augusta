(() => {
  const previous = window.AOSHU_FOUNDATION_WIDGETS;
  if (!previous) return;
  window.AOSHU_FOUNDATION_WIDGETS = {
    supports: t => t === 'triangle-boundary' || previous.supports(t),
    markup(config) {
      if (config.type !== 'triangle-boundary') return previous.markup(config);
      return `<section class="book-model-lab book-foundation-lab book-triangle-lab" data-book-model="triangle-boundary" aria-label="三角形小棒实验"><div class="book-model-heading"><b>固定两根5厘米、7厘米，试试第三根</b><span>先预测，再输入第三边。依次试2、3、11、12和2.5厘米，观察能否围起来。操作不计答题进度。</span></div><label class="book-number-control">第三边（厘米，0到14）<input type="number" min="0" max="14" step="any" value="7" data-foundation-model-control data-triangle-side aria-label="第三边厘米"></label><div data-triangle-drawing></div><p class="book-model-result" data-book-model-result aria-live="polite"></p><p class="book-model-caption">图按同一比例绘制：绿色三角形能围起来，虚线表示两边伸直后的比较线。图形只帮助观察，判断以边长条件为准；旋转、翻面不增加边长选择的种数。</p></section>`;
    },
    update(root) {
      if (root.dataset.bookModel !== 'triangle-boundary') return previous.update(root);
      const drawing = root.querySelector('[data-triangle-drawing]');
      const result = root.querySelector('[data-book-model-result]');
      const raw = root.querySelector('[data-triangle-side]').value.trim();
      const x = Number(raw);
      drawing.innerHTML = '';
      if (!raw || !Number.isFinite(x) || x < 0 || x > 14) {
        result.textContent = '请输入0到14之间的长度；可输入小数。0用于观察边界，不是合法的三角形边长。'; return true;
      }
      const ok = x > 2 && x < 12;
      let lines;
      if (ok) {
        // Base AB has length x; AC=5, BC=7. Coordinates use a common scale.
        const u = (x*x + 25 - 49) / (2*x);
        const h = Math.sqrt(Math.max(0,25-u*u));
        lines = `<path d="M 25 150 L ${25+x*18} 150 L ${25+u*18} ${150-h*18} Z" fill="#e3f0df" stroke="#387345" stroke-width="3"/>`;
      } else {
        // Compare the two shorter sticks placed end-to-end against the longest.
        const sides = [5,7,x].sort((a,b)=>a-b), sum = sides[0]+sides[1];
        lines = `<path d="M 25 65 h ${sides[0]*18}" stroke="#387345" stroke-width="6"/><path d="M ${25+sides[0]*18} 65 h ${sides[1]*18}" stroke="#be711e" stroke-width="6"/><path d="M 25 110 h ${sides[2]*18}" stroke="#8e4e50" stroke-width="3" stroke-dasharray="6 4"/><text x="25" y="40">短两根接起来：${sum}</text><text x="25" y="140">最长：${sides[2]}</text>`;
      }
      drawing.innerHTML = `<svg viewBox="-80 0 400 180" role="img" aria-label="${ok ? '可围成三角形，三边长5、7、'+x : '不能围成三角形，比较短两边之和与最长边'}">${lines}</svg>`;
      result.textContent = ok ? `能围成三角形：2<${x}<12。三边是5、7、${x}厘米。${Number.isInteger(x) ? '这是原例题允许的整数候选。' : '长度可以是小数，但不计入原例题的整数候选。'}` : x === 0 ? '不能围成三角形：0不是正边长。' : (x === 2 || x === 12) ? `不能围成三角形：${x}是严格范围的边界，短两边之和等于最长边，只能排成直线。` : x < 2 ? `不能围成三角形：5+${x}<7，短两根接起来也够不到最长边。` : `不能围成三角形：5+7=12<${x}，两根伸直也够不到第三根。`;
      return true;
    }
  };
})();
