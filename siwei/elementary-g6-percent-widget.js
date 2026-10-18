(() => {
  const previous = window.AOSHU_FOUNDATION_WIDGETS;
  if (!previous) return;
  const fmt = n => String(Number(n.toFixed(8)));
  window.AOSHU_FOUNDATION_WIDGETS = {
    supports: type => type === 'percent-base-change' || previous.supports(type),
    markup(config) {
      if (config.type !== 'percent-base-change') return previous.markup(config);
      return `<section class="book-model-lab book-foundation-lab book-percent-lab" data-book-model="percent-base-change" aria-label="两步百分数基数实验台"><div class="book-model-heading"><b>第二步的100%，已经换了</b><span>先预测最后是否回到原价，再切换场景。每条都按最初原价的同一尺度绘制；第二步另标自己的基数。操作不记录答题进度，不模拟商家舍入。</span></div><div class="book-foundation-controls"><label>变化场景<select data-foundation-model-control data-percent-case aria-label="百分数场景"><option value="rise-fall">先涨20%，再跌20%</option><option value="discounts">先打八折，再打九折</option><option value="fall-rise">先跌20%，再涨25%</option><option value="zero">先降100%，再涨20%</option></select></label><label>原价（整数1—1000元）<input type="number" min="1" max="1000" step="1" value="100" data-foundation-model-control data-percent-base aria-label="原价"></label></div><ol class="book-percent-stations" data-percent-stations></ol><p class="book-model-result" data-book-model-result aria-live="polite"></p></section>`;
    },
    update(root) {
      if (root.dataset.bookModel !== 'percent-base-change') return previous.update(root);
      const board = root.querySelector('[data-percent-stations]'), result = root.querySelector('[data-book-model-result]');
      const raw = root.querySelector('[data-percent-base]').value.trim(), base = Number(raw);
      const key = root.querySelector('[data-percent-case]').value;
      const cases = {
        'rise-fall': [1.2, 0.8, '涨20%', '跌20%'],
        discounts: [0.8, 0.9, '打八折', '打九折'],
        'fall-rise': [0.8, 1.25, '跌20%', '涨25%'],
        zero: [0, 1.2, '降100%', '涨20%']
      };
      if (!raw || !Number.isInteger(base) || base < 1 || base > 1000 || !cases[key]) {
        board.innerHTML = ''; result.textContent = '请输入1到1000之间的整数原价，并选择给定场景；空白、小数和零原价不作计算。'; return true;
      }
      const [a,b,labelA,labelB] = cases[key], middle = base*a, final = middle*b;
      const values = [base,middle,final], ratios = [1,a,a*b];
      const labels = ['最初原价', `第一步：${labelA}`, `第二步：${labelB}`];
      const notes = ['本步基数就是原价', `以${fmt(base)}元为100%`, `以${fmt(middle)}元为100%`];
      board.innerHTML = values.map((n,i) => `<li><b>${labels[i]}</b><strong>${fmt(n)}元</strong><small>${notes[i]}</small><div class="book-percent-track" aria-hidden="true"><span style="width:${fmt(ratios[i]/1.25*100)}%"></span></div><small>占最初原价${fmt(ratios[i]*100)}%</small></li>`).join('');
      const change = fmt(Math.abs(final-base));
      result.textContent = `${fmt(base)}×${a}=${fmt(middle)}元；${fmt(middle)}×${b}=${fmt(final)}元。第二步的基数是${fmt(middle)}元，不是${fmt(base)}元。` + (key === 'zero' ? '降到0后，即使再乘1.2仍为0；这是已知基数的正向计算，不代表从0到正数能定义增长率，也不能从零折现价唯一反求原价。' : key === 'fall-rise' ? '正好回到原价：下跌20%后需上涨25%，不是20%。' : `最终比原价少${change}元，少${fmt((1-a*b)*100)}%。两步倍率相乘，不能直接把百分数相加。`);
      return true;
    }
  };
})();
