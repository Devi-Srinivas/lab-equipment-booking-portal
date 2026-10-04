import { useState } from "react";
import { Link } from "react-router-dom";

/* All class names start with "lb-" so they cannot clash with your other CSS files. */
const CSS = `
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap");

.lb-page {
  --text: #1a1d24;
  --muted: #566070;
  --line: #eadfd5;
  --orange: #d95500;
  --orange-dark: #b84700;
  --amber: #ff9a1f;
  --soft: #fff6ec;
  font-family: "Inter", system-ui, sans-serif;
  color: var(--text);
  background: #fff;
  line-height: 1.6;
  text-align: left;
  min-height: 100vh;
}
.lb-page *, .lb-page *::before, .lb-page *::after { box-sizing: border-box; }
.lb-page h1, .lb-page h2, .lb-page h3, .lb-page p, .lb-page ul, .lb-page ol { margin: 0; padding: 0; }
.lb-page :where(a) { color: inherit; text-decoration: none; }
.lb-page a:focus-visible, .lb-page button:focus-visible { outline: 3px solid var(--amber); outline-offset: 3px; }
.lb-wrap { max-width: 1180px; margin: 0 auto; padding: 0 1.5rem; width: 100%; }

/* Buttons */
.lb-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
  padding: 0.8rem 1.5rem; border-radius: 12px; border: 1.5px solid var(--line);
  font: 600 0.95rem "Inter", sans-serif; color: var(--text); background: #fff; cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s, transform 0.15s;
}
.lb-btn:hover { border-color: var(--orange); color: var(--orange); }
.lb-btn-main { background: linear-gradient(135deg, #e86400, #c24a00); border-color: transparent; color: #fff; box-shadow: 0 8px 20px rgba(217, 85, 0, 0.3); }
.lb-btn-main:hover { color: #fff; border-color: transparent; transform: translateY(-2px); }
.lb-btn-white { background: #fff; color: var(--orange-dark); border-color: #fff; }
.lb-btn-white:hover { background: var(--soft); color: var(--orange-dark); border-color: var(--soft); }
.lb-btn-sm { padding: 0.5rem 1.1rem; font-size: 0.88rem; border-radius: 10px; }

/* Navbar */
.lb-nav { position: sticky; top: 0; z-index: 20; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(8px); border-bottom: 1px solid var(--line); }
.lb-nav-in { display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; height: 74px; }
.lb-brand { display: flex; align-items: center; gap: 0.7rem; font-weight: 800; font-size: 1.35rem; letter-spacing: -0.02em; }
.lb-brand b { color: var(--orange); font-weight: 800; }
.lb-brand-icon { width: 38px; height: 38px; border-radius: 11px; background: linear-gradient(135deg, #ff9a1f, #d95500); display: grid; place-items: center; }
.lb-links { display: flex; gap: 2rem; font-size: 0.95rem; font-weight: 500; color: var(--muted); }
.lb-links a:hover { color: var(--orange); }
.lb-actions { display: flex; gap: 0.7rem; }

/* Hero */
.lb-hero { position: relative; overflow: hidden; padding: 4.5rem 0 5rem; background: linear-gradient(180deg, #fff3e6 0%, #ffffff 100%); }
.lb-blob { position: absolute; border-radius: 50%; filter: blur(60px); pointer-events: none; }
.lb-blob-1 { width: 420px; height: 420px; right: -80px; top: -60px; background: rgba(255, 154, 31, 0.3); }
.lb-blob-2 { width: 320px; height: 320px; left: -100px; bottom: -80px; background: rgba(217, 85, 0, 0.12); }
.lb-hero-in { position: relative; display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 4rem; align-items: center; }
.lb-pill { display: inline-flex; align-items: center; gap: 0.5rem; background: #fff; border: 1px solid var(--line); border-radius: 99px; padding: 0.35rem 0.9rem; font-size: 0.85rem; font-weight: 600; color: var(--orange-dark); }
.lb-dot { width: 8px; height: 8px; border-radius: 50%; background: #1fa65a; box-shadow: 0 0 0 4px rgba(31, 166, 90, 0.18); }
.lb-hero h1 { font-size: clamp(2.6rem, 5.4vw, 4.5rem); font-weight: 800; line-height: 1.04; letter-spacing: -0.035em; margin: 1.3rem 0 1.4rem; }
.lb-grad { background: linear-gradient(90deg, #d95500, #ff9a1f); -webkit-background-clip: text; background-clip: text; color: transparent; }
.lb-lead { color: var(--muted); font-size: 1.12rem; max-width: 33rem; }
.lb-cta-row { display: flex; gap: 0.8rem; flex-wrap: wrap; margin-top: 2rem; }
.lb-stats { display: flex; gap: 2.2rem; margin-top: 2.6rem; flex-wrap: wrap; }
.lb-stats strong { display: block; font-size: 1.7rem; font-weight: 800; color: var(--orange); line-height: 1.1; }
.lb-stats span { font-size: 0.85rem; color: var(--muted); }

/* Availability card */
.lb-card-wrap { position: relative; }
.lb-card { background: #fff; border: 1px solid var(--line); border-top: 5px solid var(--orange); border-radius: 22px; padding: 1.5rem 1.6rem; box-shadow: 0 30px 70px rgba(217, 85, 0, 0.18); animation: lb-float 6s ease-in-out infinite; }
@keyframes lb-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
.lb-card-head { display: flex; justify-content: space-between; align-items: center; padding-bottom: 0.9rem; }
.lb-card-head strong { font-size: 1.1rem; }
.lb-card-head span { font-size: 0.8rem; color: var(--muted); background: var(--soft); padding: 0.2rem 0.7rem; border-radius: 99px; }
.lb-row { display: flex; align-items: center; gap: 0.9rem; padding: 0.8rem 0; border-top: 1px solid var(--line); }
.lb-emoji { width: 42px; height: 42px; border-radius: 12px; display: grid; place-items: center; font-size: 1.3rem; flex: none; }
.lb-row-main { flex: 1; min-width: 0; }
.lb-row-main strong { display: block; font-size: 0.97rem; font-weight: 650; }
.lb-row-main span { color: var(--muted); font-size: 0.82rem; }
.lb-tag { font-size: 0.75rem; font-weight: 700; padding: 0.25rem 0.65rem; border-radius: 99px; white-space: nowrap; }
.lb-tag-no { background: #fde8e8; color: #b42222; }
.lb-tag-req { background: #fff0dc; color: var(--orange-dark); }
.lb-note { margin-top: 0.9rem; padding-top: 0.9rem; border-top: 1px solid var(--line); color: var(--muted); font-size: 0.85rem; }
.lb-chip { position: absolute; left: -1.5rem; bottom: -1.2rem; background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 0.7rem 1rem; display: flex; align-items: center; gap: 0.7rem; font-size: 0.88rem; font-weight: 600; box-shadow: 0 14px 34px rgba(0, 0, 0, 0.12); }
.lb-chip i { font-style: normal; width: 28px; height: 28px; border-radius: 50%; background: #1fa65a; color: #fff; display: grid; place-items: center; font-size: 0.9rem; }

/* Sections */
.lb-section { padding: 5rem 0; scroll-margin-top: 74px; }
.lb-soft { background: var(--soft); }
.lb-head { text-align: center; max-width: 40rem; margin: 0 auto 3rem; }
.lb-kicker { display: inline-block; color: var(--orange); font-weight: 700; font-size: 0.85rem; background: #fff0dc; padding: 0.25rem 0.9rem; border-radius: 99px; }
.lb-head h2 { font-size: clamp(1.8rem, 3.4vw, 2.6rem); font-weight: 800; letter-spacing: -0.025em; margin: 0.9rem 0 0.7rem; }
.lb-head p { color: var(--muted); }

.lb-steps { list-style: none; display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.4rem; counter-reset: s; }
.lb-steps li { counter-increment: s; position: relative; background: #fff; border: 1px solid var(--line); border-radius: 18px; padding: 1.6rem; box-shadow: 0 6px 20px rgba(0, 0, 0, 0.04); }
.lb-steps li::before { content: counter(s); display: grid; place-items: center; width: 40px; height: 40px; border-radius: 12px; background: linear-gradient(135deg, #ff9a1f, #d95500); color: #fff; font-weight: 800; margin-bottom: 1rem; }
.lb-steps h3 { font-size: 1.05rem; margin-bottom: 0.4rem; }
.lb-steps p { color: var(--muted); font-size: 0.92rem; }

.lb-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.4rem; }
.lb-item { background: #fff; border: 1px solid var(--line); border-radius: 18px; padding: 1.6rem; transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s; }
.lb-item:hover { transform: translateY(-4px); box-shadow: 0 18px 40px rgba(217, 85, 0, 0.14); border-color: var(--amber); }
.lb-item .lb-emoji { width: 54px; height: 54px; font-size: 1.7rem; margin-bottom: 1.1rem; }
.lb-item h3 { font-size: 1.05rem; margin-bottom: 0.35rem; }
.lb-item p { color: var(--muted); font-size: 0.9rem; }

.lb-roles { display: grid; grid-template-columns: 1fr 1fr; gap: 1.6rem; }
.lb-role { background: #fff; border: 1px solid var(--line); border-radius: 22px; padding: 2.2rem; border-top: 5px solid var(--orange); box-shadow: 0 8px 26px rgba(0, 0, 0, 0.05); }
.lb-role-admin { border-top-color: #2b3a67; }
.lb-role h3 { font-size: 1.35rem; margin-bottom: 1.2rem; }
.lb-role ul { list-style: none; display: grid; gap: 0.85rem; }
.lb-role li { display: flex; gap: 0.8rem; align-items: flex-start; }
.lb-role li::before { content: "\\2713"; flex: none; width: 24px; height: 24px; border-radius: 50%; background: #fff0dc; color: var(--orange-dark); font-size: 0.8rem; font-weight: 800; display: grid; place-items: center; margin-top: 2px; }
.lb-role-admin li::before { background: #e6eaf6; color: #2b3a67; }

.lb-banner { margin: 0 auto 5rem; max-width: 1132px; width: calc(100% - 3rem); border-radius: 28px; padding: 4rem 2rem; text-align: center; color: #fff; background: linear-gradient(135deg, #c24a00, #e86400 70%, #f07d12); box-shadow: 0 24px 60px rgba(217, 85, 0, 0.3); }
.lb-banner h2 { font-size: clamp(1.8rem, 3.4vw, 2.5rem); font-weight: 800; letter-spacing: -0.02em; margin-bottom: 0.7rem; }
.lb-banner p { opacity: 0.95; margin-bottom: 1.8rem; }
.lb-foot { border-top: 1px solid var(--line); padding: 1.6rem 0; text-align: center; color: var(--muted); font-size: 0.88rem; }

@media (max-width: 960px) {
  .lb-hero-in { grid-template-columns: 1fr; gap: 3.5rem; }
  .lb-links { display: none; }
  .lb-steps, .lb-grid { grid-template-columns: 1fr 1fr; }
  .lb-chip { left: 0.5rem; }
}
@media (max-width: 560px) {
  .lb-steps, .lb-grid, .lb-roles { grid-template-columns: 1fr; }
  .lb-hero { padding-top: 2.5rem; }
}
@media (prefers-reduced-motion: reduce) {
  .lb-card { animation: none; }
  .lb-page * { transition: none !important; }
}
`;

const AVAILABILITY = [
    { id: 1, icon: "⚡", bg: "#fff0dc", name: "Arduino Kits", meta: "Electronics Lab", free: 12 },
    { id: 2, icon: "🍓", bg: "#fde8ee", name: "Raspberry Pi Boards", meta: "IoT Lab", free: 4 },
    { id: 3, icon: "🧠", bg: "#e8ecf9", name: "FPGA Boards", meta: "VLSI Lab", free: 0 },
    { id: 4, icon: "📟", bg: "#e5f5ec", name: "Digital Multimeters", meta: "Electronics Lab", free: 9 },
];

const EQUIPMENT = [
    { icon: "⚡", bg: "#fff0dc", name: "Arduino Kits", text: "Microcontroller boards for embedded projects." },
    { icon: "🍓", bg: "#fde8ee", name: "Raspberry Pi Boards", text: "Single-board computers for IoT and AI work." },
    { icon: "📡", bg: "#e3f2fb", name: "IoT Kits", text: "Sensors and modules for connected devices." },
    { icon: "🧠", bg: "#e8ecf9", name: "FPGA Boards", text: "Programmable boards for digital design." },
    { icon: "💻", bg: "#eceff3", name: "Laptops", text: "Systems for coding and simulation." },
    { icon: "📽️", bg: "#f3e9fb", name: "Projectors", text: "Presentation equipment for labs and seminars." },
    { icon: "📟", bg: "#e5f5ec", name: "Digital Multimeters", text: "Measure voltage, current and resistance." },
    { icon: "🌐", bg: "#e0f4f4", name: "Networking Devices", text: "Routers and switches for network labs." },
];

const STEPS = [
    { title: "Register and log in", text: "Create a student account and sign in securely." },
    { title: "Browse equipment", text: "See what is available in each laboratory." },
    { title: "Request a booking", text: "Choose the equipment, booking date and return date." },
    { title: "Get approval", text: "Admin approves the request. Check the status any time." },
];

const STUDENT = ["Register and log in", "View available equipment", "Book equipment", "View booking status", "Cancel a booking"];
const ADMIN = ["Add and update equipment", "Approve or reject booking requests", "Mark equipment as returned", "View equipment reports"];

export default function Home() {
    const [requested, setRequested] = useState([]);
    const toggle = (id) =>
        setRequested((r) => (r.includes(id) ? r.filter((x) => x !== id) : [...r, id]));

    return (
        <div className="lb-page" id="home">
            <style>{CSS}</style>

            <nav className="lb-nav">
                <div className="lb-wrap lb-nav-in">
                    <Link to="/" className="lb-brand">
                        <span className="lb-brand-icon" aria-hidden="true">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
                                <path d="M9 3h6M10 3v6l-5 10a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-10V3" />
                            </svg>
                        </span>
                        <span><b>Lab Equipment Portal </b></span>
                    </Link>
                    <div className="lb-links">
                        <a href="#home">Home</a>
                        <a href="#about">About</a>
                        <a href="#equipment">Equipment</a>
                        <a href="#features">Features</a>
                    </div>
                    <div className="lb-actions">
                        <Link to="/login" className="lb-btn lb-btn-sm">Login</Link>
                        <Link to="/register" className="lb-btn lb-btn-main lb-btn-sm">Register</Link>
                    </div>
                </div>
            </nav>

            <header className="lb-hero">
                <span className="lb-blob lb-blob-1" />
                <span className="lb-blob lb-blob-2" />
                <div className="lb-wrap lb-hero-in">
                    <div>
                        <span className="lb-pill"><span className="lb-dot" /> Engineering college smart labs</span>
                        <h1>
                            Laboratory Equipment <span className="lb-grad">Booking Portal</span>
                        </h1>
                        <p className="lb-lead">
                            Check what is available, request the equipment you need, and track
                            your booking status. One simple place for students and admins to
                            manage laboratory equipment.
                        </p>
                        <div className="lb-cta-row">
                            <Link to="/register" className="lb-btn lb-btn-main">Get started</Link>
                            <a href="#about" className="lb-btn">Learn more</a>
                        </div>
                        <div className="lb-stats">
                            <div><strong>8+</strong><span>Equipment types</span></div>
                            <div><strong>2</strong><span>Roles: student and admin</span></div>
                            <div><strong>4</strong><span>Steps to a booking</span></div>
                        </div>
                    </div>

                    <div className="lb-card-wrap">
                        <aside className="lb-card" aria-label="Equipment availability example">
                            <div className="lb-card-head">
                                <strong>Available today</strong>
                                <span>Live example</span>
                            </div>
                            {AVAILABILITY.map((e) => {
                                const isReq = requested.includes(e.id);
                                return (
                                    <div className="lb-row" key={e.id}>
                                        <span className="lb-emoji" style={{ background: e.bg }} aria-hidden="true">{e.icon}</span>
                                        <div className="lb-row-main">
                                            <strong>{e.name}</strong>
                                            <span>{e.meta} · {e.free} available</span>
                                        </div>
                                        {e.free === 0 ? (
                                            <span className="lb-tag lb-tag-no">Fully booked</span>
                                        ) : (
                                            <>
                                                {isReq && <span className="lb-tag lb-tag-req">Requested</span>}
                                                <button type="button" className="lb-btn lb-btn-sm" onClick={() => toggle(e.id)}>
                                                    {isReq ? "Cancel" : "Request"}
                                                </button>
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                            <p className="lb-note">Log in to send real requests to the lab admin.</p>
                        </aside>
                        <div className="lb-chip"><i>✓</i> Booking approved</div>
                    </div>
                </div>
            </header>

            <section className="lb-section" id="about">
                <div className="lb-wrap">
                    <div className="lb-head">
                        <span className="lb-kicker">About</span>
                        <h2>How the portal works</h2>
                        <p>No more asking faculty one by one. Everything from request to return is recorded in one place.</p>
                    </div>
                    <ol className="lb-steps">
                        {STEPS.map((s) => (
                            <li key={s.title}>
                                <h3>{s.title}</h3>
                                <p>{s.text}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            <section className="lb-section lb-soft" id="equipment">
                <div className="lb-wrap">
                    <div className="lb-head">
                        <span className="lb-kicker">Equipment</span>
                        <h2>What you can book</h2>
                        <p>Equipment from the engineering laboratories, all in one list.</p>
                    </div>
                    <div className="lb-grid">
                        {EQUIPMENT.map((e) => (
                            <article className="lb-item" key={e.name}>
                                <span className="lb-emoji" style={{ background: e.bg }} aria-hidden="true">{e.icon}</span>
                                <h3>{e.name}</h3>
                                <p>{e.text}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="lb-section" id="features">
                <div className="lb-wrap">
                    <div className="lb-head">
                        <span className="lb-kicker">Features</span>
                        <h2>Built for students and admins</h2>
                        <p>Each role sees only the tools it needs.</p>
                    </div>
                    <div className="lb-roles">
                        <div className="lb-role">
                            <h3>Student</h3>
                            <ul>{STUDENT.map((t) => <li key={t}>{t}</li>)}</ul>
                        </div>
                        <div className="lb-role lb-role-admin">
                            <h3>Admin</h3>
                            <ul>{ADMIN.map((t) => <li key={t}>{t}</li>)}</ul>
                        </div>
                    </div>
                </div>
            </section>

            <section className="lb-banner">
                <h2>Ready to book your equipment?</h2>
                <p>Create an account and send your first request in minutes.</p>
                <Link to="/register" className="lb-btn lb-btn-white">Create your account</Link>
            </section>

            <footer className="lb-foot">
                © {new Date().getFullYear()} LabBook · Laboratory Equipment Booking Portal
            </footer>
        </div>
    );
}