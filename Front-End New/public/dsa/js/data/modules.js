/* ============================================================
 * data/modules.js — the five modules of CS24201, in syllabus
 * order. `syllabus` is the text of the course information
 * sheet. `viz` lists the visualizers shown on the Visualize tab.
 * ============================================================ */
(function () {
  'use strict';
  window.DSA = window.DSA || {};
  DSA.COURSE = {
    code: 'CS24201', title: 'Data Structure and Algorithms', credits: 'L3 T0 P0', sem: 'Semester III · CSE',
    books: [
      { tag: 'T1', text: 'Sahni, Horowitz, Freed, Anderson: Fundamentals of Data Structures in C, 2nd ed., University Press' },
      { tag: 'R1', text: 'Reema Thareja: Data Structures Using C, 2nd ed., Oxford University Press' },
      { tag: 'R2', text: 'Tanenbaum, Langsam, Augenstein: Data Structures Using C, Pearson' },
    ],
  };
  DSA.modules = [
    {
      n: 1, hours: 5, title: 'Basics and analysis', long: 'Basics of data structures and algorithm analysis',
      syllabus: 'Basics of Data Structures and Algorithm, Time and Space Complexity, Asymptotic Notations, Time complexity analysis of non-recursive and recursive algorithms, Examples of multi-dimensional array, polynomial operations and sparse matrix.',
      blurb: 'What a data structure is, how to measure an algorithm, and the first structures built on arrays.',
      topics: ['ADT', 'Time & space complexity', 'Big O, Ω, Θ', 'Recurrences', 'Recursion', 'Arrays', 'Sparse matrix', 'Polynomials'],
      viz: [{ id: 'growth', label: 'Growth of functions', widget: true, blurb: 'Plot log n, n, n log n, n² and 2ⁿ together and see why the order of growth decides everything once n is large.' }, { id: 'array', label: 'Array' }, { id: 'recursion', label: 'Recursion' }, { id: 'sparse', label: 'Sparse matrix' }, { id: 'poly', label: 'Polynomials' }],
    },
    {
      n: 2, hours: 8, title: 'Linked lists', long: 'Singly, circular, doubly and multi-linked lists',
      syllabus: 'Singly Linked List: concept, representation and operations, Circular Linked List, Doubly Linked List, Multi-ply linked list and their Applications.',
      blurb: 'Dynamic structures built from nodes and pointers: every variant, every operation.',
      topics: ['Singly linked list', 'Circular list', 'Doubly linked list', 'Multi-linked list', 'Reversal', 'Cycle detection', 'Applications'],
      viz: [{ id: 'list', label: 'Linked list' }, { id: 'cycle', label: 'Cycle detection' }, { id: 'multilist', label: 'Multi-linked list' }],
    },
    {
      n: 3, hours: 10, title: 'Stacks and queues', long: 'Stack, queue, circular queue, variants and applications',
      syllabus: 'Stack: basic operations using Array and LL, Queue: basic operations using Array and LL, Circular Queue and Variants of Queue, Stack and Queue Applications.',
      blurb: 'LIFO and FIFO, with arrays and with lists, and what they are used for: expressions, brackets, Tower of Hanoi.',
      topics: ['Stack (array, LL)', 'Queue (array, LL)', 'Circular queue', 'Deque', 'Priority queue', 'Infix → postfix', 'Postfix evaluation', 'Tower of Hanoi'],
      viz: [{ id: 'stack', label: 'Stack' }, { id: 'queue', label: 'Queue' }, { id: 'deque', label: 'Deque' }, { id: 'pqueue', label: 'Priority queue' }, { id: 'infix', label: 'Infix → postfix' }, { id: 'postfix', label: 'Postfix evaluation' }, { id: 'parens', label: 'Balanced brackets' }, { id: 'hanoi', label: 'Tower of Hanoi' }],
    },
    {
      n: 4, hours: 7, title: 'Searching and sorting', long: 'Searching, hashing and sorting algorithms',
      syllabus: 'Binary Search, Hash Search, Selection Sort, Insertion Sort, Quick Sort, Merge Sort, Radix Sort, External Sorting: k-way merging approach, Analysis of Search and Sorting Algorithms.',
      blurb: 'Finding things fast and putting them in order, with the cost of every algorithm worked out.',
      topics: ['Linear & binary search', 'Hashing', 'Bubble', 'Selection', 'Insertion', 'Merge', 'Quick', 'Radix', 'Heap sort', 'External sorting'],
      viz: [{ id: 'sort', label: 'Sorting' }, { id: 'search', label: 'Searching' }, { id: 'hash', label: 'Hashing' }, { id: 'kway', label: 'k-way merge' }],
    },
    {
      n: 5, hours: 10, title: 'Trees and graphs', long: 'Binary search trees, balanced trees, heap, disjoint sets and graphs',
      syllabus: 'Basic concepts and terminologies of Binary Search Tree, Height Balanced Trees and Heap, Disjoint Set, Graph: concept and terminologies, Concept of Breadth First Search, Depth First Search, Spanning Tree.',
      blurb: 'Hierarchies and networks: BST and AVL, heaps, union-find, BFS, DFS and minimum spanning trees.',
      topics: ['BST', 'Tree traversals', 'AVL tree', 'Heap', 'Disjoint set', 'Graph terms', 'BFS', 'DFS', 'Spanning tree'],
      viz: [{ id: 'tree', label: 'BST and AVL' }, { id: 'heap', label: 'Heap' }, { id: 'dsu', label: 'Disjoint set' }, { id: 'graph', label: 'BFS, DFS, MST' }],
    },
  ];
})();
