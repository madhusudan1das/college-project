# Airitson Render Deployment

Create a Render **Web Service** from this repository.

- Runtime: `Node`
- Build Command: `npm install`
- Start Command: `npm start`

The root `postinstall` script installs the backend dependencies, and the root
`start` script runs `backend/server.js`. The Express backend serves the files in
`fronted/`, so you only need one Render web service.

Add these environment variables in Render:

- `MONGO_URI`
- `JWT_SECRET`
- `GEMINI_API_KEY`
- `FIREBASE_SERVICE_ACCOUNT`

For `FIREBASE_SERVICE_ACCOUNT`, paste the full Firebase service account JSON as
one environment variable value. Keep `backend/serviceAccountKey.json` and `.env`
out of Git.
