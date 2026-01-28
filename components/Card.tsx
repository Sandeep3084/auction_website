"use client";

import React, { useMemo, useRef } from "react";
import { Character, Attribute } from "@/lib/types";
import { Star, Swords, Zap, Activity, Brain, Sparkles } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

interface CardProps {
    character: Character;
    isRevealed?: boolean;
    onClick?: () => void;
    className?: string;
    isOverlay?: boolean;
}

const ATTRIBUTE_ICONS: Record<Attribute, React.ElementType> = {
    strength: Swords,
    stamina: Activity,
    dexterity: Zap,
    intelligence: Brain,
    magic: Sparkles,
};

const ATTRIBUTES: Attribute[] = ["strength", "stamina", "dexterity", "intelligence", "magic"];

const formatStatLabel = (key: string) => {
    const map: Record<string, string> = {
        strength: "STR",
        stamina: "STA",
        dexterity: "DEX",
        intelligence: "INT",
        magic: "MAG"
    };
    return map[key] || key.substring(0, 3).toUpperCase();
};

function CardComponent({ character, isRevealed = false, onClick, className = "", isOverlay = false }: CardProps) {
    const contentRef = useRef<HTMLDivElement | null>(null);
    const rafRef = useRef<number | null>(null);

    const imagePath = useMemo(
        () => `/images/${character.name.toLowerCase().replace(/ /g, "_")}.webp`,
        [character.name]
    );

    const { isGold, isHolo } = useMemo(() => {
        const maxStat = Math.max(
            character.strength,
            character.stamina,
            character.dexterity,
            character.intelligence,
            character.magic
        );

        return {
            isGold: maxStat === 5,
            isHolo: character.avgRating >= 4,
        };
    }, [
        character.strength,
        character.stamina,
        character.dexterity,
        character.intelligence,
        character.magic,
        character.avgRating,
    ]);

    // MASSIVE BURST PARTICLES (memoized so we don't regenerate on every render)
    const particles = useMemo(
        () =>
            Array.from({ length: 40 }).map((_, i) => ({
                id: i,
                angle: (Math.random() * 360) * (Math.PI / 180),
                distance: 200 + Math.random() * 250,
                delay: Math.random() * 0.2,
                size: Math.random() * 6 + 3,
                duration: 0.6 + Math.random() * 0.8,
            })),
        []
    );

    return (
        <div
            className={`tcg-card cursor-pointer group ${isRevealed ? "flipped" : ""} ${isOverlay && !isRevealed ? "locked-hover" : ""} ${className}`}
            onClick={onClick}
            onPointerMove={(e) => {
                // Ignore touch (scroll), but allow trackpad/mouse/pen
                if (e.pointerType === "touch") return;
                const el = contentRef.current;
                if (!el) return;
                if (rafRef.current) cancelAnimationFrame(rafRef.current);

                rafRef.current = requestAnimationFrame(() => {
                    const rect = el.getBoundingClientRect();
                    const px = (e.clientX - rect.left) / rect.width; // 0..1
                    const py = (e.clientY - rect.top) / rect.height; // 0..1

                    // Center around 0, clamp, and convert to degrees
                    const dx = Math.max(-0.5, Math.min(0.5, px - 0.5));
                    const dy = Math.max(-0.5, Math.min(0.5, py - 0.5));

                    // "Tilt toward the cursor" (stronger): bottom pulls toward viewer, right pulls toward viewer
                    const tiltX = `${(-dy * 26).toFixed(2)}deg`;
                    const tiltY = `${(-dx * 34).toFixed(2)}deg`;

                    el.style.setProperty("--tiltX", tiltX);
                    el.style.setProperty("--tiltY", tiltY);
                });
            }}
            onMouseMove={(e) => {
                // Fallback for environments where pointer events are flaky/disabled
                const el = contentRef.current;
                if (!el) return;
                if (rafRef.current) cancelAnimationFrame(rafRef.current);

                rafRef.current = requestAnimationFrame(() => {
                    const rect = el.getBoundingClientRect();
                    const px = (e.clientX - rect.left) / rect.width; // 0..1
                    const py = (e.clientY - rect.top) / rect.height; // 0..1

                    const dx = Math.max(-0.5, Math.min(0.5, px - 0.5));
                    const dy = Math.max(-0.5, Math.min(0.5, py - 0.5));

                    const tiltX = `${(-dy * 26).toFixed(2)}deg`;
                    const tiltY = `${(-dx * 34).toFixed(2)}deg`;

                    el.style.setProperty("--tiltX", tiltX);
                    el.style.setProperty("--tiltY", tiltY);
                });
            }}
            onPointerLeave={() => {
                const el = contentRef.current;
                if (!el) return;
                if (rafRef.current) cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
                el.style.setProperty("--tiltX", "0deg");
                el.style.setProperty("--tiltY", "0deg");
            }}
            onMouseLeave={() => {
                const el = contentRef.current;
                if (!el) return;
                if (rafRef.current) cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
                el.style.setProperty("--tiltX", "0deg");
                el.style.setProperty("--tiltY", "0deg");
            }}
        >
            <div ref={contentRef} className="tcg-content relative">
                {/* BACK FACE */}
                <div className="tcg-back">
                    <div className="tcg-back-content overflow-hidden rounded-[10px]">
                        <div className="absolute inset-0 opacity-20">
                            <Image src="/images/animania.webp" alt="Back" fill className="object-cover grayscale" />
                        </div>

                        <div className="z-10 text-center p-4">
                            <h3 className={`${character.anime.length > 20 ? "text-base leading-tight" : "text-xl leading-normal"} font-black bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 bg-clip-text text-transparent uppercase tracking-widest drop-shadow-sm`}>
                                {character.anime}
                            </h3>

                            <div className="flex items-center justify-center gap-1.5 mt-2 mb-1">
                                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                <span className="text-white font-bold font-mono text-sm">{character.avgRating.toFixed(2)}</span>
                            </div>
                            {!isOverlay && (
                                <span className="text-xs text-zinc-400 mt-3 block font-bold border border-zinc-700/50 px-3 py-1.5 rounded-full bg-zinc-950/80 tracking-widest">
                                    TAP TO REVEAL
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* FRONT FACE */}
                <div className={`tcg-front ${isGold && isRevealed ? "gold-flair" : ""} ${isHolo && isRevealed ? "holo-flair" : ""}`}>
                    <div className="img">
                        <Image src={imagePath} alt={character.name} fill className="object-cover" priority={isOverlay} />

                        <div className="circle"></div>
                        <div className="circle" id="right"></div>
                        <div className="circle" id="bottom"></div>
                    </div>

                    {/* Holographic foil overlay (CSS does the heavy lifting) */}
                    {(isGold || isHolo) && isRevealed && <div className="tcg-holo-overlay" />}

                    <div className="tcg-front-content">
                        <div className="flex justify-between items-start w-full">
                            <small className="badge flex items-center gap-1.5 text-xs font-bold text-white shadow-lg border-yellow-500/30">
                                <Star className={`w-3 h-3 ${(isGold || isHolo) ? 'text-yellow-300 fill-yellow-300 animate-pulse' : 'text-zinc-400'}`} />
                                {character.avgRating.toFixed(2)}
                            </small>


                        </div>

                        {/* COMPACTED DESCRIPTION */}
                        <div className="tcg-description !p-2 !backdrop-blur-xl !bg-black/70 border-t border-white/10">
                            <div className="tcg-title mb-1.5">
                                <p className="font-black text-white text-sm capitalize tracking-tight drop-shadow-md leading-tight">
                                    {character.name}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[9px] text-zinc-400 font-mono">
                                {ATTRIBUTES.map((attr) => (
                                    <div key={attr} className="flex justify-start gap-3 items-center group/stat">
                                        <span className="uppercase font-bold text-zinc-500 group-hover/stat:text-zinc-300 transition-colors w-6">
                                            {formatStatLabel(attr)}
                                        </span>
                                        <span className={`font-bold ${character[attr] >= 4 ? 'text-yellow-400' : 'text-zinc-100'}`}>
                                            {character[attr]}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {(isGold || isHolo) && isRevealed && (
                    <div
                        className="sparkle-container absolute inset-0 overflow-visible pointer-events-none z-50"
                        style={{ transform: "rotateY(180deg) translateZ(2px)" }}
                    >
                        {particles.map((p) => (
                            <motion.div
                                key={p.id}
                                initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                                animate={{
                                    x: Math.cos(p.angle) * p.distance,
                                    y: Math.sin(p.angle) * p.distance,
                                    scale: [0, 1.5, 0],
                                    opacity: [1, 1, 0]
                                }}
                                transition={{
                                    duration: p.duration,
                                    ease: "easeOut",
                                    delay: p.delay,
                                }}
                                className="absolute top-1/2 left-1/2 bg-yellow-300 rounded-full shadow-[0_0_10px_4px_rgba(255,215,0,0.8)]"
                                style={{ width: p.size, height: p.size }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export const Card = React.memo(CardComponent);
