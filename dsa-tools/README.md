# BitHub DSA (CS24201): how it is built and tested

The DSA section is a static site in `Front-End New/public/dsa/` (vanilla JS, no build step), linked from the
Jaipur page by the **DSA** button in `SubjectSelector.jsx`. Vite copies `public/` into `dist/`, so it ships with
the normal frontend build on GitHub Pages. The notes PDFs come from the backend's `/study-material/CS24201/`
folder (`Study Material/CS24201/`, MOD1 to MOD5 and QPA).

```
public/dsa/
  index.html            shell; loads everything with plain <script> tags
  css/dsa.css           BitHub tokens (beige/rose light, wine/pink dark, Advercase + Inter)
  js/util.js            DOM helpers, icons, storage, theme, backend URL (?api= override)
  js/stage.js           animation engine: frames -> tweened SVG
  js/viz/core.js        visualizer registry + panel (controls, stage, pseudocode, transport)
  js/viz/m1..m5.js      the visualizers, one file per module
  js/data/modules.js    module metadata and syllabus text
  js/data/slides.js     the animated deck of every module
  js/data/lib1..5.js    algorithms: pseudocode + C, C++, Java, Python 3
  js/data/questions.js  past papers (MO23, MO25) with answers + extra practice
  js/data/quiz.js       quick-check multiple choice
  js/data/problems.js   GENERATED coding problems (see below)
  js/data/notes.js      every note file, grouped by module
  js/compiler.js        runs code on the public Wandbox API (CORS enabled), no backend involved
  js/app.js             router and pages (hash routes: #/m/3/visualize/queue, #/p/two-sum, ...)
```

## Adding or changing things

**A visualizer** is a definition passed to `DSA.viz.define` (see `viz/core.js`): `create`, `draw`, `run`, and
`snap(note, marks)` calls inside `run` record one animation frame each. The code that runs is the real
algorithm, so what is animated is what was computed. Add it to the module's `viz` list in `modules.js`.

**A coding problem**: add an object to `dsa-tools/problems/mN.js` with four complete solutions. Put
`// <solve>` and `// </solve>` (Python: `# <solve>`) around the part the student writes; text after `solve`
becomes the default return line of the starter. Then run `node dsa-tools/build-problems.js`.

## Tests (run all of them before pushing)

| Command | What it checks |
|---|---|
| `node dsa-tools/test-library.js` | every algorithm in `lib*.js` compiles and prints its `expect` in C, C++, Python and Java (Java runs on the public Judge0 CE service; `SKIP_JAVA=1` skips it) |
| `node dsa-tools/test-pyq.js` | every C program in the past-paper answers compiles and prints its `expect` |
| `JAVA=99 node dsa-tools/build-problems.js` | builds `problems.js`; every test's expected output comes from the Python reference, and C, C++ (with sanitizers) and Java (on Judge0 CE) must agree, and the hand-written example outputs must match |
| `node dsa-tools/smoke-test.js` | opens every page in headless Chromium and fails on console errors or empty pages |
| `node dsa-tools/test-viz.js` | 60k+ checks that each visualizer's algorithm is correct: sorts sort, BST/AVL keep their invariants, heaps extract in order, and so on |

## Hosting notes

- Production serves the Jaipur app at `/bit-jaipur` (no trailing slash), so the DSA button builds its link from
  `location.pathname` and `dsa/index.html` restores the slash if a clean-URL host strips it. Same trick as DSD.
- The button passes `?api=<VITE_API_BASE_URL>`, so a backend move never needs a DSA change. Opened directly,
  the site falls back to the address in `js/util.js` (`DEFAULT_API`), and to `http://localhost:3001` on localhost.
- The notes only download once the backend has the new `Study Material/CS24201/` folder (re-run
  `setup-ec2.sh` on the EC2 host to deploy the latest `main`).
