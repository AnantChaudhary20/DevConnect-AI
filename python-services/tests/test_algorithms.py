import unittest

from algorithms import binary_search, knapsack_select, longest_common_subsequence, merge_sort
from analyzer import ResumeAnalyzer
from data_structures import Graph, Queue, Stack
from recommender import RecommendationEngine


class AlgorithmTests(unittest.TestCase):
    def test_merge_sort(self):
        self.assertEqual(merge_sort([5, 1, 4, 2, 3]), [1, 2, 3, 4, 5])

    def test_binary_search(self):
        self.assertEqual(binary_search([1, 3, 5, 7], 5), 2)
        self.assertEqual(binary_search([1, 3, 5, 7], 6), -1)

    def test_lcs(self):
        self.assertEqual(longest_common_subsequence("developer", "developer"), 9)
        self.assertEqual(longest_common_subsequence("abcde", "ace"), 3)

    def test_knapsack(self):
        items = [
            {"name": "DSA", "value": 10, "effort": 5},
            {"name": "React", "value": 7, "effort": 4},
            {"name": "Git", "value": 4, "effort": 2},
        ]
        selected = knapsack_select(items, 6)
        self.assertEqual([item["name"] for item in selected], ["React", "Git"])


class DataStructureTests(unittest.TestCase):
    def test_stack(self):
        stack = Stack()
        stack.push("a")
        stack.push("b")
        self.assertEqual(stack.pop(), "b")
        self.assertEqual(stack.pop(), "a")

    def test_queue(self):
        queue = Queue()
        queue.enqueue("a")
        queue.enqueue("b")
        self.assertEqual(queue.dequeue(), "a")
        self.assertEqual(queue.dequeue(), "b")

    def test_graph_bfs(self):
        graph = Graph()
        graph.add_edge("react", "javascript")
        graph.add_edge("javascript", "node.js")
        self.assertEqual(graph.bfs("react"), ["react", "javascript", "node.js"])


class IntelligenceTests(unittest.TestCase):
    def test_resume_analyzer(self):
        text = (
            "Python JavaScript React Node.js Express MongoDB Git DSA OOP REST API "
            "HTML CSS. Built projects using REST APIs and Git."
        )
        result = ResumeAnalyzer().analyze(text)
        self.assertGreaterEqual(result["score"], 50)
        self.assertIn("Python", result["matchedSkills"])
        self.assertIn("React", result["matchedSkills"])

    def test_recommendation_engine(self):
        candidates = [
            {"name": "A", "skills": ["React", "JavaScript"]},
            {"name": "B", "skills": ["Python"]},
        ]
        result = RecommendationEngine().recommend(["react"], candidates, 2)
        self.assertEqual(result[0]["user"]["name"], "A")
        self.assertGreater(result[0]["score"], 0)


if __name__ == "__main__":
    unittest.main()
