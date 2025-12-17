<<<<<<< HEAD
# Behavior Analytics System
=======
# Behavior_graph_analytics_engine
A full analytics engine that can chew on user behavior events, model patterns, and visualize journeys through an app. 
It ia a living, breathing map of how people navigate.
>>>>>>> 51fea1f8d6983e86c353070ed862c2474273f3d5

This system tracks user behavior (hesitation, drop-offs, steps) to detect "lack of faith" or UX issues.

<<<<<<< HEAD
## Components
=======
The engine doesn't need to know all possible transitions ahead of time.It generates them on demand as users move.
#Real behavior defines the map, not assumptions.#

For development purposes, it currently just feeds logs from a mock mobile app or website which I generate  (for now), and it builds:
>>>>>>> 51fea1f8d6983e86c353070ed862c2474273f3d5

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
