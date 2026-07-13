import React, { useEffect } from 'react';
import { 
  AlertCircle, 
  Clock, 
  Activity, 
  Server,
  Terminal,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useDashboardStore } from '../store/useDashboardStore';
import { MetricCard } from '../components/MetricCard';
import { EventFeed } from '../components/EventFeed';

const incidentHistoryData = [
  { name: 'June 17', incidents: 1 },
  { name: 'June 18', incidents: 0 },
  { name: 'June 19', incidents: 2 },
  { name: 'June 20', incidents: 1 },
  { name: 'June 21', incidents: 0 },
  { name: 'June 22', incidents: 3 },
  { name: 'June 23', incidents: 1 },
];

const eventDistributionData = [
  { name: 'GitHub', events: 640, color: '#a855f7' },
  { name: 'Slack', events: 480, color: '#22d3ee' },
  { name: 'Sentry', events: 120, color: '#f43f5e' },
];

export const Dashboard: React.FC = () => {
  const { 
    metrics, 
    incidents, 
    activeTimeline, 
    fetchIncidents, 
    connectWebSocket, 
    disconnectWebSocket,
    realTimeMode,
    setRealTimeMode
  } = useDashboardStore();

  useEffect(() => {
    fetchIncidents();
    connectWebSocket();
    return () => disconnectWebSocket();
  }, [fetchIncidents, connectWebSocket, disconnectWebSocket]);

  const openIncidents = incidents.filter(i => i.status !== 'RESOLVED');

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case 'P1': return 'text-red-500 bg-red-950/40 border-red-900/50';
      case 'P2': return 'text-amber-500 bg-amber-950/40 border-amber-900/50';
      default: return 'text-yellow-500 bg-yellow-950/40 border-yellow-900/50';
    }
  };

  return (
    <div className="p-8 space-y-8 flex-grow overflow-y-auto max-h-screen relative">
      {/* Subtle glowing backdrops */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Upper header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-100">
            System Intelligence Hub
          </h2>
          <p className="text-xs text-slate-400">
            Passively listening to digital footprints & auto-reconstructing incidents.
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-950/60 border border-slate-900 rounded-xl p-1 text-xs">
            <button
              onClick={() => setRealTimeMode(false)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                !realTimeMode 
                  ? 'bg-slate-900 text-amber-500 border border-amber-900/30' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Mock Engine
            </button>
            <button
              onClick={() => setRealTimeMode(true)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                realTimeMode 
                  ? 'bg-slate-900 text-emerald-400 border border-emerald-900/30' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Live API
            </button>
          </div>

          <div className="flex items-center space-x-2 bg-slate-950/40 border border-slate-900 rounded-lg px-3 py-1.5 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Ingestors Active</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Active Incidents"
          value={metrics.openIncidentsCount}
          icon={<AlertCircle size={20} />}
          trend={metrics.openIncidentsCount > 0 ? 100 : -100}
          trendLabel="compared to average"
        />
        <MetricCard
          title="Mean Time To Resolve (MTTR)"
          value={`${metrics.mttrMinutes} mins`}
          icon={<Clock size={20} />}
          trend={metrics.mttrTrend}
          trendLabel="over past 7 days"
        />
        <MetricCard
          title="Events Normalised"
          value={metrics.totalEventsCount}
          icon={<Activity size={20} />}
          trend={metrics.eventsTrend}
          trendLabel="ingestion delta"
        />
      </div>

      {/* Main Grid: Charts & Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Analytics & Charts (2/3 width) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Active Incidents Banner Panel */}
          {openIncidents.length > 0 && (
            <div className="glass border border-red-950 rounded-xl p-5 glow-active bg-red-950/10">
              <div className="flex items-center space-x-3 mb-3">
                <AlertCircle className="text-red-500 animate-bounce" size={20} />
                <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
                  Critical Outage Detected
                </h3>
              </div>
              <div className="space-y-4">
                {openIncidents.map(inc => (
                  <div key={inc.id} className="flex justify-between items-center flex-wrap gap-3 border-b border-red-950/30 pb-3 last:border-0 last:pb-0">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 text-[10px] font-bold border rounded uppercase ${getSeverityColor(inc.severity)}`}>
                          {inc.severity}
                        </span>
                        <h4 className="text-xs font-semibold text-slate-100">{inc.title}</h4>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">
                        Triggered at {new Date(inc.triggeredAt).toLocaleString()} via {inc.triggeredBy}
                      </p>
                    </div>
                    <Link
                      to={`/incidents/${inc.id}`}
                      className="flex items-center space-x-1.5 px-3 py-1.5 bg-red-950 border border-red-900 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-900 hover:text-white transition-all shadow-md"
                    >
                      <span>Analyse Causality</span>
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recharts Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Incident History Area Chart */}
            <div className="glass border border-slate-900 rounded-xl p-5 flex flex-col h-[280px]">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                Outage History Trend
              </h3>
              <div className="flex-grow">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={incidentHistoryData}>
                    <defs>
                      <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#0f172a" vertical={false} />
                    <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} />
                    <YAxis stroke="#475569" fontSize={10} tickLine={false} allowDecimals={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', borderRadius: '8px' }}
                      labelStyle={{ color: '#94a3b8', fontSize: '10px' }}
                      itemStyle={{ color: '#f97316', fontSize: '11px' }}
                    />
                    <Area type="monotone" dataKey="incidents" stroke="#f97316" fillOpacity={1} fill="url(#colorInc)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Event Distribution Bar Chart */}
            <div className="glass border border-slate-900 rounded-xl p-5 flex flex-col h-[280px]">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                Event Distribution by Source
              </h3>
              <div className="flex-grow">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={eventDistributionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#0f172a" vertical={false} />
                    <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} />
                    <YAxis stroke="#475569" fontSize={10} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', borderRadius: '8px' }}
                      labelStyle={{ color: '#94a3b8', fontSize: '10px' }}
                      itemStyle={{ color: '#eab308', fontSize: '11px' }}
                    />
                    <Bar dataKey="events" fill="#eab308" radius={[4, 4, 0, 0]} maxBarSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Integration Status / Connected Tools */}
          <div className="glass border border-slate-900 rounded-xl p-5">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Passive Ingestion Adapters
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-950 border border-slate-900 rounded-lg flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-950/40 border border-purple-900/50 rounded-lg text-purple-400">
                    <Terminal size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200">GitHub Ingestor</h4>
                    <span className="text-[10px] text-slate-500">Repository webhooks</span>
                  </div>
                </div>
                <span className={`w-2 h-2 rounded-full ${metrics.systemStatuses.github === 'online' ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
              </div>

              <div className="p-4 bg-slate-950 border border-slate-900 rounded-lg flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-cyan-950/40 border border-cyan-900/50 rounded-lg text-cyan-400">
                    <Server size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200">Slack Streamer</h4>
                    <span className="text-[10px] text-slate-500">Event-driven listener</span>
                  </div>
                </div>
                <span className={`w-2 h-2 rounded-full ${metrics.systemStatuses.slack === 'online' ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
              </div>

              <div className="p-4 bg-slate-950 border border-slate-900 rounded-lg flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-rose-950/40 border border-rose-900/50 rounded-lg text-rose-400">
                    <AlertCircle size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200">Sentry Ingestion</h4>
                    <span className="text-[10px] text-slate-500">Log exception hook</span>
                  </div>
                </div>
                <span className={`w-2 h-2 rounded-full ${metrics.systemStatuses.sentry === 'online' ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Live Running Event log Feed (1/3 width) */}
        <div className="lg:col-span-1 h-full min-h-[500px]">
          <EventFeed events={activeTimeline.slice(0, 30)} title="Ingestion Pipeline (Stream)" />
        </div>
      </div>
    </div>
  );
};
