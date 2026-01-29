"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useRouter, usePathname } from "next/navigation"
import { Moon, Sun, Newspaper, Search, Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export function Header() {
    const [mounted, setMounted] = useState(false)
    const [searchValue, setSearchValue] = useState("")
    const { theme, setTheme } = useTheme()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleSearch = (val: string) => {
        setSearchValue(val)
        if (pathname !== "/") {
            router.push(`/?search=${encodeURIComponent(val)}`)
        } else {
            window.dispatchEvent(new CustomEvent('search-news', { detail: val }));
        }
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 glass">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2">
                        <motion.div
                            whileHover={{ rotate: 10 }}
                            className="bg-primary p-1.5 rounded-lg"
                        >
                            <Newspaper className="h-6 w-6 text-primary-foreground" />
                        </motion.div>
                        <span className="font-outfit text-xl font-bold tracking-tight">
                            News<span className="text-primary/60">ify</span>
                        </span>
                    </Link>
                </div>

                <nav className="hidden md:flex items-center gap-8">
                    <Link
                        href="/"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Newspapers
                    </Link>
                    <Link
                        href="/current-affairs"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Current Affairs
                    </Link>
                    <Link
                        href="/live-tv"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Live TV
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    {mounted && (
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="p-2 rounded-full hover:bg-muted transition-colors"
                        >
                            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </motion.button>
                    )}

                    <button className="md:hidden p-2">
                        <Menu className="h-6 w-6" />
                    </button>
                </div>
            </div>
        </header>
    )
}
