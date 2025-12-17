# Behavior Analytics System

This system tracks user behavior (hesitation, drop-offs, steps) to detect "lack of faith" or UX issues.

## Components

1.  **Backend (`app.py`, `graph_engine.py`)**: FastAPI server that ingests events, analyzes them, and serves text/JSON APIs.
2.  **Dashboard (`dashboard/`)**: Next.js application to visualize the analytics.
3.  **Tracker SDK (`static/tracker.js`)**: JavaScript snippet to embed in your target website.

## Setup & Running

### 1. Start the Backend
```bash
pip install fastapi uvicorn
uvicorn app:app --reload
```
The backend runs on `http://localhost:8000`.

### 2. Start the Dashboard
```bash
cd dashboard
npm install
npm run dev
```
The dashboard runs on `http://localhost:3000`.

### 3. Integrate Tracking
Add this script tag to the `<head>` or `<body>` of the website you want to track:
```html
<script src="http://localhost:8000/static/tracker.js"></script>
```

## Features
- **Hesitation Detection**: Tracks idle time and "rage clicks" to identify frustration.
- **Drop-off Analysis**: visualizes where users engage vs where they leave.
- **Flow Graph**: Shows the paths users take through the site.
