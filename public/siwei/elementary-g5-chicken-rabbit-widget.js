(() => {
  const previous = window.AOSHU_FOUNDATION_WIDGETS;
  if (!previous) return;
  window.AOSHU_FOUNDATION_WIDGETS = {
    supports: type => type === 'chicken-rabbit-swap' || previous.supports(type),
    markup(config) {
      if (config.type !== 'chicken-rabbit-swap') return previous.markup(config);
      return `<section class="book-model-lab book-foundation-lab book-chicken-lab" data-book-model="chicken-rabbit-swap" aria-label="固定8个头的鸡兔替换实验台"><div class="book-model-heading"><b>头数不变，每换一只多2条腿</b><span>先把兔子调到0，再逐只增加。每张卡片表示一个头；●为共同的2条腿，＋为兔子多出的2条腿。操作不记录答题进度。</span></div><div class="book-foundation-controls"><label>目标腿数（整数0—100）<input type="number" min="0" max="100" step="1" value="22" data-foundation-model-control data-chicken-target aria-label="目标腿数"></label><label>把几只鸡换成兔（0—8）<input type="range" min="0" max="8" step="1" value="0" data-foundation-model-control data-chicken-rabbits aria-label="兔子只数"></label></div><div class="book-chicken-board" data-chicken-board role="img"></div><p class="book-model-result" data-book-model-result aria-live="polite"></p></section>`;
    },
    update(root) {
      if (root.dataset.bookModel !== 'chicken-rabbit-swap') return previous.update(root);
      const board = root.querySelector('[data-chicken-board]');
      const result = root.querySelector('[data-book-model-result]');
      const raw = root.querySelector('[data-chicken-target]').value.trim();
      const rabbits = Number(root.querySelector('[data-chicken-rabbits]').value);
      const target = Number(raw);
      if (!raw || !Number.isInteger(target) || target < 0 || target > 100 || !Number.isInteger(rabbits) || rabbits < 0 || rabbits > 8) {
        board.innerHTML = ''; board.removeAttribute('aria-label');
        result.textContent = '请输入0到100之间的整数腿数，兔子只数须为0到8的整数；空白或小数不作判断。';
        return true;
      }
      const chickens = 8 - rabbits, legs = chickens * 2 + rabbits * 4;
      board.innerHTML = Array.from({length:8}, (_, i) => {
        const rabbit = i < rabbits;
        return `<div class="book-chicken-animal${rabbit ? ' is-rabbit' : ''}" aria-hidden="true"><b>${rabbit ? '兔' : '鸡'} ${i + 1}</b><span class="book-chicken-feet">● ●${rabbit ? ' <em>＋ ＋</em>' : ''}</span><small>${rabbit ? '2+2=4条腿' : '2条腿'}</small></div>`;
      }).join('');
      board.setAttribute('aria-label', `共8个头：鸡${chickens}只、兔${rabbits}只；每只共同2腿，${rabbits}只兔各多2腿，共${legs}条腿。`);
      const equation = `鸡${chickens}只、兔${rabbits}只：${chickens}+${rabbits}=8个头；8×2+${rabbits}×2=${legs}条腿。`;
      if (target < 16 || target > 32) {
        result.textContent = `${equation}目标${target}条腿无解：8只全鸡至少16腿，全兔最多32腿，目标超出范围。不能把负数或超过8的兔子数当答案。`;
      } else if (target % 2 !== 0) {
        result.textContent = `${equation}目标${target}条腿无解：每次增加2腿，只能得到16、18、…、32这些偶数；动物不能有半只。`;
      } else if (legs === target) {
        result.textContent = `${equation}正好达到目标${target}！双重核验：${chickens}×2+${rabbits}×4=${target}。反向全兔法：(32−${target})÷2=${chickens}只鸡。`;
      } else {
        const difference = Math.abs(target - legs), swaps = difference / 2;
        result.textContent = `${equation}距目标${target}还${legs < target ? '少' : '多'}${difference}条腿。${legs < target ? '再把' : '退回'}${swaps}只${legs < target ? '鸡换成兔' : '兔换成鸡'}，总头数仍是8。先预测，再移动滑杆核对。`;
      }
      return true;
    }
  };
})();
