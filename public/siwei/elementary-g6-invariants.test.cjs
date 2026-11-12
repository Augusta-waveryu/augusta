const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const dir = __dirname;
const html = fs.readFileSync(path.join(dir, 'textbook.html'), 'utf8');
const scripts = [...html.matchAll(/<script src="\/siwei\/([^"]+)"/g)].map(m => m[1]);
const plain = value => JSON.parse(JSON.stringify(value));

function load(includeUnit) {
  const context = { window: {}, document: { getElementById: () => null } };
  vm.createContext(context);
  for (const file of scripts) {
    // textbook.js/overview mount UI and are deliberately not part of data assembly;
    // every data script is loaded in the exact textbook.html order.
    if (['textbook.js', 'textbook-overview.js'].includes(file)) continue;
    if (!includeUnit && file === 'elementary-g6-invariants-units.js') continue;
    vm.runInContext(fs.readFileSync(path.join(dir, file), 'utf8'), context, { filename: file });
  }
  return context.window;
}

function enumerateRemoval(red, blue) {
  const states = new Set([`${red},${blue}`]);
  const queue = [[red, blue]];
  while (queue.length) {
    const [r, b] = queue.shift();
    if (r > 0 && b > 0) {
      const next = `${r - 1},${b - 1}`;
      if (!states.has(next)) { states.add(next); queue.push([r - 1, b - 1]); }
    }
  }
  return states;
}

function makeModelRoot({ red, blue, steps, target }) {
  const values = { red, blue, steps, target };
  const nodes = {};
  const node = key => nodes[key] ||= {
    value: values[key], innerHTML: '', textContent: '', attrs: {},
    style: { setProperty() {} },
    setAttribute(name, value) { this.attrs[name] = String(value); },
  };
  return {
    dataset: { bookModel: 'paired-removal', bookModelConfig: '{}' },
    querySelector(selector) {
      const setting = selector.match(/data-foundation-model-setting="(\w+)"/);
      if (setting) return node(setting[1]);
      if (selector === '[data-book-model-result]') return node('result');
      if (selector === '[data-removal-beads]') return node('visual');
      if (selector === '[data-removal-checks]') return node('checks');
      throw new Error(`unexpected selector ${selector}`);
    },
    nodes,
  };
}

test('textbook VM baseline: only g6-17 becomes deep and original fields remain', () => {
  const before = load(false);
  const after = load(true);
  const oldLessons = before.AOSHU_TEXTBOOK_LESSONS;
  const newLessons = after.AOSHU_TEXTBOOK_LESSONS;
  assert.equal(oldLessons.length, 127);
  assert.equal(newLessons.length, 127);
  const oldLesson = oldLessons.find(l => l.key === 'g6-17');
  const lesson = newLessons.find(l => l.key === 'g6-17');
  const unit = after.AOSHU_ELEMENTARY_DEEP_UNITS['6:invariant-parity'];
  assert.ok(unit);
  assert.equal(oldLesson.deepUnit, null);
  assert.equal(lesson.deepUnit, unit);
  for (const field of ['key', 'href', 'title', 'source']) assert.equal(lesson[field], oldLesson[field], field);
  assert.equal(unit.example.question, oldLesson.example);
  assert.equal(unit.practices[0].question, oldLesson.practice);
  assert.deepEqual(plain(lesson.answers), plain(oldLesson.answers));
  assert.deepEqual(plain(unit.practices.map(p => p.answers)), [['0'], ['3'], ['0'], ['4'], ['0'], ['1'], ['0'], ['4']]);
  assert.equal(lesson.link, '接着学：逻辑推理与解题策略专题');
  assert.equal(lesson.href, '/siwei/branch-course.html?branch=logic#bc-topic-invariant-parity');
  for (const oldLessonItem of oldLessons) {
    if (oldLessonItem.key === 'g6-17') continue;
    const next = newLessons.find(item => item.key === oldLessonItem.key);
    assert.deepEqual(plain(next), plain(oldLessonItem), oldLessonItem.key);
  }
});

test('independent enumeration audits all 0..8 inventories, steps, six targets and model display', () => {
  const win = load(true);
  const unit = win.AOSHU_ELEMENTARY_DEEP_UNITS['6:invariant-parity'];
  assert.equal(unit.model.type, 'paired-removal');
  const targets = ['3,0', '3,3', '0,0', '7,7', '4,2', '1,0'];
  const widgetContext = { window: {}, document: {} };
  vm.createContext(widgetContext);
  vm.runInContext(fs.readFileSync(path.join(dir, 'elementary-foundation-models.js'), 'utf8'), widgetContext);
  const widget = widgetContext.window.AOSHU_FOUNDATION_WIDGETS;
  assert.equal(widget.supports('paired-removal'), true);

  for (let red = 0; red <= 8; red++) for (let blue = 0; blue <= 8; blue++) {
    const reachable = enumerateRemoval(red, blue);
    for (let steps = 0; steps <= 8; steps++) {
      const legal = steps <= Math.min(red, blue);
      const root = makeModelRoot({ red, blue, steps, target: '3,0' });
      widget.update(root);
      assert.equal(root.dataset.removalLegal, String(legal), `${red},${blue},${steps}`);
      const shown = root.nodes.visual.attrs['aria-label'];
      if (legal) {
        assert.match(shown, new RegExp(`剩${red - steps}红${blue - steps}蓝`));
        assert.match(shown, new RegExp(`已取${steps}红${steps}蓝`));
        assert.equal((root.nodes.visual.innerHTML.match(/foundation-bead/g) || []).length, red + blue);
        assert.equal((root.nodes.visual.innerHTML.match(/is-removed/g) || []).length, 2 * steps);
      } else {
        assert.match(shown, /不合法/);
        assert.match(shown, new RegExp(`仍显示起点${red}红${blue}蓝`));
        assert.equal((root.nodes.visual.innerHTML.match(/is-removed/g) || []).length, 0);
      }
    }
    for (const target of targets) {
      const [tr, tb] = target.split(',').map(Number);
      const root = makeModelRoot({ red, blue, steps: 0, target });
      widget.update(root);
      const expectedReachable = reachable.has(target);
      const expectedVerdict = red - blue !== tr - tb ? 'difference' : expectedReachable ? 'reachable' : 'stock';
      assert.equal(root.dataset.removalVerdict, expectedVerdict, `${red},${blue}->${target}`);
      assert.equal(expectedReachable, tr <= red && tb <= blue && red - tr === blue - tb);
    }
  }
});

function bfs3x3(start, goal) {
  const q = [[...start, 0]];
  const seen = new Set([start.join(',')]);
  while (q.length) {
    const [x, y, d] = q.shift();
    if (x === goal[0] && y === goal[1]) return d;
    for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
      const nx = x + dx, ny = y + dy, key = `${nx},${ny}`;
      if (nx >= 0 && nx < 3 && ny >= 0 && ny < 3 && !seen.has(key)) {
        seen.add(key); q.push([nx, ny, d + 1]);
      }
    }
  }
  return Infinity;
}

test('independent 3x3 BFS verifies parity and shortest-path practice answers', () => {
  const unit = load(true).AOSHU_ELEMENTARY_DEEP_UNITS['6:invariant-parity'];
  const answers = unit.practices.map(p => p.answers[0]);
  const states = [...enumerateRemoval(6,6)];
  const targetStep = states.indexOf('2,2');
  const thirdRed = states[3].split(',')[0];
  let addTwoChangesParity = false, addOneChangesParity = true;
  const parity = n => ((n % 2) + 2) % 2;
  for(let n=-30;n<=30;n++){
    addTwoChangesParity ||= parity(n) !== parity(n+2);
    addOneChangesParity &&= parity(n) !== parity(n+1);
  }
  assert.deepEqual(plain(answers.slice(0,6)), [addTwoChangesParity?'1':'0', thirdRed, states.includes('3,0')?'1':'0', String(targetStep), states.includes('7,7')?'1':'0', addOneChangesParity?'1':'0']);
  let exactStates = new Set(['0,0']);
  for(let steps=0;steps<=8;steps++){
    if(steps===3)assert.equal(answers[6],exactStates.has('2,2')?'1':'0');
    for(const key of exactStates){const [x,y]=key.split(',').map(Number);assert.equal((x+y)%2,steps%2);}
    const next = new Set();
    for(const key of exactStates){const [x,y]=key.split(',').map(Number);for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx>=0&&nx<3&&ny>=0&&ny<3)next.add(`${nx},${ny}`);}}
    exactStates=next;
  }
  assert.equal(answers[7], String(bfs3x3([0, 0], [2, 2])));
  assert.equal(bfs3x3([0, 0], [2, 2]), 4);
  for (let x = 0; x < 3; x++) for (let y = 0; y < 3; y++) {
    const distance = bfs3x3([0, 0], [x, y]);
    assert.equal(distance % 2, (x + y) % 2);
  }
});

test('method boundary, prerequisites, scope, references and directional feedback are explicit', () => {
  const unit = load(true).AOSHU_ELEMENTARY_DEEP_UNITS['6:invariant-parity'];
  assert.match(unit.scope, /本站原创/);
  assert.match(unit.scope, /待核/);
  assert.match(unit.scope, /不违背不变量.*一定能做到/);
  assert.match(unit.idea, /先修/);
  assert.match(unit.methodCard.check, /不是通行证/);
  assert.equal(unit.references.length, 2);
  assert.match(unit.references[0].label, /只能排除/);
  assert.match(unit.references[1].label, /染色/);
  assert.ok(unit.concepts.length >= 6);
  assert.ok(unit.diagrams.length >= 2);
  assert.ok(unit.review.length >= 5);
  for (const practice of unit.practices) {
    for (const field of ['level', 'question', 'answers', 'hint', 'wrongFeedback', 'correctFeedback', 'explanation']) assert.ok(practice[field], field);
    assert.ok(practice.wrongFeedback.length > 10);
    assert.ok(practice.correctFeedback.length > 5);
  }
});
