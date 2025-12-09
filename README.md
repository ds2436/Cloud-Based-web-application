# Carbon Estimator (Climatiq)

React + Node/Express demo that lets a user sign up/login (in-memory) and submit activities to the Climatiq estimate API. The backend proxies requests with your `CLIMATIQ_API_KEY` from `.env`.

## Prerequisites
- Node 18+
- Climatiq API key

## Setup
```bash
# Backend
cd backend
cp env.example .env   # fill CLIMATIQ_API_KEY (and optionally JWT_SECRET/PORT)
npm install
npm run dev

# Frontend (separate shell)
cd frontend
npm install
npm run dev
```

Backend defaults to `http://localhost:4000`, frontend to `http://localhost:5173`.

## Usage
1. Sign up with a username/password (stored in-memory for this session).
2. Login will store a JWT in `localStorage`.
3. Use the estimator form:
   - `activity_id` (e.g., `electricity-supply_grid-source_residual_mix`)
   - Optional `data_version` (e.g., `^21`)
   - Provide a parameter key/value pair (default `energy`) and its unit key/value (default `energy_unit` / `kWh`).
4. Results show CO2e and save to your history (per-user, stored locally at `backend/data/history.json`).

## Notes
- Auth and users are in-memory; restart clears users/sessions.
- Estimates history is persisted to a local JSON file (`backend/data/history.json`).
- API key is never exposed to the frontend; backend calls Climatiq.
- Adjust allowed origins in `backend/server.js` if you change the frontend port/host.

