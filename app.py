from fastapi import FastAPI
from graph_engine import GraphEngine

app = FastAPI()
graph = GraphEngine()

@app.post("/event")
def receive_event(event: dict):
    graph.add_event(event)
    return {"status": "received"}