((root) => {
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const superscriptDigits = (value) => String(value).replace(/[0-9]/g, (digit) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(digit)]);
  const normalizeSubscriptDigits = (value) => String(value).replace(/[₀-₉]/g, (digit) => String('₀₁₂₃₄₅₆₇₈₉'.indexOf(digit)));
  const mathPattern = /(?:[=≠<>≤≥≡∣×÷√²³⁴⁵⁶⁷⁸⁹⁰ⁿ₀-₉^+−±≈∈∉∪∩∑∏∞°]|[A-Za-z]_(?:min|max|[A-Za-z]|\d+)|\b\d+\s*\/\s*\d+\b)/u;
  const tokenOpen = '\uE100';
  const tokenClose = '\uE101';
  const fractionAtom = String.raw`(?:\([A-Za-z0-9₀-₉+−×÷=.,\s-]{1,48}\)|\([A-Za-z0-9₀-₉+−×÷=.,\s-]{0,24}\([A-Za-z0-9₀-₉+−×÷=.,\s-]{1,32}\)[A-Za-z0-9₀-₉+−×÷=.,\s-]{0,24}\)|\[[A-Za-z0-9₀-₉+−×÷=.,()\s-]{1,48}\]|[A-Za-z0-9₀-₉]+(?:\([A-Za-z0-9₀-₉+−×÷=.,\s-]{1,48}\))?(?:\^[A-Za-z0-9₀-₉]+|\^\([A-Za-z0-9+−×÷=.,\s-]{1,32}\))?)`;
  const fractionPattern = new RegExp(`(${fractionAtom})\\s*\\/\\s*(${fractionAtom})`, 'gu');
  const overlinePattern = /\\overline\{([A-Za-z0-9□]{1,32})\}|\u0305([A-Za-z0-9]{1,32})/gu;
  const qbankMathNote = '小提示：横线覆盖的字符要合起来看作一个数；位数和首位要求以题目文字为准。';

  const standardizeMathSymbols = (value) => {
    const protectedParts = [];
    const protectedText = String(value ?? '').replace(/\b(?:\d{4}-\d{2}-\d{2}|[A-Za-z]+\d+-[A-Za-z]+\d+)\b/g, (match) => {
      const token = `\uE000${protectedParts.length}\uE001`;
      protectedParts.push(match);
      return token;
    });
    return protectedText.replace(/<=/g, '≤').replace(/>=/g, '≥').replace(/!=/g, '≠').replace(/\*/g, '×')
      .replace(/\^(\d+)/g, (_, digits) => superscriptDigits(digits)).replace(/\^n\b/gi, 'ⁿ')
      .replace(/([\p{L}\p{N})\]])\s*[·⋅]\s*([\p{L}\p{N}(])/gu, '$1 × $2')
      .replace(/([\p{L}\p{N})\]])\s*-\s*([\p{L}\p{N}(])/gu, '$1 − $2')
      .replace(/(^|[\s([{])-(?=\d)/g, '$1−')
      .replace(/([^\s+×÷=<>≤≥≠−±≈∈∉∪∩])\s*([+×÷=<>≤≥≠−±≈∈∉∪∩])\s*([^\s+×÷=<>≤≥≠−±≈∈∉∪∩])/gu, '$1 $2 $3')
      .replace(/\uE000(\d+)\uE001/g, (_, index) => protectedParts[Number(index)]);
  };

  const mathLabelText = (value) => String(value ?? '')
    .replace(overlinePattern, (_, macroBody, combiningBody) => `横线覆盖的字符 ${macroBody || combiningBody}`)
    .replace(/\^\(([^()]{1,48})\)/g, (_, exponent) => ` 的 ${mathLabelText(exponent)} 次方`)
    .replace(/\^\{([^{}]{1,48})\}/g, (_, exponent) => ` 的 ${mathLabelText(exponent)} 次方`)
    .replace(/\^([A-Za-z0-9₀-₉]+)/g, (_, exponent) => ` 的 ${exponent} 次方`)
    .replace(/_([A-Za-z]+|\d+)/g, ' 下标 $1')
    .replace(/[×·⋅]/g, ' 乘 ').replace(/[÷/]/g, ' 除以 ').replace(/\s+/g, ' ').trim();

  function renderTooltipMathText(value) {
    return String(value ?? '')
      .replace(overlinePattern, (_, macroBody, combiningBody) => `横线覆盖的字符 ${macroBody || combiningBody}`)
      .replace(/\^\(([^()]{1,48})\)/g, (_, exponent) => ` 的 ${exponent} 次方`)
      .replace(/\^\{([^{}]{1,48})\}/g, (_, exponent) => ` 的 ${exponent} 次方`)
      .replace(/\^([A-Za-z0-9₀-₉]+)/g, (_, exponent) => ` 的 ${exponent} 次方`)
      .replace(/_([A-Za-z]+|\d+)/g, ' 下标 $1')
      .replace(/([A-Za-z0-9]+)\s*\/\s*([A-Za-z0-9]+)(?![A-Za-z0-9])/g, '$1 除以 $2')
      .replace(/[×·⋅]/g, ' 乘 ')
      .replace(/source_answer/g, '原答案记录').replace(/source_solution/g, '原解析记录')
      .replace(/\s*([=+−])\s*/g, ' $1 ').replace(/\s+/g, ' ').trim();
  }

  function renderInlineMath(value, depth = 0) {
    const tokens = [];
    let hasOverline = false;
    const protect = (html) => {
      const token = `${tokenOpen}${tokens.length}${tokenClose}`;
      tokens.push(html);
      return token;
    };
    let prepared = String(value ?? '');

    prepared = prepared.replace(/source_answer/g, '原答案记录').replace(/source_solution/g, '原解析记录');

    prepared = prepared.replace(overlinePattern, (_, macroBody, combiningBody) => {
      const body = macroBody || combiningBody;
      hasOverline = true;
      const label = `横线覆盖的字符连在一起表示一个数：${body}`;
      return protect(`<span class="qbank-overline" role="math" aria-label="${escapeHtml(label)}">${escapeHtml(body)}</span>`);
    });

    prepared = prepared.replace(/(\uE100\d+\uE101\))(min|max)\b/g, (_, base, suffix) =>
      `${base}${protect(`<sub class="qbank-subscript">${escapeHtml(suffix)}</sub>`)}`);

    prepared = prepared.replace(/([A-Za-z])([A-Za-z0-9₀-₉]+)\^([A-Za-z])([A-Za-z0-9₀-₉]+)/gu, (_, base, baseIndex, exponent, exponentIndex) =>
      protect(`<span class="qbank-indexed-power">${escapeHtml(base)}<sub class="qbank-subscript">${escapeHtml(normalizeSubscriptDigits(baseIndex))}</sub><sup>${escapeHtml(exponent)}<sub class="qbank-subscript">${escapeHtml(normalizeSubscriptDigits(exponentIndex))}</sub></sup></span>`));

    prepared = prepared.replace(/(\([A-Za-z0-9+−×\-\s]{1,32}\)|[A-Za-z])_(min|max|[A-Za-z]|\d+)(?![A-Za-z0-9_])/gu, (_, base, suffix) =>
      `${base}${protect(`<sub class="qbank-subscript">${escapeHtml(suffix)}</sub>`)}`);

    if (depth === 0) {
      prepared = prepared.replace(fractionPattern, (match, numerator, denominator) => {
        const top = renderInlineMath(numerator.trim(), depth + 1);
        const bottom = renderInlineMath(denominator.trim(), depth + 1);
        hasOverline = hasOverline || top.hasOverline || bottom.hasOverline;
        const label = `分数，分子 ${mathLabelText(numerator.trim())}，分母 ${mathLabelText(denominator.trim())}`;
        return protect(`<span class="qbank-fraction" role="math" aria-label="${escapeHtml(label)}"><span class="qbank-fraction-part">${top.html}</span><span class="qbank-fraction-bar" aria-hidden="true"></span><span class="qbank-fraction-part">${bottom.html}</span></span>`);
      });
    }

    prepared = prepared.replace(/\^\{([−-]?[A-Za-z0-9₀-₉]+)\}/gu, (_, exponent) =>
      protect(`<sup>${escapeHtml(standardizeMathSymbols(exponent))}</sup>`));
    prepared = prepared.replace(/\^\(([A-Za-z0-9^+−×÷=\s]{1,32})\)/gu, (_, exponent) => {
      const nestedExponent = renderInlineMath(exponent, depth + 1);
      hasOverline = hasOverline || nestedExponent.hasOverline;
      return protect(`<sup>(${nestedExponent.html})</sup>`);
    });
    prepared = prepared.replace(/\^([A-Za-z])(?=$|[^A-Za-z0-9_])/gu, (_, exponent) =>
      protect(`<sup>${escapeHtml(exponent)}</sup>`));
    prepared = prepared.replace(/\^(\d+)/g, (_, exponent) => protect(`<sup>${escapeHtml(exponent)}</sup>`));

    const html = escapeHtml(standardizeMathSymbols(prepared)).replace(/\uE100(\d+)\uE101/g, (_, index) => tokens[Number(index)] ?? '');
    return { html, hasOverline };
  }

  function renderMathText(value) {
    let noteAdded = false;
    return String(value ?? '').split(/(?<=[。；：\n])/u).filter(Boolean).map((part) => {
      const { html, hasOverline } = renderInlineMath(part);
      const math = mathPattern.test(part);
      const line = `<span class="qbank-rich-line ${math ? 'qbank-rich-math' : 'qbank-rich-prose'}"${math ? ' role="math"' : ''}>${html}</span>`;
      if (hasOverline && !noteAdded) {
        noteAdded = true;
        return `${line}<span class="qbank-math-note">${qbankMathNote}</span>`;
      }
      return line;
    }).join('');
  }

  function renderCompactMathText(value) {
    return renderInlineMath(value).html;
  }

  function truncateMathPreview(value, limit = 43) {
    const text = String(value ?? '');
    if (text.length <= limit) return text;
    let end = limit;
    const macroStart = text.lastIndexOf('\\overline{', end - 1);
    if (macroStart >= 0 && text.indexOf('}', macroStart) >= end) end = macroStart;
    for (let index = 0; index < Math.min(end, text.length); index += 1) {
      if (text[index] !== '\u0305') continue;
      let tokenEnd = index + 1;
      while (/[A-Za-z0-9]/.test(text[tokenEnd] || '')) tokenEnd += 1;
      if (tokenEnd > end) { end = index; break; }
    }
    while (end > 0 && /[\\^/]$/.test(text.slice(0, end))) end -= 1;
    return `${text.slice(0, end).trimEnd()}…`;
  }

  root.QuestionBankMath = Object.freeze({ standardizeMathSymbols, renderMathText, renderTooltipMathText, renderCompactMathText, truncateMathPreview });
})(typeof window !== 'undefined' ? window : globalThis);
