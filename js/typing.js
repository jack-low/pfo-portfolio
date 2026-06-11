/* typing.js — hero terminal types out main.py, then shows output */
(function () {
  const body = document.getElementById('terminal-body');
  if (!body) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // tokenized source: each line is an array of {c: class, t: text}
  const lines = [
    [{ c: 'tok-com', t: '# main.py' }],
    [{ c: 'tok-kw', t: 'import' }, { c: '', t: ' os' }],
    [{ c: 'tok-kw', t: 'from' }, { c: '', t: ' dotenv ' }, { c: 'tok-kw', t: 'import' }, { c: '', t: ' load_dotenv' }],
    [{ c: 'tok-kw', t: 'from' }, { c: '', t: ' openai ' }, { c: 'tok-kw', t: 'import' }, { c: '', t: ' OpenAI' }],
    [],
    [{ c: 'tok-fn', t: 'load_dotenv' }, { c: '', t: '()' }],
    [{ c: 'tok-var', t: 'client' }, { c: '', t: ' = ' }, { c: 'tok-fn', t: 'OpenAI' }, { c: '', t: '()' }],
    [],
    [{ c: 'tok-kw', t: 'def' }, { c: ' ', t: ' ' }, { c: 'tok-fn', t: 'run' }, { c: '', t: '(' }, { c: 'tok-var', t: 'prompt' }, { c: '', t: '):' }],
    [{ c: '', t: '    ' }, { c: 'tok-var', t: 'res' }, { c: '', t: ' = client.chat.completions.' }, { c: 'tok-fn', t: 'create' }, { c: '', t: '(' }],
    [{ c: '', t: '        model=' }, { c: 'tok-str', t: '"gpt-4o-mini"' }, { c: '', t: ',' }],
    [{ c: '', t: '        messages=[{' }, { c: 'tok-str', t: '"role"' }, { c: '', t: ': ' }, { c: 'tok-str', t: '"user"' }, { c: '', t: ', ' }, { c: 'tok-str', t: '"content"' }, { c: '', t: ': prompt}]' }],
    [{ c: '', t: '    )' }],
    [{ c: '', t: '    ' }, { c: 'tok-kw', t: 'return' }, { c: '', t: ' res.choices[' }, { c: 'tok-num', t: '0' }, { c: '', t: '].message.content' }],
  ];

  const caret = document.createElement('span');
  caret.className = 'caret';

  function makeLine(idx) {
    const div = document.createElement('div');
    div.className = 'code-line';
    const ln = document.createElement('span');
    ln.className = 'ln';
    ln.textContent = String(idx + 1).padStart(2, ' ');
    div.appendChild(ln);
    return div;
  }

  async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  async function type() {
    if (reduce) { renderInstant(); return; }
    for (let i = 0; i < lines.length; i++) {
      const lineEl = makeLine(i);
      body.appendChild(lineEl);
      lineEl.appendChild(caret);
      for (const tok of lines[i]) {
        const span = document.createElement('span');
        if (tok.c) span.className = tok.c;
        lineEl.insertBefore(span, caret);
        for (const ch of tok.t) {
          span.textContent += ch;
          await sleep(11 + Math.random() * 22);
        }
      }
      await sleep(60);
    }
    caret.remove();
    // output block
    const out = document.createElement('div');
    out.className = 'term-out';
    out.innerHTML = '<span class="pfx">$</span> python main.py';
    body.appendChild(out);
    await sleep(400);
    const ok = document.createElement('div');
    ok.className = 'term-out';
    ok.style.color = 'var(--cyan)';
    ok.textContent = '仕組み化、効率化。';
    body.appendChild(ok);
    await sleep(300);
    const done = document.createElement('div');
    done.className = 'term-out';
    done.innerHTML = '<span class="pfx">&gt;</span> Done. ' ;
    done.appendChild(caret);
    body.appendChild(done);
  }

  function renderInstant() {
    lines.forEach((toks, i) => {
      const lineEl = makeLine(i);
      toks.forEach(tok => {
        const span = document.createElement('span');
        if (tok.c) span.className = tok.c;
        span.textContent = tok.t;
        lineEl.appendChild(span);
      });
      body.appendChild(lineEl);
    });
    const out = document.createElement('div');
    out.className = 'term-out';
    out.innerHTML = '<span class="pfx">$</span> python main.py<br>仕組み化、効率化。<br><span class="pfx">&gt;</span> Done.';
    body.appendChild(out);
  }

  // start typing once hero terminal is on screen
  window.onView(body, () => setTimeout(type, 500), 0.25);
})();
