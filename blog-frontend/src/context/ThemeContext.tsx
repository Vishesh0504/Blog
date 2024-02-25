import { createContext, useState, ReactNode } from "react";
interface props {
  children?: ReactNode;
}

interface themeContextType {
  theme: string;
  setTheme: (theme: string) => void;
}
export const ThemeContext = createContext<themeContextType>({
  theme: "dark",
  setTheme: () => {},
});

export const ThemeProvider = ({ children }: props) => {
  const [theme, setTheme] = useState("dark");
  return (
    <>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        {children}
      </ThemeContext.Provider>
    </>
  );
};
