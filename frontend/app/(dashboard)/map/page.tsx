'use client';

import { useState } from 'react';
import { MapPin, AlertTriangle, Eye, Radio, Lock, CheckCircle, Shield } from 'lucide-react';

type CorridorStatus = 'SAFE_MONITORED' | 'ALERT' | 'DARK_ZONE';
interface Corridor { id: string; name: string; type: string; status: CorridorStatus; coverage: string; cameras: number; patrols: number; row: number; col: number; width: number; height: number; }
interface Dot { id: string; name: string; status: 'SAFE' | 'ALERT' | 'CRITICAL_SOS'; x: number; y: number; }

const CORRIDORS: Corridor[] = [
    { id: 'C1', name: 'Tambaram Night Bus Route', type: 'Night Transit Corridor', status: 'ALERT', coverage: '68%', cameras: 12, patrols: 2, row: 10, col: 5, width: 55, height: 8 },
    { id: 'C2', name: "OMR Women's Tech Safe Lane", type: 'IT Corridor', status: 'SAFE_MONITORED', coverage: '95%', cameras: 28, patrols: 4, row: 30, col: 30, width: 60, height: 8 },
    { id: 'C3', name: 'Vellore Garment Worker Walk', type: 'Industrial Corridor', status: 'SAFE_MONITORED', coverage: '82%', cameras: 18, patrols: 3, row: 55, col: 10, width: 50, height: 8 },
    { id: 'C4', name: 'Ambattur Dark Zone', type: 'Residential — Unlit', status: 'DARK_ZONE', coverage: '12%', cameras: 2, patrols: 0, row: 70, col: 55, width: 40, height: 8 },
    { id: 'C5', name: 'Chennai Central Safe Corridor', type: 'High-Density Monitored', status: 'SAFE_MONITORED', coverage: '99%', cameras: 45, patrols: 6, row: 45, col: 20, width: 45, height: 8 },
];
const DOTS: Dot[] = [
    { id: 'KVL-F-001', name: 'Meena S.', status: 'SAFE', x: 18, y: 14 },
    { id: 'KVL-F-002', name: 'Kavitha R.', status: 'ALERT', x: 38, y: 59 },
    { id: 'KVL-F-003', name: 'Priya N.', status: 'SAFE', x: 62, y: 34 },
    { id: 'KVL-F-004', name: 'Selvi K.', status: 'SAFE', x: 70, y: 74 },
];
const CCFG: Record<CorridorStatus, { bg: string; border: string; text: string; dot: string; badge: string; label: string }> = {
    SAFE_MONITORED: { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-700', dot: 'bg-emerald-500', badge: 'badge-safe', label: 'Safe · Monitored' },
    ALERT: { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-700', dot: 'bg-amber-500', badge: 'badge-alert', label: 'Alert · Low Coverage' },
    DARK_ZONE: { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-700', dot: 'bg-red-500', badge: 'badge-critical', label: 'Dark Zone · No Coverage' },
};
const DOT_COLOR: Record<string, string> = { SAFE: '#10b981', ALERT: '#f59e0b', CRITICAL_SOS: '#ef4444' };

export default function MapPage() {
    const [selected, setSelected] = useState<Corridor | null>(null);
    return (
        <div className="p-6 flex flex-col gap-5 h-full overflow-auto animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-slate-900">Women's Safety Corridors</h1>
                    <p className="text-sm text-slate-500">TN Police Bio-Safety Grid — Chennai &amp; Vellore District</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-violet-700 bg-violet-50 border border-violet-200">
                        <Radio size={11} /> 4 Sentinels Tracked
                    </span>
                    <span className="badge-critical flex items-center gap-1.5">
                        <AlertTriangle size={11} /> 1 Dark Zone Active
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 flex-1 min-h-0">
                {/* Map */}
                <div className="col-span-2 card p-5 flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <MapPin size={13} style={{ color: '#db2777' }} />
                        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Tamil Nadu · Women's Safety Grid · Live</span>
                    </div>
                    <div className="relative flex-1 rounded-xl overflow-hidden border border-slate-200 bg-slate-50" style={{ minHeight: 340 }}>
                        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                            {Array.from({ length: 11 }).map((_, i) => (
                                <g key={i}>
                                    <line x1={`${i * 10}%`} y1="0" x2={`${i * 10}%`} y2="100%" stroke="#e2e8f0" strokeWidth="0.8" />
                                    <line x1="0" y1={`${i * 10}%`} x2="100%" y2={`${i * 10}%`} stroke="#e2e8f0" strokeWidth="0.8" />
                                </g>
                            ))}
                        </svg>
                        <p className="absolute top-2 left-3 text-xs text-slate-300 pointer-events-none select-none font-semibold">N 13.2°</p>
                        <p className="absolute bottom-2 right-3 text-xs text-slate-300 pointer-events-none select-none font-semibold">S 12.8°</p>

                        {CORRIDORS.map(c => {
                            const cfg = CCFG[c.status];
                            return (
                                <button key={c.id} id={`corridor-${c.id}`}
                                    className={`absolute rounded-lg border transition-all ${cfg.bg} ${cfg.border} ${selected?.id === c.id ? 'ring-2 ring-offset-1 ring-blue-300' : ''}`}
                                    style={{ top: `${c.row}%`, left: `${c.col}%`, width: `${c.width}%`, height: `${c.height}%` }}
                                    onClick={() => setSelected(c)}>
                                    <div className={`flex items-center gap-1.5 px-2 h-full ${cfg.text}`}>
                                        {c.status === 'DARK_ZONE' ? <Lock size={9} className="flex-shrink-0" /> : <Eye size={9} className="flex-shrink-0" />}
                                        <span className="truncate font-semibold" style={{ fontSize: 9 }}>{c.name}</span>
                                    </div>
                                </button>
                            );
                        })}

                        {DOTS.map(d => (
                            <div key={d.id} className="absolute" style={{ left: `${d.x}%`, top: `${d.y}%`, transform: 'translate(-50%,-50%)', zIndex: 10 }}>
                                <div className="absolute inset-0 rounded-full opacity-30" style={{ background: DOT_COLOR[d.status], transform: 'scale(2.8)', animation: 'pulse 1.8s ease-in-out infinite' }} />
                                <div className="relative w-5 h-5 rounded-full flex items-center justify-center text-white border-2 border-white shadow-md font-bold" style={{ background: DOT_COLOR[d.status], fontSize: 8 }}>
                                    {d.name[0]}
                                </div>
                                <span className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-1.5 py-0.5 rounded-md border bg-white shadow-sm font-semibold" style={{ color: DOT_COLOR[d.status], borderColor: DOT_COLOR[d.status] + '40', fontSize: 8 }}>
                                    {d.name}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-5 flex-wrap">
                        {Object.values(CCFG).map(cfg => (
                            <div key={cfg.label} className="flex items-center gap-1.5 text-xs text-slate-500">
                                <span className={`w-3 h-3 rounded border ${cfg.bg} ${cfg.border}`} />
                                {cfg.label}
                            </div>
                        ))}
                        <div className="ml-auto flex items-center gap-1.5 text-xs text-slate-500">
                            <span className="w-3 h-3 rounded-full border-2 border-white shadow" style={{ background: '#db2777' }} /> Live Sentinel
                        </div>
                    </div>
                </div>

                {/* Side panels */}
                <div className="flex flex-col gap-4 min-h-0 overflow-auto">
                    {selected ? (
                        <div className="card p-5 animate-fade-in">
                            <div className="flex items-start justify-between mb-3">
                                <h3 className="text-sm font-bold text-slate-900 pr-2">{selected.name}</h3>
                                <span className={CCFG[selected.status].badge}>{selected.status.replace('_', ' ')}</span>
                            </div>
                            <p className="text-xs text-slate-400 mb-4">{selected.type}</p>
                            {[
                                { label: 'CCTV Coverage', value: selected.coverage, bad: selected.coverage === '12%' },
                                { label: 'Cameras Active', value: `${selected.cameras}` },
                                { label: 'Patrol Units', value: `${selected.patrols}`, bad: selected.patrols === 0 },
                            ].map(({ label, value, bad }) => (
                                <div key={label} className="flex justify-between py-2 border-b border-slate-100 text-sm">
                                    <span className="text-slate-500">{label}</span>
                                    <span className={`font-bold ${bad ? 'text-red-600' : 'text-slate-900'}`}>{value}</span>
                                </div>
                            ))}
                            {selected.status === 'DARK_ZONE' && (
                                <div className="mt-4 p-3 rounded-lg text-xs badge-critical flex items-start gap-2">
                                    <AlertTriangle size={12} className="flex-shrink-0 mt-0.5" />
                                    Zero-network zone — wearable is the <strong>only</strong> protection here.
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="card p-5 flex flex-col items-center justify-center gap-3 text-center" style={{ minHeight: 160 }}>
                            <MapPin size={28} className="text-slate-300" />
                            <p className="text-sm text-slate-400">Click a corridor to view details</p>
                        </div>
                    )}

                    <div className="card p-4 flex-1 overflow-auto">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">All Corridors</p>
                        <div className="flex flex-col gap-1.5">
                            {CORRIDORS.map(c => {
                                const cfg = CCFG[c.status];
                                return (
                                    <button key={c.id} id={`corridor-list-${c.id}`} onClick={() => setSelected(c)}
                                        className={`flex items-start gap-2.5 p-3 rounded-lg text-left w-full border transition-colors ${selected?.id === c.id ? `${cfg.bg} ${cfg.border}` : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}>
                                        <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${cfg.dot}`} />
                                        <div>
                                            <p className="text-xs font-semibold text-slate-800">{c.name}</p>
                                            <p className="text-xs text-slate-400">{c.coverage} · {c.patrols} patrols</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="card p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Grid Summary</p>
                        {[
                            { label: 'Monitored', value: CORRIDORS.filter(c => c.status === 'SAFE_MONITORED').length, icon: CheckCircle, cls: 'text-emerald-600' },
                            { label: 'Alert Zones', value: CORRIDORS.filter(c => c.status === 'ALERT').length, icon: AlertTriangle, cls: 'text-amber-600' },
                            { label: 'Dark Zones', value: CORRIDORS.filter(c => c.status === 'DARK_ZONE').length, icon: Lock, cls: 'text-red-600' },
                        ].map(({ label, value, icon: Icon, cls }) => (
                            <div key={label} className="flex justify-between items-center mb-2 text-sm">
                                <div className={`flex items-center gap-2 text-slate-500`}><Icon size={12} className={cls} />{label}</div>
                                <span className={`font-bold ${cls}`}>{value}</span>
                            </div>
                        ))}
                    </div>

                    <div className="card p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5"><Shield size={11} /> Active Sentinels</p>
                        {DOTS.map(d => (
                            <div key={d.id} className="flex items-center gap-2 py-1.5 text-sm">
                                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: DOT_COLOR[d.status] }} />
                                <span className="text-slate-800">{d.name}</span>
                                <span className="ml-auto text-xs font-semibold" style={{ color: DOT_COLOR[d.status] }}>{d.status}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
