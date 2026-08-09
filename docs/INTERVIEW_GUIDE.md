# DevConnect AI — Interview Guide

## 30-second explanation

"DevConnect AI is a developer networking platform I built with React, Node and Express on the main application side, MongoDB for persistence, and a separate Python service for career intelligence. Users can create profiles, publish projects, connect with developers, and use the AI Lab to analyze a resume or find compatible developers. I intentionally used Python fundamentals and DSA inside real product features: merge sort ranks recommendations, graph traversal models related skills, binary search supports skill lookup, and dynamic programming creates a constrained learning plan."

## Why two backends?

Node/Express handles the main web application and MongoDB operations. Python owns the intelligence and algorithmic logic. The services communicate through a small REST API. This separation keeps the product backend and algorithmic service independently understandable.

## Where is OOP?

`ResumeAnalyzer`, `RecommendationEngine` and `JsonFileStore` are classes with clear responsibilities.

## Where is exception handling?

The Python service catches JSON, validation, storage and unexpected exceptions. The Node service also has a global error middleware.

## Where is file handling?

`JsonFileStore` reads and writes analysis history to JSON using Python context managers and atomic temporary-file replacement.

## Where is recursion?

`merge_sort` recursively divides the list into smaller lists and merges them back together.

## Where is searching?

`binary_search` searches a sorted skill list in O(log n) time.

## Where is dynamic programming?

There are two examples:

1. LCS compares two strings using a DP table.
2. 0/1 knapsack selects the highest-value learning plan under a limited effort budget.

## Where is a graph?

The recommendation engine models relationships such as JavaScript → React and Node.js → Express. BFS is also implemented in the graph data structure.

## Why not just use JavaScript's `.sort()`?

Because the project is also a demonstration of algorithmic understanding. The ranking path deliberately uses the custom merge-sort implementation.

## How does authentication work?

The user logs in with email/password. The server verifies the password and issues a JWT. Protected routes require a Bearer token, which the middleware verifies before allowing access.

## How is security handled?

The project uses bcrypt password hashing, JWT authentication, Helmet, CORS configuration, request-size limits, rate limiting, validation and environment variables for secrets.

## What would you improve next?

A strong answer is:

"For the next iteration I would add a real search index, Redis caching, background jobs for resume processing, stronger integration tests, Docker-based deployment and observability. If the product required actual ML, I would replace the deterministic analyzer with a measured NLP pipeline and evaluate it against a labeled dataset."
