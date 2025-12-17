# Implementation Plan - Behavior Analytics System (COMPLETED)

## 1. Backend (Python/FastAPI)
- [ ] **Fix & Enhance `graph_engine.py`**
    - [ ] Rename `track_user` to `add_event` or fix call site.
    - [ ] processing logic for "Hesitation" (dwell time, rage clicks, erratic mouse).
    - [ ] Graph building logic for user flows.
    - [ ] Drop-off detection (identifying high-exit nodes).
- [ ] **Update `app.py`**
    - [ ] Add CORS middleware (crucial for local web app dev).
    - [ ] Add endpoints for dashboard: `/api/graph`, `/api/hesitation`, `/api/dropoffs`.
    - [ ] Serve the `tracker.js` file statically.

## 2. Tracking SDK (JavaScript)
- [ ] **Create `static/tracker.js`**
    - [ ] Track `pageview`.
    - [ ] Track `click` (target element).
    - [ ] Track `mousemove` (sample to detect hesitation/idle).
    - [ ] Track `focus` on inputs.
    - [ ] Batch and send events to `http://localhost:8000/event`.

## 3. Frontend Dashboard (Next.js)
- [ ] **Initialize Next.js app** in `./dashboard`.
- [ ] **Design Interface**:
    - [ ] **Overview**: Top metrics (Active Users, Avg Hesitation Score).
    - [ ] **Flow Graph**: Visualization of user paths (using a library like `react-flow` or just CSS/SVG).
    - [ ] **Drop-off Alerts**: Highlight stages with >X% drop-off.
    - [ ] **Hesitation Heatmap/List**: Pages with highest hesitation.
