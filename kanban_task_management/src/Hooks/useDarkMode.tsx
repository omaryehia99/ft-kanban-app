import { useState, useEffect } from 'react';

function useDarkMode(): [string, React.Dispatch<React.SetStateAction<string>>] {
    const [theme, setTheme] = useState<string>(localStorage.theme);
    const colorTheme: string = theme === "light" ? "dark" : "light";

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(colorTheme);
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme, colorTheme]);

    return [colorTheme, setTheme];
}

export default useDarkMode;