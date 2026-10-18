(() => {
  const previous = window.AOSHU_FOUNDATION_WIDGETS || {supports: () => false, markup: () => '', update: () => false};
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const divisors = [2, 3, 5, 7, 9, 10];
  const rule = (n, d) => {
    const digits = String(n).split('').map(Number), last = n % 10, sum = digits.reduce((a, b) => a + b, 0);
    if (d === 2) return {ok: n % 2 === 0, test: `个位 ${last} ${[0,2,4,6,8].includes(last) ? '是' : '不是'} 0、2、4、6、8`};
    if (d === 5) return {ok: n % 5 === 0, test: `个位 ${last} ${[0,5].includes(last) ? '是' : '不是'} 0 或 5`};
    if (d === 10) return {ok: n % 10 === 0, test: `个位 ${last} ${last === 0 ? '是' : '不是'} 0`};
    if (d === 7) return {ok: n % 7 === 0, test: `不能用数位和 ${sum} 判断7；直接用 ${n}=7×${Math.floor(n / 7)}+${n % 7} 核验`};
    return {ok: n % d === 0, test: `数位和 ${digits.join('+')}=${sum} ${sum % d === 0 ? '能' : '不能'}被 ${d} 整除`};
  };
  window.AOSHU_FOUNDATION_WIDGETS = {
    supports: type => type === 'divisibility-place-value' || previous.supports(type),
    markup(config) {
      if (config.type !== 'divisibility-place-value') return previous.markup(config);
      const n = Number(config.number || 246), d = Number(config.divisor || 3);
      return `<section class="book-model-lab book-foundation-lab book-divisibility-lab" data-book-model="divisibility-place-value" aria-label="整除特征位值实验台"><div class="book-model-heading"><b>选一个数和除数，拆开位值再判断</b><span>先选数字与除数，再看“前面的整组”为什么不影响余数；这是观察工具，不记录答题进度。</span></div><div class="book-foundation-controls"><label>数字<select data-foundation-model-control data-div-number aria-label="选择数字">${[0,12,16,120,246,234,745,1740,3168].map(v => `<option value="${v}"${v === n ? ' selected' : ''}>${v}</option>`).join('')}</select></label><label>除数<select data-foundation-model-control data-div-divisor aria-label="选择除数">${divisors.map(v => `<option value="${v}"${v === d ? ' selected' : ''}>${v}</option>`).join('')}</select></label></div><div class="book-div-place-value" data-div-place-value role="img"></div><p class="book-model-result" data-book-model-result aria-live="polite"></p></section>`;
    },
    update(root) {
      if (root.dataset.bookModel !== 'divisibility-place-value') return previous.update(root);
      const n = Number(root.querySelector('[data-div-number]')?.value), d = Number(root.querySelector('[data-div-divisor]')?.value), board = root.querySelector('[data-div-place-value]'), result = root.querySelector('[data-book-model-result]');
      if (!Number.isInteger(n) || n < 0 || !divisors.includes(d)) { result.textContent = '请选择自然数和非 0 除数。'; return true; }
      const text = String(n).split('').map((digit, i, all) => `<span><b>${esc(digit)}</b><small>${['个位','十位','百位','千位'][all.length - i - 1] || '更高位'}</small></span>`).join('');
      board.innerHTML = `<div class="book-div-digits">${text}</div><p>位值展开：${String(n).split('').map((digit, i, all) => `${digit}×${10 ** (all.length - i - 1)}`).join(' + ')}</p>`;
      const sum = String(n).split('').reduce((a,b) => a + Number(b),0);
      const explanation = d === 3 || d === 9
        ? `${n}=${n - sum}+${sum}；拿走的${n - sum}是${d}的倍数，剩下数位和${sum}，只看它能否分尽。`
        : d === 7 ? '7不适用本课的个位或数位和判据，回到除法核验。'
        : `${n}=${Math.floor(n / 10)}×10+${n % 10}；前面的${Math.floor(n / 10)}个十都能被${d}整除，只需检查个位。`;
      board.innerHTML += `<p>${explanation}</p>`;
      board.setAttribute('aria-label', `数字${n}的位值展开。${explanation}`);
      const verdict = rule(n, d), exact = n % d === 0;
      result.textContent = `${n} ÷ ${d} ${exact ? '没有余数，能' : '有余数，不能'}被 ${d} 整除。${verdict.test}；直接核验余数为 ${n % d}。${d === 3 || d === 9 ? '因为 10、100、1000…除以它的余数都等于1，所以可看数位和。' : '不能把这个判据套给别的除数；例如16的数位和是7，但16不能被7整除。'}`;
      return true;
    }
  };
})();
