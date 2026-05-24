# AssetPilot

AssetPilot is a full-stack Asset Management and Maintenance System built with React, Node.js, Express.js, and SQLite. It helps manage assets, assignments, maintenance requests, repair logs, and dashboard metrics in one place.

## Features
- User registration and login.
- JWT authentication.
- Role-based access control.
- Asset creation, listing, update, and deletion.
- Asset assignment with duplicate-assignment protection.
- Maintenance request workflow.
- Maintenance comments and repair logs.
- Dashboard metrics and maintenance reminders.
- Search and filter assets.
- Responsive admin dashboard UI.

## Tech Stack
- Frontend: React
- Backend: Node.js, Express.js
- Database: SQLite
- Authentication: JWT

## Setup Steps

### Backend setup
1. Open the backend folder.
```bash
cd backend
```

2. Install dependencies.
```bash
npm install
```

3. Start the backend server.
```bash
npm run dev
```

### Frontend setup
1. Open the frontend folder.
```bash
cd frontend
```

2. Install dependencies.
```bash
npm install
```

3. Start the frontend app.
```bash
npm start
```

## NPM Commands

### Backend
```bash
npm install
npm run dev
```

### Frontend
```bash
npm install
npm start

### Seed demo data once
Temporarily add this line in `backend/server.js`:
```js
require('./utils/seed');
```

Start the backend once, then remove that line so data does not duplicate on every restart.

## Demo Accounts

Use these sample accounts after seeding:

- Admin: `admin@assetpilot.com` / `admin123`
- Agent: `agent@assetpilot.com` / `agent123`
- Employee: `employee@assetpilot.com` / `employee123`
