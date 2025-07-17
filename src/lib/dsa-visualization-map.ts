const baseUrl = "https://www.cs.usfca.edu/~galles/visualization/";

const topicToUrlMap: { [key: string]: string } = {
    // Exact Matches
    "Trie": "Trie.html",
    "Heaps": "Heap.html",
    "Heap": "Heap.html",
    "Hashing": "Hashing.html",
    "Hash Table": "Hashing.html",
    "AVL Trees": "AVLtree.html",
    "Red-Black Trees": "RedBlack.html",
    "Splay Trees": "SplayTree.html",
    "B-Trees": "BTree.html",
    "B+ Trees": "BPlusTree.html",
    "Binomial Queue": "BinomialQueue.html",
    "Fibonacci Heap": "FibonacciHeap.html",
    "Disjoint Sets": "DisjointSets.html",
    "Leftist Heap": "LeftistHeap.html",
    "Skew Heap": "SkewHeap.html",
    "Recursive Factorial": "RecFact.html",
    "Towers of Hanoi": "RecHanoi.html",
    
    // Keyword-based Matches
    "Sorting": "ComparisonSort.html",
    "Sort": "ComparisonSort.html",
    "Binary Search": "Search.html",
    "Search": "Search.html",
    "Linked List": "LinkedList.html",
    "Stack": "StackArray.html",
    "Queue": "QueueArray.html",
    "Graph": "Graph.html",
    "Tree": "BST.html", // Default for generic trees
    "Binary Tree": "BST.html",
    "Binary Search Tree": "BST.html",
    "Recursion": "RecFact.html", // A reasonable default for recursion
    "Dynamic Programming": "DP/LCS.html", // Default to a common DP problem
};

const defaultUrl = "Algorithms.html";

/**
 * Gets the visualization URL for a given DSA topic.
 * @param topic The DSA topic string.
 * @returns A URL to a relevant visualization page.
 */
export function getVisualizationUrl(topic: string): string {
    const lowerTopic = topic.toLowerCase();
    
    // Check for an exact match first
    for (const key in topicToUrlMap) {
        if (key.toLowerCase() === lowerTopic) {
            return baseUrl + topicToUrlMap[key];
        }
    }
    
    // Check for keyword containment
    for (const key in topicToUrlMap) {
        if (lowerTopic.includes(key.toLowerCase())) {
            return baseUrl + topicToUrlMap[key];
        }
    }

    // Return the main algorithm page if no match is found
    return baseUrl + defaultUrl;
}
