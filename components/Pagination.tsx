"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    return (
        <div className="flex items-center justify-center gap-0 mt-4">
            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="h-10 w-10 border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-200"
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1 mx-2">
                <span className="text-sm font-medium text-zinc-400">Page</span>
                <span className="text-sm font-bold text-white border border-zinc-800 bg-zinc-900 px-3 py-1 rounded-md min-w-[2.5rem] text-center">
                    {currentPage}
                </span>
                <span className="text-sm font-medium text-zinc-400">of {totalPages}</span>
            </div>

            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="h-10 w-10 border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-200"
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
}
