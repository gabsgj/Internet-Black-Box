import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  AlertTriangle, 
  Clock, 
  Sparkles, 
  GitBranch, 
  MessageSquare, 
  AlertCircle,
  HelpCircle,
  Users,
  ShieldCheck,
  Play,
  Calendar,
  Activity
} from 'lucide-react';
import { useDashboardStore } from '../store/useDashboardStore';
import { GraphPanel } from '../components/GraphPanel';
import { mockReconstructionReport } from '../mockData';

export const IncidentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { 
    activeIncident, 
    activeTimeline, 
    activeGraph, 
    isLoading,
    isReconstructing,
    fetchIncidentDetails, 
    triggerReconstruction 
  } = useDashboardStore();

  const [reconstructStep, setReconstructStep] = useState(0);

  useEffect(() => {
    if (id) {
      fetchIncidentDetails(id);
    }
  }, [id, fetchIncidentDetails]);

  // Handle reconstruction loader steps
  useEffect(() => {
    if (!isReconstructing) {
      const timer = setTimeout(() => setReconstructStep(0), 0);
      return () => clearTimeout(timer);
    }

    const t1 = setTimeout(() => setReconstructStep(1), 600);
    const t2 = setTimeout(() => setReconstructStep(2), 1400);
    const t3 = setTimeout(() => setReconstructStep(3), 2000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isReconstructing]);

  if (isLoading && !isReconstructing) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center space-y-3 min-h-screen">
        <div className="w-10 h-10 border-t-2 border-orange-500 rounded-full animate-spin" />
        <span className="text-xs text-slate-500 font-medium">Fetching Incident Subgraph...</span>
      </div>
    );
  }

  if (!activeIncident) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center space-y-4 min-h-screen">
        <AlertTriangle className="text-rose-500" size={40} />
        <div className="text-center space-y-1">
          <h3 className="text-slate-200 font-semibold">Incident Not Found</h3>
          <p className="text-xs text-slate-500">The requested record is invalid or has been scrubbed.</p>
        </div>
        <Link to="/incidents" className="text-xs font-semibold text-orange-500 hover:underline">
          Return to Registry
        </Link>
      </div>
    );
  }

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'P1': return 'text-red-500 bg-red-950/40 border-red-900/50';
      case 'P2': return 'text-amber-500 bg-amber-950/40 border-amber-900/50';
      default: return 'text-yellow-500 bg-yellow-950/40 border-yellow-900/50';
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source.toLowerCase()) {
      case 'github': return <GitBranch size={12} className="text-purple-400" />;
      case 'slack': return <MessageSquare size={12} className="text-cyan-400" />;
      case 'sentry': return <AlertCircle size={12} className="text-rose-400" />;
      default: return <Activity size={12} className="text-slate-400" />;
    }
  };

  const isReconstructed = activeIncident.status === 'RESOLVED' && activeIncident.aiSummary;

  return (
    <div className="p-8 space-y-8 flex-grow overflow-y-auto max-h-screen">
      
      {/* Back Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <Link 
          to="/incidents" 
          className="flex items-center space-x-2 text-xs text-slate-400 hover:text-slate-200 font-semibold transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Registry</span>
        </Link>

        {isReconstructed && (
          <button
            onClick={() => triggerReconstruction(activeIncident.id)}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-xs font-semibold text-slate-300 transition-colors"
          >
            <Sparkles size={14} className="text-orange-500" />
            <span>Force Re-Reconstruct</span>
          </button>
        )}
      </div>

      {/* Hero Banner Header */}
      <div className="glass border border-slate-900 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center space-x-2.5">
            <span className={`px-2.5 py-0.5 text-[10px] font-bold border rounded uppercase tracking-wider ${getSeverityBadge(activeIncident.severity)}`}>
              {activeIncident.severity}
            </span>
            <span className={`px-2 py-0.5 text-[10px] font-semibold border rounded uppercase tracking-wider bg-slate-950 border-slate-900 text-slate-400`}>
              {activeIncident.status}
            </span>
          </div>
          <h2 className="text-lg md:text-xl font-bold tracking-tight text-slate-100">
            {activeIncident.title}
          </h2>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500 font-medium">
            <span className="flex items-center space-x-1.5">
              <Calendar size={14} className="text-slate-600" />
              <span>{new Date(activeIncident.triggeredAt).toLocaleString()}</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Clock size={14} className="text-slate-600" />
              <span>Triggered by: <span className="font-mono text-slate-400">{activeIncident.triggeredBy}</span></span>
            </span>
          </div>
        </div>

        {/* Trigger analysis button for unreconstructed incident */}
        {!isReconstructed && !isReconstructing && (
          <button
            onClick={() => triggerReconstruction(activeIncident.id)}
            className="flex-shrink-0 flex items-center space-x-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-500 rounded-xl text-xs font-bold text-slate-950 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/35 border border-orange-500 transition-all animate-bounce"
          >
            <Play size={14} fill="currentColor" />
            <span>Run AI Reconstruction</span>
          </button>
        )}
      </div>

      {/* Reconstruction Loader Overlay (Interactive Simulation) */}
      {isReconstructing && (
        <div className="glass border border-orange-950/40 rounded-xl p-8 bg-orange-950/5 flex flex-col items-center justify-center text-center space-y-6">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-t-2 border-orange-500 rounded-full animate-spin" />
            <div className="absolute inset-2 bg-slate-950 rounded-full border border-slate-900 flex items-center justify-center">
              <Sparkles size={20} className="text-orange-500 animate-pulse" />
            </div>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
              AI Incident Investigator running
            </h3>
            <p className="text-xs text-slate-500">Traversing Neo4j causal event graph & querying Claude Sonnet...</p>
          </div>

          {/* Loader Stepper */}
          <div className="w-full max-w-sm space-y-3.5 pt-4 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className={reconstructStep >= 0 ? 'text-orange-400' : 'text-slate-600'}>
                {reconstructStep > 0 ? '✔' : '●'} Querying Neo4j causal subgraphs
              </span>
              <span className={reconstructStep >= 0 ? 'text-slate-400' : 'text-slate-700'}>
                {reconstructStep > 0 ? 'Done' : 'Running...'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={reconstructStep >= 1 ? 'text-orange-400' : 'text-slate-600'}>
                {reconstructStep > 1 ? '✔' : reconstructStep === 1 ? '●' : '○'} Parsing temporal context layers
              </span>
              <span className={reconstructStep >= 1 ? 'text-slate-400' : 'text-slate-700'}>
                {reconstructStep > 1 ? 'Done' : reconstructStep === 1 ? 'Running...' : 'Queued'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={reconstructStep >= 2 ? 'text-orange-400' : 'text-slate-600'}>
                {reconstructStep > 2 ? '✔' : reconstructStep === 2 ? '●' : '○'} Generating timeline (Claude Sonnet)
              </span>
              <span className={reconstructStep >= 2 ? 'text-slate-400' : 'text-slate-700'}>
                {reconstructStep > 2 ? 'Done' : reconstructStep === 2 ? 'Running...' : 'Queued'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={reconstructStep >= 3 ? 'text-orange-400' : 'text-slate-600'}>
                {reconstructStep === 3 ? '●' : '○'} Writing causal links back to AuraDB
              </span>
              <span className={reconstructStep >= 3 ? 'text-slate-400' : 'text-slate-700'}>
                {reconstructStep === 3 ? 'Finalising...' : 'Queued'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Reconstructed Content Details */}
      {isReconstructed && !isReconstructing && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-300">
          
          {/* Timeline & Graph Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* AI Summary Card */}
            <div className="glass border border-slate-900 rounded-xl p-6 lg:col-span-2 space-y-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
                <Sparkles size={14} className="text-orange-500" />
                <span>Forensic Summary Report</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line font-sans">
                {activeIncident.aiSummary}
              </p>
            </div>

            {/* Root Cause Box */}
            <div className="glass border border-slate-900 rounded-xl p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
                  <ShieldCheck size={16} className="text-emerald-500" />
                  <span>Primary Root Cause</span>
                </h3>
                <div className="p-4 bg-orange-950/20 border border-orange-900/40 rounded-xl">
                  <p className="text-xs text-slate-200 leading-relaxed font-semibold">
                    {activeIncident.rootCause}
                  </p>
                </div>
              </div>

              {/* Confidence Meter */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-semibold">AI Confidence Match</span>
                  <span className="font-semibold text-orange-400">{mockReconstructionReport.confidence}%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 border border-slate-800">
                  <div 
                    className="bg-orange-500 h-full rounded-full shadow-lg shadow-orange-500/25"
                    style={{ width: `${mockReconstructionReport.confidence}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Causal Graph Visualization Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Interactive Causal Knowledge Graph (Neo4j sub-schema)
            </h3>
            <GraphPanel graphData={activeGraph} />
          </div>

          {/* Chronological Timeline Cards */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
              <Clock size={14} className="text-slate-500" />
              <span>Chronological Event Chain (Traversed shortest path)</span>
            </h3>

            {/* Horizontal Timeline Container */}
            <div className="flex space-x-4 overflow-x-auto pb-4 pt-1 snap-x scrollbar-thin">
              {activeTimeline.map((evt, idx) => {
                const date = new Date(evt.timestamp);
                const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const isCrit = evt.severity === 'CRITICAL';
                const isWarn = evt.severity === 'WARNING';

                return (
                  <div 
                    key={evt.id}
                    className={`flex-shrink-0 w-72 glass border rounded-xl p-5 snap-start relative flex flex-col justify-between h-44 transition-all duration-300 ${
                      isCrit 
                        ? 'border-rose-900/60 bg-rose-950/5' 
                        : isWarn
                          ? 'border-amber-900/60 bg-amber-950/5'
                          : 'border-slate-900 bg-slate-950/10'
                    }`}
                  >
                    {/* Event Header */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div className="p-1 bg-slate-950 border border-slate-900 rounded-md">
                          {getSourceIcon(evt.source)}
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono capitalize">
                          {evt.source}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono bg-slate-900 border border-slate-800/80 px-2 py-0.5 rounded">
                        {timeStr}
                      </span>
                    </div>

                    {/* Content */}
                    <p className="text-xs text-slate-200 line-clamp-3 leading-relaxed py-3 font-sans flex-grow">
                      {evt.content}
                    </p>

                    {/* Event footer */}
                    <div className="flex justify-between items-center text-[9px] border-t border-slate-900/50 pt-2 text-slate-500">
                      <span>Index #{idx + 1}</span>
                      <span className="font-mono">{evt.type}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* bottom grid: Team Involved & Action Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Incident Responders (Team Pulse) */}
            <div className="glass border border-slate-900 rounded-xl p-6 space-y-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
                <Users size={16} className="text-cyan-400" />
                <span>Responder Audit (Team Context)</span>
              </h3>
              <div className="divide-y divide-slate-900">
                {mockReconstructionReport.people.map((person, idx) => (
                  <div key={idx} className="py-3 flex items-start space-x-3.5 first:pt-0 last:pb-0">
                    <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-xs text-cyan-400">
                      {person.name[0]}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold text-slate-200">{person.name}</span>
                        <span className="text-[9px] bg-slate-900 border border-slate-800 text-slate-500 px-1.5 py-0.2 rounded font-medium">
                          {person.role}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-snug">{person.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Action recommendations */}
            <div className="glass border border-slate-900 rounded-xl p-6 space-y-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
                <HelpCircle size={16} className="text-orange-500" />
                <span>AI Recommended Preventative Actions</span>
              </h3>
              <ul className="space-y-3 text-xs text-slate-300">
                {mockReconstructionReport.prevention.map((rec, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5">
                    <span className="w-5 h-5 rounded bg-orange-950/40 border border-orange-900/50 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-orange-400 mt-0.5 font-mono">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed font-sans">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
