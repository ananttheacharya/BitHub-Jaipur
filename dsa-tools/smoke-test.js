#!/usr/bin/env node
/* Opens every page of the DSA site in headless Chromium and fails on console errors, page errors or
 * missing content. usage: node dsa-tools/smoke-test.js [baseUrl]  (default http://127.0.0.1:4173/dsa/)
 * needs: puppeteer-core (npm i -g or NODE_PATH) and a chromium binary (CHROME=/usr/bin/chromium). */
const puppeteer = require(process.env.PUPPETEER || 'puppeteer-core');
const base = process.argv[2] || 'http://127.0.0.1:4173/dsa/';
(async () => {
  const b = await puppeteer.launch({ executablePath: process.env.CHROME || '/usr/bin/chromium', headless: 'new', args: ['--no-sandbox'] });
  const p = await b.newPage(); await p.setViewport({ width: 1360, height: 900 });
  let errs = [];
  p.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
  p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errs.push('console: ' + m.text()); });
  p.on('response', (r) => { if (r.status() >= 400 && r.url().startsWith(base.replace(/dsa\/$/, ''))) errs.push('http ' + r.status() + ' ' + r.url()); });
  let fails = 0;
  const visit = async (hash, check, label) => {
    errs = [];
    await p.goto(base + '#/' + hash.replace(/^#?\/?/, ''), { waitUntil: 'networkidle2' });
    await p.evaluate(() => location.reload()).catch(() => {});
    await new Promise((r) => setTimeout(r, 700));
    const ok = await p.evaluate(check).catch((e) => 'check threw ' + e.message);
    if (ok !== true || errs.length) { fails++; console.log('FAIL', label || hash, ok !== true ? '(' + ok + ')' : '', errs.slice(0, 4).join(' | ')); } else process.stdout.write('.');
  };
  const has = (sel, min) => `(() => document.querySelectorAll(${JSON.stringify(sel)}).length >= ${min || 1} || 'missing ${sel}')()`;
  await visit('', `(${has('.module-card', 5)})`, 'home');
  for (let n = 1; n <= 5; n++) {
    await visit(`m/${n}/slides`, `(${has('.deck-frame .slide', 1)})`, `module ${n} slides`);
    // every slide of the module renders without errors
    const count = await p.evaluate(() => document.querySelectorAll('.deck-dot').length);
    for (let k = 1; k < count; k++) {
      errs = [];
      await p.evaluate(() => document.querySelector('.deck .btn.primary').click());
      await new Promise((r) => setTimeout(r, 250));
      const ok = await p.evaluate(() => !!document.querySelector('.deck-frame .slide h2'));
      if (!ok || errs.length) { fails++; console.log('FAIL module', n, 'slide', k + 1, errs.slice(0, 3).join(' | ')); }
    }
    await visit(`m/${n}/visualize`, `(${has('.viz-stage svg, .growth svg', 1)})`, `module ${n} visualize`);
    await visit(`m/${n}/algorithms`, `(${has('.acc-item', 1)})`, `module ${n} algorithms`);
    await visit(`m/${n}/practice/pyq`, `(${has('.q', 1)})`, `module ${n} pyq`);
    await visit(`m/${n}/practice/problems`, `(${has('.prob', 1)})`, `module ${n} problems`);
    await visit(`m/${n}/practice/quiz`, `(${has('.quiz', 1)})`, `module ${n} quiz`);
    await visit(`m/${n}/notes`, `(${has('.row-btn', 1)})`, `module ${n} notes`);
  }
  for (const [h, sel] of [['practice', '.prob'], ['pyq', '.q'], ['notes', '.row-btn'], ['play', '.CodeMirror']]) await visit(h, `(${has(sel, 1)})`, h);
  const ids = await p.evaluate(() => (DSA.problems || []).map((x) => x.id));
  for (const id of ids) await visit('p/' + id, `(${has('.CodeMirror', 1)})`, 'problem ' + id);
  // dark theme once
  errs = []; await p.goto(base + '?theme=dark#/m/3/visualize/queue', { waitUntil: 'networkidle2' }); await new Promise((r) => setTimeout(r, 500));
  const dark = await p.evaluate(() => document.documentElement.getAttribute('data-theme'));
  if (dark !== 'dark' || errs.length) { fails++; console.log('FAIL dark theme', dark, errs.join(' | ')); } else process.stdout.write('.');
  console.log(`\n${fails} failures`); await b.close(); process.exit(fails ? 1 : 0);
})();
