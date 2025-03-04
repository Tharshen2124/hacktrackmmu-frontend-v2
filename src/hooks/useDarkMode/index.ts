import { useEffect, useState } from "react";

/**
 * 1. useDarkMode hook should return a isDarkMode value along with 3 functions
 * - toggle
 * 2. to determine whether the system is in dark mode or not, we use the preferes-color-scheme
 * 3. but how do i update the state to make it not cause many re-renders...
 */

interface DarkModeReturnProps {
    isDarkMode: boolean
    toggle: () => void
}

export function useDarkMode():DarkModeReturnProps {
    const [isDarkMode, setDarkMode] = useState<boolean>(false);

    useEffect(() => {
        if(typeof window === "undefined") return
            
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

        setDarkMode(mediaQuery.matches)

        const handleChange = (e: MediaQueryListEvent) => setDarkMode(e.matches)

        mediaQuery.addEventListener("change", handleChange)

        return () => {
            mediaQuery.removeEventListener("change", handleChange);
        }

    }, [])

    const toggle = () => setDarkMode((prev) => !prev)
    
    return { isDarkMode, toggle }
}