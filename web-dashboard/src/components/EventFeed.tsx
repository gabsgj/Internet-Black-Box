import React, { useState } from 'react';
import { 
  GitBranch, 
  MessageSquare, 
  AlertCircle, 
  Activity, 
  Filter, 
  Search, 
  RefreshCw 
} from 'lucide-react';
import type { EventNode } from '../types';

interface EventFeedProps {
  events: EventNode[];
  onRefresh?: () => void;
  title?: string;
  maxHeightClass?: string;
}

export const EventFeed: React.FC<EventFeedProps> = ({ 
  events, 
  onRefresh, 
  title = "Ingestion Event Log",
  maxHeightClass = "max-h-[600px]"
}) => {
  const [filterSource, setFilterSource] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const sources = ['all', 'github', 'slack', 'sentry'];
  const severities = ['all', 'INFO', 'WARNING', 'CRITICAL'];

  const getSourceIcon = (source: string) => {
    switch (source.toLowerCase()) {
      case 'github':
        return <GitBranch size={14} className="text-purple-400" />;
      case 'slack':
        return <MessageSquare size={14} className="text-cyan-400" />;
      case 'sentry':
        return <AlertCircle size={14} className="text-rose-400" />;
      default:
        return <Activity size={14} className="text-slate-400" />;
    }
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-rose-950/60 border border-rose-800 text-rose-400 uppercase tracking-wider">Crit</span>;
      case 'WARNING':
        return <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-amber-950/60 border border-amber-800 text-amber-400 uppercase tracking-wider">Warn</span>;
      default:
        return <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-slate-900 border border-slate-800 text-slate-400 uppercase tracking-wider">Info</span>;
    }
  };

  const filteredEvents = events.filter(evt => {
    const matchesSource = filterSource === 'all' || evt.source === filterSource;
    const matchesSeverity = filterSeverity === 'all' || evt.severity === filterSeverity;
    const matchesSearch = searchQuery === '' || 
      evt.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
      evt.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSource && matchesSeverity && matchesSearch;
  });

  return (
    <div className="glass border border-slate-900 rounded-xl flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-900 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
          <Activity size={16} className="text-orange-500" />
          <span>{title}</span>
        </h3>
        <div className="flex items-center space-x-2">
          {onRefresh && (
            <button 
              onClick={onRefresh}
              className="p-1.5 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
              title="Refresh Event Log"
            >
              <RefreshCw size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="p-3 bg-slate-950/30 border-b border-slate-900 flex flex-wrap gap-2 items-center justify-between text-xs">
        <div className="flex items-center space-x-2 flex-grow max-w-xs relative">
          <Search size={12} className="absolute left-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-900 rounded px-2.5 py-1 pl-8 text-slate-300 placeholder-slate-600 focus:outline-none focus:border-slate-800 text-xs"
          />
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5">
            <Filter size={11} className="text-slate-500" />
            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="bg-slate-950 border border-slate-900 text-slate-400 rounded px-1.5 py-1 text-xs focus:outline-none focus:border-slate-800 capitalize"
            >
              {sources.map(src => (
                <option key={src} value={src}>{src}</option>
              ))}
            </select>
          </div>

          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="bg-slate-950 border border-slate-900 text-slate-400 rounded px-1.5 py-1 text-xs focus:outline-none focus:border-slate-800"
          >
            {severities.map(sev => (
              <option key={sev} value={sev}>{sev === 'all' ? 'All Severities' : sev}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Event Logs List */}
      <div className={`overflow-y-auto divide-y divide-slate-950 flex-grow ${maxHeightClass}`}>
        {filteredEvents.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">
            No matching events found.
          </div>
        ) : (
          filteredEvents.map((evt) => {
            const date = new Date(evt.timestamp);
            const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

            return (
              <div 
                key={evt.id}
                className={`p-3.5 hover:bg-slate-900/10 flex items-start space-x-3 transition-colors ${
                  evt.severity === 'CRITICAL' ? 'bg-rose-950/5' : ''
                }`}
              >
                <div className="p-1.5 bg-slate-950 border border-slate-900 rounded-lg flex-shrink-0 mt-0.5">
                  {getSourceIcon(evt.source)}
                </div>

                <div className="flex-grow space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                      {evt.source}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {timeStr}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {evt.content}
                  </p>

                  <div className="flex items-center space-x-2 pt-0.5">
                    {getSeverityBadge(evt.severity)}
                    {evt.metadata && (
                      <span className="text-[9px] text-slate-600 font-mono max-w-[200px] truncate">
                        ID: {evt.id}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
