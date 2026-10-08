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
    const done = lessons.filter((lesson) => progress[keyOf(lesson)]?.done).length;
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

  function lessonCard(lesson, index, openId) {
    const key = keyOf(lesson);
    const grade = Number(lesson.grade || 3);
    const done = !!progress[key]?.done;
    const expanded = openId ? key === openId : index === 0;
    const chapter = grade === 3 ? `三年级 · 第 ${lesson.n} 讲` : `小学${grade}年级 · 第 ${lesson.n} 讲`;
    const steps = (lesson.steps || []).map((step) => `<li>${esc(step)}</li>`).join('');
    const diagram = lesson.diagram ? `<pre class="book-diagram" aria-label="题目示意图">${esc(lesson.diagram)}</pre>` : '';
    const lessonId = `book-lesson-${key.replace(/[^a-zA-Z0-9_-]/g,'-')}`;
    const answerId = `book-answer-${key.replace(/[^a-zA-Z0-9_-]/g,'-')}`;
    const answerLabel = JSON.stringify(lesson.answers || []);
    return `<details class="book-lesson${done ? ' is-done' : ''}" id="${esc(lessonId)}" data-book-id="${esc(key)}" data-grade="${grade}"${expanded ? ' open' : ''}>
      <summary><span class="book-number">${String(lesson.n).padStart(2,'0')}</span><span class="book-heading"><small class="book-grade-label">${esc(chapter)}</small><span class="book-badges"><small class="book-group-badge">${esc(lesson.group)}</small><small class="book-status">${esc(lesson.status)}</small></span><b>${esc(lesson.title)}</b></span><span class="book-state">${done ? '已完成' : '未完成'}</span><span class="book-fold" aria-hidden="true">＋</span></summary>
      <div class="book-body">
        <p class="book-goal"><b>这一讲要会：</b>${esc(lesson.goal)}</p>
        <p class="book-idea"><b>关键想法：</b>${esc(lesson.idea)}</p>
        <section class="book-example" aria-label="分步例题"><span class="book-example-label">老师示范 · 一步一步来</span><strong>${esc(lesson.example)}</strong>${diagram}<ol>${steps}</ol></section>
        <section class="book-practice" aria-label="本讲自测"><div class="book-practice-top"><h3>轮到你试一题</h3><span class="book-count">${done ? '已答对' : '自测 1 题'}</span></div><p class="book-question">${esc(lesson.practice)}</p><div class="book-answer-row"><input id="${esc(answerId)}" type="text" inputmode="text" autocomplete="off" aria-label="${esc(chapter)}答案" placeholder="写下你的答案" data-book-answer="${esc(key)}" data-answer-options="${esc(answerLabel)}"><button type="button" data-book-check="${esc(key)}">检查答案</button></div><p class="book-feedback" aria-live="polite" data-book-feedback="${esc(key)}">${done ? '这讲的练习已经答对。也可以再做一次，练习讲清理由。' : '答错也没关系，先看提示，再试一次。'}</p><details class="book-hint"><summary>卡住了？先看提示</summary><p>${esc(lesson.hint)}</p></details><details class="book-solution"><summary>看完整解法与核对</summary><p>${esc(lesson.explanation)}</p></details></section>
        <a class="book-related" href="${esc(lesson.href || '/aoshu/curriculum.html')}"><span>${esc(lesson.link || '打开相关课程')}</span><span aria-hidden="true">↗</span></a>
      </div>
    </details>`;
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
      const matchesProgress = !onlyUnmastered.checked || !progress[keyOf(lesson)]?.done;
      return matchesSearch && matchesGrade && matchesTopic && matchesProgress;
    }).sort((a,b) => (Number(a.grade||3)-Number(b.grade||3)) || (Number(a.n)-Number(b.n)));
    list.innerHTML = visible.map((lesson,index) => lessonCard(lesson,index,openId)).join('');
    visibleCount.textContent = `显示 ${visible.length} / ${lessons.length} 讲`;
    empty.hidden = visible.length !== 0;
    updateProgress();
  }

  function checkAnswer(button) {
    const key = button.dataset.bookCheck;
    const lesson = lessons.find((item) => keyOf(item) === key);
    if (!lesson) return;
    const card = button.closest('.book-lesson');
    const input = card.querySelector('[data-book-answer]');
    const feedback = card.querySelector('[data-book-feedback]');
    const answer = normalize(input.value);
    if (!answer) {
      feedback.textContent = '先写一个答案；卡住时可以打开提示。';
      feedback.classList.remove('good');
      input.focus();
      return;
    }
    const correct = (lesson.answers || []).some((expected) => normalize(expected) === answer);
    if (correct) {
      feedback.textContent = '答对了！打开解法核对步骤，再用自己的话讲讲为什么。';
      feedback.classList.add('good');
      card.classList.add('is-done');
      card.querySelector('.book-state').textContent = '已完成';
      card.querySelector('.book-count').textContent = '已答对';
      progress[key] = {done:true};
      try { localStorage.setItem(progressKey, JSON.stringify(progress)); } catch { /* 私密浏览模式可能停用存储 */ }
      updateProgress();
    } else {
      feedback.textContent = '还差一点。先打开提示，沿着线索再检查一次。';
      feedback.classList.remove('good');
      card.querySelector('.book-hint').open = true;
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
  search.addEventListener('input', render);
  gradeFilter.addEventListener('change', render);
  topicFilter.addEventListener('change', render);
  onlyUnmastered.addEventListener('change', render);
  render();
})();
