"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Newspaper as NewspaperIcon, Languages, MapPin } from "lucide-react"
import { Newspaper } from "@/lib/data"
import Link from "next/link"

interface NewsCardProps {
    newspaper: Newspaper
}

export function NewsCard({ newspaper }: NewsCardProps) {
    return (
        <motion.div
            style={{ perspective: 1000 }}
            whileHover={{
                y: -10,
                rotateY: 10,
                rotateX: 5,
                scale: 1.05,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group relative overflow-hidden rounded-2xl border border-white/10 glass premium-gradient p-4 transition-all"
        >
            <Link href={`/read/${newspaper.id}`}>
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted flex items-center justify-center">
                    <Image
                        src={newspaper.thumbnail}
                        alt={newspaper.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                        onError={(e) => {
                            // Fallback to paper name if image fails
                            console.warn("Image failed to load:", newspaper.thumbnail);
                        }}
                    />
                    {/* Fallback Label if image fails to load or is loading */}
                    <div className="absolute inset-0 flex items-center justify-center -z-10 bg-primary/5">
                        <span className="font-outfit font-bold opacity-20 text-4xl text-center px-4">{newspaper.name}</span>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
                        <div className="flex items-center gap-2 text-white/90 text-sm font-medium">
                            <span className="px-2 py-0.5 rounded-full bg-primary/20 backdrop-blur-md border border-white/20">
                                {newspaper.category}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-4 space-y-2">
                    <h3 className="font-outfit text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                        {newspaper.name}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Languages className="h-3.5 w-3.5" />
                            <span>{newspaper.language}</span>
                        </div>
                        <div className="flex items-center gap-1 text-emerald-500/80 font-bold text-[10px] uppercase tracking-tighter">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Live Edition
                        </div>
                    </div>
                </div>

                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-primary p-2 rounded-full shadow-lg">
                        <NewspaperIcon className="h-4 w-4 text-primary-foreground" />
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}
