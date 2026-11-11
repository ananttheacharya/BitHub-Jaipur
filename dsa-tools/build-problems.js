#!/usr/bin/env node
/* Builds Front-End New/public/dsa/js/data/problems.js from dsa-tools/problems/*.js.
 *
 * Each source problem has four complete solutions (c, cpp, java, py). The build
 *   1. derives the starter code of each language by replacing the region between the
 *      `<solve default>` and `</solve>` marker comments with a TODO stub,
 *   2. computes the expected output of every test by running the Python solution,
 *   3. checks that the examples' hand-written outputs match, and that the C and C++ solutions
 *      (compiled locally with sanitizers) and, with JAVA=N, the Java solution on the first N tests (run on Wandbox, which can be slow)
 *      give exactly the same output on every test,
 *   4. writes the data file only when everything agrees.
 * usage: node dsa-tools/build-problems.js [problem-id ...]      env: JAVA=<tests per problem to run in Java>, CHECK_ONLY=1 */
const fs = require('fs'), path = require('path'), os = require('os'), { spawnSync } = require('child_process');
const srcDir = path.join(__dirname, 'problems');
const outFile = path.join(__dirname, '..', 'Front-End New', 'public', 'dsa', 'js', 'data', 'problems.js');
const only = process.argv.slice(2);
const unesc = (t) => (typeof t === 'string' ? t.replace(/\\`/g, '`') : t);   // String.raw keeps the backslash of \`
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'dsaprob-'));
const norm = (s) => String(s).replace(/\r/g, '').split('\n').map((l) => l.replace(/\s+$/, '')).join('\n').replace(/\n+$/, '');
let fails = 0;
const bad = (m) => { fails++; console.log('FAIL', m); };

function stubify(code, lang) {
  const open = lang === 'py' ? /^(\s*)# <solve(?: (.*))?>\s*$/ : /^(\s*)\/\/ <solve(?: (.*))?>\s*$/;
  const close = lang === 'py' ? /^\s*# <\/solve>\s*$/ : /^\s*\/\/ <\/solve>\s*$/;
  const cm = lang === 'py' ? '#' : '//';
  const lines = code.split('\n'), starter = [];
  let skipping = false;
  for (const line of lines) {
    const m = open.exec(line);
    if (m) { skipping = true; starter.push(`${m[1]}${cm} TODO: write your solution here`); if (m[2]) starter.push(m[1] + m[2]); continue; }
    if (close.test(line)) { skipping = false; continue; }
    if (!skipping) starter.push(line);
  }
  // the solution keeps the code between the markers but not the marker comments
  const sol = lines.filter((l) => !open.test(l) && !close.test(l));
  return { starter: starter.join('\n'), solution: sol.join('\n') };
}

function runLocal(lang, code, input, id, k) {
  const dir = path.join(tmp, id + '-' + lang); fs.mkdirSync(dir, { recursive: true });
  if (lang === 'py') { fs.writeFileSync(dir + '/a.py', code); const r = spawnSync('python3', ['-I', dir + '/a.py'], { input, encoding: 'utf8', timeout: 20000 }); return r.status === 0 ? r.stdout : 'ERR ' + r.stderr; }
  const exe = dir + '/a';
  if (!fs.existsSync(exe)) {
    const ext = lang === 'c' ? 'c' : 'cpp'; fs.writeFileSync(dir + '/a.' + ext, code);
    const args = lang === 'c' ? ['-std=c11', '-Wall', '-Wextra', '-O1', '-fsanitize=address,undefined', dir + '/a.c', '-o', exe, '-lm'] : ['-std=c++17', '-Wall', '-Wextra', '-O1', '-fsanitize=address,undefined', dir + '/a.cpp', '-o', exe];
    const c = spawnSync(lang === 'c' ? 'gcc' : 'g++', args, { encoding: 'utf8' });
    if (c.status !== 0) { bad(`${id} [${lang}] does not compile\n${c.stderr}`); return 'COMPILE'; }
    if (c.stderr) console.log(`WARN ${id} [${lang}]\n${c.stderr.split('\n').slice(0, 5).join('\n')}`);
  }
  const r = spawnSync(exe, [], { input, encoding: 'utf8', timeout: 20000, env: Object.assign({}, process.env, { ASAN_OPTIONS: 'detect_leaks=0' }) });
  return r.status === 0 ? r.stdout : `ERR status ${r.status} ${r.stderr.slice(0, 300)}`;
}

async function runJava(code, input) {
  // Judge0 CE first (fast), Wandbox as the fallback; both are public services
  for (let a = 0; a < 3; a++) {
    try {
      const res = await fetch('https://ce.judge0.com/submissions?base64_encoded=false&wait=true', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ language_id: 91, source_code: code, stdin: input, cpu_time_limit: 10 }) });
      if (res.ok) { const d = await res.json(); const id = d.status && d.status.id; if (id === 3) return d.stdout || ''; if (id === 6) return 'ERR ' + d.compile_output; if (id > 3 && id < 13) return 'ERR ' + (d.stderr || d.status.description) + (d.stdout || ''); }
    } catch (e) { /* try again */ }
    await new Promise((r) => setTimeout(r, 1500 * (a + 1)));
  }
  try {
    const res = await fetch('https://wandbox.org/api/compile.json', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ compiler: 'openjdk-jdk-21+35', code, stdin: input, save: false }) });
    const d = await res.json(); return d.status === '0' ? d.program_output || '' : 'ERR ' + (d.compiler_error || '') + (d.program_error || '');
  } catch (e) { return 'ERR unreachable'; }
}

(async () => {
  const sources = fs.readdirSync(srcDir).filter((f) => /^m\d\w*\.js$/.test(f)).sort().flatMap((f) => require(path.join(srcDir, f)));
  const ids = new Set(), out = [];
  for (const p of sources) {
    if (only.length && !only.includes(p.id)) continue;
    if (ids.has(p.id)) bad('duplicate id ' + p.id); ids.add(p.id);
    for (const k of ['id', 'title', 'module', 'difficulty', 'blurb', 'statement', 'format', 'examples', 'more', 'solution', 'explain', 'time']) if (p[k] == null) bad(`${p.id} missing ${k}`);
    const langs = ['c', 'cpp', 'java', 'py'], starter = {}, solution = {};
    for (const l of langs) { if (!p.solution[l]) { bad(`${p.id} missing solution ${l}`); continue; } const s = stubify(p.solution[l], l); starter[l] = s.starter; solution[l] = s.solution; if (!/<solve/.test(p.solution[l])) bad(`${p.id} [${l}] has no <solve> marker`); }
    const inputs = p.examples.map((e) => e.in).concat(p.more);
    const tests = [], javaChecks = [];
    for (let i = 0; i < inputs.length; i++) {
      const want = runLocal('py', solution.py, inputs[i], p.id, i);
      if (want.startsWith('ERR')) { bad(`${p.id} python failed on test ${i + 1}: ${want}`); continue; }
      if (i < p.examples.length && norm(want) !== norm(p.examples[i].out)) bad(`${p.id} example ${i + 1}: hand-written output ${JSON.stringify(p.examples[i].out)} but the reference gives ${JSON.stringify(want)}`);
      for (const l of ['c', 'cpp']) { const got = runLocal(l, solution[l], inputs[i], p.id, i); if (norm(got) !== norm(want)) bad(`${p.id} [${l}] test ${i + 1}: expected ${JSON.stringify(norm(want))} got ${JSON.stringify(norm(got))}`); }
      if (+process.env.JAVA > i) javaChecks.push(runJava(solution.java, inputs[i]).then((got) => { if (norm(got) !== norm(want)) bad(`${p.id} [java] test ${i + 1}: expected ${JSON.stringify(norm(want))} got ${JSON.stringify(norm(got))}`); }));
      tests.push({ in: inputs[i], out: want.replace(/\r/g, '').replace(/\s+$/, '') + '\n' });
    }
    await Promise.all(javaChecks);
    process.stdout.write('.');
    out.push({ id: p.id, title: p.title, module: p.module, difficulty: p.difficulty, tags: p.tags || [], source: p.source || 'Classic', link: p.link || '', blurb: unesc(p.blurb), statement: unesc(p.statement), format: unesc(p.format), constraints: unesc(p.constraints || ''), examples: p.examples.map((e, i) => ({ in: e.in, out: tests[i] ? tests[i].out : e.out, why: unesc(e.why || '') })), tests, starter, solution, explain: unesc(p.explain), pseudo: p.pseudo || [], time: p.time, space: p.space || '' });
  }
  console.log(`\n${out.length} problems, ${out.reduce((n, p) => n + p.tests.length, 0)} tests, ${fails} failures`);
  if (fails) process.exit(1);
  if (process.env.CHECK_ONLY || only.length) return;
  const order = (a, b) => a.module - b.module || ['Easy', 'Medium', 'Hard'].indexOf(a.difficulty) - ['Easy', 'Medium', 'Hard'].indexOf(b.difficulty);
  out.sort(order);
  fs.writeFileSync(outFile, '/* GENERATED by dsa-tools/build-problems.js from dsa-tools/problems/*.js. Do not edit by hand. */\nDSA.problems = ' + JSON.stringify(out, null, 1) + ';\n');
  console.log('wrote', path.relative(process.cwd(), outFile));
})();
