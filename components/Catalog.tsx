"use client";

import { Character } from "@/lib/types";
import { Card } from "@/components/Card";
import { Pagination } from "@/components/Pagination";
import { motion } from "framer-motion";

interface CatalogProps {
    characters: Character[];
    onSelect: (character: Character) => void;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function Catalog({ characters, onSelect, currentPage, totalPages, onPageChange }: CatalogProps) {

    return (
        <div className="space-y-4 flex flex-col items-center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-14 relative z-0">
                {characters.map((char) => (
                    <motion.div
                        key={char.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        onClick={() => onSelect(char)}
                    >
                        <Card
                            character={char}
                            className="hover:scale-105 transition-transform duration-300"
                        />
                    </motion.div>
                ))}
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
            />
        </div>
    );
}
