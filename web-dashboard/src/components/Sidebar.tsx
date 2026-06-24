import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  AlertOctagon, 
  Activity, 
  Wifi, 
  WifiOff, 
  Database,
  Radio,
  LogOut
} from 'lucide-react';
import { useDashboardStore } from '../store/useDashboardStore';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    websocketStatus, 
    realTimeMode, 
    setRealTimeMode,
    incidents,
    currentUser,
    logoutUser
  } = useDashboardStore();

  const openP1Incidents = incidents.filter(i => i.severity === 'P1' && i.status !== 'RESOLVED');

  const navItems = [
    { path: '/dashboard', name: 'Overview', icon: LayoutDashboard },
    { path: '/incidents', name: 'Incidents', icon: AlertOctagon },
  ];

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-900 flex flex-col justify-between h-screen sticky top-0">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-900 flex items-center space-x-3">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center font-bold text-slate-950 shadow-lg shadow-emerald-500/20 border border-emerald-400">
            ■
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-wider text-slate-100 uppercase">
              Black Box
            </h1>
            <span className="text-[10px] text-emerald-500 font-bold tracking-widest block uppercase">
              INCIDENT RECONSTRUCTOR
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path === '/incidents' && location.pathname.startsWith('/incidents'));
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-slate-900 text-emerald-400 border-l-2 border-emerald-500'
                    : 'text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-emerald-400' : 'text-slate-400'} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* System Status, Mode Toggles, and Active Operator Profile */}
      <div className="p-4 border-t border-slate-900 space-y-4">
        {/* Active Outage warning */}
        {openP1Incidents.length > 0 && (
          <div className="p-3 bg-red-950/40 border border-red-900/50 rounded-lg animate-pulse">
            <div className="flex items-center space-x-2 text-red-400 font-semibold text-xs mb-1">
              <Activity size={14} />
              <span>ACTIVE P1 OUTAGE</span>
            </div>
            {openP1Incidents.map(inc => (
              <Link 
                key={inc.id}
                to={`/incidents/${inc.id}`}
                className="text-[11px] text-slate-300 hover:text-white line-clamp-1 hover:underline"
              >
                {inc.title}
              </Link>
            ))}
          </div>
        )}

        {/* Status Indicators */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center space-x-2">
              <Radio size={12} className="text-slate-500" />
              <span>Real-Time Stream</span>
            </span>
            <button
              onClick={() => setRealTimeMode(!realTimeMode)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                realTimeMode ? 'bg-emerald-500' : 'bg-slate-800'
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                  realTimeMode ? 'translate-x-4.5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center space-x-2">
              {websocketStatus === 'connected' ? (
                <Wifi size={12} className="text-emerald-500 animate-pulse" />
              ) : (
                <WifiOff size={12} className="text-rose-500" />
              )}
              <span>WebSockets</span>
            </span>
            <span className={`font-semibold ${websocketStatus === 'connected' ? 'text-emerald-500' : 'text-rose-500'}`}>
              {websocketStatus === 'connected' ? 'LIVE' : 'OFFLINE'}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center space-x-2">
              <Database size={12} className={realTimeMode ? 'text-emerald-400' : 'text-slate-500'} />
              <span>API Gateway</span>
            </span>
            <span className="font-semibold text-slate-300">
              {realTimeMode ? 'LOCAL:8080' : 'SANDBOX'}
            </span>
          </div>
        </div>

        {/* Active Operator profile card and Sign Out */}
        {currentUser && (
          <div className="pt-3 border-t border-slate-900/60 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-900 flex items-center justify-center font-bold text-xs text-emerald-400">
                {currentUser.name[0]}
              </div>
              <div className="truncate w-28">
                <span className="text-[11px] font-semibold text-slate-200 block truncate leading-none">
                  {currentUser.name}
                </span>
                <span className="text-[9px] text-slate-500 block truncate">
                  Operator
                </span>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="p-1.5 hover:bg-slate-900 border border-transparent hover:border-slate-800 rounded-lg text-slate-500 hover:text-rose-400 transition-colors"
              title="Sign Out"
            >
              <LogOut size={14} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
