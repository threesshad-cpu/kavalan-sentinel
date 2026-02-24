'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Eye, EyeOff, Lock, User, AlertTriangle, Zap, Heart, CheckCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [badgeId, setBadgeId] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!badgeId || !password) { setError('All credentials are required.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    router.push('/dashboard?mode=live');
  };

  return (
    <div className="min-h-screen flex bg-slate-50">

      {/* ── Left brand panel ───────────────────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] flex-shrink-0 p-10"
        style={{ background: 'linear-gradient(160deg, #7c3aed 0%, #db2777 65%, #9d174d 100%)' }}>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm">KAVALAN SENTINEL</p>
            <p className="text-white/60 text-xs">Tamil Nadu Police · WSD</p>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-5">
            <Heart size={16} className="text-pink-200" fill="currentColor" />
            <span className="text-white/80 text-sm font-semibold">Women's Bio-Safety Grid</span>
          </div>
          <h2 className="text-4xl font-black text-white leading-tight mb-4">
            Protecting women<br />in zero-network<br />zones.
          </h2>
          <p className="text-white/70 text-sm leading-relaxed mb-10">
            Real-time biometric monitoring powered by wearable SOS technology.
            Tamper-proof evidence. Instant patrol dispatch.
          </p>
          {[
            { t: '4 Active Sentinels', s: 'Women currently monitored' },
            { t: 'Zero-Network Ready', s: 'Works offline via wearable mesh' },
            { t: 'Court-Admissible Evidence', s: 'Cryptographic bio-hash on device' },
          ].map(({ t, s }) => (
            <div key={t} className="flex items-start gap-3 mb-3">
              <CheckCircle size={16} className="text-white/60 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-white text-sm font-semibold">{t}</p>
                <p className="text-white/55 text-xs">{s}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-white/35 text-xs">© 2025 Niral Thiruvizha Hackathon · Kavalan v2.0</p>
      </div>

      {/* ── Right form panel ───────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-sm animate-fade-in">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#db2777)' }}>
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-slate-900">KAVALAN SENTINEL</p>
              <p className="text-xs" style={{ color: '#db2777' }}>Women's Bio-Safety Grid</p>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-1">Officer Sign In</h1>
          <p className="text-sm text-slate-500 mb-6">Authorized TN Police personnel only</p>

          {/* Restricted notice */}
          <div className="flex items-center gap-2 mb-6 p-3 rounded-lg text-xs
                        bg-violet-50 border border-violet-200 text-violet-700">
            <Lock size={12} className="flex-shrink-0" />
            Classified system — Badge ID &amp; passphrase required
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            {/* Badge */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Officer Badge ID
              </label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input id="badge-id" type="text" value={badgeId}
                  onChange={e => setBadgeId(e.target.value)}
                  placeholder="TN-WSD-BADGE-XXXX"
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm bg-white border border-slate-200 text-slate-900
                                               outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all placeholder:text-slate-300" />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Secure Passphrase
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input id="password" type={showPass ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2.5 rounded-lg text-sm bg-white border border-slate-200 text-slate-900
                                               outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all placeholder:text-slate-300" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg text-sm bg-red-50 border border-red-200 text-red-700">
                <AlertTriangle size={14} className="flex-shrink-0" />
                {error}
              </div>
            )}

            <button id="login-btn" type="submit" disabled={loading}
              className="w-full py-2.5 rounded-lg font-semibold text-sm text-white mt-1 transition-all
                                       disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: loading ? '#94a3b8' : 'linear-gradient(135deg,#7c3aed,#db2777)',
                boxShadow: loading ? 'none' : '0 4px 14px rgba(219,39,119,0.3)'
              }}>
              {loading
                ? <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin-fast" />
                  Authenticating…
                </span>
                : 'Sign In to Control Room'
              }
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400">or</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <button id="demo-mode-btn" onClick={() => router.push('/dashboard?mode=demo')}
            className="w-full py-2.5 rounded-lg font-semibold text-sm text-slate-600 bg-white border border-slate-200
                                   shadow-sm hover:border-violet-300 hover:text-violet-700 hover:bg-violet-50 transition-all flex items-center justify-center gap-2">
            <Zap size={14} />
            Bypass to Demo Mode
          </button>
        </div>
      </div>
    </div>
  );
}
