"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

const ThemeChanger = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    return (
        <div
            onClick={toggleTheme}
            className="p-2 pointer background  "
            aria-label="Toggle theme"
        >
            {theme === "dark" ? (
                <LightModeIcon className="text-black" />
            ) : (
                <DarkModeIcon className="text-black" />
            )}
        </div>
    );
};

export default ThemeChanger;
