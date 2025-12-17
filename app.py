from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from graph_engine import GraphEngine

app = FastAPI()
graph = GraphEngine()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve tracker script
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.post("/event")
def receive_event(event: dict):
    graph.add_event(event)
    return {"status": "received"}

@app.get("/api/graph")
def get_graph():
    return graph.get_flow_graph()

@app.get("/api/hesitation")
def get_hesitation():
    return graph.analyze_hesitation()

@app.get("/api/dropoffs")
def get_dropoffs():
    return graph.detect_drop_offs()
