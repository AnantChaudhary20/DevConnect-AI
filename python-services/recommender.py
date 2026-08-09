from algorithms import merge_sort
from data_structures import Graph


class RecommendationEngine:
    """Ranks developers using transparent skill overlap and graph relationships."""

    def __init__(self):
        self.graph = Graph()
        self._build_skill_graph()

    def _build_skill_graph(self):
        relationships = [
            ("python", "django"), ("python", "fastapi"), ("python", "dsa"),
            ("javascript", "react"), ("javascript", "node.js"),
            ("node.js", "express"), ("react", "css"), ("mongodb", "express"),
            ("dsa", "algorithms"), ("algorithms", "data structures"),
        ]
        for first, second in relationships:
            self.graph.add_edge(first, second)

    @staticmethod
    def _normalise_skills(skills):
        return {
            str(skill).strip().lower()
            for skill in (skills or [])
            if str(skill).strip()
        }

    def recommend(self, current_skills, candidates, limit=5):
        wanted = self._normalise_skills(current_skills)
        results = []

        for candidate in candidates or []:
            candidate_skills = self._normalise_skills(candidate.get("skills", []))
            overlap = wanted.intersection(candidate_skills)
            related = set()

            for skill in candidate_skills:
                related.update(self.graph.adjacency.get(skill, set()))

            related_bonus = len(wanted.intersection(related)) * 2
            score = len(overlap) * 10 + related_bonus

            if score <= 0:
                continue

            results.append({
                "user": candidate,
                "score": score,
                "matchedSkills": sorted(overlap),
                "sharedSkillCount": len(overlap),
                "relatedSkillBonus": related_bonus,
                "missingSkills": sorted(wanted - candidate_skills),
            })

        results = merge_sort(results, key=lambda item: (-item["score"], item["user"].get("name", "")))
        return results[: max(1, min(int(limit), 20))]
