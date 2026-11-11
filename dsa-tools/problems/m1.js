/* Module I problems: arrays and recursion. Everything before the `<solve>` marker reads the input;
 * the region inside the markers is what the student writes. */
const R = String.raw;
module.exports = [
  {
    id: 'two-sum', title: 'Two Sum', module: 1, difficulty: 'Easy', tags: ['Array', 'Hashing'], source: 'LeetCode 1', link: 'https://leetcode.com/problems/two-sum/',
    blurb: 'Find the two numbers in an array that add up to a target.',
    statement: R`Given an array of integers and a target, find the two elements whose sum equals the target and print their indices.

Exactly one pair of different positions has that sum, and you may not use the same element twice.`,
    format: R`**Input:** n on the first line, then n integers, then the target.

**Output:** the two indices **i j** with i < j, separated by a space.`,
    constraints: '- 2 ≤ n ≤ 1000\n- exactly one valid pair exists',
    examples: [{ in: '4\n2 7 11 15\n9\n', out: '0 1\n', why: 'a[0] + a[1] = 2 + 7 = 9.' }, { in: '3\n3 2 4\n6\n', out: '1 2\n', why: '2 + 4 = 6. The first 3 cannot be used twice.' }],
    more: ['2\n3 3\n6\n', '5\n-3 4 3 90 12\n0\n', '6\n1 5 9 14 20 33\n47\n', '7\n10 20 30 40 50 60 70\n130\n', '4\n-10 -5 7 12\n7\n'],
    time: 'O(n)', space: 'O(n)',
    explain: R`Checking every pair is O(n²). Instead, remember the numbers already seen in a **hash table** that maps each value to its index. For each element x, the partner we need is target − x; if it is already in the table the pair is found, otherwise store x and move on. One pass, O(n) time and O(n) space.`,
    pseudo: ['seen = empty hash table', 'for i = 0 to n - 1:', '  need = target - a[i]', '  if need is in seen: print seen[need], i; stop', '  seen[a[i]] = i'],
    solution: {
      c: R`#include <stdio.h>

int main(void) {
    int n, a[1000], target;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    scanf("%d", &target);
    // <solve>
    static int keys[4096], idx[4096], used[4096];       /* a tiny open-addressing hash table */
    for (int i = 0; i < n; i++) {
        int need = target - a[i], h = ((need % 4096) + 4096) % 4096;
        while (used[h]) {
            if (keys[h] == need) { printf("%d %d\n", idx[h], i); return 0; }
            h = (h + 1) % 4096;
        }
        h = ((a[i] % 4096) + 4096) % 4096;
        while (used[h]) h = (h + 1) % 4096;
        used[h] = 1; keys[h] = a[i]; idx[h] = i;
    }
    // </solve>
    return 0;
}
`,
      cpp: R`#include <iostream>
#include <unordered_map>
#include <vector>
using namespace std;

int main() {
    int n, target;
    cin >> n;
    vector<int> a(n);
    for (int &x : a) cin >> x;
    cin >> target;
    // <solve>
    unordered_map<int, int> seen;                        // value -> index
    for (int i = 0; i < n; i++) {
        auto it = seen.find(target - a[i]);
        if (it != seen.end()) { cout << it->second << " " << i << "\n"; return 0; }
        seen[a[i]] = i;
    }
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
        int target = in.nextInt();
        // <solve>
        Map<Integer, Integer> seen = new HashMap<>();    // value -> index
        for (int i = 0; i < n; i++) {
            Integer j = seen.get(target - a[i]);
            if (j != null) { System.out.println(j + " " + i); return; }
            seen.put(a[i], i);
        }
        // </solve>
    }
}
`,
      py: R`import sys

data = sys.stdin.read().split()
n = int(data[0])
a = list(map(int, data[1:1 + n]))
target = int(data[1 + n])
# <solve>
seen = {}                                   # value -> index
for i, x in enumerate(a):
    if target - x in seen:
        print(seen[target - x], i)
        break
    seen[x] = i
# </solve>
`,
    },
  },
  {
    id: 'remove-duplicates', title: 'Remove Duplicates from a Sorted Array', module: 1, difficulty: 'Easy', tags: ['Array', 'Two pointers'], source: 'LeetCode 26', link: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/',
    blurb: 'Compact a sorted array so every value appears once, in place.',
    statement: R`A sorted array may contain repeated values. Remove the duplicates **in place** (using O(1) extra memory) so that each value appears only once, keeping the order. Print how many distinct values there are, then the compacted array.`,
    format: R`**Input:** n, then n integers in non-decreasing order.

**Output:** the first line is the number k of distinct values. The second line holds those k values.`,
    constraints: '- 1 ≤ n ≤ 1000\n- the array is sorted in non-decreasing order',
    examples: [{ in: '3\n1 1 2\n', out: '2\n1 2\n', why: 'The two 1s collapse into one.' }, { in: '10\n0 0 1 1 1 2 2 3 3 4\n', out: '5\n0 1 2 3 4\n', why: 'Five distinct values.' }],
    more: ['1\n5\n', '4\n7 7 7 7\n', '5\n1 2 3 4 5\n', '6\n-3 -3 -1 0 0 8\n', '8\n2 2 2 3 3 5 5 5\n'],
    time: 'O(n)', space: 'O(1)',
    explain: R`Because the array is sorted, equal values sit next to each other. Keep a **write pointer** k that marks the end of the distinct prefix. Scan i from 1: whenever a[i] differs from the last kept value a[k − 1], copy it to a[k] and advance k. Each element is looked at once, and nothing extra is stored.`,
    pseudo: ['k = 1', 'for i = 1 to n - 1:', '  if a[i] != a[k - 1]: a[k] = a[i]; k = k + 1', 'print k, then a[0..k-1]'],
    solution: {
      c: R`#include <stdio.h>

int main(void) {
    int n, a[1000];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    // <solve>
    int k = 1;
    for (int i = 1; i < n; i++)
        if (a[i] != a[k - 1]) a[k++] = a[i];
    printf("%d\n", k);
    for (int i = 0; i < k; i++) printf(i ? " %d" : "%d", a[i]);
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
    int k = 1;
    for (int i = 1; i < n; i++)
        if (a[i] != a[k - 1]) a[k++] = a[i];
    cout << k << "\n";
    for (int i = 0; i < k; i++) cout << (i ? " " : "") << a[i];
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
        int k = 1;
        for (int i = 1; i < n; i++)
            if (a[i] != a[k - 1]) a[k++] = a[i];
        System.out.println(k);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < k; i++) sb.append(i > 0 ? " " : "").append(a[i]);
        System.out.println(sb);
        // </solve>
    }
}
`,
      py: R`import sys

data = sys.stdin.read().split()
n = int(data[0])
a = list(map(int, data[1:1 + n]))
# <solve>
k = 1
for i in range(1, n):
    if a[i] != a[k - 1]:
        a[k] = a[i]
        k += 1
print(k)
print(*a[:k])
# </solve>
`,
    },
  },
  {
    id: 'rotate-array', title: 'Rotate Array', module: 1, difficulty: 'Medium', tags: ['Array', 'Two pointers'], source: 'LeetCode 189', link: 'https://leetcode.com/problems/rotate-array/',
    blurb: 'Rotate an array to the right by k places in O(1) extra space.',
    statement: R`Rotate the array to the **right** by k steps: every element moves k positions to the right and the last k elements wrap around to the front. k may be larger than n.`,
    format: R`**Input:** n and k on the first line, then n integers.

**Output:** the rotated array on one line.`,
    constraints: '- 1 ≤ n ≤ 1000\n- 0 ≤ k ≤ 10⁹',
    examples: [{ in: '7 3\n1 2 3 4 5 6 7\n', out: '5 6 7 1 2 3 4\n', why: 'The last three elements (5 6 7) move to the front.' }, { in: '4 2\n-1 -100 3 99\n', out: '3 99 -1 -100\n', why: 'Rotating twice moves 3 99 to the front.' }],
    more: ['1 5\n9\n', '5 0\n1 2 3 4 5\n', '5 5\n1 2 3 4 5\n', '6 8\n10 20 30 40 50 60\n', '3 1000000000\n1 2 3\n'],
    time: 'O(n)', space: 'O(1)',
    explain: R`First reduce k to k mod n (rotating n times changes nothing). Then use the **three reversals** trick: reverse the whole array, then reverse the first k elements, then reverse the remaining n − k. For 1 2 3 4 5 6 7 with k = 3: reverse all → 7 6 5 4 3 2 1; reverse the first 3 → 5 6 7 4 3 2 1; reverse the rest → 5 6 7 1 2 3 4. Each element moves a constant number of times: O(n) time, O(1) space.`,
    pseudo: ['k = k mod n', 'reverse(a, 0, n - 1)', 'reverse(a, 0, k - 1)', 'reverse(a, k, n - 1)'],
    solution: {
      c: R`#include <stdio.h>

void reverse(int a[], int i, int j) {
    while (i < j) { int t = a[i]; a[i] = a[j]; a[j] = t; i++; j--; }
}

int main(void) {
    int n, a[1000];
    long long k;
    scanf("%d %lld", &n, &k);
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    // <solve>
    k %= n;
    reverse(a, 0, n - 1);
    reverse(a, 0, (int)k - 1);
    reverse(a, (int)k, n - 1);
    for (int i = 0; i < n; i++) printf(i ? " %d" : "%d", a[i]);
    printf("\n");
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
    long long k;
    cin >> n >> k;
    vector<int> a(n);
    for (int &x : a) cin >> x;
    // <solve>
    k %= n;
    reverse(a.begin(), a.end());
    reverse(a.begin(), a.begin() + k);
    reverse(a.begin() + k, a.end());
    for (int i = 0; i < n; i++) cout << (i ? " " : "") << a[i];
    cout << "\n";
    // </solve>
    return 0;
}
`,
      java: R`import java.util.*;

class Main {
    static void reverse(int[] a, int i, int j) {
        while (i < j) { int t = a[i]; a[i] = a[j]; a[j] = t; i++; j--; }
    }

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        long k = in.nextLong();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = in.nextInt();
        // <solve>
        int s = (int) (k % n);
        reverse(a, 0, n - 1);
        reverse(a, 0, s - 1);
        reverse(a, s, n - 1);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) sb.append(i > 0 ? " " : "").append(a[i]);
        System.out.println(sb);
        // </solve>
    }
}
`,
      py: R`import sys

data = sys.stdin.read().split()
n, k = int(data[0]), int(data[1])
a = list(map(int, data[2:2 + n]))


def reverse(i, j):
    while i < j:
        a[i], a[j] = a[j], a[i]
        i += 1
        j -= 1


# <solve>
k %= n
reverse(0, n - 1)
reverse(0, k - 1)
reverse(k, n - 1)
print(*a)
# </solve>
`,
    },
  },
  {
    id: 'max-subarray', title: 'Maximum Subarray', module: 1, difficulty: 'Medium', tags: ['Array', 'Dynamic programming'], source: 'LeetCode 53', link: 'https://leetcode.com/problems/maximum-subarray/',
    blurb: 'Find the contiguous subarray with the largest sum (Kadane\'s algorithm).',
    statement: R`Given an array of integers (positive, negative or zero), find the contiguous non-empty subarray that has the largest sum and print that sum.`,
    format: R`**Input:** n, then n integers.

**Output:** the maximum subarray sum.`,
    constraints: '- 1 ≤ n ≤ 1000\n- −1000 ≤ a[i] ≤ 1000',
    examples: [{ in: '9\n-2 1 -3 4 -1 2 1 -5 4\n', out: '6\n', why: 'The subarray 4 −1 2 1 has sum 6.' }, { in: '1\n5\n', out: '5\n', why: 'A single element.' }],
    more: ['4\n-3 -1 -2 -8\n', '5\n5 4 -1 7 8\n', '3\n0 0 0\n', '6\n-1 2 3 -10 4 5\n', '2\n-5 10\n'],
    time: 'O(n)', space: 'O(1)',
    explain: R`Let best-ending-here be the largest sum of a subarray that ends at the current element. Either it extends the previous best (cur + a[i]) or it starts fresh at a[i], whichever is larger. The answer is the largest value of best-ending-here over all positions. This is **Kadane's algorithm**: a single pass, O(n) time and O(1) space. Start with the first element (not 0) so an all-negative array is handled correctly.`,
    pseudo: ['cur = best = a[0]', 'for i = 1 to n - 1:', '  cur = max(a[i], cur + a[i])', '  best = max(best, cur)', 'print best'],
    solution: {
      c: R`#include <stdio.h>

int main(void) {
    int n, a[1000];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    // <solve>
    int cur = a[0], best = a[0];
    for (int i = 1; i < n; i++) {
        cur = (a[i] > cur + a[i]) ? a[i] : cur + a[i];
        if (cur > best) best = cur;
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
    int cur = a[0], best = a[0];
    for (int i = 1; i < n; i++) {
        cur = max(a[i], cur + a[i]);
        best = max(best, cur);
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
        int cur = a[0], best = a[0];
        for (int i = 1; i < n; i++) {
            cur = Math.max(a[i], cur + a[i]);
            best = Math.max(best, cur);
        }
        System.out.println(best);
        // </solve>
    }
}
`,
      py: R`import sys

data = sys.stdin.read().split()
n = int(data[0])
a = list(map(int, data[1:1 + n]))
# <solve>
cur = best = a[0]
for x in a[1:]:
    cur = max(x, cur + x)
    best = max(best, cur)
print(best)
# </solve>
`,
    },
  },
  {
    id: 'power-mod', title: 'Fast Power (Recursion)', module: 1, difficulty: 'Medium', tags: ['Recursion', 'Divide and conquer'], source: 'Classic (cf. LeetCode 50)', link: 'https://leetcode.com/problems/powx-n/',
    blurb: 'Compute a^b mod m with recursion in O(log b) multiplications.',
    statement: R`Compute **a^b mod m** for large b. Multiplying a by itself b times is far too slow when b is a billion, so use recursion that halves the exponent each time.`,
    format: R`**Input:** three integers a, b and m on one line.

**Output:** a^b mod m.`,
    constraints: '- 0 ≤ a, b ≤ 10⁹\n- 1 ≤ m ≤ 10⁹ (so intermediate products fit in 64 bits)\n- a⁰ is 1, so the answer for b = 0 is 1 mod m',
    examples: [{ in: '2 10 1000\n', out: '24\n', why: '2¹⁰ = 1024 and 1024 mod 1000 = 24.' }, { in: '3 0 7\n', out: '1\n', why: 'Anything to the power 0 is 1.' }],
    more: ['5 3 13\n', '7 13 1\n', '2 62 1000000007\n', '999999999 999999999 1000000000\n', '0 5 9\n'],
    time: 'O(log b)', space: 'O(log b) recursion',
    explain: R`Use the identity a^b = (a^(b/2))² when b is even and a · (a^((b−1)/2))² when b is odd. Every call halves b, so only about log₂ b calls are made. Take the remainder after each multiplication so numbers stay small; with m ≤ 10⁹ a product is below 10¹⁸ and fits in a 64-bit integer. The recurrence T(b) = T(b/2) + 1 gives O(log b).`,
    pseudo: ['power(a, b, m):', '  if b == 0: return 1 mod m', '  half = power(a, b / 2, m)', '  result = half * half mod m', '  if b is odd: result = result * a mod m', '  return result'],
    solution: {
      c: R`#include <stdio.h>

long long power(long long a, long long b, long long m) {
    // <solve return 0;>
    if (b == 0) return 1 % m;
    long long half = power(a, b / 2, m);
    long long result = half * half % m;
    if (b % 2 == 1) result = result * (a % m) % m;
    return result;
    // </solve>
}

int main(void) {
    long long a, b, m;
    scanf("%lld %lld %lld", &a, &b, &m);
    printf("%lld\n", power(a, b, m));
    return 0;
}
`,
      cpp: R`#include <iostream>
using namespace std;

long long power(long long a, long long b, long long m) {
    // <solve return 0;>
    if (b == 0) return 1 % m;
    long long half = power(a, b / 2, m);
    long long result = half * half % m;
    if (b % 2 == 1) result = result * (a % m) % m;
    return result;
    // </solve>
}

int main() {
    long long a, b, m;
    cin >> a >> b >> m;
    cout << power(a, b, m) << "\n";
    return 0;
}
`,
      java: R`import java.util.*;

class Main {
    static long power(long a, long b, long m) {
        // <solve return 0;>
        if (b == 0) return 1 % m;
        long half = power(a, b / 2, m);
        long result = half * half % m;
        if (b % 2 == 1) result = result * (a % m) % m;
        return result;
        // </solve>
    }

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        long a = in.nextLong(), b = in.nextLong(), m = in.nextLong();
        System.out.println(power(a, b, m));
    }
}
`,
      py: R`import sys

sys.setrecursionlimit(10000)


def power(a, b, m):
    # <solve return 0>
    if b == 0:
        return 1 % m
    half = power(a, b // 2, m)
    result = half * half % m
    if b % 2 == 1:
        result = result * (a % m) % m
    return result
    # </solve>


a, b, m = map(int, sys.stdin.read().split())
print(power(a, b, m))
`,
    },
  },
];
