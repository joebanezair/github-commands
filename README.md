# SupportOps API + Analytics

A compact portfolio project that demonstrates practical **Node.js API development** and **Python data analysis** using a realistic IT support workflow.

## What it does

- Exposes a REST API for support tickets using Node.js and Express.
- Supports ticket creation, listing, status updates, and priority filtering.
- Stores demo data in memory so the project is easy to run and review.
- Includes a Python analytics script that summarizes ticket volume, status, priority, and average resolution time.

## Tech

- Node.js
- Express
- Python 3

## Run the API

```bash
npm install
npm start
```

API runs on `http://localhost:3000`.

### Example endpoints

```text
GET    /health
GET    /tickets
GET    /tickets?priority=high
POST   /tickets
PATCH  /tickets/:id/status
```

Example request body:

```json
{
  "title": "VPN access issue",
  "customer": "Acme Corp",
  "priority": "high"
}
```

## Run analytics

```bash
python analytics.py
```

## Why this project matters

This project mirrors a common support-engineering workflow: an API receives operational tickets while a lightweight analytics tool helps a team understand workload and service performance. It is intentionally small, readable, and interview-friendly.

## Next improvements

- Persist tickets in PostgreSQL or MongoDB
- Add authentication and role-based access
- Add automated tests and CI
- Add a React dashboard
