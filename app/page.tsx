"use client"

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { NewsCard } from "@/components/NewsCard";
import { newspapers } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { PulseTicker } from "@/components/PulseTicker";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const categories = ["All", "National", "Regional"];

function HomeContent() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    // Initial search from URL
    const query = searchParams.get('search');
    if (query) setSearchQuery(query);

    const handleSearch = (e: any) => setSearchQuery(e.detail);
    window.addEventListener('search-news', handleSearch);
    return () => window.removeEventListener('search-news', handleSearch);
  }, [searchParams]);

  const filteredPapers = newspapers.filter(p => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.language.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });


  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <PulseTicker />

      <section className="relative min-h-[80vh] flex flex-col items-center justify-center px-4 pt-32 pb-20 text-center overflow-hidden bg-[#050505] text-white">
        {/* Advanced Background Decorative Elements */}
        <div className="absolute inset-0 -z-10">
          <motion.div
            animate={{
              x: [0, 50, -30, 0],
              y: [0, -30, 40, 0],
              scale: [1, 1.1, 0.9, 1]
            }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px] opacity-20"
          />
          <motion.div
            animate={{
              x: [0, -40, 60, 0],
              y: [0, 50, -20, 0],
              scale: [1, 0.8, 1.2, 1]
            }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear", delay: 2 }}
            className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[150px] opacity-10"
          />
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="container mx-auto relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8 backdrop-blur-3xl"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">Intelligence v2.0 Live</span>
          </motion.div>

          <motion.h1
            className="font-outfit text-7xl md:text-[10rem] font-black tracking-tighter mb-8 leading-[0.85] select-none"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            The Future <br />
            <span className="text-primary italic">of News.</span>
          </motion.h1>

          <motion.p
            className="max-w-[750px] mx-auto text-xl md:text-2xl text-white/50 mb-16 leading-relaxed font-medium tracking-tight px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
          >
            One universe. Every headline. Unified by Intelligence. <br className="hidden md:block" />
            Experience India's most powerful digital broadsheet engine.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap justify-center gap-6"
          >
            <Link href="#aggregation">
              <button className="px-12 py-5 rounded-[2rem] bg-white text-black font-black text-xs uppercase tracking-widest hover:scale-110 active:scale-95 transition-all shadow-2xl">
                Explore Archives
              </button>
            </Link>
            <Link href="/live-tv">
              <button className="px-12 py-5 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-3xl text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 active:scale-95 transition-all">
                Live Feed
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Newspapers Grid Section */}
      <section id="aggregation" className="container mx-auto px-4 py-20">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div className="text-left">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-outfit text-3xl font-bold tracking-tight">Daily Headlines</h2>
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Live Updates</span>
            </div>
            <p className="text-muted-foreground">Today's Edition: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>

          <div className="flex items-center gap-2 p-1 rounded-full bg-muted/50 border border-white/5 backdrop-blur-sm">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "hover:bg-primary/10 text-muted-foreground"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredPapers.map((paper) => (
              <NewsCard key={paper.id} newspaper={paper} />
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Features Preview */}
      <section className="bg-muted/30 py-24 border-y border-white/5">
        <div className="container mx-auto px-4 text-center">
          <span className="text-primary font-bold tracking-widest text-xs uppercase mb-4 block">Intelligence Suite</span>
          <h2 className="font-outfit text-4xl md:text-5xl font-bold tracking-tight mb-16">Beyond just reading.</h2>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            {[
              { title: "AI Summarization", desc: "Get the gist of any newspaper in seconds with multi-level AI summaries.", icon: "✨" },
              { title: "Audio Narration", desc: "Listen to your favorite columns with natural-sounding AI voices as you commute.", icon: "🎧" },
              { title: "Cross-Analysis", desc: "Compare how different papers cover the same topic to identify bias and facts.", icon: "⚖️" }
            ].map((f, i) => (
              <motion.div
                key={i}
                className="p-8 rounded-3xl glass border border-white/10 premium-gradient"
                whileHover={{ y: -5 }}
              >
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-outfit text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#050505]">
        <div className="animate-pulse text-primary font-black uppercase tracking-[0.4em]">Intelligence Initializing...</div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
