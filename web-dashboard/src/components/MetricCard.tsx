import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  loading?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendLabel,
  loading = false,
}) => {
  const isPositive = trend !== undefined && trend >= 0;

  return (
    <div className="glass hover:bg-slate-900/35 border border-slate-900 rounded-xl p-6 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
          {title}
        </span>
        <div className="p-2.5 bg-slate-900 rounded-lg text-orange-500 border border-slate-800">
          {icon}
        </div>
      </div>

      {loading ? (
        <div className="h-9 w-24 bg-slate-900 rounded animate-pulse mb-3" />
      ) : (
        <div className="text-2xl font-bold text-slate-100 tracking-tight mb-2">
          {value}
        </div>
      )}

      {trend !== undefined && (
        <div className="flex items-center space-x-1.5 text-xs">
          <span
            className={`flex items-center space-x-0.5 font-medium ${
              isPositive ? 'text-rose-500' : 'text-emerald-500'
            }`}
          >
            {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            <span>{Math.abs(trend)}%</span>
          </span>
          <span className="text-slate-500">{trendLabel || 'from last week'}</span>
        </div>
      )}
    </div>
  );
};
