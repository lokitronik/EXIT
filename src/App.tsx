/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, Twitter, Send, ExternalLink, AlertTriangle } from 'lucide-react';

const MESSAGES = [
  "This won't end well",
  "You knew better",
  "Timing > belief",
  "The music is stopping",
  "Don't look back",
  "Someone has to hold the bag",
  "Slippage is your only friend"
];

const CONTRACT_ADDRESS = "ExiT111111111111111111111111111111111111111";

// EXIT Memecoin Landing Page - Provocative Minimalist Design
export default function App() {
  const [buttonText, setButtonText] = useState("EXIT");
  const [isTooLate, setIsTooLate] = useState(false);
  const [counter, setCounter] = useState(12483);
  const [randomMsg, setRandomMsg] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setRandomMsg(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);
    
    const interval = setInterval(() => {
      setCounter(prev => prev + Math.floor(Math.random() * 3));
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const handleExitClick = () => {
    if (!isTooLate) {
      setButtonText("TOO LATE");
      setIsTooLate(true);
      // Optional: Redirect after a short delay
      // setTimeout(() => window.open('https://jup.ag', '_blank'), 1000);
    } else {
      window.open('https://jup.ag', '_blank');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white selection:bg-red-600 relative overflow-hidden">
      {/* Warning Stripes */}
      <div className="warning-stripes top-0" />
      <div className="warning-stripes bottom-0" />

      {/* Status Top Left */}
      <div className="absolute top-10 left-10 status-label text-red-600 z-20">
        <span className="blinker" />
        TIME LEFT: UNKNOWN
      </div>

      {/* Status Top Right */}
      <div className="absolute top-10 right-10 status-label text-right leading-relaxed z-20">
        <span className="text-red-600">{counter.toLocaleString()}</span> PEOPLE<br />
        STILL THINK THEY ARE EARLY
      </div>

      {/* Random Message (Rotated) */}
      <div className="absolute top-1/2 right-10 -translate-y-1/2 rotate-90 origin-right status-label text-gray-600 whitespace-nowrap z-20">
        {randomMsg.toUpperCase()}... [OK]
      </div>

      {/* Main Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center p-6 text-center z-10">
        <div className="space-y-8">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleExitClick}
            className="exit-button"
            id="main-exit-button"
          >
            {buttonText}
          </motion.button>
          
          <div className="space-y-2">
            <p className="text-2xl font-light tracking-widest uppercase">
              {isTooLate ? "Goodbye." : "You are not early."}
            </p>
            <p className="font-mono text-sm text-gray-600 uppercase tracking-[4px]">
              {isTooLate ? "System purge initiated." : "You are the exit liquidity."}
            </p>
          </div>
        </div>
      </main>

      {/* Status Bottom Left */}
      <div className="absolute bottom-10 left-10 status-label z-20">
        <span className="block text-white/50 mb-1">DEPLOYED CONTRACT:</span>
        <div className="flex items-center gap-2 group">
          <code className="text-gray-400">
            {CONTRACT_ADDRESS.slice(0, 8)}...{CONTRACT_ADDRESS.slice(-8)}
          </code>
          <button 
            onClick={copyToClipboard}
            className="p-1 hover:bg-white/10 rounded transition-colors text-gray-600 hover:text-white"
            title="Copy to clipboard"
          >
            {copied ? <span className="text-[10px] font-bold text-green-500">OK</span> : <Copy size={14} />}
          </button>
        </div>
      </div>

      {/* Status Bottom Right */}
      <div className="absolute bottom-10 right-10 flex gap-5 z-20">
        <a 
          href="https://x.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="status-label text-white border-b border-white pb-0.5 hover:text-red-600 hover:border-red-600 transition-colors"
        >
          X.COM
        </a>
        <a 
          href="https://t.me" 
          target="_blank" 
          rel="noopener noreferrer"
          className="status-label text-white border-b border-white pb-0.5 hover:text-red-600 hover:border-red-600 transition-colors"
        >
          TELEGRAM
        </a>
        <a 
          href="https://jup.ag" 
          target="_blank" 
          rel="noopener noreferrer"
          className="status-label text-white border-b border-white pb-0.5 hover:text-red-600 hover:border-red-600 transition-colors"
        >
          SOLANA
        </a>
      </div>

      {/* Background Noise/Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-50" />
    </div>
  );
}
