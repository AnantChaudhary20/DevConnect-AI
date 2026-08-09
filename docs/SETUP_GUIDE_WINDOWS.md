# DevConnect AI — Beginner Setup Guide (Windows)

This guide assumes you have never run a full-stack project before.

## What you are starting

DevConnect AI has **three small programs**:

1. **React** — the website you see in the browser.
2. **Node + Express** — the main backend/API.
3. **Python** — the intelligence/DSA service.

MongoDB stores users/projects. Cloudinary stores uploaded images.

You will keep **three Command Prompt/PowerShell windows open**.

---

## Step 1 — Install the software

Install these programs first:

- Node.js 20 LTS or newer
- Python 3.10 or newer
- Git
- VS Code

After installing, open Command Prompt and type each command separately:

```text
node --version
npm --version
python --version
git --version
```

If each command prints a version number, you are ready.

If `python` does not work on Windows, try:

```text
py --version
```

---

## Step 2 — Open the project

1. Download and unzip `DevConnect-AI`.
2. Open the unzipped folder.
3. Right-click inside the folder.
4. Choose **Open in Terminal**.

You should see folders named:

```text
client
server
python-services
```

---

## Step 3 — Create MongoDB

The easiest beginner option is MongoDB Atlas.

1. Create a free MongoDB Atlas account.
2. Create a free cluster.
3. Create a database user and password.
4. Allow your current IP address in Network Access.
5. Click **Connect → Drivers**.
6. Copy the connection string.

It will look similar to:

```text
mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/devconnect
```

Keep it private. Do not put your password on GitHub.

---

## Step 4 — Create Cloudinary (optional until you upload images)

Cloudinary is used for profile and project images.

Create a free account and copy:

- Cloud name
- API key
- API secret

Keep the API secret private.

---

## Step 5 — Create the Node environment file

Open:

```text
server/.env.example
```

Make a copy in the same folder and rename the copy to:

```text
.env
```

So you now have:

```text
server/.env
```

Open `.env` and replace the placeholder values.

Example:

```env
PORT=3000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=YOUR_MONGODB_CONNECTION_STRING
JWT_SECRET=make-this-a-long-random-secret
CLOUDINARY_CLOUD_NAME=YOUR_CLOUD_NAME
CLOUDINARY_API_KEY=YOUR_API_KEY
CLOUDINARY_API_SECRET=YOUR_API_SECRET
PYTHON_SERVICE_URL=http://127.0.0.1:8000
```

Do **not** upload this file to GitHub.

---

## Step 6 — Create the React environment file

Open:

```text
client/.env.example
```

Make a copy named:

```text
client/.env
```

Put this inside:

```env
VITE_API_URL=http://localhost:3000/api
```

---

## Step 7 — Install Node packages

Open Terminal Window #1.

Go into the backend:

```text
cd server
```

Install packages:

```text
npm install
```

Wait until it finishes.

Now open Terminal Window #2.

Go into the frontend:

```text
cd client
```

Install packages:

```text
npm install
```

Wait until it finishes.

---

## Step 8 — Start Python

Open Terminal Window #3.

Go to the Python folder:

```text
cd python-services
```

Start it:

```text
python service.py
```

If Windows needs `py`, use:

```text
py service.py
```

You should see something similar to:

```text
DevConnect AI Python service running at http://127.0.0.1:8000
```

**Do not close this window.**

Test it by opening this in your browser:

```text
http://127.0.0.1:8000/health
```

You should see JSON containing:

```text
"status": "healthy"
```

---

## Step 9 — Start Node/Express

Go back to Terminal Window #1.

You should still be inside:

```text
server
```

Run:

```text
npm run dev
```

You should see:

```text
Node API running at http://localhost:3000
```

Also test:

```text
http://localhost:3000/api/health
```

You should see:

```text
"status": "healthy"
```

**Do not close this window.**

---

## Step 10 — Start React

Go to Terminal Window #2.

You should still be inside:

```text
client
```

Run:

```text
npm run dev
```

Vite will show a local URL, normally:

```text
http://localhost:5173
```

Open that URL in Chrome.

---

# Your project is now running

You should have:

| Program | URL | Terminal |
|---|---|---|
| React | http://localhost:5173 | #2 |
| Node API | http://localhost:3000 | #1 |
| Python | http://127.0.0.1:8000 | #3 |
| MongoDB | Cloud service | — |

---

# Step 11 — Test the website

Do these in order:

1. Open the React URL.
2. Create an account.
3. Log in.
4. Open your profile.
5. Add your skills.
6. Create a project.
7. Open the project.
8. Like it.
9. Bookmark it.
10. Add a comment.
11. Follow another developer account.
12. Open **AI Lab**.
13. Paste resume text.
14. Click **Analyze Resume**.
15. Click **Find Developers**.
16. Click **Run Algorithms**.

If these work, you have demonstrated the main project features.

---

# Step 12 — Run Python tests

Open another terminal and run:

```text
cd python-services
python -m unittest discover -s tests -v
```

You want to see:

```text
OK
```

---

# Step 13 — Check the backend code

From the project root:

```text
cd server
npm run check
```

You want every check to say `PASS`.

---

# Step 14 — Check the React production build

From the project root:

```text
cd client
npm run check
```

This runs ESLint and creates a production build.

---

# Step 15 — Stop everything

In each terminal press:

```text
Ctrl + C
```

That stops the program in that terminal.

---

# The next time you want to run it

You do **not** need to create MongoDB again or install packages again.

Just open three terminals and run:

### Terminal 1
```text
cd server
npm run dev
```

### Terminal 2
```text
cd client
npm run dev
```

### Terminal 3
```text
cd python-services
python service.py
```

Then open:

```text
http://localhost:5173
```

---

# If something goes wrong

### Error: `MONGO_URI is missing`

Your `server/.env` is missing or named incorrectly.

It must be:

```text
server/.env
```

not:

```text
server/.env.txt
```

### Error: Python service offline

Start:

```text
cd python-services
python service.py
```

### Error: `npm` is not recognized

Install Node.js, then close and reopen your terminal.

### Error: `python` is not recognized

Install Python and enable **Add Python to PATH** during installation. On Windows you can also try `py service.py`.

### Browser says the page cannot be reached

Make sure the React terminal is running and open the exact URL printed by Vite.

### Login fails

Check the Node terminal first. If it says MongoDB connection failed, fix `MONGO_URI`.

### Image upload fails

Check the three Cloudinary values in `server/.env`. The rest of the application can still be demonstrated without uploading images.
