/* Module III problems: stacks, queues and deques. */
const R = String.raw;
module.exports = [
  {
    id: 'valid-parentheses', title: 'Valid Parentheses', module: 3, difficulty: 'Easy', tags: ['Stack', 'String', 'PYQ'], source: 'LeetCode 20', link: 'https://leetcode.com/problems/valid-parentheses/',
    blurb: 'Check that every bracket is closed by the right kind, in the right order.',
    statement: R`A string contains only the characters \`(\`, \`)\`, \`{\`, \`}\`, \`[\` and \`]\`. It is **valid** if every opening bracket is closed by the same type of bracket, and brackets are closed in the correct order (the most recently opened bracket closes first). Print \`true\` if the string is valid and \`false\` otherwise.`,
    format: R`**Input:** one string with no spaces.

**Output:** \`true\` or \`false\`.`,
    constraints: '- 1 ≤ length ≤ 1000',
    examples: [{ in: '()[]{}\n', out: 'true\n', why: 'Each bracket is closed right after it opens.' }, { in: '([)]\n', out: 'false\n', why: 'The ) arrives while [ is still the most recent open bracket.' }],
    more: ['(]\n', '{[]}\n', '((\n', ']\n', '({[]})[]\n', '(()\n'],
    time: 'O(n)', space: 'O(n)',
    explain: R`This is the textbook use of a **stack**. Push every opening bracket. For a closing bracket, the stack must not be empty and its top must be the matching opening bracket; pop it. If either check fails the string is invalid. At the end the string is valid only if the stack is empty (no opening bracket was left unclosed).`,
    pseudo: ['for each character c:', '  if c is ( [ {: push c', '  else: if stack is empty or top does not match c: print false; stop', '        pop', 'print true if the stack is empty, else false'],
    solution: {
      c: R`#include <stdio.h>
#include <string.h>

int main(void) {
    static char s[5000];
    scanf("%4999s", s);
    // <solve>
    char stack[5000];
    int top = -1;
    for (int i = 0; s[i]; i++) {
        char c = s[i];
        if (c == '(' || c == '[' || c == '{') stack[++top] = c;
        else {
            if (top < 0) { printf("false\n"); return 0; }
            char o = stack[top--];
            if ((c == ')' && o != '(') || (c == ']' && o != '[') || (c == '}' && o != '{')) { printf("false\n"); return 0; }
        }
    }
    printf(top == -1 ? "true\n" : "false\n");
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
    stack<char> st;
    for (char c : s) {
        if (c == '(' || c == '[' || c == '{') st.push(c);
        else {
            if (st.empty()) { cout << "false\n"; return 0; }
            char o = st.top(); st.pop();
            if ((c == ')' && o != '(') || (c == ']' && o != '[') || (c == '}' && o != '{')) { cout << "false\n"; return 0; }
        }
    }
    cout << (st.empty() ? "true" : "false") << "\n";
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
        Deque<Character> st = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            if (c == '(' || c == '[' || c == '{') st.push(c);
            else {
                if (st.isEmpty()) { System.out.println("false"); return; }
                char o = st.pop();
                if ((c == ')' && o != '(') || (c == ']' && o != '[') || (c == '}' && o != '{')) { System.out.println("false"); return; }
            }
        }
        System.out.println(st.isEmpty() ? "true" : "false");
        // </solve>
    }
}
`,
      py: R`import sys

s = sys.stdin.read().split()[0]
# <solve>
pairs = {")": "(", "]": "[", "}": "{"}
stack = []
ok = True
for c in s:
    if c in "([{":
        stack.append(c)
    elif not stack or stack.pop() != pairs[c]:
        ok = False
        break
print("true" if ok and not stack else "false")
# </solve>
`,
    },
  },
  {
    id: 'evaluate-rpn', title: 'Evaluate Reverse Polish Notation', module: 3, difficulty: 'Medium', tags: ['Stack', 'Expressions', 'PYQ'], source: 'LeetCode 150', link: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/',
    blurb: 'Evaluate a postfix expression with a stack.',
    statement: R`Evaluate an arithmetic expression written in **postfix** (reverse Polish) notation. The valid operators are \`+\`, \`-\`, \`*\` and \`/\`. Division between integers **truncates toward zero**. The expression is always valid and never divides by zero.`,
    format: R`**Input:** the number of tokens n, then the n tokens separated by spaces (operands may be negative, like \`-11\`).

**Output:** the value of the expression.`,
    constraints: '- 1 ≤ n ≤ 1000\n- every intermediate value fits in a 32-bit integer',
    examples: [{ in: '5\n2 1 + 3 *\n', out: '9\n', why: '(2 + 1) × 3 = 9.' }, { in: '5\n4 13 5 / +\n', out: '6\n', why: '13 / 5 = 2, and 4 + 2 = 6.' }],
    more: ['13\n10 6 9 3 + -11 * / * 17 + 5 +\n', '3\n7 -2 /\n', '3\n-7 2 /\n', '1\n42\n', '5\n3 4 - 5 *\n'],
    time: 'O(n)', space: 'O(n)',
    explain: R`Scan the tokens left to right. A number is pushed. An operator pops the **right operand first, then the left operand**, applies itself and pushes the result. After the last token the single value on the stack is the answer. Take care with the order of the operands for − and /, and with truncation: C, C++ and Java already truncate toward zero; in Python use sign-aware division instead of //.`,
    pseudo: ['for each token t:', '  if t is a number: push(t)', '  else: b = pop(); a = pop(); push(a t b)', 'print pop()'],
    solution: {
      c: R`#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(void) {
    int n;
    scanf("%d", &n);
    char tok[1000][16];
    for (int i = 0; i < n; i++) scanf("%15s", tok[i]);
    // <solve>
    long long st[1000];
    int top = -1;
    for (int i = 0; i < n; i++) {
        char *t = tok[i];
        if (strlen(t) == 1 && strchr("+-*/", t[0])) {
            long long b = st[top--], a = st[top--];
            st[++top] = t[0] == '+' ? a + b : t[0] == '-' ? a - b : t[0] == '*' ? a * b : a / b;
        } else st[++top] = atoll(t);
    }
    printf("%lld\n", st[top]);
    // </solve>
    return 0;
}
`,
      cpp: R`#include <iostream>
#include <stack>
#include <string>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<string> tok(n);
    for (auto &t : tok) cin >> t;
    // <solve>
    stack<long long> st;
    for (const string &t : tok) {
        if (t.size() == 1 && string("+-*/").find(t[0]) != string::npos) {
            long long b = st.top(); st.pop();
            long long a = st.top(); st.pop();
            st.push(t[0] == '+' ? a + b : t[0] == '-' ? a - b : t[0] == '*' ? a * b : a / b);
        } else st.push(stoll(t));
    }
    cout << st.top() << "\n";
    // </solve>
    return 0;
}
`,
      java: R`import java.util.*;

class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        String[] tok = new String[n];
        for (int i = 0; i < n; i++) tok[i] = in.next();
        // <solve>
        Deque<Long> st = new ArrayDeque<>();
        for (String t : tok) {
            if (t.length() == 1 && "+-*/".indexOf(t.charAt(0)) >= 0) {
                long b = st.pop(), a = st.pop();
                st.push(t.charAt(0) == '+' ? a + b : t.charAt(0) == '-' ? a - b : t.charAt(0) == '*' ? a * b : a / b);
            } else st.push(Long.parseLong(t));
        }
        System.out.println(st.pop());
        // </solve>
    }
}
`,
      py: R`import sys

data = sys.stdin.read().split()
n = int(data[0])
tok = data[1:1 + n]
# <solve>
st = []
for t in tok:
    if t in ("+", "-", "*", "/"):
        b, a = st.pop(), st.pop()
        if t == "+":
            st.append(a + b)
        elif t == "-":
            st.append(a - b)
        elif t == "*":
            st.append(a * b)
        else:
            q = abs(a) // abs(b)                       # truncate toward zero
            st.append(-q if (a < 0) != (b < 0) else q)
    else:
        st.append(int(t))
print(st.pop())
# </solve>
`,
    },
  },
  {
    id: 'min-stack', title: 'Min Stack', module: 3, difficulty: 'Medium', tags: ['Stack', 'Design'], source: 'LeetCode 155', link: 'https://leetcode.com/problems/min-stack/',
    blurb: 'A stack that also reports its minimum in O(1).',
    statement: R`Design a stack that supports \`push\`, \`pop\`, \`top\` and \`getMin\`, **all in O(1) time**. \`getMin\` returns the smallest value currently in the stack.

You are given a list of operations. Print the result of every \`top\` and \`getMin\` operation, one per line. \`pop\`, \`top\` and \`getMin\` are only used on a non-empty stack.`,
    format: R`**Input:** q, the number of operations, then q lines each being \`push x\`, \`pop\`, \`top\` or \`getMin\`.

**Output:** one line for each \`top\` and \`getMin\`.`,
    constraints: '- 1 ≤ q ≤ 1000',
    examples: [{ in: '7\npush -2\npush 0\npush -3\ngetMin\npop\ntop\ngetMin\n', out: '-3\n0\n-2\n', why: 'The minimum is −3; after pop the top is 0 and the minimum is −2.' }, { in: '3\npush 5\ntop\ngetMin\n', out: '5\n5\n', why: 'One element is both top and minimum.' }],
    more: ['6\npush 3\npush 3\ngetMin\npop\ngetMin\ntop\n', '8\npush 5\npush 4\npush 3\npush 2\ngetMin\npop\npop\ngetMin\n', '5\npush -1\npush -1\npop\ngetMin\ntop\n', '4\npush 10\npush 20\ngetMin\ntop\n'],
    time: 'O(1) per operation', space: 'O(n)',
    explain: R`Scanning for the minimum would cost O(n). Instead, store with every element **the minimum of everything below it and itself**. Keep a second stack of minimums (or store pairs): when pushing x, the new minimum is min(x, current minimum); when popping, discard both. Then \`getMin\` just reads the top of the minimum stack. Equal values are fine because each push records its own minimum.`,
    pseudo: ['push(x): stack.push(x); mins.push(min(x, mins.top if any))', 'pop(): stack.pop(); mins.pop()', 'top(): return stack.top', 'getMin(): return mins.top'],
    solution: {
      c: R`#include <stdio.h>
#include <string.h>

int main(void) {
    int q;
    scanf("%d", &q);
    // <solve>
    int stack[1000], mins[1000], top = -1;
    for (int i = 0; i < q; i++) {
        char op[16];
        scanf("%15s", op);
        if (strcmp(op, "push") == 0) {
            int x;
            scanf("%d", &x);
            stack[++top] = x;
            mins[top] = (top == 0 || x < mins[top - 1]) ? x : mins[top - 1];
        } else if (strcmp(op, "pop") == 0) top--;
        else if (strcmp(op, "top") == 0) printf("%d\n", stack[top]);
        else printf("%d\n", mins[top]);
    }
    // </solve>
    return 0;
}
`,
      cpp: R`#include <algorithm>
#include <iostream>
#include <stack>
#include <string>
using namespace std;

int main() {
    int q;
    cin >> q;
    // <solve>
    stack<int> st, mins;
    for (int i = 0; i < q; i++) {
        string op;
        cin >> op;
        if (op == "push") {
            int x;
            cin >> x;
            st.push(x);
            mins.push(mins.empty() ? x : min(x, mins.top()));
        } else if (op == "pop") { st.pop(); mins.pop(); }
        else if (op == "top") cout << st.top() << "\n";
        else cout << mins.top() << "\n";
    }
    // </solve>
    return 0;
}
`,
      java: R`import java.util.*;

class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int q = in.nextInt();
        // <solve>
        Deque<Integer> st = new ArrayDeque<>(), mins = new ArrayDeque<>();
        StringBuilder out = new StringBuilder();
        for (int i = 0; i < q; i++) {
            String op = in.next();
            if (op.equals("push")) {
                int x = in.nextInt();
                st.push(x);
                mins.push(mins.isEmpty() ? x : Math.min(x, mins.peek()));
            } else if (op.equals("pop")) { st.pop(); mins.pop(); }
            else if (op.equals("top")) out.append(st.peek()).append("\n");
            else out.append(mins.peek()).append("\n");
        }
        System.out.print(out);
        // </solve>
    }
}
`,
      py: R`import sys

data = sys.stdin.read().split()
q = int(data[0])
pos = 1
# <solve>
stack, mins = [], []
for _ in range(q):
    op = data[pos]
    pos += 1
    if op == "push":
        x = int(data[pos])
        pos += 1
        stack.append(x)
        mins.append(x if not mins else min(x, mins[-1]))
    elif op == "pop":
        stack.pop()
        mins.pop()
    elif op == "top":
        print(stack[-1])
    else:
        print(mins[-1])
# </solve>
`,
    },
  },
  {
    id: 'daily-temperatures', title: 'Daily Temperatures (Next Greater Element)', module: 3, difficulty: 'Medium', tags: ['Stack', 'Monotonic stack'], source: 'LeetCode 739', link: 'https://leetcode.com/problems/daily-temperatures/',
    blurb: 'For each day, how long until a warmer day? A monotonic stack does it in O(n).',
    statement: R`Given the temperature of each day, print for every day **how many days you must wait until a warmer temperature**. If no later day is warmer, print 0 for that day.`,
    format: R`**Input:** n, then n temperatures.

**Output:** n integers separated by spaces.`,
    constraints: '- 1 ≤ n ≤ 1000',
    examples: [{ in: '8\n73 74 75 71 69 72 76 73\n', out: '1 1 4 2 1 1 0 0\n', why: 'Day 2 (75) waits 4 days for 76; the last two days never see a warmer day.' }, { in: '4\n30 40 50 60\n', out: '1 1 1 0\n', why: 'Each day is followed by a warmer one.' }],
    more: ['3\n30 60 90\n', '5\n5 5 5 5 5\n', '6\n90 80 70 60 50 40\n', '1\n10\n', '7\n55 38 53 81 61 93 97\n'],
    time: 'O(n)', space: 'O(n)',
    explain: R`Checking all later days for each day is O(n²). Use a **stack of indices** whose temperatures are in decreasing order (days still waiting for a warmer day). For each new day i, while the stack is not empty and the temperature at its top is lower than today's, that waiting day has found its answer: i − top. Pop it. Then push i. Every index is pushed and popped once, so the total work is O(n).`,
    pseudo: ['stack = empty (indices); ans = [0, ..., 0]', 'for i = 0 to n - 1:', '  while stack not empty and t[top] < t[i]:', '    ans[top] = i - top; pop', '  push i', 'print ans'],
    solution: {
      c: R`#include <stdio.h>

int main(void) {
    int n, t[1000];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &t[i]);
    // <solve>
    int stack[1000], top = -1, ans[1000] = {0};
    for (int i = 0; i < n; i++) {
        while (top >= 0 && t[stack[top]] < t[i]) {
            ans[stack[top]] = i - stack[top];
            top--;
        }
        stack[++top] = i;
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
    vector<int> t(n);
    for (int &x : t) cin >> x;
    // <solve>
    vector<int> ans(n, 0);
    stack<int> st;
    for (int i = 0; i < n; i++) {
        while (!st.empty() && t[st.top()] < t[i]) {
            ans[st.top()] = i - st.top();
            st.pop();
        }
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
        int[] t = new int[n];
        for (int i = 0; i < n; i++) t[i] = in.nextInt();
        // <solve>
        int[] ans = new int[n];
        Deque<Integer> st = new ArrayDeque<>();
        for (int i = 0; i < n; i++) {
            while (!st.isEmpty() && t[st.peek()] < t[i]) {
                int j = st.pop();
                ans[j] = i - j;
            }
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
t = list(map(int, data[1:1 + n]))
# <solve>
ans = [0] * n
stack = []
for i, x in enumerate(t):
    while stack and t[stack[-1]] < x:
        j = stack.pop()
        ans[j] = i - j
    stack.append(i)
print(*ans)
# </solve>
`,
    },
  },
  {
    id: 'sliding-window-maximum', title: 'Sliding Window Maximum', module: 3, difficulty: 'Hard', tags: ['Deque', 'Queue'], source: 'LeetCode 239', link: 'https://leetcode.com/problems/sliding-window-maximum/',
    blurb: 'The maximum of every window of size k, in O(n), with a double-ended queue.',
    statement: R`A window of size k slides from the left end of the array to the right end, one position at a time. Print the **maximum of each window**.`,
    format: R`**Input:** n and k on the first line, then n integers.

**Output:** the n − k + 1 window maxima, separated by spaces.`,
    constraints: '- 1 ≤ k ≤ n ≤ 1000',
    examples: [{ in: '8 3\n1 3 -1 -3 5 3 6 7\n', out: '3 3 5 5 6 7\n', why: 'Windows: [1 3 −1] → 3, [3 −1 −3] → 3, [−1 −3 5] → 5, [−3 5 3] → 5, [5 3 6] → 6, [3 6 7] → 7.' }, { in: '1 1\n1\n', out: '1\n', why: 'A single window.' }],
    more: ['5 5\n4 2 12 3 8\n', '6 1\n9 8 7 6 5 4\n', '7 3\n1 2 3 4 5 6 7\n', '7 3\n7 6 5 4 3 2 1\n', '8 4\n-5 -2 -9 -1 -7 -3 -8 -4\n'],
    time: 'O(n)', space: 'O(k)',
    explain: R`Rescanning every window costs O(n·k). Keep a **deque of indices** whose values are in decreasing order, so the front is always the maximum of the current window. For each new index i: (1) drop from the back every index whose value is ≤ a[i], because it can never be a maximum while a[i] is in the window; (2) push i at the back; (3) if the front index has slid out of the window (≤ i − k), drop it from the front; (4) once i ≥ k − 1, the front is the window's maximum. Each index enters and leaves the deque once, so the total time is O(n).`,
    pseudo: ['dq = empty deque of indices', 'for i = 0 to n - 1:', '  while dq not empty and a[dq.back] <= a[i]: dq.pop_back()', '  dq.push_back(i)', '  if dq.front <= i - k: dq.pop_front()', '  if i >= k - 1: output a[dq.front]'],
    solution: {
      c: R`#include <stdio.h>

int main(void) {
    int n, k, a[1000];
    scanf("%d %d", &n, &k);
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    // <solve>
    int dq[1000], head = 0, tail = 0;               /* dq[head..tail-1] holds indices */
    int first = 1;
    for (int i = 0; i < n; i++) {
        while (tail > head && a[dq[tail - 1]] <= a[i]) tail--;
        dq[tail++] = i;
        if (dq[head] <= i - k) head++;
        if (i >= k - 1) { printf(first ? "%d" : " %d", a[dq[head]]); first = 0; }
    }
    printf("\n");
    // </solve>
    return 0;
}
`,
      cpp: R`#include <deque>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n, k;
    cin >> n >> k;
    vector<int> a(n);
    for (int &x : a) cin >> x;
    // <solve>
    deque<int> dq;                                  // indices, values decreasing
    bool first = true;
    for (int i = 0; i < n; i++) {
        while (!dq.empty() && a[dq.back()] <= a[i]) dq.pop_back();
        dq.push_back(i);
        if (dq.front() <= i - k) dq.pop_front();
        if (i >= k - 1) { cout << (first ? "" : " ") << a[dq.front()]; first = false; }
    }
    cout << "\n";
    // </solve>
    return 0;
}
`,
      java: R`import java.util.*;

class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt(), k = in.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = in.nextInt();
        // <solve>
        Deque<Integer> dq = new ArrayDeque<>();     // indices, values decreasing
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) {
            while (!dq.isEmpty() && a[dq.peekLast()] <= a[i]) dq.pollLast();
            dq.addLast(i);
            if (dq.peekFirst() <= i - k) dq.pollFirst();
            if (i >= k - 1) sb.append(sb.length() > 0 ? " " : "").append(a[dq.peekFirst()]);
        }
        System.out.println(sb);
        // </solve>
    }
}
`,
      py: R`import sys
from collections import deque

data = sys.stdin.read().split()
n, k = int(data[0]), int(data[1])
a = list(map(int, data[2:2 + n]))
# <solve>
dq = deque()                                   # indices, values decreasing
out = []
for i, x in enumerate(a):
    while dq and a[dq[-1]] <= x:
        dq.pop()
    dq.append(i)
    if dq[0] <= i - k:
        dq.popleft()
    if i >= k - 1:
        out.append(a[dq[0]])
print(*out)
# </solve>
`,
    },
  },
];
