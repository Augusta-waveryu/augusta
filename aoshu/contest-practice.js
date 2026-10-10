(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const clean = (value) => String(value ?? '').trim();
  const normalizeAnswer = (value) => String(value ?? '').toLocaleLowerCase('zh-CN').replace(/[\s，,。；;：:]/gu, '');
  const safeWebUrl = (value) => {
    try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : ''; }
    catch { return ''; }
  };
  const safeCourseHref = (value) => typeof value === 'string' && value.startsWith('/aoshu/') && value.includes('#') ? value : '';
  const state = { data: null, archives: [], questions: [] };
  const statusInfo = {
    explicit_open_license: { label: '开放许可已核实', tone: 'is-cleared' },
    explicit_republication_permission: { label: '转载许可已核实', tone: 'is-cleared' },
    permission_not_found: { label: '尚未找到转载许可', tone: 'is-pending' },
    permission_required: { label: '需先联系权利人', tone: 'is-pending' },
    source_index_only: { label: '仅来源索引，不转载', tone: 'is-index-only' }
  };

  function isEligibleQuestion(q) {
    const rights = q.rights || {};
    const review = q.review || {};
    return rights.may_republish === true && Boolean(clean(rights.permission_basis)) && Boolean(safeWebUrl(rights.evidence_url)) &&
      Boolean(safeWebUrl(q.source_url)) && clean(q.problem) && clean(q.year) && clean(q.grade_group) && clean(q.round) &&
      clean(review.answer_status) === 'independently_verified' && clean(review.solution_status) === 'independently_checked' &&
      clean(review.verified_answer) && clean(review.verified_solution) && Array.isArray(q.accepted_answers) && q.accepted_answers.length > 0 &&
      q.accepted_answers.every((answer) => Boolean(clean(answer))) && Array.isArray(q.knowledge_points) && q.knowledge_points.length > 0 &&
      q.knowledge_points.every((point) => clean(point.title) && safeCourseHref(point.href));
  }

  function fillFilter(select, values, defaultLabel) {
    const previous = select.value;
    select.replaceChildren(new Option(defaultLabel, 'all'));
    values.forEach((value) => select.add(new Option(value, value)));
    select.value = values.includes(previous) ? previous : 'all';
  }

  function setupFilters() {
    const eventSelect = $('#event-filter');
    state.data.event_series.forEach((event) => eventSelect.add(new Option(event.name, event.id)));
    const archivePeriods = state.archives.map((a) => a.year || a.season).filter(Boolean).map(String);
    const questionYears = state.questions.map((q) => String(q.year)).filter(Boolean);
    const years = [...new Set([...archivePeriods, ...questionYears])].sort((a, b) => b.localeCompare(a, 'zh-CN', { numeric: true }));
    const grades = [...new Set(state.archives.map((a) => a.grade_group).filter(Boolean).concat(state.questions.map((q) => q.grade_group).filter(Boolean)))].sort((a, b) => a.localeCompare(b, 'zh-CN'));
    const rounds = [...new Set(state.archives.map((a) => a.round).filter(Boolean).concat(state.questions.map((q) => q.round).filter(Boolean)))].sort((a, b) => a.localeCompare(b, 'zh-CN'));
    fillFilter($('#year-filter'), years, '全部年份');
    fillFilter($('#grade-filter'), grades, '全部年级 / 组别');
    fillFilter($('#round-filter'), rounds, '全部轮次');
    ['#event-filter', '#year-filter', '#grade-filter', '#round-filter'].forEach((selector) => $(selector).addEventListener('change', renderAll));
    $('#archive-search').addEventListener('input', renderAll);
    $('#clear-archive-filters').addEventListener('click', () => {
      ['#event-filter', '#year-filter', '#grade-filter', '#round-filter'].forEach((selector) => { $(selector).value = 'all'; });
      $('#archive-search').value = '';
      renderAll();
    });
  }

  function eventName(id) { return state.data.event_series.find((event) => event.id === id)?.name || '未归类赛事'; }
  function statusLabel(status) { return statusInfo[status] || { label: '许可状态待核实', tone: 'is-pending' }; }
  function archiveMatches(a) {
    const search = $('#archive-search').value.trim().toLocaleLowerCase('zh-CN');
    const haystack = [eventName(a.event_id), a.year, a.grade_group, a.round, a.archive_title, a.organizer, a.source_note, a.permission_note].filter(Boolean).join(' ').toLocaleLowerCase('zh-CN');
    return ($('#event-filter').value === 'all' || a.event_id === $('#event-filter').value) &&
      ($('#year-filter').value === 'all' || String(a.year || a.season || '') === $('#year-filter').value) &&
      ($('#grade-filter').value === 'all' || a.grade_group === $('#grade-filter').value) &&
      ($('#round-filter').value === 'all' || a.round === $('#round-filter').value) && (!search || haystack.includes(search));
  }
  function questionMatches(q) {
    return ($('#event-filter').value === 'all' || q.event_id === $('#event-filter').value) &&
      ($('#year-filter').value === 'all' || String(q.year) === $('#year-filter').value) &&
      ($('#grade-filter').value === 'all' || q.grade_group === $('#grade-filter').value) &&
      ($('#round-filter').value === 'all' || q.round === $('#round-filter').value);
  }

  function renderArchiveCard(a) {
    const event = state.data.event_series.find((item) => item.id === a.event_id) || {};
    const source = safeWebUrl(a.source_url);
    const terms = safeWebUrl(a.license_url);
    const status = statusLabel(a.reuse_status);
    const facts = [a.year || a.season || '年份待核', a.grade_group || '组别待核', a.round || '轮次待核'].map(escapeHtml);
    const evidence = a.permission_evidence ? `<p class="archive-evidence"><b>许可依据：</b>${escapeHtml(a.permission_evidence)}</p>` : '';
    const permission = a.permission_note ? `<p class="archive-permission">${escapeHtml(a.permission_note)}</p>` : '';
    const link = source ? `<a class="source-link" href="${escapeHtml(source)}" target="_blank" rel="noopener noreferrer">打开来源页面 <span aria-hidden="true">↗</span></a>` : '<span class="source-link is-disabled">来源链接待补</span>';
    const licenseLink = terms ? `<a class="license-link" href="${escapeHtml(terms)}" target="_blank" rel="noopener noreferrer">查看相关网站条款</a>` : '';
    return `<article class="archive-card">
      <div class="archive-card-top"><span class="archive-event">${escapeHtml(event.name || '小学数学赛事')}</span><span class="license-pill ${status.tone}">${escapeHtml(status.label)}</span></div>
      <h3>${escapeHtml(a.archive_title || `${event.name || '赛事'} 历年题源`)}</h3>
      <div class="archive-facts">${facts.map((fact) => `<span>${fact}</span>`).join('')}</div>
      <p class="archive-source"><b>来源：</b>${escapeHtml(a.organizer || event.organizer || '来源机构待核实')}${a.source_type ? ` · ${escapeHtml(a.source_type)}` : ''}</p>
      ${a.source_note ? `<p class="archive-description">${escapeHtml(a.source_note)}</p>` : ''}
      ${evidence}${permission}
      <div class="archive-card-actions">${link}${licenseLink}</div>
    </article>`;
  }

  function renderQuestionCard(q) {
    const event = state.data.event_series.find((item) => item.id === q.event_id) || {};
    const source = safeWebUrl(q.source_url);
    const concepts = q.knowledge_points.map((point) => {
      const href = safeCourseHref(point.href);
      return href ? `<a class="knowledge-link" href="${escapeHtml(href)}">${escapeHtml(point.title)} <span aria-hidden="true">↗</span></a>` : '';
    }).join('');
    const answers = JSON.stringify(q.accepted_answers || [q.review.verified_answer]);
    const labels = [q.year, q.grade_group, q.round].map(escapeHtml).join(' · ');
    return `<article class="contest-question-card" data-question-id="${escapeHtml(q.id)}">
      <div class="question-card-meta"><span>${escapeHtml(event.name || '历年赛事')}</span><span>${labels}</span></div>
      <h3>${escapeHtml(q.question_label || `${q.year} 年原题`)}</h3>
      <div class="original-problem">${escapeHtml(q.problem).replace(/\n/g, '<br>')}</div>
      ${q.diagram_note ? `<p class="diagram-note">${escapeHtml(q.diagram_note)}</p>` : ''}
      <form class="answer-check-form" data-answers="${escapeHtml(answers)}">
        <label for="answer-${escapeHtml(q.id)}">你的答案</label>
        <div class="answer-entry"><input id="answer-${escapeHtml(q.id)}" name="answer" autocomplete="off" aria-describedby="feedback-${escapeHtml(q.id)}" placeholder="写下结果或选项" required><button type="submit">核对</button></div>
        <p class="answer-feedback" id="feedback-${escapeHtml(q.id)}" aria-live="polite"></p>
      </form>
      <div class="verified-solution" hidden>
        <div class="verified-answer"><b>核验答案：</b>${escapeHtml(q.review.verified_answer)}</div>
        <p><b>独立解析：</b>${escapeHtml(q.review.verified_solution).replace(/\n/g, '<br>')}</p>
        ${q.review.check_note ? `<p class="check-note"><b>回代核验：</b>${escapeHtml(q.review.check_note)}</p>` : ''}
        <div class="knowledge-points"><b>知识点：</b>${concepts}</div>
      </div>
      <details class="question-source-details"><summary>来源、许可与复核记录</summary>
        <p><b>题源：</b>${source ? `<a href="${escapeHtml(source)}" target="_blank" rel="noopener noreferrer">打开来源原页 ↗</a>` : '待补来源URL'}</p>
        <p><b>转载许可状态：</b>${escapeHtml(statusLabel(q.rights.reuse_status).label)}。${escapeHtml(q.rights.permission_basis)}</p>
        ${q.rights.evidence_url ? `<p><b>许可证据：</b><a href="${escapeHtml(safeWebUrl(q.rights.evidence_url))}" target="_blank" rel="noopener noreferrer">查看许可依据 ↗</a></p>` : ''}
        <p><b>独立核验：</b>答案与解析分别经本站核算；记录状态：${escapeHtml(q.review.answer_status)} / ${escapeHtml(q.review.solution_status)}。</p>
      </details>
    </article>`;
  }

  function bindQuestionChecks() {
    $$('.answer-check-form').forEach((form) => form.addEventListener('submit', (event) => {
      event.preventDefault();
      let accepted = [];
      try { accepted = JSON.parse(form.dataset.answers || '[]'); } catch { accepted = []; }
      const given = normalizeAnswer($('input[name="answer"]', form).value);
      const ok = accepted.some((answer) => normalizeAnswer(answer) === given);
      const feedback = $('.answer-feedback', form);
      feedback.textContent = ok ? '答对了！下面可以核对完整推理。' : '这次不一致。别急，看看条件、单位和边界，再试一次。下方会显示核验过程。';
      feedback.classList.toggle('is-correct', ok);
      feedback.classList.toggle('is-incorrect', !ok);
      const solution = $('.verified-solution', form.closest('.contest-question-card'));
      solution.hidden = false;
    }));
  }

  function renderAll() {
    const archives = state.archives.filter(archiveMatches);
    $('#archive-results').innerHTML = archives.length ? archives.map(renderArchiveCard).join('') : '<div class="archive-empty"><b>没有匹配的题源记录。</b><span>清除一个筛选条件，或浏览全部赛事索引。</span></div>';
    $('#archive-result-count').textContent = `显示 ${archives.length} 条题源记录`;
    const questions = state.questions.filter(questionMatches);
    $('#licensed-question-results').innerHTML = questions.map(renderQuestionCard).join('');
    $('#question-result-count').textContent = `当前可练 ${questions.length} 道授权原题`;
    $('#no-licensed-questions').hidden = questions.length > 0;
    bindQuestionChecks();
  }

  async function init() {
    try {
      const response = await fetch('/aoshu/contest-practice-data.json', { cache: 'no-store' });
      if (!response.ok) throw new Error(`题源目录读取失败：${response.status}`);
      const data = await response.json();
      if (!data || !Array.isArray(data.event_series) || !Array.isArray(data.archive_records) || !Array.isArray(data.questions)) throw new Error('题源目录结构不完整');
      state.data = data;
      state.archives = data.archive_records;
      state.questions = data.questions.filter(isEligibleQuestion);
      $('#event-count').textContent = data.event_series.length;
      $('#archive-count').textContent = state.archives.length;
      $('#licensed-question-count').textContent = state.questions.length;
      setupFilters();
      renderAll();
    } catch (error) {
      $('#archive-result-count').textContent = '题源目录暂时无法载入';
      $('#question-result-count').textContent = '练习题暂时无法载入';
      $('#archive-results').innerHTML = `<div class="archive-empty"><b>目录载入遇到问题。</b><span>${escapeHtml(error.message)}</span></div>`;
      $('#no-licensed-questions').hidden = false;
    }
  }

  init();
})();
