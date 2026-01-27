"use client";

import { motion } from "framer-motion";

export function MagicCircle({ className = "", duration = 20, reverse = false }: { className?: string, duration?: number, reverse?: boolean }) {
    return (
        <motion.div
            animate={{ rotate: reverse ? -360 : 360 }}
            transition={{ duration: duration, repeat: Infinity, ease: "linear" }}
            className={`absolute opacity-20 pointer-events-none ${className}`}
        >
            <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-current">
                <circle cx="50" cy="50" r="48" strokeWidth="0.5" />
                <circle cx="50" cy="50" r="40" strokeWidth="0.5" />
                <path d="M50 2 A48 48 0 0 1 98 50" strokeWidth="1" strokeDasharray="4 2" />
                <path d="M50 98 A48 48 0 0 1 2 50" strokeWidth="1" strokeDasharray="4 2" />

                {/* Runes / decorative marks */}
                <path d="M50 10 L50 20 M50 80 L50 90 M10 50 L20 50 M80 50 L90 50" strokeWidth="2" />
                <path d="M21 21 L28 28 M72 72 L79 79 M21 79 L28 72 M72 28 L79 21" strokeWidth="2" />

                <circle cx="50" cy="50" r="30" strokeWidth="0.2" strokeDasharray="2 1" />
                <rect x="35" y="35" width="30" height="30" rx="2" strokeWidth="0.5" transform="rotate(45 50 50)" />
            </svg>
        </motion.div>
    );
}
