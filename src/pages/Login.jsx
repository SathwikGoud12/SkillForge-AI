import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import AppwriteAccount from "../appwrite/Account.services";
import useAuthStore from "../store/authStore";

const ACCENT = '#e879f9';
const ACCENT2 = '#a855f7';

/* Animated particle dot */
function Dot({ style }) {
  return <div style={{ position: 'absolute', borderRadius: '50%', animation: 'float 4s ease-in-out infinite', ...style }} />;
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [focusedField, setFocusedField] = useState(null);

  const navigate = useNavigate();
  const appwriteAccount = new AppwriteAccount();
  const setCurrentUser = useAuthStore((s) => s.setCurrentUser);
  const setIsCheckingUser = useAuthStore((s) => s.setIsCheckingUser);

  useEffect(() => {
    async function check() {
      try {
        const u = await appwriteAccount.getAppwriteUser();
        if (u) {
          setCurrentUser(u);
          setIsCheckingUser(false);
          navigate(u.labels?.includes('admin') ? "/dashboard" : "/user", { replace: true });
          return;
        }
      } catch { /* no session */ } finally { setCheckingSession(false); }
    }
    check();
  }, []);

  async function handleLogin(e) {
    if (e?.preventDefault) e.preventDefault();
    setError(""); setLoading(true);
    try {
      await appwriteAccount.createAppwriteEmailPasswordSession(email, password);
      const u = await appwriteAccount.getAppwriteUser();
      if (!u) throw new Error("Could not retrieve user after login.");
      setCurrentUser(u); setIsCheckingUser(false);
      navigate(u.labels?.includes('admin') ? "/dashboard" : "/user");
    } catch (err) {
      setError(err?.message || "Login failed. Please check your credentials.");
    } finally { setLoading(false); }
  }

  const inputStyle = (field) => ({
    width: '100%', padding: '13px 14px', borderRadius: 12, outline: 'none', fontSize: 14, fontWeight: 500,
    background: focusedField === field ? '#fff' : '#fafafa',
    border: `1.5px solid ${focusedField === field ? ACCENT : '#e5e7eb'}`,
    color: '#111', transition: 'all 0.2s',
    boxShadow: focusedField === field ? `0 0 0 4px ${ACCENT}15` : 'none',
  });

  if (checkingSession) return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: `linear-gradient(135deg, ${ACCENT2}, ${ACCENT})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 30px ${ACCENT}50` }}>
          <span style={{ color: 'white', fontWeight: 900, fontSize: 22 }}>SF</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[0, 1, 2].map(i => <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: ACCENT, animation: `bounce 1s ease-in-out infinite`, animationDelay: `${i * 150}ms` }} />)}
        </div>
        <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>
      </div>
    </div>
  );

  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', fontFamily: "'Inter','Segoe UI',sans-serif", overflow: 'hidden' }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      {/* ── LEFT PANEL (dark animated) ── */}
      <div style={{ flex: '0 0 52%', background: '#000', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 48 }}>

        {/* Grid overlay */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none' }} />

        {/* Glow blobs */}
        <div style={{ position: 'absolute', top: '8%', left: '-10%', width: 360, height: 360, borderRadius: '50%', background: `radial-gradient(circle, ${ACCENT}22 0%, transparent 70%)`, filter: 'blur(50px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '5%', right: '-5%', width: 300, height: 300, borderRadius: '50%', background: `radial-gradient(circle, ${ACCENT2}20 0%, transparent 70%)`, filter: 'blur(50px)', pointerEvents: 'none' }} />

        {/* Floating dots */}
        {[
          { w: 6, h: 6, bg: ACCENT, top: '15%', left: '20%', delay: '0s', dur: '3.5s' },
          { w: 4, h: 4, bg: ACCENT2, top: '30%', right: '18%', delay: '1s', dur: '4s' },
          { w: 5, h: 5, bg: '#34d399', bottom: '25%', left: '15%', delay: '0.5s', dur: '3s' },
          { w: 3, h: 3, bg: ACCENT, bottom: '35%', right: '25%', delay: '1.5s', dur: '4.5s' },
          { w: 7, h: 7, bg: ACCENT2, top: '55%', left: '40%', delay: '0.8s', dur: '3.8s' },
        ].map((d, i) => <Dot key={i} style={{ width: d.w, height: d.h, background: d.bg, top: d.top, left: d.left, right: d.right, bottom: d.bottom, opacity: 0.7, animationDelay: d.delay, animationDuration: d.dur }} />)}

        {/* Rotating ring */}
        <div style={{ position: 'absolute', width: 420, height: 420, borderRadius: '50%', border: `1px solid ${ACCENT}15`, animation: 'spin 18s linear infinite', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 320, height: 320, borderRadius: '50%', border: `1px dashed ${ACCENT2}20`, animation: 'spin 12s linear infinite reverse', pointerEvents: 'none' }} />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 480 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 48 }}>
            <div style={{ width: 46, height: 46, borderRadius: 14, background: `linear-gradient(135deg, ${ACCENT2}, ${ACCENT})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 24px ${ACCENT}50` }}>
              <span style={{ color: 'white', fontWeight: 900, fontSize: 18 }}>SF</span>
            </div>
            <span style={{ fontSize: 26, fontWeight: 900, color: 'white', letterSpacing: '-0.5px' }}>SkillForge</span>
            <span style={{ fontSize: 10, fontWeight: 800, color: ACCENT, background: `${ACCENT}18`, border: `1px solid ${ACCENT}40`, borderRadius: 50, padding: '2px 8px', letterSpacing: '0.1em' }}>AI</span>
          </div>

          {/* Headline */}
          <h1 style={{ fontSize: 38, fontWeight: 900, color: 'white', lineHeight: 1.1, margin: '0 0 16px', letterSpacing: '-1px' }}>
            Master Skills.<br />
            <span style={{ color: ACCENT, textShadow: `0 0 30px ${ACCENT}60` }}>Land Your Dream Job.</span>
          </h1>

          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, margin: '0 0 40px' }}>
            AI mentorship · Structured roadmaps · Real-world projects · Industry certificates
          </p>

          {/* Feature pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {['🤖 AI Mentor', '📊 Progress Tracking', '🏆 Certificates', '🎯 50+ Domains', '⚡ Daily Streaks'].map((f, i) => (
              <div key={i} style={{ padding: '7px 16px', borderRadius: 50, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(8px)' }}>{f}</div>
            ))}
          </div>

          {/* Learner count */}
          <div style={{ marginTop: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <div style={{ display: 'flex' }}>
              {['👩‍💻', '👨‍🎓', '👩‍🎓', '👨‍💻'].map((em, i) => (
                <div key={i} style={{ width: 32, height: 32, borderRadius: '50%', background: `linear-gradient(135deg, ${ACCENT2}, ${ACCENT})`, border: '2px solid #000', marginLeft: i === 0 ? 0 : -8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>{em}</div>
              ))}
            </div>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>+10,000 learners already leveling up</span>
          </div>
        </div>

        <style>{`
          @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
          @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        `}</style>
      </div>

      {/* ── RIGHT PANEL (white form) ── */}
      <div style={{ flex: 1, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48, overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: 380 }}>

          {/* Logo (mobile / standalone) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 36 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: `linear-gradient(135deg, ${ACCENT2}, ${ACCENT})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontWeight: 900, fontSize: 13 }}>SF</span>
            </div>
            <span style={{ fontWeight: 900, fontSize: 17, color: '#111', letterSpacing: '-0.3px' }}>SkillForge</span>
          </div>

          <h2 style={{ fontSize: 26, fontWeight: 900, color: '#0f172a', margin: '0 0 6px', letterSpacing: '-0.5px' }}>Welcome back 👋</h2>
          <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 32px', fontWeight: 500 }}>Login to continue your learning journey.</p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 7 }}>Email address</label>
              <input type="email" id="email" autoComplete="email" placeholder="you@example.com" value={email}
                onChange={e => setEmail(e.target.value)} required
                style={inputStyle('email')}
                onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)}
              />
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>Password</label>
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ background: 'none', border: 'none', fontSize: 13, color: ACCENT2, fontWeight: 600, cursor: 'pointer' }}>
                  {showPw ? 'Hide' : 'Show'}
                </button>
              </div>
              <input type={showPw ? 'text' : 'password'} id="password" autoComplete="current-password" placeholder="Your password" value={password}
                onChange={e => setPassword(e.target.value)} required
                style={inputStyle('password')}
                onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)}
              />
            </div>

            {/* Error */}
            {error && (
              <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#e11d48', fontWeight: 600 }}>
                ⚠️ {error}
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading}
              style={{ background: loading ? '#c084fc' : `linear-gradient(135deg, ${ACCENT2}, ${ACCENT})`, color: 'white', border: 'none', padding: '14px', borderRadius: 12, cursor: loading ? 'not-allowed' : 'pointer', fontSize: 15, fontWeight: 800, boxShadow: `0 4px 20px ${ACCENT}45`, transition: 'all 0.2s', letterSpacing: '0.01em' }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}>
              {loading ? 'Signing in…' : 'Login to SkillForge →'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '22px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#f1f5f9' }} />
            <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>OR</span>
            <div style={{ flex: 1, height: 1, background: '#f1f5f9' }} />
          </div>

          {/* Google */}
          <button onClick={() => alert('Google login coming soon!')}
            style={{ width: '100%', background: '#fff', border: '1.5px solid #e5e7eb', color: '#111', padding: '12px', borderRadius: 12, cursor: 'pointer', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#d1d5db'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#e5e7eb'; }}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
            Continue with Google
          </button>

          {/* Register link */}
          <p style={{ textAlign: 'center', marginTop: 28, fontSize: 14, color: '#64748b', fontWeight: 500 }}>
            Don't have an account?{' '}
            <button onClick={() => navigate('/register')} style={{ background: 'none', border: 'none', color: ACCENT2, fontWeight: 800, cursor: 'pointer', fontSize: 14, textDecoration: 'underline' }}>
              Sign Up Free
            </button>
          </p>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 11, color: '#cbd5e1', lineHeight: 1.5 }}>
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
