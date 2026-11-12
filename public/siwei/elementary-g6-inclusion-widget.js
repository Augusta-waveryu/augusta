(() => {
  const previous = window.AOSHU_FOUNDATION_WIDGETS;
  if (!previous) return;
  window.AOSHU_FOUNDATION_WIDGETS = {
    supports: type => type === 'inclusion-four-regions' || previous.supports(type),
    markup(config) {
      if (config.type !== 'inclusion-four-regions') return previous.markup(config);
      const inputs = [['total','全体人数',20],['a','参加甲项人数（含两项都参加）',12],['b','参加乙项人数（含两项都参加）',15],['both','两项都参加人数',8]];
      return `<section class="book-model-lab book-foundation-lab book-inclusion-lab" data-book-model="inclusion-four-regions" aria-label="容斥四区域实验台"><div class="book-model-heading"><b>每个人只进一个小格</b><span>先预测：两项都参加的人变多，“至少一项”会变多还是变少？再改数字核对。各输入接受0—60的整数；操作不计入答题进度。</span></div><div class="book-foundation-controls">${inputs.map(([key,label,value]) => `<label>${label}<input type="number" min="0" max="60" step="1" value="${value}" data-foundation-model-control data-inclusion-${key} aria-label="${label}"></label>`).join('')}</div><div class="book-inclusion-board" data-inclusion-board></div><p class="book-model-result" data-book-model-result aria-live="polite"></p><p class="book-model-caption">点阵分区图：每个圆点代表1人；每个人只属于一个格，不靠图形面积猜人数。前三格合起来是“至少一项”；只有第一、第三格是“恰好一项”。试试交集7、12、6、13分别会怎样。</p></section>`;
    },
    update(root) {
      if (root.dataset.bookModel !== 'inclusion-four-regions') return previous.update(root);
      const board = root.querySelector('[data-inclusion-board]'), result = root.querySelector('[data-book-model-result]');
      const raws = ['total','a','b','both'].map(key => root.querySelector(`[data-inclusion-${key}]`).value.trim());
      const values = raws.map(Number);
      board.innerHTML = '';
      if (raws.some(v => !v) || values.some(v => !Number.isInteger(v) || v < 0 || v > 60)) {
        result.textContent = '请输入0到60之间的整数人数；空白、小数、负数或超范围数不能代表本实验的人数。'; return true;
      }
      const [u,a,b,c] = values;
      if (a > u || b > u) {
        result.textContent = '数据不可能：甲项和乙项都来自同一全体，各项人数不能超过全体人数。'; return true;
      }
      const low = Math.max(0,a+b-u), high = Math.min(a,b);
      if (c < low || c > high) {
        result.textContent = `数据不可能：两项都参加的人数应在${low}到${high}之间（含两端）。` + (c > high ? `交集${c}人不能超过较小一组的${high}人，否则“只参加”会变成负数。` : `至少一项算出${a+b-c}人，超过全体${u}人；至少要有${low}人重叠。`); return true;
      }
      const regions = [['只参加甲',a-c],['两项都参加',c],['只参加乙',b-c],['两项都不参加',u-a-b+c]];
      board.innerHTML = `<div class="book-inclusion-universe"><b>同一全体：${u}人 · 四格互不重叠</b><div class="book-inclusion-regions">${regions.map(([label,n],i) => `<section class="book-inclusion-region region-${i}" aria-label="${label}${n}人"><h5>${label}</h5><strong>${n}人</strong><div class="book-inclusion-dots" aria-hidden="true">${'<i></i>'.repeat(n)}</div></section>`).join('')}</div></div>`;
      result.textContent = `至少一项：${a}+${b}−${c}=${a+b-c}人；恰好一项：${a-c}+${b-c}=${a+b-2*c}人；都不参加：${u}−${a+b-c}=${u-a-b+c}人。可行交集是${low}到${high}人（含两端）。` + (c === 0 ? '交集为0，两组互不重叠，可以直接相加。' : c === high ? '较小的一组完全包含在另一组里，所以它的人都在交集中。' : '固定两组人数，交集每增加1人，至少一项人数就减少1人。');
      return true;
    }
  };
})();
