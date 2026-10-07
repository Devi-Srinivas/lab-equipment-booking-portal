import React from 'react';
import { Link } from 'react-router-dom';

// Shared look for the Forgot Password and Reset Password pages (same dark green theme as Login)
export const GREEN = '#6ef04b';
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Icon = ({ children, size = 18, stroke = GREEN }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {children}
    </svg>
);
export const CubeIcon = (p) => (
    <Icon {...p}>
        <path d="M21 8l-9-5-9 5v8l9 5 9-5V8z" />
        <path d="M3.3 7.5L12 12.5l8.7-5" />
        <path d="M12 22V12.5" />
    </Icon>
);
export const MailIcon = (p) => (
    <Icon stroke="#7d8f82" {...p}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 7l9 6 9-6" />
    </Icon>
);
export const LockIcon = (p) => (
    <Icon stroke="#7d8f82" {...p}>
        <rect x="4" y="11" width="16" height="10" rx="2" />
        <path d="M8 11V7a4 4 0 018 0v4" />
    </Icon>
);
export const EyeIcon = ({ off }) => (
    <Icon stroke="#9fb0a3">
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
        <circle cx="12" cy="12" r="3" />
        {off && <path d="M3 3l18 18" />}
    </Icon>
);

const css = `
.as-root { position: relative; overflow: hidden; min-height: 100vh; display: flex; flex-direction: column; background: #000; color: #fff;
           font-family: 'Inter', 'Segoe UI', Arial, sans-serif; text-align: left; }
.as-root h2, .as-root p, .as-root label, .as-root span, .as-root div { color: inherit; }
.as-root::before { content: ''; position: absolute; inset: 0; pointer-events: none; opacity: .55; background-size: 46px 46px;
           background-image: linear-gradient(rgba(110,240,75,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(110,240,75,0.06) 1px, transparent 1px); }
.as-orb { position: absolute; border-radius: 50%; filter: blur(70px); pointer-events: none; animation: asFloat 9s ease-in-out infinite; }
.as-top { position: relative; z-index: 1; display: flex; justify-content: space-between; align-items: center; padding: 26px 40px; }
.as-brand { display: flex; align-items: center; gap: 10px; font-size: 20px; font-weight: 800; color: #fff; }
.as-brand-icon { display: inline-flex; padding: 6px; border: 1.5px solid ${GREEN}; border-radius: 10px; }
.as-center { position: relative; z-index: 1; flex: 1; display: flex; align-items: center; justify-content: center; padding: 20px 18px 50px; }
.as-card { width: 100%; max-width: 460px; padding: 34px 32px 28px; border-radius: 22px; border: 1px solid #1c2a21;
           background: linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015));
           box-shadow: 0 30px 80px rgba(0,0,0,0.6), 0 0 60px rgba(110,240,75,0.08); animation: asFadeUp .6s ease both; }
.as-title { margin: 0; font-size: 30px; font-weight: 800; letter-spacing: -0.5px; color: #fff; }
.as-sub { margin: 8px 0 24px; font-size: 15px; color: #a3b1a8; }
.as-label { display: block; font-size: 13px; font-weight: 700; margin-bottom: 8px; color: #fff; width: auto; }
.as-field { position: relative; margin-bottom: 18px; }
.as-icon { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); display: flex; pointer-events: none; }
.as-input { width: 100%; box-sizing: border-box; padding: 14px 16px 14px 46px; font-size: 14px; border-radius: 12px; border: 1px solid #1f2d24;
            background: #0b100c; color: #fff; font-family: inherit; transition: border-color .2s, box-shadow .2s, background .2s; }
.as-input::placeholder { color: #6a7b6f; }
.as-input:hover { border-color: #2c4233; }
.as-input:focus { outline: none; border-color: ${GREEN}; background: #0e150f; box-shadow: 0 0 0 3px rgba(110,240,75,0.18), 0 0 24px rgba(110,240,75,0.12); }
.as-input.as-invalid { border-color: #ff5b5b; }
.as-eye { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; display: flex; padding: 0; }
.as-error { color: #ff7b7b; font-size: 13px; margin-top: -8px; margin-bottom: 14px; }
.as-alert { margin-bottom: 18px; padding: 11px 14px; border-radius: 10px; background: rgba(255,91,91,0.12); color: #ff9a9a; border: 1px solid rgba(255,91,91,0.4); font-size: 14px; font-weight: 600; }
.as-success { margin-bottom: 18px; padding: 11px 14px; border-radius: 10px; background: rgba(110,240,75,0.12); color: #b8f5a3; border: 1px solid rgba(110,240,75,0.4); font-size: 14px; font-weight: 600; }
.as-link { color: ${GREEN}; font-weight: 700; text-decoration: none; }
.as-link:hover { text-decoration: underline; }
.as-btn { position: relative; overflow: hidden; width: 100%; margin-top: 6px; padding: 15px; font-size: 16px; font-weight: 800; color: #04120a; border: none; border-radius: 12px; cursor: pointer;
          background: linear-gradient(135deg, #b4ff7a 0%, ${GREEN} 45%, #3fdc6e 100%); box-shadow: 0 10px 30px rgba(110,240,75,0.32);
          font-family: inherit; transition: transform .18s, box-shadow .18s; display: flex; align-items: center; justify-content: center; gap: 10px; }
.as-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 16px 38px rgba(110,240,75,0.45); }
.as-btn:disabled { opacity: .75; cursor: not-allowed; }
.as-spinner { width: 17px; height: 17px; border: 3px solid rgba(4,18,10,0.3); border-top-color: #04120a; border-radius: 50%; animation: asSpin .7s linear infinite; }
.as-foot { text-align: center; margin-top: 22px; font-size: 14px; color: #a3b1a8; }
@keyframes asFloat { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(26px,-34px); } }
@keyframes asFadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
@keyframes asSpin { to { transform: rotate(360deg); } }
@media (max-width: 560px) { .as-top { padding: 20px 18px; } .as-card { padding: 26px 20px 22px; } }
@media (prefers-reduced-motion: reduce) { .as-orb, .as-card { animation: none; } }
`;

export default function AuthShell({ title, subtitle, children }) {
    return (
        <div className="as-root">
            <style>{css}</style>
            <div className="as-orb" style={{ width: 320, height: 320, top: -90, right: -60, background: 'rgba(110,240,75,0.24)' }} />
            <div className="as-orb" style={{ width: 260, height: 260, bottom: -100, left: -70, background: 'rgba(63,220,110,0.18)', animationDelay: '-4s' }} />

            <div className="as-top">
                <div className="as-brand">
                    <span className="as-brand-icon"><CubeIcon size={20} /></span>
                    Lab Portal
                </div>
                <Link to="/" className="as-link" style={{ fontSize: 14 }}>Home</Link>
            </div>

            <div className="as-center">
                <div className="as-card">
                    <h2 className="as-title">{title}</h2>
                    <p className="as-sub">{subtitle}</p>
                    {children}
                </div>
            </div>
        </div>
    );
}
