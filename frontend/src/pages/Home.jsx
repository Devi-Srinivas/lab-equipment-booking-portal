import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const GREEN = '#6ef04b'; // same parrot green as the login page
const WORDS = ['microscopes', 'oscilloscopes', 'Arduino kits', 'projectors', 'computers'];

const AVAILABILITY = [
    { id: 1, icon: '⚡', name: 'Arduino Kits', meta: 'Electronics Lab', free: 12 },
    { id: 2, icon: '🍓', name: 'Raspberry Pi Boards', meta: 'IoT Lab', free: 4 },
    { id: 3, icon: '🧠', name: 'FPGA Boards', meta: 'VLSI Lab', free: 0 },
    { id: 4, icon: '📟', name: 'Digital Multimeters', meta: 'Electronics Lab', free: 9 },
];

const EQUIPMENT = [
    { icon: '⚡', name: 'Arduino Kits', text: 'Microcontroller boards for embedded projects.' },
    { icon: '🍓', name: 'Raspberry Pi Boards', text: 'Single-board computers for IoT and AI work.' },
    { icon: '📡', name: 'IoT Kits', text: 'Sensors and modules for connected devices.' },
    { icon: '🧠', name: 'FPGA Boards', text: 'Programmable boards for digital design.' },
    { icon: '💻', name: 'Laptops', text: 'Systems for coding and simulation.' },
    { icon: '📽️', name: 'Projectors', text: 'Presentation equipment for labs and seminars.' },
    { icon: '📟', name: 'Digital Multimeters', text: 'Measure voltage, current and resistance.' },
    { icon: '🌐', name: 'Networking Devices', text: 'Routers and switches for network labs.' },
];

const STEPS = [
    { title: 'Register and log in', text: 'Create a student account and sign in securely.' },
    { title: 'Browse equipment', text: 'See what is available in each laboratory.' },
    { title: 'Request a booking', text: 'Choose the equipment, booking date and return date.' },
    { title: 'Get approval', text: 'Admin approves the request. Check the status any time.' },
];

const STUDENT = ['Register and log in', 'View available equipment', 'Book equipment', 'View booking status', 'Cancel a booking'];
const ADMIN = ['Add and update equipment', 'Approve or reject booking requests', 'Mark equipment as returned', 'View equipment reports'];

const CubeIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 8l-9-5-9 5v8l9 5 9-5V8z" />
        <path d="M3.3 7.5L12 12.5l8.7-5" />
        <path d="M12 22V12.5" />
    </svg>
);

/* All class names start with "hp-" so they cannot clash with other CSS in your project. */
const css = `
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap");

.hp-root { --muted: #a3b1a8; --line: #1c2a21; --card: rgba(255,255,255,0.04);
           background: #000; color: #fff; font-family: 'Inter', 'Segoe UI', Arial, sans-serif; line-height: 1.6; text-align: left; min-height: 100vh; }
.hp-root *, .hp-root *::before, .hp-root *::after { box-sizing: border-box; }
.hp-root h1, .hp-root h2, .hp-root h3, .hp-root p, .hp-root ul, .hp-root ol { margin: 0; padding: 0; }
.hp-root h1, .hp-root h2, .hp-root h3 { color: #fff; } /* stops other project CSS from making headings dark */
.hp-root :where(a) { color: inherit; text-decoration: none; }
.hp-root a:focus-visible, .hp-root button:focus-visible { outline: 3px solid ${GREEN}; outline-offset: 3px; }
.hp-wrap { max-width: 1180px; margin: 0 auto; padding: 0 24px; width: 100%; }

/* buttons */
.hp-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 24px; border-radius: 12px; border: 1px solid #1f2d24;
          font: 700 15px 'Inter', sans-serif; color: #fff; background: rgba(255,255,255,0.03); cursor: pointer; transition: transform .18s, border-color .18s, color .18s, box-shadow .18s; }
.hp-btn:hover { border-color: ${GREEN}; color: ${GREEN}; }
.hp-main { position: relative; overflow: hidden; border: none; color: #04120a; background: linear-gradient(135deg, #b4ff7a 0%, ${GREEN} 45%, #3fdc6e 100%); box-shadow: 0 10px 30px rgba(110,240,75,0.3); }
.hp-main:hover { color: #04120a; transform: translateY(-2px); box-shadow: 0 16px 38px rgba(110,240,75,0.45); }
.hp-main::after { content: ''; position: absolute; top: 0; left: -80%; width: 50%; height: 100%; transform: skewX(-20deg); background: linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent); }
.hp-main:hover::after { animation: hpShine .8s ease; }
.hp-sm { padding: 8px 18px; font-size: 14px; border-radius: 10px; }

/* nav */
.hp-nav { position: sticky; top: 0; z-index: 20; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); border-bottom: 1px solid #14201a; }
.hp-nav-in { display: flex; align-items: center; justify-content: space-between; gap: 24px; height: 74px; }
.hp-brand { display: flex; align-items: center; gap: 10px; font-size: 20px; font-weight: 800; }
.hp-brand-icon { display: inline-flex; padding: 6px; border: 1.5px solid ${GREEN}; border-radius: 10px; }
.hp-links { display: flex; gap: 32px; font-size: 15px; font-weight: 500; color: var(--muted); }
.hp-links a:hover { color: ${GREEN}; }
.hp-actions { display: flex; gap: 10px; }

/* hero */
.hp-hero { position: relative; overflow: hidden; padding: 72px 0 88px; background: linear-gradient(160deg, #040a05 0%, #000 100%); }
.hp-hero::before { content: ''; position: absolute; inset: 0; pointer-events: none; background: radial-gradient(560px circle at var(--mx, 70%) var(--my, 20%), rgba(110,240,75,0.15), transparent 62%); }
.hp-grid { position: absolute; inset: 0; pointer-events: none; opacity: .55; background-size: 46px 46px;
           background-image: linear-gradient(rgba(110,240,75,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(110,240,75,0.06) 1px, transparent 1px); }
.hp-orb { position: absolute; border-radius: 50%; filter: blur(70px); pointer-events: none; animation: hpFloat 9s ease-in-out infinite; }
.hp-hero-in { position: relative; display: grid; grid-template-columns: 1.05fr .95fr; gap: 64px; align-items: center; }
.hp-pill { display: inline-flex; align-items: center; gap: 10px; padding: 7px 16px; border-radius: 99px; font-size: 13px; font-weight: 700; color: ${GREEN};
           background: rgba(110,240,75,0.07); border: 1px solid rgba(110,240,75,0.28); }
.hp-dot { width: 8px; height: 8px; border-radius: 50%; background: ${GREEN}; box-shadow: 0 0 0 4px rgba(110,240,75,0.2), 0 0 12px ${GREEN}; }
.hp-hero h1 { font-size: clamp(38px, 5.4vw, 66px); font-weight: 800; line-height: 1.06; letter-spacing: -0.03em; margin: 22px 0; }
.hp-glow { display: block; color: ${GREEN}; text-shadow: 0 0 30px rgba(110,240,75,0.45); }
.hp-lead { color: #b9c7bd; font-size: 17px; max-width: 520px; }
.hp-word { color: ${GREEN}; font-weight: 700; }
.hp-cta-row { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 30px; }
.hp-stats { display: flex; gap: 40px; margin-top: 38px; flex-wrap: wrap; }
.hp-stats strong { display: block; font-size: 28px; font-weight: 800; color: ${GREEN}; line-height: 1.1; text-shadow: 0 0 18px rgba(110,240,75,0.35); }
.hp-stats span { font-size: 13px; color: var(--muted); }

/* availability card */
.hp-card-wrap { position: relative; }
.hp-card { padding: 24px 26px; border-radius: 22px; border: 1px solid var(--line); border-top: 3px solid ${GREEN};
           background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
           box-shadow: 0 30px 80px rgba(0,0,0,0.6), 0 0 60px rgba(110,240,75,0.08); animation: hpFloatCard 6s ease-in-out infinite; }
.hp-card-head { display: flex; justify-content: space-between; align-items: center; padding-bottom: 14px; }
.hp-card-head strong { font-size: 18px; }
.hp-card-head span { font-size: 12px; color: var(--muted); border: 1px solid var(--line); padding: 3px 12px; border-radius: 99px; }
.hp-row { display: flex; align-items: center; gap: 14px; padding: 13px 0; border-top: 1px solid var(--line); }
.hp-emoji { width: 44px; height: 44px; flex: none; display: grid; place-items: center; font-size: 22px; border-radius: 12px; background: rgba(110,240,75,0.08); border: 1px solid #1f2d24; }
.hp-row-main { flex: 1; min-width: 0; }
.hp-row-main strong { display: block; font-size: 15px; font-weight: 700; }
.hp-row-main span { font-size: 13px; color: var(--muted); }
.hp-tag { font-size: 12px; font-weight: 700; padding: 4px 11px; border-radius: 99px; white-space: nowrap; }
.hp-tag-no { background: rgba(255,91,91,0.12); color: #ff8a8a; border: 1px solid rgba(255,91,91,0.35); }
.hp-tag-req { background: rgba(110,240,75,0.12); color: ${GREEN}; border: 1px solid rgba(110,240,75,0.35); }
.hp-note { margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--line); font-size: 13px; color: var(--muted); }
.hp-chip { position: absolute; left: -22px; bottom: -22px; display: flex; align-items: center; gap: 10px; padding: 11px 16px; border-radius: 14px; font-size: 14px; font-weight: 700;
           background: #0b100c; border: 1px solid rgba(110,240,75,0.4); box-shadow: 0 14px 34px rgba(0,0,0,0.6), 0 0 24px rgba(110,240,75,0.18); }
.hp-chip i { font-style: normal; width: 26px; height: 26px; border-radius: 50%; display: grid; place-items: center; font-size: 14px; color: #04120a; background: ${GREEN}; }

/* sections */
.hp-section { padding: 88px 0; border-top: 1px solid #14201a; scroll-margin-top: 74px; position: relative; }
.hp-head { text-align: center; max-width: 620px; margin: 0 auto 48px; }
.hp-kicker { display: inline-block; padding: 4px 14px; border-radius: 99px; font-size: 12px; font-weight: 800; letter-spacing: .2em; text-transform: uppercase; color: ${GREEN};
             background: rgba(110,240,75,0.07); border: 1px solid rgba(110,240,75,0.28); }
.hp-head h2 { font-size: clamp(28px, 3.6vw, 42px); font-weight: 800; letter-spacing: -0.02em; margin: 16px 0 10px; }
.hp-head p { color: var(--muted); }

.hp-steps { list-style: none; display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; counter-reset: s; }
.hp-steps li { counter-increment: s; padding: 24px; border-radius: 18px; border: 1px solid var(--line); background: var(--card); transition: transform .2s, border-color .2s, box-shadow .2s; }
.hp-steps li:hover { transform: translateY(-4px); border-color: rgba(110,240,75,0.55); box-shadow: 0 0 28px rgba(110,240,75,0.14); }
.hp-steps li::before { content: counter(s); display: grid; place-items: center; width: 40px; height: 40px; margin-bottom: 16px; border-radius: 12px; font-weight: 800; color: #04120a;
                       background: linear-gradient(135deg, #b4ff7a, ${GREEN} 60%, #3fdc6e); box-shadow: 0 6px 18px rgba(110,240,75,0.3); }
.hp-steps h3 { font-size: 17px; margin-bottom: 6px; }
.hp-steps p { font-size: 14px; color: var(--muted); }

.hp-eq { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.hp-item { padding: 24px; border-radius: 18px; border: 1px solid var(--line); background: var(--card); transition: transform .2s, border-color .2s, box-shadow .2s; }
.hp-item:hover { transform: translateY(-4px); border-color: rgba(110,240,75,0.55); box-shadow: 0 0 28px rgba(110,240,75,0.14); }
.hp-item .hp-emoji { width: 54px; height: 54px; font-size: 27px; margin-bottom: 16px; }
.hp-item h3 { font-size: 16px; margin-bottom: 6px; }
.hp-item p { font-size: 14px; color: var(--muted); }

.hp-roles { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.hp-role { padding: 32px; border-radius: 22px; border: 1px solid var(--line); border-top: 3px solid ${GREEN}; background: linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015)); }
.hp-role-admin { border-top-color: #5ee6c8; }
.hp-role h3 { font-size: 22px; margin-bottom: 18px; }
.hp-role ul { list-style: none; display: grid; gap: 13px; }
.hp-role li { display: flex; gap: 12px; align-items: flex-start; color: #e8f3ea; }
.hp-role li::before { content: '\\2713'; flex: none; width: 24px; height: 24px; margin-top: 1px; display: grid; place-items: center; border-radius: 50%; font-size: 12px; font-weight: 800;
                      color: ${GREEN}; background: rgba(110,240,75,0.1); border: 1px solid rgba(110,240,75,0.35); }
.hp-role-admin li::before { color: #5ee6c8; background: rgba(94,230,200,0.1); border-color: rgba(94,230,200,0.35); }

.hp-banner { position: relative; overflow: hidden; max-width: 1132px; width: calc(100% - 48px); margin: 0 auto 88px; padding: 64px 24px; border-radius: 28px; text-align: center; color: #04120a;
             background: linear-gradient(135deg, #b4ff7a 0%, ${GREEN} 50%, #3fdc6e 100%); box-shadow: 0 24px 70px rgba(110,240,75,0.28); }
.hp-banner h2, .hp-banner p { color: #04120a; }
.hp-banner h2 { font-size: clamp(26px, 3.4vw, 38px); font-weight: 800; letter-spacing: -0.02em; margin-bottom: 8px; }
.hp-banner p { margin-bottom: 28px; opacity: .85; font-weight: 500; }
.hp-dark { background: #04120a; color: ${GREEN}; border: none; box-shadow: 0 10px 26px rgba(0,0,0,0.35); }
.hp-dark:hover { color: #fff; transform: translateY(-2px); }
.hp-foot { border-top: 1px solid #14201a; padding: 26px 0; text-align: center; font-size: 13px; color: #7f9186; }

@keyframes hpFloat { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(26px,-34px); } }
@keyframes hpFloatCard { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
@keyframes hpShine { to { left: 130%; } }

@media (max-width: 960px) {
  .hp-hero-in { grid-template-columns: 1fr; gap: 56px; }
  .hp-links { display: none; }
  .hp-steps, .hp-eq { grid-template-columns: 1fr 1fr; }
  .hp-chip { left: 8px; }
}
@media (max-width: 560px) {
  .hp-steps, .hp-eq, .hp-roles { grid-template-columns: 1fr; }
  .hp-hero { padding-top: 40px; }
}
@media (prefers-reduced-motion: reduce) { .hp-orb, .hp-card { animation: none; } .hp-root * { transition: none !important; } }
`;

const Home = () => {
    const [requested, setRequested] = useState([]);
    const [wordIndex, setWordIndex] = useState(0);

    // Rotating equipment word in the intro text
    useEffect(() => {
        const timer = setInterval(() => setWordIndex((i) => (i + 1) % WORDS.length), 2400);
        return () => clearInterval(timer);
    }, []);

    // Soft green spotlight that follows the mouse in the hero
    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`);
    };

    const toggle = (id) =>
        setRequested((r) => (r.includes(id) ? r.filter((x) => x !== id) : [...r, id]));

    return (
        <div className="hp-root" id="home">
            <style>{css}</style>

            <nav className="hp-nav">
                <div className="hp-wrap hp-nav-in">
                    <Link to="/" className="hp-brand">
                        <span className="hp-brand-icon"><CubeIcon /></span>
                        Lab Portal
                    </Link>
                    <div className="hp-links">
                        <a href="#home">Home</a>
                        <a href="#about">About</a>
                        <a href="#equipment">Equipment</a>
                        <a href="#features">Features</a>
                    </div>
                    <div className="hp-actions">
                        <Link to="/login" className="hp-btn hp-sm">Login</Link>
                        <Link to="/register" className="hp-btn hp-main hp-sm">Register</Link>
                    </div>
                </div>
            </nav>

            <header className="hp-hero" onMouseMove={handleMouseMove}>
                <div className="hp-grid" />
                <div className="hp-orb" style={{ width: 320, height: 320, top: -90, right: -60, background: 'rgba(110,240,75,0.26)' }} />
                <div className="hp-orb" style={{ width: 260, height: 260, bottom: -100, left: -70, background: 'rgba(63,220,110,0.2)', animationDelay: '-4s' }} />

                <div className="hp-wrap hp-hero-in">
                    <div>
                        <span className="hp-pill"><span className="hp-dot" /> Engineering college smart labs</span>
                        <h1>
                            Laboratory Equipment
                            <span className="hp-glow">Booking Portal</span>
                        </h1>
                        <p className="hp-lead">
                            Book <span key={wordIndex} className="hp-word">{WORDS[wordIndex]}</span> and more in a few clicks. Check what is
                            available, request the equipment you need, and track your booking status in one simple place.
                        </p>
                        <div className="hp-cta-row">
                            <Link to="/register" className="hp-btn hp-main">Get started</Link>
                            <a href="#about" className="hp-btn">Learn more</a>
                        </div>
                        <div className="hp-stats">
                            <div><strong>8+</strong><span>Equipment types</span></div>
                            <div><strong>2</strong><span>Roles: student and admin</span></div>
                            <div><strong>4</strong><span>Steps to a booking</span></div>
                        </div>
                    </div>

                    <div className="hp-card-wrap">
                        <aside className="hp-card" aria-label="Equipment availability example">
                            <div className="hp-card-head">
                                <strong>Available today</strong>
                                <span>Live example</span>
                            </div>
                            {AVAILABILITY.map((e) => {
                                const isReq = requested.includes(e.id);
                                return (
                                    <div className="hp-row" key={e.id}>
                                        <span className="hp-emoji" aria-hidden="true">{e.icon}</span>
                                        <div className="hp-row-main">
                                            <strong>{e.name}</strong>
                                            <span>{e.meta} · {e.free} available</span>
                                        </div>
                                        {e.free === 0 ? (
                                            <span className="hp-tag hp-tag-no">Fully booked</span>
                                        ) : (
                                            <>
                                                {isReq && <span className="hp-tag hp-tag-req">Requested</span>}
                                                <button type="button" className="hp-btn hp-sm" onClick={() => toggle(e.id)}>
                                                    {isReq ? 'Cancel' : 'Request'}
                                                </button>
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                            <p className="hp-note">Log in to send real requests to the lab admin.</p>
                        </aside>
                        <div className="hp-chip"><i>✓</i> Booking approved</div>
                    </div>
                </div>
            </header>

            <section className="hp-section" id="about">
                <div className="hp-wrap">
                    <div className="hp-head">
                        <span className="hp-kicker">About</span>
                        <h2>How the portal works</h2>
                        <p>No more asking faculty one by one. Everything from request to return is recorded in one place.</p>
                    </div>
                    <ol className="hp-steps">
                        {STEPS.map((s) => (
                            <li key={s.title}>
                                <h3>{s.title}</h3>
                                <p>{s.text}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            <section className="hp-section" id="equipment">
                <div className="hp-wrap">
                    <div className="hp-head">
                        <span className="hp-kicker">Equipment</span>
                        <h2>What you can book</h2>
                        <p>Equipment from the engineering laboratories, all in one list.</p>
                    </div>
                    <div className="hp-eq">
                        {EQUIPMENT.map((e) => (
                            <article className="hp-item" key={e.name}>
                                <span className="hp-emoji" aria-hidden="true">{e.icon}</span>
                                <h3>{e.name}</h3>
                                <p>{e.text}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="hp-section" id="features">
                <div className="hp-wrap">
                    <div className="hp-head">
                        <span className="hp-kicker">Features</span>
                        <h2>Built for students and admins</h2>
                        <p>Each role sees only the tools it needs.</p>
                    </div>
                    <div className="hp-roles">
                        <div className="hp-role">
                            <h3>Student</h3>
                            <ul>{STUDENT.map((t) => <li key={t}>{t}</li>)}</ul>
                        </div>
                        <div className="hp-role hp-role-admin">
                            <h3>Admin</h3>
                            <ul>{ADMIN.map((t) => <li key={t}>{t}</li>)}</ul>
                        </div>
                    </div>
                </div>
            </section>

            <section className="hp-banner">
                <h2>Ready to book your equipment?</h2>
                <p>Create an account and send your first request in minutes.</p>
                <Link to="/register" className="hp-btn hp-dark">Create your account</Link>
            </section>

            <footer className="hp-foot">
                © {new Date().getFullYear()} Lab Portal · Sri Vasavi Engineering College (Autonomous), Tadepalligudem
            </footer>
        </div>
    );
};

export default Home;