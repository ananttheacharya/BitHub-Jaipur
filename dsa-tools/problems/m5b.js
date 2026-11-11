/* Module V problems, second set: trees and graphs. Trees are built with the helpers of m5.js. */
const R = String.raw;
const { TREE_FORMAT, C_TREE, CPP_TREE, JAVA_TREE, PY_TREE } = require('./m5.js').pre;
module.exports = [
  {
    id: 'diameter-of-binary-tree', title: 'Diameter of Binary Tree', module: 5, difficulty: 'Easy', tags: ['Tree', 'Recursion', 'DFS'], source: 'LeetCode 543', link: 'https://leetcode.com/problems/diameter-of-binary-tree/',
    blurb: 'The longest path between any two nodes, computed while measuring heights.',
    statement: R`The **diameter** of a binary tree is the number of **edges** on the longest path between any two nodes. The path may or may not pass through the root. Print the diameter.`,
    format: TREE_FORMAT + '\n\n**Output:** the diameter.',
    constraints: '- 1 ≤ n ≤ 1000, and the first token is not `null`',
    examples: [{ in: '5\n1 2 3 4 5\n', out: '3\n', why: 'The path 4 → 2 → 1 → 3 (or 5 → 2 → 1 → 3) has 3 edges.' }, { in: '3\n1 2 null\n', out: '1\n', why: 'Only one edge exists.' }],
    more: ['1\n1\n', '7\n1 2 3 4 5 6 7\n', '5\n1 2 null 3 null\n', '9\n1 2 3 4 null null 5 6 null\n', '7\n5 4 8 11 null 13 4\n'],
    time: 'O(n)', space: 'O(h)',
    explain: R`The longest path whose highest node is \`t\` goes down the deepest path on the left and the deepest path on the right: its length is \`height(left) + height(right)\` (heights counted in nodes, so the sum is the number of edges). Compute every node's height with the usual recursion and, at each node, update a global best with that sum. The answer is the maximum over all nodes, found in **one** traversal.`,
    pseudo: ['best = 0', 'height(t): if t is NULL return 0', '  l = height(t.left); r = height(t.right)', '  best = max(best, l + r)', '  return 1 + max(l, r)', 'height(root); print best'],
    solution: {
      c: C_TREE + R`
static int best = 0;

int height(TreeNode *t) {
    // <solve return 0;>
    if (!t) return 0;
    int l = height(t->left), r = height(t->right);
    if (l + r > best) best = l + r;
    return 1 + (l > r ? l : r);
    // </solve>
}

int main(void) {
    int n;
    scanf("%d", &n);
    char tok[1000][16];
    for (int i = 0; i < n; i++) scanf("%15s", tok[i]);
    TreeNode *root = buildTree(n, tok);
    height(root);
    printf("%d\n", best);
    return 0;
}
`,
      cpp: CPP_TREE + R`
int best = 0;

int height(TreeNode *t) {
    // <solve return 0;>
    if (!t) return 0;
    int l = height(t->left), r = height(t->right);
    best = max(best, l + r);
    return 1 + max(l, r);
    // </solve>
}

int main() {
    int n;
    cin >> n;
    vector<string> tok(n);
    for (auto &s : tok) cin >> s;
    height(buildTree(tok));
    cout << best << "\n";
    return 0;
}
`,
      java: JAVA_TREE + R`
    static int best = 0;

    static int height(TreeNode t) {
        // <solve return 0;>
        if (t == null) return 0;
        int l = height(t.left), r = height(t.right);
        best = Math.max(best, l + r);
        return 1 + Math.max(l, r);
        // </solve>
    }

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        String[] tok = new String[n];
        for (int i = 0; i < n; i++) tok[i] = in.next();
        height(buildTree(tok));
        System.out.println(best);
    }
}
`,
      py: PY_TREE + R`

best = 0


def height(t):
    # <solve return 0>
    global best
    if t is None:
        return 0
    l, r = height(t.left), height(t.right)
    best = max(best, l + r)
    return 1 + max(l, r)
    # </solve>


height(root)
print(best)
`,
    },
  },
  {
    id: 'right-side-view', title: 'Binary Tree Right Side View', module: 5, difficulty: 'Medium', tags: ['Tree', 'BFS', 'Queue'], source: 'LeetCode 199', link: 'https://leetcode.com/problems/binary-tree-right-side-view/',
    blurb: 'What you see when you stand to the right of the tree: the last node of every level.',
    statement: R`Imagine standing on the **right side** of a binary tree. Print the values of the nodes you can see, from the top to the bottom. That is the **last node of each level**.`,
    format: TREE_FORMAT + '\n\n**Output:** the visible values, separated by spaces.',
    constraints: '- 1 ≤ n ≤ 1000, and the first token is not `null`',
    examples: [{ in: '7\n1 2 3 null 5 null 4\n', out: '1 3 4\n', why: 'Level 0: 1. Level 1: 3 hides 2. Level 2: 4 hides 5.' }, { in: '3\n1 null 3\n', out: '1 3\n', why: 'A right-leaning chain is fully visible.' }],
    more: ['1\n1\n', '5\n1 2 null 3 null\n', '7\n1 2 3 4 5 6 7\n', '7\n1 2 3 4 null null null\n', '9\n5 4 8 11 null 13 4 7 2\n'],
    time: 'O(n)', space: 'O(w)',
    explain: R`Do a **level-order traversal** with a queue, processing one whole level at a time: remember how many nodes the queue holds at the start of the level, dequeue exactly that many, and note the **last** one dequeued. That node is the one visible from the right. Each node is enqueued and dequeued once: O(n) time, and the queue holds at most one level, O(width).`,
    pseudo: ['queue = [root]', 'while queue not empty:', '  size = length of queue', '  for i = 1 to size:', '    u = dequeue(); if u.left: enqueue; if u.right: enqueue', '    if i == size: output u.val'],
    solution: {
      c: C_TREE + R`
int main(void) {
    int n;
    scanf("%d", &n);
    char tok[1000][16];
    for (int i = 0; i < n; i++) scanf("%15s", tok[i]);
    TreeNode *root = buildTree(n, tok);
    // <solve>
    TreeNode *q[1000];
    int head = 0, tail = 0, first = 1;
    q[tail++] = root;
    while (head < tail) {
        int size = tail - head;
        for (int i = 0; i < size; i++) {
            TreeNode *u = q[head++];
            if (u->left) q[tail++] = u->left;
            if (u->right) q[tail++] = u->right;
            if (i == size - 1) { printf(first ? "%d" : " %d", u->val); first = 0; }
        }
    }
    printf("\n");
    // </solve>
    return 0;
}
`,
      cpp: CPP_TREE + R`
int main() {
    int n;
    cin >> n;
    vector<string> tok(n);
    for (auto &s : tok) cin >> s;
    TreeNode *root = buildTree(tok);
    // <solve>
    queue<TreeNode *> q;
    q.push(root);
    bool first = true;
    while (!q.empty()) {
        int size = q.size();
        for (int i = 0; i < size; i++) {
            TreeNode *u = q.front(); q.pop();
            if (u->left) q.push(u->left);
            if (u->right) q.push(u->right);
            if (i == size - 1) { cout << (first ? "" : " ") << u->val; first = false; }
        }
    }
    cout << "\n";
    // </solve>
    return 0;
}
`,
      java: JAVA_TREE + R`
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        String[] tok = new String[n];
        for (int i = 0; i < n; i++) tok[i] = in.next();
        TreeNode root = buildTree(tok);
        // <solve>
        Deque<TreeNode> q = new ArrayDeque<>();
        q.add(root);
        StringBuilder sb = new StringBuilder();
        while (!q.isEmpty()) {
            int size = q.size();
            for (int i = 0; i < size; i++) {
                TreeNode u = q.poll();
                if (u.left != null) q.add(u.left);
                if (u.right != null) q.add(u.right);
                if (i == size - 1) sb.append(sb.length() > 0 ? " " : "").append(u.val);
            }
        }
        System.out.println(sb);
        // </solve>
    }
}
`,
      py: PY_TREE + R`

# <solve>
out, level = [], [root]
while level:
    out.append(level[-1].val)
    level = [c for u in level for c in (u.left, u.right) if c]
print(*out)
# </solve>
`,
    },
  },
  {
    id: 'course-schedule', title: 'Course Schedule', module: 5, difficulty: 'Medium', tags: ['Graph', 'Topological sort', 'Cycle detection'], source: 'LeetCode 207', link: 'https://leetcode.com/problems/course-schedule/',
    blurb: 'Can all courses be finished given their prerequisites? Detect a cycle with Kahn\'s algorithm.',
    statement: R`There are \`n\` courses numbered 0 to n − 1 and \`m\` prerequisite pairs \`a b\`, meaning **b must be taken before a**. Print \`true\` if it is possible to finish all courses, otherwise \`false\` (which happens exactly when the prerequisites contain a **cycle**).`,
    format: R`**Input:** n and m, then m lines with \`a b\`.

**Output:** \`true\` or \`false\`.`,
    constraints: '- 1 ≤ n ≤ 100\n- 0 ≤ m ≤ 500',
    examples: [{ in: '2 1\n1 0\n', out: 'true\n', why: 'Take course 0, then course 1.' }, { in: '2 2\n1 0\n0 1\n', out: 'false\n', why: 'Each course needs the other first: a cycle.' }],
    more: ['1 0\n', '3 2\n1 0\n2 1\n', '3 3\n1 0\n2 1\n0 2\n', '4 3\n1 0\n2 0\n3 1\n', '5 5\n1 0\n2 1\n3 2\n4 3\n1 4\n', '4 4\n1 0\n2 0\n3 1\n3 2\n'],
    time: 'O(n + m)', space: 'O(n + m)',
    explain: R`Model the courses as a directed graph with an edge b → a for each prerequisite. All courses can be finished exactly when the graph is a **DAG**, i.e. when it has a topological order. **Kahn's algorithm** builds one: count the incoming edges (in-degree) of every vertex, queue the vertices with in-degree 0, and repeatedly remove one, lowering the in-degree of its successors. If all n vertices get removed the answer is \`true\`; if some are left they all lie on or behind a cycle, so the answer is \`false\`.`,
    pseudo: ['build adjacency lists: b -> a; indeg[a]++', 'queue = all courses with indeg 0; done = 0', 'while queue not empty:', '  u = dequeue(); done++', '  for each successor w of u: indeg[w]--; if indeg[w] == 0: enqueue w', 'print (done == n)'],
    solution: {
      c: R`#include <stdio.h>

int main(void) {
    int n, m, a[500], b[500];
    scanf("%d %d", &n, &m);
    for (int i = 0; i < m; i++) scanf("%d %d", &a[i], &b[i]);
    // <solve>
    int indeg[100] = {0}, queue[100], head = 0, tail = 0, done = 0;
    for (int i = 0; i < m; i++) indeg[a[i]]++;
    for (int v = 0; v < n; v++) if (indeg[v] == 0) queue[tail++] = v;
    while (head < tail) {
        int u = queue[head++];
        done++;
        for (int i = 0; i < m; i++)
            if (b[i] == u && --indeg[a[i]] == 0) queue[tail++] = a[i];
    }
    printf(done == n ? "true\n" : "false\n");
    // </solve>
    return 0;
}
`,
      cpp: R`#include <iostream>
#include <queue>
#include <vector>
using namespace std;

int main() {
    int n, m;
    cin >> n >> m;
    vector<int> a(m), b(m);
    for (int i = 0; i < m; i++) cin >> a[i] >> b[i];
    // <solve>
    vector<vector<int>> adj(n);
    vector<int> indeg(n, 0);
    for (int i = 0; i < m; i++) { adj[b[i]].push_back(a[i]); indeg[a[i]]++; }
    queue<int> q;
    for (int v = 0; v < n; v++) if (indeg[v] == 0) q.push(v);
    int done = 0;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        done++;
        for (int w : adj[u]) if (--indeg[w] == 0) q.push(w);
    }
    cout << (done == n ? "true" : "false") << "\n";
    // </solve>
    return 0;
}
`,
      java: R`import java.util.*;

class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt(), m = in.nextInt();
        int[] a = new int[m], b = new int[m];
        for (int i = 0; i < m; i++) { a[i] = in.nextInt(); b[i] = in.nextInt(); }
        // <solve>
        List<List<Integer>> adj = new ArrayList<>();
        for (int v = 0; v < n; v++) adj.add(new ArrayList<>());
        int[] indeg = new int[n];
        for (int i = 0; i < m; i++) { adj.get(b[i]).add(a[i]); indeg[a[i]]++; }
        Deque<Integer> q = new ArrayDeque<>();
        for (int v = 0; v < n; v++) if (indeg[v] == 0) q.add(v);
        int done = 0;
        while (!q.isEmpty()) {
            int u = q.poll();
            done++;
            for (int w : adj.get(u)) if (--indeg[w] == 0) q.add(w);
        }
        System.out.println(done == n ? "true" : "false");
        // </solve>
    }
}
`,
      py: R`import sys
from collections import deque

data = sys.stdin.read().split()
n, m = int(data[0]), int(data[1])
pairs = [(int(data[2 + 2 * i]), int(data[3 + 2 * i])) for i in range(m)]
# <solve>
adj = [[] for _ in range(n)]
indeg = [0] * n
for a, b in pairs:
    adj[b].append(a)
    indeg[a] += 1
q = deque(v for v in range(n) if indeg[v] == 0)
done = 0
while q:
    u = q.popleft()
    done += 1
    for w in adj[u]:
        indeg[w] -= 1
        if indeg[w] == 0:
            q.append(w)
print("true" if done == n else "false")
# </solve>
`,
    },
  },
  {
    id: 'number-of-provinces', title: 'Number of Provinces', module: 5, difficulty: 'Medium', tags: ['Graph', 'Disjoint set', 'DFS'], source: 'LeetCode 547', link: 'https://leetcode.com/problems/number-of-provinces/',
    blurb: 'Count the groups of connected cities with union-find.',
    statement: R`There are \`n\` cities. An \`n × n\` matrix says whether two cities are **directly connected** (1) or not (0); the matrix is symmetric and each city is connected to itself. A **province** is a group of cities connected directly or indirectly. Print the number of provinces.`,
    format: R`**Input:** n, then n rows of n integers (0 or 1).

**Output:** the number of provinces.`,
    constraints: '- 1 ≤ n ≤ 100',
    examples: [{ in: '3\n1 1 0\n1 1 0\n0 0 1\n', out: '2\n', why: 'Cities 0 and 1 form one province; city 2 is alone.' }, { in: '3\n1 0 0\n0 1 0\n0 0 1\n', out: '3\n', why: 'No two cities are connected.' }],
    more: ['1\n1\n', '2\n1 1\n1 1\n', '4\n1 1 0 0\n1 1 0 0\n0 0 1 1\n0 0 1 1\n', '4\n1 0 0 1\n0 1 1 0\n0 1 1 0\n1 0 0 1\n', '5\n1 1 0 0 0\n1 1 1 0 0\n0 1 1 0 0\n0 0 0 1 1\n0 0 0 1 1\n', '4\n1 1 1 1\n1 1 1 1\n1 1 1 1\n1 1 1 1\n'],
    time: 'O(n² α(n))', space: 'O(n)',
    explain: R`This is the **connected components** problem, a perfect fit for the **disjoint set**. Start with n separate sets. For every pair (i, j) with a direct connection, \`union(i, j)\`; each union that actually merges two different sets lowers the number of components by one. Finish with n minus the number of successful unions. With **path compression** and union by rank a find costs almost O(1), so the whole scan of the matrix is O(n²). A DFS or BFS from every unvisited city gives the same answer.`,
    pseudo: ['parent[i] = i for every city; count = n', 'for i, j with i < j and connected[i][j] == 1:', '  ri = find(i); rj = find(j)', '  if ri != rj: parent[ri] = rj; count--', 'print count'],
    solution: {
      c: R`#include <stdio.h>

static int parent[100];

int find(int x) {
    while (parent[x] != x) { parent[x] = parent[parent[x]]; x = parent[x]; }   /* path halving */
    return x;
}

int main(void) {
    int n, g[100][100];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) for (int j = 0; j < n; j++) scanf("%d", &g[i][j]);
    // <solve>
    int count = n;
    for (int i = 0; i < n; i++) parent[i] = i;
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++)
            if (g[i][j]) {
                int ri = find(i), rj = find(j);
                if (ri != rj) { parent[ri] = rj; count--; }
            }
    printf("%d\n", count);
    // </solve>
    return 0;
}
`,
      cpp: R`#include <iostream>
#include <numeric>
#include <vector>
using namespace std;

vector<int> parent;

int find(int x) {
    while (parent[x] != x) { parent[x] = parent[parent[x]]; x = parent[x]; }   // path halving
    return x;
}

int main() {
    int n;
    cin >> n;
    vector<vector<int>> g(n, vector<int>(n));
    for (auto &row : g) for (int &x : row) cin >> x;
    // <solve>
    parent.resize(n);
    iota(parent.begin(), parent.end(), 0);
    int count = n;
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++)
            if (g[i][j]) {
                int ri = find(i), rj = find(j);
                if (ri != rj) { parent[ri] = rj; count--; }
            }
    cout << count << "\n";
    // </solve>
    return 0;
}
`,
      java: R`import java.util.*;

class Main {
    static int[] parent;

    static int find(int x) {
        while (parent[x] != x) { parent[x] = parent[parent[x]]; x = parent[x]; }   // path halving
        return x;
    }

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        int[][] g = new int[n][n];
        for (int i = 0; i < n; i++) for (int j = 0; j < n; j++) g[i][j] = in.nextInt();
        // <solve>
        parent = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
        int count = n;
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++)
                if (g[i][j] == 1) {
                    int ri = find(i), rj = find(j);
                    if (ri != rj) { parent[ri] = rj; count--; }
                }
        System.out.println(count);
        // </solve>
    }
}
`,
      py: R`import sys

data = sys.stdin.read().split()
n = int(data[0])
g = [[int(data[1 + i * n + j]) for j in range(n)] for i in range(n)]
# <solve>
parent = list(range(n))


def find(x):
    while parent[x] != x:
        parent[x] = parent[parent[x]]      # path halving
        x = parent[x]
    return x


count = n
for i in range(n):
    for j in range(i + 1, n):
        if g[i][j]:
            ri, rj = find(i), find(j)
            if ri != rj:
                parent[ri] = rj
                count -= 1
print(count)
# </solve>
`,
    },
  },
];
