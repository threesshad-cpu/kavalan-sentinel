'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine
} from 'recharts';
import { Heart, Activity, Zap, AlertTriangle, Shield, Clock, MapPin, TrendingUp, Info } from 'lucide-react';

interface VitalData {
    user_id: string; profile: string; name: string; sector: string;
    risk_zone: string; heart_rate: number; gsr_fear_sweat_index: number;
    kinetic_struggle_g_force: number; status: 'SAFE' | 'ALERT' | 'CRITICAL_SOS';
    ai_assessment: string; location: { lat: number; lng: number }; timestamp: string;
}
interface FeedResponse {
    vitals: VitalData[]; status: string;
    total_active: number; critical_count: number; alert_count: number;
}
interface ChartPoint { time: string;[key: string]: number | string; }

const STATUS_CFG = {
    SAFE: { badge: 'badge-safe' },
    ALERT: { badge: 'badge-alert' },
    CRITICAL_SOS: { badge: 'badge-critical' },
};

const RISK_BADGE: Record<string, string> = {
    HIGH: 'text-red-700 bg-red-50 border-red-200/50',
    MEDIUM: 'text-amber-700 bg-amber-50 border-amber-200/50',
    LOW: 'text-emerald-700 bg-emerald-50 border-emerald-200/50'
};

const USER_COLORS = ['bg-pink-500', 'bg-violet-500', 'bg-blue-500', 'bg-amber-500'];

const MOCK: VitalData[] = [
    { user_id: 'KVL-F-001', profile: 'College Student', name: 'Meena S.', sector: 'Tambaram Route', risk_zone: 'HIGH', heart_rate: 85, gsr_fear_sweat_index: 1.62, kinetic_struggle_g_force: 0.45, status: 'SAFE', ai_assessment: 'Biometrics within normal transit range.', location: { lat: 12.9249, lng: 80.1000 }, timestamp: new Date().toISOString() },
    { user_id: 'KVL-F-002', profile: 'Garment Worker', name: 'Kavitha R.', sector: 'Vellore Industrial', risk_zone: 'MEDIUM', heart_rate: 77, gsr_fear_sweat_index: 0.47, kinetic_struggle_g_force: 0.62, status: 'SAFE', ai_assessment: 'Biometrics within normal transit range.', location: { lat: 12.9165, lng: 79.1325 }, timestamp: new Date().toISOString() },
    { user_id: 'KVL-F-003', profile: 'IT Professional', name: 'Priya N.', sector: 'OMR Tech Corridor', risk_zone: 'MEDIUM', heart_rate: 87, gsr_fear_sweat_index: 0.52, kinetic_struggle_g_force: 0.12, status: 'SAFE', ai_assessment: 'Biometrics within normal transit range.', location: { lat: 12.8406, lng: 80.2286 }, timestamp: new Date().toISOString() },
    { user_id: 'KVL-F-004', profile: 'Domestic Worker', name: 'Selvi K.', sector: 'Ambattur Sector', risk_zone: 'HIGH', heart_rate: 91, gsr_fear_sweat_index: 0.64, kinetic_struggle_g_force: 0.47, status: 'SAFE', ai_assessment: 'Biometrics within normal transit range.', location: { lat: 13.1143, lng: 80.1548 }, timestamp: new Date().toISOString() },
];

const chartTooltipStyle = {
    background: '#fff', border: '1px solid #e2e8f0',
    borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
};

function DashboardContent() {
    const searchParams = useSearchParams();
    const isDemoMode = searchParams.get('mode') === 'demo';

    const [vitals, setVitals] = useState<VitalData[]>(MOCK);
    const [chartData, setChartData] = useState<ChartPoint[]>([]);
    const [lastUpdated, setLastUpdated] = useState('');
    const [connected, setConnected] = useState(false);

    const fetchVitals = useCallback(async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'}/api/vitals`);
            const data: FeedResponse = await res.json();
            setVitals(data.vitals);
            setConnected(true);
            setLastUpdated(new Date().toLocaleTimeString());
            setChartData(prev => {
                const pt: ChartPoint = { time: new Date().toLocaleTimeString('en', { hour12: false }) };
                data.vitals.forEach(v => {
                    pt[`hr_${v.user_id}`] = v.heart_rate;
                    pt[`gsr_${v.user_id}`] = v.gsr_fear_sweat_index;
                });
                return [...prev, pt].slice(-20);
            });
        } catch { setConnected(false); }
    }, []);

    useEffect(() => {
        if (!isDemoMode) return;
        fetchVitals();
        const id = setInterval(fetchVitals, 2000);
        return () => clearInterval(id);
    }, [isDemoMode, fetchVitals]);

    return (
        <div className="max-w-[1600px] mx-auto p-8 flex flex-col gap-10 h-full overflow-auto animate-fade-in">

            {/* Header section */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                        Bio-Safety Monitor
                        <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase tracking-tighter">Live</span>
                    </h1>
                    <p className="text-sm font-medium text-slate-500">
                        Kavalan Sentinel Network • Real-time Biometric Surveillance Grid
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    {lastUpdated && (
                        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg">
                            <Clock size={12} /> LAST UPDATE: {lastUpdated}
                        </div>
                    )}
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold ${connected ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                        <div className={`w-2 h-2 rounded-full animate-pulse ${connected ? 'bg-emerald-500 outline outline-4 outline-emerald-500/20' : 'bg-amber-500 outline outline-4 outline-amber-500/20'}`} />
                        {connected ? 'LIVE FEED CONNECTED' : 'DEMO MODE ACTIVE'}
                    </div>
                </div>
            </header>

            {/* Quick stats grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Active Sentinels', value: vitals.length, icon: Shield, color: 'text-pink-600', valColor: 'text-pink-700', bg: 'bg-pink-50' },
                    { label: 'Normal Status', value: vitals.filter(v => v.status === 'SAFE').length, icon: Heart, color: 'text-emerald-600', valColor: 'text-emerald-700', bg: 'bg-emerald-50' },
                    { label: 'Elevated Alerts', value: vitals.filter(v => v.status === 'ALERT').length, icon: AlertTriangle, color: 'text-amber-600', valColor: 'text-amber-700', bg: 'bg-amber-50' },
                    { label: 'Critical SOS', value: vitals.filter(v => v.status === 'CRITICAL_SOS').length, icon: Zap, color: 'text-red-600', valColor: 'text-red-700', bg: 'bg-red-50' },
                ].map(({ label, value, icon: Icon, color, valColor, bg }) => (
                    <div key={label} className="card p-6 flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
                            <p className={`text-3xl font-black ${valColor}`}>{value}</p>
                        </div>
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${bg} ${color} border border-white shadow-inner`}>
                            <Icon size={24} strokeWidth={2.5} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Sentinel detailed monitoring grid */}
            <section className="space-y-6">
                <div className="flex items-center justify-between px-1">
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                        <Activity size={14} className="text-blue-500" />
                        Active Wearable Monitoring
                    </h2>
                    <div className="h-px flex-1 bg-slate-200 mx-6 opacity-40"></div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {vitals.map((u, i) => {
                        const cfg = STATUS_CFG[u.status];
                        return (
                            <article key={u.user_id} className="card overflow-hidden group">
                                {/* Card header section */}
                                <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-white text-lg shadow-lg ring-4 ring-white ${USER_COLORS[i]}`}>
                                            {u.name[0]}
                                        </div>
                                        <div className="space-y-0.5">
                                            <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                                                {u.name}
                                                <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-bold uppercase">{u.user_id}</span>
                                            </h3>
                                            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                                                <MapPin size={10} className="text-pink-500" />
                                                {u.sector}
                                                <span className={`px-2 py-0.5 rounded-md border ${RISK_BADGE[u.risk_zone] ?? 'text-slate-200'} text-[9px] font-black uppercase`}>
                                                    {u.risk_zone} Risk
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className={cfg.badge}>{u.status.replace('_', ' ')}</span>
                                </div>

                                {/* Body stats section */}
                                <div className="p-6 grid grid-cols-3 gap-4 bg-slate-50/20">
                                    {[
                                        { label: 'Heart Rate', val: u.heart_rate, unit: 'BPM', warn: u.heart_rate > 115, icon: Heart, color: 'text-pink-500' },
                                        { label: 'Fear Sweating', val: u.gsr_fear_sweat_index.toFixed(2), unit: 'μS', warn: u.gsr_fear_sweat_index > 3.0, icon: Activity, color: 'text-violet-500' },
                                        { label: 'Physical Force', val: u.kinetic_struggle_g_force.toFixed(2), unit: 'G-FORCE', warn: u.kinetic_struggle_g_force > 2.0, icon: Zap, color: 'text-amber-500' },
                                    ].map(({ label, val, unit, warn, icon: Icon, color }) => (
                                        <div key={label} className={warn ? 'vital-metric-warn' : 'vital-metric'}>
                                            <div className="flex items-center gap-1.5 mb-1">
                                                <Icon size={12} className={warn ? 'text-red-500' : color} />
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{label}</span>
                                            </div>
                                            <p className={`text-2xl font-black tracking-tight ${warn ? 'text-red-700' : 'text-slate-900'}`}>
                                                {val}
                                            </p>
                                            <p className="text-[10px] font-black text-slate-400 mt-0.5">{unit}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* AI Intelligence Footer */}
                                <footer className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                                        <Shield size={14} className="text-blue-500" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">AI Safety Assessment</p>
                                        <p className="text-[13px] font-medium text-slate-700 leading-snug italic">
                                            "{u.ai_assessment}"
                                        </p>
                                    </div>
                                </footer>
                            </article>
                        );
                    })}
                </div>
            </section>

            {/* Visual trends section */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
                {[
                    {
                        title: 'Biometric Heart Rate Grid', sub: 'Critical Threshold: 115 BPM (Night Transit Surveillance)',
                        icon: Heart, dataKey: 'hr', unit: 'BPM', domain: [50, 150] as [number, number],
                        color: '#ec4899', refY: 115, refLabel: 'SOS LEVEL'
                    },
                    {
                        title: 'GSR Electrodermal Monitoring', sub: 'Elevated Fear/Sweat Threshold: 3.0 μS (Assault Detection)',
                        icon: Activity, dataKey: 'gsr', unit: 'μS', domain: [0, 6] as [number, number],
                        color: '#8b5cf6', refY: 3.0, refLabel: 'ALERT LEVEL'
                    },
                ].map(({ title, sub, icon: Icon, dataKey, unit, domain, color, refY, refLabel }) => (
                    <div key={title} className="card p-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center`} style={{ color }}>
                                    <Icon size={20} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 tracking-tight">{title}</h3>
                                    <p className="text-xs font-semibold text-slate-400">{sub}</p>
                                </div>
                            </div>
                            <Info size={16} className="text-slate-300 cursor-help" />
                        </div>

                        <div className="h-[280px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData.length > 0 ? chartData : [{ time: '—' }]}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                    <XAxis dataKey="time" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} tickLine={false} axisLine={false} />
                                    <YAxis domain={domain} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} tickLine={false} axisLine={false} />
                                    <Tooltip contentStyle={chartTooltipStyle} />
                                    <Legend align="right" verticalAlign="top" iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 800, paddingBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' }} />
                                    <ReferenceLine y={refY} stroke={color} strokeDasharray="6 6" label={{ value: refLabel, fill: color, fontSize: 10, fontWeight: 900, position: 'right' }} />
                                    {vitals.map((v, i) => (
                                        <Line
                                            key={v.user_id}
                                            type="monotone"
                                            dataKey={`${dataKey}_${v.user_id}`}
                                            name={v.name}
                                            stroke={['#ec4899', '#8b5cf6', '#3b82f6', '#f59e0b'][i]}
                                            strokeWidth={3}
                                            dot={false}
                                            activeDot={{ r: 6, strokeWidth: 0 }}
                                        />
                                    ))}
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-screen text-xs font-black text-slate-400 uppercase tracking-widest animate-pulse">Initializing Neural Link...</div>}>
            <DashboardContent />
        </Suspense>
    );
}
