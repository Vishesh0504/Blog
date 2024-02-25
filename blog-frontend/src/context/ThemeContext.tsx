import { createContext, useState, ReactNode,useEffect} from "react";
interface props {
  children?: ReactNode;
}

interface themeContextType {
  theme: string;
  setTheme: (theme: string) => void;
  bool:boolean;
}
export const ThemeContext = createContext<themeContextType>({
  theme: "dark",
  setTheme: () => {},
  bool: false
});

export const ThemeProvider = ({ children }: props) => {
  const [theme, setTheme] = useState("dark");
  const bool = theme ==='light';
  const colorTheme = theme === 'dark' ? 'light' : 'dark';
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(colorTheme);
    root.classList.add(theme);

    // save theme to local storage
    localStorage.setItem('theme', theme);
  }, [theme,colorTheme]);

  return (
    <>
      <ThemeContext.Provider value={{ theme, setTheme,bool}}>
        {children}
      </ThemeContext.Provider>
    </>
  );
};
