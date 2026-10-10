(() => {
  const $ = (selector) => document.querySelector(selector);
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const superscriptDigits = (value) => String(value).replace(/[0-9]/g, (digit) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(digit)]);
  const mathPattern = /(?:[=≠<>≤≥≡∣×÷√²³⁴⁵⁶⁷⁸⁹⁰ⁿ₀-₉^+−±≈∈∉∪∩∑∏∞°]|\b\d+\s*\/\s*\d+\b)/u;
  const standardizeMathSymbols = (value) => {
    const protectedParts = [];
    const protectedText = String(value ?? '').replace(/\b(?:\d{4}-\d{2}-\d{2}|[A-Za-z]+\d+-[A-Za-z]+\d+)\b/g, (match) => {
      const token = `\uE000${protectedParts.length}\uE001`;
      protectedParts.push(match);
      return token;
    });
    return protectedText.replace(/<=/g,'≤').replace(/>=/g,'≥').replace(/!=/g,'≠').replace(/\*/g,'×')
      .replace(/\^(\d+)/g, (_, digits) => superscriptDigits(digits)).replace(/\^n\b/gi,'ⁿ')
      .replace(/([\p{L}\p{N})\]])\s*[·⋅]\s*([\p{L}\p{N}(])/gu,'$1 × $2')
      .replace(/([\p{L}\p{N})\]])\s*-\s*([\p{L}\p{N}(])/gu,'$1 − $2')
      .replace(/(^|[\s([{])-(?=\d)/g,'$1−')
      .replace(/([^\s+×÷=<>≤≥≠−±≈∈∉∪∩])\s*([+×÷=<>≤≥≠−±≈∈∉∪∩])\s*([^\s+×÷=<>≤≥≠−±≈∈∉∪∩])/gu,'$1 $2 $3')
      .replace(/\uE000(\d+)\uE001/g, (_, index) => protectedParts[Number(index)]);
  };
  const renderMathText = (value) => String(value ?? '').split(/(?<=[。；：\n])/u).filter(Boolean).map((part) => { const text = standardizeMathSymbols(part); const math = mathPattern.test(text); return `<span class="qbank-rich-line ${math ? 'qbank-rich-math' : 'qbank-rich-prose'}"${math ? ' role="math"' : ''}>${escapeHtml(text)}</span>`; }).join('');
  const clean = (value) => String(value ?? '').trim();
  const answerLabels = {
    verified: '答案已核过', verified_from_solution: '从资料解析核对', verified_with_caveat: '按说明理解',
    incorrect: '资料答案需要更正', partially_incorrect: '资料答案有一处需调整', incomplete: '资料答案不完整',
    conditional: '答案取决于条件', non_unique: '题目可能有多个答案'
  };
  const solutionLabels = {
    consistent: '资料步骤可参考', error: '资料步骤有一处需留意', incomplete: '资料步骤略简',
    not_provided: '资料没有附解题步骤', transcription_uncertain: '资料中的手写步骤不太清楚'
  };
  const answerCaution = new Set(['incorrect', 'partially_incorrect', 'incomplete', 'conditional', 'non_unique', 'verified_with_caveat']);
  const solutionCaution = new Set(['error', 'incomplete', 'not_provided', 'transcription_uncertain']);
  const familySymbols = ['↗', '✦', '◉', '≈', 'x+y', '⅟', '123', '□', '⋯', '∞'];
  const state = { data: null, questions: [], sources: new Map(), families: [], filtered: [], currentId: null, revealed: false, activeFamily: 'all' };

  const sourceKind = (source) => source?.section_type === 'test' ? 'test' : 'lesson';
  const pageSummary = (pages) => Array.isArray(pages) && pages.length ? `第 ${pages.join('、')} 页` : '未单列';
  const renderPageRef = (q) => {
    const refs = q.page_refs || {};
    return `<span><b>题面</b> PDF ${escapeHtml(pageSummary(refs.problem))}</span><span><b>答案</b> PDF ${escapeHtml(pageSummary(refs.answer))}</span><span><b>解析</b> PDF ${escapeHtml(pageSummary(refs.solution))}</span>`;
  };
  const safeAnswerStatus = (status) => answerLabels[status] || '复核信息已记录';
  const safeSolutionStatus = (status) => solutionLabels[status] || '解析复核信息已记录';
  const isNonempty = (v) => typeof v === 'string' ? Boolean(v.trim()) : v !== null && v !== undefined;
  const currentQuestion = () => state.questions.find((q) => q.id === state.currentId) || null;

  function setupFilters() {
    const sourceFilter = $('#source-filter');
    state.data.sources.forEach((source) => {
      const option = document.createElement('option');
      option.value = source.source_id;
      option.textContent = `${source.source_id} · ${source.lesson_or_test}`;
      sourceFilter.append(option);
    });
    state.families = state.data.indexes.topic_families || [];
    const familyFilter = $('#family-filter');
    state.families.forEach((family) => {
      const option = document.createElement('option');
      option.value = family.family;
      option.textContent = `${family.family}（${family.question_count}）`;
      familyFilter.append(option);
    });
    updateTopicOptions();
    renderTopicMap();
  }

  function updateTopicOptions() {
    const topicFilter = $('#topic-filter');
    const previous = topicFilter.value;
    const familyName = $('#family-filter').value;
    const family = state.families.find((item) => item.family === familyName);
    const topics = family ? family.topics : Object.keys(state.data.indexes.topics || {}).sort((a, b) => a.localeCompare(b, 'zh-CN'));
    topicFilter.replaceChildren(new Option('全部细分主题', 'all'));
    topics.forEach((topic) => topicFilter.add(new Option(topic, topic)));
    topicFilter.value = topics.includes(previous) ? previous : 'all';
  }

  function renderTopicMap() {
    const root = $('#topic-map');
    root.innerHTML = state.families.map((family, index) => `
      <button type="button" class="topic-tile${state.activeFamily === family.family ? ' is-active' : ''}" data-family="${escapeHtml(family.family)}" aria-pressed="${state.activeFamily === family.family}">
        <span class="tile-symbol" aria-hidden="true">${familySymbols[index % familySymbols.length]}</span><b>${escapeHtml(family.family)}</b><small>${family.question_count} 道相关题</small><span class="tile-arrow" aria-hidden="true">↗</span>
      </button>`).join('');
    root.querySelectorAll('[data-family]').forEach((button) => button.addEventListener('click', () => {
      const selected = button.dataset.family;
      const current = $('#family-filter').value;
      $('#family-filter').value = current === selected ? 'all' : selected;
      state.activeFamily = $('#family-filter').value;
      updateTopicOptions();
      applyFilters(true);
      renderTopicMap();
      $('#practice').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }));
  }

  function matchesFilters(q) {
    const source = state.sources.get(q.source_id);
    const kind = $('#kind-filter').value;
    const sourceId = $('#source-filter').value;
    const familyName = $('#family-filter').value;
    const topic = $('#topic-filter').value;
    const term = $('#keyword-filter').value.trim().toLocaleLowerCase('zh-CN');
    if (kind !== 'all' && sourceKind(source) !== kind) return false;
    if (sourceId !== 'all' && q.source_id !== sourceId) return false;
    if (familyName !== 'all') {
      const family = state.families.find((item) => item.family === familyName);
      if (!family?.question_ids.includes(q.id)) return false;
    }
    if (topic !== 'all' && !(q.topics || []).includes(topic)) return false;
    if (term) {
      const haystack = [q.id, q.source_question_label, q.problem, q.source_answer, q.source_solution,
        q.lesson_or_test, q.source_filename, ...(q.topics || []), ...(q.ambiguities || []), q.review?.verified_answer, q.review?.note]
        .filter(Boolean).join(' ').toLocaleLowerCase('zh-CN');
      if (!haystack.includes(term)) return false;
    }
    return true;
  }

  function applyFilters(resetToFirst = false) {
    state.revealed = false;
    state.filtered = state.questions.filter(matchesFilters);
    state.activeFamily = $('#family-filter').value;
    const stillVisible = state.filtered.some((q) => q.id === state.currentId);
    if (resetToFirst || !stillVisible) state.currentId = state.filtered[0]?.id || null;
    $('#result-count').textContent = `找到 ${state.filtered.length} 道题`;
    $('#index-count').textContent = `${state.filtered.length} 题`;
    renderQuestionList();
    renderQuestion();
    renderTopicMap();
  }

  function renderQuestionList() {
    const list = $('#question-list');
    if (!state.filtered.length) {
      list.innerHTML = '<p class="list-empty">没有找到符合条件的题目。试试少填一个条件吧。</p>';
      return;
    }
    list.innerHTML = state.filtered.map((q) => `
      <button type="button" data-question-id="${escapeHtml(q.id)}" class="${q.id === state.currentId ? 'is-current' : ''}" aria-current="${q.id === state.currentId ? 'true' : 'false'}">
        <small>${escapeHtml(q.source_id)} · ${escapeHtml(q.source_question_label)}</small><b>${escapeHtml(q.id)} · ${escapeHtml(standardizeMathSymbols((q.problem || '').replace(/\s+/g, ' ').slice(0, 43)))}${(q.problem || '').length > 43 ? '…' : ''}</b>
      </button>`).join('');
    list.querySelectorAll('[data-question-id]').forEach((button) => button.addEventListener('click', () => selectQuestion(button.dataset.questionId)));
  }

  function selectQuestion(id) {
    if (!state.filtered.some((q) => q.id === id)) {
      const q = state.questions.find((item) => item.id === id);
      if (!q) return;
      $('#keyword-filter').value = '';
      $('#kind-filter').value = 'all';
      $('#source-filter').value = 'all';
      $('#family-filter').value = 'all';
      updateTopicOptions();
      $('#topic-filter').value = 'all';
      state.activeFamily = 'all';
      state.filtered = state.questions.slice();
      $('#result-count').textContent = `找到 ${state.filtered.length} 道题`;
      $('#index-count').textContent = `${state.filtered.length} 题`;
      renderTopicMap();
    }
    state.currentId = id;
    state.revealed = false;
    renderQuestionList();
    renderQuestion();
  }

  function addAnswerBlock(container, className, heading, content) {
    const block = document.createElement('div');
    block.className = `answer-block ${className}`;
    const h = document.createElement('h5'); h.textContent = heading;
    const p = document.createElement('p'); p.innerHTML = renderMathText(content);
    block.append(h, p); container.append(block);
  }

  function renderReview(q) {
    const root = $('#review-content');
    const review = q.review || {};
    const answerStatus = review.answer_status || '';
    const solutionStatus = review.solution_status || '';
    const pillClass = (isCaution) => isCaution ? 'status-pill is-caution' : 'status-pill';
    let html = `<div class="review-status-row"><span class="${pillClass(answerCaution.has(answerStatus))}">答案：${escapeHtml(safeAnswerStatus(answerStatus))}</span><span class="${pillClass(solutionCaution.has(solutionStatus))}">解析：${escapeHtml(safeSolutionStatus(solutionStatus))}</span></div>`;
    if (isNonempty(review.note)) html += `<p class="review-callout"><strong>复核说明：</strong>${renderMathText(review.note)}</p>`;
    if ((q.ambiguities || []).length) html += `<p><strong>题面小提醒：</strong></p><ul>${q.ambiguities.map((note) => `<li>${renderMathText(note)}</li>`).join('')}</ul>`;
    if (isNonempty(q.duplicate_notes)) html += `<p><strong>重复或相关记录：</strong>${renderMathText(q.duplicate_notes)}</p>`;
    const source = state.sources.get(q.source_id);
    if (source?.source_notes?.length) html += `<p><strong>资料说明：</strong>${source.source_notes.map(renderMathText).join('；')}</p>`;
    root.innerHTML = html || '<p>这道题目前没有额外的复核提醒。</p>';
  }

  function renderRelated(q) {
    const ids = new Set(q.cross_reference_ids || []);
    const refs = (state.data.cross_references || []).filter((item) => ids.has(item.id));
    const targetIds = [...new Set(refs.flatMap((item) => item.question_ids || []).filter((id) => id !== q.id))];
    const box = $('#related-box');
    const links = $('#related-links');
    if (!targetIds.length) { box.hidden = true; links.replaceChildren(); return; }
    box.hidden = false;
    links.innerHTML = refs.map((ref) => {
      const targets = (ref.question_ids || []).filter((id) => id !== q.id);
      return targets.map((id) => {
        const target = state.questions.find((item) => item.id === id);
        if (!target) return '';
        return `<button type="button" data-related-id="${escapeHtml(id)}" title="${escapeHtml(ref.note || ref.relationship)}">${escapeHtml(id)} · ${escapeHtml(target.source_question_label)}</button>`;
      }).join('');
    }).join('');
    links.querySelectorAll('[data-related-id]').forEach((button) => button.addEventListener('click', () => selectQuestion(button.dataset.relatedId)));
  }

  function renderQuestion() {
    const q = currentQuestion();
    const answerPanel = $('#answer-panel');
    const revealButton = $('#reveal-answer');
    const controls = ['#question-kind','#question-id','#question-source-title','#question-label','#question-text','#question-topics','#source-provenance','#review-badge'];
    if (!q) {
      controls.forEach((selector) => { $(selector).textContent = ''; });
      $('#question-text').innerHTML = renderMathText('没有找到符合条件的题目。试着清除一项筛选条件吧。');
      answerPanel.hidden = true;
      revealButton.disabled = true;
      $('#previous-question').disabled = true;
      $('#next-question').disabled = true;
      renderQuestionList();
      return;
    }
    const source = state.sources.get(q.source_id) || {};
    const kind = sourceKind(source);
    $('#question-kind').textContent = kind === 'test' ? '小测 / 测验题' : '课堂讲义题';
    $('#question-kind').classList.toggle('kind-test', kind === 'test');
    $('#question-id').textContent = q.id;
    $('#question-source-title').textContent = `${q.source_id} · ${q.lesson_or_test || source.lesson_or_test || ''}`;
    $('#question-label').textContent = q.source_question_label || '题目';
    $('#question-text').innerHTML = renderMathText(q.problem || '原资料中的题面暂缺。');
    $('#question-topics').innerHTML = (q.topics || []).map((topic) => `<span class="topic-chip">${escapeHtml(topic)}</span>`).join('');
    $('#source-provenance').innerHTML = `<span><b>来源 PDF：</b>${escapeHtml(q.source_filename)}</span>${renderPageRef(q)}`;
    const status = q.review?.answer_status || 'verified';
    const solutionStatus = q.review?.solution_status || '';
    const needsNote = answerCaution.has(status) || solutionCaution.has(solutionStatus) || (q.ambiguities || []).length > 0;
    const badge = $('#review-badge');
    const hasVerifiedCorrection = isNonempty(q.review?.verified_answer) || isNonempty(q.review?.verified_solution);
    badge.textContent = hasVerifiedCorrection ? '已附核验答案 / 解法' : needsNote ? '有一条解题小贴士' : '资料来源已标明';
    badge.classList.toggle('badge-note', needsNote);
    answerPanel.hidden = !state.revealed;
    revealButton.disabled = false;
    revealButton.innerHTML = state.revealed ? '收起答案与解析 <span aria-hidden="true">↑</span>' : '我想好了，看答案 <span aria-hidden="true">↓</span>';
    $('#previous-question').disabled = state.filtered.length < 2;
    $('#next-question').disabled = state.filtered.length < 2;
    if (state.revealed) renderAnswer(q);
  }

  function renderAnswer(q) {
    const root = $('#answer-content');
    root.replaceChildren();
    const review = q.review || {};
    const verifiedAnswer = review.verified_answer;
    const verifiedSolution = review.verified_solution;
    if (isNonempty(verifiedAnswer)) addAnswerBlock(root, 'verified-answer', '核验后的答案 / 条件说明', String(verifiedAnswer));
    const sourceAnswer = q.source_answer;
    if (isNonempty(sourceAnswer)) addAnswerBlock(root, 'source-answer', isNonempty(verifiedAnswer) ? '原资料中的答案（对照核验）' : '原资料中的答案', String(sourceAnswer));
    else if (!isNonempty(verifiedAnswer)) {
      const empty = document.createElement('p'); empty.className = 'answer-empty';
      empty.textContent = '原资料没有单列答案；下面的复核区会说明答案是怎样核对出来的。'; root.append(empty);
    }
    if (isNonempty(verifiedSolution)) addAnswerBlock(root, 'verified-solution', '核验后的解题过程', String(verifiedSolution));
    if (isNonempty(q.source_solution)) addAnswerBlock(root, 'source-solution', isNonempty(verifiedSolution) ? '原资料中的解题过程（对照核验）' : '原资料中的解题过程', String(q.source_solution));
    else if (!isNonempty(verifiedSolution)) {
      const empty = document.createElement('p'); empty.className = 'answer-empty';
      empty.textContent = '原资料没有附可辨认的解题过程。可以先试着自己写下思路，再到“复核小贴士”看看核对说明。'; root.append(empty);
    }
    renderReview(q);
    renderRelated(q);
  }

  function moveQuestion(delta) {
    if (!state.filtered.length) return;
    const currentIndex = state.filtered.findIndex((q) => q.id === state.currentId);
    const nextIndex = (currentIndex + delta + state.filtered.length) % state.filtered.length;
    selectQuestion(state.filtered[nextIndex].id);
    $('#question-card')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function bindEvents() {
    $('#kind-filter').addEventListener('change', () => applyFilters(true));
    $('#source-filter').addEventListener('change', () => applyFilters(true));
    $('#family-filter').addEventListener('change', () => {
      state.activeFamily = $('#family-filter').value;
      updateTopicOptions(); applyFilters(true); renderTopicMap();
    });
    $('#topic-filter').addEventListener('change', () => applyFilters(true));
    $('#keyword-filter').addEventListener('input', () => applyFilters(true));
    $('#reset-filters').addEventListener('click', () => {
      $('#kind-filter').value = 'all'; $('#source-filter').value = 'all'; $('#family-filter').value = 'all';
      $('#keyword-filter').value = ''; updateTopicOptions(); $('#topic-filter').value = 'all'; state.activeFamily = 'all';
      applyFilters(true); $('#keyword-filter').focus();
    });
    $('#random-question').addEventListener('click', () => {
      if (!state.filtered.length) return;
      const selected = state.filtered[Math.floor(Math.random() * state.filtered.length)];
      selectQuestion(selected.id);
      $('#question-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    $('#previous-question').addEventListener('click', () => moveQuestion(-1));
    $('#next-question').addEventListener('click', () => moveQuestion(1));
    $('#reveal-answer').addEventListener('click', () => {
      state.revealed = !state.revealed;
      renderQuestion();
      if (state.revealed) $('#answer-panel').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
    document.addEventListener('keydown', (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;
      if (event.key === 'ArrowLeft') moveQuestion(-1);
      if (event.key === 'ArrowRight') moveQuestion(1);
    });
  }

  async function init() {
    try {
      const response = await fetch('/siwei/question-bank-source.json');
      if (!response.ok) throw new Error(`题库读取失败：HTTP ${response.status}`);
      state.data = await response.json();
      state.questions = state.data.questions || [];
      state.data.sources.forEach((source) => state.sources.set(source.source_id, source));
      $('#hero-question-count').textContent = state.questions.length;
      $('#hero-source-count').textContent = state.data.counts.source_documents;
      $('#hero-page-count').textContent = state.data.counts.pdf_pages;
      setupFilters();
      const requestedFamily = new URLSearchParams(window.location.search).get('family');
      if (requestedFamily && state.families.some((family) => family.family === requestedFamily)) {
        $('#family-filter').value = requestedFamily;
        state.activeFamily = requestedFamily;
        updateTopicOptions();
      }
      bindEvents(); applyFilters(true);
    } catch (error) {
      $('#result-count').textContent = '题库暂时没有载入';
      $('#question-text').textContent = '暂时读不到题库数据。请通过本地预览说明中的方式打开网页，并确认 question-bank-source.json 在 public 文件夹内。';
      $('#reveal-answer').disabled = true;
      console.error(error);
    }
  }
  init();
})();
