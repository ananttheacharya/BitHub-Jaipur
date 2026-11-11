/* Module II problems: linked lists. The list is built from the input before the `<solve>` marker. */
const R = String.raw;

const C_NODE = R`#include <stdio.h>
#include <stdlib.h>

typedef struct Node { int val; struct Node *next; } Node;

Node *readList(int n) {                  /* reads n integers into a list and returns its head */
    Node dummy = {0, NULL}, *tail = &dummy;
    for (int i = 0; i < n; i++) {
        tail->next = malloc(sizeof(Node));
        tail = tail->next;
        scanf("%d", &tail->val);
        tail->next = NULL;
    }
    return dummy.next;
}

void printList(Node *head) {
    for (Node *p = head; p; p = p->next) printf(p == head ? "%d" : " %d", p->val);
    printf("\n");
}
`;
const CPP_NODE = R`#include <iostream>
using namespace std;

struct Node { int val; Node *next; Node(int v) : val(v), next(nullptr) {} };

Node *readList(int n) {                  // reads n integers into a list and returns its head
    Node dummy(0), *tail = &dummy;
    for (int i = 0; i < n; i++) {
        int x; cin >> x;
        tail->next = new Node(x);
        tail = tail->next;
    }
    return dummy.next;
}

void printList(Node *head) {
    for (Node *p = head; p; p = p->next) cout << (p == head ? "" : " ") << p->val;
    cout << "\n";
}
`;
const JAVA_NODE = R`import java.util.*;

class Main {
    static class Node {
        int val; Node next;
        Node(int v) { val = v; }
    }

    static Scanner in = new Scanner(System.in);

    static Node readList(int n) {                // reads n integers into a list and returns its head
        Node dummy = new Node(0), tail = dummy;
        for (int i = 0; i < n; i++) { tail.next = new Node(in.nextInt()); tail = tail.next; }
        return dummy.next;
    }

    static void printList(Node head) {
        StringBuilder sb = new StringBuilder();
        for (Node p = head; p != null; p = p.next) sb.append(p == head ? "" : " ").append(p.val);
        System.out.println(sb);
    }
`;
const PY_NODE = R`import sys


class Node:
    def __init__(self, val):
        self.val = val
        self.next = None


tokens = iter(sys.stdin.read().split())


def read_list(n):
    """Reads n integers into a linked list and returns its head."""
    dummy = tail = Node(0)
    for _ in range(n):
        tail.next = Node(int(next(tokens)))
        tail = tail.next
    return dummy.next


def print_list(head):
    out = []
    while head:
        out.append(head.val)
        head = head.next
    print(*out)
`;

module.exports = [
  {
    id: 'reverse-linked-list', title: 'Reverse a Linked List', module: 2, difficulty: 'Easy', tags: ['Linked list', 'Pointers'], source: 'LeetCode 206', link: 'https://leetcode.com/problems/reverse-linked-list/',
    blurb: 'Reverse a singly linked list in one pass by turning its pointers around.',
    statement: R`The input is built into a singly linked list for you. **Reverse the list** by changing the \`next\` pointers (do not just print the numbers backwards) and print the reversed list.`,
    format: R`**Input:** n, then n integers (the values of the nodes from head to tail).

**Output:** the values of the reversed list, separated by spaces.`,
    constraints: '- 1 ≤ n ≤ 1000',
    examples: [{ in: '5\n1 2 3 4 5\n', out: '5 4 3 2 1\n', why: 'The head becomes the tail and every arrow points the other way.' }, { in: '1\n7\n', out: '7\n', why: 'A single node is its own reverse.' }],
    more: ['2\n1 2\n', '6\n10 20 30 40 50 60\n', '4\n-1 0 -1 0\n', '3\n9 9 9\n'],
    time: 'O(n)', space: 'O(1)',
    explain: R`Walk along the list with three pointers. \`prev\` (initially NULL) is the head of the part already reversed, \`cur\` is the node being processed and \`next\` remembers the rest of the list. For each node: save \`cur.next\`, set \`cur.next = prev\`, then advance \`prev\` and \`cur\`. When \`cur\` becomes NULL, \`prev\` is the new head. One pass, no extra memory.`,
    pseudo: ['prev = NULL; cur = head', 'while cur != NULL:', '  next = cur.next', '  cur.next = prev', '  prev = cur; cur = next', 'head = prev'],
    solution: {
      c: C_NODE + R`
int main(void) {
    int n;
    scanf("%d", &n);
    Node *head = readList(n);
    // <solve>
    Node *prev = NULL, *cur = head;
    while (cur) {
        Node *next = cur->next;
        cur->next = prev;
        prev = cur;
        cur = next;
    }
    head = prev;
    printList(head);
    // </solve>
    return 0;
}
`,
      cpp: CPP_NODE + R`
int main() {
    int n;
    cin >> n;
    Node *head = readList(n);
    // <solve>
    Node *prev = nullptr, *cur = head;
    while (cur) {
        Node *next = cur->next;
        cur->next = prev;
        prev = cur;
        cur = next;
    }
    head = prev;
    printList(head);
    // </solve>
    return 0;
}
`,
      java: JAVA_NODE + R`
    public static void main(String[] args) {
        int n = in.nextInt();
        Node head = readList(n);
        // <solve>
        Node prev = null, cur = head;
        while (cur != null) {
            Node next = cur.next;
            cur.next = prev;
            prev = cur;
            cur = next;
        }
        head = prev;
        printList(head);
        // </solve>
    }
}
`,
      py: PY_NODE + R`

n = int(next(tokens))
head = read_list(n)
# <solve>
prev, cur = None, head
while cur:
    nxt = cur.next
    cur.next = prev
    prev, cur = cur, nxt
head = prev
print_list(head)
# </solve>
`,
    },
  },
  {
    id: 'middle-of-list', title: 'Middle of the Linked List', module: 2, difficulty: 'Easy', tags: ['Linked list', 'Two pointers'], source: 'LeetCode 876', link: 'https://leetcode.com/problems/middle-of-the-linked-list/',
    blurb: 'Find the middle node in a single pass with a slow and a fast pointer.',
    statement: R`Find the **middle node** of a singly linked list without first counting its length, and print the values from the middle node to the end of the list. If the list has two middle nodes, use the **second** one.`,
    format: R`**Input:** n, then n integers.

**Output:** the values from the middle node to the tail, separated by spaces.`,
    constraints: '- 1 ≤ n ≤ 1000',
    examples: [{ in: '5\n1 2 3 4 5\n', out: '3 4 5\n', why: 'The middle node of five is the third one.' }, { in: '6\n1 2 3 4 5 6\n', out: '4 5 6\n', why: 'Two middle nodes (3 and 4): take the second.' }],
    more: ['1\n8\n', '2\n1 2\n', '7\n5 4 3 2 1 0 -1\n', '4\n10 20 30 40\n'],
    time: 'O(n)', space: 'O(1)',
    explain: R`Move \`slow\` one node and \`fast\` two nodes at a time. When \`fast\` reaches the end, \`slow\` has travelled half as far, so it is at the middle. With the condition \`fast != NULL && fast.next != NULL\` an even-length list stops with \`slow\` on the second middle node, as required.`,
    pseudo: ['slow = fast = head', 'while fast != NULL and fast.next != NULL:', '  slow = slow.next', '  fast = fast.next.next', 'print the list starting at slow'],
    solution: {
      c: C_NODE + R`
int main(void) {
    int n;
    scanf("%d", &n);
    Node *head = readList(n);
    // <solve>
    Node *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
    }
    printList(slow);
    // </solve>
    return 0;
}
`,
      cpp: CPP_NODE + R`
int main() {
    int n;
    cin >> n;
    Node *head = readList(n);
    // <solve>
    Node *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
    }
    printList(slow);
    // </solve>
    return 0;
}
`,
      java: JAVA_NODE + R`
    public static void main(String[] args) {
        int n = in.nextInt();
        Node head = readList(n);
        // <solve>
        Node slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        printList(slow);
        // </solve>
    }
}
`,
      py: PY_NODE + R`

n = int(next(tokens))
head = read_list(n)
# <solve>
slow = fast = head
while fast and fast.next:
    slow = slow.next
    fast = fast.next.next
print_list(slow)
# </solve>
`,
    },
  },
  {
    id: 'merge-two-lists', title: 'Merge Two Sorted Lists', module: 2, difficulty: 'Easy', tags: ['Linked list', 'Merge'], source: 'LeetCode 21', link: 'https://leetcode.com/problems/merge-two-sorted-lists/',
    blurb: 'Splice two sorted lists into one sorted list.',
    statement: R`Two linked lists are each sorted in non-decreasing order. Merge them into **one sorted list** by relinking the existing nodes, and print the result.`,
    format: R`**Input:** the first line has the lengths n and m. The second line has the n values of the first list, the third line the m values of the second list (a line is empty when the length is 0).

**Output:** the merged list, values separated by spaces.`,
    constraints: '- 0 ≤ n, m ≤ 500 and n + m ≥ 1\n- both lists are sorted',
    examples: [{ in: '3 3\n1 2 4\n1 3 4\n', out: '1 1 2 3 4 4\n', why: 'Take the smaller front value each time.' }, { in: '0 2\n\n5 6\n', out: '5 6\n', why: 'One list is empty.' }],
    more: ['1 1\n2\n1\n', '4 2\n1 5 9 12\n6 7\n', '3 0\n-3 -2 0\n\n', '2 5\n1 1\n1 1 1 1 1\n', '5 5\n1 3 5 7 9\n2 4 6 8 10\n'],
    time: 'O(n + m)', space: 'O(1)',
    explain: R`This is the **merge step of merge sort** done with pointers. Use a dummy head node and a \`tail\` pointer. While both lists have nodes, append the node with the smaller value and advance that list. When one list runs out, attach the whole remainder of the other. Each node is visited once: O(n + m) time, and since nodes are relinked rather than copied, O(1) extra space.`,
    pseudo: ['dummy = new node; tail = dummy', 'while a != NULL and b != NULL:', '  if a.val <= b.val: tail.next = a; a = a.next', '  else: tail.next = b; b = b.next', '  tail = tail.next', 'tail.next = (a != NULL) ? a : b', 'return dummy.next'],
    solution: {
      c: C_NODE + R`
int main(void) {
    int n, m;
    scanf("%d %d", &n, &m);
    Node *a = readList(n), *b = readList(m);
    // <solve>
    Node dummy = {0, NULL}, *tail = &dummy;
    while (a && b) {
        if (a->val <= b->val) { tail->next = a; a = a->next; }
        else { tail->next = b; b = b->next; }
        tail = tail->next;
    }
    tail->next = a ? a : b;
    printList(dummy.next);
    // </solve>
    return 0;
}
`,
      cpp: CPP_NODE + R`
int main() {
    int n, m;
    cin >> n >> m;
    Node *a = readList(n), *b = readList(m);
    // <solve>
    Node dummy(0), *tail = &dummy;
    while (a && b) {
        if (a->val <= b->val) { tail->next = a; a = a->next; }
        else { tail->next = b; b = b->next; }
        tail = tail->next;
    }
    tail->next = a ? a : b;
    printList(dummy.next);
    // </solve>
    return 0;
}
`,
      java: JAVA_NODE + R`
    public static void main(String[] args) {
        int n = in.nextInt(), m = in.nextInt();
        Node a = readList(n), b = readList(m);
        // <solve>
        Node dummy = new Node(0), tail = dummy;
        while (a != null && b != null) {
            if (a.val <= b.val) { tail.next = a; a = a.next; }
            else { tail.next = b; b = b.next; }
            tail = tail.next;
        }
        tail.next = (a != null) ? a : b;
        printList(dummy.next);
        // </solve>
    }
}
`,
      py: PY_NODE + R`

n, m = int(next(tokens)), int(next(tokens))
a = read_list(n)
b = read_list(m)
# <solve>
dummy = tail = Node(0)
while a and b:
    if a.val <= b.val:
        tail.next, a = a, a.next
    else:
        tail.next, b = b, b.next
    tail = tail.next
tail.next = a or b
print_list(dummy.next)
# </solve>
`,
    },
  },
  {
    id: 'linked-list-cycle', title: 'Linked List Cycle', module: 2, difficulty: 'Easy', tags: ['Linked list', 'Two pointers', 'PYQ'], source: 'LeetCode 141', link: 'https://leetcode.com/problems/linked-list-cycle/',
    blurb: 'Decide whether a list loops back on itself, using O(1) extra memory.',
    statement: R`A linked list may have a **cycle**: the last node's \`next\` points back to an earlier node instead of NULL. The list is built for you from the input. Print \`true\` if it has a cycle and \`false\` otherwise. Aim for O(1) extra memory.`,
    format: R`**Input:** n, then n integers, then an integer pos: the index (0-based) of the node the tail points back to, or −1 if the tail points to NULL.

**Output:** \`true\` or \`false\`.`,
    constraints: '- 1 ≤ n ≤ 1000\n- −1 ≤ pos < n',
    examples: [{ in: '4\n3 2 0 -4\n1\n', out: 'true\n', why: 'The tail (−4) points back to the node at index 1.' }, { in: '2\n1 2\n-1\n', out: 'false\n', why: 'The tail points to NULL.' }],
    more: ['1\n1\n0\n', '1\n1\n-1\n', '5\n1 2 3 4 5\n4\n', '6\n9 8 7 6 5 4\n0\n', '3\n1 2 3\n-1\n'],
    time: 'O(n)', space: 'O(1)',
    explain: R`Use **Floyd's tortoise and hare**. \`slow\` moves one node per step and \`fast\` two. If the list has no cycle, \`fast\` reaches NULL. If it has a cycle, both pointers get inside it and \`fast\` closes the gap by one node each step, so they must meet. This needs no visited set, so the space is O(1).`,
    pseudo: ['slow = fast = head', 'while fast != NULL and fast.next != NULL:', '  slow = slow.next; fast = fast.next.next', '  if slow == fast: return true', 'return false'],
    solution: {
      c: R`#include <stdio.h>
#include <stdlib.h>

typedef struct Node { int val; struct Node *next; } Node;

int main(void) {
    int n, pos;
    scanf("%d", &n);
    Node *nodes[1000];
    for (int i = 0; i < n; i++) {
        nodes[i] = malloc(sizeof(Node));
        scanf("%d", &nodes[i]->val);
        nodes[i]->next = NULL;
        if (i) nodes[i - 1]->next = nodes[i];
    }
    scanf("%d", &pos);
    if (pos >= 0) nodes[n - 1]->next = nodes[pos];
    Node *head = nodes[0];
    // <solve>
    Node *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) { printf("true\n"); return 0; }
    }
    printf("false\n");
    // </solve>
    return 0;
}
`,
      cpp: R`#include <iostream>
#include <vector>
using namespace std;

struct Node { int val; Node *next = nullptr; };

int main() {
    int n, pos;
    cin >> n;
    vector<Node *> nodes(n);
    for (int i = 0; i < n; i++) {
        nodes[i] = new Node;
        cin >> nodes[i]->val;
        if (i) nodes[i - 1]->next = nodes[i];
    }
    cin >> pos;
    if (pos >= 0) nodes[n - 1]->next = nodes[pos];
    Node *head = nodes[0];
    // <solve>
    Node *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) { cout << "true\n"; return 0; }
    }
    cout << "false\n";
    // </solve>
    return 0;
}
`,
      java: R`import java.util.*;

class Main {
    static class Node {
        int val; Node next;
        Node(int v) { val = v; }
    }

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        Node[] nodes = new Node[n];
        for (int i = 0; i < n; i++) {
            nodes[i] = new Node(in.nextInt());
            if (i > 0) nodes[i - 1].next = nodes[i];
        }
        int pos = in.nextInt();
        if (pos >= 0) nodes[n - 1].next = nodes[pos];
        Node head = nodes[0];
        // <solve>
        Node slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) { System.out.println("true"); return; }
        }
        System.out.println("false");
        // </solve>
    }
}
`,
      py: R`import sys


class Node:
    def __init__(self, val):
        self.val = val
        self.next = None


data = sys.stdin.read().split()
n = int(data[0])
nodes = [Node(int(v)) for v in data[1:1 + n]]
for i in range(1, n):
    nodes[i - 1].next = nodes[i]
pos = int(data[1 + n])
if pos >= 0:
    nodes[-1].next = nodes[pos]
head = nodes[0]
# <solve>
slow = fast = head
found = False
while fast and fast.next:
    slow = slow.next
    fast = fast.next.next
    if slow is fast:
        found = True
        break
print("true" if found else "false")
# </solve>
`,
    },
  },
  {
    id: 'remove-nth-from-end', title: 'Remove N-th Node From End', module: 2, difficulty: 'Medium', tags: ['Linked list', 'Two pointers'], source: 'LeetCode 19', link: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/',
    blurb: 'Delete the k-th node from the tail in a single pass.',
    statement: R`Remove the **k-th node from the end** of a singly linked list (k = 1 is the last node) and print the resulting list. Try to do it in **one pass** without computing the length first. If the list becomes empty, print an empty line.`,
    format: R`**Input:** n, then n integers, then k.

**Output:** the values of the remaining list separated by spaces.`,
    constraints: '- 1 ≤ k ≤ n ≤ 1000',
    examples: [{ in: '5\n1 2 3 4 5\n2\n', out: '1 2 3 5\n', why: 'The second node from the end is 4.' }, { in: '1\n1\n1\n', out: '\n', why: 'The only node is removed; the list is empty.' }],
    more: ['2\n1 2\n1\n', '2\n1 2\n2\n', '6\n10 20 30 40 50 60\n6\n', '6\n10 20 30 40 50 60\n3\n', '4\n7 7 7 7\n1\n'],
    time: 'O(n)', space: 'O(1)',
    explain: R`Use two pointers that are **k nodes apart**. Start both at a dummy node in front of the head. Move \`fast\` k steps ahead, then move both together until \`fast\` reaches the last node. Now \`slow\` stands just before the node to delete, so set \`slow.next = slow.next.next\`. The dummy node makes deleting the head a normal case. One pass: O(n).`,
    pseudo: ['dummy = new node; dummy.next = head', 'slow = fast = dummy', 'repeat k times: fast = fast.next', 'while fast.next != NULL: slow = slow.next; fast = fast.next', 'slow.next = slow.next.next', 'return dummy.next'],
    solution: {
      c: C_NODE + R`
int main(void) {
    int n, k;
    scanf("%d", &n);
    Node *head = readList(n);
    scanf("%d", &k);
    // <solve>
    Node dummy = {0, head}, *slow = &dummy, *fast = &dummy;
    for (int i = 0; i < k; i++) fast = fast->next;
    while (fast->next) { slow = slow->next; fast = fast->next; }
    slow->next = slow->next->next;
    printList(dummy.next);
    // </solve>
    return 0;
}
`,
      cpp: CPP_NODE + R`
int main() {
    int n, k;
    cin >> n;
    Node *head = readList(n);
    cin >> k;
    // <solve>
    Node dummy(0), *slow = &dummy, *fast = &dummy;
    dummy.next = head;
    for (int i = 0; i < k; i++) fast = fast->next;
    while (fast->next) { slow = slow->next; fast = fast->next; }
    slow->next = slow->next->next;
    printList(dummy.next);
    // </solve>
    return 0;
}
`,
      java: JAVA_NODE + R`
    public static void main(String[] args) {
        int n = in.nextInt();
        Node head = readList(n);
        int k = in.nextInt();
        // <solve>
        Node dummy = new Node(0), slow = dummy, fast = dummy;
        dummy.next = head;
        for (int i = 0; i < k; i++) fast = fast.next;
        while (fast.next != null) { slow = slow.next; fast = fast.next; }
        slow.next = slow.next.next;
        printList(dummy.next);
        // </solve>
    }
}
`,
      py: PY_NODE + R`

n = int(next(tokens))
head = read_list(n)
k = int(next(tokens))
# <solve>
dummy = Node(0)
dummy.next = head
slow = fast = dummy
for _ in range(k):
    fast = fast.next
while fast.next:
    slow = slow.next
    fast = fast.next
slow.next = slow.next.next
print_list(dummy.next)
# </solve>
`,
    },
  },
];
