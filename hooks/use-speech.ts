"use client"

import { useState, useCallback, useEffect } from "react"

export function useSpeech() {
    const [isPlaying, setIsPlaying] = useState(false)
    const [isPaused, setIsPaused] = useState(false)

    useEffect(() => {
        if (typeof window !== "undefined") {
            const synth = window.speechSynthesis
            return () => {
                synth.cancel()
            }
        }
    }, [])

    const speak = useCallback((text: string, langHint: string = "en-IN") => {
        if (typeof window === "undefined" || !window.speechSynthesis) return

        window.speechSynthesis.cancel()

        const newUtterance = new SpeechSynthesisUtterance(text)

        // Map common language names to BCP 47 tags
        const langMap: Record<string, string> = {
            "English": "en-IN",
            "Hindi": "hi-IN",
            "Telugu": "te-IN",
            "Malayalam": "ml-IN",
            "Punjabi": "pa-IN"
        }

        const targetLang = langMap[langHint] || langHint

        // Robust voice selection
        const loadVoices = () => {
            const voices = window.speechSynthesis.getVoices()

            // Prioritize the exact language/region match, then premium voices
            const premiumVoice = voices.find(v => v.lang === targetLang) ||
                voices.find(v => v.lang.startsWith(targetLang.split('-')[0])) ||
                voices.find(v => v.name.includes("Google") || v.name.includes("Natural")) ||
                voices[0]

            if (premiumVoice) {
                newUtterance.voice = premiumVoice
                newUtterance.lang = premiumVoice.lang
            }
        }

        if (window.speechSynthesis.getVoices().length === 0) {
            window.speechSynthesis.onvoiceschanged = loadVoices
        } else {
            loadVoices()
        }

        newUtterance.rate = 0.85 // Slightly slower for even better clarity in regional languages
        newUtterance.pitch = 1

        newUtterance.onstart = () => {
            setIsPlaying(true)
            setIsPaused(false)
        }

        newUtterance.onend = () => {
            setIsPlaying(false)
            setIsPaused(false)
        }

        newUtterance.onerror = () => {
            setIsPlaying(false)
            setIsPaused(false)
        }


        window.speechSynthesis.speak(newUtterance)
    }, [])

    const pause = useCallback(() => {
        if (window.speechSynthesis) {
            window.speechSynthesis.pause()
            setIsPaused(true)
        }
    }, [])

    const resume = useCallback(() => {
        if (window.speechSynthesis) {
            window.speechSynthesis.resume()
            setIsPaused(false)
        }
    }, [])

    const stop = useCallback(() => {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel()
            setIsPlaying(false)
            setIsPaused(false)
        }
    }, [])

    return {
        speak,
        pause,
        resume,
        stop,
        isPlaying,
        isPaused
    }
}
