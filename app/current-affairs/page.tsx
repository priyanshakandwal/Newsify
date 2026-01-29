"use client"

import { Header } from "@/components/Header";
import { motion } from "framer-motion";
import { Globe, Briefcase, Atom, ShieldAlert, BookOpen, Trophy } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const categories = [
    { id: "politics", name: "Politics", icon: <ShieldAlert />, color: "bg-red-500/10 text-red-500", desc: "Latest government policies and political shifts." },
    { id: "economy", name: "Economy", icon: <Briefcase />, color: "bg-emerald-500/10 text-emerald-500", desc: "Market trends, GDP growth, and fiscal updates." },
    { id: "science", name: "Science", icon: <Atom />, color: "bg-blue-500/10 text-blue-500", desc: "Space missions, AI breakthroughs, and research." },
    { id: "international", name: "International", icon: <Globe />, color: "bg-purple-500/10 text-purple-500", desc: "Global relations and foreign policy analysis." },
    { id: "exams", name: "Exams", icon: <BookOpen />, color: "bg-orange-500/10 text-orange-500", desc: "UPSC, SSC, and state-level current affairs." },
    { id: "sports", name: "Sports", icon: <Trophy />, color: "bg-yellow-500/10 text-yellow-500", desc: "Major tournaments and athlete achievements." },
];

export default function CurrentAffairsPage() {
    return (
        <main className="flex min-h-screen flex-col">
            <Header />

            <section className="container mx-auto px-4 pt-24 pb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-left mb-16"
                >
                    <h1 className="font-outfit text-5xl font-black tracking-tight mb-4">Current Affairs Hub</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl">
                        Your daily intelligence digest. Categorized, verified, and analyzed for civil services, exams, and professional insight.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map((cat, i) => (
                        <Link key={cat.id} href={`/current-affairs/${cat.id}`}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ delay: i * 0.1, type: 'spring', damping: 15 }}
                                whileHover={{ scale: 1.05, y: -10 }}
                                className="p-10 rounded-[3rem] glass border border-white/5 premium-gradient group cursor-pointer relative overflow-hidden"
                            >
                                {/* Background Glow */}
                                <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500", cat.color.split(' ')[0])} />

                                <div className={cn("h-16 w-16 rounded-3xl flex items-center justify-center mb-8 group-hover:rotate-12 transition-all duration-500 shadow-2xl", cat.color)}>
                                    {cat.icon}
                                </div>
                                <h3 className="font-outfit text-3xl font-black mb-4 tracking-tight group-hover:text-primary transition-colors">{cat.name}</h3>
                                <p className="text-white/60 mb-10 text-base leading-relaxed font-medium">{cat.desc}</p>

                                <div className="space-y-6">
                                    <div className="h-[1px] w-full bg-white/5 group-hover:bg-primary/20 transition-colors" />
                                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                                        <span className="group-hover:translate-x-2 transition-transform">Read Today's Brief</span>
                                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">Launch Pulse →</span>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Featured Insight Section */}
            <section className="container mx-auto px-4 py-20">
                <div className="p-12 rounded-[3rem] bg-primary text-primary-foreground relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
                        <Briefcase className="h-64 w-64" />
                    </div>

                    <div className="relative z-10 max-w-2xl">
                        <div className="flex items-center gap-2 mb-6 text-primary-foreground/60 uppercase text-xs font-black tracking-[0.2em]">
                            <span className="h-1 w-8 bg-primary-foreground/40 rounded-full" />
                            Insight of the Day
                        </div>
                        <h2 className="font-outfit text-4xl md:text-5xl font-bold mb-8 leading-tight">
                            Understanding the Digital Personal Data Protection Act (DPDP) 2026.
                        </h2>
                        <p className="text-primary-foreground/70 text-lg mb-10">
                            How the latest legislation reshapes privacy for 1.4 billion citizens and the impact on the burgeoning tech sector.
                        </p>
                        <button className="px-10 py-4 rounded-full bg-white text-primary font-black hover:bg-white/90 transition-all shadow-2xl">
                            Read Analysis
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
}
