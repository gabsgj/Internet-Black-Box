import React, { useEffect, useRef, useState } from 'react';
import Graph from 'graphology';
import Sigma from 'sigma';
import type { IncidentGraph, GraphNode } from '../types';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Info,
  User,
  Activity,
  AlertTriangle,
  Server,
  FileCode,
  X
} from 'lucide-react';

interface GraphPanelProps {
  graphData: IncidentGraph;
}

export const GraphPanel: React.FC<GraphPanelProps> = ({ graphData }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sigmaRef = useRef<Sigma | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  useEffect(() => {
    if (!containerRef.current || !graphData || graphData.nodes.length === 0) return;

    // 1. Create a Directed Graph instance
    const graph = new Graph({ type: 'directed', multi: true });

    // 2. Add nodes with visual attributes
    graphData.nodes.forEach((node) => {
      // Determine node visual properties based on type
      let size = node.size || 12;
      let color = node.color || '#94a3b8';

      switch (node.type) {
        case 'Incident':
          size = 22;
          color = '#f97316'; // Orange
          break;
        case 'System':
          size = 18;
          color = '#ef4444'; // Red
          break;
        case 'Person':
          size = 15;
          color = '#06b6d4'; // Cyan
          break;
        case 'Event': {
          size = 13;
          // Color based on source or severity
          const severity = node.properties?.severity;
          if (severity === 'CRITICAL') {
            color = '#ec4899'; // Pink
          } else if (severity === 'WARNING') {
            color = '#f59e0b'; // Amber
          } else {
            color = '#eab308'; // Yellow
          }
          break;
        }
        case 'File':
          size = 11;
          color = '#64748b'; // Slate
          break;
      }

      // Default position if not provided
      const x = node.x !== undefined ? node.x : (Math.random() - 0.5) * 300;
      const y = node.y !== undefined ? node.y : (Math.random() - 0.5) * 300;

      if (!graph.hasNode(node.id)) {
        graph.addNode(node.id, {
          label: node.label,
          type: node.type,
          properties: node.properties,
          size,
          color,
          x,
          y,
        });
      }
    });

    // 3. Add edges
    graphData.edges.forEach((edge) => {
      if (graph.hasNode(edge.source) && graph.hasNode(edge.target)) {
        // Determine edge color based on relationship type
        let color = '#334155'; // default dark gray
        if (edge.type === 'CAUSED_BY') color = '#f97316';
        if (edge.type === 'TRIGGERED') color = '#f59e0b';
        if (edge.type === 'DEPLOYED_TO') color = '#10b981';
        if (edge.type === 'AFFECTED') color = '#ef4444';

        graph.addEdge(edge.source, edge.target, {
          type: 'arrow',
          label: edge.type,
          size: edge.type === 'CAUSED_BY' ? 3 : 1.5,
          color,
        });
      }
    });

    // 4. Instantiate Sigma renderer
    const renderer = new Sigma(graph, containerRef.current, {
      renderEdgeLabels: true,
      defaultEdgeType: 'arrow',
      labelColor: { color: '#94a3b8' },
      labelFont: 'ui-sans-serif, system-ui',
      labelSize: 11,
      edgeLabelSize: 9,
      edgeLabelFont: 'ui-monospace, monospace',
      edgeLabelColor: { color: '#64748b' },
    });

    sigmaRef.current = renderer;

    // 5. Handle node interactions
    renderer.on('clickNode', ({ node }) => {
      const nodeData = graphData.nodes.find((n) => n.id === node);
      if (nodeData) {
        setSelectedNode(nodeData);
      }
    });

    renderer.on('clickStage', () => {
      setSelectedNode(null);
    });

    // Clean up on unmount
    return () => {
      renderer.kill();
      sigmaRef.current = null;
    };
  }, [graphData]);

  // Viewport action handlers
  const handleZoomIn = () => {
    if (sigmaRef.current) {
      const camera = sigmaRef.current.getCamera();
      camera.animatedZoom({ duration: 250 });
    }
  };

  const handleZoomOut = () => {
    if (sigmaRef.current) {
      const camera = sigmaRef.current.getCamera();
      camera.animatedUnzoom({ duration: 250 });
    }
  };

  const handleReset = () => {
    if (sigmaRef.current) {
      const camera = sigmaRef.current.getCamera();
      camera.animatedReset({ duration: 250 });
      setSelectedNode(null);
    }
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'Person':
        return <User className="text-cyan-400" size={18} />;
      case 'Incident':
        return <AlertTriangle className="text-orange-500" size={18} />;
      case 'System':
        return <Server className="text-rose-500" size={18} />;
      case 'File':
        return <FileCode className="text-slate-400" size={18} />;
      default:
        return <Activity className="text-amber-400" size={18} />;
    }
  };

  return (
    <div className="glass border border-slate-900 rounded-xl overflow-hidden h-[500px] flex relative">
      {/* Controls Overlay */}
      <div className="absolute top-4 left-4 z-10 flex flex-col space-y-1.5">
        <button
          onClick={handleZoomIn}
          className="p-2 bg-slate-950 border border-slate-900 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors"
          title="Zoom In"
        >
          <ZoomIn size={16} />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 bg-slate-950 border border-slate-900 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut size={16} />
        </button>
        <button
          onClick={handleReset}
          className="p-2 bg-slate-950 border border-slate-900 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors"
          title="Reset View"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-10 bg-slate-950/80 border border-slate-900/50 rounded-lg p-3 text-[10px] space-y-1.5 backdrop-blur-sm">
        <span className="font-semibold text-slate-400 uppercase tracking-wider block mb-1">
          Graph Legend
        </span>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#f97316]" />
          <span className="text-slate-300">Incident</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
          <span className="text-slate-300">System (Service)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#06b6d4]" />
          <span className="text-slate-300">Person (Developer)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
          <span className="text-slate-300">Event (Slack/GitHub)</span>
        </div>
      </div>

      {/* Canvas container */}
      <div ref={containerRef} className="flex-grow bg-slate-950/50 w-full h-full" />

      {/* Node Details Sidebar Draw Panel */}
      {selectedNode && (
        <div className="w-80 border-l border-slate-900 bg-slate-950/95 backdrop-blur-md p-5 flex flex-col h-full overflow-y-auto absolute right-0 top-0 z-20 animate-in slide-in-from-right duration-250">
          <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
            <div className="flex items-center space-x-2">
              {getNodeIcon(selectedNode.type)}
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {selectedNode.type} Details
              </span>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-slate-500 hover:text-slate-300 p-1 hover:bg-slate-900 rounded-lg transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <h4 className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Label</h4>
              <p className="text-slate-200 font-semibold text-sm leading-snug">{selectedNode.label}</p>
            </div>

            <div>
              <h4 className="text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">Properties</h4>
              <div className="bg-slate-900/60 border border-slate-900/80 rounded-lg p-3 space-y-2.5 font-mono text-[11px] text-slate-300">
                {Object.entries(selectedNode.properties).map(([key, val]) => {
                  if (typeof val === 'object' && val !== null) {
                    return (
                      <div key={key} className="space-y-1">
                        <span className="text-orange-400 block">{key}:</span>
                        <pre className="text-[10px] text-slate-400 overflow-x-auto whitespace-pre-wrap pl-2 border-l border-slate-800">
                          {JSON.stringify(val, null, 2)}
                        </pre>
                      </div>
                    );
                  }
                  return (
                    <div key={key} className="flex justify-between flex-wrap gap-1">
                      <span className="text-orange-400">{key}:</span>
                      <span className="text-slate-200 text-right max-w-full break-all">{String(val)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-900 text-slate-500 flex items-start space-x-2 text-[10px]">
              <Info size={12} className="mt-0.5 flex-shrink-0" />
              <span>
                Relationships in this graph represent the causal path reconstructed by the AI incident analysis pipeline.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
