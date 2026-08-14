# DevConnect AI production setup

## Node API
Root Directory: `server`\nBuild: `npm install`\nStart: `npm start`

Set `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, `PYTHON_SERVICE_URL`, Cloudinary variables, and the email variables shown in `server/.env.example`.

## Python service
Root Directory: `python-services`\nBuild: `pip install -r requirements.txt`\nStart: `python service.py`

## Client
Root Directory: `client`\nBuild: `npm install && npm run build`\nPublish: `dist`\nSet `VITE_API_URL` to the Node API URL ending with `/api`.

## Email verification
Gmail SMTP requires an App Password for the `EMAIL_PASS` value. New accounts receive a six-digit code that expires in 15 minutes. Existing accounts remain usable so they are not locked out by the migration.

## Render rewrite
For the React Static Site, add rewrite `/*` -> `/index.html`.
