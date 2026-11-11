/* Module V problems: trees and graphs. A tree is given in level order, with "null" for a missing child. */
const R = String.raw;

const TREE_FORMAT = R`**Input:** n, then n tokens: the tree in **level order**, where \`null\` marks a missing child (the format used by LeetCode). For example \`3 9 20 null null 15 7\` is the tree with root 3, children 9 and 20, and 20 has children 15 and 7.`;

const C_TREE = R`#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct TreeNode { int val; struct TreeNode *left, *right; } TreeNode;

TreeNode *newNode(int v) {
    TreeNode *t = calloc(1, sizeof(TreeNode));
    t->val = v;
    return t;
}

/* builds the tree from n level-order tokens ("null" = no node) */
TreeNode *buildTree(int n, char tok[][16]) {
    if (n == 0 || strcmp(tok[0], "null") == 0) return NULL;
    TreeNode *root = newNode(atoi(tok[0])), **queue = malloc(sizeof(TreeNode *) * (n + 1));
    int head = 0, tail = 0, i = 1;
    queue[tail++] = root;
    while (head < tail && i < n) {
        TreeNode *cur = queue[head++];
        if (i < n && strcmp(tok[i], "null") != 0) { cur->left = newNode(atoi(tok[i])); queue[tail++] = cur->left; }
        i++;
        if (i < n && strcmp(tok[i], "null") != 0) { cur->right = newNode(atoi(tok[i])); queue[tail++] = cur->right; }
        i++;
    }
    free(queue);
    return root;
}
`;
const CPP_TREE = R`#include <iostream>
#include <queue>
#include <string>
#include <vector>
using namespace std;

struct TreeNode {
    int val; TreeNode *left = nullptr, *right = nullptr;
    TreeNode(int v) : val(v) {}
};

// builds the tree from level-order tokens ("null" = no node)
TreeNode *buildTree(const vector<string> &tok) {
    if (tok.empty() || tok[0] == "null") return nullptr;
    TreeNode *root = new TreeNode(stoi(tok[0]));
    queue<TreeNode *> q;
    q.push(root);
    size_t i = 1;
    while (!q.empty() && i < tok.size()) {
        TreeNode *cur = q.front(); q.pop();
        if (i < tok.size() && tok[i] != "null") { cur->left = new TreeNode(stoi(tok[i])); q.push(cur->left); }
        i++;
        if (i < tok.size() && tok[i] != "null") { cur->right = new TreeNode(stoi(tok[i])); q.push(cur->right); }
        i++;
    }
    return root;
}
`;
const JAVA_TREE = R`import java.util.*;

class Main {
    static class TreeNode {
        int val; TreeNode left, right;
        TreeNode(int v) { val = v; }
    }

    // builds the tree from level-order tokens ("null" = no node)
    static TreeNode buildTree(String[] tok) {
        if (tok.length == 0 || tok[0].equals("null")) return null;
        TreeNode root = new TreeNode(Integer.parseInt(tok[0]));
        Deque<TreeNode> q = new ArrayDeque<>();
        q.add(root);
        int i = 1;
        while (!q.isEmpty() && i < tok.length) {
            TreeNode cur = q.poll();
            if (i < tok.length && !tok[i].equals("null")) { cur.left = new TreeNode(Integer.parseInt(tok[i])); q.add(cur.left); }
            i++;
            if (i < tok.length && !tok[i].equals("null")) { cur.right = new TreeNode(Integer.parseInt(tok[i])); q.add(cur.right); }
            i++;
        }
        return root;
    }
`;
const PY_TREE = R`import sys
from collections import deque


class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None


def build_tree(tok):
    """Builds the tree from level-order tokens ("null" = no node)."""
    if not tok or tok[0] == "null":
        return None
    root = TreeNode(int(tok[0]))
    q, i = deque([root]), 1
    while q and i < len(tok):
        cur = q.popleft()
        if i < len(tok) and tok[i] != "null":
            cur.left = TreeNode(int(tok[i]))
            q.append(cur.left)
        i += 1
        if i < len(tok) and tok[i] != "null":
            cur.right = TreeNode(int(tok[i]))
            q.append(cur.right)
        i += 1
    return root


data = sys.stdin.read().split()
n = int(data[0])
root = build_tree(data[1:1 + n])
`;

module.exports = [
  {
    id: 'max-depth', title: 'Maximum Depth of a Binary Tree', module: 5, difficulty: 'Easy', tags: ['Tree', 'Recursion'], source: 'LeetCode 104', link: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/',
    blurb: 'The number of nodes on the longest path from the root down to a leaf.',
    statement: R`The **depth** (height in levels) of a binary tree is the number of nodes along the longest path from the root down to the farthest leaf. The tree is built for you; print its maximum depth. A tree with only a root has depth 1.`,
    format: TREE_FORMAT + '\n\n**Output:** the maximum depth.',
    constraints: '- 1 ≤ n ≤ 1000, and the first token is not `null`',
    examples: [{ in: '7\n3 9 20 null null 15 7\n', out: '3\n', why: 'The longest path is 3 → 20 → 15, three nodes.' }, { in: '3\n1 null 2\n', out: '2\n', why: '1 → 2.' }],
    more: ['1\n1\n', '5\n1 2 null 3 null\n', '7\n1 2 3 4 5 6 7\n', '7\n1 null 2 null 3 null 4\n', '9\n5 4 8 11 null 13 4 7 2\n'],
    time: 'O(n)', space: 'O(h)',
    explain: R`Use recursion: the depth of an empty tree is 0, and the depth of any other tree is **1 + the larger of the depths of its two subtrees**. Every node is visited once, so the time is O(n). The recursion goes as deep as the tree is high, so the space is O(h): O(log n) for a balanced tree, O(n) for a chain.`,
    pseudo: ['depth(node):', '  if node == NULL: return 0', '  return 1 + max(depth(node.left), depth(node.right))'],
    solution: {
      c: C_TREE + R`
int depth(TreeNode *t) {
    // <solve return 0;>
    if (!t) return 0;
    int l = depth(t->left), r = depth(t->right);
    return 1 + (l > r ? l : r);
    // </solve>
}

int main(void) {
    int n;
    scanf("%d", &n);
    char tok[1000][16];
    for (int i = 0; i < n; i++) scanf("%15s", tok[i]);
    TreeNode *root = buildTree(n, tok);
    printf("%d\n", depth(root));
    return 0;
}
`,
      cpp: CPP_TREE + R`
int depth(TreeNode *t) {
    // <solve return 0;>
    if (!t) return 0;
    return 1 + max(depth(t->left), depth(t->right));
    // </solve>
}

int main() {
    int n;
    cin >> n;
    vector<string> tok(n);
    for (auto &s : tok) cin >> s;
    cout << depth(buildTree(tok)) << "\n";
    return 0;
}
`,
      java: JAVA_TREE + R`
    static int depth(TreeNode t) {
        // <solve return 0;>
        if (t == null) return 0;
        return 1 + Math.max(depth(t.left), depth(t.right));
        // </solve>
    }

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        String[] tok = new String[n];
        for (int i = 0; i < n; i++) tok[i] = in.next();
        System.out.println(depth(buildTree(tok)));
    }
}
`,
      py: PY_TREE + R`

def depth(t):
    # <solve return 0>
    if t is None:
        return 0
    return 1 + max(depth(t.left), depth(t.right))
    # </solve>


print(depth(root))
`,
    },
  },
  {
    id: 'inorder-traversal', title: 'Binary Tree Inorder Traversal', module: 5, difficulty: 'Easy', tags: ['Tree', 'Traversal', 'Stack'], source: 'LeetCode 94', link: 'https://leetcode.com/problems/binary-tree-inorder-traversal/',
    blurb: 'Visit left subtree, node, right subtree. Recursively or with an explicit stack.',
    statement: R`Print the **inorder traversal** of a binary tree: first the left subtree, then the node itself, then the right subtree. For a binary search tree this lists the keys in sorted order.`,
    format: TREE_FORMAT + '\n\n**Output:** the node values in inorder, separated by spaces.',
    constraints: '- 1 ≤ n ≤ 1000, and the first token is not `null`',
    examples: [{ in: '3\n1 null 2\n', out: '1 2\n', why: '1 has no left child, so it is visited first, then its right child 2.' }, { in: '7\n4 2 6 1 3 5 7\n', out: '1 2 3 4 5 6 7\n', why: 'A binary search tree: inorder gives sorted order.' }],
    more: ['1\n1\n', '7\n3 9 20 null null 15 7\n', '5\n1 2 null 3 null\n', '7\n1 null 2 null 3 null 4\n', '9\n5 4 8 11 null 13 4 7 2\n'],
    time: 'O(n)', space: 'O(h)',
    explain: R`The recursive version is three lines: traverse the left child, record the node, traverse the right child. To avoid recursion, simulate it with a **stack**: go as far left as possible pushing nodes; when you cannot go further, pop a node, visit it, and then move to its right child and repeat. Both visit each node once: O(n) time, and O(h) space where h is the height of the tree.`,
    pseudo: ['stack = empty; cur = root', 'while cur != NULL or stack not empty:', '  while cur != NULL: push cur; cur = cur.left', '  cur = pop(); visit cur', '  cur = cur.right'],
    solution: {
      c: C_TREE + R`
int main(void) {
    int n;
    scanf("%d", &n);
    char tok[1000][16];
    for (int i = 0; i < n; i++) scanf("%15s", tok[i]);
    TreeNode *root = buildTree(n, tok);
    // <solve>
    TreeNode *stack[1000], *cur = root;
    int top = -1, first = 1;
    while (cur || top >= 0) {
        while (cur) { stack[++top] = cur; cur = cur->left; }
        cur = stack[top--];
        printf(first ? "%d" : " %d", cur->val);
        first = 0;
        cur = cur->right;
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
    vector<TreeNode *> st;
    TreeNode *cur = root;
    bool first = true;
    while (cur || !st.empty()) {
        while (cur) { st.push_back(cur); cur = cur->left; }
        cur = st.back(); st.pop_back();
        cout << (first ? "" : " ") << cur->val;
        first = false;
        cur = cur->right;
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
        Deque<TreeNode> st = new ArrayDeque<>();
        TreeNode cur = root;
        StringBuilder sb = new StringBuilder();
        while (cur != null || !st.isEmpty()) {
            while (cur != null) { st.push(cur); cur = cur.left; }
            cur = st.pop();
            sb.append(sb.length() > 0 ? " " : "").append(cur.val);
            cur = cur.right;
        }
        System.out.println(sb);
        // </solve>
    }
}
`,
      py: PY_TREE + R`
# <solve>
out, stack, cur = [], [], root
while cur or stack:
    while cur:
        stack.append(cur)
        cur = cur.left
    cur = stack.pop()
    out.append(cur.val)
    cur = cur.right
print(*out)
# </solve>
`,
    },
  },
  {
    id: 'validate-bst', title: 'Validate Binary Search Tree', module: 5, difficulty: 'Medium', tags: ['Tree', 'BST', 'Recursion'], source: 'LeetCode 98', link: 'https://leetcode.com/problems/validate-binary-search-tree/',
    blurb: 'Is every node larger than everything on its left and smaller than everything on its right?',
    statement: R`Decide whether a binary tree is a valid **binary search tree**: for every node, **all** keys in its left subtree are smaller than the node's key and **all** keys in its right subtree are larger. (Comparing a node only with its direct children is not enough.) Duplicate keys make a tree invalid. Print \`true\` or \`false\`.`,
    format: TREE_FORMAT + '\n\n**Output:** `true` or `false`.',
    constraints: '- 1 ≤ n ≤ 1000, and the first token is not `null`\n- values fit in a 32-bit integer',
    examples: [{ in: '3\n2 1 3\n', out: 'true\n', why: '1 < 2 < 3.' }, { in: '7\n5 1 4 null null 3 6\n', out: 'false\n', why: 'The right child 4 is smaller than the root 5.' }],
    more: ['7\n5 3 8 2 4 7 9\n', '3\n1 1 null\n', '7\n10 5 15 null null 6 20\n', '1\n5\n', '1\n-2147483648\n', '5\n3 1 5 0 2\n'],
    time: 'O(n)', space: 'O(h)',
    explain: R`Each node must lie in an **open interval (low, high)** determined by its ancestors: going left tightens the upper bound to the parent's key, going right tightens the lower bound. Check every node against its interval recursively, starting with (−∞, +∞). This catches the case where a deep node violates an ancestor's key, which a parent-child comparison misses. Use 64-bit bounds so that keys equal to the 32-bit limits still work. O(n) time, O(h) space. (Alternatively, an inorder traversal must be strictly increasing.)`,
    pseudo: ['valid(node, low, high):', '  if node == NULL: return true', '  if node.val <= low or node.val >= high: return false', '  return valid(node.left, low, node.val) and valid(node.right, node.val, high)', 'print valid(root, -infinity, +infinity)'],
    solution: {
      c: C_TREE + R`
int valid(TreeNode *t, long long low, long long high) {
    // <solve return 1;>
    if (!t) return 1;
    if (t->val <= low || t->val >= high) return 0;
    return valid(t->left, low, t->val) && valid(t->right, t->val, high);
    // </solve>
}

int main(void) {
    int n;
    scanf("%d", &n);
    char tok[1000][16];
    for (int i = 0; i < n; i++) scanf("%15s", tok[i]);
    TreeNode *root = buildTree(n, tok);
    printf(valid(root, -4000000000LL, 4000000000LL) ? "true\n" : "false\n");
    return 0;
}
`,
      cpp: CPP_TREE + R`
bool valid(TreeNode *t, long long low, long long high) {
    // <solve return true;>
    if (!t) return true;
    if (t->val <= low || t->val >= high) return false;
    return valid(t->left, low, t->val) && valid(t->right, t->val, high);
    // </solve>
}

int main() {
    int n;
    cin >> n;
    vector<string> tok(n);
    for (auto &s : tok) cin >> s;
    cout << (valid(buildTree(tok), -4000000000LL, 4000000000LL) ? "true" : "false") << "\n";
    return 0;
}
`,
      java: JAVA_TREE + R`
    static boolean valid(TreeNode t, long low, long high) {
        // <solve return true;>
        if (t == null) return true;
        if (t.val <= low || t.val >= high) return false;
        return valid(t.left, low, t.val) && valid(t.right, t.val, high);
        // </solve>
    }

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        String[] tok = new String[n];
        for (int i = 0; i < n; i++) tok[i] = in.next();
        System.out.println(valid(buildTree(tok), -4000000000L, 4000000000L) ? "true" : "false");
    }
}
`,
      py: PY_TREE + R`

def valid(t, low, high):
    # <solve return True>
    if t is None:
        return True
    if t.val <= low or t.val >= high:
        return False
    return valid(t.left, low, t.val) and valid(t.right, t.val, high)
    # </solve>


print("true" if valid(root, float("-inf"), float("inf")) else "false")
`,
    },
  },
  {
    id: 'level-order', title: 'Binary Tree Level Order Traversal', module: 5, difficulty: 'Medium', tags: ['Tree', 'BFS', 'Queue'], source: 'LeetCode 102', link: 'https://leetcode.com/problems/binary-tree-level-order-traversal/',
    blurb: 'Visit the tree row by row with a queue (BFS).',
    statement: R`Print the **level order traversal** of a binary tree: the values of the root, then of the nodes one level below (left to right), then the next level, and so on. Print each level on its own line.`,
    format: TREE_FORMAT + '\n\n**Output:** one line per level, values separated by spaces.',
    constraints: '- 1 ≤ n ≤ 1000, and the first token is not `null`',
    examples: [{ in: '7\n3 9 20 null null 15 7\n', out: '3\n9 20\n15 7\n', why: 'Three levels.' }, { in: '1\n1\n', out: '1\n', why: 'Only the root.' }],
    more: ['5\n1 2 null 3 null\n', '7\n1 2 3 4 5 6 7\n', '7\n1 null 2 null 3 null 4\n', '9\n5 4 8 11 null 13 4 7 2\n', '5\n10 5 15 null 7\n'],
    time: 'O(n)', space: 'O(w)',
    explain: R`This is **breadth-first search** on a tree. Put the root in a queue. Repeat while the queue is not empty: note how many nodes it holds (that is the size of the current level), dequeue exactly that many, print their values, and enqueue their children. The queue then holds the next level. Each node is enqueued and dequeued once: O(n) time, and the queue never holds more than the widest level w.`,
    pseudo: ['queue = [root]', 'while queue not empty:', '  size = queue.length', '  repeat size times: node = dequeue(); print node.val; enqueue its non-null children', '  end the line'],
    solution: {
      c: C_TREE + R`
int main(void) {
    int n;
    scanf("%d", &n);
    char tok[1000][16];
    for (int i = 0; i < n; i++) scanf("%15s", tok[i]);
    TreeNode *root = buildTree(n, tok);
    // <solve>
    TreeNode *queue[1000];
    int head = 0, tail = 0;
    queue[tail++] = root;
    while (head < tail) {
        int size = tail - head;
        for (int i = 0; i < size; i++) {
            TreeNode *cur = queue[head++];
            printf(i ? " %d" : "%d", cur->val);
            if (cur->left) queue[tail++] = cur->left;
            if (cur->right) queue[tail++] = cur->right;
        }
        printf("\n");
    }
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
    while (!q.empty()) {
        int size = q.size();
        for (int i = 0; i < size; i++) {
            TreeNode *cur = q.front(); q.pop();
            cout << (i ? " " : "") << cur->val;
            if (cur->left) q.push(cur->left);
            if (cur->right) q.push(cur->right);
        }
        cout << "\n";
    }
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
                TreeNode cur = q.poll();
                sb.append(i > 0 ? " " : "").append(cur.val);
                if (cur.left != null) q.add(cur.left);
                if (cur.right != null) q.add(cur.right);
            }
            sb.append("\n");
        }
        System.out.print(sb);
        // </solve>
    }
}
`,
      py: PY_TREE + R`
# <solve>
q = deque([root])
while q:
    level = []
    for _ in range(len(q)):
        cur = q.popleft()
        level.append(cur.val)
        if cur.left:
            q.append(cur.left)
        if cur.right:
            q.append(cur.right)
    print(*level)
# </solve>
`,
    },
  },
  {
    id: 'number-of-islands', title: 'Number of Islands', module: 5, difficulty: 'Medium', tags: ['Graph', 'DFS', 'BFS', 'Grid'], source: 'LeetCode 200', link: 'https://leetcode.com/problems/number-of-islands/',
    blurb: 'Count the connected groups of land cells in a grid with a depth-first search.',
    statement: R`A grid of \`1\` (land) and \`0\` (water) is given. An **island** is a group of land cells connected horizontally or vertically (not diagonally). Print the number of islands.`,
    format: R`**Input:** the number of rows r and columns c, then r lines each with c characters (\`0\` or \`1\`, no spaces).

**Output:** the number of islands.`,
    constraints: '- 1 ≤ r, c ≤ 50',
    examples: [{ in: '4 5\n11110\n11010\n11000\n00000\n', out: '1\n', why: 'All land cells are connected.' }, { in: '4 5\n11000\n11000\n00100\n00011\n', out: '3\n', why: 'Three separate groups.' }],
    more: ['1 1\n0\n', '1 1\n1\n', '3 3\n101\n010\n101\n', '3 4\n1111\n0000\n1111\n', '5 5\n10101\n01010\n10101\n01010\n10101\n', '2 6\n110011\n110011\n'],
    time: 'O(r·c)', space: 'O(r·c)',
    explain: R`Treat each land cell as a vertex joined to its land neighbours: the islands are the **connected components** of this graph. Scan the grid; whenever you meet a land cell that has not been visited, you have found a new island, so add one to the count and run a **DFS (or BFS)** from that cell that marks every land cell reachable from it (for instance by overwriting it with 0). Every cell is visited a constant number of times: O(r·c) time, and O(r·c) stack space in the worst case.`,
    pseudo: ['count = 0', 'for each cell (i, j):', '  if grid[i][j] == 1: count = count + 1; sink(i, j)', 'sink(i, j): if outside the grid or grid[i][j] == 0: return', '  grid[i][j] = 0; sink the four neighbours', 'print count'],
    solution: {
      c: R`#include <stdio.h>

int r, c;
char grid[50][52];

void sink(int i, int j) {
    if (i < 0 || j < 0 || i >= r || j >= c || grid[i][j] != '1') return;
    grid[i][j] = '0';
    sink(i + 1, j); sink(i - 1, j); sink(i, j + 1); sink(i, j - 1);
}

int main(void) {
    scanf("%d %d", &r, &c);
    for (int i = 0; i < r; i++) scanf("%51s", grid[i]);
    // <solve>
    int count = 0;
    for (int i = 0; i < r; i++)
        for (int j = 0; j < c; j++)
            if (grid[i][j] == '1') { count++; sink(i, j); }
    printf("%d\n", count);
    // </solve>
    return 0;
}
`,
      cpp: R`#include <iostream>
#include <string>
#include <vector>
using namespace std;

int r, c;
vector<string> grid;

void sink(int i, int j) {
    if (i < 0 || j < 0 || i >= r || j >= c || grid[i][j] != '1') return;
    grid[i][j] = '0';
    sink(i + 1, j); sink(i - 1, j); sink(i, j + 1); sink(i, j - 1);
}

int main() {
    cin >> r >> c;
    grid.resize(r);
    for (auto &row : grid) cin >> row;
    // <solve>
    int count = 0;
    for (int i = 0; i < r; i++)
        for (int j = 0; j < c; j++)
            if (grid[i][j] == '1') { count++; sink(i, j); }
    cout << count << "\n";
    // </solve>
    return 0;
}
`,
      java: R`import java.util.*;

class Main {
    static int r, c;
    static char[][] grid;

    static void sink(int i, int j) {
        if (i < 0 || j < 0 || i >= r || j >= c || grid[i][j] != '1') return;
        grid[i][j] = '0';
        sink(i + 1, j); sink(i - 1, j); sink(i, j + 1); sink(i, j - 1);
    }

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        r = in.nextInt(); c = in.nextInt();
        grid = new char[r][];
        for (int i = 0; i < r; i++) grid[i] = in.next().toCharArray();
        // <solve>
        int count = 0;
        for (int i = 0; i < r; i++)
            for (int j = 0; j < c; j++)
                if (grid[i][j] == '1') { count++; sink(i, j); }
        System.out.println(count);
        // </solve>
    }
}
`,
      py: R`import sys

sys.setrecursionlimit(10000)
data = sys.stdin.read().split()
r, c = int(data[0]), int(data[1])
grid = [list(row) for row in data[2:2 + r]]


def sink(i, j):
    if i < 0 or j < 0 or i >= r or j >= c or grid[i][j] != "1":
        return
    grid[i][j] = "0"
    sink(i + 1, j)
    sink(i - 1, j)
    sink(i, j + 1)
    sink(i, j - 1)


# <solve>
count = 0
for i in range(r):
    for j in range(c):
        if grid[i][j] == "1":
            count += 1
            sink(i, j)
print(count)
# </solve>
`,
    },
  },
];
