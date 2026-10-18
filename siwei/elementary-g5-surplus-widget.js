(() => {
  const previous = window.AOSHU_FOUNDATION_WIDGETS;
  if (!previous) return;
  const cases = {
    mixed: {a:3,b:5,r:8,s:-2,total:23,n:5,name:'一盈一亏'},
    surplus: {a:5,b:7,r:12,s:2,total:37,n:5,name:'两次有余'},
    shortage: {a:4,b:6,r:-3,s:-11,total:13,n:4,name:'两次不足'},
    exact: {a:3,b:5,r:6,s:0,total:15,n:3,name:'一次恰好'}
  };
  const balance = n => n > 0 ? `余${n}个` : n < 0 ? `缺${-n}个` : '恰好';
  window.AOSHU_FOUNDATION_WIDGETS = {
    supports:type => type === 'surplus-comparison' || previous.supports(type),
    markup(config) {
      if (config.type !== 'surplus-comparison') return previous.markup(config);
      return `<section class="book-model-lab book-foundation-lab book-surplus-lab" data-book-model="surplus-comparison" aria-label="盈亏两种分法对比实验台"><div class="book-model-heading"><b>先预测人数，再看两种分法是否同时对上</b><span>每种情境都是同一批物品、同一群人的两种假想分法，不是真的连续分两次。下方条形图随你的猜想变化；操作不记录答题进度。</span></div><div class="book-foundation-controls"><label>选择盈亏情境<select data-foundation-model-control data-surplus-case aria-label="盈亏情境"><option value="mixed">一盈一亏：每人3个余8，每人5个缺2</option><option value="surplus">两次有余：每人5个余12，每人7个余2</option><option value="shortage">两次不足：每人4个缺3，每人6个缺11</option><option value="exact">一次恰好：每人3个余6，每人5个恰好</option></select></label><label>预测人数（1—8）<input type="range" min="1" max="8" step="1" value="1" data-foundation-model-control data-surplus-people aria-label="预测人数"></label></div><div class="book-surplus-board" data-surplus-board role="img"></div><p class="book-model-result" data-book-model-result aria-live="polite"></p></section>`;
    },
    update(root) {
      if (root.dataset.bookModel !== 'surplus-comparison') return previous.update(root);
      const board = root.querySelector('[data-surplus-board]'), result = root.querySelector('[data-book-model-result]');
      const c = cases[root.querySelector('[data-surplus-case]').value];
      const raw = root.querySelector('[data-surplus-people]').value.trim(), n = Number(raw);
      if (!c || !raw || !Number.isInteger(n) || n < 1 || n > 8) {
        board.innerHTML=''; board.removeAttribute('aria-label');
        result.textContent='请选择有效情境，并把预测人数设为1到8的整数。'; return true;
      }
      const first=c.a*n, second=c.b*n, r=c.total-first, s=c.total-second;
      const max=Math.max(c.total,first,second);
      const row=(label,value,kind)=>`<div class="book-surplus-row"><b>${label}：${value}个</b><div class="book-surplus-track"><span class="${kind}" style="width:${value/max*100}%"></span></div></div>`;
      board.innerHTML=row('固定总量',c.total,'is-total')+row(`方案一 每人${c.a}个`,first,'is-first')+row(`方案二 每人${c.b}个`,second,'is-second')+`<p>现在${n}人：方案一${balance(r)}，方案二${balance(s)}。</p>`;
      board.setAttribute('aria-label',`同一批${c.total}个物品，预测${n}人。每人${c.a}个需要${first}个，${balance(r)}；每人${c.b}个需要${second}个，${balance(s)}。两根需求条用同一比例尺，与固定总量条比较。`);
      const extra=c.r-c.s, each=c.b-c.a;
      const reason=c.r>=0&&c.s<0 ? `从余${c.r}到缺${-c.s}，跨过恰好点，总需求增加${c.r}+${-c.s}=${extra}个` : c.r<0 ? `缺口从${-c.r}扩大到${-c.s}，总需求增加${-c.s}−${-c.r}=${extra}个` : `剩余从${c.r}减少到${c.s}，总需求增加${c.r}−${c.s}=${extra}个`;
      result.textContent = n === c.n
        ? `两种分法都对上了！${reason}；每人增加${c.b}−${c.a}=${each}个，人数=${extra}÷${each}=${n}。总量双验：${c.a}×${n}${c.r>=0?'+':'−'}${Math.abs(c.r)}=${c.total}；${c.b}×${n}${c.s>=0?'+':'−'}${Math.abs(c.s)}=${c.total}。`
        : `预测${n}人时，每人增加${each}个，所有人需求只增加${n}×${each}=${second-first}个；题目要求增加${extra}个。当前余额是${balance(r)}、${balance(s)}，目标是${balance(c.r)}、${balance(c.s)}。请${n<c.n?'增加':'减少'}人数，再同时核对两条条件。`;
      return true;
    }
  };
})();
