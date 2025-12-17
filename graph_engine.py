import time
from collections import defaultdict

class GraphEngine:
    def __init__(self):
        # raw data
        self.sessions = defaultdict(list)
        # aggregated graph: source -> target -> count
        self.transitions = defaultdict(lambda: defaultdict(int))
        # page stats: url -> {visits: int, total_duration: float, bounces: int}
        self.page_stats = defaultdict(lambda: {"visits": 0, "total_duration": 0.0, "bounces": 0})
        
        # User thresholds
        self.HESITATION_THRESHOLD_SECONDS = 5.0 # If user stays idle/hovers for > 5s without meaningful action

    def add_event(self, event: dict):
        """
        Event structure:
        {
            "user_id": str,
            "type": "pageview" | "click" | "hesitation" | "leave",
            "url": str,
            "timestamp": float,
            "details": dict
        }
        """
        user_id = event.get("user_id")
        if not user_id:
            return

        # Add timestamp if missing
        if "timestamp" not in event:
            event["timestamp"] = time.time()
            
        session = self.sessions[user_id]
        
        # Calculate duration/transitions if this is not the first event
        if session:
            last_event = session[-1]
            time_diff = event["timestamp"] - last_event["timestamp"]
            
            # If moving from one page/screen to another
            if last_event.get("url") and event.get("url") and last_event["url"] != event["url"]:
                # Record transition
                src = last_event["url"]
                dst = event["url"]
                self.transitions[src][dst] += 1
                
                # Update duration for source page
                self.page_stats[src]["total_duration"] += time_diff

        # Update visit counts
        if event.get("type") == "pageview":
             url = event.get("url")
             if url:
                 self.page_stats[url]["visits"] += 1

        self.sessions[user_id].append(event)
        print(f"User {user_id}: {event['type']} on {event.get('url')}")

    def get_flow_graph(self):
        """Returns nodes and edges for the graph visualization"""
        nodes = []
        for url, stats in self.page_stats.items():
            nodes.append({
                "id": url,
                "label": url,
                "data": stats
            })
            
        edges = []
        for src, targets in self.transitions.items():
            for dst, count in targets.items():
                edges.append({
                    "source": src,
                    "target": dst,
                    "value": count
                })
        return {"nodes": nodes, "edges": edges}

    def analyze_hesitation(self):
        """
        Identify pages/steps where users hesitate.
        Hesitation score = Average time on page + Rage Click penalty
        """
        results = []
        for url, stats in self.page_stats.items():
            visits = stats["visits"]
            if visits > 0:
                avg_time = stats["total_duration"] / visits
                
                # Count rage clicks for this URL
                rage_clicks = 0
                for session in self.sessions.values():
                    for event in session:
                        if event.get("url") == url and event.get("type") == "hesitation" and event.get("details", {}).get("reason") == "rage_click":
                            rage_clicks += event.get("details", {}).get("count", 0)

                # Score calculation
                score_label = "Normal"
                if avg_time > self.HESITATION_THRESHOLD_SECONDS:
                    score_label = "Hesitating"
                if rage_clicks > (visits * 0.5): # If > 50% of visits have rage clicks (heuristic)
                    score_label = "Frustrated"

                results.append({
                    "url": url,
                    "avg_time": round(avg_time, 2),
                    "rage_clicks": rage_clicks,
                    "score": score_label,
                    "visits": visits
                })
        return sorted(results, key=lambda x: x["avg_time"], reverse=True)

    def detect_drop_offs(self):
        """
        Identify high drop-off points.
        Drop-off = Visits - Sum(Outgoing Transitions)
        """
        drop_offs = []
        for url, stats in self.page_stats.items():
            visits = stats["visits"]
            outgoing = sum(self.transitions[url].values())
            drop_count = visits - outgoing
            drop_rate = (drop_count / visits * 100) if visits > 0 else 0
            
            drop_offs.append({
                "url": url,
                "visits": visits,
                "drop_offs": drop_count,
                "drop_rate": round(drop_rate, 2)
            })
        return sorted(drop_offs, key=lambda x: x["drop_rate"], reverse=True)

