import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import AppwriteAccount from "../appwrite/Account.services";
import useAuthStore from "../store/authStore";

const ACCENT = '#e879f9';
const ACCENT2 = '#a855f7';

/**
 * OAuthCallback
 * Appwrite redirects the user here after a successful Google login.
 * We just call `account.get()` — if Appwrite set the session cookie the
 * user will be returned and we redirect into the app.
 */
function OAuthCallback() {
  const navigate = useNavigate();
  const setCurrentUser = useAuthStore((s) => s.setCurrentUser);
  const setIsCheckingUser = useAuthStore((s) => s.setIsCheckingUser);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const appwriteAccount = new AppwriteAccount();

    async function finishOAuth() {
      try {
        const user = await appwriteAccount.getAppwriteUser();
        if (user) {
          setCurrentUser(user);
          setIsCheckingUser(false);
          navigate(user.labels?.includes('admin') ? '/dashboard' : '/user', { replace: true });
        } else {
          // No session — send back to login
          navigate('/login', { replace: true });
        }
      } catch {
        navigate('/login', { replace: true });
      }
    }

    finishOAuth();
  }, []);

  return (
    <div style={{
      height: '100vh', width: '100vw',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#000', fontFamily: "'Inter','Segoe UI',sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet" />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
        {/* Logo */}
        <div style={{
          width: 60, height: 60, borderRadius: 18,
          background: `linear-gradient(135deg, ${ACCENT2}, ${ACCENT})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 40px ${ACCENT}50`,
        }}>
          <span style={{ color: 'white', fontWeight: 900, fontSize: 24 }}>SF</span>
        </div>

        {/* Spinner dots */}
        <div style={{ display: 'flex', gap: 8 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 10, height: 10, borderRadius: '50%',
              background: ACCENT,
              animation: 'bounce 1s ease-in-out infinite',
              animationDelay: `${i * 150}ms`,
            }} />
          ))}
        </div>

        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, fontWeight: 600, margin: 0 }}>
          Signing you in with Google…
        </p>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}

export default OAuthCallback;
