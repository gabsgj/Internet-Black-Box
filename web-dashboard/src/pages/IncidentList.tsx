import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, 
  Search, 
  Filter, 
  Plus, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  Loader2,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDashboardStore } from '../store/useDashboardStore';
import type { IncidentSeverity, IncidentStatus, IncidentType } from '../types';

export const IncidentList: React.FC = () => {
  const { incidents, fetchIncidents, createIncidentManually } = useDashboardStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Form fields for manually creating incidents
  const [newTitle, setNewTitle] = useState('');
  const [newSeverity, setNewSeverity] = useState<IncidentSeverity>('P1');
  const [newType, setNewType] = useState<IncidentType>('OUTAGE');

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  const getSeverityStyle = (sev: IncidentSeverity) => {
    switch (sev) {
      case 'P1': return 'text-red-500 bg-red-950/40 border-red-900/50';
      case 'P2': return 'text-amber-500 bg-amber-950/40 border-amber-900/50';
      case 'P3': return 'text-yellow-500 bg-yellow-950/40 border-yellow-900/50';
    }
  };

  const getStatusStyle = (status: IncidentStatus) => {
    switch (status) {
      case 'OPEN': return 'text-red-400 bg-red-950/30 border-red-900/40';
      case 'RECONSTRUCTING': return 'text-orange-400 bg-orange-950/30 border-orange-900/40';
      case 'RESOLVED': return 'text-emerald-400 bg-emerald-950/30 border-emerald-900/40';
    }
  };

  const getStatusIcon = (status: IncidentStatus) => {
    switch (status) {
      case 'OPEN': return <AlertCircle className="w-3.5 h-3.5 animate-pulse" />;
      case 'RECONSTRUCTING': return <Loader2 className="w-3.5 h-3.5 animate-spin" />;
      case 'RESOLVED': return <CheckCircle2 className="w-3.5 h-3.5" />;
    }
  };

  const handleCreateIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    await createIncidentManually(newTitle, newSeverity, newType);
    setNewTitle('');
    setShowCreateModal(false);
  };

  const filteredIncidents = incidents.filter(inc => {
    const matchesSearch = inc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      inc.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8 space-y-8 flex-grow overflow-y-auto max-h-screen">
      {/* Page Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-100">
            Incident Command Registry
          </h2>
          <p className="text-xs text-slate-400">
            Monitor active post-mortems, trigger system analysis, and log new anomalies.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-500 rounded-lg text-xs font-semibold text-slate-950 shadow-lg shadow-orange-500/10 hover:shadow-orange-500/25 transition-all"
        >
          <Plus size={16} />
          <span>Report Outage</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex justify-between items-center flex-wrap gap-4 bg-slate-950/20 border border-slate-900 rounded-xl p-4">
        <div className="flex items-center space-x-3 flex-grow max-w-md relative">
          <Search size={14} className="absolute left-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search incident list by title or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-900 rounded-lg px-3 py-2 pl-9 text-slate-300 placeholder-slate-600 focus:outline-none focus:border-slate-800 text-xs"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-500 flex items-center space-x-1">
            <Filter size={12} />
            <span>Status:</span>
          </span>
          <div className="flex bg-slate-950 border border-slate-900 rounded-lg p-0.5">
            {['all', 'OPEN', 'RECONSTRUCTING', 'RESOLVED'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 rounded-md text-[10px] font-semibold tracking-wider transition-colors ${
                  statusFilter === status
                    ? 'bg-slate-900 text-orange-500'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {status.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Incident List Table */}
      <div className="glass border border-slate-900 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-900 bg-slate-950/50 text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
                <th className="py-4 px-6">Incident Details</th>
                <th className="py-4 px-6">Severity</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Trigger Source</th>
                <th className="py-4 px-6">Time Logged</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-950 text-xs text-slate-300">
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No recorded incidents match your filter.
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((inc) => (
                  <tr key={inc.id} className="hover:bg-slate-900/10 transition-colors">
                    <td className="py-4.5 px-6">
                      <div className="font-semibold text-slate-100 line-clamp-1">{inc.title}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">{inc.id}</div>
                    </td>
                    <td className="py-4.5 px-6">
                      <span className={`px-2 py-0.5 text-[9px] font-bold border rounded uppercase tracking-wider ${getSeverityStyle(inc.severity)}`}>
                        {inc.severity}
                      </span>
                    </td>
                    <td className="py-4.5 px-6">
                      <span className={`px-2 py-0.5 text-[9px] font-semibold border rounded uppercase tracking-wider flex items-center space-x-1.5 w-fit ${getStatusStyle(inc.status)}`}>
                        {getStatusIcon(inc.status)}
                        <span>{inc.status}</span>
                      </span>
                    </td>
                    <td className="py-4.5 px-6 font-mono text-[10px] text-slate-400">
                      {inc.triggeredBy}
                    </td>
                    <td className="py-4.5 px-6 text-slate-400">
                      <div className="flex items-center space-x-1">
                        <Clock size={12} className="text-slate-500" />
                        <span>{new Date(inc.triggeredAt).toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="py-4.5 px-6 text-right">
                      <Link
                        to={`/incidents/${inc.id}`}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded text-[11px] font-semibold text-slate-300 hover:text-slate-100 transition-all"
                      >
                        <span>Inspect</span>
                        <ChevronRight size={12} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Creation Overlay Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-950 border border-slate-900 rounded-xl shadow-2xl p-6 relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 p-1 hover:bg-slate-900 rounded-lg transition-colors"
            >
              <X size={16} />
            </button>

            <h3 className="text-base font-bold text-slate-100 mb-2">
              Report System Outage
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Simulate or file a new incident. This will trigger the AI graph traversal.
            </p>

            <form onSubmit={handleCreateIncident} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  Incident Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Auth gateway error rate spking on production"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-300 placeholder-slate-600 focus:outline-none focus:border-slate-700 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                    Severity
                  </label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as IncidentSeverity)}
                    className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-slate-700"
                  >
                    <option value="P1">P1 - Critical Outage</option>
                    <option value="P2">P2 - Major Latency</option>
                    <option value="P3">P3 - Staging/Minor</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                    Incident Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as IncidentType)}
                    className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-slate-700"
                  >
                    <option value="OUTAGE">System Outage</option>
                    <option value="SECURITY_BREACH">Security Breach</option>
                    <option value="PROJECT_FAILURE">Project Failure</option>
                    <option value="COMPLIANCE">Compliance Issue</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-xs font-semibold text-slate-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-500 rounded-lg text-xs font-semibold text-slate-950 shadow-lg shadow-orange-500/10 transition-all"
                >
                  Trigger Analysis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
