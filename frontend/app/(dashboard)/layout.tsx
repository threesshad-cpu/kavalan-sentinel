'use client';

import { useState, useEffect, useCallback, Suspense, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
    Shield, LayoutDashboard, Map, AlertTriangle, BarChart2,
    Activity, Wifi, WifiOff, Bell, Heart, ChevronRight, X, Radio
} from 'lucide-react';

interface VitalData {
    user_id: string; name: string; sector: string;
    status: 'SAFE' | 'ALERT' | 'CRITICAL_SOS';
}

interface FeedResponse {
    status: string; vitals: VitalData[];
    critical_count: number; alert_count: number; total_active: number;
}

const NAV = [
    { href: '/dashboard', label: 'Bio-Monitor', icon: LayoutDashboard, id: 'nav-dashboard' },
    { href: '/map', label: 'Safety Corridors', icon: Map, id: 'nav-map' },
    { href: '/incidents', label: 'SOS Ledger', icon: AlertTriangle, id: 'nav-incidents' },
    { href: '/analytics', label: 'Threat Analytics', icon: BarChart2, id: 'nav-analytics' },
];

function DashboardContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const isDemoMode = searchParams.get('mode') === 'demo';
    const mode = searchParams.get('mode') || 'live';

    const [feedData, setFeedData] = useState<FeedResponse | null>(null);
    const [isCritical, setIsCritical] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [showSos, setShowSos] = useState(false);
    const [pollingActive, setPollingActive] = useState(false);
    const [sosUser, setSosUser] = useState('');
    const [sosSector, setSosSector] = useState('');

    const lastSosAt = useRef<number>(0);
    const COOLDOWN_MS = 60_000;

    const href = (path: string) => `${path}?mode=${mode}`;

    const fetchVitals = useCallback(async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'}/api/vitals`);
            const data: FeedResponse = await res.json();
            setFeedData(data);
            setIsConnected(true);
            const critical = data.status === 'CRITICAL_SOS';
            setIsCritical(critical);
            if (critical && Date.now() - lastSosAt.current > COOLDOWN_MS) {
                const u = data.vitals.find(v => v.status === 'CRITICAL_SOS');
                setSosUser(u?.name ?? 'Unknown');
                setSosSector(u?.sector ?? 'Unknown Sector');
                setShowSos(true);
                lastSosAt.current = Date.now();
            }
        } catch { setIsConnected(false); }
    }, []);

    useEffect(() => {
        if (!isDemoMode) return;
        setPollingActive(true);
        fetchVitals();
        const id = setInterval(fetchVitals, 2000);
        return () => clearInterval(id);
    }, [isDemoMode, fetchVitals]);

    const dismiss = () => { setShowSos(false); lastSosAt.current = Date.now(); };

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">

            {/* ── Sidebar ─────────────────────────────────────────────────── */}
            <aside className="flex flex-col w-[260px] flex-shrink-0 bg-white border-r border-slate-200/60 h-full">

                {/* Logo */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-200">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center relative shadow-sm"
                        style={{ background: 'linear-gradient(135deg, #7c3aed, #db2777)' }}>
                        <Shield size={20} className="text-white" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full border-2 border-white" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-900">KAVALAN</p>
                        <p className="text-xs font-semibold" style={{ color: '#db2777' }}>SENTINEL v2.0</p>
                    </div>
                </div>

                {/* Mode pill */}
                <div className="px-4 py-3 border-b border-slate-200">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold ${isDemoMode
                        ? 'bg-red-50 border border-red-200 text-red-700'
                        : 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                        }`}>
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isDemoMode ? 'bg-red-500' : 'bg-emerald-500'}`} />
                        {isDemoMode ? 'DEMO — LIVE API' : 'OPERATIONAL'}
                    </div>
                </div>

                {/* Connection */}
                {isDemoMode && (
                    <div className="px-5 py-2 flex items-center gap-2">
                        {isConnected
                            ? <><Wifi size={12} className="text-emerald-600" /><span className="text-xs font-medium text-emerald-700">API Connected</span></>
                            : <><WifiOff size={12} className="text-red-500" /><span className="text-xs font-medium text-red-600">Disconnected</span></>}
                    </div>
                )}

                {/* Nav */}
                <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
                    {NAV.map(({ href: h, label, icon: Icon, id }) => {
                        const active = pathname.startsWith(h);
                        return (
                            <Link key={h} id={id} href={href(h)}
                                className={active ? 'nav-link-active' : 'nav-link'}>
                                <Icon size={16} />
                                <span>{label}</span>
                                {active && <ChevronRight size={12} className="ml-auto text-blue-500" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* Live grid stats */}
                {feedData && (
                    <div className="px-5 py-6 border-t border-slate-100 mt-auto">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Bio-Grid Status</p>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                        <div className="space-y-3">
                            {[
                                { label: 'Total Sentinels', value: feedData.total_active, cls: 'text-slate-900', bg: 'bg-slate-100' },
                                { label: 'Elevated Alert', value: feedData.alert_count, cls: 'text-amber-700', bg: 'bg-amber-100/50' },
                                { label: 'Critical SOS', value: feedData.critical_count, cls: `text-red-700 ${feedData.critical_count > 0 ? 'animate-blink' : ''}`, bg: 'bg-red-100/50' },
                            ].map(({ label, value, cls, bg }) => (
                                <div key={label} className={`flex justify-between items-center px-3 py-2 rounded-lg ${bg}`}>
                                    <span className="text-[11px] font-bold text-slate-500">{label}</span>
                                    <span className={`text-xs font-black ${cls}`}>{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Polling badge */}
                {pollingActive && (
                    <div className="flex items-center gap-2 px-4 py-3 border-t border-slate-200 bg-slate-50">
                        <Activity size={12} style={{ color: '#db2777', animation: 'spin 2s linear infinite' }} />
                        <span className="text-xs font-medium text-slate-500">Polling every 2s</span>
                    </div>
                )}
            </aside>

            {/* ── Main ────────────────────────────────────────────────────── */}
            <main className="flex-1 flex flex-col overflow-hidden">

                {/* Top bar */}
                <header className="flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex-shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-slate-100">
                            <Radio size={12} className="text-blue-600 animate-pulse" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 tracking-[0.1em] uppercase leading-none">
                                Sector Command Feed
                            </span>
                            <span className="text-xs font-bold text-slate-600">
                                Tamil Nadu Police • Kavalan Comm-Net
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Encrypted Channel
                        </span>
                        <button id="header-notifications"
                            className="relative p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 transition-colors">
                            <Bell size={14} />
                            {isCritical && (
                                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-600 flex items-center justify-center text-white animate-blink"
                                    style={{ fontSize: '8px', fontWeight: 'bold' }}>!</span>
                            )}
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-auto dot-grid">{children}</div>
            </main>

            {/* ── Critical SOS Overlay ─────────────────────────────────────── */}
            {showSos && (
                <div className="fixed inset-0 z-50 flex items-center justify-center animate-pulse-red"
                    style={{ backdropFilter: 'blur(4px)' }}>
                    <button id="dismiss-sos" onClick={dismiss}
                        className="absolute top-6 right-6 p-2 rounded-full bg-white/25 text-white hover:bg-white/40 transition-colors">
                        <X size={20} />
                    </button>
                    <div className="text-center px-8 max-w-2xl animate-slide-up">
                        <div className="mx-auto mb-6 w-24 h-24 rounded-full bg-white/20 flex items-center justify-center
                            shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                            <AlertTriangle size={48} className="text-white" />
                        </div>
                        <h1 className="text-4xl font-black text-white mb-3 tracking-wide">⚠ CRITICAL SOS</h1>
                        <p className="text-xl font-bold text-white mb-2">HIGH-STRESS BIO-SIGNATURE DETECTED</p>
                        <p className="text-lg font-semibold text-white/90 mb-8">DISPATCHING PATROL TO WOMEN'S NIGHT-SHIFT CORRIDOR</p>
                        <div className="flex flex-col gap-2 p-5 rounded-2xl mb-8 text-left bg-black/25 border border-white/20">
                            <p className="text-sm font-mono text-white/80">SENTINEL: <strong className="text-white">{sosUser}</strong></p>
                            <p className="text-sm font-mono text-white/80">LOCATION: <strong className="text-white">{sosSector}</strong></p>
                            <p className="text-sm font-mono text-white/80">HEART RATE: <strong className="text-white">&gt;115 BPM — FEAR RESPONSE</strong></p>
                            <p className="text-sm font-mono text-white/80">KINETIC STRUGGLE: <strong className="text-white">&gt;2.0g — PHYSICAL ALTERCATION</strong></p>
                        </div>
                        <button onClick={dismiss}
                            className="px-10 py-3 rounded-xl font-bold text-sm tracking-wider text-red-700 bg-white hover:bg-red-50 transition-colors shadow-xl">
                            ACKNOWLEDGE &amp; CONFIRM DISPATCH
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-screen bg-slate-50">
                <p className="text-sm font-semibold text-slate-500">Loading Kavalan Bio-Grid...</p>
            </div>
        }>
            <DashboardContent>{children}</DashboardContent>
        </Suspense>
    );
}
