#!/usr/bin/env node
/* Compiles every C program in the past-paper answers (questions.js) and compares its output with `expect`.
 * Also checks that ids are unique, that each question has an answer, and that module numbers are 1-5. */
const fs = require('fs'), path = require('path'), os = require('os'), { spawnSync } = require('child_process');
const dataDir = path.join(__dirname, '..', 'Front-End New', 'public', 'dsa', 'js', 'data');
global.window = global; global.DSA = {};
for (const f of ['questions.js', 'questions2.js']) eval(fs.readFileSync(path.join(dataDir, f), 'utf8'));
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'dsapyq-'));
let fails = 0, progs = 0; const ids = new Set();
for (const q of DSA.pyqs) {
  if (ids.has(q.id)) { fails++; console.log('DUPLICATE id', q.id); } ids.add(q.id);
  if (!q.q || !q.answer) { fails++; console.log('EMPTY', q.id); }
  if (!(q.module >= 1 && q.module <= 5)) { fails++; console.log('BAD MODULE', q.id); }
  if (/\\`/.test(q.answer)) { fails++; console.log('stray backslash-backtick in', q.id); }
  if (!q.code) continue;
  progs++;
  const f = path.join(tmp, q.id + '.c'); fs.writeFileSync(f, q.code.c);
  const c = spawnSync('gcc', ['-std=c11', '-Wall', '-Wextra', '-fsanitize=address,undefined', f, '-o', f + '.out'], { encoding: 'utf8' });
  if (c.status !== 0) { fails++; console.log('COMPILE ERROR', q.id, c.stderr); continue; }
  if (c.stderr) console.log('WARN', q.id, c.stderr.split('\n').slice(0, 4).join('\n'));
  const r = spawnSync(f + '.out', [], { encoding: 'utf8', input: q.stdin || '' });
  if (r.stdout !== q.expect) { fails++; console.log(`FAIL ${q.id}\n--- expected\n${JSON.stringify(q.expect)}\n--- got\n${JSON.stringify(r.stdout)}\n${r.stderr}`); }
}
console.log(`${DSA.pyqs.length} questions, ${progs} programs, ${fails} failures`); process.exit(fails ? 1 : 0);
