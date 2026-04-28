/**
 * EXIT — Memecoin Landing Page
 * Rewritten: glitch transitions, breathing glow, mobile-safe layout, animated counter
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy } from 'lucide-react';

const MESSAGES = [
  "This won't end well",
  "You knew better",
  "Timing > belief",
  "The music is stopping",
  "Don't look back",
  "Someone has to hold the bag",
  "Slippage is your only friend",
  "Congratulations on your bags",
  "You could have stopped here",
];

const CONTRACT_ADDRESS = "ExiT111111111111111111111111111111111111111";
const JUPITER_URL = "https://jup.ag/swap/SOL-EXIT";
const TWITTER_URL = "https://x.com";
const TELEGRAM_URL = "https://t.me";

// --- Inline styles as a style tag injected once ---
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Bebas+Neue&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #000;
    color: #fff;
    font-family: 'Share Tech Mono', monospace;
    overflow-x: hidden;
    cursor: crosshair;
  }

  ::selection { background: #cc0000; color: #fff; }

  /* ---- GRAIN OVERLAY ---- */
  .grain {
    position: fixed;
    inset: 0;
    z-index: 100;
    pointer-events: none;
    opacity: 0.045;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
    background-size: 200px 200px;
    animation: grainShift 0.4s steps(1) infinite;
  }
  @keyframes grainShift {
    0%   { background-position: 0 0; }
    25%  { background-position: -50px 30px; }
    50%  { background-position: 20px -40px; }
    75%  { background-position: -30px -20px; }
    100% { background-position: 10px 50px; }
  }

  /* ---- SCANLINES ---- */
  .scanlines {
    position: fixed;
    inset: 0;
    z-index: 99;
    pointer-events: none;
    background: repeating-linear-gradient(
      to bottom,
      transparent 0px,
      transparent 3px,
      rgba(0,0,0,0.08) 3px,
      rgba(0,0,0,0.08) 4px
    );
  }

  /* ---- WARNING STRIPES ---- */
  .warning-stripe {
    position: fixed;
    left: 0; right: 0;
    height: 6px;
    z-index: 90;
    background: repeating-linear-gradient(
      90deg,
      #cc0000 0px, #cc0000 20px,
      #000 20px, #000 40px
    );
    opacity: 0.7;
  }
  .warning-stripe.top { top: 0; }
  .warning-stripe.bottom { bottom: 0; }

  /* ---- STATUS LABELS ---- */
  .status {
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px;
    letter-spacing: 3px;
    text-transform: uppercase;
    line-height: 1.8;
  }

  /* ---- BLINK ---- */
  .blink {
    display: inline-block;
    width: 7px; height: 7px;
    border-radius: 50%;
    background: #cc0000;
    margin-right: 6px;
    vertical-align: middle;
    animation: blink 1s step-start infinite;
  }
  @keyframes blink { 50% { opacity: 0; } }

  /* ---- EXIT BUTTON ---- */
  .exit-btn {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(52px, 14vw, 96px);
    letter-spacing: 8px;
    color: #fff;
    background: #cc0000;
    border: none;
    border-radius: 14px;
    padding: 0.25em 1em;
    cursor: pointer;
    position: relative;
    width: clamp(280px, 72vw, 520px);
    box-shadow:
      0 0 40px rgba(204,0,0,0.6),
      0 0 80px rgba(204,0,0,0.3),
      0 0 120px rgba(204,0,0,0.15);
    animation: breathe 3s ease-in-out infinite;
    transition: transform 0.08s;
    overflow: hidden;
  }
  .exit-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      180deg,
      transparent 0px,
      transparent 4px,
      rgba(255,255,255,0.04) 4px,
      rgba(255,255,255,0.04) 5px
    );
    pointer-events: none;
  }
  .exit-btn:active { transform: scale(0.97); }

  @keyframes breathe {
    0%, 100% {
      box-shadow:
        0 0 40px rgba(204,0,0,0.6),
        0 0 80px rgba(204,0,0,0.3),
        0 0 120px rgba(204,0,0,0.15);
    }
    50% {
      box-shadow:
        0 0 60px rgba(204,0,0,0.9),
        0 0 120px rgba(204,0,0,0.5),
        0 0 180px rgba(204,0,0,0.25);
    }
  }

  /* ---- TOO LATE STATE ---- */
  .exit-btn.too-late {
    background: #8b0000;
    animation: breathe-dark 2s ease-in-out infinite, shake 0.15s ease-in-out 3;
  }
  @keyframes breathe-dark {
    0%, 100% { box-shadow: 0 0 30px rgba(139,0,0,0.5), 0 0 60px rgba(139,0,0,0.2); }
    50%       { box-shadow: 0 0 50px rgba(139,0,0,0.8), 0 0 100px rgba(139,0,0,0.4); }
  }
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25%       { transform: translateX(-6px); }
    75%       { transform: translateX(6px); }
  }

  /* ---- GLITCH TEXT ---- */
  .glitch {
    position: relative;
    display: inline-block;
  }
  .glitch::before,
  .glitch::after {
    content: attr(data-text);
    position: absolute;
    inset: 0;
    background: transparent;
  }
  .glitch::before {
    color: #ff0000;
    clip-path: polygon(0 30%, 100% 30%, 100% 50%, 0 50%);
    transform: translateX(-3px);
    animation: glitch1 2.5s infinite steps(1);
  }
  .glitch::after {
    color: #00ffff;
    clip-path: polygon(0 60%, 100% 60%, 100% 75%, 0 75%);
    transform: translateX(3px);
    animation: glitch2 3s infinite steps(1);
  }
  @keyframes glitch1 {
    0%, 90%, 100% { opacity: 0; transform: translateX(0); }
    92%            { opacity: 1; transform: translateX(-4px); }
    94%            { opacity: 1; transform: translateX(3px); }
    96%            { opacity: 0; }
  }
  @keyframes glitch2 {
    0%, 85%, 100% { opacity: 0; transform: translateX(0); }
    87%            { opacity: 1; transform: translateX(4px); }
    89%            { opacity: 1; transform: translateX(-2px); }
    91%            { opacity: 0; }
  }

  /* ---- FLASH ON CLICK ---- */
  .flash-overlay {
    position: fixed;
    inset: 0;
    background: #ff0000;
    z-index: 200;
    pointer-events: none;
  }

  /* ---- BOTTOM LINKS ---- */
  .link-btn {
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #fff;
    text-decoration: none;
    border-bottom: 1px solid rgba(255,255,255,0.4);
    padding-bottom: 2px;
    transition: color 0.2s, border-color 0.2s;
    background: none;
    border-top: none;
    border-left: none;
    border-right: none;
    cursor: pointer;
  }
  .link-btn:hover { color: #cc0000; border-bottom-color: #cc0000; }

  /* ---- CA DISPLAY ---- */
  .ca-display {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .ca-code {
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px;
    letter-spacing: 1px;
    color: #555;
  }
  .copy-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: #555;
    padding: 2px;
    display: flex;
    align-items: center;
    transition: color 0.2s;
  }
  .copy-btn:hover { color: #fff; }
  .copied-ok {
    font-family: 'Share Tech Mono', monospace;
    font-size: 9px;
    color: #00ff88;
    letter-spacing: 2px;
  }

  /* ---- ROTATED SIDE TEXT ---- */
  .side-text {
    position: fixed;
    top: 50%;
    right: 16px;
    transform: translateY(-50%) rotate(90deg);
    transform-origin: center center;
    font-family: 'Share Tech Mono', monospace;
    font-size: 9px;
    letter-spacing: 3px;
    color: #333;
    white-space: nowrap;
    z-index: 20;
  }

  /* ---- SUBTEXT ---- */
  .hero-sub {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(18px, 5vw, 28px);
    letter-spacing: 8px;
    font-weight: 400;
  }
  .hero-sub2 {
    font-family: 'Share Tech Mono', monospace;
    font-size: clamp(9px, 2.5vw, 12px);
    letter-spacing: 4px;
    color: #444;
    margin-top: 6px;
  }

  /* ---- HINT TEXT (second click) ---- */
  .hint-text {
    font-family: 'Share Tech Mono', monospace;
    font-size: 9px;
    letter-spacing: 2px;
    color: #cc0000;
    margin-top: 12px;
    animation: blink 1.2s step-start infinite;
  }

  /* ---- MOBILE ADJUSTMENTS ---- */
  @media (max-width: 600px) {
    .corner-tl { top: 14px; left: 12px; }
    .corner-tr { top: 14px; right: 12px; }
    .corner-bl { bottom: 14px; left: 12px; }
    .corner-br { bottom: 14px; right: 12px; }
    .side-text  { display: none; }
  }
`;

export default function App() {
  const [phase, setPhase] = useState(0); // 0=EXIT, 1=TOO_LATE, 2=redirect
  const [counter, setCounter] = useState(12483);
  const [randomMsg, setRandomMsg] = useState("");
  const [copied, setCopied] = useState(false);
  const [flash, setFlash] = useState(false);
  const styleInjected = useRef(false);

  // Inject global styles once
  useEffect(() => {
    if (styleInjected.current) return;
    styleInjected.current = true;
    const tag = document.createElement('style');
    tag.textContent = GLOBAL_STYLES;
    document.head.appendChild(tag);
  }, []);

  // Random side message
  useEffect(() => {
    setRandomMsg(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);
  }, []);

  // Counter ticks up
  useEffect(() => {
    const iv = setInterval(() => {
      setCounter(p => p + Math.floor(Math.random() * 3) + 1);
    }, 2800);
    return () => clearInterval(iv);
  }, []);

  const triggerFlash = (cb) => {
    setFlash(true);
    setTimeout(() => {
      setFlash(false);
      cb();
    }, 180);
  };

  const handleClick = () => {
    if (phase === 0) {
      triggerFlash(() => setPhase(1));
    } else if (phase === 1) {
      triggerFlash(() => {
        setPhase(2);
        setTimeout(() => window.open(JUPITER_URL, '_blank'), 200);
      });
    }
  };

  const copyCA = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const btnLabel = phase === 0 ? "EXIT" : "TOO LATE";
  const subText  = phase === 0 ? "You are not early." : "Goodbye.";
  const sub2Text = phase === 0 ? "You are the exit liquidity." : "System purge initiated.";

  return (
    <>
      {/* Flash overlay */}
      <AnimatePresence>
        {flash && (
          <motion.div
            className="flash-overlay"
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          />
        )}
      </AnimatePresence>

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#000', position: 'relative', overflow: 'hidden' }}>
        <div className="grain" />
        <div className="scanlines" />
        <div className="warning-stripe top" />
        <div className="warning-stripe bottom" />

        {/* Side rotated text */}
        <div className="side-text">{randomMsg.toUpperCase()}... [OK]</div>

        {/* Top Left */}
        <div className="status corner-tl" style={{ position: 'absolute', top: 22, left: 20, zIndex: 20 }}>
          <span className="blink" />
          <span style={{ color: '#cc0000' }}>TIME LEFT: UNKNOWN</span>
        </div>

        {/* Top Right */}
        <div className="status corner-tr" style={{ position: 'absolute', top: 22, right: 20, zIndex: 20, textAlign: 'right' }}>
          <motion.span
            key={counter}
            initial={{ opacity: 0.4, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{ color: '#cc0000' }}
          >
            {counter.toLocaleString()}
          </motion.span>
          {' '}PEOPLE<br />
          STILL THINK THEY ARE EARLY
        </div>

        {/* Main hero */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', textAlign: 'center', zIndex: 10 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>

            <motion.button
              className={`exit-btn${phase === 1 ? ' too-late' : ''}`}
              onClick={handleClick}
              whileTap={{ scale: 0.96 }}
            >
              <span className="glitch" data-text={btnLabel}>{btnLabel}</span>
            </motion.button>

            <AnimatePresence mode="wait">
              <motion.div
                key={phase}
                initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                transition={{ duration: 0.35 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <p className="hero-sub">{subText}</p>
                <p className="hero-sub2">{sub2Text}</p>
                {phase === 1 && (
                  <p className="hint-text">▶ CLICK AGAIN TO PROCEED</p>
                )}
              </motion.div>
            </AnimatePresence>

          </div>
        </main>

        {/* Bottom Left — CA */}
        <div className="status corner-bl" style={{ position: 'absolute', bottom: 22, left: 20, zIndex: 20 }}>
          <span style={{ display: 'block', color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>DEPLOYED CONTRACT:</span>
          <div className="ca-display">
            <code className="ca-code">
              {CONTRACT_ADDRESS.slice(0, 8)}...{CONTRACT_ADDRESS.slice(-8)}
            </code>
            <button className="copy-btn" onClick={copyCA} title="Copy">
              {copied
                ? <span className="copied-ok">OK</span>
                : <Copy size={12} />
              }
            </button>
          </div>
        </div>

        {/* Bottom Right — Links */}
        <div className="corner-br" style={{ position: 'absolute', bottom: 22, right: 20, zIndex: 20, display: 'flex', gap: 20, alignItems: 'center' }}>
          <a className="link-btn" href={TWITTER_URL} target="_blank" rel="noopener noreferrer">X.COM</a>
          <a className="link-btn" href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">TELEGRAM</a>
          <a className="link-btn" href={JUPITER_URL} target="_blank" rel="noopener noreferrer">BUY</a>
        </div>
      </div>
    </>
  );
}
