"use client"

import { useState } from "react";
import { Header } from "@/components/Header";
import { motion, AnimatePresence } from "framer-motion";
import { Tv, Play, Info, Radio, Globe, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const channels = [
    {
        id: "aaj-tak",
        name: "Aaj Tak",
        lang: "Hindi",
        category: "Breaking",
        color: "bg-orange-500",
        playlistId: "UUt4t-jeY85JegMlZ-E5UWtA",
        youtubeUrl: "https://www.youtube.com/@aajtak/live"
    }
];

export default function LiveTVPage() {
    const [selectedChannel, setSelectedChannel] = useState(channels[0]);

    return (
        <main className="flex min-h-screen flex-col bg-background">
            <Header />

            <div className="container mx-auto px-4 pt-24 pb-12 flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="flex items-center justify-center gap-3 text-primary mb-4">
                        <Radio className="h-6 w-6 animate-pulse" />
                        <span className="text-sm font-bold uppercase tracking-[0.2em]">Live Broadcasting</span>
                    </div>
                    <h1 className="font-outfit text-5xl md:text-7xl font-black mb-4">News Central</h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">Stream live national and international news directly from official Indian channels in real-time.</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
                    {/* Video Player Section */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        <motion.div
                            key={selectedChannel.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="aspect-video w-full rounded-[2.5rem] overflow-hidden glass border border-white/10 shadow-2xl relative group"
                        >
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/videoseries?list=${selectedChannel.playlistId}&autoplay=1&mute=1`}
                                title={selectedChannel.name}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            ></iframe>

                            {/* Overlay info on hover */}
                            <div className="absolute top-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="px-4 py-2 rounded-full glass border border-white/20 flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Official Stream</span>
                                </div>
                            </div>

                            <a
                                href={selectedChannel.youtubeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95"
                            >
                                Open Official Channel ↗
                            </a>
                        </motion.div>

                        <div className="p-8 rounded-[2rem] glass border border-white/10 flex items-center justify-between">
                            <div>
                                <h2 className="text-3xl font-black font-outfit mb-1">{selectedChannel.name}</h2>
                                <p className="text-muted-foreground text-sm flex items-center gap-2">
                                    <Globe className="h-4 w-4" />
                                    Broadcast Language: {selectedChannel.lang} • Global Feed
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <Tv className="h-5 w-5" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Channel List */}
                    <div className="lg:col-span-4 flex flex-col gap-4">
                        <div className="flex items-center gap-2 px-2 mb-2">
                            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Select Station</span>
                        </div>
                        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                            {channels.map((channel) => (
                                <motion.button
                                    key={channel.id}
                                    onClick={() => setSelectedChannel(channel)}
                                    whileHover={{ x: 10 }}
                                    className={cn(
                                        "w-full p-4 rounded-2xl border transition-all flex items-center justify-between group",
                                        selectedChannel.id === channel.id
                                            ? "bg-primary/10 border-primary/30 text-primary"
                                            : "glass border-white/10 text-muted-foreground hover:border-white/20 hover:text-foreground"
                                    )}
                                >
                                    <div className="flex items-center gap-4 text-left">
                                        <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center text-white font-black text-xs", channel.color)}>
                                            {channel.name.substring(0, 2)}
                                        </div>
                                        <div>
                                            <div className="font-bold">{channel.name}</div>
                                            <div className="text-[10px] uppercase opacity-60 tracking-tighter">{channel.lang} • {channel.category}</div>
                                        </div>
                                    </div>
                                    {selectedChannel.id === channel.id ? (
                                        <Radio className="h-4 w-4 animate-pulse" />
                                    ) : (
                                        <Play className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0" />
                                    )}
                                </motion.button>
                            ))}
                        </div>

                        <div className="mt-4 p-6 rounded-2xl bg-primary/5 border border-dashed border-primary/20">
                            <div className="flex items-center gap-2 text-primary mb-2">
                                <Info className="h-4 w-4" />
                                <span className="text-xs font-bold uppercase">Streaming Tip</span>
                            </div>
                            <p className="text-[11px] leading-relaxed text-muted-foreground">
                                High resolution streams require stable bandwidth. If buffering occurs, adjust quality settings within the YouTube player interface.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
