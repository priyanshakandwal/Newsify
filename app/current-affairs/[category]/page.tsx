"use client"

import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { motion } from "framer-motion";
import { ChevronLeft, TrendingUp, Calendar, Newspaper } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const mockNewsByCategory: Record<string, any[]> = {
    politics: [
        { id: 1, title: "Major Cabinet Reshuffle Expected Next Week", date: "Jan 28, 2026", source: "The Hindu", summary: "High-level meetings at the PMO suggest a significant change in key portfolios.", image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?q=80&w=2070" },
        { id: 2, title: "New Election Reform Bill Tabled in Parliament", date: "Jan 27, 2026", source: "Indian Express", summary: "The bill aims to modernize the voting process with blockchain technology.", image: "https://images.unsplash.com/photo-1540910419892-f0c962a5b06d?q=80&w=2070" },
    ],
    economy: [
        { id: 3, title: "RBI Keeps Interest Rates Unchanged", date: "Jan 28, 2026", source: "Mint", summary: "The central bank maintains its stance to control inflation while supporting growth.", image: "https://images.unsplash.com/photo-1526303328184-9758f578c218?q=80&w=2070" },
        { id: 4, title: "Tech Sector Sees 15% Growth in Q3", date: "Jan 26, 2026", source: "Business Standard", summary: "AI and cloud services lead the recovery in the IT services exports.", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070" },
    ],
    science: [
        { id: 5, title: "ISRO Successfully Launches Deep Space Probe", date: "Jan 28, 2026", source: "ISRO Official", summary: "The mission aims to study the asteroid belt for rare minerals.", image: "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?q=80&w=2070" },
    ],
    international: [
        { id: 6, title: "Global Summit on Climate Action Concludes", date: "Jan 28, 2026", source: "The Guardian", summary: "World leaders agree on a new timeline for carbon neutrality.", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070" },
    ],
    sports: [
        { id: 7, title: "India Clinches Thrilling Victory in Test Match", date: "Jan 28, 2026", source: "Cricinfo", summary: "A spectacular last-minute performance leads to a historic win.", image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=2070" },
    ],
    exams: [
        { id: 8, title: "UPSC Prelims Notification Released", date: "Jan 28, 2026", source: "PIB", summary: "The official notification for the 2026 examination is now out for aspirants.", image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070" },
        { id: 9, title: "New Pattern for State Service Exams", date: "Jan 27, 2026", source: "Employment News", summary: "State commission announces changes in the descriptive paper structure.", image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2070" },
    ],
};

const categoryUrls: Record<string, string> = {
    politics: "https://www.thehindu.com/news/national/",
    economy: "https://www.thehindu.com/business/economy/",
    science: "https://www.thehindu.com/sci-tech/science/",
    international: "https://www.thehindu.com/news/international/",
    sports: "https://www.thehindu.com/sport/",
    exams: "https://www.thehindu.com/news/national/"
};

// Category Pop Colors
const categoryStyles: Record<string, { gradient: string, blob: string, text: string }> = {
    politics: {
        gradient: "from-orange-600/20 via-red-600/10 to-transparent",
        blob: "bg-red-500/20",
        text: "text-red-400"
    },
    economy: {
        gradient: "from-emerald-600/20 via-cyan-600/10 to-transparent",
        blob: "bg-emerald-500/20",
        text: "text-emerald-400"
    },
    science: {
        gradient: "from-blue-600/20 via-indigo-600/10 to-transparent",
        blob: "bg-blue-500/20",
        text: "text-blue-400"
    },
    international: {
        gradient: "from-purple-600/20 via-fuchsia-600/10 to-transparent",
        blob: "bg-fuchsia-500/20",
        text: "text-fuchsia-400"
    },
    exams: {
        gradient: "from-amber-600/20 via-orange-600/10 to-transparent",
        blob: "bg-amber-500/20",
        text: "text-amber-400"
    },
    sports: {
        gradient: "from-lime-600/20 via-yellow-600/10 to-transparent",
        blob: "bg-lime-500/20",
        text: "text-lime-400"
    },
};

export default function CategoryPage() {
    const params = useParams();
    const router = useRouter();
    const category = Array.isArray(params.category) ? params.category[0] : (params.category || "politics");
    const style = categoryStyles[category] || categoryStyles.politics;

    const [news, setNews] = useState<any[]>([]);
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        if (category) {
            fetchCategoryNews();
        }
    }, [category]);

    const fetchCategoryNews = async () => {
        setIsFetching(true);
        try {
            const url = categoryUrls[category || ""] || categoryUrls.politics;
            const res = await fetch(`/api/fetch-news?url=${encodeURIComponent(url)}&t=${Date.now()}`);
            const data = await res.json();

            if (data.articles && data.articles.length > 0) {
                const dynamicNews = data.articles.map((art: any, idx: number) => ({
                    id: `active-${category}-${idx}`,
                    title: art.title,
                    summary: art.summary,
                    source: "Live Sync",
                    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
                    fullContent: art.summary,
                    url: art.link
                }));
                setNews(dynamicNews);
            } else {
                setNews(mockNewsByCategory[category] || []);
            }
        } catch (err) {
            console.error("Failed to fetch category news:", err);
            setNews(mockNewsByCategory[category] || []);
        } finally {
            setIsFetching(false);
        }
    };

    return (
        <main className="flex min-h-screen flex-col bg-[#050505] selection:bg-primary/30 text-white">
            <Header />

            <div className="container mx-auto px-4 pt-24 pb-12">
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white mb-8 transition-colors group px-6 py-2.5 rounded-full border border-white/5 bg-white/5 w-fit shadow-2xl backdrop-blur-3xl"
                >
                    <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Universe
                </motion.button>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-20 relative"
                >
                    <div className={cn("flex items-center gap-3 mb-6", style.text)}>
                        <TrendingUp className="h-6 w-6 animate-bounce" />
                        <span className="text-xs font-black uppercase tracking-[0.5em] opacity-80">Quantum Intelligence Briefing</span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div>
                            <h1 className="font-outfit text-7xl md:text-9xl font-black capitalize tracking-tight mb-4 leading-[0.8]">
                                {category}
                                <span className={style.text}>.</span>
                            </h1>
                            <p className="text-white/60 text-xl max-w-2xl font-medium tracking-tight mt-6">
                                Live-synced abstract visual intelligence for <span className="text-white">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}.</span>
                            </p>
                        </div>

                        {isFetching && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={cn("flex items-center gap-4 px-8 py-4 rounded-[2rem] border backdrop-blur-2xl shadow-[0_0_50px_-10px_rgba(255,255,255,0.1)]", style.blob, "border-white/10")}
                            >
                                <motion.div
                                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className={cn("h-6 w-6 border-4 border-t-transparent rounded-full", style.text.replace('text-', 'border-'))}
                                />
                                <span className="text-xs font-black uppercase tracking-widest">Warping Data...</span>
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {news.map((item, i) => (
                        <Link
                            key={item.id}
                            href={`/read/live?title=${encodeURIComponent(item.title)}&content=${encodeURIComponent(item.fullContent || item.summary)}`}
                            className="block group"
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ delay: i * 0.1, type: 'spring', damping: 15 }}
                                className="relative h-[600px] rounded-[4rem] overflow-hidden border border-white/5 bg-zinc-950/40 backdrop-blur-3xl transition-all hover:border-white/20 hover:shadow-[0_0_100px_-20px_rgba(255,255,255,0.1)] flex flex-col group"
                            >
                                {/* Abstract Animated Background */}
                                <div className={cn("absolute inset-0 z-0 bg-gradient-to-br transition-all duration-700 group-hover:scale-110", style.gradient)}>
                                    <motion.div
                                        animate={{
                                            x: [0, 100, -50, 0],
                                            y: [0, -50, 50, 0],
                                            scale: [1, 1.2, 0.8, 1]
                                        }}
                                        transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                                        className={cn("absolute top-[-20%] left-[-10%] w-[300px] h-[300px] rounded-full mix-blend-screen blur-[80px] opacity-40", style.blob)}
                                    />
                                    <motion.div
                                        animate={{
                                            x: [0, -80, 100, 0],
                                            y: [0, 80, -40, 0],
                                            scale: [1, 0.9, 1.3, 1]
                                        }}
                                        transition={{ repeat: Infinity, duration: 20, ease: "linear", delay: 2 }}
                                        className={cn("absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full mix-blend-screen blur-[100px] opacity-30", style.blob)}
                                    />

                                    {/* Grainy Texture overlay */}
                                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                                </div>

                                {/* Content Section */}
                                <div className="relative z-10 flex flex-col h-full p-10 md:p-12">
                                    <div className="flex items-center justify-between">
                                        <div />
                                        <div className="flex items-center gap-2">
                                            <div className={cn("h-2.5 w-2.5 rounded-full animate-pulse shadow-[0_0_15px]", style.blob.replace('bg-', 'shadow-'))} />
                                        </div>
                                    </div>

                                    <div className="mt-auto space-y-8">
                                        <div className={cn("flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em]", style.text)}>
                                            <Calendar className="h-4 w-4" />
                                            Active Stream • {item.date}
                                        </div>
                                        <h2 className="font-outfit text-4xl md:text-5xl font-black group-hover:text-white transition-colors line-clamp-3 leading-[1] tracking-tighter">
                                            {item.title}
                                        </h2>
                                        <p className="text-white/40 leading-relaxed text-base font-medium line-clamp-3 group-hover:text-white/70 transition-colors">
                                            {item.summary}
                                        </p>

                                        <div className="flex items-center justify-between pt-4">
                                            <div className="flex items-center gap-6">
                                                <div className={cn("h-14 w-14 rounded-[2rem] border border-white/10 flex items-center justify-center bg-white/5 transition-all group-hover:rotate-[360deg] group-hover:scale-110", style.text)}>
                                                    <span className="text-2xl font-black">→</span>
                                                </div>
                                                <span className="text-[12px] font-black uppercase tracking-[0.4em] text-white/30 group-hover:text-white transition-colors">Warp to Article</span>
                                            </div>

                                            <div className={cn("px-6 py-3 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 backdrop-blur-xl", style.text)}>
                                                AI Sync Perfected
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}

                    {news.length === 0 && !isFetching && (
                        <div className="col-span-full py-60 text-center rounded-[6rem] border-2 border-dashed border-white/5 bg-zinc-950/20 backdrop-blur-3xl">
                            <motion.div
                                animate={{
                                    rotate: [0, 90, 180, 270, 360],
                                    scale: [1, 1.1, 1]
                                }}
                                transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                                className={cn("mb-12 inline-block p-12 rounded-[3rem] border-2 shadow-[0_0_100px_-20px]", style.blob, "border-white/10", style.blob.replace('bg-', 'shadow-'))}
                            >
                                <Newspaper className="h-20 w-20 text-white" />
                            </motion.div>
                            <h3 className="text-5xl font-black font-outfit mb-6 tracking-tighter">Initializing Pulse...</h3>
                            <p className="text-white/30 text-xl max-w-xl mx-auto font-medium">Synchronizing with high-priority national archives for your {category} briefing.</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
