/* Module IV problems, second set: searching, hashing and sorting. */
const R = String.raw;
module.exports = [
  {
    id: 'valid-anagram', title: 'Valid Anagram', module: 4, difficulty: 'Easy', tags: ['Hashing', 'String', 'Counting'], source: 'LeetCode 242', link: 'https://leetcode.com/problems/valid-anagram/',
    blurb: 'Are two words made of exactly the same letters? Count them in a table.',
    statement: R`Two strings are **anagrams** if one can be rearranged into the other, using every letter exactly once. Print \`true\` if they are, otherwise \`false\`.`,
    format: R`**Input:** two lowercase words, one per line.

**Output:** \`true\` or \`false\`.`,
    constraints: '- 1 ≤ length ≤ 1000, lowercase English letters',
    examples: [{ in: 'anagram\nnagaram\n', out: 'true\n', why: 'Both contain a×3, n, g, r, m.' }, { in: 'rat\ncar\n', out: 'false\n', why: 'The letters differ.' }],
    more: ['a\na\n', 'a\nb\n', 'listen\nsilent\n', 'abc\nabcc\n', 'aabbcc\nabcabc\n', 'hello\nbello\n'],
    time: 'O(n)', space: 'O(1)',
    explain: R`Sorting both words and comparing is O(n log n). A **hash table of counts** does it in O(n): add one for each letter of the first word, subtract one for each letter of the second. The words are anagrams exactly when every count ends at zero (and the lengths were equal). For lowercase letters the "hash table" is just an array of 26 counters indexed by \`c - 'a'\`: a perfect hash function.`,
    pseudo: ['if length(a) != length(b): print false; stop', 'count[26] = 0', 'for each char c in a: count[c - "a"]++', 'for each char c in b: count[c - "a"]--', 'print true if every count is 0, else false'],
    solution: {
      c: R`#include <stdio.h>
#include <string.h>

int main(void) {
    static char a[1005], b[1005];
    scanf("%1004s %1004s", a, b);
    // <solve>
    int count[26] = {0};
    if (strlen(a) != strlen(b)) { printf("false\n"); return 0; }
    for (int i = 0; a[i]; i++) { count[a[i] - 'a']++; count[b[i] - 'a']--; }
    for (int i = 0; i < 26; i++) if (count[i]) { printf("false\n"); return 0; }
    printf("true\n");
    // </solve>
    return 0;
}
`,
      cpp: R`#include <iostream>
#include <string>
using namespace std;

int main() {
    string a, b;
    cin >> a >> b;
    // <solve>
    if (a.size() != b.size()) { cout << "false\n"; return 0; }
    int count[26] = {};
    for (size_t i = 0; i < a.size(); i++) { count[a[i] - 'a']++; count[b[i] - 'a']--; }
    for (int c : count) if (c) { cout << "false\n"; return 0; }
    cout << "true\n";
    // </solve>
    return 0;
}
`,
      java: R`import java.util.*;

class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        String a = in.next(), b = in.next();
        // <solve>
        if (a.length() != b.length()) { System.out.println("false"); return; }
        int[] count = new int[26];
        for (int i = 0; i < a.length(); i++) { count[a.charAt(i) - 'a']++; count[b.charAt(i) - 'a']--; }
        for (int c : count) if (c != 0) { System.out.println("false"); return; }
        System.out.println("true");
        // </solve>
    }
}
`,
      py: R`import sys
from collections import Counter

a, b = sys.stdin.read().split()
# <solve>
print("true" if Counter(a) == Counter(b) else "false")
# </solve>
`,
    },
  },
  {
    id: 'find-min-rotated', title: 'Find Minimum in Rotated Sorted Array', module: 4, difficulty: 'Medium', tags: ['Binary search', 'Array'], source: 'LeetCode 153', link: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/',
    blurb: 'A sorted array was rotated: find its smallest element in O(log n).',
    statement: R`A sorted array of **distinct** integers was rotated by some amount, for example \`[0 1 2 4 5 6 7]\` became \`[4 5 6 7 0 1 2]\`. Print the **minimum** element in O(log n) time.`,
    format: R`**Input:** n, then the n elements of the rotated array.

**Output:** the minimum.`,
    constraints: '- 1 ≤ n ≤ 1000, all values distinct',
    examples: [{ in: '5\n3 4 5 1 2\n', out: '1\n', why: 'The rotation point is between 5 and 1.' }, { in: '4\n11 13 15 17\n', out: '11\n', why: 'Rotated by zero positions: the first element is the minimum.' }],
    more: ['1\n5\n', '2\n2 1\n', '7\n4 5 6 7 0 1 2\n', '6\n6 1 2 3 4 5\n', '6\n2 3 4 5 6 1\n', '3\n-5 -3 -9\n'],
    time: 'O(log n)', space: 'O(1)',
    explain: R`Compare the middle element with the **last** element. If \`a[mid] > a[hi]\` the minimum lies strictly to the right of mid (the rotation point is there); otherwise the minimum is at mid or to its left. Shrink the range accordingly until one element remains. Half of the range is discarded every step, as in ordinary binary search.`,
    pseudo: ['lo = 0; hi = n - 1', 'while lo < hi:', '  mid = (lo + hi) / 2', '  if a[mid] > a[hi]: lo = mid + 1', '  else: hi = mid', 'print a[lo]'],
    solution: {
      c: R`#include <stdio.h>

int main(void) {
    int n, a[1000];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    // <solve>
    int lo = 0, hi = n - 1;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] > a[hi]) lo = mid + 1; else hi = mid;
    }
    printf("%d\n", a[lo]);
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
    int lo = 0, hi = n - 1;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] > a[hi]) lo = mid + 1; else hi = mid;
    }
    cout << a[lo] << "\n";
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
        int lo = 0, hi = n - 1;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (a[mid] > a[hi]) lo = mid + 1; else hi = mid;
        }
        System.out.println(a[lo]);
        // </solve>
    }
}
`,
      py: R`import sys

data = sys.stdin.read().split()
n = int(data[0])
a = [int(x) for x in data[1:1 + n]]
# <solve>
lo, hi = 0, n - 1
while lo < hi:
    mid = (lo + hi) // 2
    if a[mid] > a[hi]:
        lo = mid + 1
    else:
        hi = mid
print(a[lo])
# </solve>
`,
    },
  },
  {
    id: 'merge-intervals', title: 'Merge Intervals', module: 4, difficulty: 'Medium', tags: ['Sorting', 'Intervals'], source: 'LeetCode 56', link: 'https://leetcode.com/problems/merge-intervals/',
    blurb: 'Sort by start, then sweep and fuse the overlapping ranges.',
    statement: R`Given n intervals \`[start, end]\`, merge all **overlapping** intervals (two intervals that share even one point overlap, so [1,4] and [4,5] merge) and print the merged intervals in increasing order of start.`,
    format: R`**Input:** n, then n lines with \`start end\`.

**Output:** one merged interval per line as \`start end\`.`,
    constraints: '- 1 ≤ n ≤ 500\n- 0 ≤ start ≤ end ≤ 10000',
    examples: [{ in: '4\n1 3\n2 6\n8 10\n15 18\n', out: '1 6\n8 10\n15 18\n', why: '[1,3] and [2,6] overlap and fuse into [1,6].' }, { in: '2\n1 4\n4 5\n', out: '1 5\n', why: 'They touch at 4, so they merge.' }],
    more: ['1\n5 5\n', '3\n1 4\n0 4\n3 5\n', '3\n5 6\n1 2\n3 4\n', '4\n1 10\n2 3\n4 5\n6 7\n', '5\n9 12\n1 3\n2 4\n11 15\n20 21\n'],
    time: 'O(n log n)', space: 'O(n)',
    explain: R`If the intervals are **sorted by start**, overlapping ones become neighbours, so one sweep suffices. Keep the current merged interval; for each next interval, if its start is ≤ the current end, extend the end to the larger of the two ends; otherwise output the current interval and start a new one. The sort dominates: O(n log n).`,
    pseudo: ['sort intervals by start', 'cur = first interval', 'for each next interval (s, e):', '  if s <= cur.end: cur.end = max(cur.end, e)', '  else: output cur; cur = (s, e)', 'output cur'],
    solution: {
      c: R`#include <stdio.h>
#include <stdlib.h>

static int cmp(const void *x, const void *y) {
    const int *a = x, *b = y;
    return a[0] != b[0] ? (a[0] > b[0]) - (a[0] < b[0]) : (a[1] > b[1]) - (a[1] < b[1]);
}

int main(void) {
    int n, iv[500][2];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d %d", &iv[i][0], &iv[i][1]);
    // <solve>
    qsort(iv, n, sizeof iv[0], cmp);
    int s = iv[0][0], e = iv[0][1];
    for (int i = 1; i < n; i++) {
        if (iv[i][0] <= e) { if (iv[i][1] > e) e = iv[i][1]; }
        else { printf("%d %d\n", s, e); s = iv[i][0]; e = iv[i][1]; }
    }
    printf("%d %d\n", s, e);
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
    vector<pair<int, int>> iv(n);
    for (auto &p : iv) cin >> p.first >> p.second;
    // <solve>
    sort(iv.begin(), iv.end());
    int s = iv[0].first, e = iv[0].second;
    for (int i = 1; i < n; i++) {
        if (iv[i].first <= e) e = max(e, iv[i].second);
        else { cout << s << " " << e << "\n"; s = iv[i].first; e = iv[i].second; }
    }
    cout << s << " " << e << "\n";
    // </solve>
    return 0;
}
`,
      java: R`import java.util.*;

class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        int[][] iv = new int[n][2];
        for (int i = 0; i < n; i++) { iv[i][0] = in.nextInt(); iv[i][1] = in.nextInt(); }
        // <solve>
        Arrays.sort(iv, (a, b) -> a[0] != b[0] ? Integer.compare(a[0], b[0]) : Integer.compare(a[1], b[1]));
        int s = iv[0][0], e = iv[0][1];
        StringBuilder sb = new StringBuilder();
        for (int i = 1; i < n; i++) {
            if (iv[i][0] <= e) e = Math.max(e, iv[i][1]);
            else { sb.append(s).append(" ").append(e).append("\n"); s = iv[i][0]; e = iv[i][1]; }
        }
        sb.append(s).append(" ").append(e);
        System.out.println(sb);
        // </solve>
    }
}
`,
      py: R`import sys

data = sys.stdin.read().split()
n = int(data[0])
iv = sorted((int(data[1 + 2 * i]), int(data[2 + 2 * i])) for i in range(n))
# <solve>
s, e = iv[0]
for a, b in iv[1:]:
    if a <= e:
        e = max(e, b)
    else:
        print(s, e)
        s, e = a, b
print(s, e)
# </solve>
`,
    },
  },
  {
    id: 'subarray-sum-k', title: 'Subarray Sum Equals K', module: 4, difficulty: 'Medium', tags: ['Hashing', 'Prefix sum', 'Array'], source: 'LeetCode 560', link: 'https://leetcode.com/problems/subarray-sum-equals-k/',
    blurb: 'Count the contiguous ranges that add up to k, using prefix sums and a hash table.',
    statement: R`Given an array of integers (positive, zero or negative) and a target \`k\`, print the number of **contiguous subarrays** whose elements sum to \`k\`.`,
    format: R`**Input:** n, then n integers, then k.

**Output:** the number of subarrays.`,
    constraints: '- 1 ≤ n ≤ 1000\n- −1000 ≤ a[i] ≤ 1000',
    examples: [{ in: '3\n1 1 1\n2\n', out: '2\n', why: '[1,1] at positions 0–1 and at 1–2.' }, { in: '3\n1 2 3\n3\n', out: '2\n', why: '[1,2] and [3].' }],
    more: ['1\n5\n5\n', '4\n1 -1 1 -1\n0\n', '5\n3 4 7 2 -3\n7\n', '6\n0 0 0 0 0 0\n0\n', '5\n1 2 1 2 1\n3\n', '4\n-1 -1 1 1\n0\n'],
    time: 'O(n)', space: 'O(n)',
    explain: R`Let \`prefix[i]\` be the sum of the first i elements. The subarray from j to i sums to k exactly when \`prefix[i] - prefix[j] = k\`, i.e. \`prefix[j] = prefix[i] - k\`. So while scanning, keep a **hash table counting how often each prefix sum has occurred**; at each position add the count of \`prefix - k\` to the answer, then record the current prefix. The table starts with \`{0: 1}\` for the empty prefix. One pass, O(n) on average.`,
    pseudo: ['count = {0: 1}; prefix = 0; answer = 0', 'for each x in a:', '  prefix = prefix + x', '  answer = answer + count[prefix - k]   (0 if absent)', '  count[prefix] = count[prefix] + 1', 'print answer'],
    solution: {
      c: R`#include <stdio.h>

#define H 8192

/* index of the slot holding v, or of the empty slot where v belongs (linear probing) */
static int slot(const int keys[], const int used[], int v) {
    int h = ((v % H) + H) % H;
    while (used[h] && keys[h] != v) h = (h + 1) % H;
    return h;
}

int main(void) {
    int n, a[1000], k;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    scanf("%d", &k);
    // <solve>
    static int keys[H], cnt[H], used[H];                /* an open-addressing hash table: prefix sum -> count */
    long long answer = 0;
    int prefix = 0, h = slot(keys, used, 0);
    used[h] = 1; keys[h] = 0; cnt[h] = 1;
    for (int i = 0; i < n; i++) {
        prefix += a[i];
        h = slot(keys, used, prefix - k);
        if (used[h]) answer += cnt[h];
        h = slot(keys, used, prefix);
        if (!used[h]) { used[h] = 1; keys[h] = prefix; cnt[h] = 0; }
        cnt[h]++;
    }
    printf("%lld\n", answer);
    // </solve>
    return 0;
}
`,
      cpp: R`#include <iostream>
#include <unordered_map>
#include <vector>
using namespace std;

int main() {
    int n, k;
    cin >> n;
    vector<int> a(n);
    for (int &x : a) cin >> x;
    cin >> k;
    // <solve>
    unordered_map<int, int> count;
    count[0] = 1;
    int prefix = 0;
    long long answer = 0;
    for (int x : a) {
        prefix += x;
        auto it = count.find(prefix - k);
        if (it != count.end()) answer += it->second;
        count[prefix]++;
    }
    cout << answer << "\n";
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
        int k = in.nextInt();
        // <solve>
        Map<Integer, Integer> count = new HashMap<>();
        count.put(0, 1);
        int prefix = 0;
        long answer = 0;
        for (int x : a) {
            prefix += x;
            answer += count.getOrDefault(prefix - k, 0);
            count.merge(prefix, 1, Integer::sum);
        }
        System.out.println(answer);
        // </solve>
    }
}
`,
      py: R`import sys
from collections import defaultdict

data = sys.stdin.read().split()
n = int(data[0])
a = [int(x) for x in data[1:1 + n]]
k = int(data[1 + n])
# <solve>
count = defaultdict(int)
count[0] = 1
prefix = answer = 0
for x in a:
    prefix += x
    answer += count[prefix - k]
    count[prefix] += 1
print(answer)
# </solve>
`,
    },
  },
];
