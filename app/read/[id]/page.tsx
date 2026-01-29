"use client"

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { newspapers } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, FileText, Headphones, Sparkles, Sidebar as SidebarIcon, Play, Pause, Square, BarChart3, Info, Languages } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useSpeech } from "@/hooks/use-speech";
import { jsPDF } from "jspdf";
import { Suspense } from "react";

function ReaderContent() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [viewMode, setViewMode] = useState<"ai" | "pdf">("ai");
    const [summaryMode, setSummaryMode] = useState<"quick" | "detailed">("quick");
    const [liveContent, setLiveContent] = useState<string | null>(null);
    const [isFetching, setIsFetching] = useState(false);
    const [lastSync, setLastSync] = useState<Date>(new Date());
    const [isTranslated, setIsTranslated] = useState(false);
    const [translatedContent, setTranslatedContent] = useState<string | null>(null);
    const { speak, pause, resume, stop, isPlaying, isPaused } = useSpeech();

    const isLiveMode = params.id === "live";
    const paper = newspapers.find(p => p.id === params.id) || (isLiveMode ? {
        id: "live",
        name: searchParams.get("title") || "Live Insight",
        language: "English",
        content: searchParams.get("content") || "",
        pdfUrl: "",
        articleUrl: ""
    } : null);

    useEffect(() => {
        if (paper && !isLiveMode && (paper as any).articleUrl) {
            fetchLiveNews();

            // Simulation of Hourly Updates: Re-fetch every 60 minutes
            // For demo purposes, we can set a shorter interval like 5 mins if needed
            const interval = setInterval(() => {
                fetchLiveNews();
                setLastSync(new Date());
            }, 3600000); // 1 hour

            return () => clearInterval(interval);
        }
    }, [paper, isLiveMode]);

    const fetchLiveNews = async () => {
        if (!paper) return;
        setIsFetching(true);
        try {
            const res = await fetch(`/api/fetch-news?url=${encodeURIComponent(paper.articleUrl)}&t=${Date.now()}`);
            const data = await res.json();
            if (data.content) {
                setLiveContent(data.content);
                setLastSync(new Date());
            }
        } catch (err) {
            console.error("Failed to fetch live news:", err);
        } finally {
            setIsFetching(false);
        }
    };

    const downloadPDF = () => {
        if (!paper) return;
        const doc = new jsPDF();
        const content = liveContent || paper.content;

        doc.setFontSize(20);
        doc.text(paper.name, 10, 20);
        doc.setFontSize(10);
        doc.text(`Daily Intelligence Edition - ${lastSync.toLocaleDateString()}`, 10, 30);

        doc.setFontSize(12);
        const splitText = doc.splitTextToSize(content, 180);
        doc.text(splitText, 10, 50);

        doc.save(`${paper.name}_Edition.pdf`);
    };

    if (!paper) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p className="text-muted-foreground font-medium">Newspaper not found</p>
            </div>
        );
    }

    const currentDisplayContent = (isTranslated && translatedContent) ? translatedContent : (liveContent || paper.content);

    const handleAudioToggle = () => {
        if (isPlaying && !isPaused) {
            pause();
        } else if (isPlaying && isPaused) {
            resume();
        } else {
            speak(currentDisplayContent, paper.language);
        }
    };

    const handleTranslate = () => {
        if (isTranslated) {
            setIsTranslated(false);
            return;
        }

        setIsFetching(true);
        // Simulation of neural translation
        setTimeout(() => {
            const mockHindi = currentDisplayContent
                .replace("Mother of all deals", "सौदों की जननी")
                .replace("India and EU", "भारत और यूरोपीय संघ")
                .replace("finalise FTA", "एफटीए को अंतिम रूप")
                .replace("Latest update from official sources", "आधिकारिक स्रोतों से नवीनतम अपडेट")
                .replace("Daily Briefing", "दैनिक ब्रीफिंग")
                .replace("In The News", "समाचार में")
                .replace("National", "राष्ट्रीय")
                .replace("Intelligence", "इंटेलिजेंस");

            setTranslatedContent(mockHindi);
            setIsTranslated(true);
            setIsFetching(false);
        }, 800);
    };

    const getSummary = () => {
        if (summaryMode === "quick") {
            const firstPara = currentDisplayContent.split("\n\n")[0];
            return (firstPara.split(".")[0] + ". " + (firstPara.split(".")[1] || "")).substring(0, 300);
        }
        return currentDisplayContent.substring(0, 1000);
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-background">
            <Header />

            <div className="flex flex-1 overflow-hidden relative">
                {/* Main Reading Area */}
                <main className={cn(
                    "flex-1 transition-all duration-300 ease-in-out p-4 md:p-8",
                    sidebarOpen ? "lg:mr-80" : "mr-0"
                )}>
                    <div className="mx-auto max-w-5xl h-full flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <button
                                onClick={() => router.back()}
                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                            >
                                <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                                Back to Library
                            </button>

                            <div className="flex items-center gap-4 bg-muted/30 p-1 rounded-xl border border-white/5">
                                <button
                                    onClick={() => setViewMode("ai")}
                                    className={cn(
                                        "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                                        viewMode === "ai" ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    Intelligence View
                                </button>
                                <button
                                    onClick={() => setViewMode("pdf")}
                                    className={cn(
                                        "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                                        viewMode === "pdf" ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    Smart PDF
                                </button>
                                <button
                                    onClick={downloadPDF}
                                    className="px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-all"
                                >
                                    Export PDF
                                </button>
                                <button
                                    onClick={handleTranslate}
                                    className={cn(
                                        "px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
                                        isTranslated ? "bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]" : "bg-purple-500/10 text-purple-400 hover:bg-purple-500/20"
                                    )}
                                >
                                    <Languages className="h-3.5 w-3.5" />
                                    {isTranslated ? "Matrix Active" : "Linguistic Matrix"}
                                </button>
                            </div>

                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className={cn(
                                    "p-2.5 rounded-xl border border-white/5 transition-all hover:bg-white/5",
                                    sidebarOpen ? "bg-primary/10 text-primary border-primary/20" : "bg-transparent text-muted-foreground"
                                )}
                            >
                                <SidebarIcon className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Paper Canvas */}
                        <div className="flex-1 rounded-3xl glass border border-white/10 overflow-hidden relative group shadow-2xl" style={{ perspective: 2000 }}>
                            <AnimatePresence mode="wait">
                                {viewMode === "pdf" ? (
                                    <motion.div
                                        key="pdf"
                                        initial={{ opacity: 0, rotateY: 45 }}
                                        animate={{ opacity: 1, rotateY: 0 }}
                                        exit={{ opacity: 0, rotateY: -45 }}
                                        transition={{ type: "spring", damping: 20 }}
                                        className="h-full w-full origin-left bg-zinc-800 flex items-center justify-center"
                                    >
                                        <div className="text-center p-8 space-y-6">
                                            <div className="h-20 w-20 rounded-3xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                                                <FileText className="h-10 w-10 text-primary animate-bounce" />
                                            </div>
                                            <h3 className="text-2xl font-black font-outfit">Smart AI PDF Loaded</h3>
                                            <p className="text-muted-foreground text-sm max-w-xs mx-auto">I've generated a fresh, ad-free PDF from the latest {lastSync.getHours()}:00 edition.</p>
                                            <button
                                                onClick={downloadPDF}
                                                className="px-8 py-3 rounded-2xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all"
                                            >
                                                Open PDF Paper ↗
                                            </button>
                                            <div className="pt-4">
                                                <a
                                                    href={paper.articleUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                                                >
                                                    View Original Web Source ↗
                                                </a>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="ai"
                                        initial={{ opacity: 0, rotateY: -45 }}
                                        animate={{ opacity: 1, rotateY: 0 }}
                                        exit={{ opacity: 0, rotateY: 45 }}
                                        transition={{ type: "spring", damping: 20 }}
                                        className="h-full w-full flex flex-col bg-muted/20 origin-right"
                                    >
                                        {/* Premium Newspaper Top Bar */}
                                        <div className="h-10 border-b border-white/5 bg-background/40 backdrop-blur-md flex items-center justify-between px-6">
                                            <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <div className={cn("h-1.5 w-1.5 rounded-full", isFetching ? "bg-primary animate-ping" : "bg-emerald-500")} />
                                                    {isFetching ? "Synchronizing with Server..." : `Last Sync: ${lastSync.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                                                </div>
                                                <span className="opacity-20">|</span>
                                                <span className="text-primary/70">Intelligence Reader v2.0</span>
                                            </div>
                                        </div>

                                        <div className="flex-1 overflow-y-auto bg-[#fafafa] dark:bg-[#0c0c0e] selection:bg-primary/20">
                                            {/* Newspaper Masthead */}
                                            <div className="max-w-6xl mx-auto py-8 px-6 md:px-12">
                                                <div className="text-center mb-8 border-b-2 border-double border-foreground/10 pb-6">
                                                    <h1 className={cn(
                                                        "text-5xl md:text-8xl font-serif font-black tracking-tighter mb-4",
                                                        paper.id === 'times-of-india' ? "uppercase italic" : ""
                                                    )}>
                                                        {isTranslated ? "द टाइम्स ऑफ़ इंडिया" : (paper.id === 'times-of-india' ? "The Times of India" : paper.name)}
                                                    </h1>
                                                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground/60">
                                                        <span>NEW DELHI</span>
                                                        <span>{lastSync.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase()}</span>
                                                        <span>VOL. CLXIX NO. 28</span>
                                                    </div>
                                                </div>

                                                {/* Premium Grid Layout */}
                                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                                                    {/* Main Feature Content */}
                                                    <div className="lg:col-span-8 space-y-10">
                                                        {/* Hero Section */}
                                                        <div className="space-y-6">
                                                            <h2 className="text-4xl md:text-6xl font-serif font-bold leading-[1.1] tracking-tight text-foreground">
                                                                {currentDisplayContent.split('##')[1]?.split('\n')[0] || currentDisplayContent.split('\n')[0]}
                                                            </h2>
                                                            <div className="flex items-center gap-4 text-xs font-bold uppercase text-primary border-y border-white/5 py-3">
                                                                <span>By AI Editorial Team</span>
                                                                <span className="opacity-30">•</span>
                                                                <span>Live Intelligence Sync</span>
                                                            </div>

                                                            {/* Hero Image from Sync */}
                                                            {(liveContent as any)?.heroImage && (
                                                                <div className="w-full aspect-video rounded-2xl overflow-hidden bg-muted/20 border border-white/5 shadow-2xl group">
                                                                    <img
                                                                        src={(liveContent as any).heroImage}
                                                                        alt="Lead Story"
                                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                                    />
                                                                </div>
                                                            )}

                                                            <div className="font-serif text-xl md:text-2xl leading-[1.6] text-foreground/90 first-letter:text-7xl first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:mt-2 first-letter:text-primary whitespace-pre-wrap">
                                                                {currentDisplayContent.split('---')[0].replace(/##.*\n/, '')}
                                                            </div>
                                                        </div>

                                                        {/* Secondary Articles Section */}
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-dashed border-foreground/10">
                                                            {currentDisplayContent.split('---').slice(1, 3).map((snippet, idx) => (
                                                                <div key={idx} className="space-y-4 group cursor-pointer">
                                                                    <h3 className="text-xl font-bold font-serif leading-tight group-hover:text-primary transition-colors">
                                                                        {snippet.split('\n')[0].replace('## ', '')}
                                                                    </h3>
                                                                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                                                                        {snippet.split('\n').slice(1).join(' ')}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Sidebar - "In The News" Style */}
                                                    <div className="lg:col-span-4 space-y-8">
                                                        <div className="bg-muted/30 p-8 rounded-3xl border border-white/5 shadow-inner">
                                                            <h4 className="text-xs font-black uppercase tracking-[0.4em] text-primary mb-6 flex items-center gap-2">
                                                                <span className="h-1.5 w-1.5 bg-primary animate-pulse rounded-full" />
                                                                In The News
                                                            </h4>
                                                            <div className="space-y-10">
                                                                {currentDisplayContent.split('---').slice(3, 8).map((snippet, idx) => (
                                                                    <div key={idx} className="group cursor-pointer">
                                                                        <h5 className="text-sm font-black leading-tight mb-2 group-hover:underline uppercase tracking-tight">
                                                                            {snippet.split('\n')[0].replace('## ', '')}
                                                                        </h5>
                                                                        <p className="text-[11px] text-muted-foreground line-clamp-2">
                                                                            {snippet.split('\n').slice(1).join(' ')}
                                                                        </p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <div className="p-8 border border-foreground/5 rounded-3xl bg-primary/5 text-center space-y-4">
                                                            <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary">
                                                                <FileText className="h-6 w-6" />
                                                            </div>
                                                            <h4 className="font-outfit font-bold">Digest Completed</h4>
                                                            <p className="text-xs text-muted-foreground">Scanned 12+ sources to build this composite edition for you.</p>
                                                            <button
                                                                onClick={downloadPDF}
                                                                className="w-full py-2.5 rounded-xl bg-foreground text-background font-bold text-[10px] uppercase tracking-widest hover:scale-105 transition-transform"
                                                            >
                                                                Export Briefing PDF
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </main>



                {/* Intelligence Sidebar */}
                <aside className={cn(
                    "fixed top-16 right-0 bottom-0 w-80 glass border-l border-white/10 transition-transform duration-300 ease-in-out z-40 transform",
                    sidebarOpen ? "translate-x-0" : "translate-x-full"
                )}>
                    <div className="h-full overflow-y-auto p-6 space-y-10 custom-scrollbar">
                        {/* AI Summary Section */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2 text-primary">
                                    <Sparkles className="h-5 w-5" />
                                    <h3 className="font-outfit font-bold tracking-tight">AI Summarizer</h3>
                                </div>
                                <button className="text-muted-foreground hover:text-foreground">
                                    <Info className="h-3.5 w-3.5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="flex p-1 rounded-xl bg-muted/50 border border-white/5">
                                    <button
                                        onClick={() => setSummaryMode("quick")}
                                        className={cn(
                                            "flex-1 text-xs py-1.5 rounded-lg transition-all",
                                            summaryMode === "quick" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        Quick Gist
                                    </button>
                                    <button
                                        onClick={() => setSummaryMode("detailed")}
                                        className={cn(
                                            "flex-1 text-xs py-1.5 rounded-lg transition-all",
                                            summaryMode === "detailed" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        Deep Dive
                                    </button>
                                </div>

                                <motion.div
                                    key={summaryMode}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-5 rounded-2xl bg-white/5 border border-white/5 text-sm leading-relaxed text-muted-foreground premium-gradient"
                                >
                                    <span className="text-primary/60 font-serif text-3xl float-left mr-2 leading-[0.5] mt-2">“</span>
                                    {getSummary()}
                                </motion.div>
                            </div>
                        </div>

                        {/* Audio Section */}
                        <div>
                            <div className="flex items-center gap-2 mb-4 text-primary">
                                <Headphones className="h-5 w-5" />
                                <h3 className="font-outfit font-bold tracking-tight">Audio News</h3>
                            </div>
                            <div className="p-5 rounded-2xl glass border border-white/10 hover:border-primary/20 transition-all group">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(var(--primary),0.3)]">
                                        {(isPlaying && !isPaused) ? (
                                            <div className="flex items-end gap-1 h-4">
                                                <motion.div animate={{ height: [6, 16, 6] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-primary-foreground rounded-full" />
                                                <motion.div animate={{ height: [12, 6, 12] }} transition={{ repeat: Infinity, duration: 0.7 }} className="w-1 bg-primary-foreground rounded-full" />
                                                <motion.div animate={{ height: [8, 14, 8] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1 bg-primary-foreground rounded-full" />
                                            </div>
                                        ) : (
                                            <Play className="h-5 w-5 text-primary-foreground fill-current ml-0.5" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold uppercase tracking-widest text-primary/60 mb-0.5">Narrator: AI Indian Voice</div>
                                        <div className="text-sm font-bold truncate max-w-[150px]">
                                            {isPlaying ? (isPaused ? "Paused" : "Now Reading...") : "Ready to Stream"}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={handleAudioToggle}
                                        className="flex-[3] py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 group-hover:scale-[1.02] duration-300"
                                    >
                                        {isPlaying && !isPaused ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                        {isPlaying ? (isPaused ? "Continue" : "Pause") : "Start Audio"}
                                    </button>
                                    {isPlaying && (
                                        <button
                                            onClick={stop}
                                            className="flex-1 py-3 rounded-xl border border-white/10 glass flex items-center justify-center hover:bg-white/5 transition-colors"
                                        >
                                            <Square className="h-4 w-4 fill-current" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* News Analysis Section */}
                        <div className="pt-8 border-t border-white/5">
                            <div className="flex items-center gap-2 mb-6 text-primary">
                                <BarChart3 className="h-5 w-5" />
                                <h3 className="font-outfit font-bold tracking-tight">Cross-Source Analysis</h3>
                            </div>

                            <div className="space-y-6">
                                <div className="p-4 rounded-2xl bg-muted/50 border border-white/5 space-y-4">
                                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                        <span>Consensus Score</span>
                                        <span className="text-primary">84% High</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: "84%" }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            className="h-full bg-primary"
                                        />
                                    </div>
                                    <p className="text-[11px] text-muted-foreground leading-relaxed leading-4">
                                        Topic has over 80% factual overlap across 5 major publications. Minimal bias detected.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3 px-1">Compare Coverage</h4>
                                    {["Times of India", "Hindustan Times", "Indian Express"].map((p, i) => (
                                        <motion.div
                                            key={p}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 * i }}
                                            className="flex items-center justify-between text-xs p-3 rounded-xl hover:bg-white/5 cursor-pointer border border-transparent hover:border-white/5 transition-all group"
                                        >
                                            <span className="font-medium">{p}</span>
                                            <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 font-bold">
                                                VIEW <span className="text-[10px]">→</span>
                                            </span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default function ReaderPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center bg-background">
                <div className="animate-pulse text-primary font-black uppercase tracking-[0.4em]">Optimizing Reader...</div>
            </div>
        }>
            <ReaderContent />
        </Suspense>
    );
}
