#!/usr/bin/env node
/* Checks the data files that the pages are built from: every link to a visualizer points at an entry of the right
 * module, notes and slides are well formed, ids are unique, and every file listed in notes.js exists in Study Material.
 * usage: node dsa-tools/test-content.js */
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const dataDir = path.join(root, 'Front-End New', 'public', 'dsa', 'js', 'data');
global.window = global; global.DSA = {};
for (const f of ['modules', 'slides', 'slides2', 'slides3', 'notes', 'studynotes1', 'studynotes2', 'studynotes3', 'studynotes4', 'questions', 'questions2', 'lib1', 'lib2', 'lib3', 'lib4', 'lib5', 'lib6', 'problems'])
  eval(fs.readFileSync(path.join(dataDir, f + '.js'), 'utf8'));
let fails = 0, checks = 0;
const ok = (c, msg) => { checks++; if (!c) { fails++; console.log('FAIL:', msg); } };
const keysOf = (n) => new Set(DSA.modules[n - 1].viz.flatMap((v) => [v.key || v.id, v.id]));

for (const m of DSA.modules) {
  ok(DSA.slides[m.n].length >= 12, `module ${m.n}: only ${DSA.slides[m.n].length} slides`);
  ok((DSA.studyNotes[m.n] || []).length >= 6, `module ${m.n}: study notes missing`);
  ok(DSA.notes[m.n].length > 0, `module ${m.n}: no files`);
  const ids = new Set();
  for (const s of DSA.studyNotes[m.n]) {
    ok(!ids.has(s.id), `module ${m.n}: duplicate note id ${s.id}`); ids.add(s.id);
    ok(s.body && s.body.length > 600, `note ${s.id}: too short`);
    ok(!/[«»]|~~~/.test(s.body.replace(/```[\s\S]*?```/g, '')), `note ${s.id}: unconverted markup`);
    ok((s.body.match(/```/g) || []).length % 2 === 0, `note ${s.id}: unbalanced code fence`);
    if (s.viz) ok(keysOf(m.n).has(s.viz), `note ${s.id}: no visualizer ${s.viz} in module ${m.n}`);
  }
  for (const f of DSA.notes[m.n]) ok(fs.existsSync(path.join(root, 'Study Material', 'CS24201', f.path)), `missing file ${f.path}`);
  DSA.slides[m.n].forEach((s, i) => { if (s.kind === 'text' || s.kind === 'viz') ok(s.bullets && s.bullets.length >= 2, `slide ${m.n}.${i} ${s.title}: needs at least 2 bullets`); });
  const slideTitles = DSA.slides[m.n].map((s) => s.title).filter(Boolean);
  ok(new Set(slideTitles).size === slideTitles.length, `module ${m.n}: duplicate slide titles`);
}
const qids = new Set();
for (const q of DSA.pyqs) {
  ok(!qids.has(q.id), 'duplicate question id ' + q.id); qids.add(q.id);
  if (q.viz) ok(keysOf(q.module).has(q.viz), `question ${q.id}: no visualizer ${q.viz} in module ${q.module}`);
  ok((q.answer.match(/```/g) || []).length % 2 === 0, `question ${q.id}: unbalanced code fence in the answer`);
  ok(!/[«»]|~~~/.test(q.q + q.answer), `question ${q.id}: unconverted markup`);
}
for (const n of Object.keys(DSA.library)) for (const a of DSA.library[n]) if (a.viz) ok(keysOf(+n).has(a.viz), `algorithm ${a.id}: no visualizer ${a.viz} in module ${n}`);
const pids = new Set(); for (const p of DSA.problems) { ok(!pids.has(p.id), 'duplicate problem ' + p.id); pids.add(p.id); ok(p.module >= 1 && p.module <= 5, 'problem module ' + p.id); }
const per = [1, 2, 3, 4, 5].map((n) => DSA.pyqs.filter((q) => q.module === n).length);
console.log(`${checks} checks, ${fails} failures; slides ${Object.values(DSA.slides).reduce((a, d) => a + d.length, 0)}, questions per module ${per.join('/')}, problems ${DSA.problems.length}`);
process.exit(fails ? 1 : 0);
