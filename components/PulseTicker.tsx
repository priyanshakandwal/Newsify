"use client"

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Cloud, Zap, ArrowUpRight, ArrowDownRight, Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";

export function PulseTicker() {
    const [stats, setStats] = useState<any[]>([]);

    useEffect(() => {
        const generateDailyStats = () => {
            const today = new Date();
            const dateStr = today.toLocaleDateString('en-CA'); // YYYY-MM-DD
            const seed = dateStr.split('-').reduce((acc, val) => acc + parseInt(val), 0);

            // Deterministic "Daily" Base Values
            const baseSensex = 72000 + (seed % 1000);
            const baseNifty = 21000 + (seed % 500);
            const baseBtc = 40000 + (seed % 5000);

            return [
                { label: "Daily News Sync", value: "ACTIVE", change: "100%", up: true, icon: <Newspaper className="h-4 w-4" /> },
                { label: "SENSEX", value: (baseSensex + 10.38).toFixed(2), change: "+1.24%", up: true, icon: <TrendingUp className="h-4 w-4" /> },
                { label: "NIFTY 50", value: (baseNifty + 20.80).toFixed(2), change: "+0.8%", up: true, icon: <Zap className="h-4 w-4" /> },
                { label: "USD/INR", value: (83.12 + (seed % 5) / 100).toFixed(2), change: "-0.05", up: false, icon: <TrendingUp className="h-4 w-4 rotate-180" /> },
                { label: "BTC/USDT", value: `$${(baseBtc + 210).toLocaleString()}`, change: "+4.5%", up: true, icon: <Zap className="h-4 w-4" /> },
                { label: "WEATHER", value: `${18 + (seed % 12)}°C Delhi`, change: seed % 2 === 0 ? "Sunny" : "Cloudy", up: true, icon: <Cloud className="h-4 w-4" /> },
                { label: "GOLD", value: `₹${(62000 + (seed % 1000)).toLocaleString()}`, change: "+0.3%", up: true, icon: <TrendingUp className="h-4 w-4" /> },
            ];
        };

        setStats(generateDailyStats());

        // Real-time fluctuation for 'Live' feel
        const interval = setInterval(() => {
            setStats(prev => prev.map(s => {
                if (s.label === "Daily News Sync" || s.label === "WEATHER") return s;
                const numericValue = parseFloat(s.value.replace(/[$,₹,]/g, ''));
                if (isNaN(numericValue)) return s;

                const nudge = (Math.random() - 0.5) * 2;
                const newVal = (numericValue + nudge).toFixed(2);

                return {
                    ...s,
                    value: s.value.startsWith('$') ? `$${parseFloat(newVal).toLocaleString()}` :
                        s.value.startsWith('₹') ? `₹${parseFloat(newVal).toLocaleString()}` : newVal
                };
            }));
        }, 15000);

        return () => clearInterval(interval);
    }, []);

    if (stats.length === 0) return null;

    return (
        <div className="w-full bg-[#050505] border-y border-white/5 py-3 overflow-hidden whitespace-nowrap relative select-none">
            {/* Left/Right Overlays for smooth fade */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#050505] to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#050505] to-transparent z-10" />

            <motion.div
                animate={{ x: [0, -1035] }} // Adjusted for 2 repeats
                transition={{
                    repeat: Infinity,
                    duration: 25,
                    ease: "linear"
                }}
                className="inline-flex gap-12 items-center px-12 will-change-transform"
            >
                {[...stats, ...stats].map((stat, i) => (
                    <div key={i} className="flex items-center gap-4 group">
                        <div className={cn(
                            "flex items-center justify-center p-1.5 rounded-lg border transition-all duration-500",
                            stat.up ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500/20" : "bg-red-500/10 border-red-500/20 text-red-400 group-hover:bg-red-500/20"
                        )}>
                            {stat.icon}
                        </div>

                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-white transition-colors">
                                {stat.label}
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="font-outfit font-bold text-sm tracking-tighter text-white">
                                    {stat.value}
                                </span>
                                <span className={cn(
                                    "flex items-center text-[10px] font-black",
                                    stat.up ? "text-emerald-400" : "text-red-400"
                                )}>
                                    {stat.up ? <ArrowUpRight className="h-2 w-2" /> : <ArrowDownRight className="h-2 w-2" />}
                                    {stat.change}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
