#!/usr/bin/env node
/* Headless correctness test of every visualizer (no browser): runs each operation and checks the frames
 * and the algorithms (sorts sort, BST/AVL invariants, heaps, hashing, linked lists, MST totals ...).
 * usage: node dsa-tools/test-viz.js */
// Headless check of every visualizer: runs each op, validates frames and algorithm results.
const path = require('path');
const root = process.argv[2] || require("path").join(__dirname, "..", "Front-End New", "public", "dsa");
global.window = { matchMedia: () => ({ matches: false }) };
global.document = { documentElement: { setAttribute() {} }, createElement() { return {}; } };
global.location = { search: '', pathname: '/dsa/', hostname: 'x' };
global.localStorage = { getItem() { return null; }, setItem() {} }; global.sessionStorage = global.localStorage;
for (const f of ['util', 'stage', 'viz/core', 'viz/m1', 'viz/m2', 'viz/m3', 'viz/m4', 'viz/m5']) require(path.join(root, 'js', f + '.js'));
const DSA = window.DSA; let fails = 0, checks = 0;
const ok = (c, msg) => { checks++; if (!c) { fails++; console.log('FAIL:', msg); } };
function frames(def, variant, op, args, st) {
  st = st || def.create(variant); const out = [];
  const snap = (note, marks) => { marks = marks || {}; const fr = Object.assign({ note }, def.draw(st, marks)); out.push(fr); };
  def.run(st, op, args, snap); return { st, out };
}
function validFrame(fr, label) {
  const ids = new Set();
  for (const n of fr.nodes || []) { ok(n.id != null, label + ' node without id'); ok(!ids.has(n.id), label + ' duplicate node id ' + n.id); ids.add(n.id); ok(Number.isFinite(n.x) && Number.isFinite(n.y), label + ' bad coords ' + n.id + ' ' + n.x + ',' + n.y); }
  for (const e of fr.edges || []) for (const end of [e.from, e.to]) if (typeof end === 'string') ok(ids.has(end), label + ' edge to missing node ' + end + ' (' + e.id + ')');
}
const argsFor = (def, op) => { const o = {}; for (const k of op.uses || []) { const a = def.args[k]; const d = typeof a.def === 'function' ? a.def() : a.def; o[k] = a.type === 'list' ? (Array.isArray(d) ? d : String(d).split(/[\s,]+/).map(Number)) : d; } return o; };
for (const def of DSA.viz.all()) {
  const variants = def.variants ? def.variants.map((v) => v.id) : [null];
  for (const v of variants) {
    const st = def.create(v);
    for (const op of def.ops) {
      if (op.only && !op.only.includes(v)) continue;
      try { const r = frames(def, v, op.id, argsFor(def, op), st); ok(r.out.length > 0, `${def.id}/${v}/${op.id}: no frames`); r.out.forEach((f, i) => validFrame(f, `${def.id}/${v}/${op.id}#${i}`)); }
      catch (e) { if (!(e instanceof DSA.VizError)) { fails++; console.log('THROW', def.id, v, op.id, e.stack.split('\n').slice(0, 3).join(' | ')); } }
    }
    // demo script on a fresh state
    try { const s2 = def.create(v); for (const [op, args] of def.demo || []) { const r = frames(def, v, op, args || {}, s2); r.out.forEach((f, i) => validFrame(f, `${def.id}/${v}/demo ${op}#${i}`)); } }
    catch (e) { fails++; console.log('DEMO THROW', def.id, v, e.stack.split('\n').slice(0, 3).join(' | ')); }
  }
}
// ---- algorithm correctness ----
const sortDef = DSA.viz.get('sort');
for (const v of sortDef.variants.map((x) => x.id)) {
  for (let t = 0; t < 40; t++) {
    const n = 1 + Math.floor(Math.random() * 11), list = Array.from({ length: n }, () => Math.floor(Math.random() * (t % 2 ? 20 : 999)));
    const { st } = frames(sortDef, v, 'sort', { list }); const got = st.a.map((x) => x.v), want = list.slice().sort((a, b) => a - b);
    ok(JSON.stringify(got) === JSON.stringify(want), `sort ${v} ${list} -> ${got}`);
  }
}
const bs = DSA.viz.get('search');
for (let t = 0; t < 60; t++) {
  const list = Array.from({ length: 1 + Math.floor(Math.random() * 12) }, () => Math.floor(Math.random() * 40)), key = Math.floor(Math.random() * 40);
  for (const v of ['binary', 'linear']) { const { out } = frames(bs, v, 'go', { list, key }); const last = out[out.length - 1].note; const has = list.includes(key); ok(has === /found/i.test(last) && has !== /not present|not found/i.test(last), `search ${v} ${list} key ${key}: ${last}`); }
}
// infix / postfix
const inf = DSA.viz.get('infix'), pf = DSA.viz.get('postfix');
const post = (e) => { const { st } = frames(inf, null, 'convert', { expr: e }); return st.out.map((o) => o.v).join(' '); };
ok(post('(A-B)+C*D/E-C') === 'A B - C D * E / + C -', 'infix 1: ' + post('(A-B)+C*D/E-C'));
ok(post('(A-2*(B+C)/D*E)+F') === 'A 2 B C + * D / E * - F +', 'infix 2: ' + post('(A-2*(B+C)/D*E)+F'));
ok(post('A+B*C^D-E') === 'A B C D ^ * + E -', 'infix 3: ' + post('A+B*C^D-E'));
const ev = (e) => frames(pf, null, 'eval', { expr: e }).st.stack[0].v;
ok(ev('12 3 4 + * 2 / 5 6 - +') === 41.5 - 0 || ev('12 3 4 + * 2 / 5 6 - +') === 41, 'postfix PYQ: ' + ev('12 3 4 + * 2 / 5 6 - +'));
ok(ev('5 6 2 + * 12 4 / -') === 37, 'postfix 2');
// tree
const td = DSA.viz.get('tree');
for (const v of ['bst', 'avl']) {
  for (let t = 0; t < 30; t++) {
    const st = td.create(v), vals = [...new Set(Array.from({ length: 10 }, () => Math.floor(Math.random() * 60)))];
    for (const x of vals) frames(td, v, 'insert', { value: x }, st);
    const inorder = (n) => (n ? [...inorder(n.l), n.v, ...inorder(n.r)] : []);
    ok(JSON.stringify(inorder(st.root)) === JSON.stringify(vals.slice().sort((a, b) => a - b)), `${v} inorder after inserts ${vals}`);
    const bal = (n) => { if (!n) return 0; const l = bal(n.l), r = bal(n.r); if (v === 'avl') ok(Math.abs(l - r) <= 1, `${v} unbalanced after inserts ${vals}`); return 1 + Math.max(l, r); }; bal(st.root);
    const del = vals.slice(0, 5); for (const x of del) frames(td, v, 'delete', { value: x }, st);
    ok(JSON.stringify(inorder(st.root)) === JSON.stringify(vals.filter((x) => !del.includes(x)).sort((a, b) => a - b)), `${v} inorder after deletes ${vals} del ${del}`);
    bal(st.root);
  }
}
// heap
const hd = DSA.viz.get('heap');
for (const v of ['max', 'min']) for (let t = 0; t < 30; t++) {
  const list = Array.from({ length: 1 + Math.floor(Math.random() * 12) }, () => Math.floor(Math.random() * 99)); const { st } = frames(hd, v, 'build', { list });
  const good = st.a.every((x, i) => i === 0 || (v === 'max' ? st.a[(i - 1) >> 1].v >= x.v : st.a[(i - 1) >> 1].v <= x.v)); ok(good, `heap ${v} build ${list}`);
  const out = []; while (st.a.length) { out.push(st.a[0].v); frames(hd, v, 'extract', {}, st); }
  ok(JSON.stringify(out) === JSON.stringify(list.slice().sort((a, b) => (v === 'max' ? b - a : a - b))), `heap ${v} extract order ${list} -> ${out}`);
}
// hash
const hh = DSA.viz.get('hash');
for (const v of ['chain', 'linear', 'quadratic', 'double']) { const st = hh.create(v); for (const k of [15, 22, 8, 36, 29]) frames(hh, v, 'insert', { key: k }, st); const last = v === 'quadratic' ? 36 : 29; const r = frames(hh, v, 'search', { key: 36 }, st); ok(/found/i.test(r.out[r.out.length - 1].note) && !/not/.test(r.out[r.out.length - 1].note), `hash ${v} search`); frames(hh, v, 'delete', { key: 22 }, st); const r2 = frames(hh, v, 'search', { key: 22 }, st); ok(/not/i.test(r2.out[r2.out.length - 1].note), `hash ${v} delete`); const r3 = frames(hh, v, 'search', { key: last }, st); ok(!/not/i.test(r3.out[r3.out.length - 1].note), `hash ${v} probe past tombstone`); }
{ const st = hh.create('quadratic'); for (const k of [15, 22, 8, 36, 29]) frames(hh, 'quadratic', 'insert', { key: k }, st); const r = frames(hh, 'quadratic', 'search', { key: 29 }, st); ok(/not in the table/.test(r.out[r.out.length - 1].note), 'quadratic: unreachable key is reported missing'); }
// linked list ops keep the list consistent
const ld = DSA.viz.get('list');
for (const v of ['singly', 'doubly', 'circular']) { const st = ld.create(v); frames(ld, v, 'insF', { value: 5 }, st); frames(ld, v, 'insE', { value: 99 }, st); frames(ld, v, 'insAt', { value: 77, pos: 3 }, st); ok(JSON.stringify(st.a.map((x) => x.v)) === '[5,10,15,77,23,40,99]', `list ${v} inserts ${st.a.map((x) => x.v)}`); frames(ld, v, 'delV', { value: 15 }, st); frames(ld, v, 'delF', {}, st); frames(ld, v, 'delE', {}, st); ok(JSON.stringify(st.a.map((x) => x.v)) === '[10,77,23,40]', `list ${v} deletes ${st.a.map((x) => x.v)}`); }
{ const st = ld.create('singly'); frames(ld, 'singly', 'reverse', {}, st); ok(st.a.map((x) => x.v).join() === '40,23,15,10', 'list reverse'); }
// poly
const pd = DSA.viz.get('poly'); { const { st } = frames(pd, null, 'add', { p: '5x^4 + 3x^2 + 7', q: '4x^3 + 6x^2 - 3' }); ok(st.r.map((t) => t.c + ':' + t.e).join() === '5:4,4:3,9:2,4:0', 'poly add: ' + st.r.map((t) => t.c + ':' + t.e)); }
// dsu
const dd = DSA.viz.get('dsu'); for (const v of ['plain', 'compress']) { const st = dd.create(v); for (const [x, y] of [[1, 2], [3, 4], [2, 4], [5, 6], [6, 1]]) frames(dd, v, 'union', { x, y }, st); const f = (x) => { while (st.p[x] !== x) x = st.p[x]; return x; }; ok(f(1) === f(4) && f(5) === f(3) && f(7) !== f(1), 'dsu ' + v); }
// graph totals
const gd = DSA.viz.get('graph'); const kt = frames(gd, 'kruskal', 'go', { start: 'A' }).out.pop().note, pt = frames(gd, 'prim', 'go', { start: 'A' }).out.pop().note; ok(/\*\*(\d+)\*\*/.exec(kt)[1] === /\*\*(\d+)\*\*/.exec(pt)[1], 'kruskal vs prim: ' + kt + ' / ' + pt);
// dijkstra: every start vertex agrees with an independent Bellman-Ford
{
  const E = [['A', 'B', 4], ['A', 'C', 2], ['B', 'D', 7], ['C', 'E', 3], ['B', 'C', 1], ['D', 'F', 5], ['E', 'F', 6], ['D', 'E', 8], ['F', 'G', 9]], N = 'ABCDEFG'.split('');
  for (const s of N) {
    const { st } = frames(gd, 'dijkstra', 'go', { start: s }); const d = {}; N.forEach((x) => { d[x] = Infinity; }); d[s] = 0;
    for (let i = 0; i < N.length; i++) for (const [a, b, w] of E) { if (d[a] + w < d[b]) d[b] = d[a] + w; if (d[b] + w < d[a]) d[a] = d[b] + w; }
    ok(N.every((x) => st.dijkstra[x] === d[x]), 'dijkstra from ' + s + ': ' + JSON.stringify(st.dijkstra) + ' vs ' + JSON.stringify(d));
  }
}
// topological sort: every edge goes forward in the output, for both variants
{
  const td = DSA.viz.get('toposort'), TE = [['A', 'C'], ['A', 'D'], ['B', 'D'], ['C', 'E'], ['D', 'E'], ['D', 'F'], ['E', 'G'], ['F', 'G']];
  for (const v of ['kahn', 'dfs']) { const { st } = frames(td, v, 'go', {}); const pos = {}; st.order.forEach((x, i) => { pos[x] = i; }); ok(st.order.length === 7 && TE.every(([a, b]) => pos[a] < pos[b]), 'toposort ' + v + ': ' + st.order.join('')); }
}
// every viz slide and every Visualize-tab entry: the variant exists, the script runs, and every frame is valid
global.DSA = window.DSA;
for (const f of ['data/slides', 'data/slides2', 'data/slides3', 'data/modules']) require(path.join(root, 'js', f + '.js'));
{
  const check = (where, id, variant, script) => {
    const def = DSA.viz.get(id); ok(!!def, where + ': unknown visualizer ' + id); if (!def) return;
    if (variant) ok(def.variants && def.variants.some((v) => v.id === variant), where + ': unknown variant ' + variant);
    const st = def.create(variant || (def.variants ? def.variants[0].id : null));
    try { for (const [op, args] of script || def.demo || []) { ok(def.ops.some((o) => o.id === op), where + ': unknown op ' + op); const r = frames(def, null, op, args || {}, st); ok(r.out.length > 0, where + ': no frames'); r.out.forEach((fr, i) => validFrame(fr, where + '#' + i)); } }
    catch (e) { fails++; console.log('THROW', where, e.stack.split('\n').slice(0, 3).join(' | ')); }
  };
  for (const n of Object.keys(DSA.slides)) DSA.slides[n].forEach((s, i) => { if (s.kind === 'viz') check(`slide ${n}.${i} ${s.title}`, s.viz.id, s.viz.variant, s.viz.script); });
  for (const m of DSA.modules) { const keys = new Set(); for (const v of m.viz) { ok(!keys.has(v.key || v.id), 'module ' + m.n + ': duplicate viz key ' + (v.key || v.id)); keys.add(v.key || v.id); if (!v.widget) check(`module ${m.n} viz ${v.key || v.id}`, v.id, v.variant, v.script); } }
}
console.log(`${checks} checks, ${fails} failures`); process.exit(fails ? 1 : 0);
