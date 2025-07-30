import React, { useState, useEffect } from "react";
import { applyTheme } from "../../utils/theme";

function ThemeToggleButton() {
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        const stored = localStorage.getItem("theme") || "light";
        setTheme(stored);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        applyTheme(newTheme);
        setTheme(newTheme);
    };

    return (
        <button
            onClick={toggleTheme}
            className="ml-auto bg-blue-200 dark:bg-gray-700 p-2 rounded-full text-sm"
        >
            {theme === "dark" ? "☀️" : "🌙"}
        </button>
    );
}

export default ThemeToggleButton;
