from collections import deque


class Stack:
    """Simple LIFO stack used by parsing workflows."""

    def __init__(self):
        self._items = []

    def push(self, item):
        self._items.append(item)

    def pop(self):
        if not self._items:
            raise IndexError("Cannot pop from an empty stack")
        return self._items.pop()

    def is_empty(self):
        return len(self._items) == 0


class Queue:
    """Simple FIFO queue implemented with deque."""

    def __init__(self):
        self._items = deque()

    def enqueue(self, item):
        self._items.append(item)

    def dequeue(self):
        if not self._items:
            raise IndexError("Cannot dequeue from an empty queue")
        return self._items.popleft()

    def is_empty(self):
        return len(self._items) == 0


class Graph:
    """Undirected adjacency-list graph for developer skill relationships."""

    def __init__(self):
        self.adjacency = {}

    def add_edge(self, first, second):
        self.adjacency.setdefault(first, set()).add(second)
        self.adjacency.setdefault(second, set()).add(first)

    def bfs(self, start):
        if start not in self.adjacency:
            return []

        visited = {start}
        queue = Queue()
        queue.enqueue(start)
        result = []

        while not queue.is_empty():
            node = queue.dequeue()
            result.append(node)

            for neighbour in sorted(self.adjacency.get(node, [])):
                if neighbour not in visited:
                    visited.add(neighbour)
                    queue.enqueue(neighbour)

        return result
