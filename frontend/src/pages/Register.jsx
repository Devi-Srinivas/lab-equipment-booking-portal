import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Change this to your backend address (POST /register)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const DEPARTMENTS = [
    "Computer Science (CSE)",
    "Information Technology (IT)",
    "Electronics & Communication (ECE)",
    "Electrical & Electronics (EEE)",
    "Mechanical (MECH)",
    "Civil (CIVIL)",
];

/* All class names start with "rg-" so they cannot clash with other CSS in your project. */
const CSS = `
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap");

.rg-page {
  --text: #1a1d24; --muted: #566070; --line: #e6d9cc;
  --orange: #d95500; --orange-dark: #b84700; --amber: #ff9a1f; --soft: #fff6ec;
  font-family: "Inter", system-ui, sans-serif; color: var(--text); text-align: left;
  min-height: 100vh; display: grid; grid-template-columns: 0.9fr 1.1fr; background: #fff; line-height: 1.5;
}
.rg-page *, .rg-page *::before, .rg-page *::after { box-sizing: border-box; }
.rg-page h1, .rg-page h2, .rg-page p, .rg-page ul { margin: 0; padding: 0; }
.rg-page :where(a) { color: inherit; text-decoration: none; }
.rg-page a:focus-visible, .rg-page button:focus-visible, .rg-page input:focus-visible, .rg-page select:focus-visible { outline: 3px solid var(--amber); outline-offset: 2px; }

/* Left brand panel */
.rg-side { position: relative; overflow: hidden; color: #fff; padding: 3rem 3.2rem; display: flex; flex-direction: column; justify-content: space-between; gap: 2rem; background: linear-gradient(145deg, #b84700 0%, #e06000 55%, #f58a1f 100%); }
.rg-side::before, .rg-side::after { content: ""; position: absolute; border-radius: 50%; background: rgba(255, 255, 255, 0.1); pointer-events: none; }
.rg-side::before { width: 380px; height: 380px; right: -140px; top: -120px; }
.rg-side::after { width: 280px; height: 280px; left: -100px; bottom: -90px; }
.rg-side > * { position: relative; }
.rg-brand { display: flex; align-items: center; gap: 0.8rem; font-weight: 800; font-size: 1.3rem; }
.rg-brand-icon { width: 42px; height: 42px; border-radius: 12px; background: rgba(255, 255, 255, 0.2); border: 1.5px solid rgba(255, 255, 255, 0.6); display: grid; place-items: center; }
.rg-college { font-size: 0.9rem; opacity: 0.92; margin-top: 0.3rem; }
.rg-side h1 { font-size: clamp(2rem, 3.4vw, 2.9rem); font-weight: 800; line-height: 1.1; letter-spacing: -0.03em; margin-bottom: 1rem; }
.rg-side-lead { opacity: 0.95; max-width: 26rem; }
.rg-perks { list-style: none; display: grid; gap: 0.9rem; margin-top: 2rem; }
.rg-perks li { display: flex; align-items: center; gap: 0.8rem; font-weight: 500; }
.rg-perks li::before { content: "\\2713"; flex: none; width: 28px; height: 28px; border-radius: 50%; background: #fff; color: var(--orange-dark); font-weight: 800; font-size: 0.85rem; display: grid; place-items: center; }
.rg-side-foot { font-size: 0.85rem; opacity: 0.85; }

/* Right form area */
.rg-main { background: linear-gradient(180deg, #fff3e6, #ffffff 45%); display: flex; flex-direction: column; padding: 1.4rem 2rem 2rem; }
.rg-top { display: flex; justify-content: flex-end; align-items: center; gap: 1.2rem; font-size: 0.92rem; color: var(--muted); }
.rg-top a { font-weight: 600; color: var(--orange-dark); }
.rg-top a:hover { text-decoration: underline; }
.rg-center { flex: 1; display: grid; place-items: center; padding: 1.5rem 0; }
.rg-card { width: 100%; max-width: 580px; background: #fff; border: 1px solid var(--line); border-top: 5px solid var(--orange); border-radius: 22px; padding: 2.2rem; box-shadow: 0 26px 60px rgba(217, 85, 0, 0.15); }
.rg-card h2 { font-size: 1.7rem; font-weight: 800; letter-spacing: -0.02em; }
.rg-sub { color: var(--muted); font-size: 0.95rem; margin: 0.35rem 0 1.6rem; }

.rg-form { display: grid; gap: 1.1rem; }
.rg-two { display: grid; grid-template-columns: 1fr 1fr; gap: 1.1rem; }
.rg-field { display: grid; gap: 0.4rem; }
.rg-field label { font-size: 0.85rem; font-weight: 650; color: var(--text); }
.rg-input { width: 100%; height: 48px; padding: 0 0.95rem; font: 500 0.95rem "Inter", sans-serif; color: var(--text); background: #fffaf5; border: 1.5px solid var(--line); border-radius: 12px; transition: border-color 0.15s, box-shadow 0.15s, background 0.15s; appearance: none; -webkit-appearance: none; }
.rg-input::placeholder { color: #a39a90; font-weight: 400; }
.rg-input:hover { border-color: #d9c3ad; }
.rg-input:focus { border-color: var(--orange); background: #fff; box-shadow: 0 0 0 4px rgba(217, 85, 0, 0.12); outline: none; }
.rg-input.rg-bad { border-color: #c42626; background: #fff7f7; }
select.rg-input { padding-right: 2.2rem; cursor: pointer; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' fill='none' stroke='%23b84700' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 0.95rem center; }
.rg-pw { position: relative; }
.rg-pw .rg-input { padding-right: 4.2rem; }
.rg-eye { position: absolute; right: 0.5rem; top: 50%; transform: translateY(-50%); border: 0; background: transparent; color: var(--orange-dark); font: 650 0.8rem "Inter", sans-serif; padding: 0.4rem 0.6rem; cursor: pointer; border-radius: 8px; }
.rg-eye:hover { background: var(--soft); }
.rg-err { color: #c42626; font-size: 0.8rem; font-weight: 500; }
.rg-meter { display: flex; gap: 4px; margin-top: 0.1rem; }
.rg-meter i { flex: 1; height: 4px; border-radius: 4px; background: #eee3d8; }
.rg-meter i.on-1 { background: #e5484d; } .rg-meter i.on-2 { background: #f5a524; } .rg-meter i.on-3 { background: #1fa65a; }
.rg-hint { font-size: 0.78rem; color: var(--muted); }

.rg-submit { margin-top: 0.4rem; height: 52px; border: 0; border-radius: 13px; cursor: pointer; font: 700 1rem "Inter", sans-serif; color: #fff; background: linear-gradient(135deg, #e86400, #c24a00); box-shadow: 0 10px 24px rgba(217, 85, 0, 0.32); transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s; }
.rg-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 14px 28px rgba(217, 85, 0, 0.38); }
.rg-submit:disabled { opacity: 0.7; cursor: not-allowed; }
.rg-msg { padding: 0.8rem 1rem; border-radius: 12px; font-size: 0.9rem; font-weight: 500; }
.rg-msg-ok { background: #e6f6ed; color: #0d6a3a; }
.rg-msg-bad { background: #fde8e8; color: #a31f1f; }
.rg-login-line { text-align: center; color: var(--muted); font-size: 0.92rem; margin-top: 0.2rem; }
.rg-login-line a { color: var(--orange-dark); font-weight: 700; }
.rg-login-line a:hover { text-decoration: underline; }

@media (max-width: 920px) {
  .rg-page { grid-template-columns: 1fr; }
  .rg-side { padding: 2rem 1.6rem; gap: 1.2rem; }
  .rg-perks, .rg-side-foot { display: none; }
  .rg-main { padding: 1rem 1rem 2rem; }
}
@media (max-width: 560px) {
  .rg-two { grid-template-columns: 1fr; }
  .rg-card { padding: 1.6rem 1.3rem; }
}
@media (prefers-reduced-motion: reduce) { .rg-page * { transition: none !important; } }
`;

// Admin (teacher) ID format: t-cse-13  ->  t-<department>-<number>
const ADMIN_ID = /^t-[a-z]{2,6}-\d{1,3}$/i;
const deptCode = (d) => ((d.match(/\(([^)]+)\)/) || [])[1] || "cse").toLowerCase();

const EMPTY = { userId: "", name: "", email: "", department: DEPARTMENTS[0], role: "student", password: "", confirm: "" };

function strength(pw) {
    let s = 0;
    if (pw.length >= 6) s++;
    if (pw.length >= 8 && /[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
    if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw) && pw.length >= 8) s++;
    return s;
}

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState(EMPTY);
    const [errors, setErrors] = useState({});
    const [show, setShow] = useState(false);
    const [status, setStatus] = useState({ type: "", text: "" });
    const [loading, setLoading] = useState(false);

    const set = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (["role", "department"].includes(e.target.name)) setErrors((er) => ({ ...er, userId: "" }));
    };
    const isAdmin = form.role === "admin";

    const validate = () => {
        const er = {};
        const id = form.userId.trim();
        if (!id) er.userId = form.role === "admin" ? "Enter your admin ID." : "Enter your ID number.";
        else if (form.role === "admin" && !ADMIN_ID.test(id))
            er.userId = "Admin ID should look like " + "t-" + deptCode(form.department) + "-13.";
        if (!form.name.trim()) er.name = "Enter your name.";
        if (!/^\S+@\S+\.\S+$/.test(form.email)) er.email = "Enter a valid email address.";
        if (form.password.length < 6) er.password = "Use at least 6 characters.";
        if (form.confirm !== form.password) er.confirm = "Passwords do not match.";
        return er;
    };

    const submit = async (e) => {
        e.preventDefault();
        const er = validate();
        setErrors(er);
        setStatus({ type: "", text: "" });
        if (Object.keys(er).length) return;

        setLoading(true);
        try {
            const { confirm, ...rest } = form;
            const id = rest.userId.trim();
            const payload = { ...rest, userId: rest.role === "admin" ? id.toLowerCase() : id };
            const res = await fetch(`${API_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.message || data.error || `Registration failed (status ${res.status}) at ${res.url}`);
            setStatus({ type: "ok", text: "Registration successful. Taking you to login..." });
            setForm(EMPTY);
            setTimeout(() => navigate("/login"), 1200);
        } catch (err) {
            setStatus({ type: "bad", text: err.message });
        } finally {
            setLoading(false);
        }
    };

    const score = strength(form.password);

    return (
        <div className="rg-page">
            <style>{CSS}</style>

            <aside className="rg-side">
                <div>
                    <div className="rg-brand">
                        <span className="rg-brand-icon" aria-hidden="true">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
                                <path d="M9 3h6M10 3v6l-5 10a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-10V3" />
                            </svg>
                        </span>
                        Laboratory Equipment Portal
                    </div>
                    <p className="rg-college">Sri Vasavi Engineering College (Autonomous)</p>
                </div>

                <div>
                    <h1>Create your account and start booking.</h1>
                    <p className="rg-side-lead">Register once to reserve laboratory equipment and follow every request from one place.</p>
                    <ul className="rg-perks">
                        <li>See which equipment is available</li>
                        <li>Send booking requests in a few clicks</li>
                        <li>Track approval status and cancel anytime</li>
                    </ul>
                </div>

                <p className="rg-side-foot">Pedatadepalli, Tadepalligudem, W.G. Dist, A.P.</p>
            </aside>

            <main className="rg-main">
                <div className="rg-top">
                    <Link to="/">Home</Link>
                    <span>Already registered? <Link to="/login">Login</Link></span>
                </div>

                <div className="rg-center">
                    <section className="rg-card" aria-labelledby="rg-title">
                        <h2 id="rg-title">User registration</h2>
                        <p className="rg-sub">Fill in your details to create an account.</p>

                        <form className="rg-form" onSubmit={submit} noValidate>
                            <div className="rg-two">
                                <div className="rg-field">
                                    <label htmlFor="department">Department</label>
                                    <select id="department" name="department" className="rg-input" value={form.department} onChange={set}>
                                        {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div className="rg-field">
                                    <label htmlFor="role">Role</label>
                                    <select id="role" name="role" className="rg-input" value={form.role} onChange={set}>
                                        <option value="student">Student</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            </div>

                            <div className="rg-two">
                                <div className="rg-field">
                                    <label htmlFor="userId">{isAdmin ? "Admin ID" : "ID number"}</label>
                                    <input id="userId" name="userId" className={"rg-input" + (errors.userId ? " rg-bad" : "")} value={form.userId} onChange={set} placeholder={isAdmin ? "e.g. t-" + deptCode(form.department) + "-13" : "e.g. 22A81A0501"} autoComplete="off" />
                                    {errors.userId ? <span className="rg-err">{errors.userId}</span> : isAdmin && <span className="rg-hint">Format: t-department-number</span>}
                                </div>
                                <div className="rg-field">
                                    <label htmlFor="name">User name</label>
                                    <input id="name" name="name" className={"rg-input" + (errors.name ? " rg-bad" : "")} value={form.name} onChange={set} placeholder="Your full name" autoComplete="name" />
                                    {errors.name && <span className="rg-err">{errors.name}</span>}
                                </div>
                            </div>

                            <div className="rg-field">
                                <label htmlFor="email">Email ID</label>
                                <input id="email" name="email" type="email" className={"rg-input" + (errors.email ? " rg-bad" : "")} value={form.email} onChange={set} placeholder="you@example.com" autoComplete="email" />
                                {errors.email && <span className="rg-err">{errors.email}</span>}
                            </div>

                            <div className="rg-two">
                                <div className="rg-field">
                                    <label htmlFor="password">Password</label>
                                    <div className="rg-pw">
                                        <input id="password" name="password" type={show ? "text" : "password"} className={"rg-input" + (errors.password ? " rg-bad" : "")} value={form.password} onChange={set} placeholder="At least 6 characters" autoComplete="new-password" />
                                        <button type="button" className="rg-eye" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"}>
                                            {show ? "Hide" : "Show"}
                                        </button>
                                    </div>
                                    {form.password && (
                                        <div className="rg-meter" aria-hidden="true">
                                            {[1, 2, 3].map((n) => <i key={n} className={score >= n ? "on-" + score : ""} />)}
                                        </div>
                                    )}
                                    {errors.password && <span className="rg-err">{errors.password}</span>}
                                </div>
                                <div className="rg-field">
                                    <label htmlFor="confirm">Confirm password</label>
                                    <input id="confirm" name="confirm" type={show ? "text" : "password"} className={"rg-input" + (errors.confirm ? " rg-bad" : "")} value={form.confirm} onChange={set} placeholder="Re-enter password" autoComplete="new-password" />
                                    {errors.confirm && <span className="rg-err">{errors.confirm}</span>}
                                </div>
                            </div>

                            {status.text && (
                                <div className={"rg-msg " + (status.type === "ok" ? "rg-msg-ok" : "rg-msg-bad")} role="status">{status.text}</div>
                            )}

                            <button type="submit" className="rg-submit" disabled={loading}>
                                {loading ? "Creating account..." : "Create account"}
                            </button>
                            <p className="rg-login-line">Already have an account? <Link to="/login">Login</Link></p>
                        </form>
                    </section>
                </div>
            </main>
        </div>
    );
}