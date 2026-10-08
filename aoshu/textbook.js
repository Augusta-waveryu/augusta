(() => {
  const lessons = window.AOSHU_TEXTBOOK_LESSONS || [];
  const progressKey = 'aoshu-elementary-roadmap-v2';
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const normalize = (value) => String(value ?? '').toLowerCase().replace(/[\s，,。.!！?？:：;；、/\\=（）()“”‘’'"\-]/g, '');
  const keyOf = (lesson) => lesson.key || `g${lesson.grade || 3}-${lesson.n}`;
  const list = document.getElementById('book-lessons');
  const search = document.getElementById('book-search');
  const gradeFilter = document.getElementById('book-grade-filter');
  const topicFilter = document.getElementById('book-filter');
  const onlyUnmastered = document.getElementById('book-only-unmastered');
  const visibleCount = document.getElementById('book-visible-count');
  const empty = document.getElementById('book-empty');
  let progress = {};
  try { progress = JSON.parse(localStorage.getItem(progressKey) || '{}'); } catch { progress = {}; }

  const practiceList = (lesson) => lesson.deepUnit?.practices?.length
    ? lesson.deepUnit.practices
    : [{question:lesson.practice,answers:lesson.answers,hint:lesson.hint,explanation:lesson.explanation}];
  const solvedFor = (lesson) => {
    const saved = progress[keyOf(lesson)];
    if (lesson.deepUnit) return Array.isArray(saved?.solved) ? saved.solved : [];
    return saved?.done ? [0] : [];
  };
  const isDone = (lesson) => solvedFor(lesson).length >= practiceList(lesson).length;

  const grades = [...new Set(lessons.map((lesson) => Number(lesson.grade || 3)))].sort((a,b) => a-b);
  grades.forEach((grade) => {
    const option = document.createElement('option');
    option.value = String(grade);
    option.textContent = `${['','一年级','二年级','三年级','四年级','五年级','六年级'][grade] || `${grade}年级`}`;
    gradeFilter.append(option);
  });
  const topics = [...new Set(lessons.map((lesson) => lesson.group))];
  topics.forEach((topic) => {
    const option = document.createElement('option');
    option.value = topic;
    option.textContent = topic;
    topicFilter.append(option);
  });

  function updateProgress() {
    const done = lessons.filter(isDone).length;
    const count = document.getElementById('book-progress-count');
    const fill = document.getElementById('book-progress-fill');
    const caption = document.getElementById('book-progress-caption');
    count.textContent = `${done} / ${lessons.length}`;
    fill.style.width = `${lessons.length ? done / lessons.length * 100 : 0}%`;
    caption.textContent = done === lessons.length && done
      ? '所有课程都留下脚印了。挑一讲复习，或者打开关联专题做更多练习。'
      : done ? `已经完成 ${done} 讲；可以用年级筛选继续找还没掌握的内容。`
        : '每完成一讲的自测，就会记下一枚学习脚印。';
  }

  function deepUnitMarkup(unit, key) {
    if (!unit) return '';
    const concepts = (unit.concepts || []).map((item) => `<article><b>${esc(item.title)}</b><p>${esc(item.text)}</p></article>`).join('');
    const model = unit.model ? `<section class="book-model-lab" data-book-model="${esc(unit.model.type)}" data-book-model-config="${esc(JSON.stringify(unit.model))}" aria-label="互动图示"><div class="book-model-heading"><b>动手试一试</b><span>${unit.model.type === 'fraction-bar' ? '拖动分子或改变分母，看“每一份”怎样变化' : '拖动数轴上的数，检查它是否同时满足两个余数条件'}</span></div>${unit.model.type === 'fraction-bar' ? `<div class="book-model-controls"><label>分母 <select data-fraction-denominator aria-label="分母">${Array.from({length:11},(_,i)=>i+2).map((d)=>`<option value="${d}"${d===unit.model.denominator?' selected':''}>${d}</option>`).join('')}</select></label><label>分子 <input type="range" min="1" max="${unit.model.denominator}" value="${unit.model.numerator}" data-fraction-numerator aria-label="分子"></label></div><div class="book-fraction-bar" data-fraction-pieces role="img"></div><p class="book-model-result" data-book-model-result aria-live="polite"></p>` : `<label class="book-number-control">试一个数 x <input type="range" min="${unit.model.min}" max="${unit.model.max}" value="${unit.model.start}" data-remainder-candidate aria-label="选择候选数 x"></label><p class="book-model-result" data-book-model-result aria-live="polite"></p><div class="book-remainder-strip" data-remainder-strip role="img" aria-label="0 到 59 的候选数，标记同时满足条件的数"></div><p class="book-model-caption">带圆点的数同时满足两个条件；它们每隔 15 重复一次。</p>`}</section>` : '';
    return `<section class="book-deep-unit" aria-label="本轮深讲内容"><header><span class="book-deep-label">${esc(unit.label)}</span><h3>${esc(unit.title)}</h3><p><b>本轮范围：</b>${esc(unit.scope)}</p></header><div class="book-deep-concepts">${concepts}</div>${model}</section>`;
  }

  function reviewMarkup(unit) {
    if (!unit?.review?.length) return '';
    const items = unit.review.map((item) => `<li><p>${esc(item.question)}</p><details><summary>展开核对</summary><p>${esc(item.answer)}</p></details></li>`).join('');
    return `<section class="book-review"><h3>复习自检 · 不看答案先讲一遍</h3><ol>${items}</ol></section>`;
  }

  function lessonCard(lesson, index, openId) {
    const key = keyOf(lesson);
    const grade = Number(lesson.grade || 3);
    const done = isDone(lesson);
    const practices = practiceList(lesson);
    const solved = new Set(solvedFor(lesson));
    const expanded = openId ? key === openId : index === 0;
    const chapter = grade === 3 ? `三年级 · 第 ${lesson.n} 讲` : `小学${grade}年级 · 第 ${lesson.n} 讲`;
    const steps = (lesson.steps || []).map((step) => `<li>${esc(step)}</li>`).join('');
    const diagram = lesson.diagram ? `<pre class="book-diagram" aria-label="题目示意图">${esc(lesson.diagram)}</pre>` : '';
    const lessonId = `book-lesson-${key.replace(/[^a-zA-Z0-9_-]/g,'-')}`;
    const answerId = `book-answer-${key.replace(/[^a-zA-Z0-9_-]/g,'-')}`;
    const checks = practices.map((item, itemIndex) => {
      const itemDone = solved.has(itemIndex);
      const answers = JSON.stringify(item.answers || []);
      return `<div class="book-practice-item${itemDone ? ' is-correct' : ''}" data-book-practice-item="${itemIndex}"><p class="book-question">${lesson.deepUnit ? `<b>练习 ${itemIndex + 1}</b> · ` : ''}${esc(item.question || lesson.practice)}</p><div class="book-answer-row"><input id="${esc(answerId)}-${itemIndex}" type="text" inputmode="text" autocomplete="off" aria-label="${esc(chapter)}第${itemIndex + 1}题答案" placeholder="写下你的答案" data-book-answer="${esc(key)}" data-book-index="${itemIndex}" data-answer-options="${esc(answers)}"><button type="button" data-book-check="${esc(key)}" data-book-index="${itemIndex}">检查答案</button></div><p class="book-feedback${itemDone ? ' good' : ''}" aria-live="polite" data-book-feedback="${esc(key)}" data-book-index="${itemIndex}">${itemDone ? '这道练习已经答对；可以再用自己的话讲讲理由。' : '先独立完成；卡住时打开提示，再试一次。'}</p><details class="book-hint"><summary>卡住了？先看提示</summary><p>${esc(item.hint || lesson.hint)}</p></details><details class="book-solution"><summary>看完整解法与核对</summary><p>${esc(item.explanation || lesson.explanation)}</p></details></div>`;
    }).join('');
    const practiceCount = done ? '本讲已完成' : lesson.deepUnit ? `${solved.size} / ${practices.length} 题答对` : '自测 1 题';
    const moduleMarkup = deepUnitMarkup(lesson.deepUnit, key);
    const review = reviewMarkup(lesson.deepUnit);
    return `<details class="book-lesson${done ? ' is-done' : ''}" id="${esc(lessonId)}" data-book-id="${esc(key)}" data-grade="${grade}"${expanded ? ' open' : ''}>
      <summary><span class="book-number">${String(lesson.n).padStart(2,'0')}</span><span class="book-heading"><small class="book-grade-label">${esc(chapter)}</small><span class="book-badges"><small class="book-group-badge">${esc(lesson.group)}</small><small class="book-status">${esc(lesson.status)}</small></span><b>${esc(lesson.title)}</b></span><span class="book-state">${done ? '已完成' : '未完成'}</span><span class="book-fold" aria-hidden="true">＋</span></summary>
      <div class="book-body">
        <p class="book-goal"><b>这一讲要会：</b>${esc(lesson.goal)}</p>
        <p class="book-idea"><b>关键想法：</b>${esc(lesson.idea)}</p>
        <section class="book-example" aria-label="分步例题"><span class="book-example-label">老师示范 · 一步一步来</span><strong>${esc(lesson.example)}</strong>${diagram}<ol>${steps}</ol></section>
        ${moduleMarkup}
        <section class="book-practice" aria-label="本讲自测"><div class="book-practice-top"><h3>${lesson.deepUnit ? '现在轮到你练习' : '轮到你试一题'}</h3><span class="book-count">${practiceCount}</span></div>${checks}</section>
        ${review}
        <a class="book-related" href="${esc(lesson.href || '/aoshu/curriculum.html')}"><span>${esc(lesson.link || '打开相关课程')}</span><span aria-hidden="true">↗</span></a>
      </div>
    </details>`;
  }

  function updateInteractiveModel(root) {
    let config = {};
    try { config = JSON.parse(root.dataset.bookModelConfig || '{}'); } catch { config = {}; }
    const result = root.querySelector('[data-book-model-result]');
    if (root.dataset.bookModel === 'fraction-bar') {
      const denominator = root.querySelector('[data-fraction-denominator]');
      const numerator = root.querySelector('[data-fraction-numerator]');
      if (!denominator || !numerator || !result) return;
      const d = Number(denominator.value);
      numerator.max = String(d);
      if (Number(numerator.value) > d) numerator.value = String(d);
      const n = Number(numerator.value);
      const gcd = (a,b) => b ? gcd(b,a%b) : a;
      const divisor = gcd(n,d);
      const simplified = `${n/divisor}/${d/divisor}`;
      const pieces = root.querySelector('[data-fraction-pieces]');
      pieces.style.setProperty('--fraction-denominator', d);
      pieces.innerHTML = Array.from({length:d},(_,i)=>`<span class="${i<n?'is-shaded':''}" aria-hidden="true"></span>`).join('');
      pieces.setAttribute('aria-label', `${d} 等份中涂色 ${n} 份，表示 ${n}/${d}，约分后是 ${simplified}`);
      result.textContent = `${n}/${d} 表示 ${d} 个同样大小的份中取 ${n} 份；约分后是 ${simplified}。`;
      return;
    }
    if (root.dataset.bookModel === 'remainder-line') {
      const slider = root.querySelector('[data-remainder-candidate]');
      const strip = root.querySelector('[data-remainder-strip]');
      if (!slider || !strip || !result) return;
      const value = Number(slider.value);
      const conditions = config.conditions || [];
      const remainderOf = (n,d) => ((n % d) + d) % d;
      const remainders = conditions.map(({divisor}) => remainderOf(value,divisor));
      const satisfies = conditions.every(({divisor,remainder},i) => remainders[i] === remainder);
      const statements = conditions.map(({divisor,remainder},i) => `${value} 除以 ${divisor} 余 ${remainders[i]}（目标 ${remainder}）`);
      result.textContent = `x = ${value}：${statements.join('；')}。${satisfies ? '两个条件同时成立。' : '这次没有同时满足两个条件。'}`;
      const cells = [];
      for (let n=Number(config.min); n<=Number(config.max); n++) {
        const match = conditions.every(({divisor,remainder}) => remainderOf(n,divisor) === remainder);
        cells.push(`<span class="${match?'is-match ':''}${n===value?'is-current':''}"${match?` aria-label="${n}：同时满足"`:''}>${n}</span>`);
      }
      strip.innerHTML = cells.join('');
    }
  }

  function render() {
    if (!lessons.length) {
      visibleCount.textContent = '课程内容正在整理';
      return;
    }
    const openId = document.querySelector('.book-lesson[open]')?.dataset.bookId || '';
    const term = search.value.trim().toLowerCase();
    const selectedGrade = gradeFilter.value;
    const selectedTopic = topicFilter.value;
    const visible = lessons.filter((lesson) => {
      const grade = String(lesson.grade || 3);
      const matchesSearch = !term || [lesson.title, lesson.group, lesson.goal, lesson.idea, lesson.example, lesson.practice, lesson.status, lesson.grade].join(' ').toLowerCase().includes(term);
      const matchesGrade = selectedGrade === 'all' || grade === selectedGrade;
      const matchesTopic = selectedTopic === 'all' || lesson.group === selectedTopic;
      const matchesProgress = !onlyUnmastered.checked || !isDone(lesson);
      return matchesSearch && matchesGrade && matchesTopic && matchesProgress;
    }).sort((a,b) => (Number(a.grade||3)-Number(b.grade||3)) || (Number(a.n)-Number(b.n)));
    list.innerHTML = visible.map((lesson,index) => lessonCard(lesson,index,openId)).join('');
    visibleCount.textContent = `显示 ${visible.length} / ${lessons.length} 讲`;
    empty.hidden = visible.length !== 0;
    list.querySelectorAll('[data-book-model]').forEach(updateInteractiveModel);
    updateProgress();
  }

  function checkAnswer(button) {
    const key = button.dataset.bookCheck;
    const lesson = lessons.find((item) => keyOf(item) === key);
    if (!lesson) return;
    const card = button.closest('.book-lesson');
    const index = Number(button.dataset.bookIndex || 0);
    const practice = practiceList(lesson)[index];
    const input = card.querySelector(`[data-book-answer][data-book-index="${index}"]`);
    const feedback = card.querySelector(`[data-book-feedback][data-book-index="${index}"]`);
    const answer = normalize(input?.value);
    if (!answer) {
      feedback.textContent = '先写一个答案；卡住时可以打开提示。';
      feedback.classList.remove('good');
      input?.focus();
      return;
    }
    const correct = (practice?.answers || []).some((expected) => normalize(expected) === answer);
    if (correct) {
      const solved = new Set(solvedFor(lesson));
      solved.add(index);
      const done = solved.size >= practiceList(lesson).length;
      progress[key] = lesson.deepUnit ? {done,solved:[...solved]} : {done:true};
      try { localStorage.setItem(progressKey, JSON.stringify(progress)); } catch { /* 私密浏览模式可能停用存储 */ }
      feedback.textContent = '答对了！打开解法核对步骤，再用自己的话讲讲为什么。';
      feedback.classList.add('good');
      card.querySelector(`[data-book-practice-item="${index}"]`)?.classList.add('is-correct');
      card.classList.toggle('is-done', done);
      card.querySelector('.book-state').textContent = done ? '已完成' : '练习中';
      card.querySelector('.book-count').textContent = done ? '本讲已完成' : `${solved.size} / ${practiceList(lesson).length} 题答对`;
      updateProgress();
    } else {
      feedback.textContent = '还差一点。先打开提示，沿着线索再检查一次。';
      feedback.classList.remove('good');
      const hint = card.querySelectorAll('.book-practice-item')[index]?.querySelector('.book-hint');
      if (hint) hint.open = true;
    }
  }

  list.addEventListener('click', (event) => {
    const button = event.target.closest('[data-book-check]');
    if (button) checkAnswer(button);
  });
  list.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && event.target.matches('[data-book-answer]')) {
      event.preventDefault();
      event.target.closest('.book-answer-row').querySelector('[data-book-check]').click();
    }
  });
  list.addEventListener('input', (event) => {
    if (event.target.matches('[data-fraction-numerator],[data-remainder-candidate]')) updateInteractiveModel(event.target.closest('[data-book-model]'));
  });
  list.addEventListener('change', (event) => {
    if (event.target.matches('[data-fraction-denominator]')) updateInteractiveModel(event.target.closest('[data-book-model]'));
  });
  search.addEventListener('input', render);
  gradeFilter.addEventListener('change', render);
  topicFilter.addEventListener('change', render);
  onlyUnmastered.addEventListener('change', render);
  render();
})();
