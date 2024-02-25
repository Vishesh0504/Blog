import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ThemeProvider, ThemeContext } from "../context/ThemeContext";
import { useContext } from "react";
import Navbar from "../components/Navbar";

const RootComponent = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <div
      className={`${theme === "light" ? "bg-bg-light" : "bg-bg-dark"} min-h-screen  `}
    >
      <Navbar />
      <hr
        className={`border-1 ${theme === "light" ? "border-gray-300" : "border-gray-700"}`}
      ></hr>
      <Outlet />
      <TanStackRouterDevtools />
    </div>
  );
};
export const Route = createRootRoute({
  component: () => (
    <ThemeProvider>
      <RootComponent />
    </ThemeProvider>
  ),
});