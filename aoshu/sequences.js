(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const patternSelect = $('#pattern-choice');
  const targetTerm = $('#target-term');
  const patterns = {
    arithmetic: {name:'等差数列', term:n=>2+3*(n-1), label:'每次加 3', formula:'aₙ=2+3(n−1)', explain:'看相邻差：5−2=3、8−5=3、11−8=3，都是 3。公差固定，所以第 n 项可用 2+3×(n−1)。'},
    geometric: {name:'等比数列', term:n=>3*2**(n-1), label:'每次乘 2', formula:'aₙ=3×2ⁿ⁻¹', explain:'看相邻项的倍数：6÷3=2、12÷6=2、24÷12=2，都是 2。公比固定，所以每向后一项就乘 2。'},
    fibonacci: {name:'斐波那契数列', term:n=>{const a=[1,1];for(let i=2;i<n;i++)a.push(a[i-1]+a[i-2]);return a[n-1]}, label:'前两项相加', formula:'F₁=F₂=1；Fₙ=Fₙ₋₁+Fₙ₋₂', explain:'从第 3 项开始，每项等于前两项之和：1+1=2、1+2=3、2+3=5。要找新项时，向前看两项。'},
    triangular: {name:'三角数', term:n=>n*(n+1)/2, label:'依次加 2、3、4……', formula:'Tₙ=n(n+1)÷2', explain:'每层多一行点：1、1+2=3、3+3=6、6+4=10。第 n 个三角数是 1 到 n 的和，也可用 n(n+1)÷2。'},
    square: {name:'平方数', term:n=>n*n, label:'1×1、2×2、3×3……', formula:'Qₙ=n²', explain:'第 n 个平方数是 n 行、每行 n 个点，所以是 n×n。相邻差是 3、5、7、9……每次多 2。'},
    alternating: {name:'交错数列', term:n=>n%2===1?n+1:n+3, label:'奇数位和偶数位分开', formula:'奇数位：2、4、6…；偶数位：5、7、9…', explain:'奇数位是 2、4、6……，偶数位是 5、7、9……。两条各自每次加 2；第 n 项要先判断它落在哪一队。'}
  };
  function renderPattern() {
    const key = patternSelect.value;
    const item = patterns[key];
    const n = Number(targetTerm.value);
    $('#term-output').value = n;
    $('#term-output').textContent = n;
    const count = n;
    const values = Array.from({length:count}, (_, i) => item.term(i+1));
    $('#term-strip').innerHTML = values.map((value, i) => `<span class="term-chip${i===n-1?' target':''}" aria-label="第 ${i+1} 项 ${value}">${value}</span>`).join('');
    $('#lab-bars').innerHTML = values.map((value, i) => {
      const scaled = Math.max(8, Math.round(Math.sqrt(value / Math.max(...values)) * 92));
      return `<div class="lab-bar-wrap"><span class="lab-bar-value">${value}</span><span class="lab-bar" style="height:${scaled}px" aria-hidden="true"></span><span class="lab-bar-index">第${i+1}项</span></div>`;
    }).join('');
    $('#lab-bars').setAttribute('aria-label', `${item.name}前${count}项：${values.join('、')}`);
    $('#lab-caption').textContent = `${item.name}：${item.label}。高低只表示数值大小。`;
    const reason = $('#lab-reason');
    reason.innerHTML = `<strong>${item.name}的线索：</strong>${item.explain}<br><strong>第 ${n} 项 = ${item.term(n)}</strong>。速记：${item.formula}。`;
    $('#lab-reveal').setAttribute('aria-expanded', String(!reason.hidden));
    $('#lab-reveal').textContent = reason.hidden ? '显示线索与推理' : '收起线索与推理';
  }
  patternSelect.addEventListener('change', renderPattern);
  targetTerm.addEventListener('input', renderPattern);
  $('#lab-reveal').addEventListener('click', () => {
    const reason = $('#lab-reason');
    reason.hidden = !reason.hidden;
    $('#lab-reveal').setAttribute('aria-expanded', String(!reason.hidden));
    $('#lab-reveal').textContent = reason.hidden ? '显示线索与推理' : '收起线索与推理';
  });
  renderPattern();

  const shapeKind = $('#shape-kind');
  const shapeSize = $('#shape-size');
  function renderShape() {
    const kind = shapeKind.value;
    const n = Number(shapeSize.value);
    $('#shape-output').value = n;
    $('#shape-output').textContent = n;
    const triangle = kind === 'triangle';
    const total = triangle ? n*(n+1)/2 : n*n;
    $('#shape-total').textContent = total;
    $('#shape-formula').textContent = triangle ? `1+2+…+${n} = ${total}` : `${n} × ${n} = ${total}`;
    let html = '';
    if (triangle) {
      for (let row=1; row<=n; row++) html += `<div class="shape-row" aria-hidden="true">${'<span class="shape-dot"></span>'.repeat(row)}</div>`;
      $('#shape-board').setAttribute('aria-label', `第 ${n} 个三角数点阵，共 ${total} 个点`);
    } else {
      html = `<div class="shape-square-grid" style="display:grid;grid-template-columns:repeat(${n},17px);gap:6px" aria-hidden="true">${'<span class="shape-dot square-dot"></span>'.repeat(total)}</div>`;
      $('#shape-board').setAttribute('aria-label', `第 ${n} 个平方数点阵，${n} 行 ${n} 列，共 ${total} 个点`);
    }
    $('#shape-board').innerHTML = html;
  }
  shapeKind.addEventListener('change', renderShape);
  shapeSize.addEventListener('input', renderShape);
  renderShape();

  const reviewKey = 'siwei-sequences-review-v1';
  let passed = new Set();
  try { passed = new Set(JSON.parse(localStorage.getItem(reviewKey) || '[]')); } catch { passed = new Set(); }
  const answers = ['17','48','13','21','8','黄'];
  const hints = [
    '先算相邻两项的差。',
    '这是每次加一样多，还是乘一样多？',
    '斐波那契数列从第 3 项起，每项等于前两项之和。',
    '三角数可以逐次加下一层，也可以套 Tₙ=n(n+1)÷2。',
    '第 7 项在奇数位，先把两队分开。',
    '用 14 除以周期 3，看余数落在哪个颜色位置。'
  ];
  function updateReview() {
    $('#review-progress').textContent = `答对 ${passed.size} / ${answers.length}`;
    $('#review-finish').hidden = passed.size !== answers.length;
    try { localStorage.setItem(reviewKey, JSON.stringify([...passed].sort((a,b)=>a-b))); } catch { /* 本地存储不可用时不影响练习 */ }
  }
  function checkReview(button) {
    const index = Number(button.dataset.review);
    const card = button.closest('.review-question');
    const input = $(`#review-${index}`);
    const feedback = $('.review-feedback', card);
    const value = input.value.trim().replace(/\s/g,'').toLowerCase();
    feedback.classList.remove('good');
    if (!value) { feedback.textContent = `先写一个答案；卡住了可以看提示：${hints[index]}`; input.focus(); return; }
    const expected = answers[index].toLowerCase();
    const correct = value === expected || (index === 5 && value === '黄色');
    if (correct) {
      passed.add(index);
      feedback.textContent = '答对了！试着用一句话说出你用的规律。';
      feedback.classList.add('good');
      updateReview();
    } else {
      feedback.textContent = `还差一点。提示：${hints[index]}`;
    }
  }
  $$('.review-question [data-review]').forEach(button => button.addEventListener('click', () => checkReview(button)));
  $$('.review-answer input').forEach((input, index) => input.addEventListener('keydown', event => { if (event.key === 'Enter') $(`[data-review="${index}"]`).click(); }));
  passed.forEach(index => {
    const card = $$('.review-question')[index];
    if (card) { $('.review-feedback', card).textContent = '这题已答对，可以继续复习。'; $('.review-feedback', card).classList.add('good'); }
  });
  updateReview();
  $('#print-card').addEventListener('click', () => window.print());
})();
