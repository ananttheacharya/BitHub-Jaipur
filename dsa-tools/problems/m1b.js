/* Module I problems, second set: arrays and recursion. */
const R = String.raw;
module.exports = [
  {
    id: 'best-time-to-buy-sell-stock', title: 'Best Time to Buy and Sell Stock', module: 1, difficulty: 'Easy', tags: ['Array', 'One pass'], source: 'LeetCode 121', link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
    blurb: 'One buy and one later sell: the largest profit in a single pass.',
    statement: R`You are given the price of a stock on each of n days. Choose **one day to buy** and a **later day to sell**. Print the maximum profit, or \`0\` if no profit is possible.`,
    format: R`**Input:** n, then n prices.

**Output:** the maximum profit.`,
    constraints: '- 1 ≤ n ≤ 1000\n- 0 ≤ price ≤ 10000',
    examples: [{ in: '6\n7 1 5 3 6 4\n', out: '5\n', why: 'Buy at 1, sell at 6.' }, { in: '5\n7 6 4 3 1\n', out: '0\n', why: 'Prices only fall.' }],
    more: ['1\n5\n', '2\n1 2\n', '4\n2 4 1 7\n', '7\n3 3 5 0 0 3 1\n', '5\n1 2 3 4 5\n'],
    time: 'O(n)', space: 'O(1)',
    explain: R`Checking every (buy, sell) pair is O(n²). Instead scan once, remembering the **lowest price seen so far**. Selling today would earn \`price − lowest\`, so keep the best such value. Each day is looked at once.`,
    pseudo: ['lowest = infinity; best = 0', 'for each price p:', '  lowest = min(lowest, p)', '  best = max(best, p - lowest)', 'print best'],
    solution: {
      c: R`#include <stdio.h>

int main(void) {
    int n, a[1000];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    // <solve>
    int lowest = a[0], best = 0;
    for (int i = 1; i < n; i++) {
        if (a[i] < lowest) lowest = a[i];
        if (a[i] - lowest > best) best = a[i] - lowest;
    }
    printf("%d\n", best);
    // </solve>
    return 0;
}
`,
      cpp: R`#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    for (int &x : a) cin >> x;
    // <solve>
    int lowest = a[0], best = 0;
    for (int i = 1; i < n; i++) {
        lowest = min(lowest, a[i]);
        best = max(best, a[i] - lowest);
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
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = in.nextInt();
        // <solve>
        int lowest = a[0], best = 0;
        for (int i = 1; i < n; i++) {
            lowest = Math.min(lowest, a[i]);
            best = Math.max(best, a[i] - lowest);
        }
        System.out.println(best);
        // </solve>
    }
}
`,
      py: R`import sys

data = sys.stdin.read().split()
n = int(data[0])
a = [int(x) for x in data[1:1 + n]]
# <solve>
lowest, best = a[0], 0
for p in a[1:]:
    lowest = min(lowest, p)
    best = max(best, p - lowest)
print(best)
# </solve>
`,
    },
  },
  {
    id: 'product-except-self', title: 'Product of Array Except Self', module: 1, difficulty: 'Medium', tags: ['Array', 'Prefix product'], source: 'LeetCode 238', link: 'https://leetcode.com/problems/product-of-array-except-self/',
    blurb: 'For every position, the product of all the other elements, without dividing.',
    statement: R`Given an array \`a\` of n integers, print an array \`out\` where \`out[i]\` is the **product of all elements except a[i]**. Do it **without using division**, in O(n) time. All products fit in a 32-bit integer.`,
    format: R`**Input:** n, then n integers.

**Output:** the n products, separated by spaces.`,
    constraints: '- 2 ≤ n ≤ 15\n- −3 ≤ a[i] ≤ 3',
    examples: [{ in: '4\n1 2 3 4\n', out: '24 12 8 6\n', why: 'For index 0: 2 × 3 × 4 = 24.' }, { in: '5\n-1 1 0 -3 3\n', out: '0 0 9 0 0\n', why: 'With a zero present, every product except the zero\'s own is 0.' }],
    more: ['2\n5 7\n', '3\n0 0 2\n', '4\n-2 -2 -2 -2\n', '6\n1 1 1 1 1 1\n', '5\n3 -3 2 1 -2\n'],
    time: 'O(n)', space: 'O(1) extra',
    explain: R`The product of everything except a[i] is (product of the elements **left** of i) × (product of the elements **right** of i). A first pass fills \`out[i]\` with the left products; a second pass from the right multiplies in the running right product. Division is avoided, so zeros cause no trouble.`,
    pseudo: ['out[0] = 1; for i = 1..n-1: out[i] = out[i-1] * a[i-1]      (left products)', 'right = 1', 'for i = n-1 down to 0:', '  out[i] = out[i] * right', '  right = right * a[i]'],
    solution: {
      c: R`#include <stdio.h>

int main(void) {
    int n, a[100];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    // <solve>
    long long out[100], right = 1;
    out[0] = 1;
    for (int i = 1; i < n; i++) out[i] = out[i - 1] * a[i - 1];
    for (int i = n - 1; i >= 0; i--) { out[i] *= right; right *= a[i]; }
    for (int i = 0; i < n; i++) printf(i ? " %lld" : "%lld", out[i]);
    printf("\n");
    // </solve>
    return 0;
}
`,
      cpp: R`#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    for (int &x : a) cin >> x;
    // <solve>
    vector<long long> out(n, 1);
    for (int i = 1; i < n; i++) out[i] = out[i - 1] * a[i - 1];
    long long right = 1;
    for (int i = n - 1; i >= 0; i--) { out[i] *= right; right *= a[i]; }
    for (int i = 0; i < n; i++) cout << (i ? " " : "") << out[i];
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
        long[] out = new long[n];
        out[0] = 1;
        for (int i = 1; i < n; i++) out[i] = out[i - 1] * a[i - 1];
        long right = 1;
        for (int i = n - 1; i >= 0; i--) { out[i] *= right; right *= a[i]; }
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) sb.append(i > 0 ? " " : "").append(out[i]);
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
out = [1] * n
for i in range(1, n):
    out[i] = out[i - 1] * a[i - 1]
right = 1
for i in range(n - 1, -1, -1):
    out[i] *= right
    right *= a[i]
print(*out)
# </solve>
`,
    },
  },
  {
    id: 'move-zeroes', title: 'Move Zeroes', module: 1, difficulty: 'Easy', tags: ['Array', 'Two pointers'], source: 'LeetCode 283', link: 'https://leetcode.com/problems/move-zeroes/',
    blurb: 'Push all zeros to the end in place, keeping the order of the other elements.',
    statement: R`Move all \`0\`s of an array to its end while keeping the **relative order of the non-zero elements**. Do it **in place** with one pass, and print the resulting array.`,
    format: R`**Input:** n, then n integers.

**Output:** the rearranged array, separated by spaces.`,
    constraints: '- 1 ≤ n ≤ 1000',
    examples: [{ in: '5\n0 1 0 3 12\n', out: '1 3 12 0 0\n', why: 'The non-zero values keep their order: 1, 3, 12.' }, { in: '1\n0\n', out: '0\n', why: 'Nothing to move.' }],
    more: ['4\n1 2 3 4\n', '4\n0 0 0 5\n', '6\n4 0 5 0 0 6\n', '3\n0 0 0\n', '7\n-1 0 -2 0 3 0 4\n'],
    time: 'O(n)', space: 'O(1)',
    explain: R`Keep a **write index** \`w\` for the next position of a non-zero value. Scan once; whenever \`a[i]\` is non-zero, swap it into \`a[w]\` and advance \`w\`. All the zeros are left behind, after the write index, and the non-zero values never change their relative order. This is the partition step of quick sort with the test "is non-zero".`,
    pseudo: ['w = 0', 'for i = 0 to n - 1:', '  if a[i] != 0:', '    swap a[i], a[w]', '    w = w + 1', 'print a'],
    solution: {
      c: R`#include <stdio.h>

int main(void) {
    int n, a[1000];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    // <solve>
    int w = 0;
    for (int i = 0; i < n; i++)
        if (a[i] != 0) { int t = a[i]; a[i] = a[w]; a[w] = t; w++; }
    for (int i = 0; i < n; i++) printf(i ? " %d" : "%d", a[i]);
    printf("\n");
    // </solve>
    return 0;
}
`,
      cpp: R`#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    for (int &x : a) cin >> x;
    // <solve>
    int w = 0;
    for (int i = 0; i < n; i++)
        if (a[i] != 0) swap(a[i], a[w++]);
    for (int i = 0; i < n; i++) cout << (i ? " " : "") << a[i];
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
        int w = 0;
        for (int i = 0; i < n; i++)
            if (a[i] != 0) { int t = a[i]; a[i] = a[w]; a[w] = t; w++; }
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) sb.append(i > 0 ? " " : "").append(a[i]);
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
w = 0
for i in range(n):
    if a[i] != 0:
        a[i], a[w] = a[w], a[i]
        w += 1
print(*a)
# </solve>
`,
    },
  },
  {
    id: 'climbing-stairs', title: 'Climbing Stairs', module: 1, difficulty: 'Easy', tags: ['Recursion', 'Dynamic programming'], source: 'LeetCode 70', link: 'https://leetcode.com/problems/climbing-stairs/',
    blurb: 'Count the ways to climb n steps taking 1 or 2 at a time: a recurrence in disguise.',
    statement: R`You climb a staircase of \`n\` steps, taking **1 or 2 steps** at a time. Print the number of distinct ways to reach the top.`,
    format: R`**Input:** n.

**Output:** the number of ways.`,
    constraints: '- 1 ≤ n ≤ 40',
    examples: [{ in: '2\n', out: '2\n', why: '1+1 or 2.' }, { in: '4\n', out: '5\n', why: '1+1+1+1, 1+1+2, 1+2+1, 2+1+1, 2+2.' }],
    more: ['1\n', '3\n', '5\n', '10\n', '20\n', '40\n'],
    time: 'O(n)', space: 'O(1)',
    explain: R`The last move was either a 1-step from stair n − 1 or a 2-step from stair n − 2, so **ways(n) = ways(n − 1) + ways(n − 2)**: the Fibonacci recurrence. The plain recursion recomputes the same values and takes O(2ⁿ); remembering only the last two values gives O(n) time and O(1) space.`,
    pseudo: ['a = 1 (ways to reach step 0), b = 1 (step 1)', 'for i = 2 to n:', '  c = a + b; a = b; b = c', 'print b'],
    solution: {
      c: R`#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);
    // <solve>
    long long a = 1, b = 1;
    for (int i = 2; i <= n; i++) { long long c = a + b; a = b; b = c; }
    printf("%lld\n", b);
    // </solve>
    return 0;
}
`,
      cpp: R`#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    // <solve>
    long long a = 1, b = 1;
    for (int i = 2; i <= n; i++) { long long c = a + b; a = b; b = c; }
    cout << b << "\n";
    // </solve>
    return 0;
}
`,
      java: R`import java.util.*;

class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        // <solve>
        long a = 1, b = 1;
        for (int i = 2; i <= n; i++) { long c = a + b; a = b; b = c; }
        System.out.println(b);
        // </solve>
    }
}
`,
      py: R`n = int(input())
# <solve>
a, b = 1, 1
for _ in range(2, n + 1):
    a, b = b, a + b
print(b)
# </solve>
`,
    },
  },
];
