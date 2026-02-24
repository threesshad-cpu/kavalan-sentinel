'use client';

import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    Legend, AreaChart, Area
} from 'recharts';
import { TrendingUp, Brain, MapPin, Calendar } from 'lucide-react';

const STRESS_HOTSPOTS = [
    { zone: 'Vellore North', incidents: 14, avgHR: 112, gsrPeak: 4.8, risk: 92 },
    { zone: 'Chennai Central', incidents: 11, avgHR: 107, gsrPeak: 4.2, risk: 78 },
    { zone: 'Chennai South', incidents: 8, avgHR: 103, gsrPeak: 3.9, risk: 65 },
    { zone: 'Harbor East', incidents: 6, avgHR: 99, gsrPeak: 3.4, risk: 52 },
    { zone: 'Airport South', incidents: 4, avgHR: 95, gsrPeak: 2.8, risk: 38 },
    { zone: 'North Suburb', incidents: 3, avgHR: 91, gsrPeak: 2.3, risk: 24 },
];
const WEEKLY_TREND = [
    { day: 'Mon', critical: 2, alerts: 5, safe: 18 },
    { day: 'Tue', critical: 1, alerts: 4, safe: 20 },
    { day: 'Wed', critical: 3, alerts: 7, safe: 15 },
    { day: 'Thu', critical: 0, alerts: 3, safe: 22 },
    { day: 'Fri', critical: 4, alerts: 9, safe: 12 },
    { day: 'Sat', critical: 6, alerts: 11, safe: 10 },
    { day: 'Sun', critical: 2, alerts: 6, safe: 17 },
];
const HOURLY_PATTERN = [
    { hour: '00:00', stress: 2 }, { hour: '02:00', stress: 1 },
    { hour: '04:00', stress: 1 }, { hour: '06:00', stress: 3 },
    { hour: '08:00', stress: 6 }, { hour: '10:00', stress: 8 },
    { hour: '12:00', stress: 5 }, { hour: '14:00', stress: 7 },
    { hour: '16:00', stress: 9 }, { hour: '18:00', stress: 12 },
    { hour: '20:00', stress: 10 }, { hour: '22:00', stress: 6 },
];
const OFFICER_RADAR = [
    { metric: 'HR Risk', Rajan: 60, Priya: 88, Kumar: 45 },
    { metric: 'Sweat Level', Rajan: 50, Priya: 82, Kumar: 38 },
    { metric: 'Impact Events', Rajan: 55, Priya: 75, Kumar: 40 },
    { metric: 'SOS Triggers', Rajan: 40, Priya: 95, Kumar: 30 },
    { metric: 'Shift Fatigue', Rajan: 65, Priya: 70, Kumar: 55 },
];
const RISK_BAR_COLORS = ['#dc2626', '#d97706', '#d97706', '#2563eb', '#2563eb', '#059669'];

const tooltipStyle = {
    background: '#fff', border: '1px solid #e2e8f0',
    borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
};
const axisProps = { tick: { fill: '#64748b', fontSize: 10 }, tickLine: false, axisLine: false };
const gridProps = { strokeDasharray: '3 3' as string, stroke: '#e2e8f0' };

export default function AnalyticsPage() {
    return (
        <div className="p-6 flex flex-col gap-6 h-full overflow-auto animate-fade-in">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-slate-900">Predictive Analytics</h1>
                    <p className="text-sm text-slate-500">AI-driven stress hotspot mapping and risk prediction — Tamil Nadu Police</p>
                </div>
                <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-violet-700 bg-violet-50 border border-violet-200">
                    <Brain size={12} /> AI Model Active
                </span>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-4 gap-3">
                {[
                    { label: 'Predicted SOS (7d)', value: '8', change: '+12% vs last week', color: '#dc2626', bg: 'bg-red-50', icon: TrendingUp },
                    { label: 'Highest Risk Zone', value: 'Vellore N.', change: 'Risk score 92%', color: '#d97706', bg: 'bg-amber-50', icon: MapPin },
                    { label: 'Peak Stress Hour', value: '18:00–20:00', change: 'Evening shift', color: '#2563eb', bg: 'bg-blue-50', icon: Calendar },
                    { label: 'Model Accuracy', value: '94.2%', change: 'F1 Score: 0.91', color: '#059669', bg: 'bg-emerald-50', icon: Brain },
                ].map(({ label, value, change, color, bg, icon: Icon }) => (
                    <div key={label} className="card p-4">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${bg}`}>
                            <Icon size={16} style={{ color }} />
                        </div>
                        <p className="text-xl font-black" style={{ color }}>{value}</p>
                        <p className="text-xs font-semibold text-slate-700 mt-0.5">{label}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{change}</p>
                    </div>
                ))}
            </div>

            {/* Charts row 1 */}
            <div className="grid grid-cols-2 gap-4">
                <div className="card p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <MapPin size={14} className="text-red-500" />
                        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Stress Hotspot Ranking</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={STRESS_HOTSPOTS} layout="vertical" margin={{ left: 10, right: 20 }}>
                            <CartesianGrid {...gridProps} horizontal={false} />
                            <XAxis type="number" domain={[0, 100]} {...axisProps} />
                            <YAxis dataKey="zone" type="category" {...axisProps} width={90} />
                            <Tooltip contentStyle={tooltipStyle} />
                            <Bar dataKey="risk" name="Risk Score" radius={[0, 4, 4, 0]}>
                                {STRESS_HOTSPOTS.map((_, i) => <Cell key={i} fill={RISK_BAR_COLORS[i]} fillOpacity={0.85} />)}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="card p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <Calendar size={14} className="text-blue-500" />
                        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Weekly Incident Breakdown</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={WEEKLY_TREND}>
                            <CartesianGrid {...gridProps} />
                            <XAxis dataKey="day" {...axisProps} />
                            <YAxis {...axisProps} />
                            <Tooltip contentStyle={tooltipStyle} />
                            <Legend wrapperStyle={{ fontSize: '11px' }} />
                            <Bar dataKey="critical" name="Critical" stackId="a" fill="#dc2626" fillOpacity={0.85} />
                            <Bar dataKey="alerts" name="Alerts" stackId="a" fill="#d97706" fillOpacity={0.85} />
                            <Bar dataKey="safe" name="Safe" stackId="a" fill="#059669" fillOpacity={0.65} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Charts row 2 */}
            <div className="grid grid-cols-2 gap-4 pb-4">
                <div className="card p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp size={14} className="text-amber-500" />
                        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Hourly Stress Pattern (24H)</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={HOURLY_PATTERN}>
                            <defs>
                                <linearGradient id="stressGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.18} />
                                    <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid {...gridProps} />
                            <XAxis dataKey="hour" {...axisProps} tick={{ fill: '#64748b', fontSize: 9 }} />
                            <YAxis {...axisProps} />
                            <Tooltip contentStyle={tooltipStyle} />
                            <Area type="monotone" dataKey="stress" name="Stress Events"
                                stroke="#d97706" strokeWidth={2} fill="url(#stressGrad)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="card p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <Brain size={14} className="text-violet-500" />
                        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Officer Risk Profile — Radar</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <RadarChart data={OFFICER_RADAR}>
                            <PolarGrid stroke="#e2e8f0" />
                            <PolarAngleAxis dataKey="metric" tick={{ fill: '#64748b', fontSize: 10 }} />
                            <PolarRadiusAxis tick={{ fill: '#64748b', fontSize: 8 }} domain={[0, 100]} tickCount={4} />
                            <Tooltip contentStyle={tooltipStyle} />
                            <Legend wrapperStyle={{ fontSize: '11px' }} />
                            <Radar name="Rajan" dataKey="Rajan" stroke="#2563eb" fill="#2563eb" fillOpacity={0.15} />
                            <Radar name="Priya" dataKey="Priya" stroke="#dc2626" fill="#dc2626" fillOpacity={0.15} />
                            <Radar name="Kumar" dataKey="Kumar" stroke="#059669" fill="#059669" fillOpacity={0.15} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
