import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router';

/* ──────────────────────────────────────────────────────────────
   COLOR PALETTE  (Techsnap-inspired, SkillForge brand)
   Primary accent : #e879f9 (fuchsia/magenta)
   Dark bg        : #000000 / #0a0a0a
   Mid bg         : #111111
   Light section  : #f4f4f7
   Text           : white on dark · #111 on light
──────────────────────────────────────────────────────────────── */

const ACCENT = '#e879f9';
const ACCENT2 = '#a855f7';

const domains = [
  { icon: '⚛️', name: 'React.js', tag: 'Skill Path', bg: '#61dafb20', border: '#61dafb40' },
  { icon: '🟩', name: 'Node.js', tag: 'Skill Path', bg: '#3c873a20', border: '#3c873a40' },
  { icon: '🍃', name: 'MongoDB', tag: 'Database Path', bg: '#00ed6420', border: '#00ed6440' },
  { icon: '🔷', name: 'TypeScript', tag: 'Skill Path', bg: '#3178c620', border: '#3178c640' },
  { icon: '🐍', name: 'Python', tag: 'Skill Path', bg: '#ffd43b20', border: '#ffd43b40' },
  { icon: '🤖', name: 'AI / ML', tag: 'Career Path', bg: '#e879f920', border: '#e879f940' },
  { icon: '☁️', name: 'Cloud & DevOps', tag: 'Career Path', bg: '#38bdf820', border: '#38bdf840' },
  { icon: '🎯', name: 'DSA', tag: 'Interview Prep', bg: '#fb923c20', border: '#fb923c40' },
];

const features = [
  { icon: '🤖', title: 'AI Learning Mentor', desc: 'Get real-time explanations, mock interviews & career roadmaps from your personal AI tutor, available 24/7.' },
  { icon: '🗺️', title: 'Structured Roadmaps', desc: 'Follow curated, step-by-step learning paths from beginner to job-ready developer for every domain.' },
  { icon: '📊', title: 'Skill Analytics', desc: 'Track streaks, XP, domain-wise progress heatmaps and performance over time — all in one dashboard.' },
  { icon: '🏆', title: 'Certificates & Badges', desc: 'Earn industry-recognised certificates and shareable badges to supercharge your resume and LinkedIn.' },
  { icon: '🎯', title: 'Smart Assessments', desc: 'Test yourself with adaptive MCQs and coding challenges after each module to lock in what you learn.' },
  { icon: '📚', title: 'Study Materials', desc: 'Access curated notes, cheat sheets, and resource libraries tailored to every topic in your path.' },
];

const testimonials = [
  { name: 'Priya Sharma', role: 'SDE at Razorpay', avatar: '👩‍💻', text: 'SkillForge\'s AI mentor helped me crack my interviews in 3 months. The structured roadmaps are a game changer!', rating: 5 },
  { name: 'Arjun Mehta', role: 'Data Engineer at Swiggy', avatar: '👨‍💻', text: 'Finally a platform that feels like it was built FOR developers. The progress analytics kept me accountable every single day.', rating: 5 },
  { name: 'Neha Gupta', role: 'Fullstack at Startup', avatar: '👩‍🎓', text: 'The domain cards and learning paths made it super clear what to learn next. Got my first dev job within 6 months!', rating: 5 },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('trending');
  const [counts, setCounts] = useState({ l: 0, t: 0, s: 0 });
  const statsRef = useRef(null);
  const [sv, setSv] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!sv) return;
    const dur = 1600, start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const e = 1 - (1 - p) ** 3;
      setCounts({ l: Math.floor(e * 10000), t: Math.floor(e * 500), s: Math.floor(e * 95) });
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [sv]);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setSv(true); }, { threshold: 0.3 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  const goLogin = () => navigate('/login');

  const S = { // shared styles helper
    section: (bg) => ({ background: bg, padding: '96px 24px' }),
    sectionInner: { maxWidth: 1200, margin: '0 auto' },
    pill: (active) => ({
      padding: '8px 24px', borderRadius: 50, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700,
      background: active ? ACCENT : 'rgba(255,255,255,0.08)',
      color: active ? 'white' : 'rgba(255,255,255,0.5)',
      transition: 'all 0.2s',
    }),
  };

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI',sans-serif", overflowX: 'hidden', background: '#000' }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      {/* ══ NAVBAR ══════════════════════════════════════════════════ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        background: scrolled ? 'rgba(0,0,0,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        transition: 'all 0.3s',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${ACCENT2}, ${ACCENT})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 20px ${ACCENT}50`, flexShrink: 0 }}>
              <span style={{ color: 'white', fontWeight: 900, fontSize: 14 }}>SF</span>
            </div>
            <span style={{ fontWeight: 900, fontSize: 18, color: 'white', letterSpacing: '-0.5px' }}>SkillForge</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: ACCENT, background: `${ACCENT}15`, border: `1px solid ${ACCENT}40`, borderRadius: 50, padding: '2px 8px', letterSpacing: '0.08em' }}>AI</span>
          </div>

          {/* Desktop Nav links */}
          <div className="sf-nav-links" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {[['features', 'Features'], ['domains', 'Domains'], ['how-it-works', 'How It Works'], ['testimonials', 'Reviews']].map(([id, label]) => (
              <button key={id} onClick={() => scrollTo(id)}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.65)', fontSize: 14, fontWeight: 600, padding: '8px 14px', borderRadius: 8, cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'white'} onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.65)'}>
                {label}
              </button>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="sf-nav-ctas" style={{ display: 'flex', gap: 10 }}>
            <button onClick={goLogin} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '8px 18px', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 600, transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }} onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}>
              Login
            </button>
            <button onClick={goLogin} style={{ background: ACCENT, color: 'white', border: 'none', padding: '8px 20px', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 700, boxShadow: `0 4px 20px ${ACCENT}50`, transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}>
              Get Started
            </button>
          </div>

          {/* Mobile hamburger */}
          <button className="sf-hamburger" onClick={() => setMenuOpen(!menuOpen)}
            style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}>
            <div style={{ width: 24, display: 'flex', flexDirection: 'column', gap: 5 }}>
              {[0, 1, 2].map(i => <div key={i} style={{ height: 2, background: 'white', borderRadius: 2, transition: 'all 0.2s',
                transform: menuOpen && i === 0 ? 'rotate(45deg) translate(5px,5px)' : menuOpen && i === 2 ? 'rotate(-45deg) translate(5px,-5px)' : 'none',
                opacity: menuOpen && i === 1 ? 0 : 1 }} />)}
            </div>
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div style={{ background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[['features','Features'],['domains','Domains'],['how-it-works','How It Works'],['testimonials','Reviews']].map(([id, label]) => (
              <button key={id} onClick={() => { scrollTo(id); setMenuOpen(false); }}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.75)', fontSize: 15, fontWeight: 600, padding: '10px 4px', textAlign: 'left', cursor: 'pointer' }}>
                {label}
              </button>
            ))}
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button onClick={goLogin} style={{ flex: 1, background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '10px', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>Login</button>
              <button onClick={goLogin} style={{ flex: 1, background: ACCENT, color: 'white', border: 'none', padding: '10px', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>Get Started</button>
            </div>
          </div>
        )}
      </nav>

      {/* ══ HERO ════════════════════════════════════════════════════ */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', position: 'relative', overflow: 'hidden', paddingTop: 68 }}>
        {/* Radial purple-magenta glow at bottom-center (like Techsnap) */}
        <div style={{ position: 'absolute', bottom: '-10%', left: '50%', transform: 'translateX(-50%)', width: 800, height: 500, borderRadius: '50%', background: `radial-gradient(ellipse, ${ACCENT}22 0%, ${ACCENT2}10 40%, transparent 70%)`, filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: 300, height: 300, borderRadius: '50%', background: `${ACCENT2}08`, filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '15%', right: '8%', width: 250, height: 250, borderRadius: '50%', background: `${ACCENT}08`, filter: 'blur(80px)', pointerEvents: 'none' }} />

        {/* Floating badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 50, padding: '7px 18px', marginBottom: 32, backdropFilter: 'blur(10px)' }}>
          <span style={{ fontSize: 14 }}>🚀</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.04em' }}>AI-Powered Tech Learning Platform</span>
        </div>

        {/* Main headline — Techsnap style: huge, bold, accent word */}
        <h1 style={{ fontSize: 'clamp(2.8rem, 7vw, 6rem)', fontWeight: 900, lineHeight: 1.05, color: '#fff', margin: '0 0 24px', letterSpacing: '-2px', maxWidth: 900, padding: '0 16px' }}>
          The Smarter Way to<br />
          Become a&nbsp;
          <span style={{ color: ACCENT, WebkitTextStroke: '0px', textShadow: `0 0 40px ${ACCENT}60` }}>Job-Ready</span>
          &nbsp;Developer
        </h1>

        <p style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: 'rgba(255,255,255,0.55)', maxWidth: 560, lineHeight: 1.7, margin: '0 0 44px', padding: '0 16px' }}>
          From confused student to job-ready developer — with AI mentorship, structured domain paths, skill analytics, and industry certificates.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={goLogin} style={{ background: ACCENT, color: 'white', border: 'none', padding: '16px 40px', borderRadius: 14, cursor: 'pointer', fontSize: 16, fontWeight: 800, boxShadow: `0 8px 32px ${ACCENT}50`, letterSpacing: '0.01em', transition: 'all 0.3s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 16px 48px ${ACCENT}70`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 8px 32px ${ACCENT}50`; }}>
            Start learning for free
          </button>
          <button onClick={() => scrollTo('features')} style={{ background: 'transparent', color: 'white', border: '1.5px solid rgba(255,255,255,0.2)', padding: '16px 36px', borderRadius: 14, cursor: 'pointer', fontSize: 16, fontWeight: 700, backdropFilter: 'blur(8px)', transition: 'all 0.3s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}>
            Explore features
          </button>
        </div>

        {/* Trust line */}
        <p style={{ marginTop: 32, fontSize: 13, color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>
          Trusted by <strong style={{ color: 'rgba(255,255,255,0.55)' }}>10,000+ learners</strong> across India · Free forever plan available
        </p>
      </section>

      {/* ══ STATS COUNT-UP BAR ══════════════════════════════════════ */}
      <section ref={statsRef} style={{ background: '#0d0d0d', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '44px 24px' }}>
        <div className="sf-stats-grid" style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, textAlign: 'center' }}>
          {[
            { v: `${counts.l.toLocaleString()}+`, l: 'Active Learners', icon: '👥' },
            { v: `${counts.t}+`, l: 'Topics & Domains', icon: '📚' },
            { v: `${counts.s}%`, l: 'Placement Rate', icon: '🎯' },
            { v: '24/7', l: 'AI Mentor Support', icon: '🤖' },
          ].map((s, i) => (
            <div key={i}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: 'white', lineHeight: 1 }}>{s.v}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 6, fontWeight: 600, letterSpacing: '0.04em' }}>{s.l.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ DOMAINS SECTION (Techsnap-style) ════════════════════════ */}
      <section id="domains" style={{ background: '#f4f4f7', padding: '96px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ fontSize: 12, fontWeight: 800, color: ACCENT2, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 12 }}>EXPLORE SKILL PATHS</p>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#0f0f0f', margin: '0 0 16px', letterSpacing: '-1px' }}>
              Everything You Need to Level Up
            </h2>
            <p style={{ fontSize: 17, color: '#64748b', maxWidth: 480, margin: '0 auto' }}>
              Structured paths for every career goal — from web to AI to cloud.
            </p>
          </div>

          {/* Trending / Certification tabs (Techsnap-inspired) */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 36, flexWrap: 'wrap' }}>
            {['trending', 'career'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                padding: '9px 22px', borderRadius: 50, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700, transition: 'all 0.2s',
                background: activeTab === tab ? ACCENT : 'transparent',
                color: activeTab === tab ? 'white' : '#475569',
                boxShadow: activeTab === tab ? `0 4px 16px ${ACCENT}40` : 'none',
              }}>
                {tab === 'trending' ? '🔥 Popular & Trending' : '🏆 Career Paths'}
              </button>
            ))}
          </div>

          {/* Domain cards grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
            {domains.map((d, i) => (
              <div key={i} onClick={goLogin}
                style={{ background: 'white', borderRadius: 20, padding: '20px 22px', border: `1.5px solid ${d.border}`, display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', transition: 'all 0.25s', boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 32px rgba(0,0,0,0.1)`; e.currentTarget.style.borderColor = ACCENT; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 8px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = d.border; }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: d.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                  {d.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: '#0f172a' }}>{d.name}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, marginTop: 2 }}>{d.tag}</div>
                </div>
              </div>
            ))}
            {/* View all card */}
            <div onClick={goLogin}
              style={{ background: `linear-gradient(135deg, ${ACCENT2}15, ${ACCENT}15)`, borderRadius: 20, padding: '20px 22px', border: `1.5px dashed ${ACCENT}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer', transition: 'all 0.25s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.background = `linear-gradient(135deg, ${ACCENT2}25, ${ACCENT}25)`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = `linear-gradient(135deg, ${ACCENT2}15, ${ACCENT}15)`; }}>
              <span style={{ fontWeight: 800, fontSize: 15, color: ACCENT2 }}>View All Paths →</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FEATURES ════════════════════════════════════════════════ */}
      <section id="features" style={{ background: '#0a0a0a', padding: '96px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontSize: 12, fontWeight: 800, color: ACCENT, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 12 }}>PLATFORM FEATURES</p>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: 'white', margin: '0 0 16px', letterSpacing: '-1px' }}>
              Built for Serious Learners.<br />
              <span style={{ color: ACCENT }}>Not just another MOOC.</span>
            </h2>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.45)', maxWidth: 500, margin: '0 auto' }}>
              Every tool on SkillForge is designed to get you job-ready, not just certificate-ready.
            </p>
          </div>

          <div className="sf-features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {features.map((f, i) => (
              <div key={i}
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: 32, transition: 'all 0.3s', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = `${ACCENT}50`; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}>
                <div style={{ fontSize: 36, marginBottom: 18 }}>{f.icon}</div>
                <h3 style={{ fontSize: 19, fontWeight: 800, color: 'white', margin: '0 0 10px', letterSpacing: '-0.3px' }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ════════════════════════════════════════════ */}
      <section id="how-it-works" style={{ background: '#f4f4f7', padding: '96px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontSize: 12, fontWeight: 800, color: ACCENT2, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 12 }}>SIMPLE ONBOARDING</p>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#0f0f0f', margin: '0 0 16px', letterSpacing: '-1px' }}>
              From Zero to Hired in 3 Steps
            </h2>
          </div>

          <div className="sf-how-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
            {[
              { step: '01', icon: '👤', title: 'Create Free Account', desc: 'Sign up in 30 seconds. No credit card. Just your email and you\'re in.', color: ACCENT },
              { step: '02', icon: '🎯', title: 'Pick Your Path', desc: 'Choose from 50+ curated skill paths — Web, AI, Cloud, DSA & more.', color: ACCENT2 },
              { step: '03', icon: '🚀', title: 'Learn, Track & Get Hired', desc: 'Build with AI guidance, earn certificates, and land your dream job.', color: '#10b981' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'white', borderRadius: 28, padding: 40, textAlign: 'center', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '1.5px solid rgba(0,0,0,0.05)', transition: 'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 48px rgba(0,0,0,0.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.06)'; }}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: `${s.color}15`, border: `2px solid ${s.color}40`, margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontWeight: 900, fontSize: 18, color: s.color }}>{s.step}</span>
                </div>
                <div style={{ fontSize: 42, marginBottom: 14 }}>{s.icon}</div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: '0 0 10px' }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.65, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ════════════════════════════════════════════ */}
      <section id="testimonials" style={{ background: '#0a0a0a', padding: '96px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: 12, fontWeight: 800, color: ACCENT, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 12 }}>REAL RESULTS</p>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: 'white', margin: '0 0 12px', letterSpacing: '-1px' }}>
              Stories That Speak for Us
            </h2>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.4)' }}>Real learners. Real careers. Real results.</p>
          </div>

          <div className="sf-testimonials-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: 32, transition: 'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${ACCENT}40`; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <div style={{ display: 'flex', gap: 2, marginBottom: 20 }}>
                  {[...Array(t.rating)].map((_, j) => <span key={j} style={{ color: '#fbbf24', fontSize: 16 }}>★</span>)}
                </div>
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', lineHeight: 1.75, margin: '0 0 28px', fontStyle: 'italic' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 20 }}>
                  <div style={{ width: 46, height: 46, borderRadius: '50%', background: `linear-gradient(135deg, ${ACCENT2}, ${ACCENT})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 800, color: 'white', fontSize: 14 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: ACCENT, fontWeight: 600 }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ═══════════════════════════════════════════════ */}
      <section style={{ background: '#000', padding: '100px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 400, borderRadius: '50%', background: `radial-gradient(ellipse, ${ACCENT}18 0%, transparent 70%)`, pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 680, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, color: 'white', margin: '0 0 20px', letterSpacing: '-1.5px', lineHeight: 1.1 }}>
            Your Career Starts<br />
            <span style={{ color: ACCENT }}>Right Now.</span>
          </h2>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)', margin: '0 0 44px', lineHeight: 1.6 }}>
            Join thousands of learners building job-ready skills every day on SkillForge. Free to start, zero risk.
          </p>
          <button onClick={goLogin} style={{ background: ACCENT, color: 'white', border: 'none', padding: '18px 52px', borderRadius: 16, cursor: 'pointer', fontSize: 18, fontWeight: 900, boxShadow: `0 8px 40px ${ACCENT}55`, transition: 'all 0.3s', letterSpacing: '0.01em' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px) scale(1.04)'; e.currentTarget.style.boxShadow = `0 16px 56px ${ACCENT}70`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = `0 8px 40px ${ACCENT}55`; }}>
            Start Learning for Free →
          </button>
          <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center', gap: 28, flexWrap: 'wrap' }}>
            {['✓ No credit card', '✓ Free forever plan', '✓ AI mentor included', '✓ Certificates included'].map((t, i) => (
              <span key={i} style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══════════════════════════════════════════════════ */}
      <footer style={{ background: '#000', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '64px 24px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="sf-footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 52 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${ACCENT2}, ${ACCENT})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: 'white', fontWeight: 900, fontSize: 14 }}>SF</span>
                </div>
                <span style={{ fontWeight: 900, fontSize: 18, color: 'white' }}>SkillForge</span>
              </div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', lineHeight: 1.75, maxWidth: 260, margin: '0 0 20px' }}>
                AI-powered tech learning platform helping you go from student to job-ready developer — faster and smarter.
              </p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 50, padding: '5px 12px' }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981' }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>All systems operational</span>
              </div>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Roadmap', 'Changelog'] },
              { title: 'Company', links: ['About Us', 'Blog', 'Careers', 'Contact'] },
              { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR'] },
            ].map((col, i) => (
              <div key={i}>
                <h4 style={{ fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 18 }}>{col.title}</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {col.links.map((l, j) => (
                    <li key={j}><a href="#" style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}
                      onMouseEnter={e => e.target.style.color = 'white'} onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.45)'}>{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 28, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)' }}>© 2026 SkillForge AI · Made with ❤️ for learners everywhere</span>
            <div style={{ display: 'flex', gap: 20 }}>
              {['Twitter', 'GitHub', 'LinkedIn', 'Discord'].map(s => (
                <a key={s} href="#" style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', textDecoration: 'none', fontWeight: 600, transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = ACCENT} onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.25)'}>{s}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes glow { 0%,100% { opacity: 0.6; } 50% { opacity: 1; } }
        @media (max-width: 768px) {
          .sf-nav-links { display: none !important; }
          .sf-nav-ctas { display: none !important; }
          .sf-hamburger { display: flex !important; }
          .sf-stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .sf-features-grid { grid-template-columns: 1fr !important; }
          .sf-how-grid { grid-template-columns: 1fr !important; }
          .sf-testimonials-grid { grid-template-columns: 1fr !important; }
          .sf-footer-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
        @media (max-width: 480px) {
          .sf-stats-grid { grid-template-columns: repeat(2,1fr) !important; gap: 12px !important; }
        }
      `}</style>
    </div>
  );
}
