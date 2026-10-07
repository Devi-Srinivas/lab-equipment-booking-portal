import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const REMEMBER_KEY = 'rememberedUserId'; // only the ID is remembered, never the password
const GREEN = '#6ef04b';                 // parrot / light green accent
const WORDS = ['microscopes', 'oscilloscopes', 'Arduino kits', 'projectors', 'computers'];

/* ---------- Small inline icons (no extra library needed) ---------- */
const Icon = ({ children, size = 18, stroke = GREEN }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {children}
    </svg>
);
const CubeIcon = (p) => (
    <Icon {...p}>
        <path d="M21 8l-9-5-9 5v8l9 5 9-5V8z" />
        <path d="M3.3 7.5L12 12.5l8.7-5" />
        <path d="M12 22V12.5" />
    </Icon>
);
const ShieldIcon = (p) => (
    <Icon {...p}>
        <path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6l8-3z" />
        <path d="M9 12l2 2 4-4" />
    </Icon>
);
const UsersIcon = (p) => (
    <Icon {...p}>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
        <path d="M17 11a3 3 0 100-6" />
        <path d="M18 14c2.2.5 3.5 2.4 3.5 5" />
    </Icon>
);
const FlaskIcon = (p) => (
    <Icon {...p}>
        <path d="M9 3h6" />
        <path d="M10 3v6L4.5 19a1.5 1.5 0 001.3 2.2h12.4a1.5 1.5 0 001.3-2.2L14 9V3" />
        <path d="M7.5 15h9" />
    </Icon>
);
const UserIcon = (p) => (
    <Icon stroke="#7d8f82" {...p}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
    </Icon>
);
const LockIcon = (p) => (
    <Icon stroke="#7d8f82" {...p}>
        <rect x="4" y="11" width="16" height="10" rx="2" />
        <path d="M8 11V7a4 4 0 018 0v4" />
    </Icon>
);
const EyeIcon = ({ off }) => (
    <Icon stroke="#9fb0a3">
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
        <circle cx="12" cy="12" r="3" />
        {off && <path d="M3 3l18 18" />}
    </Icon>
);

const css = `
.lp-root { display: grid; grid-template-columns: 1.05fr 1fr; min-height: 100vh; background: #000; color: #fff;
           font-family: 'Inter', 'Segoe UI', Arial, sans-serif; }
.lp-root h1, .lp-root h2, .lp-root p, .lp-root label, .lp-root span, .lp-root div { color: inherit; }

/* ----- left panel ----- */
.lp-left { position: relative; overflow: hidden; padding: 64px 62px; display: flex; flex-direction: column; justify-content: center; gap: 26px;
           background: linear-gradient(160deg, #040a05 0%, #000 100%); }
.lp-left::before { content: ''; position: absolute; inset: 0; pointer-events: none;
           background: radial-gradient(520px circle at var(--mx, 70%) var(--my, 18%), rgba(110,240,75,0.16), transparent 62%); }
.lp-grid { position: absolute; inset: 0; pointer-events: none; opacity: 0.55;
           background-image: linear-gradient(rgba(110,240,75,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(110,240,75,0.06) 1px, transparent 1px);
           background-size: 46px 46px; }
.lp-orb { position: absolute; border-radius: 50%; filter: blur(60px); pointer-events: none; animation: lpFloat 9s ease-in-out infinite; }
.lp-left > *:not(.lp-orb):not(.lp-grid) { position: relative; z-index: 1; }
.lp-badge { display: inline-flex; align-items: center; gap: 12px; padding: 11px 18px; border-radius: 14px; width: fit-content;
            background: rgba(110,240,75,0.07); border: 1px solid rgba(110,240,75,0.28); }
.lp-eyebrow { font-size: 12px; font-weight: 800; letter-spacing: 0.28em; color: ${GREEN}; }
.lp-title { margin: 0; font-size: clamp(36px, 4.6vw, 60px); line-height: 1.08; font-weight: 800; color: #fff; }
.lp-word { display: block; color: ${GREEN}; white-space: nowrap; text-shadow: 0 0 28px rgba(110,240,75,0.45); animation: lpWordIn 0.55s ease both; }
.lp-chip { display: flex; align-items: center; gap: 14px; padding: 13px 16px; border-radius: 12px; max-width: 430px; font-size: 14px; color: #e8f3ea;
           background: rgba(255,255,255,0.035); border: 1px solid #1d2a20; opacity: 0; animation: lpFadeUp 0.6s ease forwards;
           transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s; cursor: default; }
.lp-chip:hover { transform: translateX(6px); border-color: rgba(110,240,75,0.6); box-shadow: 0 0 22px rgba(110,240,75,0.15); }

/* ----- right panel ----- */
.lp-right { position: relative; background: #000; border-left: 1px solid #14201a; padding: 34px 52px; display: flex; flex-direction: column; overflow: hidden; }
.lp-right::before { content: ''; position: absolute; top: -140px; right: -140px; width: 380px; height: 380px; border-radius: 50%;
                    background: radial-gradient(circle, rgba(110,240,75,0.18), transparent 65%); pointer-events: none; }
.lp-formcard { width: 100%; max-width: 470px; margin: 0 auto; padding: 34px 32px 28px; border-radius: 22px; position: relative;
               background: linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.015));
               border: 1px solid #1c2a21; box-shadow: 0 30px 80px rgba(0,0,0,0.6), 0 0 60px rgba(110,240,75,0.06);
               animation: lpFadeUp 0.7s ease both; }
.lp-welcome { margin: 0; font-size: 34px; font-weight: 800; color: #fff; letter-spacing: -0.5px; }
.lp-sub { margin: 8px 0 0; font-size: 15px; color: #a3b1a8; }
.lp-label { display: block; font-size: 13px; font-weight: 700; margin-bottom: 8px; color: #fff; width: auto; }
.lp-field { position: relative; }
.lp-fieldicon { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); display: flex; pointer-events: none; }
.lp-input { width: 100%; box-sizing: border-box; padding: 14px 16px 14px 46px; font-size: 14px; border-radius: 12px; border: 1px solid #1f2d24;
            background: #0b100c; color: #fff; font-family: inherit; transition: border-color 0.2s, box-shadow 0.2s, background 0.2s; }
.lp-input::placeholder { color: #6a7b6f; }
.lp-input:hover { border-color: #2c4233; }
.lp-input:focus { outline: none; border-color: ${GREEN}; background: #0e150f; box-shadow: 0 0 0 3px rgba(110,240,75,0.18), 0 0 24px rgba(110,240,75,0.12); }
.lp-input.lp-invalid { border-color: #ff5b5b; }
.lp-error { color: #ff7b7b; font-size: 13px; margin-top: 6px; }
.lp-alert { margin-bottom: 18px; padding: 11px 14px; border-radius: 10px; background: rgba(255,91,91,0.12); color: #ff9a9a;
            border: 1px solid rgba(255,91,91,0.4); font-size: 14px; font-weight: 600; animation: lpShake 0.4s ease; }
.lp-row { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-top: 16px; font-size: 13px; }
.lp-remember { display: inline-flex; align-items: center; gap: 8px; cursor: pointer; white-space: nowrap; width: auto; color: #d6e2d9; font-size: 13px; }
.lp-remember input { accent-color: ${GREEN}; width: 16px; height: 16px; margin: 0; }
.lp-link { color: ${GREEN}; font-weight: 700; text-decoration: none; background: none; border: none; cursor: pointer; font-family: inherit; font-size: inherit; padding: 0; }
.lp-link:hover { text-decoration: underline; }
.lp-btn { position: relative; overflow: hidden; width: 100%; margin-top: 22px; padding: 15px; font-size: 16px; font-weight: 800; color: #04120a; border: none; border-radius: 12px; cursor: pointer;
          background: linear-gradient(135deg, #b4ff7a 0%, ${GREEN} 45%, #3fdc6e 100%); box-shadow: 0 10px 30px rgba(110,240,75,0.32);
          font-family: inherit; transition: transform 0.18s, box-shadow 0.18s; display: flex; align-items: center; justify-content: center; gap: 10px; }
.lp-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 16px 38px rgba(110,240,75,0.45); }
.lp-btn:active:not(:disabled) { transform: translateY(0); }
.lp-btn:disabled { opacity: 0.75; cursor: not-allowed; }
.lp-btn::after { content: ''; position: absolute; top: 0; left: -80%; width: 50%; height: 100%; transform: skewX(-20deg);
                 background: linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent); }
.lp-btn:hover:not(:disabled)::after { animation: lpShine 0.8s ease; }
.lp-spinner { width: 17px; height: 17px; border: 3px solid rgba(4,18,10,0.3); border-top-color: #04120a; border-radius: 50%; animation: lpSpin 0.7s linear infinite; }

@keyframes lpFloat { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(26px, -34px); } }
@keyframes lpFadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
@keyframes lpWordIn { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
@keyframes lpShake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }
@keyframes lpSpin { to { transform: rotate(360deg); } }
@keyframes lpShine { to { left: 130%; } }

@media (max-width: 900px) {
  .lp-root { grid-template-columns: 1fr; }
  .lp-left { padding: 34px 24px; gap: 20px; }
  .lp-right { padding: 28px 18px 40px; border-left: none; border-top: 1px solid #14201a; }
  .lp-formcard { padding: 28px 22px 24px; }
}
@media (prefers-reduced-motion: reduce) {
  .lp-orb, .lp-word, .lp-chip, .lp-formcard, .lp-alert { animation: none; opacity: 1; }
}
`;

const Login = () => {
    const navigate = useNavigate();

    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [capsOn, setCapsOn] = useState(false);
    const [wordIndex, setWordIndex] = useState(0);

    // The server tells us who the user is, and that decides which dashboard opens
    const goToDashboard = (role) => {
        const path = String(role).toLowerCase() === 'admin' ? '/admin-dashboard' : '/student-dashboard';
        navigate(path, { replace: true });
    };

    useEffect(() => {
        // Already logged in on this tab? Skip the login page.
        try {
            const token = sessionStorage.getItem('userToken');
            const user = JSON.parse(sessionStorage.getItem('userInfo') || 'null');
            if (token && user && user.role) {
                goToDashboard(user.role);
                return;
            }
        } catch (err) {
            sessionStorage.removeItem('userInfo');
            sessionStorage.removeItem('userToken');
        }

        // Pre-fill the remembered ID
        const saved = localStorage.getItem(REMEMBER_KEY);
        if (saved) {
            setUserId(saved);
            setRemember(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Rotating equipment word in the headline
    useEffect(() => {
        const timer = setInterval(() => setWordIndex((i) => (i + 1) % WORDS.length), 2400);
        return () => clearInterval(timer);
    }, []);

    // Soft green spotlight that follows the mouse on the left panel
    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`);
    };

    const validate = () => {
        const errors = {};
        const id = userId.trim();

        if (!id) {
            errors.userId = 'Please enter your User ID.';
        } else if (/\s/.test(id)) {
            errors.userId = 'The ID cannot contain spaces.';
        }
        if (!password) {
            errors.password = 'Please enter your password.';
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validate()) return;

        try {
            setLoading(true);
            // No role is sent: the server finds the account from the ID and returns its role
            const response = await axios.post(
                'http://localhost:5000/api/auth/login',
                { userId: userId.trim(), password },
                { timeout: 70000 } // the free server can take about a minute to wake up
            );

            const { token, user } = response.data;
            if (!token || !user) {
                setError('Unexpected response from the server. Please try again.');
                return;
            }

            // sessionStorage is separate for every browser tab,
            // so an admin and a student can be logged in side by side
            sessionStorage.setItem('userToken', token);
            sessionStorage.setItem('userInfo', JSON.stringify(user));

            if (remember) {
                localStorage.setItem(REMEMBER_KEY, userId.trim());
            } else {
                localStorage.removeItem(REMEMBER_KEY);
            }

            goToDashboard(user.role);
        } catch (err) {
            if (err.response) {
                setError(err.response.data?.message || 'Login failed. Please try again.');
            } else if (err.code === 'ECONNABORTED') {
                setError('The server is taking too long to respond. Please wait a moment and try again.');
            } else {
                setError('Cannot reach the server. Check your internet connection and try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="lp-root">
            <style>{css}</style>

            {/* ---------- Left brand panel ---------- */}
            <div className="lp-left" onMouseMove={handleMouseMove}>
                <div className="lp-grid" />
                <div className="lp-orb" style={{ width: 300, height: 300, top: -80, right: -60, background: 'rgba(110,240,75,0.28)' }} />
                <div className="lp-orb" style={{ width: 260, height: 260, bottom: -90, left: -70, background: 'rgba(63,220,110,0.22)', animationDelay: '-4s' }} />

                <div className="lp-badge">
                    <CubeIcon size={24} />
                    <span style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>
                        Lab<span style={{ color: GREEN }}>Portal</span>
                    </span>
                </div>

                <div className="lp-eyebrow">SMART CAMPUS &bull; SECURE ACCESS</div>

                <h1 className="lp-title">
                    Book
                    <span key={wordIndex} className="lp-word">{WORDS[wordIndex]}</span>
                    in a few clicks.
                </h1>

                <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: '#b9c7bd', maxWidth: 470 }}>
                    A secure workspace where students can discover and book laboratory equipment, and administrators can manage every request.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 6 }}>
                    <div className="lp-chip" style={{ animationDelay: '0.2s' }}><ShieldIcon /> JWT protected login</div>
                    <div className="lp-chip" style={{ animationDelay: '0.4s' }}><UsersIcon /> Role-based access for students and admins</div>
                    <div className="lp-chip" style={{ animationDelay: '0.6s' }}><FlaskIcon /> Request, return and cancel workflow</div>
                </div>

                <div style={{ fontSize: 13, color: '#7f9186', marginTop: 6 }}>
                    Sri Vasavi Engineering College (Autonomous), Tadepalligudem
                </div>
            </div>

            {/* ---------- Right login panel ---------- */}
            <div className="lp-right">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 20, fontWeight: 800, color: '#fff' }}>
                        <span style={{ display: 'inline-flex', padding: 6, border: `1.5px solid ${GREEN}`, borderRadius: 10 }}>
                            <CubeIcon size={20} />
                        </span>
                        Lab Portal
                    </div>
                    <Link to="/" className="lp-link" style={{ fontSize: 14 }}>Home</Link>
                </div>

                <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '24px 0', position: 'relative' }}>
                    <div className="lp-formcard">
                        <h2 className="lp-welcome">Welcome Back</h2>
                        <p className="lp-sub">Login to your Lab Portal account.</p>

                        <form onSubmit={handleSubmit} noValidate style={{ marginTop: 26 }}>
                            {error && (
                                <div role="alert" className="lp-alert" key={error}>
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="lp-label" htmlFor="userId">User ID</label>
                                <div className="lp-field">
                                    <span className="lp-fieldicon"><UserIcon /></span>
                                    <input
                                        id="userId"
                                        type="text"
                                        value={userId}
                                        onChange={(e) => { setUserId(e.target.value); setFieldErrors({ ...fieldErrors, userId: '' }); }}
                                        placeholder="Roll number or employee ID"
                                        autoComplete="username"
                                        autoFocus
                                        className={`lp-input${fieldErrors.userId ? ' lp-invalid' : ''}`}
                                    />
                                </div>
                                {fieldErrors.userId && <div className="lp-error">{fieldErrors.userId}</div>}
                            </div>

                            <div style={{ marginTop: 18 }}>
                                <label className="lp-label" htmlFor="password">Password</label>
                                <div className="lp-field">
                                    <span className="lp-fieldicon"><LockIcon /></span>
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => { setPassword(e.target.value); setFieldErrors({ ...fieldErrors, password: '' }); }}
                                        onKeyUp={(e) => setCapsOn(e.getModifierState && e.getModifierState('CapsLock'))}
                                        onBlur={() => setCapsOn(false)}
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        className={`lp-input${fieldErrors.password ? ' lp-invalid' : ''}`}
                                        style={{ paddingRight: 46 }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0 }}
                                    >
                                        <EyeIcon off={showPassword} />
                                    </button>
                                </div>
                                {capsOn && <div style={{ color: '#ffd166', fontSize: 13, marginTop: 6 }}>Caps Lock is on.</div>}
                                {fieldErrors.password && <div className="lp-error">{fieldErrors.password}</div>}
                            </div>

                            <div className="lp-row">
                                <label className="lp-remember">
                                    <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                                    Remember my ID
                                </label>
                                <Link to="/forgot-password" className="lp-link">
                                    Forgot Password?
                                </Link>
                            </div>

                            <button type="submit" className="lp-btn" disabled={loading}>
                                {loading && <span className="lp-spinner" />}
                                {loading ? 'Signing in...' : 'Login'}
                            </button>

                            {loading && (
                                <div style={{ textAlign: 'center', marginTop: 12, fontSize: 13, color: '#8fa196' }}>
                                    The first login after a quiet period can take up to a minute.
                                </div>
                            )}
                        </form>

                        <div style={{ textAlign: 'center', marginTop: 22, fontSize: 14, color: '#a3b1a8' }}>
                            Don't have an account? <Link to="/register" className="lp-link">Register</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;