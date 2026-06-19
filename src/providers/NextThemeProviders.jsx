"use client";
import { ThemeProvider } from "next-themes";
const NextThemeProviders = ({children}) => {
    return (
        <ThemeProvider attribute="class" defaultTheme="light">
      {children}
    </ThemeProvider>
    );
};

export default NextThemeProviders;