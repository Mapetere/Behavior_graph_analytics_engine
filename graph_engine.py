class GraphEngine:
    def __init__(self):
        self.events = []
        self.last_screen = {}
        self.transitions = {}

    def add_event(self, event: dict):
        
        
        self.events.append(event)
        print("Event stored:", event)
