const topics = ['chicken', 'trees', 'sumdiff', 'profitloss'];
const complete = new Set();

function updateProgress() {
  const count = complete.size;
  const countNode = document.getElementById('progress-count');
  const fill = document.getElementById('progress-fill');
  if (countNode) countNode.textContent = `${count} / 4`;
  if (fill) fill.style.width = `${count * 25}%`;
  topics.forEach((id) => document.getElementById(id)?.classList.toggle('is-complete', complete.has(id)));
}

document.querySelectorAll('.reveal-button').forEach((button) => {
  button.addEventListener('click', () => {
    const panel = document.getElementById(button.dataset.target);
    const opening = !panel.classList.contains('is-open');
    panel.classList.toggle('is-open', opening);
    button.setAttribute('aria-expanded', String(opening));
    button.innerHTML = opening ? '收起解题步骤 <span aria-hidden="true">＋</span>' : '展开解题步骤 <span aria-hidden="true">＋</span>';
  });
});

const rabbitSlider = document.getElementById('rabbit-slider');
function updateRabbitModel() {
  const rabbits = Number(rabbitSlider.value);
  const legs = 16 + rabbits * 2;
  const rabbitCount = document.getElementById('rabbit-count');
  const total = document.getElementById('leg-total');
  const meter = document.getElementById('leg-meter-fill');
  const feedback = document.getElementById('leg-feedback');
  rabbitCount.textContent = rabbits;
  total.textContent = `${legs} 条`;
  meter.style.width = `${((legs - 16) / 16) * 100}%`;
  if (legs === 22) {
    feedback.classList.add('is-match');
    feedback.innerHTML = '<span class="target-dot"></span><span>正好 22 条！8 个头里有 3 只兔子。</span>';
  } else if (legs < 22) {
    feedback.classList.remove('is-match');
    feedback.innerHTML = '<span class="target-dot"></span><span>目标是 22 条腿。兔子还可以再多一些。</span>';
  } else {
    feedback.classList.remove('is-match');
    feedback.innerHTML = '<span class="target-dot"></span><span>超过 22 条啦，试着把兔子减少一些。</span>';
  }
}
rabbitSlider.addEventListener('input', updateRabbitModel);

const treeVisual = document.getElementById('tree-visual');
const treeModeButtons = document.querySelectorAll('[data-tree-mode]');
function treeSvg(mode) {
  const line = mode === 'line';
  const points = line ? [[36, 30], [128, 30], [220, 30], [312, 30], [404, 30]] : [[220, 17], [263, 60], [220, 103], [177, 60]];
  const tree = ([x, y]) => `<g transform="translate(${x} ${y})"><circle class="tree-canopy" r="13"/><path class="tree-trunk" d="M-2.6 12h5.2v13h-5.2z"/></g>`;
  const ornaments = line
    ? `<path class="path-line" d="M36 77H404"/><g class="interval-marks"><path d="M36 82v8m92-8v8m92-8v8m92-8v8m92-8v8"/><text x="82" y="109">5米</text><text x="174" y="109">5米</text><text x="266" y="109">5米</text><text x="358" y="109">5米</text></g>`
    : `<circle cx="220" cy="60" r="44" fill="none" stroke="#91c6b3" stroke-width="5" stroke-dasharray="3 8"/><g class="interval-marks"><text x="245" y="21">5米</text><text x="244" y="104">5米</text></g>`;
  const title = line ? '直路上四个间隔和五棵树' : '圆形小路上四个间隔和四棵树';
  const label = line ? '20 米直路分成 4 个间隔，两个端点都种树' : '20 米圆形小路分成 4 个间隔，每个间隔种一棵树';
  return `<svg viewBox="0 0 440 120" role="img" aria-label="${label}"><title>${title}</title>${ornaments}<g>${points.map(tree).join('')}</g></svg>`;
}
function setTreeMode(mode) {
  const circle = mode === 'circle';
  treeModeButtons.forEach((button) => {
    const active = button.dataset.treeMode === mode;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  treeVisual.innerHTML = treeSvg(mode);
  const answer = document.getElementById('tree-result');
  const plus = document.getElementById('tree-plus');
  const rule = document.getElementById('tree-rule');
  const ruleTitle = document.getElementById('tree-rule-title');
  const ruleFormula = document.getElementById('tree-rule-formula');
  const svgTitle = treeVisual.querySelector('title');
  treeVisual.setAttribute('aria-label', svgTitle.textContent);
  document.getElementById('tree-step1').innerHTML = '先算间隔：<b>20 ÷ 5 = 4</b> 段。';
  document.getElementById('tree-step2').innerHTML = circle
    ? '围成一圈没有两个端点要额外补树，所以 <b>4</b> 段间隔正好种 <b>4</b> 棵树。'
    : '从第 1 棵树开始，每多一个间隔就多一棵树，所以 <b>4 + 1 = 5</b> 棵。';
  answer.textContent = circle ? '4 棵树' : '5 棵树';
  plus.textContent = circle ? '＋ 0 棵' : '＋ 1 棵';
  rule.textContent = circle ? '围成一圈：每两个相邻点之间各有一个间隔，棵数 = 间隔数。' : '两端都种：间隔数 + 1 = 树的棵数。';
  ruleTitle.textContent = circle ? '围成一圈' : '直路两端都种';
  ruleFormula.textContent = circle ? '树的棵数 = 间隔数' : '树的棵数 = 间隔数 + 1';
}
treeModeButtons.forEach((button) => button.addEventListener('click', () => setTreeMode(button.dataset.treeMode)));

const quizAnswers = {
  chicken: { value: 4, success: '对啦！先假设 10 只都是鸡：28 − 20 = 8，8 ÷ 2 = 4 只兔。', hint: '先算 10 只鸡有几条腿，再把多出的腿除以 2。' },
  trees: { value: 7, success: '正确！18 ÷ 3 = 6 段间隔，两端都种要 6 + 1 = 7 棵。', hint: '先用 18 ÷ 3 算间隔，再想两端都种要不要加 1。' },
  sumdiff: { value: 28, success: '没错！较大的数是 (46 + 10) ÷ 2 = 28。', hint: '较大的数 = (和 + 差) ÷ 2。' },
  profitloss: { value: 5, success: '答对了！差额是 6 + 4 = 10；每人多 2 颗，所以 10 ÷ 2 = 5 人。', hint: '先把多出的和不够的加起来，再除以每人多分的颗数。' }
};
function checkQuiz(topic) {
  const input = document.getElementById(`quiz-${topic}`);
  const result = document.getElementById(`result-${topic}`);
  const answer = quizAnswers[topic];
  const value = input.value.trim();
  result.classList.remove('correct', 'try-again');
  if (value === '') {
    result.textContent = '先填一个答案，再来检查吧。';
    result.classList.add('try-again');
    input.focus();
    return;
  }
  if (Number(value) === answer.value) {
    result.textContent = answer.success;
    result.classList.add('correct');
    complete.add(topic);
    updateProgress();
  } else {
    result.textContent = `再想一步：${answer.hint}`;
    result.classList.add('try-again');
    complete.delete(topic);
    updateProgress();
  }
}
document.querySelectorAll('[data-quiz]').forEach((button) => {
  button.addEventListener('click', () => checkQuiz(button.dataset.quiz));
  const topic = button.dataset.quiz;
  document.getElementById(`quiz-${topic}`).addEventListener('keydown', (event) => {
    if (event.key === 'Enter') checkQuiz(topic);
  });
});

updateRabbitModel();
setTreeMode('line');
