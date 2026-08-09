import re
from datetime import datetime, timezone

from algorithms import binary_search, knapsack_select, merge_sort
from data_structures import Stack
from exceptions import ValidationError
from file_handler import JsonFileStore


ROLE_SKILLS = {
    "full stack developer": [
        ("Python", 9), ("JavaScript", 9), ("React", 8), ("Node.js", 8),
        ("Express", 7), ("MongoDB", 7), ("Git", 6), ("DSA", 8),
        ("REST API", 7), ("OOP", 6), ("SQL", 6), ("HTML", 5), ("CSS", 5)
    ],
    "software engineer": [
        ("Python", 9), ("DSA", 10), ("OOP", 8), ("Git", 7), ("JavaScript", 7),
        ("SQL", 7), ("REST API", 7), ("Testing", 6), ("Algorithms", 9),
        ("Data Structures", 9)
    ],
    "backend developer": [
        ("Python", 9), ("Node.js", 8), ("Express", 8), ("MongoDB", 7),
        ("SQL", 7), ("REST API", 9), ("Git", 6), ("OOP", 8), ("Testing", 6)
    ],
}


class ResumeAnalyzer:
    """Deterministic ATS-style analyzer; intentionally explainable rather than fake AI."""

    def __init__(self, history_store=None):
        self.history_store = history_store

    @staticmethod
    def _normalise(text):
        return re.sub(r"\s+", " ", (text or "").strip()).lower()

    def _extract_skills(self, text):
        normalized = self._normalise(text)
        found = []

        all_skills = sorted(
            {skill for skills in ROLE_SKILLS.values() for skill, _ in skills},
            key=str.lower,
        )

        # Binary search is used on the sorted skill list.
        for skill in all_skills:
            if binary_search([s.lower() for s in all_skills], skill.lower()) != -1:
                pattern = r"(?<![a-z0-9])" + re.escape(skill.lower()) + r"(?![a-z0-9])"
                if re.search(pattern, normalized):
                    found.append(skill)

        return merge_sort(found)

    def analyze(self, resume_text, target_role="full stack developer"):
        if not isinstance(resume_text, str) or len(resume_text.strip()) < 80:
            raise ValidationError("Resume text must contain at least 80 characters.")

        role = target_role.strip().lower()
        if role not in ROLE_SKILLS:
            role = "full stack developer"

        required = ROLE_SKILLS[role]
        found = self._extract_skills(resume_text)

        # Stack demonstrates LIFO processing of extracted terms.
        stack = Stack()
        for skill in found:
            stack.push(skill)

        discovered = []
        while not stack.is_empty():
            discovered.append(stack.pop())
        discovered.reverse()

        matched = []
        missing = []
        for skill, weight in required:
            if skill.lower() in {item.lower() for item in discovered}:
                matched.append({"skill": skill, "weight": weight})
            else:
                missing.append({"skill": skill, "weight": weight})

        total_weight = sum(weight for _, weight in required) or 1
        score = round(sum(item["weight"] for item in matched) / total_weight * 100)

        # Use knapsack to produce a practical learning plan within 10 effort units.
        learning_items = [
            {
                "name": item["skill"],
                "value": item["weight"],
                "effort": max(1, 11 - item["weight"]),
            }
            for item in missing
        ]
        recommendations = knapsack_select(learning_items, 10)

        result = {
            "targetRole": role,
            "score": score,
            "matchedSkills": [item["skill"] for item in matched],
            "missingSkills": [item["skill"] for item in missing],
            "recommendedNextSkills": [item["name"] for item in recommendations],
            "generatedAt": datetime.now(timezone.utc).isoformat(),
        }

        if self.history_store:
            self.history_store.append(result)

        return result
