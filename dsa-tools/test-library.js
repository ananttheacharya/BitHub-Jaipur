#!/usr/bin/env node
/* Compiles and runs every algorithm in Front-End New/public/dsa/js/data/lib*.js in C, C++, Java and
 * Python 3, and compares the output with `expect`.  C, C++ and Python run locally; Java runs on
 * Wandbox because the local machine may only have a JRE.
 * usage: node dsa-tools/test-library.js [algorithm-id ...]   (env: SKIP_JAVA=1, ONLY=c,cpp,py,java) */
const fs = require('fs'), path = require('path'), os = require('os'), { spawnSync } = require('child_process');
const dataDir = path.join(__dirname, '..', 'Front-End New', 'public', 'dsa', 'js', 'data');
global.window = global; global.DSA = {};
for (const f of fs.readdirSync(dataDir).filter((n) => /^lib\d\.js$/.test(n)).sort()) eval(fs.readFileSync(path.join(dataDir, f), 'utf8'));
const only = process.argv.slice(2), langs = (process.env.ONLY || 'c,cpp,py,java').split(',').filter((l) => !(l === 'java' && process.env.SKIP_JAVA));
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'dsalib-'));
let fails = 0, runs = 0;
const norm = (s) => String(s).replace(/\r/g, '').replace(/[ \t]+$/gm, '').replace(/\n+$/, '');
function check(id, lang, got, want, extra) { runs++; if (norm(got) !== norm(want)) { fails++; console.log(`FAIL ${id} [${lang}]\n--- expected\n${want}--- got\n${got}${extra ? '\n--- stderr\n' + extra : ''}`); } }
function local(id, lang, code) {
  const dir = path.join(tmp, id + '-' + lang); fs.mkdirSync(dir, { recursive: true });
  let r;
  if (lang === 'c') { fs.writeFileSync(dir + '/a.c', code); r = spawnSync('gcc', ['-std=c11', '-Wall', '-Wextra', '-O1', '-fsanitize=address,undefined', dir + '/a.c', '-o', dir + '/a', '-lm'], { encoding: 'utf8' }); }
  else if (lang === 'cpp') { fs.writeFileSync(dir + '/a.cpp', code); r = spawnSync('g++', ['-std=c++17', '-Wall', '-Wextra', '-O1', '-fsanitize=address,undefined', dir + '/a.cpp', '-o', dir + '/a'], { encoding: 'utf8' }); }
  else { fs.writeFileSync(dir + '/a.py', code); r = spawnSync('python3', ['-I', dir + '/a.py'], { encoding: 'utf8', timeout: 20000 }); return r; }
  if (r.status !== 0) return { stdout: '', stderr: 'COMPILE ERROR\n' + r.stderr };
  if (r.stderr && /warning/.test(r.stderr)) console.log(`WARN ${id} [${lang}]\n${r.stderr.split('\n').slice(0, 6).join('\n')}`);
  return spawnSync(dir + '/a', [], { encoding: 'utf8', timeout: 20000 });
}
async function javaRun(code, input) {
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
async function java(code) {
  const out = await javaRun(code, '');
  return out.startsWith('ERR ') ? { stdout: '', stderr: out } : { stdout: out, stderr: '' };
}
(async () => {
  const all = Object.values(DSA.library).flat();
  const ids = new Set(); for (const a of all) { if (ids.has(a.id)) { fails++; console.log('DUPLICATE id', a.id); } ids.add(a.id); }
  for (const a of all) {
    if (only.length && !only.includes(a.id)) continue;
    for (const k of ['id', 'title', 'summary', 'idea', 'pseudo', 'expect', 'code']) if (!a[k]) { fails++; console.log('MISSING', a.id, k); }
    for (const l of ['c', 'cpp', 'java', 'py']) if (!a.code[l]) { fails++; console.log('MISSING code', a.id, l); }
    for (const l of langs.filter((x) => x !== 'java')) { const r = local(a.id, l, a.code[l]); check(a.id, l, r.stdout, a.expect, r.status ? r.stderr : (r.stderr || '')); }
    if (langs.includes('java')) { const r = await java(a.code.java); check(a.id, 'java', r.stdout, a.expect, r.stderr); }
    process.stdout.write('.');
  }
  console.log(`\n${runs} runs, ${fails} failures`); process.exit(fails ? 1 : 0);
})();
