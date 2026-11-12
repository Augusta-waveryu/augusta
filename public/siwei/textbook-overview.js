(() => {
  const root = document.getElementById('book-grade-overview');
  const overview = window.AOSHU_GRADE_OVERVIEW || [];
  const lessons = window.AOSHU_TEXTBOOK_LESSONS || [];
  const filter = document.getElementById('book-grade-filter');
  const map = document.getElementById('book-map');
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  if (!root || !overview.length) return;
  root.innerHTML = overview.map((item) => {
    const grade = Number(item.grade);
    const count = lessons.filter((lesson) => Number(lesson.grade) === grade).length;
    return `<button class="book-grade-tile" type="button" data-grade-jump="${grade}" aria-label="查看小学${grade}年级课程，共${count}个知识点：${esc(item.title)}"><span class="grade-tile-number">${grade}</span><span class="grade-tile-copy"><b>${esc(item.title)}</b><small>${esc(item.focus)}</small><small class="grade-tile-source">${esc(item.source)}</small><small class="grade-tile-count">${count} 个逐点课程</small></span><span class="grade-tile-arrow" aria-hidden="true">→</span></button>`;
  }).join('');
  root.addEventListener('click', (event) => {
    const button = event.target.closest('[data-grade-jump]');
    if (!button) return;
    filter.value = button.dataset.gradeJump;
    filter.dispatchEvent(new Event('change', {bubbles:true}));
    map.scrollIntoView({behavior:'smooth',block:'start'});
  });
})();
