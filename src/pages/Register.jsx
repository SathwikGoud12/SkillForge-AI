import React, { useState } from "react";
import { useNavigate } from "react-router";
import AppwriteAccount from "../appwrite/Account.services";

const ACCENT = '#e879f9';
const ACCENT2 = '#a855f7';

function Dot({ style }) {
  return <div style={{ position: 'absolute', borderRadius: '50%', animation: 'float 4s ease-in-out infinite', ...style }} />;
}

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const appwriteAccount = new AppwriteAccount();

  async function handleRegister(e) {
    if (e?.preventDefault) e.preventDefault();
    setError("");
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      await appwriteAccount.createAppwriteAccount(email, password, fullName);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      setError(err?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleGoogleSignUp() {
    setGoogleLoading(true);
    appwriteAccount.createGoogleOAuthSession(); // redirects browser
  }

  const inputStyle = (field) => ({
    width: '100%', padding: '13px 14px', borderRadius: 12, outline: 'none', fontSize: 14, fontWeight: 500,
    background: focusedField === field ? '#fff' : '#fafafa',
    border: `1.5px solid ${focusedField === field ? ACCENT : '#e5e7eb'}`,
    color: '#111', transition: 'all 0.2s',
    boxShadow: focusedField === field ? `0 0 0 4px ${ACCENT}15` : 'none',
  });

  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', fontFamily: "'Inter','Segoe UI',sans-serif", overflow: 'hidden' }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <style>{`
        @media (max-width: 768px) {
          .sf-reg-left { display: none !important; }
          .sf-reg-right { padding: 28px 20px !important; }
        }
      `}</style>

      {/* ── LEFT PANEL ── */}
      <div className="sf-reg-left" style={{ flex: '0 0 52%', background: '#000', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 48 }}>

        {/* Grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none' }} />

        {/* Blobs */}
        <div style={{ position: 'absolute', top: '10%', right: '-5%', width: 380, height: 380, borderRadius: '50%', background: `radial-gradient(circle, ${ACCENT}22 0%, transparent 70%)`, filter: 'blur(50px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '8%', left: '-8%', width: 300, height: 300, borderRadius: '50%', background: `radial-gradient(circle, ${ACCENT2}18 0%, transparent 70%)`, filter: 'blur(50px)', pointerEvents: 'none' }} />

        {/* Dots */}
        {[
          { w: 5, h: 5, bg: ACCENT, top: '20%', right: '22%', delay: '0s', dur: '3.5s' },
          { w: 7, h: 7, bg: ACCENT2, top: '40%', left: '12%', delay: '1s', dur: '4s' },
          { w: 4, h: 4, bg: '#34d399', bottom: '30%', right: '15%', delay: '0.5s', dur: '3s' },
          { w: 6, h: 6, bg: ACCENT, bottom: '15%', left: '30%', delay: '1.5s', dur: '4.5s' },
          { w: 3, h: 3, bg: ACCENT2, top: '60%', right: '35%', delay: '0.8s', dur: '3.8s' },
        ].map((d, i) => <Dot key={i} style={{ width: d.w, height: d.h, background: d.bg, top: d.top, left: d.left, right: d.right, bottom: d.bottom, opacity: 0.7, animationDelay: d.delay, animationDuration: d.dur }} />)}

        {/* Rings */}
        <div style={{ position: 'absolute', width: 450, height: 450, borderRadius: '50%', border: `1px solid ${ACCENT}12`, animation: 'spin 20s linear infinite', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 340, height: 340, borderRadius: '50%', border: `1px dashed ${ACCENT2}18`, animation: 'spin 14s linear infinite reverse', pointerEvents: 'none' }} />

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
            Join 10,000+<br />
            <span style={{ color: ACCENT, textShadow: `0 0 30px ${ACCENT}60` }}>Ambitious Learners.</span>
          </h1>

          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, margin: '0 0 40px' }}>
            Create your free account and start your journey from student to job-ready developer today.
          </p>

          {/* What you get */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, textAlign: 'left' }}>
            {[
              { icon: '🤖', text: 'Personalized AI mentor available 24/7' },
              { icon: '🗺️', text: 'Curated roadmaps for 50+ tech domains' },
              { icon: '🏆', text: 'Earn industry-recognised certificates' },
              { icon: '📊', text: 'Track streaks, XP & skill analytics' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, backdropFilter: 'blur(8px)' }}>
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>{item.text}</span>
              </div>
            ))}
          </div>

          <p style={{ marginTop: 28, fontSize: 13, color: 'rgba(255,255,255,0.25)', fontWeight: 600 }}>
            ✓ Free forever plan &nbsp;·&nbsp; ✓ No credit card needed
          </p>
        </div>

        <style>{`
          @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
          @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        `}</style>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="sf-reg-right" style={{ flex: 1, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48, overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: 380 }}>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: `linear-gradient(135deg, ${ACCENT2}, ${ACCENT})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontWeight: 900, fontSize: 13 }}>SF</span>
            </div>
            <span style={{ fontWeight: 900, fontSize: 17, color: '#111' }}>SkillForge</span>
          </div>

          <h2 style={{ fontSize: 26, fontWeight: 900, color: '#0f172a', margin: '0 0 6px', letterSpacing: '-0.5px' }}>Create your account 🚀</h2>
          <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 28px', fontWeight: 500 }}>It's free. No credit card required.</p>

          {/* Success state */}
          {success ? (
            <div style={{ textAlign: 'center', padding: '32px 16px' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
              <h3 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', margin: '0 0 8px' }}>Account Created!</h3>
              <p style={{ color: '#64748b', fontSize: 14 }}>Redirecting you to login…</p>
            </div>
          ) : (
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Full Name */}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 7 }}>Full Name</label>
                <input type="text" id="fullName" autoComplete="name" placeholder="e.g., Sathwik Goud" value={fullName}
                  onChange={e => setFullName(e.target.value)} required
                  style={inputStyle('name')}
                  onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)}
                />
              </div>

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
                <input type={showPw ? 'text' : 'password'} id="password" autoComplete="new-password" placeholder="Min. 8 characters" value={password}
                  onChange={e => setPassword(e.target.value)} required
                  style={inputStyle('password')}
                  onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)}
                />
                {/* Strength indicator */}
                {password.length > 0 && (
                  <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: password.length >= i * 3 ? (password.length >= 10 ? '#10b981' : password.length >= 6 ? '#f59e0b' : '#ef4444') : '#e5e7eb', transition: 'all 0.3s' }} />
                    ))}
                    <span style={{ fontSize: 11, color: '#94a3b8', whiteSpace: 'nowrap', fontWeight: 600 }}>
                      {password.length >= 10 ? '✓ Strong' : password.length >= 6 ? 'Good' : 'Weak'}
                    </span>
                  </div>
                )}
              </div>

              {/* Error */}
              {error && (
                <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#e11d48', fontWeight: 600 }}>
                  ⚠️ {error}
                </div>
              )}

              {/* Submit */}
              <button type="submit" disabled={loading}
                style={{ background: loading ? '#c084fc' : `linear-gradient(135deg, ${ACCENT2}, ${ACCENT})`, color: 'white', border: 'none', padding: '14px', borderRadius: 12, cursor: loading ? 'not-allowed' : 'pointer', fontSize: 15, fontWeight: 800, boxShadow: `0 4px 20px ${ACCENT}45`, transition: 'all 0.2s' }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}>
                {loading ? 'Creating account…' : 'Create Free Account →'}
              </button>
            </form>
          )}

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#f1f5f9' }} />
            <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>OR</span>
            <div style={{ flex: 1, height: 1, background: '#f1f5f9' }} />
          </div>

          {/* Google */}
          <button onClick={handleGoogleSignUp} disabled={googleLoading}
            style={{ width: '100%', background: '#fff', border: '1.5px solid #e5e7eb', color: '#111', padding: '12px', borderRadius: 12, cursor: googleLoading ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, transition: 'all 0.2s', opacity: googleLoading ? 0.7 : 1 }}
            onMouseEnter={e => { if (!googleLoading) e.currentTarget.style.background = '#f8fafc'; }} onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}>
            {googleLoading ? (
              <>
                <div style={{ width: 18, height: 18, border: '2px solid #e5e7eb', borderTopColor: '#a855f7', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                Redirecting to Google…
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                Continue with Google
              </>
            )}
          </button>

          {/* Login link */}
          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#64748b', fontWeight: 500 }}>
            Already have an account?{' '}
            <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: ACCENT2, fontWeight: 800, cursor: 'pointer', fontSize: 14, textDecoration: 'underline' }}>
              Login here
            </button>
          </p>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 11, color: '#cbd5e1', lineHeight: 1.5 }}>
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
