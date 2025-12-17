"use client";

import { useEffect, useState } from 'react';
import ReactFlow, { Background, Controls, MiniMap, Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import { Activity, AlertTriangle, ArrowRight, MousePointer2 } from 'lucide-react';

const API_BASE = "http://localhost:8000/api";

export default function Dashboard() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [hesitationData, setHesitationData] = useState<any[]>([]);
  const [dropoffData, setDropoffData] = useState<any[]>([]);

  useEffect(() => {
    // Fetch Graph Data
    fetch(`${API_BASE}/graph`)
      .then(res => res.json())
      .then(data => {
        // Transform backend nodes to ReactFlow nodes
        const flowNodes = data.nodes.map((n: any, idx: number) => ({
          id: n.id,
          position: { x: 250 * (idx % 3), y: 100 * Math.floor(idx / 3) },
          data: { label: `${n.label} (${n.data.visits} visits)` },
          style: { background: '#1e1e1e', color: '#fff', border: '1px solid #333', borderRadius: '8px', padding: '10px' }
        }));

        const flowEdges = data.edges.map((e: any, idx: number) => ({
          id: `e-${idx}`,
          source: e.source,
          target: e.target,
          label: `${e.value}`,
          animated: true,
          style: { stroke: '#fff' }
        }));

        setNodes(flowNodes);
        setEdges(flowEdges);
      });

    // Fetch Hesitation
    fetch(`${API_BASE}/hesitation`)
      .then(res => res.json())
      .then(data => setHesitationData(data));

    // Fetch Dropoffs
    fetch(`${API_BASE}/dropoffs`)
      .then(res => res.json())
      .then(data => setDropoffData(data));

  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Behavior Analytics Engine
          </h1>
          <p className="text-zinc-400">Tracking user faith and hesitation signals.</p>
        </div>
        <div className="text-right">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-900 text-green-300">
            System Active
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

        {/* Hesitation Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <MousePointer2 className="w-5 h-5 text-yellow-400" />
            Hesitation Leaderboard
          </h2>
          <div className="overflow-auto max-h-64">
            <table className="w-full text-sm text-left">
              <thead className="text-zinc-500 border-b border-zinc-800">
                <tr>
                  <th className="pb-2">Page</th>
                  <th className="pb-2">Avg Time</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {hesitationData.map((item, idx) => (
                  <tr key={idx} className="border-b border-zinc-800/50">
                    <td className="py-2 truncate max-w-[150px]">{item.url}</td>
                    <td className="py-2">{item.avg_time}s</td>
                    <td className="py-2">
                      <span className={`px-2 py-0.5 rounded text-xs ${item.score === 'Frustrated' ? 'bg-red-900 text-red-200' :
                          item.score === 'Hesitating' ? 'bg-yellow-900 text-yellow-200' :
                            'bg-zinc-800 text-zinc-300'
                        }`}>
                        {item.score}
                      </span>
                    </td>
                  </tr>
                ))}
                {hesitationData.length === 0 && (
                  <tr><td colSpan={3} className="py-4 text-center text-zinc-500">No data yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Drop Off Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            Top Drop-offs
          </h2>
          <div className="overflow-auto max-h-64">
            {dropoffData.slice(0, 5).map((item, idx) => (
              <div key={idx} className="mb-3 p-3 bg-zinc-950 rounded border border-zinc-800 flex justify-between items-center">
                <div>
                  <div className="font-medium truncate max-w-[200px]">{item.url}</div>
                  <div className="text-xs text-zinc-500">{item.visits} visits</div>
                </div>
                <div className="text-right">
                  <div className="text-red-400 font-bold">{item.drop_rate}%</div>
                  <div className="text-xs text-zinc-600">Drop Rate</div>
                </div>
              </div>
            ))}
            {dropoffData.length === 0 && (
              <div className="py-4 text-center text-zinc-500">No drop-offs detected</div>
            )}
          </div>
        </div>

        {/* Activity Summary */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
            System Status
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-zinc-950 rounded border border-zinc-800">
              <div className="text-sm text-zinc-500">Total Graph Nodes</div>
              <div className="text-2xl font-bold">{nodes.length}</div>
            </div>
            <div className="p-4 bg-zinc-950 rounded border border-zinc-800">
              <div className="text-sm text-zinc-500">Tracked Transitions</div>
              <div className="text-2xl font-bold">{edges.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Flow Graph */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-1 h-[500px] overflow-hidden">
        <div className="p-4 border-b border-zinc-800 mb-0">
          <h2 className="text-xl font-semibold">User Flow Map</h2>
        </div>
        <div className="h-full w-full bg-zinc-950">
          <ReactFlow nodes={nodes} edges={edges}>
            <Background color="#333" gap={16} />
            <Controls />
            <MiniMap style={{ background: '#111', border: '1px solid #333' }} />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}
