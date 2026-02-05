"use client";

import React, { useEffect, useRef, useState } from "react";
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

    // Dynamic team score system
    const [currentTeam, setCurrentTeam] = useState<number>(1);
    const [teamScores, setTeamScores] = useState<Record<number, number>>({});
    const [finishedTeams, setFinishedTeams] = useState<Set<number>>(new Set());
    // Tracks which (team, character) combinations have already been counted
    const pickedKeysRef = useRef<Set<string>>(new Set());

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

    const getCharacterScore = (char: Character) => char.avgRating; // use star rating as score

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
                                onClick={() => {
                                    // Toggle front/back when the big card is clicked
                                    setIsRevealed((prev) => !prev);
                                }}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative z-10 max-w-5xl mx-auto space-y-8 my-10">
                <header className="flex flex-col items-center gap-4 mb-6 text-center">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter bg-gradient-to-b from-yellow-300 via-orange-400 to-red-600 bg-clip-text text-transparent uppercase font-[family-name:var(--font-geist-mono)] drop-shadow-[0_2px_10px_rgba(255,100,0,0.5)]">
                        Anime<span className="text-white">Auction</span>
                    </h1>
                </header>

                {/* DYNAMIC TEAM SCORE PANEL */}
                <section className="relative z-10 bg-black/50 border border-white/10 rounded-2xl p-4 md:p-6 shadow-xl backdrop-blur-md space-y-4">
                    <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h2 className="text-xl md:text-2xl font-semibold text-white">
                                Team scores
                            </h2>
                            <p className="text-xs md:text-sm text-zinc-400 mt-1">
                                Pick a team number, then click cards to add their power to that team.
                                When you&apos;re done, finish that team and move to the next.
                            </p>
                        </div>

                        <div className="flex flex-col items-start gap-2">
                            <label className="text-xs text-zinc-300">
                                Current team number
                            </label>
                            <input
                                type="number"
                                min={1}
                                value={currentTeam}
                                onChange={(e) => {
                                    const raw = e.target.value;
                                    let value = parseInt(raw || "1", 10);
                                    if (isNaN(value) || value <= 0) value = 1;
                                    setCurrentTeam(value);
                                }}
                                className="w-24 rounded-md bg-zinc-900/80 border border-zinc-700/60 px-3 py-1.5 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    // reset all teams and start again from team 1
                                    setTeamScores({});
                                    setFinishedTeams(new Set());
                                    pickedKeysRef.current = new Set();
                                    setCurrentTeam(1);
                                }}
                                className="inline-flex items-center justify-center rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-medium px-3 py-1 text-xs border border-zinc-600/60"
                            >
                                Restart all teams
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="flex flex-wrap gap-2">
                            {Object.keys(teamScores)
                                .map(Number)
                                .sort((a, b) => a - b)
                                .map((teamNumber) => {
                                    const isActive = teamNumber === currentTeam;
                                    return (
                                        <button
                                            key={teamNumber}
                                            type="button"
                                            onClick={() => {
                                                setCurrentTeam(teamNumber);
                                            }}
                                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                                                isActive
                                                    ? "bg-orange-500 text-white border-orange-400 shadow-lg shadow-orange-500/30"
                                                    : "bg-zinc-900/80 text-zinc-300 border-zinc-700 hover:bg-zinc-800"
                                            }`}
                                        >
                                            Team {teamNumber}
                                        </button>
                                    );
                                })}
                        </div>

                        <div className="flex flex-col items-start gap-2">
                            <div className="text-sm text-zinc-200">
                                Current team score:{" "}
                                <span className="font-semibold text-orange-300">
                                    {teamScores[currentTeam]?.toFixed?.(2) ?? "0.00"}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setFinishedTeams((prev) => {
                                        const next = new Set(prev);
                                        next.add(currentTeam);
                                        return next;
                                    });
                                }}
                                className="inline-flex items-center justify-center rounded-md bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-1.5 text-xs shadow-lg shadow-green-600/40"
                            >
                                Finish this team
                            </button>
                            {finishedTeams.has(currentTeam) && (
                                <div className="text-xs text-green-300">
                                    Team {currentTeam} final score:{" "}
                                    <span className="font-semibold">
                                        {teamScores[currentTeam]?.toFixed?.(2) ?? "0.00"}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="overflow-x-auto border-t border-zinc-800/60 pt-3 mt-2">
                        <table className="min-w-full text-xs text-zinc-100">
                            <thead>
                                <tr className="border-b border-zinc-800/60">
                                    <th className="text-left py-1.5 pr-4 font-medium text-zinc-400">
                                        Team
                                    </th>
                                    <th className="text-left py-1.5 pr-4 font-medium text-zinc-400">
                                        Total score
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys(teamScores).length === 0 ? (
                                    <tr>
                                        <td className="py-1.5 pr-4 text-zinc-500" colSpan={2}>
                                            No teams yet. Enter a team number and start picking cards.
                                        </td>
                                    </tr>
                                ) : (
                                    Object.keys(teamScores)
                                        .map(Number)
                                        .sort((a, b) => a - b)
                                        .map((teamNumber) => (
                                            <tr
                                                key={teamNumber}
                                                className={`border-b border-zinc-900/60 last:border-0 ${
                                                    teamNumber === currentTeam ? "bg-zinc-900/60" : ""
                                                }`}
                                            >
                                                <td className="py-1.5 pr-4">
                                                    Team {teamNumber}
                                                </td>
                                                <td className="py-1.5 pr-4">
                                                    {teamScores[teamNumber]?.toFixed?.(2) ?? "0.00"}
                                                </td>
                                            </tr>
                                        ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                <main className={`transition-all duration-500 ${selectedCharacter ? 'scale-95 pointer-events-none' : ''}`}>
                    <Catalog
                        characters={visibleCharacters}
                        onSelect={(char) => {
                            // When you click a card in the catalog:
                            // 1) add its score to the current team (once per team per card)
                            // 2) open the overlay so you can see details
                            const key = `${currentTeam}:${char.name}`;

                            // Do not score further if this team is already finished
                            if (!finishedTeams.has(currentTeam) && !pickedKeysRef.current.has(key)) {
                                pickedKeysRef.current.add(key);

                                const score = getCharacterScore(char);
                                setTeamScores((prevScores) => ({
                                    ...prevScores,
                                    [currentTeam]: (prevScores[currentTeam] ?? 0) + score,
                                }));
                            }

                            setSelectedCharacter(char);
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
