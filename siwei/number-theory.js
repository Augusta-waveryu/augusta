(() => {
  const byId = (id) => document.getElementById(id);
  const superscriptDigits = (value) => String(value).replace(/[0-9]/g, (digit) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(digit)]);
  const standardizeMathSymbols = (value) => String(value ?? '')
    .replace(/<=/g, '≤').replace(/>=/g, '≥').replace(/!=/g, '≠').replace(/\*/g, '×')
    .replace(/\^(\d+)/g, (_, digits) => superscriptDigits(digits)).replace(/\^n\b/gi, 'ⁿ')
    .replace(/([\p{L}\p{N})\]])\s*[·⋅]\s*([\p{L}\p{N}(])/gu, '$1 × $2')
    .replace(/(?<![\p{L}\p{N}])([\p{L}]|\d+|\))\s*-\s*([\p{L}]|\d+|\()/gu, '$1 − $2')
    .replace(/([^\s+×÷=<>≤≥≠≡∣−±≈∈∉∪∩])\s*([+×÷=<>≤≥≠≡∣−±≈∈∉∪∩])\s*([^\s+×÷=<>≤≥≠≡∣−±≈∈∉∪∩])/gu, '$1 $2 $3');
  const normalizeTextTree = (root) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => { if (node.parentElement?.closest('script,style,textarea,input,select')) return; const normalized = standardizeMathSymbols(node.nodeValue); if (normalized !== node.nodeValue) node.nodeValue = normalized; });
  };
  normalizeTextTree(document.body);
  new MutationObserver((records) => records.forEach((record) => {
    if (record.type === 'characterData' && !record.target.parentElement?.closest('script,style,textarea,input,select')) { const normalized = standardizeMathSymbols(record.target.nodeValue); if (normalized !== record.target.nodeValue) record.target.nodeValue = normalized; }
    record.addedNodes.forEach((node) => { if (node.nodeType === Node.TEXT_NODE) { if (!node.parentElement?.closest('script,style,textarea,input,select')) { const normalized = standardizeMathSymbols(node.nodeValue); if (normalized !== node.nodeValue) node.nodeValue = normalized; } } else if (node.nodeType === Node.ELEMENT_NODE) normalizeTextTree(node); });
  })).observe(document.body, {subtree:true,childList:true,characterData:true});
  const wholeNumber = (id, min, max) => {
    const raw = byId(id)?.value ?? '';
    const value = Number(raw);
    return raw.trim() !== '' && Number.isSafeInteger(value) && value >= min && value <= max ? value : null;
  };
  const gcd = (a, b) => {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) [a, b] = [b, a % b];
    return a;
  };
  const lcm = (a, b) => a === 0 || b === 0 ? 0 : Math.abs((a / gcd(a, b)) * b);
  const digitSum = (n) => String(n).split('').reduce((sum, digit) => sum + Number(digit), 0);
  const alternatingSum = (n) => String(n).split('').reverse().reduce((sum, digit, index) => sum + (index % 2 === 0 ? 1 : -1) * Number(digit), 0);
  const superscript = (n) => String(n).replace(/[0-9]/g, (digit) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(digit)]);
  const factorInteger = (n) => {
    const factors = [];
    let remainder = n;
    for (let p = 2; p * p <= remainder; p += p === 2 ? 1 : 2) {
      if (remainder % p !== 0) continue;
      let exponent = 0;
      while (remainder % p === 0) {
        remainder /= p;
        exponent += 1;
      }
      factors.push([p, exponent]);
    }
    if (remainder > 1) factors.push([remainder, 1]);
    return factors;
  };
  const formatFactors = (factors) => factors.length
    ? factors.map(([prime, exponent]) => exponent === 1 ? String(prime) : `${prime}${superscript(exponent)}`).join(' × ')
    : '1';
  const divisorCount = (factors) => factors.reduce((product, [, exponent]) => product * (exponent + 1), 1);
  const divisorList = (factors, limit = 80) => {
    let values = [1];
    factors.forEach(([prime, exponent]) => {
      const next = [];
      let power = 1;
      for (let e = 0; e <= exponent; e += 1) {
        values.forEach((value) => next.push(value * power));
        power *= prime;
      }
      values = next;
    });
    values.sort((a, b) => a - b);
    return { values, shown: values.slice(0, limit) };
  };

  // Divisibility radar: these are exact tests for positive base-10 integers.
  function updateDivisibility() {
    const n = wholeNumber('nt-div-number', 1, 999999999);
    const results = byId('nt-div-results');
    const summary = byId('nt-div-summary');
    if (n === null) {
      summary.textContent = '请输入 1 到 999,999,999 之间的正整数。';
      results.replaceChildren();
      return;
    }
    const sum = digitSum(n);
    const alt = alternatingSum(n);
    const last2 = n % 100;
    const last3 = n % 1000;
    const tests = [
      [2, n % 2 === 0, '看个位'],
      [3, sum % 3 === 0, `数字和 ${sum}`],
      [4, last2 % 4 === 0, `末两位 ${String(last2).padStart(Math.min(String(n).length, 2), '0')}`],
      [5, n % 5 === 0, '看个位'],
      [8, last3 % 8 === 0, `末三位 ${String(last3).padStart(Math.min(String(n).length, 3), '0')}`],
      [9, sum % 9 === 0, `数字和 ${sum}`],
      [10, n % 10 === 0, '看个位'],
      [11, alt % 11 === 0, `交错和 ${alt}`]
    ];
    summary.textContent = `${n} 的数字和是 ${sum}；交错和是 ${alt}；末两位是 ${last2}。绿底表示能整除，灰底表示不能。`;
    results.innerHTML = tests.map(([divisor, yes, reason]) => `<div class="nt-div-result${yes ? ' is-yes' : ''}"><b>${divisor}</b><span>${yes ? '能整除' : '不能'} · ${reason}</span></div>`).join('');
  }
  byId('nt-div-check').addEventListener('click', updateDivisibility);
  byId('nt-div-number').addEventListener('keydown', (event) => { if (event.key === 'Enter') updateDivisibility(); });
  updateDivisibility();

  // Eratosthenes sieve.
  const sieveRange = byId('nt-sieve-range');
  function updateSieve() {
    const limit = Number(sieveRange.value);
    const prime = Array(limit + 1).fill(true);
    prime[0] = false;
    prime[1] = false;
    for (let p = 2; p * p <= limit; p += 1) {
      if (!prime[p]) continue;
      for (let multiple = p * p; multiple <= limit; multiple += p) prime[multiple] = false;
    }
    byId('nt-sieve-max').textContent = limit;
    const grid = byId('nt-sieve-grid');
    grid.innerHTML = Array.from({ length: limit - 1 }, (_, index) => index + 2).map((n) => `<span class="nt-sieve-cell${prime[n] ? ' is-prime' : ' is-crossed'}" title="${n} ${prime[n] ? '是质数' : '是合数'}">${n}</span>`).join('');
    const primes = prime.reduce((count, isPrime) => count + Number(isPrime), 0);
    byId('nt-sieve-caption').textContent = `2 到 ${limit} 一共有 ${primes} 个质数。检查到 √${limit} ≈ ${Math.sqrt(limit).toFixed(1)}；合数至少有一个不超过这个范围的质因数。`;
  }
  sieveRange.addEventListener('input', updateSieve);
  updateSieve();

  function checkPrime() {
    const n = wholeNumber('nt-prime-number', 0, 999999);
    const result = byId('nt-prime-result');
    if (n === null) {
      result.textContent = '请输入 0 到 999,999 之间的整数。';
      return;
    }
    if (n < 2) {
      result.textContent = `${n} 既不是质数，也不是合数；质数从 2 开始。`;
      return;
    }
    for (let p = 2; p * p <= n; p += 1) {
      if (n % p === 0) {
        result.textContent = `${n} = ${p} × ${n / p}，所以是合数；试除到 √${n} ≈ ${Math.sqrt(n).toFixed(1)} 就找到因数了。`;
        return;
      }
    }
    result.textContent = `${n} 是质数；没有不超过 √${n} ≈ ${Math.sqrt(n).toFixed(1)} 的质因数能整除它。`;
  }
  byId('nt-prime-check').addEventListener('click', checkPrime);
  byId('nt-prime-number').addEventListener('keydown', (event) => { if (event.key === 'Enter') checkPrime(); });
  checkPrime();

  function factorInput(inputId, outputId) {
    const n = wholeNumber(inputId, 2, 1000000);
    const output = byId(outputId);
    if (n === null) {
      output.innerHTML = '<strong>请输入范围内的整数。</strong><small>支持 2 到 1,000,000。</small>';
      return;
    }
    const factors = factorInteger(n);
    const count = divisorCount(factors);
    output.innerHTML = `<strong>${n} = ${formatFactors(factors)}</strong><small>正因数个数：${factors.map(([, exponent]) => `(${exponent}+1)`).join(' × ')} = ${count}</small>`;
    return { n, factors, count };
  }
  byId('nt-factor-button').addEventListener('click', () => factorInput('nt-factor-input', 'nt-factor-output'));
  byId('nt-factor-input').addEventListener('keydown', (event) => { if (event.key === 'Enter') factorInput('nt-factor-input', 'nt-factor-output'); });
  factorInput('nt-factor-input', 'nt-factor-output');

  function updateGcd() {
    const a = wholeNumber('nt-gcd-a', 1, 1000000);
    const b = wholeNumber('nt-gcd-b', 1, 1000000);
    const output = byId('nt-gcd-results');
    if (a === null || b === null) {
      output.innerHTML = '<div class="nt-result-box"><small>输入提示</small><b>请填入正整数</b></div>';
      byId('nt-gcd-check').textContent = 'a、b 都须在 1 到 1,000,000 之间。';
      return;
    }
    const common = gcd(a, b);
    const commonMultiple = lcm(a, b);
    const factA = factorInteger(a);
    const factB = factorInteger(b);
    output.innerHTML = `<div class="nt-result-box"><small>最大公因数 · 指数取小</small><b>${common}</b><span>${a}=${formatFactors(factA)}；${b}=${formatFactors(factB)}</span></div><div class="nt-result-box"><small>最小公倍数 · 指数取大</small><b>${commonMultiple}</b><span>两个数各自的质因数指数取较大值</span></div>`;
    byId('nt-gcd-check').textContent = `${common} × ${commonMultiple} = ${a * b} = ${a} × ${b}，乘积关系验算通过。`;
  }
  byId('nt-gcd-button').addEventListener('click', updateGcd);
  ['nt-gcd-a', 'nt-gcd-b'].forEach((id) => byId(id).addEventListener('keydown', (event) => { if (event.key === 'Enter') updateGcd(); }));
  updateGcd();

  byId('nt-divisor-button').addEventListener('click', () => {
    const output = byId('nt-divisor-output');
    const n = wholeNumber('nt-divisor-input', 1, 1000000);
    if (n === null) {
      output.innerHTML = '<b>请输入 1 到 1,000,000 之间的正整数。</b>';
      return;
    }
    const factors = factorInteger(n);
    const count = divisorCount(factors);
    const { shown } = divisorList(factors);
    const listText = shown.join('、');
    const suffix = count > shown.length ? ' …（完整列表较长，已省略后续项）' : '';
    output.innerHTML = `<b>${n} = ${formatFactors(factors)}</b><span>τ(${n}) = ${factors.map(([, exponent]) => `(${exponent}+1)`).join(' × ')} = ${count} 个正因数</span><small>因数：${listText}${suffix}</small>`;
  });
  byId('nt-divisor-input').addEventListener('keydown', (event) => { if (event.key === 'Enter') byId('nt-divisor-button').click(); });
  byId('nt-divisor-button').click();

  function updateRuns() {
    const n = wholeNumber('nt-run-input', 2, 5000);
    const output = byId('nt-run-output');
    if (n === null) {
      output.innerHTML = '<div class="nt-run-empty">请输入 2 到 5,000 之间的整数。</div>';
      return;
    }
    const representations = [];
    for (let start = 1; start * 2 + 1 <= n; start += 1) {
      let sum = start;
      let length = 1;
      while (sum < n) {
        length += 1;
        sum += start + length - 1;
        if (sum === n && length >= 2) {
          representations.push({ start, length });
          break;
        }
        if (sum > n) break;
      }
    }
    let oddPart = n;
    while (oddPart % 2 === 0) oddPart /= 2;
    const countByTheorem = divisorCount(factorInteger(oddPart)) - 1;
    const lines = representations.map(({ start, length }) => {
      const end = start + length - 1;
      return `<div><span>${length} 项：${start} + … + ${end}</span><b>${n}</b></div>`;
    }).join('');
    output.innerHTML = lines || '<div class="nt-run-empty">没有两项或更多连续正整数的表示（但它仍可写成一项：自身）。</div>';
    output.dataset.count = String(representations.length);
    output.dataset.theoremCount = String(countByTheorem);
    if (representations.length !== countByTheorem) {
      console.error(`连续整数计数校验失败：N=${n}，枚举=${representations.length}，定理=${countByTheorem}`);
    }
  }
  byId('nt-run-button').addEventListener('click', updateRuns);
  byId('nt-run-input').addEventListener('keydown', (event) => { if (event.key === 'Enter') updateRuns(); });
  updateRuns();

  // Day 5: enumerate only factor pairs that satisfy each original variable's bounds.
  function updateFactorPairs(mode = 'ab') {
    const output = byId('nt-factor-pairs-output');
    if (mode === 'xy') {
      const pairs = [];
      for (let p = 1; p <= 66; p += 1) {
        if (66 % p !== 0) continue;
        const q = 66 / p;
        const x = p - 3;
        const y = q - 2;
        if (x > 0 && y > 0) pairs.push(`(${x}, ${y})`);
      }
      output.innerHTML = `<b>(x+3)(y+2) = 66</b><span>需 x+3 &gt; 3、y+2 &gt; 2，所以只保留 ${pairs.length} 组：</span><strong>${pairs.join('、')}</strong><small>即 (x,y) = (3,9)、(8,4)、(19,1)。用 6×11、11×6、22×3 逐组还原。</small>`;
      return;
    }
    const pairs = [];
    for (let d = 1; d <= 36; d += 1) {
      if (36 % d === 0) pairs.push(`(${d + 1}, ${36 / d + 1})`);
    }
    output.innerHTML = `<b>(a−1)(b−1) = 36</b><span>36 有 5 组无序正因数对；按顺序区分时有 9 种，且 a−1、b−1 都必须为正：</span><strong>${pairs.join('、')}</strong><small>共有 9 个有序解。因数换顺序时，(a,b) 也跟着换顺序。</small>`;
  }
  document.querySelectorAll('[data-factor-mode]').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-factor-mode]').forEach((item) => {
        const selected = item === button;
        item.classList.toggle('is-selected', selected);
        item.setAttribute('aria-pressed', String(selected));
      });
      updateFactorPairs(button.dataset.factorMode);
    });
  });
  updateFactorPairs();

  // Day 6: use Euclidean division and the defining equivalence for congruence.
  function updateRemainder() {
    const rawA = byId('nt-rem-a').value.trim();
    const rawM = byId('nt-rem-m').value.trim();
    const a = Number(rawA);
    const m = Number(rawM);
    const output = byId('nt-rem-output');
    if (!rawA || !rawM || !Number.isSafeInteger(a) || !Number.isSafeInteger(m) || m < 1 || m > 1000000) {
      output.textContent = '请输入安全范围内的整数 a，以及 1 到 1,000,000 的正整数 m。';
      return;
    }
    const q = Math.floor(a / m);
    const r = a - q * m;
    output.innerHTML = `<b>${a} = ${m} × ${q} + ${r}</b><span>所以 ${a} 除以 ${m} 余 ${r}；记作 <strong>${a} ≡ ${r} (mod ${m})</strong>。余数满足 0 ≤ ${r} &lt; ${m}。</span>`;
  }
  byId('nt-rem-button').addEventListener('click', updateRemainder);
  ['nt-rem-a', 'nt-rem-m'].forEach((id) => byId(id).addEventListener('keydown', (event) => { if (event.key === 'Enter') updateRemainder(); }));
  updateRemainder();

  // BigInt keeps modular exponentiation exact even for large exponents.
  function powMod(base, exponent, modulus) {
    let b = ((base % modulus) + modulus) % modulus;
    let e = exponent;
    let result = 1n % modulus;
    while (e > 0n) {
      if (e % 2n === 1n) result = (result * b) % modulus;
      b = (b * b) % modulus;
      e /= 2n;
    }
    return result;
  }
  function updatePower() {
    const rawBase = byId('nt-pow-base').value.trim();
    const rawExp = byId('nt-pow-exp').value.trim();
    const rawMod = byId('nt-pow-mod').value.trim();
    const base = Number(rawBase);
    const exponent = Number(rawExp);
    const modulus = Number(rawMod);
    const output = byId('nt-pow-output');
    if (!rawBase || !rawExp || !rawMod || !Number.isSafeInteger(base) || !Number.isSafeInteger(exponent) || !Number.isSafeInteger(modulus) || exponent < 0 || exponent > 9007199254740991 || modulus < 2 || modulus > 1000000) {
      output.textContent = '请输入整数底数、非负安全整数指数，以及 2 到 1,000,000 的模数。';
      return;
    }
    const m = BigInt(modulus);
    const reducedBase = ((BigInt(base) % m) + m) % m;
    const residue = powMod(BigInt(base), BigInt(exponent), m);
    output.innerHTML = `<b>${base} ≡ ${reducedBase} (mod ${modulus})</b><span>${base}^${exponent} ≡ ${reducedBase}^${exponent} ≡ <strong>${residue} (mod ${modulus})</strong>。计算器用重复平方逐步取余，不先算出庞大的幂。</span>`;
  }
  byId('nt-pow-button').addEventListener('click', updatePower);
  ['nt-pow-base', 'nt-pow-exp', 'nt-pow-mod'].forEach((id) => byId(id).addEventListener('keydown', (event) => { if (event.key === 'Enter') updatePower(); }));
  updatePower();

  function updateLastDigit() {
    const rawBase = byId('nt-last-base').value.trim();
    const rawK = byId('nt-last-k').value.trim();
    const base = Number(rawBase);
    const k = Number(rawK);
    const output = byId('nt-last-output');
    if (!rawBase || !rawK || !Number.isSafeInteger(base) || !Number.isSafeInteger(k) || base < 0 || base > 9 || k < 0 || k > 1000000000) {
      output.textContent = '请输入 0 到 9 的个位数 a，以及 0 到 1,000,000,000 的整数 k。';
      return;
    }
    const exponent = BigInt(4 * k + 6);
    const m = 10n;
    const actual = powMod(BigInt(base), exponent, m);
    const square = powMod(BigInt(base), 2n, m);
    output.innerHTML = `<b>${base}^(${4 * k}+6) 的个位 = ${actual}</b><span>${base}² 除以 10 也余 ${square}；${actual === square ? '两者相同，公式通过。' : '结果不同，请检查输入。'}</span>`;
  }
  byId('nt-last-button').addEventListener('click', updateLastDigit);
  ['nt-last-base', 'nt-last-k'].forEach((id) => byId(id).addEventListener('keydown', (event) => { if (event.key === 'Enter') updateLastDigit(); }));
  updateLastDigit();

  const positiveMod = (value, modulus) => ((value % modulus) + modulus) % modulus;
  const bindEnter = (ids, callback) => ids.forEach((id) => byId(id).addEventListener('keydown', (event) => { if (event.key === 'Enter') callback(); }));

  // Day 7: solve ax = b (mod m) by checking one complete residue system.
  function updateLinearCongruence() {
    const a = wholeNumber('nt-linear-a', 0, 99);
    const b = wholeNumber('nt-linear-b', -999, 999);
    const m = wholeNumber('nt-linear-m', 2, 100);
    const output = byId('nt-linear-output');
    if (a === null || b === null || m === null) {
      output.textContent = '请填写范围内的整数 a、b，以及 2 到 100 的模数 m。';
      return;
    }
    const d = gcd(a, m);
    const solutions = [];
    for (let x = 0; x < m; x += 1) if (positiveMod(a * x - b, m) === 0) solutions.push(x);
    if (!solutions.length) {
      output.innerHTML = `<b>${a}x ≡ ${b} (mod ${m}) 无解</b><span>gcd(${a}, ${m})=${d}，但 ${b} 不能被 ${d} 整除；同余方程没有解。</span>`;
      return;
    }
    const classes = solutions.map((x) => x === 0 ? `x≡0` : `x≡${x}`).join('、');
    output.innerHTML = `<b>${a}x ≡ ${b} (mod ${m})：${classes}</b><span>gcd(${a}, ${m})=${d}，在 0≤x&lt;${m} 中找到 ${solutions.length} 个解；其余整数解每隔 ${m} 重复一次。</span>`;
  }
  byId('nt-linear-button').addEventListener('click', updateLinearCongruence);
  bindEnter(['nt-linear-a', 'nt-linear-b', 'nt-linear-m'], updateLinearCongruence);
  updateLinearCongruence();

  // Day 8: check compatibility first, then search one least-common-multiple period.
  function updateRemainderSystem() {
    const entries = [1, 2, 3].map((i) => ({
      r: wholeNumber(`nt-crt-r${i}`, 0, 9999),
      m: wholeNumber(`nt-crt-m${i}`, 2, 99)
    }));
    const output = byId('nt-crt-output');
    if (entries.some(({ r, m }) => r === null || m === null)) {
      output.textContent = '请填写整数余数，以及 2 到 99 的模数。';
      return;
    }
    if (entries.some(({ r, m }) => r >= m)) {
      output.textContent = '标准余数需满足 0≤r<m，请检查每组输入。';
      return;
    }
    for (let i = 0; i < entries.length; i += 1) {
      for (let j = i + 1; j < entries.length; j += 1) {
        const common = gcd(entries[i].m, entries[j].m);
        if (positiveMod(entries[i].r - entries[j].r, common) !== 0) {
          output.innerHTML = `<b>这几条线索拼不起来</b><span>模 ${entries[i].m} 余 ${entries[i].r} 与模 ${entries[j].m} 余 ${entries[j].r}，在 gcd=${common} 下余数不同，因此没有共同整数。</span>`;
          return;
        }
      }
    }
    const period = entries.reduce((value, item) => lcm(value, item.m), 1);
    let first = -1;
    for (let n = 0; n < period; n += 1) {
      if (entries.every(({ r, m }) => n % m === r)) {
        first = n;
        break;
      }
    }
    if (first < 0) {
      output.innerHTML = '<b>没有找到共同余数</b><span>请重新检查输入。</span>';
      return;
    }
    const leastPositive = first === 0 ? period : first;
    const check = entries.map(({ r, m }) => `${first}÷${m} 余 ${r}`).join('；');
    output.innerHTML = `<b>全部整数解：n ≡ ${first} (mod ${period})</b><span>最小正整数解是 ${leastPositive}；${check}。每隔 ${period} 就会再出现一个解。</span>`;
  }
  byId('nt-crt-button').addEventListener('click', updateRemainderSystem);
  bindEnter(['nt-crt-r1', 'nt-crt-m1', 'nt-crt-r2', 'nt-crt-m2', 'nt-crt-r3', 'nt-crt-m3'], updateRemainderSystem);
  updateRemainderSystem();

  // Frobenius coin problem: variables are explicitly nonnegative integers.
  function updateCoinProblem() {
    const a = wholeNumber('nt-coin-a', 2, 99);
    const b = wholeNumber('nt-coin-b', 2, 99);
    const n = wholeNumber('nt-coin-n', 0, 1000000);
    const output = byId('nt-coin-output');
    if (a === null || b === null || n === null) {
      output.textContent = '请输入 2 到 99 的规格 a、b，以及 0 到 1,000,000 的目标 n。';
      return;
    }
    const common = gcd(a, b);
    if (common !== 1) {
      output.innerHTML = `<b>gcd(${a}, ${b})=${common}，不能直接使用互质装盒公式</b><span>能拼出的数必须是 ${common} 的倍数；请换一组互质规格再看 Frobenius 上界。</span>`;
      return;
    }
    const maximum = a * b - a - b;
    const representable = Array(maximum + 1).fill(false);
    for (let x = 0; x * a <= maximum; x += 1) {
      for (let y = 0; x * a + y * b <= maximum; y += 1) representable[x * a + y * b] = true;
    }
    const gaps = [];
    for (let amount = 1; amount <= maximum; amount += 1) if (!representable[amount]) gaps.push(amount);
    let pair = null;
    for (let x = 0; x * a <= n; x += 1) {
      const rest = n - x * a;
      if (rest % b === 0) {
        pair = [x, rest / b];
        break;
      }
    }
    const countFormula = ((a - 1) * (b - 1)) / 2;
    const gapPreview = gaps.slice(0, 18).join('、');
    const gapSuffix = gaps.length > 18 ? '、…' : '';
    if (pair) {
      output.innerHTML = `<b>${n} 可以拼成：${n}=${a}×${pair[0]}+${b}×${pair[1]}</b><span>因为 gcd(${a}, ${b})=1，最大拼不成的是 ${maximum}；拼不成的正整数有 ${countFormula} 个。${n > maximum ? '目标大于 Frobenius 上界，按定理一定能拼出。' : ''}</span>`;
    } else {
      output.innerHTML = `<b>${n} 拼不成 ${a} 与 ${b} 的非负整数倍之和</b><span>最大拼不成的正整数是 ${maximum}；拼不成的共有 ${countFormula} 个。${n <= maximum ? `目前这组规格的缺口：${gapPreview}${gapSuffix}。` : '目标已超过上界，按定理本应可拼；请检查输入。'}</span>`;
    }
    if (gaps.length !== countFormula) console.error(`装盒定理校验失败：a=${a}, b=${b}, 枚举=${gaps.length}, 公式=${countFormula}`);
  }
  byId('nt-coin-button').addEventListener('click', updateCoinProblem);
  bindEnter(['nt-coin-a', 'nt-coin-b', 'nt-coin-n'], updateCoinProblem);
  updateCoinProblem();

  // Digital-root arithmetic: each unit carry lowers the total digit sum by nine.
  const digitSumSafe = (n) => String(n).split('').reduce((sum, digit) => sum + Number(digit), 0);
  function countDecimalCarries(a, b) {
    let x = a;
    let y = b;
    let carry = 0;
    let total = 0;
    while (x > 0 || y > 0 || carry > 0) {
      const column = (x % 10) + (y % 10) + carry;
      carry = Math.floor(column / 10);
      total += carry;
      x = Math.floor(x / 10);
      y = Math.floor(y / 10);
    }
    return total;
  }
  function updateDigitSum() {
    const a = wholeNumber('nt-digit-a', 0, 999999999);
    const b = wholeNumber('nt-digit-b', 0, 999999999);
    const c = wholeNumber('nt-digit-c', 0, 1999999998);
    const output = byId('nt-digit-output');
    if (a === null || b === null || c === null) {
      output.textContent = '请填入非负整数；a、b 最大 999,999,999，c 最大 1,999,999,998。';
      return;
    }
    const sa = digitSumSafe(a);
    const sb = digitSumSafe(b);
    const sc = digitSumSafe(c);
    const digitDifference = sa + sb - sc;
    const isAddition = a + b === c;
    const moduloNineMatches = positiveMod(digitDifference, 9) === 0;
    if (isAddition) {
      const carries = countDecimalCarries(a, b);
      output.innerHTML = `<b>${a}+${b}=${c}，等式正确</b><span>S(${a})+S(${b})=${sa}+${sb}=${sa + sb}，S(${c})=${sc}；${sa + sb}=${sc}+9×${carries}，一共进位 ${carries} 次。</span>`;
    } else if (moduloNineMatches) {
      output.innerHTML = `<b>${a}+${b}≠${c}，但数字和检查没有发现错误</b><span>S(a)+S(b) 与 S(c) 除以 9 余数相同；弃九法只能排除一部分错误，不能代替完整验算。</span>`;
    } else {
      output.innerHTML = `<b>数字和检查发现不一致</b><span>S(${a})+S(${b})=${sa + sb}，S(${c})=${sc}，两边除以 9 的余数不同，因此 ${a}+${b} 不可能等于 ${c}。</span>`;
    }
  }
  byId('nt-digit-button').addEventListener('click', updateDigitSum);
  bindEnter(['nt-digit-a', 'nt-digit-b', 'nt-digit-c'], updateDigitSum);
  updateDigitSum();

  // Day 9: convert by place value and verify by converting back.
  function updateBaseConversion() {
    const value = wholeNumber('nt-base-value', 0, 999999999);
    const radix = wholeNumber('nt-base-radix', 2, 16);
    const output = byId('nt-base-output');
    if (value === null || radix === null) {
      output.textContent = '请输入 0 到 999,999,999 的十进制整数，并选择 2 到 16 的进制。';
      return;
    }
    const digits = value.toString(radix).toUpperCase();
    const terms = digits.split('').map((digit, index) => {
      const number = parseInt(digit, 36);
      const power = digits.length - index - 1;
      return `${number}×${radix}<sup>${power}</sup>`;
    });
    const verified = Number.parseInt(digits, radix) === value;
    output.innerHTML = `<b>${value}<sub>10</sub> = (${digits})<sub>${radix}</sub></b><span>按位展开：${terms.join(' + ')} = ${value}；反向换回十进制${verified ? '，核验通过。' : '，核验失败。'}</span>`;
  }
  byId('nt-base-button').addEventListener('click', updateBaseConversion);
  byId('nt-base-radix').addEventListener('change', updateBaseConversion);
  byId('nt-base-value').addEventListener('keydown', (event) => { if (event.key === 'Enter') updateBaseConversion(); });
  updateBaseConversion();

  // Day 10: enumerate all square residues for one complete residue system.
  function updateSquareResidues() {
    const modulus = wholeNumber('nt-square-modulus', 2, 16);
    const output = byId('nt-square-residue-output');
    if (![3, 4, 8, 9, 16].includes(modulus)) {
      output.textContent = '请选择模 3、4、8、9 或 16。';
      return;
    }
    const residues = [...new Set(Array.from({ length: modulus }, (_, n) => (n * n) % modulus))].sort((a, b) => a - b);
    output.innerHTML = `<b>平方数模 ${modulus} 的可能余数：${residues.join('、')}</b><span>逐个检查 n=0,…,${modulus - 1} 的平方并取模；之后的整数只会重复这些余数。</span>`;
  }
  byId('nt-square-modulus').addEventListener('change', updateSquareResidues);
  updateSquareResidues();

  document.querySelectorAll('[data-pair]').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-pair]').forEach((item) => item.classList.toggle('is-selected', item === button));
      const [x, y] = button.dataset.pair.split(',').map(Number);
      const result = byId('nt-pair-result');
      result.classList.remove('is-valid', 'is-invalid');
      if (x % 2 !== y % 2) {
        result.textContent = `${x} 与 ${y} 一奇一偶，a、b 会出现半整数，所以不能组成整数解。`;
        result.classList.add('is-invalid');
        return;
      }
      if (x >= y) {
        result.textContent = '要有 a > b > 0，必须让 a−b 小于 a+b。';
        result.classList.add('is-invalid');
        return;
      }
      const a = (x + y) / 2;
      const b = (y - x) / 2;
      result.textContent = `可以：a = (${x}+${y})÷2 = ${a}，b = (${y}−${x})÷2 = ${b}；验算 ${a}²−${b}² = ${a * a - b * b}。`;
      result.classList.add('is-valid');
    });
  });
})();
