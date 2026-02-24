'use client';

import { useState } from 'react';
import { AlertTriangle, Lock, Search, ChevronDown, ChevronUp, CheckCircle, Shield, Hash } from 'lucide-react';

interface IncidentRecord {
    id: string; date: string; time: string; name: string; profile: string; sector: string;
    heart_rate: number; gsr_fear_sweat_index: number; kinetic_g: number;
    status: 'RESOLVED' | 'DISPATCHED' | 'PENDING';
    evidence_hash: string; block_id: string; outcome: string; ai_confidence: string;
}

const INCIDENTS: IncidentRecord[] = [
    { id: 'INC-2025-0041', date: '2025-02-24', time: '23:17:04', name: 'Meena S.', profile: 'Female - College Student (Night Transit)', sector: 'Tambaram Night Bus Corridor, Stop 7-B', heart_rate: 128, gsr_fear_sweat_index: 4.21, kinetic_g: 3.1, status: 'RESOLVED', evidence_hash: '0x3f9a1b7c2e4d6f8a0b5c9d2e7f1a4b6c', block_id: 'BLOCK#0041-TN-KVL', outcome: 'Patrol responded in 4 mins. Suspect apprehended. Survivor safe.', ai_confidence: '97.4%' },
    { id: 'INC-2025-0038', date: '2025-02-24', time: '21:02:51', name: 'Kavitha R.', profile: 'Female - Garment Worker (Vellore Sector)', sector: 'Vellore Industrial Gate 3 — Night Exit', heart_rate: 122, gsr_fear_sweat_index: 3.87, kinetic_g: 2.6, status: 'DISPATCHED', evidence_hash: '0xa1c4e7b2d5f8a3c6e9b2d5f8a3c6e9b2', block_id: 'BLOCK#0038-TN-KVL', outcome: 'Patrol unit en route. ETA 7 mins.', ai_confidence: '94.1%' },
    { id: 'INC-2025-0031', date: '2025-02-23', time: '02:44:18', name: 'Selvi K.', profile: 'Female - Domestic Worker (Remote Area)', sector: 'Ambattur Dark Zone — Lane 12', heart_rate: 135, gsr_fear_sweat_index: 4.73, kinetic_g: 3.8, status: 'RESOLVED', evidence_hash: '0x7d2f9a4c1e6b3f8a5d2c9e4f1b6a3d8c', block_id: 'BLOCK#0031-TN-KVL', outcome: 'Wearable SOS activated. Police arrived in 6 mins. Zero-network protocol worked.', ai_confidence: '99.1%' },
    { id: 'INC-2025-0027', date: '2025-02-22', time: '19:55:33', name: 'Priya N.', profile: 'Female - IT Professional', sector: 'OMR Cab Pickup Point — Night', heart_rate: 118, gsr_fear_sweat_index: 3.42, kinetic_g: 2.2, status: 'RESOLVED', evidence_hash: '0x2c8f5a9d3e7b1f4a6c0e3d8f2a5c9e67', block_id: 'BLOCK#0027-TN-KVL', outcome: 'False positive confirmed — rough road. Biometric calibration updated.', ai_confidence: '81.3%' },
    { id: 'INC-2025-0019', date: '2025-02-20', time: '00:12:09', name: 'Meena S.', profile: 'Female - College Student (Night Transit)', sector: 'Tambaram Bus Terminal — Platform 4', heart_rate: 141, gsr_fear_sweat_index: 4.91, kinetic_g: 4.1, status: 'RESOLVED', evidence_hash: '0xf3a8c1e5b2d7f4a9c3e6b1d4f7a2c5e8', block_id: 'BLOCK#0019-TN-KVL', outcome: 'Assault attempt. Perpetrator arrested. Tamper-proof biometric evidence used in FIR.', ai_confidence: '99.8%' },
];

const STATUS_CFG = {
    RESOLVED: { badge: 'badge-safe', row: 'hover:border-emerald-200' },
    DISPATCHED: { badge: 'badge-alert', row: 'hover:border-amber-200' },
    PENDING: { badge: 'badge-critical', row: 'hover:border-red-200' },
};

export default function IncidentsPage() {
    const [search, setSearch] = useState('');
    const [expanded, setExpanded] = useState<string | null>(null);
    const [filter, setFilter] = useState<'ALL' | 'RESOLVED' | 'DISPATCHED' | 'PENDING'>('ALL');

    const filtered = INCIDENTS.filter(i =>
        (filter === 'ALL' || i.status === filter) &&
        (i.name.toLowerCase().includes(search.toLowerCase()) ||
            i.sector.toLowerCase().includes(search.toLowerCase()) ||
            i.id.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="p-6 flex flex-col gap-5 h-full overflow-auto animate-fade-in">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-slate-900">Tamper-Proof SOS Ledger</h1>
                    <p className="text-sm text-slate-500">Cryptographically hashed biometric evidence — court admissible</p>
                </div>
                <span className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-violet-700 bg-violet-50 border border-violet-200">
                    <Lock size={12} /> Blockchain-Anchored Evidence Chain
                </span>
            </div>

            {/* Trust banner */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm bg-emerald-50 border border-emerald-200">
                <CheckCircle size={16} className="text-emerald-600 flex-shrink-0" />
                <p className="text-emerald-800">
                    All biometric events are <strong>cryptographically hashed</strong> at the wearable device level.
                    Data is immutable, timestamped, and tamper-evident — valid legal evidence under IPC 354.
                </p>
            </div>

            {/* Summary counts */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    { label: 'Resolved', value: INCIDENTS.filter(i => i.status === 'RESOLVED').length, icon: CheckCircle, bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700' },
                    { label: 'Dispatched', value: INCIDENTS.filter(i => i.status === 'DISPATCHED').length, icon: AlertTriangle, bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700' },
                    { label: 'Pending', value: INCIDENTS.filter(i => i.status === 'PENDING').length, icon: AlertTriangle, bg: 'bg-red-50 border-red-200', text: 'text-red-700' },
                ].map(({ label, value, icon: Icon, bg, text }) => (
                    <div key={label} className={`card p-4 flex items-center gap-3 border ${bg}`}>
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${bg}`}>
                            <Icon size={16} className={text} />
                        </div>
                        <div>
                            <p className={`text-2xl font-black ${text}`}>{value}</p>
                            <p className="text-xs text-slate-500">{label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filter row */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input id="incident-search" type="text" value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search by name, incident ID, or sector…"
                        className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm bg-white border border-slate-200 text-slate-900 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all placeholder:text-slate-300" />
                </div>
                {(['ALL', 'RESOLVED', 'DISPATCHED', 'PENDING'] as const).map(s => (
                    <button key={s} id={`filter-${s.toLowerCase()}`} onClick={() => setFilter(s)}
                        className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${filter === s
                                ? 'bg-blue-50 border-blue-200 text-blue-700'
                                : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                            }`}>{s}</button>
                ))}
            </div>

            {/* Incident records */}
            <div className="flex flex-col gap-2 pb-4">
                {filtered.length === 0 && (
                    <div className="card p-8 text-center text-sm text-slate-400">No incidents match the current filter.</div>
                )}
                {filtered.map(inc => {
                    const cfg = STATUS_CFG[inc.status];
                    const isOpen = expanded === inc.id;
                    return (
                        <div key={inc.id} id={`incident-${inc.id}`}
                            className={`card transition-all ${isOpen ? 'border-blue-200 shadow-md' : `border-slate-200 ${cfg.row}`}`}>

                            <button className="w-full flex items-center gap-4 px-5 py-4 text-left"
                                onClick={() => setExpanded(isOpen ? null : inc.id)}>
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-red-50">
                                    <AlertTriangle size={15} className="text-red-500" />
                                </div>
                                <div className="flex flex-col min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold" style={{ color: '#db2777' }}>{inc.id}</span>
                                        <span className="text-xs text-slate-400">{inc.date} {inc.time} IST</span>
                                    </div>
                                    <p className="text-sm font-semibold text-slate-900 mt-0.5">
                                        {inc.name} — <span className="text-slate-400 font-normal text-xs">{inc.profile}</span>
                                    </p>
                                    <p className="text-xs text-slate-400 truncate mt-0.5">{inc.sector}</p>
                                </div>
                                <div className="flex items-center gap-3 flex-shrink-0">
                                    <span className={cfg.badge}>{inc.status}</span>
                                    <span className="text-xs text-slate-400 font-semibold">AI: {inc.ai_confidence}</span>
                                    {isOpen ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
                                </div>
                            </button>

                            {isOpen && (
                                <div className="px-5 pb-5 pt-1 flex flex-col gap-4 border-t border-slate-100">
                                    {/* Vitals */}
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { label: 'Heart Rate', value: `${inc.heart_rate} BPM` },
                                            { label: 'Fear GSR Index', value: `${inc.gsr_fear_sweat_index} μS` },
                                            { label: 'Kinetic Struggle', value: `${inc.kinetic_g}g` },
                                        ].map(({ label, value }) => (
                                            <div key={label} className="flex flex-col gap-1 p-3 rounded-xl bg-red-50 border border-red-200">
                                                <p className="text-xs text-red-400">{label}</p>
                                                <p className="text-lg font-black text-red-700">{value}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Evidence hash */}
                                    <div className="p-4 rounded-xl bg-violet-50 border border-violet-200">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Hash size={12} className="text-violet-600" />
                                            <span className="text-xs font-semibold text-violet-700">Tamper-Proof Evidence Chain</span>
                                        </div>
                                        <div className="flex flex-col gap-1.5 text-xs">
                                            <div className="flex items-center gap-2">
                                                <span className="text-slate-500">Evidence Hash:</span>
                                                <code className="font-mono text-violet-700">{inc.evidence_hash}</code>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-slate-500">Block ID:</span>
                                                <code className="font-mono text-violet-700">{inc.block_id}</code>
                                            </div>
                                            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-violet-200">
                                                <Lock size={10} className="text-emerald-600" />
                                                <span className="text-emerald-700 font-medium">Cryptographically sealed — immutable FIR evidence</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Outcome */}
                                    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                                        <Shield size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                                        <p className="text-sm text-slate-700">
                                            <strong className="text-slate-900">Outcome: </strong>{inc.outcome}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
