/* Module II problems, second set: linked lists. Lists are read before the `<solve>` marker with the helpers of m2.js. */
const R = String.raw;
const { C_NODE, CPP_NODE, JAVA_NODE, PY_NODE } = require('./m2.js').pre;
module.exports = [
  {
    id: 'palindrome-linked-list', title: 'Palindrome Linked List', module: 2, difficulty: 'Easy', tags: ['Linked list', 'Two pointers'], source: 'LeetCode 234', link: 'https://leetcode.com/problems/palindrome-linked-list/',
    blurb: 'Does the list read the same backwards? Check in O(n) time and O(1) space.',
    statement: R`Print \`true\` if a singly linked list is a **palindrome** (reads the same forwards and backwards), otherwise \`false\`.`,
    format: R`**Input:** n, then n integers (the list).

**Output:** \`true\` or \`false\`.`,
    constraints: '- 1 ≤ n ≤ 1000',
    examples: [{ in: '4\n1 2 2 1\n', out: 'true\n', why: '1 2 2 1 is symmetric.' }, { in: '2\n1 2\n', out: 'false\n', why: '1 2 reversed is 2 1.' }],
    more: ['1\n7\n', '5\n1 2 3 2 1\n', '5\n1 2 3 4 1\n', '6\n4 5 6 6 5 4\n', '3\n1 1 2\n'],
    time: 'O(n)', space: 'O(1)',
    explain: R`Copying the values into an array and comparing it with its reverse needs O(n) extra space. To use O(1): find the **middle** with slow and fast pointers, **reverse the second half** in place, then walk the first half and the reversed second half together comparing values. (Reverse the second half back if the list must stay unchanged.)`,
    pseudo: ['find the middle with slow and fast pointers', 'reverse the list from the middle onwards', 'p = head, q = head of the reversed half', 'while q != NULL: if p.val != q.val: print false; stop', '  p = p.next; q = q.next', 'print true'],
    solution: {
      c: C_NODE + R`
int main(void) {
    int n;
    scanf("%d", &n);
    Node *head = readList(n);
    // <solve>
    Node *slow = head, *fast = head;
    while (fast && fast->next) { slow = slow->next; fast = fast->next->next; }
    Node *prev = NULL, *cur = slow;
    while (cur) { Node *nx = cur->next; cur->next = prev; prev = cur; cur = nx; }
    int ok = 1;
    for (Node *p = head, *q = prev; q; p = p->next, q = q->next)
        if (p->val != q->val) { ok = 0; break; }
    printf(ok ? "true\n" : "false\n");
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
    while (fast && fast->next) { slow = slow->next; fast = fast->next->next; }
    Node *prev = nullptr, *cur = slow;
    while (cur) { Node *nx = cur->next; cur->next = prev; prev = cur; cur = nx; }
    bool ok = true;
    for (Node *p = head, *q = prev; q; p = p->next, q = q->next)
        if (p->val != q->val) { ok = false; break; }
    cout << (ok ? "true" : "false") << "\n";
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
        while (fast != null && fast.next != null) { slow = slow.next; fast = fast.next.next; }
        Node prev = null, cur = slow;
        while (cur != null) { Node nx = cur.next; cur.next = prev; prev = cur; cur = nx; }
        boolean ok = true;
        for (Node p = head, q = prev; q != null; p = p.next, q = q.next)
            if (p.val != q.val) { ok = false; break; }
        System.out.println(ok ? "true" : "false");
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
    slow, fast = slow.next, fast.next.next
prev, cur = None, slow
while cur:
    cur.next, prev, cur = prev, cur, cur.next
p, q, ok = head, prev, True
while q:
    if p.val != q.val:
        ok = False
        break
    p, q = p.next, q.next
print("true" if ok else "false")
# </solve>
`,
    },
  },
  {
    id: 'add-two-numbers', title: 'Add Two Numbers', module: 2, difficulty: 'Medium', tags: ['Linked list', 'Math'], source: 'LeetCode 2', link: 'https://leetcode.com/problems/add-two-numbers/',
    blurb: 'Add two numbers stored digit by digit in reverse order in linked lists, carrying as you go.',
    statement: R`Two non-negative integers are stored in two linked lists, **one digit per node, least significant digit first** (so 342 is the list 2 → 4 → 3). Print their sum in the same representation.`,
    format: R`**Input:** n₁, then n₁ digits (the first list), then n₂, then n₂ digits (the second list).

**Output:** the digits of the sum, least significant first, separated by spaces.`,
    constraints: '- 1 ≤ n₁, n₂ ≤ 100\n- every digit is 0 to 9; no leading zeros except the number 0 itself',
    examples: [{ in: '3\n2 4 3\n3\n5 6 4\n', out: '7 0 8\n', why: '342 + 465 = 807.' }, { in: '1\n0\n1\n0\n', out: '0\n', why: '0 + 0 = 0.' }],
    more: ['7\n9 9 9 9 9 9 9\n4\n9 9 9 9\n', '2\n5 5\n1\n5\n', '1\n1\n3\n9 9 9\n', '4\n1 2 3 4\n4\n9 8 7 6\n', '3\n0 0 1\n3\n0 0 9\n'],
    time: 'O(max(n₁, n₂))', space: 'O(max(n₁, n₂))',
    explain: R`Because the least significant digit comes first, the lists are already in the order in which schoolbook addition works. Walk both lists together: \`sum = a + b + carry\`, output \`sum % 10\`, and carry \`sum / 10\`. Continue while either list or the carry remains, so a final carry produces one extra digit. A **dummy head** node avoids a special case for the first output node.`,
    pseudo: ['dummy = new node; tail = dummy; carry = 0', 'while p != NULL or q != NULL or carry != 0:', '  sum = carry + (p ? p.val : 0) + (q ? q.val : 0)', '  append node(sum mod 10); carry = sum div 10', '  advance p and q if they exist', 'print dummy.next'],
    solution: {
      c: C_NODE + R`
int main(void) {
    int n1, n2;
    scanf("%d", &n1);
    Node *a = readList(n1);
    scanf("%d", &n2);
    Node *b = readList(n2);
    // <solve>
    Node dummy = {0, NULL}, *tail = &dummy;
    int carry = 0;
    while (a || b || carry) {
        int sum = carry + (a ? a->val : 0) + (b ? b->val : 0);
        tail->next = malloc(sizeof(Node));
        tail = tail->next;
        tail->val = sum % 10;
        tail->next = NULL;
        carry = sum / 10;
        if (a) a = a->next;
        if (b) b = b->next;
    }
    printList(dummy.next);
    // </solve>
    return 0;
}
`,
      cpp: CPP_NODE + R`
int main() {
    int n1, n2;
    cin >> n1;
    Node *a = readList(n1);
    cin >> n2;
    Node *b = readList(n2);
    // <solve>
    Node dummy(0), *tail = &dummy;
    int carry = 0;
    while (a || b || carry) {
        int sum = carry + (a ? a->val : 0) + (b ? b->val : 0);
        tail->next = new Node(sum % 10);
        tail = tail->next;
        carry = sum / 10;
        if (a) a = a->next;
        if (b) b = b->next;
    }
    printList(dummy.next);
    // </solve>
    return 0;
}
`,
      java: JAVA_NODE + R`
    public static void main(String[] args) {
        int n1 = in.nextInt();
        Node a = readList(n1);
        int n2 = in.nextInt();
        Node b = readList(n2);
        // <solve>
        Node dummy = new Node(0), tail = dummy;
        int carry = 0;
        while (a != null || b != null || carry != 0) {
            int sum = carry + (a != null ? a.val : 0) + (b != null ? b.val : 0);
            tail.next = new Node(sum % 10);
            tail = tail.next;
            carry = sum / 10;
            if (a != null) a = a.next;
            if (b != null) b = b.next;
        }
        printList(dummy.next);
        // </solve>
    }
}
`,
      py: PY_NODE + R`

n1 = int(next(tokens))
a = read_list(n1)
n2 = int(next(tokens))
b = read_list(n2)
# <solve>
dummy = tail = Node(0)
carry = 0
while a or b or carry:
    total = carry + (a.val if a else 0) + (b.val if b else 0)
    tail.next = Node(total % 10)
    tail = tail.next
    carry = total // 10
    a = a.next if a else None
    b = b.next if b else None
print_list(dummy.next)
# </solve>
`,
    },
  },
  {
    id: 'odd-even-linked-list', title: 'Odd Even Linked List', module: 2, difficulty: 'Medium', tags: ['Linked list', 'Pointers'], source: 'LeetCode 328', link: 'https://leetcode.com/problems/odd-even-linked-list/',
    blurb: 'Group the nodes at odd positions first, then the nodes at even positions, in place.',
    statement: R`Reorder a linked list so that all nodes at **odd positions** (1st, 3rd, 5th, …) come first, followed by all nodes at **even positions** (2nd, 4th, …). The relative order inside each group must be kept. Do it in place with O(1) extra space. Print the new list.`,
    format: R`**Input:** n, then n integers.

**Output:** the reordered list, separated by spaces.`,
    constraints: '- 1 ≤ n ≤ 1000',
    examples: [{ in: '5\n1 2 3 4 5\n', out: '1 3 5 2 4\n', why: 'Positions 1, 3, 5 first, then 2, 4.' }, { in: '7\n2 1 3 5 6 4 7\n', out: '2 3 6 7 1 5 4\n', why: 'Positions 1, 3, 5, 7 hold 2, 3, 6, 7; positions 2, 4, 6 hold 1, 5, 4.' }],
    more: ['1\n9\n', '2\n1 2\n', '4\n10 20 30 40\n', '6\n6 5 4 3 2 1\n', '3\n3 1 2\n'],
    time: 'O(n)', space: 'O(1)',
    explain: R`Keep two chains: \`odd\` starting at the first node and \`even\` starting at the second. Walk along relinking \`odd.next = even.next\` and \`even.next = odd.next\` alternately, so that the odd chain collects the odd positions and the even chain the even ones. Finally attach the head of the even chain to the tail of the odd chain. Every node is relinked once.`,
    pseudo: ['if list has fewer than 3 nodes: nothing to do', 'odd = head; even = head.next; evenHead = even', 'while even != NULL and even.next != NULL:', '  odd.next = even.next; odd = odd.next', '  even.next = odd.next; even = even.next', 'odd.next = evenHead'],
    solution: {
      c: C_NODE + R`
int main(void) {
    int n;
    scanf("%d", &n);
    Node *head = readList(n);
    // <solve>
    if (head && head->next) {
        Node *odd = head, *even = head->next, *evenHead = even;
        while (even && even->next) {
            odd->next = even->next;  odd = odd->next;
            even->next = odd->next;  even = even->next;
        }
        odd->next = evenHead;
    }
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
    if (head && head->next) {
        Node *odd = head, *even = head->next, *evenHead = even;
        while (even && even->next) {
            odd->next = even->next;  odd = odd->next;
            even->next = odd->next;  even = even->next;
        }
        odd->next = evenHead;
    }
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
        if (head != null && head.next != null) {
            Node odd = head, even = head.next, evenHead = even;
            while (even != null && even.next != null) {
                odd.next = even.next;  odd = odd.next;
                even.next = odd.next;  even = even.next;
            }
            odd.next = evenHead;
        }
        printList(head);
        // </solve>
    }
}
`,
      py: PY_NODE + R`

n = int(next(tokens))
head = read_list(n)
# <solve>
if head and head.next:
    odd, even = head, head.next
    even_head = even
    while even and even.next:
        odd.next = even.next
        odd = odd.next
        even.next = odd.next
        even = even.next
    odd.next = even_head
print_list(head)
# </solve>
`,
    },
  },
  {
    id: 'remove-linked-list-elements', title: 'Remove Linked List Elements', module: 2, difficulty: 'Easy', tags: ['Linked list', 'Dummy head'], source: 'LeetCode 203', link: 'https://leetcode.com/problems/remove-linked-list-elements/',
    blurb: 'Delete every node with a given value, including at the head, using a dummy node.',
    statement: R`Delete **every node whose value equals \`val\`** from a singly linked list and print the remaining list. The result is never empty in the tests.`,
    format: R`**Input:** n, then n integers, then \`val\`.

**Output:** the remaining list, separated by spaces.`,
    constraints: '- 1 ≤ n ≤ 1000',
    examples: [{ in: '7\n1 2 6 3 4 5 6\n6\n', out: '1 2 3 4 5\n', why: 'Both 6s are removed.' }, { in: '4\n7 7 7 8\n7\n', out: '8\n', why: 'Several nodes in a row at the head are removed.' }],
    more: ['3\n1 2 3\n9\n', '5\n4 1 4 2 4\n4\n', '2\n5 6\n5\n', '6\n1 1 2 2 3 3\n2\n', '1\n8\n7\n'],
    time: 'O(n)', space: 'O(1)',
    explain: R`Deleting the head is a special case with a plain pointer, because there is no node before it. A **dummy node** placed in front of the list removes that case: keep a pointer \`prev\` to the last node that stays; for each node, if its value is \`val\` unlink it (\`prev.next = cur.next\`), otherwise move \`prev\` forward. The answer is \`dummy.next\`.`,
    pseudo: ['dummy.next = head; prev = dummy', 'while prev.next != NULL:', '  if prev.next.val == val: prev.next = prev.next.next', '  else: prev = prev.next', 'print dummy.next'],
    solution: {
      c: C_NODE + R`
int main(void) {
    int n, val;
    scanf("%d", &n);
    Node *head = readList(n);
    scanf("%d", &val);
    // <solve>
    Node dummy = {0, head}, *prev = &dummy;
    while (prev->next) {
        if (prev->next->val == val) { Node *dead = prev->next; prev->next = dead->next; free(dead); }
        else prev = prev->next;
    }
    printList(dummy.next);
    // </solve>
    return 0;
}
`,
      cpp: CPP_NODE + R`
int main() {
    int n, val;
    cin >> n;
    Node *head = readList(n);
    cin >> val;
    // <solve>
    Node dummy(0), *prev = &dummy;
    dummy.next = head;
    while (prev->next) {
        if (prev->next->val == val) prev->next = prev->next->next;
        else prev = prev->next;
    }
    printList(dummy.next);
    // </solve>
    return 0;
}
`,
      java: JAVA_NODE + R`
    public static void main(String[] args) {
        int n = in.nextInt();
        Node head = readList(n);
        int val = in.nextInt();
        // <solve>
        Node dummy = new Node(0), prev = dummy;
        dummy.next = head;
        while (prev.next != null) {
            if (prev.next.val == val) prev.next = prev.next.next;
            else prev = prev.next;
        }
        printList(dummy.next);
        // </solve>
    }
}
`,
      py: PY_NODE + R`

n = int(next(tokens))
head = read_list(n)
val = int(next(tokens))
# <solve>
dummy = Node(0)
dummy.next = head
prev = dummy
while prev.next:
    if prev.next.val == val:
        prev.next = prev.next.next
    else:
        prev = prev.next
print_list(dummy.next)
# </solve>
`,
    },
  },
];
