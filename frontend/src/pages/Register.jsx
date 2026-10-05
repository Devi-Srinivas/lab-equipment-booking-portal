import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const GREEN = '#6ef04b'; // same parrot green as the login page
const WORDS = ['microscopes', 'oscilloscopes', 'Arduino kits', 'projectors', 'computers'];
const DEPARTMENTS = [
    'Computer Science (CSE)',
    'Information Technology (IT)',
    'Electronics & Communication (ECE)',
    'Electrical & Electronics (EEE)',
    'Mechanical (MECH)',
    'Civil (CIVIL)',
];

// Admin / faculty ID format, example: t-cse-13
const ADMIN_ID = /^t-[a-z]{2,6}-\d{1,3}$/i;
const deptCode = (d) => ((d.match(/\(([^)]+)\)/) || [])[1] || 'cse').toLowerCase();

const EMPTY = { userId: '', name: '', email: '', department: DEPARTMENTS[0], role: 'student', password: '', confirm: '', adminCode: '' };

/* ---------- Small inline icons (same style as the login page) ---------- */
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
const CheckIcon = (p) => (
    <Icon {...p}>
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12.5l2.7 2.7L16 9.5" />
    </Icon>
);
const SendIcon = (p) => (
    <Icon {...p}>
        <path d="M22 2L11 13" />
        <path d="M22 2l-7 20-4-9-9-4 20-7z" />
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
const MailIcon = (p) => (
    <Icon stroke="#7d8f82" {...p}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 7l9 6 9-6" />
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
           font-family: 'Inter', 'Segoe UI', Arial, sans-serif; text-align: left; }
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
.lp-title { margin: 0; font-size: clamp(34px, 4.2vw, 56px); line-height: 1.08; font-weight: 800; color: #fff; }
.lp-word { display: block; color: ${GREEN}; white-space: nowrap; text-shadow: 0 0 28px rgba(110,240,75,0.45); animation: lpWordIn 0.55s ease both; }
.lp-chip { display: flex; align-items: center; gap: 14px; padding: 13px 16px; border-radius: 12px; max-width: 430px; font-size: 14px; color: #e8f3ea;
           background: rgba(255,255,255,0.035); border: 1px solid #1d2a20; opacity: 0; animation: lpFadeUp 0.6s ease forwards;
           transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s; cursor: default; }
.lp-chip:hover { transform: translateX(6px); border-color: rgba(110,240,75,0.6); box-shadow: 0 0 22px rgba(110,240,75,0.15); }

/* ----- right panel ----- */
.lp-right { position: relative; background: #000; border-left: 1px solid #14201a; padding: 34px 52px; display: flex; flex-direction: column; overflow: hidden; }
.lp-right::before { content: ''; position: absolute; top: -140px; right: -140px; width: 380px; height: 380px; border-radius: 50%;
                    background: radial-gradient(circle, rgba(110,240,75,0.18), transparent 65%); pointer-events: none; }
.lp-formcard { width: 100%; max-width: 560px; margin: 0 auto; padding: 32px 32px 26px; border-radius: 22px; position: relative;
               background: linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.015));
               border: 1px solid #1c2a21; box-shadow: 0 30px 80px rgba(0,0,0,0.6), 0 0 60px rgba(110,240,75,0.06);
               animation: lpFadeUp 0.7s ease both; }
.lp-welcome { margin: 0; font-size: 32px; font-weight: 800; color: #fff; letter-spacing: -0.5px; }
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
.lp-success { margin-bottom: 18px; padding: 11px 14px; border-radius: 10px; background: rgba(110,240,75,0.12); color: #b8f5a3;
              border: 1px solid rgba(110,240,75,0.4); font-size: 14px; font-weight: 600; }
.lp-link { color: ${GREEN}; font-weight: 700; text-decoration: none; background: none; border: none; cursor: pointer; font-family: inherit; font-size: inherit; padding: 0; }
.lp-link:hover { text-decoration: underline; }
.lp-btn { position: relative; overflow: hidden; width: 100%; margin-top: 24px; padding: 15px; font-size: 16px; font-weight: 800; color: #04120a; border: none; border-radius: 12px; cursor: pointer;
          background: linear-gradient(135deg, #b4ff7a 0%, ${GREEN} 45%, #3fdc6e 100%); box-shadow: 0 10px 30px rgba(110,240,75,0.32);
          font-family: inherit; transition: transform 0.18s, box-shadow 0.18s; display: flex; align-items: center; justify-content: center; gap: 10px; }
.lp-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 16px 38px rgba(110,240,75,0.45); }
.lp-btn:active:not(:disabled) { transform: translateY(0); }
.lp-btn:disabled { opacity: 0.75; cursor: not-allowed; }
.lp-btn::after { content: ''; position: absolute; top: 0; left: -80%; width: 50%; height: 100%; transform: skewX(-20deg);
                 background: linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent); }
.lp-btn:hover:not(:disabled)::after { animation: lpShine 0.8s ease; }
.lp-spinner { width: 17px; height: 17px; border: 3px solid rgba(4,18,10,0.3); border-top-color: #04120a; border-radius: 50%; animation: lpSpin 0.7s linear infinite; }

/* ----- extra pieces used only on the registration form ----- */
.rp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-top: 18px; }
.rp-plain { padding-left: 16px; }
select.lp-input { appearance: none; -webkit-appearance: none; cursor: pointer; padding-right: 40px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' fill='none' stroke='%236ef04b' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 15px center; }
select.lp-input option { background: #0b100c; color: #fff; }
.rp-hint { font-size: 12px; color: #8fa196; margin-top: 6px; }
.rp-eye { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; display: flex; padding: 0; }
.rp-meter { display: flex; gap: 5px; margin-top: 8px; }
.rp-meter i { flex: 1; height: 4px; border-radius: 4px; background: #1c2a21; }
.rp-meter i.s1 { background: #ff5b5b; } .rp-meter i.s2 { background: #ffd166; } .rp-meter i.s3 { background: ${GREEN}; }

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
  .lp-formcard { padding: 26px 20px 22px; }
}
@media (max-width: 560px) { .rp-grid { grid-template-columns: 1fr; } }
@media (prefers-reduced-motion: reduce) {
  .lp-orb, .lp-word, .lp-chip, .lp-formcard, .lp-alert { animation: none; opacity: 1; }
}
`;

const strength = (pw) => {
    let s = 0;
    if (pw.length >= 6) s++;
    if (pw.length >= 8 && /[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
    if (pw.length >= 8 && /\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) s++;
    return s;
};

// One labelled form field (label + optional icon + error text)
const Field = ({ id, label, icon, error, hint, children }) => (
    <div>
        <label className="lp-label" htmlFor={id}>{label}</label>
        <div className="lp-field">
            {icon && <span className="lp-fieldicon">{icon}</span>}
            {children}
        </div>
        {error ? <div className="lp-error">{error}</div> : hint && <div className="rp-hint">{hint}</div>}
    </div>
);

const Register = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState(EMPTY);
    const [fieldErrors, setFieldErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [wordIndex, setWordIndex] = useState(0);

    const isAdmin = form.role === 'admin';
    const score = strength(form.password);
    const bad = (name) => (fieldErrors[name] ? ' lp-invalid' : '');

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

    const set = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value, ...(name === 'role' && value !== 'admin' ? { adminCode: '' } : {}) });
        setFieldErrors({ ...fieldErrors, [name]: '', ...(name === 'role' || name === 'department' ? { userId: '' } : {}), ...(name === 'role' ? { adminCode: '' } : {}) });
    };

    const validate = () => {
        const errors = {};
        const id = form.userId.trim();

        if (!id) errors.userId = isAdmin ? 'Please enter your admin ID.' : 'Please enter your ID number.';
        else if (/\s/.test(id)) errors.userId = 'The ID cannot contain spaces.';
        else if (isAdmin && !ADMIN_ID.test(id)) errors.userId = `Admin ID should look like t-${deptCode(form.department)}-13.`;

        if (isAdmin && !form.adminCode.trim()) errors.adminCode = 'Admin secret code is required.';

        if (!form.name.trim()) errors.name = 'Please enter your name.';
        if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) errors.email = 'Please enter a valid email address.';
        if (form.password.length < 6) errors.password = 'Use at least 6 characters.';
        if (form.confirm !== form.password) errors.confirm = 'Passwords do not match.';

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!validate()) return;

        const id = form.userId.trim();
        const payload = {
            userId: isAdmin ? id.toLowerCase() : id,
            name: form.name.trim(),
            email: form.email.trim().toLowerCase(),
            department: form.department,
            role: form.role,
            password: form.password,
            ...(isAdmin && { adminCode: form.adminCode.trim() }), // checked on the server
        };

        try {
            setLoading(true);
            await axios.post(`${API_URL}/api/auth/register`, payload, { timeout: 70000 }); // free server can take ~1 minute to wake up
            setSuccess('Registration successful. Taking you to login...');
            setForm(EMPTY);
            setTimeout(() => navigate('/login'), 1400);
        } catch (err) {
            if (err.response) {
                setError(err.response.data?.message || err.response.data?.error || `Registration failed (status ${err.response.status}).`);
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

                <div className="lp-eyebrow">SMART CAMPUS &bull; NEW ACCOUNT</div>

                <h1 className="lp-title">
                    Create your account and book
                    <span key={wordIndex} className="lp-word">{WORDS[wordIndex]}</span>
                    anytime.
                </h1>

                <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: '#b9c7bd', maxWidth: 470 }}>
                    Register once to reserve laboratory equipment and follow every request from one place.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 6 }}>
                    <div className="lp-chip" style={{ animationDelay: '0.2s' }}><CheckIcon /> See which equipment is available</div>
                    <div className="lp-chip" style={{ animationDelay: '0.4s' }}><SendIcon /> Send booking requests in a few clicks</div>
                    <div className="lp-chip" style={{ animationDelay: '0.6s' }}><FlaskIcon /> Track approval status and cancel anytime</div>
                </div>

                <div style={{ fontSize: 13, color: '#7f9186', marginTop: 6 }}>
                    Sri Vasavi Engineering College (Autonomous), Tadepalligudem
                </div>
            </div>

            {/* ---------- Right registration panel ---------- */}
            <div className="lp-right">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 20, fontWeight: 800, color: '#fff' }}>
                        <span style={{ display: 'inline-flex', padding: 6, border: `1.5px solid ${GREEN}`, borderRadius: 10 }}>
                            <CubeIcon size={20} />
                        </span>
                        Lab Portal
                    </div>
                    <div style={{ display: 'flex', gap: 18, alignItems: 'center', fontSize: 14 }}>
                        <Link to="/" className="lp-link">Home</Link>
                    </div>
                </div>

                <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '24px 0', position: 'relative' }}>
                    <div className="lp-formcard">
                        <h2 className="lp-welcome">Create Account</h2>
                        <p className="lp-sub">Fill in your details to join Lab Portal.</p>

                        <form onSubmit={handleSubmit} noValidate style={{ marginTop: 22 }}>
                            {error && <div role="alert" className="lp-alert" key={error}>{error}</div>}
                            {success && <div role="status" className="lp-success">{success}</div>}

                            <div className="rp-grid" style={{ marginTop: 0 }}>
                                <Field id="department" label="Department">
                                    <select id="department" name="department" value={form.department} onChange={set} className="lp-input rp-plain">
                                        {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </Field>
                                <Field id="role" label="Role">
                                    <select id="role" name="role" value={form.role} onChange={set} className="lp-input rp-plain">
                                        <option value="student">Student</option>
                                        <option value="admin">Admin </option>
                                    </select>
                                </Field>
                            </div>

                            <div className="rp-grid">
                                <Field
                                    id="userId"
                                    label={isAdmin ? 'Admin ID' : 'ID Number'}
                                    icon={<UserIcon />}
                                    error={fieldErrors.userId}
                                    hint={isAdmin ? 'Format: t-department-number' : ''}
                                >
                                    <input
                                        id="userId" name="userId" type="text" value={form.userId} onChange={set}
                                        placeholder={isAdmin ? `e.g. t-${deptCode(form.department)}-13` : 'e.g. 22A81A0501'}
                                        autoComplete="off" className={`lp-input${bad('userId')}`}
                                    />
                                </Field>
                                <Field id="name" label="User Name" icon={<UserIcon />} error={fieldErrors.name}>
                                    <input
                                        id="name" name="name" type="text" value={form.name} onChange={set}
                                        placeholder="Your full name" autoComplete="name" className={`lp-input${bad('name')}`}
                                    />
                                </Field>
                            </div>

                            {isAdmin && (
                                <div style={{ marginTop: 18 }}>
                                    <Field
                                        id="adminCode"
                                        label="Admin Secret Code"
                                        icon={<LockIcon />}
                                        error={fieldErrors.adminCode}
                                        hint="Ask the lab in-charge for this code."
                                    >
                                        <input
                                            id="adminCode" name="adminCode" type="password" value={form.adminCode} onChange={set}
                                            placeholder="Enter admin secret code" autoComplete="off"
                                            className={`lp-input${bad('adminCode')}`}
                                        />
                                    </Field>
                                </div>
                            )}

                            <div style={{ marginTop: 18 }}>
                                <Field id="email" label="Email ID" icon={<MailIcon />} error={fieldErrors.email}>
                                    <input
                                        id="email" name="email" type="email" value={form.email} onChange={set}
                                        placeholder="you@example.com" autoComplete="email" className={`lp-input${bad('email')}`}
                                    />
                                </Field>
                            </div>

                            <div className="rp-grid">
                                <div>
                                    <Field id="password" label="Password" icon={<LockIcon />} error={fieldErrors.password}>
                                        <input
                                            id="password" name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={set}
                                            placeholder="At least 6 characters" autoComplete="new-password"
                                            className={`lp-input${bad('password')}`} style={{ paddingRight: 46 }}
                                        />
                                        <button
                                            type="button" className="rp-eye" onClick={() => setShowPassword(!showPassword)}
                                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        >
                                            <EyeIcon off={showPassword} />
                                        </button>
                                    </Field>
                                    {form.password && (
                                        <div className="rp-meter" aria-hidden="true">
                                            {[1, 2, 3].map((n) => <i key={n} className={score >= n ? `s${score}` : ''} />)}
                                        </div>
                                    )}
                                </div>
                                <Field id="confirm" label="Confirm Password" icon={<LockIcon />} error={fieldErrors.confirm}>
                                    <input
                                        id="confirm" name="confirm" type={showPassword ? 'text' : 'password'} value={form.confirm} onChange={set}
                                        placeholder="Re-enter password" autoComplete="new-password" className={`lp-input${bad('confirm')}`}
                                    />
                                </Field>
                            </div>

                            <button type="submit" className="lp-btn" disabled={loading}>
                                {loading && <span className="lp-spinner" />}
                                {loading ? 'Creating account...' : 'Create Account'}
                            </button>

                            {loading && (
                                <div style={{ textAlign: 'center', marginTop: 12, fontSize: 13, color: '#8fa196' }}>
                                    The first request after a quiet period can take up to a minute.
                                </div>
                            )}
                        </form>

                        <div style={{ textAlign: 'center', marginTop: 22, fontSize: 14, color: '#a3b1a8' }}>
                            Already have an account? <Link to="/login" className="lp-link">Login</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;