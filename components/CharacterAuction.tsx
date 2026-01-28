"use client";

import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { Character } from "@/lib/types";
import { Catalog } from "@/components/Catalog";
import { Card } from "@/components/Card";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import { MagicCircle } from "@/components/MagicCircle";

export function CharacterAuction() {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
    const [isRevealed, setIsRevealed] = useState(false);
    const [revealedNames, setRevealedNames] = useState<Set<string>>(new Set());

    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 6;

    useEffect(() => {
        const fetchCharacters = async () => {
            try {
                const response = await fetch("/chars.csv");
                const reader = response.body?.getReader();
                const result = await reader?.read();
                const decoder = new TextDecoder("utf-8");
                const csv = decoder.decode(result?.value);

                Papa.parse(csv, {
                    header: true,
                    complete: (results) => {
                        const parsedCharacters: Character[] = results.data
                            .filter((row: any) => row.NAME)
                            .map((row: any) => ({
                                name: row.NAME,
                                strength: parseFloat(row.STRENGTH) || 0,
                                stamina: parseFloat(row.STAMINA) || 0,
                                dexterity: parseFloat(row.DEXTERITY) || 0,
                                intelligence: parseFloat(row.INTELLIGENCE) || 0,
                                magic: parseFloat(row.MAGIC) || 0,
                                anime: row.ANIME,
                                avgRating: ((parseFloat(row.STRENGTH) || 0) + (parseFloat(row.STAMINA) || 0) + (parseFloat(row.DEXTERITY) || 0) + (parseFloat(row.INTELLIGENCE) || 0) + (parseFloat(row.MAGIC) || 0)) / 5,
                            }));
                        setCharacters(parsedCharacters);
                        setLoading(false);
                    },
                });
            } catch (error) {
                console.error("Error fetching CSV:", error);
                setLoading(false);
            }
        };

        fetchCharacters();
    }, []);

    // Control whether the selected card shows its front (image + stats)
    useEffect(() => {
        if (!selectedCharacter) {
            setIsRevealed(false);
        }
    }, [selectedCharacter]);

    const totalPages = Math.ceil(characters.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const visibleCharacters = characters.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handleCloseOverlay = () => {
        if (selectedCharacter) {
            setRevealedNames(prev => new Set(prev).add(selectedCharacter.name));
        }
        setSelectedCharacter(null);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen text-white bg-zinc-950">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-t-blue-500 rounded-full border-zinc-700"
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-zinc-100 p-4 font-sans relative overflow-hidden">
            {/* ANIMATED BACKGROUND LAYER */}
            <div className="fixed inset-0 z-0">
                {/* Static Base Image */}
                <Image
                    src="/mystic_bg.webp"
                    alt="Background"
                    fill
                    className="object-cover opacity-60 mix-blend-color-dodge"
                    priority
                />

                {/* Overlay Gradient for Fade */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80" />

                {/* Animated Magic Circles */}
                <MagicCircle className="top-[-20%] left-[-10%] w-[800px] h-[800px] text-blue-500/20" duration={60} />
                <MagicCircle className="bottom-[-20%] right-[-10%] w-[800px] h-[800px] text-purple-500/20" duration={50} reverse />
                <MagicCircle className="top-[30%] right-[10%] w-[300px] h-[300px] text-orange-500/20" duration={30} />
            </div>

            <AnimatePresence>
                {selectedCharacter && (
                    <motion.div
                        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
                        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        onClick={handleCloseOverlay}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
                    >
                        {/* FIXED CLOSE BUTTON */}
                        <motion.button
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCloseOverlay();
                            }}
                            className="fixed top-6 right-6 p-4 bg-zinc-800/80 hover:bg-zinc-700 text-white rounded-full z-[60] backdrop-blur-md border border-white/10 shadow-lg cursor-pointer group"
                        >
                            <X className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
                        </motion.button>

                        <motion.div
                            initial={{ scale: 0.5, rotateY: 90, opacity: 0 }}
                            animate={{ scale: 1, rotateY: 0, opacity: 1 }}
                            exit={{ scale: 0.5, rotateY: 90, opacity: 0 }}
                            transition={{
                                type: "spring",
                                damping: 15,
                                stiffness: 100,
                                mass: 1,
                                delay: 0.1
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative perspective-1000"
                        >
                            <Card
                                character={selectedCharacter}
                                isRevealed={isRevealed}
                                isOverlay={true}
                                className="scale-125 md:scale-150 shadow-[0_0_80px_rgba(59,130,246,0.2)]"
                                onClick={(e) => {
                                    // Toggle front/back when the big card is clicked
                                    e?.stopPropagation?.();
                                    setIsRevealed((prev) => !prev);
                                }}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative z-10 max-w-5xl mx-auto space-y-0 my-10">
                <header className="flex flex-col items-center gap-4 mb-6 text-center">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter bg-gradient-to-b from-yellow-300 via-orange-400 to-red-600 bg-clip-text text-transparent uppercase font-[family-name:var(--font-geist-mono)] drop-shadow-[0_2px_10px_rgba(255,100,0,0.5)]">
                        Anime<span className="text-white">Auction</span>
                    </h1>

                </header>

                <main className={`transition-all duration-500 ${selectedCharacter ? 'scale-95 pointer-events-none' : ''}`}>
                    <Catalog
                        characters={visibleCharacters}
                        onSelect={(char) => {
                            setSelectedCharacter(char);
                            // Immediately show front (image + stats) for selected card
                            setIsRevealed(true);
                        }}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        revealedNames={revealedNames}
                    />
                </main>
            </div>
        </div>
    );
}
