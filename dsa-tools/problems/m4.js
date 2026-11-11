/* Module IV problems: searching, sorting and hashing. */
const R = String.raw;
module.exports = [
  {
    id: 'binary-search', title: 'Binary Search', module: 4, difficulty: 'Easy', tags: ['Searching', 'Binary search'], source: 'LeetCode 704', link: 'https://leetcode.com/problems/binary-search/',
    blurb: 'Find a value in a sorted array in O(log n).',
    statement: R`Given an array sorted in increasing order (all values distinct) and a target value, print the **index** of the target, or **−1** if it is not in the array. Your algorithm must run in O(log n) time.`,
    format: R`**Input:** n, then the n sorted integers, then the target.

**Output:** the index of the target or −1.`,
    constraints: '- 1 ≤ n ≤ 1000\n- the values are distinct and sorted in increasing order',
    examples: [{ in: '6\n-1 0 3 5 9 12\n9\n', out: '4\n', why: '9 is at index 4.' }, { in: '6\n-1 0 3 5 9 12\n2\n', out: '-1\n', why: '2 is not in the array.' }],
    more: ['1\n5\n5\n', '1\n5\n3\n', '5\n1 3 5 7 9\n1\n', '5\n1 3 5 7 9\n9\n', '8\n2 4 6 8 10 12 14 16\n10\n', '4\n-20 -10 0 10\n-5\n'],
    time: 'O(log n)', space: 'O(1)',
    explain: R`Keep a range [low, high] that must contain the target if it is present. Look at the middle element: if it is the target we are done; if it is smaller than the target the target can only be to the right, so low = mid + 1; otherwise high = mid − 1. The range halves every step, so at most ⌊log₂ n⌋ + 1 steps are needed. Compute the middle as \`low + (high − low) / 2\` to avoid overflow.`,
    pseudo: ['low = 0; high = n - 1', 'while low <= high:', '  mid = low + (high - low) / 2', '  if a[mid] == target: print mid; stop', '  if a[mid] < target: low = mid + 1 else high = mid - 1', 'print -1'],
    solution: {
      c: R`#include <stdio.h>

int main(void) {
    int n, a[1000], target;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    scanf("%d", &target);
    // <solve>
    int low = 0, high = n - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (a[mid] == target) { printf("%d\n", mid); return 0; }
        if (a[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    printf("-1\n");
    // </solve>
    return 0;
}
`,
      cpp: R`#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n, target;
    cin >> n;
    vector<int> a(n);
    for (int &x : a) cin >> x;
    cin >> target;
    // <solve>
    int low = 0, high = n - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (a[mid] == target) { cout << mid << "\n"; return 0; }
        if (a[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    cout << -1 << "\n";
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
        int low = 0, high = n - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (a[mid] == target) { System.out.println(mid); return; }
            if (a[mid] < target) low = mid + 1;
            else high = mid - 1;
        }
        System.out.println(-1);
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
low, high = 0, n - 1
ans = -1
while low <= high:
    mid = low + (high - low) // 2
    if a[mid] == target:
        ans = mid
        break
    if a[mid] < target:
        low = mid + 1
    else:
        high = mid - 1
print(ans)
# </solve>
`,
    },
  },
  {
    id: 'search-rotated', title: 'Search in a Rotated Sorted Array', module: 4, difficulty: 'Medium', tags: ['Searching', 'Binary search'], source: 'LeetCode 33', link: 'https://leetcode.com/problems/search-in-rotated-sorted-array/',
    blurb: 'Binary search still works after a sorted array has been rotated.',
    statement: R`A sorted array of distinct values was **rotated** at an unknown position, so for example 0 1 2 4 5 6 7 became 4 5 6 7 0 1 2. Given this array and a target, print the target's index or −1 if it is absent, in O(log n) time.`,
    format: R`**Input:** n, then the n integers of the rotated array, then the target.

**Output:** the index or −1.`,
    constraints: '- 1 ≤ n ≤ 1000\n- all values are distinct',
    examples: [{ in: '7\n4 5 6 7 0 1 2\n0\n', out: '4\n', why: '0 is at index 4.' }, { in: '7\n4 5 6 7 0 1 2\n3\n', out: '-1\n', why: '3 is not present.' }],
    more: ['1\n1\n1\n', '2\n3 1\n1\n', '5\n1 2 3 4 5\n4\n', '6\n6 7 8 1 2 3\n8\n', '6\n6 7 8 1 2 3\n6\n', '8\n5 6 7 8 9 1 2 3\n9\n'],
    time: 'O(log n)', space: 'O(1)',
    explain: R`After a rotation, at least **one half** around the middle is still sorted. Compare a[low] with a[mid]: if a[low] ≤ a[mid] the left half [low..mid] is sorted, otherwise the right half [mid..high] is. Check whether the target lies inside the sorted half (using its two end values); if so search that half, otherwise search the other half. Each step discards half of the range, so the search takes O(log n).`,
    pseudo: ['low = 0; high = n - 1', 'while low <= high:', '  mid = (low + high) / 2; if a[mid] == target: return mid', '  if a[low] <= a[mid]:                       // left half is sorted', '    if a[low] <= target < a[mid]: high = mid - 1 else low = mid + 1', '  else:                                      // right half is sorted', '    if a[mid] < target <= a[high]: low = mid + 1 else high = mid - 1', 'return -1'],
    solution: {
      c: R`#include <stdio.h>

int main(void) {
    int n, a[1000], target;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    scanf("%d", &target);
    // <solve>
    int low = 0, high = n - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (a[mid] == target) { printf("%d\n", mid); return 0; }
        if (a[low] <= a[mid]) {                         /* left half is sorted */
            if (a[low] <= target && target < a[mid]) high = mid - 1;
            else low = mid + 1;
        } else {                                        /* right half is sorted */
            if (a[mid] < target && target <= a[high]) low = mid + 1;
            else high = mid - 1;
        }
    }
    printf("-1\n");
    // </solve>
    return 0;
}
`,
      cpp: R`#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n, target;
    cin >> n;
    vector<int> a(n);
    for (int &x : a) cin >> x;
    cin >> target;
    // <solve>
    int low = 0, high = n - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (a[mid] == target) { cout << mid << "\n"; return 0; }
        if (a[low] <= a[mid]) {                         // left half is sorted
            if (a[low] <= target && target < a[mid]) high = mid - 1;
            else low = mid + 1;
        } else {                                        // right half is sorted
            if (a[mid] < target && target <= a[high]) low = mid + 1;
            else high = mid - 1;
        }
    }
    cout << -1 << "\n";
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
        int low = 0, high = n - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (a[mid] == target) { System.out.println(mid); return; }
            if (a[low] <= a[mid]) {                     // left half is sorted
                if (a[low] <= target && target < a[mid]) high = mid - 1;
                else low = mid + 1;
            } else {                                    // right half is sorted
                if (a[mid] < target && target <= a[high]) low = mid + 1;
                else high = mid - 1;
            }
        }
        System.out.println(-1);
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
low, high = 0, n - 1
ans = -1
while low <= high:
    mid = (low + high) // 2
    if a[mid] == target:
        ans = mid
        break
    if a[low] <= a[mid]:                        # left half is sorted
        if a[low] <= target < a[mid]:
            high = mid - 1
        else:
            low = mid + 1
    else:                                       # right half is sorted
        if a[mid] < target <= a[high]:
            low = mid + 1
        else:
            high = mid - 1
print(ans)
# </solve>
`,
    },
  },
  {
    id: 'kth-largest', title: 'Kth Largest Element', module: 4, difficulty: 'Medium', tags: ['Heap', 'Sorting'], source: 'LeetCode 215', link: 'https://leetcode.com/problems/kth-largest-element-in-an-array/',
    blurb: 'Find the k-th largest value using a min-heap of size k.',
    statement: R`Find the **k-th largest** element of an unsorted array, counting duplicates (the k-th largest of 3 3 1 is 3 for k = 2, and 1 for k = 3). Sorting the whole array costs O(n log n); aim for O(n log k) with a heap.`,
    format: R`**Input:** n and k on the first line, then n integers.

**Output:** the k-th largest value.`,
    constraints: '- 1 ≤ k ≤ n ≤ 1000',
    examples: [{ in: '6 2\n3 2 1 5 6 4\n', out: '5\n', why: 'Sorted descending: 6 5 4 3 2 1; the 2nd is 5.' }, { in: '9 4\n3 2 3 1 2 4 5 5 6\n', out: '4\n', why: 'Sorted descending: 6 5 5 4 3 3 2 2 1; the 4th is 4.' }],
    more: ['1 1\n7\n', '5 5\n9 8 7 6 5\n', '5 1\n-1 -5 -3 -2 -4\n', '6 3\n4 4 4 4 4 4\n', '7 4\n10 3 8 1 9 2 7\n'],
    time: 'O(n log k)', space: 'O(k)',
    explain: R`Keep a **min-heap that holds the k largest values seen so far**. Its root is the smallest of them, i.e. the k-th largest. For each new value: if the heap has fewer than k items, add it; otherwise, if the value is larger than the root, replace the root with it and sift down. When all elements have been processed the root is the k-th largest. Each element costs O(log k), so O(n log k) overall, and only k values are stored.`,
    pseudo: ['heap = empty min-heap', 'for each x in a:', '  if heap.size < k: heap.push(x)', '  else if x > heap.top: heap.pop(); heap.push(x)', 'print heap.top'],
    solution: {
      c: R`#include <stdio.h>

int heap[1000], size = 0;

void siftDown(int i) {
    for (;;) {
        int l = 2 * i + 1, r = l + 1, small = i;
        if (l < size && heap[l] < heap[small]) small = l;
        if (r < size && heap[r] < heap[small]) small = r;
        if (small == i) return;
        int t = heap[i]; heap[i] = heap[small]; heap[small] = t;
        i = small;
    }
}

void push(int x) {
    int i = size++;
    heap[i] = x;
    while (i > 0 && heap[i] < heap[(i - 1) / 2]) {
        int p = (i - 1) / 2, t = heap[i]; heap[i] = heap[p]; heap[p] = t;
        i = p;
    }
}

int main(void) {
    int n, k, a[1000];
    scanf("%d %d", &n, &k);
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    // <solve>
    for (int i = 0; i < n; i++) {
        if (size < k) push(a[i]);
        else if (a[i] > heap[0]) { heap[0] = a[i]; siftDown(0); }
    }
    printf("%d\n", heap[0]);
    // </solve>
    return 0;
}
`,
      cpp: R`#include <functional>
#include <iostream>
#include <queue>
#include <vector>
using namespace std;

int main() {
    int n, k;
    cin >> n >> k;
    vector<int> a(n);
    for (int &x : a) cin >> x;
    // <solve>
    priority_queue<int, vector<int>, greater<int>> heap;      // min-heap
    for (int x : a) {
        if ((int)heap.size() < k) heap.push(x);
        else if (x > heap.top()) { heap.pop(); heap.push(x); }
    }
    cout << heap.top() << "\n";
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
        PriorityQueue<Integer> heap = new PriorityQueue<>();    // min-heap
        for (int x : a) {
            if (heap.size() < k) heap.add(x);
            else if (x > heap.peek()) { heap.poll(); heap.add(x); }
        }
        System.out.println(heap.peek());
        // </solve>
    }
}
`,
      py: R`import heapq
import sys

data = sys.stdin.read().split()
n, k = int(data[0]), int(data[1])
a = list(map(int, data[2:2 + n]))
# <solve>
heap = []                                       # min-heap of the k largest so far
for x in a:
    if len(heap) < k:
        heapq.heappush(heap, x)
    elif x > heap[0]:
        heapq.heapreplace(heap, x)
print(heap[0])
# </solve>
`,
    },
  },
  {
    id: 'sort-colors', title: 'Sort Colors (Dutch National Flag)', module: 4, difficulty: 'Medium', tags: ['Sorting', 'Two pointers'], source: 'LeetCode 75', link: 'https://leetcode.com/problems/sort-colors/',
    blurb: 'Sort an array of 0s, 1s and 2s in one pass, without a sorting function.',
    statement: R`An array contains only the values 0, 1 and 2 (think of red, white and blue). Sort it **in place** so that all 0s come first, then all 1s, then all 2s, using a **single pass** and constant extra space. Do not use a library sort.`,
    format: R`**Input:** n, then n values, each 0, 1 or 2.

**Output:** the sorted array.`,
    constraints: '- 1 ≤ n ≤ 1000',
    examples: [{ in: '6\n2 0 2 1 1 0\n', out: '0 0 1 1 2 2\n', why: 'Zeros first, then ones, then twos.' }, { in: '3\n2 0 1\n', out: '0 1 2\n', why: '' }],
    more: ['1\n1\n', '5\n2 2 2 2 2\n', '5\n0 0 0 0 0\n', '8\n1 2 0 1 2 0 1 2\n', '7\n0 1 2 0 1 2 0\n'],
    time: 'O(n)', space: 'O(1)',
    explain: R`Dijkstra's **Dutch national flag** algorithm keeps three regions with three pointers: everything before \`low\` is 0, everything from \`high + 1\` on is 2, and \`mid\` scans the unknown middle. If a[mid] is 0, swap it with a[low] and advance both; if it is 1, just advance mid; if it is 2, swap it with a[high] and shrink high (do not advance mid, because the swapped-in value is not checked yet). Each element is examined at most twice: one pass, O(n).`,
    pseudo: ['low = 0; mid = 0; high = n - 1', 'while mid <= high:', '  if a[mid] == 0: swap a[low], a[mid]; low++; mid++', '  else if a[mid] == 1: mid++', '  else: swap a[mid], a[high]; high--'],
    solution: {
      c: R`#include <stdio.h>

int main(void) {
    int n, a[1000];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    // <solve>
    int low = 0, mid = 0, high = n - 1;
    while (mid <= high) {
        if (a[mid] == 0) { int t = a[low]; a[low] = a[mid]; a[mid] = t; low++; mid++; }
        else if (a[mid] == 1) mid++;
        else { int t = a[mid]; a[mid] = a[high]; a[high] = t; high--; }
    }
    for (int i = 0; i < n; i++) printf(i ? " %d" : "%d", a[i]);
    printf("\n");
    // </solve>
    return 0;
}
`,
      cpp: R`#include <iostream>
#include <utility>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    for (int &x : a) cin >> x;
    // <solve>
    int low = 0, mid = 0, high = n - 1;
    while (mid <= high) {
        if (a[mid] == 0) swap(a[low++], a[mid++]);
        else if (a[mid] == 1) mid++;
        else swap(a[mid], a[high--]);
    }
    for (int i = 0; i < n; i++) cout << (i ? " " : "") << a[i];
    cout << "\n";
    // </solve>
    return 0;
}
`,
      java: R`import java.util.*;

class Main {
    static void swap(int[] a, int i, int j) { int t = a[i]; a[i] = a[j]; a[j] = t; }

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = in.nextInt();
        // <solve>
        int low = 0, mid = 0, high = n - 1;
        while (mid <= high) {
            if (a[mid] == 0) swap(a, low++, mid++);
            else if (a[mid] == 1) mid++;
            else swap(a, mid, high--);
        }
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
a = list(map(int, data[1:1 + n]))
# <solve>
low = mid = 0
high = n - 1
while mid <= high:
    if a[mid] == 0:
        a[low], a[mid] = a[mid], a[low]
        low += 1
        mid += 1
    elif a[mid] == 1:
        mid += 1
    else:
        a[mid], a[high] = a[high], a[mid]
        high -= 1
print(*a)
# </solve>
`,
    },
  },
  {
    id: 'top-k-frequent', title: 'Top K Frequent Elements', module: 4, difficulty: 'Medium', tags: ['Hashing', 'Sorting'], source: 'LeetCode 347', link: 'https://leetcode.com/problems/top-k-frequent-elements/',
    blurb: 'Count with a hash table, then pick the k most frequent values.',
    statement: R`Print the **k most frequent** values of the array. List them from the most frequent to the least frequent; if two values are equally frequent, the **smaller value comes first**.`,
    format: R`**Input:** n and k on the first line, then n integers.

**Output:** k values separated by spaces.`,
    constraints: '- 1 ≤ n ≤ 1000\n- −1000 ≤ a[i] ≤ 1000\n- 1 ≤ k ≤ number of distinct values',
    examples: [{ in: '6 2\n1 1 1 2 2 3\n', out: '1 2\n', why: '1 appears three times and 2 twice.' }, { in: '1 1\n5\n', out: '5\n', why: '' }],
    more: ['8 3\n4 4 3 3 2 2 1 5\n', '7 2\n-1 -1 -1 2 2 3 3\n', '5 5\n9 8 7 6 5\n', '10 1\n1 2 2 3 3 3 4 4 4 4\n', '6 2\n7 7 8 8 9 9\n'],
    time: 'O(n log n)', space: 'O(n)',
    explain: R`First **count** how often each value occurs with a hash table (or, because the values are small, an array indexed by value). Then sort the distinct values by frequency (descending, ties by value) and print the first k. Counting is O(n) and sorting the distinct values is O(d log d) ≤ O(n log n). A **bucket sort** on the frequencies (bucket i holds the values that occur i times) brings the whole thing to O(n).`,
    pseudo: ['count[v] = number of occurrences of v (hash table)', 'values = the distinct values', 'sort values by (count descending, value ascending)', 'print the first k values'],
    solution: {
      c: R`#include <stdio.h>
#include <stdlib.h>

int count[2001];                                  /* value v is stored at index v + 1000 */

int cmp(const void *x, const void *y) {
    int a = *(const int *)x, b = *(const int *)y;
    if (count[a + 1000] != count[b + 1000]) return count[b + 1000] - count[a + 1000];
    return a - b;
}

int main(void) {
    int n, k, a[1000];
    scanf("%d %d", &n, &k);
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    // <solve>
    int distinct[1000], d = 0;
    for (int i = 0; i < n; i++)
        if (count[a[i] + 1000]++ == 0) distinct[d++] = a[i];
    qsort(distinct, d, sizeof(int), cmp);
    for (int i = 0; i < k; i++) printf(i ? " %d" : "%d", distinct[i]);
    printf("\n");
    // </solve>
    return 0;
}
`,
      cpp: R`#include <algorithm>
#include <iostream>
#include <unordered_map>
#include <vector>
using namespace std;

int main() {
    int n, k;
    cin >> n >> k;
    vector<int> a(n);
    for (int &x : a) cin >> x;
    // <solve>
    unordered_map<int, int> count;
    for (int x : a) count[x]++;
    vector<int> distinct;
    for (auto &kv : count) distinct.push_back(kv.first);
    sort(distinct.begin(), distinct.end(), [&](int x, int y) {
        return count[x] != count[y] ? count[x] > count[y] : x < y;
    });
    for (int i = 0; i < k; i++) cout << (i ? " " : "") << distinct[i];
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
        Map<Integer, Integer> count = new HashMap<>();
        for (int x : a) count.merge(x, 1, Integer::sum);
        List<Integer> distinct = new ArrayList<>(count.keySet());
        distinct.sort((x, y) -> !count.get(x).equals(count.get(y)) ? count.get(y) - count.get(x) : x - y);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < k; i++) sb.append(i > 0 ? " " : "").append(distinct.get(i));
        System.out.println(sb);
        // </solve>
    }
}
`,
      py: R`import sys
from collections import Counter

data = sys.stdin.read().split()
n, k = int(data[0]), int(data[1])
a = list(map(int, data[2:2 + n]))
# <solve>
count = Counter(a)
distinct = sorted(count, key=lambda v: (-count[v], v))
print(*distinct[:k])
# </solve>
`,
    },
  },
];
