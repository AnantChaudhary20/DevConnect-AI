# DevConnect AI

> Full-stack developer networking platform with a separate Python intelligence service.

DevConnect AI is a portfolio project designed to demonstrate practical **Python + DSA + MERN + software engineering** skills in one product.

## Why this project is resume-worthy

Instead of keeping Python algorithms as disconnected coding exercises, this project connects them to actual product features:

- **Merge Sort** → ranks developer recommendations.
- **Binary Search** → searches the analyzer's sorted skill vocabulary.
- **Graph + BFS** → represents relationships between developer technologies.
- **Dynamic Programming / LCS** → compares skill-related text patterns.
- **0/1 Knapsack** → selects a high-value learning plan under a limited effort budget.
- **Stack / Queue** → demonstrates LIFO/FIFO processing inside the Python service.

The application also demonstrates authentication, REST APIs, MongoDB, file handling, OOP, validation, error handling, security middleware, testing and CI.

## Tech stack

### Frontend
- HTML5
- CSS3
- JavaScript (ES6+)
- React
- React Router
- Redux Toolkit
- Axios
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Cloudinary
- REST APIs

### Python
- Core Python
- OOP
- Modules
- Exception handling
- File handling
- Stack, Queue, Graph
- Recursion
- Merge Sort
- Binary Search
- Dynamic Programming: LCS + 0/1 Knapsack
- Standard-library HTTP service

### Engineering
- Git / GitHub
- VS Code
- GitHub Actions
- Unit testing
- Environment variables
- Security middleware
- Request validation

## Features

1. Signup and login with JWT.
2. Developer profiles and skills.
3. Follow/unfollow developers.
4. Developer connections.
5. Create, edit and delete projects.
6. Project image uploads.
7. Likes and bookmarks.
8. Project comments.
9. Feed, search, filters and pagination.
10. Explainable resume analyzer.
11. Skill-based developer recommendations.
12. Interactive DSA demonstration.
13. Python analysis history stored in JSON.
14. Node ↔ Python REST communication.
15. Health checks and error handling.

## Architecture

```text
                         ┌──────────────────────┐
                         │      React UI        │
                         │ HTML/CSS/JS/React    │
                         └──────────┬───────────┘
                                    │ Axios / REST
                                    ▼
                         ┌──────────────────────┐
                         │ Node + Express API   │
                         │ Auth / Projects /    │
                         │ Users / Comments     │
                         └──────┬─────────┬─────┘
                                │         │
                         MongoDB│         │REST
                                │         ▼
                                │  ┌───────────────────┐
                                │  │ Python Service    │
                                │  │ OOP / DSA / File  │
                                │  │ Analyzer / Recomm.│
                                │  └───────────────────┘
                                │
                                ▼
                         ┌──────────────────┐
                         │ MongoDB / Mongoose│
                         └──────────────────┘
```

## Project structure

```text
DevConnect-AI/
├── client/                 # React frontend
├── server/                 # Node + Express backend
├── python-services/        # Python intelligence service
├── docs/                   # Setup + interview documentation
├── postman/                # API workspace resources
├── scripts/                # Verification scripts
└── .github/workflows/      # CI pipeline
```

## Run it

**Complete beginner instructions:** read [`docs/SETUP_GUIDE_WINDOWS.md`](docs/SETUP_GUIDE_WINDOWS.md).

### Quick version

Terminal 1:

```bash
cd server
npm install
npm run dev
```

Terminal 2:

```bash
cd client
npm install
npm run dev
```

Terminal 3:

```bash
cd python-services
python service.py
```

Then open `http://localhost:5173`.

## Test it

Python:

```bash
cd python-services
python -m unittest discover -s tests -v
```

Backend checks:

```bash
cd server
npm run check
```

Frontend checks:

```bash
cd client
npm run check
```

## Resume positioning

See [`docs/RESUME_READY.md`](docs/RESUME_READY.md) for resume bullets and skill mapping.

See [`docs/INTERVIEW_GUIDE.md`](docs/INTERVIEW_GUIDE.md) for common interview questions about the architecture and algorithms.

## Security

Never commit:

- `server/.env`
- API keys
- MongoDB passwords
- Cloudinary secrets
- JWT secrets
- `node_modules`

`.gitignore` is already configured for these files.

## Honest project positioning

The resume analyzer is an **explainable ATS-style analyzer**, not a claim of a trained ML model. This is intentional: the scoring, skill matching and recommendations can be explained line-by-line in a technical interview.
