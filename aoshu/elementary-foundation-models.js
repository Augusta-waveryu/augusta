(() => {
  const types = new Set(['clock-face', 'elapsed-same-hour', 'elapsed-next-hour', 'money-count', 'money-change', 'ruler-cm', 'length-converter']);
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const moneyName = (jiao) => {
    const yuan = Math.floor(jiao / 10);
    const rest = jiao % 10;
    if (yuan && rest) return `${yuan} 元 ${rest} 角`;
    if (yuan) return `${yuan} 元`;
    return `${rest} 角`;
  };
  const options = (values, selected, label = (value) => String(value)) => values.map((value) => `<option value="${esc(value)}"${Number(value) === Number(selected) ? ' selected' : ''}>${esc(label(value))}</option>`).join('');
  const select = (name, label, values, selected, format = (value) => String(value)) => `<label>${label}<select data-foundation-model-control data-foundation-model-setting="${name}" aria-label="${label}">${options(values, selected, format)}</select></label>`;
  const minuteValues = Array.from({length:12}, (_, index) => index * 5);
  const wrapper = (type, title, instruction, controls, visual, caption = '') => `<section class="book-model-lab book-foundation-lab" data-book-model="${type}" data-book-model-config="${esc(JSON.stringify({}))}" aria-label="${esc(title)}"><div class="book-model-heading"><b>${esc(title)}</b><span>${esc(instruction)}</span></div><div class="book-foundation-controls">${controls}</div>${visual}<p class="book-model-result" data-book-model-result aria-live="polite"></p>${caption ? `<p class="book-model-caption">${esc(caption)}</p>` : ''}</section>`;
  function markup(config) {
    const {type} = config;
    if (!types.has(type)) return '';
    let controls = '', visual = '', title = '', instruction = '', caption = '';
    if (type === 'clock-face') {
      title = '拨动钟面，观察两根针';
      instruction = '选小时和分钟，长针走在前面数分钟，短针随时间慢慢移动。';
      const allowedMinutes = Array.isArray(config.minutes) ? config.minutes : minuteValues;
      controls = select('hour', '小时', Array.from({length:12}, (_, index) => index + 1), config.hour || 1, (value) => `${value} 点`) + select('minute', '分钟', allowedMinutes, config.minute || 0, (value) => `${String(value).padStart(2,'0')} 分`);
      visual = '<svg class="foundation-clock" data-foundation-clock role="img" viewBox="0 0 240 240"></svg>';
      caption = '分针在 12 是整点，在 6 是半点；读到其他数字时，每一格是 5 分钟。';
    } else if (type === 'elapsed-same-hour' || type === 'elapsed-next-hour') {
      const crossing = type === 'elapsed-next-hour';
      const hour = Number(config.hour || 3);
      title = crossing ? '沿时间轴跨过一个整点' : '拖动时刻，比较经过的分钟';
      instruction = crossing ? '分别数到下一个整点、再数到结束时刻。' : '两时刻在同一小时内；结束时刻不能早于开始时刻。';
      controls = select('startMinute', `开始（${hour} 点）`, minuteValues, config.startMinute ?? 0, (value) => `${String(value).padStart(2,'0')} 分`) + select('endMinute', `结束（${crossing ? hour + 1 : hour} 点）`, minuteValues, config.endMinute ?? 0, (value) => `${String(value).padStart(2,'0')} 分`);
      visual = '<svg class="foundation-timeline" data-foundation-timeline role="img" viewBox="0 0 360 92"></svg>';
      caption = crossing ? '把整点前和整点后的分钟数分别数出，再相加。' : '同一小时内，结束分钟减开始分钟就是经过时间。';
    } else if (type === 'money-count') {
      title = '动手数一数：这几枚钱共多少';
      instruction = '改变每种面值的张数或枚数，观察总金额怎样合并。';
      const denominations = [{value:50,name:'5 元'}, {value:10,name:'1 元'}, {value:5,name:'5 角'}, {value:1,name:'1 角'}];
      controls = denominations.map((item) => select(`count-${item.value}`, item.name, [0,1,2,3,4], config.counts?.[item.value] ?? 0, (value) => `${value} 个`)).join('');
      visual = '<div class="foundation-money-pieces" data-foundation-money-pieces aria-label="选中的人民币面值示意"></div>';
      caption = '这里用文字面值示意，不使用真实钞票图；1 元可换成 10 个 1 角。';
    } else if (type === 'money-change') {
      title = '选商品价钱和付出的钱';
      instruction = '先确认钱够不够，再看零钱；角不够减时要换 1 元。';
      const prices = config.pricesJiao || [250,360,450,720,1680];
      const payments = config.paymentsJiao || [500,1000,2000];
      controls = select('priceJiao', '商品价钱', prices, config.priceJiao, (value) => moneyName(Number(value))) + select('paidJiao', '付出的钱', payments, config.paidJiao, (value) => moneyName(Number(value)));
      visual = '<div class="foundation-change-equation" data-foundation-change-equation aria-label="价钱与找零关系"><span>付出的钱</span><b aria-hidden="true">−</b><span>商品价钱</span><b aria-hidden="true">=</b><strong>找回的钱</strong></div>';
      caption = '检查方法：商品价钱 + 找回的钱 = 付出的钱。';
    } else if (type === 'ruler-cm') {
      title = '拖动线段长度，沿直尺读厘米';
      instruction = '起点对准 0 刻度，再看另一端对准几。';
      controls = `<label class="foundation-range-label">线段长度 <input type="range" min="1" max="10" step="1" value="${Number(config.lengthCm || 1)}" data-foundation-model-control data-foundation-model-setting="lengthCm" aria-label="线段长度厘米数"><output data-foundation-range-output>${Number(config.lengthCm || 1)} 厘米</output></label>`;
      visual = '<svg class="foundation-ruler" data-foundation-ruler role="img" viewBox="0 0 360 92"></svg>';
      caption = '看刻度线之间的距离；如果起点不是 0，就用终点刻度减起点刻度。';
    } else if (type === 'length-converter') {
      title = '拖动厘米数，拆成整米和剩余厘米';
      instruction = '每满 100 厘米换成 1 米，剩下的部分仍用厘米表示。';
      const max = Number(config.max || 250);
      controls = `<label class="foundation-range-label">长度 <input type="range" min="0" max="${max}" step="1" value="${Number(config.centimeters || 0)}" data-foundation-model-control data-foundation-model-setting="centimeters" aria-label="厘米长度"><output data-foundation-range-output>${Number(config.centimeters || 0)} 厘米</output></label>`;
      visual = '<svg class="foundation-length-bar" data-foundation-length-bar role="img" viewBox="0 0 360 82"></svg>';
      caption = '换单位只改变写法，不会改变实际长度。';
    }
    let html = wrapper(type, title, instruction, controls, visual, caption);
    html = html.replace(`data-book-model-config="${esc(JSON.stringify({}))}"`, `data-book-model-config="${esc(JSON.stringify(config))}"`);
    return html;
  }
  const point = (radius, angle, center = 120) => ({x: center + radius * Math.cos(angle * Math.PI / 180), y: center + radius * Math.sin(angle * Math.PI / 180)});
  function clockSvg(hour, minute) {
    hour = Math.min(12, Math.max(1, Number(hour) || 1));
    minute = Math.min(55, Math.max(0, Number(minute) || 0));
    const ticks = Array.from({length:60}, (_, index) => {
      const angle = index * 6 - 90;
      const outer = point(96, angle);
      const inner = point(index % 5 === 0 ? 85 : 91, angle);
      return `<line x1="${inner.x.toFixed(1)}" y1="${inner.y.toFixed(1)}" x2="${outer.x.toFixed(1)}" y2="${outer.y.toFixed(1)}" class="${index % 5 === 0 ? 'is-major' : ''}"/>`;
    }).join('');
    const numbers = Array.from({length:12}, (_, index) => {
      const n = index + 1;
      const p = point(69, n * 30 - 90);
      return `<text x="${p.x.toFixed(1)}" y="${(p.y + 5).toFixed(1)}">${n}</text>`;
    }).join('');
    const minuteHand = point(58, minute * 6 - 90);
    const hourHand = point(40, (hour % 12) * 30 + minute * 0.5 - 90);
    const timeName = `${hour} 点 ${String(minute).padStart(2,'0')} 分`;
    return `<title>${timeName}的钟面</title><circle class="clock-face-circle" cx="120" cy="120" r="101"/><g class="clock-ticks">${ticks}</g><g class="clock-numbers">${numbers}</g><line class="clock-hand clock-hour-hand" x1="120" y1="120" x2="${hourHand.x.toFixed(1)}" y2="${hourHand.y.toFixed(1)}"/><line class="clock-hand clock-minute-hand" x1="120" y1="120" x2="${minuteHand.x.toFixed(1)}" y2="${minuteHand.y.toFixed(1)}"/><circle class="clock-hub" cx="120" cy="120" r="4"/>`;
  }
  function rulerSvg(length) {
    length = Math.min(10, Math.max(1, Number(length) || 1));
    const left = 20, scale = 30;
    const ticks = Array.from({length:11}, (_, cm) => {
      const x = left + cm * scale;
      return `<line x1="${x}" y1="37" x2="${x}" y2="${cm % 5 === 0 ? 17 : 27}" class="${cm % 5 === 0 ? 'is-major' : ''}"/><text x="${x}" y="68">${cm}</text>`;
    }).join('');
    return `<title>从 0 到 ${length} 厘米的直尺示意</title><rect class="ruler-highlight" x="${left}" y="38" width="${length * scale}" height="12" rx="5"/><line class="ruler-edge" x1="${left}" y1="50" x2="${left + 10 * scale}" y2="50"/><g class="ruler-ticks">${ticks}</g><text class="ruler-unit" x="20" y="88">单位：厘米</text>`;
  }
  function lengthBarSvg(cm, max) {
    cm = Math.min(max, Math.max(0, Number(cm) || 0));
    const left = 20, width = 310;
    const ticks = Array.from({length:26}, (_, index) => {
      const value = index * 10;
      if (value > max) return '';
      const x = left + width * value / max;
      const major = value % 50 === 0;
      const label = value % 100 === 0 || value === max ? `<text x="${x.toFixed(1)}" y="75">${value}</text>` : '';
      return `<line x1="${x.toFixed(1)}" y1="${major ? 34 : 43}" x2="${x.toFixed(1)}" y2="58" class="${major ? 'is-major' : ''}"/>${label}`;
    }).join('');
    const fillWidth = width * cm / max;
    return `<title>${cm} 厘米，在 100 厘米处每满一米</title><rect class="length-bar-outline" x="${left}" y="32" width="${width}" height="18" rx="8"/><rect class="length-bar-fill" x="${left}" y="32" width="${fillWidth.toFixed(1)}" height="18" rx="8"/><g class="ruler-ticks">${ticks}</g>`;
  }
  function timelineSvg(duration, startMinute, endMinute, crossing) {
    const width = 300, left = 28;
    const ticks = Array.from({length:13}, (_, index) => {
      const x = left + width * index / 12;
      return `<line x1="${x.toFixed(1)}" y1="${index % 3 === 0 ? 30 : 37}" x2="${x.toFixed(1)}" y2="54" class="${index % 3 === 0 ? 'is-major' : ''}"/>${index % 3 === 0 ? `<text x="${x.toFixed(1)}" y="75">${index * 5}</text>` : ''}`;
    }).join('');
    const fillWidth = width * Math.min(60, Math.max(0,duration)) / 60;
    return `<title>经过 ${duration} 分钟的时间轴</title><line class="timeline-base" x1="${left}" y1="50" x2="${left + width}" y2="50"/><line class="timeline-elapsed" x1="${left}" y1="50" x2="${left + fillWidth}" y2="50"/><g class="ruler-ticks">${ticks}</g><text class="timeline-caption" x="178" y="15">${crossing ? `${startMinute} 分到整点，再到 ${endMinute} 分` : `${startMinute} 分到 ${endMinute} 分`}</text>`;
  }
  function update(root) {
    if (!root || !types.has(root.dataset.bookModel)) return false;
    let config = {};
    try { config = JSON.parse(root.dataset.bookModelConfig || '{}'); } catch { config = {}; }
    const result = root.querySelector('[data-book-model-result]');
    const get = (name, fallback = 0) => Number(root.querySelector(`[data-foundation-model-setting="${name}"]`)?.value ?? fallback);
    if (root.dataset.bookModel === 'clock-face') {
      const hour = get('hour', config.hour || 1);
      const minute = get('minute', config.minute || 0);
      const svg = root.querySelector('[data-foundation-clock]');
      svg.innerHTML = clockSvg(hour, minute);
      svg.setAttribute('aria-label', `${hour} 点 ${String(minute).padStart(2,'0')} 分钟面示意图`);
      result.textContent = `现在是 ${hour} 点 ${String(minute).padStart(2,'0')} 分。短针表示小时，长针表示分钟。`;
    } else if (root.dataset.bookModel === 'elapsed-same-hour' || root.dataset.bookModel === 'elapsed-next-hour') {
      const crossing = root.dataset.bookModel === 'elapsed-next-hour';
      const hour = Number(config.hour || 3);
      const start = get('startMinute', config.startMinute || 0);
      const end = get('endMinute', config.endMinute || 0);
      const invalid = !crossing && end < start;
      const duration = crossing ? 60 - start + end : end - start;
      const svg = root.querySelector('[data-foundation-timeline]');
      svg.innerHTML = timelineSvg(invalid ? 0 : duration, start, end, crossing);
      const finishHour = crossing ? hour + 1 : hour;
      const prefix = `${hour}:${String(start).padStart(2,'0')} 到 ${finishHour}:${String(end).padStart(2,'0')}`;
      result.textContent = invalid ? '结束时刻早于开始时刻；请把结束分钟调到开始分钟之后。' : `${prefix}，经过 ${duration} 分钟。` + (crossing ? `先到整点 ${60 - start} 分钟，再走 ${end} 分钟。` : '结束分钟减开始分钟，或沿轴分段数，结果相同。');
      svg.setAttribute('aria-label', invalid ? '结束时刻早于开始时刻' : `${prefix}，共经过${duration}分钟`);
    } else if (root.dataset.bookModel === 'money-count') {
      const denominations = [{value:50,name:'5 元'}, {value:10,name:'1 元'}, {value:5,name:'5 角'}, {value:1,name:'1 角'}];
      let total = 0;
      const pieces = [];
      denominations.forEach((item) => {
        const count = get(`count-${item.value}`, config.counts?.[item.value] || 0);
        total += item.value * count;
        for (let i = 0; i < count; i++) pieces.push(`<span class="foundation-money-piece">${item.name}</span>`);
      });
      root.querySelector('[data-foundation-money-pieces]').innerHTML = pieces.length ? pieces.join('') : '<span class="foundation-money-empty">先选一张或一枚钱</span>';
      result.textContent = `合计 ${moneyName(total)}；也就是 ${total} 角。`;
    } else if (root.dataset.bookModel === 'money-change') {
      const price = get('priceJiao', config.priceJiao || 0);
      const paid = get('paidJiao', config.paidJiao || 0);
      const equation = root.querySelector('[data-foundation-change-equation]');
      const amount = equation.querySelectorAll('span,strong');
      amount[0].textContent = `付 ${moneyName(paid)}`;
      amount[1].textContent = `价 ${moneyName(price)}`;
      const enough = paid >= price;
      const change = paid - price;
      amount[2].textContent = enough ? `找 ${moneyName(change)}` : '钱不够';
      if (!enough) {
        result.textContent = `付出的 ${moneyName(paid)} 少于价钱 ${moneyName(price)}，还差 ${moneyName(price - paid)}。`;
      } else {
        const paidYuan = Math.floor(paid / 10), paidJiao = paid % 10;
        const priceYuan = Math.floor(price / 10), priceJiao = price % 10;
        if (paidJiao < priceJiao) {
          const borrowedYuan = paidYuan - 1;
          result.textContent = `把 1 元换成 10 角：${borrowedYuan} 元 ${paidJiao + 10} 角 − ${priceYuan} 元 ${priceJiao} 角 = ${moneyName(change)}。加回价钱核对：${moneyName(price)} + ${moneyName(change)} = ${moneyName(paid)}。`;
        } else {
          result.textContent = `${moneyName(paid)} − ${moneyName(price)} = ${moneyName(change)}。加回价钱核对：${moneyName(price)} + ${moneyName(change)} = ${moneyName(paid)}。`;
        }
      }
    } else if (root.dataset.bookModel === 'ruler-cm') {
      const cm = get('lengthCm', config.lengthCm || 1);
      root.querySelector('[data-foundation-ruler]').innerHTML = rulerSvg(cm);
      root.querySelector('[data-foundation-range-output]').textContent = `${cm} 厘米`;
      result.textContent = `起点 0 厘米，终点 ${cm} 厘米，长度是 ${cm} 厘米。`;
      root.querySelector('[data-foundation-ruler]').setAttribute('aria-label', `直尺示意：从0到${cm}厘米`);
    } else if (root.dataset.bookModel === 'length-converter') {
      const cm = get('centimeters', config.centimeters || 0);
      const max = Number(config.max || 250);
      const m = Math.floor(cm / 100), rest = cm % 100;
      root.querySelector('[data-foundation-length-bar]').innerHTML = lengthBarSvg(cm, max);
      root.querySelector('[data-foundation-length-bar]').setAttribute('aria-label', `${cm}厘米等于${m}米${rest}厘米`);
      root.querySelector('[data-foundation-range-output]').textContent = `${cm} 厘米`;
      result.textContent = `${cm} 厘米 = ${m} 米 ${rest} 厘米。${Math.floor(cm / 100)} 组 100 厘米是 ${m} 米，剩下 ${rest} 厘米。`;
    }
    return true;
  }
  window.AOSHU_FOUNDATION_WIDGETS = {markup, update, supports: (type) => types.has(type)};
})();
