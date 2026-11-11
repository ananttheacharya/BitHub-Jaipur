/* Module III problems, second set: stacks and queues. */
const R = String.raw;
module.exports = [
  {
    id: 'queue-using-stacks', title: 'Implement Queue using Stacks', module: 3, difficulty: 'Easy', tags: ['Queue', 'Stack', 'Design'], source: 'LeetCode 232', link: 'https://leetcode.com/problems/implement-queue-using-stacks/',
    blurb: 'Build a FIFO queue out of two LIFO stacks with amortised O(1) operations.',
    statement: R`Implement a **queue** using only **two stacks**. Process a list of commands:

- \`push x\`: add x at the back of the queue (prints nothing)
- \`pop\`: remove and print the element at the front
- \`peek\`: print the front element without removing it
- \`empty\`: print \`true\` if the queue is empty, else \`false\`

Every \`pop\` and \`peek\` is on a non-empty queue.`,
    format: R`**Input:** m, then m commands, one per line.

**Output:** one line for each \`pop\`, \`peek\` and \`empty\` command.`,
    constraints: '- 1 ≤ m ≤ 100',
    examples: [{ in: '6\npush 1\npush 2\npeek\npop\nempty\npop\n', out: '1\n1\nfalse\n2\n', why: 'The queue holds 1, 2; peek and pop give 1; one element is left; pop gives 2.' }, { in: '2\nempty\npush 5\n', out: 'true\n', why: 'The queue is empty at first.' }],
    more: ['5\npush 3\npush 4\npop\npush 5\npop\n', '7\npush 1\npush 2\npush 3\npop\npop\npush 4\npop\n', '4\npush 9\nempty\npop\nempty\n', '6\npush 7\npeek\npush 8\npeek\npop\npeek\n'],
    time: 'amortised O(1) per operation', space: 'O(n)',
    explain: R`Use an **input stack** \`in\` and an **output stack** \`out\`. \`push\` simply pushes onto \`in\`. When the front is needed (\`pop\` or \`peek\`) and \`out\` is empty, pour all of \`in\` into \`out\`: this **reverses** the order, so the oldest element ends up on top. Each element is moved at most once from \`in\` to \`out\`, so the cost per operation is **amortised O(1)**.`,
    pseudo: ['push x: in.push(x)', 'move(): if out is empty: while in is not empty: out.push(in.pop())', 'pop: move(); print out.pop()', 'peek: move(); print out.top()', 'empty: print (in is empty and out is empty)'],
    solution: {
      c: R`#include <stdio.h>
#include <string.h>

int main(void) {
    int m;
    scanf("%d", &m);
    // <solve>
    int in[200], out[200], ti = 0, to = 0;
    char cmd[16];
    while (m--) {
        scanf("%15s", cmd);
        if (strcmp(cmd, "push") == 0) { int x; scanf("%d", &x); in[ti++] = x; }
        else if (strcmp(cmd, "empty") == 0) printf(ti == 0 && to == 0 ? "true\n" : "false\n");
        else {
            if (to == 0) while (ti > 0) out[to++] = in[--ti];      /* pour: reverses the order */
            printf("%d\n", strcmp(cmd, "pop") == 0 ? out[--to] : out[to - 1]);
        }
    }
    // </solve>
    return 0;
}
`,
      cpp: R`#include <iostream>
#include <stack>
#include <string>
using namespace std;

int main() {
    int m;
    cin >> m;
    // <solve>
    stack<int> in, out;
    string cmd;
    while (m--) {
        cin >> cmd;
        if (cmd == "push") { int x; cin >> x; in.push(x); }
        else if (cmd == "empty") cout << (in.empty() && out.empty() ? "true" : "false") << "\n";
        else {
            if (out.empty()) while (!in.empty()) { out.push(in.top()); in.pop(); }
            cout << out.top() << "\n";
            if (cmd == "pop") out.pop();
        }
    }
    // </solve>
    return 0;
}
`,
      java: R`import java.util.*;

class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int m = sc.nextInt();
        // <solve>
        Deque<Integer> in = new ArrayDeque<>(), out = new ArrayDeque<>();
        while (m-- > 0) {
            String cmd = sc.next();
            if (cmd.equals("push")) in.push(sc.nextInt());
            else if (cmd.equals("empty")) System.out.println(in.isEmpty() && out.isEmpty() ? "true" : "false");
            else {
                if (out.isEmpty()) while (!in.isEmpty()) out.push(in.pop());
                System.out.println(out.peek());
                if (cmd.equals("pop")) out.pop();
            }
        }
        // </solve>
    }
}
`,
      py: R`import sys

tokens = iter(sys.stdin.read().split())
m = int(next(tokens))
# <solve>
inp, out = [], []
for _ in range(m):
    cmd = next(tokens)
    if cmd == "push":
        inp.append(int(next(tokens)))
    elif cmd == "empty":
        print("true" if not inp and not out else "false")
    else:
        if not out:
            while inp:
                out.append(inp.pop())
        print(out[-1])
        if cmd == "pop":
            out.pop()
# </solve>
`,
    },
  },
  {
    id: 'next-greater-element', title: 'Next Greater Element', module: 3, difficulty: 'Medium', tags: ['Stack', 'Monotonic stack'], source: 'Classic (LeetCode 496 / 739)', link: 'https://leetcode.com/problems/next-greater-element-i/',
    blurb: 'For every element, the first larger element to its right, in one pass with a stack.',
    statement: R`For each element of an array, find the **first element to its right that is strictly greater**. Print that value, or \`-1\` if there is none.`,
    format: R`**Input:** n, then n integers.

**Output:** n values separated by spaces.`,
    constraints: '- 1 ≤ n ≤ 1000',
    examples: [{ in: '4\n4 5 2 25\n', out: '5 25 25 -1\n', why: 'After 4 comes 5; after 5 the first larger is 25; after 2 it is 25; nothing follows 25.' }, { in: '3\n13 7 6\n', out: '-1 -1 -1\n', why: 'The array is decreasing, so no element has a greater one to its right.' }],
    more: ['1\n5\n', '5\n1 2 3 4 5\n', '6\n2 7 3 5 4 6\n', '5\n5 5 5 5 5\n', '7\n9 1 8 2 7 3 6\n'],
    time: 'O(n)', space: 'O(n)',
    explain: R`Comparing every element with everything to its right is O(n²). Use a **stack of indices whose answer is still unknown**, kept in decreasing order of value. Scan left to right: while the new element is greater than the value at the top of the stack, it is that element's answer, so pop and record it. Then push the new index. Each index is pushed and popped once, so the scan is O(n). Elements left on the stack have no greater element: their answer stays −1.`,
    pseudo: ['ans[0..n-1] = -1; stack = empty (indices)', 'for i = 0 to n - 1:', '  while stack not empty and a[top] < a[i]:', '    ans[top] = a[i]; pop', '  push i', 'print ans'],
    solution: {
      c: R`#include <stdio.h>

int main(void) {
    int n, a[1000];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    // <solve>
    int ans[1000], st[1000], top = -1;
    for (int i = 0; i < n; i++) ans[i] = -1;
    for (int i = 0; i < n; i++) {
        while (top >= 0 && a[st[top]] < a[i]) ans[st[top--]] = a[i];
        st[++top] = i;
    }
    for (int i = 0; i < n; i++) printf(i ? " %d" : "%d", ans[i]);
    printf("\n");
    // </solve>
    return 0;
}
`,
      cpp: R`#include <iostream>
#include <stack>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    for (int &x : a) cin >> x;
    // <solve>
    vector<int> ans(n, -1);
    stack<int> st;
    for (int i = 0; i < n; i++) {
        while (!st.empty() && a[st.top()] < a[i]) { ans[st.top()] = a[i]; st.pop(); }
        st.push(i);
    }
    for (int i = 0; i < n; i++) cout << (i ? " " : "") << ans[i];
    cout << "\n";
    // </solve>
    return 0;
}
`,
      java: R`import java.util.*;

class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = in.nextInt();
        // <solve>
        int[] ans = new int[n];
        Arrays.fill(ans, -1);
        Deque<Integer> st = new ArrayDeque<>();
        for (int i = 0; i < n; i++) {
            while (!st.isEmpty() && a[st.peek()] < a[i]) ans[st.pop()] = a[i];
            st.push(i);
        }
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) sb.append(i > 0 ? " " : "").append(ans[i]);
        System.out.println(sb);
        // </solve>
    }
}
`,
      py: R`import sys

data = sys.stdin.read().split()
n = int(data[0])
a = [int(x) for x in data[1:1 + n]]
# <solve>
ans = [-1] * n
st = []
for i, x in enumerate(a):
    while st and a[st[-1]] < x:
        ans[st.pop()] = x
    st.append(i)
print(*ans)
# </solve>
`,
    },
  },
  {
    id: 'largest-rectangle-histogram', title: 'Largest Rectangle in Histogram', module: 3, difficulty: 'Hard', tags: ['Stack', 'Monotonic stack'], source: 'LeetCode 84', link: 'https://leetcode.com/problems/largest-rectangle-in-histogram/',
    blurb: 'The biggest rectangle under a bar chart, found in one pass with a monotonic stack.',
    statement: R`A histogram has n bars of width 1 and the given heights. Print the **area of the largest rectangle** that fits entirely inside the histogram.`,
    format: R`**Input:** n, then n heights.

**Output:** the largest area.`,
    constraints: '- 1 ≤ n ≤ 1000\n- 0 ≤ height ≤ 10000',
    examples: [{ in: '6\n2 1 5 6 2 3\n', out: '10\n', why: 'The bars of height 5 and 6 give a rectangle of height 5 and width 2.' }, { in: '2\n2 4\n', out: '4\n', why: 'Either the bar of height 4 alone, or both bars at height 2: 4.' }],
    more: ['1\n7\n', '5\n1 1 1 1 1\n', '5\n5 4 3 2 1\n', '7\n6 2 5 4 5 1 6\n', '4\n0 0 0 0\n', '6\n3 6 5 7 4 8\n'],
    time: 'O(n)', space: 'O(n)',
    explain: R`For each bar, the best rectangle that uses it as its **lowest bar** extends left and right until a lower bar is met. A stack of bar indices with **increasing heights** finds those limits: when a bar lower than the top arrives, the top bar's rectangle is complete (its right limit is the new bar, its left limit is the new top of the stack), so pop it and compute \`height × width\`. A sentinel bar of height 0 at the end flushes the stack. Every bar is pushed and popped once: O(n).`,
    pseudo: ['stack = empty (indices); best = 0', 'for i = 0 to n (treat a[n] as 0):', '  while stack not empty and a[top] >= a[i]:', '    h = a[top]; pop', '    left = (stack empty ? -1 : top)', '    width = i - left - 1; best = max(best, h * width)', '  push i', 'print best'],
    solution: {
      c: R`#include <stdio.h>

int main(void) {
    int n, a[1001];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    // <solve>
    int st[1001], top = -1, best = 0;
    a[n] = 0;                                   /* sentinel flushes the stack */
    for (int i = 0; i <= n; i++) {
        while (top >= 0 && a[st[top]] >= a[i]) {
            int h = a[st[top--]];
            int left = top >= 0 ? st[top] : -1;
            if (h * (i - left - 1) > best) best = h * (i - left - 1);
        }
        st[++top] = i;
    }
    printf("%d\n", best);
    // </solve>
    return 0;
}
`,
      cpp: R`#include <algorithm>
#include <iostream>
#include <stack>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> a(n + 1, 0);
    for (int i = 0; i < n; i++) cin >> a[i];
    // <solve>
    stack<int> st;
    int best = 0;
    for (int i = 0; i <= n; i++) {                      // a[n] = 0 is the sentinel
        while (!st.empty() && a[st.top()] >= a[i]) {
            int h = a[st.top()]; st.pop();
            int left = st.empty() ? -1 : st.top();
            best = max(best, h * (i - left - 1));
        }
        st.push(i);
    }
    cout << best << "\n";
    // </solve>
    return 0;
}
`,
      java: R`import java.util.*;

class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        int[] a = new int[n + 1];
        for (int i = 0; i < n; i++) a[i] = in.nextInt();
        // <solve>
        Deque<Integer> st = new ArrayDeque<>();
        int best = 0;
        for (int i = 0; i <= n; i++) {                  // a[n] = 0 is the sentinel
            while (!st.isEmpty() && a[st.peek()] >= a[i]) {
                int h = a[st.pop()];
                int left = st.isEmpty() ? -1 : st.peek();
                best = Math.max(best, h * (i - left - 1));
            }
            st.push(i);
        }
        System.out.println(best);
        // </solve>
    }
}
`,
      py: R`import sys

data = sys.stdin.read().split()
n = int(data[0])
a = [int(x) for x in data[1:1 + n]] + [0]
# <solve>
st, best = [], 0
for i, x in enumerate(a):
    while st and a[st[-1]] >= x:
        h = a[st.pop()]
        left = st[-1] if st else -1
        best = max(best, h * (i - left - 1))
    st.append(i)
print(best)
# </solve>
`,
    },
  },
  {
    id: 'decode-string', title: 'Decode String', module: 3, difficulty: 'Medium', tags: ['Stack', 'String', 'Recursion'], source: 'LeetCode 394', link: 'https://leetcode.com/problems/decode-string/',
    blurb: 'Expand patterns such as 3[a2[c]] using the stack of unfinished brackets.',
    statement: R`The encoding rule is \`k[text]\`: the \`text\` inside the brackets is repeated exactly \`k\` times. Brackets may be nested. Print the decoded string. The input is always valid, with letters, digits and brackets only.`,
    format: R`**Input:** the encoded string (no spaces).

**Output:** the decoded string.`,
    constraints: '- length ≤ 100\n- the decoded string has at most 1000 characters',
    examples: [{ in: '3[a]2[bc]\n', out: 'aaabcbc\n', why: 'a three times, then bc twice.' }, { in: '3[a2[c]]\n', out: 'accaccacc\n', why: 'Inside: a + cc = acc; repeated three times.' }],
    more: ['abc\n', '2[ab]cd\n', '10[a]\n', '2[a2[b2[c]]]\n', 'x3[y]z\n', '1[a1[b]]\n'],
    time: 'O(length of the output)', space: 'O(length of the output)',
    explain: R`Every \`[\` starts a sub-problem that must be finished before the outer one continues, which is exactly what a **stack** does. Scan the string keeping the *current text* and the *current number*. On \`[\`, push the current text and the number and start fresh. On \`]\`, pop the saved text and number and set \`current = saved + current × number\`. Letters are appended to the current text and digits extend the number.`,
    pseudo: ['stack = empty; cur = ""; num = 0', 'for each character c:', '  digit: num = num * 10 + c', '  letter: cur = cur + c', '  "[": push (cur, num); cur = ""; num = 0', '  "]": (prev, k) = pop; cur = prev + cur repeated k times', 'print cur'],
    solution: {
      c: R`#include <stdio.h>
#include <string.h>

int main(void) {
    static char s[205];
    scanf("%204s", s);
    // <solve>
    static char cur[1200], saved[100][1200];            /* the text being built, and the texts waiting on the stack */
    int savedNum[100], top = -1, num = 0, len = 0;
    for (int i = 0; s[i]; i++) {
        char c = s[i];
        if (c >= '0' && c <= '9') num = num * 10 + (c - '0');
        else if (c == '[') {
            cur[len] = 0;
            strcpy(saved[++top], cur); savedNum[top] = num;
            len = 0; num = 0;
        } else if (c == ']') {
            cur[len] = 0;
            static char tmp[1200];
            strcpy(tmp, saved[top]);
            int p = (int)strlen(tmp);
            for (int r = 0; r < savedNum[top]; r++) for (int j = 0; j < len; j++) tmp[p++] = cur[j];
            tmp[p] = 0; top--;
            strcpy(cur, tmp); len = p;
        } else cur[len++] = c;
    }
    cur[len] = 0;
    printf("%s\n", cur);
    // </solve>
    return 0;
}
`,
      cpp: R`#include <iostream>
#include <stack>
#include <string>
using namespace std;

int main() {
    string s;
    cin >> s;
    // <solve>
    stack<pair<string, int>> st;
    string cur;
    int num = 0;
    for (char c : s) {
        if (isdigit(c)) num = num * 10 + (c - '0');
        else if (c == '[') { st.push({cur, num}); cur = ""; num = 0; }
        else if (c == ']') {
            auto [prev, k] = st.top(); st.pop();
            string rep;
            for (int r = 0; r < k; r++) rep += cur;
            cur = prev + rep;
        } else cur += c;
    }
    cout << cur << "\n";
    // </solve>
    return 0;
}
`,
      java: R`import java.util.*;

class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        String s = in.next();
        // <solve>
        Deque<String> texts = new ArrayDeque<>();
        Deque<Integer> nums = new ArrayDeque<>();
        StringBuilder cur = new StringBuilder();
        int num = 0;
        for (char c : s.toCharArray()) {
            if (Character.isDigit(c)) num = num * 10 + (c - '0');
            else if (c == '[') { texts.push(cur.toString()); nums.push(num); cur = new StringBuilder(); num = 0; }
            else if (c == ']') {
                StringBuilder prev = new StringBuilder(texts.pop());
                int k = nums.pop();
                for (int r = 0; r < k; r++) prev.append(cur);
                cur = prev;
            } else cur.append(c);
        }
        System.out.println(cur);
        // </solve>
    }
}
`,
      py: R`s = input().strip()
# <solve>
stack, cur, num = [], "", 0
for c in s:
    if c.isdigit():
        num = num * 10 + int(c)
    elif c == "[":
        stack.append((cur, num))
        cur, num = "", 0
    elif c == "]":
        prev, k = stack.pop()
        cur = prev + cur * k
    else:
        cur += c
print(cur)
# </solve>
`,
    },
  },
];
